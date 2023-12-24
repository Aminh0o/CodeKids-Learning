import { useState, useContext } from "react";
import User from "/src/BackEnd/User";
import { useNavigate } from "react-router-dom";
import { QCMContext } from "./QCMPage";
import "./FinQCM.css";

export default function FinQCM() {
  // nextStep is useless here
  const { newQCM, setNewQCM, nextStep } = useContext(QCMContext);
  const finalQCM = User.getInstance().finalQCM;
  const [canSave, setCanSave] = useState(true);
  const history = useNavigate();
  console.log(finalQCM);

  const WebReaction = () => {
    if (finalQCM.note < finalQCM.questions.length / 2)
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
    history("/");
  };

  return (
    <div className="Fin-center-container">
      <span>Votre note est : {finalQCM.note}</span>

      <WebReaction />

      <div className="btn-container">
        {canSave && (
          <button className="call_to-btn" onClick={() => handleSave()}>
            Enregistrer
          </button>
        )}
        <button className="call_to-btn" onClick={() => hanldeQuit()}>
          Quiter
        </button>
      </div>
      <div className="qcm-two-container">
        {finalQCM.questions.map((question, index) => (
          <QuestionFragment question={question} key={index} index={index} />
        ))}
      </div>
    </div>
  );
}

// copy of QuestionFragment of CompleterQCM
// params = {question, index}
function QuestionFragment(params) {
  const currentQuestion = params.question;
  // params = {response, index}
  const AnswerFragment = (params) => {
    const currentResponse = params.response;
    const classNameOfAnswer = (index) => {
      if (currentResponse.isCorrect && index == currentQuestion.chosenResponse)
        return "RightAnswer";
      if (index == currentQuestion.chosenResponse) return "WrongAnswer";
      if (currentResponse.isCorrect) return "RightAnswer";
      return "AnswerNotSelected";
    };

    return (
      <div className={classNameOfAnswer(params.index)}>
        <span>{params.response.response}</span>
      </div>
    );
  };

  return (
    <div className="question">
      <h2>La question : {params.index + 1}</h2>
      <span>{params.question.question}</span>

      {params.question.responses.map((response, index) => {
        return <AnswerFragment response={response} index={index} key={index} />;
      })}
    </div>
  );
}
