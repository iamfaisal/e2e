import React, { Component } from "react";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import DatePicker from "react-datepicker";
import { read, create, dateToString, addDays } from "../../helpers/resource";
import { toggleModel } from "../../helpers/app";
import CreateVenue from "../venues/create";

class CreateClass extends Component {
	constructor(props) {
		super(props);

		const queryParams = new URL(location).searchParams;
		const minDate = queryParams.get("ws") ? 3 : 16;

		this.state = {
			loading: false,
			minDate: minDate,
			fields: {
				instructor: "",
				course_id: "",
				venue_id: "",
				start_date_time: addDays(new Date, minDate),
				end_date_time: addDays(new Date, minDate),
				price: "0",
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
			workshop: queryParams.get("ws") ? 1 : 0,
			courses: [],
			instructors: [],
			venues: [],
			formValidationData: {}
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.onVenueAdded = this.onVenueAdded.bind(this);
	}

	componentDidMount() {
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

		this.getVenues();
	}

	getVenues(venue) {
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

	handleDateChange(date, field) {
		let { fields } = this.state;

		if (field) {
			fields[field].setHours(date.getHours());
			fields[field].setMinutes(date.getMinutes());
		} else {
			fields.start_date_time.setYear(date.getFullYear());
			fields.start_date_time.setMonth(date.getMonth());
			fields.start_date_time.setDate(date.getDate());

			fields.end_date_time.setYear(date.getFullYear());
			fields.end_date_time.setMonth(date.getMonth());
			fields.end_date_time.setDate(date.getDate());
		}

		this.setState({fields: fields});
	}

	handleSubmit(e) {
		e.preventDefault();

		let { workshop } = this.state;

		this.setState({
			loading: true
		});

		create('classes', new FormData(e.target), true)
			.then(res => {
				res.status === 200
					? this.props.history.push(workshop ? "/classes/workshops" : "/classes")
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

	onVenueAdded() {
		this.getVenues();
		toggleModel('venue');
	}

	render() {
		const { minDate, fields, workshop, courses, instructors, venues, loading, isFormValid, formValidationData } = this.state;

		return (
			<div>
				<header className="pageheader">
					<h2>Create {workshop ? "Workshop" : "Class"}</h2>
				</header>

				<form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
				{formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
					<fieldset className="fields horizontal">
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
							<button className="addnew" type="button" onClick={() => toggleModel("venue")}>+</button>
						</label>
						<TextField
							onChange={this.handleChange}
							name="capacity"
							value={fields.capacity}
							labelText="Capacity"
						/>
						<label>
							<span>Date</span>
							<DatePicker
								selected={fields.start_date_time}
								onChange={d => this.handleDateChange(d)}
								minDate={addDays(new Date, minDate)}
								dateFormat="MMMM d, yyyy"
							/>
						</label>
						<div className="label">
							<label>
								<span>From</span>
								<DatePicker
									selected={fields.start_date_time}
									onChange={d => this.handleDateChange(d, "start_date_time")}
									showTimeSelect
									showTimeSelectOnly
									timeFormat="h:mm aa"
									timeIntervals={30}
									dateFormat="h:mm aa"
								/>
								<input type="hidden" name="start_date_time" value={dateToString(fields.start_date_time, true)} />
							</label>
							<label>
								<span>To</span>
								<DatePicker
									selected={fields.end_date_time}
									onChange={d => this.handleDateChange(d, "end_date_time")}
									showTimeSelect
									showTimeSelectOnly
									timeFormat="h:mm aa"
									timeIntervals={30}
									dateFormat="h:mm aa"
								/>
								<input type="hidden" name="end_date_time" value={dateToString(fields.end_date_time, true)} />
							</label>
						</div>
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
							labelText="Co-Instructor"
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
						<div className="label">
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
						</div>
					</fieldset>

					<input type="hidden" name="is_workshop" value={workshop} />
					<button className="button">Create {workshop ? "Workshop" : "Class"}</button>
				</form>

				<div className="modal modal-venue">
					<button className="modal-close ion-md-close" onClick={toggleModel}></button>
					<div className="modal-content">
						<CreateVenue onSuccess={this.onVenueAdded} />
					</div>
				</div>
			</div>
		);
	}
}

export default CreateClass;