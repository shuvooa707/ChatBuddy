class MessageService {
	constructor(contact) {
		this.contact = contact;
	}

	/* Getter & Setters  */
	get getContact() {
		return this.contact;
	}
	set setContact(contact) {
		this.contact = contact;
		return this;
	}

	getMessages() {
		if ( !this.contact ) return null;

	}
}