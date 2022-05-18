import React from "react";

import AdminNavbar from "components/Navbars/AdminNavbar.js"

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
    Nav,
    NavItem,
    NavLink,
} from "reactstrap";

export default function Admin() {

    React.useEffect(() => {
        document.body.classList.toggle("index-page");

        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("index-page");
        };
    }, []);

    return (
        <>
            <AdminNavbar />

        </>
    );
};