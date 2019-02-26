import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import { create } from "../../helpers/resource";

class CreateCategory extends Component {
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

        const { isFormValid, category } = this.state;
        if (!isFormValid) return;
        console.log(category);
        
        this.setState({
            loading: true
        });

        create('categories', {label: category})
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/categories")
                    : this.setState({isFormValid: false});
            })
            .catch((err) => {
                this.setState({isFormValid: false})
            });
    }

    render() {
        const {loader, isFormValid } = this.state;

        return (
            <div>
                <header>
                    <h2>Create Category</h2>
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
                            <button className="button" disabled={!isFormValid}>Create Category</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateCategory;