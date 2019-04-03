import React, { Component } from "react";
import classnames from "classnames";
import {forgotPassword, getAuthUser} from "../helpers/auth";
import { routeToDashboard } from "../helpers/acl";
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
		let { formValidationData, fields } = this.state;

		let isFormValid = true;
		for (let key in fields) {
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
				}).catch(err => {
					this.setState({
						formValidationData: {form: "Unable to send reset link."},
						isLoading: false,
						isFormValid: false
					});
			});
        }
	}

    render() {
		if (getAuthUser()) this.props.history.push(routeToDashboard());
        const { fields, isFormValid, formValidationData } = this.state;
        const alertClass = classnames("alert alert-success", { "alert-danger": !isFormValid });

        return (
			<section className="login">
				<div className="container">
					<form onSubmit={this.handleSubmit}>
						<h1>Password Reset</h1>
						{formValidationData.form && <div className={alertClass}>{formValidationData.form}</div>}
						<div className="fields">
							<TextField
								onChange={this.handleChange}
								name="email"
								value={fields.email}
								required={true}
								bordered={true}
								maxLength={50}
								labelText="Email Address"
								validation={[validations.isEmail]}
								icon="ion-ios-person"/>
						</div>
						<button disabled={!isFormValid} className="button" type="submit">Request Password Reset</button>
					</form>
				</div>
			</section>
        );
    }
}

export default ForgotPassword;