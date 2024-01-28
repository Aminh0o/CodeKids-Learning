import { useContext, useState } from "react";
import { QCMContext } from "./QCMPage";
import User from "/src/BackEnd/User";

export default function CommancerQCM() {
  const { newQCM, setNewQCM, nextStep } = useContext(QCMContext);
  const [isSelected, setIsSelected] = useState({
    isIt: false,
    oldValue: "C",
  });  

  // preDefined newQCM :
  //setNewQCM({ ...newQCM, language: "C", niveau: "facile" });

  const handleLanguagePrefere = (e) => {
    e.preventDefault();
    setIsSelected({ ...isSelected, isIt: !isSelected.isIt });
    //if (isSelected.isIt)
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
    } else console.log("you must select a language and a level");
  };

  return (
    <div className="qcm-one-container">
      <form>
        <label>Select your level</label>
        <select
          value={newQCM.niveau}
          onChange={(e) => {
            setNewQCM({ ...newQCM, niveau: e.target.value });
          }}
        >
          <option value="facile">Easy</option>
          <option value="moyen">Medium</option>
          <option value="difficile">Hard</option>
        </select>
        <label>Select your language</label>
        <select
          value={newQCM.language}
          disabled={isSelected.isIt}
          onChange={(e) => {
            setIsSelected({ ...isSelected, oldValue: e.target.value });
            setNewQCM({ ...newQCM, language: e.target.value });
          }}
        >
          <option value="C">C</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
        </select>
        <label>or</label>
        <button
          onClick={(e) => handleLanguagePrefere(e)}
          className="call_to_btn"
        >
          Choose my preferred language
        </button>
        <label style={{ marginTop: "20px" }}>
        Click here to generate your MCQ :
        </label>
        <button className="call_to_btn" onClick={(e) => handleGenerationQCM(e)}>
        Generate the MCQ
        </button>
      </form>
    </div>
  );
}
