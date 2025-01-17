import React from "react"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Rootstate } from "src/redux/store"
import { ProtectedRouteProps } from "src/types"
const ProtectedRoute:React.FC<ProtectedRouteProps> = ({element}) =>{

    const isAuthenticated = useSelector((state:Rootstate) => state.auth.isAuthenticated)
  return isAuthenticated ? element : <Navigate to="/login" /> ;
}
export default ProtectedRoute 