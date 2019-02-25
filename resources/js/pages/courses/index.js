import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read } from "../../helpers/resource";
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

    renderLoader() {
        return (
            <div className="loader"/>
        );
    }

    render() {
        const { courses, categories, regulations, loader } = this.state;
        //console.log(categories, regulations);
        return (
            <div>
                <header>
                    <h2>Courses</h2>
                    <a className="button" href="">Add New Course</a>
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
                                            <Link className="ion-md-create" to={""}/>
                                            <Link className="ion-ios-archive" to={""}/>
                                            <Link className="ion-md-close" to={""}/>
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