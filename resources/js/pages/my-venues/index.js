import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter } from "../../helpers/resource";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";

class MyVenues extends Component {
    constructor(props) {
        super(props);

        this.state = {
            venues: [],
            regulations: [],
            filters: {},
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.deleteVenue = this.deleteVenue.bind(this);
    }

    componentDidMount() {
        this.getData();

        read('regulations', {})
            .then(res => {
                this.setState({
                    regulations: res.data.regulations
                });
            })
            .catch(console.log);
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
            .catch(console.log);
    }

    renderLoader() {
        return (
            <div className="loader"/>
        );
    }

    renderActions(venue) {
        return (
            <div className="actions">
                <Link className="ion-md-create" to={"/my-venues/edit/" + venue.id}
                    data-toggle="tooltip" title="Edit Venue" />
                <a className="ion-md-close" onClick={e => this.deleteVenue(e, venue.id)}
                    data-toggle="tooltip" title="Delete Venue" />
            </div>
        );
    }

    deleteVenue(e, venue) {
        if (confirm('Do you really want to delete this Venue?')) {
            remove('venues/' + venue, {})
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
        let { venues, regulations, filters, loader } = this.state;
        const columns = [
            {
                name: 'Venue Name',
                cell: row => {
                    return <Link to={"/my-venues/edit/" + row.id}>{row.name}</Link>
                },
                selector: "name",
                ignoreRowClick: true,
                sortable: true,
                maxWidth: '200px'
            },
            {
                name: 'Address',
                cell: venue => { return [venue.address, venue.city, venue.regulation.name + " " + venue.zip_code].join(", ") },
                selector: "address",
                sortable: true
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
                    <Link className="button" to={"/my-venues/create"}>Create New Venue</Link>
                </header>

                <div className="filter">
                    <input type="text" placeholder="Search Venues" onChange={e => this.setfilter(e, "name")} />
                    <Select items={regulations} placeholder="Select State" id={"id"} val={"name"} onChange={value => this.setfilter("="+value, "regulation.id")} />
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