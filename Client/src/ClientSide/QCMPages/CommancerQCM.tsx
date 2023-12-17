import { useContext, useState } from "react";
import { QCMContext } from "./QCMPage";
import User from "/src/BackEnd/User";

export default function CommancerQCM() {
  const { newQCM, setNewQCM, nextStep } = useContext(QCMContext);
  const [isSelected, setIsSelected] = useState({
    isIt: true,
    oldValue: "",
  });

  const handleLanguagePrefere = async (e) => {
    e.preventDefault();
    setIsSelected({ ...isSelected, isIt: !isSelected.isIt });
    if (isSelected.isIt)
      setNewQCM({ ...newQCM, language: User.getInstance().languagePrefere });
  };

  const handleGenerationQCM = async (submitEvent) => {
    submitEvent.preventDefault();

    if (!!newQCM.niveau && !!newQCM.language) {
      await User.getInstance().commancerQCM({
        niveau: newQCM.niveau,
        language: newQCM.language,
      });

      // TOFIX : doesnt update questions of newQCM
      // tmpSol : use currentQCM from User
      const questions = User.getInstance().currentQCM.questions;
      setNewQCM({
        ...newQCM,
        questions,
      });

      nextStep();
    }
  };

  return (
    <form>
      <span>Slectioner votre niveau</span>
      <select
        onChange={(e) => {
          setNewQCM({ ...newQCM, niveau: e.target.value });
        }}
      >
        <option value="facile">Facile</option>
        <option value="moyen">Moyen</option>
        <option value="difficile">Difficile</option>
      </select>
      <br />
      <br />
      <span>Slectioner votre langage</span>
      <select
        value={isSelected ? newQCM.language : isSelected.oldValue}
        disabled={!isSelected.isIt}
        onChange={(e) => {
          setIsSelected({ ...isSelected, oldValue: e.target.value });
          setNewQCM({ ...newQCM, language: e.target.value });
        }}
      >
        <option value="C">C</option>
        <option value="C++">C++</option>
        <option value="Java">Java</option>
        <option value="Python">Python</option>
      </select>
      <span>ou</span>
      <button onClick={(e) => handleLanguagePrefere(e)}>
        language priferer
      </button>
      <br />
      <button onClick={(e) => handleGenerationQCM(e)}>Generer le QCM</button>
    </form>
  );
}
