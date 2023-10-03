import {useEffect, useState} from "react";

function Chat() {
	const [ messages, setMessages ] = useState([
		{ "id": 1, "userid": 1, "message": "How do you do?", "created_at": "10:10 AM, Today " },
		{ "id": 2, "userid": 1, "message": "How do you do?", "created_at": "10:10 AM, Today " },
		{ "id": 3, "userid": 543, "message": "How do you do?", "created_at": "10:10 AM, Today " },
		{ "id": 4, "userid": 543, "message": "How do you do?", "created_at": "10:10 AM, Today " },
		{ "id": 5, "userid": 1, "message": "How do you do?", "created_at": "10:10 AM, Today " },
		{ "id": 6, "userid": 1, "message": "How do you do?", "created_at": "10:10 AM, Today " },
		{ "id": 7, "userid": 543, "message": "How do you do?", "created_at": "10:10 AM, Today " },
	]);
	const [ chattingWith, setChattingWith] = useState(
		{ "id": 1, "name": "Vincent Porter", "image": "https://bootdey.com/img/Content/avatar/avatar1.png", "status": "online" },
	);

	const [user, setUser] = useState({"id" : 543 });


	useEffect(() => {
		window.addEventListener("OPEN_CONTACT_EVENT", (e) => {
			let contact = e.detail.contact;
			getMessages(contact);
		});
	}, []);


	const getMessages = async (contact) => {
		let url = null;
		if ( window.API_URL ) {
			url = window.API_URL + "/get-messages";
		} else {
			url = window.origin + "/get-messages";
		}
		let payload  = new FormData();
		payload.append("contact", JSON.stringify(contact));

		await fetch(url, {
			headers: {
				"Content-type": "application/json"
			},
			method: "POST",
			body:  JSON.stringify({"contact": contact})
		})
		.then(res => res.json())
		.then(res => {
			console.log(res);
			if ( res.status == "success" ) {
				setMessages(res.messages);
				setUser(res.receiver);
			}
			else if( res.status == "failed" ) {
				if ( res.error == "unauthorized" ) {
					window.location = "/login";
				}
			}
		});
	}

	return (
		<div className="chat">
			<div className="chat-header clearfix" >
				<div className="row">
					<div className="col-lg-6">
						<a href="#" data-toggle="modal" data-target="#view_info">
							<img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar" />
						</a>
						<div className="chat-about">
							<h6 className="mb-0 pb-0 mt-1">Aiden Chavez</h6>
							{/*<small className="text-dark">Last seen: 2 hours ago</small>*/}
						</div>
					</div>
					<div className="col-lg-6 hidden-sm text-right">
						<a href="#" onClick={()=>{ window.location = window.location.origin + "/logout" }} className="btn">
							<i className="fa fa-sign-out"></i>
						</a>
					</div>
				</div>
			</div>
			<div className="chat-history">
				<ul className="m-b-0">
					{
						messages.map((message,i)=>{
							return (
								message.userid == user.id ?
									<li key={i} className="clearfix">
										<div className="message-data">
											<span className="message-data-time">10:15 AM, Today</span>
										</div>
										<div className="message my-message">Project has been already finished and I have results to show you.</div>
									</li>
									:
									<li key={i} className="clearfix" >
									<div className="message-data text-right">
										<span className="message-data-time">{ message.created_at } </span>
										<img src={chattingWith.image} alt="avatar" />
									</div>

									<div className="message other-message float-right">
										{ message.message }
									</div>
								</li>
							)
						})
					}

					{/*<li className="clearfix">*/}
					{/*	<div className="message-data">*/}
					{/*		<span className="message-data-time">10:12 AM, Today</span>*/}
					{/*	</div>*/}
					{/*	<div className="message my-message">Are we meeting today?</div>*/}
					{/*</li>*/}
					{/*<li className="clearfix">*/}
					{/*	<div className="message-data">*/}
					{/*		<span className="message-data-time">10:15 AM, Today</span>*/}
					{/*	</div>*/}
					{/*	<div className="message my-message">Project has been already finished and I have results to show you.</div>*/}
					{/*</li>*/}
					{/*<li className="clearfix">*/}
					{/*	<div className="message-data text-right">*/}
					{/*		<span className="message-data-time">10:10 AM, Today</span>*/}
					{/*		<img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />*/}
					{/*	</div>*/}

					{/*	<div className="message other-message float-right">*/}
					{/*		Hi Aiden, how are you? How is the project coming along?*/}
					{/*	</div>*/}
					{/*</li>*/}
					{/*<li className="clearfix">*/}
					{/*	<div className="message-data">*/}
					{/*		<span className="message-data-time">10:12 AM, Today</span>*/}
					{/*	</div>*/}
					{/*	<div className="message my-message">Are we meeting today?</div>*/}
					{/*</li>*/}
					{/*<li className="clearfix">*/}
					{/*	<div className="message-data">*/}
					{/*		<span className="message-data-time">10:15 AM, Today</span>*/}
					{/*	</div>*/}
					{/*	<div className="message my-message">Project has been already finished and I have results to show you.</div>*/}
					{/*</li>*/}
					{/*<li className="clearfix">*/}
					{/*	<div className="message-data text-right">*/}
					{/*		<span className="message-data-time">10:10 AM, Today</span>*/}
					{/*		<img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />*/}
					{/*	</div>*/}

					{/*	<div className="message other-message float-right">*/}
					{/*		Hi Aiden, how are you? How is the project coming along?*/}
					{/*	</div>*/}
					{/*</li>*/}
					{/*<li className="clearfix">*/}
					{/*	<div className="message-data">*/}
					{/*		<span className="message-data-time">10:12 AM, Today</span>*/}
					{/*	</div>*/}

					{/*	<div className="message my-message">Are we meeting today?</div>*/}
					{/*</li>*/}
					{/*<li className="clearfix">*/}
					{/*	<div className="message-data">*/}
					{/*		<span className="message-data-time">10:15 AM, Today</span>*/}
					{/*	</div>*/}
					{/*	<div className="message my-message">Project has been already finished and I have results to show you.</div>*/}
					{/*</li>*/}
				</ul>
			</div>
			<div className="chat-message clearfix">
				<div className="input-group mb-0">
					<div className="input-group-prepend">
						<span className="input-group-text"><i className="fa fa-send"></i></span>
					</div>
					<input type="text" className="form-control" placeholder="Enter text here..." />
				</div>
			</div>
		</div>
	)
}

export default Chat;