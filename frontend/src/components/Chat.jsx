import {useContext, useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import AuthHelper from "../util/AuthHelper";
import MySelfContext from "../contexts/MySelfContext";
import makeUrl from "../util/makeUrl";

function Chat({setOpenedConversation, conversations, toggleShowGroupMembers, toggleShowAddMemberModal, toggleChatPageSettings }) {
	let [ messages, setMessages ] = useState([]);
	const [ chattingWith, setChattingWith ] = useState({});

	const [ myself, setMyself ] = useState({ "id" : -1 });
	const [ conversation, setConversation ] = useState(null);
	const [ socket, setSocket ] = useState(null);
	const [ socketReconnect, setSocketReconnect ] = useState(1);

	const navigate = useNavigate();

	const newMessageInputField = useRef(null);

	const {user} = useContext(MySelfContext);

	/********************************************/
	/******** Event Attachment useEffect ********/
	/********************************************/
	useEffect(() => {
		window.addEventListener("OPEN_CONVERSATION_EVENT", (e) => {
			console.info("Event Emitted::OPEN_CONVERSATION_EVENT")
			let conversation = e.detail.conversation;
			setConversation(conversation);
			if (conversation) {
				getMessages(conversation).then(r => {
					setTimeout(()=>{
						scrollToBottom(".chat-history");
					},100)
				});
			}
		});
	}, []);

	useEffect(()=>{
		setMyself(user);
	},[user]);


	/********************************************/
	/******** Socket Attachment useEffect ********/
	/********************************************/
	useEffect(() => {

		const pushNewMessage = newMessage => {
			setMessages(messages => [...messages, newMessage]);
			setTimeout(() => scrollToBottom(".chat-history"),0)
		}
		const testing = data => {
			console.info(data);
		}
		if (conversation) {
			let url = makeUrl("");
			let token = AuthHelper.getToken();

			const socket = io(url, {
				query: {
					token: token,
					conversation_id: conversation.id
				}
			});

			socket.on('connect', () => {
				setSocket(socket);
				console.log('Connected to Conversation::' + conversation.id);
			});
			socket.on('disconnect', () => {
				setSocket(null);
				console.log('Socket disconnected');
				console.log('Trying to reconnect....');
				setSocketReconnect(socketReconnect+1);
			});
			socket.on("new message", pushNewMessage);
			socket.on('testing', testing);

			return () => {
				socket.off('connect', () => {
					setSocket(socket);
					console.log('Connected to Conversation::' + conversation.id);
				});
				socket.off('disconnect', () => {
					setSocket(null);
					console.log('Socket disconnected');
				});
				socket.off("new message", pushNewMessage);
				socket.off('testing', testing);
			}
		}
	}, [conversation, socketReconnect]);


	const getMessages = async conversation => {
		let url = makeUrl("api/v1/get-messages");
		let payload  = new FormData();
		payload.append("conversation", JSON.stringify(conversation));
		let token = AuthHelper.getToken();

		await fetch(url, {
			headers: {
				"Content-type": "application/json",
				"token": token
			},
			method: "POST",
			body:  JSON.stringify({ "conversation": conversation })
		})
		.then(res => res.json())
		.then(res => {
			if ( res.status == "success" ) {
				setMessages(res.messages.reverse());
				//console.log(messages)
			}
			else if( res.status == "failed" ) {
				if ( res.error == "unauthorized" ) {
					navigate("/login");
				}
			}
		});
	}

	const sendMessage = async e => {
		if ( e.type != "click" && !(e.code == "Enter" && !e.shiftKey) ) {
			return;
		}
		let url = makeUrl("api/v1/send-message");
		const token = AuthHelper.getToken();
		const payload = JSON.stringify({
			"token": token,
			"conversation_id": conversation.id,
			"sender_id": myself.id,
			"message": newMessageInputField.current.value
		});

		await fetch(url, {
			headers: {
				"Content-type": "application/json",
				"token": token
			},
			method: "POST",
			body:  payload
		})
		.then(res => res.json())
		.then(res => {
			if ( res.status == "success" ) {
				//setMessages([...messages, res.message]);
				newMessageInputField.current.value = "";
				setTimeout(()=>{
					document.querySelector(".chat-history").scrollTo(0, 100000);
				},10);
			}
			else if( res.status == "failed" ) {
				if ( res.error == "unauthorized" ) {
					navigate("/login");
				}
			}
		});
	}

	// helper functions
	function otherMember() {
		if ( !conversation ) return {};
		if ( conversation.conversation_members[0].user.id == myself.id ) {
			return conversation.conversation_members[1].user;
		}
		return conversation.conversation_members[0].user;
	}

	const scrollToBottom = (element = "#body") => {
		console.log("scrollToBottom");
		let chatHistory = document.querySelector(element);
		chatHistory?.scrollBy(0, chatHistory.scrollHeight);
	}

	return (
		<>
			<div className="chat">
				{
					!conversation
					&&
					<div id="no-user-selected-overlay">
						<h1 className="mt-5 text-center">
							Select Conversation
						</h1>
					</div>
				}

				{/* Chat Header Section */}
				<div className="chat-header clearfix" >
					<div className="row">
						<div className="col-lg-6">
							<div className="chat-about">
								<h6 className="mb-0 pb-0 mt-1 text-white">
									{
										conversation?.conversation_members.length > 2 ?
											(
												<div className="d-flex">
													<div onClick={ () => toggleShowGroupMembers(true) } className={"d-block cursor-pointer"} style={{ minWidth: "156px" }}>
														<strong className="mb-2 text-start d-block badge white pl-0 ml-0">
															{ conversation.name }
														</strong>
														{
															conversation
																.conversation_members
																.slice(0, 4)
																.map((cm,i)=>{
																	return (
																		<>
																			<img src={cm.user.image} style={{ transform: `translateX(-${30*i}%)`, width:"30px", height: "30px", borderRadius: "50px", border: "2px solid white", outline: "1px solid #eee" }} key={i} />
																		</>
																	)
																})
														}
														<span style={{  transform: `translateX(-${30*2}%)`, minWidth: "30px", height: "30px", display: "inline-block" }}>
															+<small style={{fontSize: ".8em"}}>{ conversation.conversation_members.length }</small>
														</span>
													</div>
													<div>
														<small onClick={ () => toggleShowAddMemberModal(true) } className="bg-green-500 hover:bg-green-800 cursor-pointer border border-white badge text-white">
															+ Add Member
														</small>
													</div>
												</div>
											)
											:
											(
												<div className="d-flex align-items-center">
													<img className="mx-2" src={otherMember()?.image ?? ""} style={{ width:"50px", borderRadius: "50%" }} />
													<small>{ otherMember()?.name ?? ""}</small>
												</div>
											)
									}
								</h6>
								{/*<small className="text-dark">Last seen: 2 hours ago</small>*/}
							</div>
						</div>
						<div className="col-lg-6 hidden-sm text-right text-white">
							<a href="#" onClick={ () => toggleChatPageSettings(true) } className="btn">
								<i className="fa fa-gear text-white"></i>
							</a>
						</div>
					</div>
				</div>
				{/* End Chat Header Section */}

				<div className="chat-history">
					<ul className="m-b-0">
						{
							messages
								.map((message,i)=>{
								return (
									message?.sender?.id == myself.id ?
										<li key={i} className="clearfix">
											<div className="message-data text-right">
												<span className="message-data-time">
													{ message.created_at }
												</span>
											</div>
											<div className="message my-message float-right">
												{ message.message }
											</div>
										</li>
										:
										<li key={i} className="clearfix" >
											<div className="message-data ">
												<span className="message-data-time">
													{ message.created_at }
												</span>
												<span>
													{ message?.sender?.name }
												</span>
												<img src={chattingWith.image} />
											</div>

											<div className="message other-message ">
												{ message.message }
											</div>
										</li>
								)
							})
						}
					</ul>
				</div>
				<div className="chat-message clearfix">
					<div className="input-group mb-0">
						<textarea id="new-chat-input-field" rows={1} ref={newMessageInputField} onKeyPress={sendMessage} type="text" className="form-control text-white" placeholder="Type Message and Enter...">
						</textarea>
						<div className="input-group-append">
							<button className="input-group-text bg-primary cursor-pointer text-white" onClick={sendMessage}>
								<i className="fa fa-send text-white"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}




export default Chat;