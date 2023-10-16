import {useEffect} from "react";
import makeUrl from "../util/makeUrl";
import AuthHelper from "../util/AuthHelper";

function ShowGroupMembersModal({ toggleShowGroupMembers, openedConversation }) {

	const kickMember = async userId => {
		let url = makeUrl("api/v1/conversation/remove-member");
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
			await fetchUsers(null);
		}
	}


	return (
		<div id="show-group-member-container">
			<div id="show-group-member-panel">
				<div className={"bg-dark d-flex py-2 justify-content-between align-items-center text-white"} style={{ borderBlock: "1px solid grey"}}>
					<strong className="pl-4 d-flex align-items-center">
						<img className="mx-2" src={ openedConversation.image } style={{ width:"50px" }} alt=""/>
						<span>{ openedConversation.name }</span>
					</strong>
					<h5>
						<i style={{ cursor: "pointer" }} className="fa fa-times p-2 text-white" onClick={()=>toggleShowGroupMembers(false)}></i>
					</h5>
				</div>
				<div className="d-block text-white p-3 pt-0">
					<ul className="list-unstyled chat-list mt-2 mb-0" style={{ maxHeight: "480px", overflow: "hidden", overflowY: "auto" }}>
						{
							openedConversation
								.conversation_members
								.map((cm,i)=>{
									return (
										<li key={i} className="text-white p-2" style={{ borderBottom: "1px solid #aaa", }}>
											<div className="d-flex justify-content-between">
												<div className="d-flex">
													<img className="mx-2" src={cm.user.image} style={{ width:"30px", height: "30px" }} alt=""/>
													<small>{ cm.user.name }</small>
												</div>
												<div>
													<button onClick={() => kickMember(cm.user.id)} className="hover:bg-red-700 btn bg-red-500 text-white py-0 px-1 rounded-1">
														<i className="fa fa-power-off" aria-hidden="true"></i> kick
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
	)
}


export default ShowGroupMembersModal;