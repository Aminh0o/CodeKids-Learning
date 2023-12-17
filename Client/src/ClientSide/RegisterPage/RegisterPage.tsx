import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Visiteur from "/src/BackEnd/Visiteur";
import User from "/src/BackEnd/User";

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
    <div>
      <h1>Entrer votre informations</h1>
      <form>
        <span>{error}</span>
        <input
          type="text"
          placeholder="Nom"
          onChange={(e) => setData({ ...data, nom: e.target.value })}
        />
        <br />
        <input
          type="text"
          placeholder="Prenom"
          onChange={(e) => setData({ ...data, prenom: e.target.value })}
        />
        <br />
        <input
          type="date"
          onChange={(e) =>
            setData({ ...data, dateNaissance: new Date(e.target.value) })
          }
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <br />
        <input
          type="password"
          placeholder="Mot de passe"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <br />
        <input
          type="password"
          placeholder="Confirmer votre mot de passe"
          onChange={(e) =>
            setData({ ...data, confirmPassword: e.target.value })
          }
        />
        <br />
        <select
          onChange={(e) =>
            setData({ ...data, languagePrefere: e.target.value })
          }
        >
          <option value="C">C</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
          <option value="Javascript">Javascript</option>
          <option value="PHP">PHP</option>
        </select>
        <br />

        <button type="submit" onClick={(e) => register(e)}>
          SignIn
        </button>
        <br />
        <span>
          Vous a un compte ? <Link to="/Login">login vous</Link>
        </span>
      </form>
    </div>
  );
}
