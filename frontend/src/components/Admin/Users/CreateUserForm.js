import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import classnames from "classnames";

import AdminNavbar from "components/Navbars/AdminNavbar"

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
} from "reactstrap";

async function createUser(data) {
    return fetch('/createUser', {
        method: 'POST',
        body: data
    });
};

export default function CreateUserForm() {

    const [fullNameFocus, setFullNameFocus] = React.useState(false);
    const [emailFocus, setEmailFocus] = React.useState(false);
    const [passwordFocus, setPasswordFocus] = React.useState(false);


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const create = (e) => {
        e.preventDefault();

        var role = document.getElementById('in-role').checked

        var jsonData = {
            "username": username,
            "password": password,
            "email": email,
            "role": role
        }

        createUser(JSON.stringify(jsonData))
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    //navigate('/admin/users');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    React.useEffect(() => {
        document.body.classList.toggle("profile-page");
        document.body.classList.toggle("index-page");
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("profile-page");
            document.body.classList.toggle("index-page");
        };
    }, []);

    return (
        <>
            <AdminNavbar />
            <div className="wrapper">

                <div className="main">
                    <div className="section section-basic" id="basic-elements">
                        <section className="section section-lg">
                            <Container>
                            <h5 className="text-on-back">User</h5>
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
                                                <CardTitle tag="h5">Create</CardTitle>
                                            </CardHeader>
                                            <CardBody>
                                                <Form className="form" autocomplete="off">
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
                                                            type="password"
                                                            onFocus={(e) => setPasswordFocus(true)}
                                                            onBlur={(e) => setPasswordFocus(false)}
                                                            onChange={e => setPassword(e.target.value)}
                                                        />
                                                    </InputGroup>
                                                    <FormGroup className="text-center">
                                                        <Input type="checkbox" id="in-role" />Admin
                                                    </FormGroup>
                                                </Form>
                                            </CardBody>
                                            <CardFooter>
                                                <Button className="btn-round" color="info" size="lg" onClick={(e) => create(e)}>
                                                    Create
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                </Row>

                            </Container>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};