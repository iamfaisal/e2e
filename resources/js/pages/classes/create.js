import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import TextArea from "../../common/TextArea";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
import { read, create } from "../../helpers/resource";

class CreateClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fields: {
                instructor: "",
                course_id: "",
                venue_id: "",
                start_date_time: "",
                end_date_time: "",
                price: "",
                capacity: "",
                alternate_instructor: "",
                guest_speaker: "",
                rsvp_contact: "",
                rsvp_phone: "",
                rsvp_email: "",
                rsvp_link_text: "",
                rsvp_link_url: "",
                flyer: "",
                flyer_image: "",
                docs: ""
            },
            courses: [],
            instructors: [],
            venues: [],
            formValidationData: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
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

        read('venues', {})
            .then(res => {
                this.setState({
                    venues: res.data.venues
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleChange(name, value, valid) {
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
            .catch((err) => {
                let { formValidationData } = this.state;
                formValidationData.form = "Unable To Create Class";
                this.setState({
                    formValidationData: formValidationData,
                    loading: false,
                    isFormValid: false
                })
            });
    }

    render() {
        const { fields, courses, instructors, venues, loading, isFormValid, formValidationData } = this.state;

        return (
            <div>
                <header className="pageheader">
                    <h2>Create Class</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                    <fieldset className="fields horizontal">
                        <label>
                            <span>Course</span>
                            <Select
                                onChange={v => fields.course = v}
                                name="course"
                                items={courses}
                                id="id"
                                val="title"
                            />
                        </label>
                        <label>
                            <span>Instructor</span>
                            <Select
                                onChange={v => fields.instructor = v}
                                name="instructor"
                                items={instructors}
                                id="id"
                                val="name"
                            />
                        </label>
                        <label>
                            <span>Venue</span>
                            <Select
                                onChange={v => fields.venue = v}
                                name="venue"
                                items={venues}
                                id="id"
                                val="name"
                            />
                        </label>
                        <TextField
                            onChange={this.handleChange}
                            name="capacity"
                            value={fields.capacity}
                            labelText="Capacity"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="start_date_time"
                            value={fields.start_date_time}
                            labelText="Start"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="end_date_time"
                            value={fields.end_date_time}
                            labelText="End"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="price"
                            value={fields.price}
                            labelText="Cost"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="alternate_instructor"
                            value={fields.alternate_instructor}
                            labelText="Alternate Instructor"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="guest_speaker"
                            value={fields.guest_speaker}
                            labelText="Guest Speaker"
                        />
                    </fieldset>

                    <legend>RSVP Contact Information</legend>
                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            name="rsvp_contact"
                            value={fields.rsvp_contact}
                            labelText="Name"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="rsvp_email"
                            value={fields.rsvp_email}
                            labelText="Email"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="rsvp_phone"
                            value={fields.rsvp_phone}
                            labelText="Phone"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="rsvp_link_text"
                            value={fields.rsvp_link_text}
                            labelText="Link Text"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="rsvp_link_url"
                            value={fields.rsvp_link_url}
                            labelText="Link URL"
                        />
                    </fieldset>

                    <button className="button">Create Class</button>
                </form>
            </div>
        );
    }
}

export default CreateClass;