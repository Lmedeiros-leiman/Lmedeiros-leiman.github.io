import LocalePicker from "./LocalePicker";

export const Navbar = () => {

    return (
    <header className="w-full flex items-center justify-between bg-black shadow mb-12 text-white font-bold px-6 py-3 ">
         
        <ul className="flex items-center ">
            <a className="rounded-lg hover:bg-slate-900 border border-black hover:border-slate-600 p-1 px-2" href={"/blog/"}>Blog</a>
        </ul>
        
        <LocalePicker />
        
    </header>)
}

export default Navbar;