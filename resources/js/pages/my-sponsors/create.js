import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
import { read, create } from "../../helpers/resource";

class CreateMySponsor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fields: {
                company: "",
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                extension: "",
                address: "",
                city: "",
                regulation: "",
                zip_code: "",
                avatar: "",
                logo: ""
            },
            required_fields: {
                first_name: "",
                last_name: "",
                email: ""
            },
            instructors: [],
            regulations: [],
            formValidationData: {},
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.setRegulation = this.setRegulation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        read('regulations', {})
            .then(res => {
                this.setState({
                    regulations: res.data.regulations,
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

        create('sponsors', new FormData(e.target))
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/my-sponsors")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch((err) => {
                this.setState({
                    formValidationData: { form: "Unable To Create Sponsor" },
                    loading: false,
                    isFormValid: false
                })
            });
    }

    setRegulation(regulation) {
        let { fields } = this.state;
        fields.regulation_id = regulation;
        this.setState({
            fields: fields
        });
        this.handleBlur({
            key: "regulation",
            value: regulation
        });
    }

    render() {
        const { fields, regulations, loading, isFormValid, formValidationData } = this.state;

        return (
            <div>
                <header className="pageheader">
                    <h2>Create Sponsor</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                    {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                    <input type="hidden" name="user" value="1" />
                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            name="company"
                            value={fields.company}
                            maxLength={50}
                            labelText="Company Name"
                        />
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
                            name="phone"
                            required={true}
                            maxLength={50}
                            labelText="Phone"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="extension"
                            value={fields.extension}
                            maxLength={50}
                            labelText="Extension"
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
                                onChange={this.setRegulation}
                                name="regulation"
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

                    <div className="row">
                        <div className="col-md-6 col-lg-4">
                            <FileInput
                                onChange={event => this.handleChange(event)}
                                name="logo"
                                labelText="Logo"
                            />
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <FileInput
                                onChange={event => this.handleChange(event)}
                                name="avatar"
                                labelText="Avatar"
                            />
                        </div>
                    </div>

                    <button className="button" disabled={!isFormValid}>Create Sponsor</button>
                </form>
            </div>
        );
    }
}

export default CreateMySponsor;