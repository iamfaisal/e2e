import axios from "axios";

export function login(credentials) {
    return new Promise((res, rej) => {
        axios.post("/api/auth/login", credentials)
            .then((response) => {
                setAuthTokenInLocalStorage(response.data.user, response.data.access_token);
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

export function setAuthorizationToken(token) {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
}

export function setAuthTokenInLocalStorage(user, token) {
    if (user && token) {
        const currentUser = Object.assign({}, user, {token: token});
        localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
        localStorage.removeItem("user")
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