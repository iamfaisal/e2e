import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter } from "../../helpers/resource";
import { getUserFullName } from "../../helpers/app";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";

class Instructors extends Component {
    constructor(props) {
        super(props);

        this.state = {
            instructors: [],
            regulations: [],
            filters: {
                deleted: "0",
                status: "1"
            },
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({loader: true});

        read('users', { params: { role: 'instructor'} })
            .then(res => {
                this.setState({
                    instructors: res.data.users,
                    loader: false
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    loader: true
                });
            });

        read('regulations', {}).then(res => {
            this.setState({
                regulations: res.data.regulations
            });
        }).catch(err => console.log(err));
    }

    renderLoader() { return <div className="loader" /> }

    renderActions(instructor) {
        let status = "Approve";
        let icon = "ion-md-checkmark";

        if (instructor.status) {
            status = "Archive";
            icon = "ion-md-close";
        }

        return <div className="actions">
            <Link className="ion-md-create" to={"/instructors/edit/" + instructor.id}
                data-toggle="tooltip" title="Edit Instructor" />
            <a className={icon} onClick={e => this.toggleStatus(e, instructor.id)}
                data-toggle="tooltip" title={status + " Instructor"} />
        </div>
    }

    toggleStatus(e, instructor) {
        read('users/status/' + instructor, {})
            .then(res => {
                this.getData();
            })
            .catch(err => console.log(err));
    }

    setfilter(value, key) {
        let { filters } = this.state;

        if (typeof value == 'string') {
            filters[key] = value;
        } else {
            filters[key] = value.target.value;
        }

        this.setState({ filters: filters });
    }

    toggleNeedApproval(e) {
        let { filters } = this.state;
        filters.status = e.target.checked ? "0" : "1";
        this.setState({ filters: filters });
    }

    toggleArchived(e) {
        let { filters } = this.state;
        filters.deleted = "0";
        if (e.target.checked) filters.deleted = "1";
        this.setState({ filters: filters });
    }

    render() {
        let { instructors, regulations, filters, loader } = this.state;
        const columns = [
            {
                name: 'Name',
                cell: user => {
                    return <div>
                        <Link to={"/instructors/edit/" + user.id}>{getUserFullName(user)}</Link><br />
                        <small>educate</small>
                    </div>
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
                name: 'State',
                selector: 'profile.state',
                sortable: true
            },
            {
                name: 'License',
                cell: user => user.licenses.length ? user.licenses[0].code : "",
                sortable: true
            },
            {
                name: 'Approved',
                cell: user => user.status ? "Yes" : "No",
                selector: 'status',
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
            instructors = filter(instructors, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>Instructors</h2>
                    <Link className="button" to={"/instructors/create"}>Add New Instructor</Link>
                </header>

                <div className="filter">
                    <input type="text" placeholder="Search Instructors" onChange={e => this.setfilter(e, "email")} />
                    <Select items={regulations} placeholder="Select State" id={"abbreviation"} val={"name"} onChange={value => this.setfilter(value, "profile.state")} />

                    <br />

                    <label className="checkbox">
                        <input type="checkbox" onChange={e => this.toggleNeedApproval(e)} />
                        <span>Pending Approval</span>
                    </label>

                    <label className="checkbox">
                        <input type="checkbox" onChange={e => this.toggleArchived(e)} />
                        <span>Archived Instructors</span>
                    </label>
                </div>

                <div className="tablewrap">
                    {!loader && instructors
                        ? <DataTable columns={columns} data={instructors} noHeader={true} pagination />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Instructors;