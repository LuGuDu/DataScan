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
} from "reactstrap";

import { useNavigate } from "react-router-dom";

async function registerUser(data) {
    return fetch('/registerUser', {
        method: 'POST',
        body: data
    });
};

export default function Login() {

    const [fullNameFocus, setFullNameFocus] = React.useState(false);
    const [emailFocus, setEmailFocus] = React.useState(false);
    const [passwordFocus, setPasswordFocus] = React.useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    React.useEffect(() => {
        document.body.classList.toggle("index-page");
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("index-page");
        };
    }, []);

    const register = (e) => {
        e.preventDefault();


        var jsonData = {
            "username": username,
            "password": password,
            "email": email        
        }

        //if(validateData())

        registerUser(JSON.stringify(jsonData))
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    navigate('/login');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
          <div className="page-header">
            <div className="page-header-image" />
            <div className="content">
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
                            />
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
                              type="text"
                              onFocus={(e) => setPasswordFocus(true)}
                              onBlur={(e) => setPasswordFocus(false)}
                              onChange={e => setPassword(e.target.value)}
                            />
                          </InputGroup>
                        </Form>
                      </CardBody>
                      <CardFooter>
                        <Button className="btn-round" color="info" size="lg" onClick={(e) => register(e)}>
                          Register
                        </Button>
                        <Button className="btn-round" color="info" size="lg" onClick={(e) => goLogin(e)}>
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
