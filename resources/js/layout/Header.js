import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getAuthUser, logout } from "../helpers/auth";

class Header extends Component {
    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        logout();
    }

    render() {
        const currentUser = getAuthUser();

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link to={"/"} className="navbar-brand">MyCE App</Link>
                    <button className="navbar-toggler"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarContent"
                            aria-controls="navbarContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarContent">
                        {currentUser ?
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle isLink text-capitalize"
                                       id="navbarDropdownMenuLink"
                                       role="button" data-toggle="dropdown"
                                       aria-haspopup="true" aria-expanded="false">
                                        Hi, {currentUser.name}
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                        <a className="dropdown-item isLink" onClick={this.handleLogout}>Logout</a>
                                    </div>
                                </li>
                            </ul>
                            :
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link to={"/login"} className="nav-link">Login</Link>
                                </li>
                            </ul>
                        }
                    </div>
                </div>
            </nav>
        );
    }
}

export default Header;