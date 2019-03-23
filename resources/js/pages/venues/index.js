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
            .catch(err => {
                console.log(err);
            });
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
            .catch(err => {
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
                <Link className="ion-md-create" to={"/venues/edit/" + venue.id} />
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
        let { venues, instructors, filters, loader } = this.state;
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
                name: 'Instructor',
                cell: venue => { return venue.user.name },
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
                    <Link className="button" to={"/venues/create"}>Add New Venue</Link>
                </header>

                <div className="filter">
                    <input type="text" placeholder="Search Sponsors" onChange={e => this.setfilter(e, "name")} />
                    <Select items={instructors} placeholder="Select Instructors" id={"name"} val={"name"} onChange={value => this.setfilter(value, "user.name")} />
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

export default Venues;