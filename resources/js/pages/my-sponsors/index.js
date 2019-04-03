import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter } from "../../helpers/resource";
import DataTable from "react-data-table-component";

class MySponsors extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sponsors: [],
            instructors: [],
            filters: {},
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteSponsor = this.deleteSponsor.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({loader: true});

        read('sponsors', { params: { fromInstructor: true } })
            .then(res => {
                this.setState({
                    sponsors: res.data.sponsors,
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

    renderActions(sponsor) {
        return (
            <div className="actions">
                <Link className="ion-md-create" to={"/my-sponsors/edit/" + sponsor.id}
                    data-toggle="tooltip" title="Edit Sponsor" />
                <a className="ion-md-close" onClick={e => this.deleteSponsor(e, sponsor.id)}
                    data-toggle="tooltip" title="Delete Sponsor" />
            </div>
        );
    }

    deleteSponsor(e, sponsor) {
        if (confirm('Do you really want to delete this Sponsor?')) {
            remove('sponsors/' + sponsor, {})
            .then(res => {
                this.getData();
            })
            .catch(err => console.log(err));
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
        let { sponsors, filters, loader } = this.state;
        const columns = [
            {
                name: 'Name',
                cell: user => { return user.first_name + " " + user.last_name },
                sortable: true,
                maxWidth: '200px'
            },
            {
                name: 'Email',
                selector: 'email',
                sortable: true,
            },
            {
                name: 'Company',
                selector: 'company',
                sortable: true,
            },
            {
                name: 'Actions',
                cell: user => this.renderActions(user),
                ignoreRowClick: true,
                width: '100px'
            }
        ];

        if (Object.keys(filters).length) {
            sponsors = filter(sponsors, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>Sponsors</h2>
                    <Link className="button" to={"/my-sponsors/create"}>Add New Sponsor</Link>
                </header>

                <div className="filter">
                    <input type="text" placeholder="Search Sponsors" onChange={e => this.setfilter(e, "email")} />
                </div>

                <div className="tablewrap">
                    {!loader && sponsors
                        ? <DataTable columns={columns} data={sponsors} noHeader={true} pagination />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default MySponsors;