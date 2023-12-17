import { createContext, useContext, useState } from "react";
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

export const UserContext = createContext([]);

export default function App() {
  const [connected, setConnected] = useState(false);
  return (
    <UserContext.Provider value={{ connected, setConnected }}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Register" element={<RegisterPage />} />
          <Route path="/Login" element={<LoginPage lastPage="/" />} />
          <Route path="/QCM" element={<QCMPage />} />
        </Routes>
      </Router>
      <Footer />
    </UserContext.Provider>
  );
}
