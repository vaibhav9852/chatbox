import React, { useEffect, useState } from "react";
 import  {jwtDecode} from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Rootstate } from "src/redux/store";
import { logout } from "src/redux/features/authentication/authSlice";

const TokenManager: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authToken = useSelector((state: Rootstate) => state.auth.token); 
  const [isChecking, setIsChecking] = useState(true); 
  const isTokenExpired = (token: string): boolean => {
    try {
      const { exp } =  jwtDecode<{ exp: number }>(token);
      return Date.now() >= exp * 1000; // Convert expiration time to milliseconds
    } catch {
      return true; 
    }
  };

  useEffect(() => {
    if (!authToken) {
        setIsChecking(false);
        return;
      }
      
    if (!authToken || isTokenExpired(authToken)) {
      dispatch(logout());
      navigate("/login");
    }else{
        setIsChecking(false);
    }
  }, [authToken, dispatch, navigate]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return null; 
};

export default TokenManager;
