import React from 'react';
import { Alert, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

//Page used when a user tries to access a page not autorized
const RestrictedContent = ({ allowedRole }) => {

    const mapAllowedRole = {
        administrator: "Admin",
        normal: "normal",
        noLogged: "Normal or Admin"
    }

    const navigate = useNavigate();

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
                        <Button onClick={() => navigate('/login')} >Login</Button>
                    </div>
                </Alert>
            </div>
        </div >
    );
}

export default RestrictedContent;