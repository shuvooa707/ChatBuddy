import {Link, useNavigate} from "react-router-dom";

function HomePage() {
	const navigate = useNavigate();

	return (
		<>
			<html lang="en">
				<head>
					<meta charset="UTF-8"/>
					<title>Welcome</title>

					{/**** Import Bootstrap CSS From CDN *****/}
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous"/>
				</head>
				<body>
					<div class="container">
					<div class="row justify-content-center align-items-center" style="min-height: 100vh;">
						<div class="col-5">
							<div class="card shadow-sm border rounded-0">
								<div class="card-body text-center py-4" style="background: rgba(236,236,236,0.28);">
									<h1 class="title">Molly Chat</h1>
									<br/>
									<Link to="/login" class="btn btn-primary py-1 px-4 rounded-1">Sign In</Link>
									<Link to="/register" class="btn bg-dark text-white py-1 px-4 rounded-1">Sign Up</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

					{/****** Import Bootstrap JS From CDN *******/}
					<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossorigin="anonymous"></script>
				</body>
			</html>
		</>
	)
}


export default HomePage;