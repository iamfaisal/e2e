import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
import TextArea from "../../common/TextArea";
import { read, create } from "../../helpers/resource";

class CreateInstructor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fields: {
                first_name: "",
                last_name: "",
                email: "",
                licenses: [{
                    regulation: "",
                    code: "",
                    certificate: "",
                    expiration: ""
                }]
            },
            required_fields: {
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                confirm_pass: "",
                roles: []
            },
            roles: [],
            formValidationData: {},
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.setRoles = this.setRoles.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.addLicense = this.addLicense.bind(this);
        this.removeLicense = this.removeLicense.bind(this);
    }

    componentDidMount() {
        read('roles/', {})
            .then(res => {
                this.setState({
                    roles: res.data.roles
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleChange(value) {
        let { fields } = this.state;
        if (event.target.files) {
            fields[event.target.name] = event.target.files;
        } else {
            fields[event.target.name] = event.target.value;
        }
        this.setState({ fields: fields });
    }

    handleBlur(field) {
        let { formValidationData, required_fields } = this.state;
        formValidationData[field.key] = field.value;
        this.setState({formValidationData: formValidationData});
        let isFormValid = true;
        for (let key in required_fields) {
            if (!formValidationData[key]) {
                isFormValid = false;
            }
        }
        this.setState({isFormValid: isFormValid});
    }

    handleSubmit(e) {
        e.preventDefault();

        const { fields, isFormValid } = this.state;

        if (!isFormValid) return;
        
        this.setState({
            loading: true
        });

        create('users', new FormData(e.target))
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/users")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch((err) => {
                this.setState({
                    formValidationData: {form: "Unable To Create User"},
                    loading: false,
                    isFormValid: false
                })
            });
    }

    setRoles(roles) {
        let { fields } = this.state;
        fields.roles = roles;
        this.setState({
            fields: fields
        });
        this.handleBlur({
            key: "roles",
            value: roles
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

    render() {
        const { fields, roles, loading, isFormValid, formValidationData } = this.state;

        return (
            <div>
                <header className="pageheader">
                    <h2>Create Admin</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                    {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                    <fieldset className="fields horizontal">
                        <TextField
                            onBlur={isValid => this.handleBlur(isValid)}
                            onChange={event => this.handleChange(event)}
                            name="first_name"
                            value={fields.first_name}
                            required={true}
                            maxLength={50}
                            labelText="First Name"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onBlur={isValid => this.handleBlur(isValid)}
                            onChange={event => this.handleChange(event)}
                            name="last_name"
                            value={fields.last_name}
                            required={true}
                            maxLength={50}
                            labelText="Last Name"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="email"
                            value={fields.email}
                            required={true}
                            maxLength={50}
                            labelText="Email"
                            validation={[validations.isEmail]}
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="sub_domain"
                            value={fields.sub_domain}
                            maxLength={50}
                            labelText="Sub Domain"
                        />
                    </fieldset>

                    <fieldset className="fields horizontal">
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="password"
                            value={fields.password}
                            maxLength={50}
                            labelText="Cell Phone"
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="password"
                            value={fields.password}
                            maxLength={50}
                            labelText="Work Phone"
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="password"
                            value={fields.password}
                            maxLength={50}
                            labelText="Additional Name (#1)"
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="password"
                            value={fields.password}
                            maxLength={50}
                            labelText="Additional Email Address (#1)"
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="password"
                            value={fields.password}
                            maxLength={50}
                            labelText="Additional Name (#2)"
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="password"
                            value={fields.password}
                            maxLength={50}
                            labelText="Additional Email Address (#2)"
                        />
                    </fieldset>

                    <legend>Profile</legend>
                    <fieldset className="fields horizontal">
                        <TextArea
                            onChange={(event) => this.handleChange(event)}
                            name="profile"
                            value={fields.description}
                            placeholder="Profile"
                        />
                    </fieldset>

                    <fieldset className="fields horizontal">
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            type="password"
                            name="password"
                            value={fields.password}
                            required={true}
                            maxLength={50}
                            labelText="Password"
                            validation={[validations.isEmpty, validations.isAlphaNumeric]}
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            type="password"
                            name="confirm_pass"
                            value={fields.confirm_pass}
                            required={true}
                            maxLength={50}
                            labelText="Confirm Password"
                            equalTo={fields.password}
                            validation={[validations.isEmpty, validations.isAlphaNumeric, validations.equalTo]}
                        />
                    </fieldset>

                    <div className="row">
                        <div className="col-md-6 col-lg-4">
                            <FileInput
                                onChange={event => this.handleChange(event)}
                                name="avatar"
                                labelText="Avatar"
                            />
                        </div>
                    </div>

                    {fields.licenses.map((linense, i) => {
                        return <fieldset key={i} className="fields horizontal">
                            <TextField
                                onBlur={(isValid) => this.handleBlur(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="licenses[][code]"
                                value={""}
                                maxLength={50}
                                labelText="License Number"
                            />
                            <TextField
                                onBlur={(isValid) => this.handleBlur(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="licenses[][expiration]"
                                value={""}
                                maxLength={50}
                                labelText="License Number"
                            />
                            <FileInput
                                onChange={event => this.handleChange(event)}
                                name="licenses[][certificate]"
                                labelText="Certificate"
                            />
                        </fieldset>
                    })}
                    <div className="repeatActions">
                        <button onClick={this.removeLicense}>-</button>
                        <button onClick={this.addLicense}>+</button>
                    </div>

                    <button className="button" disabled={!isFormValid}>Create Admin</button>
                </form>
            </div>
        );
    }
}

export default CreateInstructor;