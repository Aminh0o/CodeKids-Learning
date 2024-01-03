import { signOut } from "firebase/auth";
import { auth, db } from "../Config/config-firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  where,
  query,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import QCM from "./QCM";
import Question from "./Question.js";

export default class User {
  static #instance;

  nom;
  prenom;
  email;
  userID;
  dateNaissance;
  languagePrefere;
  currentQCM;
  finalQCM;
  QCMs = [];
  isFetchingActive = false;

  // constructor params = {nom, email, id, prenom, dateNaissance, languagePrefere}
  constructor(params) {
    this.nom = params.nom;
    this.prenom = params.prenom;
    this.email = params.email;
    this.userID = params.id;
    this.dateNaissance = params.dateNaissance;
    this.languagePrefere = params.languagePrefere;
  }

  static async createInstance(id) {
    if (User.#instance) throw new Error("New instance cannot be created!");
    const docRef = doc(db, "Users", id);

    await getDoc(docRef).then((docSnapShot) => {
      if (!docSnapShot.exists)
        throw new Error("User isnt connected to AUTH service!");
      User.#instance = new User({
        nom: docSnapShot.data().nom,
        email: docSnapShot.data().email,
        id: docSnapShot.id,
        prenom: docSnapShot.data().prenom,
        dateNaissance: docSnapShot.data().dateNaissance,
        languagePrefere: docSnapShot.data().languagePrefere,
      });
    });

    // TOFIX : Look chatGBT
  }

  static getInstance() {
    //if (!User.#instance) User.#instance = new User();
    return User.#instance;
  }

  static isUserConnected() {
    return User.#instance ? true : false;
  }

  static userExist() {
    return User.#instance ? true : false;
  }

  static async deConnecter() {
    await signOut(auth);
    User.#instance = null;
  }

  // params = updatedData = { nom,prenom,languagePrefere }
  async updateInfo(updatedData) {
    console.log(updatedData);
    await updateDoc(doc(db, "Users", this.userID), {
      nom: updatedData.nom,
      prenom: updatedData.prenom,
      languagePrefere: updatedData.languagePrefere,
    })
      .then(() => {
        console.log("updated");
      })
      .catch(() => {
        console.log("failled to update");
      });
    this.nom = updatedData.nom;
    this.prenom = updatedData.prenom;
    this.languagePrefere = updatedData.languagePrefere;
  }

  // params = {niveau, language}

  async commancerQCM(params) {
    this.currentQCM = new QCM();
    this.currentQCM.niveau = params.niveau;
    this.currentQCM.language = params.language;
    await getDocs(
      query(
        collection(db, "Questions"),
        where("niveau", "==", params.niveau),
        where("language", "==", params.language)
      )
    )
      .then((querySnapShot) => {
        let documents = querySnapShot.docs;

        // Shuffle the documents using Fisher-Yates algorithm
        for (let i = documents.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [documents[i], documents[j]] = [documents[j], documents[i]];
        }
        // TOCHANGE
        documents = documents.slice(0, 5);
        console.log(documents);
        documents.forEach((documents) => {
          this.currentQCM.questions.push(
            new Question({
              questionId: documents.id,
              niveau: params.niveau,
              language: params.language,
              question: documents.data().question,
              responses: documents.data().responses,
            })
          );
        });
      })
      .catch(() => {
        console.log("failled to get questions");
      });
  }

  static async resetPassword(email) {
    await sendPasswordResetEmail(email);
  }

  annulerQCM() {
    this.currentQCM = null;
  }

  terminerQCM() {
    this.finalQCM = this.currentQCM;
    this.currentQCM = null;
    this.finalQCM.calculerNote();
  }

  async getQCMHistory() {
    if (this.isFetchingActive) return;
    console.log(this.QCMs);
    this.QCMs = [];
    this.isFetchingActive = true;
    await getDocs(collection(doc(db, "Users", this.userID), "PastQCMs"))
      .then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          let pastQCM = new QCM();
          pastQCM.niveau = doc.data().niveau;
          pastQCM.language = doc.data().language;
          pastQCM.questions = doc.data().questions;
          pastQCM.note = doc.data().note;
          pastQCM.date = doc.data().date;
          this.QCMs.push(pastQCM);
        });
        console.log(this.QCMs);
      })
      .catch(() => {
        console.log("failled to get past QCMs");
      });
    this.isFetchingActive = false;
  }

  calculerMoyen() {
    let sum = 0;
    this.QCMs.map((QCM) => {
      sum += QCM.note;
    });
    return sum / this.QCMs.length;
  }
}
