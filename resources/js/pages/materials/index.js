import React, {Component} from "react";
import { read, filter } from "../../helpers/resource";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";

class Materials extends Component {
    constructor(props) {
        super(props);

        this.state = {
            materials: [],
            regulations: [],
            filters: {},
            loader: true
        };

        this.renderLoader = this.renderLoader.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({ loader: true });

        read('materials', {})
            .then(res => {
                console.log(res.data);
                this.setState({
                    materials: res.data.courses,
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
        let { materials } = this.state;
        const { filters, regulations, loader } = this.state;
        const columns = [
            {
                name: 'Code',
                selector: 'code',
                sortable: true,
                maxWidth: '100px'
            },
            {
                name: 'Title',
                selector: 'title',
                sortable: true
            },
            {
                name: 'State',
                selector: 'regulation.abbreviation',
                sortable: true,
            },
            {
                name: 'Material',
                cell: row => {
                    return <div className="material_actions">
                        <a href={row.class_flyer_template} target="_blank">Flyer</a>
                        &nbsp;|&nbsp;
                        <a href={row.material} target="_blank">Material</a>
                    </div>
                },
                ignoreRowClick: true,
                maxWidth: '120px'
            }
        ];

        if (Object.keys(filters).length) {
            materials = filter(materials, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>Course Materials</h2>
                </header>

                <div className="filter">
                    <Select items={regulations} placeholder="Select Regulation" id={"id"} val={"name"} onChange={value => this.setfilter(value, "regulation.id")} />
                    <input type="text" placeholder="Course Code" onChange={e => this.setfilter(e, "code")} />
                </div>

                <div className="tablewrap">
                    {!loader && materials
                        ? <DataTable columns={columns} data={materials} noHeader={true} pagination />
                        : this.renderLoader()}
                </div>
            </div>
        );
    }
}

export default Materials;