import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import { create } from "../../helpers/resource";

class CreateRegulation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fields: {
                name: "",
                abbreviation: "",
                commission_name: "",
                commission_abbreviation: "",
                contact_first_name: "",
                contact_last_name: "",
                contact_email_address: "",
                contact_phone: "",
                contact_street_address: "",
                contact_city: "",
                contact_state: "",
                contact_zip_code: "",
                regulations: "",
                regulations_doc: "",
                ce_requirements_statement: "",
                must_specify_courses: 1
            },
            formValidationData: {},
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(value) {
        let { fields } = this.state;
        fields[event.target.name] = event.target.value;
        this.setState({fields: fields});
    }

    handleBlur(field) {
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

    handleSubmit(e) {
        e.preventDefault();

        const { fields, isFormValid, category } = this.state;

        if (!isFormValid) return;
        
        this.setState({
            loading: true
        });

        create('regulations', {label: fields.title})
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/regulations")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch((err) => {
                this.setState({
                    formValidationData: {form: "Unable To Create Regulation"},
                    loading: false,
                    isFormValid: false
                })
            });
    }

    render() {
        const {fields, loading, isFormValid, formValidationData } = this.state;

        return (
            <div>
                <header>
                    <h2>Create Regulation</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                    <fieldset className="fields horizontal">
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="name"
                            value={fields.name}
                            required={true}
                            labelText="Name"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="abbreviation"
                            value={fields.abbreviation}
                            required={true}
                            labelText="Abbreviation"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="commission_name"
                            value={fields.commission_name}
                            required={true}
                            labelText="Commission Name"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="commission_abbreviation"
                            value={fields.commission_abbreviation}
                            required={true}
                            labelText="Commission Abbreviation"
                            validation={[validations.isEmpty]}
                        />
                    </fieldset>

                    <legend>Contact</legend>
                    <fieldset className="fields horizontal">
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="contact_first_name"
                            value={fields.contact_first_name}
                            required={true}
                            labelText="First Name"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="contact_last_name"
                            value={fields.contact_last_name}
                            required={true}
                            labelText="Last Name"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="contact_email_address"
                            value={fields.contact_email_address}
                            required={true}
                            labelText="Email"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="contact_phone"
                            value={fields.contact_phone}
                            required={true}
                            labelText="Phone"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="contact_street_address"
                            value={fields.contact_street_address}
                            required={true}
                            labelText="Street Address"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="contact_city"
                            value={fields.contact_city}
                            required={true}
                            labelText="City"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="contact_state"
                            value={fields.contact_state}
                            required={true}
                            labelText="State"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="contact_zip_code"
                            value={fields.contact_zip_code}
                            required={true}
                            labelText="Zip Code"
                            validation={[validations.isEmpty]}
                        />
                    </fieldset>

                    <legend>Contact</legend>
                    <fieldset className="fields horizontal">
                        <TextArea
                            onBlur={(isValid) => this.handleFields(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="info"
                            value={user.profile.info}
                            required={true}
                            placeholder="Public Profile"
                            validation={[validations.isEmail]}/>
                    </fieldset>

                    <button className="button" disabled={!isFormValid}>Create Regulation</button>
                </form>
            </div>
        );
    }
}

export default CreateRegulation;