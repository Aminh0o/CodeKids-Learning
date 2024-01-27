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
import Avis from "./Avis";
import User from "./User";

const NOTYET = -1,
  LOADING = 0,
  OK = 1,
  ERROR = 2;

export default class Admin {
  static #instance;
  docRef;
  questions = [];
  avis = [];
  users = [];
  isFetchingActive = false;

  constructor() {
    if (Admin.#instance)
      throw new Error("New instance cannot be created again!");
  }

  // params = {email, password , rememberMe}
  static async seIdentifier(params) {
    let res;
    await getDocs(collection(db, "Admin"))
      .then((querySnapShot) => {
        if (querySnapShot.empty) throw new Error("Admin n'existe pas");
        querySnapShot.forEach((docSnapShot) => {
          if (
            docSnapShot.data().email == params.email &&
            docSnapShot.data().password == params.password
          ) {
            Admin.#instance = new Admin();
            if (params.rememberMe) localStorage.setItem("connected", "true");
            res = { state: OK, message: "Success" };
          } else {
            res = {
              state: ERROR,
              message: "Your email/password are wrong",
            };
          }
        });
      })
      .catch(() => {
        res = { state: ERROR, message: "Login failled . retry later" };
      });
    return res;
  }

  static deConnecter() {
    Admin.#instance = null;
    localStorage.removeItem("connected");
  }

  static getInstance() {
    if (!Admin.#instance) {
      throw new Error("Instance does not exist!");
    }
    return Admin.#instance;
  }

  static isAdminConnected() {
    const getAdminFromLS = localStorage.getItem("connected");
    // rani 3aref 'true' rah m9awda
    if (getAdminFromLS == "true" && Admin.#instance == null)
      Admin.#instance = new Admin();
    return Admin.#instance != null;
  }

  // max = number of questions to get
  async getQuestions(max) {
    if (this.isFetchingActive) return;
    this.isFetchingActive = true;

    this.questions = [];
    await getDocs(
      collection(db, "Questions"),
      max == -1 ? limit(50) : limit(max)
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
              code: docSnapShot.data().code,
            })
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
    let res;
    await addDoc(collection(db, "Questions"), params)
      .then(() => {
        res = {
          state: OK,
          message: "success",
        };
      })
      .catch(() => {
        res = {
          state: ERROR,
          message: "Error . failed at adding the question",
        };
      });
    return res;
  }
  // params = { question , questionID }
  async modifierQuestion(params) {
    let res;
    const docRef = doc(db, "Questions", params.questionID);
    //const question = params.question.filter();
    await updateDoc(docRef, params.question)
      .then(() => {
        res = { state: OK, message: "question Modified" };
      })
      .catch(() => {
        res = { state: ERROR, message: "failed to modify question" };
      });
    return res;
  }
  // params = {questionId, ...}
  async supprimerQuestion(params) {
    let res;
    await deleteDoc(doc(db, "Questions", params))
      .then(() => {
        res = { state: OK, message: "question deleted" };
      })
      .catch(() => {
        res = { state: ERROR, message: "failed to delete question" };
      });
    return res;
  }

  async getAvis(seen) {
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
              seen: docSnapShot.data().seen,
            })
          );
        });
      })
      .catch(() => {
        console.log("failled to load avis");
      });
    this.isFetchingActive = false;
    const filtredAvis = this.avis.filter((avis) => {
      return seen ? avis.seen : !avis.seen;
    });
    return filtredAvis;
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

  // params = banned
  async getUsers(banned) {
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
              banned: docSnapShot.data().banned,
            })
          );
        });
      })
      .catch(() => {
        console.log("failled to load users");
      });

    this.isFetchingActive = false;
    const filtredUsers = this.users.filter((user) => {
      return banned ? user.banned : !user.banned;
    });
    return filtredUsers;
  }

  // params = {id,...user}
  async banUser(params) {
    let res;
    await updateDoc(doc(db, "Users", params.id), {
      // HAHA
      banned: !params.banned,
    })
      .then(() => {
        res = {
          state: OK,
          message: "User " + (!params.banned ? "banned" : "unbanned"),
        };
      })
      .catch(() => {
        res = {
          state: ERROR,
          message: "Failed to " + (params.banned ? "bann" : "unban") + " user",
        };
      });
    return res;
  }

  async deleteAvis(id) {
    let res;
    await deleteDoc(doc(db, "Avis", id))
      .then(() => {
        this.avis.filter((avis) => {
          return avis.id != id;
        });
        res = {
          state: OK,
          message: "Avis deleted",
        };
      })
      .catch(() => {
        res = {
          state: ERROR,
          message: "Failed to delete avis",
        };
      });
    return res;
  }
}
