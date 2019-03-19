import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
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
                roles: []
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
        this.setRoles = this.setRoles.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                            <Select
                                onChange={this.setRoles}
                                name="roles[]"
                                items={roles}
                                multiple
                                id={"id"}
                                val={"label"}
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
                                onChange={event => this.handleChange(event)}
                                name="avatar"
                                labelText="Avatar"
                            />
                        </div>
                    </div>

                    <button className="button" disabled={!isFormValid}>Create Admin</button>
                </form>
            </div>
        );
    }
}

export default CreateAdmin;