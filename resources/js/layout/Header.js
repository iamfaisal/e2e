import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getAuthUser, logout } from "../helpers/auth";
import classnames from "classnames";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar: true
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.handleSidebarToggle = this.handleSidebarToggle.bind(this);
    }

    handleLogout() {
        logout();
    }

    handleSidebarToggle() {
        const { sidebar } = this.state;
        this.setState({sidebar: !sidebar});
    }

    render() {
        const { sidebar } = this.state;
        const sidebarClass = classnames("sidebar", { "collapse": !sidebar })
        const currentUser = getAuthUser();

        return (
            <div>
                <header className="header">
                    <Link className="logo" to={"/"}>
                        <img src="images/logo.png"/>
                    </Link>
                    <div className="actions">
                        <a href="#" className="profile"><img src="images/user.jpg"/></a>
                        <a href="javascript:void(0)" onClick={this.handleLogout} className="logout ion-md-log-out"/>
                        <a href="#" className="ion-md-more"/>
                    </div>
                </header>
                <aside className={sidebarClass}>
                    <header>
                        <Link className="logo" to={"/"}>
                            <img src="images/logo.png"/>
                            <img src="images/icon.png"/>
                        </Link>
                        <div className="toggle" onClick={this.handleSidebarToggle}>
                            <a className="ion-ios-arrow-back"/>
                            <a className="ion-ios-arrow-forward"/>
                        </div>
                    </header>

                    <nav>
                        <h3>System Admin</h3>
                        <ul>
                            <li className="active"><a href="#" className="ion-md-airplane"> <span>Menu Item 1</span></a>
                            </li>
                            <li><a href="#" className="ion-md-alarm"> <span>Menu Item 2</span></a></li>
                            <li><a href="#" className="ion-md-bulb"> <span>Menu Item 3</span></a></li>
                            <li><a href="#" className="ion-md-cloudy"> <span>Menu Item 4</span></a></li>
                        </ul>
                    </nav>

                    <div className="profile">
                        <img src="images/user.jpg"/>
                        <h4>{currentUser.name}</h4>
                    </div>
                </aside>
            </div>
        );
    }
}

export default Header;