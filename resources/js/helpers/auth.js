import axios from "axios";

export function login(credentials) {
    return new Promise((res, rej) => {
        axios.post("/api/auth/login", credentials)
            .then((response) => {
                setAuthTokenInLocalStorage(response.data.user, response.data.access_token, response.data.roles);
                setAuthorizationToken(response.data.access_token);
                res(response);
            })
            .catch((err) => {
                rej(err);
            })
    })
}

export function forgotPassword(credentials) {
	return new Promise((res, rej) => {
        axios.post("/api/auth/forgot", credentials)
            .then((response) => {
                res(response);
            })
            .catch((err) => {
                rej(err);
            })
	})
}

export function resetPassword(credentials) {
    return new Promise((res, rej) => {
        axios.post("/api/auth/reset", credentials)
            .then((response) => {
                res(response);
            })
            .catch((err) => {
                rej(err);
            })
    })
}

export function getEmailFromToken(credentials) {
    return new Promise((res, rej) => {
        axios.post("/api/auth/reset_email", credentials)
            .then((response) => {
                res(response);
            })
            .catch((err) => {
                rej(err);
            })
    })
}

export function getAuthUser() {
    const user = localStorage.getItem("user");
    return JSON.parse(user) || false;
}

export function getAuthUserName() {
    const user = localStorage.getItem("user");
    if (JSON.parse(user)) {
        const firstName = JSON.parse(user).profile.first_name;
        const lastName = JSON.parse(user).profile.last_name;
        const userName = JSON.parse(user).name;
        return firstName && lastName ? firstName + " " + lastName : userName;
    }
    return false;
}

export function setAuthorizationToken(token) {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
}

export function encodeAclData(acl, token) {
    let aclArray = {};
    acl.map((role) => {
        aclArray[role.name] = role.permissions && role.permissions.map(permission => permission.name);
    });
    return window.btoa(JSON.stringify(aclArray)) + token;
}

export function setAuthTokenInLocalStorage(user, token, acl) {
    if (user && token && acl) {
        const currentUser = Object.assign({}, user, {token: token}, {roles: encodeAclData(acl, token)});
        localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
        localStorage.removeItem("user")
    }
}

export function handleSession(response) {
    if (response && response.message && response.message === "Request failed with status code 500") {
        setAuthTokenInLocalStorage();
        setAuthorizationToken();
    }
}

export function logout() {
    axios.post("/api/auth/logout")
        .then((response) => {
            setAuthTokenInLocalStorage();
            setAuthorizationToken();
        });
    window.location.reload();
}