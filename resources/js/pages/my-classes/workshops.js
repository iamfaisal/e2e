import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { read, remove, filter, formatDate } from "../../helpers/resource";
import { asset } from "../../helpers/app";
import Select from "../../common/Select";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import { dateDifference } from "../../helpers/resource";

class MyClassesWorkshops extends Component {
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
            archived: false,
            cancelled: false,
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteClass = this.deleteClass.bind(this);
    }

    componentDidMount() {
        this.getData({});

        read('courses/', {}).then(res => {
            this.setState({
                courses: res.data.courses
            });
        });

        read('regulations', {}).then(res => {
            this.setState({
                regulations: res.data.regulations
            });
        });
    }

    getData(params = {}) {
        this.setState({ loader: true });

        params.fromInstructor = true;
        params.workshop = true;

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
        return <div className="loader"/>;
    }

    allowEdit(clss) {
        let diff = (new Date(clss.start_date) - new Date) / (1000 * 60 * 60);
        return diff > 24 && !clss.is_cancelled;
    }

    renderActions(clss) {
        return <div className="actions">
            {this.allowEdit(clss) && <Link data-toggle="tooltip" title="Edit Workshop" className="ion-md-create" to={"/my-classes/edit/" + clss.id} />}
            {clss.status != 'Cancelled' && <Link data-toggle="tooltip" title="Cancel Workshop" className="ion-md-close" to={"/my-classes/cancel/" + clss.id} />}
        </div>
    }

    uploadRoster(e) {
        this.setState({ loader: true });
        update('classes/roster', new FormData(e.target.form), true).then(res => this.getData({ archived: true }))
    }

    deleteClass(e, clss) {
        if (confirm('Do you really want to delete this Workshop?')) {
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

        if (typeof value == 'string' || value instanceof Date) {
            filters[key] = value;
        } else {
            filters[key] = value.target.value;
        }
    
        this.setState({ filters: filters });
    }

    toggleArchived(e) {
        if (e === true || e.target.checked) {
            this.getData({ archived: true });
            this.setState({ archived: true });
        } else {
            this.getData({});
            this.setState({ archived: false });
        }
    }

    toggleCancelled(e) {
        if (e.target.checked) {
            this.getData({ cancelled: true });
            this.setState({ cancelled: true });
        } else {
            this.getData({});
            this.setState({ cancelled: false });
        }
    }

    render() {
        let { classes, filters, courses, loader, archived, cancelled } = this.state;

        const columns = [
            {
                name: 'Workshop Date',
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
                name: 'Workshop Title',
                cell: row => this.allowEdit(row)
                    ? <Link to={"/my-classes/edit/" + row.id}>{row.course.title}</Link>
                    : row.course.title,
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
                name: 'Length',
                cell: row => dateDifference(row.start_date, row.end_date),
                sortable: true,
                width: '60px'
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
                name: 'Workshop Materials',
                cell: row => <form className="actions roaster-actions">
                    <input type="hidden" name="class_id" value={row.id} />

                    <a href={asset(row.course.material)} target="_balank">WS Teaching Kit</a>
                    <span>|</span>
                    <a href={asset(row.flyer, true)} target="_balank">WS Flyer</a>

                    {dateDifference(row.end_date, new Date) > 0 && <Fragment>
                        <span>|</span>
                        <Link to={row.roster ? row.roster : "!"} target="_blank">View WS Roster &amp; Evaluation</Link>

                        <span>|</span>
                        <label><input type="file" name="roster" onChange={this.uploadRoster} /> Upload WS Roster &amp; Evaluation</label>
                    </Fragment>}
                </form>,
                ignoreRowClick: true,
                sortable: true
            },
            {
                name: 'Actions',
                cell: this.renderActions,
                ignoreRowClick: true,
                width: '120px'
            }
        ];

        if (archived || cancelled) columns.pop();

        if (Object.keys(filters).length) {
            classes = filter(classes, filters);
        }

        return (
            <Fragment>
                <header className="pageheader">
                    <h2>Workshops</h2>
                    <Link className="button" to="/my-classes/create?ws=1">Register Workshop</Link>
                </header>

                <div className="filter">
                    <Select items={courses} placeholder="Select Workshop" id="id" val={"title"} onChange={value => this.setfilter(value, "course.id")} />

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
                        <input type="checkbox" onChange={e => this.toggleArchived(e)} />
                        <span>Archived Workshops</span>
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
            </Fragment>
        );
    }
}

export default MyClassesWorkshops;