import React, { useEffect, useState } from "react";
import Admin from "../../Backend/Admin.js";
import Question from "../../Backend/Question.js";
import NewQuestionFragment from "./NewQuestionFragment.js";
// documuntaion about CodeEditor : https://uiwjs.github.io/react-textarea-code-editor/
import CodeEditor from "@uiw/react-textarea-code-editor";

export default function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilters, setsearchFilters] = useState({
    language: "",
    niveau: "",
    question: "",
  });
  //const [canResetSearch, setCanResetSearch] = useState(false);

  // One Question | params = {question, key} | usedVar/Func = {}
  function QuestionFragment(params) {
    const [canEdit, setCanEdit] = useState(false);
    const [modifiedQuestion, setModifiedQuestion] = useState(params.question);
    const [modifiedResponses, setModifiedResponses] = useState(
      modifiedQuestion.responses
    );

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
          <div>
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
    const handleSupprimerQuestion = (params) => {
      const userDecision = window.confirm(
        "Are you sure you want to delete this question?\n" + params.question
      );
      if (!userDecision) return;
      const tmpArray = questions.filter((item) => item != params);
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
        code: modifiedQuestion.code,
      };
      const userDecision = window.confirm(
        "Are you sure you want to modify this question?\n" + params.question
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
            disabled={!canEdit}
            defaultValue={modifiedQuestion.question}
            type="textarea"
            onChange={(e) => {
              setModifiedQuestion({
                ...modifiedQuestion,
                question: e.target.value,
              });
            }}
          />
          <br />
          <label> code associé : </label>
          <CodeEditor
            disabled={!canEdit}
            value={modifiedQuestion.code}
            language={modifiedQuestion.language.toLowerCase()}
            onChange={(evn) => {
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
              Engester la modification
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
      <h1>Ajouter nouvel question :</h1>
      <NewQuestionFragment setQuestions={setQuestions} questions={questions} />
      <h1>Modifier ou supprimer les questions :</h1>
      <div>
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
          <button onClick={(e) => handleChercherQuestions(e)}>Chercher</button>
          <button onClick={(e) => handleResetSearch(e)}>
            Reset les questions
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
