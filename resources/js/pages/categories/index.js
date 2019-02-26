import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove } from "../../helpers/resource";

class Categories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    componentDidMount() {
        read('categories', [])
            .then(res => {
                this.setState({
                    categories: res.data.categories,
                    loader: false
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    loader: true
                });
            });
    }

    renderLoader() {
        return (
            <div className="loader"/>
        );
    }

    deleteCategory(e, cat) {
        const tr = e.target.parentNode.parentNode;
        if (confirm('Do you really want to delete this Category?')) {
            remove('categories/'+cat, [])
            .then(res => {
                tr.remove();
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    render() {
        const { categories, loader } = this.state;

        return (
            <div>
                <header>
                    <h2>Categories</h2>
                    <Link className="button" to={"/categories/create"}>Add New Category</Link>
                </header>

                <div className="tablewrap">
                    {!loader && categories ? (
                        <table>
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {categories.map((category) => {
                                return (
                                    <tr key={category.id}>
                                        <td>{category.label}</td>
                                        <td className="actions">
                                            <Link className="ion-md-create" to={"/categories/edit/"+category.id}/>
                                            <a className="ion-md-close" onClick={e => this.deleteCategory(e, category.id)}/>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    ) : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Categories;