import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import TextArea from "../../common/TextArea";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
import { read, create } from "../../helpers/resource";

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
                expiration_date: "",
                class_flyer_template: "",
                class_docs_template: "",
                material: "",
                commercial_link: ""
            },
            required_fields: {
                title: "",
            },
            regulations: [],
            formValidationData: {},
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.changeRegulation = this.changeRegulation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        read('regulations/', [])
            .then(res => {
                let { regulations } = res.data;
                let { fields } = this.state;
                if (regulations) {
                    fields.regulation_id = regulations[0].id;
                }
                this.setState({
                    regulations: regulations,
                    fields: fields
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
        this.setState({fields: fields});
    }

    handleBlur(field) {
        let { formValidationData, required_fields } = this.state;
        formValidationData[field.key] = field.value;
        this.setState({formValidationData: formValidationData});
        let isFormValid = true;
        for (let key in required_fields) {
            if (!formValidationData[key]) {
                isFormValid = false;
            }
        }
        this.setState({isFormValid: isFormValid});
    }

    changeRegulation(value) {
        let { fields } = this.state;
        fields.regulation_id = value;
        this.setState({
            fields: fields
        });
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
            .catch((err) => {
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
        const {fields, regulations, loading, isFormValid, formValidationData } = this.state;

        return (
            <div>
                <header>
                    <h2>Create Course</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                    <fieldset className="fields horizontal">
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="title"
                            value={fields.title}
                            required={true}
                            labelText="Title"
                            validation={[validations.isEmpty]}
                        />
                        <label>
                            <span>Regulation</span>
                            <Select
                                onChange={this.changeRegulation}
                                name="regulation_id"
                                items={regulations}
                                id={"id"}
                                val={"name"}
                            />
                        </label>
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="number"
                            value={fields.number}
                            labelText="Number"
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="code"
                            value={fields.code}
                            labelText="Code"
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="hours"
                            value={fields.hours}
                            labelText="Hours"
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="expiration_date"
                            value={fields.expiration_date}
                            labelText="Expiration Date"
                        />
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="commercial_link"
                            value={fields.commercial_link}
                            labelText="Commercial Link"
                        />
                    </fieldset>

                    <legend>Description</legend>
                    <fieldset className="fields horizontal">
                        <TextArea
                            onChange={(event) => this.handleChange(event)}
                            name="description"
                            value={fields.description}
                            placeholder="Description"
                        />
                    </fieldset>

                    <div className="row">
                        <div className="col-lg-4">
                            <FileInput
                                onChange={(event) => this.handleChange(event)}
                                name="class_flyer_template"
                                labelText="Class Flyer Template"
                            />
                        </div>
                        <div className="col-lg-4">
                            <FileInput
                                onChange={(event) => this.handleChange(event)}
                                name="class_docs_template"
                                labelText="Class Docs Template"
                            />
                        </div>
                        <div className="col-lg-4">
                            <FileInput
                                onChange={(event) => this.handleChange(event)}
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