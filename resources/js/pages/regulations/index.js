import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove } from "../../helpers/resource";

class Regulations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            regulations: [],
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.deleteRegulation = this.deleteRegulation.bind(this);
    }

    componentDidMount() {
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

    deleteRegulation(e, reg) {
        const tr = e.target.parentNode.parentNode;
        if (confirm('Do you really want to delete this Regulation?')) {
            remove('regulations/'+reg, [])
            .then(res => {
                tr.remove();
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    render() {
        const { regulations, loader } = this.state;

        return (
            <div>
                <header>
                    <h2>Regulations</h2>
                    <Link className="button" to={"/regulations/create"}>Add New Regulation</Link>
                </header>

                <div className="tablewrap">
                    {!loader && regulations ? (
                        <table>
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Commission</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {regulations.map((regulation) => {
                                return (
                                    <tr key={regulation.id}>
                                        <td>{regulation.name}</td>
                                        <td>{regulation.commission_name}</td>
                                        <td className="actions">
                                            <Link className="ion-md-create" to={"/regulations/edit/"+regulation.id}/>
                                            <a className="ion-md-close" onClick={e => this.deleteRegulation(e, category.id)}/>
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

export default Regulations;