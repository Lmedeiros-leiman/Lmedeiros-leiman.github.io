---
title: 'De 1 GB para 80 MB e de 23 s para 2 s: otimizando o conversor de SPED'
description: 'O conversor de SPED da empresa carregava a planilha inteira na memória. Troquei isso por leitura e escrita em fluxo, linha a linha, sem NPOI, e as conversões ficaram mais leves e mais rápidas.'
pubDate: 'Nov 03 2026'
---

## A ferramenta

No trabalho a gente tem uma API pequena que converte arquivos SPED.

O SPED é o sistema que as empresas no Brasil usam para mandar escrituração
fiscal e contábil para a Receita. Os arquivos são texto puro: cada linha é um
registro, os campos são separados por `|`, e o primeiro campo diz o tipo do
registro (`0000`, `C100`, `J800` e assim por diante). Os layouts suportados são
EFD ICMS/IPI, EFD Contribuições e ECD.

Editar esse texto na mão é ruim, então a ferramenta faz a conversão nos dois
sentidos:

- TXT para Excel: cada tipo de registro vira uma aba, com os nomes dos campos no
  cabeçalho. Uma aba escondida, `Schema`, guarda a ordem original das linhas:
  cada célula dela é uma fórmula apontando para a linha correspondente em outra
  aba, tipo `='0000'!B2`. O conteúdo RTF do registro `J800` fica numa aba
  separada, `rich_text`.
- Excel para TXT: a pessoa edita a planilha no Excel, manda de volta, e a
  ferramenta remonta o TXT na ordem da aba `Schema`.

É uma API em ASP.NET Core (.NET 10). Ela tem um endpoint para cada sentido e um
que detecta o tipo pela extensão do arquivo.

## O problema

Funcionava, mas gastava muita memória. As duas conversões usavam o NPOI para ler
e gravar as planilhas, e o NPOI monta o workbook inteiro na memória antes de
qualquer coisa: cada aba, cada linha, cada célula vira um objeto.

Para ler, ainda tinha um agravante. Para descobrir o valor de cada célula da
`Schema`, a conversão calculava todas as fórmulas, e calcular fórmula exige o
workbook inteiro carregado.

No maior arquivo de teste, uma ECD com `J800`, o pico foi de 1.087 MB para gerar
o TXT e de 687 MB para gerar a planilha. E demorava: de 6 a 23 segundos por
conversão nos arquivos maiores. Eu queria reduzir isso sem mudar uma vírgula do
resultado.

## A ideia

Um `.xlsx` é um zip de arquivos XML: um por aba, um com a lista de abas, um de
estilos, um de textos compartilhados. O .NET já sabe abrir zip (`ZipArchive`) e
ler XML em fluxo (`XmlReader`), sem carregar tudo. Então dava para tirar o NPOI
do caminho.

O ponto que destravou foi descobrir que o Excel, ao salvar, grava o resultado de
cada fórmula ao lado dela (o elemento `<v>` da célula). Ou seja, o valor de cada
célula da `Schema` já está no arquivo. Não preciso calcular nada, nem abrir as
outras abas: basta ler a `Schema` de cima para baixo e escrever cada linha do
TXT assim que ela é lida.

O porém é que só o Excel grava esses valores. Uma planilha que saiu da
ferramenta e nunca foi aberta no Excel tem as fórmulas sem resultado. Decidi
tratar isso como erro: a conversão para e pede para abrir a planilha no Excel,
salvar e mandar de novo. O mesmo vale quando o arquivo está marcado para
recalcular ao abrir (`fullCalcOnLoad`) ou em cálculo manual sem recalcular ao
salvar, porque nesses casos os valores salvos podem estar desatualizados.

## O que foi feito

Excel para TXT (`XlsxSheetReader`):

- Lê o `.xlsx` com `ZipArchive` + `XmlReader` e percorre só a aba `Schema`,
  usando os valores que o Excel deixou em cache.
- A tabela de textos compartilhados só é carregada se alguma célula lida
  precisar dela (na prática, a aba `rich_text` do `J800`).
- Usa buffers reaproveitados para ler o texto das células. A primeira versão
  alocava 8 KB por célula e somava uns 2,5 GB de alocação ao longo da
  conversão.
- O TXT é escrito direto num arquivo temporário, não numa string na memória.

TXT para Excel (`XlsxWorkbookWriter`):

- O TXT mistura os tipos de registro linha a linha, mas dentro do zip cada aba
  precisa ser gravada inteira de uma vez. Então cada aba ganha o próprio arquivo
  temporário em disco, e cada linha lida vai para o fim do arquivo da sua aba.
- No final, o zip é montado copiando esses arquivos um depois do outro. Os
  temporários se apagam sozinhos ao fechar (`FileOptions.DeleteOnClose`).
- Comecei com a compressão mais rápida, mas o arquivo ficava cerca de 1,8 vez
  maior. Voltei para a compressão padrão.
- A planilha final também vai para um temporário em vez de um `byte[]`.

Na API:

- As duas conversões gravam a saída num temporário, e o download é feito a
  partir dele.
- Se o cliente desconecta no meio, a conversão para (`RequestAborted`) e não
  deixa arquivo para trás.

O NPOI saiu do projeto principal e ficou só no projeto de testes, onde simula o
"abrir e salvar no Excel".

## Benchmark

O ganho não foi só de memória. As conversões também ficaram bem mais rápidas.

Os números abaixo são de uma execução por arquivo, num processo isolado e na
mesma máquina, antes e depois. Servem como ordem de grandeza, não como
benchmark rigoroso.

Pico de memória (working set):

| Arquivo | Excel → TXT | TXT → Excel |
| --- | --- | --- |
| ECD (diário, com `J800`) | 1.087 → 81 MB | 687 → 78 MB |
| Inventário | 776 → 66 MB | 528 → 68 MB |
| EFD Contribuições | 802 → 62 MB | 401 → 66 MB |
| Arquivo pequeno | 225 → 56 MB | 137 → 58 MB |

Tempo de execução:

| Arquivo | Excel → TXT | TXT → Excel |
| --- | --- | --- |
| ECD (diário, com `J800`) | 23,4 → 1,8 s | 9,1 → 1,8 s |
| Inventário | 19,6 → 1,3 s | 6,6 → 1,3 s |
| EFD Contribuições | 18,4 → 2,4 s | 6,3 → 1,0 s |
| Arquivo pequeno | 3,0 → 0,26 s | 2,2 → 0,93 s |

Memória alocada ao longo da conversão (o total de tudo que foi criado, mesmo o
que já foi liberado):

| Arquivo | Excel → TXT | TXT → Excel |
| --- | --- | --- |
| ECD (diário, com `J800`) | 3.967 → 144 MB | 2.482 → 211 MB |
| Inventário | 2.863 → 83 MB | 1.838 → 198 MB |
| EFD Contribuições | 2.195 → 70 MB | 1.358 → 113 MB |

Resumindo: o Excel → TXT ficou de 8 a 15 vezes mais rápido e o TXT → Excel de 3
a 5 vezes. As duas causas são as mesmas da memória. O NPOI criava milhões de
objetos, um por célula, e o Excel → TXT ainda calculava todas as fórmulas do
workbook para ler uma aba só.

Rodando a API de verdade (`dotnet run`) e mandando as conversões por HTTP, o pico
do processo do servidor ficou em torno de 118 MB.

## O preço: arquivo um pouco maior

O `.xlsx` gerado ficou de 1% a 10% maior. Na EFD Contribuições, foi de 3.073
para 3.382 KB. Isso foi uma escolha deliberada, e é ela que mantém o consumo
de memória baixo no TXT → Excel.

O formato do Excel tem dois jeitos de guardar texto numa célula:

- Tabela de textos compartilhados (o que o NPOI fazia): todo texto vai para um
  arquivo central, o `sharedStrings.xml`, e a célula guarda só a posição dele
  nessa tabela, tipo `<c r="A2" t="s"><v>14</v></c>`. Na EFD Contribuições
  eram 370.452 textos usados e só 22.050 diferentes. Um valor que se repete
  muito, como `0000`, uma data ou um CFOP, é gravado uma vez só.
- Texto na própria célula (o que a versão nova faz): o valor vai direto dentro
  da célula, tipo `<c r="A2" t="inlineStr"><is><t>0000</t></is></c>`. Um valor
  que aparece mil vezes é gravado mil vezes.

A tabela compartilhada gera um arquivo menor, mas para montá-la é preciso
guardar na memória todos os textos diferentes do arquivo até o fim da
conversão, para saber se cada texto novo já apareceu antes. Quanto maior e mais
variado o SPED, maior fica essa tabela. Ou seja, a memória volta a crescer junto
com o arquivo, que é exatamente o que eu estava tentando eliminar.

Com o texto na célula, a escrita não guarda estado nenhum: cada linha é escrita
no disco e esquecida. É isso que mantém o pico perto de 80 MB qualquer que seja
o tamanho do arquivo. E como o `.xlsx` é um zip, a compressão absorve boa parte
da repetição, então a diferença final fica entre 1% e 10%. Trocar alguns
kilobytes de disco por centenas de megabytes de RAM vale a pena.

A tabela compartilhada continua existindo, com uma entrada só: o texto vazio.
Ele é gravado assim porque era como o NPOI fazia, e o Excel preserva essas
células como `""` ao salvar.

## Como provei que nada mudou

O resultado vai para a Receita, então "parece certo" não bastava.

- TXT: o arquivo gerado pela versão nova é idêntico byte a byte ao da versão com
  NPOI em todos os arquivos de teste.
- Planilha: comparei a versão nova com a antiga célula a célula, cerca de 3,1
  milhões de células. Comparei nomes, ordem e visibilidade das abas, aba ativa,
  e tipo, valor, fórmula e formato de cada célula. Bateu tudo.
- Os `.xlsx` gerados passam sem erros no validador do Open XML SDK, da Microsoft.
- 16 testes automatizados, cobrindo os casos novos abaixo.
- 46 verificações por HTTP com o servidor rodando, nos dois sentidos e nos casos
  de erro. Isso inclui cancelar no meio da conversão: nenhum temporário ficou
  para trás.
- Três rodadas de revisão de código com IA (Claude e Codex), procurando casos de
  borda. Os achados foram corrigidos.

## Casos de borda que apareceram

- O NPOI grava fórmula sem resultado como `<v/>` vazio, não sem `<v>`. A
  detecção de "nunca aberta no Excel" precisou cobrir os dois casos.
- Caracteres de controle e caracteres especiais de XML no texto precisam ser
  escapados no formato do Excel (`_x000D_` e afins), senão o arquivo fica
  inválido.
- O texto vazio é gravado como uma entrada da tabela de textos compartilhados,
  igual ao NPOI fazia, porque o Excel preserva isso como `""` ao salvar.
- Uma célula da aba `rich_text` digitada como número sumiria do RTF sem aviso.
  Agora dá erro dizendo qual célula.
- Um tipo de registro que não pode ser nome de aba no Excel, ou que colide com
  `Schema`/`rich_text`, agora dá erro em vez de exceção.
- Os limites do Excel (1.048.576 linhas, 16.384 colunas, 32.767 caracteres por
  célula) agora dão mensagem clara.
- Arquivo que não é zip, Strict OOXML ou planilha corrompida também dão mensagem
  clara, em vez de erro 500.
- Uma data apagada no Excel deixou de virar `00000000`.

## O que mudou para quem usa

- Só `.xlsx` é aceito. `.xls` e `.xlsm` são recusados.
- Planilha que não foi salva no Excel gera o erro "Abra e salve a planilha no
  Excel antes de converter".
- A API não depende mais de pacotes com vulnerabilidade conhecida, que vinham
  junto com o NPOI.

## O que ficou pendente

- Abrir no Excel de verdade uma planilha gerada pela versão nova, salvar e
  converter de volta. Não havia Excel na máquina dos testes.
- A troca de `|0|` por `||` no TXT não pega ocorrências seguidas: `|0|0|` vira
  `||0|`. Mantive o comportamento original, porque zerar tudo apagaria campos
  obrigatórios. Isso ainda precisa ser decidido.
