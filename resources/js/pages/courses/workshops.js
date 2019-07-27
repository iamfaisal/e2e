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

		read('courses', {})
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
			<Link className="ion-md-create" to={"/courses/edit/" + course.id} data-toggle="tooltip" title="Edit Course" />
			{!archived && <a className="ion-md-close" onClick={e => this.deleteCourse(e, course.id)} data-toggle="tooltip" title="Archive Course" />}
			{archived && <a className="ion-md-refresh" onClick={e => this.deleteCourse(e, course.id)} data-toggle="tooltip" title="Unarchive Course" />}
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
		if (confirm('Do you really want to archive this Course?')) {
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
					return <Link to={"/courses/edit/" + row.id}>{row.title}</Link>
				},
				selector: 'title',
				ignoreRowClick: true,
				sortable: true
			},
			{
				name: 'State',
				selector: 'regulation.abbreviation',
				sortable: true,
				maxWidth: '50px'
			},
			{
				name: 'Course #',
				selector: 'number',
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
				cell: row => (row.hours+"").replace(".00", ""),
				selector: 'hours',
				sortable: true,
				maxWidth: '50px'
			},
			{
				name: 'Expiration',
				cell: row => formatDate(row.expiration_date, true),
				selector: 'expiration_date',
				sortable: true,
				maxWidth: '120px'
			},
			{
				name: 'Actions',
				cell: row => this.renderActions(row),
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
				<Link className="button" to={"/courses/create"}>Add New Workshop</Link>
			</header>

			<div className="filter">
				<Select items={regulations} placeholder="Select State" id={"id"} val={"name"} onChange={value => this.setfilter(value, "regulation.id")} />
				<input type="text" placeholder="Search Course Code" onChange={e => this.setfilter(e, "code")} />

				<br />

				<label className="checkbox">
					<input type="checkbox" onChange={e => this.toggleArchived(e)} />
					<span>Archived CE Courses</span>
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