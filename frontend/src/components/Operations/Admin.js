import React from "react";

import AdminNavbar from "components/Navbars/AdminNavbar.js"
import AdminHeader from "components/PageHeader/AdminHeader";

import PermissionsGate from 'components/Role-based-access/PermissionsGate.js'
import { SCOPES } from 'components/Role-based-access/PermissionsMap.js'
import RestrictedContent from 'components/Role-based-access/RestrictedContent.js'

import {
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
            <PermissionsGate
                scopes={[SCOPES.administratorCanAccess]}
                RenderForbiddenContent={() => <RestrictedContent allowedRole={"administrator"} />}
            >
                <AdminNavbar />
                <AdminHeader />
            </PermissionsGate>

        </>
    );
}