import { useState } from "react";
import User from "/src/BackEnd/User";
import { useHistory } from "react-router-dom";

export default function FinQCM() {
  const finalQCM = User.getInstance().finalQCM;
  const [canSave, setCanSave] = useState(true);

  const WebReaction = () => {
    if (finalQCM.note < 10)
      return (
        <span>C'esty pas bien .reviser votre cour de {finalQCM.language}</span>
      );
    return <span>C'est bien </span>;
  };

  const handleSave = () => {
    const userDecision = window.confirm("Voulez-vous enregistrer votre QCM ?");
    if (!userDecision) return;
    finalQCM.saveQCM();
    setCanSave(false);
  };
  const hanldeQuit = () => {
    window.location.href = "/";
    //const history = useHistory();
    //history.push("/");
  };

  return (
    <div>
      <span>Votre note est : {finalQCM.note}</span>
      <br />
      {WebReaction()}
      <br />
      {canSave && <button onClick={() => handleSave()}>Enregistrer</button>}
      <button onClick={() => hanldeQuit()}>Quiter</button>
    </div>
  );
}
