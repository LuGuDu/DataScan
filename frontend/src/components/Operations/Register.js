import React, { useState } from "react";
import classnames from "classnames";

import LoginNavBar from "components/Navbars/LoginNavBar.js"

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";

import { useNavigate } from "react-router-dom";

async function registerUser(data) {
  return fetch('/registerUser', {
    method: 'POST',
    body: data
  });
};

// Function to check whether the email introduced has the correct format
function checkEmail(email) {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

// Function to check whether the password introduced has the correct format
function checkPassword(pwd) {
  var strongPwdPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
  return strongPwdPattern.test(pwd);
}


export default function Register() {

  const [fullNameFocus, setFullNameFocus] = React.useState(false);
  const [emailFocus, setEmailFocus] = React.useState(false);
  const [passwordFocus, setPasswordFocus] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState('')

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');
  // Variable to store if the pwd introduced is valid
  const [isValidPwd, setIsValidPwd] = useState(false);
  // Variable to store if the pwd introduced is invalid
  const [isInvalidPwd, setIsInvalidPwd] = useState(false);

  const [email, setEmail] = useState('');
  // Variable to store if the email introduced is valid
  const [isValidEmail, setIsValidEmail] = useState(false);
  // Variable to store if the email introduced is invalid
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);

  // Variable to show or not the feedback
  const [showFeedback, setShowFeedback] = useState(false);

  const passRequirements = `Password requirements:
    Must have a minimum length of 8 characters
    Must include 1 capital letter and 1 small letter
    Must include 1 number
    Must include 1 special char`

  React.useEffect(() => {
    document.body.classList.toggle("index-page");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle("index-page");
    };
  }, []);

  const validateInputs = () => {
    var valid = false
    if (!checkEmail(email)) {
      setShowFeedback(true);
      setIsValidEmail(false);
      setIsInvalidEmail(true);
    } else if (!checkPassword(password)) {
      setIsValidEmail(true);
      setIsInvalidEmail(false);
      setShowFeedback(true);
      setIsValidPwd(false);
      setIsInvalidPwd(true);
    } else {
      setIsValidEmail(true);
      setIsInvalidEmail(false);
      setIsValidPwd(true);
      setIsInvalidPwd(false);
      setShowFeedback(true);
      valid = true
    }

    return valid
  }

  const register = (e) => {
    e.preventDefault();
    setShowFeedback(false);
    setErrorMessage('');

    var jsonData = {
      "username": username,
      "password": password,
      "email": email
    }

    if (validateInputs()) {
      document.getElementById("btn-register").disabled = true;
      document.getElementById("btn-login").disabled = true;
      registerUser(JSON.stringify(jsonData))
        .then(response => response.json())
        .then(result => {
          document.getElementById("btn-register").disabled = false;
          document.getElementById("btn-login").disabled = false;
          if (result['message'] === 200) {
            navigate('/login');
          } else {
            document.getElementById("btn-register").disabled = false;
            document.getElementById("btn-login").disabled = false;
            setShowFeedback(true)

            throw Error(result.message)
          }
        })
        .catch(error => {
          console.error('Error:', error);
          setErrorMessage(error.message);
        });
    }
  }

  const renderFeedback = (input, success, error) => {
    return (input
      ? <FormFeedback valid>
        {success}
      </FormFeedback>
      : <FormFeedback invalid>
        {error}
      </FormFeedback>);
  }

  const navigate = useNavigate();

  const goLogin = (e) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    navigate('/login');
  }

  return (
    <>
      <LoginNavBar />
      <div className="wrapper">
        <div className="main">
          <div className="section">
            <Container>
              <Row>
                <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                  <div
                    className="square square-7"
                    id="square7"
                  />
                  <div
                    className="square square-8"
                    id="square8"
                  />
                  <Card className="card-register">
                    <CardHeader>
                      <CardImg
                        alt="..."
                        src={require("assets/img/square1.png").default}
                      />
                      <CardTitle tag="h4">Register</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Form className="form">
                        <InputGroup
                          className={classnames({
                            "input-group-focus": fullNameFocus,
                          })}
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="tim-icons icon-single-02" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Username"
                            type="text"
                            onFocus={(e) => setFullNameFocus(true)}
                            onBlur={(e) => setFullNameFocus(false)}
                            onChange={e => setUsername(e.target.value)}
                          />
                        </InputGroup>
                        <InputGroup
                          className={classnames({
                            "input-group-focus": emailFocus,
                          })}
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="tim-icons icon-email-85" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Email"
                            type="text"
                            onFocus={(e) => setEmailFocus(true)}
                            onBlur={(e) => setEmailFocus(false)}
                            onChange={e => setEmail(e.target.value)}
                            valid={isValidEmail}
                            invalid={isInvalidEmail}
                          />
                          {showFeedback ? renderFeedback(isValidEmail,
                            "Valid email.", "Invalid email.") : null}
                        </InputGroup>

                        <InputGroup
                          className={classnames({
                            "input-group-focus": passwordFocus,
                          })}
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="tim-icons icon-lock-circle" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Password"
                            type="password"
                            onFocus={(e) => setPasswordFocus(true)}
                            onBlur={(e) => setPasswordFocus(false)}
                            onChange={(e) => setPassword(e.target.value)}
                            valid={isValidPwd}
                            invalid={isInvalidPwd}
                            Title={passRequirements} />
                          {showFeedback ? renderFeedback(isValidPwd,
                            "Valid password.", "Invalid password.") : null}
                        </InputGroup>

                      </Form>
                    </CardBody>
                    <CardFooter>
                      {errorMessage
                        ? <div class="alert alert-danger d-flex align-items-center" role="alert">
                          <div>
                            {errorMessage}
                          </div>
                        </div>
                        : null}
                      <Button className="btn-round" color="info" size="lg" id="btn-register" onClick={(e) => register(e)}>
                        Register
                      </Button>
                      <Button className="btn-round" color="info" size="lg" id="btn-login" onClick={(e) => goLogin(e)}>
                        Login
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};
