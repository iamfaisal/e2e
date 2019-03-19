import React, { Component } from "react";
import classnames from "classnames";
import {resetPassword, getEmailFromToken, getAuthUser} from "../helpers/auth";
import TextField from "../common/TextField";
import { validations } from "../utils/validations";

class ResetPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
            isLoading: false,
            fields: {
            	"token": props.match.params.token,
				"email": "",
				"password": "",
				"password_confirmation": ""
			},
			required_fields: {
				"password": "",
				"password_confirmation": ""
			},
			formValidationData: {
				"token": true
			},
			isFormValid: false
		};

		this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		const { token, email } = this.state.fields;

		const userData = {
			token: token
		};

		if (email !== "") return false;

		let { formValidationData, fields } = this.state;

		getEmailFromToken(userData)
			.then(res => {
				fields.email = res.data.message;
				formValidationData.email = true;
				this.setState({
					fields: fields,
					formValidationData: formValidationData
				});
			}).catch((err) => {
			this.setState({
				formValidationData: {form: "Invalid request token."},
				isLoading: false,
				isFormValid: false
			});
		});
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

	handleSubmit(event) {
		event.preventDefault();

		const { isFormValid, fields, isLoading } = this.state;
		this.setState({isLoading: true});

		const userData = {
			email: fields.email,
			token: fields.token,
			password: fields.password,
			password_confirmation: fields.password_confirmation
		};

		if (isFormValid) {
			resetPassword(userData)
				.then(res => {
					this.setState({
						formValidationData: {form: res.data.message},
						isLoading: false,
						isFormValid: true
					});
				}).catch((err) => {
				this.setState({
					formValidationData: {form: "Unable process this request."},
					isLoading: false,
					isFormValid: false
				});
			});
		}

	}

    render() {
		if (getAuthUser()) this.props.history.push("/");
        const { fields, isFormValid, formValidationData } = this.state;
        const alertClass = classnames("alert alert-success", { "alert-danger": !isFormValid });
		
        return (
			<section className="login">
				<div className="container">
					<form onSubmit={this.handleSubmit}>
						<h1>Reset your password</h1>
						{formValidationData.form && <div className={alertClass}>{formValidationData.form}</div>}
						<div className="fields">
							<TextField
								onChange={this.handleChange}
								name="password"
								type="password"
								value={fields.password}
								required={true}
								bordered={true}
								maxLength={50}
								labelText="New Password"
								validation={[validations.isEmpty, validations.isAlphaNumeric]}
								icon="ion-md-lock"/>
							<TextField
								onChange={this.handleChange}
								name="password_confirmation"
								type="password"
								value={fields.password_confirmation}
								required={true}
								bordered={true}
								maxLength={50}
								labelText="Confirm New Password"
								validation={[validations.isEmpty, validations.isAlphaNumeric]}
								icon="ion-md-lock"/>
						</div>
						<button disabled={!isFormValid} className="button" type="submit">Reset Password</button>
					</form>
				</div>
			</section>
        );
    }
}

export default ResetPassword;