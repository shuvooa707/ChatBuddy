import MakeUrl from "../util/makeUrl";
import {Link, useNavigate} from "react-router-dom";
import AuthHelper from "../util/AuthHelper";
import {useContext, useRef, useState} from "react";
import MySelfContext from "../contexts/MySelfContext";

function RegisterPage() {
	let navigate = useNavigate();

	let name = useRef(null);
	let image = useRef(null);
	let dob = useRef(null);
	let email = useRef(null);
	let username = useRef(null);
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
					<div className="card shadow-sm border rounded-0">
						<div className="card-body py-4" style={{ background: "rgba(236,236,236,0.28)" }}>
							<h1 className="title">Create Account</h1>
							<form onSubmit={login} action="/login" method="post">
								<div className="form-group">
									<label htmlFor="name">Full Name</label>
									<input ref={name} type="text" id="name" name="name" placeholder="Name" className="form-control form-control-sm rounded-0" />
								</div>
								<div className="form-group">
									<label htmlFor="username">@username</label>
									<input ref={username} type="text" id="username" name="username" placeholder="User Name" className="form-control form-control-sm rounded-0" />
								</div>
								<div className="form-group">
									<label htmlFor="email">Avatar</label>
									<input ref={image} type="file" id="image" name="image" placeholder="Image" className="form-control form-control-sm rounded-0" />
								</div>
								<div className="form-group">
									<label htmlFor="email">Date Of Birth</label>
									<input ref={dob} type="date" id="dob" name="dob" placeholder="Date of Birth" className="form-control form-control-sm rounded-0" />
								</div>
								<div className="form-group">
									<label htmlFor="email">Email</label>
									<input ref={email} type="text" defaultValue="adi@das.com" id="email" name="email" placeholder="Email" className="form-control form-control-sm rounded-0" />
								</div>
								<div className="form-group mb-0">
									<label htmlFor="password">Password</label>
									<input ref={password} type="password" defaultValue="12345" id="password" name="password" placeholder="Password" className="form-control rounded-0 form-control-sm" />
								</div>
								<div className="my-0 mb-2">
									{
										wrongCredential ?? <small className="text-danger alert-warning">** Wrong Credentials</small>
									}
								</div>
								<button className="btn btn-warning py-0 rounded-0" type="submit">register</button>
								<Link to="/login" className="text-primary py-1 px-4 rounded-1">Login</Link>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}


export default RegisterPage;