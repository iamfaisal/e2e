import React, {Component} from "react";
import { create } from "../../helpers/resource";

class CreateCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category: "",
            loading: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        console.log(e);
        this.setState({
            category: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        this.setState({
            loading: true
        });

        create('categories', this.state.category)
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
                    <h2>Create Category</h2>
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
                                        onChange={this.handleChange}
                                    />
                                </label>
                            </fieldset>
                            <button className="button">Create Category</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateCategory;