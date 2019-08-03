import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import ReactSelect from 'react-select';
import FileInput from "../../common/FileInput";
import CheckBox from "../../common/CheckBox";
import { is } from "../../helpers/acl"
import { read, update } from "../../helpers/resource";

class EditAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.category,
            loading: false,
            loaded: false,
            fields: {
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                confirm_pass: "",
                roles: [],
                avatar: "",
                status: false
            },
            required_fields: {
                first_name: "",
                last_name: "",
                email: "",
                roles: []
            },
            roles: [],
            formValidationData: {},
            isFormValid: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { id } = this.state;
        read('users/'+id, {})
            .then(res => {
                let { fields } = this.state;

                fields.first_name = res.data.profile.first_name;
                fields.last_name = res.data.profile.last_name;
                fields.email = res.data.user.email;
                fields.status = res.data.user.status;
                fields.roles = res.data.roles;
                fields.avatar = res.data.profile.avatar;

                this.setState({
                    fields: fields,
                    loaded: true
                });
            })
            .catch(console.log);

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

        const { id, isFormValid } = this.state;

        if (!isFormValid) return;
        
        this.setState({
            loading: true
        });

        let data = new FormData(e.target);
        data.append("_method", "PUT");

        update("users/" + id, data)
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
                formValidationData.form = "Unable To Update User";
                this.setState({
                    formValidationData: formValidationData,
                    loading: false,
                    isFormValid: false
                })
            });
    }

    render() {
        const { loaded, fields, roles, loading, isFormValid, formValidationData } = this.state;

        if (!loaded) return false;

        let selectedRoles = fields.roles.map(c => {
            let label = "";
            roles.forEach(role => role.value == c ? label = role.label : "");
            return { label: label, value: c }
        });

        return (
            <div>
                <header className="pageheader">
                    <h2>Edit School</h2>
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

                    {is("admin") &&
                    <fieldset className="fields horizontal">
                        <label>
                            <span>Roles</span>
                            <ReactSelect
                                className="react-select"
                                options={roles}
                                value={selectedRoles}
                                isMulti={true}
                                onChange={v => this.handleChange("roles", v, true)}
                                name="roles[]" />
                        </label>
                    </fieldset>
                    }


                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            type="password"
                            name="password"
                            value={fields.password}
                            maxLength={50}
                            labelText="Password"
                            validation={[validations.isAlphaNumeric]}
                        />
                        <TextField
                            onChange={this.handleChange}
                            type="password"
                            name="confirm_pass"
                            value={fields.confirm_pass}
                            maxLength={50}
                            labelText="Confirm Password"
                            equalTo={fields.password}
                            validation={[validations.equalTo]}
                        />
                    </fieldset>

                    <div className="row">
                        <div className="col-md-6 col-lg-4">
                            <FileInput
                                onChange={this.handleChange}
                                name="avatar"
                                labelText="Avatar"
                                value={fields.avatar}
                            />
                        </div>
                    </div>

                    <CheckBox
                        onChange={this.handleChange}
                        name="status"
                        value={fields.status}
                        labelText="Approved?" /><br />

                    <button className="button" disabled={!isFormValid}>Update School</button>
                </form>
            </div>
        );
    }
}

export default EditAdmin;