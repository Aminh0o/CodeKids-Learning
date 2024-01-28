import "./CompleterQCM.css";
import User from "/src/BackEnd/User";
import { useEffect, useState, useContext } from "react";
import { QCMContext } from "./QCMPage";
import { Prism as Code } from "react-syntax-highlighter";

export default function CompleterQCM() {
  // 2 first methodes are unusefull in this
  const { newQCM, setNewQCM, nextStep } = useContext(QCMContext);
  const [questions, setQuestions] = useState([]);
  const [canGoNext, setCanGoNext] = useState(questions.length);
  useEffect(() => {
    setQuestions(newQCM.questions);
    console.log(newQCM);

    // TOFIX all questns should be done
    //setCanGoNext(questions.length);
  }, []);

  const handleGoingToFinQCM = async () => {
    User.getInstance().terminerQCM();
    nextStep();
  };

  // params ={question, index}
  function QuestionFragment(params) {
    const currentQuestion = params.question;
    const [chosenAnswer, setChosenAnswer] = useState(-1);

    // params = {response, index}
    const AnswerFragment = (params) => {
      const handlePickAnswer = () => {
        //setCanGoNext(chosenAnswer < 0 ? canGoNext - 1 : canGoNext);
        setChosenAnswer(params.index);

        User.getInstance().currentQCM.setGotCorrectQuestion({
          question: currentQuestion,
          gotCorrect: params.response.isCorrect,
          indexOfAnswer: params.index,
        });
      };
      return (
        <div
          className={params.index == chosenAnswer ? "AnswerActive" : "Answer"}
          onClick={() => handlePickAnswer()}
        >
          <span>{params.response.response}</span>
        </div>
      );
    };

    return (
      <div className="question">
        <h2>Question {params.index + 1} : </h2>
        <span className="qst">{params.question.question}</span>
        {params.question.code ? (
          <Code language="javascript">{params.question.code}</Code>
        ) : (
          <></>
        )}

        {params.question.responses.map((response, index) => {
          return (
            <AnswerFragment response={response} index={index} key={index} />
          );
        })}
      </div>
    );
  }

  return (
    <div className="center-container">
      <div className="qcm-two-container-start">
        {questions.map((question, index) => (
          <QuestionFragment question={question} key={index} index={index} />
        ))}
        <button className="call_to-btn" onClick={() => handleGoingToFinQCM()}>
          Submit Your answers
        </button>
      </div>
    </div>
  );
}
