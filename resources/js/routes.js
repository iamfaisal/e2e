import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Dashboard from "./pages/Dashboard";

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
    }
]

export default routes