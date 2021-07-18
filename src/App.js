import "bootstrap/dist/css/bootstrap.min.css";
import ViewPollUser from "./components/ViewPollUser";
import HomePage from "./components/HomePage";
import ViewPollAdmin from "./components/ViewPollAdmin";
import CreatePoll from "./components/CreatePoll";
import MyPolls from "./components/MyPolls";
import { createContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

export const AppContext = createContext();

const BaseNav = () => {
  return (
    <Navbar bg="dark" variant="dark" className="bg-transparent">
      <Container>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Navbar.Brand>
            <b>Votey</b>
          </Navbar.Brand>
        </Link>
      </Container>
    </Navbar>
  );
};

function App() {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));

  return (
    <AppContext.Provider value={{ userToken, setUserToken }}>
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/polls/:pollId">
            <BaseNav />
            <ViewPollUser />
          </Route>
          <Route path="/admin/polls/:pollId">
            <BaseNav />
            <ViewPollAdmin />
          </Route>
          <Route exact path="/admin/create">
            <BaseNav />
            <CreatePoll />
          </Route>
          <Route exact path="/admin/polls">
            <BaseNav />
            <MyPolls />
          </Route>
        </Switch>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
