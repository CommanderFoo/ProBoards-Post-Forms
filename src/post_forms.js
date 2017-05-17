class ProBoards_Post_Forms {

	static init(){
		this.PLUGIN_ID = "pd_post_forms";
		this.PLUGIN_VERSION = "{VER}";
		this.PLUGIN = null;
		this.SETTINGS = null;

		this.settings.init();

		if(!this.SETTINGS){
			return;
		}

		$(this.ready.bind(this));
	}

	static ready(){
		let posting_location_check = (

			pb.data("route").name == "quote_posts" ||
			pb.data("route").name == "new_post" ||
			pb.data("route").name == "new_thread" ||
			pb.data("route").name == "edit_post" ||
			pb.data("route").name == "edit_thread"

		);

		if(posting_location_check){
			this.check_board();
		}
	}

	static check_board(){
		let page = proboards.data("page");

		if(page && page.board && page.board.id){
			let board_id = parseInt(page.board.id, 10);
			let form_data = this.settings.fetch_form_data(board_id);

			if(form_data){
				console.log(form_data);
			}
		}
	}

}