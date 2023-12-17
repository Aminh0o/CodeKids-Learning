import { db } from "../Config/config-firebase";
import {
  collection,
  getDocs,
  addDoc,
  limit,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import Question from "./Question";

export default class Admin {
  static #instance;
  docRef;
  questions = [];

  constructor() {
    if (Admin.#instance) throw new Error("New instance cannot be created!");
  }

  // params = {email, password}
  static async seIdentifier(params) {
    await getDocs(collection(db, "Admin"))
      .then((querySnapShot) => {
        if (!querySnapShot.empty) {
          querySnapShot.forEach((docSnapShot) => {
            if (
              docSnapShot.data().email == params.email &&
              docSnapShot.data().password == params.password
            ) {
              Admin.#instance = new Admin();
              console.log("login success");
            } else console.log("login filled");
          });
        }
      })
      .catch(() => {
        console.log("login filled");
      });
  }

  static deConnecter() {
    Admin.#instance = null;
  }

  static getInstance() {
    if (!Admin.#instance) {
      throw new Error("Instance does not exist!");
    }
    return Admin.#instance;
  }

  static createInstance() {
    Admin.#instance = new Admin();
  }

  static isAdminConnected() {
    return Admin.#instance != null;
  }

  /* params = 
  {
    questionId
    niveau,
    language,
    reponses={
      {reponse,isCorrect},
      {reponse,isCorrect},
      {reponse,isCorrect},
      {reponse,isCorrect}
    } 
  }
  */

  // max = number of questions to get
  async getQuestions(max) {
    this.questions = [];
    await getDocs(
      collection(db, "Questions"),
      max == -1 ? limit(999) : limit(max),
    )
      .then((querySnapShot) => {
        querySnapShot.forEach((docSnapShot) => {
          this.questions.push(
            new Question({
              questionId: docSnapShot.id,
              niveau: docSnapShot.data().niveau,
              language: docSnapShot.data().language,
              question: docSnapShot.data().question,
              responses: docSnapShot.data().responses,
            }),
          );
        });
      })
      .catch(() => {
        console.log("failled to load questions");
      });
    return this.questions;
  }
  // params = question {niveau, language, question, responses}
  async ajouterQuestion(params) {
    await addDoc(collection(db, "Questions"), params)
      .then(() => {
        console.log("Question ajoutéé");
      })
      .catch(() => {
        console.log("Question non ajouté avec echeck!");
      });
  }
  // params = { question , questionID }
  async modifierQuestion(params) {
    console.log(params);
    const docRef = doc(db, "Questions", params.questionID);
    //const question = params.question.filter();
    await updateDoc(docRef, params.question)
      .then(() => {
        console.log("Question modifiée");
      })
      .catch(() => {
        console.log("Question non modifiée avec echeck!");
      });
  }
  // params = {questionId, ...}
  async supprimerQuestion(params) {
    await deleteDoc(doc(db, "Questions", params))
      .then(() => {
        console.log("Question supprimée");
      })
      .catch(() => {
        console.log("Question non supprimée avec echeck!");
      });
  }
}
