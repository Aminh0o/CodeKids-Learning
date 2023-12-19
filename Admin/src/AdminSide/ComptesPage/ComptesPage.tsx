import { useEffect, useState } from "react";
import Admin from "/src/Backend/Admin";
export default function ComptesPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const tmpUsers = await Admin.getInstance().getUsers();
      setUsers(tmpUsers);
      setIsLoading(false);
    };
    fetchUsers();
    console.log(users, "zz");
  }, []);

  const LoadedUsers = () => {
    if (isLoading) return <div>Loading...</div>;
    if (users?.length == 0) return <div>Aucun utilisateur &#x1F622;</div>; // &#x1F622;=😢
    return (
      <>
        {users?.map((user, index) => {
          return <CompteFragment user={user} key={index} />;
        })}
      </>
    );
  };

  const CompteFragment = (params) => {
    const handleBanUser = async (e) => {
      e.preventDefault();
      Admin.getInstance().banUser(params.user);
      setUsers(users.filter((user) => user.id != params.user.id));
    };

    return (
      <div>
        <span>{params.user.nom}</span>
        <br />
        <span>{params.user.prenom}</span>
        <br />
        <span>{params.user.email}</span>
        <button onClick={(e) => handleBanUser(e)}>banner l'user</button>
      </div>
    );
  };

  return (
    <div>
      <span>tmp : it shows all users</span>
      <h1>Comptes deja cree</h1>
      <LoadedUsers />
    </div>
  );
}
