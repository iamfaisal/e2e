import React, { Component } from "react";
import { Link } from "react-router-dom";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import ReactSelect from 'react-select';
import FileInput from "../../common/FileInput";
import { getuser } from "../../helpers/app";
import DatePicker from "react-datepicker";
import { read, create, dateToString, addDays } from "../../helpers/resource";
import { toggleModel } from "../../helpers/app";
import CreateVenue from "../my-venues/create";
import CreateSponsor from "../sponsors/create";

class CreateMyClass extends Component {
	constructor(props) {
		super(props);

		const queryParams = new URL(location).searchParams;
		const minDate = queryParams.get("ws") ? 3 : 16;

		this.state = {
			workshop: queryParams.get("ws") !== null,
			loading: false,
			user: getuser(),
			canAddNew: true,
			minDate: minDate,
			fields: {
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
			sponsors: [],
			courses: [],
			venues: [],
			formValidationData: {}
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.onVenueAdded = this.onVenueAdded.bind(this);
	}

	componentDidMount() {
		const { workshop } = this.state;
	
		!workshop && read('classes/hasPendingRosters', {}).then(res => {
			this.setState({
				canAddNew: res.data.classes.length ? false : true
			});
		});

		read('classes/my-courses', workshop ? { params: { workshop: 1 } } : {})
			.then(res => {
				this.setState({
					courses: res.data.courses
				});
			})
			.catch(console.log);

		this.getVenues();

		this.getSponsors();
	}

	getVenues(venue) {
		read('venues', {})
			.then(res => {
				this.setState({
					venues: res.data.venues
				});
			})
			.catch(console.log);
	}

	getSponsors() {
		read('sponsors/', { params: { role: 'admin' } }).then(res => {
			this.setState({
				sponsors: res.data.sponsors.map(sponsor => {
					return {
						label: sponsor.first_name + " " + sponsor.last_name,
						value: sponsor.id
					}
				}).sort((a, b) => a.label < b.label ? -1 : 1)
			});
		}).catch(console.log);
	}

	handleChange(name, value) {
		let { fields } = this.state;
		
		if (name.target && name.target.files) {
			fields[name.target.name] = name.target.files;
		} else {
			fields[name] = value;
		}

		this.setState({fields: fields});
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
					? this.props.history.push(workshop ? "/my-classes/workshops" : "/my-classes")
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

	onSponsorAdded() {
		this.getSponsors();
		toggleModel('sponsor');
	}

	render() {
		const { user, canAddNew, minDate, fields, workshop, sponsors, courses, venues, loading, isFormValid, formValidationData } = this.state;

		if (!canAddNew) return <div>
			<header className="pageheader">
				<h2>Create Class</h2>
			</header>
			<Link className="button" to={"/my-classes"}>Upload rosters to register a new class</Link>
		</div>;

		let title = workshop ? "Workshop" : "Class";

		return (
			<div>
				<header className="pageheader">
					<h2>Create {title}</h2>
				</header>

				<form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
				{formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
					<input type="hidden" name="instructor" value={user.id} />

					<fieldset className="fields horizontal">
						<label>
							<span>{title} Date</span>
							<DatePicker
								selected={fields.start_date_time}
								onChange={d => this.handleDateChange(d)}
								minDate={addDays(new Date, minDate)}
								dateFormat="MMMM d, yyyy"
							/>
						</label>
						<div className="label">
							<label>
								<span>Start Time</span>
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
								<span>End Time</span>
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
						<label>
							<span>{workshop ? "Workshop" : "Course"} Title</span>
							<Select
								onChange={v => fields.course = v}
								name="course"
								items={courses}
								id="id"
								val="title"
							/>
						</label>
						<TextField
							onChange={this.handleChange}
							name="price"
							value={fields.price}
							labelText="Cost"
							placeholder={title + " Cost (must enter a value even if it is zero)"}
						/>
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
							placeholder="Capacity (optional)"
						/>
						<TextField
							onChange={this.handleChange}
							name="alternate_instructor"
							value={fields.alternate_instructor}
							labelText="Co-Instructor"
							placeholder="Co-Instructor (optional)"
						/>
						<TextField
							onChange={this.handleChange}
							name="guest_speaker"
							value={fields.guest_speaker}
							labelText="Guest Speaker"
							placeholder="Guest Speaker (optional)"
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

					<fieldset className="fields horizontal">
						<label>
							<span>Sponsors</span>
							<span className="addnew" onClick={() => toggleModel("sponsor")}>+</span>
							<ReactSelect
								className="react-select"
								options={sponsors}
								isMulti={true}
								name="sponsors[]" />
						</label>
					</fieldset>

					<div className="row">
						<div className="col-lg-4">
							<FileInput
								onChange={this.handleChange}
								name="flyer"
								labelText="Class Flyer"
								value={fields.flyer}
							/>
						</div>
						<div className="col-lg-4">
							<FileInput
								onChange={this.handleChange}
								name="flyer_image"
								labelText="Class Flyer Image"
								value={fields.flyer_image}
							/>
						</div>
					</div>

					<input type="hidden" name="is_workshop" value={workshop} />
					<button className="button" disabled={!fields.flyer}>Create {workshop ? "Workshop" : "Class"}</button>
				</form>

				<div className="modal modal-venue">
					<button className="modal-close ion-md-close" onClick={toggleModel}></button>
					<div className="modal-content">
						<CreateVenue onSuccess={this.onVenueAdded} />
					</div>
				</div>

				<div className="modal modal-sponsor">
					<button className="modal-close ion-md-close" onClick={toggleModel}></button>
					<div className="modal-content">
						<CreateSponsor onSuccess={this.onSponsorAdded} />
					</div>
				</div>
			</div>
		);
	}
}

export default CreateMyClass;