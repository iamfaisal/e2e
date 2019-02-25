import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Courses from "./pages/courses";

import Categories from "./pages/categories";
import CreateCategory from "./pages/categories/create";
import EditCategory from "./pages/categories/edit";

import requireAuth from "./utils/requireAuth";

const routes = [
    {
        path: "/",
        component: requireAuth(Dashboard),
        exact: true
    },
    {
        path: "/user/profile",
        component: requireAuth(Profile),
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
        path: "/categories",
        component: requireAuth(Categories),
        exact: true
    },
    {
        path: "/categories/create/",
        component: requireAuth(CreateCategory),
        exact: true
    },
    {
        path: "/categories/edit/",
        component: requireAuth(EditCategory),
        exact: true
    }
]

export default routes