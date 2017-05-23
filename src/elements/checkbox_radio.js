ProBoards_Post_Forms.Checkbox_Radio = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		let label_for = (parseInt(this.data.type, 10) == 1)? "checkox" : "radio";

		this.label_html = "<label for='" + label_for + "-field-" + this.id + "'>" + this.data.name + ":</label>";
	}

	create_field(){
		switch(parseInt(this.data.type, 10)){

			case 1 :
				this.field_html = "<input type='checkbox' name='checkbox-field-" + this.id + "' value='" + this.data.value + "' />";

				break;

			case 2 :
				this.field_html = "<input type='radio' name='radio-field-" + this.id + "' value='" + this.data.value + "' />";

				break;
		}
	}

};