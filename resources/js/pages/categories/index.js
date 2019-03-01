import React, {Component, Fragment} from "react";
import { Link } from "react-router-dom";
import { read, remove } from "../../helpers/resource";
import DataTable from "react-data-table-component";

class Categories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
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

    renderActions(category) {
        return(
            <Fragment>
                <Link className="ion-md-create" to={"/categories/edit/"+category.id}/>
                <a className="ion-md-close" onClick={e => this.deleteCategory(e, category.id)}/>
            </Fragment>
        );
    }

    render() {
        const { categories, loader } = this.state;
        const columns = [
            {
                name: 'Title',
                selector: 'label',
                sortable: true,
            },
            {
                name: 'Actions',
                cell: row => this.renderActions(row),
                ignoreRowClick: true,
                width: '100px',
            }
        ];

        return (
            <div>
                <header>
                    <h2>Categories</h2>
                    <Link className="button" to={"/categories/create"}>Add New Category</Link>
                </header>

                <div className="tablewrap">
                    {!loader && categories
                        ? <DataTable columns={columns} data={categories} pagination />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Categories;