import React, {Component} from "react";
import { asset, getuser, getUserRegulations } from "../../helpers/app";
import { read, filter } from "../../helpers/resource";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";

class WorkshopMaterials extends Component {
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

        getUserRegulations().then(regs => {
            this.setState({ regulations: regs });
        });

        read('users/' + getuser().id, {}).then(console.log);
    }

    getData() {
        this.setState({ loader: true });

        read('materials', { params: { workshop: 1 } }).then(res => {
            this.setState({
                materials: res.data.courses,
                loader: false
            });
        }).catch(console.log);
    }

    renderLoader() {
        return <div className="loader"/>
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
                name: 'Materials',
                cell: row => {
                    return <div className="material_actions">
                        <a href={asset(row.class_flyer_template)} target="_blank">WS Flyer Template</a>
                        &nbsp;|&nbsp;
                        <a href={asset(row.material)} target="_blank">WS Teaching Kit</a>
                    </div>
                },
                ignoreRowClick: true,
                right: true
            }
        ];

        if (Object.keys(filters).length) {
            materials = filter(materials, filters);
        }

        return (
            <div>
                <header className="pageheader">
                    <h2>Workshop Material Library</h2>
                </header>

                <div className="filter">
                    <Select items={regulations} placeholder="Select State" id={"id"} val={"name"} onChange={value => this.setfilter(value, "regulation.id")} />
                    <input type="text" placeholder="Search Workshop Title" onChange={e => this.setfilter(e, "title")} />
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

export default WorkshopMaterials;