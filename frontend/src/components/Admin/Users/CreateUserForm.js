import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import AdminNavbar from "components/Navbars/AdminNavbar"

import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Button,
} from "reactstrap";

async function createUser(data) {
    return fetch('/createUser', {
        method: 'POST',
        body: data
    });
};

export default function CreateUserForm() {

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
                    navigate('/admin/users');
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

    const modelData = {
        color: "gray",
    }

    return (
        <>
            <AdminNavbar />
            <div className="wrapper">

                <div className="main">
                    <div className="section section-basic" id="basic-elements">
                        <section className="section section-lg">
                            <Container>
                                <Row>
                                    <Col md="16">
                                        <Card className="card-plain">
                                            <CardHeader>
                                                <h1 className="profile-title text-left">Create form</h1>
                                                <h5 className="text-on-back">Users</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Form>
                                                    <Row>
                                                        <Col md="3">
                                                            <FormGroup>
                                                                <label>Username</label>
                                                                <Input id="in-username" style={modelData} placeholder="Username" type="text" onChange={e => setUsername(e.target.value)} />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="3">
                                                            <FormGroup>
                                                                <label>Password</label>
                                                                <Input id="in-pass" style={modelData} placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="4">
                                                            <FormGroup>
                                                                <label>Email</label>
                                                                <Input id="in-email" style={modelData} placeholder="email" type="email" onChange={e => setEmail(e.target.value)} />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="3">
                                                            <FormGroup>                                                              
                                                                <Input type="checkbox" id="in-role" />Admin
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="5">
                                                            <Button type="submit" className="btn btn-primary" onClick={(e) => create(e)} >
                                                                Create User
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </CardBody>
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