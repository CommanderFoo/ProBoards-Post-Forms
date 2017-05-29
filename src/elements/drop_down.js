ProBoards_Post_Forms.Drop_Down = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		this.label_html = "<label for='drop-down-field-" + this.id + "'>" + this.data.name + ":</label>";
	}

	create_field(){
		let multiple = (parseInt(this.data.multiple, 10) == 1)? " multiple='multiple'" : "";
		let size = (parseInt(this.data.multiple_size, 10))? parseInt(this.data.multiple_size, 10) : 1;

		size = (multiple.length && size)? " size='" + size + "'" : "";

		this.field_html = "<select" + size + multiple + " name='drop-down-field-" + this.id + "'>" + this.create_options() + "</select>";
	}

	create_options(){
		let options = this.data.options.split(/\n/g);
		let options_html = (this.data.multiple)? "" : "<option value=''> </option>";

		for(let o = 0, ol = options.length; o < ol; ++ o){
			if(options[o].match(/^\[group=(.+)?\]/i)){
				let label = RegExp.$1;

				options_html += "<optgroup label='" + pb.text.escape_html(label) + "'>";
			} else if(options[o].toLowerCase() == "[/group]"){
				options_html += "</optgroup>";
			} else {
				options_html += "<option value='" + o + "'>" + options[o] + "</option>";
			}
		}

		return options_html;
	}

};