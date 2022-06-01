import React from "react";

import IndexNavbar from "components/Navbars/IndexNavbar.js"
import LoginNavBar from "components/Navbars/LoginNavBar"
import Footer from "components/Footer/Footer.js"
import NoLoggedFooter from "components/Footer/NoLoggedFooter.js"

import AttackTypesInfoHeaderHeader from "components/PageHeader/AttackTypesInfoHeader.js"
import DosInfo from "views/AttacksSections/DOSInfo.js"
import ProbeInfo from "views/AttacksSections/ProbeInfo.js"
import R2LInfo from "views/AttacksSections/R2LInfo.js"
import U2RInfo from "views/AttacksSections/U2RInfo.js"

import PermissionsGate from 'components/Role-based-access/PermissionsGate.js'
import { SCOPES } from 'components/Role-based-access/PermissionsMap.js'



import {
    Container,
} from "reactstrap";

export default function AttackTypesInfo() {

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
            <PermissionsGate
                scopes={[SCOPES.administratorCanAccess, SCOPES.normalCanAccess]}
            >
                <IndexNavbar />
            </PermissionsGate>

            <PermissionsGate
                scopes={[SCOPES.noLoggedCanAccess]}
            >
                <LoginNavBar />
            </PermissionsGate>

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


                <PermissionsGate
                    scopes={[SCOPES.administratorCanAccess, SCOPES.normalCanAccess]}
                >
                    <Footer />
                </PermissionsGate>

                <PermissionsGate
                    scopes={[SCOPES.noLoggedCanAccess]}
                >
                    <NoLoggedFooter />
                </PermissionsGate>
            </div>
        </>
    );
};

