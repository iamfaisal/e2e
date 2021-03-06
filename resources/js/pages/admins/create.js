import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import ReactSelect from 'react-select';
import FileInput from "../../common/FileInput";
import CheckBox from "../../common/CheckBox";
import { read, create } from "../../helpers/resource";

class CreateAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fields: {
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                roles: [],
                status: false
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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        read('roles/', {})
            .then(res => {
                this.setState({
                    roles: res.data.roles.map(role => {
                        return {
                            label: role.label,
                            value: role.id
                        }
                    }).sort((a, b) => a.label < b.label ? -1 : 1)
                });
            })
            .catch(console.log);
    }

    handleChange(name, value, valid) {
        let { fields, formValidationData } = this.state;
        if (event && event.target.files) {
            fields[name] = event.target.files;
        } else if (Array.isArray(value)) {
            fields[name] = value.map(v => v.value);
            if (value.length) valid = true;
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
                console.log(key, formValidationData[key]);
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

        create('users', new FormData(e.target))
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/users")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch(err => {
                let { formValidationData } = this.state;
                formValidationData.form = "Unable To Create User";
                this.setState({
                    formValidationData: formValidationData,
                    loading: false,
                    isFormValid: false
                })
            });
    }

    render() {
        const { fields, roles, loading, isFormValid, formValidationData } = this.state;

        return (
            <div>
                <header className="pageheader">
                    <h2>Create School</h2>
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
                    </fieldset>

                    <fieldset className="fields horizontal">
                        <label>
                            <span>Roles</span>
                            <ReactSelect
                                className="react-select"
                                onChange={v => this.handleChange("roles", v)}
                                name="roles[]"
                                options={roles}
                                isMulti={true}
                            />
                        </label>
                    </fieldset>

                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            type="password"
                            name="password"
                            value={fields.password}
                            required={true}
                            maxLength={50}
                            labelText="Password"
                            validation={[validations.isEmpty, validations.isAlphaNumeric]}
                        />
                        <TextField
                            onChange={this.handleChange}
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
                                onChange={this.handleChange}
                                name="avatar"
                                labelText="Avatar"
                            />
                        </div>
                    </div>

                    <CheckBox
                        onChange={this.handleChange}
                        name="status"
                        value={fields.status}
                        labelText="Approved?" /><br />

                    <button className="button" disabled={!isFormValid}>Create School</button>
                </form>
            </div>
        );
    }
}

export default CreateAdmin;