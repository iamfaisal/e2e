import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import TextArea from "../../common/TextArea";
import Select from "../../common/Select";
import ReactSelect from 'react-select';
import FileInput from "../../common/FileInput";
import DatePicker from "react-datepicker";
import { read, update, dateToString } from "../../helpers/resource";

class EditCourse extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.course,
            workshop: false,
            loading: false,
            loaded: false,
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
                regulation_id: "",
                number: "",
                code: "",
                hours: ""
            },
            lengths: [
                { value: 15, label: "15 Minutes" },
                { value: 30, label: "30 Minutes" },
                { value: 45, label: "45 Minutes" },
                { value: 60, label: "1 Hour" },
                { value: 75, label: "1 Hour, 15 Minutes" },
                { value: 90, label: "1 Hour, 30 Minutes" },
                { value: 105, label: "1 Hour, 45 Minutes" },
                { value: 120, label: "2 Hour" },
                { value: 135, label: "2 Hour, 15 Minutes" },
                { value: 150, label: "2 Hour, 30 Minutes" },
                { value: 165, label: "2 Hour, 45 Minutes" },
                { value: 180, label: "3 Hour" }
            ],
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

        read('courses/' + id, {}).then(res => {
            let { course } = res.data;
            let cats = [];
            course.categories.forEach(category => {
                cats.push(category.id);
            });
            course.categories = cats;
            this.setState({
                workshop: course.is_workshop,
                fields: course,
                loaded: true
            });
        }).catch(console.log);

        read('regulations/', {})
            .then(res => {
                this.setState({
                    regulations: res.data.regulations,
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
        } else if (Array.isArray(value)) {
            fields[name] = value.map(v => v.value);
            if (value.length) valid = true;
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

        const { id, workshop, isFormValid } = this.state;

        if (!isFormValid) return;

        this.setState({
            loading: true
        });

        let data = new FormData(e.target);
        data.append("_method", "PUT");

        update('courses/'+id, data, true)
            .then(res => {
                res.status === 200
                    ? this.props.history.push(workshop ? "/courses/workshops" : "/courses")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch(err => {
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
        const { workshop, loaded, fields, lengths, regulations, categories, loading, isFormValid, formValidationData } = this.state;

        if (!loaded) return false;

        if (fields.expiration_date.constructor !== Date) {
            fields.expiration_date = new Date(fields.expiration_date);
        }

        let seleted_categories = fields.categories.map(c => {
            let label = "";
            categories.forEach(cat => cat.value == c ? label = cat.label : "");
            return { label: label, value: c }
        });

        let title = workshop ? "Workshop" : "CE Course";

        return (
            <div>
                <header className="pageheader">
                    <h2>Edit {title}</h2>
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
                            required={true}
                            validation={[validations.isEmpty]}
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="code"
                            value={fields.code}
                            labelText="Code"
                            required={true}
                            validation={[validations.isEmpty]}
                        />
                        <label>
                            <span>Length</span>
                            <Select
                                onChange={this.handleChange}
                                name="hours"
                                items={lengths}
                                sort={false}
                                value={fields.hours}
                                id="value"
                                val="label"
                            />
                        </label>
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
                                onChange={v => this.handleChange("categories", v)}
                                name="categories[]"
                                options={categories}
                                value={seleted_categories}
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
                                labelText={title + " Flyer Template"}
                                value={fields.class_flyer_template}
                            />
                        </div>
                        <div className="col-lg-4">
                            <FileInput
                                onChange={this.handleChange}
                                name="class_docs_template"
                                labelText={title + " Docs Template"}
                                value={fields.class_docs_template}
                            />
                        </div>
                        <div className="col-lg-4">
                            <FileInput
                                onChange={this.handleChange}
                                name="material"
                                labelText={title + "Material"}
                                value={fields.material}
                            />
                        </div>
                    </div>

                    <button className="button" disabled={!isFormValid}>Update {title}</button>
                </form>
            </div>
        );
    }
}

export default EditCourse;