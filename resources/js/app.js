require("./bootstrap");
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom"

import Layout from "./layout";
import routes from "./routes";

export default class App extends Component {
    render() {
        return (
            <Layout>
                <Switch>
                    {routes.map((route, i) => <Route key={i} { ...route } />)}
                </Switch>
            </Layout>
        );
    }
}

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);

