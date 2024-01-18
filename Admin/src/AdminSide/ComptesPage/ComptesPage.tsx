import { MouseEvent, useEffect, useState } from "react";
import Admin from "/src/Backend/Admin";
export default function ComptesPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBan, setShowBan] = useState(false);

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

  const CompteFragment = (params) => {
    const handleBanUser = async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const adminDecision = window.confirm(
        "Are you sure you want to " +
          (params.user.banned ? "unban" : "ban") +
          " this user ?"
      );
      if (!adminDecision) return;

      Admin.getInstance().banUser(params.user);
      setUsers(users.filter((user) => user.id != params.user.id));
    };

    return (
      <div>
        <span>Nom de user : {params.user.nom}</span>
        <br />
        <span>Prenome de user : {params.user.prenom}</span>
        <br />
        <span>Email de user : {params.user.email}</span>
        <br />
        <button onClick={(e) => handleBanUser(e)}>
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
          return <CompteFragment user={user} key={index} />;
        })
      )}
    </>
  );
}
