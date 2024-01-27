import { auth, db } from "../Config/config-firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import User from "./User";

export default class Visiteur {
  // params : {email, password}
  static async seConnecter(params) {
    await signInWithEmailAndPassword(auth, params.email, params.password)
      .then(() => {
        console.log("SingIn success");
      })
      .catch(() => {
        console.log("SingIn failled");
      });
    await User.createInstance(auth.currentUser.uid);
    if (User.getInstance())
      if (params.remeberMe) localStorage.setItem("user", auth.currentUser.uid);
  }

  // params : {nom, prenom, dateNaissance, email, languagePrefere};
  static async creeCompte(params) {
    let res = null;
    // cree compte dans auth
    await createUserWithEmailAndPassword(
      auth,
      params.email,
      params.password
    ).catch((error) => {
      res = { status: false, error: error.message };
    });
    if (res) return res;
    // insirrer les valeurs dans firestore
    const newUser = doc(db, "Users", auth.currentUser.uid);
    await setDoc(newUser, {
      nom: params.nom,
      prenom: params.prenom,
      dateNaissance: params.dateNaissance,
      email: params.email,
      languagePrefere: params.languagePrefere,
    })
      .then(() => {
        res = { status: true };
      })
      .catch((error) => {
        res = { status: false, error: error.message };
      });
    await User.createInstance(auth.currentUser.uid);
    return res;
  }

  static async laisserAvis(avis) {
    addDoc(collection(db, "Avis"), avis)
      .then(() => {
        console.log("avis envoye");
      })
      .catch(() => {
        console.log("avis non envoye");
      });
  }
}
