import React, {Component} from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { getAuthUser, getAuthUserName, logout } from "../helpers/auth";
import { asset, getuser, getUserAvatar } from "../helpers/app";
import { read } from "../helpers/resource";
import { getRoles, isJustInstructor, routeToDashboard } from "../helpers/acl";
import { links } from "./navigation";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            sidebar: true,
            sidebar_open: false
        };

        read('users/' + getuser().id, {}).then(res => {
            this.setState({ user: res.data })
        });

        this.handleLogout = this.handleLogout.bind(this);
        this.handleSidebarToggle = this.handleSidebarToggle.bind(this);
        this.renderNavigation = this.renderNavigation.bind(this);
    }

    handleLogout() {
        logout();
    }

    handleSidebarToggle() {
        const { sidebar, sidebar_open } = this.state;
        if (window.innerWidth >= 768) {
            this.setState({ sidebar: !sidebar });
            this.props.sidebar(!sidebar);
        } else {
            this.setState({ sidebar_open: !sidebar_open });
        }
    }

    renderNavigation(role, roleLinks) {
        const { user } = this.state;

        return <nav key={role}>
            <h3>{role.replace("-", " ")}</h3>
            <ul>
                {roleLinks.map(link => {
                    let enabled = Object.keys(user).length && link.enable ? eval(link.enable) : true;

                    return <li key={link.url} className={classnames({ "active": window.location.pathname === link.url })}>
                        <Link to={link.url} className={link.icon} disabled={!enabled}> <span>{link.name}</span></Link>
                        {link.menu && <ul>
                            {link.menu.map(sublink => {
                                let sub_enabled = Object.keys(user).length && sublink.enable ? eval(sublink.enable) : true;

                                return <li key={sublink.url} className={classnames({ "active": window.location.pathname === sublink.url })}>
                                    <Link to={sublink.url} disabled={!sub_enabled}>{sublink.name}</Link>
                                </li>
                            })}
                        </ul>}
                    </li>
                })}
            </ul>
        </nav>
    }

    render() {
        const { sidebar } = this.state;
        let { sidebar_open } = this.state;
        const self = this;
        const sidebarClass = classnames("sidebar", { "collapse": !sidebar }, { "open": sidebar_open });
        const user = getAuthUser();
        const userName = getAuthUserName();
        const editProfileRoute = isJustInstructor() ? "instructors" : "users";

        return (
            <div>
                <header className="header">
                    <Link className="logo" to={routeToDashboard()}>
                        <img src={asset("images/logo.png")}/>
                    </Link>
                    <div className="actions">
                        <Link className="profile" to={"/" + editProfileRoute + "/edit/" + user.id}>
                            <img src={getUserAvatar(user)} alt={userName} />
                        </Link>
                        <a href="javascript:void(0)" onClick={this.handleLogout} className="logout ion-md-log-out"
                            data-toggle="tooltip" data-placement="left" title="Logout" />
                        <a className="ion-md-more" onClick={this.handleSidebarToggle} />
                    </div>
                </header>
                <aside className={sidebarClass}>
                    <header>
                        <Link className="logo" to={routeToDashboard()}>
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

                    <Link className="profile" to={"/"+editProfileRoute+"/edit/"+user.id}>
                        <img src={getUserAvatar(user)} alt={userName}/>
                        <div>
                            <h4>{userName}</h4>
                            <h5>{user.email}</h5>
                        </div>
                    </Link>
                </aside>
            </div>
        );
    }
}

export default Header;