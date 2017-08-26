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

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProBoards_Post_Forms = function () {
	function ProBoards_Post_Forms() {
		_classCallCheck(this, ProBoards_Post_Forms);
	}

	_createClass(ProBoards_Post_Forms, null, [{
		key: "init",
		value: function init() {
			this.PLUGIN_ID = "pd_post_forms";
			this.PLUGIN_VERSION = "1.0.0";
			this.PLUGIN = null;
			this.SETTINGS = null;

			this.route = pb.data("route");

			this.settings.init();

			if (!this.SETTINGS) {
				return;
			}

			$(this.ready.bind(this));
		}
	}, {
		key: "ready",
		value: function ready() {

			// Do basic location check first

			var posting_location_check = this.route.name == "quote_posts" || this.route.name == "new_post" || this.route.name == "new_thread" || this.route.name == "edit_post" || this.route.name == "edit_thread";

			if (posting_location_check) {
				this.check_board();
			}
		}

		// Check to see if this board does have a form for it

	}, {
		key: "check_board",
		value: function check_board() {
			var page = proboards.data("page");

			if (page && page.board && page.board.id) {
				var board_id = parseInt(page.board.id, 10);
				var form = this.settings.fetch_form(board_id);

				if (form && this.form_can_be_used(form.apply_to)) {
					var form_data = this.settings.fetch_all_form_data(form);

					if (form_data) {
						new this.Form(form_data).render();
					}
				}
			}
		}
	}, {
		key: "form_can_be_used",
		value: function form_can_be_used() {
			var locations = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

			if (locations.length) {
				var route = pb.data("route").name;

				for (var i = 0, l = locations.length; i < l; ++i) {
					switch (parseInt(locations[i], 10)) {

						case 1:
							if (route == "edit_post") {
								return true;
							}

							break;

						case 2:
							if (route == "edit_thread") {
								return true;
							}

							break;

						case 3:
							if (route == "new_thread") {
								return true;
							}

							break;

						case 4:
							if (route == "new_post") {
								return true;
							}

							break;

						case 5:
							if (route == "quote_posts") {
								return true;
							}

							break;

					}
				}

				return false;
			}

			return true;
		}
	}, {
		key: "sort_by_order",
		value: function sort_by_order(fields) {
			var no_data_property = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			fields.sort(function (a, b) {
				var a_order = null;
				var b_order = null;

				if (no_data_property) {
					a_order = a.order ? parseInt(a.order, 10) : null;
					b_order = b.order ? parseInt(b.order, 10) : null;
				} else {
					a_order = a.data.order ? parseInt(a.data.order, 10) : null;
					b_order = b.data.order ? parseInt(b.data.order, 10) : null;
				}

				if (a_order === null && b_order === null) {
					return 0;
				} else {
					if (a_order === null) {
						return 1;
					} else if (b_order === null) {
						return 0;
					} else {
						if (a_order < b_order) {
							return -1;
						} else if (b_order < a_order) {
							return 1;
						} else {
							return 0;
						}
					}
				}
			});
		}
	}]);

	return ProBoards_Post_Forms;
}();

ProBoards_Post_Forms.settings = function () {
	function _class() {
		_classCallCheck(this, _class);
	}

	_createClass(_class, null, [{
		key: "init",
		value: function init() {
			this.setup();
		}
	}, {
		key: "setup",
		value: function setup() {
			var plugin = pb.plugin.get(ProBoards_Post_Forms.PLUGIN_ID);

			if (plugin) {
				ProBoards_Post_Forms.PLUGIN = plugin;

				if (plugin.settings) {
					ProBoards_Post_Forms.SETTINGS = plugin.settings;
				}
			}
		}

		// Fetch form for a specific board

	}, {
		key: "fetch_form",
		value: function fetch_form() {
			var board_id = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			var forms = ProBoards_Post_Forms.SETTINGS.forms;
			var form = null;

			for (var f = 0, fl = forms.length; f < fl; ++f) {
				if (!forms[f].unique_id || !forms[f].enabled) {
					continue;
				}

				if (forms[f].boards.find(function (id) {
					return parseInt(id, 10) == board_id;
				})) {
					form = forms[f];

					break;
				}
			}

			return form;
		}

		// Fetch form elements.

	}, {
		key: "fetch_all_form_data",
		value: function fetch_all_form_data() {
			var form = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];


			// Check if we have a form.  If we do, grab all elements for this form.

			if (form) {
				form.elements = {

					input: [],
					drop_down: [],
					checkbox_radio: [],
					numbers: [],
					misc: []

				};

				var settings = ProBoards_Post_Forms.SETTINGS;

				// Fetch all input fields for this form

				var input_fields = settings.input_fields;

				for (var e = 0, el = input_fields.length; e < el; ++e) {
					if (this.form_related(form.unique_id, input_fields[e].form_ids)) {
						form.elements.input.push(input_fields[e]);
					}
				}

				// Fetch all drop downs for this form

				var drop_downs = settings.drop_downs;

				for (var _e = 0, _el = drop_downs.length; _e < _el; ++_e) {
					if (this.form_related(form.unique_id, drop_downs[_e].form_ids)) {
						form.elements.drop_down.push(drop_downs[_e]);
					}
				}

				// Fetch all checkboxes for this form

				var checkboxes_radios = settings.checkboxes_radios;

				for (var _e2 = 0, _el2 = checkboxes_radios.length; _e2 < _el2; ++_e2) {
					if (this.form_related(form.unique_id, checkboxes_radios[_e2].form_ids)) {
						form.elements.checkbox_radio.push(checkboxes_radios[_e2]);
					}
				}

				// Fetch all number fields for this form

				var numbers = settings.numbers;

				for (var _e3 = 0, _el3 = numbers.length; _e3 < _el3; ++_e3) {
					if (this.form_related(form.unique_id, numbers[_e3].form_ids)) {
						form.elements.numbers.push(numbers[_e3]);
					}
				}

				// Fetch all misc elements for this form

				var misc = settings.misc;

				for (var _e4 = 0, _el4 = misc.length; _e4 < _el4; ++_e4) {
					if (this.form_related(form.unique_id, misc[_e4].form_ids)) {
						form.elements.misc.push(misc[_e4]);
					}
				}

				// No elements?  null out the form variable.

				if (!form.elements.input || !form.elements.drop_down || !form.elements.checkbox_radio || !form.elements.misc) {
					form = null;
				} else {
					form.template = this.fetch_form_template(form.unique_id);
				}
			}

			return form;
		}
	}, {
		key: "fetch_form_template",
		value: function fetch_form_template(form_id) {
			var template = null;
			var templates = ProBoards_Post_Forms.SETTINGS.templates;

			for (var t = 0, tl = templates.length; t < tl; ++t) {
				if (templates[t].form_id == form_id) {
					template = templates[t].template;
					break;
				}
			}

			return template;
		}

		// Elements can be shared between forms, so the input may contain
		// multiple form elements.  Compare against the form id to see if
		// we have a match.

	}, {
		key: "form_related",
		value: function form_related(form_id, form_ids) {
			if (form_id && form_ids) {
				var ids = form_ids.split(",");

				ids = Array.isArray(ids) ? ids : [ids];

				if (ids.find(function (id) {
					return id.replace(/ /g, "") == form_id;
				})) {
					return true;
				}
			}

			return false;
		}
	}]);

	return _class;
}();

/**
 * @TODO: Consider passing template bool to the classes to prevent some
 * of the assignments, as they won't be used if a template is going to be parsed.
 *
 * @TODO: Consider running final template through a last parser to strip left over
 * template variables.
 */

ProBoards_Post_Forms.Form = function () {
	function _class2() {
		var form = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, _class2);

		this.form_data = form;
		this.has_elements = false;
		this.$wrapper = $("<div id='pd-post-form' class='pd-post-form post-form-" + this.form_data.unique_id + "'></div>");

		this.$wysiwyg_container = $(".wysiwyg-area");
		this.$title = this.$wysiwyg_container.find("div.title-bar h2");
		this.$content_container = this.$wysiwyg_container.find("div.content:first");
		this.$pb_form = this.$wysiwyg_container.find("form:first");
		this.$pb_submit = this.$pb_form.find("input[type=submit]");

		this.using_template = false;

		if (this.form_data.template && this.form_data.template.length) {
			this.using_template = true;
		}

		this.build_form();
	}

	_createClass(_class2, [{
		key: "build_inputs",
		value: function build_inputs() {
			var inputs = [];

			for (var i = 0, l = this.form_data.elements.input.length; i < l; ++i) {
				inputs.push(new ProBoards_Post_Forms.Input(this.form_data.elements.input[i]));
			}

			return inputs;
		}
	}, {
		key: "build_drop_downs",
		value: function build_drop_downs() {
			var drop_downs = [];

			for (var i = 0, l = this.form_data.elements.drop_down.length; i < l; ++i) {
				drop_downs.push(new ProBoards_Post_Forms.Drop_Down(this.form_data.elements.drop_down[i]));
			}

			return drop_downs;
		}
	}, {
		key: "build_checkboxes_radios",
		value: function build_checkboxes_radios() {
			var checkboxes_radios = [];
			var group_checkboxes_radios = {};

			for (var i = 0, l = this.form_data.elements.checkbox_radio.length; i < l; ++i) {
				var the_input = this.form_data.elements.checkbox_radio[i];

				if (the_input.group_id.length) {
					if (!group_checkboxes_radios[the_input.group_id]) {
						group_checkboxes_radios[the_input.group_id] = [];
					}

					group_checkboxes_radios[the_input.group_id].push(the_input);
				} else {
					checkboxes_radios.push(new ProBoards_Post_Forms.Checkbox_Radio(the_input));
				}
			}

			// Grouping

			if (group_checkboxes_radios) {
				for (var id in group_checkboxes_radios) {
					if (group_checkboxes_radios.hasOwnProperty(id)) {
						checkboxes_radios.push(new ProBoards_Post_Forms.Checkbox_Radio_Group(group_checkboxes_radios[id]));
					}
				}
			}

			return checkboxes_radios;
		}
	}, {
		key: "build_misc",
		value: function build_misc() {
			var misc = [];

			for (var i = 0, l = this.form_data.elements.misc.length; i < l; ++i) {
				if (this.form_data.elements.misc[i].field_type == 1) {
					misc.push(new ProBoards_Post_Forms.Color_Picker(this.form_data.elements.misc[i]));
				}
			}

			return misc;
		}
	}, {
		key: "build_number_inputs",
		value: function build_number_inputs() {
			var number_inputs = [];

			for (var i = 0, l = this.form_data.elements.numbers.length; i < l; ++i) {
				number_inputs.push(new ProBoards_Post_Forms.Number_Input(this.form_data.elements.numbers[i]));
			}

			return number_inputs;
		}
	}, {
		key: "create_submit_button",
		value: function create_submit_button() {
			var _this = this;

			var $button = $("<button>Submit Form</button>");

			$button.on("click", function () {
				_this.$pb_submit.trigger("click");
			});

			this.$wrapper.append($button);
		}
	}, {
		key: "create_reset_button",
		value: function create_reset_button() {
			var $button = $("<input type='reset' value='Reset' />");

			this.$wrapper.append($button);
		}
	}, {
		key: "build_form",
		value: function build_form() {
			var $html = $("<div></div>");
			var template = this.form_data.template;
			var form_fields = [];

			form_fields = form_fields.concat(this.build_inputs());
			form_fields = form_fields.concat(this.build_drop_downs());
			form_fields = form_fields.concat(this.build_checkboxes_radios());
			form_fields = form_fields.concat(this.build_number_inputs());
			form_fields = form_fields.concat(this.build_misc());

			ProBoards_Post_Forms.sort_by_order(form_fields);

			if (!form_fields.length) {
				return;
			}

			this.has_elements = true;

			for (var i = 0; i < form_fields.length; ++i) {
				if (this.using_template) {
					template = form_fields[i].parse(template);
				} else {
					$html.append(form_fields[i].label + form_fields[i].field + "<br />");
				}
			}

			if (this.using_template) {
				$html = $html.append(template);
			}

			this.$wrapper.append($html);

			// Could use HTML 5 colour picker, but IE 11...

			this.$wrapper.find("input.post-form-color-picker").colorPicker({

				hex: "000000",
				allowTransparent: true,
				autoOpen: false,
				autoUpdate: false,
				update: function update(value) {
					$(this).val("#" + value);
					$(this).colorPicker("hide");
				}

			}).on("click", function () {
				$(this).colorPicker("open");
			});
		}

		// Only render form if there are elements

	}, {
		key: "render",
		value: function render() {
			if (this.has_elements) {
				this.$title.html(this.form_data.title);
				this.$pb_form.hide();
				this.create_reset_button();
				this.create_submit_button();
				this.$content_container.append(this.$wrapper);
			}
		}
	}]);

	return _class2;
}();

ProBoards_Post_Forms.Element = function () {
	function _class3(data) {
		_classCallCheck(this, _class3);

		this.data = data;
		this.id = +new Date();

		this.label_html = "";
		this.field_html = "";
	}

	_createClass(_class3, [{
		key: "create_field",
		value: function create_field() {
			console.warn("Abstract method \"create_field\". You need to override it in sub class with your own implementation");
		}
	}, {
		key: "create_label",
		value: function create_label() {
			console.warn("Abstract method \"create_label\". You need to override it in sub class with your own implementation");
		}
	}, {
		key: "parse",
		value: function parse() {
			console.warn("Abtract method \"parser\".  You need to override it in the sub class with your own implementation.");
		}
	}, {
		key: "name",
		get: function get() {
			return this.data.name;
		}
	}, {
		key: "order",
		get: function get() {
			return this.data.order;
		}
	}, {
		key: "type",
		get: function get() {
			return this.data.type;
		}
	}, {
		key: "label",
		get: function get() {
			return this.label_html;
		}
	}, {
		key: "field",
		get: function get() {
			return this.field_html;
		}
	}]);

	return _class3;
}();

ProBoards_Post_Forms.Input = function (_ProBoards_Post_Forms) {
	_inherits(_class4, _ProBoards_Post_Forms);

	function _class4() {
		var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, _class4);

		var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class4).call(this, data));

		_this2.create_label();
		_this2.create_field();
		return _this2;
	}

	_createClass(_class4, [{
		key: "create_label",
		value: function create_label() {
			this.label_html = "<label for='input-field-" + this.data.id + "'>" + this.data.name + ":</label>";
		}
	}, {
		key: "create_field",
		value: function create_field() {
			switch (parseInt(this.data.type, 10)) {

				case 1:
					this.field_html = "<input type='text' name='input-field-" + this.data.id + "' />";

					break;

				case 2:
					this.field_html = "<textarea name='input-field-" + this.data.id + "'></textarea>";

					break;

			}
		}
	}, {
		key: "parse",
		value: function parse(template) {
			template = template.replace("$[" + this.data.id + ".name]", this.data.name);
			template = template.replace("$[" + this.data.id + ".field]", this.field_html);
			template = template.replace("$[" + this.data.id + ".id]", this.data.id);
			template = template.replace("$[" + this.data.id + ".order]", this.data.order);

			return template;
		}
	}]);

	return _class4;
}(ProBoards_Post_Forms.Element);

ProBoards_Post_Forms.Drop_Down = function (_ProBoards_Post_Forms2) {
	_inherits(_class5, _ProBoards_Post_Forms2);

	function _class5() {
		var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, _class5);

		var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class5).call(this, data));

		_this3.create_label();
		_this3.create_field();
		return _this3;
	}

	_createClass(_class5, [{
		key: "create_label",
		value: function create_label() {
			this.label_html = "<label for='drop-down-field-" + this.data.id + "'>" + this.data.name + ":</label>";
		}
	}, {
		key: "create_field",
		value: function create_field() {
			var multiple = parseInt(this.data.multiple, 10) == 1 ? " multiple='multiple'" : "";
			var size = parseInt(this.data.multiple_size, 10) ? parseInt(this.data.multiple_size, 10) : 1;

			size = multiple.length && size ? " size='" + size + "'" : "";

			this.field_html = "<select" + size + multiple + " name='drop-down-field-" + this.data.id + "'>" + this.create_options() + "</select>";
		}
	}, {
		key: "create_options",
		value: function create_options() {
			var options = this.data.options.split(/\n/g);
			var options_html = this.data.multiple ? "" : "<option value=''> </option>";

			for (var o = 0, ol = options.length; o < ol; ++o) {
				if (options[o].match(/^\[group=(.+)?\]/i)) {
					var label = RegExp.$1;

					options_html += "<optgroup label='" + pb.text.escape_html(label) + "'>";
				} else if (options[o].toLowerCase() == "[/group]") {
					options_html += "</optgroup>";
				} else {
					options_html += "<option value='" + o + "'>" + options[o] + "</option>";
				}
			}

			return options_html;
		}
	}, {
		key: "parse",
		value: function parse(template) {
			template = template.replace("$[" + this.data.id + ".name]", this.data.name);
			template = template.replace("$[" + this.data.id + ".field]", this.field_html);
			template = template.replace("$[" + this.data.id + ".id]", this.data.id);
			template = template.replace("$[" + this.data.id + ".order]", this.data.order);
			template = template.replace("$[" + this.data.id + ".multiple_size]", this.data.multiple_size);
			template = template.replace("$[" + this.data.id + ".multiple_answers]", this.data.multiple);

			return template;
		}
	}]);

	return _class5;
}(ProBoards_Post_Forms.Element);

ProBoards_Post_Forms.Checkbox_Radio = function (_ProBoards_Post_Forms3) {
	_inherits(_class6, _ProBoards_Post_Forms3);

	function _class6() {
		var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, _class6);

		var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class6).call(this, data));

		_this4.create_label();
		_this4.create_field();
		return _this4;
	}

	_createClass(_class6, [{
		key: "create_label",
		value: function create_label() {
			this.label_for = parseInt(this.data.type, 10) == 1 ? "checkbox" : "radio";

			this.label_html = "<label for='" + this.label_for + "-field-" + this.data.id + "'>" + this.data.name + ":</label>";
		}
	}, {
		key: "create_field",
		value: function create_field() {
			switch (parseInt(this.data.type, 10)) {

				case 1:
					this.field_html = "<input type='checkbox' name='checkbox-field-" + this.data.id + "' value='" + this.data.value + "' />";

					break;

				case 2:
					this.field_html = "<input type='radio' name='radio-field-" + this.data.id + "' value='" + this.data.value + "' />";

					break;
			}
		}
	}, {
		key: "parse",
		value: function parse(template) {
			template = template.replace("$[" + this.data.id + ".name]", this.data.name);
			template = template.replace("$[" + this.data.id + ".id]", this.data.id);
			template = template.replace("$[" + this.data.id + ".field]", this.field_html);
			template = template.replace("$[" + this.data.id + ".order]", this.data.order);
			template = template.replace("$[" + this.data.id + ".value]", this.data.value);

			return template;
		}
	}]);

	return _class6;
}(ProBoards_Post_Forms.Element);

ProBoards_Post_Forms.Checkbox_Radio_Group = function (_ProBoards_Post_Forms4) {
	_inherits(_class7, _ProBoards_Post_Forms4);

	function _class7() {
		var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, _class7);

		var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class7).call(this, data));

		_this5.create_label();
		_this5.create_field();
		return _this5;
	}

	_createClass(_class7, [{
		key: "create_label",
		value: function create_label() {
			var label_for = parseInt(this.data[0].type, 10) == 1 ? "checkbox" : "radio";

			this.field_for = label_for;
			this.label_html = "<label for='" + label_for + "-field-grp-" + this.data[0].group_id + "'>" + this.data[0].group_label + ":</label>";
		}
	}, {
		key: "create_field",
		value: function create_field() {
			var html = "";

			ProBoards_Post_Forms.sort_by_order(this.data, true);

			for (var f = 0, fl = this.data.length; f < fl; ++f) {
				html += this.data[f].name + ": ";

				html += this.create_field_html(this.data[f]);
			}

			this.field_html = html;
		}
	}, {
		key: "create_field_html",
		value: function create_field_html(field_data) {
			switch (parseInt(field_data.type, 10)) {

				case 1:
					return "<input type='checkbox' name='" + this.field_for + "-field-grp-" + this.data[0].group_id + "' value='" + field_data.value + "' />";

					break;

				case 2:
					return "<input type='radio' name='" + this.field_for + "-field-grp-" + this.data[0].group_id + "' value='" + field_data + "' />";

					break;
			}
		}
	}, {
		key: "parse",
		value: function parse(template) {
			var grp_id = this.data[0].group_id;

			template = template.replace("$[" + grp_id + ".group_label]", this.data[0].group_label);
			template = template.replace("$[" + grp_id + ".group_id]", this.data[0].group_id);
			template = template.replace("$[" + grp_id + ".field]", this.field_html);

			for (var f = 0, fl = this.data.length; f < fl; ++f) {
				var pattern = "\\$\\[" + grp_id + "\\.(" + f + "|" + this.data[f].id + ")\\.";

				template = template.replace(new RegExp(pattern + "id]", "g"), this.data[f].id);
				template = template.replace(new RegExp(pattern + "order]", "g"), this.data[f].order);
				template = template.replace(new RegExp(pattern + "value]", "g"), this.data[f].value);
				template = template.replace(new RegExp(pattern + "name]", "g"), this.data[f].name);
				template = template.replace(new RegExp(pattern + "field]", "g"), this.create_field_html(this.data[f]));
			}

			return template;
		}
	}]);

	return _class7;
}(ProBoards_Post_Forms.Element);

ProBoards_Post_Forms.Color_Picker = function (_ProBoards_Post_Forms5) {
	_inherits(_class8, _ProBoards_Post_Forms5);

	function _class8() {
		var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, _class8);

		var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class8).call(this, data));

		_this6.create_label();
		_this6.create_field();
		return _this6;
	}

	_createClass(_class8, [{
		key: "create_label",
		value: function create_label() {
			this.label_html = "<label for='color-picker-field-" + this.data.id + "'>" + this.data.name + ":</label>";
		}
	}, {
		key: "create_field",
		value: function create_field() {
			this.field_html = "<input type='text' name='color-picker-field-" + this.data.id + "' value='' placeholder='' class='post-form-color-picker' />";
		}
	}, {
		key: "parse",
		value: function parse(template) {
			template = template.replace("$[" + this.data.id + ".name]", this.data.name);
			template = template.replace("$[" + this.data.id + ".field]", this.field_html);

			return template;
		}
	}]);

	return _class8;
}(ProBoards_Post_Forms.Element);

ProBoards_Post_Forms.Number_Input = function (_ProBoards_Post_Forms6) {
	_inherits(_class9, _ProBoards_Post_Forms6);

	function _class9() {
		var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

		_classCallCheck(this, _class9);

		var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(_class9).call(this, data));

		_this7.create_label();
		_this7.create_field();
		return _this7;
	}

	_createClass(_class9, [{
		key: "create_label",
		value: function create_label() {
			this.field_for = parseInt(this.data.type, 10) == 1 ? "number" : "range";;
			this.label_html = "<label for='" + this.field_for + "-field-" + this.data.id + "'>" + this.data.name + ":</label>";
		}
	}, {
		key: "create_field",
		value: function create_field() {
			var min = " min='" + this.data.min + "'";
			var max = " max='" + this.data.max + "'";

			this.field_html = "<input" + min + max + " type='" + this.field_for + "' name='" + this.field_for + "-input-field-" + this.data.id + "' />";

			if (this.data.show_value) {
				this.field_html += " <span id='" + this.field_for + "-input-field-val-" + this.data.id + "'></span>";
			}
		}
	}, {
		key: "parse",
		value: function parse(template) {
			template = template.replace("$[" + this.data.id + ".name]", this.data.name);
			template = template.replace("$[" + this.data.id + ".id]", this.data.id);
			template = template.replace("$[" + this.data.id + ".field]", this.field_html);
			template = template.replace("$[" + this.data.id + ".min]", this.data.min);
			template = template.replace("$[" + this.data.id + ".max]", this.data.max);

			return template;
		}
	}]);

	return _class9;
}(ProBoards_Post_Forms.Element);


ProBoards_Post_Forms.init();