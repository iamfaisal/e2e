import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove } from "../../helpers/resource";
import DataTable from "react-data-table-component";

class Regulations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            regulations: [],
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

        read('regulations', [])
            .then(res => {
                this.setState({
                    regulations: res.data.regulations,
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

    renderActions(regulation) {
        return (
            <div className="actions">
                <Link className="ion-md-create" to={"/regulations/edit/" + regulation.id} />
                <a className="ion-md-close" onClick={e => this.deleteRegulation(e, regulation.id)} />
            </div>
        );
    }

    deleteRegulation(e, reg) {
        if (confirm('Do you really want to delete this Regulation?')) {
            remove('regulations/'+reg, [])
            .then(res => {
                this.getData();
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    render() {
        const { regulations, loader } = this.state;

        const columns = [
            {
                name: 'Title',
                selector: 'name',
                sortable: true,
            },
            {
                name: 'Commission',
                selector: 'commission_name',
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
                    <h2>Regulations</h2>
                    <Link className="button" to={"/regulations/create"}>Add New Regulation</Link>
                </header>

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