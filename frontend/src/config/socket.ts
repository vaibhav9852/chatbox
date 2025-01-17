import io from "socket.io-client";
 const URL =  "https://chatbox-ul83.onrender.com"
const socket = io(`${URL}`);  
export default socket; 


