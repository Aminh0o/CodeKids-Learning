import { MouseEvent, useEffect, useState } from "react";
import Admin from "/src/Backend/Admin";

import LoadingGif from "/src/Imgs/loading.gif";
import ErrorGif from "/src/Imgs/error.gif";
import DoneGif from "/src/Imgs/ok.gif";

const NOTYET = -1,
  LOADING = 0,
  OK = 1,
  ERROR = 2;

export default function ComptesPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBan, setShowBan] = useState(false);
  const [actionState, setActionState] = useState({
    state: NOTYET,
    message: "",
    index: -1,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const tmpUsers = await Admin.getInstance().getUsers(showBan);
      setUsers(tmpUsers);
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  // Changes when showBan changes
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const tmpUsers = await Admin.getInstance().getUsers(showBan);
      setUsers(tmpUsers);
      setIsLoading(false);
    };
    fetchUsers();
  }, [showBan]);

  // params = {user,index}
  const CompteFragment = (params) => {
    const StateGif = () => {
      return (
        <>
          {params.index != actionState.index ? (
            <></>
          ) : actionState.state == NOTYET ? (
            <></>
          ) : actionState.state == LOADING ? (
            <>
              <img className="StateImg" src={LoadingGif} alt="" />
            </>
          ) : actionState.state == OK ? (
            <>
              <img className="StateImg" src={DoneGif} alt="" />
              <span>{actionState.message}</span>
            </>
          ) : (
            <>
              <img className="StateImg" src={ErrorGif} alt="" />
              <span>{actionState.message}</span>
            </>
          )}
        </>
      );
    };

    const handleBanUser = async (
      e: MouseEvent<HTMLButtonElement>,
      userIndex: number
    ) => {
      e.preventDefault();
      const adminDecision = window.confirm(
        "Are you sure you want to " +
          (params.user.banned ? "unban" : "ban") +
          " this user ?"
      );
      if (!adminDecision) return;
      setActionState({ state: LOADING, message: "", index: userIndex });

      const res = await Admin.getInstance().banUser(params.user);
      setActionState({ ...res, index: userIndex });

      setTimeout(() => {
        setActionState({ state: NOTYET, message: "", index: -1 });
        if (res.state == OK) {
          setUsers(users.filter((user) => user.id != params.user.id));
        }
      }, 4000);
    };

    return (
      <div>
        <span>Nom de user : {params.user.nom}</span>
        <br />
        <span>Prenome de user : {params.user.prenom}</span>
        <br />
        <span>Email de user : {params.user.email}</span>
        <br />
        <StateGif />
        <button onClick={(e) => handleBanUser(e, params.index)}>
          {params.user.banned ? "unban the user" : "banner l'user"}
        </button>
      </div>
    );
  };

  return (
    <>
      <h1>Comptes deja cree</h1>
      <div>
        <button onClick={() => setShowBan(!showBan)}>
          {!showBan ? "Show Banned Users" : "Show normal users"}
        </button>
        <h2>{showBan ? "Liste des users banné" : "Liste des users"}</h2>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : users?.length == 0 ? (
        <div>Aucun utilisateur &#x1F622;</div>
      ) : (
        users?.map((user, index) => {
          return <CompteFragment user={user} key={index} index={index} />;
        })
      )}
    </>
  );
}
