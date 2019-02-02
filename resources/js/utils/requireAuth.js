import React, { Component } from "react";
import { getAuthUser } from "../helpers/auth";

export default function (ComposedComponent) {

    class Authenticate extends Component {
        componentWillMount() {
            if (!getAuthUser()) this.props.history.push("/login");
        }

        render() {
            return (
                <ComposedComponent {...this.props} />
            );
        }
    }

    return Authenticate;
}