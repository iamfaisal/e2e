import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read } from "../../helpers/resource";

class Courses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            courses: [],
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
    }

    componentDidMount() {
        read('courses', [])
            .then(res => {
                this.setState({
                    courses: res.data.courses,
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
        const { courses, loader } = this.state;

        return (
            <div>
                <header>
                    <h2>Courses</h2>
                    <a className="button" href="">Add New Course</a>
                </header>

                <div className="filter">
                    <select>
                        <option value>Select a State</option>
                        <option value="AZ">Arizona</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="FL">Florida</option>
                        <option value="MO">Missouri</option>
                        <option value="NV">Nevada</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="WA">Washington</option>
                    </select>
                    <select>
                        <option value>Select a Category</option>
                    </select>
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
                                        <td>{course.state}</td>
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