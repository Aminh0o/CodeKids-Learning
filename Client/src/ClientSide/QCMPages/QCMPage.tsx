import { useState, createContext, useContext } from "react";
import QCM from "/src/BackEnd/QCM";
import CommancerQCM from "./CommancerQCM";
import CompleterQCM from "./CompleterQCM";
import FinQCM from "./FinQCM";
import User from "/src/BackEnd/User";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../App";
import "./QCMPage.css";

export const QCMContext = createContext({});

export default function QCMPage() {
  const { connected, setConnected } = useContext(UserContext);
  const [newQCM, setNewQCM] = useState(new QCM());
  const [etape, setEtape] = useState(0);

  const nextStep = () => {
    setEtape((prev) => Math.min(prev + 1, 2));
  };

  const CurrentPage = () => {
    switch (etape) {
      case 0:
        return <CommancerQCM />;
      case 1:
        return <CompleterQCM />;
      case 2:
        return <FinQCM />;
      default:
        return <span>ERROR</span>;
    }
  };

  const handleAnnuler = () => {
    User.getInstance().annulerQCM();
  };

  return (
    <QCMContext.Provider value={{ newQCM, setNewQCM, nextStep }}>
      <div className="top-continer">
        <Link onClick={() => handleAnnuler()} to="/">
          Annuler le QCM
        </Link>

        <CurrentPage />
      </div>
    </QCMContext.Provider>
  );
}
