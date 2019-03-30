import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import { read, update } from "../../helpers/resource";

class EditCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.category,
            loading: false,
            loaded: false,
            fields: {
                title: ""
            },
            formValidationData: {},
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { id } = this.state;
        read('categories/'+id, {})
            .then(res => {
                let { fields } = this.state;
                fields.title = res.data.category.label;
                this.setState({
                    fields: fields,
                    loaded: true
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
        let { formValidationData, fields } = this.state;

        let isFormValid = true;
        for (let key in fields) {
            if (!formValidationData[key]) {
                isFormValid = false;
            }
        }
        this.setState({ isFormValid: isFormValid });
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

        const { id, fields, isFormValid } = this.state;

        if (!isFormValid) return;
        
        this.setState({
            loading: true
        });

        update("categories/"+id, {
            label: fields.title,
            _method: "PUT"
        })
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/categories")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch(err => {
                let { formValidationData } = this.state;
                formValidationData.form = "Unable To Update Category";
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
                    <h2>Edit Category</h2>
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
                            <button className="button" disabled={!isFormValid}>Update Category</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditCategory;