import {useContext, useEffect, useState} from "react";
import MySelfContext from "../contexts/MySelfContext";

function ConversationList(props) {
	const { setOpenedConversation, openedConversation } = props;
	const [ conversations, setConversations ] = useState(props.conversations);
	const [ filteredConversations, setFilteredConversations ] = useState(props.conversations);

	// const [ openedConversation, setOpenConversation ] = useState(conversations[0]);
	
	const openConversation = (conversation = null) => {
		console.log(conversation)
		if (!conversation) return;
		setOpenedConversation(conversation);
		// setOpenConversation(conversation);

		setFilteredConversations(conversations);
		document.querySelector("#search-input").value = ``;
		window.dispatchEvent( new CustomEvent("OPEN_CONVERSATION_EVENT", {"detail" : {"conversation": conversation}} ) );
	}
	const searchConversation = (inputQuery = null) => {
		console.log(conversations, filteredConversations);
		if ( !inputQuery || !inputQuery.length ) {
			setFilteredConversations(conversations);
			return;
		}
		let tmp = filteredConversations.filter( conversation => {
			if(conversation.conversation_members.length < 2) return false;
			if ( conversation.conversation_members.length == 2 ) {
				if ( conversation.conversation_members[0]?.user?.name?.toLowerCase()?.includes(inputQuery.toLowerCase()) ) return true;
				if ( conversation.conversation_members[1]?.user?.name?.toLowerCase()?.includes(inputQuery.toLowerCase()) ) return true;
			}
			return conversation.name && conversation.name.toLowerCase().includes(inputQuery.toLowerCase());
		});
		setFilteredConversations(tmp);
	}

	const [ myself, setMyself ] = useState({id:-1});

	const { user } = useContext(MySelfContext);

	/********************************************/
	/******** Event Attachment useEffect ********/
	/********************************************/
	useEffect(() => {
		window.addEventListener("ADD_MEMBER_EVENT", (e) => {
			console.log("Event Emitted::ADD_MEMBER_EVENT")
			let conversation = e.detail.conversation;
			openConversation(conversation);
		});
	}, [props]);

	useEffect(()=>{
		setConversations(props.conversations);
		setFilteredConversations(props.conversations);
		//setOpenConversation(conversations[0] ?? null);
		setMyself(user);
	}, [props])

	return (
		<div id="plist" className="people-list">
			<div className="input-group">
				<input onInput={ e => { searchConversation(e.target.value) }} type="text" id={"search-input"} className="form-control" placeholder="Search..." />
			</div>
			<ul className="list-unstyled chat-list mt-2 mb-0">
				{
					filteredConversations.map((conversation, i) => {
						let members_count = conversation.conversation_members.length;
						if ( members_count > 2 ) {
							let lastImgCount = 0;
							return (
								<li onClick={() => openConversation(conversation)} id={"conversationid-" + conversation.id} className={"bg-blue-950 conversation clearfix " + ( openedConversation && conversation.id == openedConversation.id ? "selected" : conversation.status )} key={i}>
									<div className="d-block">
										<h4 className="name text-2xl font-weight-bold">
											{conversation?.name ?? "-" }
										</h4>
									</div>
									<div className={"d-block"}>
										{
											conversation
												.conversation_members
												.slice(0, 4)
												.map((cm,i)=>{
													lastImgCount++;
													return (
														<img src={cm.user.image} style={{ transform: `translateX(-${30*i}%)`, width:"30px", height: "30px", borderRadius: "50px", border: "2px solid white", outline: "1px solid #eee" }} key={i} />
													)
												})
										}
										<span style={{  transform: `translateX(-${30*(lastImgCount-3)}%)`, minWidth: "30px", height: "30px", display: "inline-block" }}>
											+<small style={{fontSize: ".8em"}}>{ conversation.conversation_members.length }</small>
										</span>
									</div>
								</li>
							)
						}
						else if ( conversation.conversation_members.length == 2 ) {
							let otherMember =  {};
							if (  myself && conversation.conversation_members[0].user.id == myself.id ) {
								otherMember = conversation.conversation_members[1];
							} else {
								otherMember = conversation.conversation_members[0];
							}
							return (
								<li onClick={() => openConversation(conversation)} id={"conversationid-" + conversation.id} className={"bg-blue-950 conversation clearfix " + ( openedConversation && conversation.id == openedConversation.id ? "selected" : conversation.status )} key={i}>
									<img src={otherMember.user.image} />
									<div className="about">
										<div className="name">{ otherMember.user.name }</div>
										<div className="status">
											{
												conversation.status == "active" ?
													<><i className="fa fa-circle online"></i> online</>
													:
													<><i className="fa fa-circle offline"></i> {conversation.status}</>
											}
										</div>
									</div>
								</li>
							)
						}
						else {

						}
					})
				}
			</ul>
		</div>
	)
}

export default ConversationList;