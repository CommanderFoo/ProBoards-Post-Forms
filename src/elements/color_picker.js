ProBoards_Post_Forms.Color_Picker = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		this.label_html = "<label for='color-picker-field-" + this.data.id + "'>" + this.data.name + ":</label>";
	}

	create_field(){
		this.field_html = "<input type='text' name='color-picker-field-" + this.data.id + "' value='' placeholder='' class='post-form-color-picker' />";
	}

	parse(template){
		template = template.replace("$[" + this.data.id + ".name]", this.data.name);
		template = template.replace("$[" + this.data.id + ".field]", this.field_html);

		return template;
	}

};