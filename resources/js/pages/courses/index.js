import React, {Component, Fragment} from "react";
import { read } from "../../helpers/resource";

class Courses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            courses: [{
                id: 1,
                title: 'Strategic Financing - What Agents Should Know',
                state: 'AZ',
                code: 'AZSTF3',
                categories: ['General', 'Disclosure'],
                hours: 3,
                expire: '02/11/2019',
            }]
        };
    }

    componentDidMount() {
        const data = read('courses', []);
        console.log(data);
    }

    render() {
        const { courses } = this.state;
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
                                        <td>{course.categories.join(', ')}</td>
                                        <td>{course.hours}</td>
                                        <td>{course.expire}</td>
                                        <td className="actions">
                                            <a className="ion-md-create" href="#"></a>
                                            <a className="ion-ios-thumbs-up" href="#"></a>
                                            <a className="ion-md-close" href="#"></a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Courses;