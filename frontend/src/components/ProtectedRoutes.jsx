import AuthHelper from "../util/AuthHelper";
import {Navigate, Outlet} from "react-router-dom";

function ProtectedRoutes() {
	let token = AuthHelper.getToken();
	if (!token) {
		return <Navigate to="/login" replace />;
	}
	return <Outlet />;
}

export default ProtectedRoutes;