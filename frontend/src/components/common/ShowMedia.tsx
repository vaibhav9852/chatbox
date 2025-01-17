import { ShowMediaProps } from "@/src/types"

const ShowMedia : React.FC<ShowMediaProps> = ({item}) =>{
 
    if(item.type === 'jpg' || item.type === 'png'){
      return (
        <div className="w-32  h-32 my-4 rounded-md"> 
        <img src={item.fileUrl} alt="Item" />    
        </div>
      )
    }  else if(item.type === 'webm'){
        return(
            <div className="mt-2">
             {item.fileUrl && ( 
          <audio controls>
            <source src={item.fileUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        )}
            </div>
        )
    } else if(item.type === 'mp4'){
        return(
            <>
            <p className="mt-2">video file</p> 
            </>
        )
    }else{
        return null  
    }

}

export default ShowMedia