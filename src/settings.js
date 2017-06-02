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