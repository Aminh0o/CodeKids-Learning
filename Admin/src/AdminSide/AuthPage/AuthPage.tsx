import React, { useState } from "react";
import Admin from "../../Backend/Admin.js";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [canLogin, setCanLogin] = useState(false);

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
          type="email"
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
          onClick={() => {
            login({ email, password });
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
}
