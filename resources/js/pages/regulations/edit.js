import React, {Component} from "react";
import { validations } from "../../utils/validations";
import TextField from "../../common/TextField";
import { read, update } from "../../helpers/resource";

class EditRegulation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category_id: props.match.params.category,
            category_label: "",
            loading: true,
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        read('categories/'+this.state.category_id, [])
            .then(res => {
                this.setState({
                    category_label: res.data.category.label,
                    loading: false
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleChange(value) {
        this.setState({
            category_label: value
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

        update('regulations/'+this.state.category_id, this.state.category_label)
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
                    <h2>Edit Regulation</h2>
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
                            <button className="button" disabled={!isFormValid}>Update Regulation</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditRegulation;