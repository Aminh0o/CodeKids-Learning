import QCM from "./QCM";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Config/config-firebase.js";
import Question from "./Question";

// not in use
export default class FireBaseQCM extends QCM {
  QCMID;
  date;

  constructor(params) {
    super({ niveau: params.niveau, language: params.language });
    this.QCMID = params.id;
    this.date = params.date;
    this.getQuestions();
  }
  // get random questions for this QCM
  // appartly it is not used (dublicated in User.commancerQCM) HAHA
  async getQuestions() {
    await getDocs(
      query(
        collection(db, "Questions"),
        where("niveau", "==", this.niveau),
        where("language", "==", this.language)
      )
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
              code: docSnapShot.data().code,
            })
          );
        });
      })
      .catch(() => {
        console.log("failled to load questions into QCM");
      });
  }
}
