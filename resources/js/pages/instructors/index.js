import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, create, filter } from "../../helpers/resource";
import { getUserFullName } from "../../helpers/app";
import DataTable from "react-data-table-component";

class Instructors extends Component {
    constructor(props) {
        super(props);

        this.state = {
            instructors: [],
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
                console.log(res.data.users);
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
    }

    renderLoader() {
        return (
            <div className="loader"/>
        );
    }

    renderActions(instructor) {
        let classname = instructor.status == 1 ? "hand" : "checkmark";
        return (
            <div className="actions">
                <a className={"ion-md-" + classname} onClick={e => this.toggleStatus(e, instructor)} />
                <Link className="ion-md-create" to={"/instructors/edit/" + instructor.id} />
                <a className="ion-md-close" onClick={e => this.deleteInstructor(e, instructor.id)} />
            </div>
        );
    }

    toggleStatus(e, instructor) {
        create('/users/status' + instructor.id, {}).then(res => {
            instructor.status = !instructor.status;
        }).catch(err => console.log(err));
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

    setfilter(e, key) {
        let { filters } = this.state;
        filters[key] = e.target.value;
        this.setState({filters: filters});
    }

    render() {
        let { instructors, filters, loader } = this.state;
        const columns = [
            {
                name: 'Name',
                cell: user => getUserFullName(user),
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