import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove } from "../../helpers/resource";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";

class Courses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            courses: [],
            categories: [],
            regulations: [],
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
        read('courses', [])
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
        console.log(course);
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

    render() {
        const { courses, categories, regulations, loader } = this.state;
        const columns = [
            {
                name: 'ID',
                selector: 'id',
                sortable: true,
                width: '50px',
            },
            {
                name: 'Title',
                selector: 'title',
                sortable: true,
                grow: 1
            },
            {
                name: 'State',
                selector: 'regulation.abbreviation',
                sortable: true,
            },
            {
                name: 'Code',
                selector: 'code',
                sortable: true,
            },
            {
                name: 'Categories',
                cell: row => this.renderCategories(row),
                sortable: true,
            },
            {
                name: 'Hours',
                selector: 'hours',
                sortable: true,
            },
            {
                name: 'Expiration',
                selector: 'expiration_date',
                sortable: true,
            },
            {
                name: 'Actions',
                cell: row => this.renderActions(row),
                ignoreRowClick: true,
                width: '100px',
            }
        ];

        return (
            <div>
                <header className="pageheader">
                    <h2>Courses</h2>
                    <Link className="button" to={"/courses/create"}>Add New Course</Link>
                </header>

                <div className="filter">
                    <Select items={regulations} id={"id"} val={"name"}/>
                    <Select items={categories} id={"id"} val={"label"}/>
                    <input type="text" placeholder="Course Code" />

                    <br />

                    <label className="checkbox">
                        <input type="checkbox" />
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