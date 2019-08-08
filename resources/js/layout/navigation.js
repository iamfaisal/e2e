export const links = [
	// super admin
	{
		name: "CE Courses",
		url: "/courses",
		icon: "ion-ios-filing",
		role: "system"
	},
	{
		name: "Workshops",
		url: "/courses/workshops",
		icon: "ion-ios-filing",
		role: "system"
	},
	{
		name: "Territories",
		url: "/territories",
		icon: "ion-ios-globe",
		role: "system"
	},
	{
		name: "State Regulations",
		url: "/regulations",
		icon: "ion-ios-hand",
		role: "system"
	},
	{
		name: "Categories",
		url: "/categories",
		icon: "ion-ios-bookmark",
		role: "system"
	},
	{
		name: "School Admins",
		url: "/users",
		icon: "ion-ios-people",
		role: "system"
	},
	// school admin
	{
		name: "CE Classes",
		url: "/classes",
		icon: "ion-ios-albums",
		role: "admin"
	},
	{
		name: "Workshops",
		url: "/classes/workshops",
		icon: "ion-ios-albums",
		role: "admin"
	},
	{
		name: "Venues",
		url: "/venues",
		icon: "ion-ios-flag",
		role: "admin"
	},
	{
		name: "Sponsors",
		url: "/sponsors",
		icon: "ion-ios-people",
		role: "admin"
	},
	{
		name: "Instructors",
		url: "/instructors",
		icon: "ion-ios-people",
		role: "admin"
	},
	// instructor
	{
		name: "CE Classes",
		url: "/my-classes",
		icon: "ion-ios-albums",
		role: "instructor"
	},
	{
		name: "Workshops",
		url: "/my-classes/workshops",
		icon: "ion-ios-albums",
		role: "instructor"
	},
	{
		name: "Materials",
		url: "/course-materials",
		icon: "ion-ios-briefcase",
		role: "instructor",
		enable: "user.courses.length",
		menu: [{
			name: "CE Courses",
			url: "/course-materials",
			enable: "user.courses.length"
		}, {
			name: "Workshops",
			url: "/workshop-materials"
		}]
	},
	{
		name: "Venues",
		url: "/my-venues",
		icon: "ion-ios-flag",
		role: "instructor"
	},
	{
		name: "Sponsors",
		url: "/my-sponsors",
		icon: "ion-ios-people",
		role: "instructor"
	},
	// student
	{
		name: "Classes",
		url: "/student-classes",
		icon: "ion-ios-albums",
		role: "student"
	}
];

export default links;