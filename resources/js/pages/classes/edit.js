import React, { Component } from "react";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
import DatePicker from "react-datepicker";
import { read, update, dateToString } from "../../helpers/resource";

class EditClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.class,
            loading: false,
            loaded: false,
            fields: {
                instructor: "",
                course_id: "",
                venue_id: "",
                user_id: "",
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
                let { fields } = this.state;
                this.setState({
                    loaded: true,
                    fields: { ...fields, ...res.data.class },
                });
            })
            .catch(err => console.log(err));

        read('courses/', {})
            .then(res => {
                this.setState({
                    courses: res.data.courses
                });
            })
            .catch(err => console.log(err));

        read('users', { params: { role: 'instructor' } })
            .then(res => {
                this.setState({
                    instructors: res.data.users
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

        read('sponsors', { params: { role: 'admin' } })
            .then(res => {
                this.setState({
                    sponsors: res.data.sponsors
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

        const { id } = this.state;

        this.setState({
            loading: true
        });

        let data = new FormData(e.target);
        data.append("_method", "PUT");

        update('classes/' + id, data, true)
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

    render() {
        const { loaded, fields, courses, instructors, venues, sponsors, loading, isFormValid, formValidationData } = this.state;
        
        if (!loaded) return false;
        
        if (fields.start_date.constructor !== Date) {
            fields.start_date = new Date(fields.start_date);
        }
        if (fields.end_date.constructor !== Date) {
            fields.end_date = new Date(fields.end_date);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>Edit Class</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                    {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                    <fieldset className="fields horizontal">
                        <label>
                            <span>Course</span>
                            <Select
                                onChange={v => fields.course_id = v}
                                value={fields.course_id}
                                name="course"
                                items={courses}
                                id="id"
                                val="title"
                            />
                        </label>
                        <label>
                            <span>Instructor</span>
                            <Select
                                onChange={v => fields.user_id = v}
                                value={fields.user_id}
                                name="instructor"
                                items={instructors}
                                id="id"
                                val="name"
                            />
                        </label>
                        <label>
                            <span>Venue</span>
                            <Select
                                onChange={v => fields.venue_id = v}
                                value={fields.venue_id}
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
                                selected={fields.start_date}
                                onChange={d => this.handleChange("start_date", d)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={30}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="time"
                            />
                            <input type="hidden" name="start_date_time" value={dateToString(fields.start_date, true)} />
                        </label>
                        <label>
                            <span>End</span>
                            <DatePicker
                                selected={fields.end_date}
                                onChange={d => this.handleChange("end_date", d)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={30}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="time"
                            />
                            <input type="hidden" name="end_date_time" value={dateToString(fields.end_date, true)} />
                        </label>
                        <TextField
                            onChange={this.handleChange}
                            name="price"
                            value={fields.price ? fields.price : "0"}
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

                    <legend>Sponsors</legend>
                    <fieldset className="fields horizontal">
                        <label>
                            <Select
                                onChange={v => fields.course = v}
                                name="sponsors[]"
                                items={sponsors}
                                id="id"
                                val="first_name|last_name"
                                multiple={true}
                                value={fields.sponsors.map(({ id }) => id)}
                            />
                        </label>
                    </fieldset>

                    <div className="row">
                        <div className="col-lg-4">
                            <FileInput
                                onChange={(event) => this.handleChange(event)}
                                name="flyer"
                                labelText="Class Flyer"
                                value={fields.flyer}
                            />
                        </div>
                        <div className="col-lg-4">
                            <FileInput
                                onChange={(event) => this.handleChange(event)}
                                name="flyer_image"
                                labelText="Class Flyer Image"
                                value={fields.flyer_image}
                            />
                        </div>
                    </div>

                    <button className="button">Update Class</button>
                </form>
            </div>
        );
    }
}

export default EditClass;