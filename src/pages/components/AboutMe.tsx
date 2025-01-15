
import fotoPessoal from "../../assets/MinhaFotoFundo.jpeg";

export const AboutMeHero = () => {


    return (<>
    
    <div className="container mx-auto px-4 flex  flex-col md:flex-row items-center gap-8">
      <section className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold dark:text-gray-100 text-gray-800 mb-4">
          Leonardo Medeiros Leiman
        </h1>
        <p className="text-2xl md:text-3xl dark:text-gray-400 text-gray-600 font-medium">
          Desenvolvedor Full-Stack
        </p>
      </section>

      <div className="flex-1 flex justify-center">
        <picture className="relative p-0 dark:ring-1 ring-2 dark:ring-slate-100 ring-black/25 rounded-lg shadow-lg">
          <img
            className="rounded-lg max-w-full h-auto"
            src={fotoPessoal}
            alt="Foto Pessoal"
            width="400"
            height="400"
          />
        </picture>
      </div>
    </div>
    
    </>);
}
export default AboutMeHero