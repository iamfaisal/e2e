import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter } from "../../helpers/resource";
import DataTable from "react-data-table-component";

class Categories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            filters: {},
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({loader: true});

        read('categories', {})
            .then(res => {
                this.setState({
                    categories: res.data.categories,
                    loader: false
                });
            })
            .catch(err => {
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

    renderActions(category) {
        return (
            <div className="actions">
                <Link className="ion-md-create" to={"/categories/edit/" + category.id} />
                <a className="ion-md-close" onClick={e => this.deleteCategory(e, category.id)} />
            </div>
        );
    }

    deleteCategory(e, cat) {
        if (confirm('Do you really want to delete this Category?')) {
            remove('categories/'+cat, {})
            .then(res => {
                this.getData();
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    setfilter(e, key) {
        let { filters } = this.state;
        filters[key] = e.target.value;
        this.setState({filters: filters});
    }

    render() {
        let { categories, filters, loader } = this.state;
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

        if (Object.keys(filters).length) {
            categories = filter(categories, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>Categories</h2>
                    <Link className="button" to={"/categories/create"}>Add New Category</Link>
                </header>

                <div className="filter">
                    <input type="text" placeholder="Search Categories" onChange={e => this.setfilter(e, "label")} />
                </div>

                <div className="tablewrap">
                    {!loader && categories
                        ? <DataTable columns={columns} data={categories} noHeader={true} pagination />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Categories;