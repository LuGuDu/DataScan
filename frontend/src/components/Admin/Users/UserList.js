import React from "react";
import $ from 'jquery';

import AdminNavbar from "components/Navbars/AdminNavbar"

import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Table,
    Form,
    FormGroup,
    Input,
    Button,
    Alert,
} from "reactstrap";

async function modifyUser(data) {
    return fetch('/modifyUser', {
        method: 'PUT',
        body: data
    });
};

async function removeUser(data) {
    return fetch('/deleteUser', {
        method: 'DELETE',
        body: data
    });
};

async function getUserList() {
    return fetch('/getUsers', {
        method: 'GET'
    });
};

async function getUser(data) {
    return fetch(`/getUser?username=${data['username']}&email=${data['email']}`, {
        method: 'GET'
    });
};



export default function CreateUserForm() {

    const getUsers = (e) => {

        var tableHeaderRowCount = 1;
        var table = document.getElementById('myTable');
        var rowCount = table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount);
        }

        getUserList()
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    console.log(result['users'])

                    var counter = 1;
                    result['users'].forEach((element) => {

                        var lista = document.getElementById("myTable");
                        var tr = document.createElement("tr");
                        lista.appendChild(tr);

                        var columna = document.createElement("td")
                        columna.innerHTML = counter.toString();
                        tr.appendChild(columna);

                        columna = document.createElement("td")
                        columna.innerHTML = element['username'];
                        tr.appendChild(columna);

                        columna = document.createElement("td")
                        columna.innerHTML = element['email'];
                        tr.appendChild(columna);

                        columna = document.createElement("td")

                        var deleteButton = document.createElement("Button");
                        deleteButton.className = "btn-icon fa fa-times";
                        deleteButton.color = "danger"
                        deleteButton.size = "sm"
                        deleteButton.onclick = function () {

                            var jsonData = {
                                "username": element['username'],
                                "email": element['email'],
                            }

                            remove(jsonData)
                        };

                        var selectButton = document.createElement("Button");
                        selectButton.className = "btn-icon fa fa-user";
                        selectButton.color = "info"
                        selectButton.size = "sm"
                        selectButton.onclick = function () {

                            var jsonData = {
                                "username": element['username'],
                                "email": element['email'],
                            }

                            showUser(jsonData)

                        };

                        columna.appendChild(selectButton)
                        columna.appendChild(deleteButton)

                        tr.appendChild(columna);

                        counter += 1
                    }
                    )
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const showUser = (data) => {

        getUser(data)
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    window.scrollTo({ top: 0, behavior: 'smooth' })

                    document.getElementById("in-username").value = result['user']['username'];
                    //document.getElementById("in-pass").value = result['user']['password'];
                    document.getElementById("in-email").value = result['user']['email'];
                    document.getElementById("in-role").checked = result['user']['role'];
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const remove = (data) => {

        removeUser(JSON.stringify(data))
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    getUsers()
                    $('.AlertContainer').show()
                    $('.Alert').text("User deleted!")
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const modify = (e) => {

        e.preventDefault();

        var username = document.getElementById('in-username').value
        var password = document.getElementById('in-pass').value
        var email = document.getElementById('in-email').value
        var role = document.getElementById('in-role').checked


        var changePass = document.getElementById('in-changePass').checked

        var jsonData = {
            "username": username,
            "email": email,
            "role": role
        }

        if (changePass){
            jsonData["password"] = password
        }

        modifyUser(JSON.stringify(jsonData))
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    getUsers()
                    $('.AlertContainer').show()
                    $('.Alert').text("User modified!")
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    React.useEffect(() => {
        document.body.classList.toggle("profile-page");
        document.body.classList.toggle("index-page");
        $('.AlertContainer').hide()
        getUsers()
        // Specify how to clean up after this effect:
        return function cleanup() {
            $('.AlertContainer').hide()
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
                                                <h1 className="profile-title text-left">User list</h1>
                                                <h5 className="text-on-back">Users</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    <Col lg="10" md="5">
                                                        <Form>
                                                            <Row>
                                                                <Col md="3">
                                                                    <FormGroup>
                                                                        <label>Username</label>
                                                                        <Input id="in-username" style={modelData} placeholder="Username" type="text" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="5">
                                                                    <FormGroup>
                                                                        <label>New Password (optional)</label>
                                                                        <Input id="in-pass" style={modelData} placeholder="New Password" type="password" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col md="4">
                                                                    <FormGroup>
                                                                        <label>Email</label>
                                                                        <Input id="in-email" style={modelData} placeholder="Email" type="email" readonly="readonly" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="3">
                                                                    <FormGroup>
                                                                        <Input type="checkbox" id="in-role" />Admin
                                                                    </FormGroup>

                                                                    <FormGroup>
                                                                        <Input type="checkbox" id="in-changePass" />Change Pass?
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col md="5">
                                                                    <Button type="submit" className="btn btn-primary" onClick={(e) => modify(e)} >
                                                                        Modify User
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </Form>
                                                    </Col>
                                                </Row>
                                                <br />
                                                <Row>
                                                    <div className="AlertContainer">
                                                        <Alert className="Alert" color="info">
                                                            <strong></strong>
                                                        </Alert >
                                                    </div>
                                                </Row>

                                                <br />
                                                <Row lg="15" >
                                                    <Col lg="10" md="5" >
                                                        <Table responsive id="myTable" data-show-toggle="false" data-expand-first="true">
                                                            <thead>
                                                                <tr>
                                                                    <th className="text-left">#</th>
                                                                    <th classname="username text-left">Username</th>
                                                                    <th className="email text-left">Email</th>
                                                                    <th className="text-right">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                            </tbody>
                                                        </Table>
                                                    </Col>
                                                </Row>
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