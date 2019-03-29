import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter, formatDate } from "../../helpers/resource";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";

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
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteClass = this.deleteClass.bind(this);
    }

    componentDidMount() {
        this.getData();

        read('courses/', {})
            .then(res => {
                this.setState({
                    courses: res.data.courses
                });
            })
            .catch((err) => {
                console.log(err);
            });

        read('users', { params: { role: 'instructor' } })
            .then(res => {
                this.setState({
                    instructors: res.data.users
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getData() {
        this.setState({ loader: true });

        read('classes', {})
            .then(res => {
                this.setState({
                    classes: res.data.classes,
                    loader: false
                });
            })
            .catch((err) => {
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

    renderActions(course) {
        return (
            <div className="actions">
                <Link className="ion-md-create" to={"/classes/edit/" + course.id} />
                <a className="ion-md-close" onClick={e => this.deleteClass(e, course.id)} />
            </div>
        );
    }

    renderCategories(course) {
        let categories = [];
        course.categories.map((category) => {
            categories.push(category.label);
        });
        return categories.join(", ");
    }

    deleteClass(e, course) {
        if (confirm('Do you really want to delete this Class?')) {
            remove('classes/' + course, {})
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
        let { filters } = this.state;
        filters["is_deleted"] = "0";
        if (e.target.checked) filters["is_deleted"] = "1";
        this.setState({ filters: filters });
    }

    render() {
        let { classes } = this.state;
        const { filters, courses, instructors, loader } = this.state;

        const columns = [
            {
                name: 'Course',
                cell: row => { return row.course.title },
                sortable: true
            },
            {
                name: 'instructor',
                cell: row => { return row.user.name },
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
                width: '100px',
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
                    <Select items={instructors} placeholder="Select Instuctor" id="id" val="name" onChange={value => this.setfilter(value, "user.id")} />

                    <br />

                    <label className="checkbox">
                        <input type="checkbox" onChange={e => this.toggleArchived(e)} />
                        <span>Show archived</span>
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