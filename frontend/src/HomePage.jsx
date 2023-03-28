import React from "react";
import useAuth from "./useAuth";

function HomePage({ code }) {
    const accessToken = useAuth(code);
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}

export default HomePage;