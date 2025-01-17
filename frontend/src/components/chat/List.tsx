import React, { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGroups, getUsers } from "src/services/groupService";
import { ListProps  } from "src/types";  
import Loading from "../common/Loading";  
import Error from "../common/Error";   
import { useDispatch } from "react-redux";  
import { handleUserAndGroupList } from "src/redux/features/chat/chatSlice";
import { useSelector } from "react-redux";  
import { Rootstate } from "src/redux/store";  

const List: React.FC<ListProps> = ({ onSelect }) => { 
  let userAndGroupList = useSelector((state:Rootstate) => state.chat.userAndGroupList)
  let selectedIdDelete = useSelector((state:Rootstate) => state.chat.deleteGroupId)
  let selectedIdExit =   useSelector((state:Rootstate) => state.chat.exitGroupId)  
  let token = useSelector((state:Rootstate) => state.auth.token) 
  // const [lists,setLists] = useState<object[]>([])       
  const { data: users, status: userStatus } = useQuery({ queryKey: ["users", token], queryFn: () => getUsers() });
  const { data: groups, status: groupStatus } = useQuery({ queryKey: ["groups",selectedIdDelete,selectedIdExit], queryFn: getGroups });
  
  const dispatch = useDispatch()     
  //  let combinedList = [ 
  //   ...(groups?.data?.data || []), 
  //   ...(users?.data?.data || []), 
  // ];  
  
  const combinedList = useMemo(() => {
    return [ 
      ...(groups?.data?.data || []), 
      ...(users?.data?.data || []), 
    ];      
  }, [users, groups]);
  
  useEffect(()=>{ 
    if(combinedList.length){
      dispatch(handleUserAndGroupList(combinedList)) 
   }
  },[users,groups , onSelect , dispatch ,combinedList ])      
     
  if (userStatus === "pending" || groupStatus === "pending") 
  return <Loading />;
  if (userStatus === "error") 
  return <Error message={"Error fetching users and groups"} /> 
   
  return ( 
    <ul className="space-y-2">
      { userAndGroupList.length >0 && userAndGroupList.map((item: any) => (   
        <li 
          key={item.id}
          onClick={() => onSelect(item)}     
          className="p-2 bg-gray-100 rounded-md hover:bg-gray-400 cursor-pointer flex items-center space-x-4"
        > 
          {item.avatar ? ( 
            <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full" />  
          ) : (
            <div className="w-8 h-8 flex items-center justify-center bg-gray-400 text-white rounded-full">
              {item.name.charAt(0).toUpperCase()}
            </div>  
          )}
          <span className="text-xs sm:text-lg">{item.name}</span> 
        
        </li> 
      ))}
    </ul> 
  );
};

export default List;  




