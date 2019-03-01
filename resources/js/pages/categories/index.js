import React, {Component, Fragment} from "react";
import { Link } from "react-router-dom";
import { read, remove } from "../../helpers/resource";
import DataTable from "react-data-table-component";

class Categories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            loader: true,
            filters: {}
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
        this.filter = this.filter.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({loader: true});

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

    filter(e, key) {
        let { categories, filters } = this.state;
        filters[key] = e.target.value;

        let filtered = categories.filter(cat => {
            let ok = false;
            for (let filter in filters) {
                if (filters[filter] == '' || cat[filter].search(filters[filter]) > -1) ok = true;
            }
            return ok;
        });

        this.setState({
            //categories: filtered,
            filters: filters
        });
    }

    setfilter(e, key) {
        let { filters } = this.state;
        filters[key] = e.target.value;
        this.setState({filters: filters});
    }

    filter(data, filters) {
        return data.filter(item => {
            let ok = false;
            for (let filter in filters) {
                if (filters[filter] == '' || item[filter].search(filters[filter]) > -1) ok = true;
            }
            return ok;
        });
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
            categories = this.filter(categories, filters);
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