import { useEffect, useState } from "react";
import Admin from "../../Backend/Admin.js";
// documuntaion about CodeEditor : https://uiwjs.github.io/react-textarea-code-editor/
import CodeEditor from "@uiw/react-textarea-code-editor";

// params = {setQuestions,questions}
export default function NewQuestionFragment(params) {
  const [question, setQuestion] = useState({
    language: "C",
    niveau: "facile",
    question: "int e = 5;",
    code: "",
    /* responses: [{isCorrect: false,response: "" }],  */
  });
  const [code, setCode] = useState({
    code: "",
    language: "c", // c,js,java,py
  });
  // on peut merger responses dans question (plus de travail)
  const [responses, setResponses] = useState([
    { isCorrect: true, response: "" },
    { isCorrect: false, response: "" },
    { isCorrect: false, response: "" },
    { isCorrect: false, response: "" },
  ]);
  // pour assurer que un seul checkbox est coche
  const [correct, setCorrect] = useState("0");

  const handleCheckBoxChange = (index) => {
    setCorrect(index);
    setResponses(
      responses.map((response, i) => ({
        ...response,
        isCorrect: i == parseInt(index),
      }))
    );
  };

  const handleResponseChange = (index, value) => {
    setResponses(
      responses.map((response, i) => ({
        ...response,
        response: i == index ? value : response.response,
      }))
    );
    console.log(responses);
  };

  const handleAjouterQuestion = (submitEvent) => {
    // must have to not refersh page
    submitEvent.preventDefault();
    console.log(question);
    
    const newQuestion = { ...question, responses };
    console.log(newQuestion);

    Admin.getInstance().ajouterQuestion(newQuestion);
    
    const AfterEmptyQuestion = {
      ...question,
      question: "",
    };
    const AfterEmptyResponses = responses.map(() => {
      return {
        isCorrect: false,
        response: "",
      };
    });
    
    // TOFIX : new question not reset to empty after add
    setQuestion(AfterEmptyQuestion);
    setResponses(AfterEmptyResponses);
    // TOFIX : cant delete new Question (lack of quetionID)
    params.setQuestions([...params.questions, newQuestion]);
    
  };

  // NOT USEFULL FOR NOW (can be used to shorten code)
  function NewResponse() {
    return (
      <>
        <input type="checkbox" />
        <input type="text" placeholder="la reponse" />
        <br />
      </>
    );
  }

  return (
    <form>
      <label>la question :</label>
      <input
        type="text"
        onChange={(e) => setQuestion({ ...question, question: e.target.value })}
      />
      <br />
      <label >le code associé (optionele):</label>
      <CodeEditor
        language={question.language.toLowerCase()}
        onChange={(evn) => {
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
      <label>la langue :</label>
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
          onChange={(e) => handleResponseChange(0, e.target.value)}
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
          onChange={(e) => handleResponseChange(1, e.target.value)}
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
          onChange={(e) => handleResponseChange(2, e.target.value)}
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
          onChange={(e) => handleResponseChange(3, e.target.value)}
        />
        <br />
      </div>
      <button
        onClick={(e) => {
          handleAjouterQuestion(e);
        }}
      >
        Ajouter Question au base de données
      </button>
    </form>
  );
}
