import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter } from "../../helpers/resource";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";

class Courses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            courses: [],
            categories: [],
            regulations: [],
            filters: {
                is_deleted: "0"
            },
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({ loader: true });

        read('courses', {})
            .then(res => {
                this.setState({
                    courses: res.data.courses,
                    categories: res.data.categories,
                    regulations: res.data.regulations,
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
                <Link className="ion-md-create" to={"/courses/edit/" + course.id} />
                <a className="ion-md-close" onClick={e => this.deleteCourse(e, course.id)} />
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

    deleteCourse(e, course) {
        if (confirm('Do you really want to delete this Course?')) {
            remove('courses/' + course, {})
                .then(res => {
                    this.getData();
                })
                .catch((err) => {
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
        let { courses } = this.state;
        const { filters, categories, regulations, loader } = this.state;
        const columns = [
            {
                name: 'ID',
                selector: 'id',
                sortable: true,
                width: '50px'
            },
            {
                name: 'Title',
                selector: 'title',
                sortable: true
            },
            {
                name: 'State',
                selector: 'regulation.abbreviation',
                sortable: true,
                maxWidth: '50px'
            },
            {
                name: 'Code',
                selector: 'code',
                sortable: true,
                maxWidth: '100px'
            },
            {
                name: 'Categories',
                cell: row => this.renderCategories(row),
                sortable: true,
                maxWidth: '150px'
            },
            {
                name: 'Hours',
                selector: 'hours',
                sortable: true,
                maxWidth: '50px'
            },
            {
                name: 'Expiration',
                selector: 'expiration_date',
                sortable: true,
                maxWidth: '120px'
            },
            {
                name: 'Actions',
                cell: row => this.renderActions(row),
                ignoreRowClick: true,
                width: '100px',
            }
        ];

        if (Object.keys(filters).length) {
            courses = filter(courses, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>Courses</h2>
                    <Link className="button" to={"/courses/create"}>Add New Course</Link>
                </header>

                <div className="filter">
                    <Select items={regulations} placeholder="Select Regulation" id={"id"} val={"name"} onChange={value => this.setfilter(value, "regulation.id")} />
                    <Select items={categories} placeholder="Select Category" id={"label"} val={"label"} onChange={value => this.setfilter(value, "categories.label")} />
                    <input type="text" placeholder="Course Code" onChange={e => this.setfilter(e, "code")} />

                    <br />

                    <label className="checkbox">
                        <input type="checkbox" onChange={e => this.toggleArchived(e)} />
                        <span>Show archived</span>
                    </label>
                </div>

                <div className="tablewrap">
                    {!loader && courses
                        ? <DataTable columns={columns} data={courses} noHeader={true} pagination />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Courses;