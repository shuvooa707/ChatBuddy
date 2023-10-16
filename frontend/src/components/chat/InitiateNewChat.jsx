import {useContext, useEffect, useRef, useState} from "react";
import makeUrl from "../../util/makeUrl";
import AuthHelper from "../../util/AuthHelper";
import MySelfContext from "../../contexts/MySelfContext";

function InitiateNewChat({setShowInitiateNewChat}) {
	const [users, setUsers] = useState([]);
	const inputField = useRef();
	const [myself, setMyself] = useState({});

	const {user} = useContext(MySelfContext);
	useEffect(() => {
		setMyself(user);
	}, [user])

	const searchUser = async e => {
		// let inputValue = inputField.current.value;

		if (!inputField.current.value.length) {
			setUsers([]);
			return;
		}
		let url = makeUrl("api/v1/chat/search-user");
		const token = AuthHelper.getToken();
		const payload = JSON.stringify({
			"token": token,
			"input": inputField.current.value,
			"myselfId": myself.id
		});
		await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				"token": token
			},
			body: payload
		})
			.then(res => res.json())
			.then(res => {
				if (res.status == "success") {
					setUsers(res.users);
				}
			});
	}

	const initChat = async user => {
		let url = makeUrl("api/v1/chat/initiate");
		const token = AuthHelper.getToken();
		const payload = JSON.stringify({
			"token": token,
			"userId": user.id
		});
		await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				"Accepts": "application/json",
				"token": token
			},
			body: payload
		})
		.then(res => res.json())
		.then(res => {
			if (res.status == "success") {
				window.dispatchEvent( new CustomEvent("CREATED_NEW_CONVERSATION", { "detail" : { "conversation": res.conversation } } ));
				setShowInitiateNewChat(false);
			} else {

			}
		});
	}

	return (
		<>
			<div id="initiate-new-chat-container" className="">
				<div id="initiate-new-chat-body">
					<div className="card">
						<div className="d-flex justify-content-between align-items-center rounded-0 card-header bg-blue-500 text-white">
							<strong>Initiate New Chat</strong>
							<i onClick={() => setShowInitiateNewChat(false)} className="fa fa-times cursor-pointer"></i>
						</div>
						<div className="card-body bg-black">
							<div>
								<div className="p-2">
									<div className="">
										<label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter User Name</label>
										<input ref={inputField} onInput={searchUser} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-1 focus:border-0 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="@John" required/>
									</div>
									<div className="d-block text-white p-0 pt-0">
										<ul className="list-unstyled chat-list mt-2 mb-0" style={{
											maxHeight: "480px",
											overflow: "hidden",
											overflowY: "auto"
										}}>
											{
												users.map((user, i) => {
													return (
														<li key={i} className="text-white p-2" style={{borderBottom: "1px solid #aaa",}}>
															<div className="d-flex justify-content-between">
																<div className="d-flex">
																	<img className="mx-2" src={user.image} style={{
																		width: "30px",
																		height: "30px"
																	}}/>
																	<small>{user.name}</small>
																</div>
																<div>
																	<button onClick={() => initChat(user) } className="hover:bg-blue-700 btn bg-blue-500 text-white py-0 px-1 rounded-1">
																		<i className="fa fa-comments" aria-hidden="true"></i> message
																	</button>
																</div>
															</div>
														</li>
													)
												})
											}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default InitiateNewChat;