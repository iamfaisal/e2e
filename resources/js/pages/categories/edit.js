import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read } from "../../helpers/resource";

class EditCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category: props.match.params.category,
            loading: true
        };
    }

    componentDidMount() {
        read('categories/'+this.state.category, [])
            .then(res => {
                console.log(res);
                this.setState({
                    category: res.data.courses,
                    loader: false
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
                        <form className={this.state.loading ? "loading" : ""}>
                            <fieldset className="fields horizontal">
                                <label>
                                    <span>Title</span>
                                    <input type="text" placeholder="enter category title" />
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

export default EditCategory;