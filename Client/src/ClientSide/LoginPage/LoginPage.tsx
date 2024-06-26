import "./LoginPage.css";
import { useState, useContext, MouseEvent } from "react";
import { UserContext } from "/src/App";
import Visiteur from "/src/BackEnd/Visiteur";
import User from "/src/BackEnd/User";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";
import ForgottenPasswordPage from "./ForgottenPasswordPage";

export default function LoginPage(params) {
  const { connected, setConnected } = useContext(UserContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    remeberMe: false,
  });
  const [error, setError] = useState("");

  const handleLogin = async (e: MouseEvent) => {
    e.preventDefault();

    await Visiteur.seConnecter(data);
    if (User.isUserConnected()) {
      navigate("" + params.lastPage);
      setConnected(true);
    } else {
      setError("Erreurs dans votre informations");
    }
  };

  return (
    <div className="top_container">
      <div className="hero_img-container">
        <img src="/src/Imgs/hero.png" alt="" className="img-fluid" />
      </div>
      <div className="login-form-container">
        <div className="login_form">
          <h2>LOGIN</h2>

          <form className="form">
            <span>{error}</span>
            <label>Email :</label>
            <input
              placeholder="Email"
              type="email"
              onInput={(e) => setData({ ...data, email: e.target.value })}
            />
            <label>Password :</label>
            <input
              placeholder="Mot de passe"
              type="password"
              onInput={(e) => setData({ ...data, password: e.target.value })}
            />
            <div className="remember-me-container">
              <input
                type="checkbox"
                id="rememberMe"
                className="remember-me-checkbox"
                onInput={(e) => setData({ ...data, remeberMe: e.target.checked })}
              />
              <label htmlFor="rememberMe" className="remember-me-label">
                Remember me
              </label>
            </div>
            <br />
            <button className="call_to_btn" onClick={(e) => handleLogin(e)}>
              Sign In
            </button>
            <br />
          </form>

          <span className="forgot_password-register">
            <Link to="/ForgotPassword">Forgot Password?</Link> | Don't have an
            account? <Link to="/Register">SIGN UP</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
