import React, {Component} from "react";
import TextField from "../../common/TextField";
import Select from "../../common/Select";;
import { read, create } from "../../helpers/resource";
import ReactSelect from 'react-select';

class CreateVenue extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			fields: {
				address: "",
				city: "",
				name: "",
				regulation: "",
				users: [],
				zip_code: ""
			},
			required_fields: {
				name: ""
			},
			instructors: [],
			regulations: [],
			formValidationData: {},
			isFormValid: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		read('users/', { params: { role: "instructor" } })
			.then(res => {
				this.setState({
					instructors: res.data.users.map(user => {
						return {
							label: user.name,
							value: user.id
						}
					}).sort((a, b) => a.label < b.label ? -1 : 1)
				});
			})
			.catch(console.log);

		read('regulations', {})
			.then(res => {
				this.setState({
					regulations: res.data.regulations,
				});
			})
			.catch(console.log);
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

	handleSelectedChanged(selected) {
		let { fields } = this.state;
		fields.users = selected;

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

		const { isFormValid } = this.state;

		if (!isFormValid) return;
		
		this.setState({
			loading: true
		});

		let data = new FormData(e.target);

		create('venues', data).then(res => {
			if (this.props.onSuccess) {
				this.props.onSuccess();

				this.setState({
					loading: false,
					isFormValid: false
				});
			} else {
				res.status === 200
					? this.props.history.push("/venues")
					: this.setState({
						loading: false,
						isFormValid: false
					});
			}
		}).catch(err => {
			let { formValidationData } = this.state;
			formValidationData.form = "Unable To Create Venue";
			this.setState({
				formValidationData: formValidationData,
				loading: false,
				isFormValid: false
			})
		});
	}

	render() {
		const { fields, instructors, regulations, loading, isFormValid, formValidationData } = this.state;

		return (
			<div>
				<header className="pageheader">
					<h2>Create Venue</h2>
				</header>

				<form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
					{formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
					<label>
						<span>Instructor</span>
						<ReactSelect
							className="react-select"
							options={instructors}
							isMulti={true}
							name="users[]"
						/>
					</label>

					<fieldset className="fields horizontal">
						<TextField
							onChange={this.handleChange}
							name="name"
							value={fields.name}
							maxLength={50}
							labelText="Venue Name"
							required={true}
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
								onChange={this.handleChange}
								name="regulation"
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

					<button className="button" disabled={!isFormValid}>Create Venue</button>
				</form>
			</div>
		);
	}
}

export default CreateVenue;