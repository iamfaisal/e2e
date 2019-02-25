import React, {Component} from "react";
import { read, update } from "../../helpers/resource";

class EditCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category_id: props.match.params.category,
            category_label: "",
            loading: true
        };

        this.handleChange = this.handleChange.bind(this);
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

    handleChange(e) {
        console.log(e);
        this.setState({
            category_label: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        this.setState({
            loading: true
        });

        update('categories/'+this.state.category_id, this.state.category_label)
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
        const { categories, loader } = this.state;

        return (
            <div>
                <header>
                    <h2>Edit Category</h2>
                </header>

                <div className="row">
                    <div className="col-md-6">
                        <form className={this.state.loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                            <fieldset className="fields horizontal">
                                <label>
                                    <span>Title</span>
                                    <input
                                        type="text"
                                        placeholder="enter category title"
                                        value={this.state.category_label}
                                        onChange={this.handleChange}
                                    />
                                </label>
                            </fieldset>
                            <button className="button">Update Category</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditCategory;