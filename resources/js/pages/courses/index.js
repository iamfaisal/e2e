import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove } from "../../helpers/resource";
import Select from "../../common/Select";

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
    }

    componentDidMount() {
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

    deleteCourse(e, course) {
        const tr = e.target.parentNode.parentNode;
        if (confirm('Do you really want to delete this Course?')) {
            remove('courses/'+course, [])
            .then(res => {
                tr.remove();
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    renderLoader() {
        return (
            <div className="loader"/>
        );
    }

    render() {
        const { courses, categories, regulations, loader } = this.state;

        return (
            <div>
                <header>
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
                    {!loader && courses ? (
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>State</th>
                                <th>Code</th>
                                <th>Categories</th>
                                <th>Hours</th>
                                <th>Expiration</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {courses.map((course) => {
                                return (
                                    <tr key={course.id}>
                                        <td>{course.id}</td>
                                        <td>{course.title}</td>
                                        <td>{course.regulation.abbreviation}</td>
                                        <td>{course.code}</td>
                                        <td>
                                            {course.categories ? course.categories.map((category) => {
                                                return category.label + " ";
                                            }) : false}
                                        </td>
                                        <td>{course.hours}</td>
                                        <td>{course.expiration_date}</td>
                                        <td className="actions">
                                            <Link className="ion-md-create" to={"/courses/edit/"+course.id}/>
                                            <Link className="ion-ios-archive" to={""}/>
                                            <a className="ion-md-close" onClick={e => this.deleteCourse(e, course.id)}/>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    ) : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Courses;