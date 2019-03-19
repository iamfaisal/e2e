import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import { create } from "../../helpers/resource";

class CreateCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fields: {
                title: ""
            },
            formValidationData: {},
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        let { formValidationData, fields } = this.state;

        let isFormValid = true;
        for (let key in fields) {
            if (!formValidationData[key]) {
                isFormValid = false;
            }
        }
        this.setState({ isFormValid: isFormValid });
    }

    handleSubmit(e) {
        e.preventDefault();

        const { fields, isFormValid, category } = this.state;

        if (!isFormValid) return;
        
        this.setState({
            loading: true
        });

        create('categories', {label: fields.title})
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/categories")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch((err) => {
                this.setState({
                    formValidationData: {form: "Unable To Create Category"},
                    loading: false,
                    isFormValid: false
                })
            });
    }

    render() {
        const {fields, loading, isFormValid, formValidationData } = this.state;

        return (
            <div>
                <header className="pageheader">
                    <h2>Create Category</h2>
                </header>

                <div className="row">
                    <div className="col-md-6">
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
                            </fieldset>
                            <button className="button" disabled={!isFormValid}>Create Category</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateCategory;