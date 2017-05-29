ProBoards_Post_Forms.Checkbox_Radio_Group = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		let label_for = (parseInt(this.data[0].type, 10) == 1)? "checkbox" : "radio";

		this.field_for = label_for;
		this.label_html = "<label for='" + label_for + "-field-grp-" + this.id + "'>" + this.data[0].group_label + ":</label>";
	}

	create_field(){
		let html = "";

		for(let f = 0, fl = this.data.length; f < fl; ++ f){
			html += this.data[f].name + ": ";

			switch(parseInt(this.data[f].type, 10)){

				case 1 :
					html += "<input type='checkbox' name='" + this.field_for + "-field-grp-" + this.id + "' value='" + this.data[f].value + "' />";

					break;

				case 2 :
					html += "<input type='radio' name='" + this.field_for + "-field-grp-" + this.id + "' value='" + this.data[f].value + "' />";

					break;
			}
		}

		this.field_html = html;
	}

};