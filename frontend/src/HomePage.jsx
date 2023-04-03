import React from "react";
import useAuth from "./useAuth";

function login() {
  const accessToken = localStorage.getItem('accessToken');
  console.log(accessToken);
  if (accessToken == null) {
    //check for code
    const code = new URLSearchParams(window.location.search).get("code");
    if (code == null) {
      //reroute to login page
      window.location.href = "/login";
    } else {
      //use code to get access token
      useAuth(code);
    }
  }
}


function HomePage() {
  login();
  
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}

export default HomePage;