import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useContext, useState, useCallback } from "react";
import { AppContext } from "../../App";
import { Link, useHistory } from "react-router-dom";
import background from "./background.jpg";

const HomePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { userToken, setUserToken } = useContext(AppContext);

  let navOptions;
  if (!userToken) {
    navOptions = (
      <>
        <Nav.Link className="d-flex align-items-center" onClick={() => setShowRegisterModal(true)}>
          Sign Up
        </Nav.Link>
        <Nav.Link onClick={() => setShowLoginModal(true)}>
          <Button variant="primary">Sign In</Button>
        </Nav.Link>
      </>
    );
  } else {
    navOptions = (
      <>
        <Nav.Link
          className="d-flex align-items-center"
          onClick={() => {
            localStorage.removeItem("userToken");
            setUserToken(null);
          }}
        >
          Log Out
        </Nav.Link>
        <Nav.Link>
          <Link to="admin/polls">
            <Button variant="primary">My Polls</Button>
          </Link>
        </Nav.Link>
        <Nav.Link>
          <Link to="admin/create">
            <Button variant="success">Create</Button>
          </Link>
        </Nav.Link>
      </>
    );
  }

  const history = useHistory();

  const getStarted = useCallback(() => {
    if (!userToken) {
      setShowRegisterModal(true);
    } else {
      history.push("/admin/create");
    }
  }, [userToken, history]);

  return (
    <>
      <div
        className="vh-100 vw-100 position-absolute top-0 start-0"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          zIndex: "-1",
        }}
      >
        <div className="w-100 h-100" style={{ backgroundColor: "#120f3df5" }} />
      </div>
      <div className="d-flex vh-100 flex-column">
        <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" className="bg-transparent">
          <Container>
            <Navbar.Brand style={{ cursor: "pointer" }}>
              <b>Votey</b>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto" />
              <Nav>{navOptions}</Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {!userToken && (
          <>
            <LoginModal show={showLoginModal} onHide={() => setShowLoginModal(false)} />
            <RegisterModal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} />
          </>
        )}
        <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-white">
          <h1>Polls. Simplified.</h1>
          <br />
          <Button variant="success" onClick={getStarted}>
            <h3 style={{ padding: "5px 15px" }}>Get Started</h3>
          </Button>
        </div>
      </div>
    </>
  );
};
export default HomePage;
