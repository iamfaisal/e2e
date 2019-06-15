import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { read, remove, filter, formatDate } from "../../helpers/resource";
import { asset } from "../../helpers/app";
import Select from "../../common/Select";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import { update, dateDifference } from "../../helpers/resource";

class Classes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: [],
            courses: [],
            instructors: [],
            regulations: [],
            filters: {
                is_deleted: "0",
                start_date: "",
                end_date: ""
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

        read('regulations', {}).then(res => {
            this.setState({
                regulations: res.data.regulations
            });
        }).catch(err => console.log(err));
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
                    {clss.status != 'Approved' ? <Link data-toggle="tooltip" title="Approve Class" className="ion-md-checkmark" to={"/classes/approve/" + clss.id} /> : ""}
                    {clss.status != 'Cancelled' ? <Link data-toggle="tooltip" title="Cancel Class" className="ion-md-close" to={"/classes/cancel/" + clss.id} /> : ""}
                    <Link data-toggle="tooltip" title="Edit Class" className="ion-md-create" to={"/classes/edit/" + clss.id} />
                    <a data-toggle="tooltip" title="Delete Class" className="ion-md-trash" onClick={e => this.deleteClass(e, clss.id)} />
                </div>
            );
        }
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
        update('classes/roster', new FormData(e.target.form), true)
            .then(res => {
                window.location.reload();
            })
            .catch(err => console.log(err));
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
        const { filters, courses, instructors, regulations, loader } = this.state;

        const columns = [
            {
                name: 'Date',
                cell: row => formatDate(row.start_date, true),
                sortable: true,
                selector: "start_date",
                width: '110px'
            },
            {
                name: 'ID',
                selector: "id",
                sortable: true,
                width: '50px'
            },
            {
                name: 'Status',
                cell: row => {
                    const classname = row.status.toLowerCase().replace(" ", '-');
                    return <span className={"status " + classname}>{row.status}</span>
                },
                selector: "status",
                sortable: true,
                width: '110px'
            },
            {
                name: 'Course',
                cell: row => {
                    return <Fragment>
                        <Link to={"/classes/edit/" + row.id}>{row.course.title}</Link><br />
                        <small>{row.user.name}</small><br />
                        <small className="links">
                            <a href={asset(row.course.material)} target="_balank">Course Materials</a>
                            <span className="sep"></span>
                            <a href={asset(row.flyer, true)} target="_balank">Class Flyer</a>
                            <span className="sep"></span>
                            <a href={asset(row.docs, true)} target="_balank">Class Docs</a>
                        </small>
                    </Fragment>
                },
                selector: "course.title",
                ignoreRowClick: true,
                sortable: true,
                width: '230px'
            },
            {
                name: 'Location',
                cell: row => {
                    return <Fragment>
                        {row.venue.name}<br />
                        {row.venue.city} {row.venue.regulation.abbreviation}, {row.venue.zip_code}
                    </Fragment>;
                },
                selector: "venue.name",
                sortable: true,
                maxWidth: '150px'
            },
            {
                name: 'RSVP’s',
                cell: row => 10,
                sortable: true,
                width: '60px'
            },
            {
                name: 'Hours',
                cell: row => dateDifference(row.start_date, row.end_date),
                sortable: true,
                width: '60px'
            },
            {
                name: 'Cost',
                cell: row => row.price ? "$" + row.price : "Free",
                sortable: true,
                selector: "price",
                width: '60px'
            },
            {
                name: 'Created At',
                cell: row => {
                    let parts = formatDate(row.created_at).split(", ");
                    return <Fragment>{parts[0]}<br />{parts[1]}</Fragment>;
                },
                selector: "created_at",
                sortable: true,
                width: '90px'
            },
            {
                name: 'Actions',
                cell: row => this.renderActions(row),
                ignoreRowClick: true,
                width: this.state.archived ? '220px' : '120px',
                right: true
            }
        ];

        if (Object.keys(filters).length) {
            classes = filter(classes, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>CE Classes</h2>
                    <Link className="button" to={"/classes/create"}>Register Class</Link>
                </header>

                <div className="filter">
                    <Select items={courses} placeholder="Select Course" id="id" val="title" onChange={value => this.setfilter(value, "course.id")} />
                    <Select items={instructors} placeholder="Select Instructor" id="id" val="name" onChange={value => this.setfilter(value, "user.id")} />
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
                        <input type="checkbox" onChange={e => this.setfilter(e.target.checked ? "!Approved" : "", "status")} />
                        <span>Need Approval</span>
                    </label>

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
                        ? <DataTable columns={columns} data={classes} noHeader={true} pagination paginationRowsPerPageOptions={[10, 25, 50, 100, 500]} />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Classes;