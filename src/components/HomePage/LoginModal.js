import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useCallback, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../App";

const LoginModal = ({ show, onHide }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { setUserToken } = useContext(AppContext);

  const handleLogin = useCallback(() => {
    const errorsNew = {};
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email.toLowerCase())) {
      errorsNew.email = true;
    }
    if (password.length < 6) {
      errorsNew.password = true;
    }

    if (errorsNew.email || errorsNew.password) {
      setErrors(errorsNew);
      return;
    }

    setLoading(true);
    axios.post(process.env.REACT_APP_BACKEND_URL + "login", { username: email, password }).then((res) => {
      setLoading(false);
      if (res.data.access_token) {
        setUserToken(res.data.access_token);
        if (remember) {
          localStorage.setItem("userToken", res.data.access_token);
        }
        onHide();
      } else {
        setErrors({ login: true });
      }
    });
  }, [email, password, remember, onHide, setUserToken]);

  return (
    <Modal onHide={onHide} show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
        <button className="btn-close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} isInvalid={errors.email} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} isInvalid={errors.password} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check label="Remember me" checked={remember} onChange={() => setRemember(!remember)} />
          </Form.Group>
          {errors.login && <div class="alert alert-danger">Invalid username or password</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {loading && <Spinner animation="border" />}
        <Button onClick={handleLogin}>Login</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
