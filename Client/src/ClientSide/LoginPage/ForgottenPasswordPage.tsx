import { useState } from "react";
import User from "/src/BackEnd/User";
import { isSignInWithEmailLink } from "firebase/auth";
import { auth } from "/src/Config/config-firebase";

export default function ForgottenPasswordPage() {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    const emailExists = async (email) => {
      try {
        return isSignInWithEmailLink(auth, email);
        
      } catch (error) {
        console.log("Error");
      }
    };
    console.log(await emailExists("tmp@gmail.com"));

    await User.resetPassword(email);
    console.log("Reset Email sent .Check your Email");
  };
  return (
    <div>
      <label>Enter your email :</label>
      <input type="email" onInput={(e) => setEmail(e.target.value)} />
      <button
        onClick={() => {
          handleResetPassword();
        }}
      >
        Reset my password
      </button>
    </div>
  );
}
