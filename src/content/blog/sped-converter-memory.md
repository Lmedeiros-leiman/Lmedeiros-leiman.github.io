---
title: 'De 1 GB para 80 MB: otimizando o conversor de SPED'
description: 'O conversor de SPED da empresa carregava a planilha inteira na memória. Troquei isso por leitura e escrita em fluxo, linha a linha, sem NPOI.'
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
o TXT e de 687 MB para gerar a planilha. Eu queria reduzir isso sem mudar uma
vírgula do resultado.

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

Pico de memória (working set) por arquivo de teste:

| Arquivo | Excel → TXT | TXT → Excel |
| --- | --- | --- |
| ECD (diário, com `J800`) | 1.087 → 81 MB | 687 → 78 MB |
| Inventário | 776 → 66 MB | 528 → 68 MB |
| EFD Contribuições | 802 → 62 MB | 401 → 66 MB |

No maior arquivo, o Excel → TXT também caiu de 23,4 s para 1,5 s, porque não
monta nem calcula mais o workbook inteiro.

Rodando a API de verdade (`dotnet run`) e mandando as conversões por HTTP, o pico
do processo do servidor ficou em torno de 118 MB.

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
