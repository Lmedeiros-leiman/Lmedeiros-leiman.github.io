import { render, useEffect, useState } from "preact/compat";
import { WebFetcher } from "../../libs/WebFetcher";

const blog = import.meta.glob("../../docs/Blog/Posts/**/*.md", { query: '?raw', import: 'default' })

export const EntryComponent = () => {

  const [data, setData] = useState<any>(undefined);

  useEffect( () => {
    const data = Object.keys(blog).map(async (file) => {
      const fileData = await blog[file]();

      console.log(fileData)

      const newData = {
        path: file,
        url: blog[file],
        name: file.split("/").pop(),
        fileData : fileData,
      }

      setData((prevData : any) => {return {
        ...prevData,
        newData
      }})
      
    });



    

  }, [])


  return  (<>
  { JSON.stringify(data) }
  </>)
}


render(<EntryComponent />,document.getElementById("app")!,);