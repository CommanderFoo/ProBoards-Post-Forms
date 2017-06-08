ProBoards_Post_Forms.Checkbox_Radio_Group = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		let label_for = (parseInt(this.data[0].type, 10) == 1)? "checkbox" : "radio";

		this.field_for = label_for;
		this.label_html = "<label for='" + label_for + "-field-grp-" + this.data[0].group_id + "'>" + this.data[0].group_label + ":</label>";
	}

	create_field(){
		let html = "";

		ProBoards_Post_Forms.sort_by_order(this.data, true);

		for(let f = 0, fl = this.data.length; f < fl; ++ f){
			html += this.data[f].name + ": ";

			html += this.create_field_html(this.data[f])
		}

		this.field_html = html;
	}

	create_field_html(field_data){
		switch(parseInt(field_data.type, 10)){

			case 1 :
				return "<input type='checkbox' name='" + this.field_for + "-field-grp-" + this.data[0].group_id + "' value='" + field_data.value + "' />";

				break;

			case 2 :
				return "<input type='radio' name='" + this.field_for + "-field-grp-" + this.data[0].group_id + "' value='" + field_data + "' />";

				break;
		}
	}

	parse(template){
		let grp_id = this.data[0].group_id;

		template = template.replace("$[" + grp_id + ".group_label]", this.data[0].group_label);
		template = template.replace("$[" + grp_id + ".group_id]", this.data[0].group_id);
		template = template.replace("$[" + grp_id + ".field]", this.field_html);

		for(let f = 0, fl = this.data.length; f < fl; ++ f){
			let pattern = "\\$\\[" + grp_id + "\\.(" + f + "|" + this.data[f].id + ")\\.";

			template = template.replace(new RegExp(pattern + "id]", "g"), this.data[f].id);
			template = template.replace(new RegExp(pattern + "order]", "g"), this.data[f].order);
			template = template.replace(new RegExp(pattern + "value]", "g"), this.data[f].value);
			template = template.replace(new RegExp(pattern + "name]", "g"), this.data[f].name);
			template = template.replace(new RegExp(pattern + "field]", "g"), this.create_field_html(this.data[f]));
		}

		return template;
	}

};