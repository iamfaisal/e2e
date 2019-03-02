import React, {Component, Fragment} from "react";
import { Link } from "react-router-dom";
import { getAuthUser, getAuthUserName, logout } from "../helpers/auth";
import { asset } from "../helpers/app";
import { is, getRoles } from "../helpers/acl";
import classnames from "classnames";
import { links } from "./navigation";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar: true
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.handleSidebarToggle = this.handleSidebarToggle.bind(this);
        this.renderNavigation = this.renderNavigation.bind(this);
    }

    handleLogout() {
        logout();
    }

    handleSidebarToggle() {
        const { sidebar } = this.state;
        this.setState({sidebar: !sidebar});
    }

    renderNavigation(role, roleLinks) {
        let roleName = role === "admin" ? "school-admin" : role;
        return(
            <nav key={roleName}>
                <h3>{roleName.replace("-", " ")}</h3>
                <ul>
                    {roleLinks.map(function(link) {
                        return (
                            <li key={link.url} className={classnames({"active": window.location.pathname === link.url})}>
                                <Link to={link.url} className={link.icon}> <span>{link.name}</span></Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }

    render() {
        const { sidebar } = this.state;
        const self = this;
        const sidebarClass = classnames("sidebar", { "collapse": !sidebar })
        const userName = getAuthUserName();

        return (
            <div>
                <header className="header">
                    <Link className="logo" to={"/"}>
                        <img src={asset("images/logo.png")}/>
                    </Link>
                    <div className="actions">
                        <a href="#" className="profile"><img src={asset("images/user.jpg")}/></a>
                        <a href="javascript:void(0)" onClick={this.handleLogout} className="logout ion-md-log-out"/>
                        <a href="#" className="ion-md-more"/>
                    </div>
                </header>
                <aside className={sidebarClass}>
                    <header>
                        <Link className="logo" to={"/"}>
                            <img src={asset("images/logo.png")}/>
                            <img src={asset("images/icon.png")}/>
                        </Link>
                        <div className="toggle" onClick={this.handleSidebarToggle}>
                            <a className="ion-ios-arrow-back"/>
                            <a className="ion-ios-arrow-forward"/>
                        </div>
                    </header>

                    {getRoles().map((role) => {
                        const roleLinks = links.filter(function(link){return link.role === role;});
                        return roleLinks && roleLinks.length > 0 ? self.renderNavigation(role, roleLinks) : false;
                    })}

                    <Link className="profile" to={"/users/edit/"+getAuthUser().id}>
                        <img src={asset("images/user.jpg")}/>
                        <h4>{userName}</h4>
                    </Link>
                </aside>
            </div>
        );
    }
}

export default Header;