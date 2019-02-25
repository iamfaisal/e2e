import React, { Component, Fragment } from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import { getAuthUser } from "../helpers/auth";

import Header from "./Header";

class Layout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            page: props.location.pathname.split("/")[1]
        }
    }

    render() {
        const currentUser = getAuthUser();
        const mainWrapperClass = classnames({"content": currentUser});
        return (
            <Fragment>
                {currentUser && <Header page={this.state.page}/>}
                <main className={mainWrapperClass}>
                    {this.props.children}
                </main>
            </Fragment>
        );
    }
}

export default withRouter(Layout);