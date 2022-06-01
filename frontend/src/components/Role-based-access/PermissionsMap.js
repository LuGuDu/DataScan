//Roles for the logged user
export const ROLES = {
    administrator: "administrator",
    normal: "normal",
    noLogged: "no-logged"
};

//Definition of the different access levels for the pages
export const SCOPES = {
    administratorCanAccess: "administrator-can-access",
    normalCanAccess: "normal-can-access",
    noLoggedCanAccess: "no-logged-can-access"
};

//Assignations of the scopes each role has access to
export const PERMISSIONS = {
    [ROLES.administrator]: [SCOPES.administratorCanAccess],
    [ROLES.normal]: [SCOPES.normalCanAccess],
    [ROLES.noLogged]: [SCOPES.noLoggedCanAccess]
};