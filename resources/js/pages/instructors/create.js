import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
import TextArea from "../../common/TextArea";
import DatePicker from "react-datepicker";
import { read, create, dateToString } from "../../helpers/resource";

class CreateInstructor extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
                    expiration: new Date
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
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addLicense = this.addLicense.bind(this);
        this.removeLicense = this.removeLicense.bind(this);
        this.setLicenseDate = this.setLicenseDate.bind(this);
    }

    componentDidMount() {
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

        const { isFormValid } = this.state;

        if (!isFormValid) return;
        
        this.setState({
            loading: true
        });

        let data = new FormData(e.target);
        data.append('roles[]', 3);
        create('users', data)
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/instructors")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch((err) => {
                let { formValidationData } = this.state;
                formValidationData.form = "Unable To Create Instructor";
                this.setState({
                    formValidationData: formValidationData,
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
            expiration: new Date
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

    setLicenseDate(i, date) {
        let { fields } = this.state;
        fields.licenses[i].expiration = date;
        this.setState({
            fields: fields
        });
    }

    render() {
        const { fields, regulations, loading, isFormValid, formValidationData } = this.state;

        return (
            <div>
                <header className="pageheader">
                    <h2>Create Instructor</h2>
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
                        <TextField
                            onChange={this.handleChange}
                            name="sub_domain"
                            value={fields.sub_domain}
                            maxLength={50}
                            labelText="Sub Domain"
                        />
                    </fieldset>

                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            name="address"
                            value={fields.address}
                            maxLength={50}
                            labelText="Street Address"
                        />
                        <TextField
                            onChange={this.handleChange}
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
                            onChange={this.handleChange}
                            name="zip_code"
                            value={fields.zip_code}
                            maxLength={50}
                            labelText="Zip Code"
                        />
                    </fieldset>

                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            name="cell_phone"
                            value={fields.cell_phone}
                            maxLength={50}
                            labelText="Cell Phone"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="work_phone"
                            value={fields.work_phone}
                            maxLength={50}
                            labelText="Work Phone"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="additional_name"
                            value={fields.additional_name}
                            maxLength={50}
                            labelText="Additional Name (#1)"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="additional_email"
                            value={fields.additional_email}
                            maxLength={50}
                            labelText="Additional Email Address (#1)"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="additional_name2"
                            value={fields.additional_name2}
                            maxLength={50}
                            labelText="Additional Name (#2)"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="additional_email2"
                            value={fields.additional_email2}
                            maxLength={50}
                            labelText="Additional Email Address (#2)"
                        />
                    </fieldset>

                    <legend>Profile</legend>
                    <fieldset className="fields horizontal">
                        <TextArea
                            onChange={this.handleChange}
                            name="info"
                            value={fields.info}
                            placeholder="Profile"
                        />
                    </fieldset>

                    {fields.licenses.map((license, i) => {
                        return <fieldset key={i} className="fields horizontal">
                            <label>
                                <span>State</span>
                                <Select
                                    name={"licenses[" + i + "][regulation]"}
                                    items={regulations}
                                    placeholder="Select Regulation"
                                    id={"id"}
                                    val={"name"}
                                />
                            </label>
                            <TextField
                                onChange={this.handleChange}
                                name={"licenses[" + i + "][code]"}
                                value={""}
                                maxLength={50}
                                labelText="License Number"
                            />
                            <label>
                                <span>Expiration</span>
                                <DatePicker
                                    selected={license.expiration}
                                    onChange={d => this.setLicenseDate(i, d)}
                                    dateFormat="MMMM d, yyyy"
                                />
                                <input
                                    type="hidden"
                                    name={"licenses[" + i + "][expiration]"}
                                    value={dateToString(license.expiration)}
                                />
                            </label>
                            <FileInput
                                onChange={event => this.handleChange(event)}
                                name={"licenses[" + i + "][certificate]"}
                                labelText="Certificate"
                            />
                        </fieldset>
                    })}
                    <div className={ "repeatActions count-" + fields.licenses.length }>
                        <button className="ion-md-remove" onClick={this.removeLicense}></button>
                        <button className="ion-md-add" onClick={this.addLicense}></button>
                    </div>

                    <div className="row">
                        <div className="col-md-6 col-lg-4">
                            <FileInput
                                onChange={event => this.handleChange(event)}
                                name="avatar"
                                labelText="Avatar"
                            />
                        </div>
                    </div>

                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            type="password"
                            name="password"
                            value={fields.password}
                            maxLength={50}
                            labelText="Password"
                            validation={[validations.isEmpty, validations.isAlphaNumeric]}
                        />
                        <TextField
                            onChange={this.handleChange}
                            type="password"
                            name="confirm_pass"
                            value={fields.confirm_pass}
                            maxLength={50}
                            labelText="Confirm Password"
                            equalTo={fields.password}
                            validation={[validations.isEmpty, validations.isAlphaNumeric, validations.equalTo]}
                        />
                    </fieldset>

                    <button className="button" disabled={!isFormValid}>Create Instructor</button>
                </form>
            </div>
        );
    }
}

export default CreateInstructor;