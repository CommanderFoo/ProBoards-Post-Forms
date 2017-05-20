ProBoards_Post_Forms.Element = class {

	constructor(elem_data){
		this.elem_data = elem_data;
		this.build_html();
	}

	build_html(){
		console.warn("Abstract method. Uou need to override it in sub class with your own implementation");
	}

	get name(){
		return this.elem_data.name;
	}

	get order(){
		return this.elem_data.order;
	}

	get type(){
		return this.elem_data.type;
	}

};
