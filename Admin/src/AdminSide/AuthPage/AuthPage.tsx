import React, { useEffect, useState } from "react";
import Admin from "../../Backend/Admin.js";
import { useNavigate } from "react-router-dom";

import LoadingGif from "/src/Imgs/loading.gif";
import ErrorGif from "/src/Imgs/error.gif";
import DoneGif from "/src/Imgs/ok.gif";

const NOTYET = -1,
  LOADING = 0,
  OK = 1,
  ERROR = 2;

export default function AuthPage() {
  const [loginState, setLoginState] = useState({
    state: NOTYET,
    message: "",
  });
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

  const StateGif = () => {
    return (
      <>
        {loginState.state == NOTYET ? (
          <></>
        ) : loginState.state == LOADING ? (
          <>
            <img className="StateImg" src={LoadingGif} alt="" />
          </>
        ) : loginState.state == OK ? (
          <>
            <img className="StateImg" src={DoneGif} alt="" />
            <span>{loginState.message}</span>
          </>
        ) : (
          <>
            <img className="StateImg" src={ErrorGif} alt="" />
            <span>{loginState.message}</span>
          </>
        )}
      </>
    );
  };

  const handleInputs = () => {
    if (inputs.email.trim() == "" || inputs.password.trim() == "")
      setCanLogin(false);
    else setCanLogin(true);
  };

  const handleLogin = async (params) => {
    setLoginState({ state: LOADING, message: "" });

    const res = await Admin.seIdentifier(params);
    setLoginState(res);

    // bach tji chaba
    setTimeout(() => {
      navigate("/Home");
    }, 500);
  };

  return (
    <div>
      <h1>Bojour. entrer votre information s'il vous plais</h1>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <label>email</label>
        <input
          onInput={(e) => {
            setInputs({ ...inputs, email: e.target.value });
            handleInputs();
          }}
          type="text"
        />

        <span>{inputs.email.trim() == "" ? "Email cannot be empty" : ""}</span>

        <label> password</label>
        <input
          onInput={(e) => {
            setInputs({ ...inputs, password: e.target.value });
            handleInputs();
          }}
          type="password"
        />
        <span>
          {inputs.password.trim() == "" ? "Password cannot be empty" : ""}
        </span>
        <input
          type="checkbox"
          onInput={(e) => {
            setInputs({ ...inputs, rememberMe: e.target.checked });
          }}
        />
        <label>Remeber me</label>
        <StateGif />
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
