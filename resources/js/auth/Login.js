import React, { Component } from "react";
import { Link } from "react-router-dom";
import { login, getAuthUser } from "../helpers/auth";
import { routeToDashboard } from "../helpers/acl";
import { validations } from "../utils/validations";
import TextField from "../common/TextField";
import CheckBox from "../common/CheckBox";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            fields: {
                "email": "",
                "password": "",
                "remember_me": true
            },
            required_fields: {
                email: "",
                password: "",
            },
            formValidationData: {
                "remember_me": true
            },
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCBChange = this.handleCBChange.bind(this);
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
        let { formValidationData, required_fields } = this.state;

        let isFormValid = true;
        for (let key in required_fields) {
            if (!formValidationData[key]) {
                isFormValid = false;
            }
        }
        this.setState({ isFormValid: isFormValid });
    }

    handleCBChange(value) {
        let { fields } = this.state;
        fields["remember_me"] = value;
        this.setState({fields: fields});
    }

    handleSubmit(event) {
        event.preventDefault();

        const { isFormValid, fields } = this.state;
        this.setState({isLoading: true});

        const userData = {
            email: fields.email,
            password: fields.password,
            remember_me: fields.remember_me
        };

        if (isFormValid) {
            login(userData)
                .then(res => {
                    if (res.status === 200) {
                        this.props.history.push(routeToDashboard());
                    }
                }).catch(err => {
                    const message = err.status === 501 ? "Your account has been temporarily blocked." : "Invalid email or password.";
                    this.setState({
                        formValidationData: {form: message},
                        isLoading: false,
                        isFormValid: false
                    });
            });
        }
    }

    render() {
        if (getAuthUser()) this.props.history.push(routeToDashboard());
        const { fields, isFormValid, formValidationData } = this.state;

        return (
            <section className="login">
                <div className="container">
                    <form onSubmit={this.handleSubmit}>
                        <h1>Login to your account</h1>
                        {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                        <div className="fields">
                            <TextField
                                onChange={this.handleChange}
                                name="email"
                                value={fields.email}
                                required={true}
                                maxLength={50}
                                labelText="Email Address"
                                validation={[validations.isEmail]}
                                icon="ion-ios-person"/>
                            <TextField
                                onChange={this.handleChange}
                                name="password"
                                type="password"
                                value={fields.password}
                                required={true}
                                maxLength={50}
                                labelText="Password"
                                validation={[validations.isEmpty, validations.isAlphaNumeric]}
                                icon="ion-md-lock"/>
                        </div>
                        <div className="space-between">
                            <CheckBox
                                onChange={(event) => this.handleCBChange(event)}
                                name="remember-me"
                                value={fields.remember_me}
                                labelText="Remember me"/>
                            <Link className="forgot" to={"/forgot/password"}>Forgot Password?</Link>
                        </div>
                        <button className="button" type="submit" disabled={!isFormValid}>
                            Login
                        </button>
                    </form>
                </div>
            </section>
        );
    }
}

export default Login;