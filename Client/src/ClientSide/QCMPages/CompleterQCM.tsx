import "./CompleterQCM.css";
import User from "/src/BackEnd/User";
import { useEffect, useState, useContext } from "react";
import { QCMContext } from "./QCMPage";

export default function CompleterQCM() {
  // 2 first methodes are unusefull in this
  const { newQCM, setNewQCM, nextStep } = useContext(QCMContext);
  const [questions, setQuestions] = useState([]);
  const [canGoNext, setCanGoNext] = useState(questions.length);
  useEffect(() => {
    setQuestions(User.getInstance().currentQCM.questions);
    // TOFIX all questns should be done
    //setCanGoNext(questions.length);
    console.log(questions);
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
        });
      };
      return (
        <div
          className={params.index == chosenAnswer ? "AnswerActive" : "Answer"}
          onClick={() => handlePickAnswer()}
        >
          <span>{params.response.response}</span>
          <br />
        </div>
      );
    };

    return (
      <div>
        <h2>La question : {params.index}</h2>
        <span>{params.question.question}</span>
        <br />
        {params.question.responses.map((response, index) => {
          return (
            <AnswerFragment response={response} index={index} key={index} />
          );
        })}
        <br />
      </div>
    );
  }

  return (
    <div>
      <h1>HELLO</h1>
      {questions.map((question, index) => (
        <QuestionFragment question={question} key={index} index={index} />
      ))}
      <button onClick={() => handleGoingToFinQCM()}>Submit Your answers</button>
    </div>
  );
}
