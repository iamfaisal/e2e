import React, { Component } from "react";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
import DatePicker from "react-datepicker";
import { read, update, dateToString } from "../../helpers/resource";
import MultiSelect from '@khanacademy/react-multi-select';

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
			workshop: 0,
			sponsors: [],
			selectedSponsors: [],
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

				res.data.class.sponsors = res.data.sponsors.map(({id}) => id);

				this.setState({
					loaded: true,
					workshop: parseInt(res.data.class.is_workshop),
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
					sponsors: res.data.sponsors.map(sponsor => {
						return {
							label: sponsor.first_name + " " + sponsor.last_name,
							value: sponsor.id
						}
					})
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

		const { id, workshop, fields } = this.state;

		this.setState({
			loading: true
		});

		let data = new FormData(e.target);
		data.append("_method", "PUT");

		fields.sponsors.forEach(function (sponsor) {
			data.append("sponsors[]", sponsor);
		});

		update('classes/' + id, data, true)
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

	render() {
		const { loaded, fields, workshop, courses, instructors, venues, sponsors, loading, isFormValid, formValidationData } = this.state;
		
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
					<h2>Edit {workshop ? "Workshop" : "Class"}</h2>
				</header>

				<form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
					{formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
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

					<fieldset className="fields horizontal">
						<label>
							<span>Class Date</span>
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
							<span>Course Title</span>
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
							labelText="Class Cost"
							placeholder="Class Cost (must enter a value even if it is zero)"
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

					<legend>Sponsors</legend>
					<MultiSelect
						options={sponsors}
						selected={fields.sponsors}
						onSelectedChanged={this.handleSelectedChanged.bind(this)}
						overrideStrings={{
							selectSomeItems: "Select Sponsors...",
							allItemsAreSelected: "All Sponsors",
							selectAll: "Select All Sponsors",
							search: "Search Sponsors",
						}}
					/>

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

					<input type="hidden" name="is_workshop" value={workshop} />
					<button className="button">Update {workshop ? "Workshop" : "Class"}</button>
				</form>
			</div>
		);
	}
}

export default EditClass;