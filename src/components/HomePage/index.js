import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useContext, useState } from "react";
import { AppContext } from "../../App";
import { Link } from "react-router-dom";

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

  return (
    <>
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
    </>
  );
};
export default HomePage;
