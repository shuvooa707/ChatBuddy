import {useState} from "react";

function ConversationList(props) {
	const [ contacts, setContacts ] = useState(props.contacts);
	const [ filteredContacts, setFilteredContacts ] = useState(props.contacts);

	const [ openedContact, setOpenContact ] = useState(
		{ "id": 1, "name": "Vincent Porter", "image": "https://bootdey.com/img/Content/avatar/avatar1.png", "status": "online" },
	);
	
	const openContact = (contact = null) => {
		if (!contact) return;
		setOpenContact(contact);

		window.dispatchEvent( new CustomEvent("OPEN_CONTACT_EVENT", {"detail" : {"contact": contact}} ) );
	}
	const searchContact = (inputQuery = null) => {
		console.log(contacts, filteredContacts);
		if ( !inputQuery || !inputQuery.length ) {
			setFilteredContacts(contacts);
			return;
		}
		let tmp = filteredContacts.filter( contact => contact.name.toLowerCase().includes(inputQuery.toLowerCase()) );
		setFilteredContacts(tmp);
	}
	
	return (
		<div id="plist" className="people-list">
			<div className="input-group">
				<div className="input-group-prepend">
					<span className="input-group-text">
						<i className="fa fa-search"></i>
					</span>
				</div>
				<input onInput={(event)=>{ searchContact(event.target.value) }} type="text" className="form-control" placeholder="Search..." />
			</div>
			<ul className="list-unstyled chat-list mt-2 mb-0">
				{
					filteredContacts.map((contact, i) => {
						return (
							<li onClick={() => openContact(contact)} key={i} id={"contactid-" + contact.id} className={"clearfix " + ( contact.id == openedContact.id ? "active" : contact.status )}>
								<img src={contact.image} alt="avatar" />
								<div className="about">
									<div className="name">{ contact.name }</div>
									<div className="status">
										{
											contact.status == "active" ?
												<><i className="fa fa-circle online"></i> online</>
											:
												<><i className="fa fa-circle offline"></i> {contact.status}</>

										}
									</div>
								</div>
							</li>
						)
					})
				}

				{/*<li className="clearfix">*/}
				{/*	<img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />*/}
				{/*	<div className="about">*/}
				{/*		<div className="name">Vincent Porter</div>*/}
				{/*		<div className="status">*/}
				{/*			<i className="fa fa-circle offline"></i> left 7 mins ago*/}
				{/*		</div>*/}
				{/*	</div>*/}
				{/*</li>*/}
				{/*<li className="clearfix">*/}
				{/*	<img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="avatar" />*/}
				{/*	<div className="about">*/}
				{/*		<div className="name">Mike Thomas</div>*/}
				{/*		<div className="status"><i className="fa fa-circle online"></i> online</div>*/}
				{/*	</div>*/}
				{/*</li>*/}
				{/*<li className="clearfix">*/}
				{/*	<img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />*/}
				{/*	<div className="about">*/}
				{/*		<div className="name">Christian Kelly</div>*/}
				{/*		<div className="status">*/}
				{/*			<i className="fa fa-circle offline"></i> left 10 hours ago*/}
				{/*		</div>*/}
				{/*	</div>*/}
				{/*</li>*/}
				{/*<li className="clearfix">*/}
				{/*	<img src="https://bootdey.com/img/Content/avatar/avatar8.png" alt="avatar" />*/}
				{/*	<div className="about">*/}
				{/*		<div className="name">Monica Ward</div>*/}
				{/*		<div className="status"><i className="fa fa-circle online"></i> online</div>*/}
				{/*	</div>*/}
				{/*</li>*/}
				{/*<li className="clearfix">*/}
				{/*	<img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="avatar" />*/}
				{/*	<div className="about">*/}
				{/*		<div className="name">Dean Henry</div>*/}
				{/*		<div className="status">*/}
				{/*			<i className="fa fa-circle offline"></i> offline since Oct 28*/}
				{/*		</div>*/}
				{/*	</div>*/}
				{/*</li>*/}
			</ul>
		</div>
	)
}

export default ConversationList;