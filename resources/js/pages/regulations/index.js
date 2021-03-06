import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter } from "../../helpers/resource";
import DataTable from "react-data-table-component";

class Regulations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            regulations: [],
            filters: {},
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteRegulation = this.deleteRegulation.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({ loader: true });

        read('regulations', {})
            .then(res => {
                this.setState({
                    regulations: res.data.regulations,
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

    renderActions(regulation) {
        return (
            <div className="actions">
                <Link className="ion-md-create" to={"/regulations/edit/" + regulation.id}
                    data-toggle="tooltip" title="Edit State Regulation" />
                <a className="ion-md-close" onClick={e => this.deleteRegulation(e, regulation.id)}
                    data-toggle="tooltip" title="Delete State Regulation" />
            </div>
        );
    }

    deleteRegulation(e, reg) {
        if (confirm('Do you really want to delete this State Regulation?')) {
            remove('regulations/'+reg, {})
            .then(res => {
                this.getData();
            })
            .catch(console.log);
        }
    }

    setfilter(e, key) {
        let { filters } = this.state;
        filters[key] = e.target.value;
        this.setState({ filters: filters });
    }

    render() {
        let { regulations, filters, loader } = this.state;

        if (Object.keys(filters).length) {
            regulations = filter(regulations, filters);
        }

        const columns = [
            {
                name: 'Title',
                cell: row => <Link to={"/regulations/edit/" + row.id}>{row.name}</Link>,
                selector: 'name',
                ignoreRowClick: true,
                sortable: true
            },
            {
                name: 'Commission',
                selector: 'commission_name',
                sortable: true
            },
            {
                name: 'Actions',
                cell: this.renderActions,
                ignoreRowClick: true,
                width: '100px'
            }
        ];

        return (
            <div>
                <header className="pageheader">
                    <h2>State Regulations</h2>
                    <Link className="button" to={"/regulations/create"}>Add New State Regulation</Link>
                </header>

                <div className="filter">
                    <input type="text" placeholder="Title" onChange={e => this.setfilter(e, "name")} />
                    <input type="text" placeholder="Commission" onChange={e => this.setfilter(e, "commission_name")} />
                </div>

                <div className="tablewrap">
                    {!loader && regulations
                        ? <DataTable columns={columns} data={regulations} noHeader={true} pagination />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Regulations;