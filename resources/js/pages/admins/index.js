import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter } from "../../helpers/resource";
import { getUserFullName } from "../../helpers/app";
import DataTable from "react-data-table-component";

class Admins extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            filters: {},
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteAdmin = this.deleteAdmin.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({loader: true});

        read('users', {params: {role: 'admin'}})
            .then(res => {
                this.setState({
                    users: res.data.users,
                    loader: false
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    loader: true
                });
            });
    }

    renderLoader() {
        return (
            <div className="loader"/>
        );
    }

    renderActions(user) {
        let classname = user.status === 1 ? "hand" : "checkmark";
        return (
            <div className="actions">
                <a data-toggle="tooltip" title={user.status === 1 ? "Cancel School" : "Approve School"} className={"ion-md-" + classname} onClick={e => this.toggleStatus(e, user)} />
                <Link data-toggle="tooltip" title="Edit School" className="ion-md-create" to={"/users/edit/" + user.id} />
                <a data-toggle="tooltip" title="Delete School" className="ion-md-close" onClick={e => this.deleteAdmin(e, user.id)} />
            </div>
        );
    }

    deleteAdmin(e, user) {
        if (confirm('Do you really want to delete this User?')) {
            remove('users/'+user, {})
            .then(res => {
                this.getData();
            })
            .catch(console.log);
        }
    }

    toggleStatus(e, user) {
        read('users/status/' + user.id, {}).then(res => {
            user.status = !user.status;
            this.setState({});
        }).catch(err => alert("You do not have sufficient permissions to perform this task."));
    }

    setfilter(e, key) {
        let { filters } = this.state;
        filters[key] = e.target.value;
        this.setState({filters: filters});
    }

    render() {
        let { users, filters, loader } = this.state;
        const columns = [
            {
                name: 'Name',
                cell: user => {
                    return <Link to={"/users/edit/" + user.id}>{getUserFullName(user)}</Link>
                },
                selector: 'profile.first_name',
                ignoreRowClick: true,
                sortable: true
            },
            {
                name: 'Email',
                selector: 'email',
                sortable: true
            },
            {
                name: 'Actions',
                cell: user => this.renderActions(user),
                ignoreRowClick: true,
                width: '100px'
            }
        ];

        if (Object.keys(filters).length) {
            users = filter(users, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>School</h2>
                    <Link className="button" to={"/users/create"}>Add New School</Link>
                </header>

                <div className="filter">
                    <input type="text" placeholder="Search Schools" onChange={e => this.setfilter(e, "email")} />
                </div>

                <div className="tablewrap">
                    {!loader && users
                        ? <DataTable columns={columns} data={users} noHeader={true} pagination />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Admins;