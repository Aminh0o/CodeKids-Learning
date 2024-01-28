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
      <button onClick={() => setCanModify(!canModify)} className="call_to-btn_prof">
        Modify your profile
      </button>
      <button
        className="call_to-btn_prof"
        onClick={() => {
          handleCheckQCMHistory();
        }}
      >
        Check old QCMs
      </button>
      {canCheckQCM && <QCMsFragment QCMs={QCMs} />}

      <button className="call_to-btn_prof" onClick={() => handleLogout()}>
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
    <div className="profile-form-container">
      <div>
        <label>First Name : </label>
        <input
          type="text"
          disabled={!params.canModify}
          defaultValue={updatedData.nom}
          onInput={(e) => {
            setUpdatedData({ ...updatedData, nom: e.target.value });
          }}
        />
      </div>
      <div>
        <label>Family Name : </label>
        <input
          type="text"
          disabled={!params.canModify}
          defaultValue={updatedData.prenom}
          onInput={(e) =>
            setUpdatedData({ ...updatedData, prenom: e.target.value })
          }
        />
      </div>
      <div>
        <label>Preferred language : </label>
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
          className="call_to-btn_prof"
          onClick={(e) => {
            handleUpdateData();
          }}
        >
          Update the informations
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
          The MCQ: {params.index} <br />
          Taken on: {params.QCM.date.toDate().toDateString()}
        </span>
        <br />
        <span>Programming language: {params.QCM.language}</span>
        <br />
        <span>MCQ Level: {params.QCM.niveau}</span>
        <br />
        <span>Your received grade: {params.QCM.note}</span>
        <br />
        <br />
      </div>

    );
  };

  if (params.QCMs?.length == 0) {
    return (
      <div>
        No MCQ's passed{" "}
        <Link to="/QCM">Click here to make your first MCQ</Link>
      </div>
    );
  }

  return (
    <div className="OldQCM">
      <div className="moyen">
      Your average score in the MCQ's is {User.getInstance().calculerMoyen().toFixed(1)}
      </div>
      {params.QCMs?.map((QCM, index) => {
        return <QCMFragment QCM={QCM} key={index} index={index} />;
      })}
    </div>
  );
}
