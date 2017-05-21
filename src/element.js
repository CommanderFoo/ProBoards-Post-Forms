ProBoards_Post_Forms.Element = class {

	constructor(data){
		this.data = data;
		this.id = + new Date();

		this.label_html = "";
		this.field_html = "";
	}

	create_field(){
		console.warn("Abstract method. You need to override it in sub class with your own implementation");
	}

	create_label(){
		console.warn("Abstract method. You need to override it in sub class with your own implementation");
	}

	get name(){
		return this.data.name;
	}

	get order(){
		return this.data.order;
	}

	get type(){
		return this.data.type;
	}

	get label(){
		return this.label_html;
	}

	get field(){
		return this.field_html;
	}

};
