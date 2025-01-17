import { WebFetcher } from "../../libs/WebFetcher";


export const Navbar = () => {

    WebFetcher("google.com").then(response => {
        console.log(response)
    })

    return (
    <aside className="bg-black text-white font-bold px-6  py-2 rounded-lg">
        <span className="select-none hover:cursor-pointer transition-all hover:bg-slate-900 hover:ring-2 rounded-lg ring:ring-white p-1 px-4">
            🇧🇷 Pt-BR
        </span>
    </aside>)
}

export default Navbar;