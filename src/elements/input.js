ProBoards_Post_Forms.Input = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		this.label_html = "<label for='input-field-" + this.id + "'>" + this.data.name + ":</label>";
	}

	create_field(){
		switch(parseInt(this.data.type, 10)){

			case 1 :
				this.field_html = "<input type='text' name='input-field-" + this.id + "' />";

				break;

			case 2 :
				this.field_html = "<textarea name='input-field-" + this.id + "'></textarea>";

				break;

		}
	}

	parse(template){
		template = template.replace("$[" + this.data.id + ".name]", this.data.name);
		template = template.replace("$[" + this.data.id + ".field]", this.field_html);
		template = template.replace("$[" + this.data.id + ".id]", this.data.id);
		template = template.replace("$[" + this.data.id + ".order]", this.data.order);

		return template;
	}

};