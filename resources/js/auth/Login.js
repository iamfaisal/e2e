import React, { Component } from "react";
import { Link } from "react-router-dom";
import { login, getAuthUser } from "../helpers/auth";
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
            formValidationData: {
                "remember_me": true
            },
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
                    if (res.status == 200) {
                        this.props.history.push("/");
                    }
                }).catch((err) => {
                this.setState({
                    formValidationData: {form: "Invalid email or password."},
                    isLoading: false,
                    isFormValid: false
                });
            });
        }
    }

    render() {
        if (getAuthUser()) this.props.history.push("/");
        const { fields, isFormValid, formValidationData } = this.state;

        return (
            <form className="form-auth" onSubmit={this.handleSubmit}>
                <h2 className="h3 mb-3 font-weight-normal">Login to your account</h2>

                {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}

                <TextField
                    onBlur={(isValid) => this.handleFields(isValid)}
                    onChange={(event) => this.handleChange(event)}
                    name="email"
                    value={fields.email}
                    required={true}
                    maxLength={50}
                    labelText="Email Address"
                    validation={[validations.isEmail]}
                />

                <TextField
                    onBlur={(isValid) => this.handleFields(isValid)}
                    onChange={(event) => this.handleChange(event)}
                    name="password"
                    type="password"
                    value={fields.password}
                    required={true}
                    maxLength={50}
                    labelText="Password"
                    validation={[validations.isEmpty, validations.isAlphaNumeric]}
                />

                <CheckBox
                    onChange={(event) => this.handleChange(event)}
                    name="remember-me"
                    value={fields.remember_me}
                    labelText="Remember me"
                />

                <button className="btn btn-lg btn-primary btn-block mb-2"
                        type="submit"
                        disabled={!isFormValid}>
                    Login
                </button>

                <p className="small text-center">
                    <Link to={"/forgot/password"}>Forgot Your Password?</Link>
                </p>
            </form>
        );
    }
}

export default Login;