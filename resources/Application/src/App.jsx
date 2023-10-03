import ConversationList from "./ConversationList.jsx";
import Chat from "./Chat.jsx";
import {useEffect, useState} from "react";

function App() {

	const [ contacts, setContacts ] = useState([]);

	useEffect(()=>{
		loadSiteData();
	},[]);

	const makeUrl = (path = "") => {
		let url = null;
		if ( window.API_URL ) {
			url = window.API_URL + "/" + path;
		} else {
			url = window.origin + "/" + path;
		}
		return url;
	}

	const loadSiteData = async () => {
		let url = makeUrl("load-page-data");
		console.log(window.API_URL)
		let payload = new FormData();
		await fetch(url, {
			headers: {
				"Accepts": "application/json"
			},
			method: "POST",
			body: payload
		})
		.then(res => res.json())
		.then(res => {

		});
	}
	return (
		<div className="container main-container" style={{ minHeight: "100%", height: "100%" }}>
			<div className="row clearfix">
				<div className="col-lg-12">
					<div className="card chat-app rounded-0">

						{/* Contact List */}
						<ConversationList contacts={contacts} />
						{/* End Contact List */}

						{/* Chat */}
						<Chat />
						{/* End Chat */}

					</div>
				</div>
			</div>
		</div>
	)
}

export default App
