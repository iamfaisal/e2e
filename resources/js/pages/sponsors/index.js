import React, { Component } from "react";
import { Link } from "react-router-dom";
import { read, remove, filter, formatPhone } from "../../helpers/resource";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";

class Sponsors extends Component {
    constructor(props) {
        super(props);
 
        this.state = {
            sponsors: [],
            regulations: [],
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

        read('regulations', {}).then(res => {
            this.setState({
                regulations: res.data.regulations
            });
        }).catch(err => console.log(err));

        read('users/', { params: { role: "instructor" } })
            .then(res => {
                this.setState({
                    instructors: res.data.users
                });
            })
            .catch(err => console.log(err));
    }

    getData() {
        this.setState({loader: true});

        read('sponsors', {params: {role: 'admin'}})
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
                <Link className="ion-md-create" to={"/sponsors/edit/" + sponsor.id}
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
        let { sponsors, regulations, instructors, filters, loader } = this.state;

        const columns = [
            {
                name: 'Company',
                cell: row => {
                    return <Link to={"/sponsors/edit/" + row.id}>{row.company}</Link>
                },
                selector: 'company',
                ignoreRowClick: true,
                sortable: true
            },
            {
                name: 'Contact',
                cell: user => { return user.first_name + " " + user.last_name },
                selector: 'first_name',
                sortable: true,
                maxWidth: '160px'
            },
            {
                name: 'Address',
                cell: user => {
                    let address = user.address;
                    if (user.city) address += ", " + user.city;
                    if (user.state) address += ", " + user.state;
                    return address;
                },
                selector: 'address',
                sortable: true
            },
            {
                name: 'Email',
                selector: 'email',
                sortable: true,
                maxWidth: '160px'
            },
            {
                name: 'Phone',
                cell: user => formatPhone(user.phone),
                selector: 'phone',
                sortable: true,
                maxWidth: '120px'
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
                    <Link className="button" to={"/sponsors/create"}>Create New Sponsor</Link>
                </header>

                <div className="filter">
                    <input type="text" placeholder="Search Sponsors" onChange={e => this.setfilter(e, "email")} />
                    <Select items={regulations} placeholder="Select State" id={"id"} val={"name"} onChange={value => this.setfilter(value, "regulation_id")} />
                    <Select items={instructors} placeholder="Select Instructor" id="id" val="name" onChange={value => this.setfilter("=" + value, "user_id")} />
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

export default Sponsors;