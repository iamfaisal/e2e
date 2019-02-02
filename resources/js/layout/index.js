import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";

import Header from "./Header";

class Layout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            page: props.location.pathname.split("/")[1]
        }
    }

    render() {
        return (
            <Fragment>
                <Header page={this.state.page}/>
                {this.props.children}
            </Fragment>
        );
    }
}

export default withRouter(Layout);