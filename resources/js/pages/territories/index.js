import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter } from "../../helpers/resource";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";

class Territories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            territories: [],
            regulations: [],
            filters: {},
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteTerritory = this.deleteTerritory.bind(this);
    }

    componentDidMount() {
        this.getData();

        read('regulations/', {})
            .then(res => {
                this.setState({
                    regulations: res.data.regulations,
                });
            })
            .catch(console.log);
    }

    getData() {
        read('territories', {})
            .then(res => {
                this.setState({
                    territories: res.data.territories,
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

    renderActions(territory) {
        return (
            <div className="actions">
                <Link className="ion-md-create" to={"/territories/edit/" + territory.id}
                    data-toggle="tooltip" title="Edit Territory" />
                <a className="ion-md-close" onClick={e => this.deleteTerritory(e, territory.id)}
                    data-toggle="tooltip" title="Delete Territory" />
            </div>
        );
    }

    deleteTerritory(e, ter) {
        if (confirm('Do you really want to delete this Territory?')) {
            remove('territories/'+ter, [])
            .then(res => {
                this.getData();
            })
            .catch(console.log);
        }
    }

    setfilter(value, key) {
        let { filters } = this.state;

        if (typeof value == 'string') {
            filters[key] = value;
        } else {
            filters[key] = value.target.value;
        }

        this.setState({ filters: filters });
    }


    render() {
        let { territories, regulations, filters, loader } = this.state;
        const columns = [
            {
                name: 'Name',
                cell: row => {
                    return <Link to={"/territories/edit/" + row.id}>{row.name}</Link>
                },
                selector: 'name',
                ignoreRowClick: true,
                sortable: true
            },
            {
                name: 'Regulation',
                selector: 'regulation.name',
                sortable: true
            },
            {
                name: 'Zip Codes',
                selector: 'zip_codes',
                sortable: true
            },
            {
                name: 'Actions',
                cell: this.renderActions,
                ignoreRowClick: true,
                width: '100px'
            }
        ];

        if (Object.keys(filters).length) {
            territories = filter(territories, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>Territories</h2>
                    <Link className="button" to={"/territories/create"}>Add New Territory</Link>
                </header>

                <div className="filter">
                    <input type="text" placeholder="Name" onChange={e => this.setfilter(e, "name")} />
                    <Select items={regulations} placeholder="Select Regulation" id={"id"} val={"name"} onChange={value => this.setfilter(value, "regulation.id")} />
                    <input type="text" placeholder="Zip Code" onChange={e => this.setfilter(e, "zip_codes")} />
                </div>

                <div className="tablewrap">
                    {!loader && territories
                        ? <DataTable columns={columns} data={territories} noHeader={true} pagination />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Territories;