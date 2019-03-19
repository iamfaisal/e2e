import React, { Component } from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import { read, update } from "../../helpers/resource";

class EditVenue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.venue,
            loading: false,
            fields: {
                address: "",
                city: "",
                name: "",
                regulation: "",
                user: "",
                zip_code: ""
            },
            required_fields: {
                name: ""
            },
            instructors: [],
            regulations: [],
            formValidationData: {},
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.setInstructor = this.setInstructor.bind(this);
        this.setRegulation = this.setRegulation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { id } = this.state;

        read('venues/' + id, {})
            .then(res => {
                this.setState({
                    fields: res.data.venue
                });
            })
            .catch((err) => {
                console.log(err);
            });

        read('users/', { params: { role: "instructor" } })
            .then(res => {
                this.setState({
                    instructors: res.data.users
                });
            })
            .catch((err) => {
                console.log(err);
            });

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

        const { id, isFormValid } = this.state;

        if (!isFormValid) return;

        this.setState({
            loading: true
        });
        
        let data = new FormData(e.target);
        data.append('_method', 'PUT');

        update('venues/' + id, data)
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/venues")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch((err) => {
                this.setState({
                    formValidationData: { form: "Unable To Update Venue" },
                    loading: false,
                    isFormValid: false
                })
            });
    }

    setInstructor(instructor) {
        let { fields } = this.state;
        fields.user_id = instructor;
        this.setState({
            fields: fields
        });
        this.handleBlur({
            key: "user",
            value: instructor
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
        const { fields, instructors, regulations, loading, isFormValid, formValidationData } = this.state;

        if (!fields.name) return false;

        return (
            <div>
                <header className="pageheader">
                    <h2>Edit Venue</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                    {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            name="name"
                            value={fields.name}
                            maxLength={50}
                            labelText="Name"
                            required={true}
                            validation={[validations.isEmpty]}
                        />
                        <label>
                            <span>Instructor</span>
                            <Select
                                onChange={this.setInstructor}
                                name="user"
                                items={instructors}
                                id={"id"}
                                val={"name"}
                            />
                        </label>
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

                    <button className="button" disabled={!isFormValid}>Update Venue</button>
                </form>
            </div>
        );
    }
}

export default EditVenue;