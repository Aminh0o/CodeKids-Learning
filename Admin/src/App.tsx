import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthPage from "./AdminSide/AuthPage/AuthPage";
import AdminMainPage from "./AdminSide/AdminMainPage/adminMainPage";
import QuestionPage from "./AdminSide/QuestionsPage/questionsPage";

import Admin from "./Backend/Admin.js";
import { useEffect } from "react";

export default function App() {
  const isSessionActive = localStorage.getItem("isAdminConnected");

  //localStorage.clear();
  if (isSessionActive) {
    // assign the admin instance from session
    //Admin.createInstance();
    <Navigate to="/home" />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />}></Route>
        <Route path="/home" element={<AdminMainPage />}></Route>
        <Route path="/questions" element={<QuestionPage />}></Route>
      </Routes>
    </Router>
  );
}
