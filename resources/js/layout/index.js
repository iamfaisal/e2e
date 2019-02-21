import React, { Component, Fragment } from "react";
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
        return (
            <Fragment>
                {currentUser && <Header page={this.state.page}/>}
                <main className="content">
                    {this.props.children}
                </main>
            </Fragment>
        );
    }
}

export default withRouter(Layout);