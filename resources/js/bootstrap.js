try {
    window.$ = window.jQuery = require("jquery");
    require("bootstrap");
} catch (e) {}

window.axios = require("axios");
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const user = localStorage.getItem("user");

try {
    const token = JSON.parse(user).token;
    window.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
} catch (e) {}