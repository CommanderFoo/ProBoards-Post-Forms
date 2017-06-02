ProBoards_Post_Forms.Number_Input = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		let label_for = (parseInt(this.data.type, 10) == 1)? "number" : "range";

		this.field_for = label_for;
		this.label_html = "<label for='" + label_for + "-field-" + this.id + "'>" + this.data.name + ":</label>";
	}

	create_field(){
		let min = " min='" + this.data.min + "'";
		let max = " max='" + this.data.max + "'";

		this.field_html = "<input" + min + max + " type='" + this.field_for + "' name='" + this.field_for + "-input-field-" + this.id + "' />";

		if(this.data.show_value){
			this.field_html += " <span id='" + this.field_for + "-input-field-val-" + this.id + "'></span>";

			//this.field_html.find("input:first")
		}
	}

	handlers(){

	}

};