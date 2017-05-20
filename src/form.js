ProBoards_Post_Forms.Form = class {

	constructor(form = {}){
		this.form_data = form;
		this.$wrapper = $("<div id='pd-post-form' class='pd-post-form post-form-" + this.form_data.unique_id + "'></div>");

		this.$wysiwyg_container = $(".wysiwyg-area");
		this.$title = this.$wysiwyg_container.find("div.title-bar h2");
		this.$content_container = this.$wysiwyg_container.find("div.content:first");
		this.$pb_form = this.$wysiwyg_container.find("form:first");
		this.$pb_submit = this.$pb_form.find("input[type=submit]");

		this.build_elements();
		this.create_submit_button();
	}

	build_elements(){
		console.log(this.form_data);

		let inputs = this.build_inputs();
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

	render(){
		this.$title.html(this.form_data.title);
		this.$pb_form.find("form:first").hide();
		this.$content_container.append(this.$wrapper);
	}

};