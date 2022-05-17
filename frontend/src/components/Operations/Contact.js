import React from "react";

import IndexNavbar from "components/Navbars/IndexNavbar.js"
import ContactHeader from "components/PageHeader/ContactHeader.js"
import Footer from "components/Footer/Footer.js"

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
    UncontrolledTooltip,
} from "reactstrap";

async function sendMessage(data) {
    return fetch(`/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

export default function Contact() {

    const [name, setName] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        document.body.classList.toggle("profile-page");
        document.body.classList.toggle("index-page");

        // Specify how to clean up after this effect:
        return function cleanup() {
          document.body.classList.toggle("profile-page");
          document.body.classList.toggle("index-page");

        };
      },[]);

    function onlySpaces(str) {
        return str.trim().length === 0;
    }

    const setEmail = (e) => {
        e.preventDefault();
        var error = false

        if (!subject || onlySpaces(subject)) {
            alert("bad subject")
            error = true
        }
        if (!message || onlySpaces(message)) {
            alert("bad message")
            error = true
        }
        if (!name || onlySpaces(name)) {
            setName("anonimo")
        }

        if (!error) {
            let email = {
                emailName: name,
                emailSubject: subject,
                emailMessage: message
            }

            console.log(email)

            sendMessage(email)
                .then(response => response.json())
                .then(result => {
                    console.log('Success:', result);
                    if (result['message'] === 200) {
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }



    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <ContactHeader />
                <div className="main">
                    <div className="section section-basic" id="basic-elements">
                        <section className="section">
                            <Container>
                                <Row>
                                    <Col md="8">
                                        <Card className="card-plain">
                                            <CardHeader>
                                                <h1 className="profile-title text-left">Formulario</h1>
                                                <h5 className="text-on-back">Contacta</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Form>
                                                    <Row>
                                                        <Col md="6">
                                                            <FormGroup>
                                                                <label>Tu nombre (opcional)</label>
                                                                <Input placeholder="Su nombre" type="text" onChange={e => setName(e.target.value)} />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="6">
                                                            <FormGroup>
                                                                <label>Asunto</label>
                                                                <Input placeholder="Su asunto" type="email" onChange={e => setSubject(e.target.value)} />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>Mensaje</label>
                                                                <Input placeholder="Su mensaje" type="text" onChange={e => setMessage(e.target.value)} />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Button
                                                        className="btn-round float-right"
                                                        color="primary"
                                                        data-placement="right"
                                                        id="tooltip341148792"
                                                        type="button"
                                                        onClick={(e) => setEmail(e)}
                                                    >
                                                        Enviar mensaje
                                                    </Button>
                                                    <UncontrolledTooltip
                                                        delay={0}
                                                        placement="right"
                                                        target="tooltip341148792"
                                                    >
                                                        Can't wait for your message
                                                    </UncontrolledTooltip>
                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Col>

                                </Row>
                            </Container>
                        </section>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};