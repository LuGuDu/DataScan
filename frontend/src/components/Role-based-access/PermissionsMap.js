//Roles for the logged user
export const ROLES = {
    administrator: "administrator",
    noLogged: "no-logged"
};

//Definition of the different access levels for the pages
export const SCOPES = {
    administratorCanAccess: "administrator-can-access"
};

//Assignations of the scopes each role has access to
export const PERMISSIONS = {
    [ROLES.administrator]: [SCOPES.administratorCanAccess],
    [ROLES.noLogged]: []
};