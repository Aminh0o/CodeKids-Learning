import { db } from "../Config/config-firebase";
import {
  collection,
  getDocs,
  addDoc,
  limit,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import Question from "./Question";
import Avis from "./Avis";
import User from "./User";

export default class Admin {
  static #instance;
  docRef;
  questions = [];
  avis = [];
  users = [];
  isFetchingActive = false;

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

  // max = number of questions to get
  async getQuestions(max) {
    if (this.isFetchingActive) return;
    this.isFetchingActive = true;

    this.questions = [];
    await getDocs(
      collection(db, "Questions"),
      max == -1 ? limit(50) : limit(max),
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
    this.isFetchingActive = false;
    return this.questions;
  }
  // params = max,niveau,language
  getQuestionsFiltered(params) {
    const filteredQuestions = this.questions.filter((question) => {
      return (
        (params.niveau == "" || question.niveau == params.niveau) &&
        (params.language == "" || question.language == params.language)
      );
    });
    return filteredQuestions;
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

  async getAvis() {
    if (this.isFetchingActive) return;
    this.isFetchingActive = true;
    this.avis = [];
    await getDocs(collection(db, "Avis"))
      .then((querySnapShot) => {
        querySnapShot.forEach((docSnapShot) => {
          this.avis.push(
            new Avis({
              nom: docSnapShot.data().nom,
              email: docSnapShot.data().email,
              message: docSnapShot.data().message,
              sujet: docSnapShot.data().sujet,
              id: docSnapShot.id,
            }),
          );
        });
      })
      .catch(() => {
        console.log("failled to load avis");
      });
    this.isFetchingActive = false;
    return this.avis;
  }

  // params = {id,...avis}
  async markAsSeen(params) {
    await updateDoc(doc(db, "Avis", params.id), {
      seen: true,
    })
      .then(() => {
        console.log("Avis marked as seen");
      })
      .catch(() => {
        console.log("failled to mark as seen");
      });
  }

  async getUsers() {
    if (this.isFetchingActive) return;
    this.isFetchingActive = true;
    this.users = [];
    await getDocs(collection(db, "Users"))
      .then((querySnapShot) => {
        querySnapShot.forEach((docSnapShot) => {
          this.users.push(
            new User({
              id: docSnapShot.id,
              email: docSnapShot.data().email,
              nom: docSnapShot.data().nom,
              prenom: docSnapShot.data().prenom,
              dateNaissance: docSnapShot.data().dateNaissance,
              languagePrefere: docSnapShot.data().languagePrefere,
            }),
          );
        });
      })
      .catch(() => {
        console.log("failled to load users");
      });
    this.isFetchingActive = false;
    const unbannedUsers = this.users.filter((user) => {
      return user.banned ? false : true;
    });
    return unbannedUsers;
  }

  // params = {id,...user}
  async banUser(params) {
    console.log(params);
    await updateDoc(doc(db, "Users", params.id), {
      banned: true,
    })
      .then(() => {
        console.log("User banned");
      })
      .catch(() => {
        console.log("failled to ban user");
      });
  }
}
