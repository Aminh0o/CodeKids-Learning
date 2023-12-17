import { signOut } from "firebase/auth";
import { auth, db } from "../Config/config-firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  addDoc,
  where,
  query,
} from "firebase/firestore";
import QCM from "./QCM";
import FireBaseQCM from "./FireBaseQCM.js";
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

  // constructor params = {nom, email, id, prenom, dateNaissance, languagePrefere}
  constructor(params) {
    if (User.#instance) throw new Error("New instance cannot be created!");
    this.docRef = doc(db, "Users", auth.currentUser.uid);
    getDoc(this.docRef).then((doc) => {
      if (!doc.exists) throw new Error("User isnt connected to AUTH service!");
      this.nom = params.nom;
      this.email = params.email;
      this.userID = params.id;
      this.prenom = params.prenom;
      this.dateNaissance = params.dateNaissance;
      this.languagePrefere = params.languagePrefere;
    });
  }

  static async createInstance(id) {
    if (User.#instance) throw new Error("New instance cannot be created!");
    const docRef = doc(db, "Users", id);

    const docSnapShot = await getDoc(docRef);

    User.#instance = new User({
      nom: docSnapShot.data().nom,
      email: docSnapShot.data().email,
      id: docSnapShot.id,
      prenom: docSnapShot.data().prenom,
      dateNaissance: docSnapShot.data().dateNaissance,
      languagePrefere: docSnapShot.data().languagePrefere,
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

  // params = {niveau, language}
  async commancerQCM(params) {
    this.currentQCM = new QCM();
    this.currentQCM.niveau = params.niveau;
    this.currentQCM.language = params.language;
    await getDocs(
      query(
        collection(db, "Questions"),
        where("niveau", "==", params.niveau),
        where("language", "==", params.language),
      ),
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
            }),
          );
        });
      })
      .catch(() => {
        console.log("failled to get questions");
      });
  }

  annulerQCM() {
    this.currentQCM = null;
  }

  terminerQCM() {
    this.finalQCM = this.currentQCM;
    this.currentQCM = null;
    this.finalQCM.calculerNote();
  }

  laisserAvis() {}

  getQCMHistory() {}
}
