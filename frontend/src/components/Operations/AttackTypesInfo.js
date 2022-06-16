import React from "react";

import IndexNavbar from "components/Navbars/IndexNavbar.js"
import Footer from "components/Footer/Footer.js"

import AttackTypesInfoHeaderHeader from "components/PageHeader/AttackTypesInfoHeader.js"
import DosInfo from "views/AttacksSections/DOSInfo.js"
import ProbeInfo from "views/AttacksSections/ProbeInfo.js"
import R2LInfo from "views/AttacksSections/R2LInfo.js"
import U2RInfo from "views/AttacksSections/U2RInfo.js"

import {
    Container,
} from "reactstrap";

export default function AttackTypesInfo() {

    React.useEffect(() => {
        document.body.classList.toggle("index-page");
        return function cleanup() {
            document.body.classList.toggle("index-page");
        };
    }, []);

    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <AttackTypesInfoHeaderHeader />
                <div className="main">
                    <div className="section section-basic" id="basic-elements">
                        <Container >
                            <DosInfo />
                            <ProbeInfo />
                            <R2LInfo />
                            <U2RInfo />
                        </Container>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

