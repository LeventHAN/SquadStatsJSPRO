﻿/*
 Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
CKEDITOR.plugins.add("forms", {
	requires: "dialog,fakeobjects",
	lang:
		"af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn",
	icons:
		"button,checkbox,form,hiddenfield,imagebutton,radio,select,select-rtl,textarea,textarea-rtl,textfield",
	hidpi: !0,
	onLoad: function () {
		CKEDITOR.addCss(
			".cke_editable form{border: 1px dotted #FF0000;padding: 2px;}\n"
		);
		CKEDITOR.addCss(
			"img.cke_hidden{background-image: url(" +
				CKEDITOR.getUrl(this.path + "images/hiddenfield.gif") +
				");background-position: center center;background-repeat: no-repeat;border: 1px solid #a9a9a9;width: 16px !important;height: 16px !important;}"
		);
	},
	init: function (b) {
		var a = b.lang,
			g = 0,
			h = { email: 1, password: 1, search: 1, tel: 1, text: 1, url: 1 },
			l = {
				checkbox: "input[type,name,checked,required]",
				radio: "input[type,name,checked,required]",
				textfield: "input[type,name,value,size,maxlength,required]",
				textarea: "textarea[cols,rows,name,required]",
				select: "select[name,size,multiple,required]; option[value,selected]",
				button: "input[type,name,value]",
				form: "form[action,name,id,enctype,target,method]",
				hiddenfield: "input[type,name,value]",
				imagebutton:
					"input[type,alt,src]{width,height,border,border-width,border-style,margin,float}",
			},
			m = {
				checkbox: "input",
				radio: "input",
				textfield: "input",
				textarea: "textarea",
				select: "select",
				button: "input",
				form: "form",
				hiddenfield: "input",
				imagebutton: "input",
			},
			d = function (f, c, d) {
				var h = { allowedContent: l[c], requiredContent: m[c] };
				"form" == c && (h.context = "form");
				b.addCommand(c, new CKEDITOR.dialogCommand(c, h));
				b.ui.addButton &&
					b.ui.addButton(f, {
						label: a.common[f.charAt(0).toLowerCase() + f.slice(1)],
						command: c,
						toolbar: "forms," + (g += 10),
					});
				CKEDITOR.dialog.add(c, d);
			},
			e = this.path + "dialogs/";
		!b.blockless && d("Form", "form", e + "form.js");
		d("Checkbox", "checkbox", e + "checkbox.js");
		d("Radio", "radio", e + "radio.js");
		d("TextField", "textfield", e + "textfield.js");
		d("Textarea", "textarea", e + "textarea.js");
		d("Select", "select", e + "select.js");
		d("Button", "button", e + "button.js");
		var k = b.plugins.image;
		k &&
			!b.plugins.image2 &&
			d(
				"ImageButton",
				"imagebutton",
				CKEDITOR.plugins.getPath("image") + "dialogs/image.js"
			);
		d("HiddenField", "hiddenfield", e + "hiddenfield.js");
		b.addMenuItems &&
			((d = {
				checkbox: {
					label: a.forms.checkboxAndRadio.checkboxTitle,
					command: "checkbox",
					group: "checkbox",
				},
				radio: {
					label: a.forms.checkboxAndRadio.radioTitle,
					command: "radio",
					group: "radio",
				},
				textfield: {
					label: a.forms.textfield.title,
					command: "textfield",
					group: "textfield",
				},
				hiddenfield: {
					label: a.forms.hidden.title,
					command: "hiddenfield",
					group: "hiddenfield",
				},
				button: {
					label: a.forms.button.title,
					command: "button",
					group: "button",
				},
				select: {
					label: a.forms.select.title,
					command: "select",
					group: "select",
				},
				textarea: {
					label: a.forms.textarea.title,
					command: "textarea",
					group: "textarea",
				},
			}),
			k &&
				(d.imagebutton = {
					label: a.image.titleButton,
					command: "imagebutton",
					group: "imagebutton",
				}),
			!b.blockless &&
				(d.form = { label: a.forms.form.menu, command: "form", group: "form" }),
			b.addMenuItems(d));
		b.contextMenu &&
			(!b.blockless &&
				b.contextMenu.addListener(function (f, c, b) {
					if ((f = b.contains("form", 1)) && !f.isReadOnly())
						return { form: CKEDITOR.TRISTATE_OFF };
				}),
			b.contextMenu.addListener(function (b) {
				if (b && !b.isReadOnly()) {
					var c = b.getName();
					if ("select" == c) return { select: CKEDITOR.TRISTATE_OFF };
					if ("textarea" == c) return { textarea: CKEDITOR.TRISTATE_OFF };
					if ("input" == c) {
						var a = b.getAttribute("type") || "text";
						switch (a) {
							case "button":
							case "submit":
							case "reset":
								return { button: CKEDITOR.TRISTATE_OFF };
							case "checkbox":
								return { checkbox: CKEDITOR.TRISTATE_OFF };
							case "radio":
								return { radio: CKEDITOR.TRISTATE_OFF };
							case "image":
								return k ? { imagebutton: CKEDITOR.TRISTATE_OFF } : null;
						}
						if (h[a]) return { textfield: CKEDITOR.TRISTATE_OFF };
					}
					if ("img" == c && "hiddenfield" == b.data("cke-real-element-type"))
						return { hiddenfield: CKEDITOR.TRISTATE_OFF };
				}
			}));
		b.on("doubleclick", function (a) {
			var c = a.data.element;
			if (!b.blockless && c.is("form")) a.data.dialog = "form";
			else if (c.is("select")) a.data.dialog = "select";
			else if (c.is("textarea")) a.data.dialog = "textarea";
			else if (c.is("img") && "hiddenfield" == c.data("cke-real-element-type"))
				a.data.dialog = "hiddenfield";
			else if (c.is("input")) {
				c = c.getAttribute("type") || "text";
				switch (c) {
					case "button":
					case "submit":
					case "reset":
						a.data.dialog = "button";
						break;
					case "checkbox":
						a.data.dialog = "checkbox";
						break;
					case "radio":
						a.data.dialog = "radio";
						break;
					case "image":
						a.data.dialog = "imagebutton";
				}
				h[c] && (a.data.dialog = "textfield");
			}
		});
	},
	afterInit: function (b) {
		var a = b.dataProcessor,
			g = a && a.htmlFilter,
			a = a && a.dataFilter;
		CKEDITOR.env.ie &&
			g &&
			g.addRules(
				{
					elements: {
						input: function (a) {
							a = a.attributes;
							var b = a.type;
							b || (a.type = "text");
							("checkbox" != b && "radio" != b) ||
								"on" != a.value ||
								delete a.value;
						},
					},
				},
				{ applyToAll: !0 }
			);
		a &&
			a.addRules(
				{
					elements: {
						input: function (a) {
							if ("hidden" == a.attributes.type)
								return b.createFakeParserElement(
									a,
									"cke_hidden",
									"hiddenfield"
								);
						},
					},
				},
				{ applyToAll: !0 }
			);
	},
});
CKEDITOR.plugins.forms = {
	_setupRequiredAttribute: function (b) {
		this.setValue(b.hasAttribute("required"));
	},
};
