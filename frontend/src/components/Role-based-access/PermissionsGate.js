import { PERMISSIONS } from "./PermissionsMap"
import { AES, enc } from 'crypto-js';

const hasPermission = ({ permissions, scopes }) => {
    const scopesMap = {};
    scopes.forEach((scope) => {
        scopesMap[scope] = true;
    });

    return permissions.some((permission) => scopesMap[permission]);
};

export default function PermissionsGate({
    children,
    RenderForbiddenContent = () => <></>,
    scopes = []
}) {

    let role = 'no-logged';
    let roleKey = sessionStorage.getItem("VALUE");
    // If user is not logged in, set role as 'no-logged'
    if (roleKey !== null) {
        if (sessionStorage.getItem("userRole") !== 'no-logged')
            role = AES.decrypt(sessionStorage.getItem("userRole"), roleKey).toString(enc.Utf8);
    }

    const permissions = PERMISSIONS[role];

    const permissionGranted = hasPermission({ permissions, scopes });

    if (!permissionGranted) return <><RenderForbiddenContent /></>

    return <>{children}</>;
}