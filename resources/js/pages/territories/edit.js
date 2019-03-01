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
            fields: {
                name: "",
                regulation: "",
                zip_codes: ""
            },
            required_fields: {
                name: "",
            },
            regulations: [],
            formValidationData: {},
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeRegulation = this.changeRegulation.bind(this);
    }

    componentDidMount() {
        const { id } = this.state;

        read('territories/'+id, [])
            .then(res => {
                this.setState({
                    fields: res.data.territory,
                    loading: false
                });
            })
            .catch((err) => {
                console.log(err);
            });

        read('regulations/', [])
            .then(res => {
                this.setState({
                    regulations: res.data.regulations,
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
        fields.regulation = value;
        this.setState({
            fields: fields
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const { id, fields, isFormValid, category } = this.state;

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
            .catch((err) => {
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
        const { fields, regulations, loading, isFormValid, formValidationData } = this.state;

        if (!fields.name) return false;

        return (
            <div>
                <header className="pageheader">
                    <h2>Edit Territory</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}
                    <fieldset className="fields horizontal">
                        <TextField
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            name="name"
                            value={fields.name}
                            required={true}
                            labelText="Name"
                            validation={[validations.isEmpty]}
                        />
                        <label>
                            <span>Regulation</span>
                            <Select
                                onChange={this.changeRegulation}
                                items={regulations}
                                id={"id"}
                                val={"name"}
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
                        />
                    </fieldset>

                    <button className="button" disabled={!isFormValid}>Update Territory</button>
                </form>
            </div>
        );
    }
}

export default EditTerritory;