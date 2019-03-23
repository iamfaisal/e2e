import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import TextArea from "../../common/TextArea";
import Select from "../../common/Select";
import FileInput from "../../common/FileInput";
import { read, update } from "../../helpers/resource";

class EditCourse extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.course,
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
                commercial_link: "",
                categories: []
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
        const { id } = this.state;

        read('courses/'+id, {})
            .then(res => {
                let { course } = res.data;
                let cats = [];
                course.categories.forEach(category => {
                    cats.push(category.id);
                });
                course.categories = cats;
                this.setState({
                    fields: course,
                    loading: false
                });
            })
            .catch((err) => {
                console.log(err);
            });

        read('regulations/', {})
            .then(res => {
                this.setState({
                    regulations: res.data.regulations,
                });
            })
            .catch((err) => {
                console.log(err);
            });

        read('categories/', {})
            .then(res => {
                this.setState({
                    categories: res.data.categories
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
        data.append("_method", "PUT");

        update('courses/'+id, data, true)
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
                formValidationData.form = "Unable To Update Course";
                this.setState({
                    formValidationData: formValidationData,
                    loading: false,
                    isFormValid: false
                })
            });
    }

    render() {
        const { fields, regulations, categories, loading, isFormValid, formValidationData } = this.state;

        if (!fields.id) return false;

        return (
            <div>
                <header className="pageheader">
                    <h2>Edit Course</h2>
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
                            <span>Regulation</span>
                            <Select
                                onChange={this.handleChange}
                                name="regulation_id"
                                items={regulations}
                                value={fields.regulation_id}
                                id={"id"}
                                val={"name"}
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
                        <TextField
                            onChange={this.handleChange}
                            name="expiration_date"
                            value={fields.expiration_date}
                            labelText="Expiration Date"
                        />
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
                            <Select
                                onChange={this.handleChange}
                                name="categories[]"
                                items={categories}
                                value={fields.categories}
                                multiple
                                id={"id"}
                                val={"label"}
                            />
                        </label>
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
                                value={fields.class_flyer_template}
                            />
                        </div>
                        <div className="col-lg-4">
                            <FileInput
                                onChange={(event) => this.handleChange(event)}
                                name="class_docs_template"
                                labelText="Class Docs Template"
                                value={fields.class_docs_template}
                            />
                        </div>
                        <div className="col-lg-4">
                            <FileInput
                                onChange={(event) => this.handleChange(event)}
                                name="material"
                                labelText="Material"
                                value={fields.material}
                            />
                        </div>
                    </div>

                    <button className="button" disabled={!isFormValid}>Update Course</button>
                </form>
            </div>
        );
    }
}

export default EditCourse;