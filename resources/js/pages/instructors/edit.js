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
			formValidationData: {},
			isFormValid: true,
			status: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.addLicense = this.addLicense.bind(this);
		this.removeLicense = this.removeLicense.bind(this);
		this.setLicenseDate = this.setLicenseDate.bind(this);
	}

	componentDidMount() {
		const { id } = this.state;

		read('users/' + id, {})
			.then(res => {
				let { fields } = this.state;
				fields.email = res.data.user.email;
				fields.status = res.data.user.status;
				if (res.data.licenses.length) fields.licenses = res.data.licenses;
				if (res.data.user_courses.length) fields.courses = res.data.user_courses;
				if (res.data.user_territories.length) fields.territories = res.data.user_territories;
				
				this.setState({
					fields: {...fields, ...res.data.profile},
					courses: res.data.courses,
					loaded: true
				});
			})
			.catch(err => console.log(err));

		read('regulations/', {}).then(res => {
			this.setState({
				regulations: res.data.regulations
			});
		}).catch(err => console.log(err));

		read('territories', {}).then(res => {
			this.setState({
				territories: res.data.territories
			});
		}).catch(err => console.log(err));
	}

	handleChange(name, value, valid) {
		let { fields, formValidationData } = this.state;
		if (event && event.target.files) {
			fields[name] = event.target.files;
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
		const { loaded, fields, regulations, territories, courses, loading, isFormValid, formValidationData } = this.state;

		if (!loaded) return false;

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
							labelText="First Name"
							validation={[validations.isEmpty]}
						/>
						<TextField
							onChange={this.handleChange}
							name="last_name"
							value={fields.last_name}
							required={true}
							maxLength={50}
							labelText="Last Name"
							validation={[validations.isEmpty]}
						/>
						<TextField
							onChange={this.handleChange}
							name="email"
							value={fields.email}
							required={true}
							maxLength={50}
							labelText="Email"
							validation={[validations.isEmail]}
						/>
						<TextField
							onChange={this.handleChange}
							name="sub_domain"
							value={fields.sub_domain}
							maxLength={50}
							labelText="Sub Domain"
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
							name="cell_phone"
							value={fields.cell_phone}
							maxLength={50}
							labelText="Cell Phone"
						/>
						<TextField
							onChange={this.handleChange}
							name="work_phone"
							value={fields.work_phone}
							maxLength={50}
							labelText="Work Phone"
						/>
					</fieldset>

					<fieldset className="fields horizontal">
						<TextField
							onChange={this.handleChange}
							name="additional_name"
							value={fields.additional_name}
							maxLength={50}
							labelText="Additional Name (#1)"
						/>
						<TextField
							onChange={this.handleChange}
							name="additional_email"
							value={fields.additional_email}
							maxLength={50}
							labelText="Additional Email Address (#1)"
						/>
						<TextField
							onChange={this.handleChange}
							name="additional_name2"
							value={fields.additional_name2}
							maxLength={50}
							labelText="Additional Name (#2)"
						/>
						<TextField
							onChange={this.handleChange}
							name="additional_email2"
							value={fields.additional_email2}
							maxLength={50}
							labelText="Additional Email Address (#2)"
						/>
					</fieldset>

					<legend>Profile</legend>
					<fieldset className="fields horizontal">
						<TextArea
							onChange={(event) => this.handleChange(event)}
							name="info"
							value={fields.info}
							placeholder="Profile"
						/>
					</fieldset>

					{!isJustInstructor() ? <Fragment>
						{fields.licenses.map((license, i) => {
							if (license.expiration && license.expiration.constructor !== Date) {
								license.expiration = new Date(license.expiration);
							}
							return <fieldset key={i} className="fields horizontal">
								<label>
									<span>State</span>
									<Select
										name={"licenses[" + i + "][regulation]"}
										items={regulations}
										placeholder="Select Regulation"
										id={"id"}
										val={"name"}
										value={license["regulation_id"]}
									/>
								</label>
								<TextField
									onChange={this.handleChange}
									name={"licenses[" + i + "][code]"}
									value={""}
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
									onChange={event => this.handleChange(event)}
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
							<button className="ion-md-remove" onClick={this.removeLicense}></button>
							<button className="ion-md-add" onClick={this.addLicense}></button>
						</div>

						<legend>Territories</legend>
						<fieldset className="fields horizontal">
							<label>
								<Select
									onChange={this.handleChange}
									name="territories[]"
									items={territories}
									value={fields.territories}
									multiple
									id={"id"}
									val={"name"}
								/>
							</label>
						</fieldset>

						<legend>Courses</legend>
						<fieldset className="fields horizontal">
							<label>
								<Select
									onChange={this.handleChange}
									name="courses[]"
									items={courses}
									value={fields.courses}
									multiple
									id={"id"}
									val={"title"}
								/>
							</label>
						</fieldset>
					</Fragment> : ""}

					<div className="row">
						<div className="col-md-6 col-lg-4">
							<FileInput
								onChange={event => this.handleChange(event)}
								name="avatar"
								labelText="Headshot"
								value={fields.avatar}
								preview="large"
							/>
						</div>
						{!isJustInstructor() ? <Fragment>
							<div className="col-md-6 col-lg-4">
								<FileInput
									onChange={event => this.handleChange(event)}
									name="application_docs"
									labelText="Application Docs"
									value={fields.application_docs}
								/>
							</div>
							<div className="col-md-6 col-lg-4">
								<FileInput
									onChange={event => this.handleChange(event)}
									name="custom_flyer"
									labelText="Custom Flyer"
									value={fields.custom_flyer}
								/>
							</div>
						</Fragment> : ""}
					</div>

					{!isJustInstructor() && <div><CheckBox onChange={this.handleChange} name="status" value={fields.status} labelText="Approved?" /></div>}

					<button className="button" disabled={!isFormValid} onClick={() => { this.state.status = "update" }}>Update Instructor</button>
				</form>
			</div>
		);
	}
}

export default EditInstructor;