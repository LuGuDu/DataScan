import React from 'react';
import { Alert, Button } from "reactstrap";

//Page used when a user tries to access a page not autorized
const RestrictedContent = ({ allowedRole }) => {

    //Map of each role to the word in spanish in order to use it in the message
    const mapAllowedRole = {
        administrator: "Admin",
        noLogged: "Admin"
    }

    const redirectLogin = () => {
        window.location.href = '/login';
    }

    return (
        <div id="error-page">
            <div class="content">
                <Alert >
                    <h2 class="header" data-text="403"> 403 </h2>
                    <h4 data-text="¡Contenido restringido!">  ¡Restricted content! </h4>
                    <hr />
                    <p>
                        To access to this page, you need to be loggin as: <b>{mapAllowedRole[allowedRole]}</b>
                    </p>
                    <div class="btns">
                        <Button onClick={() => redirectLogin()} >Login</Button>
                    </div>
                </Alert>
            </div>
        </div >
    );
}

export default RestrictedContent;