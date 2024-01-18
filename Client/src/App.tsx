import { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import User from "./BackEnd/User";
import RegisterPage from "./ClientSide/RegisterPage/RegisterPage";
import LoginPage from "./ClientSide/LoginPage/LoginPage";
import QCMPage from "./ClientSide/QCMPages/QCMPage";
import MainPage from "./ClientSide/MainPage/MainPage";
import Header from "./ClientSide/Header-Footer/Header";
import Footer from "./ClientSide/Header-Footer/Footer";
import ProfilePage from "./ClientSide/ProfilePage/ProfilePage";

export const UserContext = createContext([]);

export default function App() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    const getUserFromStorage = async () => {
      const user = localStorage.getItem("user");
      if (user && User.getInstance() == null) {
        await User.createInstance(user);
        setConnected(true);
        console.log(User.getInstance());
        
      }
      setConnecting(false);
    };
    getUserFromStorage();
  }, []);
  return (
    <UserContext.Provider value={{ connected, setConnected }}>
      <Router>
        {connecting && <div>Connecting ...</div>}
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
