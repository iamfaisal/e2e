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
                deleted: "0"
            },
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteInstructor = this.deleteInstructor.bind(this);
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
        return (
            <div className="actions">
                <Link className="ion-md-create" to={"/instructors/edit/" + instructor.id}
                    data-toggle="tooltip" title="Edit / Archive" />
                <a className="ion-md-close" onClick={e => this.deleteInstructor(e, instructor.id)}
                    data-toggle="tooltip" title="Delete Instructor" />
            </div>
        );
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
                name: 'State',
                cell: user => user.profile.state,
                sortable: true,
            },
            {
                name: 'License',
                cell: user => console.log(user),
                sortable: true,
            },
            {
                name: 'Approved',
                cell: user => user.status ? "Yes" : "No",
                sortable: true,
            },
            {
                name: 'Actions',
                cell: user => this.renderActions(user),
                ignoreRowClick: true,
                width: '100px',
            }
        ];

        console.log(instructors);

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