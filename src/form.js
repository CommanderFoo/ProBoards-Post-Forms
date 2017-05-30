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

	create_submit_button(){
		let $button = $("<button>Submit Form</button>");

		$button.on("click", () => {
			this.$pb_submit.trigger("click");
		});

		this.$wrapper.append($button);
	}

	build_form(){
		let html = "";
		let form_fields = [];

		form_fields = form_fields.concat(this.build_inputs());
		form_fields = form_fields.concat(this.build_drop_downs());
		form_fields = form_fields.concat(this.build_checkboxes_radios());
		form_fields = form_fields.concat(this.build_misc());

		ProBoards_Post_Forms.sort_by_order(form_fields);

		if(!form_fields.length){
			return;
		}

		this.has_elements = true;

		for(let i = 0; i < form_fields.length; ++ i){
			html += form_fields[i].label + form_fields[i].field + "<br />";
		}

		this.$wrapper.html(html);

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
			this.$content_container.append(this.$wrapper);
		}
	}

};