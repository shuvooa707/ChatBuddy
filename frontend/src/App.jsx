import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./Layout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ProfilePage from "./pages/ProfilePage";
import {useEffect, useState} from "react";
import MySelfContext from "./contexts/MySelfContext";
import makeUrl from "./util/makeUrl";
import AuthHelper from "./util/AuthHelper";

function App() {

	const [user, setUser] = useState({ id: Number.MIN_SAFE_INTEGER });
	useEffect( ()=>{
		let url = makeUrl("api/v1/get-myself-data");
		let token = AuthHelper.getToken();

		fetch(url, {
			headers: {
				"Content-Type": "application/json",
				"token": token
			},
			method: "POST",
			body: JSON.stringify({
				"token": token
			})
		})
		.then(res=>res.json())
		.then(res => {
			if ( res.status == "success" ) {
				setUser(res.user);
			}
		}).catch(err=>{
			console.log(err)
		})
	},[]);



	return (
		<MySelfContext.Provider value={{ user, setUser }}>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<HomePage />} />
				<Route path="/register" element={<RegisterPage />} />

				<Route element={<Layout />}>
					<Route element={<ProtectedRoutes />}>
						<Route path="chat" element={<ChatPage />} />
						<Route path="profile" element={<ProfilePage />} />
					</Route>
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</Routes>
		</MySelfContext.Provider>
	);
}

export default App
