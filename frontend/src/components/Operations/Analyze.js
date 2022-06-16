import React from "react";

import IndexNavbar from "components/Navbars/IndexNavbar.js"
import AnalyzeHeader from "components/PageHeader/AnalyzeHeader.js"
import Footer from "components/Footer/Footer.js"

import PermissionsGate from 'components/Role-based-access/PermissionsGate.js'
import { SCOPES } from 'components/Role-based-access/PermissionsMap.js'
import RestrictedContent from 'components/Role-based-access/RestrictedContent.js'

import Chart from "chart.js"
import $ from 'jquery'

import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Form,
    Alert,
} from "reactstrap";

async function uploadFile(data) {
    return fetch('/analyze', {
        method: 'POST',
        body: data
    });
}

async function getModelFormat() {
    return fetch('/getModelFormat', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}


export default function Analyze() {

    const [errorMessage, setErrorMessage] = React.useState('')

    var percentageAttacksChart
    var typesChart

    const getModelInfo = () => {

        $('.DatasetFormatAlert').hide()

        getModelFormat()
            .then(response => response.json())
            .then(result => {
                if (result['message'] === 200) {
                    $('.DatasetFormatAlert').show()
                    var text = ""
                    result["modelFormat"].forEach(function (column) {
                        if (column !== 'class') {
                            text += column + ", "
                        }
                    })
                    $('.DatasetFormatAlert').text("File must have only this colums: " + text);
                } else {
                    throw Error(result.message)
                }
            })
            .catch(error => {
                console.log(error.message)
            });
    }


    React.useEffect(() => {
        document.body.classList.toggle("index-page");
        document.body.classList.toggle("profile-page");

        $('.AlertContainer').hide()
        $('.DatasetFormatAlert').hide()
        getModelInfo()

        const initializeCharts = () => {
            var ctx = document.getElementById('percentageChart');

            if (ctx != null) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                percentageAttacksChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3]
                        }]
                    },
                    options: {}
                });

                percentageAttacksChart.render();
                percentageAttacksChart.destroy();
            }

            ctx = document.getElementById('typesChart')

            if (ctx != null) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                typesChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3]
                        }]
                    },
                    options: {}
                });

                typesChart.render();
                typesChart.destroy();
            }
        }

        initializeCharts()

        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("profile-page");
            document.body.classList.toggle("index-page");
            $('.AlertContainer').hide()
            $('.DatasetFormatAlert').hide()
        };
    }, []);

    const update = (e) => {
        e.preventDefault();
        setErrorMessage('');

        $('.AlertContainer').show()

        const fileField = document.querySelector('input[type="file"]');
        const formData = new FormData();
        formData.append('file', fileField.files[0]);

        //Disable components
        $('.AnalyzeAlert').text("Analyzing dataset, wait...")
        document.getElementById("btn-analyze").disabled = true;
        document.getElementById("file").disabled = true;
        document.getElementById("resultData").innerHTML = "";
        //document.getElementById("btn-analyze").style.cursor = "wait"

        //Check if file type is .csv
        if (fileField.files[0]['type'] !== 'text/csv') {
            $('.AlertContainer').show()
            $('.AnalyzeAlert').text("File must be .csv format!")

            //Enable components
            document.getElementById("file").disabled = false;
            document.getElementById("btn-analyze").disabled = false;
            document.getElementById("resultData").innerHTML = "";

            return
        }

        uploadFile(formData)
            .then(response => response.json())
            .then(result => {
                if (result['message'] === 200) {

                    $('.AnalyzeAlert').text("Analysis complete. See results below.")

                    document.getElementById("btn-analyze").disabled = false;
                    document.getElementById("file").disabled = false;

                    var parElement = document.getElementById("resultData");

                    var text = ""
                    for (const [key, value] of Object.entries(result['predicts'])) {
                        text = text + key + " --> " + value + "\n"
                    }

                    var textToAdd = document.createTextNode(text);
                    parElement.appendChild(textToAdd);

                    uploadCharts(result['predicts'])

                } else {
                    $('.AlertContainer').hide()
                    throw Error(result.message)
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById("btn-analyze").disabled = false;
                document.getElementById("file").disabled = false;
                setErrorMessage(error.message);
                //document.getElementById("btn-analyze").style.cursor = "auto"
            });
    }

    const changeName = (e) => {
        e.preventDefault();

        const fileField = document.querySelector('input[type="file"]');
        var x = document.getElementById("labelFile");
        if (fileField.files[0])
            x.innerHTML = fileField.files[0]['name']
    }

    const results = {
        marginLeft: "15px",
        padding: "15px",
        textAlign: "left",
        borderRadius: "15px",
        borderStyle: "solid",
        borderColor: "#ffffff"
    }

    const getPercentage = (dataset) => {
        let valuesArray = dataset
        var sum = 0;

        for (var i in valuesArray) { // we find the total here
            sum += parseInt(valuesArray[i])
        }

        var count = 0;
        valuesArray.forEach(function (number) {
            valuesArray[count] = (number / sum) * 100
            count = count + 1
        })

        return valuesArray
    }

    const uploadCharts = (dataset) => {

        const resultsJSON = JSON.stringify(dataset);

        uploadPercentageChart(JSON.parse(resultsJSON))
        uploadTypesChart(JSON.parse(resultsJSON))

        console.log(dataset)
    }

    const uploadTypesChart = (resultsData) => {
        var dataset = resultsData
        var ctx = document.getElementById('typesChart');

        var count = 0

        var dosAttacks = ["back", "land", "neptune", "pod", "smurf", "teardrop"]
        var r2lAttacks = ["ftp_write", "guess_passwd", "imap", "multihop", "phf", "warezclient", "warezmaster"]
        var u2rAttacks = ["buffer_overflow", "loadmodule", "perl", "rootkit"]
        var probingAttacks = ["ipsweep", "nmap", "porstweep", "satan"]

        var dosValue = 0
        var r2lValue = 0
        var u2rValue = 0
        var probingValue = 0

        for (const [key, value] of Object.entries(dataset)) {
            if (dosAttacks.includes(key)) {
                dosValue += parseInt(value)
            } else if (r2lAttacks.includes(key)) {
                r2lValue += parseInt(value)
            } else if (u2rAttacks.includes(key)) {
                u2rValue += parseInt(value)
            } else if (probingAttacks.includes(key)) {
                probingValue += parseInt(value)
            }
            delete dataset[key]
            count = count + 1
        }
        dataset["DOS attacks"] = dosValue
        dataset["R2L attacks"] = r2lValue
        dataset["U2R attacks"] = u2rValue
        dataset["Probing attacks"] = probingValue

        console.log(dataset)

        const labelsArray = []
        const finalValuesArray = []
        count = 0
        for (const [key, value] of Object.entries(dataset)) {
            finalValuesArray[count] = value
            labelsArray[count] = key
            count = count + 1
        }

        const data = {
            datasets: [{
                data: finalValuesArray,
                backgroundColor: getColors(labelsArray)
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: labelsArray
        };

        if (typesChart != null) {
            typesChart.destroy();
        }

        typesChart = new Chart(ctx, {
            data: data,
            type: 'doughnut',
            options: {
                title: {
                    display: true,
                    text: 'Attacks by type',
                    fontSize: '18',
                    fontColor: '#fff',
                    padding: '20',
                },
                legend: {
                    position: 'bottom'
                }
            }
        });

        typesChart.render()

    }

    const generateRandomNumber = (min, max) => {
        var random = crypto.getRandomValues(new Uint32Array(1))[0]/2**32
        return Math.floor(random * (max - min) + min);
    };

    const getColors = (labelsArray) => {
        var colors = []

        var count = 0
        var r = generateRandomNumber(100, 200),
            g = generateRandomNumber(100, 200),
            b = generateRandomNumber(100, 200)
        var a = 0.8
        labelsArray.forEach(function () {
            colors[count] = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')'
            r = generateRandomNumber(100, 200)
            g = generateRandomNumber(100, 200)
            b = generateRandomNumber(100, 200)
            count = count + 1
        })

        return colors
    }

    const uploadPercentageChart = (resultsData) => {

        var dataset = resultsData

        var ctx = document.getElementById('percentageChart');

        var count = 0
        var valuesArray = []
        var otherValue = 0

        valuesArray = getPercentage(Object.values(dataset))
        for (const [key] of Object.entries(dataset)) {
            if (valuesArray[count] < 1) {
                otherValue += valuesArray[count]
                delete dataset[key]
            } else {
                dataset[key] = valuesArray[count]
            }
            count = count + 1
        }
        dataset["other attacks"] = otherValue

        const labelsArray = []
        const finalValuesArray = []
        count = 0
        for (const [key, value] of Object.entries(dataset)) {
            finalValuesArray[count] = value
            labelsArray[count] = key
            count = count + 1
        }

        const data = {
            datasets: [{
                data: finalValuesArray,
                backgroundColor: getColors(labelsArray)
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: labelsArray
        };

        if (percentageAttacksChart != null) {
            percentageAttacksChart.destroy();
        }

        percentageAttacksChart = new Chart(ctx, {
            data: data,
            type: 'doughnut',
            options: {
                title: {
                    display: true,
                    text: 'Attacks percentage',
                    fontSize: '18',
                    fontColor: '#fff',
                    padding: '20',
                },
                legend: {
                    position: 'bottom'
                }
            }
        });

        percentageAttacksChart.render()

    }


    return (
        <>
            <PermissionsGate
                scopes={[SCOPES.administratorCanAccess, SCOPES.normalCanAccess]}
                RenderForbiddenContent={() => <RestrictedContent allowedRole={"noLogged"} />}
            >
                <IndexNavbar />
                <div className="wrapper">
                    <AnalyzeHeader />
                    <div className="main">
                        <div className="section section-basic" id="basic-elements">
                            <Container >
                                <Row >
                                    <Col md="10">
                                        <Card className="card-plain">
                                            <CardHeader>
                                                <h1 className="profile-title text-left">Select a file</h1>
                                                <h5 className="text-on-back">ANALYZE</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Alert className="DatasetFormatAlert" color="info">
                                                    <strong></strong>
                                                </Alert >
                                                <Form>
                                                    <div className="form-group">
                                                        <div id="fileSelector" className="custom-file">
                                                            <input onChange={(e) => changeName(e)} type="file" className="custom-file-input" name="file" id="file" accept=".csv" />
                                                            <label id="labelFile" className="custom-file-label" htmlFor="file">
                                                                Select a file...
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <button type="submit" id="btn-analyze" className="btn btn-info" onClick={(e) => update(e)}>
                                                        Analyze
                                                    </button>
                                                </Form>
                                                {errorMessage
                                                    ? <div class="alert alert-danger d-flex align-items-center" role="alert">
                                                        <div>
                                                            {errorMessage}
                                                        </div>
                                                    </div>
                                                    : null}
                                                <div className="AlertContainer">
                                                    <Alert className="AnalyzeAlert" color="info">
                                                        <strong></strong>
                                                    </Alert >
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                            <section className="section section-lg">
                                <Container>
                                    <Row>
                                        <Col>
                                            <Card className="card-plain">
                                                <CardHeader>
                                                    <h1 className="profile-title text-left">Analyze data</h1>
                                                    <h5 className="text-on-back">RESULTS</h5>
                                                </CardHeader>
                                                <CardBody>
                                                    <div className="results" style={results}>
                                                        <pre id="resultData">
                                                        </pre>
                                                    </div>

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Container>
                            </section>
                            <div className="section section-nucleo-icons">
                                <Container>
                                    <Row md="12">
                                        <Col md="6">
                                            <div className="percentages">
                                                <canvas id="percentageChart" width="100" height="100"></canvas>
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="types">
                                                <canvas id="typesChart" width="100" height="100"></canvas>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>

                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </PermissionsGate>
        </>
    );
}