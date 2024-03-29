import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router";
import "./style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../store/user/UserAction";

const Login = (props) => {
  const [error, setError] = useState({});
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    let isValid = loginValidation();
    if (isValid) {
      dispatch(loginUser({ email, pass }));
    }
  };

  const loginValidation = () => {
    let isValid = true;
    const errors = {};

    // Email Validation
    if (!email) {
      errors.email = "Please Enter Email";
      isValid = false;
    }

    // Password Validation
    if (!pass) {
      errors.pass = "Please Enter Password";
      isValid = false;
    }
    setError(errors);
    return isValid;
  };

  return (
    <React.Fragment>
      <div className="main-div">
        <ToastContainer />
        <Form onSubmit={handleSubmit}>
          <div>
            <h3>Sign in</h3>
          </div>
          <div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email *"
              />
              <Form.Text className="error-message">{error.email}</Form.Text>
            </Form.Group>
          </div>
          <div>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                onChange={(e) => setPass(e.target.value)}
                placeholder="Password *"
              />
              <Form.Text className="error-message">{error.pass}</Form.Text>
            </Form.Group>
          </div>
          <Form.Group
            className="d-grid gap-2"
            controlId="formBasicCheckbox"
          ></Form.Group>
          <div className="d-grid gap-2">
            <Button variant="outline-primary" type="submit">
              Sign in
            </Button>
          </div>
          <div className="forSignup">
            <p onClick={() => navigate("/auth/forgotepassword")}>
              Forgot password?
            </p>
            <p onClick={() => navigate("/auth/register")}>
              Don't have an account? Sign Up
            </p>
          </div>
        </Form>
      </div>
    </React.Fragment>
  );
};

export default Login;
