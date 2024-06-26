import "./adminMainPage.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { } from "react-router-dom";

import Admin from "../../Backend/Admin.js";

import AuthPage from "../AuthPage/authPage";
import QuestionPage from "../QuestionsPage/questionsPage";
import AvisPage from "../AvisPage/AvisPage";
import ComptesPage from "../ComptesPage/ComptesPage";

export default function AdminMainPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(-1);
  const [connected, setConnected] = useState(Admin.isAdminConnected());

  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected]);

  // Disconnecting
  const handleLogout = () => {
    Admin.deConnecter();
    navigate("/");
  };

  // opne current page
  const setCurrentPage = () => {
    switch (page) {
      case 0:
        return <></>;
      case 1:
        return <ComptesPage />;
      case 2:
        return <QuestionPage />;
      case 3:
        return <AvisPage />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <div id="wrapper">
        <div className="navbar navbar-inverse navbar-fixed-top">
          <div className="adjust-nav">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle"
                data-toggle="collapse"
                data-target=".sidebar-collapse"
              >
                <i className="fa fa-bars"></i>
              </button>
              <a className="navbar-brand" href="#">
                CodeKids
              </a>
            </div>
            <div className="top-middle-container">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <nav className="navbar-default navbar-side" role="navigation">
          <div className="sidebar-collapse">
            <ul className="nav" id="main-menu">
              <li className="text-center user-image-back">
                <div class="user-profile-picture">
                  <img src="./src/Imgs/find_user.png" alt="Profile Picture" className="img-responsive" />
                </div>
              </li>
              <li>
                <a href="#Comptes" onClick={() => setPage(1)}>
                  <i className="fa fa-edit "></i>
                  <span>Comptes</span>
                </a>
              </li>
              <li>
                <a href="#Questions" onClick={() => setPage(2)}>
                  <i className="fa fa-table "></i>
                  <span>Questions</span>
                </a>
              </li>
              <li>
                <a href="#Avis" onClick={() => setPage(3)}>
                  <i className="fa fa-edit "></i>
                  <span>Avis</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div id="page-wrapper">{setCurrentPage()}</div>
    </>
  );
}

function AdminComptes() {
  return (
    <>
      <section className="col-md-12 mt-3 pt-3 mb-3" id="sectionComptes">
        <h2>Gérer les comptes des utilisateurs</h2>
        <ul>
          <li>
            <a href="#" className="text-decoration-none">
              Ajouter un compte
            </a>
          </li>
          <li>
            <a href="#" className="text-decoration-none">
              Modifier un compte
            </a>
          </li>
          <li>
            <a href="#" className="text-decoration-none">
              Supprimer un compte
            </a>
          </li>
        </ul>
        <div className="row">
          <div className="col-md-5 col-sm-5 col-xs-6">
            <h5>Les comptes enregistres</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="success">
                    <td>1</td>
                    <td>Amine</td>
                    <td>Bouchaour</td>
                    <td>@aminho</td>
                  </tr>
                  <tr className="info">
                    <td>1</td>
                    <td>Amine</td>
                    <td>Bouchaour</td>
                    <td>@aminho</td>
                  </tr>
                  <tr className="warning">
                    <td>1</td>
                    <td>Amine</td>
                    <td>Bouchaour</td>
                    <td>@aminho</td>
                  </tr>
                  <tr className="danger">
                    <td>1</td>
                    <td>Amine</td>
                    <td>Bouchaour</td>
                    <td>@aminho</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
function AdminAvis() {
  return (
    <>
      <section className="col-md-12" id="sectionAvis">
        <h2>Gérer les avis</h2>
        <ul>
          <li>
            <a href="#" className="text-decoration-none">
              Ajouter un avis
            </a>
          </li>
          <li>
            <a href="#" className="text-decoration-none">
              Modifier un avis
            </a>
          </li>
          <li>
            <a href="#" className="text-decoration-none">
              Supprimer un avis
            </a>
          </li>
        </ul>
        <div className="col-md-12">
          <h5>Avis Disponibles</h5>
          <div className="panel-group" id="accordion">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a
                    data-toggle="collapse"
                    data-parent="#accordion"
                    href="#collapseOne"
                    className="collapsed"
                  >
                    Sujet d'avis
                  </a>
                </h4>
              </div>
              <div id="collapseOne" className="panel-collapse collapse">
                <div className="panel-body">thya real</div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a
                    data-toggle="collapse"
                    data-parent="#accordion"
                    href="#collapseTwo"
                  >
                    Sujet d'avis
                  </a>
                </h4>
              </div>
              <div id="collapseTwo" className="panel-collapse in">
                <div className="panel-body">Thya real</div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">
                  <a
                    data-toggle="collapse"
                    data-parent="#accordion"
                    href="#collapseThree"
                    className="collapsed"
                  >
                    Sujet d'avis
                  </a>
                </h4>
              </div>
              <div id="collapseThree" className="panel-collapse collapse">
                <div className="panel-body">Thya real</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
