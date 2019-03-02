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
    }
]

export default routes