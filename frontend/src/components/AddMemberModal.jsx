import {useEffect, useRef, useState} from "react";
import makeUrl from "../util/makeUrl";
import AuthHelper from "../util/AuthHelper";
import toast, {Toaster} from "react-hot-toast";

function AddMemberModal({ toggleShowAddMemberModal, openedConversation }) {
	let [ users, setUsers ] = useState([]);
	let inputField = useRef();

	const fetchUsers = async e => {
		let inputValue = inputField.current.value;

		if ( !inputValue.length || !openedConversation ) {
			setUsers([]);
			return;
		}
		let url = makeUrl("api/v1/search-users-add-conversation");
		const token = AuthHelper.getToken();
		const payload = JSON.stringify({
			"token": token,
			"conversationId": openedConversation.id,
			"input": inputValue
		});
		let res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				"token": token
			},
			body: payload
		}).then(res => res.json());

		if ( res.status == "success" ) {
			setUsers(res.users);
		}
	}

	const addMember = async userId => {
		let url = makeUrl("api/v1/add-member");
		const token = AuthHelper.getToken();
		const payload = JSON.stringify({
			"token": token,
			"conversationId": openedConversation.id,
			"userId": userId
		});
		document.querySelector("#add-member-panel #overlay").classList.remove("hide");
		let res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				"token": token
			},
			body: payload
		}).then(res => res.json());
		document.querySelector("#add-member-panel #overlay").classList.add("hide");

		if ( res.status == "success" ) {
			window.dispatchEvent( new CustomEvent("ADD_MEMBER_EVENT", {"detail" : { "conversation": res.conversation }} ) );
			//toggleShowAddMemberModal(false);

			toast.success('Member Added',{
				position: 'bottom-left',
			});

			await fetchUsers(null);
		} else {
			toast.error('Member Not Added',{
				position: 'bottom-left',
			})
		}
	}

	return (
		<div id="add-member-container">
			<Toaster  toastOptions={{
					className: '',
					style: {
						border: '1px solid #713200',
						padding: '16px',
						color: '#713200',
						marginBottom: '100px'
					},
				}}
			/>
			<div id="add-member-panel">
				<div id="overlay" className="hide"></div>
				<div className={"py-2 bg-dark px-2 d-flex justify-content-between align-items-center text-white"} style={{ borderBlock: "1px solid grey"}}>
					<strong className="pl-4 text-white">
						Add Member
					</strong>
					<h5>
						<i style={{ cursor: "pointer" }} className="fa fa-times p-2 text-white" onClick={()=>toggleShowAddMemberModal(false)}></i>
					</h5>
				</div>
				<div className="d-block text-white p-3 pt-0">
					<div className="p-2">
						<div className="">
							<label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Name</label>
							<input ref={inputField} onInput={fetchUsers} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="@John" required />
						</div>
					</div>
					<ul className="list-unstyled chat-list mt-2 mb-0" style={{ maxHeight: "480px", overflow: "hidden", overflowY: "auto" }}>
						{
							users
								.map((user,i)=>{
									return (
										<li key={i} className="text-white p-2" style={{ borderBottom: "1px solid #aaa", }}>
											<div className="d-flex justify-content-between">
												<div className="d-flex">
													<img className="mx-2" src={user.image} style={{ width:"30px", height: "30px" }} alt=""/>
													<strong>{ user.name }</strong>
												</div>
												<div className="text-right">
													<small onClick={() => addMember(user.id) } className="btn bg-blue-700 hover:bg-green-700 p-1 py-0 mx-1 rounded-1 text-white bg-blue-500">
														ADD <i className="fa fa-plus-circle" aria-hidden="true"></i>
													</small>
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
	)
}


export default AddMemberModal;