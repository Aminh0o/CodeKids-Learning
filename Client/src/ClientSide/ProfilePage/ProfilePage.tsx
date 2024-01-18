import { useState, useContext, useEffect } from "react";
import User from "/src/BackEnd/User";
import { UserContext } from "/src/App";
import { useNavigate, Link } from "react-router-dom";
import "./QCMFragment.css";

export default function ProfilePage() {
  const { connected, setConnected } = useContext(UserContext);
  const [canModify, setCanModify] = useState(false);
  const [canCheckQCM, setCanCheckQCM] = useState(false);
  const [QCMs, setQCMs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) navigate("/Login");
    return;
    const fetchQCMs = async () => {
      await User.getInstance().getQCMHistory();
    };
    fetchQCMs();
  }, []);

  const handleLogout = () => {
    setConnected(false);
    User.deConnecter();
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleCheckQCMHistory = async () => {
    if (!canCheckQCM) {
      await User.getInstance().getQCMHistory();
      setQCMs(User.getInstance().QCMs);
    }
    setCanCheckQCM(!canCheckQCM);
  };

  return (
    <div className="ProfilePage">
      <h1>Profile Page</h1>
      {User.isUserConnected() && (
        <UserInfo canModify={canModify} setCanModify={setCanModify} />
      )}
      <button onClick={() => setCanModify(!canModify)} className="call_to-btn">
        Modifier le Profile
      </button>
      <button
        className="call_to-btn"
        onClick={() => {
          handleCheckQCMHistory();
        }}
      >
        Check old QCMs
      </button>
      {canCheckQCM && <QCMsFragment QCMs={QCMs} />}

      <button className="call_to-btn" onClick={() => handleLogout()}>
        Logout
      </button>
    </div>
  );
}

// params = { canModify , setCanModify }
function UserInfo(params) {
  const user = User.getInstance();
  const [updatedData, setUpdatedData] = useState({
    nom: user.nom,
    prenom: user.prenom,
    languagePrefere: user.languagePrefere,
  });

  const handleUpdateData = async () => {
    //e.preventDefault();
    await User.getInstance().updateInfo(updatedData);
    params.setCanModify(false);
  };

  return (
    <div className="login-form-container">
      <div>
        <label>Nom : </label>
        <input
          type="text"
          disabled={!params.canModify}
          defaultValue={updatedData.nom}
          onChange={(e) => {
            setUpdatedData({ ...updatedData, nom: e.target.value });
          }}
        />
      </div>
      <div>
        <label>Prenom : </label>
        <input
          type="text"
          disabled={!params.canModify}
          defaultValue={updatedData.prenom}
          onChange={(e) =>
            setUpdatedData({ ...updatedData, prenom: e.target.value })
          }
        />
      </div>
      <div>
        <label>Language preferé : </label>
        <select
          defaultValue={updatedData.languagePrefere}
          disabled={!params.canModify}
          onChange={(e) =>
            setUpdatedData({ ...updatedData, languagePrefere: e.target.value })
          }
        >
          <option value="C">C</option>
          <option value="Java">Java</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
        </select>
      </div>
      {params.canModify && (
        <button
          className="call_to-btn"
          onClick={(e) => {
            handleUpdateData();
          }}
        >
          update the informations
        </button>
      )}
    </div>
  );
}

// params = { QCMs }
function QCMsFragment(params) {
  // params = { QCM }
  const QCMFragment = (params) => {
    return (
      <div className="OneQCM">
        <span>
          Le QCM {params.index} <br />
          passé en {params.QCM.date.toDate().toDateString()}
        </span>
        <span>Le language de programation : {params.QCM.language}</span>
        <br />
        <span>Le niveau de QCM : {params.QCM.niveau}</span>
        <br />
        <span>La note recu : {params.QCM.note}</span>
        <br />
        <br />
      </div>
    );
  };

  if (params.QCMs?.length == 0) {
    return (
      <div>
        Aucun QCM est passé{" "}
        <Link to="/QCM">Clicker ic pour passer votre premier QCM</Link>
      </div>
    );
  }

  return (
    <div className="OldQCM">
      <div className="moyen">
        Votre moyen dans les QCMs est : {User.getInstance().calculerMoyen().toFixed(1)}
      </div>
      {params.QCMs?.map((QCM, index) => {
        return <QCMFragment QCM={QCM} key={index} index={index} />;
      })}
    </div>
  );
}
