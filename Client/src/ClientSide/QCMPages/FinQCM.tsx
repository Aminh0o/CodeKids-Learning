import { useState, useContext } from "react";
import User from "/src/BackEnd/User";
import { useNavigate } from "react-router-dom";
import { QCMContext } from "./QCMPage";
import "./FinQCM.css";

export default function FinQCM() {
  const { newQCM, setNewQCM, nextStep } = useContext(QCMContext);
  const finalQCM = User.getInstance().finalQCM;
  const [canSave, setCanSave] = useState(true);
  const history = useNavigate();

  const WebReaction = () => {
    if (finalQCM.note < finalQCM.questions.length / 2)
      return (
        <span className="notGoodMessage">It's not good. Revise your course of {finalQCM.language} language</span>
      );
    return <span className="veryGoodMessage">Very good</span>;
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
    <div>
      <div className="qcm-two-container">
        {finalQCM.questions.map((question, index) => (
          <QuestionFragment question={question} key={index} index={index} />
        ))}
      </div>
      <div className="Fin-center-container">
        <span>Your grade is : {finalQCM.note}</span>
        <WebReaction />
        <div className="btn-container">
          {canSave && (
            <button className="call_to-btn" onClick={() => handleSave()}>
              Save
            </button>
          )}
          <button className="call_to-btn" onClick={() => hanldeQuit()}>
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionFragment(params) {
  const currentQuestion = params.question;

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
    <div className="qcm-two-container-start">
      <h2>question : {params.index + 1}</h2>
      <span>{params.question.question}</span>

      {params.question.responses.map((response, index) => (
        <AnswerFragment response={response} index={index} key={index} />
      ))}
    </div>
  );
}
