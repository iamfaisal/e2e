import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { read, remove, filter, formatDate } from "../../helpers/resource";
import Select from "../../common/Select";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import { dateDifference } from "../../helpers/resource";

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

        read('regulations', {}).then(res => {
            this.setState({
                regulations: res.data.regulations
            });
        }).catch(err => console.log(err));
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
                {clss.status != 'Cancelled' ? <Link data-toggle="tooltip" title="Cancel Class" className="ion-md-close" to={"/my-classes/cancel/" + clss.id} /> : ""}
                <Link data-toggle="tooltip" title="Edit Class" className="ion-md-create" to={"/my-classes/edit/" + clss.id} />
                <a data-toggle="tooltip" title="Delete Class" className="ion-md-trash" onClick={e => this.deleteClass(e, clss.id)} />
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
        const { filters, courses, regulations, loader } = this.state;

        const columns = [
            {
                name: 'Date',
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
                name: 'Course',
                cell: row => {
                    return <Link to={"/classes/edit/" + row.id}>{row.course.title}</Link>
                },
                selector: "course.title",
                ignoreRowClick: true,
                sortable: true
            },
            {
                name: 'Location',
                cell: row => {
                    return <Fragment>{row.venue.name}<br />{row.venue.city}, {row.venue.zip_code}</Fragment>;
                },
                selector: "venue.name",
                sortable: true
            },
            {
                name: 'Hours',
                cell: row => dateDifference(row.start_date, row.end_date),
                sortable: true,
                width: '60px'
            },
            {
                name: 'Cost',
                cell: row => row.price ? row.price : "Free",
                selector: "price",
                sortable: true,
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
                width: '100px'
            },
            {
                name: 'Actions',
                cell: row => this.renderActions(row),
                ignoreRowClick: true,
                width: '120px'
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