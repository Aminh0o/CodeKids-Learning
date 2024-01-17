import React, { useEffect, useState } from "react";
import Admin from "../../Backend/Admin.js";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [canLogin, setCanLogin] = useState(false);
  const navigate = useNavigate();

  const isConnectedLocalStorage = localStorage.getItem("connected");
  useEffect(() => {
    if (isConnectedLocalStorage) navigate("/Home");
  }, []);

  const handleInputs = () => {
    if (inputs.email.trim() == "" || inputs.password.trim() == "")
      setCanLogin(false);
    else setCanLogin(true);
  };

  const handleLogin = async (params) => {
    await Admin.seIdentifier(params);
    navigate("/Home");
  };

  return (
    <div>
      <h1>Bojour. entrer votre information s'il vous plais</h1>
      <form>
        <label>email</label>
        <input
          onChange={(e) => {
            setInputs({ ...inputs, email: e.target.value });
            handleInputs();
          }}
          type="text"
        />
        <br />
        <span>{inputs.email.trim() == "" ? "Email cannot be empty" : ""}</span>
        <br />
        <label> password</label>
        <input
          onChange={(e) => {
            setInputs({ ...inputs, password: e.target.value });
            handleInputs();
          }}
          type="password"
        />
        <br />
        <span>
          {inputs.password.trim() == "" ? "Password cannot be empty" : ""}
        </span>
        <br />
        <input
          type="checkbox"
          onChange={(e) => {
            setInputs({ ...inputs, rememberMe: e.target.checked });
          }}
        />
        <label>Remeber me</label>
        <br />
        <button
          disabled={!canLogin}
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleLogin(inputs);
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
