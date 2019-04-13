import React, { Component } from "react";
import { Link } from "react-router-dom";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import { getuser } from "../../helpers/app";
import DatePicker from "react-datepicker";
import { read, create, dateToString, addDays } from "../../helpers/resource";

class CreateMyClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            user: getuser(),
            canAddNew: true,
            fields: {
                course_id: "",
                venue_id: "",
                start_date_time: addDays(new Date, 16),
                end_date_time: addDays(new Date, 16),
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
            venues: [],
            formValidationData: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        read('classes/hasPendingRosters', {})
            .then(res => {
                this.setState({
                    canAddNew: res.data.classes.length ? false : true
                });
            })
            .catch(err => console.log(err));

        read('classes/my-courses', {})
            .then(res => {
                this.setState({
                    courses: res.data.courses
                });
            })
            .catch(err => console.log(err));

        read('venues', {})
            .then(res => {
                this.setState({
                    venues: res.data.venues
                });
            })
            .catch(err => console.log(err));
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
                    ? this.props.history.push("/my-classes")
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

    render() {
        const { user, canAddNew, fields, courses, venues, loading, isFormValid, formValidationData } = this.state;

        if (!canAddNew) return (
            <div>
                <header className="pageheader">
                    <h2>Create Class</h2>
                </header>
                <Link className="button" to={"/my-classes"}>Upload rosters to register a new class</Link>
            </div>
        );

        return (
            <div>
                <header className="pageheader">
                    <h2>Create Class</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                    <input type="hidden" name="instructor" value={user.id} />
                    
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
                        <label>
                            <span>Start</span>
                            <DatePicker
                                selected={fields.start_date_time}
                                onChange={d => this.handleChange("start_date_time", d)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={30}
                                minDate={addDays(new Date, 16)}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="time"
                            />
                            <input type="hidden" name="start_date_time" value={dateToString(fields.start_date_time, true)} />
                        </label>
                        <label>
                            <span>End</span>
                            <DatePicker
                                selected={fields.end_date_time}
                                onChange={d => this.handleChange("end_date_time", d)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={30}
                                minDate={addDays(new Date, 16)}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="time"
                            />
                            <input type="hidden" name="end_date_time" value={dateToString(fields.end_date_time, true)} />
                        </label>
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

export default CreateMyClass;