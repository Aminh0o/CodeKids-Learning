import React, { useEffect, useState } from "react";
import Admin from "../../Backend/Admin.js";
import Question from "../../Backend/Question.js";

export default function QuestionPage() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const q = await Admin.getInstance().getQuestions();
      setQuestions(q);
    };
    fetchQuestions();
  }, []);

  console.log(questions);

  // One Question | params = {question, key}
  function QuestionFragment(params) {
    const [canEdit, setCanEdit] = useState(false);
    const [modifiedQuestion, setModifiedQuestion] = useState(params.question);
    const [modifiedResponses, setModifiedResponses] = useState(
      modifiedQuestion.responses,
    );

    // the 4 responses : <ResponsesFragment>
    const ResponsesFragment = () => {
      const initialCorrect = modifiedResponses.findIndex(
        (response) => response.isCorrect,
      );

      const [correct, setCorrect] = useState(initialCorrect + "");
      /* a response from the 4 responses : <OneResponseFragment>
                params = {index,response}
      */
      const OneResponseFragment = (params) => {
        //
        // TOFIX
        // verify response.isCorrect exist (make sure that only one is correct)
        const handleCheckBoxChange = (index) => {
          //console.log("in:" + correct + " == ?" + index);
          setCorrect(index + "");
          setModifiedResponses(
            modifiedResponses.map((response, i) => ({
              ...response,
              isCorrect: i == parseInt(index),
            })),
          );
        };
        /*if (
          canEdit &&
          params.response.isCorrect != null &&
          params.response.isCorrect
        )
          setCorrect(String(params.index));*/

        return (
          <div>
            <input
              type="checkbox"
              checked={correct == String(params.index)}
              disabled={!canEdit}
              onChange={(e) => {
                console.log("out:" + correct + " == ?" + params.index);
                //console.log(modifiedResponses);
                handleCheckBoxChange(params.index);
              }}
            />
            <input
              disabled={!canEdit}
              defaultValue={params.response.response}
              onChange={(e) => {
                const tmpArray = modifiedResponses;
                tmpArray[params.index].response = e.target.value;
                setModifiedResponses(tmpArray);
              }}
            />
            <br />
          </div>
        );
      };

      return modifiedResponses.map((response, index) => {
        return <OneResponseFragment response={response} index={index} />;
      });
    };
    // modier button pressed
    const hadleModificationButton = () => {
      setCanEdit(!canEdit);
    };
    // supprimer button pressed
    const handleSupprimerQuestion = (params) => {
      console.log(params);
      const userDecision = window.confirm(
        "Are you sure you want to delete this question?\n" + params.question,
      );
      if (!userDecision) return;
      const tmpArray = questions.filter((item) => item != params);
      console.log(params);
      setQuestions(tmpArray);
      Admin.getInstance().supprimerQuestion(params.questionID);
    };
    // engesterement
    const handleEngesterement = (params) => {
      // putting modifiedQuestion + modifiedResponses in one array
      const newModifiedResponses = modifiedResponses.map((response) => {
        return {
          isCorrect: response.isCorrect,
          response: response.response,
        };
      });
      const newModifiedQuestion = {
        question: modifiedQuestion.question,
        language: modifiedQuestion.language,
        niveau: modifiedQuestion.niveau,
        responses: newModifiedResponses,
      };
      console.log(newModifiedQuestion);
      const userDecision = window.confirm(
        "Are you sure you want to modify this question?\n" + params.question,
      );
      if (!userDecision) return;

      Admin.getInstance().modifierQuestion({
        questionID: params.questionID,
        question: newModifiedQuestion,
      });
      setCanEdit(!canEdit);
    };

    return (
      <>
        <div
          id={params.key}
          style={{ border: "1px solid black", margin: "10px" }}
        >
          <input
            disabled={!canEdit}
            defaultValue={modifiedQuestion.language}
            onChange={(e) => {
              setModifiedQuestion({
                ...modifiedQuestion,
                language: e.target.value,
              });
            }}
          />
          <br />
          <input
            disabled={!canEdit}
            defaultValue={modifiedQuestion.niveau}
            onChange={(e) => {
              setModifiedQuestion({
                ...modifiedQuestion,
                niveau: e.target.value,
              });
            }}
          />
          <br />
          <input
            disabled={!canEdit}
            defaultValue={modifiedQuestion.question}
            onChange={(e) => {
              setModifiedQuestion({
                ...modifiedQuestion,
                question: e.target.value,
              });
            }}
          />
          <br />
          <ResponsesFragment />

          <button
            onClick={() => {
              hadleModificationButton();
            }}
          >
            {!canEdit ? "Modifier la Question" : "Annuler la Modification"}
          </button>
          {canEdit && (
            <button
              onClick={() => {
                console.log(modifiedQuestion);
                handleEngesterement(modifiedQuestion);
              }}
            >
              Engester la modification
            </button>
          )}
          <button
            disabled={canEdit}
            onClick={() => {
              console.log(modifiedQuestion.questionID);
              handleSupprimerQuestion(modifiedQuestion);
            }}
          >
            Supprimer Question
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Ajouter nouvel question :</h1>
      <NewQuestionFragment />
      <h1>Modifier ou supprimer les questions :</h1>
      {questions.map((question, index) => {
        //console.log(question + " aqsdqs " + index);
        return <QuestionFragment question={question} key={index} />;
      })}
    </>
  );
}

function NewQuestionFragment() {
  const [question, setQuestion] = useState({
    language: "",
    niveau: "",
    question: "",
    /* responses: [{isCorrect: false,response: "" }],  */
  });
  // on peut merger responses dans question (plus de travail)
  const [responses, setResponses] = useState([
    { isCorrect: false, response: "" },
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
      })),
    );
  };

  const handleResponseChange = (index, value) => {
    setResponses(
      responses.map((response, i) => ({
        ...response,
        response: i == index ? value : response.response,
      })),
    );
    console.log(responses);
  };

  const handleAjouterQuestion = (submitEvent) => {
    // must have to not refersh page
    submitEvent.preventDefault();
    const newQuestion = { ...question, responses };
    console.log(newQuestion);

    Admin.getInstance().ajouterQuestion(newQuestion);
    const AfterEmptyQuestion = {
      language: "",
      niveau: "",
      question: "",
    };
    const AfterEmptyResponses = responses.map(() => {
      return {
        isCorrect: false,
        response: "",
      };
    });
    setQuestion(AfterEmptyQuestion);
    setResponses(AfterEmptyResponses);
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
        style={{ width: "${text.lenght * 10}px" }}
      />
      <br />
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
        onChange={(e) => setQuestion({ ...question, language: e.target.value })}
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
