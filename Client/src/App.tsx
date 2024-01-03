import { createContext, useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";
import User from "./BackEnd/User";
import RegisterPage from "./ClientSide/RegisterPage/RegisterPage";
import LoginPage from "./ClientSide/LoginPage/LoginPage";
import QCMPage from "./ClientSide/QCMPages/QCMPage";
import MainPage from "./ClientSide/MainPage/MainPage";
import Header from "./ClientSide/Header-Footer/Header";
import Footer from "./ClientSide/Header-Footer/Footer";
import ProfilePage from "./ClientSide/ProfilePage/ProfilePage";
import ForgottenPasswordPage from "./ClientSide/LoginPage/ForgottenPasswordPage";

export const UserContext = createContext([]);

export default function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const getUserFromStorage = async () => {
      const user = localStorage.getItem("user");
      console.log("user", user);

      if (user) {
        console.log("user", user);

        await User.createInstance(user);
        setConnected(true);
      }
    };
    getUserFromStorage();
  }, []);

  // need ForgetNumber
  /*
          <Route
            path="/ForgotPassword"
            element={<ForgottenPasswordPage />}
          />
  */
  return (
    <UserContext.Provider value={{ connected, setConnected }}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Register" element={<RegisterPage />} />
          <Route path="/Login" element={<LoginPage lastPage="/" />} />
          <Route path="/QCM" element={<QCMPage />} />
          <Route path="/Profile" element={<ProfilePage />} />
        </Routes>
      </Router>
      <Footer />
    </UserContext.Provider>
  );
}
