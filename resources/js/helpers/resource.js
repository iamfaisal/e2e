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

export function filter(data, filters) {
    return data.filter(item => {
        let ok = true;
        for (let filter in filters) {
            let search = filters[filter];
            if (!search) continue;

            let tosearch = item[filter];
            if (filter.search('.') > -1) {
                let subfilter = item;
                filter.split(".").forEach(part => subfilter = subfilter[part]);
                tosearch = subfilter;
            }
            if (Array.isArray(tosearch)) tosearch = tosearch.join(' ');
            if (typeof tosearch == 'number') tosearch = tosearch.toString();

            if (tosearch.search(new RegExp(search, "i")) < 0) ok = false;
        }
        return ok;
    });
}