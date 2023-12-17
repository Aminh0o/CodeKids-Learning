import { useNavigate } from "react-router-dom";
export default function TestButtons() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate("/Register")}>Register</button>
      <button onClick={() => navigate("/Login")}>Login</button>
      <button onClick={() => navigate("/QCM")}>Commnacer Le QCM</button>
    </>
  );
}
