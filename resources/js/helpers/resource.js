import axios from "axios";
import { setAuthTokenInLocalStorage,setAuthorizationToken } from "./auth";

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

axios.interceptors.response.use((response) => {
    return response;
}, function (error) {
    if (400 < error.response.status && error.response.status < 500) {
        setAuthTokenInLocalStorage();
        setAuthorizationToken();
        window.location.reload();
    }
    return Promise.reject(error.response);
});

export function filter(data, filters) {
    return data.filter(item => {
        let ok = true;
        for (let filter in filters) {
            let search = filters[filter];
            if (!search) continue;

            let tosearch = item[filter];

            if (filter.search('.') > -1) {
                let subfilter = item;
                filter.split(".").forEach(part => {
                    if (!Array.isArray(subfilter)) {
                        subfilter = subfilter[part]
                    } else {
                        let values = [];
                        subfilter.forEach(val => values.push(val[part]));
                        subfilter = values;
                    }
                });
                tosearch = subfilter;
            }
            if (Array.isArray(tosearch)) tosearch = tosearch.join(' ');
            if (typeof tosearch == 'number') tosearch = tosearch.toString();

            if (!tosearch) {
                ok = false;
                continue;
            }
            if (tosearch.search(new RegExp(search, "i")) < 0) ok = false;
        }
        return ok;
    });
}

export function formatDate(str) {
    const date = new Date(str);
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "No", "Dec"];

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let hour = date.getHours();
    let min = date.getMinutes();
    let ampm = hour >= 12 ? 'pm' : 'am';

    if (hour.toString().length == 1) hour = "0" + hour;
    if (min.toString().length == 1) min = "0" + min;

    return day + " " + months[month] + " " + year + ", " + hour + ":" + min + " " + ampm;
}