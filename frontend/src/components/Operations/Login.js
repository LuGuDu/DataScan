import React, { useState } from "react";
import classnames from "classnames";

import { useNavigate } from "react-router-dom";

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
    Label
} from "reactstrap";

async function loginUser(data) {
    return fetch('/loginUser', {
        method: 'POST',
        body: data
    });
};

export default function Login() {

    const [emailFocus, setEmailFocus] = React.useState(false);
    const [passwordFocus, setPasswordFocus] = React.useState(false);

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    React.useEffect(() => {
        document.body.classList.toggle("index-page");
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("index-page");
        };
    }, []);

    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();

        var jsonData = {
            "password": password,
            "email": email        
        }

        //if(validateData())

        loginUser(JSON.stringify(jsonData))
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    if(result['login']){
                        navigate('/');
                    }else {
                        alert('email or password incorrect')
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const smoothScroll = (e) => {
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
                                            <Form className="form" autocomplete="off">
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
                                                        type="password"
                                                        onFocus={(e) => setPasswordFocus(true)}
                                                        onBlur={(e) => setPasswordFocus(false)}
                                                        onChange={e => setPassword(e.target.value)}
                                                    />
                                                </InputGroup>
                                                <FormGroup check className="text-left">
                                                    <Label check>
                                                        Click {" "}
                                                        <a
                                                            href="/register"
                                                            onClick={(e) => smoothScroll(e)}
                                                        >
                                                            here
                                                        </a>
                                                        {" "} to register.
                                                    </Label>
                                                </FormGroup>
                                            </Form>
                                        </CardBody>
                                        <CardFooter>
                                            <Button className="btn-round" color="info" size="lg" onClick={(e) => login(e)}>
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
