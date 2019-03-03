import React, { Component } from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
import TextArea from "../../common/TextArea";
import { read, update } from "../../helpers/resource";

class EditInstructor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.instructor,
            loading: false,
            fields: {
                first_name: "",
                last_name: "",
                email: "",
                cell_phone: "",
                work_phone: "",
                sub_domain: "",
                address: "",
                city: "",
                state: "",
                zip_code: "",
                additional_name: "",
                additional_name2: "",
                additional_email: "",
                additional_email2: "",
                info: "",
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
                email: ""
            },
            regulations: [],
            formValidationData: {},
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addLicense = this.addLicense.bind(this);
        this.removeLicense = this.removeLicense.bind(this);
    }

    componentDidMount() {
        const { id } = this.state;

        read('users/' + id, {})
            .then(res => {
                let { fields } = this.state;
                fields.email = res.data.user.email;

                this.setState({
                    fields: { ...fields, ...res.data.profile }
                });
            })
            .catch((err) => {
                console.log(err);
            });

        read('regulations/', {})
            .then(res => {
                this.setState({
                    regulations: res.data.regulations
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
        this.setState({ formValidationData: formValidationData });
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
        update('users/' + id, data)
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/instructors")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch((err) => {
                this.setState({
                    formValidationData: { form: "Unable To Update Instructor" },
                    loading: false,
                    isFormValid: false
                })
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
        const { fields, regulations, loading, isFormValid, formValidationData } = this.state;

        if (!fields.first_name) return false;

        console.log(fields);

        return (
            <div>
                <header className="pageheader">
                    <h2>Create Instructor</h2>
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
                            name="address"
                            value={fields.address}
                            maxLength={50}
                            labelText="Street Address"
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="city"
                            value={fields.city}
                            maxLength={50}
                            labelText="City"
                        />
                        <label>
                            <span>State</span>
                            <Select
                                name="state"
                                items={regulations}
                                id={"id"}
                                val={"name"}
                            />
                        </label>
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="zip_code"
                            value={fields.zip_code}
                            maxLength={50}
                            labelText="Zip Code"
                        />
                    </fieldset>

                    <fieldset className="fields horizontal">
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="cell_phone"
                            value={fields.cell_phone}
                            maxLength={50}
                            labelText="Cell Phone"
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="work_phone"
                            value={fields.work_phone}
                            maxLength={50}
                            labelText="Work Phone"
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="additional_name"
                            value={fields.additional_name}
                            maxLength={50}
                            labelText="Additional Name (#1)"
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="additional_email"
                            value={fields.additional_email}
                            maxLength={50}
                            labelText="Additional Email Address (#1)"
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="additional_name2"
                            value={fields.additional_name2}
                            maxLength={50}
                            labelText="Additional Name (#2)"
                        />
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="additional_email2"
                            value={fields.additional_email2}
                            maxLength={50}
                            labelText="Additional Email Address (#2)"
                        />
                    </fieldset>

                    <legend>Profile</legend>
                    <fieldset className="fields horizontal">
                        <TextArea
                            onChange={(event) => this.handleChange(event)}
                            name="info"
                            value={fields.info}
                            placeholder="Profile"
                        />
                    </fieldset>

                    {fields.licenses.map((linense, i) => {
                        return <fieldset key={i} className="fields horizontal">
                            <label>
                                <span>State</span>
                                <Select
                                    name="licenses[][regulation]"
                                    items={regulations}
                                    placeholder="Select Regulation"
                                    id={"id"}
                                    val={"name"}
                                />
                            </label>
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
                                labelText="Expiration"
                            />
                            <FileInput
                                onChange={event => this.handleChange(event)}
                                name="licenses[][certificate]"
                                labelText="Certificate"
                            />
                        </fieldset>
                    })}
                    <div className={"repeatActions count-" + fields.licenses.length}>
                        <button className="ion-md-remove" onClick={this.removeLicense}></button>
                        <button className="ion-md-add" onClick={this.addLicense}></button>
                    </div>

                    <div className="row">
                        <div className="col-md-6 col-lg-4">
                            <FileInput
                                onChange={event => this.handleChange(event)}
                                name="avatar"
                                labelText="Avatar"
                                value={fields.avatar}
                            />
                        </div>
                    </div>

                    <fieldset className="fields horizontal">
                        <TextField
                            onBlur={(isValid) => this.handleBlur(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            type="password"
                            name="password"
                            value={fields.password}
                            maxLength={50}
                            labelText="Password"
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
                        />
                    </fieldset>

                    <button className="button" disabled={!isFormValid}>Create Instructor</button>
                </form>
            </div>
        );
    }
}

export default EditInstructor;