import React, { Component } from "react";
import classnames from "classnames";
import {forgotPassword, getAuthUser} from "../helpers/auth";
import TextField from "../common/TextField";
import { validations } from "../utils/validations";

class ForgotPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
            isLoading: false,
            fields: {
				"email": ""
			},
			formValidationData: {},
			isFormValid: false
		};

		this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
		this.handleFields = this.handleFields.bind(this);
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
    }

	handleSubmit(event) {
		event.preventDefault();

		const { isFormValid, fields, isLoading } = this.state;
		this.setState({isLoading: true});

		const userData = {
			email: fields.email
		};

		if (isFormValid) {
			forgotPassword(userData)
				.then(res => {
					this.setState({
						formValidationData: {form: res.data.message},
						isLoading: false,
						isFormValid: true
					});
				}).catch((err) => {
					this.setState({
						formValidationData: {form: "Unable to send reset link."},
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
                <h2 className="h3 mb-3 font-weight-normal">Password Reset</h2>

				{formValidationData.form && <div className={alertClass}>{formValidationData.form}</div>}

				<TextField
					onBlur={(isValid) => this.handleFields(isValid)}
					onChange={(event) => this.handleChange(event)}
					name="email"
					value={fields.email}
					required={true}
					bordered={true}
					maxLength={50}
					labelText="Email Address"
					validation={[validations.isEmail]}
				/>

                <button disabled={!isFormValid} className="btn btn-lg btn-primary btn-block mb-2" type="submit">Request Password Reset</button>
            </form>
        );
    }
}

export default ForgotPassword;