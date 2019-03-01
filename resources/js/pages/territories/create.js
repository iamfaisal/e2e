import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import Select from "../../common/Select";
import { read, create } from "../../helpers/resource";

class CreateTerritory extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
            isFormValid: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeRegulation = this.changeRegulation.bind(this);
    }

    componentDidMount() {
        read('regulations/', [])
            .then(res => {
                let { regulations } = res.data;
                let { fields } = this.state;
                if (regulations) {
                    fields.regulation = regulations[0].id;
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
        fields.regulation = value;
        this.setState({
            fields: fields
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const { fields, isFormValid, category } = this.state;

        if (!isFormValid) return;
        
        this.setState({
            loading: true
        });

        create('territories', fields)
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
                formValidationData.form = "Unable To Create Territory";
                this.setState({
                    formValidationData: formValidationData,
                    loading: false,
                    isFormValid: false
                })
            });
    }

    render() {
        const { fields, regulations, loading, isFormValid, formValidationData } = this.state;

        return (
            <div>
                <header className="pageheader">
                    <h2>Create Territory</h2>
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

                    <button className="button" disabled={!isFormValid}>Create Territory</button>
                </form>
            </div>
        );
    }
}

export default CreateTerritory;