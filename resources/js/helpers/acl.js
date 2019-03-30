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

export function isJustInstructor() {
    const data = decodeAclData();
    return !!data["instructor"] && getRoles().length === 1;
}

export function getRoles() {
    const data = decodeAclData();
    return Object.keys(data);
}