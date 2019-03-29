import React, { Component } from "react";
import TextField from "../../common/TextField";
import TextArea from "../../common/TextArea";
import CheckBox from "../../common/CheckBox";
import FileInput from "../../common/FileInput";
import { read, create } from "../../helpers/resource";

class ApproveClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.class,
            loading: false,
            dataLoaded: false,
            fields: {
                instructor: "",
                course_id: "",
                venue_id: "",
                start_date: "",
                end_date: "",
                price: "",
                capacity: "",
                alternate_instructor: "",
                guest_speaker: "",
                rsvp_contact: "",
                rsvp_phone: "",
                rsvp_email: "",
                rsvp_link_text: "",
                rsvp_link_url: "",
                sponsors: [],
                flyer: "",
                flyer_image: "",
                docs: "",
            },
            sponsors: [],
            courses: [],
            instructors: [],
            venues: [],
            formValidationData: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { id } = this.state;

        read('classes/' + id, {})
            .then(res => {
                console.log(res.data);
                let { fields } = this.state;
                this.setState({
                    loaded: true,
                    fields: { ...fields, ...res.data.class },
                    dataLoaded: true
                });
            })
            .catch((err) => {
                console.log(err);
            });

        read('courses/', {})
            .then(res => {
                this.setState({
                    courses: res.data.courses
                });
            })
            .catch(err => {
                console.log(err);
            });

        read('users', { params: { role: 'instructor' } })
            .then(res => {
                this.setState({
                    instructors: res.data.users
                });
            })
            .catch(err => {
                console.log(err);
            });

        read('venues', {})
            .then(res => {
                this.setState({
                    venues: res.data.venues
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleChange(name, value) {
        let { fields } = this.state;
        if (event && event.target.files) {
            fields[name] = event.target.files;
        } else {
            fields[name] = value;
        }

        this.setState({
            fields: fields
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({
            loading: true
        });

        create('classes', new FormData(e.target), true)
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/classes")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch(err => {
                let { formValidationData } = this.state;
                formValidationData.form = "Unable To Create Class";
                this.setState({
                    formValidationData: formValidationData,
                    loading: false,
                    isFormValid: false
                })
            });
    }

    getItem(ar, id) {
        let item = {};
        if (ar.length) {
            item = ar.filter(itm => itm.id == id);
            if (item.length) item = item[0];
        }
        return item;
    }

    render() {
        const { dataLoaded, fields, courses, instructors, venues, sponsors, loading, isFormValid, formValidationData } = this.state;
        
        if (!dataLoaded) return false;

        const instructor = this.getItem(instructors, fields.user_id);
        const course = this.getItem(courses, fields.course_id);
        const venue = this.getItem(venues, fields.venue_id);

        return (
            <div>
                <header className="pageheader">
                    <h2>Approve Class</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                    {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}

                    <ul className="fieldsList">
                        <li>
                            <b>Instructor:</b>
                            <span>{instructor.name}</span>
                            <CheckBox name="instructor" labelText="Needs Attention" />
                        </li>
                        <li>
                            <b>Start Time:</b>
                            <span>{fields.start_date}</span>
                            <CheckBox name="start_date" labelText="Needs Attention" />
                        </li>
                        <li>
                            <b>End Time:</b>
                            <span>{fields.end_date}</span>
                            <CheckBox name="end_date" labelText="Needs Attention" />
                        </li>
                        <li>
                            <b>Course:</b>
                            <span>{course.title}</span>
                            <CheckBox name="course" labelText="Needs Attention" />
                        </li>
                        <li>
                            <b>Venue:</b>
                            <span>{venue.name}</span>
                            <CheckBox name="venue" labelText="Needs Attention" />
                        </li>
                        <li>
                            <b>Cost:</b>
                            <span>{fields.price}</span>
                            <CheckBox name="price" labelText="Needs Attention" />
                        </li>
                        <li>
                            <b>Capacity:</b>
                            <span>{fields.capacity}</span>
                            <CheckBox name="capacity" labelText="Needs Attention" />
                        </li>
                        <li>
                            <b>Alternate Instructor:</b>
                            <span>{fields.alternate_instructor}</span>
                            <CheckBox name="alternate_instructor" labelText="Needs Attention" />
                        </li>
                        <li>
                            <b>Guest Speaker:</b>
                            <span>{fields.guest_speaker}</span>
                            <CheckBox name="guest_speaker" labelText="Needs Attention" />
                        </li>
                    </ul>

                    <div className="class_id_gen">
                        <TextField
                            onChange={this.handleChange}
                            name="class_id"
                            value={fields.class_id}
                            labelText="State Class ID"
                        />
                        <button className="button">Generate ID</button>
                    </div>

                    <legend>Sponsors <CheckBox name="sponsor" labelText="Needs Attention" /></legend>
                    <div className="tablewrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Contact Name</th>
                                    <th>Email Address</th>
                                    <th>Phone Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    fields.sponsors.map((sponsor, i) => {
                                        return <tr key={i}>
                                            <td>{sponsor.company}</td>
                                            <td>{sponsor.first_name + " " + sponsor.last_name}</td>
                                            <td>{sponsor.address}</td>
                                            <td>{sponsor.phone}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="row">
                        <div className="col-lg-4">
                            <FileInput
                                onChange={(event) => this.handleChange(event)}
                                name="flyer"
                                labelText="Class Flyer"
                                value={fields.flyer}
                            />
                            <CheckBox name="flyer" labelText="Needs Attention" />
                        </div>
                        <div className="col-lg-4">
                            <FileInput
                                onChange={(event) => this.handleChange(event)}
                                name="flyer_image"
                                labelText="Class Flyer Image"
                                value={fields.flyer_image}
                            />
                            <CheckBox name="flyer_image" labelText="Needs Attention" />
                        </div>
                        <div className="col-lg-4">
                            <FileInput
                                onChange={(event) => this.handleChange(event)}
                                name="flyer_docs"
                                labelText="Class Docs"
                                value={fields.flyer_docs}
                            />
                        </div>
                    </div>

                    <legend>Notes to Instructor</legend>
                    <fieldset className="fields horizontal">
                        <TextArea
                            onChange={(event) => this.handleChange(event)}
                            name="notes"
                            value={fields.notes}
                        />
                    </fieldset>

                    <div className="button-group">
                        <button className="button">Need Review</button>
                        <button className="button">Submit To State</button>
                        <button className="button">Approve Class</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default ApproveClass;