import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import { create } from "../../helpers/resource";

class CreateRegulation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category: "",
            loading: false,
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(value) {
        this.setState({
            category: value
        });
    }

    handleBlur(field) {
        this.setState({isFormValid: field.value});
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!isFormValid) return;
        
        this.setState({
            loading: true
        });

        create('regulations', this.state.category)
            .then(res => {
                this.setState({
                    loading: false
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        const {loader, isFormValid } = this.state;

        return (
            <div>
                <header>
                    <h2>Create Regulation</h2>
                </header>

                <div className="row">
                    <div className="col-md-6">
                        <form className={this.state.loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                            <fieldset className="fields horizontal">
                                <TextField
                                    onBlur={this.handleBlur}
                                    onChange={this.handleChange}
                                    name="title"
                                    value={this.state.category}
                                    required={true}
                                    labelText="Title"
                                    validation={[validations.isEmpty]}
                                />
                            </fieldset>
                            <button className="button" disabled={!isFormValid}>Create Regulation</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateRegulation;