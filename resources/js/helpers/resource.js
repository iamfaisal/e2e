import axios from "axios";

export function read(dataType, params) {
    return new Promise((res, rej) => {
        axios.get("api/auth/"+dataType, params)
            .then((response) => {
                res(response);
            })
            .catch((err) => {
                rej(err);
            })
    })
}