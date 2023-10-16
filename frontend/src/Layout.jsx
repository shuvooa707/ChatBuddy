import {Outlet, Link, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import MySelfContext from "./contexts/MySelfContext";
import AuthHelper from "./util/AuthHelper";
import InitiateNewChat from "./components/chat/InitiateNewChat";

const Layout = () => {
	const navigate = useNavigate();

	const [myself, setMyself] = useState({"id" : -1 });
	const [showInitiateNewChat, setShowInitiateNewChat] = useState(false);

	const {user} = useContext(MySelfContext);
	useEffect(()=>{
		setMyself(user);
	},[user]);
	const logout = () => {
		alert("logout");
		AuthHelper.removeToken();
		window.location = "/login";
		// navigate("/login");
	}

	return (
		<>
			{
				showInitiateNewChat && <InitiateNewChat setShowInitiateNewChat={setShowInitiateNewChat} />
			}
			<nav className={"d-flex justify-content-between pl-5 align-items-center"} id={"navbar"}>
				<Link className={"d-flex justify-content-around align-items-center"} to={"/profile"} style={{ minWidth: "150px", textDecoration: "unset", color: "black" }}>
					<img src={ myself.image } alt="avatar" style={{ width: "40px", borderRadius: "50%", float: "left" }} />
					<h6  className="mb-0 pb-0 mt-1 text-white">{ myself.name }</h6>
				</Link>
				<div>
					<button onClick={()=>setShowInitiateNewChat(true)} className="border-white btn bg-blue-500 hover:bg-blue-800 rounded-1 py-0 px-1 text-white">
						<i className="fa fa-plus"></i> New
					</button>
				</div>
				<Link>
					<div className="col-lg-6 hidden-sm text-right">
						<Link href="#" onClick={()=>{ logout() }} className="btn text-white">
							<i className="fa fa-sign-out"></i>
						</Link>
					</div>
				</Link>
			</nav>
			<Outlet />
		</>
	)
};

export default Layout;
