import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import TextArea from "../../common/TextArea";
import CheckBox from "../../common/CheckBox";
import FileInput from "../../common/FileInput";
import { read, update } from "../../helpers/resource";

class EditRegulation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.regulation,
            loading: false,
            loaded: false,
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
            required_fields: {
                name: "",
                abbreviation: "",
                commission_name: "",
                commission_abbreviation: ""
            },
            formValidationData: {},
            isFormValid: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { id } = this.state;
        read('regulations/'+id, {})
            .then(res => {
                this.setState({
                    fields: res.data.regulation,
                    loaded: true
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleChange(name, value, valid) {
        let { fields, formValidationData } = this.state;
        if (event.target.files) {
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

        const { id, isFormValid } = this.state;

        if (!isFormValid) return;
        
        this.setState({
            loading: true
        });

        let data = new FormData(e.target);
        data.append('_method', 'PUT');

        update('regulations/'+id, data, true)
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/regulations")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch(err => {
                let { formValidationData } = this.state;
                formValidationData.form = "Unable To Update Regulation";
                this.setState({
                    formValidationData: formValidationData,
                    loading: false,
                    isFormValid: false
                })
            });
    }

    render() {
        const { loaded, fields, loading, isFormValid, formValidationData } = this.state;

        if (!loaded) return false;

        return (
            <div>
                <header className="pageheader">
                    <h2>Edit Regulation</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            name="name"
                            value={fields.name}
                            required={true}
                            labelText="Name"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="abbreviation"
                            value={fields.abbreviation}
                            required={true}
                            labelText="Abbreviation"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="commission_name"
                            value={fields.commission_name}
                            required={true}
                            labelText="Commission Name"
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="commission_abbreviation"
                            value={fields.commission_abbreviation}
                            required={true}
                            labelText="Commission Abbreviation"
                            validation={[validations.isEmpty]}
                        />
                    </fieldset>

                    <CheckBox
                        onChange={this.handleChange}
                        name="must_specify_courses"
                        value={fields.must_specify_courses}
                        labelText="Course specific?"/>

                    <legend>Contact</legend>
                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            name="contact_first_name"
                            value={fields.contact_first_name}
                            labelText="First Name"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="contact_last_name"
                            value={fields.contact_last_name}
                            labelText="Last Name"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="contact_email_address"
                            value={fields.contact_email_address}
                            labelText="Email"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="contact_phone"
                            value={fields.contact_phone}
                            labelText="Phone"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="contact_street_address"
                            value={fields.contact_street_address}
                            labelText="Street Address"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="contact_city"
                            value={fields.contact_city}
                            labelText="City"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="contact_state"
                            value={fields.contact_state}
                            labelText="State"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="contact_zip_code"
                            value={fields.contact_zip_code}
                            labelText="Zip Code"
                        />
                    </fieldset>

                    <legend>Regulations</legend>
                    <fieldset className="fields horizontal">
                        <TextArea
                            onChange={(event) => this.handleChange(event)}
                            name="regulations"
                            value={fields.regulations}
                            placeholder="Regulations"
                        />
                    </fieldset>

                    <legend>CE Requirements Statement</legend>
                    <fieldset className="fields horizontal">
                        <TextArea
                            onChange={(event) => this.handleChange(event)}
                            name="ce_requirements_statement"
                            value={fields.ce_requirements_statement}
                            placeholder="CE Eequirements Statement"
                        />
                    </fieldset>

                    <FileInput
                        onChange={(event) => this.handleChange(event)}
                        name="regulations_doc"
                        labelText="Regulations Doc"
                        value={fields.regulations_doc}
                    />

                    <button className="button" disabled={!isFormValid}>Update Regulation</button>
                </form>
            </div>
        );
    }
}

export default EditRegulation;