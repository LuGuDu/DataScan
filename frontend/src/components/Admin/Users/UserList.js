import React from "react";
import $ from 'jquery';
import classnames from "classnames";

import AdminNavbar from "components/Navbars/AdminNavbar"

import PermissionsGate from 'components/Role-based-access/PermissionsGate.js'
import { SCOPES } from 'components/Role-based-access/PermissionsMap.js'
import RestrictedContent from 'components/Role-based-access/RestrictedContent.js'

import {
    Container,
    Row,
    Col,
    Card,
    CardTitle,
    CardImg,
    CardHeader,
    CardBody,
    CardFooter,
    Table,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Button,
    Alert,
    FormFeedback,
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

// Function to check whether the password introduced has the correct format
function checkPassword(pwd) {
    var strongPwdPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    return strongPwdPattern.test(pwd);
}

export default function CreateUserForm() {

    const [fullNameFocus, setFullNameFocus] = React.useState(false);
    const [emailFocus, setEmailFocus] = React.useState(false);
    const [passwordFocus, setPasswordFocus] = React.useState(false);

    // Variable to store if the email introduced is valid
    const [isValidEmail, setIsValidEmail] = React.useState(false);
    // Variable to store if the email introduced is invalid
    const [isInvalidEmail, setIsInvalidEmail] = React.useState(false);

    // Variable to store if the pwd introduced is valid
    const [isValidPwd, setIsValidPwd] = React.useState(false);
    // Variable to store if the pwd introduced is invalid
    const [isInvalidPwd, setIsInvalidPwd] = React.useState(false);

    // Variable to show or not the feedback
    const [showFeedback, setShowFeedback] = React.useState(false);

    const passRequirements = `Password requirements:
        Must have a minimum length of 8 characters
        Must include 1 capital letter and 1 small letter
        Must include 1 number
        Must include 1 special char`

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
                if (result['message'] === 200) {

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

    const goUp = (e) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const showUser = (data) => {

        setShowFeedback(false);
        setIsInvalidEmail(false);

        getUser(data)
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    window.scrollTo({ top: 0, behavior: 'smooth' })

                    document.getElementById("in-username").value = result['user']['username'];
                    document.getElementById("in-email").value = result['user']['email'];
                    document.getElementById("in-pass").value = "";
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

    const validateInputs = (password) => {
        var valid = false
        if (!checkPassword(password)) {
            setShowFeedback(true);
            setIsValidPwd(false);
            setIsInvalidPwd(true);
        } else {
            setIsValidPwd(true);
            setIsInvalidPwd(false);
            setShowFeedback(true);
            valid = true
        }

        return valid
    }

    const modify = (e) => {

        e.preventDefault();

        var username = document.getElementById('in-username').value
        var password = document.getElementById('in-pass').value
        var email = document.getElementById('in-email').value
        var role = document.getElementById('in-role').checked

        if (email === "") {
            setShowFeedback(true);
            setIsValidEmail(false);
            setIsInvalidEmail(true);
            return
        }

        var changePass = document.getElementById('in-changePass').checked

        var jsonData = {
            "username": username,
            "email": email,
            "role": role
        }

        if (changePass) {
            if (validateInputs(password)) {
                jsonData["password"] = password
            };
        }
        document.getElementById("btn-modify").disabled = true;
        modifyUser(JSON.stringify(jsonData))
            .then(response => response.json())
            .then(result => {
                document.getElementById("btn-modify").disabled = false;
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

        $('.AlertContainer').hide()
        var table = document.getElementById('myTable');

        if(table != null){
            getUsers()
        }

        return () => {
        };
    }, []);

    const renderFeedback = (input, success, error) => {
        return (input
            ? <FormFeedback valid>
                {success}
            </FormFeedback>
            : <FormFeedback invalid>
                {error}
            </FormFeedback>);
    }

    return (
        <>
            <PermissionsGate
                scopes={[SCOPES.administratorCanAccess]}
                RenderForbiddenContent={() => <RestrictedContent allowedRole={"administrator"} />}
            >
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
                                                    <CardTitle tag="h5">Modify</CardTitle>
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
                                                                id="in-username"
                                                                placeholder="Username"
                                                                type="text"
                                                                onFocus={(e) => setFullNameFocus(true)}
                                                                onBlur={(e) => setFullNameFocus(false)}
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
                                                                id="in-email"
                                                                placeholder="Email"
                                                                type="text"
                                                                readonly="readonly"
                                                                onFocus={(e) => setEmailFocus(true)}
                                                                onBlur={(e) => setEmailFocus(false)}
                                                                valid={isValidEmail}
                                                                invalid={isInvalidEmail}
                                                            />
                                                            {showFeedback ? renderFeedback(isValidEmail,
                                                                "Valid email.", "No user is selected.") : null}
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
                                                                id="in-pass"
                                                                placeholder="New password"
                                                                type="password"
                                                                onFocus={(e) => setPasswordFocus(true)}
                                                                onBlur={(e) => setPasswordFocus(false)}
                                                                invalid={isInvalidPwd}
                                                                Title={passRequirements} />
                                                            {showFeedback ? renderFeedback(isValidPwd,
                                                                "Valid password.", "Invalid password.") : null}
                                                        </InputGroup>
                                                        <FormGroup className="text-center">
                                                            <Row>
                                                                <Col>
                                                                    <Input type="checkbox" id="in-role" />Admin
                                                                </Col>
                                                                <Col>
                                                                    <Input type="checkbox" id="in-changePass" />Change Pass?
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                    </Form>
                                                </CardBody>
                                                <CardFooter>
                                                    <Button className="btn-round" id="btn-modify" color="info" size="lg" onClick={(e) => modify(e)}>
                                                        Modify
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </Col>
                                        <Col className="offset-lg-0 offset-md-3" lg="7" md="7">
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
                                                    <CardTitle tag="h5">list</CardTitle>
                                                </CardHeader>
                                                <CardBody>
                                                    <Row lg="15" >
                                                        <Col lg="10" md="5" >
                                                            <Table id="myTable" data-show-toggle="false" data-expand-first="true">
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
                                                <CardFooter>
                                                    <Button className="btn-round" color="info" size="lg" onClick={(e) => goUp(e)}>
                                                        Go up
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Container>
                                <Container>
                                    <Row>
                                        <div className="AlertContainer">
                                            <Alert className="Alert" color="info">
                                                <strong></strong>
                                            </Alert >
                                        </div>
                                    </Row>
                                </Container>

                                <Container>
                                    <Row>

                                    </Row>
                                </Container>
                            </section>
                        </div>
                    </div>
                </div>
            </PermissionsGate>
        </>
    );
};