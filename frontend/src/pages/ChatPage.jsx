import {useContext, useEffect, useRef, useState} from "react";
import makeUrl from "../util/makeUrl";
import AuthHelper from "../util/AuthHelper";
import ConversationList from "../components/ConversationList";
import Chat from "../components/Chat";
import {useNavigate} from "react-router-dom";
import ShowGroupMembersModal from "../components/ShowGroupMembersModal";
import AddMemberModal from "../components/AddMemberModal";
import toast, { Toaster } from 'react-hot-toast';


function ChatPage() {
	const navigate = useNavigate();
	const [ conversations, setConversations ] = useState([]);

	const [ openedConversation, setOpenedConversation] = useState(null);

	useEffect(()=>{
		loadSiteData()
			.then(r =>{})
			.catch(err => console.error(err));
	},[]);

	const loadSiteData = async () => {
		let url = makeUrl("api/v1/load-chat-data");
		console.log(window.API_URL)
		let payload = new FormData();
		let token = AuthHelper.getToken();
		if (!token) {
			window.location = "http://localhost:3000/login";
		}
		await fetch(url, {
			headers: {
				"Accepts": "application/json",
				"token": token
			},
			method: "POST",
			body: payload
		})
			.then(res => res.json())
			.then(res => {
				if ( res.status == "success" ) {
					setConversations(res.conversations);
				} else if( res.error == "unauthorized" ) {
					navigate("/login");
				}
			});
	}

	const getConversations = async () => {
		let url = makeUrl("api/v1/conversation/get-convesations");
		let payload = new FormData();
		let token = AuthHelper.getToken();
		if (!token) {
			window.location = "http://localhost:3000/login";
		}
		return await fetch(url, {
			headers: {
				"Accepts": "application/json",
				"token": token
			},
			method: "POST",
			body: payload
		})
		.then(res => res.json())
		.then(res => res.conversations);
	}

	const [showChatPageSettings, toggleChatPageSettings] = useState(false);
	const [showGroupMembers, toggleShowGroupMembers] = useState(false);
	const [showAddMemberModal, toggleShowAddMemberModal] = useState(false);


	/********************************************/
	/******** Event Attachment useEffect ********/
	/********************************************/
	useEffect(() => {
		window.addEventListener("ADD_MEMBER_EVENT", (e) => {
			console.log("Event Emitted::ADD_MEMBER_EVENT")
			loadSiteData()
				.then(r =>{})
				.catch(err => console.error(err));
		});
		window.addEventListener("CREATED_NEW_CONVERSATION", async e => {
			console.log("Event Emitted::CREATED_NEW_CONVERSATION");
			let conversationId = e.detail.conversation.id;
			let conversations = await getConversations();
			setConversations(conversations);
			let conversationToOpen = conversations.find(c => {
				if ( c.id == conversationId ) return true;

				return false;
			});

			setOpenedConversation(conversationToOpen);
			window.dispatchEvent( new CustomEvent("OPEN_CONVERSATION_EVENT", { "detail" : { "conversation": conversationToOpen }} ) );
		});
	}, [conversations]);

	return (
		<>
			{
				showGroupMembers && <ShowGroupMembersModal openedConversation={openedConversation} toggleShowGroupMembers={toggleShowGroupMembers} />
			}
			{
				showAddMemberModal && <AddMemberModal openedConversation={openedConversation} toggleShowAddMemberModal={toggleShowAddMemberModal} />
			}
			<div className="container main-container" style={{ minHeight: "100%", height: "100%" }}>
				<div className="row clearfix">
					<div className="col-lg-12">
						<div className="card chat-app rounded-0">

							{/* Contact List */}
							<ConversationList
								openedConversation={openedConversation}
								setOpenedConversation={setOpenedConversation}
								conversations={conversations}
							/>
							{/* End Contact List */}

							{/* Chat */}
							<Chat
								conversations={conversations}
								setOpenedConversation={setOpenedConversation}
								toggleShowAddMemberModal={toggleShowAddMemberModal}
								toggleShowGroupMembers={toggleShowGroupMembers}
								toggleChatPageSettings={toggleChatPageSettings}
							/>
							{/* End Chat */}

						</div>
					</div>
				</div>
				{
					showChatPageSettings && <ChatPageSettings conversationId={openedConversation.id} setConversations={setConversations} toggleChatPageSettings={toggleChatPageSettings} />
				}
			</div>
		</>
	)
}



function ChatPageSettings({ toggleChatPageSettings, conversationId, setConversations }) {
	const navigate = useNavigate();
	const conversationName = useRef(null);
	const updateConversationName =  async () => {
		let url = makeUrl("api/v1/update-conversation-name");

		let payload = {
			"conversationId": conversationId,
			"conversationName": conversationName.current.value
		}

		let token = AuthHelper.getToken();
		if (!token) {
			navigate("/login");
		}
		await fetch(url, {
			headers: {
				"Accepts": "application/json",
				"Content-type": "application/json",
				"token": token
			},
			method: "POST",
			body: JSON.stringify(payload)
		})
			.then(res => res.json())
			.then(res => {
				if ( res.status == "success" ) {
					setConversations(res.conversations);
					toast.success('Name Updated',{
						position: 'bottom-left',
					})
				} else if( res.error == "unauthorized" ) {
					navigate("/login");
				} else {
					toast.error('Name Not Updated',{
						position: 'bottom-left',
					})
				}
			});
	}
	return (
		<>
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
			<div className={"container"} id="char-page-settings-container" style={{ background: "black", border: "1px solid rgb(108, 108, 108)", color: "white", }}>
				<div className="row py-2" style={{ background: "#202020", alignItems: "center", borderBottom: "1px solid rgb(108, 108, 108)" }}>
					<div className="col-lg-10 d-flex justify-content-between">
						<strong className="badge p-2" style={{ background: "black", color: "white" }}>Settings</strong>
					</div>
					<div className="col-lg-2 text-right">
						<i style={{ cursor: "pointer" }} className="fa fa-times p-2" onClick={()=>toggleChatPageSettings(false)}></i>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-8 underline-offset-1 p-5">

						<table className="table-auto w-100">
							<tbody>
								<tr className="">
									<td>
										<div>
											<label htmlFor="group_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">GROUP NAME</label>
											<input ref={conversationName} type="text" id="group_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Group Name" required />
										</div>
									</td>
									<td className="px-3">
										<div>
											<label className="block mb-2 text-sm font-medium text-transparent dark:text-transparent">|</label>
											<button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" onClick={updateConversationName}>UPDATE</button>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}

export default ChatPage;