import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove } from "../../helpers/resource";

class Territories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            territories: [],
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.deleteTerritory = this.deleteTerritory.bind(this);
    }

    componentDidMount() {
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

    deleteTerritory(e, ter) {
        const tr = e.target.parentNode.parentNode;
        if (confirm('Do you really want to delete this Territory?')) {
            remove('territories/'+ter, [])
            .then(res => {
                tr.remove();
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    render() {
        const { territories, loader } = this.state;

        return (
            <div>
                <header className="pageheader">
                    <h2>Territories</h2>
                    <Link className="button" to={"/territories/create"}>Add New Territory</Link>
                </header>

                <div className="tablewrap">
                    {!loader && territories ? (
                        <table>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Regulation</th>
                                <th>Zip Codes</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {territories.map((territory) => {
                                return (
                                    <tr key={territory.id}>
                                        <td>{territory.name}</td>
                                        <td>{territory.regulation.name}</td>
                                        <td>{territory.zip_codes}</td>
                                        <td className="actions">
                                            <Link className="ion-md-create" to={"/territories/edit/"+territory.id}/>
                                            <a className="ion-md-close" onClick={e => this.deleteTerritory(e, territory.id)}/>
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

export default Territories;