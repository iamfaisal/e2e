import React, { Component } from "react";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
import { read, update } from "../../helpers/resource";

class EditMyClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.class,
            loading: false,
            dataLoaded: false,
            fields: {
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

        read('venues', {})
            .then(res => {
                this.setState({
                    venues: res.data.venues
                });
            })
            .catch(err => {
                console.log(err);
            });

        read('sponsors', { params: { role: 'admin' } })
            .then(res => {
                this.setState({
                    sponsors: res.data.sponsors
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
        const { dataLoaded, fields, courses, instructors, venues, sponsors, loading, isFormValid, formValidationData } = this.state;
        
        if (!dataLoaded) return false;

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
                        <TextField
                            onChange={this.handleChange}
                            name="start_date_time"
                            value={fields.start_date}
                            labelText="Start"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="end_date_time"
                            value={fields.end_date}
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

export default EditMyClass;