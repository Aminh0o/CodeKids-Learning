import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../Config/config-firebase.js";
import User from "./User";

export default class QCM {
  niveau;
  language;
  questions = [];
  note = 0;

  // params = {niveau, language}
  // if you looing for QCm from firebase look FireBaseQCM.js (dont know why) 
  constructor(params) {
    this.niveau = params.niveau;
    this.language = params.language;
  }

  calculerNote() {
    this.questions.forEach((question) => {
      if (question.gotCorrect) this.note++;
    });
  }

  // params = {question,gotCorrect,indexOfAnswer}
  setGotCorrectQuestion(params) {
    let tmpQuestion = [];
    this.questions.forEach((question) => {
      if (question.questionID == params.question.questionID) {
        question.setGotCorrect(params.gotCorrect);
        question.setChosenResponse(params.indexOfAnswer);
      }
      tmpQuestion.push(question);
    });
    this.questions = tmpQuestion;
  }

  toFirebase() {
    let data = [];
    this.questions.forEach((question) => {
      data.push({
        questionID: question.questionID,
        question: question.question,
        gotCorrect: question.gotCorrect,
      });
    });
    return {
      niveau: this.niveau,
      language: this.language,
      note: this.note,
      questions: data,
      date: new Date(),
    };
  }

  saveQCM() {
    addDoc(
      collection(doc(db, "Users", User.getInstance().userID), "PastQCMs"),
      this.toFirebase(),
    )
      .then(() => {
        console.log("added to PastQCMs");
      })
      .catch(() => {
        console.log("failled to add to PastQCMs");
      });
  }
}
