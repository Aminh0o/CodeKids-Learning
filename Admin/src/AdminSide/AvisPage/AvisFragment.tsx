import Admin from "/src/Backend/Admin.js";

// params = {avis, setAvis, key}
export default function AvisFragment(params) {

  const handleSeenAvis = async (e: MouseEvent) => {
    e.preventDefault();
    await Admin.getInstance().markAsSeen(params.avis);
  };

  const handleSupression = async () => {
    await Admin.getInstance().deleteAvis(params.avis.id);
  };

  return (
    <div>
      <span>Nom : {params.avis.nom} </span>
      <br />
      <span>Email : {params.avis.email}</span>
      <br />
      <span>Sujet : {params.avis.sujet}</span>
      <br />
      <span>Message : {params.avis.message}</span>
      <br />
      {!params.avis.seen && (
        <button
          disabled={params.avis.seen ? true : false}
          onClick={(e) => handleSeenAvis(e)}
        >
          Marker comme lu
        </button>
      )}
      <button>Banner l'user</button>
      <button onClick={handleSupression}>suprimer avis</button>
    </div>
  );
}
