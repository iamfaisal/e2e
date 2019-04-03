import React, { Component, Fragment } from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import { getAuthUser } from "../helpers/auth";
import { is } from "../helpers/acl";

import Header from "./Header";

class Layout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            page: props.location.pathname.split("/")[1],
            sidebar: true
        }

        this.sidebarHandler = this.sidebarHandler.bind(this);
    }

    sidebarHandler (change) {
        this.setState({sidebar: change});
    }

    render() {
        const currentUser = getAuthUser();
        const { sidebar } = this.state;
        const mainWrapperClass = classnames({"content": currentUser}, {"full": !sidebar});

        return (
            <Fragment>
                {currentUser && <Header sidebar={this.sidebarHandler} page={this.state.page}/>}
                <main className={mainWrapperClass}>
                    {this.props.children}
                </main>
            </Fragment>
        );
    }
}

export default withRouter(Layout);