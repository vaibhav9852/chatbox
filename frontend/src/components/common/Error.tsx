
const Error = ({message ="in component" }) =>{

    return(
        <>
        <div className="flex justify-center text-red-500 ">
         <p>Something wrong {message}</p> 
        </div>
        </> 
    )
}
 
export default Error 