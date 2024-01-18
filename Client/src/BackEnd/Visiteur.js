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
    if (params.remeberMe) localStorage.setItem("user", auth.currentUser.uid);
  }

  // params : {nom, prenom, dateNaissance, email, languagePrefere};
  static async creeCompte(params) {
    // cree compte dans auth
    await createUserWithEmailAndPassword(auth, params.email, params.password);
    // insirrer les valeurs dans firestore
    const newUser = doc(db, "Users", auth.currentUser.uid);
    await setDoc(newUser, {
      //username: params.username,
      nom: params.nom,
      prenom: params.prenom,
      dateNaissance: params.dateNaissance,
      email: params.email,
      languagePrefere: params.languagePrefere,
    })
      .then(() => {
        console.log("SingUp success");
      })
      .catch(() => {
        console.log("SingUp failled");
      });
    await User.createInstance(auth.currentUser.uid);
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
