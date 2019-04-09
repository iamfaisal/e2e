import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter, formatDate } from "../../helpers/resource";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";
import { update } from "../../helpers/resource";

class Classes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: [],
            courses: [],
            instructors: [],
            filters: {
                is_deleted: "0"
            },
            loader: true,
            archived: false
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteClass = this.deleteClass.bind(this);
        this.uploadRoster = this.uploadRoster.bind(this);
    }

    componentDidMount() {
        this.getData({});

        read('courses/', {})
            .then(res => {
                this.setState({
                    courses: res.data.courses
                });
            })
            .catch(err => console.log(err));

        read('users', { params: { role: 'instructor' } })
            .then(res => {
                this.setState({
                    instructors: res.data.users
                });
            })
            .catch(err => console.log(err));
    }

    getData(params = {}) {
        this.setState({ loader: true });

        read('classes', params)
            .then(res => {
                this.setState({
                    classes: res.data.classes,
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

    renderActions(clss) {
        if (this.state.archived) {
            return (
                <form className="actions roaster-actions">
                    <input type="hidden" name="class_id" value={clss.id} />
                    {clss.roster ? <Link to={clss.roster} target="_blank">View Roaster</Link> : ""}
                    <span>|</span>
                    <label>
                        <input type="file" name="roster" onChange={this.uploadRoster} />
                        Upload Roaster
                    </label>
                </form>
            );
        } else {
            return (
                <div className="actions">
                    <Link data-toggle="tooltip" title="Approve Class" className="ion-md-checkmark" to={"/classes/approve/" + clss.id} />
                    <Link data-toggle="tooltip" title="Edit Class" className="ion-md-create" to={"/classes/edit/" + clss.id} />
                    <Link data-toggle="tooltip" title="Cancel Class" className="ion-md-hand" to={"/classes/cancel/" + clss.id} />
                    <a data-toggle="tooltip" title="Delete Class" className="ion-md-close" onClick={e => this.deleteClass(e, clss.id)} />
                </div>
            );
        }
    }

    uploadRoster(e) {
        update('classes/roster', new FormData(e.target.form), true)
            .then(res => {
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    deleteClass(e, clss) {
        if (confirm('Do you really want to delete this Class?')) {
            remove('classes/' + clss, {})
                .then(res => {
                    this.getData();
                })
                .catch(err => {
                    console.log(err);
                });
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

    toggleArchived(e) {
        this.setState({ archived: e.target.checked });

        if (e.target.checked) {
            this.getData({ params: { archived: true } });
        } else {
            this.getData({});
        }
    }

    toggleCancelled(e) {
        if (e.target.checked) {
            this.getData({ params: { cancelled: true } });
        } else {
            this.getData({});
        }
    }

    render() {
        let { classes } = this.state;
        const { filters, courses, instructors, loader } = this.state;

        const columns = [
            {
                name: 'Course',
                cell: row => {
                    return <Link to={"/classes/edit/" + row.id}>{row.course.title}</Link>
                },
                ignoreRowClick: true,
                sortable: true
            },
            {
                name: 'instructor',
                cell: row => { return row.user.name },
                sortable: true,
                width: '120px',
            },
            {
                name: 'Date',
                cell: row => {
                    return formatDate(row.start_date) + " to " + formatDate(row.end_date);
                },
                sortable: true
            },
            {
                name: 'Actions',
                cell: row => this.renderActions(row),
                ignoreRowClick: true,
                width: this.state.archived ? '220px' : '120px',
            }
        ];

        if (Object.keys(filters).length) {
            classes = filter(classes, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>Classes</h2>
                    <Link className="button" to={"/classes/create"}>Add New Class</Link>
                </header>

                <div className="filter">
                    <Select items={courses} placeholder="Select Course" id="id" val={"title"} onChange={value => this.setfilter(value, "course.id")} />
                    <Select items={instructors} placeholder="Select Instructor" id="id" val="name" onChange={value => this.setfilter(value, "user.id")} />

                    <br />

                    <label className="checkbox">
                        <input type="checkbox" onChange={e => this.toggleArchived(e)} />
                        <span>Show archived</span>
                    </label>

                    <label className="checkbox">
                        <input type="checkbox" onChange={e => this.toggleCancelled(e)} />
                        <span>Show cancelled</span>
                    </label>
                </div>

                <div className="tablewrap">
                    {!loader && classes
                        ? <DataTable columns={columns} data={classes} noHeader={true} pagination />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Classes;