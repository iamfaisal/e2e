import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove } from "../../helpers/resource";
import DataTable from "react-data-table-component";

class Territories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            territories: [],
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteTerritory = this.deleteTerritory.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        read('territories', [])
            .then(res => {
                this.setState({
                    territories: res.data.territories,
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

    renderActions(territory) {
        return (
            <div className="actions">
                <Link className="ion-md-create" to={"/territories/edit/" + territory.id} />
                <a className="ion-md-close" onClick={e => this.deleteTerritory(e, territory.id)} />
            </div>
        );
    }

    deleteTerritory(e, ter) {
        if (confirm('Do you really want to delete this Territory?')) {
            remove('territories/'+ter, [])
            .then(res => {
                this.getData();
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    render() {
        const { territories, loader } = this.state;
        const columns = [
            {
                name: 'Name',
                selector: 'name',
                sortable: true,
            },
            {
                name: 'Regulation',
                selector: 'regulation.name',
                sortable: true,
            },
            {
                name: 'Zip Codes',
                selector: 'zip_codes',
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
                <header className="pageheader">
                    <h2>Territories</h2>
                    <Link className="button" to={"/territories/create"}>Add New Territory</Link>
                </header>

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