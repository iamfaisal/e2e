import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import TextArea from "../../common/TextArea";
import Select from "../../common/Select";
import ReactSelect from 'react-select';
import FileInput from "../../common/FileInput";
import DatePicker from "react-datepicker";
import { read, create, dateToString } from "../../helpers/resource";

class CreateCourse extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fields: {
                title: "",
                regulation_id: "",
                number: "",
                code: "",
                hours: "",
                description: "",
                expiration_date: new Date,
                class_flyer_template: "",
                class_docs_template: "",
                material: "",
                commercial_link: ""
            },
            required_fields: {
                title: "",
            },
            regulations: [],
            categories: [],
            formValidationData: {},
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        read('regulations/', {})
            .then(res => {
                this.setState({
                    regulations: res.data.regulations
                });
            })
            .catch(console.log);

        read('categories/', {})
            .then(res => {
                this.setState({
                    categories: res.data.categories.map(role => {
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

        const {isFormValid } = this.state;

        if (!isFormValid) return;
        
        this.setState({
            loading: true
        });

        create('courses', new FormData(e.target), true)
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/courses")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch(err => {
                let { formValidationData } = this.state;
                formValidationData.form = "Unable To Create Course";
                this.setState({
                    formValidationData: formValidationData,
                    loading: false,
                    isFormValid: false
                })
            });
    }

    render() {
        const { fields, regulations, categories, loading, isFormValid, formValidationData } = this.state;

        return (
            <div>
                <header className="pageheader">
                    <h2>Create Course</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            name="title"
                            value={fields.title}
                            required={true}
                            labelText="Title"
                            validation={[validations.isEmpty]}
                        />
                        <label>
                            <span>State</span>
                            <Select
                                placeholder="Select State" 
                                onChange={this.handleChange}
                                name="regulation_id"
                                items={regulations}
                                id="id"
                                val="name"
                            />
                        </label>
                        <TextField
                            onChange={this.handleChange}
                            name="number"
                            value={fields.number}
                            labelText="Number"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="code"
                            value={fields.code}
                            labelText="Code"
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="hours"
                            value={fields.hours}
                            labelText="Hours"
                        />
                        <label>
                            <span>Expiration Date</span>
                            <DatePicker
                                selected={fields.expiration_date}
                                onChange={d => this.handleChange("expiration_date", d)}
                                dateFormat="MMMM d, yyyy"
                            />
                            <input type="hidden" name="expiration_date" value={dateToString(fields.expiration_date)} />
                        </label>
                        <TextField
                            onChange={this.handleChange}
                            name="commercial_link"
                            value={fields.commercial_link}
                            labelText="Commercial Link"
                        />
                    </fieldset>

                    <fieldset className="fields horizontal">
                        <label>
                            <span>Categories</span>
                            <ReactSelect
                                className="react-select"
                                name="categories[]"
                                options={categories}
                                isMulti={true}
                            />
                        </label>
                    </fieldset>

                    <legend>Description</legend>
                    <fieldset className="fields horizontal">
                        <TextArea
                            onChange={this.handleChange}
                            name="description"
                            value={fields.description}
                            placeholder="Description"
                        />
                    </fieldset>

                    <div className="row">
                        <div className="col-lg-4">
                            <FileInput
                                onChange={this.handleChange}
                                name="class_flyer_template"
                                labelText="Class Flyer Template"
                            />
                        </div>
                        <div className="col-lg-4">
                            <FileInput
                                onChange={this.handleChange}
                                name="class_docs_template"
                                labelText="Class Docs Template"
                            />
                        </div>
                        <div className="col-lg-4">
                            <FileInput
                                onChange={this.handleChange}
                                name="material"
                                labelText="Course Material"
                            />
                        </div>
                    </div>

                    <button className="button" disabled={!isFormValid}>Create Course</button>
                </form>
            </div>
        );
    }
}

export default CreateCourse;