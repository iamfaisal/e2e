import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import Courses from "./pages/courses";
import CreateCourse from "./pages/courses/create";
import EditCourse from "./pages/courses/edit";

import Territories from "./pages/territories";
import CreateTerritory from "./pages/territories/create";
import EditTerritory from "./pages/territories/edit";

import Regulations from "./pages/regulations";
import CreateRegulation from "./pages/regulations/create";
import EditRegulation from "./pages/regulations/edit";

import Categories from "./pages/categories";
import CreateCategory from "./pages/categories/create";
import EditCategory from "./pages/categories/edit";

import Admins from "./pages/admins";
import CreateAdmin from "./pages/admins/create";
import EditAdmin from "./pages/admins/edit";

import Venues from "./pages/venues";
import CreateVenue from "./pages/venues/create";
import EditVenue from "./pages/venues/edit";

import Classes from "./pages/classes";
import CreateClass from "./pages/classes/create";
import EditClass from "./pages/classes/edit";

import Sponsors from "./pages/sponsors";
import CreateSponsor from "./pages/sponsors/create";
import EditSponsor from "./pages/sponsors/edit";

import Instructors from "./pages/instructors";
import CreateInstructor from "./pages/instructors/create";
import EditInstructor from "./pages/instructors/edit";

import MyClasses from "./pages/my-classes";
import CreateMyClass from "./pages/my-classes/create";
import EditMyClass from "./pages/my-classes/edit";

import Materials from "./pages/materials";

import MyVenues from "./pages/my-venues";
import CreateMyVenue from "./pages/my-venues/create";
import EditMyVenue from "./pages/my-venues/edit";

import MySponsors from "./pages/my-sponsors";
import CreateMySponsor from "./pages/my-sponsors/create";
import EditMySponsor from "./pages/my-sponsors/edit";

import requireAuth from "./utils/requireAuth";

const routes = [
    {
        path: "/",
        component: requireAuth(Dashboard),
        exact: true
    },
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/forgot/password",
        component: ForgotPassword,
    },
    {
        path: "/password/reset/:token",
        component: ResetPassword,
    },
    {
        path: "/courses",
        component: requireAuth(Courses),
        exact: true
    },
    {
        path: "/courses/create",
        component: requireAuth(CreateCourse),
        exact: true
    },
    {
        path: "/courses/edit/:course",
        component: requireAuth(EditCourse),
        exact: true
    },
    {
        path: "/territories",
        component: requireAuth(Territories),
        exact: true
    },
    {
        path: "/territories/create",
        component: requireAuth(CreateTerritory),
        exact: true
    },
    {
        path: "/territories/edit/:territory",
        component: requireAuth(EditTerritory),
        exact: true
    },
    {
        path: "/regulations",
        component: requireAuth(Regulations),
        exact: true
    },
    {
        path: "/regulations/create",
        component: requireAuth(CreateRegulation),
        exact: true
    },
    {
        path: "/regulations/edit/:regulation",
        component: requireAuth(EditRegulation),
        exact: true
    },
    {
        path: "/categories",
        component: requireAuth(Categories),
        exact: true
    },
    {
        path: "/categories/create",
        component: requireAuth(CreateCategory),
        exact: true
    },
    {
        path: "/categories/edit/:category",
        component: requireAuth(EditCategory),
        exact: true
    },
    {
        path: "/users",
        component: requireAuth(Admins),
        exact: true
    },
    {
        path: "/users/create",
        component: requireAuth(CreateAdmin),
        exact: true
    },
    {
        path: "/users/edit/:category",
        component: requireAuth(EditAdmin),
        exact: true
    },
    {
        path: "/classes",
        component: requireAuth(Classes),
        exact: true
    },
    {
        path: "/classes/create",
        component: requireAuth(CreateClass),
        exact: true
    },
    {
        path: "/classes/edit/:class",
        component: requireAuth(EditClass),
        exact: true
    },
    {
        path: "/venues",
        component: requireAuth(Venues),
        exact: true
    },
    {
        path: "/venues/create",
        component: requireAuth(CreateVenue),
        exact: true
    },
    {
        path: "/venues/edit/:venue",
        component: requireAuth(EditVenue),
        exact: true
    },
    {
        path: "/sponsors",
        component: requireAuth(Sponsors),
        exact: true
    },
    {
        path: "/sponsors/create",
        component: requireAuth(CreateSponsor),
        exact: true
    },
    {
        path: "/sponsors/edit/:sponsor",
        component: requireAuth(EditSponsor),
        exact: true
    },
    {
        path: "/instructors",
        component: requireAuth(Instructors),
        exact: true
    },
    {
        path: "/instructors/create",
        component: requireAuth(CreateInstructor),
        exact: true
    },
    {
        path: "/instructors/edit/:instructor",
        component: requireAuth(EditInstructor),
        exact: true
    },
    {
        path: "/my-classes",
        component: requireAuth(MyClasses),
        exact: true
    },
    {
        path: "/my-classes/create",
        component: requireAuth(CreateMyClass),
        exact: true
    },
    {
        path: "/my-classes/edit/:class",
        component: requireAuth(EditMyClass),
        exact: true
    },
    {
        path: "/course-materials",
        component: requireAuth(Materials),
        exact: true
    },
    {
        path: "/my-venues",
        component: requireAuth(MyVenues),
        exact: true
    },
    {
        path: "/my-venues/create",
        component: requireAuth(CreateMyVenue),
        exact: true
    },
    {
        path: "/my-venues/edit/:venue",
        component: requireAuth(EditMyVenue),
        exact: true
    },
    {
        path: "/my-sponsors",
        component: requireAuth(MySponsors),
        exact: true
    },
    {
        path: "/my-sponsors/create",
        component: requireAuth(CreateMySponsor),
        exact: true
    },
    {
        path: "/my-sponsors/edit/:sponsor",
        component: requireAuth(EditMySponsor),
        exact: true
    },
]

export default routes