
import { Rootstate } from "@/src/redux/store"
import { PublicRouteProps } from "@/src/types"
import React from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
const PublicRoute:React.FC<PublicRouteProps> = ({element,redirectPath="/chat"}) =>{
const isAuthenticated = useSelector((state:Rootstate) => state.auth.isAuthenticated )

    return  isAuthenticated ? <Navigate to={redirectPath} replace/> : element ;
   
}

export default PublicRoute