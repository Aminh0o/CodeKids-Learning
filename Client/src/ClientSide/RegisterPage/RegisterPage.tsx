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
    <div className="top_container_sign">
      <div className="signup-form-container">
        <div className="signUp_form">
          <h2>SIGN UP</h2>
          <form>
            <span className="error-span">{error}</span>
            <label>Family Name :</label>
            <input
              type="text"
              placeholder="Family Name"
              onInput={(e) => setData({ ...data, nom: e.target.value })}
            />
            <label>First Name :</label>
            <input
              type="text"
              placeholder="First Name"
              onInput={(e) => setData({ ...data, prenom: e.target.value })}
            />
            <label>Birth Date :</label>
            <input
              type="date"
              onInput={(e) =>
                setData({ ...data, dateNaissance: new Date(e.target.value) })
              }
            />
            <label>Email :</label>
            <input
              type="email"
              placeholder="Email"
              onInput={(e) => setData({ ...data, email: e.target.value })}
            />
            <label>Password :</label>
            <input
              type="password"
              placeholder="password"
              onInput={(e) => setData({ ...data, password: e.target.value })}
            />

            <input
              type="password"
              placeholder="Confirm your password"
              onInput={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
            />
            <label>Prefered programming langage :</label>
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
              Sign In
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
