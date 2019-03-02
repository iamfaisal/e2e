import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import { read, update } from "../../helpers/resource";

class EditAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.category,
            loading: false,
            fields: {
                user: ""
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
        read('users/'+id, [])
            .then(res => {
                let { fields } = this.state;
                fields.user = res.data.user;
                fields.user.profile = res.data.profile;
                fields.user.roles = res.data.roles;
                this.setState({
                    fields: fields,
                    loading: false
                });
            })
            .catch((err) => {
                console.log(err);
            });
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
            .catch((err) => {
                this.setState({
                    formValidationData: {form: "Unable To Update Category"},
                    loading: false,
                    isFormValid: false
                })
            });
    }

    render() {
        const {fields, loading, isFormValid, formValidationData } = this.state;

        if (fields.title === "") return false;

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
                                    onBlur={this.handleBlur}
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

export default EditAdmin;