import axios from "axios";

export function create(dataType, params) {
    return new Promise((res, rej) => {
        axios.post("/api/auth/"+dataType, params, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then((response) => {
            res(response);
        })
        .catch((err) => {
            rej(err);
        })
    })
}

export function read(dataType, params) {
    return new Promise((res, rej) => {
        axios.get("/api/auth/"+dataType, params)
            .then((response) => {
                res(response);
            })
            .catch((err) => {
                rej(err);
            })
    })
}

export function update(dataType, params) {
    return new Promise((res, rej) => {
        axios.put("/api/auth/"+dataType, params)
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