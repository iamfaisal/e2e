import axios from "axios";

export function create(dataType, params, files) {
    let headers = {};
    if (files) headers = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }

    return new Promise((res, rej) => {
        axios.post("/api/auth/"+dataType, params, headers)
        .then((response) => {
            res(response);
        })
        .catch((err) => {
            rej(err);
        })
    })
}

export function read(dataType, params, files) {
    let headers = {};
    if (files) headers = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }

    return new Promise((res, rej) => {
        axios.get("/api/auth/"+dataType, params, headers)
        .then((response) => {
            res(response);
        })
        .catch((err) => {
            rej(err);
        })
    })
}

export function update(dataType, params, files) {
    let headers = {};
    if (files) headers = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }

    return new Promise((res, rej) => {
        axios.post("/api/auth/"+dataType, params, headers)
        .then((response) => {
            res(response);
        })
        .catch((err) => {
            rej(err);
        })
    })
}

export function remove(dataType, params) {
    return new Promise((res, rej) => {
        axios.delete("/api/auth/"+dataType, params)
            .then((response) => {
                res(response);
            })
            .catch((err) => {
                rej(err);
            })
    })
}