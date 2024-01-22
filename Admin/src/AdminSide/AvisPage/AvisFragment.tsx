import Admin from "/src/Backend/Admin.js";
import { useState } from "react";

import LoadingGif from "/src/Imgs/loading.gif";
import ErrorGif from "/src/Imgs/error.gif";
import DoneGif from "/src/Imgs/ok.gif";

const NOTYET = -1,
  LOADING = 0,
  OK = 1,
  ERROR = 2;

// params = {avis,oneAvis, setAvis, index, key}
export default function AvisFragment(params) {
  const [actionState, setActionState] = useState({
    state: NOTYET,
    message: "",
    index: -1,
  });

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

  // TOADD : ban user

  // TODO : confirmations on actions
  const handleSeenAvis = async (e: MouseEvent) => {
    e.preventDefault();

    await Admin.getInstance().markAsSeen(params.oneAvis);
  };

  const handleSupression = async () => {
    const adminDecision = window.confirm(
      "Are you sure you want to delete this avis"
    );
    if (!adminDecision) return;
    setActionState({ state: LOADING, message: "", index: params.index });
    const res = await Admin.getInstance().deleteAvis(params.oneAvis.id);
    setActionState({ ...res, index: params.index });
    setTimeout(() => {
      setActionState({ state: NOTYET, message: "", index: -1 });
      if (res.state == OK) {
        params.setAvis(params.avis.filter((v) => v.id != params.oneAvis.id));
      }
    }, 4000);
  };

  return (
    <div>
      <span>Nom : {params.oneAvis.nom} </span>
      <br />
      <span>Email : {params.oneAvis.email}</span>
      <br />
      <span>Sujet : {params.oneAvis.sujet}</span>
      <br />
      <span>Message : {params.oneAvis.message}</span>
      <br />
      {!params.oneAvis.seen && (
        <button
          disabled={params.oneAvis.seen ? true : false}
          onClick={(e) => handleSeenAvis(e)}
        >
          Marker comme lu
        </button>
      )}
      <button>Banner l'user (TOADD)</button>
      <button onClick={handleSupression}>suprimer avis</button>
      <StateGif />
    </div>
  );
}
