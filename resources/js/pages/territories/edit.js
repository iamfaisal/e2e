import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import { read, update } from "../../helpers/resource";

class EditTerritory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.territory,
            loading: false,
            loaded: false,
            fields: {
                name: "",
                regulation: "",
                zip_codes: ""
            },
            required_fields: {
                name: "",
                zip_codes: ""
            },
            regulations: [],
            formValidationData: {},
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { id } = this.state;

        read('territories/'+id, {})
            .then(res => {
                this.setState({
                    fields: res.data.territory,
                    loaded: true
                });
            })
            .catch(console.log);

        read('regulations/', {})
            .then(res => {
                this.setState({
                    regulations: res.data.regulations,
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

        const { id, fields, isFormValid } = this.state;

        if (!isFormValid) return;
        
        this.setState({
            loading: true
        });

        fields["_method"] = "PUT";

        update('territories/'+id, fields)
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/territories")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch(err => {
                let { formValidationData } = this.state;
                formValidationData.form = "Unable To Update Territory";
                this.setState({
                    formValidationData: formValidationData,
                    loading: false,
                    isFormValid: false
                })
            });
    }

    render() {
        const { loaded, fields, regulations, loading, isFormValid, formValidationData } = this.state;

        if (!loaded) return false;

        return (
            <div>
                <header className="pageheader">
                    <h2>Edit Territory</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            name="name"
                            value={fields.name}
                            labelText="Name"
                            required={true}
                            validation={[validations.isEmpty]}
                        />
                        <label>
                            <span>Regulation</span>
                            <Select
                                onChange={this.handleChange}
                                items={regulations}
                                name="regulation"
                                id="id"
                                val="name"
                                value={fields.regulation_id}
                            />
                        </label>
                    </fieldset>

                    <fieldset className="fields horizontal">
                        <TextField
                            onChange={this.handleChange}
                            name="zip_codes"
                            value={fields.zip_codes}
                            labelText="Zip Codes"
                            required={true}
                            validation={[validations.isEmpty]}
                        />
                    </fieldset>

                    <button className="button" disabled={!isFormValid}>Update Territory</button>
                </form>
            </div>
        );
    }
}

export default EditTerritory;