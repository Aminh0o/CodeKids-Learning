import { MouseEvent, useEffect, useRef, useState } from "react";
import Admin from "../../Backend/Admin.js";
// documuntaion about CodeEditor : https://uiwjs.github.io/react-textarea-code-editor/
import CodeEditor from "@uiw/react-textarea-code-editor";

import LoadingGif from "/src/Imgs/loading.gif";
import ErrorGif from "/src/Imgs/error.gif";
import DoneGif from "/src/Imgs/ok.gif";

const NOTYET = -1,
  LOADING = 0,
  OK = 1,
  ERROR = 2;

// params = {setQuestions,questions}
export default function NewQuestionFragment(params) {
  const [question, setQuestion] = useState({
    language: "C",
    niveau: "facile",
    question: "",
    code: "",
    /* responses: [{isCorrect: false,response: "" }],  */
  });
  const [questionState, setQuestionState] = useState({
    state: NOTYET,
    message: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // on peut merger responses dans question (plus de travail)
  const [responses, setResponses] = useState([
    { isCorrect: true, response: "" },
    { isCorrect: false, response: "" },
    { isCorrect: false, response: "" },
    { isCorrect: false, response: "" },
  ]);
  // pour assurer que un seul checkbox est coche (need useless fix string -> int)
  const [correct, setCorrect] = useState("0");

  const handleCheckBoxChange = (index: string) => {
    setCorrect(index);
    setResponses(
      responses.map((response, i) => ({
        ...response,
        isCorrect: i == parseInt(index),
      }))
    );
  };

  // for dinamic input size
  const handleInputChange = (e: MouseEvent) => {
    // update the state + the length
    setQuestion({ ...question, question: e.target.value });
    if (inputRef.current) {
      const length = inputRef.current.value.length;
      inputRef.current.style.width = length > 19 ? length * 8 + "px" : "150px";
    }
  };

  const handleResponseChange = (index: number, newValue: string) => {
    setResponses(
      responses.map((response, i) => ({
        ...response,
        response: i == parseInt(index) ? newValue : response.response,
      }))
    );
  };

  const handleAjouterQuestion = async (submitEvent: MouseEvent) => {
    // must have to not refersh page
    submitEvent.preventDefault();
    setQuestionState({
      state: LOADING,
      message: "",
    });

    const newQuestion = { ...question, responses };
    const res = await Admin.getInstance().ajouterQuestion(newQuestion);

    setQuestionState(res);

    const AfterEmptyQuestion = {
      ...question,
      question: "",
      code: "",
    };
    const AfterEmptyResponses = responses.map(() => {
      return {
        isCorrect: false,
        response: "",
      };
    });

    // TOFIX : new question not reset to empty after add
    // put value={state} to fix
    setQuestion(AfterEmptyQuestion);
    setResponses(AfterEmptyResponses);
    // TOFIX : cant delete new Question (lack of quetionID) + ohter issues
    params.setQuestions([...params.questions, newQuestion]);

    setTimeout(() => {
      setQuestionState({ state: NOTYET, message: "" });
    }, 4000);
  };

  const StateGif = () => {
    return (
      <>
        {questionState.state == NOTYET ? (
          <></>
        ) : questionState.state == LOADING ? (
          <>
            <img className="StateImg" src={LoadingGif} alt="" />
          </>
        ) : questionState.state == OK ? (
          <>
            <img className="StateImg" src={DoneGif} alt="" />
            <span>{questionState.message}</span>
          </>
        ) : (
          <>
            <img className="StateImg" src={ErrorGif} alt="" />
            <span>{questionState.message}</span>
          </>
        )}
      </>
    );
  };

  // NOT USEFULL FOR NOW (can be used to shorten code)
  // params = {index, correct, handleCheckBoxChange, handleResponseChange}
  function NewResponse(params) {
    return (
      <>
        <input
          type="checkbox"
          checked={params.correct == params.index}
          onChange={() => params.handleCheckBoxChange(params.index)}
        />
        <input
          type="text"
          placeholder={"response" + params.index}
          onInput={(e) =>
            params.handleResponseChange(
              params.index,
              (e.target as HTMLInputElement).value
            )
          }
        />
        <br />
      </>
    );
  }

  return (
    <form class="questionForm">
      <label>La Question :</label>
      <input
        ref={inputRef}
        type="text"
        value={question.question}
        onInput={(e) => handleInputChange(e)}
      />
      <br />
      <label>Le code associé (optionnel):</label>
      <CodeEditor
        language={question.language.toLowerCase()}
        onInput={(evn) => {
          setQuestion({ ...question, code: evn.target.value });
        }}
        data-color-mode="light"
        style={{
          fontSize: 17,
        }}
      />
      <br />
      <label>le niveau : </label>
      <select
        onChange={(e) => setQuestion({ ...question, niveau: e.target.value })}
      >
        <option value="facile">facile</option>
        <option value="moyen">moyen</option>
        <option value="difficile">difficile</option>
      </select>
      <br />
      <label>le langage :</label>
      <select
        onChange={(e) => {
          setQuestion({ ...question, language: e.target.value });
        }}
      >
        <option value="C">C</option>
        <option value="Java">Java</option>
        <option value="JavaScript">JavaScript</option>
        <option value="Python">Python</option>
      </select>
      <br />
      <div>
        <input
          type="checkbox"
          checked={correct == "0"}
          onChange={() => handleCheckBoxChange("0")}
        />
        <input
          type="text"
          placeholder="la reponse 0"
          onInput={(e) => handleResponseChange(0, e.target.value)}
        />
        <br />
        <input
          type="checkbox"
          checked={correct == "1"}
          onChange={() => handleCheckBoxChange("1")}
        />
        <input
          type="text"
          placeholder="la reponse 1"
          onInput={(e) => handleResponseChange(1, e.target.value)}
        />
        <br />
        <input
          type="checkbox"
          checked={correct == "2"}
          onChange={() => handleCheckBoxChange("2")}
        />
        <input
          type="text"
          placeholder="la reponse 2"
          onInput={(e) => handleResponseChange(2, e.target.value)}
        />
        <br />
        <input
          type="checkbox"
          checked={correct == "3"}
          onChange={() => handleCheckBoxChange("3")}
        />
        <input
          type="text"
          placeholder="la reponse 3"
          onInput={(e) => handleResponseChange(3, e.target.value)}
        />
        <br />
      </div>
      <StateGif />
      <button
        onClick={(e) => {
          handleAjouterQuestion(e);
        }}
      >
        Ajouter au BDD
      </button>
    </form>
  );
}
