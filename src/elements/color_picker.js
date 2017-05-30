ProBoards_Post_Forms.Color_Picker = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		this.label_html = "<label for='color-picker-field-" + this.id + "'>" + this.data.name + ":</label>";
	}

	create_field(){
		this.field_html = "<input type='text' name='color-picker-field-" + this.id + "' value='' placeholder='' class='post-form-color-picker' />";
	}

};