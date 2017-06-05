ProBoards_Post_Forms.Number_Input = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		this.field_for = (parseInt(this.data.type, 10) == 1)? "number" : "range";;
		this.label_html = "<label for='" + this.field_for + "-field-" + this.id + "'>" + this.data.name + ":</label>";
	}

	create_field(){
		let min = " min='" + this.data.min + "'";
		let max = " max='" + this.data.max + "'";

		this.field_html = "<input" + min + max + " type='" + this.field_for + "' name='" + this.field_for + "-input-field-" + this.id + "' />";

		if(this.data.show_value){
			this.field_html += " <span id='" + this.field_for + "-input-field-val-" + this.id + "'></span>";
		}
	}

	parse(template){
		template = template.replace("$[" + this.data.id + ".name]", this.data.name);
		template = template.replace("$[" + this.data.id + ".id]", this.data.id);
		template = template.replace("$[" + this.data.id + ".field]", this.field_html);
		template = template.replace("$[" + this.data.id + ".min]", this.data.min);
		template = template.replace("$[" + this.data.id + ".max]", this.data.max);

		return template;
	}

};