import React from "react";

import IndexNavbar from "components/Navbars/IndexNavbar.js"
import AnalyzeHeader from "components/PageHeader/AnalyzeHeader.js"
import Footer from "components/Footer/Footer.js"

import Chart from "chart.js"

import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Form,
} from "reactstrap";

async function uploadFile(data) {
    return fetch('/analyze', {
        method: 'POST',
        body: data
    });
};


export default function Analyze() {

    var percentageAttacksChart
    var typesChart

    React.useEffect(() => {
        document.body.classList.toggle("index-page");
        document.body.classList.toggle("profile-page");

        const initializeCharts = () => {
            var ctx = document.getElementById('percentageChart');
    
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

            ctx = document.getElementById('typesChart')

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

        initializeCharts()

        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("profile-page");
            document.body.classList.toggle("index-page");

        };
    }, []);

    const update = (e) => {
        e.preventDefault();

        const fileField = document.querySelector('input[type="file"]');
        const formData = new FormData();
        formData.append('file', fileField.files[0]);

        document.getElementById("btn-analyze").disabled = true;
        document.getElementById("file").disabled = true;
        document.getElementById("resultData").innerHTML = "";
        //document.getElementById("btn-analyze").style.cursor = "wait"

        uploadFile(formData)
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {

                    //console.log(result['predicts'])
                    document.getElementById("btn-analyze").disabled = false;
                    document.getElementById("file").disabled = false;
                    //document.getElementById("btn-analyze").style.cursor = "auto"

                    var parElement = document.getElementById("resultData");

                    var text = ""
                    for (const [key, value] of Object.entries(result['predicts'])) {
                        text = text + key + " --> " + value + "\n"
                    }

                    var textToAdd = document.createTextNode(text);
                    parElement.appendChild(textToAdd);

                    uploadCharts(result['predicts'])

                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById("btn-analyze").disabled = false;
                document.getElementById("file").disabled = false;
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
            } else if (r2lAttacks.includes(key)){
                r2lValue += parseInt(value)
            } else if (u2rAttacks.includes(key)){
                u2rValue += parseInt(value)
            } else if (probingAttacks.includes(key)){
                probingValue += parseInt(value)
            }
            delete dataset[key]
            count = count + 1
        }
        dataset["Ataques DOS"] = dosValue
        dataset["Ataques R2L"] = r2lValue
        dataset["Ataques U2R"] = u2rValue
        dataset["Ataques probing"] = probingValue

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

        if(typesChart != null){
            typesChart.destroy();
        }

        typesChart = new Chart(ctx, {
            data: data,
            type: 'doughnut',
            options: {
                title: {
                    display: true,
                    text: 'Tipos de Ataque',
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
        return Math.floor(Math.random() * (max - min) + min);
    };

    const getColors = (labelsArray) => {
        var colors = []

        var count = 0
        var r = generateRandomNumber(100, 200),
            g = generateRandomNumber(100, 200),
            b = generateRandomNumber(100, 200)
        var a = 0.8
        labelsArray.forEach(function (number) {
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

        if(percentageAttacksChart != null){
            percentageAttacksChart.destroy();
        }

        percentageAttacksChart = new Chart(ctx, {
            data: data,
            type: 'doughnut',
            options: {
                title: {
                    display: true,
                    text: 'Porcentaje de ataques',
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
                                            <h1 className="profile-title text-left">Selecciona el archivo</h1>
                                            <h5 className="text-on-back">ANALIZAR</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Form>
                                                <div className="form-group">
                                                    <div id="fileSelector" className="custom-file">
                                                        <input onChange={(e) => changeName(e)} type="file" className="custom-file-input" name="file" id="file" />
                                                        <label id="labelFile" className="custom-file-label" htmlFor="file">
                                                            Selecciona un archivo...
                                                        </label>
                                                    </div>
                                                </div>
                                                <button type="submit" id="btn-analyze" className="btn btn-primary" onClick={(e) => update(e)}>
                                                    Analizar
                                                </button>
                                            </Form>
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
                                                <h1 className="profile-title text-left">Datos del Analisis</h1>
                                                <h5 className="text-on-back">RESULTADO</h5>
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
        </>
    );
};