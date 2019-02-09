export function decodeAclData() {
    let data  = JSON.parse(localStorage.getItem("user"));
    data = data.roles.replace(data.token, "");
    return JSON.parse(window.atob(data));
}

export function can(role, permission) {
    const data = decodeAclData();
    return data[role] ? data[role].includes(permission): false;
}

export function is(role) {
    const data = decodeAclData();
    return !!data[role];
}