import React, { Component } from "react";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
import DatePicker from "react-datepicker";
import ReactSelect from 'react-select';

import CreateVenue from "../my-venues/create";
import CreateSponsor from "../sponsors/create";

import { getuser } from "../../helpers/app";
import { read, update, dateToString } from "../../helpers/resource";
import { toggleModel } from "../../helpers/app";

class EditMyClass extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: props.match.params.class,
			loading: false,
			loaded: false,
			user: getuser(),
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
			workshop: 0,
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
				let { fields } = this.state;

				res.data.class.sponsors = res.data.sponsors.map(({id}) => id);

				this.setState({
					loaded: true,
					workshop: parseInt(res.data.class.is_workshop),
					fields: { ...fields, ...res.data.class }
				});
			})
			.catch(console.log);

		read('classes/my-courses', {})
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
		read('venues', {}).then(res => this.setState({ venues: res.data.venues }));
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
		});
	}

	handleChange(name, value) {
		let { fields } = this.state;

		if (name.target && name.target.files) {
			fields[name.target.name] = name.target.files;
		} else if (Array.isArray(value)) {
			fields[name] = value.map(v => v.value);
		} else {
			fields[name] = value;
		}

		this.setState({fields: fields});
	}

	handleSelectedChanged(selected) {
		let { fields } = this.state;
		fields.sponsors = selected;

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
			fields.start_date.setYear(date.getFullYear());
			fields.start_date.setMonth(date.getMonth());
			fields.start_date.setDate(date.getDate());

			fields.end_date.setYear(date.getFullYear());
			fields.end_date.setMonth(date.getMonth());
			fields.end_date.setDate(date.getDate());
		}

		this.setState({fields: fields});
	}

	handleSubmit(e) {
		e.preventDefault();

		const { id, workshop } = this.state;

		this.setState({
			loading: true
		});

		let data = new FormData(e.target);
		data.append("_method", "PUT");

		update('classes/' + id, data, true)
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
				formValidationData.form = "Unable To Update Class";
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
		const { loaded, user, fields, workshop, courses, venues, sponsors, loading, isFormValid, formValidationData } = this.state;

		if (!loaded) return false;

		if (fields.start_date.constructor !== Date) {
			fields.start_date = new Date(fields.start_date);
		}
		if (fields.end_date.constructor !== Date) {
			fields.end_date = new Date(fields.end_date);
		}

		let selectedSponsors = fields.sponsors.map(c => {
			let label = "";
			sponsors.forEach(sponsor => sponsor.value == c ? label = sponsor.label : "");
			return { label: label, value: c }
		});

		let title = workshop ? "Workshop" : "Class";

		return (
			<div>
				<header className="pageheader">
					<h2>Edit {title}</h2>
				</header>

				<form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
					{formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
					<input type="hidden" name="instructor" value={user.id} />

					<fieldset className="fields horizontal">
						<label>
							<span>{title} Date</span>
							<DatePicker
								selected={fields.start_date}
								onChange={d => this.handleDateChange(d)}
								dateFormat="MMMM d, yyyy"
							/>
						</label>
						<div className="label">
							<label>
								<span>Start Time</span>
								<DatePicker
									selected={fields.start_date}
									onChange={d => this.handleDateChange(d, "start_date")}
									showTimeSelect
									showTimeSelectOnly
									timeFormat="h:mm aa"
									timeIntervals={30}
									dateFormat="h:mm aa"
								/>
								<input type="hidden" name="start_date_time" value={dateToString(fields.start_date, true)} />
							</label>
							<label>
								<span>End Time</span>
								<DatePicker
									selected={fields.end_date}
									onChange={d => this.handleDateChange(d, "end_date")}
									showTimeSelect
									showTimeSelectOnly
									timeFormat="h:mm aa"
									timeIntervals={30}
									dateFormat="h:mm aa"
								/>
								<input type="hidden" name="end_date_time" value={dateToString(fields.end_date, true)} />
							</label>
						</div>
						<label>
							<span>{workshop ? "Workshop" : "Course"} Title</span>
							<Select
								onChange={v => fields.course_id = v}
								value={fields.course_id}
								name="course"
								items={courses}
								id="id"
								val="title"
							/>
						</label>
						<TextField
							onChange={this.handleChange}
							name="price"
							value={fields.price ? fields.price : "0"}
							labelText={title + " Cost"}
							placeholder={title + " Cost (must enter a value even if it is zero)"}
						/>
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
							<button className="addnew" type="button" onClick={() => toggleModel("venue")}>+</button>
						</label>
						<TextField
							onChange={this.handleChange}
							name="capacity"
							value={fields.capacity}
							labelText="Capacity"
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

					<fieldset className="fields horizontal">
						<label>
							<span>Sponsors</span>
							<span className="addnew" onClick={() => toggleModel("sponsor")}>+</span>
							<ReactSelect
								className="react-select"
								options={sponsors}
								value={selectedSponsors}
								onChange={v => this.handleChange("sponsors", v)}
								isMulti={true}
								name="sponsors[]"
							/>
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
					<button className="button">Update {workshop ? "Workshop" : "Class"}</button>
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

export default EditMyClass;