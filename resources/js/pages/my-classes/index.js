import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { read, remove, filter, formatDate } from "../../helpers/resource";
import { asset } from "../../helpers/app";
import Select from "../../common/Select";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import { update, dateDifference } from "../../helpers/resource";

class MyClasses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: [],
            courses: [],
            regulations: [],
            filters: {
                is_deleted: "0",
                start_date: "",
                end_date: ""
            },
            loader: true,
            canAddNew: false,
            archived: false,
            cancelled: false
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
            .catch(console.log);

        read('classes/hasPendingRosters', {})
            .then(res => {
                this.setState({
                    canAddNew: res.data.classes.length ? false : true
                });
            })
            .catch(console.log);

        read('regulations', {}).then(res => {
            this.setState({
                regulations: res.data.regulations
            });
        }).catch(console.log);
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
        return <div className="loader" />
    }

    allowEdit(date, state) {
        let diffrence = (new Date(date) - new Date) / (1000 * 60 * 60 * 24);
        return state == "AZ" ? diffrence > 16 : diffrence > 10;
    }

    renderActions(clss) {
        return this.state.archived
            ? <form className="actions roaster-actions">
                <input type="hidden" name="class_id" value={clss.id} />
                {clss.roster && <Fragment><Link to={clss.roster} target="_blank">View Roaster</Link> <span>|</span></Fragment>}
                <label>
                    <input type="file" name="roster" onChange={this.uploadRoster} />
                    Upload Roaster
			</label>
            </form>
            : <div className="actions">
                {this.allowEdit(clss.start_date, clss.venue.abbreviation)
                    ? <Link data-toggle="tooltip" title="Edit Class" className="ion-md-create" to={"/my-classes/edit/" + clss.id} />
                    : <a data-toggle="tooltip" title="Class can no longer be changed" className="ion-md-lock" />}
                {clss.status != 'Cancelled' ? <Link data-toggle="tooltip" title="Cancel Class" className="ion-md-close" to={"/my-classes/cancel/" + clss.id} /> : ""}
            </div>
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

    uploadRoster(e) {
        this.setState({ loader: true });
        update('classes/roster', new FormData(e.target.form), true).then(res => this.getData({ archived: true }))
    }

    setfilter(value, key) {
        let { filters } = this.state;

        if (typeof value == 'string' || value instanceof Date) {
            filters[key] = value;
        } else {
            filters[key] = value.target.value;
        }
    
        this.setState({ filters: filters });
    }

    toggleArchived(e) {
        if (e === true || e.target.checked) {
            this.setState({ archived: true });
            this.getData({ archived: true });
        } else {
            this.setState({ archived: false });
            this.getData({});
        }
    }

    toggleCancelled(e) {
        this.setState({ cancelled: e.target.checked });

        if (e.target.checked) {
            this.getData({ cancelled: true });
        } else {
            this.getData({});
        }
    }

    render() {
        let { archived_cb, classes, canAddNew, cancelled } = this.state;
        const { filters, courses, regulations, loader } = this.state;

        const columns = [
            {
                name: 'Class Date',
                cell: row => formatDate(row.start_date, true),
                selector: "start_date",
                sortable: true,
                width: '110px'
            },
            {
                name: 'ID',
                selector: "id",
                sortable: true,
                width: '50px'
            },
            {
                name: 'Course Title',
                cell: row => this.allowEdit(row.start_date, row.venue.abbreviation)
                    ? <Link to={"/my-classes/edit/" + row.id}>{row.course.title}</Link>
                    : row.course.title,
                selector: "course.title",
                ignoreRowClick: true,
                sortable: true,
                width: '230px'
            },
            {
                name: 'Location',
                cell: row => <Fragment>
                    {row.venue.name}<br />
                    {row.venue.city} {row.venue.regulation.abbreviation}, {row.venue.zip_code}
                </Fragment>,
                selector: "venue.name",
                sortable: true,
                maxWidth: '180px'
            },
            {
                name: 'RSVP’s',
                cell: row => 10,
                sortable: true,
                width: '60px'
            },
            {
                name: 'Course Length',
                cell: row => dateDifference(row.start_date, row.end_date),
                sortable: true,
                width: '100px'
            },
            {
                name: 'Cost',
                cell: row => row.price ? "$" + row.price : "Free",
                selector: "price",
                sortable: true,
                width: '60px'
            },
            {
                name: 'Created On',
                cell: row => {
                    let parts = formatDate(row.created_at).split(", ");
                    return <Fragment>{parts[0]}<br />{parts[1]}</Fragment>;
                },
                selector: "created_at",
                sortable: true,
                width: '100px'
            },
            {
                name: 'Material',
                cell: row => {
                    return <small className="links">
                        <a href={asset(row.course.material)} target="_balank">Course Materials</a>
                        <span className="sep"></span>
                        <a href={asset(row.flyer, true)} target="_balank">Class Flyer</a>
                        <span className="sep"></span>
                        <a href={asset(row.docs, true)} target="_balank">Class Docs</a>
                    </small>
                },
                ignoreRowClick: true,
                sortable: true,
                width: '230px'
            },
            {
                name: 'Actions',
                cell: this.renderActions,
                ignoreRowClick: true,
                width: this.state.archived ? '200px' : '120px',
                right: true
            }
        ];

        cancelled && columns.pop();

        if (Object.keys(filters).length) {
            classes = filter(classes, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>CE Classes</h2>
                    {canAddNew
                    ? <Link className="button" to={"/my-classes/create"}>Register Class</Link>
                        : <button className="button" onClick={() => { if (archived_cb) archived_cb.checked = true; this.toggleArchived(true) }}>Upload rosters to register a new class</button>}
                </header>

                <div className="filter">
                    <Select items={courses} placeholder="Select Course" id="id" val={"title"} onChange={value => this.setfilter(value, "course.id")} />
                    <Select items={regulations} placeholder="Select State" id="id" val="name" onChange={value => this.setfilter(value, "venue.regulation_id")} />

                    <br />

                    <DatePicker
                        selected={filters.start_date}
                        selectsStart
                        startDate={filters.start_date}
                        endDate={filters.end_date}
                        placeholderText="Start"
                        onChange={date => this.setfilter(date, "start_date")} />

                    <DatePicker
                        selected={filters.end_date}
                        selectsEnd
                        startDate={filters.start_date}
                        endDate={filters.end_date}
                        placeholderText="End"
                        onChange={date => this.setfilter(date, "end_date")} />

                    <br />

                    <label className="checkbox">
                        <input type="checkbox" ref={el => this.state.archived_cb = el} onChange={e => this.toggleArchived(e)} />
                        <span>Archived Classes</span>
                    </label>

                    <label className="checkbox">
                        <input type="checkbox" onChange={e => this.toggleCancelled(e)} />
                        <span>Show Cancelled</span>
                    </label>
                </div>

                <div className="tablewrap">
                    {!loader && classes
                        ? <DataTable columns={columns} data={classes} noHeader={true} pagination paginationRowsPerPageOptions={[10, 25, 50, 100, 500]} />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default MyClasses;