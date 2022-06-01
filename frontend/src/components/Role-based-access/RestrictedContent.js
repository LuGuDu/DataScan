import React from 'react';
import { Alert, Button } from "reactstrap";

//Page used when a user tries to access a page not autorized
const RestrictedContent = ({ allowedRole }) => {

    const mapAllowedRole = {
        administrator: "Admin",
        normal: "normal",
        noLogged: "Normal or Admin"
    }

    const redirectLogin = () => {
        window.location.href = '/login';
    }

    return (
        <div id="error-page">
            <div className="content">
                <Alert >
                    <h2 className="header" data-text="403"> 403 </h2>
                    <h4 data-text="¡Contenido restringido!">  ¡Restricted content! </h4>
                    <hr />
                    <p>
                        To access to this page, you need to be loggin as: <b>{mapAllowedRole[allowedRole]}</b>
                    </p>
                    <div className="btns">
                        <Button onClick={() => redirectLogin()} >Login</Button>
                    </div>
                </Alert>
            </div>
        </div >
    );
}

export default RestrictedContent;