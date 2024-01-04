import React, { useState } from "react";
import Admin from "../../Backend/Admin.js";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [canLogin, setCanLogin] = useState(false);
  const navigate = useNavigate();

  const handleInputs = () => {
    if (email.trim() == "" || password.trim() == "") {
      setCanLogin(false);
    } else {
      setCanLogin(true);
    }
  };

  return (
    <div>
      <h1>Bojour. entrer votre information s'il vous plais</h1>
      <form>
        <label>email</label>
        <input
          onChange={(e) => {
            setEmail(e.target.value);
            handleInputs();
          }}
          type="text"
        />
        <br />
        <span>{email.trim() == "" ? "Email cannot be empty" : ""}</span>
        <br />
        <label> password</label>
        <input
          onChange={(e) => {
            setPassword(e.target.value);
            handleInputs();
          }}
          type="password"
        />
        <br />
        <span>{password.trim() == "" ? "Password cannot be empty" : ""}</span>
        <br />
        <button
          disabled={!canLogin}
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            login({ email, password,navigate });
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

async function login(params) {
  
  await Admin.seIdentifier(params);
  params.navigate("/Home")

}
