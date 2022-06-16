import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { AES } from 'crypto-js';

import { useNavigate } from "react-router-dom";
import $ from 'jquery';

import LoginNavbar from "components/Navbars/LoginNavBar.js"

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
    FormGroup,
    Label,
    Alert,
} from "reactstrap";

function getRandomKey(string_length) {
    var random_string = ''
    var char = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var i

    for (i = 0; i < string_length; i++) {
        random_string = random_string + char.charAt(Math.floor(Math.random() * char.length))
    }
    return random_string
}

async function loginUser(data) {
    return fetch('/loginUser', {
        method: 'POST',
        body: data
    });
};

async function getUserRole(data) {
    return fetch(`/getRole?email=${data['email']}`, {
        method: 'GET'
    });
};

export default function Login() {


    const [emailFocus, setEmailFocus] = React.useState(false);
    const [passwordFocus, setPasswordFocus] = React.useState(false);

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [isLogged, setIsLogged] = useState(false);

    React.useEffect(() => {
        document.body.classList.toggle("index-page");
        $('.AlertContainer').hide()

        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("index-page");
        };
    }, []);

    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();

        $('.AlertContainer').hide()

        var jsonData = {
            "password": password,
            "email": email
        }
        document.getElementById("btn-login").disabled = true;
        loginUser(JSON.stringify(jsonData))
            .then(response => response.json())
            .then(result => {
                document.getElementById("btn-login").disabled = false;
                if (result['message'] === 200) {
                    if (result['login']) {
                        setIsLogged(true)
                    } else {
                        $('.AlertContainer').show()
                        $('.LoginAlert').text("Bad credentials. Try again...")
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        if (isLogged) {

            var data = {
                "email": email
            }

            getUserRole(data)
                .then(response => response.json())
                .then(result => {
                    let key = getRandomKey(16);
                    sessionStorage.setItem("VALUE", key);
                    sessionStorage.setItem("userRole", AES.encrypt(result["role"], key).toString());
                    navigate('/welcome')
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }, [isLogged, navigate, email])

    const smoothScroll = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            <LoginNavbar />
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
                                            <CardTitle tag="h4">Login</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                            <Form className="form" autoComplete="off">
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
                                                        onFocus={() => setEmailFocus(true)}
                                                        onBlur={() => setEmailFocus(false)}
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
                                                        type="password"
                                                        onFocus={() => setPasswordFocus(true)}
                                                        onBlur={() => setPasswordFocus(false)}
                                                        onChange={e => setPassword(e.target.value)}
                                                    />
                                                </InputGroup>
                                                <FormGroup check className="text-right">
                                                    <Label check>
                                                        Click {" "}
                                                        <a
                                                            href="#/register"
                                                            onClick={() => smoothScroll()}
                                                        >
                                                            here
                                                        </a>
                                                        {" "} to register.
                                                    </Label>
                                                </FormGroup>
                                            </Form>
                                        </CardBody>
                                        <CardFooter>
                                            <Button className="btn-round" id="btn-login" color="info" size="lg" onClick={(e) => login(e)}>
                                                Login
                                            </Button>
                                            <div className="AlertContainer">
                                                <Alert className="LoginAlert" color="danger">
                                                    <strong></strong>
                                                </Alert >
                                            </div>
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
