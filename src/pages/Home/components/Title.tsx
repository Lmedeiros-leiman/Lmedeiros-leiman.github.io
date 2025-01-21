


export const Title : React.FC<{ children : React.ReactNode}> = ({children}) => {

    

    return (<>
    <h2 className="text-3xl w-full text-center md:text-5xl lg:text-6xl font-extrabold text-gray-800 dark:text-gray-300 mb-12">
        {children}
    </h2>
    </>)

   
}
export default Title;