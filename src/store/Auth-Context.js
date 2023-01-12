import React, { useCallback } from "react";
import { useState, useEffect } from "react";
let logoutTimer;
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime()
  console.log(adjExpirationTime)
  const remainingDuration = adjExpirationTime - currentTime;
 console.log(expirationTime)
  return remainingDuration;
}

const retrieveStoreToken = () => {
  const storeToken = localStorage.getItem("token")
  const StoredExpirationDate = localStorage.getItem("expirationTime")

  const remainingTime = calculateRemainingTime(StoredExpirationDate)

  if(remainingTime <= 60000){
    localStorage.removeItem("token")
    localStorage.removeItem("expirationTime")
    return null
  }

  return{
    token: storeToken,
    Duration: remainingTime
  }

}

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoreToken()
  let initialToken;
  if(tokenData){
     initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  const userIsLogedIn = !!token;



  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token")
    localStorage.removeItem("expirationTime")
    if(logoutTimer){
      clearTimeout(logoutTimer)
    }
  },[]);



  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token)
    localStorage.setItem("expirationTime", expirationTime)
    const remainingTime = calculateRemainingTime(expirationTime)

   logoutTimer =  setTimeout(logoutHandler, remainingTime)
  };
  
  useEffect(() => {
 if(tokenData){
 console.log(tokenData.Duration)
 logoutTimer = setTimeout(logoutHandler, tokenData.Duration)
 }
  },[tokenData, logoutHandler])
   
  const contextValue = {
    token: token,
    isLoggedIn: userIsLogedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
