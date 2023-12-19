import React, { useEffect, useState } from "react";
import Admin from "../../Backend/Admin.js";
import Question from "../../Backend/Question.js";
import NewQuestionFragment from "./NewQuestionFragment.js";

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
        const handleCheckBoxChange = (index) => {
          setCorrect(index + "");
          setModifiedResponses(
            modifiedResponses.map((response, i) => ({
              ...response,
              isCorrect: i == parseInt(index),
            })),
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

  const LoadedQuestions = () => {
    // No touching in ".?" or it break . NO TOUCH IN CODE !!!
    if (isLoading) return <span>Loading...</span>;
    if (questions?.length == 0) return <span>No questions found</span>;

    return (
      <>
        <span>il existe {questions?.length} questions</span>
        {questions?.map((question, index) => {
          return (
            <>
              <QuestionFragment question={question} key={index} />
            </>
          );
        })}
      </>
    );
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
        <LoadedQuestions />
      </div>
    </>
  );
}
