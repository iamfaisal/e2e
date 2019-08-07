import React, {Component} from "react";
import { Link } from "react-router-dom";
import { read, remove, filter, formatDate } from "../../helpers/resource";
import Select from "../../common/Select";
import DataTable from "react-data-table-component";

class CoursesWorkshops extends Component {
	constructor(props) {
		super(props);

		this.state = {
			courses: [],
			regulations: [],
			filters: {
				is_deleted: "0"
			},
			loader: true
		};

		this.renderLoader = this.renderLoader.bind(this);
		this.renderActions = this.renderActions.bind(this);
		this.deleteCourse = this.deleteCourse.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	getData() {
		this.setState({ loader: true });

		read('courses', { params: { workshop: 1 } })
			.then(res => {
				this.setState({
					courses: res.data.courses,
					regulations: res.data.regulations,
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
		return <div className="loader"/>
	}

	renderActions(course) {
		const archived = course.is_deleted == "1";

		return <div className="actions">
			<Link className="ion-md-create" to={"/courses/edit/" + course.id + "?ws"} data-toggle="tooltip" title="Edit Workshop" />
			{!archived && <a className="ion-md-close" onClick={e => this.deleteCourse(e, course.id)} data-toggle="tooltip" title="Archive Workshop" />}
			{archived && <a className="ion-md-refresh" onClick={e => this.deleteCourse(e, course.id)} data-toggle="tooltip" title="Unarchive Workshop" />}
		</div>
	}

	renderCategories(course) {
		let categories = [];
		course.categories.map((category) => {
			categories.push(category.label);
		});
		return categories.join(", ");
	}

	deleteCourse(e, course) {
		if (confirm('Do you really want to archive this Workshop?')) {
			remove('courses/' + course, {})
				.then(res => {
					this.getData();
				})
				.catch(err => {
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

	toggleArchived(e) {
		let { filters } = this.state;
		filters["is_deleted"] = "0";
		if (e.target.checked) filters["is_deleted"] = "1";
		this.setState({ filters: filters });
	}

	render() {
		let { courses } = this.state;
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
				cell: row => {
					return <Link to={"/courses/edit/" + row.id + "?ws"}>{row.title}</Link>
				},
				selector: 'title',
				ignoreRowClick: true,
				sortable: true
			},
			{
				name: 'Category',
				cell: row => this.renderCategories(row),
				sortable: true,
				maxWidth: '150px'
			},
			{
				name: 'Length',
				cell: row => {
					let output = "";
					let hours = (row.hours / 60).toString().split('.')[0];
					let minutes = row.hours % 60;
					if (hours >= 1) output += hours + (hours >= 2 ? " Hours" : " Hour");
					if (minutes >= 1) output += " " + minutes + (minutes >= 2 ? " Minutes" : " Minute");
					return output;
				},
				selector: 'hours',
				sortable: true,
				maxWidth: '120px'
			},
			{
				name: 'Actions',
				cell: this.renderActions,
				ignoreRowClick: true,
				width: '100px',
			}
		];

		if (Object.keys(filters).length) {
			courses = filter(courses, filters);
		}

		return <div>
			<header className="pageheader">
				<h2>Workshops</h2>
				<Link className="button" to={"/courses/create?ws"}>Add New Workshop</Link>
			</header>

			<div className="filter">
				<Select items={regulations} placeholder="Select State" id={"id"} val={"name"} onChange={value => this.setfilter(value, "regulation.id")} />
				<input type="text" placeholder="Search Workshop Code" onChange={e => this.setfilter(e, "code")} />

				<br />

				<label className="checkbox">
					<input type="checkbox" onChange={e => this.toggleArchived(e)} />
					<span>Archived Workshops</span>
				</label>
			</div>

			<div className="tablewrap">
				{!loader && courses
					? <DataTable columns={columns} data={courses} noHeader={true} pagination />
					: this.renderLoader()}
			</div>
		</div>
	}
}

export default CoursesWorkshops;