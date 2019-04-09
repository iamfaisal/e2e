import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter, formatDate } from "../../helpers/resource";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";

class MyClasses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: [],
            courses: [],
            filters: {},
            loader: true,
            canAddNew: false
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteClass = this.deleteClass.bind(this);
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

        read('classes/hasPendingRosters', {})
            .then(res => {
                this.setState({
                    canAddNew: res.data.classes.length ? false : true
                });
            })
            .catch(err => console.log(err));
    }

    getData(params = {}) {
        this.setState({ loader: true });

        params.fromInstructor = true;

        read('classes', { params: params })
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
        return (
            <div className="actions">
                <Link className="ion-md-create" to={"/my-classes/edit/" + clss.id}
                    data-toggle="tooltip" title="Edit Class" />
                <Link className="ion-md-hand" to={"/my-classes/cancel/" + clss.id}
                    data-toggle="tooltip" title="Cancel Class" />
                <a className="ion-md-close" onClick={e => this.deleteClass(e, clss.id)}
                    data-toggle="tooltip" title="Delete Class" />
            </div>
        );
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
        if (e === true || e.target.checked) {
            this.getData({ archived: true });
        } else {
            this.getData({});
        }
    }

    toggleCancelled(e) {
        if (e.target.checked) {
            this.getData({ cancelled: true });
        } else {
            this.getData({});
        }
    }

    render() {
        let { archived_cb, classes, canAddNew } = this.state;
        const { filters, courses, loader } = this.state;

        const columns = [
            {
                name: 'Course',
                cell: row => {
                    return <Link to={"/my-classes/edit/" + row.id}>{row.course.title}</Link>
                },
                ignoreRowClick: true,
                sortable: true
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
                width: '120px',
            }
        ];

        if (Object.keys(filters).length) {
            classes = filter(classes, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>Classes</h2>
                    {canAddNew
                    ? <Link className="button" to={"/my-classes/create"}>Add New Class</Link>
                        : <button className="button" onClick={() => { if (archived_cb) archived_cb.checked = true; this.toggleArchived(true) }}>Upload rosters to add a new class</button>}
                </header>

                <div className="filter">
                    <Select items={courses} placeholder="Select Course" id="id" val={"title"} onChange={value => this.setfilter(value, "course.id")} />

                    <br />

                    <label className="checkbox">
                        <input type="checkbox" ref={el => this.state.archived_cb = el} onChange={e => this.toggleArchived(e)} />
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

export default MyClasses;