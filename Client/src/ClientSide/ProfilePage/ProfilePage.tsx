import { useState, useContext, useEffect } from "react";
import User from "/src/BackEnd/User";
import { UserContext } from "/src/App";

export default function ProfilePage() {
  const { connected, setConnected } = useContext(UserContext);

  const handleLogout = () => {
    setConnected(false);
    User.deConnecter();
    localStorage.removeItem("user");
  };
  return (
    <div>
      <h1>Profile Page</h1>

      <button onClick={() => handleLogout()}>Logout</button>
    </div>
  );
}
