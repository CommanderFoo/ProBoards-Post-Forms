ProBoards_Post_Forms.Form = class {

	constructor(form = {}){
		this.form_data = form;
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

	create_submit_button(){
		let $button = $("<button>Submit Form</button>");

		$button.on("click", () => {
			this.$pb_submit.trigger("click");
		});

		this.$wrapper.append($button);
	}

	build_form(){
		let html = "";
		let inputs = this.build_inputs();

		console.log(inputs);
		for(let i = 0; i < inputs.length; ++ i){
			html += inputs[i].label + inputs[i].field + "<br />";
		}

		this.$wrapper.html(html);
	}

	render(){
		this.$title.html(this.form_data.title);
		this.$pb_form.hide();
		this.$content_container.append(this.$wrapper);
	}

};