import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter } from "../../helpers/resource";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";

class Venues extends Component {
    constructor(props) {
        super(props);

        this.state = {
            venues: [],
            instructors: [],
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

        read('users/', { params: { role: "instructor" } })
            .then(res => {
                this.setState({
                    instructors: res.data.users
                });
            })
            .catch(console.log);

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

        read('venues')
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
                <Link className="ion-md-create" to={"/venues/edit/" + venue.id}
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
        let { venues, instructors, regulations, filters, loader } = this.state;

        if (!instructors.length) return false;

        const columns = [
            {
                name: 'Venue Name',
                cell: row => {
                    return <Link to={"/venues/edit/" + row.id}>{row.name}</Link>
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
                sortable: true,
            },
            {
                name: 'Instructor',
                cell: venue => {
                    let names = [];
                    const ids = venue.users.split(",");
                    let users = instructors.filter(instructor => ids.indexOf(instructor.id+"") > -1);
                    users.map(user => names.push(user.name));
                    return names.join(", ");
                },
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
                    <Link className="button" to={"/venues/create"}>Create New Venue</Link>
                </header>

                <div className="filter">
                    <input type="text" placeholder="Search Venues" onChange={e => this.setfilter(e, "name")} />
                    <Select items={instructors} placeholder="Select Instructors" id="id" val="name" onChange={value => this.setfilter("="+value, "users")} />
                    <Select items={regulations} placeholder="Select State" id={"id"} val={"name"} onChange={value => this.setfilter("=" + value, "regulation.id")} />
                </div>

                <div className="tablewrap">
                    {!loader && venues
                        ? <DataTable columns={columns} data={venues} defaultSortField="name" noHeader={true} pagination />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Venues;