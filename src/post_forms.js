class ProBoards_Post_Forms {

	static init(){
		this.PLUGIN_ID = "pd_post_forms";
		this.PLUGIN_VERSION = "{VER}";
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

}