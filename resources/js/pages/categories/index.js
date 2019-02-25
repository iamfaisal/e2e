import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read } from "../../helpers/resource";

class Categories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
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

    render() {
        const { categories, loader } = this.state;

        return (
            <div>
                <header>
                    <h2>Categories</h2>
                    <Link className="button" to={"/categories/create/"}>Add New Category</Link>
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
                                        <td>{category.title}</td>
                                        <td className="actions">
                                            <Link className="ion-md-create" to={""}/>
                                            <Link className="ion-md-close" to={""}/>
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