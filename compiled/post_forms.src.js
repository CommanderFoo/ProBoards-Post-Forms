/**
* @license
* The MIT License (MIT)
*
* Copyright (c) 2017 pixeldepth.net - http://support.proboards.com/user/2671
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

class ProBoards_Post_Forms {

	static init(){
		this.PLUGIN_ID = "pd_post_forms";
		this.PLUGIN_VERSION = "1.0.0";
		this.PLUGIN = null;
		this.SETTINGS = null;

		this.route = pb.data("route");

		this.settings.init();

		if(!this.SETTINGS){
			return;
		}

		$(this.ready.bind(this));
	}

	static ready(){

		// Do basic location check first

		let posting_location_check = (

			this.route.name == "quote_posts" ||
			this.route.name == "new_post" ||
			this.route.name == "new_thread" ||
			this.route.name == "edit_post" ||
			this.route.name == "edit_thread"

		);

		if(posting_location_check){
			this.check_board();
		}
	}

	// Check to see if this board does have a form for it

	static check_board(){
		let page = proboards.data("page");

		if(page && page.board && page.board.id){
			let board_id = parseInt(page.board.id, 10);
			let form = this.settings.fetch_form(board_id);

			if(form && this.form_can_be_used(form.apply_to)){
				let form_data = this.settings.fetch_all_form_data(form);

				if(form_data){
					new this.Form(form_data).render();
				}
			}
		}
	}

	static form_can_be_used(locations = []){
		if(locations.length){
			let route = pb.data("route").name;

			for(let i = 0, l = locations.length; i < l; ++ i){
				switch(parseInt(locations[i], 10)){

					case 1 :
						if(route == "edit_post"){
							return true;
						}

						break;

					case 2 :
						if(route == "edit_thread"){
							return true;
						}

						break;

					case 3 :
						if(route == "new_thread"){
							return true;
						}

						break;

					case 4 :
						if(route == "new_post"){
							return true;
						}

						break;

					case 5 :
						if(route == "quote_posts"){
							return true;
						}

						break;

				}
			}

			return false;
		}

		return true;
	}

	static sort_by_order(fields, no_data_property = false){
		fields.sort((a, b) => {
			let a_order = null;
			let b_order = null;

			if(no_data_property){
				a_order = (a.order)? parseInt(a.order, 10) : null;
				b_order = (b.order)? parseInt(b.order, 10) : null;
			} else {
				a_order = (a.data.order)? parseInt(a.data.order, 10) : null;
				b_order = (b.data.order)? parseInt(b.data.order, 10) : null;
			}

			if(a_order === null && b_order === null){
				return 0;
			} else {
				if(a_order === null){
					return 1;
				} else if(b_order === null){
					return 0;
				} else {
					if(a_order < b_order){
						return -1;
					} else if(b_order < a_order){
						return 1
					} else {
						return 0;
					}
				}
			}
		});
	}

}

ProBoards_Post_Forms.settings = class {

	static init(){
		this.setup();
	}

	static setup(){
		let plugin = pb.plugin.get(ProBoards_Post_Forms.PLUGIN_ID);

		if(plugin){
			ProBoards_Post_Forms.PLUGIN = plugin;

			if(plugin.settings){
				ProBoards_Post_Forms.SETTINGS = plugin.settings;
			}
		}
	}

	// Fetch form for a specific board

	static fetch_form(board_id = 0){
		let forms = ProBoards_Post_Forms.SETTINGS.forms;
		let form = null;

		for(let f = 0, fl = forms.length; f < fl; ++ f){
			if(!forms[f].unique_id || !forms[f].enabled){
				continue;
			}

			if(forms[f].boards.find(id => parseInt(id, 10) == board_id)){
				form = forms[f];

				break;
			}
		}

		return form;
	}

	// Fetch form elements.

	static fetch_all_form_data(form = null){

		 // Check if we have a form.  If we do, grab all elements for this form.

		 if(form){
		 	form.elements = {

		 		input: [],
				drop_down: [],
				checkbox_radio: [],
				numbers: [],
				misc: []

		 	};

		 	let settings = ProBoards_Post_Forms.SETTINGS;

		 	// Fetch all input fields for this form

			 let input_fields = settings.input_fields;

			 for(let e = 0, el = input_fields.length; e < el; ++ e){
				if(this.form_related(form.unique_id, input_fields[e].form_ids)){
					form.elements.input.push(input_fields[e]);
				}
			 }

			 // Fetch all drop downs for this form

			 let drop_downs = settings.drop_downs;

			 for(let e = 0, el = drop_downs.length; e < el; ++ e){
				 if(this.form_related(form.unique_id, drop_downs[e].form_ids)){
					 form.elements.drop_down.push(drop_downs[e]);
				 }
			 }

			 // Fetch all checkboxes for this form

			 let checkboxes_radios = settings.checkboxes_radios;

			 for(let e = 0, el = checkboxes_radios.length; e < el; ++ e){
				 if(this.form_related(form.unique_id, checkboxes_radios[e].form_ids)){
					 form.elements.checkbox_radio.push(checkboxes_radios[e]);
				 }
			 }

			 // Fetch all number fields for this form

			 let numbers = settings.numbers;

			 for(let e = 0, el = numbers.length; e < el; ++ e){
				 if(this.form_related(form.unique_id, numbers[e].form_ids)){
					 form.elements.numbers.push(numbers[e]);
				 }
			 }

			 // Fetch all misc elements for this form

			 let misc = settings.misc;

			 for(let e = 0, el = misc.length; e < el; ++ e){
				 if(this.form_related(form.unique_id, misc[e].form_ids)){
					 form.elements.misc.push(misc[e]);
				 }
			 }

			 // No elements?  null out the form variable.

			 if(!form.elements.input || !form.elements.drop_down || !form.elements.checkbox_radio || !form.elements.misc){
			 	form = null;
			 } else {
			 	form.template = this.fetch_form_template(form.unique_id);
			 }
		 }

		 return form;
	}

	static fetch_form_template(form_id){
		let template = null;
		let templates = ProBoards_Post_Forms.SETTINGS.templates;

		for(let t = 0, tl = templates.length; t < tl; ++ t){
			if(templates[t].form_id == form_id){
				template = templates[t].template;
				break;
			}
		}

		return template;
	}

	// Elements can be shared between forms, so the input may contain
	// multiple form elements.  Compare against the form id to see if
	// we have a match.

	static form_related(form_id, form_ids){
		if(form_id && form_ids){
			let ids = form_ids.split(",");

			ids = (Array.isArray(ids))? ids : [ids];

			if(ids.find(id => id.replace(/ /g, "") == form_id)){
				return true;
			}
		}

		return false;
	}

};

/**
 * @TODO: Consider passing template bool to the classes to prevent some
 * of the assignments, as they won't be used if a template is going to be parsed.
 *
 * @TODO: Consider running final template through a last parser to strip left over
 * template variables.
 */

ProBoards_Post_Forms.Form = class {

	constructor(form = {}){
		this.form_data = form;
		this.has_elements = false;
		this.$wrapper = $("<div id='pd-post-form' class='pd-post-form post-form-" + this.form_data.unique_id + "'></div>");

		this.$wysiwyg_container = $(".wysiwyg-area");
		this.$title = this.$wysiwyg_container.find("div.title-bar h2");
		this.$content_container = this.$wysiwyg_container.find("div.content:first");
		this.$pb_form = this.$wysiwyg_container.find("form:first");
		this.$pb_submit = this.$pb_form.find("input[type=submit]");

		this.using_template = false;

		if(this.form_data.template && this.form_data.template.length){
			this.using_template = true;
		}

		this.build_form();
	}

	build_inputs(){
		let inputs = [];

		for(let i = 0, l = this.form_data.elements.input.length; i < l; ++ i){
			inputs.push(new ProBoards_Post_Forms.Input(this.form_data.elements.input[i]));
		}

		return inputs;
	}

	build_drop_downs(){
		let drop_downs = [];

		for(let i = 0, l = this.form_data.elements.drop_down.length; i < l; ++ i){
			drop_downs.push(new ProBoards_Post_Forms.Drop_Down(this.form_data.elements.drop_down[i]));
		}

		return drop_downs;
	}

	build_checkboxes_radios(){
		let checkboxes_radios = [];
		let group_checkboxes_radios = {};

		for(let i = 0, l = this.form_data.elements.checkbox_radio.length; i < l; ++ i){
			let the_input = this.form_data.elements.checkbox_radio[i];

			if(the_input.group_id.length){
				if(!group_checkboxes_radios[the_input.group_id]){
					group_checkboxes_radios[the_input.group_id] = [];
				}

				group_checkboxes_radios[the_input.group_id].push(the_input);
			} else {
				checkboxes_radios.push(new ProBoards_Post_Forms.Checkbox_Radio(the_input));
			}
		}

		// Grouping

		if(group_checkboxes_radios){
			for(let id in group_checkboxes_radios){
				if(group_checkboxes_radios.hasOwnProperty(id)){
					checkboxes_radios.push(new ProBoards_Post_Forms.Checkbox_Radio_Group(group_checkboxes_radios[id]));
				}
			}
		}

		return checkboxes_radios;
	}

	build_misc(){
		let misc = [];

		for(let i = 0, l = this.form_data.elements.misc.length; i < l; ++ i){
			if(this.form_data.elements.misc[i].field_type == 1){
				misc.push(new ProBoards_Post_Forms.Color_Picker(this.form_data.elements.misc[i]));
			}
		}

		return misc;
	}

	build_number_inputs(){
		let number_inputs = [];

		for(let i = 0, l = this.form_data.elements.numbers.length; i < l; ++ i){
			number_inputs.push(new ProBoards_Post_Forms.Number_Input(this.form_data.elements.numbers[i]));
		}

		return number_inputs;
	}

	create_submit_button(){
		let $button = $("<button>Submit Form</button>");

		$button.on("click", () => {
			this.$pb_submit.trigger("click");
		});

		this.$wrapper.append($button);
	}

	create_reset_button(){
		let $button = $("<input type='reset' value='Reset' />");

		this.$wrapper.append($button);
	}

	build_form(){
		let $html = $("<div></div>");
		let template = this.form_data.template;
		let form_fields = [];

		form_fields = form_fields.concat(this.build_inputs());
		form_fields = form_fields.concat(this.build_drop_downs());
		form_fields = form_fields.concat(this.build_checkboxes_radios());
		form_fields = form_fields.concat(this.build_number_inputs());
		form_fields = form_fields.concat(this.build_misc());

		ProBoards_Post_Forms.sort_by_order(form_fields);

		if(!form_fields.length){
			return;
		}

		this.has_elements = true;

		for(let i = 0; i < form_fields.length; ++ i){
			if(this.using_template){
				template = form_fields[i].parse(template);
			} else {
				$html.append(form_fields[i].label + form_fields[i].field + "<br />");
			}
		}

		if(this.using_template){
			$html = $html.append(template);
		}

		this.$wrapper.append($html);

		// Could use HTML 5 colour picker, but IE 11...

		this.$wrapper.find("input.post-form-color-picker").colorPicker({

			hex: "000000",
			allowTransparent: true,
			autoOpen: false,
			autoUpdate: false,
			update: function(value){
				$(this).val("#" + value);
				$(this).colorPicker("hide");
			}

		}).on("click", function(){
			$(this).colorPicker("open");
		});
	}

	// Only render form if there are elements

	render(){
		if(this.has_elements){
			this.$title.html(this.form_data.title);
			this.$pb_form.hide();
			this.create_reset_button();
			this.create_submit_button();
			this.$content_container.append(this.$wrapper);
		}
	}

};

ProBoards_Post_Forms.Element = class {

	constructor(data){
		this.data = data;
		this.id = + new Date();

		this.label_html = "";
		this.field_html = "";
	}

	create_field(){
		console.warn("Abstract method \"create_field\". You need to override it in sub class with your own implementation");
	}

	create_label(){
		console.warn("Abstract method \"create_label\". You need to override it in sub class with your own implementation");
	}

	get name(){
		return this.data.name;
	}

	get order(){
		return this.data.order;
	}

	get type(){
		return this.data.type;
	}

	get label(){
		return this.label_html;
	}

	get field(){
		return this.field_html;
	}

	parse(){
		console.warn("Abtract method \"parser\".  You need to override it in the sub class with your own implementation.");
	}

};


ProBoards_Post_Forms.Input = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		this.label_html = "<label for='input-field-" + this.data.id + "'>" + this.data.name + ":</label>";
	}

	create_field(){
		switch(parseInt(this.data.type, 10)){

			case 1 :
				this.field_html = "<input type='text' name='input-field-" + this.data.id + "' />";

				break;

			case 2 :
				this.field_html = "<textarea name='input-field-" + this.data.id + "'></textarea>";

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

ProBoards_Post_Forms.Drop_Down = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		this.label_html = "<label for='drop-down-field-" + this.data.id + "'>" + this.data.name + ":</label>";
	}

	create_field(){
		let multiple = (parseInt(this.data.multiple, 10) == 1)? " multiple='multiple'" : "";
		let size = (parseInt(this.data.multiple_size, 10))? parseInt(this.data.multiple_size, 10) : 1;

		size = (multiple.length && size)? " size='" + size + "'" : "";

		this.field_html = "<select" + size + multiple + " name='drop-down-field-" + this.data.id + "'>" + this.create_options() + "</select>";
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

	parse(template){
		template = template.replace("$[" + this.data.id + ".name]", this.data.name);
		template = template.replace("$[" + this.data.id + ".field]", this.field_html);
		template = template.replace("$[" + this.data.id + ".id]", this.data.id);
		template = template.replace("$[" + this.data.id + ".order]", this.data.order);
		template = template.replace("$[" + this.data.id + ".multiple_size]", this.data.multiple_size);
		template = template.replace("$[" + this.data.id + ".multiple_answers]", this.data.multiple);

		return template;
	}

};

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

ProBoards_Post_Forms.Number_Input = class extends ProBoards_Post_Forms.Element {

	constructor(data = {}){
		super(data);

		this.create_label();
		this.create_field();
	}

	create_label(){
		this.field_for = (parseInt(this.data.type, 10) == 1)? "number" : "range";;
		this.label_html = "<label for='" + this.field_for + "-field-" + this.data.id + "'>" + this.data.name + ":</label>";
	}

	create_field(){
		let min = " min='" + this.data.min + "'";
		let max = " max='" + this.data.max + "'";

		this.field_html = "<input" + min + max + " type='" + this.field_for + "' name='" + this.field_for + "-input-field-" + this.data.id + "' />";

		if(this.data.show_value){
			this.field_html += " <span id='" + this.field_for + "-input-field-val-" + this.data.id + "'></span>";
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

ProBoards_Post_Forms.init();