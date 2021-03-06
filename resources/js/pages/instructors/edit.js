import React, { Component, Fragment } from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
import TextArea from "../../common/TextArea";
import DatePicker from "react-datepicker";
import CheckBox from "../../common/CheckBox";
import { isJustInstructor } from "../../helpers/acl";
import { read, update, dateToString } from "../../helpers/resource";
import ReactSelect from 'react-select';

class EditInstructor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: props.match.params.instructor,
			loading: false,
			loaded: false,
			fields: {
				first_name: "",
				last_name: "",
				email: "",
				cell_phone: "",
				work_phone: "",
				sub_domain: "",
				address: "",
				city: "",
				state: "",
				zip_code: "",
				additional_name: "",
				additional_name2: "",
				additional_email: "",
				additional_email2: "",
				info: "",
				avatar: "",
				application_docs: "",
				custom_flyer: "",
				licenses: [{
					regulation: "",
					code: "",
					certificate: "",
					expiration: ""
				}],
				territories: [],
				courses: [],
				workshops: [],
				venues: [],
				sponsors: [],
				status: false
			},
			required_fields: {
				first_name: "",
				last_name: "",
				email: ""
			},
			regulations: [],
			territories: [],
			courses: [],
			workshops: [],
			formValidationData: {},
			isFormValid: true,
			status: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.addLicense = this.addLicense.bind(this);
		this.removeLicense = this.removeLicense.bind(this);
		this.setLicenseDate = this.setLicenseDate.bind(this);
		this.handleSelectedChanged = this.handleSelectedChanged.bind(this);
	}

	componentDidMount() {
		const { id } = this.state;

		read('users/' + id, {}).then(res => {
			let { fields } = this.state;
			fields.email = res.data.user.email;
			fields.status = res.data.user.status;
			if (res.data.licenses.length) fields.licenses = res.data.licenses;
			if (res.data.user_courses.length) fields.courses = res.data.user_courses;
			if (res.data.user_workshops.length) fields.workshops = res.data.user_workshops;
			if (res.data.user_territories.length) fields.territories = res.data.user_territories;

			this.setState({
				fields: {...fields, ...res.data.profile},
				courses: res.data.courses,
				loaded: true
			});
		});

		read('regulations/', {}).then(res => {
			this.setState({
				regulations: res.data.regulations
			});
		});

		read('territories', {}).then(res => {
			this.setState({
				territories: res.data.territories.map(territory => {
					return {
						label: territory.name,
						value: territory.id
					}
				}).sort((a, b) => a.label < b.label ? -1 : 1)
			});
		});

		read('courses', {}).then(res => {
			this.setState({
				courses: res.data.courses.map(course => {
					return {
						label: course.title,
						value: course.id,
						regulation: course.regulation_id
					}
				}).sort((a, b) => a.label < b.label ? -1 : 1)
			});
		});

		read('courses', { params: { workshop: 1 } }).then(res => {
			this.setState({
				workshops: res.data.courses.map(course => {
					return {
						label: course.title,
						value: course.id
					}
				}).sort((a, b) => a.label < b.label ? -1 : 1)
			});
		})

		read('venues').then(res => {
			this.setState({
				venues: res.data.venues.map(venue => {
					return {
						label: venue.name,
						value: venue.id
					}
				}).sort((a, b) => a.label < b.label ? -1 : 1)
			});
		})

		read('sponsors', { params: { role: 'admin' } }).then(res => {
			this.setState({
				sponsors: res.data.sponsors.map(sponsor => {
					return {
						label: sponsor.company,
						value: sponsor.id
					}
				}).sort((a, b) => a.label < b.label ? -1 : 1)
			});
		});
	}

	handleChange(name, value, valid) {
		let { fields, formValidationData } = this.state;
		if (event && event.target.files) {
			fields[name] = event.target.files;
		} else if (Array.isArray(value)) {
			fields[name] = value.map(v => v.value);
		} else {
			fields[name] = value;
		}

		formValidationData[name] = valid;
		this.setState({
			fields: fields,
			formValidationData: formValidationData
		});

		this.validate();
	}

	handleSelectedChanged(name, value) {
		let { fields } = this.state;
		fields[name] = value;

		this.setState({
			fields: fields
		});
	}

	validate() {
		let { formValidationData, required_fields } = this.state;

		let isFormValid = true;
		for (let key in required_fields) {
			if (!formValidationData[key]) {
				isFormValid = false;
			}
		}
		this.setState({ isFormValid: isFormValid });
	}

	handleSubmit(e) {
		e.preventDefault();

		const { id, isFormValid } = this.state;

		if (!isFormValid) return;

		this.setState({
			loading: true
		});

		let data = new FormData(e.target);
		data.append("_method", "PUT");
		data.append('roles[]', 3);

		update('users/' + id, data)
			.then(res => {
				res.status === 200
					? this.props.history.push("/instructors")
					: this.setState({
						loading: false,
						isFormValid: false
					});
			})
			.catch(err => {
				let { formValidationData } = this.state;
				formValidationData.form = "Unable To Update Instructor";
				this.setState({
					formValidationData: formValidationData,
					loading: false,
					isFormValid: false
				})
			});
	}

	addLicense(e) {
		e.preventDefault();

		let { fields } = this.state;
		fields.licenses.push({
			regulation: "",
			code: "",
			certificate: "",
			expiration: ""
		});
		this.setState({
			fields: fields
		});
	}

	removeLicense(e) {
		e.preventDefault();

		let { fields } = this.state;
		fields.licenses.pop();
		this.setState({
			fields: fields
		});
	}

	setLicenseDate(i, date) {
		let { fields } = this.state;
		fields.licenses[i].expiration = date;
		this.setState({
			fields: fields
		});
	}

	render() {
		const { loaded, fields, regulations, territories, venues, sponsors, workshops, loading, isFormValid, formValidationData } = this.state;
		let { courses } = this.state;

		if (!loaded) return false;

		let selectedTerratories = fields.territories.map(c => {
			let label = "";
			territories.forEach(territory => territory.value == c ? label = territory.label : "");
			return {label: label, value: c}
		});

		courses = courses.filter(cr => fields.licenses.find(l => l.regulation == cr.regulation));

		let selectedCourses = fields.courses.map(c => {
			let label = "";
			courses.forEach(course => course.value == c ? label = course.label : "");
			return { label: label, value: c }
		});

		let selectedWorkshops = fields.workshops.map(c => {
			let label = "";
			workshops.forEach(workshop => workshop.value == c ? label = workshop.label : "");
			return { label: label, value: c }
		});

		let selectedVenues = fields.venues.map(c => {
			let label = "";
			venues.forEach(venue => venue.value == c ? label = venue.label : "");
			return { label: label, value: c }
		});

		let selectedSponsors = fields.sponsors.map(c => {
			let label = "";
			sponsors.forEach(sponsor => sponsor.value == c ? label = sponsor.label : "");
			return { label: label, value: c }
		});

		return (
			<div>
				<header className="pageheader">
					<h2>Instructor Profile</h2>
				</header>

				<form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
					{formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
					<fieldset className="fields horizontal">
						<TextField
							onChange={this.handleChange}
							name="first_name"
							value={fields.first_name}
							required={true}
							maxLength={50}
							labelText="Instructor First Name"
							validation={[validations.isEmpty]}
						/>
						<TextField
							onChange={this.handleChange}
							name="last_name"
							value={fields.last_name}
							required={true}
							maxLength={50}
							labelText="Instructor Last Name"
							validation={[validations.isEmpty]}
						/>
						<TextField
							onChange={this.handleChange}
							name="email"
							value={fields.email}
							required={true}
							maxLength={50}
							labelText="Instructor Email"
							validation={[validations.isEmail]}
						/>
						<TextField
							onChange={this.handleChange}
							name="sub_domain"
							value={fields.sub_domain}
							maxLength={50}
							labelText="Instructor Sub Domain"
						/>
						<TextField
							onChange={this.handleChange}
							name="cell_phone"
							value={fields.cell_phone}
							maxLength={50}
							labelText="Instructor Cell Phone"
						/>
						<TextField
							onChange={this.handleChange}
							name="work_phone"
							value={fields.work_phone}
							maxLength={50}
							labelText="Instructor Work Phone"
						/>
					</fieldset>

					<fieldset className="fields horizontal">
						<TextField
							onChange={this.handleChange}
							name="address"
							value={fields.address}
							maxLength={50}
							labelText="Street Address"
						/>
						<TextField
							onChange={this.handleChange}
							name="city"
							value={fields.city}
							maxLength={50}
							labelText="City"
						/>
						<label>
							<span>State</span>
							<Select
								name="state"
								items={regulations}
								id={"id"}
								val={"name"}
							/>
						</label>
						<TextField
							onChange={this.handleChange}
							name="zip_code"
							value={fields.zip_code}
							maxLength={50}
							labelText="Zip Code"
						/>
					</fieldset>

					<fieldset className="fields horizontal">
						<TextField
							onChange={this.handleChange}
							name="additional_name"
							value={fields.additional_name}
							maxLength={50}
							labelText="Additional Contact #1"
						/>
						<TextField
							onChange={this.handleChange}
							name="additional_email"
							value={fields.additional_email}
							maxLength={50}
							labelText="Additional Contact Email #1"
						/>
						<TextField
							onChange={this.handleChange}
							name="additional_name2"
							value={fields.additional_name2}
							maxLength={50}
							labelText="Additional Contact #2"
						/>
						<TextField
							onChange={this.handleChange}
							name="additional_email2"
							value={fields.additional_email2}
							maxLength={50}
							labelText="Additional Contact Email #2"
						/>
					</fieldset>

					<legend>Profile</legend>
					<fieldset className="fields horizontal">
						<TextArea
							onChange={this.handleChange}
							name="info"
							value={fields.info}
							placeholder="Profile"
						/>
					</fieldset>

					<div className="row">
						<div className="col-md-6 col-lg-4">
							<FileInput
								onChange={this.handleChange}
								name="avatar"
								labelText="Headshot"
								value={fields.avatar}
								preview="large"
							/>
						</div>
					</div>

					{fields.licenses.map((license, i) => {
						if (license.expiration && license.expiration.constructor !== Date) {
							license.expiration = new Date(license.expiration);
						}
						return <fieldset key={i} className="fields horizontal">
							<label>
								<span>State</span>
								<Select
									onChange={(n, v) => {
										fields.licenses[i].regulation = v;
										this.setState({ fields: fields });
									}}
									name={"licenses[" + i + "][regulation]"}
									items={regulations}
									placeholder="Select Regulation"
									id="id"
									val="name"
									value={license["regulation_id"]}
								/>
							</label>
							<TextField
								onChange={this.handleChange}
								name={"licenses[" + i + "][code]"}
								value=""
								maxLength={50}
								labelText="License Number"
								value={license["code"]}
							/>
							<label>
								<span>Expiration</span>
								<DatePicker
									selected={license.expiration || new Date()}
									onChange={d => this.setLicenseDate(i, d)}
									dateFormat="MMMM d, yyyy"
								/>
								<input
									type="hidden"
									name={"licenses[" + i + "][expiration]"}
									value={dateToString(license.expiration)}
								/>
							</label>
							<FileInput
								onChange={this.handleChange}
								name={"licenses[" + i + "][certificate]"}
								labelText="Certificate"
								value={license["certificate"]}
							/>
							<input
								type="hidden"
								name={"licenses[" + i + "][certificate_file]"}
								value={license["certificate"]}
							/>
						</fieldset>
					})}
					<div className={"repeatActions count-" + fields.licenses.length}>
						{isJustInstructor() && <p>if you want to aplpy for instructor certification in anthoer state, email <a href="mailto:tiannetta@amerifirst.us">tiannetta@amerifirst.us</a></p>}
						<button className="ion-md-remove" onClick={this.removeLicense}></button>
						<button className="ion-md-add" onClick={this.addLicense}></button>
					</div>

					{!isJustInstructor() ? <fieldset className="fields horizontal">
						<label>
							<span>Territories</span>
							<ReactSelect
								className="react-select"
								options={territories}
								value={selectedTerratories}
								onChange={v => this.handleChange("territories", v, true)}
								isMulti={true}
								name="territories[]" />
						</label>
						<label>
							<span>Courses</span>
							<ReactSelect
								className="react-select"
								options={courses}
								value={selectedCourses}
								onChange={v => this.handleChange("courses", v, true)}
								isMulti={true}
								name="courses[]" />
						</label>
						<label>
							<span>Workshops</span>
							<ReactSelect
								className="react-select"
								options={workshops}
								value={selectedWorkshops}
								onChange={v => this.handleChange("workshops", v, true)}
								isMulti={true}
								name="workshops[]" />
						</label>
						{/*<label>
							<span>Venues</span>
							<ReactSelect
								className="react-select"
								options={venues}
								value={selectedVenues}
								onChange={v => this.handleChange("venues", v, true)}
								isMulti={true}
								name="venues[]" />
						</label>
						<label>
							<span>Sponsors</span>
							<ReactSelect
								className="react-select"
								options={sponsors}
								value={selectedSponsors}
								onChange={v => this.handleChange("sponsors", v, true)}
								isMulti={true}
								name="sponsors[]" />
						</label>*/}
					</fieldset> : ""}

					<div className="row">
						{!isJustInstructor() ? <Fragment>
							<div className="col-md-6 col-lg-4">
								<FileInput
									onChange={this.handleChange}
									name="application_docs"
									labelText="Instructor Agreement"
									value={fields.application_docs}
								/>
							</div>
							<div className="col-md-6 col-lg-4">
								<FileInput
									onChange={this.handleChange}
									name="custom_flyer"
									labelText="Instructor Promo Flyer"
									value={fields.custom_flyer}
								/>
							</div>
						</Fragment> : ""}
					</div>

					{!isJustInstructor() && <div>
						<fieldset className="fields horizontal">
							<TextField
								onChange={this.handleChange}
								type="password"
								name="password"
								value={fields.password}
								maxLength={50}
								labelText="Change Password"
								validation={[validations.isEmpty, validations.isAlphaNumeric]}
							/>
							<TextField
								onChange={this.handleChange}
								type="password"
								name="confirm_pass"
								value={fields.confirm_pass}
								maxLength={50}
								labelText="Confirm Change Password"
								equalTo={fields.password}
								validation={[validations.isEmpty, validations.isAlphaNumeric, validations.equalTo]}
							/>
						</fieldset>
						<CheckBox onChange={this.handleChange} name="status" value={fields.status} labelText="Approve" />
					</div>}

					<button className="button" disabled={!isFormValid} onClick={() => { this.state.status = "update" }}>Update Profile</button>
				</form>
			</div>
		);
	}
}

export default EditInstructor;