import Admin from "/src/Backend/Admin.js";

// params = {avis, key}
export default function AvisFragment(params) {
  const handleSeenAvis = async (e) => {
    e.preventDefault();
    await Admin.getInstance().markAsSeen(params.avis);
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
      <button
        disabled={params.avis.seen ? true : false}
        onClick={(e) => handleSeenAvis(e)}
      >
        Marker comme lu
      </button>
    </div>
  );
}
