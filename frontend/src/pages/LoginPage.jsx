import MakeUrl from "../util/makeUrl";
import {Link, useNavigate} from "react-router-dom";
import AuthHelper from "../util/AuthHelper";
import {useContext, useRef, useState} from "react";
import MySelfContext from "../contexts/MySelfContext";

function LoginPage() {
	let navigate = useNavigate();

	let email = useRef(null);
	let password = useRef(null);
	let [wrongCredential, setWrongCredential] = useState(false);

	const { setUser } = useContext(MySelfContext);

	const login = async (e) => {
		e.preventDefault();

		let url = MakeUrl("api/v1/login");
		console.log(email.current.value)
		await fetch(url, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: JSON.stringify({
				"email": email.current.value,
				"password": password.current.value
			})
		})
			.then(res=>res.json())
			.then(res => {
				if ( res.status == "success" ) {
					AuthHelper.setToken(res.token);
					setUser(res.user);
					navigate("/chat");
				} else {
					setWrongCredential(true);
				}
			});
	}
	return (
		<div className="container">
			<div className="row justify-content-center align-items-center" style={{minHeight: "100vh"}}>
				<div className="col-5">
					<div className="card shadow shadow-xl border rounded-0">
						<div className="card-body py-4 p-0 pt-0" style={{ background: "rgba(236,236,236,0.28)" }}>
							<h1 className="title text-white py-2 pl-3 mt-0 font-weight-bold  text-left bg-blue-500">Login</h1>
							<form onSubmit={login} action="/login" method="post" className="p-2">
								<div className="form-group">
									<label htmlFor="email" className=" text-dark">Email</label>
									<input ref={email} type="text" defaultValue="adi@das.com" id="email" name="email" placeholder="Email" className="form-control form-control-sm rounded-0" />
								</div>
								<div className="form-group mb-0">
									<label htmlFor="password" className=" text-dark">Password</label>
									<input ref={password} type="password" defaultValue="12345" id="password" name="password" placeholder="Password" className="form-control rounded-0 form-control-sm" />
								</div>
								<div className="my-0 mb-2">
									{
										wrongCredential ?? <small className="text-danger alert-warning">** Wrong Credentials</small>
									}
								</div>
								<button className="btn bg-blue-500 hover:bg-blue-800 text-white py-0 rounded-1" type="submit">Login</button>
								<Link to="/register" className="text-primary py-1 px-4 rounded-1">Create New Account</Link>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}


export default LoginPage;