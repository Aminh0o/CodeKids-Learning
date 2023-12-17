import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "/src/App";
import Visiteur from "/src/BackEnd/Visiteur";
import User from "/src/BackEnd/User";

export default function LoginPage(params) {
  const { connected, setConnected } = useContext(UserContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const login = async (submitEvent) => {
    submitEvent.preventDefault();

    await Visiteur.seConnecter(data);
    if (User.isUserConnected()) {
      navigate("" + params.lastPage);
      setConnected(true);
    } else {
      setError("Erreurs dans votre informations");
    }
  };

  return (
    <>
      <form>
        <span>{error}</span>
        <br />
        <input
          placeholder="Email"
          type="email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <br />
        <input
          placeholder="Mot de passe"
          type="password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <br />
        <input type="checkbox" />
        <label>Remeber ME (notWorking)</label>
        <br />
        <button
          onClick={(e) => {
            login(e);
          }}
        >
          SignIn
        </button>
        <br />
        <span>
          Vous n'a pas de compte ? <Link to="/Register">Inscrivez-vous</Link>
        </span>
      </form>
    </>
  );
}
