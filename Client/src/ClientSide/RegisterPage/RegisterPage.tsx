import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Visiteur from "/src/BackEnd/Visiteur";
import User from "/src/BackEnd/User";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    email: "",
    password: "",
    confirmPassword: "",
    languagePrefere: "",
  });
  const [error, setError] = useState("");

  const register = (e) => {
    e.preventDefault();
    Visiteur.creeCompte(data);
    if (User.isUserConnected()) {
      navigate("/");
    } else {
      setError("Erreurs dans votre informations");
    }
  };

  return (
    <div className="top_container">
      <div className="hero_img-container">
        <img src="/src/Imgs/hero.png" alt="" className="img-fluid" />
      </div>
      <div className="signup-form-container">
        <div className="signUp_form">
          <h2>SIGN UP</h2>
          <form>
            <span className="error-span">{error}</span>
            <label>Nom :</label>
            <input
              type="text"
              placeholder="Nom"
              onChange={(e) => setData({ ...data, nom: e.target.value })}
            />
            <label>Prenom :</label>
            <input
              type="text"
              placeholder="Prenom"
              onChange={(e) => setData({ ...data, prenom: e.target.value })}
            />
            <label>Date de naissance :</label>
            <input
              type="date"
              onChange={(e) =>
                setData({ ...data, dateNaissance: new Date(e.target.value) })
              }
            />
            <label>Email :</label>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <label>Password :</label>
            <input
              type="password"
              placeholder="Mot de passe"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />

            <input
              type="password"
              placeholder="Confirmer votre mot de passe"
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
            />
            <label>Prefered programing luaguage :</label>
            <select
              onChange={(e) =>
                setData({ ...data, languagePrefere: e.target.value })
              }
            >
              <option value="C">C</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="Javascript">Javascript</option>
            </select>
            <br />

            <button
              className="call_to_btn"
              type="submit"
              onClick={(e) => register(e)}
            >
              SignIn
            </button>
            <br />
          </form>
          <span>
            Already have an account? <Link to="/Login">Log In</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
