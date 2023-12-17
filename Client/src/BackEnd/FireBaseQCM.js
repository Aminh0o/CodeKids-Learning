import QCM from "./QCM";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  startAt,
  limit,
} from "firebase/firestore";
import { db } from "../Config/config-firebase.js";
import Question from "./Question";

export default class FireBaseQCM extends QCM {
  QCMID;

  constructor(params) {
    super();
    this.QCMID = params.id;
    this.niveau = params.niveau;
    this.language = params.language;
    this.getQuestions();
  }

  // get random questions for this QCM
  async getQuestions() {
    getDocs(
      query(
        collection(db, "Questions"),
        where("niveau", "==", this.niveau),
        where("language", "==", this.language),
      ),
    )
      .then((querySnapShot) => {
        const documents = querySnapShot.docs;

        // Shuffle the documents using Fisher-Yates algorithm
        for (let i = documents.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [documents[i], documents[j]] = [documents[j], documents[i]];
        }
        documents.slice(0, 20);

        documents.forEach((docSnapShot) => {
          this.questions.push(
            new Question({
              question: docSnapShot.data().question,
              questionID: docSnapShot.id,
              responses: docSnapShot.data().responses,
              niveau: docSnapShot.data().niveau,
              language: docSnapShot.data().language,
            }),
          );
        });
      })
      .catch(() => {
        console.log("failled to load questions into QCM");
      });
  }
}
