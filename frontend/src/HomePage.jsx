import React from "react";
import useAuth from "./useAuth";

/**
 * Checks if user is logged in, if not, redirects to login page
 */
function login() {
  const accessToken = localStorage.getItem('accessToken');
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