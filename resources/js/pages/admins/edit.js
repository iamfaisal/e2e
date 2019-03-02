import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import { read, update } from "../../helpers/resource";

class EditAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.category,
            loading: false,
            fields: {
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                confirm_pass: "",
                roles: []
            },
            required_fields: {
                first_name: "",
                last_name: "",
                email: "",
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
    }

    componentDidMount() {
        const { id } = this.state;
        read('users/'+id, [])
            .then(res => {
                let { fields } = this.state;

                fields.first_name = res.data.profile.first_name;
                fields.last_name = res.data.profile.last_name;
                fields.email = res.data.user.email;
                fields.roles = res.data.roles;

                this.setState({
                    fields: fields,
                    loading: false
                });
            })
            .catch((err) => {
                console.log(err);
            });

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
        fields[event.target.name] = event.target.value;
        this.setState({fields: fields});
    }

    handleBlur(field) {
        let { formValidationData, required_fields } = this.state;
        formValidationData[field.key] = field.value;
        this.setState({formValidationData: formValidationData});
        let isFormValid = true;
        for (let key in required_fields) {
            console.log(formValidationData, key)
            if (!formValidationData[key]) {
                isFormValid = false;
            }
        }
        this.setState({isFormValid: isFormValid});
    }

    handleSubmit(e) {
        e.preventDefault();

        const { id, fields, isFormValid } = this.state;

        if (!isFormValid) return;
        
        this.setState({
            loading: true
        });

        fields._method = "PUT";

        update("users/"+id, fields)
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
                    formValidationData: {form: "Unable To Update User"},
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

    render() {
        const { fields, roles, loading, isFormValid, formValidationData } = this.state;

        if (fields.first_name === "") return false;

        return (
            <div>
                <header className="pageheader">
                    <h2>Edit Admin</h2>
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
                    </fieldset>

                    <fieldset className="fields horizontal">
                        <label>
                            <span>Roles</span>
                            <Select
                                onChange={this.setRoles}
                                name="roles[]"
                                items={roles}
                                value={fields.roles}
                                multiple
                                id={"id"}
                                val={"label"}
                            />
                        </label>
                    </fieldset>

                    <fieldset className="fields horizontal">
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            type="password"
                            name="password"
                            value={fields.password}
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
                            maxLength={50}
                            labelText="Confirm Password"
                            equalTo={fields.password}
                            validation={[validations.isEmpty, validations.isAlphaNumeric, validations.equalTo]}
                        />
                    </fieldset>

                    <button className="button" disabled={!isFormValid}>Update Admin</button>
                </form>
            </div>
        );
    }
}

export default EditAdmin;