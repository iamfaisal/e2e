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
            filters: {},
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteInstructor = this.deleteInstructor.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({loader: true});

        read('users', { params: { role: 'instructor'}})
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

    renderLoader() {
        return (
            <div className="loader"/>
        );
    }

    renderActions(instructor) {
        let classname = instructor.status == 1 ? "hand" : "checkmark";
        let tooltip = instructor.status == 1 ? "Cancel" : "Approve";
        return (
            <div className="actions">
                <a className={"ion-md-" + classname} onClick={e => this.toggleStatus(e, instructor)}
                    data-toggle="tooltip" title={tooltip + " Instructor"} />
                <Link className="ion-md-create" to={"/instructors/edit/" + instructor.id}
                    data-toggle="tooltip" title="Edit Instructor" />
                <a className="ion-md-close" onClick={e => this.deleteInstructor(e, instructor.id)}
                    data-toggle="tooltip" title="Delete Instructor" />
            </div>
        );
    }

    toggleStatus(e, instructor) {
        read('users/status/'+instructor.id, {}).then(res => {
            instructor.status = !instructor.status;
            this.setState({});
        }).catch(err => alert("You do not have sufficient permissions to perform this task."));
    }

    deleteInstructor(e, instructor) {
        if (confirm('Do you really want to delete this Instructors?')) {
            remove('users/' + instructor, {})
            .then(res => {
                this.getData();
            })
            .catch(err => console.log(err));
        }
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
        delete filters.status;
        if (e.target.checked) filters.status = "0";
        this.setState({ filters: filters });
    }

    toggleArchived(e) {
        let { filters } = this.state;
        delete filters.is_deleted;
        if (e.target.checked) filters.is_deleted = "1";
        this.setState({ filters: filters });
    }

    render() {
        let { instructors, regulations, filters, loader } = this.state;
        const columns = [
            {
                name: 'Name',
                cell: user => {
                    return <Link to={"/instructors/edit/" + user.id}>{getUserFullName(user)}</Link>
                },
                ignoreRowClick: true,
                sortable: true,
            },
            {
                name: 'Email',
                selector: 'email',
                sortable: true,
            },
            {
                name: 'Actions',
                cell: user => this.renderActions(user),
                ignoreRowClick: true,
                width: '100px',
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
                        <span>Need Approval</span>
                    </label>

                    <label className="checkbox">
                        <input type="checkbox" onChange={e => this.toggleArchived(e)} />
                        <span>Show archived</span>
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