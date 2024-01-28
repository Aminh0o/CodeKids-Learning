import React, { useEffect, useRef, useState } from "react";
import Admin from "../../Backend/Admin.js";
import NewQuestionFragment from "./NewQuestionFragment.js";
// documuntaion about CodeEditor : https://uiwjs.github.io/react-textarea-code-editor/
import CodeEditor from "@uiw/react-textarea-code-editor";

import LoadingGif from "/src/Imgs/loading.gif";
import ErrorGif from "/src/Imgs/error.gif";
import DoneGif from "/src/Imgs/ok.gif";

const NOTYET = -1,
  LOADING = 0,
  OK = 1,
  ERROR = 2;

export default function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updateState, setUpdateState] = useState({
    state: NOTYET,
    message: "",
    index: -1,
  });
  const [searchFilters, setsearchFilters] = useState({
    language: "",
    niveau: "",
    question: "",
  });
  //const [canResetSearch, setCanResetSearch] = useState(false);

  // One Question | params = {question, index}
  function QuestionFragment(params) {
    const [canEdit, setCanEdit] = useState(false);
    const [modifiedQuestion, setModifiedQuestion] = useState(params.question);
    const [modifiedResponses, setModifiedResponses] = useState(
      modifiedQuestion.responses
    );
    const questionIndex = params.index;

    const StateGif = () => {
      return (
        <>
          {params.index != updateState.index ? (
            <></>
          ) : updateState.state == NOTYET ? (
            <></>
          ) : updateState.state == LOADING ? (
            <>
              <img className="StateImg" src={LoadingGif} alt="" />
            </>
          ) : updateState.state == OK ? (
            <>
              <img className="StateImg" src={DoneGif} alt="" />
              <span>{updateState.message}</span>
            </>
          ) : (
            <>
              <img className="StateImg" src={ErrorGif} alt="" />
              <span>{updateState.message}</span>
            </>
          )}
        </>
      );
    };
    // For automatic input size (works only on question input)
    // TOFIX : put in useEffect
    const inputRef = useRef<HTMLInputElement>(null);
    const setInputLength = () => {
      if (inputRef.current) {
        const length = inputRef.current.value.length;
        inputRef.current.style.width =
          length > 19 ? length * 8 + "px" : "150px";
      }
    };
    setInputLength();
    const handleInputChange = (e) => {
      // update the state + the length
      setModifiedQuestion({ ...modifiedQuestion, question: e.target.value });
      if (inputRef.current) {
        const length = inputRef.current.value.length;
        inputRef.current.style.width =
          length > 19 ? length * 8 + "px" : "150px";
      }
    };
    // the 4 responses : <ResponsesFragment>
    const ResponsesFragment = () => {
      const initialCorrect = modifiedResponses.findIndex(
        (response) => response.isCorrect
      );

      const [correct, setCorrect] = useState(initialCorrect + "");
      /* a response from the 4 responses : <OneResponseFragment>
                params = {index,response}
      */
      const OneResponseFragment = (params) => {
        const handleCheckBoxChange = (index) => {
          setCorrect(index + "");
          setModifiedResponses(
            modifiedResponses.map((response, i) => ({
              ...response,
              isCorrect: i == parseInt(index),
            }))
          );
        };

        return (
          <div className="Response">
            <input
              type="checkbox"
              checked={correct == String(params.index)}
              disabled={!canEdit}
              onChange={() => {
                handleCheckBoxChange(params.index);
              }}
            />
            <input
              disabled={!canEdit}
              defaultValue={params.response.response}
              onInput={(e) => {
                const tmpArray = modifiedResponses;
                tmpArray[params.index].response = e.target.value;
                setModifiedResponses(tmpArray);
              }}
            />
          </div>
        );
      };

      return modifiedResponses.map((response, index: number) => {
        return (
          <OneResponseFragment response={response} index={index} key={index} />
        );
      });
    };
    // modier button pressed
    const hadleModificationButton = () => {
      setCanEdit(!canEdit);
    };

    // supprimer button pressed
    const handleSupprimerQuestion = async (modifiedQuestion) => {
      const userDecision = window.confirm(
        "Are you sure you want to delete this question?\n" +
          modifiedQuestion.question
      );
      setUpdateState({ state: LOADING, message: "", index: questionIndex });

      if (!userDecision) return;
      const res = await Admin.getInstance().supprimerQuestion(
        modifiedQuestion.questionID
      );
      setUpdateState({ ...res, index: questionIndex });

      setTimeout(() => {
        setUpdateState({ state: NOTYET, message: "", index: -1 });
        if (res.state == OK) {
          const tmpArray = questions.filter((item) => item != modifiedQuestion);
          setQuestions(tmpArray);
        }
      }, 4000);
    };
    // engesterement
    const handleEngesterement = async (params) => {
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
        code: modifiedQuestion.code,
      };
      const userDecision = window.confirm(
        "Are you sure you want to modify this question?\n" + params.question
      );
      if (!userDecision) return;
      setUpdateState({ state: LOADING, message: "", index: questionIndex });
      const res = await Admin.getInstance().modifierQuestion({
        questionID: params.questionID,
        question: newModifiedQuestion,
      });
      setUpdateState({ ...res, index: questionIndex });

      setCanEdit(!canEdit);
      setTimeout(() => {
        setUpdateState({ state: NOTYET, message: "", index: -1 });
      }, 4000);
    };

    return (
      <>
        <div
          id={params.index}
          style={{ border: "1px solid black", margin: "10px" }}
        >
          <select
            disabled={!canEdit}
            defaultValue={modifiedQuestion.language}
            onChange={(e) => {
              setModifiedQuestion({
                ...modifiedQuestion,
                language: e.target.value,
              });
            }}
          >
            <option value="C">C</option>
            <option value="Java">Java</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
          </select>
          <br />
          <select
            disabled={!canEdit}
            defaultValue={modifiedQuestion.niveau}
            onChange={(e) =>
              setModifiedQuestion({
                ...modifiedQuestion,
                niveau: e.target.value,
              })
            }
          >
            <option value="facile">facile</option>
            <option value="moyen">moyen</option>
            <option value="difficile">difficile</option>
          </select>
          <br />
          <input
            ref={inputRef}
            disabled={!canEdit}
            defaultValue={modifiedQuestion.question}
            type="textarea"
            onInput={(e) => {
              handleInputChange(e);
            }}
          />
          <br />
          <label> Le code associé : </label>
          <CodeEditor
            disabled={!canEdit}
            value={modifiedQuestion.code}
            language={modifiedQuestion.language.toLowerCase()}
            onInput={(evn) => {
              setModifiedQuestion({
                ...modifiedQuestion,
                code: evn.target.value,
              });
            }}
            data-color-mode="light"
            style={{
              fontSize: 17,
            }}
          />
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
                handleEngesterement(modifiedQuestion);
              }}
            >
              Enregistrer la modification
            </button>
          )}
          <button
            disabled={canEdit}
            onClick={() => {
              handleSupprimerQuestion(modifiedQuestion);
            }}
          >
            Supprimer Question
          </button>
          <StateGif />
        </div>
      </>
    );
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      const tmpQuestions = await Admin.getInstance().getQuestions();
      setQuestions(tmpQuestions);
      setIsLoading(false);
    };
    fetchQuestions();
  }, []);

  const handleChercherQuestions = (e) => {
    e.preventDefault();
    const filteredQuestions = Admin.getInstance().getQuestionsFiltered({
      max: -1,
      ...searchFilters,
    });
    setQuestions(filteredQuestions);
    //setCanResetSearch(true);
  };

  const handleResetSearch = (e) => {
    e.preventDefault();
    setQuestions(Admin.getInstance().questions);
    //setCanResetSearch(false);
  };

  return (
    <>
      <h1 id="questionText">Ajouter une nouvelle question :</h1>
      <NewQuestionFragment setQuestions={setQuestions} questions={questions} />
      <h1 id="questionText">Modifier ou supprimer les questions :</h1>
      <div className="questionModifForm">
        <form>
          <select
            defaultValue={""}
            onChange={(e) =>
              setsearchFilters({ ...searchFilters, niveau: e.target.value })
            }
          >
            <option value="">All levels</option>
            <option value="facile">facile</option>
            <option value="moyen">moyen</option>
            <option value="difficile">difficile</option>
          </select>
          <select
            defaultValue={""}
            onChange={(e) =>
              setsearchFilters({ ...searchFilters, language: e.target.value })
            }
          >
            <option value="">All languages</option>
            <option value="C">C</option>
            <option value="Java">Java</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
          </select>
          <button
            onClick={(e) => handleChercherQuestions(e)}
            id="questionModifButton"
          >
            Chercher
          </button>
          <button
            onClick={(e) => handleResetSearch(e)}
            id="questionModifButton"
          >
            Réinitialiser les questions
          </button>
        </form>
        {isLoading ? (
          <span>Loading...</span>
        ) : questions?.length == 0 ? (
          <span>No questions found</span>
        ) : (
          <>
            <span>il existe {questions?.length} questions</span>
            {questions?.map((question, index) => {
              return (
                <>
                  <QuestionFragment
                    question={question}
                    key={index}
                    index={index}
                  />
                </>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
