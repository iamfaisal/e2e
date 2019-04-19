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
        .catch(err => {
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
        .catch(err => {
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
        .catch(err => {
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
            .catch(err => {
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
        window.location.href = "/login";
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

            if (search instanceof Date) {
                if (filter == "start_date" && new Date(tosearch) >= search) continue;
                if (filter == "end_date") {
                    search.setHours(23);
                    search.setMinutes(59);
                    if (new Date(tosearch) <= search) continue;
                }
            }

            if (!tosearch) {
                ok = false;
                continue;
            }

            if (search.substr(0, 1) == '!') {
                if (tosearch.search(new RegExp(search.substr(1), "i")) >= 0) ok = false;
            } else {
                if (tosearch.search(new RegExp(search, "i")) < 0) ok = false;
            }
        }
        return ok;
    });
}

export function formatDate(str, dateOnly) {
    const date = new Date(str);

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    if (isNaN(day)) return "-";

    let hour = date.getHours();
    let min = date.getMinutes();
    let ampm = hour >= 12 ? 'PM' : 'AM';

    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    if (hour.toString().length == 1) hour = "0" + hour;
    if (min.toString().length == 1) min = "0" + min;

    let output = day + "/" + month + "/" + year;
    if (!dateOnly) output += ", " + hour + ":" + min + " " + ampm;

    return output;
}

export function dateToString(date, time) {
    if (!date) return "";

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let hour = date.getHours();
    let min = date.getMinutes();

    if (time) {
        return year + "-" + month + "-" + day + " " + hour + ":" + min + ":00";
    } else {
        return year + "-" + month + "-" + day;
    }
}

export function dateDifference(date1, date2) {
    return (new Date(date2) - new Date(date1)) / (1000*60*60);
}

export function addDays(date, days) {
    date.setDate(date.getDate() + days);
    return date;
}

export function formatPhone(phone) {
    return phone.replace(/[^\d]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}