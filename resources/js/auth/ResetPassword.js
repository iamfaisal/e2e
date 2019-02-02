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
			formValidationData: {
				"token": true
			},
			isFormValid: false
		};

		this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
		this.handleFields = this.handleFields.bind(this);
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

	handleFields(field) {
		let { formValidationData, fields } = this.state;
		formValidationData[field.key] = field.value;
		this.setState({formValidationData: formValidationData});
		let isFormValid = true;
		for (let key in fields) {
			if (!formValidationData[key]) {
				isFormValid = false;
			}
		}
		this.setState({isFormValid: isFormValid});
	}

	handleChange() {
		let { fields } = this.state;
		fields[event.target.name] = event.target.value;
		this.setState({fields: fields});
		console.log(this.state.isFormValid);
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
            <form className="form-auth" onSubmit={this.handleSubmit}>
                <h2 className="h3 mb-3 font-weight-normal">Reset your password</h2>

				{formValidationData.form && <div className={alertClass}>{formValidationData.form}</div>}

				<TextField
					onBlur={(isValid) => this.handleFields(isValid)}
					onChange={(event) => this.handleChange(event)}
					name="password"
					type="password"
					value={fields.password}
					required={true}
					bordered={true}
					maxLength={50}
					labelText="New Password"
					validation={[validations.isEmpty, validations.isAlphaNumeric]}
				/>

				<TextField
					onBlur={(isValid) => this.handleFields(isValid)}
					onChange={(event) => this.handleChange(event)}
					name="password_confirmation"
					type="password"
					value={fields.password_confirmation}
					required={true}
					bordered={true}
					maxLength={50}
					labelText="Confirm New Password"
					validation={[validations.isEmpty, validations.isAlphaNumeric]}
				/>

                <button disabled={!isFormValid} className="btn btn-lg btn-primary btn-block mb-2" type="submit">Reset Password</button>
            </form>
        );
    }
}

export default ResetPassword;