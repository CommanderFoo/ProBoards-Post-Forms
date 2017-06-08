ProBoards_Post_Forms.Checkbox_Radio = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		this.label_for = (parseInt(this.data.type, 10) == 1)? "checkbox" : "radio";

		this.label_html = "<label for='" + this.label_for + "-field-" + this.data.id + "'>" + this.data.name + ":</label>";
	}

	create_field(){
		switch(parseInt(this.data.type, 10)){

			case 1 :
				this.field_html = "<input type='checkbox' name='checkbox-field-" + this.data.id + "' value='" + this.data.value + "' />";

				break;

			case 2 :
				this.field_html = "<input type='radio' name='radio-field-" + this.data.id + "' value='" + this.data.value + "' />";

				break;
		}
	}

	parse(template){
		template = template.replace("$[" + this.data.id + ".name]", this.data.name);
		template = template.replace("$[" + this.data.id + ".id]", this.data.id);
		template = template.replace("$[" + this.data.id + ".field]", this.field_html);
		template = template.replace("$[" + this.data.id + ".order]", this.data.order);
		template = template.replace("$[" + this.data.id + ".value]", this.data.value);

		return template;
	}

};