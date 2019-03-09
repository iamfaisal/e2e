import React, {Component, Fragment} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter } from "../../helpers/resource";
import DataTable from "react-data-table-component";

class MyVenues extends Component {
    constructor(props) {
        super(props);

        this.state = {
            venues: [],
            filters: {},
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteVenue = this.deleteVenue.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({loader: true});

        read('venues', {params: {fromInstructor: true}})
            .then(res => {
                this.setState({
                    venues: res.data.venues,
                    loader: false
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    renderLoader() {
        return (
            <div className="loader"/>
        );
    }

    renderActions(venue) {
        return (
            <div className="actions">
                <Link className="ion-md-create" to={"/my-venues/edit/" + venue.id} />
                <a className="ion-md-close" onClick={e => this.deleteVenue(e, venue.id)} />
            </div>
        );
    }

    deleteVenue(e, venue) {
        if (confirm('Do you really want to delete this Venue?')) {
            remove('venues/' + venue, {})
            .then(res => {
                this.getData();
            })
            .catch((err) => {
                console.log(err);
            });
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
        let { venues, filters, loader } = this.state;
        const columns = [
            {
                name: 'Name',
                selector: 'name',
                sortable: true,
                maxWidth: '200px'
            },
            {
                name: 'Address',
                cell: venue => { return [venue.address, venue.city, venue.regulation.name + " " + venue.zip_code].join(", ") },
                sortable: true,
            },
            {
                name: 'Actions',
                cell: venue => this.renderActions(venue),
                ignoreRowClick: true,
                width: '100px'
            }
        ];

        if (Object.keys(filters).length) {
            venues = filter(venues, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>Venues</h2>
                    <Link className="button" to={"/my-venues/create"}>Add New Venue</Link>
                </header>

                <div className="filter">
                    <input type="text" placeholder="Search Sponsors" onChange={e => this.setfilter(e, "name")} />
                </div>

                <div className="tablewrap">
                    {!loader && venues
                        ? <DataTable columns={columns} data={venues} noHeader={true} pagination />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default MyVenues;