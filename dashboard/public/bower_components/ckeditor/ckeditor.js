﻿/*
Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function () {
	(window.CKEDITOR && window.CKEDITOR.dom) ||
		(window.CKEDITOR ||
			(window.CKEDITOR = (function () {
				var a = /(^|.*[\\\/])ckeditor\.js(?:\?.*|;.*)?$/i,
					d = {
						timestamp: "J0AG",
						version: "4.11.2 (Standard)",
						revision: "7f3189e83",
						rnd: Math.floor(900 * Math.random()) + 100,
						_: { pending: [], basePathSrcPattern: a },
						status: "unloaded",
						basePath: (function () {
							var c = window.CKEDITOR_BASEPATH || "";
							if (!c)
								for (
									var b = document.getElementsByTagName("script"), d = 0;
									d < b.length;
									d++
								) {
									var h = b[d].src.match(a);
									if (h) {
										c = h[1];
										break;
									}
								}
							-1 == c.indexOf(":/") &&
								"//" != c.slice(0, 2) &&
								(c =
									0 === c.indexOf("/")
										? location.href.match(/^.*?:\/\/[^\/]*/)[0] + c
										: location.href.match(/^[^\?]*\/(?:)/)[0] + c);
							if (!c)
								throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
							return c;
						})(),
						getUrl: function (a) {
							-1 == a.indexOf(":/") &&
								0 !== a.indexOf("/") &&
								(a = this.basePath + a);
							this.timestamp &&
								"/" != a.charAt(a.length - 1) &&
								!/[&?]t=/.test(a) &&
								(a +=
									(0 <= a.indexOf("?") ? "\x26" : "?") +
									"t\x3d" +
									this.timestamp);
							return a;
						},
						domReady: (function () {
							function a() {
								try {
									document.addEventListener
										? (document.removeEventListener("DOMContentLoaded", a, !1),
										  c())
										: document.attachEvent &&
										  "complete" === document.readyState &&
										  (document.detachEvent("onreadystatechange", a), c());
								} catch (h) {}
							}
							function c() {
								for (var a; (a = b.shift()); ) a();
							}
							var b = [];
							return function (c) {
								function e() {
									try {
										document.documentElement.doScroll("left");
									} catch (f) {
										setTimeout(e, 1);
										return;
									}
									a();
								}
								b.push(c);
								"complete" === document.readyState && setTimeout(a, 1);
								if (1 == b.length)
									if (document.addEventListener)
										document.addEventListener("DOMContentLoaded", a, !1),
											window.addEventListener("load", a, !1);
									else if (document.attachEvent) {
										document.attachEvent("onreadystatechange", a);
										window.attachEvent("onload", a);
										c = !1;
										try {
											c = !window.frameElement;
										} catch (m) {}
										document.documentElement.doScroll && c && e();
									}
							};
						})(),
					},
					b = window.CKEDITOR_GETURL;
				if (b) {
					var c = d.getUrl;
					d.getUrl = function (a) {
						return b.call(d, a) || c.call(d, a);
					};
				}
				return d;
			})()),
		CKEDITOR.event ||
			((CKEDITOR.event = function () {}),
			(CKEDITOR.event.implementOn = function (a) {
				var d = CKEDITOR.event.prototype,
					b;
				for (b in d) null == a[b] && (a[b] = d[b]);
			}),
			(CKEDITOR.event.prototype = (function () {
				function a(a) {
					var g = d(this);
					return g[a] || (g[a] = new b(a));
				}
				var d = function (a) {
						a = (a.getPrivate && a.getPrivate()) || a._ || (a._ = {});
						return a.events || (a.events = {});
					},
					b = function (a) {
						this.name = a;
						this.listeners = [];
					};
				b.prototype = {
					getListenerIndex: function (a) {
						for (var b = 0, d = this.listeners; b < d.length; b++)
							if (d[b].fn == a) return b;
						return -1;
					},
				};
				return {
					define: function (c, b) {
						var d = a.call(this, c);
						CKEDITOR.tools.extend(d, b, !0);
					},
					on: function (c, b, d, k, h) {
						function e(a, f, n, e) {
							a = {
								name: c,
								sender: this,
								editor: a,
								data: f,
								listenerData: k,
								stop: n,
								cancel: e,
								removeListener: m,
							};
							return !1 === b.call(d, a) ? !1 : a.data;
						}
						function m() {
							n.removeListener(c, b);
						}
						var f = a.call(this, c);
						if (0 > f.getListenerIndex(b)) {
							f = f.listeners;
							d || (d = this);
							isNaN(h) && (h = 10);
							var n = this;
							e.fn = b;
							e.priority = h;
							for (var r = f.length - 1; 0 <= r; r--)
								if (f[r].priority <= h)
									return f.splice(r + 1, 0, e), { removeListener: m };
							f.unshift(e);
						}
						return { removeListener: m };
					},
					once: function () {
						var a = Array.prototype.slice.call(arguments),
							b = a[1];
						a[1] = function (a) {
							a.removeListener();
							return b.apply(this, arguments);
						};
						return this.on.apply(this, a);
					},
					capture: function () {
						CKEDITOR.event.useCapture = 1;
						var a = this.on.apply(this, arguments);
						CKEDITOR.event.useCapture = 0;
						return a;
					},
					fire: (function () {
						var a = 0,
							b = function () {
								a = 1;
							},
							l = 0,
							k = function () {
								l = 1;
							};
						return function (h, e, m) {
							var f = d(this)[h];
							h = a;
							var n = l;
							a = l = 0;
							if (f) {
								var r = f.listeners;
								if (r.length)
									for (var r = r.slice(0), x, v = 0; v < r.length; v++) {
										if (f.errorProof)
											try {
												x = r[v].call(this, m, e, b, k);
											} catch (p) {}
										else x = r[v].call(this, m, e, b, k);
										!1 === x ? (l = 1) : "undefined" != typeof x && (e = x);
										if (a || l) break;
									}
							}
							e = l ? !1 : "undefined" == typeof e ? !0 : e;
							a = h;
							l = n;
							return e;
						};
					})(),
					fireOnce: function (a, b, l) {
						b = this.fire(a, b, l);
						delete d(this)[a];
						return b;
					},
					removeListener: function (a, b) {
						var l = d(this)[a];
						if (l) {
							var k = l.getListenerIndex(b);
							0 <= k && l.listeners.splice(k, 1);
						}
					},
					removeAllListeners: function () {
						var a = d(this),
							b;
						for (b in a) delete a[b];
					},
					hasListeners: function (a) {
						return (a = d(this)[a]) && 0 < a.listeners.length;
					},
				};
			})())),
		CKEDITOR.editor ||
			((CKEDITOR.editor = function () {
				CKEDITOR._.pending.push([this, arguments]);
				CKEDITOR.event.call(this);
			}),
			(CKEDITOR.editor.prototype.fire = function (a, d) {
				a in { instanceReady: 1, loaded: 1 } && (this[a] = !0);
				return CKEDITOR.event.prototype.fire.call(this, a, d, this);
			}),
			(CKEDITOR.editor.prototype.fireOnce = function (a, d) {
				a in { instanceReady: 1, loaded: 1 } && (this[a] = !0);
				return CKEDITOR.event.prototype.fireOnce.call(this, a, d, this);
			}),
			CKEDITOR.event.implementOn(CKEDITOR.editor.prototype)),
		CKEDITOR.env ||
			(CKEDITOR.env = (function () {
				var a = navigator.userAgent.toLowerCase(),
					d = a.match(/edge[ \/](\d+.?\d*)/),
					b = -1 < a.indexOf("trident/"),
					b = !(!d && !b),
					b = {
						ie: b,
						edge: !!d,
						webkit: !b && -1 < a.indexOf(" applewebkit/"),
						air: -1 < a.indexOf(" adobeair/"),
						mac: -1 < a.indexOf("macintosh"),
						quirks:
							"BackCompat" == document.compatMode &&
							(!document.documentMode || 10 > document.documentMode),
						mobile: -1 < a.indexOf("mobile"),
						iOS: /(ipad|iphone|ipod)/.test(a),
						isCustomDomain: function () {
							if (!this.ie) return !1;
							var a = document.domain,
								b = window.location.hostname;
							return a != b && a != "[" + b + "]";
						},
						secure: "https:" == location.protocol,
					};
				b.gecko = "Gecko" == navigator.product && !b.webkit && !b.ie;
				b.webkit &&
					(-1 < a.indexOf("chrome") ? (b.chrome = !0) : (b.safari = !0));
				var c = 0;
				b.ie &&
					((c = d
						? parseFloat(d[1])
						: b.quirks || !document.documentMode
						? parseFloat(a.match(/msie (\d+)/)[1])
						: document.documentMode),
					(b.ie9Compat = 9 == c),
					(b.ie8Compat = 8 == c),
					(b.ie7Compat = 7 == c),
					(b.ie6Compat = 7 > c || b.quirks));
				b.gecko &&
					(d = a.match(/rv:([\d\.]+)/)) &&
					((d = d[1].split(".")),
					(c = 1e4 * d[0] + 100 * (d[1] || 0) + 1 * (d[2] || 0)));
				b.air && (c = parseFloat(a.match(/ adobeair\/(\d+)/)[1]));
				b.webkit && (c = parseFloat(a.match(/ applewebkit\/(\d+)/)[1]));
				b.version = c;
				b.isCompatible =
					!(b.ie && 7 > c) && !(b.gecko && 4e4 > c) && !(b.webkit && 534 > c);
				b.hidpi = 2 <= window.devicePixelRatio;
				b.needsBrFiller = b.gecko || b.webkit || (b.ie && 10 < c);
				b.needsNbspFiller = b.ie && 11 > c;
				b.cssClass =
					"cke_browser_" +
					(b.ie ? "ie" : b.gecko ? "gecko" : b.webkit ? "webkit" : "unknown");
				b.quirks && (b.cssClass += " cke_browser_quirks");
				b.ie &&
					(b.cssClass +=
						" cke_browser_ie" +
						(b.quirks ? "6 cke_browser_iequirks" : b.version));
				b.air && (b.cssClass += " cke_browser_air");
				b.iOS && (b.cssClass += " cke_browser_ios");
				b.hidpi && (b.cssClass += " cke_hidpi");
				return b;
			})()),
		"unloaded" == CKEDITOR.status &&
			(function () {
				CKEDITOR.event.implementOn(CKEDITOR);
				CKEDITOR.loadFullCore = function () {
					if ("basic_ready" != CKEDITOR.status) CKEDITOR.loadFullCore._load = 1;
					else {
						delete CKEDITOR.loadFullCore;
						var a = document.createElement("script");
						a.type = "text/javascript";
						a.src = CKEDITOR.basePath + "ckeditor.js";
						document.getElementsByTagName("head")[0].appendChild(a);
					}
				};
				CKEDITOR.loadFullCoreTimeout = 0;
				CKEDITOR.add = function (a) {
					(this._.pending || (this._.pending = [])).push(a);
				};
				(function () {
					CKEDITOR.domReady(function () {
						var a = CKEDITOR.loadFullCore,
							d = CKEDITOR.loadFullCoreTimeout;
						a &&
							((CKEDITOR.status = "basic_ready"),
							a && a._load
								? a()
								: d &&
								  setTimeout(function () {
										CKEDITOR.loadFullCore && CKEDITOR.loadFullCore();
								  }, 1e3 * d));
					});
				})();
				CKEDITOR.status = "basic_loaded";
			})(),
		"use strict",
		(CKEDITOR.VERBOSITY_WARN = 1),
		(CKEDITOR.VERBOSITY_ERROR = 2),
		(CKEDITOR.verbosity = CKEDITOR.VERBOSITY_WARN | CKEDITOR.VERBOSITY_ERROR),
		(CKEDITOR.warn = function (a, d) {
			CKEDITOR.verbosity & CKEDITOR.VERBOSITY_WARN &&
				CKEDITOR.fire("log", { type: "warn", errorCode: a, additionalData: d });
		}),
		(CKEDITOR.error = function (a, d) {
			CKEDITOR.verbosity & CKEDITOR.VERBOSITY_ERROR &&
				CKEDITOR.fire("log", {
					type: "error",
					errorCode: a,
					additionalData: d,
				});
		}),
		CKEDITOR.on(
			"log",
			function (a) {
				if (window.console && window.console.log) {
					var d = console[a.data.type] ? a.data.type : "log",
						b = a.data.errorCode;
					if ((a = a.data.additionalData))
						console[d]("[CKEDITOR] Error code: " + b + ".", a);
					else console[d]("[CKEDITOR] Error code: " + b + ".");
					console[d](
						"[CKEDITOR] For more information about this error go to https://ckeditor.com/docs/ckeditor4/latest/guide/dev_errors.html#" +
							b
					);
				}
			},
			null,
			null,
			999
		),
		(CKEDITOR.dom = {}),
		(function () {
			function a(a, f, b) {
				this._minInterval = a;
				this._context = b;
				this._lastOutput = this._scheduledTimer = 0;
				this._output = CKEDITOR.tools.bind(f, b || {});
				var e = this;
				this.input = function () {
					function a() {
						e._lastOutput = new Date().getTime();
						e._scheduledTimer = 0;
						e._call();
					}
					if (!e._scheduledTimer || !1 !== e._reschedule()) {
						var f = new Date().getTime() - e._lastOutput;
						f < e._minInterval
							? (e._scheduledTimer = setTimeout(a, e._minInterval - f))
							: a();
					}
				};
			}
			function d(f, e, b) {
				a.call(this, f, e, b);
				this._args = [];
				var h = this;
				this.input = CKEDITOR.tools.override(this.input, function (a) {
					return function () {
						h._args = Array.prototype.slice.call(arguments);
						a.call(this);
					};
				});
			}
			var b = [],
				c = CKEDITOR.env.gecko
					? "-moz-"
					: CKEDITOR.env.webkit
					? "-webkit-"
					: CKEDITOR.env.ie
					? "-ms-"
					: "",
				g = /&/g,
				l = />/g,
				k = /</g,
				h = /"/g,
				e = /&(lt|gt|amp|quot|nbsp|shy|#\d{1,5});/g,
				m = {
					lt: "\x3c",
					gt: "\x3e",
					amp: "\x26",
					quot: '"',
					nbsp: " ",
					shy: "­",
				},
				f = function (a, f) {
					return "#" == f[0]
						? String.fromCharCode(parseInt(f.slice(1), 10))
						: m[f];
				};
			CKEDITOR.on("reset", function () {
				b = [];
			});
			CKEDITOR.tools = {
				arrayCompare: function (a, f) {
					if (!a && !f) return !0;
					if (!a || !f || a.length != f.length) return !1;
					for (var e = 0; e < a.length; e++) if (a[e] != f[e]) return !1;
					return !0;
				},
				getIndex: function (a, f) {
					for (var e = 0; e < a.length; ++e) if (f(a[e])) return e;
					return -1;
				},
				clone: function (a) {
					var f;
					if (a && a instanceof Array) {
						f = [];
						for (var e = 0; e < a.length; e++)
							f[e] = CKEDITOR.tools.clone(a[e]);
						return f;
					}
					if (
						null === a ||
						"object" != typeof a ||
						a instanceof String ||
						a instanceof Number ||
						a instanceof Boolean ||
						a instanceof Date ||
						a instanceof RegExp ||
						a.nodeType ||
						a.window === a
					)
						return a;
					f = new a.constructor();
					for (e in a) f[e] = CKEDITOR.tools.clone(a[e]);
					return f;
				},
				capitalize: function (a, f) {
					return (
						a.charAt(0).toUpperCase() +
						(f ? a.slice(1) : a.slice(1).toLowerCase())
					);
				},
				extend: function (a) {
					var f = arguments.length,
						e,
						b;
					"boolean" == typeof (e = arguments[f - 1])
						? f--
						: "boolean" == typeof (e = arguments[f - 2]) &&
						  ((b = arguments[f - 1]), (f -= 2));
					for (var h = 1; h < f; h++) {
						var c = arguments[h],
							m;
						for (m in c)
							if (!0 === e || null == a[m]) if (!b || m in b) a[m] = c[m];
					}
					return a;
				},
				prototypedCopy: function (a) {
					var f = function () {};
					f.prototype = a;
					return new f();
				},
				copy: function (a) {
					var f = {},
						e;
					for (e in a) f[e] = a[e];
					return f;
				},
				isArray: function (a) {
					return "[object Array]" == Object.prototype.toString.call(a);
				},
				isEmpty: function (a) {
					for (var f in a) if (a.hasOwnProperty(f)) return !1;
					return !0;
				},
				cssVendorPrefix: function (a, f, e) {
					if (e) return c + a + ":" + f + ";" + a + ":" + f;
					e = {};
					e[a] = f;
					e[c + a] = f;
					return e;
				},
				cssStyleToDomStyle: (function () {
					var a = document.createElement("div").style,
						f =
							"undefined" != typeof a.cssFloat
								? "cssFloat"
								: "undefined" != typeof a.styleFloat
								? "styleFloat"
								: "float";
					return function (a) {
						return "float" == a
							? f
							: a.replace(/-./g, function (a) {
									return a.substr(1).toUpperCase();
							  });
					};
				})(),
				buildStyleHtml: function (a) {
					a = [].concat(a);
					for (var f, e = [], b = 0; b < a.length; b++)
						if ((f = a[b]))
							/@import|[{}]/.test(f)
								? e.push("\x3cstyle\x3e" + f + "\x3c/style\x3e")
								: e.push(
										'\x3clink type\x3d"text/css" rel\x3dstylesheet href\x3d"' +
											f +
											'"\x3e'
								  );
					return e.join("");
				},
				htmlEncode: function (a) {
					return void 0 === a || null === a
						? ""
						: String(a)
								.replace(g, "\x26amp;")
								.replace(l, "\x26gt;")
								.replace(k, "\x26lt;");
				},
				htmlDecode: function (a) {
					return a.replace(e, f);
				},
				htmlEncodeAttr: function (a) {
					return CKEDITOR.tools.htmlEncode(a).replace(h, "\x26quot;");
				},
				htmlDecodeAttr: function (a) {
					return CKEDITOR.tools.htmlDecode(a);
				},
				transformPlainTextToHtml: function (a, f) {
					var e = f == CKEDITOR.ENTER_BR,
						b = this.htmlEncode(a.replace(/\r\n/g, "\n")),
						b = b.replace(/\t/g, "\x26nbsp;\x26nbsp; \x26nbsp;"),
						h = f == CKEDITOR.ENTER_P ? "p" : "div";
					if (!e) {
						var c = /\n{2}/g;
						if (c.test(b))
							var m = "\x3c" + h + "\x3e",
								g = "\x3c/" + h + "\x3e",
								b =
									m +
									b.replace(c, function () {
										return g + m;
									}) +
									g;
					}
					b = b.replace(/\n/g, "\x3cbr\x3e");
					e ||
						(b = b.replace(
							new RegExp("\x3cbr\x3e(?\x3d\x3c/" + h + "\x3e)"),
							function (a) {
								return CKEDITOR.tools.repeat(a, 2);
							}
						));
					b = b.replace(/^ | $/g, "\x26nbsp;");
					return (b = b
						.replace(/(>|\s) /g, function (a, f) {
							return f + "\x26nbsp;";
						})
						.replace(/ (?=<)/g, "\x26nbsp;"));
				},
				getNextNumber: (function () {
					var a = 0;
					return function () {
						return ++a;
					};
				})(),
				getNextId: function () {
					return "cke_" + this.getNextNumber();
				},
				getUniqueId: function () {
					for (var a = "e", f = 0; 8 > f; f++)
						a += Math.floor(65536 * (1 + Math.random()))
							.toString(16)
							.substring(1);
					return a;
				},
				override: function (a, f) {
					var e = f(a);
					e.prototype = a.prototype;
					return e;
				},
				setTimeout: function (a, f, e, b, h) {
					h || (h = window);
					e || (e = h);
					return h.setTimeout(function () {
						b ? a.apply(e, [].concat(b)) : a.apply(e);
					}, f || 0);
				},
				throttle: function (a, f, e) {
					return new this.buffers.throttle(a, f, e);
				},
				trim: (function () {
					var a = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
					return function (f) {
						return f.replace(a, "");
					};
				})(),
				ltrim: (function () {
					var a = /^[ \t\n\r]+/g;
					return function (f) {
						return f.replace(a, "");
					};
				})(),
				rtrim: (function () {
					var a = /[ \t\n\r]+$/g;
					return function (f) {
						return f.replace(a, "");
					};
				})(),
				indexOf: function (a, f) {
					if ("function" == typeof f)
						for (var e = 0, b = a.length; e < b; e++) {
							if (f(a[e])) return e;
						}
					else {
						if (a.indexOf) return a.indexOf(f);
						e = 0;
						for (b = a.length; e < b; e++) if (a[e] === f) return e;
					}
					return -1;
				},
				search: function (a, f) {
					var e = CKEDITOR.tools.indexOf(a, f);
					return 0 <= e ? a[e] : null;
				},
				bind: function (a, f) {
					return function () {
						return a.apply(f, arguments);
					};
				},
				createClass: function (a) {
					var f = a.$,
						e = a.base,
						b = a.privates || a._,
						h = a.proto;
					a = a.statics;
					!f &&
						(f = function () {
							e && this.base.apply(this, arguments);
						});
					if (b)
						var c = f,
							f = function () {
								var a = this._ || (this._ = {}),
									f;
								for (f in b) {
									var e = b[f];
									a[f] =
										"function" == typeof e ? CKEDITOR.tools.bind(e, this) : e;
								}
								c.apply(this, arguments);
							};
					e &&
						((f.prototype = this.prototypedCopy(e.prototype)),
						(f.prototype.constructor = f),
						(f.base = e),
						(f.baseProto = e.prototype),
						(f.prototype.base = function () {
							this.base = e.prototype.base;
							e.apply(this, arguments);
							this.base = arguments.callee;
						}));
					h && this.extend(f.prototype, h, !0);
					a && this.extend(f, a, !0);
					return f;
				},
				addFunction: function (a, f) {
					return (
						b.push(function () {
							return a.apply(f || this, arguments);
						}) - 1
					);
				},
				removeFunction: function (a) {
					b[a] = null;
				},
				callFunction: function (a) {
					var f = b[a];
					return f && f.apply(window, Array.prototype.slice.call(arguments, 1));
				},
				cssLength: (function () {
					var a = /^-?\d+\.?\d*px$/,
						f;
					return function (e) {
						f = CKEDITOR.tools.trim(e + "") + "px";
						return a.test(f) ? f : e || "";
					};
				})(),
				convertToPx: (function () {
					var a;
					return function (f) {
						a ||
							((a = CKEDITOR.dom.element.createFromHtml(
								'\x3cdiv style\x3d"position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"\x3e\x3c/div\x3e',
								CKEDITOR.document
							)),
							CKEDITOR.document.getBody().append(a));
						if (!/%$/.test(f)) {
							var e = 0 > parseFloat(f);
							e && (f = f.replace("-", ""));
							a.setStyle("width", f);
							f = a.$.clientWidth;
							return e ? -f : f;
						}
						return f;
					};
				})(),
				repeat: function (a, f) {
					return Array(f + 1).join(a);
				},
				tryThese: function () {
					for (var a, f = 0, e = arguments.length; f < e; f++) {
						var b = arguments[f];
						try {
							a = b();
							break;
						} catch (h) {}
					}
					return a;
				},
				genKey: function () {
					return Array.prototype.slice.call(arguments).join("-");
				},
				defer: function (a) {
					return function () {
						var f = arguments,
							e = this;
						window.setTimeout(function () {
							a.apply(e, f);
						}, 0);
					};
				},
				normalizeCssText: function (a, f) {
					var e = [],
						b,
						h = CKEDITOR.tools.parseCssText(a, !0, f);
					for (b in h) e.push(b + ":" + h[b]);
					e.sort();
					return e.length ? e.join(";") + ";" : "";
				},
				convertRgbToHex: function (a) {
					return a.replace(
						/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi,
						function (a, f, e, b) {
							a = [f, e, b];
							for (f = 0; 3 > f; f++)
								a[f] = ("0" + parseInt(a[f], 10).toString(16)).slice(-2);
							return "#" + a.join("");
						}
					);
				},
				normalizeHex: function (a) {
					return a.replace(
						/#(([0-9a-f]{3}){1,2})($|;|\s+)/gi,
						function (a, f, e, b) {
							a = f.toLowerCase();
							3 == a.length &&
								((a = a.split("")),
								(a = [a[0], a[0], a[1], a[1], a[2], a[2]].join("")));
							return "#" + a + b;
						}
					);
				},
				parseCssText: function (a, f, e) {
					var b = {};
					e &&
						(a =
							new CKEDITOR.dom.element("span")
								.setAttribute("style", a)
								.getAttribute("style") || "");
					a &&
						(a = CKEDITOR.tools.normalizeHex(
							CKEDITOR.tools.convertRgbToHex(a)
						));
					if (!a || ";" == a) return b;
					a.replace(/&quot;/g, '"').replace(
						/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g,
						function (a, e, h) {
							f &&
								((e = e.toLowerCase()),
								"font-family" == e && (h = h.replace(/\s*,\s*/g, ",")),
								(h = CKEDITOR.tools.trim(h)));
							b[e] = h;
						}
					);
					return b;
				},
				writeCssText: function (a, f) {
					var e,
						b = [];
					for (e in a) b.push(e + ":" + a[e]);
					f && b.sort();
					return b.join("; ");
				},
				objectCompare: function (a, f, e) {
					var b;
					if (!a && !f) return !0;
					if (!a || !f) return !1;
					for (b in a) if (a[b] != f[b]) return !1;
					if (!e) for (b in f) if (a[b] != f[b]) return !1;
					return !0;
				},
				objectKeys: function (a) {
					var f = [],
						e;
					for (e in a) f.push(e);
					return f;
				},
				convertArrayToObject: function (a, f) {
					var e = {};
					1 == arguments.length && (f = !0);
					for (var b = 0, h = a.length; b < h; ++b) e[a[b]] = f;
					return e;
				},
				fixDomain: function () {
					for (var a; ; )
						try {
							a = window.parent.document.domain;
							break;
						} catch (f) {
							a = a ? a.replace(/.+?(?:\.|$)/, "") : document.domain;
							if (!a) break;
							document.domain = a;
						}
					return !!a;
				},
				eventsBuffer: function (a, f, e) {
					return new this.buffers.event(a, f, e);
				},
				enableHtml5Elements: function (a, f) {
					for (
						var e = "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary time video".split(
								" "
							),
							b = e.length,
							h;
						b--;

					)
						(h = a.createElement(e[b])), f && a.appendChild(h);
				},
				checkIfAnyArrayItemMatches: function (a, f) {
					for (var e = 0, b = a.length; e < b; ++e)
						if (a[e].match(f)) return !0;
					return !1;
				},
				checkIfAnyObjectPropertyMatches: function (a, f) {
					for (var e in a) if (e.match(f)) return !0;
					return !1;
				},
				keystrokeToString: function (a, f) {
					var e = this.keystrokeToArray(a, f);
					e.display = e.display.join("+");
					e.aria = e.aria.join("+");
					return e;
				},
				keystrokeToArray: function (a, f) {
					var e = f & 16711680,
						b = f & 65535,
						h = CKEDITOR.env.mac,
						c = [],
						m = [];
					e & CKEDITOR.CTRL &&
						(c.push(h ? "⌘" : a[17]), m.push(h ? a[224] : a[17]));
					e & CKEDITOR.ALT && (c.push(h ? "⌥" : a[18]), m.push(a[18]));
					e & CKEDITOR.SHIFT && (c.push(h ? "⇧" : a[16]), m.push(a[16]));
					b &&
						(a[b]
							? (c.push(a[b]), m.push(a[b]))
							: (c.push(String.fromCharCode(b)),
							  m.push(String.fromCharCode(b))));
					return { display: c, aria: m };
				},
				transparentImageData:
					"data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw\x3d\x3d",
				getCookie: function (a) {
					a = a.toLowerCase();
					for (
						var f = document.cookie.split(";"), e, b, h = 0;
						h < f.length;
						h++
					)
						if (
							((e = f[h].split("\x3d")),
							(b = decodeURIComponent(CKEDITOR.tools.trim(e[0]).toLowerCase())),
							b === a)
						)
							return decodeURIComponent(1 < e.length ? e[1] : "");
					return null;
				},
				setCookie: function (a, f) {
					document.cookie =
						encodeURIComponent(a) +
						"\x3d" +
						encodeURIComponent(f) +
						";path\x3d/";
				},
				getCsrfToken: function () {
					var a = CKEDITOR.tools.getCookie("ckCsrfToken");
					if (!a || 40 != a.length) {
						var a = [],
							f = "";
						if (window.crypto && window.crypto.getRandomValues)
							(a = new Uint8Array(40)), window.crypto.getRandomValues(a);
						else
							for (var e = 0; 40 > e; e++)
								a.push(Math.floor(256 * Math.random()));
						for (e = 0; e < a.length; e++)
							var b = "abcdefghijklmnopqrstuvwxyz0123456789".charAt(a[e] % 36),
								f = f + (0.5 < Math.random() ? b.toUpperCase() : b);
						a = f;
						CKEDITOR.tools.setCookie("ckCsrfToken", a);
					}
					return a;
				},
				escapeCss: function (a) {
					return a
						? window.CSS && CSS.escape
							? CSS.escape(a)
							: isNaN(parseInt(a.charAt(0), 10))
							? a
							: "\\3" + a.charAt(0) + " " + a.substring(1, a.length)
						: "";
				},
				getMouseButton: function (a) {
					var f = (a = a.data) && a.$;
					return a && f
						? CKEDITOR.env.ie && 9 > CKEDITOR.env.version
							? 4 === f.button
								? CKEDITOR.MOUSE_BUTTON_MIDDLE
								: 1 === f.button
								? CKEDITOR.MOUSE_BUTTON_LEFT
								: CKEDITOR.MOUSE_BUTTON_RIGHT
							: f.button
						: !1;
				},
				convertHexStringToBytes: function (a) {
					var f = [],
						e = a.length / 2,
						b;
					for (b = 0; b < e; b++) f.push(parseInt(a.substr(2 * b, 2), 16));
					return f;
				},
				convertBytesToBase64: function (a) {
					var f = "",
						e = a.length,
						b;
					for (b = 0; b < e; b += 3) {
						var h = a.slice(b, b + 3),
							c = h.length,
							m = [],
							g;
						if (3 > c) for (g = c; 3 > g; g++) h[g] = 0;
						m[0] = (h[0] & 252) >> 2;
						m[1] = ((h[0] & 3) << 4) | (h[1] >> 4);
						m[2] = ((h[1] & 15) << 2) | ((h[2] & 192) >> 6);
						m[3] = h[2] & 63;
						for (g = 0; 4 > g; g++)
							f =
								g <= c
									? f +
									  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(
											m[g]
									  )
									: f + "\x3d";
					}
					return f;
				},
				style: {
					parse: {
						_colors: {
							aliceblue: "#F0F8FF",
							antiquewhite: "#FAEBD7",
							aqua: "#00FFFF",
							aquamarine: "#7FFFD4",
							azure: "#F0FFFF",
							beige: "#F5F5DC",
							bisque: "#FFE4C4",
							black: "#000000",
							blanchedalmond: "#FFEBCD",
							blue: "#0000FF",
							blueviolet: "#8A2BE2",
							brown: "#A52A2A",
							burlywood: "#DEB887",
							cadetblue: "#5F9EA0",
							chartreuse: "#7FFF00",
							chocolate: "#D2691E",
							coral: "#FF7F50",
							cornflowerblue: "#6495ED",
							cornsilk: "#FFF8DC",
							crimson: "#DC143C",
							cyan: "#00FFFF",
							darkblue: "#00008B",
							darkcyan: "#008B8B",
							darkgoldenrod: "#B8860B",
							darkgray: "#A9A9A9",
							darkgreen: "#006400",
							darkgrey: "#A9A9A9",
							darkkhaki: "#BDB76B",
							darkmagenta: "#8B008B",
							darkolivegreen: "#556B2F",
							darkorange: "#FF8C00",
							darkorchid: "#9932CC",
							darkred: "#8B0000",
							darksalmon: "#E9967A",
							darkseagreen: "#8FBC8F",
							darkslateblue: "#483D8B",
							darkslategray: "#2F4F4F",
							darkslategrey: "#2F4F4F",
							darkturquoise: "#00CED1",
							darkviolet: "#9400D3",
							deeppink: "#FF1493",
							deepskyblue: "#00BFFF",
							dimgray: "#696969",
							dimgrey: "#696969",
							dodgerblue: "#1E90FF",
							firebrick: "#B22222",
							floralwhite: "#FFFAF0",
							forestgreen: "#228B22",
							fuchsia: "#FF00FF",
							gainsboro: "#DCDCDC",
							ghostwhite: "#F8F8FF",
							gold: "#FFD700",
							goldenrod: "#DAA520",
							gray: "#808080",
							green: "#008000",
							greenyellow: "#ADFF2F",
							grey: "#808080",
							honeydew: "#F0FFF0",
							hotpink: "#FF69B4",
							indianred: "#CD5C5C",
							indigo: "#4B0082",
							ivory: "#FFFFF0",
							khaki: "#F0E68C",
							lavender: "#E6E6FA",
							lavenderblush: "#FFF0F5",
							lawngreen: "#7CFC00",
							lemonchiffon: "#FFFACD",
							lightblue: "#ADD8E6",
							lightcoral: "#F08080",
							lightcyan: "#E0FFFF",
							lightgoldenrodyellow: "#FAFAD2",
							lightgray: "#D3D3D3",
							lightgreen: "#90EE90",
							lightgrey: "#D3D3D3",
							lightpink: "#FFB6C1",
							lightsalmon: "#FFA07A",
							lightseagreen: "#20B2AA",
							lightskyblue: "#87CEFA",
							lightslategray: "#778899",
							lightslategrey: "#778899",
							lightsteelblue: "#B0C4DE",
							lightyellow: "#FFFFE0",
							lime: "#00FF00",
							limegreen: "#32CD32",
							linen: "#FAF0E6",
							magenta: "#FF00FF",
							maroon: "#800000",
							mediumaquamarine: "#66CDAA",
							mediumblue: "#0000CD",
							mediumorchid: "#BA55D3",
							mediumpurple: "#9370DB",
							mediumseagreen: "#3CB371",
							mediumslateblue: "#7B68EE",
							mediumspringgreen: "#00FA9A",
							mediumturquoise: "#48D1CC",
							mediumvioletred: "#C71585",
							midnightblue: "#191970",
							mintcream: "#F5FFFA",
							mistyrose: "#FFE4E1",
							moccasin: "#FFE4B5",
							navajowhite: "#FFDEAD",
							navy: "#000080",
							oldlace: "#FDF5E6",
							olive: "#808000",
							olivedrab: "#6B8E23",
							orange: "#FFA500",
							orangered: "#FF4500",
							orchid: "#DA70D6",
							palegoldenrod: "#EEE8AA",
							palegreen: "#98FB98",
							paleturquoise: "#AFEEEE",
							palevioletred: "#DB7093",
							papayawhip: "#FFEFD5",
							peachpuff: "#FFDAB9",
							peru: "#CD853F",
							pink: "#FFC0CB",
							plum: "#DDA0DD",
							powderblue: "#B0E0E6",
							purple: "#800080",
							rebeccapurple: "#663399",
							red: "#FF0000",
							rosybrown: "#BC8F8F",
							royalblue: "#4169E1",
							saddlebrown: "#8B4513",
							salmon: "#FA8072",
							sandybrown: "#F4A460",
							seagreen: "#2E8B57",
							seashell: "#FFF5EE",
							sienna: "#A0522D",
							silver: "#C0C0C0",
							skyblue: "#87CEEB",
							slateblue: "#6A5ACD",
							slategray: "#708090",
							slategrey: "#708090",
							snow: "#FFFAFA",
							springgreen: "#00FF7F",
							steelblue: "#4682B4",
							tan: "#D2B48C",
							teal: "#008080",
							thistle: "#D8BFD8",
							tomato: "#FF6347",
							turquoise: "#40E0D0",
							violet: "#EE82EE",
							wheat: "#F5DEB3",
							white: "#FFFFFF",
							whitesmoke: "#F5F5F5",
							yellow: "#FFFF00",
							yellowgreen: "#9ACD32",
						},
						_borderStyle: "none hidden dotted dashed solid double groove ridge inset outset".split(
							" "
						),
						_widthRegExp: /^(thin|medium|thick|[\+-]?\d+(\.\d+)?[a-z%]+|[\+-]?0+(\.0+)?|\.\d+[a-z%]+)$/,
						_rgbaRegExp: /rgba?\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*(?:,\s*[0-9.]+\s*)?\)/gi,
						_hslaRegExp: /hsla?\(\s*[0-9.]+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[0-9.]+\s*)?\)/gi,
						background: function (a) {
							var f = {},
								e = this._findColor(a);
							e.length &&
								((f.color = e[0]),
								CKEDITOR.tools.array.forEach(e, function (f) {
									a = a.replace(f, "");
								}));
							if ((a = CKEDITOR.tools.trim(a))) f.unprocessed = a;
							return f;
						},
						margin: function (a) {
							function f(a) {
								e.top = b[a[0]];
								e.right = b[a[1]];
								e.bottom = b[a[2]];
								e.left = b[a[3]];
							}
							var e = {},
								b = a.match(
									/(?:\-?[\.\d]+(?:%|\w*)|auto|inherit|initial|unset)/g
								) || ["0px"];
							switch (b.length) {
								case 1:
									f([0, 0, 0, 0]);
									break;
								case 2:
									f([0, 1, 0, 1]);
									break;
								case 3:
									f([0, 1, 2, 1]);
									break;
								case 4:
									f([0, 1, 2, 3]);
							}
							return e;
						},
						border: function (a) {
							var f = {},
								e = a.split(/\s+/g);
							a = CKEDITOR.tools.style.parse._findColor(a);
							a.length && (f.color = a[0]);
							CKEDITOR.tools.array.forEach(e, function (a) {
								f.style ||
								-1 ===
									CKEDITOR.tools.indexOf(
										CKEDITOR.tools.style.parse._borderStyle,
										a
									)
									? !f.width &&
									  CKEDITOR.tools.style.parse._widthRegExp.test(a) &&
									  (f.width = a)
									: (f.style = a);
							});
							return f;
						},
						_findColor: function (a) {
							var f = [],
								e = CKEDITOR.tools.array,
								f = f.concat(a.match(this._rgbaRegExp) || []),
								f = f.concat(a.match(this._hslaRegExp) || []);
							return (f = f.concat(
								e.filter(a.split(/\s+/), function (a) {
									return a.match(/^\#[a-f0-9]{3}(?:[a-f0-9]{3})?$/gi)
										? !0
										: a.toLowerCase() in CKEDITOR.tools.style.parse._colors;
								})
							));
						},
					},
				},
				array: {
					filter: function (a, f, e) {
						var b = [];
						this.forEach(a, function (h, c) {
							f.call(e, h, c, a) && b.push(h);
						});
						return b;
					},
					forEach: function (a, f, e) {
						var b = a.length,
							h;
						for (h = 0; h < b; h++) f.call(e, a[h], h, a);
					},
					map: function (a, f, e) {
						for (var b = [], h = 0; h < a.length; h++)
							b.push(f.call(e, a[h], h, a));
						return b;
					},
					reduce: function (a, f, e, b) {
						for (var h = 0; h < a.length; h++) e = f.call(b, e, a[h], h, a);
						return e;
					},
					every: function (a, f, e) {
						if (!a.length) return !0;
						f = this.filter(a, f, e);
						return a.length === f.length;
					},
				},
				object: {
					findKey: function (a, f) {
						if ("object" !== typeof a) return null;
						for (var e in a) if (a[e] === f) return e;
						return null;
					},
					merge: function (a, f) {
						var e = CKEDITOR.tools,
							b = e.clone(a),
							h = e.clone(f);
						e.array.forEach(e.objectKeys(h), function (a) {
							b[a] =
								"object" === typeof h[a] && "object" === typeof b[a]
									? e.object.merge(b[a], h[a])
									: h[a];
						});
						return b;
					},
				},
				getAbsoluteRectPosition: function (a, f) {
					function e(a) {
						if (a) {
							var f = a.getClientRect();
							b.top += f.top;
							b.left += f.left;
							"x" in b && "y" in b && ((b.x += f.x), (b.y += f.y));
							e(a.getWindow().getFrame());
						}
					}
					var b = CKEDITOR.tools.copy(f);
					e(a.getFrame());
					var h = CKEDITOR.document.getWindow().getScrollPosition();
					b.top += h.y;
					b.left += h.x;
					"x" in b && "y" in b && ((b.y += h.y), (b.x += h.x));
					b.right = b.left + b.width;
					b.bottom = b.top + b.height;
					return b;
				},
			};
			a.prototype = {
				reset: function () {
					this._lastOutput = 0;
					this._clearTimer();
				},
				_reschedule: function () {
					return !1;
				},
				_call: function () {
					this._output();
				},
				_clearTimer: function () {
					this._scheduledTimer && clearTimeout(this._scheduledTimer);
					this._scheduledTimer = 0;
				},
			};
			d.prototype = CKEDITOR.tools.prototypedCopy(a.prototype);
			d.prototype._reschedule = function () {
				this._scheduledTimer && this._clearTimer();
			};
			d.prototype._call = function () {
				this._output.apply(this._context, this._args);
			};
			CKEDITOR.tools.buffers = {};
			CKEDITOR.tools.buffers.event = a;
			CKEDITOR.tools.buffers.throttle = d;
			CKEDITOR.tools.array.indexOf = CKEDITOR.tools.indexOf;
			CKEDITOR.tools.array.isArray = CKEDITOR.tools.isArray;
			CKEDITOR.MOUSE_BUTTON_LEFT = 0;
			CKEDITOR.MOUSE_BUTTON_MIDDLE = 1;
			CKEDITOR.MOUSE_BUTTON_RIGHT = 2;
		})(),
		(CKEDITOR.dtd = (function () {
			var a = CKEDITOR.tools.extend,
				d = function (a, f) {
					for (
						var e = CKEDITOR.tools.clone(a), b = 1;
						b < arguments.length;
						b++
					) {
						f = arguments[b];
						for (var h in f) delete e[h];
					}
					return e;
				},
				b = {},
				c = {},
				g = {
					address: 1,
					article: 1,
					aside: 1,
					blockquote: 1,
					details: 1,
					div: 1,
					dl: 1,
					fieldset: 1,
					figure: 1,
					footer: 1,
					form: 1,
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1,
					header: 1,
					hgroup: 1,
					hr: 1,
					main: 1,
					menu: 1,
					nav: 1,
					ol: 1,
					p: 1,
					pre: 1,
					section: 1,
					table: 1,
					ul: 1,
				},
				l = { command: 1, link: 1, meta: 1, noscript: 1, script: 1, style: 1 },
				k = {},
				h = { "#": 1 },
				e = { center: 1, dir: 1, noframes: 1 };
			a(
				b,
				{
					a: 1,
					abbr: 1,
					area: 1,
					audio: 1,
					b: 1,
					bdi: 1,
					bdo: 1,
					br: 1,
					button: 1,
					canvas: 1,
					cite: 1,
					code: 1,
					command: 1,
					datalist: 1,
					del: 1,
					dfn: 1,
					em: 1,
					embed: 1,
					i: 1,
					iframe: 1,
					img: 1,
					input: 1,
					ins: 1,
					kbd: 1,
					keygen: 1,
					label: 1,
					map: 1,
					mark: 1,
					meter: 1,
					noscript: 1,
					object: 1,
					output: 1,
					progress: 1,
					q: 1,
					ruby: 1,
					s: 1,
					samp: 1,
					script: 1,
					select: 1,
					small: 1,
					span: 1,
					strong: 1,
					sub: 1,
					sup: 1,
					textarea: 1,
					time: 1,
					u: 1,
					var: 1,
					video: 1,
					wbr: 1,
				},
				h,
				{
					acronym: 1,
					applet: 1,
					basefont: 1,
					big: 1,
					font: 1,
					isindex: 1,
					strike: 1,
					style: 1,
					tt: 1,
				}
			);
			a(c, g, b, e);
			d = {
				a: d(b, { a: 1, button: 1 }),
				abbr: b,
				address: c,
				area: k,
				article: c,
				aside: c,
				audio: a({ source: 1, track: 1 }, c),
				b: b,
				base: k,
				bdi: b,
				bdo: b,
				blockquote: c,
				body: c,
				br: k,
				button: d(b, { a: 1, button: 1 }),
				canvas: b,
				caption: c,
				cite: b,
				code: b,
				col: k,
				colgroup: { col: 1 },
				command: k,
				datalist: a({ option: 1 }, b),
				dd: c,
				del: b,
				details: a({ summary: 1 }, c),
				dfn: b,
				div: c,
				dl: { dt: 1, dd: 1 },
				dt: c,
				em: b,
				embed: k,
				fieldset: a({ legend: 1 }, c),
				figcaption: c,
				figure: a({ figcaption: 1 }, c),
				footer: c,
				form: c,
				h1: b,
				h2: b,
				h3: b,
				h4: b,
				h5: b,
				h6: b,
				head: a({ title: 1, base: 1 }, l),
				header: c,
				hgroup: { h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1 },
				hr: k,
				html: a({ head: 1, body: 1 }, c, l),
				i: b,
				iframe: h,
				img: k,
				input: k,
				ins: b,
				kbd: b,
				keygen: k,
				label: b,
				legend: b,
				li: c,
				link: k,
				main: c,
				map: c,
				mark: b,
				menu: a({ li: 1 }, c),
				meta: k,
				meter: d(b, { meter: 1 }),
				nav: c,
				noscript: a({ link: 1, meta: 1, style: 1 }, b),
				object: a({ param: 1 }, b),
				ol: { li: 1 },
				optgroup: { option: 1 },
				option: h,
				output: b,
				p: b,
				param: k,
				pre: b,
				progress: d(b, { progress: 1 }),
				q: b,
				rp: b,
				rt: b,
				ruby: a({ rp: 1, rt: 1 }, b),
				s: b,
				samp: b,
				script: h,
				section: c,
				select: { optgroup: 1, option: 1 },
				small: b,
				source: k,
				span: b,
				strong: b,
				style: h,
				sub: b,
				summary: a({ h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1 }, b),
				sup: b,
				table: { caption: 1, colgroup: 1, thead: 1, tfoot: 1, tbody: 1, tr: 1 },
				tbody: { tr: 1 },
				td: c,
				textarea: h,
				tfoot: { tr: 1 },
				th: c,
				thead: { tr: 1 },
				time: d(b, { time: 1 }),
				title: h,
				tr: { th: 1, td: 1 },
				track: k,
				u: b,
				ul: { li: 1 },
				var: b,
				video: a({ source: 1, track: 1 }, c),
				wbr: k,
				acronym: b,
				applet: a({ param: 1 }, c),
				basefont: k,
				big: b,
				center: c,
				dialog: k,
				dir: { li: 1 },
				font: b,
				isindex: k,
				noframes: c,
				strike: b,
				tt: b,
			};
			a(d, {
				$block: a(
					{ audio: 1, dd: 1, dt: 1, figcaption: 1, li: 1, video: 1 },
					g,
					e
				),
				$blockLimit: {
					article: 1,
					aside: 1,
					audio: 1,
					body: 1,
					caption: 1,
					details: 1,
					dir: 1,
					div: 1,
					dl: 1,
					fieldset: 1,
					figcaption: 1,
					figure: 1,
					footer: 1,
					form: 1,
					header: 1,
					hgroup: 1,
					main: 1,
					menu: 1,
					nav: 1,
					ol: 1,
					section: 1,
					table: 1,
					td: 1,
					th: 1,
					tr: 1,
					ul: 1,
					video: 1,
				},
				$cdata: { script: 1, style: 1 },
				$editable: {
					address: 1,
					article: 1,
					aside: 1,
					blockquote: 1,
					body: 1,
					details: 1,
					div: 1,
					fieldset: 1,
					figcaption: 1,
					footer: 1,
					form: 1,
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1,
					header: 1,
					hgroup: 1,
					main: 1,
					nav: 1,
					p: 1,
					pre: 1,
					section: 1,
				},
				$empty: {
					area: 1,
					base: 1,
					basefont: 1,
					br: 1,
					col: 1,
					command: 1,
					dialog: 1,
					embed: 1,
					hr: 1,
					img: 1,
					input: 1,
					isindex: 1,
					keygen: 1,
					link: 1,
					meta: 1,
					param: 1,
					source: 1,
					track: 1,
					wbr: 1,
				},
				$inline: b,
				$list: { dl: 1, ol: 1, ul: 1 },
				$listItem: { dd: 1, dt: 1, li: 1 },
				$nonBodyContent: a({ body: 1, head: 1, html: 1 }, d.head),
				$nonEditable: {
					applet: 1,
					audio: 1,
					button: 1,
					embed: 1,
					iframe: 1,
					map: 1,
					object: 1,
					option: 1,
					param: 1,
					script: 1,
					textarea: 1,
					video: 1,
				},
				$object: {
					applet: 1,
					audio: 1,
					button: 1,
					hr: 1,
					iframe: 1,
					img: 1,
					input: 1,
					object: 1,
					select: 1,
					table: 1,
					textarea: 1,
					video: 1,
				},
				$removeEmpty: {
					abbr: 1,
					acronym: 1,
					b: 1,
					bdi: 1,
					bdo: 1,
					big: 1,
					cite: 1,
					code: 1,
					del: 1,
					dfn: 1,
					em: 1,
					font: 1,
					i: 1,
					ins: 1,
					label: 1,
					kbd: 1,
					mark: 1,
					meter: 1,
					output: 1,
					q: 1,
					ruby: 1,
					s: 1,
					samp: 1,
					small: 1,
					span: 1,
					strike: 1,
					strong: 1,
					sub: 1,
					sup: 1,
					time: 1,
					tt: 1,
					u: 1,
					var: 1,
				},
				$tabIndex: {
					a: 1,
					area: 1,
					button: 1,
					input: 1,
					object: 1,
					select: 1,
					textarea: 1,
				},
				$tableContent: {
					caption: 1,
					col: 1,
					colgroup: 1,
					tbody: 1,
					td: 1,
					tfoot: 1,
					th: 1,
					thead: 1,
					tr: 1,
				},
				$transparent: {
					a: 1,
					audio: 1,
					canvas: 1,
					del: 1,
					ins: 1,
					map: 1,
					noscript: 1,
					object: 1,
					video: 1,
				},
				$intermediate: {
					caption: 1,
					colgroup: 1,
					dd: 1,
					dt: 1,
					figcaption: 1,
					legend: 1,
					li: 1,
					optgroup: 1,
					option: 1,
					rp: 1,
					rt: 1,
					summary: 1,
					tbody: 1,
					td: 1,
					tfoot: 1,
					th: 1,
					thead: 1,
					tr: 1,
				},
			});
			return d;
		})()),
		(CKEDITOR.dom.event = function (a) {
			this.$ = a;
		}),
		(CKEDITOR.dom.event.prototype = {
			getKey: function () {
				return this.$.keyCode || this.$.which;
			},
			getKeystroke: function () {
				var a = this.getKey();
				if (this.$.ctrlKey || this.$.metaKey) a += CKEDITOR.CTRL;
				this.$.shiftKey && (a += CKEDITOR.SHIFT);
				this.$.altKey && (a += CKEDITOR.ALT);
				return a;
			},
			preventDefault: function (a) {
				var d = this.$;
				d.preventDefault ? d.preventDefault() : (d.returnValue = !1);
				a && this.stopPropagation();
			},
			stopPropagation: function () {
				var a = this.$;
				a.stopPropagation ? a.stopPropagation() : (a.cancelBubble = !0);
			},
			getTarget: function () {
				var a = this.$.target || this.$.srcElement;
				return a ? new CKEDITOR.dom.node(a) : null;
			},
			getPhase: function () {
				return this.$.eventPhase || 2;
			},
			getPageOffset: function () {
				var a = this.getTarget().getDocument().$;
				return {
					x:
						this.$.pageX ||
						this.$.clientX +
							(a.documentElement.scrollLeft || a.body.scrollLeft),
					y:
						this.$.pageY ||
						this.$.clientY + (a.documentElement.scrollTop || a.body.scrollTop),
				};
			},
		}),
		(CKEDITOR.CTRL = 1114112),
		(CKEDITOR.SHIFT = 2228224),
		(CKEDITOR.ALT = 4456448),
		(CKEDITOR.EVENT_PHASE_CAPTURING = 1),
		(CKEDITOR.EVENT_PHASE_AT_TARGET = 2),
		(CKEDITOR.EVENT_PHASE_BUBBLING = 3),
		(CKEDITOR.dom.domObject = function (a) {
			a && (this.$ = a);
		}),
		(CKEDITOR.dom.domObject.prototype = (function () {
			var a = function (a, b) {
				return function (c) {
					"undefined" != typeof CKEDITOR &&
						a.fire(b, new CKEDITOR.dom.event(c));
				};
			};
			return {
				getPrivate: function () {
					var a;
					(a = this.getCustomData("_")) || this.setCustomData("_", (a = {}));
					return a;
				},
				on: function (d) {
					var b = this.getCustomData("_cke_nativeListeners");
					b || ((b = {}), this.setCustomData("_cke_nativeListeners", b));
					b[d] ||
						((b = b[d] = a(this, d)),
						this.$.addEventListener
							? this.$.addEventListener(d, b, !!CKEDITOR.event.useCapture)
							: this.$.attachEvent && this.$.attachEvent("on" + d, b));
					return CKEDITOR.event.prototype.on.apply(this, arguments);
				},
				removeListener: function (a) {
					CKEDITOR.event.prototype.removeListener.apply(this, arguments);
					if (!this.hasListeners(a)) {
						var b = this.getCustomData("_cke_nativeListeners"),
							c = b && b[a];
						c &&
							(this.$.removeEventListener
								? this.$.removeEventListener(a, c, !1)
								: this.$.detachEvent && this.$.detachEvent("on" + a, c),
							delete b[a]);
					}
				},
				removeAllListeners: function () {
					var a = this.getCustomData("_cke_nativeListeners"),
						b;
					for (b in a) {
						var c = a[b];
						this.$.detachEvent
							? this.$.detachEvent("on" + b, c)
							: this.$.removeEventListener &&
							  this.$.removeEventListener(b, c, !1);
						delete a[b];
					}
					CKEDITOR.event.prototype.removeAllListeners.call(this);
				},
			};
		})()),
		(function (a) {
			var d = {};
			CKEDITOR.on("reset", function () {
				d = {};
			});
			a.equals = function (a) {
				try {
					return a && a.$ === this.$;
				} catch (c) {
					return !1;
				}
			};
			a.setCustomData = function (a, c) {
				var g = this.getUniqueId();
				(d[g] || (d[g] = {}))[a] = c;
				return this;
			};
			a.getCustomData = function (a) {
				var c = this.$["data-cke-expando"];
				return (c = c && d[c]) && a in c ? c[a] : null;
			};
			a.removeCustomData = function (a) {
				var c = this.$["data-cke-expando"],
					c = c && d[c],
					g,
					l;
				c && ((g = c[a]), (l = a in c), delete c[a]);
				return l ? g : null;
			};
			a.clearCustomData = function () {
				this.removeAllListeners();
				var a = this.$["data-cke-expando"];
				a && delete d[a];
			};
			a.getUniqueId = function () {
				return (
					this.$["data-cke-expando"] ||
					(this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber())
				);
			};
			CKEDITOR.event.implementOn(a);
		})(CKEDITOR.dom.domObject.prototype),
		(CKEDITOR.dom.node = function (a) {
			return a
				? new CKEDITOR.dom[
						a.nodeType == CKEDITOR.NODE_DOCUMENT
							? "document"
							: a.nodeType == CKEDITOR.NODE_ELEMENT
							? "element"
							: a.nodeType == CKEDITOR.NODE_TEXT
							? "text"
							: a.nodeType == CKEDITOR.NODE_COMMENT
							? "comment"
							: a.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT
							? "documentFragment"
							: "domObject"
				  ](a)
				: this;
		}),
		(CKEDITOR.dom.node.prototype = new CKEDITOR.dom.domObject()),
		(CKEDITOR.NODE_ELEMENT = 1),
		(CKEDITOR.NODE_DOCUMENT = 9),
		(CKEDITOR.NODE_TEXT = 3),
		(CKEDITOR.NODE_COMMENT = 8),
		(CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11),
		(CKEDITOR.POSITION_IDENTICAL = 0),
		(CKEDITOR.POSITION_DISCONNECTED = 1),
		(CKEDITOR.POSITION_FOLLOWING = 2),
		(CKEDITOR.POSITION_PRECEDING = 4),
		(CKEDITOR.POSITION_IS_CONTAINED = 8),
		(CKEDITOR.POSITION_CONTAINS = 16),
		CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype, {
			appendTo: function (a, d) {
				a.append(this, d);
				return a;
			},
			clone: function (a, d) {
				function b(c) {
					c["data-cke-expando"] && (c["data-cke-expando"] = !1);
					if (
						c.nodeType == CKEDITOR.NODE_ELEMENT ||
						c.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT
					)
						if (
							(d ||
								c.nodeType != CKEDITOR.NODE_ELEMENT ||
								c.removeAttribute("id", !1),
							a)
						) {
							c = c.childNodes;
							for (var g = 0; g < c.length; g++) b(c[g]);
						}
				}
				function c(b) {
					if (
						b.type == CKEDITOR.NODE_ELEMENT ||
						b.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT
					) {
						if (b.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
							var g = b.getName();
							":" == g[0] && b.renameNode(g.substring(1));
						}
						if (a) for (g = 0; g < b.getChildCount(); g++) c(b.getChild(g));
					}
				}
				var g = this.$.cloneNode(a);
				b(g);
				g = new CKEDITOR.dom.node(g);
				CKEDITOR.env.ie &&
					9 > CKEDITOR.env.version &&
					(this.type == CKEDITOR.NODE_ELEMENT ||
						this.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT) &&
					c(g);
				return g;
			},
			hasPrevious: function () {
				return !!this.$.previousSibling;
			},
			hasNext: function () {
				return !!this.$.nextSibling;
			},
			insertAfter: function (a) {
				a.$.parentNode.insertBefore(this.$, a.$.nextSibling);
				return a;
			},
			insertBefore: function (a) {
				a.$.parentNode.insertBefore(this.$, a.$);
				return a;
			},
			insertBeforeMe: function (a) {
				this.$.parentNode.insertBefore(a.$, this.$);
				return a;
			},
			getAddress: function (a) {
				for (
					var d = [], b = this.getDocument().$.documentElement, c = this.$;
					c && c != b;

				) {
					var g = c.parentNode;
					g && d.unshift(this.getIndex.call({ $: c }, a));
					c = g;
				}
				return d;
			},
			getDocument: function () {
				return new CKEDITOR.dom.document(
					this.$.ownerDocument || this.$.parentNode.ownerDocument
				);
			},
			getIndex: function (a) {
				function d(a, h) {
					var e = h ? a.nextSibling : a.previousSibling;
					return e && e.nodeType == CKEDITOR.NODE_TEXT
						? b(e)
							? d(e, h)
							: e
						: null;
				}
				function b(a) {
					return (
						!a.nodeValue ||
						a.nodeValue == CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE
					);
				}
				var c = this.$,
					g = -1,
					l;
				if (
					!this.$.parentNode ||
					(a && c.nodeType == CKEDITOR.NODE_TEXT && b(c) && !d(c) && !d(c, !0))
				)
					return -1;
				do
					(a &&
						c != this.$ &&
						c.nodeType == CKEDITOR.NODE_TEXT &&
						(l || b(c))) ||
						(g++, (l = c.nodeType == CKEDITOR.NODE_TEXT));
				while ((c = c.previousSibling));
				return g;
			},
			getNextSourceNode: function (a, d, b) {
				if (b && !b.call) {
					var c = b;
					b = function (a) {
						return !a.equals(c);
					};
				}
				a = !a && this.getFirst && this.getFirst();
				var g;
				if (!a) {
					if (this.type == CKEDITOR.NODE_ELEMENT && b && !1 === b(this, !0))
						return null;
					a = this.getNext();
				}
				for (; !a && (g = (g || this).getParent()); ) {
					if (b && !1 === b(g, !0)) return null;
					a = g.getNext();
				}
				return !a || (b && !1 === b(a))
					? null
					: d && d != a.type
					? a.getNextSourceNode(!1, d, b)
					: a;
			},
			getPreviousSourceNode: function (a, d, b) {
				if (b && !b.call) {
					var c = b;
					b = function (a) {
						return !a.equals(c);
					};
				}
				a = !a && this.getLast && this.getLast();
				var g;
				if (!a) {
					if (this.type == CKEDITOR.NODE_ELEMENT && b && !1 === b(this, !0))
						return null;
					a = this.getPrevious();
				}
				for (; !a && (g = (g || this).getParent()); ) {
					if (b && !1 === b(g, !0)) return null;
					a = g.getPrevious();
				}
				return !a || (b && !1 === b(a))
					? null
					: d && a.type != d
					? a.getPreviousSourceNode(!1, d, b)
					: a;
			},
			getPrevious: function (a) {
				var d = this.$,
					b;
				do
					b =
						(d = d.previousSibling) &&
						10 != d.nodeType &&
						new CKEDITOR.dom.node(d);
				while (b && a && !a(b));
				return b;
			},
			getNext: function (a) {
				var d = this.$,
					b;
				do b = (d = d.nextSibling) && new CKEDITOR.dom.node(d);
				while (b && a && !a(b));
				return b;
			},
			getParent: function (a) {
				var d = this.$.parentNode;
				return d &&
					(d.nodeType == CKEDITOR.NODE_ELEMENT ||
						(a && d.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT))
					? new CKEDITOR.dom.node(d)
					: null;
			},
			getParents: function (a) {
				var d = this,
					b = [];
				do b[a ? "push" : "unshift"](d);
				while ((d = d.getParent()));
				return b;
			},
			getCommonAncestor: function (a) {
				if (a.equals(this)) return this;
				if (a.contains && a.contains(this)) return a;
				var d = this.contains ? this : this.getParent();
				do if (d.contains(a)) return d;
				while ((d = d.getParent()));
				return null;
			},
			getPosition: function (a) {
				var d = this.$,
					b = a.$;
				if (d.compareDocumentPosition) return d.compareDocumentPosition(b);
				if (d == b) return CKEDITOR.POSITION_IDENTICAL;
				if (
					this.type == CKEDITOR.NODE_ELEMENT &&
					a.type == CKEDITOR.NODE_ELEMENT
				) {
					if (d.contains) {
						if (d.contains(b))
							return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
						if (b.contains(d))
							return (
								CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
							);
					}
					if ("sourceIndex" in d)
						return 0 > d.sourceIndex || 0 > b.sourceIndex
							? CKEDITOR.POSITION_DISCONNECTED
							: d.sourceIndex < b.sourceIndex
							? CKEDITOR.POSITION_PRECEDING
							: CKEDITOR.POSITION_FOLLOWING;
				}
				d = this.getAddress();
				a = a.getAddress();
				for (var b = Math.min(d.length, a.length), c = 0; c < b; c++)
					if (d[c] != a[c])
						return d[c] < a[c]
							? CKEDITOR.POSITION_PRECEDING
							: CKEDITOR.POSITION_FOLLOWING;
				return d.length < a.length
					? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING
					: CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING;
			},
			getAscendant: function (a, d) {
				var b = this.$,
					c,
					g;
				d || (b = b.parentNode);
				"function" == typeof a
					? ((g = !0), (c = a))
					: ((g = !1),
					  (c = function (b) {
							b = "string" == typeof b.nodeName ? b.nodeName.toLowerCase() : "";
							return "string" == typeof a ? b == a : b in a;
					  }));
				for (; b; ) {
					if (c(g ? new CKEDITOR.dom.node(b) : b))
						return new CKEDITOR.dom.node(b);
					try {
						b = b.parentNode;
					} catch (l) {
						b = null;
					}
				}
				return null;
			},
			hasAscendant: function (a, d) {
				var b = this.$;
				d || (b = b.parentNode);
				for (; b; ) {
					if (b.nodeName && b.nodeName.toLowerCase() == a) return !0;
					b = b.parentNode;
				}
				return !1;
			},
			move: function (a, d) {
				a.append(this.remove(), d);
			},
			remove: function (a) {
				var d = this.$,
					b = d.parentNode;
				if (b) {
					if (a)
						for (; (a = d.firstChild); ) b.insertBefore(d.removeChild(a), d);
					b.removeChild(d);
				}
				return this;
			},
			replace: function (a) {
				this.insertBefore(a);
				a.remove();
			},
			trim: function () {
				this.ltrim();
				this.rtrim();
			},
			ltrim: function () {
				for (var a; this.getFirst && (a = this.getFirst()); ) {
					if (a.type == CKEDITOR.NODE_TEXT) {
						var d = CKEDITOR.tools.ltrim(a.getText()),
							b = a.getLength();
						if (d)
							d.length < b &&
								(a.split(b - d.length), this.$.removeChild(this.$.firstChild));
						else {
							a.remove();
							continue;
						}
					}
					break;
				}
			},
			rtrim: function () {
				for (var a; this.getLast && (a = this.getLast()); ) {
					if (a.type == CKEDITOR.NODE_TEXT) {
						var d = CKEDITOR.tools.rtrim(a.getText()),
							b = a.getLength();
						if (d)
							d.length < b &&
								(a.split(d.length),
								this.$.lastChild.parentNode.removeChild(this.$.lastChild));
						else {
							a.remove();
							continue;
						}
					}
					break;
				}
				CKEDITOR.env.needsBrFiller &&
					(a = this.$.lastChild) &&
					1 == a.type &&
					"br" == a.nodeName.toLowerCase() &&
					a.parentNode.removeChild(a);
			},
			isReadOnly: function (a) {
				var d = this;
				this.type != CKEDITOR.NODE_ELEMENT && (d = this.getParent());
				CKEDITOR.env.edge && d && d.is("textarea", "input") && (a = !0);
				if (!a && d && "undefined" != typeof d.$.isContentEditable)
					return !(d.$.isContentEditable || d.data("cke-editable"));
				for (; d; ) {
					if (d.data("cke-editable")) return !1;
					if (d.hasAttribute("contenteditable"))
						return "false" == d.getAttribute("contenteditable");
					d = d.getParent();
				}
				return !0;
			},
		}),
		(CKEDITOR.dom.window = function (a) {
			CKEDITOR.dom.domObject.call(this, a);
		}),
		(CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject()),
		CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {
			focus: function () {
				this.$.focus();
			},
			getViewPaneSize: function () {
				var a = this.$.document,
					d = "CSS1Compat" == a.compatMode;
				return {
					width: (d ? a.documentElement.clientWidth : a.body.clientWidth) || 0,
					height:
						(d ? a.documentElement.clientHeight : a.body.clientHeight) || 0,
				};
			},
			getScrollPosition: function () {
				var a = this.$;
				if ("pageXOffset" in a)
					return { x: a.pageXOffset || 0, y: a.pageYOffset || 0 };
				a = a.document;
				return {
					x: a.documentElement.scrollLeft || a.body.scrollLeft || 0,
					y: a.documentElement.scrollTop || a.body.scrollTop || 0,
				};
			},
			getFrame: function () {
				var a = this.$.frameElement;
				return a ? new CKEDITOR.dom.element.get(a) : null;
			},
		}),
		(CKEDITOR.dom.document = function (a) {
			CKEDITOR.dom.domObject.call(this, a);
		}),
		(CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject()),
		CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {
			type: CKEDITOR.NODE_DOCUMENT,
			appendStyleSheet: function (a) {
				if (this.$.createStyleSheet) this.$.createStyleSheet(a);
				else {
					var d = new CKEDITOR.dom.element("link");
					d.setAttributes({ rel: "stylesheet", type: "text/css", href: a });
					this.getHead().append(d);
				}
			},
			appendStyleText: function (a) {
				if (this.$.createStyleSheet) {
					var d = this.$.createStyleSheet("");
					d.cssText = a;
				} else {
					var b = new CKEDITOR.dom.element("style", this);
					b.append(new CKEDITOR.dom.text(a, this));
					this.getHead().append(b);
				}
				return d || b.$.sheet;
			},
			createElement: function (a, d) {
				var b = new CKEDITOR.dom.element(a, this);
				d &&
					(d.attributes && b.setAttributes(d.attributes),
					d.styles && b.setStyles(d.styles));
				return b;
			},
			createText: function (a) {
				return new CKEDITOR.dom.text(a, this);
			},
			focus: function () {
				this.getWindow().focus();
			},
			getActive: function () {
				var a;
				try {
					a = this.$.activeElement;
				} catch (d) {
					return null;
				}
				return new CKEDITOR.dom.element(a);
			},
			getById: function (a) {
				return (a = this.$.getElementById(a))
					? new CKEDITOR.dom.element(a)
					: null;
			},
			getByAddress: function (a, d) {
				for (var b = this.$.documentElement, c = 0; b && c < a.length; c++) {
					var g = a[c];
					if (d)
						for (var l = -1, k = 0; k < b.childNodes.length; k++) {
							var h = b.childNodes[k];
							if (
								!0 !== d ||
								3 != h.nodeType ||
								!h.previousSibling ||
								3 != h.previousSibling.nodeType
							)
								if ((l++, l == g)) {
									b = h;
									break;
								}
						}
					else b = b.childNodes[g];
				}
				return b ? new CKEDITOR.dom.node(b) : null;
			},
			getElementsByTag: function (a, d) {
				(CKEDITOR.env.ie && 8 >= document.documentMode) ||
					!d ||
					(a = d + ":" + a);
				return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(a));
			},
			getHead: function () {
				var a = this.$.getElementsByTagName("head")[0];
				return (a = a
					? new CKEDITOR.dom.element(a)
					: this.getDocumentElement().append(
							new CKEDITOR.dom.element("head"),
							!0
					  ));
			},
			getBody: function () {
				return new CKEDITOR.dom.element(this.$.body);
			},
			getDocumentElement: function () {
				return new CKEDITOR.dom.element(this.$.documentElement);
			},
			getWindow: function () {
				return new CKEDITOR.dom.window(
					this.$.parentWindow || this.$.defaultView
				);
			},
			write: function (a) {
				this.$.open("text/html", "replace");
				CKEDITOR.env.ie &&
					(a = a.replace(
						/(?:^\s*<!DOCTYPE[^>]*?>)|^/i,
						'$\x26\n\x3cscript data-cke-temp\x3d"1"\x3e(' +
							CKEDITOR.tools.fixDomain +
							")();\x3c/script\x3e"
					));
				this.$.write(a);
				this.$.close();
			},
			find: function (a) {
				return new CKEDITOR.dom.nodeList(this.$.querySelectorAll(a));
			},
			findOne: function (a) {
				return (a = this.$.querySelector(a))
					? new CKEDITOR.dom.element(a)
					: null;
			},
			_getHtml5ShivFrag: function () {
				var a = this.getCustomData("html5ShivFrag");
				a ||
					((a = this.$.createDocumentFragment()),
					CKEDITOR.tools.enableHtml5Elements(a, !0),
					this.setCustomData("html5ShivFrag", a));
				return a;
			},
		}),
		(CKEDITOR.dom.nodeList = function (a) {
			this.$ = a;
		}),
		(CKEDITOR.dom.nodeList.prototype = {
			count: function () {
				return this.$.length;
			},
			getItem: function (a) {
				return 0 > a || a >= this.$.length
					? null
					: (a = this.$[a])
					? new CKEDITOR.dom.node(a)
					: null;
			},
			toArray: function () {
				return CKEDITOR.tools.array.map(this.$, function (a) {
					return new CKEDITOR.dom.node(a);
				});
			},
		}),
		(CKEDITOR.dom.element = function (a, d) {
			"string" == typeof a && (a = (d ? d.$ : document).createElement(a));
			CKEDITOR.dom.domObject.call(this, a);
		}),
		(CKEDITOR.dom.element.get = function (a) {
			return (
				(a =
					"string" == typeof a
						? document.getElementById(a) || document.getElementsByName(a)[0]
						: a) && (a.$ ? a : new CKEDITOR.dom.element(a))
			);
		}),
		(CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node()),
		(CKEDITOR.dom.element.createFromHtml = function (a, d) {
			var b = new CKEDITOR.dom.element("div", d);
			b.setHtml(a);
			return b.getFirst().remove();
		}),
		(CKEDITOR.dom.element.setMarker = function (a, d, b, c) {
			var g =
					d.getCustomData("list_marker_id") ||
					d
						.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber())
						.getCustomData("list_marker_id"),
				l =
					d.getCustomData("list_marker_names") ||
					d
						.setCustomData("list_marker_names", {})
						.getCustomData("list_marker_names");
			a[g] = d;
			l[b] = 1;
			return d.setCustomData(b, c);
		}),
		(CKEDITOR.dom.element.clearAllMarkers = function (a) {
			for (var d in a) CKEDITOR.dom.element.clearMarkers(a, a[d], 1);
		}),
		(CKEDITOR.dom.element.clearMarkers = function (a, d, b) {
			var c = d.getCustomData("list_marker_names"),
				g = d.getCustomData("list_marker_id"),
				l;
			for (l in c) d.removeCustomData(l);
			d.removeCustomData("list_marker_names");
			b && (d.removeCustomData("list_marker_id"), delete a[g]);
		}),
		(function () {
			function a(a, e) {
				return -1 < (" " + a + " ").replace(l, " ").indexOf(" " + e + " ");
			}
			function d(a) {
				var e = !0;
				a.$.id ||
					((a.$.id = "cke_tmp_" + CKEDITOR.tools.getNextNumber()), (e = !1));
				return function () {
					e || a.removeAttribute("id");
				};
			}
			function b(a, e) {
				var b = CKEDITOR.tools.escapeCss(a.$.id);
				return "#" + b + " " + e.split(/,\s*/).join(", #" + b + " ");
			}
			function c(a) {
				for (var e = 0, b = 0, f = k[a].length; b < f; b++)
					e += parseFloat(this.getComputedStyle(k[a][b]) || 0, 10) || 0;
				return e;
			}
			var g = document.createElement("_").classList,
				g =
					"undefined" !== typeof g &&
					null !== String(g.add).match(/\[Native code\]/gi),
				l = /[\n\t\r]/g;
			CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {
				type: CKEDITOR.NODE_ELEMENT,
				addClass: g
					? function (a) {
							this.$.classList.add(a);
							return this;
					  }
					: function (b) {
							var e = this.$.className;
							e && (a(e, b) || (e += " " + b));
							this.$.className = e || b;
							return this;
					  },
				removeClass: g
					? function (a) {
							var e = this.$;
							e.classList.remove(a);
							e.className || e.removeAttribute("class");
							return this;
					  }
					: function (b) {
							var e = this.getAttribute("class");
							e &&
								a(e, b) &&
								((e = e
									.replace(new RegExp("(?:^|\\s+)" + b + "(?\x3d\\s|$)"), "")
									.replace(/^\s+/, ""))
									? this.setAttribute("class", e)
									: this.removeAttribute("class"));
							return this;
					  },
				hasClass: function (b) {
					return a(this.$.className, b);
				},
				append: function (a, e) {
					"string" == typeof a && (a = this.getDocument().createElement(a));
					e
						? this.$.insertBefore(a.$, this.$.firstChild)
						: this.$.appendChild(a.$);
					return a;
				},
				appendHtml: function (a) {
					if (this.$.childNodes.length) {
						var e = new CKEDITOR.dom.element("div", this.getDocument());
						e.setHtml(a);
						e.moveChildren(this);
					} else this.setHtml(a);
				},
				appendText: function (a) {
					null != this.$.text && CKEDITOR.env.ie && 9 > CKEDITOR.env.version
						? (this.$.text += a)
						: this.append(new CKEDITOR.dom.text(a));
				},
				appendBogus: function (a) {
					if (a || CKEDITOR.env.needsBrFiller) {
						for (
							a = this.getLast();
							a &&
							a.type == CKEDITOR.NODE_TEXT &&
							!CKEDITOR.tools.rtrim(a.getText());

						)
							a = a.getPrevious();
						(a && a.is && a.is("br")) ||
							((a = this.getDocument().createElement("br")),
							CKEDITOR.env.gecko && a.setAttribute("type", "_moz"),
							this.append(a));
					}
				},
				breakParent: function (a, e) {
					var b = new CKEDITOR.dom.range(this.getDocument());
					b.setStartAfter(this);
					b.setEndAfter(a);
					var f = b.extractContents(!1, e || !1),
						c;
					b.insertNode(this.remove());
					if (CKEDITOR.env.ie && !CKEDITOR.env.edge) {
						for (b = new CKEDITOR.dom.element("div"); (c = f.getFirst()); )
							c.$.style.backgroundColor &&
								(c.$.style.backgroundColor = c.$.style.backgroundColor),
								b.append(c);
						b.insertAfter(this);
						b.remove(!0);
					} else f.insertAfterNode(this);
				},
				contains: document.compareDocumentPosition
					? function (a) {
							return !!(this.$.compareDocumentPosition(a.$) & 16);
					  }
					: function (a) {
							var e = this.$;
							return a.type != CKEDITOR.NODE_ELEMENT
								? e.contains(a.getParent().$)
								: e != a.$ && e.contains(a.$);
					  },
				focus: (function () {
					function a() {
						try {
							this.$.focus();
						} catch (e) {}
					}
					return function (e) {
						e ? CKEDITOR.tools.setTimeout(a, 100, this) : a.call(this);
					};
				})(),
				getHtml: function () {
					var a = this.$.innerHTML;
					return CKEDITOR.env.ie ? a.replace(/<\?[^>]*>/g, "") : a;
				},
				getOuterHtml: function () {
					if (this.$.outerHTML)
						return this.$.outerHTML.replace(/<\?[^>]*>/, "");
					var a = this.$.ownerDocument.createElement("div");
					a.appendChild(this.$.cloneNode(!0));
					return a.innerHTML;
				},
				getClientRect: function (a) {
					var e = CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
					!e.width && (e.width = e.right - e.left);
					!e.height && (e.height = e.bottom - e.top);
					return a
						? CKEDITOR.tools.getAbsoluteRectPosition(this.getWindow(), e)
						: e;
				},
				setHtml:
					CKEDITOR.env.ie && 9 > CKEDITOR.env.version
						? function (a) {
								try {
									var e = this.$;
									if (this.getParent()) return (e.innerHTML = a);
									var b = this.getDocument()._getHtml5ShivFrag();
									b.appendChild(e);
									e.innerHTML = a;
									b.removeChild(e);
									return a;
								} catch (f) {
									this.$.innerHTML = "";
									e = new CKEDITOR.dom.element("body", this.getDocument());
									e.$.innerHTML = a;
									for (e = e.getChildren(); e.count(); )
										this.append(e.getItem(0));
									return a;
								}
						  }
						: function (a) {
								return (this.$.innerHTML = a);
						  },
				setText: (function () {
					var a = document.createElement("p");
					a.innerHTML = "x";
					a = a.textContent;
					return function (e) {
						this.$[a ? "textContent" : "innerText"] = e;
					};
				})(),
				getAttribute: (function () {
					var a = function (a) {
						return this.$.getAttribute(a, 2);
					};
					return CKEDITOR.env.ie &&
						(CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks)
						? function (a) {
								switch (a) {
									case "class":
										a = "className";
										break;
									case "http-equiv":
										a = "httpEquiv";
										break;
									case "name":
										return this.$.name;
									case "tabindex":
										return (
											(a = this.$.getAttribute(a, 2)),
											0 !== a && 0 === this.$.tabIndex && (a = null),
											a
										);
									case "checked":
										return (
											(a = this.$.attributes.getNamedItem(a)),
											(a.specified ? a.nodeValue : this.$.checked)
												? "checked"
												: null
										);
									case "hspace":
									case "value":
										return this.$[a];
									case "style":
										return this.$.style.cssText;
									case "contenteditable":
									case "contentEditable":
										return this.$.attributes.getNamedItem("contentEditable")
											.specified
											? this.$.getAttribute("contentEditable")
											: null;
								}
								return this.$.getAttribute(a, 2);
						  }
						: a;
				})(),
				getAttributes: function (a) {
					var e = {},
						b = this.$.attributes,
						f;
					a = CKEDITOR.tools.isArray(a) ? a : [];
					for (f = 0; f < b.length; f++)
						-1 === CKEDITOR.tools.indexOf(a, b[f].name) &&
							(e[b[f].name] = b[f].value);
					return e;
				},
				getChildren: function () {
					return new CKEDITOR.dom.nodeList(this.$.childNodes);
				},
				getComputedStyle:
					document.defaultView && document.defaultView.getComputedStyle
						? function (a) {
								var b = this.getWindow().$.getComputedStyle(this.$, null);
								return b ? b.getPropertyValue(a) : "";
						  }
						: function (a) {
								return this.$.currentStyle[
									CKEDITOR.tools.cssStyleToDomStyle(a)
								];
						  },
				getDtd: function () {
					var a = CKEDITOR.dtd[this.getName()];
					this.getDtd = function () {
						return a;
					};
					return a;
				},
				getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag,
				getTabIndex: function () {
					var a = this.$.tabIndex;
					return 0 !== a ||
						CKEDITOR.dtd.$tabIndex[this.getName()] ||
						0 === parseInt(this.getAttribute("tabindex"), 10)
						? a
						: -1;
				},
				getText: function () {
					return this.$.textContent || this.$.innerText || "";
				},
				getWindow: function () {
					return this.getDocument().getWindow();
				},
				getId: function () {
					return this.$.id || null;
				},
				getNameAtt: function () {
					return this.$.name || null;
				},
				getName: function () {
					var a = this.$.nodeName.toLowerCase();
					if (CKEDITOR.env.ie && 8 >= document.documentMode) {
						var b = this.$.scopeName;
						"HTML" != b && (a = b.toLowerCase() + ":" + a);
					}
					this.getName = function () {
						return a;
					};
					return this.getName();
				},
				getValue: function () {
					return this.$.value;
				},
				getFirst: function (a) {
					var b = this.$.firstChild;
					(b = b && new CKEDITOR.dom.node(b)) &&
						a &&
						!a(b) &&
						(b = b.getNext(a));
					return b;
				},
				getLast: function (a) {
					var b = this.$.lastChild;
					(b = b && new CKEDITOR.dom.node(b)) &&
						a &&
						!a(b) &&
						(b = b.getPrevious(a));
					return b;
				},
				getStyle: function (a) {
					return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)];
				},
				is: function () {
					var a = this.getName();
					if ("object" == typeof arguments[0]) return !!arguments[0][a];
					for (var b = 0; b < arguments.length; b++)
						if (arguments[b] == a) return !0;
					return !1;
				},
				isEditable: function (a) {
					var b = this.getName();
					return this.isReadOnly() ||
						"none" == this.getComputedStyle("display") ||
						"hidden" == this.getComputedStyle("visibility") ||
						CKEDITOR.dtd.$nonEditable[b] ||
						CKEDITOR.dtd.$empty[b] ||
						(this.is("a") &&
							(this.data("cke-saved-name") || this.hasAttribute("name")) &&
							!this.getChildCount())
						? !1
						: !1 !== a
						? ((a = CKEDITOR.dtd[b] || CKEDITOR.dtd.span), !(!a || !a["#"]))
						: !0;
				},
				isIdentical: function (a) {
					var b = this.clone(0, 1);
					a = a.clone(0, 1);
					b.removeAttributes([
						"_moz_dirty",
						"data-cke-expando",
						"data-cke-saved-href",
						"data-cke-saved-name",
					]);
					a.removeAttributes([
						"_moz_dirty",
						"data-cke-expando",
						"data-cke-saved-href",
						"data-cke-saved-name",
					]);
					if (b.$.isEqualNode)
						return (
							(b.$.style.cssText = CKEDITOR.tools.normalizeCssText(
								b.$.style.cssText
							)),
							(a.$.style.cssText = CKEDITOR.tools.normalizeCssText(
								a.$.style.cssText
							)),
							b.$.isEqualNode(a.$)
						);
					b = b.getOuterHtml();
					a = a.getOuterHtml();
					if (CKEDITOR.env.ie && 9 > CKEDITOR.env.version && this.is("a")) {
						var c = this.getParent();
						c.type == CKEDITOR.NODE_ELEMENT &&
							((c = c.clone()),
							c.setHtml(b),
							(b = c.getHtml()),
							c.setHtml(a),
							(a = c.getHtml()));
					}
					return b == a;
				},
				isVisible: function () {
					var a =
							(this.$.offsetHeight || this.$.offsetWidth) &&
							"hidden" != this.getComputedStyle("visibility"),
						b,
						c;
					a &&
						CKEDITOR.env.webkit &&
						((b = this.getWindow()),
						!b.equals(CKEDITOR.document.getWindow()) &&
							(c = b.$.frameElement) &&
							(a = new CKEDITOR.dom.element(c).isVisible()));
					return !!a;
				},
				isEmptyInlineRemoveable: function () {
					if (!CKEDITOR.dtd.$removeEmpty[this.getName()]) return !1;
					for (var a = this.getChildren(), b = 0, c = a.count(); b < c; b++) {
						var f = a.getItem(b);
						if (f.type != CKEDITOR.NODE_ELEMENT || !f.data("cke-bookmark"))
							if (
								(f.type == CKEDITOR.NODE_ELEMENT &&
									!f.isEmptyInlineRemoveable()) ||
								(f.type == CKEDITOR.NODE_TEXT &&
									CKEDITOR.tools.trim(f.getText()))
							)
								return !1;
					}
					return !0;
				},
				hasAttributes:
					CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks)
						? function () {
								for (var a = this.$.attributes, b = 0; b < a.length; b++) {
									var c = a[b];
									switch (c.nodeName) {
										case "class":
											if (this.getAttribute("class")) return !0;
										case "data-cke-expando":
											continue;
										default:
											if (c.specified) return !0;
									}
								}
								return !1;
						  }
						: function () {
								var a = this.$.attributes,
									b = a.length,
									c = { "data-cke-expando": 1, _moz_dirty: 1 };
								return (
									0 < b &&
									(2 < b || !c[a[0].nodeName] || (2 == b && !c[a[1].nodeName]))
								);
						  },
				hasAttribute: (function () {
					function a(b) {
						var c = this.$.attributes.getNamedItem(b);
						if ("input" == this.getName())
							switch (b) {
								case "class":
									return 0 < this.$.className.length;
								case "checked":
									return !!this.$.checked;
								case "value":
									return (
										(b = this.getAttribute("type")),
										"checkbox" == b || "radio" == b
											? "on" != this.$.value
											: !!this.$.value
									);
							}
						return c ? c.specified : !1;
					}
					return CKEDITOR.env.ie
						? 8 > CKEDITOR.env.version
							? function (b) {
									return "name" == b ? !!this.$.name : a.call(this, b);
							  }
							: a
						: function (a) {
								return !!this.$.attributes.getNamedItem(a);
						  };
				})(),
				hide: function () {
					this.setStyle("display", "none");
				},
				moveChildren: function (a, b) {
					var c = this.$;
					a = a.$;
					if (c != a) {
						var f;
						if (b)
							for (; (f = c.lastChild); )
								a.insertBefore(c.removeChild(f), a.firstChild);
						else for (; (f = c.firstChild); ) a.appendChild(c.removeChild(f));
					}
				},
				mergeSiblings: (function () {
					function a(b, c, f) {
						if (c && c.type == CKEDITOR.NODE_ELEMENT) {
							for (
								var h = [];
								c.data("cke-bookmark") || c.isEmptyInlineRemoveable();

							)
								if (
									(h.push(c),
									(c = f ? c.getNext() : c.getPrevious()),
									!c || c.type != CKEDITOR.NODE_ELEMENT)
								)
									return;
							if (b.isIdentical(c)) {
								for (var g = f ? b.getLast() : b.getFirst(); h.length; )
									h.shift().move(b, !f);
								c.moveChildren(b, !f);
								c.remove();
								g && g.type == CKEDITOR.NODE_ELEMENT && g.mergeSiblings();
							}
						}
					}
					return function (b) {
						if (
							!1 === b ||
							CKEDITOR.dtd.$removeEmpty[this.getName()] ||
							this.is("a")
						)
							a(this, this.getNext(), !0), a(this, this.getPrevious());
					};
				})(),
				show: function () {
					this.setStyles({ display: "", visibility: "" });
				},
				setAttribute: (function () {
					var a = function (a, b) {
						this.$.setAttribute(a, b);
						return this;
					};
					return CKEDITOR.env.ie &&
						(CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks)
						? function (b, c) {
								"class" == b
									? (this.$.className = c)
									: "style" == b
									? (this.$.style.cssText = c)
									: "tabindex" == b
									? (this.$.tabIndex = c)
									: "checked" == b
									? (this.$.checked = c)
									: "contenteditable" == b
									? a.call(this, "contentEditable", c)
									: a.apply(this, arguments);
								return this;
						  }
						: CKEDITOR.env.ie8Compat && CKEDITOR.env.secure
						? function (b, c) {
								if ("src" == b && c.match(/^http:\/\//))
									try {
										a.apply(this, arguments);
									} catch (f) {}
								else a.apply(this, arguments);
								return this;
						  }
						: a;
				})(),
				setAttributes: function (a) {
					for (var b in a) this.setAttribute(b, a[b]);
					return this;
				},
				setValue: function (a) {
					this.$.value = a;
					return this;
				},
				removeAttribute: (function () {
					var a = function (a) {
						this.$.removeAttribute(a);
					};
					return CKEDITOR.env.ie &&
						(CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks)
						? function (a) {
								"class" == a
									? (a = "className")
									: "tabindex" == a
									? (a = "tabIndex")
									: "contenteditable" == a && (a = "contentEditable");
								this.$.removeAttribute(a);
						  }
						: a;
				})(),
				removeAttributes: function (a) {
					if (CKEDITOR.tools.isArray(a))
						for (var b = 0; b < a.length; b++) this.removeAttribute(a[b]);
					else
						for (b in ((a = a || this.getAttributes()), a))
							a.hasOwnProperty(b) && this.removeAttribute(b);
				},
				removeStyle: function (a) {
					var b = this.$.style;
					if (
						b.removeProperty ||
						("border" != a && "margin" != a && "padding" != a)
					)
						b.removeProperty
							? b.removeProperty(a)
							: b.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a)),
							this.$.style.cssText || this.removeAttribute("style");
					else {
						var c = ["top", "left", "right", "bottom"],
							f;
						"border" == a && (f = ["color", "style", "width"]);
						for (var b = [], g = 0; g < c.length; g++)
							if (f)
								for (var d = 0; d < f.length; d++)
									b.push([a, c[g], f[d]].join("-"));
							else b.push([a, c[g]].join("-"));
						for (a = 0; a < b.length; a++) this.removeStyle(b[a]);
					}
				},
				setStyle: function (a, b) {
					this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] = b;
					return this;
				},
				setStyles: function (a) {
					for (var b in a) this.setStyle(b, a[b]);
					return this;
				},
				setOpacity: function (a) {
					CKEDITOR.env.ie && 9 > CKEDITOR.env.version
						? ((a = Math.round(100 * a)),
						  this.setStyle(
								"filter",
								100 <= a
									? ""
									: "progid:DXImageTransform.Microsoft.Alpha(opacity\x3d" +
											a +
											")"
						  ))
						: this.setStyle("opacity", a);
				},
				unselectable: function () {
					this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "none"));
					if (CKEDITOR.env.ie) {
						this.setAttribute("unselectable", "on");
						for (
							var a, b = this.getElementsByTag("*"), c = 0, f = b.count();
							c < f;
							c++
						)
							(a = b.getItem(c)), a.setAttribute("unselectable", "on");
					}
				},
				getPositionedAncestor: function () {
					for (var a = this; "html" != a.getName(); ) {
						if ("static" != a.getComputedStyle("position")) return a;
						a = a.getParent();
					}
					return null;
				},
				getDocumentPosition: function (a) {
					var b = 0,
						c = 0,
						f = this.getDocument(),
						g = f.getBody(),
						d = "BackCompat" == f.$.compatMode;
					if (
						document.documentElement.getBoundingClientRect &&
						(CKEDITOR.env.ie ? 8 !== CKEDITOR.env.version : 1)
					) {
						var l = this.$.getBoundingClientRect(),
							k = f.$.documentElement,
							p = k.clientTop || g.$.clientTop || 0,
							u = k.clientLeft || g.$.clientLeft || 0,
							w = !0;
						CKEDITOR.env.ie &&
							((w = f.getDocumentElement().contains(this)),
							(f = f.getBody().contains(this)),
							(w = (d && f) || (!d && w)));
						w &&
							(CKEDITOR.env.webkit ||
							(CKEDITOR.env.ie && 12 <= CKEDITOR.env.version)
								? ((b = g.$.scrollLeft || k.scrollLeft),
								  (c = g.$.scrollTop || k.scrollTop))
								: ((c = d ? g.$ : k), (b = c.scrollLeft), (c = c.scrollTop)),
							(b = l.left + b - u),
							(c = l.top + c - p));
					} else
						for (
							p = this, u = null;
							p && "body" != p.getName() && "html" != p.getName();

						) {
							b += p.$.offsetLeft - p.$.scrollLeft;
							c += p.$.offsetTop - p.$.scrollTop;
							p.equals(this) ||
								((b += p.$.clientLeft || 0), (c += p.$.clientTop || 0));
							for (; u && !u.equals(p); )
								(b -= u.$.scrollLeft),
									(c -= u.$.scrollTop),
									(u = u.getParent());
							u = p;
							p = (l = p.$.offsetParent) ? new CKEDITOR.dom.element(l) : null;
						}
					a &&
						((l = this.getWindow()),
						(p = a.getWindow()),
						!l.equals(p) &&
							l.$.frameElement &&
							((a = new CKEDITOR.dom.element(
								l.$.frameElement
							).getDocumentPosition(a)),
							(b += a.x),
							(c += a.y)));
					document.documentElement.getBoundingClientRect ||
						!CKEDITOR.env.gecko ||
						d ||
						((b += this.$.clientLeft ? 1 : 0), (c += this.$.clientTop ? 1 : 0));
					return { x: b, y: c };
				},
				scrollIntoView: function (a) {
					var b = this.getParent();
					if (b) {
						do
							if (
								(((b.$.clientWidth && b.$.clientWidth < b.$.scrollWidth) ||
									(b.$.clientHeight && b.$.clientHeight < b.$.scrollHeight)) &&
									!b.is("body") &&
									this.scrollIntoParent(b, a, 1),
								b.is("html"))
							) {
								var c = b.getWindow();
								try {
									var f = c.$.frameElement;
									f && (b = new CKEDITOR.dom.element(f));
								} catch (g) {}
							}
						while ((b = b.getParent()));
					}
				},
				scrollIntoParent: function (a, b, c) {
					var f, g, d, l;
					function k(f, b) {
						/body|html/.test(a.getName())
							? a.getWindow().$.scrollBy(f, b)
							: ((a.$.scrollLeft += f), (a.$.scrollTop += b));
					}
					function p(a, f) {
						var b = { x: 0, y: 0 };
						if (!a.is(w ? "body" : "html")) {
							var c = a.$.getBoundingClientRect();
							b.x = c.left;
							b.y = c.top;
						}
						c = a.getWindow();
						c.equals(f) ||
							((c = p(CKEDITOR.dom.element.get(c.$.frameElement), f)),
							(b.x += c.x),
							(b.y += c.y));
						return b;
					}
					function u(a, f) {
						return parseInt(a.getComputedStyle("margin-" + f) || 0, 10) || 0;
					}
					!a && (a = this.getWindow());
					d = a.getDocument();
					var w = "BackCompat" == d.$.compatMode;
					a instanceof CKEDITOR.dom.window &&
						(a = w ? d.getBody() : d.getDocumentElement());
					CKEDITOR.env.webkit &&
						(d = this.getEditor(!1)) &&
						(d._.previousScrollTop = null);
					d = a.getWindow();
					g = p(this, d);
					var q = p(a, d),
						z = this.$.offsetHeight;
					f = this.$.offsetWidth;
					var t = a.$.clientHeight,
						y = a.$.clientWidth;
					d = g.x - u(this, "left") - q.x || 0;
					l = g.y - u(this, "top") - q.y || 0;
					f = g.x + f + u(this, "right") - (q.x + y) || 0;
					g = g.y + z + u(this, "bottom") - (q.y + t) || 0;
					(0 > l || 0 < g) && k(0, !0 === b ? l : !1 === b ? g : 0 > l ? l : g);
					c && (0 > d || 0 < f) && k(0 > d ? d : f, 0);
				},
				setState: function (a, b, c) {
					b = b || "cke";
					switch (a) {
						case CKEDITOR.TRISTATE_ON:
							this.addClass(b + "_on");
							this.removeClass(b + "_off");
							this.removeClass(b + "_disabled");
							c && this.setAttribute("aria-pressed", !0);
							c && this.removeAttribute("aria-disabled");
							break;
						case CKEDITOR.TRISTATE_DISABLED:
							this.addClass(b + "_disabled");
							this.removeClass(b + "_off");
							this.removeClass(b + "_on");
							c && this.setAttribute("aria-disabled", !0);
							c && this.removeAttribute("aria-pressed");
							break;
						default:
							this.addClass(b + "_off"),
								this.removeClass(b + "_on"),
								this.removeClass(b + "_disabled"),
								c && this.removeAttribute("aria-pressed"),
								c && this.removeAttribute("aria-disabled");
					}
				},
				getFrameDocument: function () {
					var a = this.$;
					try {
						a.contentWindow.document;
					} catch (b) {
						a.src = a.src;
					}
					return a && new CKEDITOR.dom.document(a.contentWindow.document);
				},
				copyAttributes: function (a, b) {
					var c = this.$.attributes;
					b = b || {};
					for (var f = 0; f < c.length; f++) {
						var g = c[f],
							d = g.nodeName.toLowerCase(),
							l;
						if (!(d in b))
							if ("checked" == d && (l = this.getAttribute(d)))
								a.setAttribute(d, l);
							else if (!CKEDITOR.env.ie || this.hasAttribute(d))
								(l = this.getAttribute(d)),
									null === l && (l = g.nodeValue),
									a.setAttribute(d, l);
					}
					"" !== this.$.style.cssText &&
						(a.$.style.cssText = this.$.style.cssText);
				},
				renameNode: function (a) {
					if (this.getName() != a) {
						var b = this.getDocument();
						a = new CKEDITOR.dom.element(a, b);
						this.copyAttributes(a);
						this.moveChildren(a);
						this.getParent(!0) && this.$.parentNode.replaceChild(a.$, this.$);
						a.$["data-cke-expando"] = this.$["data-cke-expando"];
						this.$ = a.$;
						delete this.getName;
					}
				},
				getChild: (function () {
					function a(b, c) {
						var f = b.childNodes;
						if (0 <= c && c < f.length) return f[c];
					}
					return function (b) {
						var c = this.$;
						if (b.slice)
							for (b = b.slice(); 0 < b.length && c; ) c = a(c, b.shift());
						else c = a(c, b);
						return c ? new CKEDITOR.dom.node(c) : null;
					};
				})(),
				getChildCount: function () {
					return this.$.childNodes.length;
				},
				disableContextMenu: function () {
					function a(b) {
						return (
							b.type == CKEDITOR.NODE_ELEMENT &&
							b.hasClass("cke_enable_context_menu")
						);
					}
					this.on("contextmenu", function (b) {
						b.data.getTarget().getAscendant(a, !0) || b.data.preventDefault();
					});
				},
				getDirection: function (a) {
					return a
						? this.getComputedStyle("direction") ||
								this.getDirection() ||
								(this.getParent() && this.getParent().getDirection(1)) ||
								this.getDocument().$.dir ||
								"ltr"
						: this.getStyle("direction") || this.getAttribute("dir");
				},
				data: function (a, b) {
					a = "data-" + a;
					if (void 0 === b) return this.getAttribute(a);
					!1 === b ? this.removeAttribute(a) : this.setAttribute(a, b);
					return null;
				},
				getEditor: function (a) {
					var b = CKEDITOR.instances,
						c,
						f,
						g;
					a = a || void 0 === a;
					for (c in b)
						if (
							((f = b[c]),
							(f.element.equals(this) &&
								f.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) ||
								(!a &&
									(g = f.editable()) &&
									(g.equals(this) || g.contains(this))))
						)
							return f;
					return null;
				},
				find: function (a) {
					var c = d(this);
					a = new CKEDITOR.dom.nodeList(this.$.querySelectorAll(b(this, a)));
					c();
					return a;
				},
				findOne: function (a) {
					var c = d(this);
					a = this.$.querySelector(b(this, a));
					c();
					return a ? new CKEDITOR.dom.element(a) : null;
				},
				forEach: function (a, b, c) {
					if (!(c || (b && this.type != b))) var f = a(this);
					if (!1 !== f) {
						c = this.getChildren();
						for (var g = 0; g < c.count(); g++)
							(f = c.getItem(g)),
								f.type == CKEDITOR.NODE_ELEMENT
									? f.forEach(a, b)
									: (b && f.type != b) || a(f);
					}
				},
			});
			var k = {
				width: [
					"border-left-width",
					"border-right-width",
					"padding-left",
					"padding-right",
				],
				height: [
					"border-top-width",
					"border-bottom-width",
					"padding-top",
					"padding-bottom",
				],
			};
			CKEDITOR.dom.element.prototype.setSize = function (a, b, g) {
				"number" == typeof b &&
					(!g ||
						(CKEDITOR.env.ie && CKEDITOR.env.quirks) ||
						(b -= c.call(this, a)),
					this.setStyle(a, b + "px"));
			};
			CKEDITOR.dom.element.prototype.getSize = function (a, b) {
				var g =
					Math.max(
						this.$["offset" + CKEDITOR.tools.capitalize(a)],
						this.$["client" + CKEDITOR.tools.capitalize(a)]
					) || 0;
				b && (g -= c.call(this, a));
				return g;
			};
		})(),
		(CKEDITOR.dom.documentFragment = function (a) {
			a = a || CKEDITOR.document;
			this.$ =
				a.type == CKEDITOR.NODE_DOCUMENT ? a.$.createDocumentFragment() : a;
		}),
		CKEDITOR.tools.extend(
			CKEDITOR.dom.documentFragment.prototype,
			CKEDITOR.dom.element.prototype,
			{
				type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
				insertAfterNode: function (a) {
					a = a.$;
					a.parentNode.insertBefore(this.$, a.nextSibling);
				},
				getHtml: function () {
					var a = new CKEDITOR.dom.element("div");
					this.clone(1, 1).appendTo(a);
					return a.getHtml().replace(/\s*data-cke-expando=".*?"/g, "");
				},
			},
			!0,
			{
				append: 1,
				appendBogus: 1,
				clone: 1,
				getFirst: 1,
				getHtml: 1,
				getLast: 1,
				getParent: 1,
				getNext: 1,
				getPrevious: 1,
				appendTo: 1,
				moveChildren: 1,
				insertBefore: 1,
				insertAfterNode: 1,
				replace: 1,
				trim: 1,
				type: 1,
				ltrim: 1,
				rtrim: 1,
				getDocument: 1,
				getChildCount: 1,
				getChild: 1,
				getChildren: 1,
			}
		),
		(function () {
			function a(a, b) {
				var f = this.range;
				if (this._.end) return null;
				if (!this._.start) {
					this._.start = 1;
					if (f.collapsed) return this.end(), null;
					f.optimize();
				}
				var c,
					e = f.startContainer;
				c = f.endContainer;
				var g = f.startOffset,
					h = f.endOffset,
					n,
					d = this.guard,
					m = this.type,
					l = a ? "getPreviousSourceNode" : "getNextSourceNode";
				if (!a && !this._.guardLTR) {
					var k = c.type == CKEDITOR.NODE_ELEMENT ? c : c.getParent(),
						A = c.type == CKEDITOR.NODE_ELEMENT ? c.getChild(h) : c.getNext();
					this._.guardLTR = function (a, b) {
						return (
							(!b || !k.equals(a)) &&
							(!A || !a.equals(A)) &&
							(a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(f.root))
						);
					};
				}
				if (a && !this._.guardRTL) {
					var H = e.type == CKEDITOR.NODE_ELEMENT ? e : e.getParent(),
						G =
							e.type == CKEDITOR.NODE_ELEMENT
								? g
									? e.getChild(g - 1)
									: null
								: e.getPrevious();
					this._.guardRTL = function (a, b) {
						return (
							(!b || !H.equals(a)) &&
							(!G || !a.equals(G)) &&
							(a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(f.root))
						);
					};
				}
				var J = a ? this._.guardRTL : this._.guardLTR;
				n = d
					? function (a, b) {
							return !1 === J(a, b) ? !1 : d(a, b);
					  }
					: J;
				this.current
					? (c = this.current[l](!1, m, n))
					: (a
							? c.type == CKEDITOR.NODE_ELEMENT &&
							  (c =
									0 < h
										? c.getChild(h - 1)
										: !1 === n(c, !0)
										? null
										: c.getPreviousSourceNode(!0, m, n))
							: ((c = e),
							  c.type == CKEDITOR.NODE_ELEMENT &&
									((c = c.getChild(g)) ||
										(c =
											!1 === n(e, !0) ? null : e.getNextSourceNode(!0, m, n)))),
					  c && !1 === n(c) && (c = null));
				for (; c && !this._.end; ) {
					this.current = c;
					if (!this.evaluator || !1 !== this.evaluator(c)) {
						if (!b) return c;
					} else if (b && this.evaluator) return !1;
					c = c[l](!1, m, n);
				}
				this.end();
				return (this.current = null);
			}
			function d(b) {
				for (var f, c = null; (f = a.call(this, b)); ) c = f;
				return c;
			}
			CKEDITOR.dom.walker = CKEDITOR.tools.createClass({
				$: function (a) {
					this.range = a;
					this._ = {};
				},
				proto: {
					end: function () {
						this._.end = 1;
					},
					next: function () {
						return a.call(this);
					},
					previous: function () {
						return a.call(this, 1);
					},
					checkForward: function () {
						return !1 !== a.call(this, 0, 1);
					},
					checkBackward: function () {
						return !1 !== a.call(this, 1, 1);
					},
					lastForward: function () {
						return d.call(this);
					},
					lastBackward: function () {
						return d.call(this, 1);
					},
					reset: function () {
						delete this.current;
						this._ = {};
					},
				},
			});
			var b = {
					block: 1,
					"list-item": 1,
					table: 1,
					"table-row-group": 1,
					"table-header-group": 1,
					"table-footer-group": 1,
					"table-row": 1,
					"table-column-group": 1,
					"table-column": 1,
					"table-cell": 1,
					"table-caption": 1,
				},
				c = { absolute: 1, fixed: 1 };
			CKEDITOR.dom.element.prototype.isBlockBoundary = function (a) {
				return "none" != this.getComputedStyle("float") ||
					this.getComputedStyle("position") in c ||
					!b[this.getComputedStyle("display")]
					? !!(this.is(CKEDITOR.dtd.$block) || (a && this.is(a)))
					: !0;
			};
			CKEDITOR.dom.walker.blockBoundary = function (a) {
				return function (b) {
					return !(b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary(a));
				};
			};
			CKEDITOR.dom.walker.listItemBoundary = function () {
				return this.blockBoundary({ br: 1 });
			};
			CKEDITOR.dom.walker.bookmark = function (a, b) {
				function f(a) {
					return (
						a && a.getName && "span" == a.getName() && a.data("cke-bookmark")
					);
				}
				return function (c) {
					var e, g;
					e =
						c && c.type != CKEDITOR.NODE_ELEMENT && (g = c.getParent()) && f(g);
					e = a ? e : e || f(c);
					return !!(b ^ e);
				};
			};
			CKEDITOR.dom.walker.whitespaces = function (a) {
				return function (b) {
					var f;
					b &&
						b.type == CKEDITOR.NODE_TEXT &&
						(f =
							!CKEDITOR.tools.trim(b.getText()) ||
							(CKEDITOR.env.webkit &&
								b.getText() == CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE));
					return !!(a ^ f);
				};
			};
			CKEDITOR.dom.walker.invisible = function (a) {
				var b = CKEDITOR.dom.walker.whitespaces(),
					f = CKEDITOR.env.webkit ? 1 : 0;
				return function (c) {
					b(c)
						? (c = 1)
						: (c.type == CKEDITOR.NODE_TEXT && (c = c.getParent()),
						  (c = c.$.offsetWidth <= f));
					return !!(a ^ c);
				};
			};
			CKEDITOR.dom.walker.nodeType = function (a, b) {
				return function (f) {
					return !!(b ^ (f.type == a));
				};
			};
			CKEDITOR.dom.walker.bogus = function (a) {
				function b(a) {
					return !l(a) && !k(a);
				}
				return function (f) {
					var c = CKEDITOR.env.needsBrFiller
						? f.is && f.is("br")
						: f.getText && g.test(f.getText());
					c &&
						((c = f.getParent()),
						(f = f.getNext(b)),
						(c =
							c.isBlockBoundary() &&
							(!f ||
								(f.type == CKEDITOR.NODE_ELEMENT && f.isBlockBoundary()))));
					return !!(a ^ c);
				};
			};
			CKEDITOR.dom.walker.temp = function (a) {
				return function (b) {
					b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent());
					b = b && b.hasAttribute("data-cke-temp");
					return !!(a ^ b);
				};
			};
			var g = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
				l = CKEDITOR.dom.walker.whitespaces(),
				k = CKEDITOR.dom.walker.bookmark(),
				h = CKEDITOR.dom.walker.temp(),
				e = function (a) {
					return (
						k(a) ||
						l(a) ||
						(a.type == CKEDITOR.NODE_ELEMENT &&
							a.is(CKEDITOR.dtd.$inline) &&
							!a.is(CKEDITOR.dtd.$empty))
					);
				};
			CKEDITOR.dom.walker.ignored = function (a) {
				return function (b) {
					b = l(b) || k(b) || h(b);
					return !!(a ^ b);
				};
			};
			var m = CKEDITOR.dom.walker.ignored();
			CKEDITOR.dom.walker.empty = function (a) {
				return function (b) {
					for (var f = 0, c = b.getChildCount(); f < c; ++f)
						if (!m(b.getChild(f))) return !!a;
					return !a;
				};
			};
			var f = CKEDITOR.dom.walker.empty(),
				n = (CKEDITOR.dom.walker.validEmptyBlockContainers = CKEDITOR.tools.extend(
					(function (a) {
						var b = {},
							f;
						for (f in a) CKEDITOR.dtd[f]["#"] && (b[f] = 1);
						return b;
					})(CKEDITOR.dtd.$block),
					{ caption: 1, td: 1, th: 1 }
				));
			CKEDITOR.dom.walker.editable = function (a) {
				return function (b) {
					b = m(b)
						? !1
						: b.type == CKEDITOR.NODE_TEXT ||
						  (b.type == CKEDITOR.NODE_ELEMENT &&
								(b.is(CKEDITOR.dtd.$inline) ||
									b.is("hr") ||
									"false" == b.getAttribute("contenteditable") ||
									(!CKEDITOR.env.needsBrFiller && b.is(n) && f(b))))
						? !0
						: !1;
					return !!(a ^ b);
				};
			};
			CKEDITOR.dom.element.prototype.getBogus = function () {
				var a = this;
				do a = a.getPreviousSourceNode();
				while (e(a));
				return a &&
					(CKEDITOR.env.needsBrFiller
						? a.is && a.is("br")
						: a.getText && g.test(a.getText()))
					? a
					: !1;
			};
		})(),
		(CKEDITOR.dom.range = function (a) {
			this.endOffset = this.endContainer = this.startOffset = this.startContainer = null;
			this.collapsed = !0;
			var d = a instanceof CKEDITOR.dom.document;
			this.document = d ? a : a.getDocument();
			this.root = d ? a.getBody() : a;
		}),
		(function () {
			function a(a) {
				a.collapsed =
					a.startContainer &&
					a.endContainer &&
					a.startContainer.equals(a.endContainer) &&
					a.startOffset == a.endOffset;
			}
			function d(a, b, c, e, g) {
				function h(a, b, f, c) {
					var e = f ? a.getPrevious() : a.getNext();
					if (c && l) return e;
					t || c
						? b.append(a.clone(!0, g), f)
						: (a.remove(), k && b.append(a, f));
					return e;
				}
				function d() {
					var a,
						b,
						f,
						c = Math.min(I.length, D.length);
					for (a = 0; a < c; a++)
						if (((b = I[a]), (f = D[a]), !b.equals(f))) return a;
					return a - 1;
				}
				function m() {
					var b = Q - 1,
						c = J && E && !y.equals(C);
					b < T - 1 || b < R - 1 || c
						? (c
								? a.moveToPosition(C, CKEDITOR.POSITION_BEFORE_START)
								: R == b + 1 && G
								? a.moveToPosition(D[b], CKEDITOR.POSITION_BEFORE_END)
								: a.moveToPosition(D[b + 1], CKEDITOR.POSITION_BEFORE_START),
						  e &&
								(b = I[b + 1]) &&
								b.type == CKEDITOR.NODE_ELEMENT &&
								((c = CKEDITOR.dom.element.createFromHtml(
									'\x3cspan data-cke-bookmark\x3d"1" style\x3d"display:none"\x3e\x26nbsp;\x3c/span\x3e',
									a.document
								)),
								c.insertAfter(b),
								b.mergeSiblings(!1),
								a.moveToBookmark({ startNode: c })))
						: a.collapse(!0);
				}
				a.optimizeBookmark();
				var l = 0 === b,
					k = 1 == b,
					t = 2 == b;
				b = t || k;
				var y = a.startContainer,
					C = a.endContainer,
					B = a.startOffset,
					A = a.endOffset,
					H,
					G,
					J,
					E,
					F,
					L;
				if (
					t &&
					C.type == CKEDITOR.NODE_TEXT &&
					(y.equals(C) ||
						(y.type === CKEDITOR.NODE_ELEMENT && y.getFirst().equals(C)))
				)
					c.append(a.document.createText(C.substring(B, A)));
				else {
					C.type == CKEDITOR.NODE_TEXT
						? t
							? (L = !0)
							: (C = C.split(A))
						: 0 < C.getChildCount()
						? A >= C.getChildCount()
							? ((C = C.getChild(A - 1)), (G = !0))
							: (C = C.getChild(A))
						: (E = G = !0);
					y.type == CKEDITOR.NODE_TEXT
						? t
							? (F = !0)
							: y.split(B)
						: 0 < y.getChildCount()
						? 0 === B
							? ((y = y.getChild(B)), (H = !0))
							: (y = y.getChild(B - 1))
						: (J = H = !0);
					for (
						var I = y.getParents(),
							D = C.getParents(),
							Q = d(),
							T = I.length - 1,
							R = D.length - 1,
							K = c,
							W,
							V,
							X,
							da = -1,
							O = Q;
						O <= T;
						O++
					) {
						V = I[O];
						X = V.getNext();
						for (
							O != T || (V.equals(D[O]) && T < R)
								? b && (W = K.append(V.clone(0, g)))
								: H
								? h(V, K, !1, J)
								: F && K.append(a.document.createText(V.substring(B)));
							X;

						) {
							if (X.equals(D[O])) {
								da = O;
								break;
							}
							X = h(X, K);
						}
						K = W;
					}
					K = c;
					for (O = Q; O <= R; O++)
						if (((c = D[O]), (X = c.getPrevious()), c.equals(I[O])))
							b && (K = K.getChild(0));
						else {
							O != R || (c.equals(I[O]) && R < T)
								? b && (W = K.append(c.clone(0, g)))
								: G
								? h(c, K, !1, E)
								: L && K.append(a.document.createText(c.substring(0, A)));
							if (O > da) for (; X; ) X = h(X, K, !0);
							K = W;
						}
					t || m();
				}
			}
			function b() {
				var a = !1,
					b = CKEDITOR.dom.walker.whitespaces(),
					c = CKEDITOR.dom.walker.bookmark(!0),
					e = CKEDITOR.dom.walker.bogus();
				return function (g) {
					return c(g) || b(g)
						? !0
						: e(g) && !a
						? (a = !0)
						: (g.type == CKEDITOR.NODE_TEXT &&
								(g.hasAscendant("pre") ||
									CKEDITOR.tools.trim(g.getText()).length)) ||
						  (g.type == CKEDITOR.NODE_ELEMENT && !g.is(l))
						? !1
						: !0;
				};
			}
			function c(a) {
				var b = CKEDITOR.dom.walker.whitespaces(),
					c = CKEDITOR.dom.walker.bookmark(1);
				return function (e) {
					return c(e) || b(e)
						? !0
						: (!a && k(e)) ||
								(e.type == CKEDITOR.NODE_ELEMENT &&
									e.is(CKEDITOR.dtd.$removeEmpty));
				};
			}
			function g(a) {
				return function () {
					var b;
					return this[a ? "getPreviousNode" : "getNextNode"](function (a) {
						!b && m(a) && (b = a);
						return e(a) && !(k(a) && a.equals(b));
					});
				};
			}
			var l = {
					abbr: 1,
					acronym: 1,
					b: 1,
					bdo: 1,
					big: 1,
					cite: 1,
					code: 1,
					del: 1,
					dfn: 1,
					em: 1,
					font: 1,
					i: 1,
					ins: 1,
					label: 1,
					kbd: 1,
					q: 1,
					samp: 1,
					small: 1,
					span: 1,
					strike: 1,
					strong: 1,
					sub: 1,
					sup: 1,
					tt: 1,
					u: 1,
					var: 1,
				},
				k = CKEDITOR.dom.walker.bogus(),
				h = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
				e = CKEDITOR.dom.walker.editable(),
				m = CKEDITOR.dom.walker.ignored(!0);
			CKEDITOR.dom.range.prototype = {
				clone: function () {
					var a = new CKEDITOR.dom.range(this.root);
					a._setStartContainer(this.startContainer);
					a.startOffset = this.startOffset;
					a._setEndContainer(this.endContainer);
					a.endOffset = this.endOffset;
					a.collapsed = this.collapsed;
					return a;
				},
				collapse: function (a) {
					a
						? (this._setEndContainer(this.startContainer),
						  (this.endOffset = this.startOffset))
						: (this._setStartContainer(this.endContainer),
						  (this.startOffset = this.endOffset));
					this.collapsed = !0;
				},
				cloneContents: function (a) {
					var b = new CKEDITOR.dom.documentFragment(this.document);
					this.collapsed || d(this, 2, b, !1, "undefined" == typeof a ? !0 : a);
					return b;
				},
				deleteContents: function (a) {
					this.collapsed || d(this, 0, null, a);
				},
				extractContents: function (a, b) {
					var c = new CKEDITOR.dom.documentFragment(this.document);
					this.collapsed || d(this, 1, c, a, "undefined" == typeof b ? !0 : b);
					return c;
				},
				createBookmark: function (a) {
					var b,
						c,
						e,
						g,
						h = this.collapsed;
					b = this.document.createElement("span");
					b.data("cke-bookmark", 1);
					b.setStyle("display", "none");
					b.setHtml("\x26nbsp;");
					a &&
						((e = "cke_bm_" + CKEDITOR.tools.getNextNumber()),
						b.setAttribute("id", e + (h ? "C" : "S")));
					h ||
						((c = b.clone()),
						c.setHtml("\x26nbsp;"),
						a && c.setAttribute("id", e + "E"),
						(g = this.clone()),
						g.collapse(),
						g.insertNode(c));
					g = this.clone();
					g.collapse(!0);
					g.insertNode(b);
					c
						? (this.setStartAfter(b), this.setEndBefore(c))
						: this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END);
					return {
						startNode: a ? e + (h ? "C" : "S") : b,
						endNode: a ? e + "E" : c,
						serializable: a,
						collapsed: h,
					};
				},
				createBookmark2: (function () {
					function a(b) {
						var f = b.container,
							e = b.offset,
							g;
						g = f;
						var h = e;
						g =
							g.type != CKEDITOR.NODE_ELEMENT ||
							0 === h ||
							h == g.getChildCount()
								? 0
								: g.getChild(h - 1).type == CKEDITOR.NODE_TEXT &&
								  g.getChild(h).type == CKEDITOR.NODE_TEXT;
						g && ((f = f.getChild(e - 1)), (e = f.getLength()));
						if (f.type == CKEDITOR.NODE_ELEMENT && 0 < e) {
							a: {
								for (g = f; e--; )
									if (((h = g.getChild(e).getIndex(!0)), 0 <= h)) {
										e = h;
										break a;
									}
								e = -1;
							}
							e += 1;
						}
						if (f.type == CKEDITOR.NODE_TEXT) {
							g = f;
							for (
								h = 0;
								(g = g.getPrevious()) && g.type == CKEDITOR.NODE_TEXT;

							)
								h += g
									.getText()
									.replace(CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE, "")
									.length;
							g = h;
							f.getText()
								? (e += g)
								: ((h = f.getPrevious(c)),
								  g
										? ((e = g),
										  (f = h ? h.getNext() : f.getParent().getFirst()))
										: ((f = f.getParent()), (e = h ? h.getIndex(!0) + 1 : 0)));
						}
						b.container = f;
						b.offset = e;
					}
					function b(a, f) {
						var c = f.getCustomData("cke-fillingChar");
						if (c) {
							var e = a.container;
							c.equals(e) &&
								((a.offset -=
									CKEDITOR.dom.selection.FILLING_CHAR_SEQUENCE.length),
								0 >= a.offset &&
									((a.offset = e.getIndex()), (a.container = e.getParent())));
						}
					}
					var c = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_TEXT, !0);
					return function (c) {
						var e = this.collapsed,
							g = { container: this.startContainer, offset: this.startOffset },
							h = { container: this.endContainer, offset: this.endOffset };
						c && (a(g), b(g, this.root), e || (a(h), b(h, this.root)));
						return {
							start: g.container.getAddress(c),
							end: e ? null : h.container.getAddress(c),
							startOffset: g.offset,
							endOffset: h.offset,
							normalized: c,
							collapsed: e,
							is2: !0,
						};
					};
				})(),
				moveToBookmark: function (a) {
					if (a.is2) {
						var b = this.document.getByAddress(a.start, a.normalized),
							c = a.startOffset,
							e = a.end && this.document.getByAddress(a.end, a.normalized);
						a = a.endOffset;
						this.setStart(b, c);
						e ? this.setEnd(e, a) : this.collapse(!0);
					} else
						(b = (c = a.serializable)
							? this.document.getById(a.startNode)
							: a.startNode),
							(a = c ? this.document.getById(a.endNode) : a.endNode),
							this.setStartBefore(b),
							b.remove(),
							a ? (this.setEndBefore(a), a.remove()) : this.collapse(!0);
				},
				getBoundaryNodes: function () {
					var a = this.startContainer,
						b = this.endContainer,
						c = this.startOffset,
						e = this.endOffset,
						g;
					if (a.type == CKEDITOR.NODE_ELEMENT)
						if (((g = a.getChildCount()), g > c)) a = a.getChild(c);
						else if (1 > g) a = a.getPreviousSourceNode();
						else {
							for (a = a.$; a.lastChild; ) a = a.lastChild;
							a = new CKEDITOR.dom.node(a);
							a = a.getNextSourceNode() || a;
						}
					if (b.type == CKEDITOR.NODE_ELEMENT)
						if (((g = b.getChildCount()), g > e))
							b = b.getChild(e).getPreviousSourceNode(!0);
						else if (1 > g) b = b.getPreviousSourceNode();
						else {
							for (b = b.$; b.lastChild; ) b = b.lastChild;
							b = new CKEDITOR.dom.node(b);
						}
					a.getPosition(b) & CKEDITOR.POSITION_FOLLOWING && (a = b);
					return { startNode: a, endNode: b };
				},
				getCommonAncestor: function (a, b) {
					var c = this.startContainer,
						e = this.endContainer,
						c = c.equals(e)
							? a &&
							  c.type == CKEDITOR.NODE_ELEMENT &&
							  this.startOffset == this.endOffset - 1
								? c.getChild(this.startOffset)
								: c
							: c.getCommonAncestor(e);
					return b && !c.is ? c.getParent() : c;
				},
				optimize: function () {
					var a = this.startContainer,
						b = this.startOffset;
					a.type != CKEDITOR.NODE_ELEMENT &&
						(b
							? b >= a.getLength() && this.setStartAfter(a)
							: this.setStartBefore(a));
					a = this.endContainer;
					b = this.endOffset;
					a.type != CKEDITOR.NODE_ELEMENT &&
						(b
							? b >= a.getLength() && this.setEndAfter(a)
							: this.setEndBefore(a));
				},
				optimizeBookmark: function () {
					var a = this.startContainer,
						b = this.endContainer;
					a.is &&
						a.is("span") &&
						a.data("cke-bookmark") &&
						this.setStartAt(a, CKEDITOR.POSITION_BEFORE_START);
					b &&
						b.is &&
						b.is("span") &&
						b.data("cke-bookmark") &&
						this.setEndAt(b, CKEDITOR.POSITION_AFTER_END);
				},
				trim: function (a, b) {
					var c = this.startContainer,
						e = this.startOffset,
						g = this.collapsed;
					if ((!a || g) && c && c.type == CKEDITOR.NODE_TEXT) {
						if (e)
							if (e >= c.getLength())
								(e = c.getIndex() + 1), (c = c.getParent());
							else {
								var h = c.split(e),
									e = c.getIndex() + 1,
									c = c.getParent();
								this.startContainer.equals(this.endContainer)
									? this.setEnd(h, this.endOffset - this.startOffset)
									: c.equals(this.endContainer) && (this.endOffset += 1);
							}
						else (e = c.getIndex()), (c = c.getParent());
						this.setStart(c, e);
						if (g) {
							this.collapse(!0);
							return;
						}
					}
					c = this.endContainer;
					e = this.endOffset;
					b ||
						g ||
						!c ||
						c.type != CKEDITOR.NODE_TEXT ||
						(e
							? (e >= c.getLength() || c.split(e), (e = c.getIndex() + 1))
							: (e = c.getIndex()),
						(c = c.getParent()),
						this.setEnd(c, e));
				},
				enlarge: function (a, b) {
					function c(a) {
						return a &&
							a.type == CKEDITOR.NODE_ELEMENT &&
							a.hasAttribute("contenteditable")
							? null
							: a;
					}
					var e = new RegExp(/[^\s\ufeff]/);
					switch (a) {
						case CKEDITOR.ENLARGE_INLINE:
							var g = 1;
						case CKEDITOR.ENLARGE_ELEMENT:
							var h = function (a, b) {
								var f = new CKEDITOR.dom.range(m);
								f.setStart(a, b);
								f.setEndAt(m, CKEDITOR.POSITION_BEFORE_END);
								var f = new CKEDITOR.dom.walker(f),
									c;
								for (
									f.guard = function (a) {
										return !(
											a.type == CKEDITOR.NODE_ELEMENT && a.isBlockBoundary()
										);
									};
									(c = f.next());

								) {
									if (c.type != CKEDITOR.NODE_TEXT) return !1;
									H = c != a ? c.getText() : c.substring(b);
									if (e.test(H)) return !1;
								}
								return !0;
							};
							if (this.collapsed) break;
							var d = this.getCommonAncestor(),
								m = this.root,
								l,
								k,
								t,
								y,
								C,
								B = !1,
								A,
								H;
							A = this.startContainer;
							var G = this.startOffset;
							A.type == CKEDITOR.NODE_TEXT
								? (G &&
										((A = !CKEDITOR.tools.trim(A.substring(0, G)).length && A),
										(B = !!A)),
								  A && ((y = A.getPrevious()) || (t = A.getParent())))
								: (G && (y = A.getChild(G - 1) || A.getLast()), y || (t = A));
							for (t = c(t); t || y; ) {
								if (t && !y) {
									!C && t.equals(d) && (C = !0);
									if (g ? t.isBlockBoundary() : !m.contains(t)) break;
									(B && "inline" == t.getComputedStyle("display")) ||
										((B = !1), C ? (l = t) : this.setStartBefore(t));
									y = t.getPrevious();
								}
								for (; y; )
									if (((A = !1), y.type == CKEDITOR.NODE_COMMENT))
										y = y.getPrevious();
									else {
										if (y.type == CKEDITOR.NODE_TEXT)
											(H = y.getText()),
												e.test(H) && (y = null),
												(A = /[\s\ufeff]$/.test(H));
										else if (
											(y.$.offsetWidth > (CKEDITOR.env.webkit ? 1 : 0) ||
												(b && y.is("br"))) &&
											!y.data("cke-bookmark")
										)
											if (B && CKEDITOR.dtd.$removeEmpty[y.getName()]) {
												H = y.getText();
												if (e.test(H)) y = null;
												else
													for (
														var G = y.$.getElementsByTagName("*"), J = 0, E;
														(E = G[J++]);

													)
														if (
															!CKEDITOR.dtd.$removeEmpty[
																E.nodeName.toLowerCase()
															]
														) {
															y = null;
															break;
														}
												y && (A = !!H.length);
											} else y = null;
										A &&
											(B
												? C
													? (l = t)
													: t && this.setStartBefore(t)
												: (B = !0));
										if (y) {
											A = y.getPrevious();
											if (!t && !A) {
												t = y;
												y = null;
												break;
											}
											y = A;
										} else t = null;
									}
								t && (t = c(t.getParent()));
							}
							A = this.endContainer;
							G = this.endOffset;
							t = y = null;
							C = B = !1;
							A.type == CKEDITOR.NODE_TEXT
								? CKEDITOR.tools.trim(A.substring(G)).length
									? (B = !0)
									: ((B = !A.getLength()),
									  G == A.getLength()
											? (y = A.getNext()) || (t = A.getParent())
											: h(A, G) && (t = A.getParent()))
								: (y = A.getChild(G)) || (t = A);
							for (; t || y; ) {
								if (t && !y) {
									!C && t.equals(d) && (C = !0);
									if (g ? t.isBlockBoundary() : !m.contains(t)) break;
									(B && "inline" == t.getComputedStyle("display")) ||
										((B = !1), C ? (k = t) : t && this.setEndAfter(t));
									y = t.getNext();
								}
								for (; y; ) {
									A = !1;
									if (y.type == CKEDITOR.NODE_TEXT)
										(H = y.getText()),
											h(y, 0) || (y = null),
											(A = /^[\s\ufeff]/.test(H));
									else if (y.type == CKEDITOR.NODE_ELEMENT) {
										if (
											(0 < y.$.offsetWidth || (b && y.is("br"))) &&
											!y.data("cke-bookmark")
										)
											if (B && CKEDITOR.dtd.$removeEmpty[y.getName()]) {
												H = y.getText();
												if (e.test(H)) y = null;
												else
													for (
														G = y.$.getElementsByTagName("*"), J = 0;
														(E = G[J++]);

													)
														if (
															!CKEDITOR.dtd.$removeEmpty[
																E.nodeName.toLowerCase()
															]
														) {
															y = null;
															break;
														}
												y && (A = !!H.length);
											} else y = null;
									} else A = 1;
									A && B && (C ? (k = t) : this.setEndAfter(t));
									if (y) {
										A = y.getNext();
										if (!t && !A) {
											t = y;
											y = null;
											break;
										}
										y = A;
									} else t = null;
								}
								t && (t = c(t.getParent()));
							}
							l &&
								k &&
								((d = l.contains(k) ? k : l),
								this.setStartBefore(d),
								this.setEndAfter(d));
							break;
						case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
						case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
							t = new CKEDITOR.dom.range(this.root);
							m = this.root;
							t.setStartAt(m, CKEDITOR.POSITION_AFTER_START);
							t.setEnd(this.startContainer, this.startOffset);
							t = new CKEDITOR.dom.walker(t);
							var F,
								L,
								I = CKEDITOR.dom.walker.blockBoundary(
									a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? { br: 1 } : null
								),
								D = null,
								Q = function (a) {
									if (
										a.type == CKEDITOR.NODE_ELEMENT &&
										"false" == a.getAttribute("contenteditable")
									)
										if (D) {
											if (D.equals(a)) {
												D = null;
												return;
											}
										} else D = a;
									else if (D) return;
									var b = I(a);
									b || (F = a);
									return b;
								},
								g = function (a) {
									var b = Q(a);
									!b && a.is && a.is("br") && (L = a);
									return b;
								};
							t.guard = Q;
							t = t.lastBackward();
							F = F || m;
							this.setStartAt(
								F,
								!F.is("br") &&
									((!t && this.checkStartOfBlock()) || (t && F.contains(t)))
									? CKEDITOR.POSITION_AFTER_START
									: CKEDITOR.POSITION_AFTER_END
							);
							if (a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
								t = this.clone();
								t = new CKEDITOR.dom.walker(t);
								var T = CKEDITOR.dom.walker.whitespaces(),
									R = CKEDITOR.dom.walker.bookmark();
								t.evaluator = function (a) {
									return !T(a) && !R(a);
								};
								if (
									(t = t.previous()) &&
									t.type == CKEDITOR.NODE_ELEMENT &&
									t.is("br")
								)
									break;
							}
							t = this.clone();
							t.collapse();
							t.setEndAt(m, CKEDITOR.POSITION_BEFORE_END);
							t = new CKEDITOR.dom.walker(t);
							t.guard = a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? g : Q;
							F = D = L = null;
							t = t.lastForward();
							F = F || m;
							this.setEndAt(
								F,
								(!t && this.checkEndOfBlock()) || (t && F.contains(t))
									? CKEDITOR.POSITION_BEFORE_END
									: CKEDITOR.POSITION_BEFORE_START
							);
							L && this.setEndAfter(L);
					}
				},
				shrink: function (a, b, c) {
					var e =
							"boolean" === typeof c
								? c
								: c && "boolean" === typeof c.shrinkOnBlockBoundary
								? c.shrinkOnBlockBoundary
								: !0,
						g = c && c.skipBogus;
					if (!this.collapsed) {
						a = a || CKEDITOR.SHRINK_TEXT;
						var h = this.clone(),
							d = this.startContainer,
							m = this.endContainer,
							l = this.startOffset,
							k = this.endOffset,
							t = (c = 1);
						d &&
							d.type == CKEDITOR.NODE_TEXT &&
							(l
								? l >= d.getLength()
									? h.setStartAfter(d)
									: (h.setStartBefore(d), (c = 0))
								: h.setStartBefore(d));
						m &&
							m.type == CKEDITOR.NODE_TEXT &&
							(k
								? k >= m.getLength()
									? h.setEndAfter(m)
									: (h.setEndAfter(m), (t = 0))
								: h.setEndBefore(m));
						var h = new CKEDITOR.dom.walker(h),
							y = CKEDITOR.dom.walker.bookmark(),
							C = CKEDITOR.dom.walker.bogus();
						h.evaluator = function (b) {
							return (
								b.type ==
								(a == CKEDITOR.SHRINK_ELEMENT
									? CKEDITOR.NODE_ELEMENT
									: CKEDITOR.NODE_TEXT)
							);
						};
						var B;
						h.guard = function (b, c) {
							if ((g && C(b)) || y(b)) return !0;
							if (
								(a == CKEDITOR.SHRINK_ELEMENT &&
									b.type == CKEDITOR.NODE_TEXT) ||
								(c && b.equals(B)) ||
								(!1 === e &&
									b.type == CKEDITOR.NODE_ELEMENT &&
									b.isBlockBoundary()) ||
								(b.type == CKEDITOR.NODE_ELEMENT &&
									b.hasAttribute("contenteditable"))
							)
								return !1;
							c || b.type != CKEDITOR.NODE_ELEMENT || (B = b);
							return !0;
						};
						c &&
							(d = h[
								a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"
							]()) &&
							this.setStartAt(
								d,
								b
									? CKEDITOR.POSITION_AFTER_START
									: CKEDITOR.POSITION_BEFORE_START
							);
						t &&
							(h.reset(),
							(h = h[
								a == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"
							]()) &&
								this.setEndAt(
									h,
									b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END
								));
						return !(!c && !t);
					}
				},
				insertNode: function (a) {
					this.optimizeBookmark();
					this.trim(!1, !0);
					var b = this.startContainer,
						c = b.getChild(this.startOffset);
					c ? a.insertBefore(c) : b.append(a);
					a.getParent() &&
						a.getParent().equals(this.endContainer) &&
						this.endOffset++;
					this.setStartBefore(a);
				},
				moveToPosition: function (a, b) {
					this.setStartAt(a, b);
					this.collapse(!0);
				},
				moveToRange: function (a) {
					this.setStart(a.startContainer, a.startOffset);
					this.setEnd(a.endContainer, a.endOffset);
				},
				selectNodeContents: function (a) {
					this.setStart(a, 0);
					this.setEnd(
						a,
						a.type == CKEDITOR.NODE_TEXT ? a.getLength() : a.getChildCount()
					);
				},
				setStart: function (b, c) {
					b.type == CKEDITOR.NODE_ELEMENT &&
						CKEDITOR.dtd.$empty[b.getName()] &&
						((c = b.getIndex()), (b = b.getParent()));
					this._setStartContainer(b);
					this.startOffset = c;
					this.endContainer || (this._setEndContainer(b), (this.endOffset = c));
					a(this);
				},
				setEnd: function (b, c) {
					b.type == CKEDITOR.NODE_ELEMENT &&
						CKEDITOR.dtd.$empty[b.getName()] &&
						((c = b.getIndex() + 1), (b = b.getParent()));
					this._setEndContainer(b);
					this.endOffset = c;
					this.startContainer ||
						(this._setStartContainer(b), (this.startOffset = c));
					a(this);
				},
				setStartAfter: function (a) {
					this.setStart(a.getParent(), a.getIndex() + 1);
				},
				setStartBefore: function (a) {
					this.setStart(a.getParent(), a.getIndex());
				},
				setEndAfter: function (a) {
					this.setEnd(a.getParent(), a.getIndex() + 1);
				},
				setEndBefore: function (a) {
					this.setEnd(a.getParent(), a.getIndex());
				},
				setStartAt: function (b, c) {
					switch (c) {
						case CKEDITOR.POSITION_AFTER_START:
							this.setStart(b, 0);
							break;
						case CKEDITOR.POSITION_BEFORE_END:
							b.type == CKEDITOR.NODE_TEXT
								? this.setStart(b, b.getLength())
								: this.setStart(b, b.getChildCount());
							break;
						case CKEDITOR.POSITION_BEFORE_START:
							this.setStartBefore(b);
							break;
						case CKEDITOR.POSITION_AFTER_END:
							this.setStartAfter(b);
					}
					a(this);
				},
				setEndAt: function (b, c) {
					switch (c) {
						case CKEDITOR.POSITION_AFTER_START:
							this.setEnd(b, 0);
							break;
						case CKEDITOR.POSITION_BEFORE_END:
							b.type == CKEDITOR.NODE_TEXT
								? this.setEnd(b, b.getLength())
								: this.setEnd(b, b.getChildCount());
							break;
						case CKEDITOR.POSITION_BEFORE_START:
							this.setEndBefore(b);
							break;
						case CKEDITOR.POSITION_AFTER_END:
							this.setEndAfter(b);
					}
					a(this);
				},
				fixBlock: function (a, b) {
					var c = this.createBookmark(),
						e = this.document.createElement(b);
					this.collapse(a);
					this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
					this.extractContents().appendTo(e);
					e.trim();
					this.insertNode(e);
					var g = e.getBogus();
					g && g.remove();
					e.appendBogus();
					this.moveToBookmark(c);
					return e;
				},
				splitBlock: function (a, b) {
					var c = new CKEDITOR.dom.elementPath(this.startContainer, this.root),
						e = new CKEDITOR.dom.elementPath(this.endContainer, this.root),
						g = c.block,
						h = e.block,
						d = null;
					if (!c.blockLimit.equals(e.blockLimit)) return null;
					"br" != a &&
						(g ||
							((g = this.fixBlock(!0, a)),
							(h = new CKEDITOR.dom.elementPath(this.endContainer, this.root)
								.block)),
						h || (h = this.fixBlock(!1, a)));
					c = g && this.checkStartOfBlock();
					e = h && this.checkEndOfBlock();
					this.deleteContents();
					g &&
						g.equals(h) &&
						(e
							? ((d = new CKEDITOR.dom.elementPath(
									this.startContainer,
									this.root
							  )),
							  this.moveToPosition(h, CKEDITOR.POSITION_AFTER_END),
							  (h = null))
							: c
							? ((d = new CKEDITOR.dom.elementPath(
									this.startContainer,
									this.root
							  )),
							  this.moveToPosition(g, CKEDITOR.POSITION_BEFORE_START),
							  (g = null))
							: ((h = this.splitElement(g, b || !1)),
							  g.is("ul", "ol") || g.appendBogus()));
					return {
						previousBlock: g,
						nextBlock: h,
						wasStartOfBlock: c,
						wasEndOfBlock: e,
						elementPath: d,
					};
				},
				splitElement: function (a, b) {
					if (!this.collapsed) return null;
					this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
					var c = this.extractContents(!1, b || !1),
						e = a.clone(!1, b || !1);
					c.appendTo(e);
					e.insertAfter(a);
					this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
					return e;
				},
				removeEmptyBlocksAtEnd: (function () {
					function a(f) {
						return function (a) {
							return b(a) ||
								c(a) ||
								(a.type == CKEDITOR.NODE_ELEMENT &&
									a.isEmptyInlineRemoveable()) ||
								(f.is("table") && a.is("caption"))
								? !1
								: !0;
						};
					}
					var b = CKEDITOR.dom.walker.whitespaces(),
						c = CKEDITOR.dom.walker.bookmark(!1);
					return function (b) {
						for (
							var c = this.createBookmark(),
								e = this[b ? "endPath" : "startPath"](),
								g = e.block || e.blockLimit,
								h;
							g && !g.equals(e.root) && !g.getFirst(a(g));

						)
							(h = g.getParent()),
								this[b ? "setEndAt" : "setStartAt"](
									g,
									CKEDITOR.POSITION_AFTER_END
								),
								g.remove(1),
								(g = h);
						this.moveToBookmark(c);
					};
				})(),
				startPath: function () {
					return new CKEDITOR.dom.elementPath(this.startContainer, this.root);
				},
				endPath: function () {
					return new CKEDITOR.dom.elementPath(this.endContainer, this.root);
				},
				checkBoundaryOfElement: function (a, b) {
					var e = b == CKEDITOR.START,
						g = this.clone();
					g.collapse(e);
					g[e ? "setStartAt" : "setEndAt"](
						a,
						e ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END
					);
					g = new CKEDITOR.dom.walker(g);
					g.evaluator = c(e);
					return g[e ? "checkBackward" : "checkForward"]();
				},
				checkStartOfBlock: function () {
					var a = this.startContainer,
						c = this.startOffset;
					CKEDITOR.env.ie &&
						c &&
						a.type == CKEDITOR.NODE_TEXT &&
						((a = CKEDITOR.tools.ltrim(a.substring(0, c))),
						h.test(a) && this.trim(0, 1));
					this.trim();
					a = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
					c = this.clone();
					c.collapse(!0);
					c.setStartAt(a.block || a.blockLimit, CKEDITOR.POSITION_AFTER_START);
					a = new CKEDITOR.dom.walker(c);
					a.evaluator = b();
					return a.checkBackward();
				},
				checkEndOfBlock: function () {
					var a = this.endContainer,
						c = this.endOffset;
					CKEDITOR.env.ie &&
						a.type == CKEDITOR.NODE_TEXT &&
						((a = CKEDITOR.tools.rtrim(a.substring(c))),
						h.test(a) && this.trim(1, 0));
					this.trim();
					a = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
					c = this.clone();
					c.collapse(!1);
					c.setEndAt(a.block || a.blockLimit, CKEDITOR.POSITION_BEFORE_END);
					a = new CKEDITOR.dom.walker(c);
					a.evaluator = b();
					return a.checkForward();
				},
				getPreviousNode: function (a, b, c) {
					var e = this.clone();
					e.collapse(1);
					e.setStartAt(c || this.root, CKEDITOR.POSITION_AFTER_START);
					c = new CKEDITOR.dom.walker(e);
					c.evaluator = a;
					c.guard = b;
					return c.previous();
				},
				getNextNode: function (a, b, c) {
					var e = this.clone();
					e.collapse();
					e.setEndAt(c || this.root, CKEDITOR.POSITION_BEFORE_END);
					c = new CKEDITOR.dom.walker(e);
					c.evaluator = a;
					c.guard = b;
					return c.next();
				},
				checkReadOnly: (function () {
					function a(b, c) {
						for (; b; ) {
							if (b.type == CKEDITOR.NODE_ELEMENT) {
								if (
									"false" == b.getAttribute("contentEditable") &&
									!b.data("cke-editable")
								)
									return 0;
								if (
									b.is("html") ||
									("true" == b.getAttribute("contentEditable") &&
										(b.contains(c) || b.equals(c)))
								)
									break;
							}
							b = b.getParent();
						}
						return 1;
					}
					return function () {
						var b = this.startContainer,
							c = this.endContainer;
						return !(a(b, c) && a(c, b));
					};
				})(),
				moveToElementEditablePosition: function (a, b) {
					if (a.type == CKEDITOR.NODE_ELEMENT && !a.isEditable(!1))
						return (
							this.moveToPosition(
								a,
								b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START
							),
							!0
						);
					for (var c = 0; a; ) {
						if (a.type == CKEDITOR.NODE_TEXT) {
							b &&
							this.endContainer &&
							this.checkEndOfBlock() &&
							h.test(a.getText())
								? this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START)
								: this.moveToPosition(
										a,
										b
											? CKEDITOR.POSITION_AFTER_END
											: CKEDITOR.POSITION_BEFORE_START
								  );
							c = 1;
							break;
						}
						if (a.type == CKEDITOR.NODE_ELEMENT)
							if (a.isEditable())
								this.moveToPosition(
									a,
									b
										? CKEDITOR.POSITION_BEFORE_END
										: CKEDITOR.POSITION_AFTER_START
								),
									(c = 1);
							else if (
								b &&
								a.is("br") &&
								this.endContainer &&
								this.checkEndOfBlock()
							)
								this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START);
							else if (
								"false" == a.getAttribute("contenteditable") &&
								a.is(CKEDITOR.dtd.$block)
							)
								return this.setStartBefore(a), this.setEndAfter(a), !0;
						var e = a,
							g = c,
							d = void 0;
						e.type == CKEDITOR.NODE_ELEMENT &&
							e.isEditable(!1) &&
							(d = e[b ? "getLast" : "getFirst"](m));
						g || d || (d = e[b ? "getPrevious" : "getNext"](m));
						a = d;
					}
					return !!c;
				},
				moveToClosestEditablePosition: function (a, b) {
					var c,
						e = 0,
						g,
						h,
						d = [CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START];
					a
						? ((c = new CKEDITOR.dom.range(this.root)),
						  c.moveToPosition(a, d[b ? 0 : 1]))
						: (c = this.clone());
					if (a && !a.is(CKEDITOR.dtd.$block)) e = 1;
					else if (
						(g = c[b ? "getNextEditableNode" : "getPreviousEditableNode"]())
					)
						(e = 1),
							(h = g.type == CKEDITOR.NODE_ELEMENT) &&
							g.is(CKEDITOR.dtd.$block) &&
							"false" == g.getAttribute("contenteditable")
								? (c.setStartAt(g, CKEDITOR.POSITION_BEFORE_START),
								  c.setEndAt(g, CKEDITOR.POSITION_AFTER_END))
								: !CKEDITOR.env.needsBrFiller &&
								  h &&
								  g.is(CKEDITOR.dom.walker.validEmptyBlockContainers)
								? (c.setEnd(g, 0), c.collapse())
								: c.moveToPosition(g, d[b ? 1 : 0]);
					e && this.moveToRange(c);
					return !!e;
				},
				moveToElementEditStart: function (a) {
					return this.moveToElementEditablePosition(a);
				},
				moveToElementEditEnd: function (a) {
					return this.moveToElementEditablePosition(a, !0);
				},
				getEnclosedNode: function () {
					var a = this.clone();
					a.optimize();
					if (
						a.startContainer.type != CKEDITOR.NODE_ELEMENT ||
						a.endContainer.type != CKEDITOR.NODE_ELEMENT
					)
						return null;
					var a = new CKEDITOR.dom.walker(a),
						b = CKEDITOR.dom.walker.bookmark(!1, !0),
						c = CKEDITOR.dom.walker.whitespaces(!0);
					a.evaluator = function (a) {
						return c(a) && b(a);
					};
					var e = a.next();
					a.reset();
					return e && e.equals(a.previous()) ? e : null;
				},
				getTouchedStartNode: function () {
					var a = this.startContainer;
					return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT
						? a
						: a.getChild(this.startOffset) || a;
				},
				getTouchedEndNode: function () {
					var a = this.endContainer;
					return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT
						? a
						: a.getChild(this.endOffset - 1) || a;
				},
				getNextEditableNode: g(),
				getPreviousEditableNode: g(1),
				_getTableElement: function (a) {
					a = a || {
						td: 1,
						th: 1,
						tr: 1,
						tbody: 1,
						thead: 1,
						tfoot: 1,
						table: 1,
					};
					var b = this.startContainer,
						c = this.endContainer,
						e = b.getAscendant("table", !0),
						g = c.getAscendant("table", !0);
					return e && !this.root.contains(e)
						? null
						: CKEDITOR.env.safari && e && c.equals(this.root)
						? b.getAscendant(a, !0)
						: this.getEnclosedNode()
						? this.getEnclosedNode().getAscendant(a, !0)
						: e && g && (e.equals(g) || e.contains(g) || g.contains(e))
						? b.getAscendant(a, !0)
						: null;
				},
				scrollIntoView: function () {
					var a = new CKEDITOR.dom.element.createFromHtml(
							"\x3cspan\x3e\x26nbsp;\x3c/span\x3e",
							this.document
						),
						b,
						c,
						e,
						g = this.clone();
					g.optimize();
					(e = g.startContainer.type == CKEDITOR.NODE_TEXT)
						? ((c = g.startContainer.getText()),
						  (b = g.startContainer.split(g.startOffset)),
						  a.insertAfter(g.startContainer))
						: g.insertNode(a);
					a.scrollIntoView();
					e && (g.startContainer.setText(c), b.remove());
					a.remove();
				},
				getClientRects: (function () {
					function a(b, c) {
						var f = CKEDITOR.tools.array.map(b, function (a) {
								return a;
							}),
							e = new CKEDITOR.dom.range(c.root),
							g,
							h,
							d;
						c.startContainer instanceof CKEDITOR.dom.element &&
							(h =
								0 === c.startOffset &&
								c.startContainer.hasAttribute("data-widget"));
						c.endContainer instanceof CKEDITOR.dom.element &&
							(d =
								(d =
									c.endOffset ===
									(c.endContainer.getChildCount
										? c.endContainer.getChildCount()
										: c.endContainer.length)) &&
								c.endContainer.hasAttribute("data-widget"));
						h &&
							e.setStart(
								c.startContainer.getParent(),
								c.startContainer.getIndex()
							);
						d &&
							e.setEnd(
								c.endContainer.getParent(),
								c.endContainer.getIndex() + 1
							);
						if (h || d) c = e;
						e = c.cloneContents();
						e = CKEDITOR.dom.document.prototype.find
							.call(e, "[data-cke-widget-id]")
							.toArray();
						if (
							(e = CKEDITOR.tools.array.map(e, function (a) {
								var b = c.root.editor;
								a = a.getAttribute("data-cke-widget-id");
								return b.widgets.instances[a].element;
							}))
						)
							return (
								(e = CKEDITOR.tools.array.map(
									e,
									function (a) {
										var b;
										b = a.getParent().hasClass("cke_widget_wrapper")
											? a.getParent()
											: a;
										g = this.root.getDocument().$.createRange();
										g.setStart(b.getParent().$, b.getIndex());
										g.setEnd(b.getParent().$, b.getIndex() + 1);
										b = g.getClientRects();
										b.widgetRect = a.getClientRect();
										return b;
									},
									c
								)),
								CKEDITOR.tools.array.forEach(e, function (a) {
									function b(e) {
										CKEDITOR.tools.array.forEach(f, function (b, g) {
											var h = CKEDITOR.tools.objectCompare(a[e], b);
											h || (h = CKEDITOR.tools.objectCompare(a.widgetRect, b));
											h &&
												(Array.prototype.splice.call(
													f,
													g,
													a.length - e,
													a.widgetRect
												),
												(c = !0));
										});
										c || (e < f.length - 1 ? b(e + 1) : f.push(a.widgetRect));
									}
									var c;
									b(0);
								}),
								f
							);
					}
					function b(a, c, f) {
						var g;
						c.collapsed
							? f.startContainer instanceof CKEDITOR.dom.element
								? ((a = f.checkStartOfBlock()),
								  (g = new CKEDITOR.dom.text("​")),
								  a
										? f.startContainer.append(g, !0)
										: 0 === f.startOffset
										? g.insertBefore(f.startContainer.getFirst())
										: ((f = f.startContainer
												.getChildren()
												.getItem(f.startOffset - 1)),
										  g.insertAfter(f)),
								  c.setStart(g.$, 0),
								  c.setEnd(g.$, 0),
								  (a = c.getClientRects()),
								  g.remove())
								: f.startContainer instanceof CKEDITOR.dom.text &&
								  ("" === f.startContainer.getText()
										? (f.startContainer.setText("​"),
										  (a = c.getClientRects()),
										  f.startContainer.setText(""))
										: (a = [e(f.createBookmark())]))
							: (a = [e(f.createBookmark())]);
						return a;
					}
					function c(a, b, f) {
						a = CKEDITOR.tools.extend({}, a);
						b &&
							(a = CKEDITOR.tools.getAbsoluteRectPosition(
								f.document.getWindow(),
								a
							));
						!a.width && (a.width = a.right - a.left);
						!a.height && (a.height = a.bottom - a.top);
						return a;
					}
					function e(a) {
						var b = a.startNode;
						a = a.endNode;
						var c;
						b.setText("​");
						b.removeStyle("display");
						a
							? (a.setText("​"),
							  a.removeStyle("display"),
							  (c = [b.getClientRect(), a.getClientRect()]),
							  a.remove())
							: (c = [b.getClientRect(), b.getClientRect()]);
						b.remove();
						return {
							right: Math.max(c[0].right, c[1].right),
							bottom: Math.max(c[0].bottom, c[1].bottom),
							left: Math.min(c[0].left, c[1].left),
							top: Math.min(c[0].top, c[1].top),
							width: Math.abs(c[0].left - c[1].left),
							height:
								Math.max(c[0].bottom, c[1].bottom) -
								Math.min(c[0].top, c[1].top),
						};
					}
					return void 0 !== this.document.getSelection
						? function (e) {
								var g = this.root.getDocument().$.createRange(),
									h;
								g.setStart(this.startContainer.$, this.startOffset);
								g.setEnd(this.endContainer.$, this.endOffset);
								h = g.getClientRects();
								h = a(h, this);
								h.length || (h = b(h, g, this));
								return CKEDITOR.tools.array.map(
									h,
									function (a) {
										return c(a, e, this);
									},
									this
								);
						  }
						: function (a) {
								return [c(e(this.createBookmark()), a, this)];
						  };
				})(),
				_setStartContainer: function (a) {
					this.startContainer = a;
				},
				_setEndContainer: function (a) {
					this.endContainer = a;
				},
				_find: function (a, b) {
					var c = this.getCommonAncestor(),
						e = this.getBoundaryNodes(),
						g = [],
						h,
						d,
						m,
						l;
					if (c && c.find)
						for (d = c.find(a), h = 0; h < d.count(); h++)
							if (((c = d.getItem(h)), b || !c.isReadOnly()))
								(m =
									c.getPosition(e.startNode) & CKEDITOR.POSITION_FOLLOWING ||
									e.startNode.equals(c)),
									(l =
										c.getPosition(e.endNode) &
											(CKEDITOR.POSITION_PRECEDING +
												CKEDITOR.POSITION_IS_CONTAINED) || e.endNode.equals(c)),
									m && l && g.push(c);
					return g;
				},
			};
			CKEDITOR.dom.range.mergeRanges = function (a) {
				return CKEDITOR.tools.array.reduce(
					a,
					function (a, b) {
						var c = a[a.length - 1],
							f = !1;
						b = b.clone();
						b.enlarge(CKEDITOR.ENLARGE_ELEMENT);
						if (c) {
							var e = new CKEDITOR.dom.range(b.root),
								f = new CKEDITOR.dom.walker(e),
								g = CKEDITOR.dom.walker.whitespaces();
							e.setStart(c.endContainer, c.endOffset);
							e.setEnd(b.startContainer, b.startOffset);
							for (e = f.next(); g(e) || b.endContainer.equals(e); )
								e = f.next();
							f = !e;
						}
						f ? c.setEnd(b.endContainer, b.endOffset) : a.push(b);
						return a;
					},
					[]
				);
			};
		})(),
		(CKEDITOR.POSITION_AFTER_START = 1),
		(CKEDITOR.POSITION_BEFORE_END = 2),
		(CKEDITOR.POSITION_BEFORE_START = 3),
		(CKEDITOR.POSITION_AFTER_END = 4),
		(CKEDITOR.ENLARGE_ELEMENT = 1),
		(CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2),
		(CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3),
		(CKEDITOR.ENLARGE_INLINE = 4),
		(CKEDITOR.START = 1),
		(CKEDITOR.END = 2),
		(CKEDITOR.SHRINK_ELEMENT = 1),
		(CKEDITOR.SHRINK_TEXT = 2),
		"use strict",
		(function () {
			function a(a) {
				1 > arguments.length ||
					((this.range = a),
					(this.forceBrBreak = 0),
					(this.enlargeBr = 1),
					(this.enforceRealBlocks = 0),
					this._ || (this._ = {}));
			}
			function d(a) {
				var b = [];
				a.forEach(
					function (a) {
						if ("true" == a.getAttribute("contenteditable"))
							return b.push(a), !1;
					},
					CKEDITOR.NODE_ELEMENT,
					!0
				);
				return b;
			}
			function b(a, c, e, g) {
				a: {
					null == g && (g = d(e));
					for (var h; (h = g.shift()); )
						if (h.getDtd().p) {
							g = { element: h, remaining: g };
							break a;
						}
					g = null;
				}
				if (!g) return 0;
				if (
					(h = CKEDITOR.filter.instances[g.element.data("cke-filter")]) &&
					!h.check(c)
				)
					return b(a, c, e, g.remaining);
				c = new CKEDITOR.dom.range(g.element);
				c.selectNodeContents(g.element);
				c = c.createIterator();
				c.enlargeBr = a.enlargeBr;
				c.enforceRealBlocks = a.enforceRealBlocks;
				c.activeFilter = c.filter = h;
				a._.nestedEditable = {
					element: g.element,
					container: e,
					remaining: g.remaining,
					iterator: c,
				};
				return 1;
			}
			function c(a, b, c) {
				if (!b) return !1;
				a = a.clone();
				a.collapse(!c);
				return a.checkBoundaryOfElement(b, c ? CKEDITOR.START : CKEDITOR.END);
			}
			var g = /^[\r\n\t ]+$/,
				l = CKEDITOR.dom.walker.bookmark(!1, !0),
				k = CKEDITOR.dom.walker.whitespaces(!0),
				h = function (a) {
					return l(a) && k(a);
				},
				e = { dd: 1, dt: 1, li: 1 };
			a.prototype = {
				getNextParagraph: function (a) {
					var f, d, k, x, v;
					a = a || "p";
					if (this._.nestedEditable) {
						if ((f = this._.nestedEditable.iterator.getNextParagraph(a)))
							return (
								(this.activeFilter = this._.nestedEditable.iterator.activeFilter),
								f
							);
						this.activeFilter = this.filter;
						if (
							b(
								this,
								a,
								this._.nestedEditable.container,
								this._.nestedEditable.remaining
							)
						)
							return (
								(this.activeFilter = this._.nestedEditable.iterator.activeFilter),
								this._.nestedEditable.iterator.getNextParagraph(a)
							);
						this._.nestedEditable = null;
					}
					if (!this.range.root.getDtd()[a]) return null;
					if (!this._.started) {
						var p = this.range.clone();
						d = p.startPath();
						var u = p.endPath(),
							w = !p.collapsed && c(p, d.block),
							q = !p.collapsed && c(p, u.block, 1);
						p.shrink(CKEDITOR.SHRINK_ELEMENT, !0);
						w && p.setStartAt(d.block, CKEDITOR.POSITION_BEFORE_END);
						q && p.setEndAt(u.block, CKEDITOR.POSITION_AFTER_START);
						d =
							p.endContainer.hasAscendant("pre", !0) ||
							p.startContainer.hasAscendant("pre", !0);
						p.enlarge(
							(this.forceBrBreak && !d) || !this.enlargeBr
								? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS
								: CKEDITOR.ENLARGE_BLOCK_CONTENTS
						);
						p.collapsed ||
							((d = new CKEDITOR.dom.walker(p.clone())),
							(u = CKEDITOR.dom.walker.bookmark(!0, !0)),
							(d.evaluator = u),
							(this._.nextNode = d.next()),
							(d = new CKEDITOR.dom.walker(p.clone())),
							(d.evaluator = u),
							(d = d.previous()),
							(this._.lastNode = d.getNextSourceNode(!0, null, p.root)),
							this._.lastNode &&
								this._.lastNode.type == CKEDITOR.NODE_TEXT &&
								!CKEDITOR.tools.trim(this._.lastNode.getText()) &&
								this._.lastNode.getParent().isBlockBoundary() &&
								((u = this.range.clone()),
								u.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END),
								u.checkEndOfBlock() &&
									((u = new CKEDITOR.dom.elementPath(u.endContainer, u.root)),
									(this._.lastNode = (
										u.block || u.blockLimit
									).getNextSourceNode(!0)))),
							(this._.lastNode && p.root.contains(this._.lastNode)) ||
								((this._.lastNode = this._.docEndMarker = p.document.createText(
									""
								)),
								this._.lastNode.insertAfter(d)),
							(p = null));
						this._.started = 1;
						d = p;
					}
					u = this._.nextNode;
					p = this._.lastNode;
					for (this._.nextNode = null; u; ) {
						var w = 0,
							q = u.hasAscendant("pre"),
							z = u.type != CKEDITOR.NODE_ELEMENT,
							t = 0;
						if (z)
							u.type == CKEDITOR.NODE_TEXT && g.test(u.getText()) && (z = 0);
						else {
							var y = u.getName();
							if (
								CKEDITOR.dtd.$block[y] &&
								"false" == u.getAttribute("contenteditable")
							) {
								f = u;
								b(this, a, f);
								break;
							} else if (
								u.isBlockBoundary(this.forceBrBreak && !q && { br: 1 })
							) {
								if ("br" == y) z = 1;
								else if (!d && !u.getChildCount() && "hr" != y) {
									f = u;
									k = u.equals(p);
									break;
								}
								d &&
									(d.setEndAt(u, CKEDITOR.POSITION_BEFORE_START),
									"br" != y && (this._.nextNode = u));
								w = 1;
							} else {
								if (u.getFirst()) {
									d ||
										((d = this.range.clone()),
										d.setStartAt(u, CKEDITOR.POSITION_BEFORE_START));
									u = u.getFirst();
									continue;
								}
								z = 1;
							}
						}
						z &&
							!d &&
							((d = this.range.clone()),
							d.setStartAt(u, CKEDITOR.POSITION_BEFORE_START));
						k = (!w || z) && u.equals(p);
						if (d && !w)
							for (; !u.getNext(h) && !k; ) {
								y = u.getParent();
								if (y.isBlockBoundary(this.forceBrBreak && !q && { br: 1 })) {
									w = 1;
									z = 0;
									k || y.equals(p);
									d.setEndAt(y, CKEDITOR.POSITION_BEFORE_END);
									break;
								}
								u = y;
								z = 1;
								k = u.equals(p);
								t = 1;
							}
						z && d.setEndAt(u, CKEDITOR.POSITION_AFTER_END);
						u = this._getNextSourceNode(u, t, p);
						if ((k = !u) || (w && d)) break;
					}
					if (!f) {
						if (!d)
							return (
								this._.docEndMarker && this._.docEndMarker.remove(),
								(this._.nextNode = null)
							);
						f = new CKEDITOR.dom.elementPath(d.startContainer, d.root);
						u = f.blockLimit;
						w = { div: 1, th: 1, td: 1 };
						f = f.block;
						!f &&
						u &&
						!this.enforceRealBlocks &&
						w[u.getName()] &&
						d.checkStartOfBlock() &&
						d.checkEndOfBlock() &&
						!u.equals(d.root)
							? (f = u)
							: !f || (this.enforceRealBlocks && f.is(e))
							? ((f = this.range.document.createElement(a)),
							  d.extractContents().appendTo(f),
							  f.trim(),
							  d.insertNode(f),
							  (x = v = !0))
							: "li" != f.getName()
							? (d.checkStartOfBlock() && d.checkEndOfBlock()) ||
							  ((f = f.clone(!1)),
							  d.extractContents().appendTo(f),
							  f.trim(),
							  (v = d.splitBlock()),
							  (x = !v.wasStartOfBlock),
							  (v = !v.wasEndOfBlock),
							  d.insertNode(f))
							: k ||
							  (this._.nextNode = f.equals(p)
									? null
									: this._getNextSourceNode(
											d.getBoundaryNodes().endNode,
											1,
											p
									  ));
					}
					x &&
						(x = f.getPrevious()) &&
						x.type == CKEDITOR.NODE_ELEMENT &&
						("br" == x.getName()
							? x.remove()
							: x.getLast() &&
							  "br" == x.getLast().$.nodeName.toLowerCase() &&
							  x.getLast().remove());
					v &&
						(x = f.getLast()) &&
						x.type == CKEDITOR.NODE_ELEMENT &&
						"br" == x.getName() &&
						(!CKEDITOR.env.needsBrFiller || x.getPrevious(l) || x.getNext(l)) &&
						x.remove();
					this._.nextNode ||
						(this._.nextNode =
							k || f.equals(p) || !p ? null : this._getNextSourceNode(f, 1, p));
					return f;
				},
				_getNextSourceNode: function (a, b, c) {
					function e(a) {
						return !(a.equals(c) || a.equals(g));
					}
					var g = this.range.root;
					for (a = a.getNextSourceNode(b, null, e); !l(a); )
						a = a.getNextSourceNode(b, null, e);
					return a;
				},
			};
			CKEDITOR.dom.range.prototype.createIterator = function () {
				return new a(this);
			};
		})(),
		(CKEDITOR.command = function (a, d) {
			this.uiItems = [];
			this.exec = function (b) {
				if (this.state == CKEDITOR.TRISTATE_DISABLED || !this.checkAllowed())
					return !1;
				this.editorFocus && a.focus();
				return !1 === this.fire("exec") ? !0 : !1 !== d.exec.call(this, a, b);
			};
			this.refresh = function (a, b) {
				if (!this.readOnly && a.readOnly) return !0;
				if (
					(this.context && !b.isContextFor(this.context)) ||
					!this.checkAllowed(!0)
				)
					return this.disable(), !0;
				this.startDisabled || this.enable();
				this.modes && !this.modes[a.mode] && this.disable();
				return !1 === this.fire("refresh", { editor: a, path: b })
					? !0
					: d.refresh && !1 !== d.refresh.apply(this, arguments);
			};
			var b;
			this.checkAllowed = function (c) {
				return c || "boolean" != typeof b
					? (b = a.activeFilter.checkFeature(this))
					: b;
			};
			CKEDITOR.tools.extend(this, d, {
				modes: { wysiwyg: 1 },
				editorFocus: 1,
				contextSensitive: !!d.context,
				state: CKEDITOR.TRISTATE_DISABLED,
			});
			CKEDITOR.event.call(this);
		}),
		(CKEDITOR.command.prototype = {
			enable: function () {
				this.state == CKEDITOR.TRISTATE_DISABLED &&
					this.checkAllowed() &&
					this.setState(
						this.preserveState && "undefined" != typeof this.previousState
							? this.previousState
							: CKEDITOR.TRISTATE_OFF
					);
			},
			disable: function () {
				this.setState(CKEDITOR.TRISTATE_DISABLED);
			},
			setState: function (a) {
				if (
					this.state == a ||
					(a != CKEDITOR.TRISTATE_DISABLED && !this.checkAllowed())
				)
					return !1;
				this.previousState = this.state;
				this.state = a;
				this.fire("state");
				return !0;
			},
			toggleState: function () {
				this.state == CKEDITOR.TRISTATE_OFF
					? this.setState(CKEDITOR.TRISTATE_ON)
					: this.state == CKEDITOR.TRISTATE_ON &&
					  this.setState(CKEDITOR.TRISTATE_OFF);
			},
		}),
		CKEDITOR.event.implementOn(CKEDITOR.command.prototype),
		(CKEDITOR.ENTER_P = 1),
		(CKEDITOR.ENTER_BR = 2),
		(CKEDITOR.ENTER_DIV = 3),
		(CKEDITOR.config = {
			customConfig: "config.js",
			autoUpdateElement: !0,
			language: "",
			defaultLanguage: "en",
			contentsLangDirection: "",
			enterMode: CKEDITOR.ENTER_P,
			forceEnterMode: !1,
			shiftEnterMode: CKEDITOR.ENTER_BR,
			docType: "\x3c!DOCTYPE html\x3e",
			bodyId: "",
			bodyClass: "",
			fullPage: !1,
			height: 200,
			contentsCss: CKEDITOR.getUrl("contents.css"),
			extraPlugins: "",
			removePlugins: "",
			protectedSource: [],
			tabIndex: 0,
			width: "",
			baseFloatZIndex: 1e4,
			blockedKeystrokes: [
				CKEDITOR.CTRL + 66,
				CKEDITOR.CTRL + 73,
				CKEDITOR.CTRL + 85,
			],
		}),
		(function () {
			function a(a, b, c, f, e) {
				var g, h;
				a = [];
				for (g in b) {
					h = b[g];
					h =
						"boolean" == typeof h
							? {}
							: "function" == typeof h
							? { match: h }
							: J(h);
					"$" != g.charAt(0) && (h.elements = g);
					c && (h.featureName = c.toLowerCase());
					var d = h;
					d.elements = k(d.elements, /\s+/) || null;
					d.propertiesOnly = d.propertiesOnly || !0 === d.elements;
					var m = /\s*,\s*/,
						l = void 0;
					for (l in L) {
						d[l] = k(d[l], m) || null;
						var n = d,
							t = I[l],
							u = k(d[I[l]], m),
							D = d[l],
							y = [],
							q = !0,
							B = void 0;
						u ? (q = !1) : (u = {});
						for (B in D)
							"!" == B.charAt(0) &&
								((B = B.slice(1)), y.push(B), (u[B] = !0), (q = !1));
						for (; (B = y.pop()); ) (D[B] = D["!" + B]), delete D["!" + B];
						n[t] = (q ? !1 : u) || null;
					}
					d.match = d.match || null;
					f.push(h);
					a.push(h);
				}
				b = e.elements;
				e = e.generic;
				var r;
				c = 0;
				for (f = a.length; c < f; ++c) {
					g = J(a[c]);
					h = !0 === g.classes || !0 === g.styles || !0 === g.attributes;
					d = g;
					l = t = m = void 0;
					for (m in L) d[m] = w(d[m]);
					n = !0;
					for (l in I) {
						m = I[l];
						t = d[m];
						u = [];
						D = void 0;
						for (D in t)
							-1 < D.indexOf("*")
								? u.push(new RegExp("^" + D.replace(/\*/g, ".*") + "$"))
								: u.push(D);
						t = u;
						t.length && ((d[m] = t), (n = !1));
					}
					d.nothingRequired = n;
					d.noProperties = !(d.attributes || d.classes || d.styles);
					if (!0 === g.elements || null === g.elements)
						e[h ? "unshift" : "push"](g);
					else
						for (r in ((d = g.elements), delete g.elements, d))
							if (b[r]) b[r][h ? "unshift" : "push"](g);
							else b[r] = [g];
				}
			}
			function d(a, c, f, e) {
				if (!a.match || a.match(c))
					if (e || h(a, c))
						if (
							(a.propertiesOnly || (f.valid = !0),
							f.allAttributes ||
								(f.allAttributes = b(
									a.attributes,
									c.attributes,
									f.validAttributes
								)),
							f.allStyles ||
								(f.allStyles = b(a.styles, c.styles, f.validStyles)),
							!f.allClasses)
						) {
							a = a.classes;
							c = c.classes;
							e = f.validClasses;
							if (a)
								if (!0 === a) a = !0;
								else {
									for (var g = 0, d = c.length, m; g < d; ++g)
										(m = c[g]), e[m] || (e[m] = a(m));
									a = !1;
								}
							else a = !1;
							f.allClasses = a;
						}
			}
			function b(a, b, c) {
				if (!a) return !1;
				if (!0 === a) return !0;
				for (var f in b) c[f] || (c[f] = a(f));
				return !1;
			}
			function c(a, b, c) {
				if (!a.match || a.match(b)) {
					if (a.noProperties) return !1;
					c.hadInvalidAttribute =
						g(a.attributes, b.attributes) || c.hadInvalidAttribute;
					c.hadInvalidStyle = g(a.styles, b.styles) || c.hadInvalidStyle;
					a = a.classes;
					b = b.classes;
					if (a) {
						for (var f = !1, e = !0 === a, h = b.length; h--; )
							if (e || a(b[h])) b.splice(h, 1), (f = !0);
						a = f;
					} else a = !1;
					c.hadInvalidClass = a || c.hadInvalidClass;
				}
			}
			function g(a, b) {
				if (!a) return !1;
				var c = !1,
					f = !0 === a,
					e;
				for (e in b) if (f || a(e)) delete b[e], (c = !0);
				return c;
			}
			function l(a, b, c) {
				if (a.disabled || (a.customConfig && !c) || !b) return !1;
				a._.cachedChecks = {};
				return !0;
			}
			function k(a, b) {
				if (!a) return !1;
				if (!0 === a) return a;
				if ("string" == typeof a)
					return (
						(a = E(a)),
						"*" == a ? !0 : CKEDITOR.tools.convertArrayToObject(a.split(b))
					);
				if (CKEDITOR.tools.isArray(a))
					return a.length ? CKEDITOR.tools.convertArrayToObject(a) : !1;
				var c = {},
					f = 0,
					e;
				for (e in a) (c[e] = a[e]), f++;
				return f ? c : !1;
			}
			function h(a, b) {
				if (a.nothingRequired) return !0;
				var c, f, g, h;
				if ((g = a.requiredClasses))
					for (h = b.classes, c = 0; c < g.length; ++c)
						if (((f = g[c]), "string" == typeof f)) {
							if (-1 == CKEDITOR.tools.indexOf(h, f)) return !1;
						} else if (!CKEDITOR.tools.checkIfAnyArrayItemMatches(h, f))
							return !1;
				return (
					e(b.styles, a.requiredStyles) && e(b.attributes, a.requiredAttributes)
				);
			}
			function e(a, b) {
				if (!b) return !0;
				for (var c = 0, f; c < b.length; ++c)
					if (((f = b[c]), "string" == typeof f)) {
						if (!(f in a)) return !1;
					} else if (!CKEDITOR.tools.checkIfAnyObjectPropertyMatches(a, f))
						return !1;
				return !0;
			}
			function m(a) {
				if (!a) return {};
				a = a.split(/\s*,\s*/).sort();
				for (var b = {}; a.length; ) b[a.shift()] = "cke-test";
				return b;
			}
			function f(a) {
				var b,
					c,
					f,
					e,
					g = {},
					h = 1;
				for (a = E(a); (b = a.match(D)); )
					(c = b[2])
						? ((f = n(c, "styles")), (e = n(c, "attrs")), (c = n(c, "classes")))
						: (f = e = c = null),
						(g["$" + h++] = {
							elements: b[1],
							classes: c,
							styles: f,
							attributes: e,
						}),
						(a = a.slice(b[0].length));
				return g;
			}
			function n(a, b) {
				var c = a.match(Q[b]);
				return c ? E(c[1]) : null;
			}
			function r(a) {
				var b = (a.styleBackup = a.attributes.style),
					c = (a.classBackup = a.attributes["class"]);
				a.styles || (a.styles = CKEDITOR.tools.parseCssText(b || "", 1));
				a.classes || (a.classes = c ? c.split(/\s+/) : []);
			}
			function x(a, b, f, e) {
				var g = 0,
					h;
				e.toHtml && (b.name = b.name.replace(T, "$1"));
				if (e.doCallbacks && a.elementCallbacks) {
					a: {
						h = a.elementCallbacks;
						for (var m = 0, l = h.length, k; m < l; ++m)
							if ((k = h[m](b))) {
								h = k;
								break a;
							}
						h = void 0;
					}
					if (h) return h;
				}
				if (e.doTransform && (h = a._.transformations[b.name])) {
					r(b);
					for (m = 0; m < h.length; ++m) y(a, b, h[m]);
					p(b);
				}
				if (e.doFilter) {
					a: {
						m = b.name;
						l = a._;
						a = l.allowedRules.elements[m];
						h = l.allowedRules.generic;
						m = l.disallowedRules.elements[m];
						l = l.disallowedRules.generic;
						k = e.skipRequired;
						var n = {
								valid: !1,
								validAttributes: {},
								validClasses: {},
								validStyles: {},
								allAttributes: !1,
								allClasses: !1,
								allStyles: !1,
								hadInvalidAttribute: !1,
								hadInvalidClass: !1,
								hadInvalidStyle: !1,
							},
							t,
							D;
						if (a || h) {
							r(b);
							if (m)
								for (t = 0, D = m.length; t < D; ++t)
									if (!1 === c(m[t], b, n)) {
										a = null;
										break a;
									}
							if (l) for (t = 0, D = l.length; t < D; ++t) c(l[t], b, n);
							if (a) for (t = 0, D = a.length; t < D; ++t) d(a[t], b, n, k);
							if (h) for (t = 0, D = h.length; t < D; ++t) d(h[t], b, n, k);
							a = n;
						} else a = null;
					}
					if (!a || !a.valid) return f.push(b), 1;
					D = a.validAttributes;
					var I = a.validStyles;
					h = a.validClasses;
					var m = b.attributes,
						q = b.styles,
						l = b.classes;
					k = b.classBackup;
					var B = b.styleBackup,
						w,
						G,
						C = [],
						n = [],
						E = /^data-cke-/;
					t = !1;
					delete m.style;
					delete m["class"];
					delete b.classBackup;
					delete b.styleBackup;
					if (!a.allAttributes)
						for (w in m)
							D[w] ||
								(E.test(w)
									? w == (G = w.replace(/^data-cke-saved-/, "")) ||
									  D[G] ||
									  (delete m[w], (t = !0))
									: (delete m[w], (t = !0)));
					if (!a.allStyles || a.hadInvalidStyle) {
						for (w in q)
							a.allStyles || I[w] ? C.push(w + ":" + q[w]) : (t = !0);
						C.length && (m.style = C.sort().join("; "));
					} else B && (m.style = B);
					if (!a.allClasses || a.hadInvalidClass) {
						for (w = 0; w < l.length; ++w)
							(a.allClasses || h[l[w]]) && n.push(l[w]);
						n.length && (m["class"] = n.sort().join(" "));
						k && n.length < k.split(/\s+/).length && (t = !0);
					} else k && (m["class"] = k);
					t && (g = 1);
					if (!e.skipFinalValidation && !u(b)) return f.push(b), 1;
				}
				e.toHtml && (b.name = b.name.replace(R, "cke:$1"));
				return g;
			}
			function v(a) {
				var b = [],
					c;
				for (c in a) -1 < c.indexOf("*") && b.push(c.replace(/\*/g, ".*"));
				return b.length ? new RegExp("^(?:" + b.join("|") + ")$") : null;
			}
			function p(a) {
				var b = a.attributes,
					c;
				delete b.style;
				delete b["class"];
				if ((c = CKEDITOR.tools.writeCssText(a.styles, !0))) b.style = c;
				a.classes.length && (b["class"] = a.classes.sort().join(" "));
			}
			function u(a) {
				switch (a.name) {
					case "a":
						if (!(a.children.length || a.attributes.name || a.attributes.id))
							return !1;
						break;
					case "img":
						if (!a.attributes.src) return !1;
				}
				return !0;
			}
			function w(a) {
				if (!a) return !1;
				if (!0 === a) return !0;
				var b = v(a);
				return function (c) {
					return c in a || (b && c.match(b));
				};
			}
			function q() {
				return new CKEDITOR.htmlParser.element("br");
			}
			function z(a) {
				return (
					a.type == CKEDITOR.NODE_ELEMENT &&
					("br" == a.name || G.$block[a.name])
				);
			}
			function t(a, b, c) {
				var f = a.name;
				if (G.$empty[f] || !a.children.length)
					"hr" == f && "br" == b
						? a.replaceWith(q())
						: (a.parent && c.push({ check: "it", el: a.parent }), a.remove());
				else if (G.$block[f] || "tr" == f)
					if ("br" == b)
						a.previous && !z(a.previous) && ((b = q()), b.insertBefore(a)),
							a.next && !z(a.next) && ((b = q()), b.insertAfter(a)),
							a.replaceWithChildren();
					else {
						var f = a.children,
							e;
						b: {
							e = G[b];
							for (var g = 0, h = f.length, d; g < h; ++g)
								if (
									((d = f[g]), d.type == CKEDITOR.NODE_ELEMENT && !e[d.name])
								) {
									e = !1;
									break b;
								}
							e = !0;
						}
						if (e)
							(a.name = b),
								(a.attributes = {}),
								c.push({ check: "parent-down", el: a });
						else {
							e = a.parent;
							for (
								var g =
										e.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT ||
										"body" == e.name,
									m,
									l,
									h = f.length;
								0 < h;

							)
								(d = f[--h]),
									g &&
									(d.type == CKEDITOR.NODE_TEXT ||
										(d.type == CKEDITOR.NODE_ELEMENT && G.$inline[d.name]))
										? (m ||
												((m = new CKEDITOR.htmlParser.element(b)),
												m.insertAfter(a),
												c.push({ check: "parent-down", el: m })),
										  m.add(d, 0))
										: ((m = null),
										  (l = G[e.name] || G.span),
										  d.insertAfter(a),
										  e.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT ||
												d.type != CKEDITOR.NODE_ELEMENT ||
												l[d.name] ||
												c.push({ check: "el-up", el: d }));
							a.remove();
						}
					}
				else
					f in { style: 1, script: 1 }
						? a.remove()
						: (a.parent && c.push({ check: "it", el: a.parent }),
						  a.replaceWithChildren());
			}
			function y(a, b, c) {
				var f, e;
				for (f = 0; f < c.length; ++f)
					if (
						((e = c[f]),
						!((e.check && !a.check(e.check, !1)) || (e.left && !e.left(b))))
					) {
						e.right(b, K);
						break;
					}
			}
			function C(a, b) {
				var c = b.getDefinition(),
					f = c.attributes,
					e = c.styles,
					g,
					h,
					d,
					m;
				if (a.name != c.element) return !1;
				for (g in f)
					if ("class" == g)
						for (
							c = f[g].split(/\s+/), d = a.classes.join("|");
							(m = c.pop());

						) {
							if (-1 == d.indexOf(m)) return !1;
						}
					else if (a.attributes[g] != f[g]) return !1;
				for (h in e) if (a.styles[h] != e[h]) return !1;
				return !0;
			}
			function B(a, b) {
				var c, f;
				"string" == typeof a
					? (c = a)
					: a instanceof CKEDITOR.style
					? (f = a)
					: ((c = a[0]), (f = a[1]));
				return [
					{
						element: c,
						left: f,
						right: function (a, c) {
							c.transform(a, b);
						},
					},
				];
			}
			function A(a) {
				return function (b) {
					return C(b, a);
				};
			}
			function H(a) {
				return function (b, c) {
					c[a](b);
				};
			}
			var G = CKEDITOR.dtd,
				J = CKEDITOR.tools.copy,
				E = CKEDITOR.tools.trim,
				F = ["", "p", "br", "div"];
			CKEDITOR.FILTER_SKIP_TREE = 2;
			CKEDITOR.filter = function (a, b) {
				this.allowedContent = [];
				this.disallowedContent = [];
				this.elementCallbacks = null;
				this.disabled = !1;
				this.editor = null;
				this.id = CKEDITOR.tools.getNextNumber();
				this._ = {
					allowedRules: { elements: {}, generic: [] },
					disallowedRules: { elements: {}, generic: [] },
					transformations: {},
					cachedTests: {},
					cachedChecks: {},
				};
				CKEDITOR.filter.instances[this.id] = this;
				var c = (this.editor = a instanceof CKEDITOR.editor ? a : null);
				if (c && !b) {
					this.customConfig = !0;
					var f = c.config.allowedContent;
					!0 === f
						? (this.disabled = !0)
						: (f || (this.customConfig = !1),
						  this.allow(f, "config", 1),
						  this.allow(c.config.extraAllowedContent, "extra", 1),
						  this.allow(
								F[c.enterMode] + " " + F[c.shiftEnterMode],
								"default",
								1
						  ),
						  this.disallow(c.config.disallowedContent));
				} else (this.customConfig = !1), this.allow(b || a, "default", 1);
			};
			CKEDITOR.filter.instances = {};
			CKEDITOR.filter.prototype = {
				allow: function (b, c, e) {
					if (!l(this, b, e)) return !1;
					var g, h;
					if ("string" == typeof b) b = f(b);
					else if (b instanceof CKEDITOR.style) {
						if (b.toAllowedContentRules)
							return this.allow(b.toAllowedContentRules(this.editor), c, e);
						g = b.getDefinition();
						b = {};
						e = g.attributes;
						b[g.element] = g = {
							styles: g.styles,
							requiredStyles: g.styles && CKEDITOR.tools.objectKeys(g.styles),
						};
						e &&
							((e = J(e)),
							(g.classes = e["class"] ? e["class"].split(/\s+/) : null),
							(g.requiredClasses = g.classes),
							delete e["class"],
							(g.attributes = e),
							(g.requiredAttributes = e && CKEDITOR.tools.objectKeys(e)));
					} else if (CKEDITOR.tools.isArray(b)) {
						for (g = 0; g < b.length; ++g) h = this.allow(b[g], c, e);
						return h;
					}
					a(this, b, c, this.allowedContent, this._.allowedRules);
					return !0;
				},
				applyTo: function (a, b, c, f) {
					if (this.disabled) return !1;
					var e = this,
						g = [],
						h = this.editor && this.editor.config.protectedSource,
						d,
						m = !1,
						l = { doFilter: !c, doTransform: !0, doCallbacks: !0, toHtml: b };
					a.forEach(
						function (a) {
							if (a.type == CKEDITOR.NODE_ELEMENT) {
								if ("off" == a.attributes["data-cke-filter"]) return !1;
								if (
									!b ||
									"span" != a.name ||
									!~CKEDITOR.tools
										.objectKeys(a.attributes)
										.join("|")
										.indexOf("data-cke-")
								)
									if (((d = x(e, a, g, l)), d & 1)) m = !0;
									else if (d & 2) return !1;
							} else if (
								a.type == CKEDITOR.NODE_COMMENT &&
								a.value.match(/^\{cke_protected\}(?!\{C\})/)
							) {
								var c;
								a: {
									var f = decodeURIComponent(
										a.value.replace(/^\{cke_protected\}/, "")
									);
									c = [];
									var k, n, t;
									if (h)
										for (n = 0; n < h.length; ++n)
											if ((t = f.match(h[n])) && t[0].length == f.length) {
												c = !0;
												break a;
											}
									f = CKEDITOR.htmlParser.fragment.fromHtml(f);
									1 == f.children.length &&
										(k = f.children[0]).type == CKEDITOR.NODE_ELEMENT &&
										x(e, k, c, l);
									c = !c.length;
								}
								c || g.push(a);
							}
						},
						null,
						!0
					);
					g.length && (m = !0);
					var k;
					a = [];
					f = F[f || (this.editor ? this.editor.enterMode : CKEDITOR.ENTER_P)];
					for (var n; (c = g.pop()); )
						c.type == CKEDITOR.NODE_ELEMENT ? t(c, f, a) : c.remove();
					for (; (k = a.pop()); )
						if (((c = k.el), c.parent))
							switch (((n = G[c.parent.name] || G.span), k.check)) {
								case "it":
									G.$removeEmpty[c.name] && !c.children.length
										? t(c, f, a)
										: u(c) || t(c, f, a);
									break;
								case "el-up":
									c.parent.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT ||
										n[c.name] ||
										t(c, f, a);
									break;
								case "parent-down":
									c.parent.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT ||
										n[c.name] ||
										t(c.parent, f, a);
							}
					return m;
				},
				checkFeature: function (a) {
					if (this.disabled || !a) return !0;
					a.toFeature && (a = a.toFeature(this.editor));
					return !a.requiredContent || this.check(a.requiredContent);
				},
				disable: function () {
					this.disabled = !0;
				},
				disallow: function (b) {
					if (!l(this, b, !0)) return !1;
					"string" == typeof b && (b = f(b));
					a(this, b, null, this.disallowedContent, this._.disallowedRules);
					return !0;
				},
				addContentForms: function (a) {
					if (!this.disabled && a) {
						var b,
							c,
							f = [],
							e;
						for (b = 0; b < a.length && !e; ++b)
							(c = a[b]),
								("string" == typeof c || c instanceof CKEDITOR.style) &&
									this.check(c) &&
									(e = c);
						if (e) {
							for (b = 0; b < a.length; ++b) f.push(B(a[b], e));
							this.addTransformations(f);
						}
					}
				},
				addElementCallback: function (a) {
					this.elementCallbacks || (this.elementCallbacks = []);
					this.elementCallbacks.push(a);
				},
				addFeature: function (a) {
					if (this.disabled || !a) return !0;
					a.toFeature && (a = a.toFeature(this.editor));
					this.allow(a.allowedContent, a.name);
					this.addTransformations(a.contentTransformations);
					this.addContentForms(a.contentForms);
					return a.requiredContent &&
						(this.customConfig || this.disallowedContent.length)
						? this.check(a.requiredContent)
						: !0;
				},
				addTransformations: function (a) {
					var b, c;
					if (!this.disabled && a) {
						var f = this._.transformations,
							e;
						for (e = 0; e < a.length; ++e) {
							b = a[e];
							var g = void 0,
								h = void 0,
								d = void 0,
								m = void 0,
								l = void 0,
								k = void 0;
							c = [];
							for (h = 0; h < b.length; ++h)
								(d = b[h]),
									"string" == typeof d
										? ((d = d.split(/\s*:\s*/)),
										  (m = d[0]),
										  (l = null),
										  (k = d[1]))
										: ((m = d.check), (l = d.left), (k = d.right)),
									g ||
										((g = d),
										(g = g.element
											? g.element
											: m
											? m.match(/^([a-z0-9]+)/i)[0]
											: g.left.getDefinition().element)),
									l instanceof CKEDITOR.style && (l = A(l)),
									c.push({
										check: m == g ? null : m,
										left: l,
										right: "string" == typeof k ? H(k) : k,
									});
							b = g;
							f[b] || (f[b] = []);
							f[b].push(c);
						}
					}
				},
				check: function (a, b, c) {
					if (this.disabled) return !0;
					if (CKEDITOR.tools.isArray(a)) {
						for (var e = a.length; e--; ) if (this.check(a[e], b, c)) return !0;
						return !1;
					}
					var g, h;
					if ("string" == typeof a) {
						h = a + "\x3c" + (!1 === b ? "0" : "1") + (c ? "1" : "0") + "\x3e";
						if (h in this._.cachedChecks) return this._.cachedChecks[h];
						g = f(a).$1;
						var d = g.styles,
							e = g.classes;
						g.name = g.elements;
						g.classes = e = e ? e.split(/\s*,\s*/) : [];
						g.styles = m(d);
						g.attributes = m(g.attributes);
						g.children = [];
						e.length && (g.attributes["class"] = e.join(" "));
						d && (g.attributes.style = CKEDITOR.tools.writeCssText(g.styles));
					} else
						(g = a.getDefinition()),
							(d = g.styles),
							(e = g.attributes || {}),
							d && !CKEDITOR.tools.isEmpty(d)
								? ((d = J(d)), (e.style = CKEDITOR.tools.writeCssText(d, !0)))
								: (d = {}),
							(g = {
								name: g.element,
								attributes: e,
								classes: e["class"] ? e["class"].split(/\s+/) : [],
								styles: d,
								children: [],
							});
					var d = CKEDITOR.tools.clone(g),
						l = [],
						k;
					if (!1 !== b && (k = this._.transformations[g.name])) {
						for (e = 0; e < k.length; ++e) y(this, g, k[e]);
						p(g);
					}
					x(this, d, l, {
						doFilter: !0,
						doTransform: !1 !== b,
						skipRequired: !c,
						skipFinalValidation: !c,
					});
					0 < l.length
						? (c = !1)
						: ((b = g.attributes["class"]) &&
								(g.attributes["class"] = g.attributes["class"]
									.split(" ")
									.sort()
									.join(" ")),
						  (c = CKEDITOR.tools.objectCompare(
								g.attributes,
								d.attributes,
								!0
						  )),
						  b && (g.attributes["class"] = b));
					"string" == typeof a && (this._.cachedChecks[h] = c);
					return c;
				},
				getAllowedEnterMode: (function () {
					var a = ["p", "div", "br"],
						b = {
							p: CKEDITOR.ENTER_P,
							div: CKEDITOR.ENTER_DIV,
							br: CKEDITOR.ENTER_BR,
						};
					return function (c, f) {
						var e = a.slice(),
							g;
						if (this.check(F[c])) return c;
						for (f || (e = e.reverse()); (g = e.pop()); )
							if (this.check(g)) return b[g];
						return CKEDITOR.ENTER_BR;
					};
				})(),
				clone: function () {
					var a = new CKEDITOR.filter(),
						b = CKEDITOR.tools.clone;
					a.allowedContent = b(this.allowedContent);
					a._.allowedRules = b(this._.allowedRules);
					a.disallowedContent = b(this.disallowedContent);
					a._.disallowedRules = b(this._.disallowedRules);
					a._.transformations = b(this._.transformations);
					a.disabled = this.disabled;
					a.editor = this.editor;
					return a;
				},
				destroy: function () {
					delete CKEDITOR.filter.instances[this.id];
					delete this._;
					delete this.allowedContent;
					delete this.disallowedContent;
				},
			};
			var L = { styles: 1, attributes: 1, classes: 1 },
				I = {
					styles: "requiredStyles",
					attributes: "requiredAttributes",
					classes: "requiredClasses",
				},
				D = /^([a-z0-9\-*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i,
				Q = {
					styles: /{([^}]+)}/,
					attrs: /\[([^\]]+)\]/,
					classes: /\(([^\)]+)\)/,
				},
				T = /^cke:(object|embed|param)$/,
				R = /^(object|embed|param)$/,
				K;
			K = CKEDITOR.filter.transformationsTools = {
				sizeToStyle: function (a) {
					this.lengthToStyle(a, "width");
					this.lengthToStyle(a, "height");
				},
				sizeToAttribute: function (a) {
					this.lengthToAttribute(a, "width");
					this.lengthToAttribute(a, "height");
				},
				lengthToStyle: function (a, b, c) {
					c = c || b;
					if (!(c in a.styles)) {
						var f = a.attributes[b];
						f && (/^\d+$/.test(f) && (f += "px"), (a.styles[c] = f));
					}
					delete a.attributes[b];
				},
				lengthToAttribute: function (a, b, c) {
					c = c || b;
					if (!(c in a.attributes)) {
						var f = a.styles[b],
							e = f && f.match(/^(\d+)(?:\.\d*)?px$/);
						e
							? (a.attributes[c] = e[1])
							: "cke-test" == f && (a.attributes[c] = "cke-test");
					}
					delete a.styles[b];
				},
				alignmentToStyle: function (a) {
					if (!("float" in a.styles)) {
						var b = a.attributes.align;
						if ("left" == b || "right" == b) a.styles["float"] = b;
					}
					delete a.attributes.align;
				},
				alignmentToAttribute: function (a) {
					if (!("align" in a.attributes)) {
						var b = a.styles["float"];
						if ("left" == b || "right" == b) a.attributes.align = b;
					}
					delete a.styles["float"];
				},
				splitBorderShorthand: function (a) {
					if (a.styles.border) {
						var b = CKEDITOR.tools.style.parse.border(a.styles.border);
						b.color && (a.styles["border-color"] = b.color);
						b.style && (a.styles["border-style"] = b.style);
						b.width && (a.styles["border-width"] = b.width);
						delete a.styles.border;
					}
				},
				listTypeToStyle: function (a) {
					if (a.attributes.type)
						switch (a.attributes.type) {
							case "a":
								a.styles["list-style-type"] = "lower-alpha";
								break;
							case "A":
								a.styles["list-style-type"] = "upper-alpha";
								break;
							case "i":
								a.styles["list-style-type"] = "lower-roman";
								break;
							case "I":
								a.styles["list-style-type"] = "upper-roman";
								break;
							case "1":
								a.styles["list-style-type"] = "decimal";
								break;
							default:
								a.styles["list-style-type"] = a.attributes.type;
						}
				},
				splitMarginShorthand: function (a) {
					function b(f) {
						a.styles["margin-top"] = c[f[0]];
						a.styles["margin-right"] = c[f[1]];
						a.styles["margin-bottom"] = c[f[2]];
						a.styles["margin-left"] = c[f[3]];
					}
					if (a.styles.margin) {
						var c = a.styles.margin.match(/(\-?[\.\d]+\w+)/g) || ["0px"];
						switch (c.length) {
							case 1:
								b([0, 0, 0, 0]);
								break;
							case 2:
								b([0, 1, 0, 1]);
								break;
							case 3:
								b([0, 1, 2, 1]);
								break;
							case 4:
								b([0, 1, 2, 3]);
						}
						delete a.styles.margin;
					}
				},
				matchesStyle: C,
				transform: function (a, b) {
					if ("string" == typeof b) a.name = b;
					else {
						var c = b.getDefinition(),
							f = c.styles,
							e = c.attributes,
							g,
							h,
							d,
							m;
						a.name = c.element;
						for (g in e)
							if ("class" == g)
								for (
									c = a.classes.join("|"), d = e[g].split(/\s+/);
									(m = d.pop());

								)
									-1 == c.indexOf(m) && a.classes.push(m);
							else a.attributes[g] = e[g];
						for (h in f) a.styles[h] = f[h];
					}
				},
			};
		})(),
		(function () {
			CKEDITOR.focusManager = function (a) {
				if (a.focusManager) return a.focusManager;
				this.hasFocus = !1;
				this.currentActive = null;
				this._ = { editor: a };
				return this;
			};
			CKEDITOR.focusManager._ = { blurDelay: 200 };
			CKEDITOR.focusManager.prototype = {
				focus: function (a) {
					this._.timer && clearTimeout(this._.timer);
					a && (this.currentActive = a);
					this.hasFocus ||
						this._.locked ||
						((a = CKEDITOR.currentInstance) && a.focusManager.blur(1),
						(this.hasFocus = !0),
						(a = this._.editor.container) && a.addClass("cke_focus"),
						this._.editor.fire("focus"));
				},
				lock: function () {
					this._.locked = 1;
				},
				unlock: function () {
					delete this._.locked;
				},
				blur: function (a) {
					function d() {
						if (this.hasFocus) {
							this.hasFocus = !1;
							var a = this._.editor.container;
							a && a.removeClass("cke_focus");
							this._.editor.fire("blur");
						}
					}
					if (!this._.locked) {
						this._.timer && clearTimeout(this._.timer);
						var b = CKEDITOR.focusManager._.blurDelay;
						a || !b
							? d.call(this)
							: (this._.timer = CKEDITOR.tools.setTimeout(
									function () {
										delete this._.timer;
										d.call(this);
									},
									b,
									this
							  ));
					}
				},
				add: function (a, d) {
					var b = a.getCustomData("focusmanager");
					if (!b || b != this) {
						b && b.remove(a);
						var b = "focus",
							c = "blur";
						d &&
							(CKEDITOR.env.ie
								? ((b = "focusin"), (c = "focusout"))
								: (CKEDITOR.event.useCapture = 1));
						var g = {
							blur: function () {
								a.equals(this.currentActive) && this.blur();
							},
							focus: function () {
								this.focus(a);
							},
						};
						a.on(b, g.focus, this);
						a.on(c, g.blur, this);
						d && (CKEDITOR.event.useCapture = 0);
						a.setCustomData("focusmanager", this);
						a.setCustomData("focusmanager_handlers", g);
					}
				},
				remove: function (a) {
					a.removeCustomData("focusmanager");
					var d = a.removeCustomData("focusmanager_handlers");
					a.removeListener("blur", d.blur);
					a.removeListener("focus", d.focus);
				},
			};
		})(),
		(CKEDITOR.keystrokeHandler = function (a) {
			if (a.keystrokeHandler) return a.keystrokeHandler;
			this.keystrokes = {};
			this.blockedKeystrokes = {};
			this._ = { editor: a };
			return this;
		}),
		(function () {
			var a,
				d = function (b) {
					b = b.data;
					var g = b.getKeystroke(),
						d = this.keystrokes[g],
						k = this._.editor;
					a = !1 === k.fire("key", { keyCode: g, domEvent: b });
					a ||
						(d && (a = !1 !== k.execCommand(d, { from: "keystrokeHandler" })),
						a || (a = !!this.blockedKeystrokes[g]));
					a && b.preventDefault(!0);
					return !a;
				},
				b = function (b) {
					a && ((a = !1), b.data.preventDefault(!0));
				};
			CKEDITOR.keystrokeHandler.prototype = {
				attach: function (a) {
					a.on("keydown", d, this);
					if (CKEDITOR.env.gecko && CKEDITOR.env.mac) a.on("keypress", b, this);
				},
			};
		})(),
		(function () {
			CKEDITOR.lang = {
				languages: {
					af: 1,
					ar: 1,
					az: 1,
					bg: 1,
					bn: 1,
					bs: 1,
					ca: 1,
					cs: 1,
					cy: 1,
					da: 1,
					de: 1,
					"de-ch": 1,
					el: 1,
					"en-au": 1,
					"en-ca": 1,
					"en-gb": 1,
					en: 1,
					eo: 1,
					es: 1,
					"es-mx": 1,
					et: 1,
					eu: 1,
					fa: 1,
					fi: 1,
					fo: 1,
					"fr-ca": 1,
					fr: 1,
					gl: 1,
					gu: 1,
					he: 1,
					hi: 1,
					hr: 1,
					hu: 1,
					id: 1,
					is: 1,
					it: 1,
					ja: 1,
					ka: 1,
					km: 1,
					ko: 1,
					ku: 1,
					lt: 1,
					lv: 1,
					mk: 1,
					mn: 1,
					ms: 1,
					nb: 1,
					nl: 1,
					no: 1,
					oc: 1,
					pl: 1,
					"pt-br": 1,
					pt: 1,
					ro: 1,
					ru: 1,
					si: 1,
					sk: 1,
					sl: 1,
					sq: 1,
					"sr-latn": 1,
					sr: 1,
					sv: 1,
					th: 1,
					tr: 1,
					tt: 1,
					ug: 1,
					uk: 1,
					vi: 1,
					"zh-cn": 1,
					zh: 1,
				},
				rtl: { ar: 1, fa: 1, he: 1, ku: 1, ug: 1 },
				load: function (a, d, b) {
					(a && CKEDITOR.lang.languages[a]) || (a = this.detect(d, a));
					var c = this;
					d = function () {
						c[a].dir = c.rtl[a] ? "rtl" : "ltr";
						b(a, c[a]);
					};
					this[a]
						? d()
						: CKEDITOR.scriptLoader.load(
								CKEDITOR.getUrl("lang/" + a + ".js"),
								d,
								this
						  );
				},
				detect: function (a, d) {
					var b = this.languages;
					d = d || navigator.userLanguage || navigator.language || a;
					var c = d.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/),
						g = c[1],
						c = c[2];
					b[g + "-" + c] ? (g = g + "-" + c) : b[g] || (g = null);
					CKEDITOR.lang.detect = g
						? function () {
								return g;
						  }
						: function (a) {
								return a;
						  };
					return g || a;
				},
			};
		})(),
		(CKEDITOR.scriptLoader = (function () {
			var a = {},
				d = {};
			return {
				load: function (b, c, g, l) {
					var k = "string" == typeof b;
					k && (b = [b]);
					g || (g = CKEDITOR);
					var h = b.length,
						e = [],
						m = [],
						f = function (a) {
							c && (k ? c.call(g, a) : c.call(g, e, m));
						};
					if (0 === h) f(!0);
					else {
						var n = function (a, b) {
								(b ? e : m).push(a);
								0 >= --h &&
									(l &&
										CKEDITOR.document
											.getDocumentElement()
											.removeStyle("cursor"),
									f(b));
							},
							r = function (b, c) {
								a[b] = 1;
								var f = d[b];
								delete d[b];
								for (var e = 0; e < f.length; e++) f[e](b, c);
							},
							x = function (b) {
								if (a[b]) n(b, !0);
								else {
									var f = d[b] || (d[b] = []);
									f.push(n);
									if (!(1 < f.length)) {
										var e = new CKEDITOR.dom.element("script");
										e.setAttributes({ type: "text/javascript", src: b });
										c &&
											(CKEDITOR.env.ie &&
											(8 >= CKEDITOR.env.version || CKEDITOR.env.ie9Compat)
												? (e.$.onreadystatechange = function () {
														if (
															"loaded" == e.$.readyState ||
															"complete" == e.$.readyState
														)
															(e.$.onreadystatechange = null), r(b, !0);
												  })
												: ((e.$.onload = function () {
														setTimeout(function () {
															r(b, !0);
														}, 0);
												  }),
												  (e.$.onerror = function () {
														r(b, !1);
												  })));
										e.appendTo(CKEDITOR.document.getHead());
									}
								}
							};
						l &&
							CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
						for (var v = 0; v < h; v++) x(b[v]);
					}
				},
				queue: (function () {
					function a() {
						var b;
						(b = c[0]) && this.load(b.scriptUrl, b.callback, CKEDITOR, 0);
					}
					var c = [];
					return function (g, d) {
						var k = this;
						c.push({
							scriptUrl: g,
							callback: function () {
								d && d.apply(this, arguments);
								c.shift();
								a.call(k);
							},
						});
						1 == c.length && a.call(this);
					};
				})(),
			};
		})()),
		(CKEDITOR.resourceManager = function (a, d) {
			this.basePath = a;
			this.fileName = d;
			this.registered = {};
			this.loaded = {};
			this.externals = {};
			this._ = { waitingList: {} };
		}),
		(CKEDITOR.resourceManager.prototype = {
			add: function (a, d) {
				if (this.registered[a])
					throw Error(
						'[CKEDITOR.resourceManager.add] The resource name "' +
							a +
							'" is already registered.'
					);
				var b = (this.registered[a] = d || {});
				b.name = a;
				b.path = this.getPath(a);
				CKEDITOR.fire(
					a + CKEDITOR.tools.capitalize(this.fileName) + "Ready",
					b
				);
				return this.get(a);
			},
			get: function (a) {
				return this.registered[a] || null;
			},
			getPath: function (a) {
				var d = this.externals[a];
				return CKEDITOR.getUrl((d && d.dir) || this.basePath + a + "/");
			},
			getFilePath: function (a) {
				var d = this.externals[a];
				return CKEDITOR.getUrl(
					this.getPath(a) + (d ? d.file : this.fileName + ".js")
				);
			},
			addExternal: function (a, d, b) {
				a = a.split(",");
				for (var c = 0; c < a.length; c++) {
					var g = a[c];
					b ||
						(d = d.replace(/[^\/]+$/, function (a) {
							b = a;
							return "";
						}));
					this.externals[g] = { dir: d, file: b || this.fileName + ".js" };
				}
			},
			load: function (a, d, b) {
				CKEDITOR.tools.isArray(a) || (a = a ? [a] : []);
				for (
					var c = this.loaded,
						g = this.registered,
						l = [],
						k = {},
						h = {},
						e = 0;
					e < a.length;
					e++
				) {
					var m = a[e];
					if (m)
						if (c[m] || g[m]) h[m] = this.get(m);
						else {
							var f = this.getFilePath(m);
							l.push(f);
							f in k || (k[f] = []);
							k[f].push(m);
						}
				}
				CKEDITOR.scriptLoader.load(
					l,
					function (a, f) {
						if (f.length)
							throw Error(
								'[CKEDITOR.resourceManager.load] Resource name "' +
									k[f[0]].join(",") +
									'" was not found at "' +
									f[0] +
									'".'
							);
						for (var e = 0; e < a.length; e++)
							for (var g = k[a[e]], m = 0; m < g.length; m++) {
								var l = g[m];
								h[l] = this.get(l);
								c[l] = 1;
							}
						d.call(b, h);
					},
					this
				);
			},
		}),
		(CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin")),
		(CKEDITOR.plugins.load = CKEDITOR.tools.override(
			CKEDITOR.plugins.load,
			function (a) {
				var d = {};
				return function (b, c, g) {
					var l = {},
						k = function (b) {
							a.call(
								this,
								b,
								function (a) {
									CKEDITOR.tools.extend(l, a);
									var b = [],
										f;
									for (f in a) {
										var h = a[f],
											r = h && h.requires;
										if (!d[f]) {
											if (h.icons)
												for (var x = h.icons.split(","), v = x.length; v--; )
													CKEDITOR.skin.addIcon(
														x[v],
														h.path +
															"icons/" +
															(CKEDITOR.env.hidpi && h.hidpi ? "hidpi/" : "") +
															x[v] +
															".png"
													);
											d[f] = 1;
										}
										if (r)
											for (
												r.split && (r = r.split(",")), h = 0;
												h < r.length;
												h++
											)
												l[r[h]] || b.push(r[h]);
									}
									if (b.length) k.call(this, b);
									else {
										for (f in l)
											(h = l[f]),
												h.onLoad &&
													!h.onLoad._called &&
													(!1 === h.onLoad() && delete l[f],
													(h.onLoad._called = 1));
										c && c.call(g || window, l);
									}
								},
								this
							);
						};
					k.call(this, b);
				};
			}
		)),
		(CKEDITOR.plugins.setLang = function (a, d, b) {
			var c = this.get(a);
			a = c.langEntries || (c.langEntries = {});
			c = c.lang || (c.lang = []);
			c.split && (c = c.split(","));
			-1 == CKEDITOR.tools.indexOf(c, d) && c.push(d);
			a[d] = b;
		}),
		(CKEDITOR.ui = function (a) {
			if (a.ui) return a.ui;
			this.items = {};
			this.instances = {};
			this.editor = a;
			this._ = { handlers: {} };
			return this;
		}),
		(CKEDITOR.ui.prototype = {
			add: function (a, d, b) {
				b.name = a.toLowerCase();
				var c = (this.items[a] = {
					type: d,
					command: b.command || null,
					args: Array.prototype.slice.call(arguments, 2),
				});
				CKEDITOR.tools.extend(c, b);
			},
			get: function (a) {
				return this.instances[a];
			},
			create: function (a) {
				var d = this.items[a],
					b = d && this._.handlers[d.type],
					c = d && d.command && this.editor.getCommand(d.command),
					b = b && b.create.apply(this, d.args);
				this.instances[a] = b;
				c && c.uiItems.push(b);
				b && !b.type && (b.type = d.type);
				return b;
			},
			addHandler: function (a, d) {
				this._.handlers[a] = d;
			},
			space: function (a) {
				return CKEDITOR.document.getById(this.spaceId(a));
			},
			spaceId: function (a) {
				return this.editor.id + "_" + a;
			},
		}),
		CKEDITOR.event.implementOn(CKEDITOR.ui),
		(function () {
			function a(a, f, e) {
				CKEDITOR.event.call(this);
				a = a && CKEDITOR.tools.clone(a);
				if (void 0 !== f) {
					if (!(f instanceof CKEDITOR.dom.element))
						throw Error("Expect element of type CKEDITOR.dom.element.");
					if (!e) throw Error("One of the element modes must be specified.");
					if (
						CKEDITOR.env.ie &&
						CKEDITOR.env.quirks &&
						e == CKEDITOR.ELEMENT_MODE_INLINE
					)
						throw Error("Inline element mode is not supported on IE quirks.");
					if (!b(f, e))
						throw Error(
							'The specified element mode is not supported on element: "' +
								f.getName() +
								'".'
						);
					this.element = f;
					this.elementMode = e;
					this.name =
						this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO &&
						(f.getId() || f.getNameAtt());
				} else this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
				this._ = {};
				this.commands = {};
				this.templates = {};
				this.name = this.name || d();
				this.id = CKEDITOR.tools.getNextId();
				this.status = "unloaded";
				this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
				this.ui = new CKEDITOR.ui(this);
				this.focusManager = new CKEDITOR.focusManager(this);
				this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
				this.on("readOnly", c);
				this.on("selectionChange", function (a) {
					l(this, a.data.path);
				});
				this.on("activeFilterChange", function () {
					l(this, this.elementPath(), !0);
				});
				this.on("mode", c);
				this.on("instanceReady", function () {
					if (this.config.startupFocus) {
						if ("end" === this.config.startupFocus) {
							var a = this.createRange();
							a.selectNodeContents(this.editable());
							a.shrink(CKEDITOR.SHRINK_ELEMENT, !0);
							a.collapse();
							this.getSelection().selectRanges([a]);
						}
						this.focus();
					}
				});
				CKEDITOR.fire("instanceCreated", null, this);
				CKEDITOR.add(this);
				CKEDITOR.tools.setTimeout(
					function () {
						"destroyed" !== this.status
							? h(this, a)
							: CKEDITOR.warn("editor-incorrect-destroy");
					},
					0,
					this
				);
			}
			function d() {
				do var a = "editor" + ++v;
				while (CKEDITOR.instances[a]);
				return a;
			}
			function b(a, b) {
				return b == CKEDITOR.ELEMENT_MODE_INLINE
					? a.is(CKEDITOR.dtd.$editable) || a.is("textarea")
					: b == CKEDITOR.ELEMENT_MODE_REPLACE
					? !a.is(CKEDITOR.dtd.$nonBodyContent)
					: 1;
			}
			function c() {
				var a = this.commands,
					b;
				for (b in a) g(this, a[b]);
			}
			function g(a, b) {
				b[
					b.startDisabled
						? "disable"
						: a.readOnly && !b.readOnly
						? "disable"
						: b.modes[a.mode]
						? "enable"
						: "disable"
				]();
			}
			function l(a, b, c) {
				if (b) {
					var f,
						e,
						g = a.commands;
					for (e in g) (f = g[e]), (c || f.contextSensitive) && f.refresh(a, b);
				}
			}
			function k(a) {
				var b = a.config.customConfig;
				if (!b) return !1;
				var b = CKEDITOR.getUrl(b),
					c = p[b] || (p[b] = {});
				c.fn
					? (c.fn.call(a, a.config),
					  (CKEDITOR.getUrl(a.config.customConfig) != b && k(a)) ||
							a.fireOnce("customConfigLoaded"))
					: CKEDITOR.scriptLoader.queue(b, function () {
							c.fn = CKEDITOR.editorConfig
								? CKEDITOR.editorConfig
								: function () {};
							k(a);
					  });
				return !0;
			}
			function h(a, b) {
				a.on("customConfigLoaded", function () {
					if (b) {
						if (b.on) for (var c in b.on) a.on(c, b.on[c]);
						CKEDITOR.tools.extend(a.config, b, !0);
						delete a.config.on;
					}
					c = a.config;
					a.readOnly = c.readOnly
						? !0
						: a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE
						? a.element.is("textarea")
							? a.element.hasAttribute("disabled") ||
							  a.element.hasAttribute("readonly")
							: a.element.isReadOnly()
						: a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE
						? a.element.hasAttribute("disabled") ||
						  a.element.hasAttribute("readonly")
						: !1;
					a.blockless =
						a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE
							? !(
									a.element.is("textarea") ||
									CKEDITOR.dtd[a.element.getName()].p
							  )
							: !1;
					a.tabIndex =
						c.tabIndex ||
						(a.element && a.element.getAttribute("tabindex")) ||
						0;
					a.activeEnterMode = a.enterMode = a.blockless
						? CKEDITOR.ENTER_BR
						: c.enterMode;
					a.activeShiftEnterMode = a.shiftEnterMode = a.blockless
						? CKEDITOR.ENTER_BR
						: c.shiftEnterMode;
					c.skin && (CKEDITOR.skinName = c.skin);
					a.fireOnce("configLoaded");
					a.dataProcessor = new CKEDITOR.htmlDataProcessor(a);
					a.filter = a.activeFilter = new CKEDITOR.filter(a);
					e(a);
				});
				b && null != b.customConfig && (a.config.customConfig = b.customConfig);
				k(a) || a.fireOnce("customConfigLoaded");
			}
			function e(a) {
				CKEDITOR.skin.loadPart("editor", function () {
					m(a);
				});
			}
			function m(a) {
				CKEDITOR.lang.load(
					a.config.language,
					a.config.defaultLanguage,
					function (b, c) {
						var e = a.config.title;
						a.langCode = b;
						a.lang = CKEDITOR.tools.prototypedCopy(c);
						a.title =
							"string" == typeof e || !1 === e
								? e
								: [a.lang.editor, a.name].join(", ");
						a.config.contentsLangDirection ||
							(a.config.contentsLangDirection =
								a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE
									? a.element.getDirection(1)
									: a.lang.dir);
						a.fire("langLoaded");
						f(a);
					}
				);
			}
			function f(a) {
				a.getStylesSet(function (b) {
					a.once(
						"loaded",
						function () {
							a.fire("stylesSet", { styles: b });
						},
						null,
						null,
						1
					);
					n(a);
				});
			}
			function n(a) {
				function b(a) {
					if (!a) return "";
					CKEDITOR.tools.isArray(a) && (a = a.join(","));
					return a.replace(/\s/g, "");
				}
				var c = a.config,
					f = b(c.plugins),
					e = b(c.extraPlugins),
					g = b(c.removePlugins);
				if (e)
					var h = new RegExp(
							"(?:^|,)(?:" + e.replace(/,/g, "|") + ")(?\x3d,|$)",
							"g"
						),
						f = f.replace(h, ""),
						f = f + ("," + e);
				if (g)
					var d = new RegExp(
							"(?:^|,)(?:" + g.replace(/,/g, "|") + ")(?\x3d,|$)",
							"g"
						),
						f = f.replace(d, "");
				CKEDITOR.env.air && (f += ",adobeair");
				CKEDITOR.plugins.load(f.split(","), function (b) {
					var f = [],
						e = [],
						g = [];
					a.plugins = CKEDITOR.tools.extend({}, a.plugins, b);
					for (var h in b) {
						var m = b[h],
							l = m.lang,
							k = null,
							t = m.requires,
							n;
						CKEDITOR.tools.isArray(t) && (t = t.join(","));
						if (t && (n = t.match(d)))
							for (; (t = n.pop()); )
								CKEDITOR.error("editor-plugin-required", {
									plugin: t.replace(",", ""),
									requiredBy: h,
								});
						l &&
							!a.lang[h] &&
							(l.split && (l = l.split(",")),
							0 <= CKEDITOR.tools.indexOf(l, a.langCode)
								? (k = a.langCode)
								: ((k = a.langCode.replace(/-.*/, "")),
								  (k =
										k != a.langCode && 0 <= CKEDITOR.tools.indexOf(l, k)
											? k
											: 0 <= CKEDITOR.tools.indexOf(l, "en")
											? "en"
											: l[0])),
							m.langEntries && m.langEntries[k]
								? ((a.lang[h] = m.langEntries[k]), (k = null))
								: g.push(CKEDITOR.getUrl(m.path + "lang/" + k + ".js")));
						e.push(k);
						f.push(m);
					}
					CKEDITOR.scriptLoader.load(g, function () {
						for (
							var b = ["beforeInit", "init", "afterInit"], g = 0;
							g < b.length;
							g++
						)
							for (var h = 0; h < f.length; h++) {
								var d = f[h];
								0 === g &&
									e[h] &&
									d.lang &&
									d.langEntries &&
									(a.lang[d.name] = d.langEntries[e[h]]);
								if (d[b[g]]) d[b[g]](a);
							}
						a.fireOnce("pluginsLoaded");
						c.keystrokes && a.setKeystroke(a.config.keystrokes);
						for (h = 0; h < a.config.blockedKeystrokes.length; h++)
							a.keystrokeHandler.blockedKeystrokes[
								a.config.blockedKeystrokes[h]
							] = 1;
						a.status = "loaded";
						a.fireOnce("loaded");
						CKEDITOR.fire("instanceLoaded", null, a);
					});
				});
			}
			function r() {
				var a = this.element;
				if (a && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
					var b = this.getData();
					this.config.htmlEncodeOutput && (b = CKEDITOR.tools.htmlEncode(b));
					a.is("textarea") ? a.setValue(b) : a.setHtml(b);
					return !0;
				}
				return !1;
			}
			function x(a, b) {
				function c(a) {
					var b = a.startContainer,
						f = a.endContainer;
					return b.is &&
						(b.is("tr") ||
							(b.is("td") && b.equals(f) && a.endOffset === b.getChildCount()))
						? !0
						: !1;
				}
				function f(a) {
					var b = a.startContainer;
					return b.is("tr") ? a.cloneContents() : b.clone(!0);
				}
				for (
					var e = new CKEDITOR.dom.documentFragment(), g, h, d, m = 0;
					m < a.length;
					m++
				) {
					var l = a[m],
						k = l.startContainer.getAscendant("tr", !0);
					c(l)
						? (g ||
								((g = k.getAscendant("table").clone()),
								g.append(
									k.getAscendant({ thead: 1, tbody: 1, tfoot: 1 }).clone()
								),
								e.append(g),
								(g = g.findOne("thead, tbody, tfoot"))),
						  (h && h.equals(k)) || ((h = k), (d = k.clone()), g.append(d)),
						  d.append(f(l)))
						: e.append(l.cloneContents());
				}
				return g ? e : b.getHtmlFromRange(a[0]);
			}
			a.prototype = CKEDITOR.editor.prototype;
			CKEDITOR.editor = a;
			var v = 0,
				p = {};
			CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
				plugins: {
					detectConflict: function (a, b) {
						for (var c = 0; c < b.length; c++) {
							var f = b[c];
							if (this[f])
								return (
									CKEDITOR.warn("editor-plugin-conflict", {
										plugin: a,
										replacedWith: f,
									}),
									!0
								);
						}
						return !1;
					},
				},
				addCommand: function (a, b) {
					b.name = a.toLowerCase();
					var c =
						b instanceof CKEDITOR.command ? b : new CKEDITOR.command(this, b);
					this.mode && g(this, c);
					return (this.commands[a] = c);
				},
				_attachToForm: function () {
					function a(b) {
						c.updateElement();
						c._.required &&
							!f.getValue() &&
							!1 === c.fire("required") &&
							b.data.preventDefault();
					}
					function b(a) {
						return !!(a && a.call && a.apply);
					}
					var c = this,
						f = c.element,
						e = new CKEDITOR.dom.element(f.$.form);
					f.is("textarea") &&
						e &&
						(e.on("submit", a),
						b(e.$.submit) &&
							(e.$.submit = CKEDITOR.tools.override(e.$.submit, function (b) {
								return function () {
									a();
									b.apply ? b.apply(this) : b();
								};
							})),
						c.on("destroy", function () {
							e.removeListener("submit", a);
						}));
				},
				destroy: function (a) {
					var b = CKEDITOR.filter.instances,
						c = this;
					this.fire("beforeDestroy");
					!a && r.call(this);
					this.editable(null);
					this.filter && delete this.filter;
					CKEDITOR.tools.array.forEach(
						CKEDITOR.tools.objectKeys(b),
						function (a) {
							a = b[a];
							c === a.editor && a.destroy();
						}
					);
					delete this.activeFilter;
					this.status = "destroyed";
					this.fire("destroy");
					this.removeAllListeners();
					CKEDITOR.remove(this);
					CKEDITOR.fire("instanceDestroyed", null, this);
				},
				elementPath: function (a) {
					if (!a) {
						a = this.getSelection();
						if (!a) return null;
						a = a.getStartElement();
					}
					return a ? new CKEDITOR.dom.elementPath(a, this.editable()) : null;
				},
				createRange: function () {
					var a = this.editable();
					return a ? new CKEDITOR.dom.range(a) : null;
				},
				execCommand: function (a, b) {
					var c = this.getCommand(a),
						f = { name: a, commandData: b || {}, command: c };
					return c &&
						c.state != CKEDITOR.TRISTATE_DISABLED &&
						!1 !== this.fire("beforeCommandExec", f) &&
						((f.returnValue = c.exec(f.commandData)),
						!c.async && !1 !== this.fire("afterCommandExec", f))
						? f.returnValue
						: !1;
				},
				getCommand: function (a) {
					return this.commands[a];
				},
				getData: function (a) {
					!a && this.fire("beforeGetData");
					var b = this._.data;
					"string" != typeof b &&
						(b =
							(b = this.element) &&
							this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE
								? b.is("textarea")
									? b.getValue()
									: b.getHtml()
								: "");
					b = { dataValue: b };
					!a && this.fire("getData", b);
					return b.dataValue;
				},
				getSnapshot: function () {
					var a = this.fire("getSnapshot");
					"string" != typeof a &&
						(a =
							(a = this.element) &&
							this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE
								? a.is("textarea")
									? a.getValue()
									: a.getHtml()
								: "");
					return a;
				},
				loadSnapshot: function (a) {
					this.fire("loadSnapshot", a);
				},
				setData: function (a, b, c) {
					var f = !0,
						e = b;
					b &&
						"object" == typeof b &&
						((c = b.internal), (e = b.callback), (f = !b.noSnapshot));
					!c && f && this.fire("saveSnapshot");
					if (e || !c)
						this.once("dataReady", function (a) {
							!c && f && this.fire("saveSnapshot");
							e && e.call(a.editor);
						});
					a = { dataValue: a };
					!c && this.fire("setData", a);
					this._.data = a.dataValue;
					!c && this.fire("afterSetData", a);
				},
				setReadOnly: function (a) {
					a = null == a || a;
					this.readOnly != a &&
						((this.readOnly = a),
						(this.keystrokeHandler.blockedKeystrokes[8] = +a),
						this.editable().setReadOnly(a),
						this.fire("readOnly"));
				},
				insertHtml: function (a, b, c) {
					this.fire("insertHtml", { dataValue: a, mode: b, range: c });
				},
				insertText: function (a) {
					this.fire("insertText", a);
				},
				insertElement: function (a) {
					this.fire("insertElement", a);
				},
				getSelectedHtml: function (a) {
					var b = this.editable(),
						c = this.getSelection(),
						c = c && c.getRanges();
					if (!b || !c || 0 === c.length) return null;
					b = x(c, b);
					return a ? b.getHtml() : b;
				},
				extractSelectedHtml: function (a, b) {
					var c = this.editable(),
						f = this.getSelection().getRanges(),
						e = new CKEDITOR.dom.documentFragment(),
						g;
					if (!c || 0 === f.length) return null;
					for (g = 0; g < f.length; g++)
						e.append(c.extractHtmlFromRange(f[g], b));
					b || this.getSelection().selectRanges([f[0]]);
					return a ? e.getHtml() : e;
				},
				focus: function () {
					this.fire("beforeFocus");
				},
				checkDirty: function () {
					return (
						"ready" == this.status &&
						this._.previousValue !== this.getSnapshot()
					);
				},
				resetDirty: function () {
					this._.previousValue = this.getSnapshot();
				},
				updateElement: function () {
					return r.call(this);
				},
				setKeystroke: function () {
					for (
						var a = this.keystrokeHandler.keystrokes,
							b = CKEDITOR.tools.isArray(arguments[0])
								? arguments[0]
								: [[].slice.call(arguments, 0)],
							c,
							f,
							e = b.length;
						e--;

					)
						(c = b[e]),
							(f = 0),
							CKEDITOR.tools.isArray(c) && ((f = c[1]), (c = c[0])),
							f ? (a[c] = f) : delete a[c];
				},
				getCommandKeystroke: function (a, b) {
					var c = "string" === typeof a ? this.getCommand(a) : a,
						f = [];
					if (c) {
						var e = CKEDITOR.tools.object.findKey(this.commands, c),
							g = this.keystrokeHandler.keystrokes;
						if (c.fakeKeystroke) f.push(c.fakeKeystroke);
						else for (var h in g) g[h] === e && f.push(h);
					}
					return b ? f : f[0] || null;
				},
				addFeature: function (a) {
					return this.filter.addFeature(a);
				},
				setActiveFilter: function (a) {
					a || (a = this.filter);
					this.activeFilter !== a &&
						((this.activeFilter = a),
						this.fire("activeFilterChange"),
						a === this.filter
							? this.setActiveEnterMode(null, null)
							: this.setActiveEnterMode(
									a.getAllowedEnterMode(this.enterMode),
									a.getAllowedEnterMode(this.shiftEnterMode, !0)
							  ));
				},
				setActiveEnterMode: function (a, b) {
					a = a ? (this.blockless ? CKEDITOR.ENTER_BR : a) : this.enterMode;
					b = b
						? this.blockless
							? CKEDITOR.ENTER_BR
							: b
						: this.shiftEnterMode;
					if (this.activeEnterMode != a || this.activeShiftEnterMode != b)
						(this.activeEnterMode = a),
							(this.activeShiftEnterMode = b),
							this.fire("activeEnterModeChange");
				},
				showNotification: function (a) {
					alert(a);
				},
			});
		})(),
		(CKEDITOR.ELEMENT_MODE_NONE = 0),
		(CKEDITOR.ELEMENT_MODE_REPLACE = 1),
		(CKEDITOR.ELEMENT_MODE_APPENDTO = 2),
		(CKEDITOR.ELEMENT_MODE_INLINE = 3),
		(CKEDITOR.htmlParser = function () {
			this._ = {
				htmlPartsRegex: /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)--\x3e)|(?:([^\/\s>]+)((?:\s+[\w\-:.]+(?:\s*=\s*?(?:(?:"[^"]*")|(?:'[^']*')|[^\s"'\/>]+))?)*)[\S\s]*?(\/?)>))/g,
			};
		}),
		(function () {
			var a = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,
				d = {
					checked: 1,
					compact: 1,
					declare: 1,
					defer: 1,
					disabled: 1,
					ismap: 1,
					multiple: 1,
					nohref: 1,
					noresize: 1,
					noshade: 1,
					nowrap: 1,
					readonly: 1,
					selected: 1,
				};
			CKEDITOR.htmlParser.prototype = {
				onTagOpen: function () {},
				onTagClose: function () {},
				onText: function () {},
				onCDATA: function () {},
				onComment: function () {},
				parse: function (b) {
					for (var c, g, l = 0, k; (c = this._.htmlPartsRegex.exec(b)); ) {
						g = c.index;
						if (g > l)
							if (((l = b.substring(l, g)), k)) k.push(l);
							else this.onText(l);
						l = this._.htmlPartsRegex.lastIndex;
						if ((g = c[1]))
							if (
								((g = g.toLowerCase()),
								k &&
									CKEDITOR.dtd.$cdata[g] &&
									(this.onCDATA(k.join("")), (k = null)),
								!k)
							) {
								this.onTagClose(g);
								continue;
							}
						if (k) k.push(c[0]);
						else if ((g = c[3])) {
							if (((g = g.toLowerCase()), !/="/.test(g))) {
								var h = {},
									e,
									m = c[4];
								c = !!c[5];
								if (m)
									for (; (e = a.exec(m)); ) {
										var f = e[1].toLowerCase();
										e = e[2] || e[3] || e[4] || "";
										h[f] = !e && d[f] ? f : CKEDITOR.tools.htmlDecodeAttr(e);
									}
								this.onTagOpen(g, h, c);
								!k && CKEDITOR.dtd.$cdata[g] && (k = []);
							}
						} else if ((g = c[2])) this.onComment(g);
					}
					if (b.length > l) this.onText(b.substring(l, b.length));
				},
			};
		})(),
		(CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({
			$: function () {
				this._ = { output: [] };
			},
			proto: {
				openTag: function (a) {
					this._.output.push("\x3c", a);
				},
				openTagClose: function (a, d) {
					d ? this._.output.push(" /\x3e") : this._.output.push("\x3e");
				},
				attribute: function (a, d) {
					"string" == typeof d && (d = CKEDITOR.tools.htmlEncodeAttr(d));
					this._.output.push(" ", a, '\x3d"', d, '"');
				},
				closeTag: function (a) {
					this._.output.push("\x3c/", a, "\x3e");
				},
				text: function (a) {
					this._.output.push(a);
				},
				comment: function (a) {
					this._.output.push("\x3c!--", a, "--\x3e");
				},
				write: function (a) {
					this._.output.push(a);
				},
				reset: function () {
					this._.output = [];
					this._.indent = !1;
				},
				getHtml: function (a) {
					var d = this._.output.join("");
					a && this.reset();
					return d;
				},
			},
		})),
		"use strict",
		(function () {
			CKEDITOR.htmlParser.node = function () {};
			CKEDITOR.htmlParser.node.prototype = {
				remove: function () {
					var a = this.parent.children,
						d = CKEDITOR.tools.indexOf(a, this),
						b = this.previous,
						c = this.next;
					b && (b.next = c);
					c && (c.previous = b);
					a.splice(d, 1);
					this.parent = null;
				},
				replaceWith: function (a) {
					var d = this.parent.children,
						b = CKEDITOR.tools.indexOf(d, this),
						c = (a.previous = this.previous),
						g = (a.next = this.next);
					c && (c.next = a);
					g && (g.previous = a);
					d[b] = a;
					a.parent = this.parent;
					this.parent = null;
				},
				insertAfter: function (a) {
					var d = a.parent.children,
						b = CKEDITOR.tools.indexOf(d, a),
						c = a.next;
					d.splice(b + 1, 0, this);
					this.next = a.next;
					this.previous = a;
					a.next = this;
					c && (c.previous = this);
					this.parent = a.parent;
				},
				insertBefore: function (a) {
					var d = a.parent.children,
						b = CKEDITOR.tools.indexOf(d, a);
					d.splice(b, 0, this);
					this.next = a;
					(this.previous = a.previous) && (a.previous.next = this);
					a.previous = this;
					this.parent = a.parent;
				},
				getAscendant: function (a) {
					var d =
							"function" == typeof a
								? a
								: "string" == typeof a
								? function (b) {
										return b.name == a;
								  }
								: function (b) {
										return b.name in a;
								  },
						b = this.parent;
					for (; b && b.type == CKEDITOR.NODE_ELEMENT; ) {
						if (d(b)) return b;
						b = b.parent;
					}
					return null;
				},
				wrapWith: function (a) {
					this.replaceWith(a);
					a.add(this);
					return a;
				},
				getIndex: function () {
					return CKEDITOR.tools.indexOf(this.parent.children, this);
				},
				getFilterContext: function (a) {
					return a || {};
				},
			};
		})(),
		"use strict",
		(CKEDITOR.htmlParser.comment = function (a) {
			this.value = a;
			this._ = { isBlockLike: !1 };
		}),
		(CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(
			new CKEDITOR.htmlParser.node(),
			{
				type: CKEDITOR.NODE_COMMENT,
				filter: function (a, d) {
					var b = this.value;
					if (!(b = a.onComment(d, b, this))) return this.remove(), !1;
					if ("string" != typeof b) return this.replaceWith(b), !1;
					this.value = b;
					return !0;
				},
				writeHtml: function (a, d) {
					d && this.filter(d);
					a.comment(this.value);
				},
			}
		)),
		"use strict",
		(function () {
			CKEDITOR.htmlParser.text = function (a) {
				this.value = a;
				this._ = { isBlockLike: !1 };
			};
			CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(
				new CKEDITOR.htmlParser.node(),
				{
					type: CKEDITOR.NODE_TEXT,
					filter: function (a, d) {
						if (!(this.value = a.onText(d, this.value, this)))
							return this.remove(), !1;
					},
					writeHtml: function (a, d) {
						d && this.filter(d);
						a.text(this.value);
					},
				}
			);
		})(),
		"use strict",
		(function () {
			CKEDITOR.htmlParser.cdata = function (a) {
				this.value = a;
			};
			CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(
				new CKEDITOR.htmlParser.node(),
				{
					type: CKEDITOR.NODE_TEXT,
					filter: function () {},
					writeHtml: function (a) {
						a.write(this.value);
					},
				}
			);
		})(),
		"use strict",
		(CKEDITOR.htmlParser.fragment = function () {
			this.children = [];
			this.parent = null;
			this._ = { isBlockLike: !0, hasInlineStarted: !1 };
		}),
		(function () {
			function a(a) {
				return a.attributes["data-cke-survive"]
					? !1
					: ("a" == a.name && a.attributes.href) ||
							CKEDITOR.dtd.$removeEmpty[a.name];
			}
			var d = CKEDITOR.tools.extend(
					{ table: 1, ul: 1, ol: 1, dl: 1 },
					CKEDITOR.dtd.table,
					CKEDITOR.dtd.ul,
					CKEDITOR.dtd.ol,
					CKEDITOR.dtd.dl
				),
				b = { ol: 1, ul: 1 },
				c = CKEDITOR.tools.extend(
					{},
					{ html: 1 },
					CKEDITOR.dtd.html,
					CKEDITOR.dtd.body,
					CKEDITOR.dtd.head,
					{ style: 1, script: 1 }
				),
				g = {
					ul: "li",
					ol: "li",
					dl: "dd",
					table: "tbody",
					tbody: "tr",
					thead: "tr",
					tfoot: "tr",
					tr: "td",
				};
			CKEDITOR.htmlParser.fragment.fromHtml = function (l, k, h) {
				function e(a) {
					var b;
					if (0 < u.length)
						for (var c = 0; c < u.length; c++) {
							var f = u[c],
								e = f.name,
								g = CKEDITOR.dtd[e],
								h = q.name && CKEDITOR.dtd[q.name];
							(h && !h[e]) || (a && g && !g[a] && CKEDITOR.dtd[a])
								? e == q.name && (n(q, q.parent, 1), c--)
								: (b || (m(), (b = 1)),
								  (f = f.clone()),
								  (f.parent = q),
								  (q = f),
								  u.splice(c, 1),
								  c--);
						}
				}
				function m() {
					for (; w.length; ) n(w.shift(), q);
				}
				function f(a) {
					if (a._.isBlockLike && "pre" != a.name && "textarea" != a.name) {
						var b = a.children.length,
							c = a.children[b - 1],
							f;
						c &&
							c.type == CKEDITOR.NODE_TEXT &&
							((f = CKEDITOR.tools.rtrim(c.value))
								? (c.value = f)
								: (a.children.length = b - 1));
					}
				}
				function n(b, c, e) {
					c = c || q || p;
					var g = q;
					void 0 === b.previous &&
						(r(c, b) && ((q = c), v.onTagOpen(h, {}), (b.returnPoint = c = q)),
						f(b),
						(a(b) && !b.children.length) || c.add(b),
						"pre" == b.name && (t = !1),
						"textarea" == b.name && (z = !1));
					b.returnPoint
						? ((q = b.returnPoint), delete b.returnPoint)
						: (q = e ? c : g);
				}
				function r(a, b) {
					if (
						(a == p || "body" == a.name) &&
						h &&
						(!a.name || CKEDITOR.dtd[a.name][h])
					) {
						var c, f;
						return (
							((c =
								b.attributes && (f = b.attributes["data-cke-real-element-type"])
									? f
									: b.name) &&
								c in CKEDITOR.dtd.$inline &&
								!(c in CKEDITOR.dtd.head) &&
								!b.isOrphan) ||
							b.type == CKEDITOR.NODE_TEXT
						);
					}
				}
				function x(a, b) {
					return a in CKEDITOR.dtd.$listItem || a in CKEDITOR.dtd.$tableContent
						? a == b || ("dt" == a && "dd" == b) || ("dd" == a && "dt" == b)
						: !1;
				}
				var v = new CKEDITOR.htmlParser(),
					p =
						k instanceof CKEDITOR.htmlParser.element
							? k
							: "string" == typeof k
							? new CKEDITOR.htmlParser.element(k)
							: new CKEDITOR.htmlParser.fragment(),
					u = [],
					w = [],
					q = p,
					z = "textarea" == p.name,
					t = "pre" == p.name;
				v.onTagOpen = function (f, g, h, l) {
					g = new CKEDITOR.htmlParser.element(f, g);
					g.isUnknown && h && (g.isEmpty = !0);
					g.isOptionalClose = l;
					if (a(g)) u.push(g);
					else {
						if ("pre" == f) t = !0;
						else {
							if ("br" == f && t) {
								q.add(new CKEDITOR.htmlParser.text("\n"));
								return;
							}
							"textarea" == f && (z = !0);
						}
						if ("br" == f) w.push(g);
						else {
							for (
								;
								!((l = (h = q.name)
									? CKEDITOR.dtd[h] ||
									  (q._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span)
									: c),
								g.isUnknown || q.isUnknown || l[f]);

							)
								if (q.isOptionalClose) v.onTagClose(h);
								else if (f in b && h in b)
									(h = q.children),
										((h = h[h.length - 1]) && "li" == h.name) ||
											n((h = new CKEDITOR.htmlParser.element("li")), q),
										!g.returnPoint && (g.returnPoint = q),
										(q = h);
								else if (f in CKEDITOR.dtd.$listItem && !x(f, h))
									v.onTagOpen("li" == f ? "ul" : "dl", {}, 0, 1);
								else if (h in d && !x(f, h))
									!g.returnPoint && (g.returnPoint = q), (q = q.parent);
								else if ((h in CKEDITOR.dtd.$inline && u.unshift(q), q.parent))
									n(q, q.parent, 1);
								else {
									g.isOrphan = 1;
									break;
								}
							e(f);
							m();
							g.parent = q;
							g.isEmpty ? n(g) : (q = g);
						}
					}
				};
				v.onTagClose = function (a) {
					for (var b = u.length - 1; 0 <= b; b--)
						if (a == u[b].name) {
							u.splice(b, 1);
							return;
						}
					for (var c = [], f = [], e = q; e != p && e.name != a; )
						e._.isBlockLike || f.unshift(e),
							c.push(e),
							(e = e.returnPoint || e.parent);
					if (e != p) {
						for (b = 0; b < c.length; b++) {
							var g = c[b];
							n(g, g.parent);
						}
						q = e;
						e._.isBlockLike && m();
						n(e, e.parent);
						e == q && (q = q.parent);
						u = u.concat(f);
					}
					"body" == a && (h = !1);
				};
				v.onText = function (a) {
					if (
						!((q._.hasInlineStarted && !w.length) || t || z) &&
						((a = CKEDITOR.tools.ltrim(a)), 0 === a.length)
					)
						return;
					var b = q.name,
						f = b
							? CKEDITOR.dtd[b] ||
							  (q._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span)
							: c;
					if (!z && !f["#"] && b in d) v.onTagOpen(g[b] || ""), v.onText(a);
					else {
						m();
						e();
						t || z || (a = a.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " "));
						a = new CKEDITOR.htmlParser.text(a);
						if (r(q, a)) this.onTagOpen(h, {}, 0, 1);
						q.add(a);
					}
				};
				v.onCDATA = function (a) {
					q.add(new CKEDITOR.htmlParser.cdata(a));
				};
				v.onComment = function (a) {
					m();
					e();
					q.add(new CKEDITOR.htmlParser.comment(a));
				};
				v.parse(l);
				for (m(); q != p; ) n(q, q.parent, 1);
				f(p);
				return p;
			};
			CKEDITOR.htmlParser.fragment.prototype = {
				type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
				add: function (a, b) {
					isNaN(b) && (b = this.children.length);
					var c = 0 < b ? this.children[b - 1] : null;
					if (c) {
						if (
							a._.isBlockLike &&
							c.type == CKEDITOR.NODE_TEXT &&
							((c.value = CKEDITOR.tools.rtrim(c.value)), 0 === c.value.length)
						) {
							this.children.pop();
							this.add(a);
							return;
						}
						c.next = a;
					}
					a.previous = c;
					a.parent = this;
					this.children.splice(b, 0, a);
					this._.hasInlineStarted ||
						(this._.hasInlineStarted =
							a.type == CKEDITOR.NODE_TEXT ||
							(a.type == CKEDITOR.NODE_ELEMENT && !a._.isBlockLike));
				},
				filter: function (a, b) {
					b = this.getFilterContext(b);
					a.onRoot(b, this);
					this.filterChildren(a, !1, b);
				},
				filterChildren: function (a, b, c) {
					if (this.childrenFilteredBy != a.id) {
						c = this.getFilterContext(c);
						if (b && !this.parent) a.onRoot(c, this);
						this.childrenFilteredBy = a.id;
						for (b = 0; b < this.children.length; b++)
							!1 === this.children[b].filter(a, c) && b--;
					}
				},
				writeHtml: function (a, b) {
					b && this.filter(b);
					this.writeChildrenHtml(a);
				},
				writeChildrenHtml: function (a, b, c) {
					var e = this.getFilterContext();
					if (c && !this.parent && b) b.onRoot(e, this);
					b && this.filterChildren(b, !1, e);
					b = 0;
					c = this.children;
					for (e = c.length; b < e; b++) c[b].writeHtml(a);
				},
				forEach: function (a, b, c) {
					if (!(c || (b && this.type != b))) var e = a(this);
					if (!1 !== e) {
						c = this.children;
						for (var g = 0; g < c.length; g++)
							(e = c[g]),
								e.type == CKEDITOR.NODE_ELEMENT
									? e.forEach(a, b)
									: (b && e.type != b) || a(e);
					}
				},
				getFilterContext: function (a) {
					return a || {};
				},
			};
		})(),
		"use strict",
		(function () {
			function a() {
				this.rules = [];
			}
			function d(b, c, g, d) {
				var k, h;
				for (k in c) (h = b[k]) || (h = b[k] = new a()), h.add(c[k], g, d);
			}
			CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({
				$: function (b) {
					this.id = CKEDITOR.tools.getNextNumber();
					this.elementNameRules = new a();
					this.attributeNameRules = new a();
					this.elementsRules = {};
					this.attributesRules = {};
					this.textRules = new a();
					this.commentRules = new a();
					this.rootRules = new a();
					b && this.addRules(b, 10);
				},
				proto: {
					addRules: function (a, c) {
						var g;
						"number" == typeof c
							? (g = c)
							: c && "priority" in c && (g = c.priority);
						"number" != typeof g && (g = 10);
						"object" != typeof c && (c = {});
						a.elementNames &&
							this.elementNameRules.addMany(a.elementNames, g, c);
						a.attributeNames &&
							this.attributeNameRules.addMany(a.attributeNames, g, c);
						a.elements && d(this.elementsRules, a.elements, g, c);
						a.attributes && d(this.attributesRules, a.attributes, g, c);
						a.text && this.textRules.add(a.text, g, c);
						a.comment && this.commentRules.add(a.comment, g, c);
						a.root && this.rootRules.add(a.root, g, c);
					},
					applyTo: function (a) {
						a.filter(this);
					},
					onElementName: function (a, c) {
						return this.elementNameRules.execOnName(a, c);
					},
					onAttributeName: function (a, c) {
						return this.attributeNameRules.execOnName(a, c);
					},
					onText: function (a, c, g) {
						return this.textRules.exec(a, c, g);
					},
					onComment: function (a, c, g) {
						return this.commentRules.exec(a, c, g);
					},
					onRoot: function (a, c) {
						return this.rootRules.exec(a, c);
					},
					onElement: function (a, c) {
						for (
							var g = [
									this.elementsRules["^"],
									this.elementsRules[c.name],
									this.elementsRules.$,
								],
								d,
								k = 0;
							3 > k;
							k++
						)
							if ((d = g[k])) {
								d = d.exec(a, c, this);
								if (!1 === d) return null;
								if (d && d != c) return this.onNode(a, d);
								if (c.parent && !c.name) break;
							}
						return c;
					},
					onNode: function (a, c) {
						var g = c.type;
						return g == CKEDITOR.NODE_ELEMENT
							? this.onElement(a, c)
							: g == CKEDITOR.NODE_TEXT
							? new CKEDITOR.htmlParser.text(this.onText(a, c.value))
							: g == CKEDITOR.NODE_COMMENT
							? new CKEDITOR.htmlParser.comment(this.onComment(a, c.value))
							: null;
					},
					onAttribute: function (a, c, g, d) {
						return (g = this.attributesRules[g]) ? g.exec(a, d, c, this) : d;
					},
				},
			});
			CKEDITOR.htmlParser.filterRulesGroup = a;
			a.prototype = {
				add: function (a, c, g) {
					this.rules.splice(this.findIndex(c), 0, {
						value: a,
						priority: c,
						options: g,
					});
				},
				addMany: function (a, c, g) {
					for (var d = [this.findIndex(c), 0], k = 0, h = a.length; k < h; k++)
						d.push({ value: a[k], priority: c, options: g });
					this.rules.splice.apply(this.rules, d);
				},
				findIndex: function (a) {
					for (
						var c = this.rules, g = c.length - 1;
						0 <= g && a < c[g].priority;

					)
						g--;
					return g + 1;
				},
				exec: function (a, c) {
					var g =
							c instanceof CKEDITOR.htmlParser.node ||
							c instanceof CKEDITOR.htmlParser.fragment,
						d = Array.prototype.slice.call(arguments, 1),
						k = this.rules,
						h = k.length,
						e,
						m,
						f,
						n;
					for (n = 0; n < h; n++)
						if (
							(g && ((e = c.type), (m = c.name)),
							(f = k[n]),
							!(
								(a.nonEditable && !f.options.applyToAll) ||
								(a.nestedEditable && f.options.excludeNestedEditable)
							))
						) {
							f = f.value.apply(null, d);
							if (!1 === f || (g && f && (f.name != m || f.type != e)))
								return f;
							null != f && (d[0] = c = f);
						}
					return c;
				},
				execOnName: function (a, c) {
					for (var g = 0, d = this.rules, k = d.length, h; c && g < k; g++)
						(h = d[g]),
							(a.nonEditable && !h.options.applyToAll) ||
								(a.nestedEditable && h.options.excludeNestedEditable) ||
								(c = c.replace(h.value[0], h.value[1]));
					return c;
				},
			};
		})(),
		(function () {
			function a(a, f) {
				function e(a) {
					return a || CKEDITOR.env.needsNbspFiller
						? new CKEDITOR.htmlParser.text(" ")
						: new CKEDITOR.htmlParser.element("br", { "data-cke-bogus": 1 });
				}
				function h(a, f) {
					return function (g) {
						if (g.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
							var h = [],
								m = b(g),
								k,
								t;
							if (m)
								for (d(m, 1) && h.push(m); m; )
									l(m) &&
										(k = c(m)) &&
										d(k) &&
										((t = c(k)) && !l(t)
											? h.push(k)
											: (e(n).insertAfter(k), k.remove())),
										(m = m.previous);
							for (m = 0; m < h.length; m++) h[m].remove();
							if ((h = !a || !1 !== ("function" == typeof f ? f(g) : f)))
								n ||
								CKEDITOR.env.needsBrFiller ||
								g.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT
									? n ||
									  CKEDITOR.env.needsBrFiller ||
									  !(
											7 < document.documentMode ||
											g.name in CKEDITOR.dtd.tr ||
											g.name in CKEDITOR.dtd.$listItem
									  )
										? ((h = b(g)),
										  (h = !h || ("form" == g.name && "input" == h.name)))
										: (h = !1)
									: (h = !1);
							h && g.add(e(a));
						}
					};
				}
				function d(a, b) {
					if (
						(!n || CKEDITOR.env.needsBrFiller) &&
						a.type == CKEDITOR.NODE_ELEMENT &&
						"br" == a.name &&
						!a.attributes["data-cke-eol"]
					)
						return !0;
					var c;
					return a.type == CKEDITOR.NODE_TEXT &&
						(c = a.value.match(q)) &&
						(c.index &&
							(new CKEDITOR.htmlParser.text(
								a.value.substring(0, c.index)
							).insertBefore(a),
							(a.value = c[0])),
						(!CKEDITOR.env.needsBrFiller && n && (!b || a.parent.name in D)) ||
							(!n && (((c = a.previous) && "br" == c.name) || !c || l(c))))
						? !0
						: !1;
				}
				var m = { elements: {} },
					n = "html" == f,
					D = CKEDITOR.tools.extend({}, C),
					I;
				for (I in D) "#" in t[I] || delete D[I];
				for (I in D) m.elements[I] = h(n, a.config.fillEmptyBlocks);
				m.root = h(n, !1);
				m.elements.br = (function (a) {
					return function (b) {
						if (b.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
							var f = b.attributes;
							if ("data-cke-bogus" in f || "data-cke-eol" in f)
								delete f["data-cke-bogus"];
							else {
								for (f = b.next; f && g(f); ) f = f.next;
								var h = c(b);
								!f && l(b.parent)
									? k(b.parent, e(a))
									: l(f) && h && !l(h) && e(a).insertBefore(f);
							}
						}
					};
				})(n);
				return m;
			}
			function d(a, b) {
				return a != CKEDITOR.ENTER_BR && !1 !== b
					? a == CKEDITOR.ENTER_DIV
						? "div"
						: "p"
					: !1;
			}
			function b(a) {
				for (a = a.children[a.children.length - 1]; a && g(a); ) a = a.previous;
				return a;
			}
			function c(a) {
				for (a = a.previous; a && g(a); ) a = a.previous;
				return a;
			}
			function g(a) {
				return (
					(a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value)) ||
					(a.type == CKEDITOR.NODE_ELEMENT && a.attributes["data-cke-bookmark"])
				);
			}
			function l(a) {
				return (
					a &&
					((a.type == CKEDITOR.NODE_ELEMENT && a.name in C) ||
						a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)
				);
			}
			function k(a, b) {
				var c = a.children[a.children.length - 1];
				a.children.push(b);
				b.parent = a;
				c && ((c.next = b), (b.previous = c));
			}
			function h(a) {
				a = a.attributes;
				"false" != a.contenteditable &&
					(a["data-cke-editable"] = a.contenteditable ? "true" : 1);
				a.contenteditable = "false";
			}
			function e(a) {
				a = a.attributes;
				switch (a["data-cke-editable"]) {
					case "true":
						a.contenteditable = "true";
						break;
					case "1":
						delete a.contenteditable;
				}
			}
			function m(a) {
				return a.replace(J, function (a, b, c) {
					return (
						"\x3c" +
						b +
						c.replace(E, function (a, b) {
							return F.test(b) && -1 == c.indexOf("data-cke-saved-" + b)
								? " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a
								: a;
						}) +
						"\x3e"
					);
				});
			}
			function f(a, b) {
				return a.replace(b, function (a, b, c) {
					0 === a.indexOf("\x3ctextarea") &&
						(a =
							b +
							p(c).replace(/</g, "\x26lt;").replace(/>/g, "\x26gt;") +
							"\x3c/textarea\x3e");
					return (
						"\x3ccke:encoded\x3e" +
						encodeURIComponent(a) +
						"\x3c/cke:encoded\x3e"
					);
				});
			}
			function n(a) {
				return a.replace(D, function (a, b) {
					return decodeURIComponent(b);
				});
			}
			function r(a) {
				return a.replace(
					/\x3c!--(?!{cke_protected})[\s\S]+?--\x3e/g,
					function (a) {
						return (
							"\x3c!--" +
							z +
							"{C}" +
							encodeURIComponent(a).replace(/--/g, "%2D%2D") +
							"--\x3e"
						);
					}
				);
			}
			function x(a) {
				return CKEDITOR.tools.array.reduce(
					a.split(""),
					function (a, b) {
						var c = b.toLowerCase(),
							f = b.toUpperCase(),
							e = v(c);
						c !== f && (e += "|" + v(f));
						return a + ("(" + e + ")");
					},
					""
				);
			}
			function v(a) {
				var b;
				b = a.charCodeAt(0);
				var c = b.toString(16);
				b = {
					htmlCode: "\x26#" + b + ";?",
					hex: "\x26#x0*" + c + ";?",
					entity: { "\x3c": "\x26lt;", "\x3e": "\x26gt;", ":": "\x26colon;" }[
						a
					],
				};
				for (var f in b) b[f] && (a += "|" + b[f]);
				return a;
			}
			function p(a) {
				return a.replace(
					/\x3c!--\{cke_protected\}\{C\}([\s\S]+?)--\x3e/g,
					function (a, b) {
						return decodeURIComponent(b);
					}
				);
			}
			function u(a, b) {
				var c = b._.dataStore;
				return a
					.replace(
						/\x3c!--\{cke_protected\}([\s\S]+?)--\x3e/g,
						function (a, b) {
							return decodeURIComponent(b);
						}
					)
					.replace(/\{cke_protected_(\d+)\}/g, function (a, b) {
						return (c && c[b]) || "";
					});
			}
			function w(a, b) {
				var c = [],
					f = b.config.protectedSource,
					e = b._.dataStore || (b._.dataStore = { id: 1 }),
					g = /<\!--\{cke_temp(comment)?\}(\d*?)--\x3e/g,
					f = [
						/<script[\s\S]*?(<\/script>|$)/gi,
						/<noscript[\s\S]*?<\/noscript>/gi,
						/<meta[\s\S]*?\/?>/gi,
					].concat(f);
				a = a.replace(/\x3c!--[\s\S]*?--\x3e/g, function (a) {
					return "\x3c!--{cke_tempcomment}" + (c.push(a) - 1) + "--\x3e";
				});
				for (var h = 0; h < f.length; h++)
					a = a.replace(f[h], function (a) {
						a = a.replace(g, function (a, b, f) {
							return c[f];
						});
						return /cke_temp(comment)?/.test(a)
							? a
							: "\x3c!--{cke_temp}" + (c.push(a) - 1) + "--\x3e";
					});
				a = a.replace(g, function (a, b, f) {
					return (
						"\x3c!--" +
						z +
						(b ? "{C}" : "") +
						encodeURIComponent(c[f]).replace(/--/g, "%2D%2D") +
						"--\x3e"
					);
				});
				a = a.replace(
					/<\w+(?:\s+(?:(?:[^\s=>]+\s*=\s*(?:[^'"\s>]+|'[^']*'|"[^"]*"))|[^\s=\/>]+))+\s*\/?>/g,
					function (a) {
						return a.replace(
							/\x3c!--\{cke_protected\}([^>]*)--\x3e/g,
							function (a, b) {
								e[e.id] = decodeURIComponent(b);
								return "{cke_protected_" + e.id++ + "}";
							}
						);
					}
				);
				return (a = a.replace(
					/<(title|iframe|textarea)([^>]*)>([\s\S]*?)<\/\1>/g,
					function (a, c, f, e) {
						return "\x3c" + c + f + "\x3e" + u(p(e), b) + "\x3c/" + c + "\x3e";
					}
				));
			}
			CKEDITOR.htmlDataProcessor = function (b) {
				var c,
					e,
					g = this;
				this.editor = b;
				this.dataFilter = c = new CKEDITOR.htmlParser.filter();
				this.htmlFilter = e = new CKEDITOR.htmlParser.filter();
				this.writer = new CKEDITOR.htmlParser.basicWriter();
				c.addRules(B);
				c.addRules(A, { applyToAll: !0 });
				c.addRules(a(b, "data"), { applyToAll: !0 });
				e.addRules(H);
				e.addRules(G, { applyToAll: !0 });
				e.addRules(a(b, "html"), { applyToAll: !0 });
				b.on(
					"toHtml",
					function (a) {
						a = a.data;
						var c = a.dataValue,
							e,
							c = c.replace(Q, ""),
							c = w(c, b),
							c = f(c, I),
							c = m(c),
							c = f(c, L),
							c = c.replace(T, "$1cke:$2"),
							c = c.replace(K, "\x3ccke:$1$2\x3e\x3c/cke:$1\x3e"),
							c = c.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2"),
							c = c.replace(
								/([^a-z0-9<\-])(on\w{3,})(?!>)/gi,
								"$1data-cke-" + CKEDITOR.rnd + "-$2"
							);
						e = a.context || b.editable().getName();
						var g;
						CKEDITOR.env.ie &&
							9 > CKEDITOR.env.version &&
							"pre" == e &&
							((e = "div"), (c = "\x3cpre\x3e" + c + "\x3c/pre\x3e"), (g = 1));
						e = b.document.createElement(e);
						e.setHtml("a" + c);
						c = e.getHtml().substr(1);
						c = c.replace(
							new RegExp("data-cke-" + CKEDITOR.rnd + "-", "ig"),
							""
						);
						g && (c = c.replace(/^<pre>|<\/pre>$/gi, ""));
						c = c.replace(R, "$1$2");
						c = n(c);
						c = p(c);
						e =
							!1 === a.fixForBody ? !1 : d(a.enterMode, b.config.autoParagraph);
						c = CKEDITOR.htmlParser.fragment.fromHtml(c, a.context, e);
						e &&
							((g = c),
							!g.children.length &&
								CKEDITOR.dtd[g.name][e] &&
								((e = new CKEDITOR.htmlParser.element(e)), g.add(e)));
						a.dataValue = c;
					},
					null,
					null,
					5
				);
				b.on(
					"toHtml",
					function (a) {
						a.data.filter.applyTo(
							a.data.dataValue,
							!0,
							a.data.dontFilter,
							a.data.enterMode
						) && b.fire("dataFiltered");
					},
					null,
					null,
					6
				);
				b.on(
					"toHtml",
					function (a) {
						a.data.dataValue.filterChildren(g.dataFilter, !0);
					},
					null,
					null,
					10
				);
				b.on(
					"toHtml",
					function (a) {
						a = a.data;
						var b = a.dataValue,
							c = new CKEDITOR.htmlParser.basicWriter();
						b.writeChildrenHtml(c);
						b = c.getHtml(!0);
						a.dataValue = r(b);
					},
					null,
					null,
					15
				);
				b.on(
					"toDataFormat",
					function (a) {
						var c = a.data.dataValue;
						a.data.enterMode != CKEDITOR.ENTER_BR &&
							(c = c.replace(/^<br *\/?>/i, ""));
						a.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(
							c,
							a.data.context,
							d(a.data.enterMode, b.config.autoParagraph)
						);
					},
					null,
					null,
					5
				);
				b.on(
					"toDataFormat",
					function (a) {
						a.data.dataValue.filterChildren(g.htmlFilter, !0);
					},
					null,
					null,
					10
				);
				b.on(
					"toDataFormat",
					function (a) {
						a.data.filter.applyTo(a.data.dataValue, !1, !0);
					},
					null,
					null,
					11
				);
				b.on(
					"toDataFormat",
					function (a) {
						var c = a.data.dataValue,
							f = g.writer;
						f.reset();
						c.writeChildrenHtml(f);
						c = f.getHtml(!0);
						c = p(c);
						c = u(c, b);
						a.data.dataValue = c;
					},
					null,
					null,
					15
				);
			};
			CKEDITOR.htmlDataProcessor.prototype = {
				toHtml: function (a, b, c, f) {
					var e = this.editor,
						g,
						h,
						d,
						m;
					b && "object" == typeof b
						? ((g = b.context),
						  (c = b.fixForBody),
						  (f = b.dontFilter),
						  (h = b.filter),
						  (d = b.enterMode),
						  (m = b.protectedWhitespaces))
						: (g = b);
					g || null === g || (g = e.editable().getName());
					return e.fire("toHtml", {
						dataValue: a,
						context: g,
						fixForBody: c,
						dontFilter: f,
						filter: h || e.filter,
						enterMode: d || e.enterMode,
						protectedWhitespaces: m,
					}).dataValue;
				},
				toDataFormat: function (a, b) {
					var c, f, e;
					b && ((c = b.context), (f = b.filter), (e = b.enterMode));
					c || null === c || (c = this.editor.editable().getName());
					return this.editor.fire("toDataFormat", {
						dataValue: a,
						filter: f || this.editor.filter,
						context: c,
						enterMode: e || this.editor.enterMode,
					}).dataValue;
				},
			};
			var q = /(?:&nbsp;|\xa0)$/,
				z = "{cke_protected}",
				t = CKEDITOR.dtd,
				y = "caption colgroup col thead tfoot tbody".split(" "),
				C = CKEDITOR.tools.extend({}, t.$blockLimit, t.$block),
				B = { elements: { input: h, textarea: h } },
				A = {
					attributeNames: [
						[/^on/, "data-cke-pa-on"],
						[/^srcdoc/, "data-cke-pa-srcdoc"],
						[/^data-cke-expando$/, ""],
					],
					elements: {
						iframe: function (a) {
							if (a.attributes && a.attributes.src) {
								var b = a.attributes.src.toLowerCase().replace(/[^a-z]/gi, "");
								if (0 === b.indexOf("javascript") || 0 === b.indexOf("data"))
									(a.attributes["data-cke-pa-src"] = a.attributes.src),
										delete a.attributes.src;
							}
						},
					},
				},
				H = {
					elements: {
						embed: function (a) {
							var b = a.parent;
							if (b && "object" == b.name) {
								var c = b.attributes.width,
									b = b.attributes.height;
								c && (a.attributes.width = c);
								b && (a.attributes.height = b);
							}
						},
						a: function (a) {
							var b = a.attributes;
							if (
								!(
									a.children.length ||
									b.name ||
									b.id ||
									a.attributes["data-cke-saved-name"]
								)
							)
								return !1;
						},
					},
				},
				G = {
					elementNames: [
						[/^cke:/, ""],
						[/^\?xml:namespace$/, ""],
					],
					attributeNames: [
						[/^data-cke-(saved|pa)-/, ""],
						[/^data-cke-.*/, ""],
						["hidefocus", ""],
					],
					elements: {
						$: function (a) {
							var b = a.attributes;
							if (b) {
								if (b["data-cke-temp"]) return !1;
								for (
									var c = ["name", "href", "src"], f, e = 0;
									e < c.length;
									e++
								)
									(f = "data-cke-saved-" + c[e]), f in b && delete b[c[e]];
							}
							return a;
						},
						table: function (a) {
							a.children.slice(0).sort(function (a, b) {
								var c, f;
								a.type == CKEDITOR.NODE_ELEMENT &&
									b.type == a.type &&
									((c = CKEDITOR.tools.indexOf(y, a.name)),
									(f = CKEDITOR.tools.indexOf(y, b.name)));
								(-1 < c && -1 < f && c != f) ||
									((c = a.parent ? a.getIndex() : -1),
									(f = b.parent ? b.getIndex() : -1));
								return c > f ? 1 : -1;
							});
						},
						param: function (a) {
							a.children = [];
							a.isEmpty = !0;
							return a;
						},
						span: function (a) {
							"Apple-style-span" == a.attributes["class"] && delete a.name;
						},
						html: function (a) {
							delete a.attributes.contenteditable;
							delete a.attributes["class"];
						},
						body: function (a) {
							delete a.attributes.spellcheck;
							delete a.attributes.contenteditable;
						},
						style: function (a) {
							var b = a.children[0];
							b && b.value && (b.value = CKEDITOR.tools.trim(b.value));
							a.attributes.type || (a.attributes.type = "text/css");
						},
						title: function (a) {
							var b = a.children[0];
							!b && k(a, (b = new CKEDITOR.htmlParser.text()));
							b.value = a.attributes["data-cke-title"] || "";
						},
						input: e,
						textarea: e,
					},
					attributes: {
						class: function (a) {
							return (
								CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) ||
								!1
							);
						},
					},
				};
			CKEDITOR.env.ie &&
				(G.attributes.style = function (a) {
					return a.replace(/(^|;)([^\:]+)/g, function (a) {
						return a.toLowerCase();
					});
				});
			var J = /<(a|area|img|input|source)\b([^>]*)>/gi,
				E = /([\w-:]+)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi,
				F = /^(href|src|name)$/i,
				L = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi,
				I = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi,
				D = /<cke:encoded>([^<]*)<\/cke:encoded>/gi,
				Q = new RegExp(
					"(" +
						x("\x3ccke:encoded\x3e") +
						"(.*?)" +
						x("\x3c/cke:encoded\x3e") +
						")|(" +
						x("\x3c") +
						x("/") +
						"?" +
						x("cke:encoded\x3e") +
						")",
					"gi"
				),
				T = /(<\/?)((?:object|embed|param|html|body|head|title)([\s][^>]*)?>)/gi,
				R = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi,
				K = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi;
		})(),
		"use strict",
		(CKEDITOR.htmlParser.element = function (a, d) {
			this.name = a;
			this.attributes = d || {};
			this.children = [];
			var b = a || "",
				c = b.match(/^cke:(.*)/);
			c && (b = c[1]);
			b = !!(
				CKEDITOR.dtd.$nonBodyContent[b] ||
				CKEDITOR.dtd.$block[b] ||
				CKEDITOR.dtd.$listItem[b] ||
				CKEDITOR.dtd.$tableContent[b] ||
				CKEDITOR.dtd.$nonEditable[b] ||
				"br" == b
			);
			this.isEmpty = !!CKEDITOR.dtd.$empty[a];
			this.isUnknown = !CKEDITOR.dtd[a];
			this._ = { isBlockLike: b, hasInlineStarted: this.isEmpty || !b };
		}),
		(CKEDITOR.htmlParser.cssStyle = function (a) {
			var d = {};
			(
				(a instanceof CKEDITOR.htmlParser.element ? a.attributes.style : a) ||
				""
			)
				.replace(/&quot;/g, '"')
				.replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function (a, c, g) {
					"font-family" == c && (g = g.replace(/["']/g, ""));
					d[c.toLowerCase()] = g;
				});
			return {
				rules: d,
				populate: function (a) {
					var c = this.toString();
					c &&
						(a instanceof CKEDITOR.dom.element
							? a.setAttribute("style", c)
							: a instanceof CKEDITOR.htmlParser.element
							? (a.attributes.style = c)
							: (a.style = c));
				},
				toString: function () {
					var a = [],
						c;
					for (c in d) d[c] && a.push(c, ":", d[c], ";");
					return a.join("");
				},
			};
		}),
		(function () {
			function a(a) {
				return function (b) {
					return (
						b.type == CKEDITOR.NODE_ELEMENT &&
						("string" == typeof a ? b.name == a : b.name in a)
					);
				};
			}
			var d = function (a, b) {
					a = a[0];
					b = b[0];
					return a < b ? -1 : a > b ? 1 : 0;
				},
				b = CKEDITOR.htmlParser.fragment.prototype;
			CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend(
				new CKEDITOR.htmlParser.node(),
				{
					type: CKEDITOR.NODE_ELEMENT,
					add: b.add,
					clone: function () {
						return new CKEDITOR.htmlParser.element(this.name, this.attributes);
					},
					filter: function (a, b) {
						var d = this,
							k,
							h;
						b = d.getFilterContext(b);
						if (!d.parent) a.onRoot(b, d);
						for (;;) {
							k = d.name;
							if (!(h = a.onElementName(b, k))) return this.remove(), !1;
							d.name = h;
							if (!(d = a.onElement(b, d))) return this.remove(), !1;
							if (d !== this) return this.replaceWith(d), !1;
							if (d.name == k) break;
							if (d.type != CKEDITOR.NODE_ELEMENT)
								return this.replaceWith(d), !1;
							if (!d.name) return this.replaceWithChildren(), !1;
						}
						k = d.attributes;
						var e, m;
						for (e in k) {
							for (h = k[e]; ; )
								if ((m = a.onAttributeName(b, e)))
									if (m != e) delete k[e], (e = m);
									else break;
								else {
									delete k[e];
									break;
								}
							m &&
								(!1 === (h = a.onAttribute(b, d, m, h))
									? delete k[m]
									: (k[m] = h));
						}
						d.isEmpty || this.filterChildren(a, !1, b);
						return !0;
					},
					filterChildren: b.filterChildren,
					writeHtml: function (a, b) {
						b && this.filter(b);
						var l = this.name,
							k = [],
							h = this.attributes,
							e,
							m;
						a.openTag(l, h);
						for (e in h) k.push([e, h[e]]);
						a.sortAttributes && k.sort(d);
						e = 0;
						for (m = k.length; e < m; e++) (h = k[e]), a.attribute(h[0], h[1]);
						a.openTagClose(l, this.isEmpty);
						this.writeChildrenHtml(a);
						this.isEmpty || a.closeTag(l);
					},
					writeChildrenHtml: b.writeChildrenHtml,
					replaceWithChildren: function () {
						for (var a = this.children, b = a.length; b; )
							a[--b].insertAfter(this);
						this.remove();
					},
					forEach: b.forEach,
					getFirst: function (b) {
						if (!b) return this.children.length ? this.children[0] : null;
						"function" != typeof b && (b = a(b));
						for (var g = 0, d = this.children.length; g < d; ++g)
							if (b(this.children[g])) return this.children[g];
						return null;
					},
					getHtml: function () {
						var a = new CKEDITOR.htmlParser.basicWriter();
						this.writeChildrenHtml(a);
						return a.getHtml();
					},
					setHtml: function (a) {
						a = this.children = CKEDITOR.htmlParser.fragment.fromHtml(
							a
						).children;
						for (var b = 0, d = a.length; b < d; ++b) a[b].parent = this;
					},
					getOuterHtml: function () {
						var a = new CKEDITOR.htmlParser.basicWriter();
						this.writeHtml(a);
						return a.getHtml();
					},
					split: function (a) {
						for (
							var b = this.children.splice(a, this.children.length - a),
								d = this.clone(),
								k = 0;
							k < b.length;
							++k
						)
							b[k].parent = d;
						d.children = b;
						b[0] && (b[0].previous = null);
						0 < a && (this.children[a - 1].next = null);
						this.parent.add(d, this.getIndex() + 1);
						return d;
					},
					find: function (a, b) {
						void 0 === b && (b = !1);
						var d = [],
							k;
						for (k = 0; k < this.children.length; k++) {
							var h = this.children[k];
							"function" == typeof a && a(h)
								? d.push(h)
								: "string" == typeof a && h.name === a && d.push(h);
							b && h.find && (d = d.concat(h.find(a, b)));
						}
						return d;
					},
					addClass: function (a) {
						if (!this.hasClass(a)) {
							var b = this.attributes["class"] || "";
							this.attributes["class"] = b + (b ? " " : "") + a;
						}
					},
					removeClass: function (a) {
						var b = this.attributes["class"];
						b &&
							((b = CKEDITOR.tools.trim(
								b.replace(new RegExp("(?:\\s+|^)" + a + "(?:\\s+|$)"), " ")
							))
								? (this.attributes["class"] = b)
								: delete this.attributes["class"]);
					},
					hasClass: function (a) {
						var b = this.attributes["class"];
						return b
							? new RegExp("(?:^|\\s)" + a + "(?\x3d\\s|$)").test(b)
							: !1;
					},
					getFilterContext: function (a) {
						var b = [];
						a || (a = { nonEditable: !1, nestedEditable: !1 });
						a.nonEditable || "false" != this.attributes.contenteditable
							? a.nonEditable &&
							  !a.nestedEditable &&
							  "true" == this.attributes.contenteditable &&
							  b.push("nestedEditable", !0)
							: b.push("nonEditable", !0);
						if (b.length) {
							a = CKEDITOR.tools.copy(a);
							for (var d = 0; d < b.length; d += 2) a[b[d]] = b[d + 1];
						}
						return a;
					},
				},
				!0
			);
		})(),
		(function () {
			var a = /{([^}]+)}/g;
			CKEDITOR.template = function (a) {
				this.source = String(a);
			};
			CKEDITOR.template.prototype.output = function (d, b) {
				var c = this.source.replace(a, function (a, b) {
					return void 0 !== d[b] ? d[b] : a;
				});
				return b ? b.push(c) : c;
			};
		})(),
		delete CKEDITOR.loadFullCore,
		(CKEDITOR.instances = {}),
		(CKEDITOR.document = new CKEDITOR.dom.document(document)),
		(CKEDITOR.add = function (a) {
			CKEDITOR.instances[a.name] = a;
			a.on("focus", function () {
				CKEDITOR.currentInstance != a &&
					((CKEDITOR.currentInstance = a), CKEDITOR.fire("currentInstance"));
			});
			a.on("blur", function () {
				CKEDITOR.currentInstance == a &&
					((CKEDITOR.currentInstance = null), CKEDITOR.fire("currentInstance"));
			});
			CKEDITOR.fire("instance", null, a);
		}),
		(CKEDITOR.remove = function (a) {
			delete CKEDITOR.instances[a.name];
		}),
		(function () {
			var a = {};
			CKEDITOR.addTemplate = function (d, b) {
				var c = a[d];
				if (c) return c;
				c = { name: d, source: b };
				CKEDITOR.fire("template", c);
				return (a[d] = new CKEDITOR.template(c.source));
			};
			CKEDITOR.getTemplate = function (d) {
				return a[d];
			};
		})(),
		(function () {
			var a = [];
			CKEDITOR.addCss = function (d) {
				a.push(d);
			};
			CKEDITOR.getCss = function () {
				return a.join("\n");
			};
		})(),
		CKEDITOR.on("instanceDestroyed", function () {
			CKEDITOR.tools.isEmpty(this.instances) && CKEDITOR.fire("reset");
		}),
		(CKEDITOR.TRISTATE_ON = 1),
		(CKEDITOR.TRISTATE_OFF = 2),
		(CKEDITOR.TRISTATE_DISABLED = 0),
		(function () {
			CKEDITOR.inline = function (a, d) {
				if (!CKEDITOR.env.isCompatible) return null;
				a = CKEDITOR.dom.element.get(a);
				if (a.getEditor())
					throw (
						'The editor instance "' +
						a.getEditor().name +
						'" is already attached to the provided element.'
					);
				var b = new CKEDITOR.editor(d, a, CKEDITOR.ELEMENT_MODE_INLINE),
					c = a.is("textarea") ? a : null;
				c
					? (b.setData(c.getValue(), null, !0),
					  (a = CKEDITOR.dom.element.createFromHtml(
							'\x3cdiv contenteditable\x3d"' +
								!!b.readOnly +
								'" class\x3d"cke_textarea_inline"\x3e' +
								c.getValue() +
								"\x3c/div\x3e",
							CKEDITOR.document
					  )),
					  a.insertAfter(c),
					  c.hide(),
					  c.$.form && b._attachToForm())
					: b.setData(a.getHtml(), null, !0);
				b.on(
					"loaded",
					function () {
						b.fire("uiReady");
						b.editable(a);
						b.container = a;
						b.ui.contentsElement = a;
						b.setData(b.getData(1));
						b.resetDirty();
						b.fire("contentDom");
						b.mode = "wysiwyg";
						b.fire("mode");
						b.status = "ready";
						b.fireOnce("instanceReady");
						CKEDITOR.fire("instanceReady", null, b);
					},
					null,
					null,
					1e4
				);
				b.on("destroy", function () {
					c && (b.container.clearCustomData(), b.container.remove(), c.show());
					b.element.clearCustomData();
					delete b.element;
				});
				return b;
			};
			CKEDITOR.inlineAll = function () {
				var a, d, b;
				for (b in CKEDITOR.dtd.$editable)
					for (
						var c = CKEDITOR.document.getElementsByTag(b), g = 0, l = c.count();
						g < l;
						g++
					)
						(a = c.getItem(g)),
							"true" == a.getAttribute("contenteditable") &&
								((d = { element: a, config: {} }),
								!1 !== CKEDITOR.fire("inline", d) &&
									CKEDITOR.inline(a, d.config));
			};
			CKEDITOR.domReady(function () {
				!CKEDITOR.disableAutoInline && CKEDITOR.inlineAll();
			});
		})(),
		(CKEDITOR.replaceClass = "ckeditor"),
		(function () {
			function a(a, g, l, k) {
				if (!CKEDITOR.env.isCompatible) return null;
				a = CKEDITOR.dom.element.get(a);
				if (a.getEditor())
					throw (
						'The editor instance "' +
						a.getEditor().name +
						'" is already attached to the provided element.'
					);
				var h = new CKEDITOR.editor(g, a, k);
				k == CKEDITOR.ELEMENT_MODE_REPLACE &&
					(a.setStyle("visibility", "hidden"),
					(h._.required = a.hasAttribute("required")),
					a.removeAttribute("required"));
				l && h.setData(l, null, !0);
				h.on("loaded", function () {
					b(h);
					k == CKEDITOR.ELEMENT_MODE_REPLACE &&
						h.config.autoUpdateElement &&
						a.$.form &&
						h._attachToForm();
					h.setMode(h.config.startupMode, function () {
						h.resetDirty();
						h.status = "ready";
						h.fireOnce("instanceReady");
						CKEDITOR.fire("instanceReady", null, h);
					});
				});
				h.on("destroy", d);
				return h;
			}
			function d() {
				var a = this.container,
					b = this.element;
				a && (a.clearCustomData(), a.remove());
				b &&
					(b.clearCustomData(),
					this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE &&
						(b.show(),
						this._.required && b.setAttribute("required", "required")),
					delete this.element);
			}
			function b(a) {
				var b = a.name,
					d = a.element,
					k = a.elementMode,
					h = a.fire("uiSpace", { space: "top", html: "" }).html,
					e = a.fire("uiSpace", { space: "bottom", html: "" }).html,
					m = new CKEDITOR.template(
						'\x3c{outerEl} id\x3d"cke_{name}" class\x3d"{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' +
							CKEDITOR.env.cssClass +
							'"  dir\x3d"{langDir}" lang\x3d"{langCode}" role\x3d"application"' +
							(a.title ? ' aria-labelledby\x3d"cke_{name}_arialbl"' : "") +
							"\x3e" +
							(a.title
								? '\x3cspan id\x3d"cke_{name}_arialbl" class\x3d"cke_voice_label"\x3e{voiceLabel}\x3c/span\x3e'
								: "") +
							'\x3c{outerEl} class\x3d"cke_inner cke_reset" role\x3d"presentation"\x3e{topHtml}\x3c{outerEl} id\x3d"{contentId}" class\x3d"cke_contents cke_reset" role\x3d"presentation"\x3e\x3c/{outerEl}\x3e{bottomHtml}\x3c/{outerEl}\x3e\x3c/{outerEl}\x3e'
					),
					b = CKEDITOR.dom.element.createFromHtml(
						m.output({
							id: a.id,
							name: b,
							langDir: a.lang.dir,
							langCode: a.langCode,
							voiceLabel: a.title,
							topHtml: h
								? '\x3cspan id\x3d"' +
								  a.ui.spaceId("top") +
								  '" class\x3d"cke_top cke_reset_all" role\x3d"presentation" style\x3d"height:auto"\x3e' +
								  h +
								  "\x3c/span\x3e"
								: "",
							contentId: a.ui.spaceId("contents"),
							bottomHtml: e
								? '\x3cspan id\x3d"' +
								  a.ui.spaceId("bottom") +
								  '" class\x3d"cke_bottom cke_reset_all" role\x3d"presentation"\x3e' +
								  e +
								  "\x3c/span\x3e"
								: "",
							outerEl: CKEDITOR.env.ie ? "span" : "div",
						})
					);
				k == CKEDITOR.ELEMENT_MODE_REPLACE
					? (d.hide(), b.insertAfter(d))
					: d.append(b);
				a.container = b;
				a.ui.contentsElement = a.ui.space("contents");
				h && a.ui.space("top").unselectable();
				e && a.ui.space("bottom").unselectable();
				d = a.config.width;
				k = a.config.height;
				d && b.setStyle("width", CKEDITOR.tools.cssLength(d));
				k &&
					a.ui
						.space("contents")
						.setStyle("height", CKEDITOR.tools.cssLength(k));
				b.disableContextMenu();
				CKEDITOR.env.webkit &&
					b.on("focus", function () {
						a.focus();
					});
				a.fireOnce("uiReady");
			}
			CKEDITOR.replace = function (b, g) {
				return a(b, g, null, CKEDITOR.ELEMENT_MODE_REPLACE);
			};
			CKEDITOR.appendTo = function (b, g, d) {
				return a(b, g, d, CKEDITOR.ELEMENT_MODE_APPENDTO);
			};
			CKEDITOR.replaceAll = function () {
				for (
					var a = document.getElementsByTagName("textarea"), b = 0;
					b < a.length;
					b++
				) {
					var d = null,
						k = a[b];
					if (k.name || k.id) {
						if ("string" == typeof arguments[0]) {
							if (
								!new RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)").test(
									k.className
								)
							)
								continue;
						} else if (
							"function" == typeof arguments[0] &&
							((d = {}), !1 === arguments[0](k, d))
						)
							continue;
						this.replace(k, d);
					}
				}
			};
			CKEDITOR.editor.prototype.addMode = function (a, b) {
				(this._.modes || (this._.modes = {}))[a] = b;
			};
			CKEDITOR.editor.prototype.setMode = function (a, b) {
				var d = this,
					k = this._.modes;
				if (a != d.mode && k && k[a]) {
					d.fire("beforeSetMode", a);
					if (d.mode) {
						var h = d.checkDirty(),
							k = d._.previousModeData,
							e,
							m = 0;
						d.fire("beforeModeUnload");
						d.editable(0);
						d._.previousMode = d.mode;
						d._.previousModeData = e = d.getData(1);
						"source" == d.mode &&
							k == e &&
							(d.fire("lockSnapshot", { forceUpdate: !0 }), (m = 1));
						d.ui.space("contents").setHtml("");
						d.mode = "";
					} else d._.previousModeData = d.getData(1);
					this._.modes[a](function () {
						d.mode = a;
						void 0 !== h && !h && d.resetDirty();
						m
							? d.fire("unlockSnapshot")
							: "wysiwyg" == a && d.fire("saveSnapshot");
						setTimeout(function () {
							d.fire("mode");
							b && b.call(d);
						}, 0);
					});
				}
			};
			CKEDITOR.editor.prototype.resize = function (a, b, d, k) {
				var h = this.container,
					e = this.ui.space("contents"),
					m =
						CKEDITOR.env.webkit &&
						this.document &&
						this.document.getWindow().$.frameElement;
				k = k
					? this.container.getFirst(function (a) {
							return a.type == CKEDITOR.NODE_ELEMENT && a.hasClass("cke_inner");
					  })
					: h;
				k.setSize("width", a, !0);
				m && (m.style.width = "1%");
				var f = (k.$.offsetHeight || 0) - (e.$.clientHeight || 0),
					h = Math.max(b - (d ? 0 : f), 0);
				b = d ? b + f : b;
				e.setStyle("height", h + "px");
				m && (m.style.width = "100%");
				this.fire("resize", {
					outerHeight: b,
					contentsHeight: h,
					outerWidth: a || k.getSize("width"),
				});
			};
			CKEDITOR.editor.prototype.getResizable = function (a) {
				return a ? this.ui.space("contents") : this.container;
			};
			CKEDITOR.domReady(function () {
				CKEDITOR.replaceClass && CKEDITOR.replaceAll(CKEDITOR.replaceClass);
			});
		})(),
		(CKEDITOR.config.startupMode = "wysiwyg"),
		(function () {
			function a(a) {
				var b = a.editor,
					f = a.data.path,
					e = f.blockLimit,
					g = a.data.selection,
					h = g.getRanges()[0],
					m;
				if (
					CKEDITOR.env.gecko ||
					(CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller)
				)
					if ((g = d(g, f))) g.appendBogus(), (m = CKEDITOR.env.ie);
				k(b, f.block, e) &&
					h.collapsed &&
					!h.getCommonAncestor().isReadOnly() &&
					((f = h.clone()),
					f.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS),
					(e = new CKEDITOR.dom.walker(f)),
					(e.guard = function (a) {
						return !c(a) || a.type == CKEDITOR.NODE_COMMENT || a.isReadOnly();
					}),
					!e.checkForward() ||
						(f.checkStartOfBlock() && f.checkEndOfBlock())) &&
					((b = h.fixBlock(
						!0,
						b.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p"
					)),
					CKEDITOR.env.needsBrFiller ||
						((b = b.getFirst(c)) &&
							b.type == CKEDITOR.NODE_TEXT &&
							CKEDITOR.tools.trim(b.getText()).match(/^(?:&nbsp;|\xa0)$/) &&
							b.remove()),
					(m = 1),
					a.cancel());
				m && h.select();
			}
			function d(a, b) {
				if (a.isFake) return 0;
				var f = b.block || b.blockLimit,
					e = f && f.getLast(c);
				if (
					!(
						!f ||
						!f.isBlockBoundary() ||
						(e && e.type == CKEDITOR.NODE_ELEMENT && e.isBlockBoundary()) ||
						f.is("pre") ||
						f.getBogus()
					)
				)
					return f;
			}
			function b(a) {
				var b = a.data.getTarget();
				b.is("input") &&
					((b = b.getAttribute("type")),
					("submit" != b && "reset" != b) || a.data.preventDefault());
			}
			function c(a) {
				return f(a) && n(a);
			}
			function g(a, b) {
				return function (c) {
					var f =
						c.data.$.toElement ||
						c.data.$.fromElement ||
						c.data.$.relatedTarget;
					((f =
						f && f.nodeType == CKEDITOR.NODE_ELEMENT
							? new CKEDITOR.dom.element(f)
							: null) &&
						(b.equals(f) || b.contains(f))) ||
						a.call(this, c);
				};
			}
			function l(a) {
				function b(a) {
					return function (b, e) {
						e && b.type == CKEDITOR.NODE_ELEMENT && b.is(g) && (f = b);
						if (!(e || !c(b) || (a && x(b)))) return !1;
					};
				}
				var f,
					e = a.getRanges()[0];
				a = a.root;
				var g = { table: 1, ul: 1, ol: 1, dl: 1 };
				if (e.startPath().contains(g)) {
					var d = e.clone();
					d.collapse(1);
					d.setStartAt(a, CKEDITOR.POSITION_AFTER_START);
					a = new CKEDITOR.dom.walker(d);
					a.guard = b();
					a.checkBackward();
					if (f)
						return (
							(d = e.clone()),
							d.collapse(),
							d.setEndAt(f, CKEDITOR.POSITION_AFTER_END),
							(a = new CKEDITOR.dom.walker(d)),
							(a.guard = b(!0)),
							(f = !1),
							a.checkForward(),
							f
						);
				}
				return null;
			}
			function k(a, b, c) {
				return (
					!1 !== a.config.autoParagraph &&
					a.activeEnterMode != CKEDITOR.ENTER_BR &&
					((a.editable().equals(c) && !b) ||
						(b && "true" == b.getAttribute("contenteditable")))
				);
			}
			function h(a) {
				return a.activeEnterMode != CKEDITOR.ENTER_BR &&
					!1 !== a.config.autoParagraph
					? a.activeEnterMode == CKEDITOR.ENTER_DIV
						? "div"
						: "p"
					: !1;
			}
			function e(a) {
				var b = a.editor;
				b.getSelection().scrollIntoView();
				setTimeout(function () {
					b.fire("saveSnapshot");
				}, 0);
			}
			function m(a, b, c) {
				var f = a.getCommonAncestor(b);
				for (
					b = a = c ? b : a;
					(a = a.getParent()) && !f.equals(a) && 1 == a.getChildCount();

				)
					b = a;
				b.remove();
			}
			var f, n, r, x, v, p, u, w, q, z;
			CKEDITOR.editable = CKEDITOR.tools.createClass({
				base: CKEDITOR.dom.element,
				$: function (a, b) {
					this.base(b.$ || b);
					this.editor = a;
					this.status = "unloaded";
					this.hasFocus = !1;
					this.setup();
				},
				proto: {
					focus: function () {
						var a;
						if (
							CKEDITOR.env.webkit &&
							!this.hasFocus &&
							((a =
								this.editor._.previousActive || this.getDocument().getActive()),
							this.contains(a))
						) {
							a.focus();
							return;
						}
						CKEDITOR.env.edge &&
							14 < CKEDITOR.env.version &&
							!this.hasFocus &&
							this.getDocument().equals(CKEDITOR.document) &&
							(this.editor._.previousScrollTop = this.$.scrollTop);
						try {
							if (
								!CKEDITOR.env.ie ||
								(CKEDITOR.env.edge && 14 < CKEDITOR.env.version) ||
								!this.getDocument().equals(CKEDITOR.document)
							)
								if (CKEDITOR.env.chrome) {
									var b = this.$.scrollTop;
									this.$.focus();
									this.$.scrollTop = b;
								} else this.$.focus();
							else this.$.setActive();
						} catch (c) {
							if (!CKEDITOR.env.ie) throw c;
						}
						CKEDITOR.env.safari &&
							!this.isInline() &&
							((a = CKEDITOR.document.getActive()),
							a.equals(this.getWindow().getFrame()) ||
								this.getWindow().focus());
					},
					on: function (a, b) {
						var c = Array.prototype.slice.call(arguments, 0);
						CKEDITOR.env.ie &&
							/^focus|blur$/.exec(a) &&
							((a = "focus" == a ? "focusin" : "focusout"),
							(b = g(b, this)),
							(c[0] = a),
							(c[1] = b));
						return CKEDITOR.dom.element.prototype.on.apply(this, c);
					},
					attachListener: function (a) {
						!this._.listeners && (this._.listeners = []);
						var b = Array.prototype.slice.call(arguments, 1),
							b = a.on.apply(a, b);
						this._.listeners.push(b);
						return b;
					},
					clearListeners: function () {
						var a = this._.listeners;
						try {
							for (; a.length; ) a.pop().removeListener();
						} catch (b) {}
					},
					restoreAttrs: function () {
						var a = this._.attrChanges,
							b,
							c;
						for (c in a)
							a.hasOwnProperty(c) &&
								((b = a[c]),
								null !== b ? this.setAttribute(c, b) : this.removeAttribute(c));
					},
					attachClass: function (a) {
						var b = this.getCustomData("classes");
						this.hasClass(a) ||
							(!b && (b = []),
							b.push(a),
							this.setCustomData("classes", b),
							this.addClass(a));
					},
					changeAttr: function (a, b) {
						var c = this.getAttribute(a);
						b !== c &&
							(!this._.attrChanges && (this._.attrChanges = {}),
							a in this._.attrChanges || (this._.attrChanges[a] = c),
							this.setAttribute(a, b));
					},
					insertText: function (a) {
						this.editor.focus();
						this.insertHtml(this.transformPlainTextToHtml(a), "text");
					},
					transformPlainTextToHtml: function (a) {
						var b = this.editor
							.getSelection()
							.getStartElement()
							.hasAscendant("pre", !0)
							? CKEDITOR.ENTER_BR
							: this.editor.activeEnterMode;
						return CKEDITOR.tools.transformPlainTextToHtml(a, b);
					},
					insertHtml: function (a, b, c) {
						var f = this.editor;
						f.focus();
						f.fire("saveSnapshot");
						c || (c = f.getSelection().getRanges()[0]);
						p(this, b || "html", a, c);
						c.select();
						e(this);
						this.editor.fire("afterInsertHtml", {});
					},
					insertHtmlIntoRange: function (a, b, c) {
						p(this, c || "html", a, b);
						this.editor.fire("afterInsertHtml", { intoRange: b });
					},
					insertElement: function (a, b) {
						var f = this.editor;
						f.focus();
						f.fire("saveSnapshot");
						var g = f.activeEnterMode,
							f = f.getSelection(),
							d = a.getName(),
							d = CKEDITOR.dtd.$block[d];
						b || (b = f.getRanges()[0]);
						this.insertElementIntoRange(a, b) &&
							(b.moveToPosition(a, CKEDITOR.POSITION_AFTER_END),
							d &&
								((d = a.getNext(function (a) {
									return c(a) && !x(a);
								})) &&
								d.type == CKEDITOR.NODE_ELEMENT &&
								d.is(CKEDITOR.dtd.$block)
									? d.getDtd()["#"]
										? b.moveToElementEditStart(d)
										: b.moveToElementEditEnd(a)
									: d ||
									  g == CKEDITOR.ENTER_BR ||
									  ((d = b.fixBlock(
											!0,
											g == CKEDITOR.ENTER_DIV ? "div" : "p"
									  )),
									  b.moveToElementEditStart(d))));
						f.selectRanges([b]);
						e(this);
					},
					insertElementIntoSelection: function (a) {
						this.insertElement(a);
					},
					insertElementIntoRange: function (a, b) {
						var c = this.editor,
							f = c.config.enterMode,
							e = a.getName(),
							g = CKEDITOR.dtd.$block[e];
						if (b.checkReadOnly()) return !1;
						b.deleteContents(1);
						b.startContainer.type == CKEDITOR.NODE_ELEMENT &&
							(b.startContainer.is({
								tr: 1,
								table: 1,
								tbody: 1,
								thead: 1,
								tfoot: 1,
							})
								? u(b)
								: b.startContainer.is(CKEDITOR.dtd.$list) && w(b));
						var d, h;
						if (g)
							for (
								;
								(d = b.getCommonAncestor(0, 1)) &&
								(h = CKEDITOR.dtd[d.getName()]) &&
								(!h || !h[e]);

							)
								d.getName() in CKEDITOR.dtd.span
									? b.splitElement(d)
									: b.checkStartOfBlock() && b.checkEndOfBlock()
									? (b.setStartBefore(d), b.collapse(!0), d.remove())
									: b.splitBlock(
											f == CKEDITOR.ENTER_DIV ? "div" : "p",
											c.editable()
									  );
						b.insertNode(a);
						return !0;
					},
					setData: function (a, b) {
						b || (a = this.editor.dataProcessor.toHtml(a));
						this.setHtml(a);
						this.fixInitialSelection();
						"unloaded" == this.status && (this.status = "ready");
						this.editor.fire("dataReady");
					},
					getData: function (a) {
						var b = this.getHtml();
						a || (b = this.editor.dataProcessor.toDataFormat(b));
						return b;
					},
					setReadOnly: function (a) {
						this.setAttribute("contenteditable", !a);
					},
					detach: function () {
						this.removeClass("cke_editable");
						this.status = "detached";
						var a = this.editor;
						this._.detach();
						delete a.document;
						delete a.window;
					},
					isInline: function () {
						return this.getDocument().equals(CKEDITOR.document);
					},
					fixInitialSelection: function () {
						function a() {
							var b = c.getDocument().$,
								f = b.getSelection(),
								e;
							a: if (f.anchorNode && f.anchorNode == c.$) e = !0;
							else {
								if (
									CKEDITOR.env.webkit &&
									(e = c.getDocument().getActive()) &&
									e.equals(c) &&
									!f.anchorNode
								) {
									e = !0;
									break a;
								}
								e = void 0;
							}
							e &&
								((e = new CKEDITOR.dom.range(c)),
								e.moveToElementEditStart(c),
								(b = b.createRange()),
								b.setStart(e.startContainer.$, e.startOffset),
								b.collapse(!0),
								f.removeAllRanges(),
								f.addRange(b));
						}
						function b() {
							var a = c.getDocument().$,
								f = a.selection,
								e = c.getDocument().getActive();
							"None" == f.type &&
								e.equals(c) &&
								((f = new CKEDITOR.dom.range(c)),
								(a = a.body.createTextRange()),
								f.moveToElementEditStart(c),
								(f = f.startContainer),
								f.type != CKEDITOR.NODE_ELEMENT && (f = f.getParent()),
								a.moveToElementText(f.$),
								a.collapse(!0),
								a.select());
						}
						var c = this;
						if (
							CKEDITOR.env.ie &&
							(9 > CKEDITOR.env.version || CKEDITOR.env.quirks)
						)
							this.hasFocus && (this.focus(), b());
						else if (this.hasFocus) this.focus(), a();
						else
							this.once(
								"focus",
								function () {
									a();
								},
								null,
								null,
								-999
							);
					},
					getHtmlFromRange: function (a) {
						if (a.collapsed)
							return new CKEDITOR.dom.documentFragment(a.document);
						a = { doc: this.getDocument(), range: a.clone() };
						q.eol.detect(a, this);
						q.bogus.exclude(a);
						q.cell.shrink(a);
						a.fragment = a.range.cloneContents();
						q.tree.rebuild(a, this);
						q.eol.fix(a, this);
						return new CKEDITOR.dom.documentFragment(a.fragment.$);
					},
					extractHtmlFromRange: function (a, b) {
						var c = z,
							f = { range: a, doc: a.document },
							e = this.getHtmlFromRange(a);
						if (a.collapsed) return a.optimize(), e;
						a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
						c.table.detectPurge(f);
						f.bookmark = a.createBookmark();
						delete f.range;
						var g = this.editor.createRange();
						g.moveToPosition(
							f.bookmark.startNode,
							CKEDITOR.POSITION_BEFORE_START
						);
						f.targetBookmark = g.createBookmark();
						c.list.detectMerge(f, this);
						c.table.detectRanges(f, this);
						c.block.detectMerge(f, this);
						f.tableContentsRanges
							? (c.table.deleteRanges(f),
							  a.moveToBookmark(f.bookmark),
							  (f.range = a))
							: (a.moveToBookmark(f.bookmark),
							  (f.range = a),
							  a.extractContents(c.detectExtractMerge(f)));
						a.moveToBookmark(f.targetBookmark);
						a.optimize();
						c.fixUneditableRangePosition(a);
						c.list.merge(f, this);
						c.table.purge(f, this);
						c.block.merge(f, this);
						if (b) {
							c = a.startPath();
							if (
								(f =
									a.checkStartOfBlock() &&
									a.checkEndOfBlock() &&
									c.block &&
									!a.root.equals(c.block))
							) {
								a: {
									var f = c.block.getElementsByTag("span"),
										g = 0,
										d;
									if (f)
										for (; (d = f.getItem(g++)); )
											if (!n(d)) {
												f = !0;
												break a;
											}
									f = !1;
								}
								f = !f;
							}
							f &&
								(a.moveToPosition(c.block, CKEDITOR.POSITION_BEFORE_START),
								c.block.remove());
						} else
							c.autoParagraph(this.editor, a),
								r(a.startContainer) && a.startContainer.appendBogus();
						a.startContainer.mergeSiblings();
						return e;
					},
					setup: function () {
						var a = this.editor;
						this.attachListener(
							a,
							"beforeGetData",
							function () {
								var b = this.getData();
								this.is("textarea") ||
									(!1 !== a.config.ignoreEmptyParagraph &&
										(b = b.replace(v, function (a, b) {
											return b;
										})));
								a.setData(b, null, 1);
							},
							this
						);
						this.attachListener(
							a,
							"getSnapshot",
							function (a) {
								a.data = this.getData(1);
							},
							this
						);
						this.attachListener(
							a,
							"afterSetData",
							function () {
								this.setData(a.getData(1));
							},
							this
						);
						this.attachListener(
							a,
							"loadSnapshot",
							function (a) {
								this.setData(a.data, 1);
							},
							this
						);
						this.attachListener(
							a,
							"beforeFocus",
							function () {
								var b = a.getSelection();
								((b = b && b.getNative()) && "Control" == b.type) ||
									this.focus();
							},
							this
						);
						this.attachListener(
							a,
							"insertHtml",
							function (a) {
								this.insertHtml(a.data.dataValue, a.data.mode, a.data.range);
							},
							this
						);
						this.attachListener(
							a,
							"insertElement",
							function (a) {
								this.insertElement(a.data);
							},
							this
						);
						this.attachListener(
							a,
							"insertText",
							function (a) {
								this.insertText(a.data);
							},
							this
						);
						this.setReadOnly(a.readOnly);
						this.attachClass("cke_editable");
						a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE
							? this.attachClass("cke_editable_inline")
							: (a.elementMode != CKEDITOR.ELEMENT_MODE_REPLACE &&
									a.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) ||
							  this.attachClass("cke_editable_themed");
						this.attachClass("cke_contents_" + a.config.contentsLangDirection);
						a.keystrokeHandler.blockedKeystrokes[8] = +a.readOnly;
						a.keystrokeHandler.attach(this);
						this.on(
							"blur",
							function () {
								this.hasFocus = !1;
							},
							null,
							null,
							-1
						);
						this.on(
							"focus",
							function () {
								this.hasFocus = !0;
							},
							null,
							null,
							-1
						);
						if (CKEDITOR.env.webkit)
							this.on(
								"scroll",
								function () {
									a._.previousScrollTop = a.editable().$.scrollTop;
								},
								null,
								null,
								-1
							);
						if (CKEDITOR.env.edge && 14 < CKEDITOR.env.version) {
							var e = function () {
								var b = a.editable();
								null != a._.previousScrollTop &&
									b.getDocument().equals(CKEDITOR.document) &&
									((b.$.scrollTop = a._.previousScrollTop),
									(a._.previousScrollTop = null),
									this.removeListener("scroll", e));
							};
							this.on("scroll", e);
						}
						a.focusManager.add(this);
						this.equals(CKEDITOR.document.getActive()) &&
							((this.hasFocus = !0),
							a.once(
								"contentDom",
								function () {
									a.focusManager.focus(this);
								},
								this
							));
						this.isInline() && this.changeAttr("tabindex", a.tabIndex);
						if (!this.is("textarea")) {
							a.document = this.getDocument();
							a.window = this.getWindow();
							var g = a.document;
							this.changeAttr(
								"spellcheck",
								!a.config.disableNativeSpellChecker
							);
							var d = a.config.contentsLangDirection;
							this.getDirection(1) != d && this.changeAttr("dir", d);
							var h = CKEDITOR.getCss();
							if (h) {
								var d = g.getHead(),
									k = d.getCustomData("stylesheet");
								k
									? h != k.getText() &&
									  (CKEDITOR.env.ie && 9 > CKEDITOR.env.version
											? (k.$.styleSheet.cssText = h)
											: k.setText(h))
									: ((h = g.appendStyleText(h)),
									  (h = new CKEDITOR.dom.element(
											h.ownerNode || h.owningElement
									  )),
									  d.setCustomData("stylesheet", h),
									  h.data("cke-temp", 1));
							}
							d = g.getCustomData("stylesheet_ref") || 0;
							g.setCustomData("stylesheet_ref", d + 1);
							this.setCustomData(
								"cke_includeReadonly",
								!a.config.disableReadonlyStyling
							);
							this.attachListener(this, "click", function (a) {
								a = a.data;
								var b = new CKEDITOR.dom.elementPath(
									a.getTarget(),
									this
								).contains("a");
								b && 2 != a.$.button && b.isReadOnly() && a.preventDefault();
							});
							var n = { 8: 1, 46: 1 };
							this.attachListener(a, "key", function (b) {
								if (a.readOnly) return !0;
								var c = b.data.domEvent.getKey(),
									e;
								b = a.getSelection();
								if (0 !== b.getRanges().length) {
									if (c in n) {
										var g,
											d = b.getRanges()[0],
											h = d.startPath(),
											m,
											k,
											r,
											c = 8 == c;
										(CKEDITOR.env.ie &&
											11 > CKEDITOR.env.version &&
											(g = b.getSelectedElement())) ||
										(g = l(b))
											? (a.fire("saveSnapshot"),
											  d.moveToPosition(g, CKEDITOR.POSITION_BEFORE_START),
											  g.remove(),
											  d.select(),
											  a.fire("saveSnapshot"),
											  (e = 1))
											: d.collapsed &&
											  ((m = h.block) &&
											  (r = m[c ? "getPrevious" : "getNext"](f)) &&
											  r.type == CKEDITOR.NODE_ELEMENT &&
											  r.is("table") &&
											  d[c ? "checkStartOfBlock" : "checkEndOfBlock"]()
													? (a.fire("saveSnapshot"),
													  d[c ? "checkEndOfBlock" : "checkStartOfBlock"]() &&
															m.remove(),
													  d["moveToElementEdit" + (c ? "End" : "Start")](r),
													  d.select(),
													  a.fire("saveSnapshot"),
													  (e = 1))
													: h.blockLimit &&
													  h.blockLimit.is("td") &&
													  (k = h.blockLimit.getAscendant("table")) &&
													  d.checkBoundaryOfElement(
															k,
															c ? CKEDITOR.START : CKEDITOR.END
													  ) &&
													  (r = k[c ? "getPrevious" : "getNext"](f))
													? (a.fire("saveSnapshot"),
													  d["moveToElementEdit" + (c ? "End" : "Start")](r),
													  d.checkStartOfBlock() && d.checkEndOfBlock()
															? r.remove()
															: d.select(),
													  a.fire("saveSnapshot"),
													  (e = 1))
													: (k = h.contains(["td", "th", "caption"])) &&
													  d.checkBoundaryOfElement(
															k,
															c ? CKEDITOR.START : CKEDITOR.END
													  ) &&
													  (e = 1));
									}
									return !e;
								}
							});
							a.blockless &&
								CKEDITOR.env.ie &&
								CKEDITOR.env.needsBrFiller &&
								this.attachListener(this, "keyup", function (b) {
									b.data.getKeystroke() in n &&
										!this.getFirst(c) &&
										(this.appendBogus(),
										(b = a.createRange()),
										b.moveToPosition(this, CKEDITOR.POSITION_AFTER_START),
										b.select());
								});
							this.attachListener(this, "dblclick", function (b) {
								if (a.readOnly) return !1;
								b = { element: b.data.getTarget() };
								a.fire("doubleclick", b);
							});
							CKEDITOR.env.ie && this.attachListener(this, "click", b);
							(CKEDITOR.env.ie && !CKEDITOR.env.edge) ||
								this.attachListener(this, "mousedown", function (b) {
									var c = b.data.getTarget();
									c.is("img", "hr", "input", "textarea", "select") &&
										!c.isReadOnly() &&
										(a.getSelection().selectElement(c),
										c.is("input", "textarea", "select") &&
											b.data.preventDefault());
								});
							CKEDITOR.env.edge &&
								this.attachListener(this, "mouseup", function (b) {
									(b = b.data.getTarget()) &&
										b.is("img") &&
										!b.isReadOnly() &&
										a.getSelection().selectElement(b);
								});
							CKEDITOR.env.gecko &&
								this.attachListener(this, "mouseup", function (b) {
									if (
										2 == b.data.$.button &&
										((b = b.data.getTarget()),
										!b.getAscendant("table") &&
											!b.getOuterHtml().replace(v, ""))
									) {
										var c = a.createRange();
										c.moveToElementEditStart(b);
										c.select(!0);
									}
								});
							CKEDITOR.env.webkit &&
								(this.attachListener(this, "click", function (a) {
									a.data.getTarget().is("input", "select") &&
										a.data.preventDefault();
								}),
								this.attachListener(this, "mouseup", function (a) {
									a.data.getTarget().is("input", "textarea") &&
										a.data.preventDefault();
								}));
							CKEDITOR.env.webkit &&
								this.attachListener(
									a,
									"key",
									function (b) {
										if (a.readOnly) return !0;
										var c = b.data.domEvent.getKey();
										if (
											c in n &&
											((b = a.getSelection()), 0 !== b.getRanges().length)
										) {
											var c = 8 == c,
												f = b.getRanges()[0];
											b = f.startPath();
											if (f.collapsed)
												a: {
													var e = b.block;
													if (
														e &&
														f[c ? "checkStartOfBlock" : "checkEndOfBlock"]() &&
														f.moveToClosestEditablePosition(e, !c) &&
														f.collapsed
													) {
														if (
															f.startContainer.type == CKEDITOR.NODE_ELEMENT
														) {
															var g = f.startContainer.getChild(
																f.startOffset - (c ? 1 : 0)
															);
															if (
																g &&
																g.type == CKEDITOR.NODE_ELEMENT &&
																g.is("hr")
															) {
																a.fire("saveSnapshot");
																g.remove();
																b = !0;
																break a;
															}
														}
														f = f.startPath().block;
														if (!f || (f && f.contains(e))) b = void 0;
														else {
															a.fire("saveSnapshot");
															var d;
															(d = (c ? f : e).getBogus()) && d.remove();
															d = a.getSelection();
															g = d.createBookmarks();
															(c ? e : f).moveChildren(c ? f : e, !1);
															b.lastElement.mergeSiblings();
															m(e, f, !c);
															d.selectBookmarks(g);
															b = !0;
														}
													} else b = !1;
												}
											else
												(c = f),
													(d = b.block),
													(f = c.endPath().block),
													d && f && !d.equals(f)
														? (a.fire("saveSnapshot"),
														  (e = d.getBogus()) && e.remove(),
														  c.enlarge(CKEDITOR.ENLARGE_INLINE),
														  c.deleteContents(),
														  f.getParent() &&
																(f.moveChildren(d, !1),
																b.lastElement.mergeSiblings(),
																m(d, f, !0)),
														  (c = a.getSelection().getRanges()[0]),
														  c.collapse(1),
														  c.optimize(),
														  "" === c.startContainer.getHtml() &&
																c.startContainer.appendBogus(),
														  c.select(),
														  (b = !0))
														: (b = !1);
											if (!b) return;
											a.getSelection().scrollIntoView();
											a.fire("saveSnapshot");
											return !1;
										}
									},
									this,
									null,
									100
								);
						}
					},
				},
				_: {
					detach: function () {
						this.editor.setData(this.editor.getData(), 0, 1);
						this.clearListeners();
						this.restoreAttrs();
						var a;
						if ((a = this.removeCustomData("classes")))
							for (; a.length; ) this.removeClass(a.pop());
						if (!this.is("textarea")) {
							a = this.getDocument();
							var b = a.getHead();
							if (b.getCustomData("stylesheet")) {
								var c = a.getCustomData("stylesheet_ref");
								--c
									? a.setCustomData("stylesheet_ref", c)
									: (a.removeCustomData("stylesheet_ref"),
									  b.removeCustomData("stylesheet").remove());
							}
						}
						this.editor.fire("contentDomUnload");
						delete this.editor;
					},
				},
			});
			CKEDITOR.editor.prototype.editable = function (a) {
				var b = this._.editable;
				if (b && a) return 0;
				arguments.length &&
					(b = this._.editable = a
						? a instanceof CKEDITOR.editable
							? a
							: new CKEDITOR.editable(this, a)
						: (b && b.detach(), null));
				return b;
			};
			CKEDITOR.on("instanceLoaded", function (b) {
				var c = b.editor;
				c.on("insertElement", function (a) {
					a = a.data;
					a.type == CKEDITOR.NODE_ELEMENT &&
						(a.is("input") || a.is("textarea")) &&
						("false" != a.getAttribute("contentEditable") &&
							a.data(
								"cke-editable",
								a.hasAttribute("contenteditable") ? "true" : "1"
							),
						a.setAttribute("contentEditable", !1));
				});
				c.on("selectionChange", function (b) {
					if (!c.readOnly) {
						var f = c.getSelection();
						f &&
							!f.isLocked &&
							((f = c.checkDirty()),
							c.fire("lockSnapshot"),
							a(b),
							c.fire("unlockSnapshot"),
							!f && c.resetDirty());
					}
				});
			});
			CKEDITOR.on("instanceCreated", function (a) {
				var b = a.editor;
				b.on("mode", function () {
					var a = b.editable();
					if (a && a.isInline()) {
						var c = b.title;
						a.changeAttr("role", "textbox");
						a.changeAttr("aria-multiline", "true");
						a.changeAttr("aria-label", c);
						c && a.changeAttr("title", c);
						var f = b.fire("ariaEditorHelpLabel", {}).label;
						if (
							f &&
							(c = this.ui.space(
								this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE
									? "top"
									: "contents"
							))
						) {
							var e = CKEDITOR.tools.getNextId(),
								f = CKEDITOR.dom.element.createFromHtml(
									'\x3cspan id\x3d"' +
										e +
										'" class\x3d"cke_voice_label"\x3e' +
										f +
										"\x3c/span\x3e"
								);
							c.append(f);
							a.changeAttr("aria-describedby", e);
						}
					}
				});
			});
			CKEDITOR.addCss(
				".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}"
			);
			f = CKEDITOR.dom.walker.whitespaces(!0);
			n = CKEDITOR.dom.walker.bookmark(!1, !0);
			r = CKEDITOR.dom.walker.empty();
			x = CKEDITOR.dom.walker.bogus();
			v = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi;
			p = (function () {
				function a(b) {
					return b.type == CKEDITOR.NODE_ELEMENT;
				}
				function b(c, f) {
					var e,
						g,
						d,
						h,
						m = [],
						k = f.range.startContainer;
					e = f.range.startPath();
					for (
						var k = l[k.getName()],
							n = 0,
							r = c.getChildren(),
							u = r.count(),
							q = -1,
							G = -1,
							B = 0,
							w = e.contains(l.$list);
						n < u;
						++n
					)
						(e = r.getItem(n)),
							a(e)
								? ((d = e.getName()),
								  w && d in CKEDITOR.dtd.$list
										? (m = m.concat(b(e, f)))
										: ((h = !!k[d]),
										  "br" != d ||
												!e.data("cke-eol") ||
												(n && n != u - 1) ||
												((B =
													(g = n ? m[n - 1].node : r.getItem(n + 1)) &&
													(!a(g) || !g.is("br"))),
												(g = g && a(g) && l.$block[g.getName()])),
										  -1 != q || h || (q = n),
										  h || (G = n),
										  m.push({
												isElement: 1,
												isLineBreak: B,
												isBlock: e.isBlockBoundary(),
												hasBlockSibling: g,
												node: e,
												name: d,
												allowed: h,
										  }),
										  (g = B = 0)))
								: m.push({ isElement: 0, node: e, allowed: 1 });
					-1 < q && (m[q].firstNotAllowed = 1);
					-1 < G && (m[G].lastNotAllowed = 1);
					return m;
				}
				function f(b, c) {
					var e = [],
						g = b.getChildren(),
						d = g.count(),
						h,
						m = 0,
						k = l[c],
						n = !b.is(l.$inline) || b.is("br");
					for (n && e.push(" "); m < d; m++)
						(h = g.getItem(m)),
							a(h) && !h.is(k) ? (e = e.concat(f(h, c))) : e.push(h);
					n && e.push(" ");
					return e;
				}
				function e(b) {
					return (
						a(b.startContainer) && b.startContainer.getChild(b.startOffset - 1)
					);
				}
				function g(b) {
					return (
						b &&
						a(b) &&
						(b.is(l.$removeEmpty) || (b.is("a") && !b.isBlockBoundary()))
					);
				}
				function d(b, c, f, e) {
					var g = b.clone(),
						h,
						m;
					g.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
					(h = new CKEDITOR.dom.walker(g).next()) &&
						a(h) &&
						n[h.getName()] &&
						(m = h.getPrevious()) &&
						a(m) &&
						!m.getParent().equals(b.startContainer) &&
						f.contains(m) &&
						e.contains(h) &&
						h.isIdentical(m) &&
						(h.moveChildren(m), h.remove(), d(b, c, f, e));
				}
				function m(b, c) {
					function f(b, c) {
						if (
							c.isBlock &&
							c.isElement &&
							!c.node.is("br") &&
							a(b) &&
							b.is("br")
						)
							return b.remove(), 1;
					}
					var e = c.endContainer.getChild(c.endOffset),
						g = c.endContainer.getChild(c.endOffset - 1);
					e && f(e, b[b.length - 1]);
					g &&
						f(g, b[0]) &&
						(c.setEnd(c.endContainer, c.endOffset - 1), c.collapse());
				}
				var l = CKEDITOR.dtd,
					n = {
						p: 1,
						div: 1,
						h1: 1,
						h2: 1,
						h3: 1,
						h4: 1,
						h5: 1,
						h6: 1,
						ul: 1,
						ol: 1,
						li: 1,
						pre: 1,
						dl: 1,
						blockquote: 1,
					},
					r = { p: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1 },
					u = CKEDITOR.tools.extend({}, l.$inline);
				delete u.br;
				return function (n, D, q, w) {
					var E = n.editor,
						z = !1;
					"unfiltered_html" == D && ((D = "html"), (z = !0));
					if (!w.checkReadOnly()) {
						var x =
							new CKEDITOR.dom.elementPath(w.startContainer, w.root)
								.blockLimit || w.root;
						n = {
							type: D,
							dontFilter: z,
							editable: n,
							editor: E,
							range: w,
							blockLimit: x,
							mergeCandidates: [],
							zombies: [],
						};
						D = n.range;
						w = n.mergeCandidates;
						var v, p;
						"text" == n.type &&
							D.shrink(CKEDITOR.SHRINK_ELEMENT, !0, !1) &&
							((v = CKEDITOR.dom.element.createFromHtml(
								"\x3cspan\x3e\x26nbsp;\x3c/span\x3e",
								D.document
							)),
							D.insertNode(v),
							D.setStartAfter(v));
						z = new CKEDITOR.dom.elementPath(D.startContainer);
						n.endPath = x = new CKEDITOR.dom.elementPath(D.endContainer);
						if (!D.collapsed) {
							var E = x.block || x.blockLimit,
								da = D.getCommonAncestor();
							E &&
								!E.equals(da) &&
								!E.contains(da) &&
								D.checkEndOfBlock() &&
								n.zombies.push(E);
							D.deleteContents();
						}
						for (; (p = e(D)) && a(p) && p.isBlockBoundary() && z.contains(p); )
							D.moveToPosition(p, CKEDITOR.POSITION_BEFORE_END);
						d(D, n.blockLimit, z, x);
						v && (D.setEndBefore(v), D.collapse(), v.remove());
						v = D.startPath();
						if ((E = v.contains(g, !1, 1)))
							D.splitElement(E),
								(n.inlineStylesRoot = E),
								(n.inlineStylesPeak = v.lastElement);
						v = D.createBookmark();
						(E = v.startNode.getPrevious(c)) && a(E) && g(E) && w.push(E);
						(E = v.startNode.getNext(c)) && a(E) && g(E) && w.push(E);
						for (E = v.startNode; (E = E.getParent()) && g(E); ) w.push(E);
						D.moveToBookmark(v);
						if ((v = q)) {
							v = n.range;
							if ("text" == n.type && n.inlineStylesRoot) {
								p = n.inlineStylesPeak;
								D = p.getDocument().createText("{cke-peak}");
								for (w = n.inlineStylesRoot.getParent(); !p.equals(w); )
									(D = D.appendTo(p.clone())), (p = p.getParent());
								q = D.getOuterHtml().split("{cke-peak}").join(q);
							}
							p = n.blockLimit.getName();
							if (/^\s+|\s+$/.test(q) && "span" in CKEDITOR.dtd[p]) {
								var O =
									'\x3cspan data-cke-marker\x3d"1"\x3e\x26nbsp;\x3c/span\x3e';
								q = O + q + O;
							}
							q = n.editor.dataProcessor.toHtml(q, {
								context: null,
								fixForBody: !1,
								protectedWhitespaces: !!O,
								dontFilter: n.dontFilter,
								filter: n.editor.activeFilter,
								enterMode: n.editor.activeEnterMode,
							});
							p = v.document.createElement("body");
							p.setHtml(q);
							O && (p.getFirst().remove(), p.getLast().remove());
							if (
								(O = v.startPath().block) &&
								(1 != O.getChildCount() || !O.getBogus())
							)
								a: {
									var P;
									if (
										1 == p.getChildCount() &&
										a((P = p.getFirst())) &&
										P.is(r) &&
										!P.hasAttribute("contenteditable")
									) {
										O = P.getElementsByTag("*");
										v = 0;
										for (w = O.count(); v < w; v++)
											if (((D = O.getItem(v)), !D.is(u))) break a;
										P.moveChildren(P.getParent(1));
										P.remove();
									}
								}
							n.dataWrapper = p;
							v = q;
						}
						if (v) {
							P = n.range;
							v = P.document;
							var M;
							p = n.blockLimit;
							w = 0;
							var U,
								O = [],
								S,
								N;
							q = E = 0;
							var Y, aa;
							D = P.startContainer;
							var z = n.endPath.elements[0],
								ba,
								x = z.getPosition(D),
								da =
									!!z.getCommonAncestor(D) &&
									x != CKEDITOR.POSITION_IDENTICAL &&
									!(
										x &
										(CKEDITOR.POSITION_CONTAINS +
											CKEDITOR.POSITION_IS_CONTAINED)
									);
							D = b(n.dataWrapper, n);
							for (m(D, P); w < D.length; w++) {
								x = D[w];
								if ((M = x.isLineBreak)) {
									M = P;
									Y = p;
									var Z = void 0,
										ca = void 0;
									x.hasBlockSibling
										? (M = 1)
										: (Z = M.startContainer.getAscendant(l.$block, 1)) &&
										  Z.is({ div: 1, p: 1 })
										? ((ca = Z.getPosition(Y)),
										  ca == CKEDITOR.POSITION_IDENTICAL ||
										  ca == CKEDITOR.POSITION_CONTAINS
												? (M = 0)
												: ((Y = M.splitElement(Z)),
												  M.moveToPosition(Y, CKEDITOR.POSITION_AFTER_START),
												  (M = 1)))
										: (M = 0);
								}
								if (M) q = 0 < w;
								else {
									M = P.startPath();
									!x.isBlock &&
										k(n.editor, M.block, M.blockLimit) &&
										(N = h(n.editor)) &&
										((N = v.createElement(N)),
										N.appendBogus(),
										P.insertNode(N),
										CKEDITOR.env.needsBrFiller &&
											(U = N.getBogus()) &&
											U.remove(),
										P.moveToPosition(N, CKEDITOR.POSITION_BEFORE_END));
									if ((M = P.startPath().block) && !M.equals(S)) {
										if ((U = M.getBogus())) U.remove(), O.push(M);
										S = M;
									}
									x.firstNotAllowed && (E = 1);
									if (E && x.isElement) {
										M = P.startContainer;
										for (Y = null; M && !l[M.getName()][x.name]; ) {
											if (M.equals(p)) {
												M = null;
												break;
											}
											Y = M;
											M = M.getParent();
										}
										if (M)
											Y &&
												((aa = P.splitElement(Y)),
												n.zombies.push(aa),
												n.zombies.push(Y));
										else {
											Y = p.getName();
											ba = !w;
											M = w == D.length - 1;
											Y = f(x.node, Y);
											for (
												var Z = [],
													ca = Y.length,
													ea = 0,
													ia = void 0,
													ja = 0,
													fa = -1;
												ea < ca;
												ea++
											)
												(ia = Y[ea]),
													" " == ia
														? (ja ||
																(ba && !ea) ||
																(Z.push(new CKEDITOR.dom.text(" ")),
																(fa = Z.length)),
														  (ja = 1))
														: (Z.push(ia), (ja = 0));
											M && fa == Z.length && Z.pop();
											ba = Z;
										}
									}
									if (ba) {
										for (; (M = ba.pop()); ) P.insertNode(M);
										ba = 0;
									} else P.insertNode(x.node);
									x.lastNotAllowed &&
										w < D.length - 1 &&
										((aa = da ? z : aa) &&
											P.setEndAt(aa, CKEDITOR.POSITION_AFTER_START),
										(E = 0));
									P.collapse();
								}
							}
							1 != D.length
								? (U = !1)
								: ((U = D[0]),
								  (U =
										U.isElement &&
										"false" == U.node.getAttribute("contenteditable")));
							U &&
								((q = !0),
								(M = D[0].node),
								P.setStartAt(M, CKEDITOR.POSITION_BEFORE_START),
								P.setEndAt(M, CKEDITOR.POSITION_AFTER_END));
							n.dontMoveCaret = q;
							n.bogusNeededBlocks = O;
						}
						U = n.range;
						var ga;
						aa = n.bogusNeededBlocks;
						for (ba = U.createBookmark(); (S = n.zombies.pop()); )
							S.getParent() &&
								((N = U.clone()),
								N.moveToElementEditStart(S),
								N.removeEmptyBlocksAtEnd());
						if (aa)
							for (; (S = aa.pop()); )
								CKEDITOR.env.needsBrFiller
									? S.appendBogus()
									: S.append(U.document.createText(" "));
						for (; (S = n.mergeCandidates.pop()); ) S.mergeSiblings();
						U.moveToBookmark(ba);
						if (!n.dontMoveCaret) {
							for (S = e(U); S && a(S) && !S.is(l.$empty); ) {
								if (S.isBlockBoundary())
									U.moveToPosition(S, CKEDITOR.POSITION_BEFORE_END);
								else {
									if (g(S) && S.getHtml().match(/(\s|&nbsp;)$/g)) {
										ga = null;
										break;
									}
									ga = U.clone();
									ga.moveToPosition(S, CKEDITOR.POSITION_BEFORE_END);
								}
								S = S.getLast(c);
							}
							ga && U.moveToRange(ga);
						}
					}
				};
			})();
			u = (function () {
				function a(b) {
					b = new CKEDITOR.dom.walker(b);
					b.guard = function (a, b) {
						if (b) return !1;
						if (a.type == CKEDITOR.NODE_ELEMENT)
							return a.is(CKEDITOR.dtd.$tableContent);
					};
					b.evaluator = function (a) {
						return a.type == CKEDITOR.NODE_ELEMENT;
					};
					return b;
				}
				function b(a, c, f) {
					c = a.getDocument().createElement(c);
					a.append(c, f);
					return c;
				}
				function c(a) {
					var b = a.count(),
						f;
					for (b; 0 < b--; )
						(f = a.getItem(b)),
							CKEDITOR.tools.trim(f.getHtml()) ||
								(f.appendBogus(),
								CKEDITOR.env.ie &&
									9 > CKEDITOR.env.version &&
									f.getChildCount() &&
									f.getFirst().remove());
				}
				return function (f) {
					var e = f.startContainer,
						g = e.getAscendant("table", 1),
						d = !1;
					c(g.getElementsByTag("td"));
					c(g.getElementsByTag("th"));
					g = f.clone();
					g.setStart(e, 0);
					g = a(g).lastBackward();
					g ||
						((g = f.clone()),
						g.setEndAt(e, CKEDITOR.POSITION_BEFORE_END),
						(g = a(g).lastForward()),
						(d = !0));
					g || (g = e);
					g.is("table")
						? (f.setStartAt(g, CKEDITOR.POSITION_BEFORE_START),
						  f.collapse(!0),
						  g.remove())
						: (g.is({ tbody: 1, thead: 1, tfoot: 1 }) && (g = b(g, "tr", d)),
						  g.is("tr") &&
								(g = b(g, g.getParent().is("thead") ? "th" : "td", d)),
						  (e = g.getBogus()) && e.remove(),
						  f.moveToPosition(
								g,
								d ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END
						  ));
				};
			})();
			w = (function () {
				function a(b) {
					b = new CKEDITOR.dom.walker(b);
					b.guard = function (a, b) {
						if (b) return !1;
						if (a.type == CKEDITOR.NODE_ELEMENT)
							return a.is(CKEDITOR.dtd.$list) || a.is(CKEDITOR.dtd.$listItem);
					};
					b.evaluator = function (a) {
						return (
							a.type == CKEDITOR.NODE_ELEMENT && a.is(CKEDITOR.dtd.$listItem)
						);
					};
					return b;
				}
				return function (b) {
					var c = b.startContainer,
						f = !1,
						e;
					e = b.clone();
					e.setStart(c, 0);
					e = a(e).lastBackward();
					e ||
						((e = b.clone()),
						e.setEndAt(c, CKEDITOR.POSITION_BEFORE_END),
						(e = a(e).lastForward()),
						(f = !0));
					e || (e = c);
					e.is(CKEDITOR.dtd.$list)
						? (b.setStartAt(e, CKEDITOR.POSITION_BEFORE_START),
						  b.collapse(!0),
						  e.remove())
						: ((c = e.getBogus()) && c.remove(),
						  b.moveToPosition(
								e,
								f ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END
						  ),
						  b.select());
				};
			})();
			q = {
				eol: {
					detect: function (a, b) {
						var c = a.range,
							f = c.clone(),
							e = c.clone(),
							g = new CKEDITOR.dom.elementPath(c.startContainer, b),
							d = new CKEDITOR.dom.elementPath(c.endContainer, b);
						f.collapse(1);
						e.collapse();
						g.block &&
							f.checkBoundaryOfElement(g.block, CKEDITOR.END) &&
							(c.setStartAfter(g.block), (a.prependEolBr = 1));
						d.block &&
							e.checkBoundaryOfElement(d.block, CKEDITOR.START) &&
							(c.setEndBefore(d.block), (a.appendEolBr = 1));
					},
					fix: function (a, b) {
						var c = b.getDocument(),
							f;
						a.appendEolBr && ((f = this.createEolBr(c)), a.fragment.append(f));
						!a.prependEolBr ||
							(f && !f.getPrevious()) ||
							a.fragment.append(this.createEolBr(c), 1);
					},
					createEolBr: function (a) {
						return a.createElement("br", { attributes: { "data-cke-eol": 1 } });
					},
				},
				bogus: {
					exclude: function (a) {
						var b = a.range.getBoundaryNodes(),
							c = b.startNode,
							b = b.endNode;
						!b || !x(b) || (c && c.equals(b)) || a.range.setEndBefore(b);
					},
				},
				tree: {
					rebuild: function (a, b) {
						var c = a.range,
							f = c.getCommonAncestor(),
							e = new CKEDITOR.dom.elementPath(f, b),
							g = new CKEDITOR.dom.elementPath(c.startContainer, b),
							c = new CKEDITOR.dom.elementPath(c.endContainer, b),
							d;
						f.type == CKEDITOR.NODE_TEXT && (f = f.getParent());
						if (e.blockLimit.is({ tr: 1, table: 1 })) {
							var h = e.contains("table").getParent();
							d = function (a) {
								return !a.equals(h);
							};
						} else if (
							e.block &&
							e.block.is(CKEDITOR.dtd.$listItem) &&
							((g = g.contains(CKEDITOR.dtd.$list)),
							(c = c.contains(CKEDITOR.dtd.$list)),
							!g.equals(c))
						) {
							var m = e.contains(CKEDITOR.dtd.$list).getParent();
							d = function (a) {
								return !a.equals(m);
							};
						}
						d ||
							(d = function (a) {
								return !a.equals(e.block) && !a.equals(e.blockLimit);
							});
						this.rebuildFragment(a, b, f, d);
					},
					rebuildFragment: function (a, b, c, f) {
						for (var e; c && !c.equals(b) && f(c); )
							(e = c.clone(0, 1)),
								a.fragment.appendTo(e),
								(a.fragment = e),
								(c = c.getParent());
					},
				},
				cell: {
					shrink: function (a) {
						a = a.range;
						var b = a.startContainer,
							c = a.endContainer,
							f = a.startOffset,
							e = a.endOffset;
						b.type == CKEDITOR.NODE_ELEMENT &&
							b.equals(c) &&
							b.is("tr") &&
							++f == e &&
							a.shrink(CKEDITOR.SHRINK_TEXT);
					},
				},
			};
			z = (function () {
				function a(b, c) {
					var f = b.getParent();
					if (f.is(CKEDITOR.dtd.$inline))
						b[c ? "insertBefore" : "insertAfter"](f);
				}
				function b(c, f, e) {
					a(f);
					a(e, 1);
					for (var g; (g = e.getNext()); ) g.insertAfter(f), (f = g);
					r(c) && c.remove();
				}
				function c(a, b) {
					var f = new CKEDITOR.dom.range(a);
					f.setStartAfter(b.startNode);
					f.setEndBefore(b.endNode);
					return f;
				}
				return {
					list: {
						detectMerge: function (a, b) {
							var f = c(b, a.bookmark),
								e = f.startPath(),
								g = f.endPath(),
								d = e.contains(CKEDITOR.dtd.$list),
								h = g.contains(CKEDITOR.dtd.$list);
							a.mergeList =
								d && h && d.getParent().equals(h.getParent()) && !d.equals(h);
							a.mergeListItems =
								e.block &&
								g.block &&
								e.block.is(CKEDITOR.dtd.$listItem) &&
								g.block.is(CKEDITOR.dtd.$listItem);
							if (a.mergeList || a.mergeListItems)
								(f = f.clone()),
									f.setStartBefore(a.bookmark.startNode),
									f.setEndAfter(a.bookmark.endNode),
									(a.mergeListBookmark = f.createBookmark());
						},
						merge: function (a, c) {
							if (a.mergeListBookmark) {
								var f = a.mergeListBookmark.startNode,
									e = a.mergeListBookmark.endNode,
									g = new CKEDITOR.dom.elementPath(f, c),
									d = new CKEDITOR.dom.elementPath(e, c);
								if (a.mergeList) {
									var h = g.contains(CKEDITOR.dtd.$list),
										m = d.contains(CKEDITOR.dtd.$list);
									h.equals(m) || (m.moveChildren(h), m.remove());
								}
								a.mergeListItems &&
									((g = g.contains(CKEDITOR.dtd.$listItem)),
									(d = d.contains(CKEDITOR.dtd.$listItem)),
									g.equals(d) || b(d, f, e));
								f.remove();
								e.remove();
							}
						},
					},
					block: {
						detectMerge: function (a, b) {
							if (!a.tableContentsRanges && !a.mergeListBookmark) {
								var c = new CKEDITOR.dom.range(b);
								c.setStartBefore(a.bookmark.startNode);
								c.setEndAfter(a.bookmark.endNode);
								a.mergeBlockBookmark = c.createBookmark();
							}
						},
						merge: function (a, c) {
							if (a.mergeBlockBookmark && !a.purgeTableBookmark) {
								var f = a.mergeBlockBookmark.startNode,
									e = a.mergeBlockBookmark.endNode,
									g = new CKEDITOR.dom.elementPath(f, c),
									d = new CKEDITOR.dom.elementPath(e, c),
									g = g.block,
									d = d.block;
								g && d && !g.equals(d) && b(d, f, e);
								f.remove();
								e.remove();
							}
						},
					},
					table: (function () {
						function a(c) {
							var e = [],
								g,
								d = new CKEDITOR.dom.walker(c),
								h = c.startPath().contains(f),
								m = c.endPath().contains(f),
								k = {};
							d.guard = function (a, d) {
								if (a.type == CKEDITOR.NODE_ELEMENT) {
									var n = "visited_" + (d ? "out" : "in");
									if (a.getCustomData(n)) return;
									CKEDITOR.dom.element.setMarker(k, a, n, 1);
								}
								if (d && h && a.equals(h))
									(g = c.clone()),
										g.setEndAt(h, CKEDITOR.POSITION_BEFORE_END),
										e.push(g);
								else if (!d && m && a.equals(m))
									(g = c.clone()),
										g.setStartAt(m, CKEDITOR.POSITION_AFTER_START),
										e.push(g);
								else {
									if ((n = !d))
										n =
											a.type == CKEDITOR.NODE_ELEMENT &&
											a.is(f) &&
											(!h || b(a, h)) &&
											(!m || b(a, m));
									if (!n && (n = d))
										if (a.is(f))
											var n = h && h.getAscendant("table", !0),
												l = m && m.getAscendant("table", !0),
												r = a.getAscendant("table", !0),
												n = (n && n.contains(r)) || (l && l.contains(r));
										else n = void 0;
									n && ((g = c.clone()), g.selectNodeContents(a), e.push(g));
								}
							};
							d.lastForward();
							CKEDITOR.dom.element.clearAllMarkers(k);
							return e;
						}
						function b(a, c) {
							var f =
									CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED,
								e = a.getPosition(c);
							return e === CKEDITOR.POSITION_IDENTICAL ? !1 : 0 === (e & f);
						}
						var f = { td: 1, th: 1, caption: 1 };
						return {
							detectPurge: function (a) {
								var b = a.range,
									c = b.clone();
								c.enlarge(CKEDITOR.ENLARGE_ELEMENT);
								var c = new CKEDITOR.dom.walker(c),
									e = 0;
								c.evaluator = function (a) {
									a.type == CKEDITOR.NODE_ELEMENT && a.is(f) && ++e;
								};
								c.checkForward();
								if (1 < e) {
									var c = b.startPath().contains("table"),
										g = b.endPath().contains("table");
									c &&
										g &&
										b.checkBoundaryOfElement(c, CKEDITOR.START) &&
										b.checkBoundaryOfElement(g, CKEDITOR.END) &&
										((b = a.range.clone()),
										b.setStartBefore(c),
										b.setEndAfter(g),
										(a.purgeTableBookmark = b.createBookmark()));
								}
							},
							detectRanges: function (e, g) {
								var d = c(g, e.bookmark),
									h = d.clone(),
									m,
									k,
									n = d.getCommonAncestor();
								n.is(CKEDITOR.dtd.$tableContent) &&
									!n.is(f) &&
									(n = n.getAscendant("table", !0));
								k = n;
								n = new CKEDITOR.dom.elementPath(d.startContainer, k);
								k = new CKEDITOR.dom.elementPath(d.endContainer, k);
								n = n.contains("table");
								k = k.contains("table");
								if (n || k)
									n && k && b(n, k)
										? ((e.tableSurroundingRange = h),
										  h.setStartAt(n, CKEDITOR.POSITION_AFTER_END),
										  h.setEndAt(k, CKEDITOR.POSITION_BEFORE_START),
										  (h = d.clone()),
										  h.setEndAt(n, CKEDITOR.POSITION_AFTER_END),
										  (m = d.clone()),
										  m.setStartAt(k, CKEDITOR.POSITION_BEFORE_START),
										  (m = a(h).concat(a(m))))
										: n
										? k ||
										  ((e.tableSurroundingRange = h),
										  h.setStartAt(n, CKEDITOR.POSITION_AFTER_END),
										  d.setEndAt(n, CKEDITOR.POSITION_AFTER_END))
										: ((e.tableSurroundingRange = h),
										  h.setEndAt(k, CKEDITOR.POSITION_BEFORE_START),
										  d.setStartAt(k, CKEDITOR.POSITION_AFTER_START)),
										(e.tableContentsRanges = m ? m : a(d));
							},
							deleteRanges: function (a) {
								for (var b; (b = a.tableContentsRanges.pop()); )
									b.extractContents(),
										r(b.startContainer) && b.startContainer.appendBogus();
								a.tableSurroundingRange &&
									a.tableSurroundingRange.extractContents();
							},
							purge: function (a) {
								if (a.purgeTableBookmark) {
									var b = a.doc,
										c = a.range.clone(),
										b = b.createElement("p");
									b.insertBefore(a.purgeTableBookmark.startNode);
									c.moveToBookmark(a.purgeTableBookmark);
									c.deleteContents();
									a.range.moveToPosition(b, CKEDITOR.POSITION_AFTER_START);
								}
							},
						};
					})(),
					detectExtractMerge: function (a) {
						return !(
							a.range.startPath().contains(CKEDITOR.dtd.$listItem) &&
							a.range.endPath().contains(CKEDITOR.dtd.$listItem)
						);
					},
					fixUneditableRangePosition: function (a) {
						a.startContainer.getDtd()["#"] ||
							a.moveToClosestEditablePosition(null, !0);
					},
					autoParagraph: function (a, b) {
						var c = b.startPath(),
							f;
						k(a, c.block, c.blockLimit) &&
							(f = h(a)) &&
							((f = b.document.createElement(f)),
							f.appendBogus(),
							b.insertNode(f),
							b.moveToPosition(f, CKEDITOR.POSITION_AFTER_START));
					},
				};
			})();
		})(),
		(function () {
			function a(a) {
				return (
					CKEDITOR.plugins.widget && CKEDITOR.plugins.widget.isDomWidget(a)
				);
			}
			function d(b, c) {
				if (0 === b.length || a(b[0].getEnclosedNode())) return !1;
				var f, e;
				if ((f = !c && 1 === b.length) && !(f = b[0].collapsed)) {
					var g = b[0];
					f = g.startContainer.getAscendant({ td: 1, th: 1 }, !0);
					var d = g.endContainer.getAscendant({ td: 1, th: 1 }, !0);
					e = CKEDITOR.tools.trim;
					f && f.equals(d) && !f.findOne("td, th, tr, tbody, table")
						? ((g = g.cloneContents()),
						  (f = g.getFirst()
								? e(g.getFirst().getText()) !== e(f.getText())
								: !0))
						: (f = !1);
				}
				if (f) return !1;
				for (e = 0; e < b.length; e++)
					if (((f = b[e]._getTableElement()), !f)) return !1;
				return !0;
			}
			function b(a) {
				function b(a) {
					a = a.find("td, th");
					var c = [],
						f;
					for (f = 0; f < a.count(); f++) c.push(a.getItem(f));
					return c;
				}
				var c = [],
					f,
					e;
				for (e = 0; e < a.length; e++)
					(f = a[e]._getTableElement()),
						f.is && f.is({ td: 1, th: 1 }) ? c.push(f) : (c = c.concat(b(f)));
				return c;
			}
			function c(a) {
				a = b(a);
				var c = "",
					f = [],
					e,
					g;
				for (g = 0; g < a.length; g++)
					e && !e.equals(a[g].getAscendant("tr"))
						? ((c += f.join("\t") + "\n"),
						  (e = a[g].getAscendant("tr")),
						  (f = []))
						: 0 === g && (e = a[g].getAscendant("tr")),
						f.push(a[g].getText());
				return (c += f.join("\t"));
			}
			function g(a) {
				var b = this.root.editor,
					f = b.getSelection(1);
				this.reset();
				t = !0;
				f.root.once(
					"selectionchange",
					function (a) {
						a.cancel();
					},
					null,
					null,
					0
				);
				f.selectRanges([a[0]]);
				f = this._.cache;
				f.ranges = new CKEDITOR.dom.rangeList(a);
				f.type = CKEDITOR.SELECTION_TEXT;
				f.selectedElement = a[0]._getTableElement();
				f.selectedText = c(a);
				f.nativeSel = null;
				this.isFake = 1;
				this.rev = w++;
				b._.fakeSelection = this;
				t = !1;
				this.root.fire("selectionchange");
			}
			function l() {
				var b = this._.fakeSelection,
					c;
				if (b) {
					c = this.getSelection(1);
					var f;
					if (!(f = !c) && (f = !c.isHidden())) {
						f = b;
						var e = c.getRanges(),
							g = f.getRanges(),
							h =
								e.length &&
								e[0]._getTableElement() &&
								e[0]._getTableElement().getAscendant("table", !0),
							m =
								g.length &&
								g[0]._getTableElement() &&
								g[0]._getTableElement().getAscendant("table", !0),
							k =
								1 === e.length &&
								e[0]._getTableElement() &&
								e[0]._getTableElement().is("table"),
							n =
								1 === g.length &&
								g[0]._getTableElement() &&
								g[0]._getTableElement().is("table");
						if (a(f.getSelectedElement())) f = !1;
						else {
							var l = 1 === e.length && e[0].collapsed,
								g = d(e, !!CKEDITOR.env.webkit) && d(g);
							h = h && m ? h.equals(m) || m.contains(h) : !1;
							h && (l || g)
								? (k && !n && f.selectRanges(e), (f = !0))
								: (f = !1);
						}
						f = !f;
					}
					f && (b.reset(), (b = 0));
				}
				if (
					!b &&
					((b = c || this.getSelection(1)),
					!b || b.getType() == CKEDITOR.SELECTION_NONE)
				)
					return;
				this.fire("selectionCheck", b);
				c = this.elementPath();
				c.compare(this._.selectionPreviousPath) ||
					((f =
						this._.selectionPreviousPath &&
						this._.selectionPreviousPath.blockLimit.equals(c.blockLimit)),
					(!CKEDITOR.env.webkit && !CKEDITOR.env.gecko) ||
						f ||
						(this._.previousActive = this.document.getActive()),
					(this._.selectionPreviousPath = c),
					this.fire("selectionChange", { selection: b, path: c }));
			}
			function k() {
				C = !0;
				y || (h.call(this), (y = CKEDITOR.tools.setTimeout(h, 200, this)));
			}
			function h() {
				y = null;
				C && (CKEDITOR.tools.setTimeout(l, 0, this), (C = !1));
			}
			function e(a) {
				return B(a) ||
					(a.type == CKEDITOR.NODE_ELEMENT && !a.is(CKEDITOR.dtd.$empty))
					? !0
					: !1;
			}
			function m(a) {
				function b(c, f) {
					return c && c.type != CKEDITOR.NODE_TEXT
						? a.clone()["moveToElementEdit" + (f ? "End" : "Start")](c)
						: !1;
				}
				if (!(a.root instanceof CKEDITOR.editable)) return !1;
				var c = a.startContainer,
					f = a.getPreviousNode(e, null, c),
					g = a.getNextNode(e, null, c);
				return b(f) ||
					b(g, 1) ||
					!(
						f ||
						g ||
						(c.type == CKEDITOR.NODE_ELEMENT &&
							c.isBlockBoundary() &&
							c.getBogus())
					)
					? !0
					: !1;
			}
			function f(a) {
				n(a, !1);
				var b = a.getDocument().createText(q);
				a.setCustomData("cke-fillingChar", b);
				return b;
			}
			function n(a, b) {
				var c = a && a.removeCustomData("cke-fillingChar");
				if (c) {
					if (!1 !== b) {
						var f = a.getDocument().getSelection().getNative(),
							e = f && "None" != f.type && f.getRangeAt(0),
							g = q.length;
						if (c.getLength() > g && e && e.intersectsNode(c.$)) {
							var d = [
								{ node: f.anchorNode, offset: f.anchorOffset },
								{ node: f.focusNode, offset: f.focusOffset },
							];
							f.anchorNode == c.$ && f.anchorOffset > g && (d[0].offset -= g);
							f.focusNode == c.$ && f.focusOffset > g && (d[1].offset -= g);
						}
					}
					c.setText(r(c.getText(), 1));
					d &&
						((c = a.getDocument().$),
						(f = c.getSelection()),
						(c = c.createRange()),
						c.setStart(d[0].node, d[0].offset),
						c.collapse(!0),
						f.removeAllRanges(),
						f.addRange(c),
						f.extend(d[1].node, d[1].offset));
				}
			}
			function r(a, b) {
				return b
					? a.replace(z, function (a, b) {
							return b ? " " : "";
					  })
					: a.replace(q, "");
			}
			function x(a, b) {
				var c = (b && CKEDITOR.tools.htmlEncode(b)) || "\x26nbsp;",
					c = CKEDITOR.dom.element.createFromHtml(
						'\x3cdiv data-cke-hidden-sel\x3d"1" data-cke-temp\x3d"1" style\x3d"' +
							(CKEDITOR.env.ie && 14 > CKEDITOR.env.version
								? "display:none"
								: "position:fixed;top:0;left:-1000px;width:0;height:0;overflow:hidden;") +
							'"\x3e' +
							c +
							"\x3c/div\x3e",
						a.document
					);
				a.fire("lockSnapshot");
				a.editable().append(c);
				var f = a.getSelection(1),
					e = a.createRange(),
					g = f.root.on(
						"selectionchange",
						function (a) {
							a.cancel();
						},
						null,
						null,
						0
					);
				e.setStartAt(c, CKEDITOR.POSITION_AFTER_START);
				e.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
				f.selectRanges([e]);
				g.removeListener();
				a.fire("unlockSnapshot");
				a._.hiddenSelectionContainer = c;
			}
			function v(a) {
				var b = { 37: 1, 39: 1, 8: 1, 46: 1 };
				return function (c) {
					var f = c.data.getKeystroke();
					if (b[f]) {
						var e = a.getSelection().getRanges(),
							g = e[0];
						1 == e.length &&
							g.collapsed &&
							(f = g[
								38 > f ? "getPreviousEditableNode" : "getNextEditableNode"
							]()) &&
							f.type == CKEDITOR.NODE_ELEMENT &&
							"false" == f.getAttribute("contenteditable") &&
							(a.getSelection().fake(f), c.data.preventDefault(), c.cancel());
					}
				};
			}
			function p(a) {
				for (var b = 0; b < a.length; b++) {
					var c = a[b];
					c.getCommonAncestor().isReadOnly() && a.splice(b, 1);
					if (!c.collapsed) {
						if (c.startContainer.isReadOnly())
							for (
								var f = c.startContainer, e;
								f &&
								!(
									((e = f.type == CKEDITOR.NODE_ELEMENT) && f.is("body")) ||
									!f.isReadOnly()
								);

							)
								e &&
									"false" == f.getAttribute("contentEditable") &&
									c.setStartAfter(f),
									(f = f.getParent());
						f = c.startContainer;
						e = c.endContainer;
						var g = c.startOffset,
							d = c.endOffset,
							h = c.clone();
						f &&
							f.type == CKEDITOR.NODE_TEXT &&
							(g >= f.getLength() ? h.setStartAfter(f) : h.setStartBefore(f));
						e &&
							e.type == CKEDITOR.NODE_TEXT &&
							(d ? h.setEndAfter(e) : h.setEndBefore(e));
						f = new CKEDITOR.dom.walker(h);
						f.evaluator = function (f) {
							if (f.type == CKEDITOR.NODE_ELEMENT && f.isReadOnly()) {
								var e = c.clone();
								c.setEndBefore(f);
								c.collapsed && a.splice(b--, 1);
								f.getPosition(h.endContainer) & CKEDITOR.POSITION_CONTAINS ||
									(e.setStartAfter(f), e.collapsed || a.splice(b + 1, 0, e));
								return !0;
							}
							return !1;
						};
						f.next();
					}
				}
				return a;
			}
			var u = "function" != typeof window.getSelection,
				w = 1,
				q = CKEDITOR.tools.repeat("​", 7),
				z = new RegExp(q + "( )?", "g"),
				t,
				y,
				C,
				B = CKEDITOR.dom.walker.invisible(1),
				A = (function () {
					function a(b) {
						return function (a) {
							var c = a.editor.createRange();
							c.moveToClosestEditablePosition(a.selected, b) &&
								a.editor.getSelection().selectRanges([c]);
							return !1;
						};
					}
					function b(a) {
						return function (b) {
							var c = b.editor,
								f = c.createRange(),
								e;
							if (!c.readOnly)
								return (
									(e = f.moveToClosestEditablePosition(b.selected, a)) ||
										(e = f.moveToClosestEditablePosition(b.selected, !a)),
									e && c.getSelection().selectRanges([f]),
									c.fire("saveSnapshot"),
									b.selected.remove(),
									e ||
										(f.moveToElementEditablePosition(c.editable()),
										c.getSelection().selectRanges([f])),
									c.fire("saveSnapshot"),
									!1
								);
						};
					}
					var c = a(),
						f = a(1);
					return { 37: c, 38: c, 39: f, 40: f, 8: b(), 46: b(1) };
				})();
			CKEDITOR.on("instanceCreated", function (a) {
				function b() {
					var a = c.getSelection();
					a && a.removeAllRanges();
				}
				var c = a.editor;
				c.on("contentDom", function () {
					function a() {
						t = new CKEDITOR.dom.selection(c.getSelection());
						t.lock();
					}
					function b() {
						g.removeListener("mouseup", b);
						m.removeListener("mouseup", b);
						var a = CKEDITOR.document.$.selection,
							c = a.createRange();
						"None" != a.type &&
							c.parentElement() &&
							c.parentElement().ownerDocument == e.$ &&
							c.select();
					}
					function f(a) {
						a = a.getRanges()[0];
						return a
							? (a = a.startContainer.getAscendant(function (a) {
									return (
										a.type == CKEDITOR.NODE_ELEMENT &&
										a.hasAttribute("contenteditable")
									);
							  }, !0)) && "false" === a.getAttribute("contenteditable")
								? a
								: null
							: null;
					}
					var e = c.document,
						g = CKEDITOR.document,
						d = c.editable(),
						h = e.getBody(),
						m = e.getDocumentElement(),
						r = d.isInline(),
						q,
						t;
					CKEDITOR.env.gecko &&
						d.attachListener(
							d,
							"focus",
							function (a) {
								a.removeListener();
								0 !== q &&
									(a = c.getSelection().getNative()) &&
									a.isCollapsed &&
									a.anchorNode == d.$ &&
									((a = c.createRange()),
									a.moveToElementEditStart(d),
									a.select());
							},
							null,
							null,
							-2
						);
					d.attachListener(
						d,
						CKEDITOR.env.webkit || CKEDITOR.env.gecko ? "focusin" : "focus",
						function () {
							if (q && (CKEDITOR.env.webkit || CKEDITOR.env.gecko)) {
								q =
									c._.previousActive &&
									c._.previousActive.equals(e.getActive());
								var a =
									null != c._.previousScrollTop &&
									c._.previousScrollTop != d.$.scrollTop;
								CKEDITOR.env.webkit &&
									q &&
									a &&
									(d.$.scrollTop = c._.previousScrollTop);
							}
							c.unlockSelection(q);
							q = 0;
						},
						null,
						null,
						-1
					);
					d.attachListener(d, "mousedown", function () {
						q = 0;
					});
					if (CKEDITOR.env.ie || r)
						u
							? d.attachListener(d, "beforedeactivate", a, null, null, -1)
							: d.attachListener(c, "selectionCheck", a, null, null, -1),
							d.attachListener(
								d,
								CKEDITOR.env.webkit || CKEDITOR.env.gecko ? "focusout" : "blur",
								function () {
									c.lockSelection(t);
									q = 1;
								},
								null,
								null,
								-1
							),
							d.attachListener(d, "mousedown", function () {
								q = 0;
							});
					if (CKEDITOR.env.ie && !r) {
						var w;
						d.attachListener(d, "mousedown", function (a) {
							2 == a.data.$.button &&
								(((a = c.document.getSelection()) &&
									a.getType() != CKEDITOR.SELECTION_NONE) ||
									(w = c.window.getScrollPosition()));
						});
						d.attachListener(d, "mouseup", function (a) {
							2 == a.data.$.button &&
								w &&
								((c.document.$.documentElement.scrollLeft = w.x),
								(c.document.$.documentElement.scrollTop = w.y));
							w = null;
						});
						if ("BackCompat" != e.$.compatMode) {
							if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) {
								var y, x;
								m.on("mousedown", function (a) {
									function b(a) {
										a = a.data.$;
										if (y) {
											var c = h.$.createTextRange();
											try {
												c.moveToPoint(a.clientX, a.clientY);
											} catch (f) {}
											y.setEndPoint(
												0 > x.compareEndPoints("StartToStart", c)
													? "EndToEnd"
													: "StartToStart",
												c
											);
											y.select();
										}
									}
									function c() {
										m.removeListener("mousemove", b);
										g.removeListener("mouseup", c);
										m.removeListener("mouseup", c);
										y.select();
									}
									a = a.data;
									if (
										a.getTarget().is("html") &&
										a.$.y < m.$.clientHeight &&
										a.$.x < m.$.clientWidth
									) {
										y = h.$.createTextRange();
										try {
											y.moveToPoint(a.$.clientX, a.$.clientY);
										} catch (f) {}
										x = y.duplicate();
										m.on("mousemove", b);
										g.on("mouseup", c);
										m.on("mouseup", c);
									}
								});
							}
							if (7 < CKEDITOR.env.version && 11 > CKEDITOR.env.version)
								m.on("mousedown", function (a) {
									a.data.getTarget().is("html") &&
										(g.on("mouseup", b), m.on("mouseup", b));
								});
						}
					}
					d.attachListener(d, "selectionchange", l, c);
					d.attachListener(d, "keyup", k, c);
					d.attachListener(d, "touchstart", k, c);
					d.attachListener(d, "touchend", k, c);
					CKEDITOR.env.ie &&
						d.attachListener(
							d,
							"keydown",
							function (a) {
								var b = this.getSelection(1),
									c = f(b);
								c &&
									!c.equals(d) &&
									(b.selectElement(c), a.data.preventDefault());
							},
							c
						);
					d.attachListener(
						d,
						CKEDITOR.env.webkit || CKEDITOR.env.gecko ? "focusin" : "focus",
						function () {
							c.forceNextSelectionCheck();
							c.selectionChange(1);
						}
					);
					if (r && (CKEDITOR.env.webkit || CKEDITOR.env.gecko)) {
						var z;
						d.attachListener(d, "mousedown", function () {
							z = 1;
						});
						d.attachListener(e.getDocumentElement(), "mouseup", function () {
							z && k.call(c);
							z = 0;
						});
					} else
						d.attachListener(
							CKEDITOR.env.ie ? d : e.getDocumentElement(),
							"mouseup",
							k,
							c
						);
					CKEDITOR.env.webkit &&
						d.attachListener(
							e,
							"keydown",
							function (a) {
								switch (a.data.getKey()) {
									case 13:
									case 33:
									case 34:
									case 35:
									case 36:
									case 37:
									case 39:
									case 8:
									case 45:
									case 46:
										d.hasFocus && n(d);
								}
							},
							null,
							null,
							-1
						);
					d.attachListener(d, "keydown", v(c), null, null, -1);
				});
				c.on("setData", function () {
					c.unlockSelection();
					CKEDITOR.env.webkit && b();
				});
				c.on("contentDomUnload", function () {
					c.unlockSelection();
				});
				if (CKEDITOR.env.ie9Compat) c.on("beforeDestroy", b, null, null, 9);
				c.on("dataReady", function () {
					delete c._.fakeSelection;
					delete c._.hiddenSelectionContainer;
					c.selectionChange(1);
				});
				c.on(
					"loadSnapshot",
					function () {
						var a = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT),
							b = c.editable().getLast(a);
						b &&
							b.hasAttribute("data-cke-hidden-sel") &&
							(b.remove(),
							CKEDITOR.env.gecko &&
								(a = c.editable().getFirst(a)) &&
								a.is("br") &&
								a.getAttribute("_moz_editor_bogus_node") &&
								a.remove());
					},
					null,
					null,
					100
				);
				c.on("key", function (a) {
					if ("wysiwyg" == c.mode) {
						var b = c.getSelection();
						if (b.isFake) {
							var f = A[a.data.keyCode];
							if (f)
								return f({
									editor: c,
									selected: b.getSelectedElement(),
									selection: b,
									keyEvent: a,
								});
						}
					}
				});
			});
			if (CKEDITOR.env.webkit)
				CKEDITOR.on("instanceReady", function (a) {
					var b = a.editor;
					b.on(
						"selectionChange",
						function () {
							var a = b.editable(),
								c = a.getCustomData("cke-fillingChar");
							c &&
								(c.getCustomData("ready")
									? (n(a), a.editor.fire("selectionCheck"))
									: c.setCustomData("ready", 1));
						},
						null,
						null,
						-1
					);
					b.on(
						"beforeSetMode",
						function () {
							n(b.editable());
						},
						null,
						null,
						-1
					);
					b.on(
						"getSnapshot",
						function (a) {
							a.data && (a.data = r(a.data));
						},
						b,
						null,
						20
					);
					b.on(
						"toDataFormat",
						function (a) {
							a.data.dataValue = r(a.data.dataValue);
						},
						null,
						null,
						0
					);
				});
			CKEDITOR.editor.prototype.selectionChange = function (a) {
				(a ? l : k).call(this);
			};
			CKEDITOR.editor.prototype.getSelection = function (a) {
				return (!this._.savedSelection && !this._.fakeSelection) || a
					? (a = this.editable()) && "wysiwyg" == this.mode
						? new CKEDITOR.dom.selection(a)
						: null
					: this._.savedSelection || this._.fakeSelection;
			};
			CKEDITOR.editor.prototype.lockSelection = function (a) {
				a = a || this.getSelection(1);
				return a.getType() != CKEDITOR.SELECTION_NONE
					? (!a.isLocked && a.lock(), (this._.savedSelection = a), !0)
					: !1;
			};
			CKEDITOR.editor.prototype.unlockSelection = function (a) {
				var b = this._.savedSelection;
				return b ? (b.unlock(a), delete this._.savedSelection, !0) : !1;
			};
			CKEDITOR.editor.prototype.forceNextSelectionCheck = function () {
				delete this._.selectionPreviousPath;
			};
			CKEDITOR.dom.document.prototype.getSelection = function () {
				return new CKEDITOR.dom.selection(this);
			};
			CKEDITOR.dom.range.prototype.select = function () {
				var a =
					this.root instanceof CKEDITOR.editable
						? this.root.editor.getSelection()
						: new CKEDITOR.dom.selection(this.root);
				a.selectRanges([this]);
				return a;
			};
			CKEDITOR.SELECTION_NONE = 1;
			CKEDITOR.SELECTION_TEXT = 2;
			CKEDITOR.SELECTION_ELEMENT = 3;
			CKEDITOR.dom.selection = function (a) {
				if (a instanceof CKEDITOR.dom.selection) {
					var b = a;
					a = a.root;
				}
				var c = a instanceof CKEDITOR.dom.element;
				this.rev = b ? b.rev : w++;
				this.document =
					a instanceof CKEDITOR.dom.document ? a : a.getDocument();
				this.root = c ? a : this.document.getBody();
				this.isLocked = 0;
				this._ = { cache: {} };
				if (b)
					return (
						CKEDITOR.tools.extend(this._.cache, b._.cache),
						(this.isFake = b.isFake),
						(this.isLocked = b.isLocked),
						this
					);
				a = this.getNative();
				var f, e;
				if (a)
					if (a.getRangeAt)
						f =
							(e = a.rangeCount && a.getRangeAt(0)) &&
							new CKEDITOR.dom.node(e.commonAncestorContainer);
					else {
						try {
							e = a.createRange();
						} catch (g) {}
						f =
							e &&
							CKEDITOR.dom.element.get(
								(e.item && e.item(0)) || e.parentElement()
							);
					}
				if (
					!f ||
					(f.type != CKEDITOR.NODE_ELEMENT && f.type != CKEDITOR.NODE_TEXT) ||
					(!this.root.equals(f) && !this.root.contains(f))
				)
					(this._.cache.type = CKEDITOR.SELECTION_NONE),
						(this._.cache.startElement = null),
						(this._.cache.selectedElement = null),
						(this._.cache.selectedText = ""),
						(this._.cache.ranges = new CKEDITOR.dom.rangeList());
				return this;
			};
			var H = {
				img: 1,
				hr: 1,
				li: 1,
				table: 1,
				tr: 1,
				td: 1,
				th: 1,
				embed: 1,
				object: 1,
				ol: 1,
				ul: 1,
				a: 1,
				input: 1,
				form: 1,
				select: 1,
				textarea: 1,
				button: 1,
				fieldset: 1,
				thead: 1,
				tfoot: 1,
			};
			CKEDITOR.tools.extend(CKEDITOR.dom.selection, {
				_removeFillingCharSequenceString: r,
				_createFillingCharSequenceNode: f,
				FILLING_CHAR_SEQUENCE: q,
			});
			CKEDITOR.dom.selection.prototype = {
				getNative: function () {
					return void 0 !== this._.cache.nativeSel
						? this._.cache.nativeSel
						: (this._.cache.nativeSel = u
								? this.document.$.selection
								: this.document.getWindow().$.getSelection());
				},
				getType: u
					? function () {
							var a = this._.cache;
							if (a.type) return a.type;
							var b = CKEDITOR.SELECTION_NONE;
							try {
								var c = this.getNative(),
									f = c.type;
								"Text" == f && (b = CKEDITOR.SELECTION_TEXT);
								"Control" == f && (b = CKEDITOR.SELECTION_ELEMENT);
								c.createRange().parentElement() &&
									(b = CKEDITOR.SELECTION_TEXT);
							} catch (e) {}
							return (a.type = b);
					  }
					: function () {
							var a = this._.cache;
							if (a.type) return a.type;
							var b = CKEDITOR.SELECTION_TEXT,
								c = this.getNative();
							if (!c || !c.rangeCount) b = CKEDITOR.SELECTION_NONE;
							else if (1 == c.rangeCount) {
								var c = c.getRangeAt(0),
									f = c.startContainer;
								f == c.endContainer &&
									1 == f.nodeType &&
									1 == c.endOffset - c.startOffset &&
									H[f.childNodes[c.startOffset].nodeName.toLowerCase()] &&
									(b = CKEDITOR.SELECTION_ELEMENT);
							}
							return (a.type = b);
					  },
				getRanges: (function () {
					var a = u
						? (function () {
								function a(b) {
									return new CKEDITOR.dom.node(b).getIndex();
								}
								var b = function (b, c) {
									b = b.duplicate();
									b.collapse(c);
									var f = b.parentElement();
									if (!f.hasChildNodes()) return { container: f, offset: 0 };
									for (
										var e = f.children,
											g,
											d,
											h = b.duplicate(),
											m = 0,
											k = e.length - 1,
											n = -1,
											l,
											r;
										m <= k;

									)
										if (
											((n = Math.floor((m + k) / 2)),
											(g = e[n]),
											h.moveToElementText(g),
											(l = h.compareEndPoints("StartToStart", b)),
											0 < l)
										)
											k = n - 1;
										else if (0 > l) m = n + 1;
										else return { container: f, offset: a(g) };
									if (-1 == n || (n == e.length - 1 && 0 > l)) {
										h.moveToElementText(f);
										h.setEndPoint("StartToStart", b);
										h = h.text.replace(/(\r\n|\r)/g, "\n").length;
										e = f.childNodes;
										if (!h)
											return (
												(g = e[e.length - 1]),
												g.nodeType != CKEDITOR.NODE_TEXT
													? { container: f, offset: e.length }
													: { container: g, offset: g.nodeValue.length }
											);
										for (f = e.length; 0 < h && 0 < f; )
											(d = e[--f]),
												d.nodeType == CKEDITOR.NODE_TEXT &&
													((r = d), (h -= d.nodeValue.length));
										return { container: r, offset: -h };
									}
									h.collapse(0 < l ? !0 : !1);
									h.setEndPoint(0 < l ? "StartToStart" : "EndToStart", b);
									h = h.text.replace(/(\r\n|\r)/g, "\n").length;
									if (!h)
										return { container: f, offset: a(g) + (0 < l ? 0 : 1) };
									for (; 0 < h; )
										try {
											(d = g[0 < l ? "previousSibling" : "nextSibling"]),
												d.nodeType == CKEDITOR.NODE_TEXT &&
													((h -= d.nodeValue.length), (r = d)),
												(g = d);
										} catch (q) {
											return { container: f, offset: a(g) };
										}
									return {
										container: r,
										offset: 0 < l ? -h : r.nodeValue.length + h,
									};
								};
								return function () {
									var a = this.getNative(),
										c = a && a.createRange(),
										f = this.getType();
									if (!a) return [];
									if (f == CKEDITOR.SELECTION_TEXT)
										return (
											(a = new CKEDITOR.dom.range(this.root)),
											(f = b(c, !0)),
											a.setStart(new CKEDITOR.dom.node(f.container), f.offset),
											(f = b(c)),
											a.setEnd(new CKEDITOR.dom.node(f.container), f.offset),
											a.endContainer.getPosition(a.startContainer) &
												CKEDITOR.POSITION_PRECEDING &&
												a.endOffset <= a.startContainer.getIndex() &&
												a.collapse(),
											[a]
										);
									if (f == CKEDITOR.SELECTION_ELEMENT) {
										for (var f = [], e = 0; e < c.length; e++) {
											for (
												var g = c.item(e),
													d = g.parentNode,
													h = 0,
													a = new CKEDITOR.dom.range(this.root);
												h < d.childNodes.length && d.childNodes[h] != g;
												h++
											);
											a.setStart(new CKEDITOR.dom.node(d), h);
											a.setEnd(new CKEDITOR.dom.node(d), h + 1);
											f.push(a);
										}
										return f;
									}
									return [];
								};
						  })()
						: function () {
								var a = [],
									b,
									c = this.getNative();
								if (!c) return a;
								for (var f = 0; f < c.rangeCount; f++) {
									var e = c.getRangeAt(f);
									b = new CKEDITOR.dom.range(this.root);
									b.setStart(
										new CKEDITOR.dom.node(e.startContainer),
										e.startOffset
									);
									b.setEnd(new CKEDITOR.dom.node(e.endContainer), e.endOffset);
									a.push(b);
								}
								return a;
						  };
					return function (b) {
						var c = this._.cache,
							f = c.ranges;
						f || (c.ranges = f = new CKEDITOR.dom.rangeList(a.call(this)));
						return b ? p(new CKEDITOR.dom.rangeList(f.slice())) : f;
					};
				})(),
				getStartElement: function () {
					var a = this._.cache;
					if (void 0 !== a.startElement) return a.startElement;
					var b;
					switch (this.getType()) {
						case CKEDITOR.SELECTION_ELEMENT:
							return this.getSelectedElement();
						case CKEDITOR.SELECTION_TEXT:
							var c = this.getRanges()[0];
							if (c) {
								if (c.collapsed)
									(b = c.startContainer),
										b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent());
								else {
									for (
										c.optimize();
										(b = c.startContainer),
											c.startOffset ==
												(b.getChildCount ? b.getChildCount() : b.getLength()) &&
												!b.isBlockBoundary();

									)
										c.setStartAfter(b);
									b = c.startContainer;
									if (b.type != CKEDITOR.NODE_ELEMENT) return b.getParent();
									if (
										(b = b.getChild(c.startOffset)) &&
										b.type == CKEDITOR.NODE_ELEMENT
									)
										for (
											c = b.getFirst();
											c && c.type == CKEDITOR.NODE_ELEMENT;

										)
											(b = c), (c = c.getFirst());
									else b = c.startContainer;
								}
								b = b.$;
							}
					}
					return (a.startElement = b ? new CKEDITOR.dom.element(b) : null);
				},
				getSelectedElement: function () {
					var a = this._.cache;
					if (void 0 !== a.selectedElement) return a.selectedElement;
					var b = this,
						c = CKEDITOR.tools.tryThese(
							function () {
								return b.getNative().createRange().item(0);
							},
							function () {
								for (
									var a = b.getRanges()[0].clone(), c, f, e = 2;
									e &&
									!(
										(c = a.getEnclosedNode()) &&
										c.type == CKEDITOR.NODE_ELEMENT &&
										H[c.getName()] &&
										(f = c)
									);
									e--
								)
									a.shrink(CKEDITOR.SHRINK_ELEMENT);
								return f && f.$;
							}
						);
					return (a.selectedElement = c ? new CKEDITOR.dom.element(c) : null);
				},
				getSelectedText: function () {
					var a = this._.cache;
					if (void 0 !== a.selectedText) return a.selectedText;
					var b = this.getNative(),
						b = u
							? "Control" == b.type
								? ""
								: b.createRange().text
							: b.toString();
					return (a.selectedText = b);
				},
				lock: function () {
					this.getRanges();
					this.getStartElement();
					this.getSelectedElement();
					this.getSelectedText();
					this._.cache.nativeSel = null;
					this.isLocked = 1;
				},
				unlock: function (a) {
					if (this.isLocked) {
						if (a)
							var b = this.getSelectedElement(),
								c = this.getRanges(),
								f = this.isFake;
						this.isLocked = 0;
						this.reset();
						a &&
							(a = b || (c[0] && c[0].getCommonAncestor())) &&
							a.getAscendant("body", 1) &&
							(d(c)
								? g.call(this, c)
								: f
								? this.fake(b)
								: b
								? this.selectElement(b)
								: this.selectRanges(c));
					}
				},
				reset: function () {
					this._.cache = {};
					this.isFake = 0;
					var a = this.root.editor;
					if (a && a._.fakeSelection)
						if (this.rev == a._.fakeSelection.rev) {
							delete a._.fakeSelection;
							var b = a._.hiddenSelectionContainer;
							if (b) {
								var c = a.checkDirty();
								a.fire("lockSnapshot");
								b.remove();
								a.fire("unlockSnapshot");
								!c && a.resetDirty();
							}
							delete a._.hiddenSelectionContainer;
						} else CKEDITOR.warn("selection-fake-reset");
					this.rev = w++;
				},
				selectElement: function (a) {
					var b = new CKEDITOR.dom.range(this.root);
					b.setStartBefore(a);
					b.setEndAfter(a);
					this.selectRanges([b]);
				},
				selectRanges: function (a) {
					var b = this.root.editor,
						c = b && b._.hiddenSelectionContainer;
					this.reset();
					if (c)
						for (var c = this.root, e, h = 0; h < a.length; ++h)
							(e = a[h]),
								e.endContainer.equals(c) &&
									(e.endOffset = Math.min(e.endOffset, c.getChildCount()));
					if (a.length)
						if (this.isLocked) {
							var k = CKEDITOR.document.getActive();
							this.unlock();
							this.selectRanges(a);
							this.lock();
							k && !k.equals(this.root) && k.focus();
						} else {
							var l;
							a: {
								var r, q;
								if (
									1 == a.length &&
									!(q = a[0]).collapsed &&
									(l = q.getEnclosedNode()) &&
									l.type == CKEDITOR.NODE_ELEMENT &&
									((q = q.clone()),
									q.shrink(CKEDITOR.SHRINK_ELEMENT, !0),
									(r = q.getEnclosedNode()) &&
										r.type == CKEDITOR.NODE_ELEMENT &&
										(l = r),
									"false" == l.getAttribute("contenteditable"))
								)
									break a;
								l = void 0;
							}
							if (l) this.fake(l);
							else if (
								b &&
								b.plugins.tableselection &&
								CKEDITOR.plugins.tableselection.isSupportedEnvironment &&
								d(a) &&
								!t
							)
								g.call(this, a);
							else {
								if (u) {
									r = CKEDITOR.dom.walker.whitespaces(!0);
									l = /\ufeff|\u00a0/;
									q = { table: 1, tbody: 1, tr: 1 };
									1 < a.length &&
										((b = a[a.length - 1]),
										a[0].setEnd(b.endContainer, b.endOffset));
									b = a[0];
									a = b.collapsed;
									var w, y, z;
									if (
										(c = b.getEnclosedNode()) &&
										c.type == CKEDITOR.NODE_ELEMENT &&
										c.getName() in H &&
										(!c.is("a") || !c.getText())
									)
										try {
											z = c.$.createControlRange();
											z.addElement(c.$);
											z.select();
											return;
										} catch (x) {}
									if (
										(b.startContainer.type == CKEDITOR.NODE_ELEMENT &&
											b.startContainer.getName() in q) ||
										(b.endContainer.type == CKEDITOR.NODE_ELEMENT &&
											b.endContainer.getName() in q)
									)
										b.shrink(CKEDITOR.NODE_ELEMENT, !0), (a = b.collapsed);
									z = b.createBookmark();
									q = z.startNode;
									a || (k = z.endNode);
									z = b.document.$.body.createTextRange();
									z.moveToElementText(q.$);
									z.moveStart("character", 1);
									k
										? ((l = b.document.$.body.createTextRange()),
										  l.moveToElementText(k.$),
										  z.setEndPoint("EndToEnd", l),
										  z.moveEnd("character", -1))
										: ((w = q.getNext(r)),
										  (y = q.hasAscendant("pre")),
										  (w =
												!(w && w.getText && w.getText().match(l)) &&
												(y ||
													!q.hasPrevious() ||
													(q.getPrevious().is && q.getPrevious().is("br")))),
										  (y = b.document.createElement("span")),
										  y.setHtml("\x26#65279;"),
										  y.insertBefore(q),
										  w && b.document.createText("﻿").insertBefore(q));
									b.setStartBefore(q);
									q.remove();
									a
										? (w
												? (z.moveStart("character", -1),
												  z.select(),
												  b.document.$.selection.clear())
												: z.select(),
										  b.moveToPosition(y, CKEDITOR.POSITION_BEFORE_START),
										  y.remove())
										: (b.setEndBefore(k), k.remove(), z.select());
								} else {
									k = this.getNative();
									if (!k) return;
									this.removeAllRanges();
									for (z = 0; z < a.length; z++) {
										if (
											z < a.length - 1 &&
											((w = a[z]),
											(y = a[z + 1]),
											(l = w.clone()),
											l.setStart(w.endContainer, w.endOffset),
											l.setEnd(y.startContainer, y.startOffset),
											!l.collapsed &&
												(l.shrink(CKEDITOR.NODE_ELEMENT, !0),
												(b = l.getCommonAncestor()),
												(l = l.getEnclosedNode()),
												b.isReadOnly() || (l && l.isReadOnly())))
										) {
											y.setStart(w.startContainer, w.startOffset);
											a.splice(z--, 1);
											continue;
										}
										b = a[z];
										y = this.document.$.createRange();
										b.collapsed &&
											CKEDITOR.env.webkit &&
											m(b) &&
											((l = f(this.root)),
											b.insertNode(l),
											(w = l.getNext()) &&
											!l.getPrevious() &&
											w.type == CKEDITOR.NODE_ELEMENT &&
											"br" == w.getName()
												? (n(this.root),
												  b.moveToPosition(w, CKEDITOR.POSITION_BEFORE_START))
												: b.moveToPosition(l, CKEDITOR.POSITION_AFTER_END));
										y.setStart(b.startContainer.$, b.startOffset);
										try {
											y.setEnd(b.endContainer.$, b.endOffset);
										} catch (v) {
											if (0 <= v.toString().indexOf("NS_ERROR_ILLEGAL_VALUE"))
												b.collapse(1), y.setEnd(b.endContainer.$, b.endOffset);
											else throw v;
										}
										k.addRange(y);
									}
								}
								this.reset();
								this.root.fire("selectionchange");
							}
						}
				},
				fake: function (a, b) {
					var c = this.root.editor;
					void 0 === b &&
						a.hasAttribute("aria-label") &&
						(b = a.getAttribute("aria-label"));
					this.reset();
					x(c, b);
					var f = this._.cache,
						e = new CKEDITOR.dom.range(this.root);
					e.setStartBefore(a);
					e.setEndAfter(a);
					f.ranges = new CKEDITOR.dom.rangeList(e);
					f.selectedElement = f.startElement = a;
					f.type = CKEDITOR.SELECTION_ELEMENT;
					f.selectedText = f.nativeSel = null;
					this.isFake = 1;
					this.rev = w++;
					c._.fakeSelection = this;
					this.root.fire("selectionchange");
				},
				isHidden: function () {
					var a = this.getCommonAncestor();
					a && a.type == CKEDITOR.NODE_TEXT && (a = a.getParent());
					return !(!a || !a.data("cke-hidden-sel"));
				},
				isInTable: function (a) {
					return d(this.getRanges(), a);
				},
				isCollapsed: function () {
					var a = this.getRanges();
					return 1 === a.length && a[0].collapsed;
				},
				createBookmarks: function (a) {
					a = this.getRanges().createBookmarks(a);
					this.isFake && (a.isFake = 1);
					return a;
				},
				createBookmarks2: function (a) {
					a = this.getRanges().createBookmarks2(a);
					this.isFake && (a.isFake = 1);
					return a;
				},
				selectBookmarks: function (a) {
					for (var b = [], c, f = 0; f < a.length; f++) {
						var e = new CKEDITOR.dom.range(this.root);
						e.moveToBookmark(a[f]);
						b.push(e);
					}
					a.isFake &&
						((c = d(b) ? b[0]._getTableElement() : b[0].getEnclosedNode()),
						(c && c.type == CKEDITOR.NODE_ELEMENT) ||
							(CKEDITOR.warn("selection-not-fake"), (a.isFake = 0)));
					a.isFake && !d(b) ? this.fake(c) : this.selectRanges(b);
					return this;
				},
				getCommonAncestor: function () {
					var a = this.getRanges();
					return a.length
						? a[0].startContainer.getCommonAncestor(
								a[a.length - 1].endContainer
						  )
						: null;
				},
				scrollIntoView: function () {
					this.type != CKEDITOR.SELECTION_NONE &&
						this.getRanges()[0].scrollIntoView();
				},
				removeAllRanges: function () {
					if (this.getType() != CKEDITOR.SELECTION_NONE) {
						var a = this.getNative();
						try {
							a && a[u ? "empty" : "removeAllRanges"]();
						} catch (b) {}
						this.reset();
					}
				},
			};
		})(),
		"use strict",
		(CKEDITOR.STYLE_BLOCK = 1),
		(CKEDITOR.STYLE_INLINE = 2),
		(CKEDITOR.STYLE_OBJECT = 3),
		(function () {
			function a(a, b) {
				for (var c, f; (a = a.getParent()) && !a.equals(b); )
					if (a.getAttribute("data-nostyle")) c = a;
					else if (!f) {
						var e = a.getAttribute("contentEditable");
						"false" == e ? (c = a) : "true" == e && (f = 1);
					}
				return c;
			}
			function d(a, b, c, f) {
				return (a.getPosition(b) | f) == f && (!c.childRule || c.childRule(a));
			}
			function b(c) {
				var f = c.document;
				if (c.collapsed)
					(f = w(this, f)),
						c.insertNode(f),
						c.moveToPosition(f, CKEDITOR.POSITION_BEFORE_END);
				else {
					var e = this.element,
						h = this._.definition,
						m,
						k = h.ignoreReadonly,
						n = k || h.includeReadonly;
					null == n && (n = c.root.getCustomData("cke_includeReadonly"));
					var l = CKEDITOR.dtd[e];
					l || ((m = !0), (l = CKEDITOR.dtd.span));
					c.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
					c.trim();
					var r = c.createBookmark(),
						q = r.startNode,
						u = r.endNode,
						t = q,
						y;
					if (!k) {
						var z = c.getCommonAncestor(),
							k = a(q, z),
							z = a(u, z);
						k && (t = k.getNextSourceNode(!0));
						z && (u = z);
					}
					for (
						t.getPosition(u) == CKEDITOR.POSITION_FOLLOWING && (t = 0);
						t;

					) {
						k = !1;
						if (t.equals(u)) (t = null), (k = !0);
						else {
							var x = t.type == CKEDITOR.NODE_ELEMENT ? t.getName() : null,
								z = x && "false" == t.getAttribute("contentEditable"),
								p = x && t.getAttribute("data-nostyle");
							if (
								(x && t.data("cke-bookmark")) ||
								t.type === CKEDITOR.NODE_COMMENT
							) {
								t = t.getNextSourceNode(!0);
								continue;
							}
							if (z && n && CKEDITOR.dtd.$block[x])
								for (
									var B = t,
										A = g(B),
										C = void 0,
										H = A.length,
										ea = 0,
										B = H && new CKEDITOR.dom.range(B.getDocument());
									ea < H;
									++ea
								) {
									var C = A[ea],
										G = CKEDITOR.filter.instances[C.data("cke-filter")];
									if (G ? G.check(this) : 1)
										B.selectNodeContents(C), b.call(this, B);
								}
							A = x ? (!l[x] || p ? 0 : z && !n ? 0 : d(t, u, h, L)) : 1;
							if (A)
								if (
									((C = t.getParent()),
									(A = h),
									(H = e),
									(ea = m),
									!C ||
										(!(C.getDtd() || CKEDITOR.dtd.span)[H] && !ea) ||
										(A.parentRule && !A.parentRule(C)))
								)
									k = !0;
								else {
									if (
										(y ||
											(x &&
												CKEDITOR.dtd.$removeEmpty[x] &&
												(t.getPosition(u) | L) != L) ||
											((y = c.clone()), y.setStartBefore(t)),
										(x = t.type),
										x == CKEDITOR.NODE_TEXT ||
											z ||
											(x == CKEDITOR.NODE_ELEMENT && !t.getChildCount()))
									) {
										for (
											var x = t, J;
											(k = !x.getNext(E)) &&
											((J = x.getParent()), l[J.getName()]) &&
											d(J, q, h, I);

										)
											x = J;
										y.setEndAfter(x);
									}
								}
							else k = !0;
							t = t.getNextSourceNode(p || z);
						}
						if (k && y && !y.collapsed) {
							for (
								var k = w(this, f),
									z = k.hasAttributes(),
									p = y.getCommonAncestor(),
									x = {},
									A = {},
									C = {},
									H = {},
									fa,
									F,
									ha;
								k && p;

							) {
								if (p.getName() == e) {
									for (fa in h.attributes)
										!H[fa] &&
											(ha = p.getAttribute(F)) &&
											(k.getAttribute(fa) == ha ? (A[fa] = 1) : (H[fa] = 1));
									for (F in h.styles)
										!C[F] &&
											(ha = p.getStyle(F)) &&
											(k.getStyle(F) == ha ? (x[F] = 1) : (C[F] = 1));
								}
								p = p.getParent();
							}
							for (fa in A) k.removeAttribute(fa);
							for (F in x) k.removeStyle(F);
							z && !k.hasAttributes() && (k = null);
							k
								? (y.extractContents().appendTo(k),
								  y.insertNode(k),
								  v.call(this, k),
								  k.mergeSiblings(),
								  CKEDITOR.env.ie || k.$.normalize())
								: ((k = new CKEDITOR.dom.element("span")),
								  y.extractContents().appendTo(k),
								  y.insertNode(k),
								  v.call(this, k),
								  k.remove(!0));
							y = null;
						}
					}
					c.moveToBookmark(r);
					c.shrink(CKEDITOR.SHRINK_TEXT);
					c.shrink(CKEDITOR.NODE_ELEMENT, !0);
				}
			}
			function c(a) {
				function b() {
					for (
						var a = new CKEDITOR.dom.elementPath(f.getParent()),
							c = new CKEDITOR.dom.elementPath(n.getParent()),
							e = null,
							g = null,
							d = 0;
						d < a.elements.length;
						d++
					) {
						var h = a.elements[d];
						if (h == a.block || h == a.blockLimit) break;
						l.checkElementRemovable(h, !0) && (e = h);
					}
					for (d = 0; d < c.elements.length; d++) {
						h = c.elements[d];
						if (h == c.block || h == c.blockLimit) break;
						l.checkElementRemovable(h, !0) && (g = h);
					}
					g && n.breakParent(g);
					e && f.breakParent(e);
				}
				a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
				var c = a.createBookmark(),
					f = c.startNode,
					e = this._.definition.alwaysRemoveElement;
				if (a.collapsed) {
					for (
						var g = new CKEDITOR.dom.elementPath(f.getParent(), a.root),
							d,
							h = 0,
							m;
						h < g.elements.length &&
						(m = g.elements[h]) &&
						m != g.block &&
						m != g.blockLimit;
						h++
					)
						if (this.checkElementRemovable(m)) {
							var k;
							!e &&
							a.collapsed &&
							(a.checkBoundaryOfElement(m, CKEDITOR.END) ||
								(k = a.checkBoundaryOfElement(m, CKEDITOR.START)))
								? ((d = m), (d.match = k ? "start" : "end"))
								: (m.mergeSiblings(),
								  m.is(this.element)
										? x.call(this, m)
										: p(m, t(this)[m.getName()]));
						}
					if (d) {
						e = f;
						for (h = 0; ; h++) {
							m = g.elements[h];
							if (m.equals(d)) break;
							else if (m.match) continue;
							else m = m.clone();
							m.append(e);
							e = m;
						}
						e["start" == d.match ? "insertBefore" : "insertAfter"](d);
					}
				} else {
					var n = c.endNode,
						l = this;
					b();
					for (g = f; !g.equals(n); )
						(d = g.getNextSourceNode()),
							g.type == CKEDITOR.NODE_ELEMENT &&
								this.checkElementRemovable(g) &&
								(g.getName() == this.element
									? x.call(this, g)
									: p(g, t(this)[g.getName()]),
								d.type == CKEDITOR.NODE_ELEMENT &&
									d.contains(f) &&
									(b(), (d = f.getNext()))),
							(g = d);
				}
				a.moveToBookmark(c);
				a.shrink(CKEDITOR.NODE_ELEMENT, !0);
			}
			function g(a) {
				var b = [];
				a.forEach(
					function (a) {
						if ("true" == a.getAttribute("contenteditable"))
							return b.push(a), !1;
					},
					CKEDITOR.NODE_ELEMENT,
					!0
				);
				return b;
			}
			function l(a) {
				var b = a.getEnclosedNode() || a.getCommonAncestor(!1, !0);
				(a = new CKEDITOR.dom.elementPath(b, a.root).contains(
					this.element,
					1
				)) &&
					!a.isReadOnly() &&
					q(a, this);
			}
			function k(a) {
				var b = a.getCommonAncestor(!0, !0);
				if (
					(a = new CKEDITOR.dom.elementPath(b, a.root).contains(
						this.element,
						1
					))
				) {
					var b = this._.definition,
						c = b.attributes;
					if (c) for (var f in c) a.removeAttribute(f, c[f]);
					if (b.styles)
						for (var e in b.styles)
							b.styles.hasOwnProperty(e) && a.removeStyle(e);
				}
			}
			function h(a) {
				var b = a.createBookmark(!0),
					c = a.createIterator();
				c.enforceRealBlocks = !0;
				this._.enterMode &&
					(c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR);
				for (var f, e = a.document, g; (f = c.getNextParagraph()); )
					!f.isReadOnly() &&
						(c.activeFilter ? c.activeFilter.check(this) : 1) &&
						((g = w(this, e, f)), m(f, g));
				a.moveToBookmark(b);
			}
			function e(a) {
				var b = a.createBookmark(1),
					c = a.createIterator();
				c.enforceRealBlocks = !0;
				c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
				for (var f, e; (f = c.getNextParagraph()); )
					this.checkElementRemovable(f) &&
						(f.is("pre")
							? ((e =
									this._.enterMode == CKEDITOR.ENTER_BR
										? null
										: a.document.createElement(
												this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div"
										  )) && f.copyAttributes(e),
							  m(f, e))
							: x.call(this, f));
				a.moveToBookmark(b);
			}
			function m(a, b) {
				var c = !b;
				c && ((b = a.getDocument().createElement("div")), a.copyAttributes(b));
				var e = b && b.is("pre"),
					g = a.is("pre"),
					d = !e && g;
				if (e && !g) {
					g = b;
					(d = a.getBogus()) && d.remove();
					d = a.getHtml();
					d = n(d, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
					d = d.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
					d = d.replace(/([ \t\n\r]+|&nbsp;)/g, " ");
					d = d.replace(/<br\b[^>]*>/gi, "\n");
					if (CKEDITOR.env.ie) {
						var h = a.getDocument().createElement("div");
						h.append(g);
						g.$.outerHTML = "\x3cpre\x3e" + d + "\x3c/pre\x3e";
						g.copyAttributes(h.getFirst());
						g = h.getFirst().remove();
					} else g.setHtml(d);
					b = g;
				} else d ? (b = r(c ? [a.getHtml()] : f(a), b)) : a.moveChildren(b);
				b.replace(a);
				if (e) {
					var c = b,
						m;
					(m = c.getPrevious(F)) &&
						m.type == CKEDITOR.NODE_ELEMENT &&
						m.is("pre") &&
						((e =
							n(m.getHtml(), /\n$/, "") + "\n\n" + n(c.getHtml(), /^\n/, "")),
						CKEDITOR.env.ie
							? (c.$.outerHTML = "\x3cpre\x3e" + e + "\x3c/pre\x3e")
							: c.setHtml(e),
						m.remove());
				} else c && u(b);
			}
			function f(a) {
				var b = [];
				n(
					a.getOuterHtml(),
					/(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi,
					function (a, b, c) {
						return b + "\x3c/pre\x3e" + c + "\x3cpre\x3e";
					}
				).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function (a, c) {
					b.push(c);
				});
				return b;
			}
			function n(a, b, c) {
				var f = "",
					e = "";
				a = a.replace(
					/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi,
					function (a, b, c) {
						b && (f = b);
						c && (e = c);
						return "";
					}
				);
				return f + a.replace(b, c) + e;
			}
			function r(a, b) {
				var c;
				1 < a.length &&
					(c = new CKEDITOR.dom.documentFragment(b.getDocument()));
				for (var f = 0; f < a.length; f++) {
					var e = a[f],
						e = e.replace(/(\r\n|\r)/g, "\n"),
						e = n(e, /^[ \t]*\n/, ""),
						e = n(e, /\n$/, ""),
						e = n(e, /^[ \t]+|[ \t]+$/g, function (a, b) {
							return 1 == a.length
								? "\x26nbsp;"
								: b
								? " " + CKEDITOR.tools.repeat("\x26nbsp;", a.length - 1)
								: CKEDITOR.tools.repeat("\x26nbsp;", a.length - 1) + " ";
						}),
						e = e.replace(/\n/g, "\x3cbr\x3e"),
						e = e.replace(/[ \t]{2,}/g, function (a) {
							return CKEDITOR.tools.repeat("\x26nbsp;", a.length - 1) + " ";
						});
					if (c) {
						var g = b.clone();
						g.setHtml(e);
						c.append(g);
					} else b.setHtml(e);
				}
				return c || b;
			}
			function x(a, b) {
				var c = this._.definition,
					f = c.attributes,
					c = c.styles,
					e = t(this)[a.getName()],
					g = CKEDITOR.tools.isEmpty(f) && CKEDITOR.tools.isEmpty(c),
					d;
				for (d in f)
					if (
						("class" != d && !this._.definition.fullMatch) ||
						a.getAttribute(d) == y(d, f[d])
					)
						(b && "data-" == d.slice(0, 5)) ||
							((g = a.hasAttribute(d)), a.removeAttribute(d));
				for (var h in c)
					(this._.definition.fullMatch && a.getStyle(h) != y(h, c[h], !0)) ||
						((g = g || !!a.getStyle(h)), a.removeStyle(h));
				p(a, e, A[a.getName()]);
				g &&
					(this._.definition.alwaysRemoveElement
						? u(a, 1)
						: !CKEDITOR.dtd.$block[a.getName()] ||
						  (this._.enterMode == CKEDITOR.ENTER_BR && !a.hasAttributes())
						? u(a)
						: a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div"));
			}
			function v(a) {
				for (
					var b = t(this),
						c = a.getElementsByTag(this.element),
						f,
						e = c.count();
					0 <= --e;

				)
					(f = c.getItem(e)), f.isReadOnly() || x.call(this, f, !0);
				for (var g in b)
					if (g != this.element)
						for (c = a.getElementsByTag(g), e = c.count() - 1; 0 <= e; e--)
							(f = c.getItem(e)), f.isReadOnly() || p(f, b[g]);
			}
			function p(a, b, c) {
				if ((b = b && b.attributes))
					for (var f = 0; f < b.length; f++) {
						var e = b[f][0],
							g;
						if ((g = a.getAttribute(e))) {
							var d = b[f][1];
							(null === d ||
								(d.test && d.test(g)) ||
								("string" == typeof d && g == d)) &&
								a.removeAttribute(e);
						}
					}
				c || u(a);
			}
			function u(a, b) {
				if (!a.hasAttributes() || b)
					if (CKEDITOR.dtd.$block[a.getName()]) {
						var c = a.getPrevious(F),
							f = a.getNext(F);
						!c ||
							(c.type != CKEDITOR.NODE_TEXT && c.isBlockBoundary({ br: 1 })) ||
							a.append("br", 1);
						!f ||
							(f.type != CKEDITOR.NODE_TEXT && f.isBlockBoundary({ br: 1 })) ||
							a.append("br");
						a.remove(!0);
					} else
						(c = a.getFirst()),
							(f = a.getLast()),
							a.remove(!0),
							c &&
								(c.type == CKEDITOR.NODE_ELEMENT && c.mergeSiblings(),
								f &&
									!c.equals(f) &&
									f.type == CKEDITOR.NODE_ELEMENT &&
									f.mergeSiblings());
			}
			function w(a, b, c) {
				var f;
				f = a.element;
				"*" == f && (f = "span");
				f = new CKEDITOR.dom.element(f, b);
				c && c.copyAttributes(f);
				f = q(f, a);
				b.getCustomData("doc_processing_style") && f.hasAttribute("id")
					? f.removeAttribute("id")
					: b.setCustomData("doc_processing_style", 1);
				return f;
			}
			function q(a, b) {
				var c = b._.definition,
					f = c.attributes,
					c = CKEDITOR.style.getStyleText(c);
				if (f) for (var e in f) a.setAttribute(e, f[e]);
				c && a.setAttribute("style", c);
				a.getDocument().removeCustomData("doc_processing_style");
				return a;
			}
			function z(a, b) {
				for (var c in a)
					a[c] = a[c].replace(J, function (a, c) {
						return b[c];
					});
			}
			function t(a) {
				if (a._.overrides) return a._.overrides;
				var b = (a._.overrides = {}),
					c = a._.definition.overrides;
				if (c) {
					CKEDITOR.tools.isArray(c) || (c = [c]);
					for (var f = 0; f < c.length; f++) {
						var e = c[f],
							g,
							d;
						"string" == typeof e
							? (g = e.toLowerCase())
							: ((g = e.element ? e.element.toLowerCase() : a.element),
							  (d = e.attributes));
						e = b[g] || (b[g] = {});
						if (d) {
							var e = (e.attributes = e.attributes || []),
								h;
							for (h in d) e.push([h.toLowerCase(), d[h]]);
						}
					}
				}
				return b;
			}
			function y(a, b, c) {
				var f = new CKEDITOR.dom.element("span");
				f[c ? "setStyle" : "setAttribute"](a, b);
				return f[c ? "getStyle" : "getAttribute"](a);
			}
			function C(a, b) {
				function c(a, b) {
					return "font-family" == b.toLowerCase() ? a.replace(/["']/g, "") : a;
				}
				"string" == typeof a && (a = CKEDITOR.tools.parseCssText(a));
				"string" == typeof b && (b = CKEDITOR.tools.parseCssText(b, !0));
				for (var f in a)
					if (
						!(f in b) ||
						(c(b[f], f) != c(a[f], f) && "inherit" != a[f] && "inherit" != b[f])
					)
						return !1;
				return !0;
			}
			function B(a, b, c) {
				var f = a.getRanges();
				b = b ? this.removeFromRange : this.applyToRange;
				var e, g;
				if (a.isFake && a.isInTable())
					for (e = [], g = 0; g < f.length; g++) e.push(f[g].clone());
				for (var d = f.createIterator(); (g = d.getNextRange()); )
					b.call(this, g, c);
				a.selectRanges(e || f);
			}
			var A = {
					address: 1,
					div: 1,
					h1: 1,
					h2: 1,
					h3: 1,
					h4: 1,
					h5: 1,
					h6: 1,
					p: 1,
					pre: 1,
					section: 1,
					header: 1,
					footer: 1,
					nav: 1,
					article: 1,
					aside: 1,
					figure: 1,
					dialog: 1,
					hgroup: 1,
					time: 1,
					meter: 1,
					menu: 1,
					command: 1,
					keygen: 1,
					output: 1,
					progress: 1,
					details: 1,
					datagrid: 1,
					datalist: 1,
				},
				H = {
					a: 1,
					blockquote: 1,
					embed: 1,
					hr: 1,
					img: 1,
					li: 1,
					object: 1,
					ol: 1,
					table: 1,
					td: 1,
					tr: 1,
					th: 1,
					ul: 1,
					dl: 1,
					dt: 1,
					dd: 1,
					form: 1,
					audio: 1,
					video: 1,
				},
				G = /\s*(?:;\s*|$)/,
				J = /#\((.+?)\)/g,
				E = CKEDITOR.dom.walker.bookmark(0, 1),
				F = CKEDITOR.dom.walker.whitespaces(1);
			CKEDITOR.style = function (a, b) {
				if ("string" == typeof a.type)
					return new CKEDITOR.style.customHandlers[a.type](a);
				var c = a.attributes;
				c &&
					c.style &&
					((a.styles = CKEDITOR.tools.extend(
						{},
						a.styles,
						CKEDITOR.tools.parseCssText(c.style)
					)),
					delete c.style);
				b &&
					((a = CKEDITOR.tools.clone(a)), z(a.attributes, b), z(a.styles, b));
				c = this.element = a.element
					? "string" == typeof a.element
						? a.element.toLowerCase()
						: a.element
					: "*";
				this.type =
					a.type ||
					(A[c]
						? CKEDITOR.STYLE_BLOCK
						: H[c]
						? CKEDITOR.STYLE_OBJECT
						: CKEDITOR.STYLE_INLINE);
				"object" == typeof this.element && (this.type = CKEDITOR.STYLE_OBJECT);
				this._ = { definition: a };
			};
			CKEDITOR.style.prototype = {
				apply: function (a) {
					if (a instanceof CKEDITOR.dom.document)
						return B.call(this, a.getSelection());
					if (this.checkApplicable(a.elementPath(), a)) {
						var b = this._.enterMode;
						b || (this._.enterMode = a.activeEnterMode);
						B.call(this, a.getSelection(), 0, a);
						this._.enterMode = b;
					}
				},
				remove: function (a) {
					if (a instanceof CKEDITOR.dom.document)
						return B.call(this, a.getSelection(), 1);
					if (this.checkApplicable(a.elementPath(), a)) {
						var b = this._.enterMode;
						b || (this._.enterMode = a.activeEnterMode);
						B.call(this, a.getSelection(), 1, a);
						this._.enterMode = b;
					}
				},
				applyToRange: function (a) {
					this.applyToRange =
						this.type == CKEDITOR.STYLE_INLINE
							? b
							: this.type == CKEDITOR.STYLE_BLOCK
							? h
							: this.type == CKEDITOR.STYLE_OBJECT
							? l
							: null;
					return this.applyToRange(a);
				},
				removeFromRange: function (a) {
					this.removeFromRange =
						this.type == CKEDITOR.STYLE_INLINE
							? c
							: this.type == CKEDITOR.STYLE_BLOCK
							? e
							: this.type == CKEDITOR.STYLE_OBJECT
							? k
							: null;
					return this.removeFromRange(a);
				},
				applyToObject: function (a) {
					q(a, this);
				},
				checkActive: function (a, b) {
					switch (this.type) {
						case CKEDITOR.STYLE_BLOCK:
							return this.checkElementRemovable(a.block || a.blockLimit, !0, b);
						case CKEDITOR.STYLE_OBJECT:
						case CKEDITOR.STYLE_INLINE:
							for (var c = a.elements, f = 0, e; f < c.length; f++)
								if (
									((e = c[f]),
									this.type != CKEDITOR.STYLE_INLINE ||
										(e != a.block && e != a.blockLimit))
								) {
									if (this.type == CKEDITOR.STYLE_OBJECT) {
										var g = e.getName();
										if (
											!("string" == typeof this.element
												? g == this.element
												: g in this.element)
										)
											continue;
									}
									if (this.checkElementRemovable(e, !0, b)) return !0;
								}
					}
					return !1;
				},
				checkApplicable: function (a, b, c) {
					b && b instanceof CKEDITOR.filter && (c = b);
					if (c && !c.check(this)) return !1;
					switch (this.type) {
						case CKEDITOR.STYLE_OBJECT:
							return !!a.contains(this.element);
						case CKEDITOR.STYLE_BLOCK:
							return !!a.blockLimit.getDtd()[this.element];
					}
					return !0;
				},
				checkElementMatch: function (a, b) {
					var c = this._.definition;
					if (!a || (!c.ignoreReadonly && a.isReadOnly())) return !1;
					var f = a.getName();
					if (
						"string" == typeof this.element
							? f == this.element
							: f in this.element
					) {
						if (!b && !a.hasAttributes()) return !0;
						if ((f = c._AC)) c = f;
						else {
							var f = {},
								e = 0,
								g = c.attributes;
							if (g) for (var d in g) e++, (f[d] = g[d]);
							if ((d = CKEDITOR.style.getStyleText(c)))
								f.style || e++, (f.style = d);
							f._length = e;
							c = c._AC = f;
						}
						if (c._length) {
							for (var h in c)
								if ("_length" != h)
									if (
										((f = a.getAttribute(h) || ""),
										"style" == h ? C(c[h], f) : c[h] == f)
									) {
										if (!b) return !0;
									} else if (b) return !1;
							if (b) return !0;
						} else return !0;
					}
					return !1;
				},
				checkElementRemovable: function (a, b, c) {
					if (this.checkElementMatch(a, b, c)) return !0;
					if ((b = t(this)[a.getName()])) {
						var f;
						if (!(b = b.attributes)) return !0;
						for (c = 0; c < b.length; c++)
							if (((f = b[c][0]), (f = a.getAttribute(f)))) {
								var e = b[c][1];
								if (null === e) return !0;
								if ("string" == typeof e) {
									if (f == e) return !0;
								} else if (e.test(f)) return !0;
							}
					}
					return !1;
				},
				buildPreview: function (a) {
					var b = this._.definition,
						c = [],
						f = b.element;
					"bdo" == f && (f = "span");
					var c = ["\x3c", f],
						e = b.attributes;
					if (e) for (var g in e) c.push(" ", g, '\x3d"', e[g], '"');
					(e = CKEDITOR.style.getStyleText(b)) && c.push(' style\x3d"', e, '"');
					c.push("\x3e", a || b.name, "\x3c/", f, "\x3e");
					return c.join("");
				},
				getDefinition: function () {
					return this._.definition;
				},
			};
			CKEDITOR.style.getStyleText = function (a) {
				var b = a._ST;
				if (b) return b;
				var b = a.styles,
					c = (a.attributes && a.attributes.style) || "",
					f = "";
				c.length && (c = c.replace(G, ";"));
				for (var e in b) {
					var g = b[e],
						d = (e + ":" + g).replace(G, ";");
					"inherit" == g ? (f += d) : (c += d);
				}
				c.length && (c = CKEDITOR.tools.normalizeCssText(c, !0));
				return (a._ST = c + f);
			};
			CKEDITOR.style.customHandlers = {};
			CKEDITOR.style.addCustomHandler = function (a) {
				var b = function (a) {
					this._ = { definition: a };
					this.setup && this.setup(a);
				};
				b.prototype = CKEDITOR.tools.extend(
					CKEDITOR.tools.prototypedCopy(CKEDITOR.style.prototype),
					{ assignedTo: CKEDITOR.STYLE_OBJECT },
					a,
					!0
				);
				return (this.customHandlers[a.type] = b);
			};
			var L =
					CKEDITOR.POSITION_PRECEDING |
					CKEDITOR.POSITION_IDENTICAL |
					CKEDITOR.POSITION_IS_CONTAINED,
				I =
					CKEDITOR.POSITION_FOLLOWING |
					CKEDITOR.POSITION_IDENTICAL |
					CKEDITOR.POSITION_IS_CONTAINED;
		})(),
		(CKEDITOR.styleCommand = function (a, d) {
			this.requiredContent = this.allowedContent = this.style = a;
			CKEDITOR.tools.extend(this, d, !0);
		}),
		(CKEDITOR.styleCommand.prototype.exec = function (a) {
			a.focus();
			this.state == CKEDITOR.TRISTATE_OFF
				? a.applyStyle(this.style)
				: this.state == CKEDITOR.TRISTATE_ON && a.removeStyle(this.style);
		}),
		(CKEDITOR.stylesSet = new CKEDITOR.resourceManager("", "stylesSet")),
		(CKEDITOR.addStylesSet = CKEDITOR.tools.bind(
			CKEDITOR.stylesSet.add,
			CKEDITOR.stylesSet
		)),
		(CKEDITOR.loadStylesSet = function (a, d, b) {
			CKEDITOR.stylesSet.addExternal(a, d, "");
			CKEDITOR.stylesSet.load(a, b);
		}),
		CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
			attachStyleStateChange: function (a, d) {
				var b = this._.styleStateChangeCallbacks;
				b ||
					((b = this._.styleStateChangeCallbacks = []),
					this.on("selectionChange", function (a) {
						for (var g = 0; g < b.length; g++) {
							var d = b[g],
								k = d.style.checkActive(a.data.path, this)
									? CKEDITOR.TRISTATE_ON
									: CKEDITOR.TRISTATE_OFF;
							d.fn.call(this, k);
						}
					}));
				b.push({ style: a, fn: d });
			},
			applyStyle: function (a) {
				a.apply(this);
			},
			removeStyle: function (a) {
				a.remove(this);
			},
			getStylesSet: function (a) {
				if (this._.stylesDefinitions) a(this._.stylesDefinitions);
				else {
					var d = this,
						b = d.config.stylesCombo_stylesSet || d.config.stylesSet;
					if (!1 === b) a(null);
					else if (b instanceof Array) (d._.stylesDefinitions = b), a(b);
					else {
						b || (b = "default");
						var b = b.split(":"),
							c = b[0];
						CKEDITOR.stylesSet.addExternal(
							c,
							b[1] ? b.slice(1).join(":") : CKEDITOR.getUrl("styles.js"),
							""
						);
						CKEDITOR.stylesSet.load(c, function (b) {
							d._.stylesDefinitions = b[c];
							a(d._.stylesDefinitions);
						});
					}
				}
			},
		}),
		(CKEDITOR.dom.comment = function (a, d) {
			"string" == typeof a && (a = (d ? d.$ : document).createComment(a));
			CKEDITOR.dom.domObject.call(this, a);
		}),
		(CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node()),
		CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype, {
			type: CKEDITOR.NODE_COMMENT,
			getOuterHtml: function () {
				return "\x3c!--" + this.$.nodeValue + "--\x3e";
			},
		}),
		"use strict",
		(function () {
			var a = {},
				d = {},
				b;
			for (b in CKEDITOR.dtd.$blockLimit) b in CKEDITOR.dtd.$list || (a[b] = 1);
			for (b in CKEDITOR.dtd.$block)
				b in CKEDITOR.dtd.$blockLimit || b in CKEDITOR.dtd.$empty || (d[b] = 1);
			CKEDITOR.dom.elementPath = function (b, g) {
				var l = null,
					k = null,
					h = [],
					e = b,
					m;
				g = g || b.getDocument().getBody();
				e || (e = g);
				do
					if (e.type == CKEDITOR.NODE_ELEMENT) {
						h.push(e);
						if (
							!this.lastElement &&
							((this.lastElement = e),
							e.is(CKEDITOR.dtd.$object) ||
								"false" == e.getAttribute("contenteditable"))
						)
							continue;
						if (e.equals(g)) break;
						if (
							!k &&
							((m = e.getName()),
							"true" == e.getAttribute("contenteditable")
								? (k = e)
								: !l && d[m] && (l = e),
							a[m])
						) {
							if ((m = !l && "div" == m)) {
								a: {
									m = e.getChildren();
									for (var f = 0, n = m.count(); f < n; f++) {
										var r = m.getItem(f);
										if (
											r.type == CKEDITOR.NODE_ELEMENT &&
											CKEDITOR.dtd.$block[r.getName()]
										) {
											m = !0;
											break a;
										}
									}
									m = !1;
								}
								m = !m;
							}
							m ? (l = e) : (k = e);
						}
					}
				while ((e = e.getParent()));
				k || (k = g);
				this.block = l;
				this.blockLimit = k;
				this.root = g;
				this.elements = h;
			};
		})(),
		(CKEDITOR.dom.elementPath.prototype = {
			compare: function (a) {
				var d = this.elements;
				a = a && a.elements;
				if (!a || d.length != a.length) return !1;
				for (var b = 0; b < d.length; b++) if (!d[b].equals(a[b])) return !1;
				return !0;
			},
			contains: function (a, d, b) {
				var c = 0,
					g;
				"string" == typeof a &&
					(g = function (b) {
						return b.getName() == a;
					});
				a instanceof CKEDITOR.dom.element
					? (g = function (b) {
							return b.equals(a);
					  })
					: CKEDITOR.tools.isArray(a)
					? (g = function (b) {
							return -1 < CKEDITOR.tools.indexOf(a, b.getName());
					  })
					: "function" == typeof a
					? (g = a)
					: "object" == typeof a &&
					  (g = function (b) {
							return b.getName() in a;
					  });
				var l = this.elements,
					k = l.length;
				d && (b ? (c += 1) : --k);
				b && ((l = Array.prototype.slice.call(l, 0)), l.reverse());
				for (; c < k; c++) if (g(l[c])) return l[c];
				return null;
			},
			isContextFor: function (a) {
				var d;
				return a in CKEDITOR.dtd.$block
					? ((d =
							this.contains(CKEDITOR.dtd.$intermediate) ||
							(this.root.equals(this.block) && this.block) ||
							this.blockLimit),
					  !!d.getDtd()[a])
					: !0;
			},
			direction: function () {
				return (this.block || this.blockLimit || this.root).getDirection(1);
			},
		}),
		(CKEDITOR.dom.text = function (a, d) {
			"string" == typeof a && (a = (d ? d.$ : document).createTextNode(a));
			this.$ = a;
		}),
		(CKEDITOR.dom.text.prototype = new CKEDITOR.dom.node()),
		CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype, {
			type: CKEDITOR.NODE_TEXT,
			getLength: function () {
				return this.$.nodeValue.length;
			},
			getText: function () {
				return this.$.nodeValue;
			},
			setText: function (a) {
				this.$.nodeValue = a;
			},
			split: function (a) {
				var d = this.$.parentNode,
					b = d.childNodes.length,
					c = this.getLength(),
					g = this.getDocument(),
					l = new CKEDITOR.dom.text(this.$.splitText(a), g);
				d.childNodes.length == b &&
					(a >= c
						? ((l = g.createText("")), l.insertAfter(this))
						: ((a = g.createText("")), a.insertAfter(l), a.remove()));
				return l;
			},
			substring: function (a, d) {
				return "number" != typeof d
					? this.$.nodeValue.substr(a)
					: this.$.nodeValue.substring(a, d);
			},
		}),
		(function () {
			function a(a, c, g) {
				var d = a.serializable,
					k = c[g ? "endContainer" : "startContainer"],
					h = g ? "endOffset" : "startOffset",
					e = d ? c.document.getById(a.startNode) : a.startNode;
				a = d ? c.document.getById(a.endNode) : a.endNode;
				k.equals(e.getPrevious())
					? ((c.startOffset =
							c.startOffset - k.getLength() - a.getPrevious().getLength()),
					  (k = a.getNext()))
					: k.equals(a.getPrevious()) &&
					  ((c.startOffset -= k.getLength()), (k = a.getNext()));
				k.equals(e.getParent()) && c[h]++;
				k.equals(a.getParent()) && c[h]++;
				c[g ? "endContainer" : "startContainer"] = k;
				return c;
			}
			CKEDITOR.dom.rangeList = function (a) {
				if (a instanceof CKEDITOR.dom.rangeList) return a;
				a ? a instanceof CKEDITOR.dom.range && (a = [a]) : (a = []);
				return CKEDITOR.tools.extend(a, d);
			};
			var d = {
				createIterator: function () {
					var a = this,
						c = CKEDITOR.dom.walker.bookmark(),
						g = [],
						d;
					return {
						getNextRange: function (k) {
							d = void 0 === d ? 0 : d + 1;
							var h = a[d];
							if (h && 1 < a.length) {
								if (!d)
									for (var e = a.length - 1; 0 <= e; e--)
										g.unshift(a[e].createBookmark(!0));
								if (k)
									for (var m = 0; a[d + m + 1]; ) {
										var f = h.document;
										k = 0;
										e = f.getById(g[m].endNode);
										for (f = f.getById(g[m + 1].startNode); ; ) {
											e = e.getNextSourceNode(!1);
											if (f.equals(e)) k = 1;
											else if (
												c(e) ||
												(e.type == CKEDITOR.NODE_ELEMENT && e.isBlockBoundary())
											)
												continue;
											break;
										}
										if (!k) break;
										m++;
									}
								for (h.moveToBookmark(g.shift()); m--; )
									(e = a[++d]),
										e.moveToBookmark(g.shift()),
										h.setEnd(e.endContainer, e.endOffset);
							}
							return h;
						},
					};
				},
				createBookmarks: function (b) {
					for (var c = [], g, d = 0; d < this.length; d++) {
						c.push((g = this[d].createBookmark(b, !0)));
						for (var k = d + 1; k < this.length; k++)
							(this[k] = a(g, this[k])), (this[k] = a(g, this[k], !0));
					}
					return c;
				},
				createBookmarks2: function (a) {
					for (var c = [], g = 0; g < this.length; g++)
						c.push(this[g].createBookmark2(a));
					return c;
				},
				moveToBookmarks: function (a) {
					for (var c = 0; c < this.length; c++) this[c].moveToBookmark(a[c]);
				},
			};
		})(),
		(function () {
			function a() {
				return CKEDITOR.getUrl(
					CKEDITOR.skinName.split(",")[1] ||
						"skins/" + CKEDITOR.skinName.split(",")[0] + "/"
				);
			}
			function d(b) {
				var c = CKEDITOR.skin["ua_" + b],
					e = CKEDITOR.env;
				if (c)
					for (
						var c = c.split(",").sort(function (a, b) {
								return a > b ? -1 : 1;
							}),
							g = 0,
							d;
						g < c.length;
						g++
					)
						if (
							((d = c[g]),
							e.ie &&
								(d.replace(/^ie/, "") == e.version ||
									(e.quirks && "iequirks" == d)) &&
								(d = "ie"),
							e[d])
						) {
							b += "_" + c[g];
							break;
						}
				return CKEDITOR.getUrl(a() + b + ".css");
			}
			function b(a, b) {
				l[a] || (CKEDITOR.document.appendStyleSheet(d(a)), (l[a] = 1));
				b && b();
			}
			function c(a) {
				var b = a.getById(k);
				b ||
					((b = a.getHead().append("style")),
					b.setAttribute("id", k),
					b.setAttribute("type", "text/css"));
				return b;
			}
			function g(a, b, c) {
				var e, g, d;
				if (CKEDITOR.env.webkit)
					for (b = b.split("}").slice(0, -1), g = 0; g < b.length; g++)
						b[g] = b[g].split("{");
				for (var h = 0; h < a.length; h++)
					if (CKEDITOR.env.webkit)
						for (g = 0; g < b.length; g++) {
							d = b[g][1];
							for (e = 0; e < c.length; e++) d = d.replace(c[e][0], c[e][1]);
							a[h].$.sheet.addRule(b[g][0], d);
						}
					else {
						d = b;
						for (e = 0; e < c.length; e++) d = d.replace(c[e][0], c[e][1]);
						CKEDITOR.env.ie && 11 > CKEDITOR.env.version
							? (a[h].$.styleSheet.cssText += d)
							: (a[h].$.innerHTML += d);
					}
			}
			var l = {};
			CKEDITOR.skin = {
				path: a,
				loadPart: function (c, f) {
					CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0]
						? CKEDITOR.scriptLoader.load(
								CKEDITOR.getUrl(a() + "skin.js"),
								function () {
									b(c, f);
								}
						  )
						: b(c, f);
				},
				getPath: function (a) {
					return CKEDITOR.getUrl(d(a));
				},
				icons: {},
				addIcon: function (a, b, c, e) {
					a = a.toLowerCase();
					this.icons[a] ||
						(this.icons[a] = { path: b, offset: c || 0, bgsize: e || "16px" });
				},
				getIconStyle: function (a, b, c, e, g) {
					var d;
					a &&
						((a = a.toLowerCase()),
						b && (d = this.icons[a + "-rtl"]),
						d || (d = this.icons[a]));
					a = c || (d && d.path) || "";
					e = e || (d && d.offset);
					g = g || (d && d.bgsize) || "16px";
					a && (a = a.replace(/'/g, "\\'"));
					return (
						a &&
						"background-image:url('" +
							CKEDITOR.getUrl(a) +
							"');background-position:0 " +
							e +
							"px;background-size:" +
							g +
							";"
					);
				},
			};
			CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
				getUiColor: function () {
					return this.uiColor;
				},
				setUiColor: function (a) {
					var b = c(CKEDITOR.document);
					return (this.setUiColor = function (a) {
						this.uiColor = a;
						var c = CKEDITOR.skin.chameleon,
							d = "",
							m = "";
						"function" == typeof c &&
							((d = c(this, "editor")), (m = c(this, "panel")));
						a = [[e, a]];
						g([b], d, a);
						g(h, m, a);
					}).call(this, a);
				},
			});
			var k = "cke_ui_color",
				h = [],
				e = /\$color/g;
			CKEDITOR.on("instanceLoaded", function (a) {
				if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
					var b = a.editor;
					a = function (a) {
						a = (a.data[0] || a.data).element
							.getElementsByTag("iframe")
							.getItem(0)
							.getFrameDocument();
						if (!a.getById("cke_ui_color")) {
							a = c(a);
							h.push(a);
							var d = b.getUiColor();
							d && g([a], CKEDITOR.skin.chameleon(b, "panel"), [[e, d]]);
						}
					};
					b.on("panelShow", a);
					b.on("menuShow", a);
					b.config.uiColor && b.setUiColor(b.config.uiColor);
				}
			});
		})(),
		(function () {
			if (CKEDITOR.env.webkit) CKEDITOR.env.hc = !1;
			else {
				var a = CKEDITOR.dom.element.createFromHtml(
					'\x3cdiv style\x3d"width:0;height:0;position:absolute;left:-10000px;border:1px solid;border-color:red blue"\x3e\x3c/div\x3e',
					CKEDITOR.document
				);
				a.appendTo(CKEDITOR.document.getHead());
				try {
					var d = a.getComputedStyle("border-top-color"),
						b = a.getComputedStyle("border-right-color");
					CKEDITOR.env.hc = !(!d || d != b);
				} catch (c) {
					CKEDITOR.env.hc = !1;
				}
				a.remove();
			}
			CKEDITOR.env.hc && (CKEDITOR.env.cssClass += " cke_hc");
			CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
			CKEDITOR.status = "loaded";
			CKEDITOR.fireOnce("loaded");
			if ((a = CKEDITOR._.pending))
				for (delete CKEDITOR._.pending, d = 0; d < a.length; d++)
					CKEDITOR.editor.prototype.constructor.apply(a[d][0], a[d][1]),
						CKEDITOR.add(a[d][0]);
		})(),
		(CKEDITOR.skin.name = "moono-lisa"),
		(CKEDITOR.skin.ua_editor = "ie,iequirks,ie8,gecko"),
		(CKEDITOR.skin.ua_dialog = "ie,iequirks,ie8"),
		(CKEDITOR.skin.chameleon = (function () {
			var a = (function () {
					return function (a, c) {
						for (var g = a.match(/[^#]./g), d = 0; 3 > d; d++) {
							var k = d,
								h;
							h = parseInt(g[d], 16);
							h = (
								"0" +
								(0 > c ? 0 | (h * (1 + c)) : 0 | (h + (255 - h) * c)).toString(
									16
								)
							).slice(-2);
							g[k] = h;
						}
						return "#" + g.join("");
					};
				})(),
				d = {
					editor: new CKEDITOR.template(
						"{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ background-color:{defaultBackground};border-bottom-color:{defaultBorder};] {id} .cke_bottom [background-color:{defaultBackground};border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [background-color:{defaultBackground};border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [background-color:{defaultBackground};outline-color:{defaultBorder};] {id} .cke_dialog_tab [background-color:{dialogTab};border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [background-color:{lightBackground};] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} a.cke_button_off:hover,{id} a.cke_button_off:focus,{id} a.cke_button_off:active [background-color:{darkBackground};border-color:{toolbarElementsBorder};] {id} .cke_button_on [background-color:{ckeButtonOn};border-color:{toolbarElementsBorder};] {id} .cke_toolbar_separator,{id} .cke_toolgroup a.cke_button:last-child:after,{id} .cke_toolgroup a.cke_button.cke_button_disabled:hover:last-child:after [background-color: {toolbarElementsBorder};border-color: {toolbarElementsBorder};] {id} a.cke_combo_button:hover,{id} a.cke_combo_button:focus,{id} .cke_combo_on a.cke_combo_button [border-color:{toolbarElementsBorder};background-color:{darkBackground};] {id} .cke_combo:after [border-color:{toolbarElementsBorder};] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover,{id} a.cke_path_item:focus,{id} a.cke_path_item:active [background-color:{darkBackground};] {id}.cke_panel [border-color:{defaultBorder};] "
					),
					panel: new CKEDITOR.template(
						".cke_panel_grouptitle [background-color:{lightBackground};border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover,.cke_menubutton:focus,.cke_menubutton:active [background-color:{menubuttonHover};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menubutton_disabled:hover .cke_menubutton_icon,.cke_menubutton_disabled:focus .cke_menubutton_icon,.cke_menubutton_disabled:active .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] "
					),
				};
			return function (b, c) {
				var g = a(b.uiColor, 0.4),
					g = {
						id: "." + b.id,
						defaultBorder: a(g, -0.2),
						toolbarElementsBorder: a(g, -0.25),
						defaultBackground: g,
						lightBackground: a(g, 0.8),
						darkBackground: a(g, -0.15),
						ckeButtonOn: a(g, 0.4),
						ckeResizer: a(g, -0.4),
						ckeColorauto: a(g, 0.8),
						dialogBody: a(g, 0.7),
						dialogTab: a(g, 0.65),
						dialogTabSelected: "#FFF",
						dialogTabSelectedBorder: "#FFF",
						elementsPathColor: a(g, -0.6),
						menubuttonHover: a(g, 0.1),
						menubuttonIcon: a(g, 0.5),
						menubuttonIconHover: a(g, 0.3),
					};
				return d[c].output(g).replace(/\[/g, "{").replace(/\]/g, "}");
			};
		})()),
		CKEDITOR.plugins.add("dialogui", {
			onLoad: function () {
				var a = function (a) {
						this._ || (this._ = {});
						this._["default"] = this._.initValue = a["default"] || "";
						this._.required = a.required || !1;
						for (var b = [this._], c = 1; c < arguments.length; c++)
							b.push(arguments[c]);
						b.push(!0);
						CKEDITOR.tools.extend.apply(CKEDITOR.tools, b);
						return this._;
					},
					d = {
						build: function (a, b, c) {
							return new CKEDITOR.ui.dialog.textInput(a, b, c);
						},
					},
					b = {
						build: function (a, b, c) {
							return new CKEDITOR.ui.dialog[b.type](a, b, c);
						},
					},
					c = {
						isChanged: function () {
							return this.getValue() != this.getInitValue();
						},
						reset: function (a) {
							this.setValue(this.getInitValue(), a);
						},
						setInitValue: function () {
							this._.initValue = this.getValue();
						},
						resetInitValue: function () {
							this._.initValue = this._["default"];
						},
						getInitValue: function () {
							return this._.initValue;
						},
					},
					g = CKEDITOR.tools.extend(
						{},
						CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors,
						{
							onChange: function (a, b) {
								this._.domOnChangeRegistered ||
									(a.on(
										"load",
										function () {
											this.getInputElement().on(
												"change",
												function () {
													a.parts.dialog.isVisible() &&
														this.fire("change", { value: this.getValue() });
												},
												this
											);
										},
										this
									),
									(this._.domOnChangeRegistered = !0));
								this.on("change", b);
							},
						},
						!0
					),
					l = /^on([A-Z]\w+)/,
					k = function (a) {
						for (var b in a)
							(l.test(b) || "title" == b || "type" == b) && delete a[b];
						return a;
					},
					h = function (a) {
						a = a.data.getKeystroke();
						a == CKEDITOR.SHIFT + CKEDITOR.ALT + 36
							? this.setDirectionMarker("ltr")
							: a == CKEDITOR.SHIFT + CKEDITOR.ALT + 35 &&
							  this.setDirectionMarker("rtl");
					};
				CKEDITOR.tools.extend(
					CKEDITOR.ui.dialog,
					{
						labeledElement: function (b, c, f, g) {
							if (!(4 > arguments.length)) {
								var d = a.call(this, c);
								d.labelId = CKEDITOR.tools.getNextId() + "_label";
								this._.children = [];
								var h = { role: c.role || "presentation" };
								c.includeLabel && (h["aria-labelledby"] = d.labelId);
								CKEDITOR.ui.dialog.uiElement.call(
									this,
									b,
									c,
									f,
									"div",
									null,
									h,
									function () {
										var a = [],
											f = c.required ? " cke_required" : "";
										"horizontal" != c.labelLayout
											? a.push(
													'\x3clabel class\x3d"cke_dialog_ui_labeled_label' +
														f +
														'" ',
													' id\x3d"' + d.labelId + '"',
													d.inputId ? ' for\x3d"' + d.inputId + '"' : "",
													(c.labelStyle
														? ' style\x3d"' + c.labelStyle + '"'
														: "") + "\x3e",
													c.label,
													"\x3c/label\x3e",
													'\x3cdiv class\x3d"cke_dialog_ui_labeled_content"',
													c.controlStyle
														? ' style\x3d"' + c.controlStyle + '"'
														: "",
													' role\x3d"presentation"\x3e',
													g.call(this, b, c),
													"\x3c/div\x3e"
											  )
											: ((f = {
													type: "hbox",
													widths: c.widths,
													padding: 0,
													children: [
														{
															type: "html",
															html:
																'\x3clabel class\x3d"cke_dialog_ui_labeled_label' +
																f +
																'" id\x3d"' +
																d.labelId +
																'" for\x3d"' +
																d.inputId +
																'"' +
																(c.labelStyle
																	? ' style\x3d"' + c.labelStyle + '"'
																	: "") +
																"\x3e" +
																CKEDITOR.tools.htmlEncode(c.label) +
																"\x3c/label\x3e",
														},
														{
															type: "html",
															html:
																'\x3cspan class\x3d"cke_dialog_ui_labeled_content"' +
																(c.controlStyle
																	? ' style\x3d"' + c.controlStyle + '"'
																	: "") +
																"\x3e" +
																g.call(this, b, c) +
																"\x3c/span\x3e",
														},
													],
											  }),
											  CKEDITOR.dialog._.uiElementBuilders.hbox.build(
													b,
													f,
													a
											  ));
										return a.join("");
									}
								);
							}
						},
						textInput: function (b, c, f) {
							if (!(3 > arguments.length)) {
								a.call(this, c);
								var g = (this._.inputId =
										CKEDITOR.tools.getNextId() + "_textInput"),
									d = {
										class: "cke_dialog_ui_input_" + c.type,
										id: g,
										type: c.type,
									};
								c.validate && (this.validate = c.validate);
								c.maxLength && (d.maxlength = c.maxLength);
								c.size && (d.size = c.size);
								c.inputStyle && (d.style = c.inputStyle);
								var k = this,
									l = !1;
								b.on("load", function () {
									k.getInputElement().on("keydown", function (a) {
										13 == a.data.getKeystroke() && (l = !0);
									});
									k.getInputElement().on(
										"keyup",
										function (a) {
											13 == a.data.getKeystroke() &&
												l &&
												(b.getButton("ok") &&
													setTimeout(function () {
														b.getButton("ok").click();
													}, 0),
												(l = !1));
											k.bidi && h.call(k, a);
										},
										null,
										null,
										1e3
									);
								});
								CKEDITOR.ui.dialog.labeledElement.call(
									this,
									b,
									c,
									f,
									function () {
										var a = [
											'\x3cdiv class\x3d"cke_dialog_ui_input_',
											c.type,
											'" role\x3d"presentation"',
										];
										c.width && a.push('style\x3d"width:' + c.width + '" ');
										a.push("\x3e\x3cinput ");
										d["aria-labelledby"] = this._.labelId;
										this._.required && (d["aria-required"] = this._.required);
										for (var b in d) a.push(b + '\x3d"' + d[b] + '" ');
										a.push(" /\x3e\x3c/div\x3e");
										return a.join("");
									}
								);
							}
						},
						textarea: function (b, c, f) {
							if (!(3 > arguments.length)) {
								a.call(this, c);
								var g = this,
									d = (this._.inputId =
										CKEDITOR.tools.getNextId() + "_textarea"),
									k = {};
								c.validate && (this.validate = c.validate);
								k.rows = c.rows || 5;
								k.cols = c.cols || 20;
								k["class"] =
									"cke_dialog_ui_input_textarea " + (c["class"] || "");
								"undefined" != typeof c.inputStyle && (k.style = c.inputStyle);
								c.dir && (k.dir = c.dir);
								if (g.bidi)
									b.on(
										"load",
										function () {
											g.getInputElement().on("keyup", h);
										},
										g
									);
								CKEDITOR.ui.dialog.labeledElement.call(
									this,
									b,
									c,
									f,
									function () {
										k["aria-labelledby"] = this._.labelId;
										this._.required && (k["aria-required"] = this._.required);
										var a = [
												'\x3cdiv class\x3d"cke_dialog_ui_input_textarea" role\x3d"presentation"\x3e\x3ctextarea id\x3d"',
												d,
												'" ',
											],
											b;
										for (b in k)
											a.push(
												b + '\x3d"' + CKEDITOR.tools.htmlEncode(k[b]) + '" '
											);
										a.push(
											"\x3e",
											CKEDITOR.tools.htmlEncode(g._["default"]),
											"\x3c/textarea\x3e\x3c/div\x3e"
										);
										return a.join("");
									}
								);
							}
						},
						checkbox: function (b, c, f) {
							if (!(3 > arguments.length)) {
								var g = a.call(this, c, { default: !!c["default"] });
								c.validate && (this.validate = c.validate);
								CKEDITOR.ui.dialog.uiElement.call(
									this,
									b,
									c,
									f,
									"span",
									null,
									null,
									function () {
										var a = CKEDITOR.tools.extend(
												{},
												c,
												{
													id: c.id
														? c.id + "_checkbox"
														: CKEDITOR.tools.getNextId() + "_checkbox",
												},
												!0
											),
											f = [],
											d = CKEDITOR.tools.getNextId() + "_label",
											h = {
												class: "cke_dialog_ui_checkbox_input",
												type: "checkbox",
												"aria-labelledby": d,
											};
										k(a);
										c["default"] && (h.checked = "checked");
										"undefined" != typeof a.inputStyle &&
											(a.style = a.inputStyle);
										g.checkbox = new CKEDITOR.ui.dialog.uiElement(
											b,
											a,
											f,
											"input",
											null,
											h
										);
										f.push(
											' \x3clabel id\x3d"',
											d,
											'" for\x3d"',
											h.id,
											'"' +
												(c.labelStyle
													? ' style\x3d"' + c.labelStyle + '"'
													: "") +
												"\x3e",
											CKEDITOR.tools.htmlEncode(c.label),
											"\x3c/label\x3e"
										);
										return f.join("");
									}
								);
							}
						},
						radio: function (b, c, f) {
							if (!(3 > arguments.length)) {
								a.call(this, c);
								this._["default"] ||
									(this._["default"] = this._.initValue = c.items[0][1]);
								c.validate && (this.validate = c.validate);
								var g = [],
									d = this;
								c.role = "radiogroup";
								c.includeLabel = !0;
								CKEDITOR.ui.dialog.labeledElement.call(
									this,
									b,
									c,
									f,
									function () {
										for (
											var a = [],
												f = [],
												h =
													(c.id ? c.id : CKEDITOR.tools.getNextId()) + "_radio",
												l = 0;
											l < c.items.length;
											l++
										) {
											var w = c.items[l],
												q = void 0 !== w[2] ? w[2] : w[0],
												z = void 0 !== w[1] ? w[1] : w[0],
												t = CKEDITOR.tools.getNextId() + "_radio_input",
												y = t + "_label",
												t = CKEDITOR.tools.extend(
													{},
													c,
													{ id: t, title: null, type: null },
													!0
												),
												q = CKEDITOR.tools.extend({}, t, { title: q }, !0),
												C = {
													type: "radio",
													class: "cke_dialog_ui_radio_input",
													name: h,
													value: z,
													"aria-labelledby": y,
												},
												B = [];
											d._["default"] == z && (C.checked = "checked");
											k(t);
											k(q);
											"undefined" != typeof t.inputStyle &&
												(t.style = t.inputStyle);
											t.keyboardFocusable = !0;
											g.push(
												new CKEDITOR.ui.dialog.uiElement(
													b,
													t,
													B,
													"input",
													null,
													C
												)
											);
											B.push(" ");
											new CKEDITOR.ui.dialog.uiElement(
												b,
												q,
												B,
												"label",
												null,
												{ id: y, for: C.id },
												w[0]
											);
											a.push(B.join(""));
										}
										new CKEDITOR.ui.dialog.hbox(b, g, a, f);
										return f.join("");
									}
								);
								this._.children = g;
							}
						},
						button: function (b, c, f) {
							if (arguments.length) {
								"function" == typeof c && (c = c(b.getParentEditor()));
								a.call(this, c, { disabled: c.disabled || !1 });
								CKEDITOR.event.implementOn(this);
								var g = this;
								b.on(
									"load",
									function () {
										var a = this.getElement();
										(function () {
											a.on("click", function (a) {
												g.click();
												a.data.preventDefault();
											});
											a.on("keydown", function (a) {
												a.data.getKeystroke() in { 32: 1 } &&
													(g.click(), a.data.preventDefault());
											});
										})();
										a.unselectable();
									},
									this
								);
								var d = CKEDITOR.tools.extend({}, c);
								delete d.style;
								var h = CKEDITOR.tools.getNextId() + "_label";
								CKEDITOR.ui.dialog.uiElement.call(
									this,
									b,
									d,
									f,
									"a",
									null,
									{
										style: c.style,
										href: "javascript:void(0)",
										title: c.label,
										hidefocus: "true",
										class: c["class"],
										role: "button",
										"aria-labelledby": h,
									},
									'\x3cspan id\x3d"' +
										h +
										'" class\x3d"cke_dialog_ui_button"\x3e' +
										CKEDITOR.tools.htmlEncode(c.label) +
										"\x3c/span\x3e"
								);
							}
						},
						select: function (b, c, f) {
							if (!(3 > arguments.length)) {
								var g = a.call(this, c);
								c.validate && (this.validate = c.validate);
								g.inputId = CKEDITOR.tools.getNextId() + "_select";
								CKEDITOR.ui.dialog.labeledElement.call(
									this,
									b,
									c,
									f,
									function () {
										var a = CKEDITOR.tools.extend(
												{},
												c,
												{
													id: c.id
														? c.id + "_select"
														: CKEDITOR.tools.getNextId() + "_select",
												},
												!0
											),
											f = [],
											d = [],
											h = {
												id: g.inputId,
												class: "cke_dialog_ui_input_select",
												"aria-labelledby": this._.labelId,
											};
										f.push(
											'\x3cdiv class\x3d"cke_dialog_ui_input_',
											c.type,
											'" role\x3d"presentation"'
										);
										c.width && f.push('style\x3d"width:' + c.width + '" ');
										f.push("\x3e");
										void 0 !== c.size && (h.size = c.size);
										void 0 !== c.multiple && (h.multiple = c.multiple);
										k(a);
										for (
											var l = 0, w;
											l < c.items.length && (w = c.items[l]);
											l++
										)
											d.push(
												'\x3coption value\x3d"',
												CKEDITOR.tools
													.htmlEncode(void 0 !== w[1] ? w[1] : w[0])
													.replace(/"/g, "\x26quot;"),
												'" /\x3e ',
												CKEDITOR.tools.htmlEncode(w[0])
											);
										"undefined" != typeof a.inputStyle &&
											(a.style = a.inputStyle);
										g.select = new CKEDITOR.ui.dialog.uiElement(
											b,
											a,
											f,
											"select",
											null,
											h,
											d.join("")
										);
										f.push("\x3c/div\x3e");
										return f.join("");
									}
								);
							}
						},
						file: function (b, c, f) {
							if (!(3 > arguments.length)) {
								void 0 === c["default"] && (c["default"] = "");
								var g = CKEDITOR.tools.extend(a.call(this, c), {
									definition: c,
									buttons: [],
								});
								c.validate && (this.validate = c.validate);
								b.on("load", function () {
									CKEDITOR.document
										.getById(g.frameId)
										.getParent()
										.addClass("cke_dialog_ui_input_file");
								});
								CKEDITOR.ui.dialog.labeledElement.call(
									this,
									b,
									c,
									f,
									function () {
										g.frameId = CKEDITOR.tools.getNextId() + "_fileInput";
										var a = [
											'\x3ciframe frameborder\x3d"0" allowtransparency\x3d"0" class\x3d"cke_dialog_ui_input_file" role\x3d"presentation" id\x3d"',
											g.frameId,
											'" title\x3d"',
											c.label,
											'" src\x3d"javascript:void(',
										];
										a.push(
											CKEDITOR.env.ie
												? "(function(){" +
														encodeURIComponent(
															"document.open();(" +
																CKEDITOR.tools.fixDomain +
																")();document.close();"
														) +
														"})()"
												: "0"
										);
										a.push(')"\x3e\x3c/iframe\x3e');
										return a.join("");
									}
								);
							}
						},
						fileButton: function (b, c, f) {
							var g = this;
							if (!(3 > arguments.length)) {
								a.call(this, c);
								c.validate && (this.validate = c.validate);
								var d = CKEDITOR.tools.extend({}, c),
									h = d.onClick;
								d.className =
									(d.className ? d.className + " " : "") +
									"cke_dialog_ui_button";
								d.onClick = function (a) {
									var f = c["for"];
									a = h ? h.call(this, a) : !1;
									!1 !== a &&
										("xhr" !== a && b.getContentElement(f[0], f[1]).submit(),
										this.disable());
								};
								b.on("load", function () {
									b.getContentElement(c["for"][0], c["for"][1])._.buttons.push(
										g
									);
								});
								CKEDITOR.ui.dialog.button.call(this, b, d, f);
							}
						},
						html: (function () {
							var a = /^\s*<[\w:]+\s+([^>]*)?>/,
								b = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/,
								c = /\/$/;
							return function (g, d, h) {
								if (!(3 > arguments.length)) {
									var k = [],
										l = d.html;
									"\x3c" != l.charAt(0) &&
										(l = "\x3cspan\x3e" + l + "\x3c/span\x3e");
									var u = d.focus;
									if (u) {
										var w = this.focus;
										this.focus = function () {
											("function" == typeof u ? u : w).call(this);
											this.fire("focus");
										};
										d.isFocusable && (this.isFocusable = this.isFocusable);
										this.keyboardFocusable = !0;
									}
									CKEDITOR.ui.dialog.uiElement.call(
										this,
										g,
										d,
										k,
										"span",
										null,
										null,
										""
									);
									k = k.join("").match(a);
									l = l.match(b) || ["", "", ""];
									c.test(l[1]) &&
										((l[1] = l[1].slice(0, -1)), (l[2] = "/" + l[2]));
									h.push([l[1], " ", k[1] || "", l[2]].join(""));
								}
							};
						})(),
						fieldset: function (a, b, c, g, d) {
							var h = d.label;
							this._ = { children: b };
							CKEDITOR.ui.dialog.uiElement.call(
								this,
								a,
								d,
								g,
								"fieldset",
								null,
								null,
								function () {
									var a = [];
									h &&
										a.push(
											"\x3clegend" +
												(d.labelStyle
													? ' style\x3d"' + d.labelStyle + '"'
													: "") +
												"\x3e" +
												h +
												"\x3c/legend\x3e"
										);
									for (var b = 0; b < c.length; b++) a.push(c[b]);
									return a.join("");
								}
							);
						},
					},
					!0
				);
				CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement();
				CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(
					new CKEDITOR.ui.dialog.uiElement(),
					{
						setLabel: function (a) {
							var b = CKEDITOR.document.getById(this._.labelId);
							1 > b.getChildCount()
								? new CKEDITOR.dom.text(a, CKEDITOR.document).appendTo(b)
								: (b.getChild(0).$.nodeValue = a);
							return this;
						},
						getLabel: function () {
							var a = CKEDITOR.document.getById(this._.labelId);
							return !a || 1 > a.getChildCount() ? "" : a.getChild(0).getText();
						},
						eventProcessors: g,
					},
					!0
				);
				CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(
					new CKEDITOR.ui.dialog.uiElement(),
					{
						click: function () {
							return this._.disabled
								? !1
								: this.fire("click", { dialog: this._.dialog });
						},
						enable: function () {
							this._.disabled = !1;
							var a = this.getElement();
							a && a.removeClass("cke_disabled");
						},
						disable: function () {
							this._.disabled = !0;
							this.getElement().addClass("cke_disabled");
						},
						isVisible: function () {
							return this.getElement().getFirst().isVisible();
						},
						isEnabled: function () {
							return !this._.disabled;
						},
						eventProcessors: CKEDITOR.tools.extend(
							{},
							CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors,
							{
								onClick: function (a, b) {
									this.on("click", function () {
										b.apply(this, arguments);
									});
								},
							},
							!0
						),
						accessKeyUp: function () {
							this.click();
						},
						accessKeyDown: function () {
							this.focus();
						},
						keyboardFocusable: !0,
					},
					!0
				);
				CKEDITOR.ui.dialog.textInput.prototype = CKEDITOR.tools.extend(
					new CKEDITOR.ui.dialog.labeledElement(),
					{
						getInputElement: function () {
							return CKEDITOR.document.getById(this._.inputId);
						},
						focus: function () {
							var a = this.selectParentTab();
							setTimeout(function () {
								var b = a.getInputElement();
								b && b.$.focus();
							}, 0);
						},
						select: function () {
							var a = this.selectParentTab();
							setTimeout(function () {
								var b = a.getInputElement();
								b && (b.$.focus(), b.$.select());
							}, 0);
						},
						accessKeyUp: function () {
							this.select();
						},
						setValue: function (a) {
							if (this.bidi) {
								var b = a && a.charAt(0);
								(b = "‪" == b ? "ltr" : "‫" == b ? "rtl" : null) &&
									(a = a.slice(1));
								this.setDirectionMarker(b);
							}
							a || (a = "");
							return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(
								this,
								arguments
							);
						},
						getValue: function () {
							var a = CKEDITOR.ui.dialog.uiElement.prototype.getValue.call(
								this
							);
							if (this.bidi && a) {
								var b = this.getDirectionMarker();
								b && (a = ("ltr" == b ? "‪" : "‫") + a);
							}
							return a;
						},
						setDirectionMarker: function (a) {
							var b = this.getInputElement();
							a
								? b.setAttributes({ dir: a, "data-cke-dir-marker": a })
								: this.getDirectionMarker() &&
								  b.removeAttributes(["dir", "data-cke-dir-marker"]);
						},
						getDirectionMarker: function () {
							return this.getInputElement().data("cke-dir-marker");
						},
						keyboardFocusable: !0,
					},
					c,
					!0
				);
				CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput();
				CKEDITOR.ui.dialog.select.prototype = CKEDITOR.tools.extend(
					new CKEDITOR.ui.dialog.labeledElement(),
					{
						getInputElement: function () {
							return this._.select.getElement();
						},
						add: function (a, b, c) {
							var g = new CKEDITOR.dom.element(
									"option",
									this.getDialog().getParentEditor().document
								),
								d = this.getInputElement().$;
							g.$.text = a;
							g.$.value = void 0 === b || null === b ? a : b;
							void 0 === c || null === c
								? CKEDITOR.env.ie
									? d.add(g.$)
									: d.add(g.$, null)
								: d.add(g.$, c);
							return this;
						},
						remove: function (a) {
							this.getInputElement().$.remove(a);
							return this;
						},
						clear: function () {
							for (var a = this.getInputElement().$; 0 < a.length; )
								a.remove(0);
							return this;
						},
						keyboardFocusable: !0,
					},
					c,
					!0
				);
				CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(
					new CKEDITOR.ui.dialog.uiElement(),
					{
						getInputElement: function () {
							return this._.checkbox.getElement();
						},
						setValue: function (a, b) {
							this.getInputElement().$.checked = a;
							!b && this.fire("change", { value: a });
						},
						getValue: function () {
							return this.getInputElement().$.checked;
						},
						accessKeyUp: function () {
							this.setValue(!this.getValue());
						},
						eventProcessors: {
							onChange: function (a, b) {
								if (!CKEDITOR.env.ie || 8 < CKEDITOR.env.version)
									return g.onChange.apply(this, arguments);
								a.on(
									"load",
									function () {
										var a = this._.checkbox.getElement();
										a.on(
											"propertychange",
											function (b) {
												b = b.data.$;
												"checked" == b.propertyName &&
													this.fire("change", { value: a.$.checked });
											},
											this
										);
									},
									this
								);
								this.on("change", b);
								return null;
							},
						},
						keyboardFocusable: !0,
					},
					c,
					!0
				);
				CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(
					new CKEDITOR.ui.dialog.uiElement(),
					{
						setValue: function (a, b) {
							for (
								var c = this._.children, g, d = 0;
								d < c.length && (g = c[d]);
								d++
							)
								g.getElement().$.checked = g.getValue() == a;
							!b && this.fire("change", { value: a });
						},
						getValue: function () {
							for (var a = this._.children, b = 0; b < a.length; b++)
								if (a[b].getElement().$.checked) return a[b].getValue();
							return null;
						},
						accessKeyUp: function () {
							var a = this._.children,
								b;
							for (b = 0; b < a.length; b++)
								if (a[b].getElement().$.checked) {
									a[b].getElement().focus();
									return;
								}
							a[0].getElement().focus();
						},
						eventProcessors: {
							onChange: function (a, b) {
								if (!CKEDITOR.env.ie || 8 < CKEDITOR.env.version)
									return g.onChange.apply(this, arguments);
								a.on(
									"load",
									function () {
										for (
											var a = this._.children, b = this, c = 0;
											c < a.length;
											c++
										)
											a[c].getElement().on("propertychange", function (a) {
												a = a.data.$;
												"checked" == a.propertyName &&
													this.$.checked &&
													b.fire("change", {
														value: this.getAttribute("value"),
													});
											});
									},
									this
								);
								this.on("change", b);
								return null;
							},
						},
					},
					c,
					!0
				);
				CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(
					new CKEDITOR.ui.dialog.labeledElement(),
					c,
					{
						getInputElement: function () {
							var a = CKEDITOR.document
								.getById(this._.frameId)
								.getFrameDocument();
							return 0 < a.$.forms.length
								? new CKEDITOR.dom.element(a.$.forms[0].elements[0])
								: this.getElement();
						},
						submit: function () {
							this.getInputElement().getParent().$.submit();
							return this;
						},
						getAction: function () {
							return this.getInputElement().getParent().$.action;
						},
						registerEvents: function (a) {
							var b = /^on([A-Z]\w+)/,
								c,
								g = function (a, b, c, f) {
									a.on("formLoaded", function () {
										a.getInputElement().on(c, f, a);
									});
								},
								d;
							for (d in a)
								if ((c = d.match(b)))
									this.eventProcessors[d]
										? this.eventProcessors[d].call(this, this._.dialog, a[d])
										: g(this, this._.dialog, c[1].toLowerCase(), a[d]);
							return this;
						},
						reset: function () {
							function a() {
								c.$.open();
								var e = "";
								g.size && (e = g.size - (CKEDITOR.env.ie ? 7 : 0));
								var q = b.frameId + "_input";
								c.$.write(
									[
										'\x3chtml dir\x3d"' +
											l +
											'" lang\x3d"' +
											u +
											'"\x3e\x3chead\x3e\x3ctitle\x3e\x3c/title\x3e\x3c/head\x3e\x3cbody style\x3d"margin: 0; overflow: hidden; background: transparent;"\x3e',
										'\x3cform enctype\x3d"multipart/form-data" method\x3d"POST" dir\x3d"' +
											l +
											'" lang\x3d"' +
											u +
											'" action\x3d"',
										CKEDITOR.tools.htmlEncode(g.action),
										'"\x3e\x3clabel id\x3d"',
										b.labelId,
										'" for\x3d"',
										q,
										'" style\x3d"display:none"\x3e',
										CKEDITOR.tools.htmlEncode(g.label),
										'\x3c/label\x3e\x3cinput style\x3d"width:100%" id\x3d"',
										q,
										'" aria-labelledby\x3d"',
										b.labelId,
										'" type\x3d"file" name\x3d"',
										CKEDITOR.tools.htmlEncode(g.id || "cke_upload"),
										'" size\x3d"',
										CKEDITOR.tools.htmlEncode(0 < e ? e : ""),
										'" /\x3e\x3c/form\x3e\x3c/body\x3e\x3c/html\x3e\x3cscript\x3e',
										CKEDITOR.env.ie
											? "(" + CKEDITOR.tools.fixDomain + ")();"
											: "",
										"window.parent.CKEDITOR.tools.callFunction(" + h + ");",
										"window.onbeforeunload \x3d function() {window.parent.CKEDITOR.tools.callFunction(" +
											k +
											")}",
										"\x3c/script\x3e",
									].join("")
								);
								c.$.close();
								for (e = 0; e < d.length; e++) d[e].enable();
							}
							var b = this._,
								c = CKEDITOR.document.getById(b.frameId).getFrameDocument(),
								g = b.definition,
								d = b.buttons,
								h = this.formLoadedNumber,
								k = this.formUnloadNumber,
								l = b.dialog._.editor.lang.dir,
								u = b.dialog._.editor.langCode;
							h ||
								((h = this.formLoadedNumber = CKEDITOR.tools.addFunction(
									function () {
										this.fire("formLoaded");
									},
									this
								)),
								(k = this.formUnloadNumber = CKEDITOR.tools.addFunction(
									function () {
										this.getInputElement().clearCustomData();
									},
									this
								)),
								this.getDialog()._.editor.on("destroy", function () {
									CKEDITOR.tools.removeFunction(h);
									CKEDITOR.tools.removeFunction(k);
								}));
							CKEDITOR.env.gecko ? setTimeout(a, 500) : a();
						},
						getValue: function () {
							return this.getInputElement().$.value || "";
						},
						setInitValue: function () {
							this._.initValue = "";
						},
						eventProcessors: {
							onChange: function (a, b) {
								this._.domOnChangeRegistered ||
									(this.on(
										"formLoaded",
										function () {
											this.getInputElement().on(
												"change",
												function () {
													this.fire("change", { value: this.getValue() });
												},
												this
											);
										},
										this
									),
									(this._.domOnChangeRegistered = !0));
								this.on("change", b);
							},
						},
						keyboardFocusable: !0,
					},
					!0
				);
				CKEDITOR.ui.dialog.fileButton.prototype = new CKEDITOR.ui.dialog.button();
				CKEDITOR.ui.dialog.fieldset.prototype = CKEDITOR.tools.clone(
					CKEDITOR.ui.dialog.hbox.prototype
				);
				CKEDITOR.dialog.addUIElement("text", d);
				CKEDITOR.dialog.addUIElement("password", d);
				CKEDITOR.dialog.addUIElement("tel", d);
				CKEDITOR.dialog.addUIElement("textarea", b);
				CKEDITOR.dialog.addUIElement("checkbox", b);
				CKEDITOR.dialog.addUIElement("radio", b);
				CKEDITOR.dialog.addUIElement("button", b);
				CKEDITOR.dialog.addUIElement("select", b);
				CKEDITOR.dialog.addUIElement("file", b);
				CKEDITOR.dialog.addUIElement("fileButton", b);
				CKEDITOR.dialog.addUIElement("html", b);
				CKEDITOR.dialog.addUIElement("fieldset", {
					build: function (a, b, c) {
						for (
							var g = b.children, d, h = [], k = [], l = 0;
							l < g.length && (d = g[l]);
							l++
						) {
							var u = [];
							h.push(u);
							k.push(
								CKEDITOR.dialog._.uiElementBuilders[d.type].build(a, d, u)
							);
						}
						return new CKEDITOR.ui.dialog[b.type](a, k, h, c, b);
					},
				});
			},
		}),
		(CKEDITOR.DIALOG_RESIZE_NONE = 0),
		(CKEDITOR.DIALOG_RESIZE_WIDTH = 1),
		(CKEDITOR.DIALOG_RESIZE_HEIGHT = 2),
		(CKEDITOR.DIALOG_RESIZE_BOTH = 3),
		(CKEDITOR.DIALOG_STATE_IDLE = 1),
		(CKEDITOR.DIALOG_STATE_BUSY = 2),
		(function () {
			function a() {
				for (
					var a = this._.tabIdList.length,
						b =
							CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a,
						c = b - 1;
					c > b - a;
					c--
				)
					if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight)
						return this._.tabIdList[c % a];
				return null;
			}
			function d() {
				for (
					var a = this._.tabIdList.length,
						b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId),
						c = b + 1;
					c < b + a;
					c++
				)
					if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight)
						return this._.tabIdList[c % a];
				return null;
			}
			function b(a, b) {
				for (
					var c = a.$.getElementsByTagName("input"), f = 0, e = c.length;
					f < e;
					f++
				) {
					var g = new CKEDITOR.dom.element(c[f]);
					"text" == g.getAttribute("type").toLowerCase() &&
						(b
							? (g.setAttribute("value", g.getCustomData("fake_value") || ""),
							  g.removeCustomData("fake_value"))
							: (g.setCustomData("fake_value", g.getAttribute("value")),
							  g.setAttribute("value", "")));
				}
			}
			function c(a, b) {
				var c = this.getInputElement();
				c &&
					(a
						? c.removeAttribute("aria-invalid")
						: c.setAttribute("aria-invalid", !0));
				a || (this.select ? this.select() : this.focus());
				b && alert(b);
				this.fire("validated", { valid: a, msg: b });
			}
			function g() {
				var a = this.getInputElement();
				a && a.removeAttribute("aria-invalid");
			}
			function l(a) {
				var b = CKEDITOR.dom.element.createFromHtml(
						CKEDITOR.addTemplate("dialog", p).output({
							id: CKEDITOR.tools.getNextNumber(),
							editorId: a.id,
							langDir: a.lang.dir,
							langCode: a.langCode,
							editorDialogClass:
								"cke_editor_" + a.name.replace(/\./g, "\\.") + "_dialog",
							closeTitle: a.lang.common.close,
							hidpi: CKEDITOR.env.hidpi ? "cke_hidpi" : "",
						})
					),
					c = b.getChild([0, 0, 0, 0, 0]),
					f = c.getChild(0),
					e = c.getChild(1);
				a.plugins.clipboard &&
					CKEDITOR.plugins.clipboard.preventDefaultDropOnElement(c);
				!CKEDITOR.env.ie ||
					CKEDITOR.env.quirks ||
					CKEDITOR.env.edge ||
					((a =
						"javascript:void(function(){" +
						encodeURIComponent(
							"document.open();(" +
								CKEDITOR.tools.fixDomain +
								")();document.close();"
						) +
						"}())"),
					CKEDITOR.dom.element
						.createFromHtml(
							'\x3ciframe frameBorder\x3d"0" class\x3d"cke_iframe_shim" src\x3d"' +
								a +
								'" tabIndex\x3d"-1"\x3e\x3c/iframe\x3e'
						)
						.appendTo(c.getParent()));
				f.unselectable();
				e.unselectable();
				return {
					element: b,
					parts: {
						dialog: b.getChild(0),
						title: f,
						close: e,
						tabs: c.getChild(2),
						contents: c.getChild([3, 0, 0, 0]),
						footer: c.getChild([3, 0, 1, 0]),
					},
				};
			}
			function k(a, b, c) {
				this.element = b;
				this.focusIndex = c;
				this.tabIndex = 0;
				this.isFocusable = function () {
					return !b.getAttribute("disabled") && b.isVisible();
				};
				this.focus = function () {
					a._.currentFocusIndex = this.focusIndex;
					this.element.focus();
				};
				b.on("keydown", function (a) {
					a.data.getKeystroke() in { 32: 1, 13: 1 } && this.fire("click");
				});
				b.on("focus", function () {
					this.fire("mouseover");
				});
				b.on("blur", function () {
					this.fire("mouseout");
				});
			}
			function h(a) {
				function b() {
					a.layout();
				}
				var c = CKEDITOR.document.getWindow();
				c.on("resize", b);
				a.on("hide", function () {
					c.removeListener("resize", b);
				});
			}
			function e(a, b) {
				this._ = { dialog: a };
				CKEDITOR.tools.extend(this, b);
			}
			function m(a) {
				function b(c) {
					var k = a.getSize(),
						m = CKEDITOR.document.getWindow().getViewPaneSize(),
						l = c.data.$.screenX,
						n = c.data.$.screenY,
						q = l - f.x,
						t = n - f.y;
					f = { x: l, y: n };
					e.x += q;
					e.y += t;
					a.move(
						e.x + h[3] < d
							? -h[3]
							: e.x - h[1] > m.width - k.width - d
							? m.width - k.width + ("rtl" == g.lang.dir ? 0 : h[1])
							: e.x,
						e.y + h[0] < d
							? -h[0]
							: e.y - h[2] > m.height - k.height - d
							? m.height - k.height + h[2]
							: e.y,
						1
					);
					c.data.preventDefault();
				}
				function c() {
					CKEDITOR.document.removeListener("mousemove", b);
					CKEDITOR.document.removeListener("mouseup", c);
					if (CKEDITOR.env.ie6Compat) {
						var a = B.getChild(0).getFrameDocument();
						a.removeListener("mousemove", b);
						a.removeListener("mouseup", c);
					}
				}
				var f = null,
					e = null,
					g = a.getParentEditor(),
					d = g.config.dialog_magnetDistance,
					h = CKEDITOR.skin.margins || [0, 0, 0, 0];
				"undefined" == typeof d && (d = 20);
				a.parts.title.on(
					"mousedown",
					function (g) {
						f = { x: g.data.$.screenX, y: g.data.$.screenY };
						CKEDITOR.document.on("mousemove", b);
						CKEDITOR.document.on("mouseup", c);
						e = a.getPosition();
						if (CKEDITOR.env.ie6Compat) {
							var d = B.getChild(0).getFrameDocument();
							d.on("mousemove", b);
							d.on("mouseup", c);
						}
						g.data.preventDefault();
					},
					a
				);
			}
			function f(a) {
				function b(c) {
					var n = "rtl" == g.lang.dir,
						q = l.width,
						t = l.height,
						u =
							q + (c.data.$.screenX - m.x) * (n ? -1 : 1) * (a._.moved ? 1 : 2),
						r = t + (c.data.$.screenY - m.y) * (a._.moved ? 1 : 2),
						w = a._.element.getFirst(),
						w = n && w.getComputedStyle("right"),
						y = a.getPosition();
					y.y + r > k.height && (r = k.height - y.y);
					(n ? w : y.x) + u > k.width && (u = k.width - (n ? w : y.x));
					if (
						e == CKEDITOR.DIALOG_RESIZE_WIDTH ||
						e == CKEDITOR.DIALOG_RESIZE_BOTH
					)
						q = Math.max(f.minWidth || 0, u - d);
					if (
						e == CKEDITOR.DIALOG_RESIZE_HEIGHT ||
						e == CKEDITOR.DIALOG_RESIZE_BOTH
					)
						t = Math.max(f.minHeight || 0, r - h);
					a.resize(q, t);
					a._.moved || a.layout();
					c.data.preventDefault();
				}
				function c() {
					CKEDITOR.document.removeListener("mouseup", c);
					CKEDITOR.document.removeListener("mousemove", b);
					n && (n.remove(), (n = null));
					if (CKEDITOR.env.ie6Compat) {
						var a = B.getChild(0).getFrameDocument();
						a.removeListener("mouseup", c);
						a.removeListener("mousemove", b);
					}
				}
				var f = a.definition,
					e = f.resizable;
				if (e != CKEDITOR.DIALOG_RESIZE_NONE) {
					var g = a.getParentEditor(),
						d,
						h,
						k,
						m,
						l,
						n,
						q = CKEDITOR.tools.addFunction(function (f) {
							l = a.getSize();
							var e = a.parts.contents;
							e.$.getElementsByTagName("iframe").length &&
								((n = CKEDITOR.dom.element.createFromHtml(
									'\x3cdiv class\x3d"cke_dialog_resize_cover" style\x3d"height: 100%; position: absolute; width: 100%;"\x3e\x3c/div\x3e'
								)),
								e.append(n));
							h =
								l.height -
								a.parts.contents.getSize(
									"height",
									!(
										CKEDITOR.env.gecko ||
										(CKEDITOR.env.ie && CKEDITOR.env.quirks)
									)
								);
							d = l.width - a.parts.contents.getSize("width", 1);
							m = { x: f.screenX, y: f.screenY };
							k = CKEDITOR.document.getWindow().getViewPaneSize();
							CKEDITOR.document.on("mousemove", b);
							CKEDITOR.document.on("mouseup", c);
							CKEDITOR.env.ie6Compat &&
								((e = B.getChild(0).getFrameDocument()),
								e.on("mousemove", b),
								e.on("mouseup", c));
							f.preventDefault && f.preventDefault();
						});
					a.on("load", function () {
						var b = "";
						e == CKEDITOR.DIALOG_RESIZE_WIDTH
							? (b = " cke_resizer_horizontal")
							: e == CKEDITOR.DIALOG_RESIZE_HEIGHT &&
							  (b = " cke_resizer_vertical");
						b = CKEDITOR.dom.element.createFromHtml(
							'\x3cdiv class\x3d"cke_resizer' +
								b +
								" cke_resizer_" +
								g.lang.dir +
								'" title\x3d"' +
								CKEDITOR.tools.htmlEncode(g.lang.common.resize) +
								'" onmousedown\x3d"CKEDITOR.tools.callFunction(' +
								q +
								', event )"\x3e' +
								("ltr" == g.lang.dir ? "◢" : "◣") +
								"\x3c/div\x3e"
						);
						a.parts.footer.append(b, 1);
					});
					g.on("destroy", function () {
						CKEDITOR.tools.removeFunction(q);
					});
				}
			}
			function n(a) {
				a.data.preventDefault(1);
			}
			function r(a) {
				var b = CKEDITOR.document.getWindow(),
					c = a.config,
					f = CKEDITOR.skinName || a.config.skin,
					e =
						c.dialog_backgroundCoverColor ||
						("moono-lisa" == f ? "black" : "white"),
					f = c.dialog_backgroundCoverOpacity,
					g = c.baseFloatZIndex,
					c = CKEDITOR.tools.genKey(e, f, g),
					d = C[c];
				d
					? d.show()
					: ((g = [
							'\x3cdiv tabIndex\x3d"-1" style\x3d"position: ',
							CKEDITOR.env.ie6Compat ? "absolute" : "fixed",
							"; z-index: ",
							g,
							"; top: 0px; left: 0px; ",
							CKEDITOR.env.ie6Compat ? "" : "background-color: " + e,
							'" class\x3d"cke_dialog_background_cover"\x3e',
					  ]),
					  CKEDITOR.env.ie6Compat &&
							((e =
								"\x3chtml\x3e\x3cbody style\x3d\\'background-color:" +
								e +
								";\\'\x3e\x3c/body\x3e\x3c/html\x3e"),
							g.push(
								'\x3ciframe hidefocus\x3d"true" frameborder\x3d"0" id\x3d"cke_dialog_background_iframe" src\x3d"javascript:'
							),
							g.push(
								"void((function(){" +
									encodeURIComponent(
										"document.open();(" +
											CKEDITOR.tools.fixDomain +
											")();document.write( '" +
											e +
											"' );document.close();"
									) +
									"})())"
							),
							g.push(
								'" style\x3d"position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity\x3d0)"\x3e\x3c/iframe\x3e'
							)),
					  g.push("\x3c/div\x3e"),
					  (d = CKEDITOR.dom.element.createFromHtml(g.join(""))),
					  d.setOpacity(void 0 !== f ? f : 0.5),
					  d.on("keydown", n),
					  d.on("keypress", n),
					  d.on("keyup", n),
					  d.appendTo(CKEDITOR.document.getBody()),
					  (C[c] = d));
				a.focusManager.add(d);
				B = d;
				a = function () {
					var a = b.getViewPaneSize();
					d.setStyles({ width: a.width + "px", height: a.height + "px" });
				};
				var h = function () {
					var a = b.getScrollPosition(),
						c = CKEDITOR.dialog._.currentTop;
					d.setStyles({ left: a.x + "px", top: a.y + "px" });
					if (c) {
						do (a = c.getPosition()), c.move(a.x, a.y);
						while ((c = c._.parentDialog));
					}
				};
				y = a;
				b.on("resize", a);
				a();
				(CKEDITOR.env.mac && CKEDITOR.env.webkit) || d.focus();
				if (CKEDITOR.env.ie6Compat) {
					var k = function () {
						h();
						arguments.callee.prevScrollHandler.apply(this, arguments);
					};
					b.$.setTimeout(function () {
						k.prevScrollHandler = window.onscroll || function () {};
						window.onscroll = k;
					}, 0);
					h();
				}
			}
			function x(a) {
				B &&
					(a.focusManager.remove(B),
					(a = CKEDITOR.document.getWindow()),
					B.hide(),
					a.removeListener("resize", y),
					CKEDITOR.env.ie6Compat &&
						a.$.setTimeout(function () {
							window.onscroll =
								(window.onscroll && window.onscroll.prevScrollHandler) || null;
						}, 0),
					(y = null));
			}
			var v = CKEDITOR.tools.cssLength,
				p =
					'\x3cdiv class\x3d"cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir\x3d"{langDir}" lang\x3d"{langCode}" role\x3d"dialog" aria-labelledby\x3d"cke_dialog_title_{id}"\x3e\x3ctable class\x3d"cke_dialog ' +
					CKEDITOR.env.cssClass +
					' cke_{langDir}" style\x3d"position:absolute" role\x3d"presentation"\x3e\x3ctr\x3e\x3ctd role\x3d"presentation"\x3e\x3cdiv class\x3d"cke_dialog_body" role\x3d"presentation"\x3e\x3cdiv id\x3d"cke_dialog_title_{id}" class\x3d"cke_dialog_title" role\x3d"presentation"\x3e\x3c/div\x3e\x3ca id\x3d"cke_dialog_close_button_{id}" class\x3d"cke_dialog_close_button" href\x3d"javascript:void(0)" title\x3d"{closeTitle}" role\x3d"button"\x3e\x3cspan class\x3d"cke_label"\x3eX\x3c/span\x3e\x3c/a\x3e\x3cdiv id\x3d"cke_dialog_tabs_{id}" class\x3d"cke_dialog_tabs" role\x3d"tablist"\x3e\x3c/div\x3e\x3ctable class\x3d"cke_dialog_contents" role\x3d"presentation"\x3e\x3ctr\x3e\x3ctd id\x3d"cke_dialog_contents_{id}" class\x3d"cke_dialog_contents_body" role\x3d"presentation"\x3e\x3c/td\x3e\x3c/tr\x3e\x3ctr\x3e\x3ctd id\x3d"cke_dialog_footer_{id}" class\x3d"cke_dialog_footer" role\x3d"presentation"\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/div\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\x3c/div\x3e';
			CKEDITOR.dialog = function (b, e) {
				function h() {
					var a = A._.focusList;
					a.sort(function (a, b) {
						return a.tabIndex != b.tabIndex
							? b.tabIndex - a.tabIndex
							: a.focusIndex - b.focusIndex;
					});
					for (var b = a.length, c = 0; c < b; c++) a[c].focusIndex = c;
				}
				function k(a) {
					var b = A._.focusList;
					a = a || 0;
					if (!(1 > b.length)) {
						var c = A._.currentFocusIndex;
						A._.tabBarMode && 0 > a && (c = 0);
						try {
							b[c].getInputElement().$.blur();
						} catch (f) {}
						var e = c,
							g = 1 < A._.pageCount;
						do {
							e += a;
							if (g && !A._.tabBarMode && (e == b.length || -1 == e)) {
								A._.tabBarMode = !0;
								A._.tabs[A._.currentTabId][0].focus();
								A._.currentFocusIndex = -1;
								return;
							}
							e = (e + b.length) % b.length;
							if (e == c) break;
						} while (a && !b[e].isFocusable());
						b[e].focus();
						"text" == b[e].type && b[e].select();
					}
				}
				function n(c) {
					if (A == CKEDITOR.dialog._.currentTop) {
						var f = c.data.getKeystroke(),
							e = "rtl" == b.lang.dir,
							g = [37, 38, 39, 40];
						x = v = 0;
						if (9 == f || f == CKEDITOR.SHIFT + 9)
							k(f == CKEDITOR.SHIFT + 9 ? -1 : 1), (x = 1);
						else if (
							f == CKEDITOR.ALT + 121 &&
							!A._.tabBarMode &&
							1 < A.getPageCount()
						)
							(A._.tabBarMode = !0),
								A._.tabs[A._.currentTabId][0].focus(),
								(A._.currentFocusIndex = -1),
								(x = 1);
						else if (-1 != CKEDITOR.tools.indexOf(g, f) && A._.tabBarMode)
							(f =
								-1 != CKEDITOR.tools.indexOf([e ? 39 : 37, 38], f)
									? a.call(A)
									: d.call(A)),
								A.selectPage(f),
								A._.tabs[f][0].focus(),
								(x = 1);
						else if ((13 != f && 32 != f) || !A._.tabBarMode)
							if (13 == f)
								(f = c.data.getTarget()),
									f.is("a", "button", "select", "textarea") ||
										(f.is("input") && "button" == f.$.type) ||
										((f = this.getButton("ok")) &&
											CKEDITOR.tools.setTimeout(f.click, 0, f),
										(x = 1)),
									(v = 1);
							else if (27 == f)
								(f = this.getButton("cancel"))
									? CKEDITOR.tools.setTimeout(f.click, 0, f)
									: !1 !== this.fire("cancel", { hide: !0 }).hide &&
									  this.hide(),
									(v = 1);
							else return;
						else
							this.selectPage(this._.currentTabId),
								(this._.tabBarMode = !1),
								(this._.currentFocusIndex = -1),
								k(1),
								(x = 1);
						q(c);
					}
				}
				function q(a) {
					x ? a.data.preventDefault(1) : v && a.data.stopPropagation();
				}
				var r = CKEDITOR.dialog._.dialogDefinitions[e],
					w = CKEDITOR.tools.clone(u),
					y = b.config.dialog_buttonsOrder || "OS",
					z = b.lang.dir,
					B = {},
					x,
					v;
				(("OS" == y && CKEDITOR.env.mac) ||
					("rtl" == y && "ltr" == z) ||
					("ltr" == y && "rtl" == z)) &&
					w.buttons.reverse();
				r = CKEDITOR.tools.extend(r(b), w);
				r = CKEDITOR.tools.clone(r);
				r = new t(this, r);
				w = l(b);
				this._ = {
					editor: b,
					element: w.element,
					name: e,
					contentSize: { width: 0, height: 0 },
					size: { width: 0, height: 0 },
					contents: {},
					buttons: {},
					accessKeyMap: {},
					tabs: {},
					tabIdList: [],
					currentTabId: null,
					currentTabIndex: null,
					pageCount: 0,
					lastTab: null,
					tabBarMode: !1,
					focusList: [],
					currentFocusIndex: 0,
					hasFocus: !1,
				};
				this.parts = w.parts;
				CKEDITOR.tools.setTimeout(
					function () {
						b.fire("ariaWidget", this.parts.contents);
					},
					0,
					this
				);
				w = {
					position: CKEDITOR.env.ie6Compat ? "absolute" : "fixed",
					top: 0,
					visibility: "hidden",
				};
				w["rtl" == z ? "right" : "left"] = 0;
				this.parts.dialog.setStyles(w);
				CKEDITOR.event.call(this);
				this.definition = r = CKEDITOR.fire(
					"dialogDefinition",
					{ name: e, definition: r },
					b
				).definition;
				if (!("removeDialogTabs" in b._) && b.config.removeDialogTabs) {
					w = b.config.removeDialogTabs.split(";");
					for (z = 0; z < w.length; z++)
						if (((y = w[z].split(":")), 2 == y.length)) {
							var p = y[0];
							B[p] || (B[p] = []);
							B[p].push(y[1]);
						}
					b._.removeDialogTabs = B;
				}
				if (b._.removeDialogTabs && (B = b._.removeDialogTabs[e]))
					for (z = 0; z < B.length; z++) r.removeContents(B[z]);
				if (r.onLoad) this.on("load", r.onLoad);
				if (r.onShow) this.on("show", r.onShow);
				if (r.onHide) this.on("hide", r.onHide);
				if (r.onOk)
					this.on("ok", function (a) {
						b.fire("saveSnapshot");
						setTimeout(function () {
							b.fire("saveSnapshot");
						}, 0);
						!1 === r.onOk.call(this, a) && (a.data.hide = !1);
					});
				this.state = CKEDITOR.DIALOG_STATE_IDLE;
				if (r.onCancel)
					this.on("cancel", function (a) {
						!1 === r.onCancel.call(this, a) && (a.data.hide = !1);
					});
				var A = this,
					N = function (a) {
						var b = A._.contents,
							c = !1,
							f;
						for (f in b)
							for (var e in b[f]) if ((c = a.call(this, b[f][e]))) return;
					};
				this.on(
					"ok",
					function (a) {
						N(function (b) {
							if (b.validate) {
								var f = b.validate(this),
									e = "string" == typeof f || !1 === f;
								e && ((a.data.hide = !1), a.stop());
								c.call(b, !e, "string" == typeof f ? f : void 0);
								return e;
							}
						});
					},
					this,
					null,
					0
				);
				this.on(
					"cancel",
					function (a) {
						N(function (c) {
							if (c.isChanged())
								return (
									b.config.dialog_noConfirmCancel ||
										confirm(b.lang.common.confirmCancel) ||
										(a.data.hide = !1),
									!0
								);
						});
					},
					this,
					null,
					0
				);
				this.parts.close.on(
					"click",
					function (a) {
						!1 !== this.fire("cancel", { hide: !0 }).hide && this.hide();
						a.data.preventDefault();
					},
					this
				);
				this.changeFocus = k;
				var C = this._.element;
				b.focusManager.add(C, 1);
				this.on("show", function () {
					C.on("keydown", n, this);
					if (CKEDITOR.env.gecko) C.on("keypress", q, this);
				});
				this.on("hide", function () {
					C.removeListener("keydown", n);
					CKEDITOR.env.gecko && C.removeListener("keypress", q);
					N(function (a) {
						g.apply(a);
					});
				});
				this.on("iframeAdded", function (a) {
					new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document).on(
						"keydown",
						n,
						this,
						null,
						0
					);
				});
				this.on(
					"show",
					function () {
						h();
						var a = 1 < A._.pageCount;
						b.config.dialog_startupFocusTab && a
							? ((A._.tabBarMode = !0),
							  A._.tabs[A._.currentTabId][0].focus(),
							  (A._.currentFocusIndex = -1))
							: this._.hasFocus ||
							  ((this._.currentFocusIndex = a
									? -1
									: this._.focusList.length - 1),
							  r.onFocus ? (a = r.onFocus.call(this)) && a.focus() : k(1));
					},
					this,
					null,
					4294967295
				);
				if (CKEDITOR.env.ie6Compat)
					this.on(
						"load",
						function () {
							var a = this.getElement(),
								b = a.getFirst();
							b.remove();
							b.appendTo(a);
						},
						this
					);
				m(this);
				f(this);
				new CKEDITOR.dom.text(r.title, CKEDITOR.document).appendTo(
					this.parts.title
				);
				for (z = 0; z < r.contents.length; z++)
					(B = r.contents[z]) && this.addPage(B);
				this.parts.tabs.on(
					"click",
					function (a) {
						var b = a.data.getTarget();
						b.hasClass("cke_dialog_tab") &&
							((b = b.$.id),
							this.selectPage(b.substring(4, b.lastIndexOf("_"))),
							this._.tabBarMode &&
								((this._.tabBarMode = !1),
								(this._.currentFocusIndex = -1),
								k(1)),
							a.data.preventDefault());
					},
					this
				);
				z = [];
				B = CKEDITOR.dialog._.uiElementBuilders.hbox
					.build(
						this,
						{
							type: "hbox",
							className: "cke_dialog_footer_buttons",
							widths: [],
							children: r.buttons,
						},
						z
					)
					.getChild();
				this.parts.footer.setHtml(z.join(""));
				for (z = 0; z < B.length; z++) this._.buttons[B[z].id] = B[z];
			};
			CKEDITOR.dialog.prototype = {
				destroy: function () {
					this.hide();
					this._.element.remove();
				},
				resize: (function () {
					return function (a, b) {
						(this._.contentSize &&
							this._.contentSize.width == a &&
							this._.contentSize.height == b) ||
							(CKEDITOR.dialog.fire(
								"resize",
								{ dialog: this, width: a, height: b },
								this._.editor
							),
							this.fire("resize", { width: a, height: b }, this._.editor),
							this.parts.contents.setStyles({
								width: a + "px",
								height: b + "px",
							}),
							"rtl" == this._.editor.lang.dir &&
								this._.position &&
								(this._.position.x =
									CKEDITOR.document.getWindow().getViewPaneSize().width -
									this._.contentSize.width -
									parseInt(this._.element.getFirst().getStyle("right"), 10)),
							(this._.contentSize = { width: a, height: b }));
					};
				})(),
				getSize: function () {
					var a = this._.element.getFirst();
					return { width: a.$.offsetWidth || 0, height: a.$.offsetHeight || 0 };
				},
				move: function (a, b, c) {
					var f = this._.element.getFirst(),
						e = "rtl" == this._.editor.lang.dir,
						g = "fixed" == f.getComputedStyle("position");
					CKEDITOR.env.ie && f.setStyle("zoom", "100%");
					(g &&
						this._.position &&
						this._.position.x == a &&
						this._.position.y == b) ||
						((this._.position = { x: a, y: b }),
						g ||
							((g = CKEDITOR.document.getWindow().getScrollPosition()),
							(a += g.x),
							(b += g.y)),
						e &&
							((g = this.getSize()),
							(a =
								CKEDITOR.document.getWindow().getViewPaneSize().width -
								g.width -
								a)),
						(b = { top: (0 < b ? b : 0) + "px" }),
						(b[e ? "right" : "left"] = (0 < a ? a : 0) + "px"),
						f.setStyles(b),
						c && (this._.moved = 1));
				},
				getPosition: function () {
					return CKEDITOR.tools.extend({}, this._.position);
				},
				show: function () {
					var a = this._.element,
						b = this.definition;
					a.getParent() && a.getParent().equals(CKEDITOR.document.getBody())
						? a.setStyle("display", "block")
						: a.appendTo(CKEDITOR.document.getBody());
					this.resize(
						(this._.contentSize && this._.contentSize.width) ||
							b.width ||
							b.minWidth,
						(this._.contentSize && this._.contentSize.height) ||
							b.height ||
							b.minHeight
					);
					this.reset();
					null === this._.currentTabId &&
						this.selectPage(this.definition.contents[0].id);
					null === CKEDITOR.dialog._.currentZIndex &&
						(CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex);
					this._.element
						.getFirst()
						.setStyle("z-index", (CKEDITOR.dialog._.currentZIndex += 10));
					null === CKEDITOR.dialog._.currentTop
						? ((CKEDITOR.dialog._.currentTop = this),
						  (this._.parentDialog = null),
						  r(this._.editor))
						: ((this._.parentDialog = CKEDITOR.dialog._.currentTop),
						  (this._.parentDialog
								.getElement()
								.getFirst().$.style.zIndex -= Math.floor(
								this._.editor.config.baseFloatZIndex / 2
						  )),
						  (CKEDITOR.dialog._.currentTop = this));
					a.on("keydown", H);
					a.on("keyup", G);
					this._.hasFocus = !1;
					for (var c in b.contents)
						if (b.contents[c]) {
							var a = b.contents[c],
								f = this._.tabs[a.id],
								e = a.requiredContent,
								g = 0;
							if (f) {
								for (var d in this._.contents[a.id]) {
									var k = this._.contents[a.id][d];
									"hbox" != k.type &&
										"vbox" != k.type &&
										k.getInputElement() &&
										(k.requiredContent &&
										!this._.editor.activeFilter.check(k.requiredContent)
											? k.disable()
											: (k.enable(), g++));
								}
								!g || (e && !this._.editor.activeFilter.check(e))
									? f[0].addClass("cke_dialog_tab_disabled")
									: f[0].removeClass("cke_dialog_tab_disabled");
							}
						}
					CKEDITOR.tools.setTimeout(
						function () {
							this.layout();
							h(this);
							this.parts.dialog.setStyle("visibility", "");
							this.fireOnce("load", {});
							CKEDITOR.ui.fire("ready", this);
							this.fire("show", {});
							this._.editor.fire("dialogShow", this);
							this._.parentDialog || this._.editor.focusManager.lock();
							this.foreach(function (a) {
								a.setInitValue && a.setInitValue();
							});
						},
						100,
						this
					);
				},
				layout: function () {
					var a = this.parts.dialog,
						b = this.getSize(),
						c = CKEDITOR.document.getWindow().getViewPaneSize(),
						f = (c.width - b.width) / 2,
						e = (c.height - b.height) / 2;
					CKEDITOR.env.ie6Compat ||
						(b.height + (0 < e ? e : 0) > c.height ||
						b.width + (0 < f ? f : 0) > c.width
							? a.setStyle("position", "absolute")
							: a.setStyle("position", "fixed"));
					this.move(
						this._.moved ? this._.position.x : f,
						this._.moved ? this._.position.y : e
					);
				},
				foreach: function (a) {
					for (var b in this._.contents)
						for (var c in this._.contents[b])
							a.call(this, this._.contents[b][c]);
					return this;
				},
				reset: (function () {
					var a = function (a) {
						a.reset && a.reset(1);
					};
					return function () {
						this.foreach(a);
						return this;
					};
				})(),
				setupContent: function () {
					var a = arguments;
					this.foreach(function (b) {
						b.setup && b.setup.apply(b, a);
					});
				},
				commitContent: function () {
					var a = arguments;
					this.foreach(function (b) {
						CKEDITOR.env.ie &&
							this._.currentFocusIndex == b.focusIndex &&
							b.getInputElement().$.blur();
						b.commit && b.commit.apply(b, a);
					});
				},
				hide: function () {
					if (this.parts.dialog.isVisible()) {
						this.fire("hide", {});
						this._.editor.fire("dialogHide", this);
						this.selectPage(this._.tabIdList[0]);
						var a = this._.element;
						a.setStyle("display", "none");
						this.parts.dialog.setStyle("visibility", "hidden");
						for (E(this); CKEDITOR.dialog._.currentTop != this; )
							CKEDITOR.dialog._.currentTop.hide();
						if (this._.parentDialog) {
							var b = this._.parentDialog.getElement().getFirst();
							b.setStyle(
								"z-index",
								parseInt(b.$.style.zIndex, 10) +
									Math.floor(this._.editor.config.baseFloatZIndex / 2)
							);
						} else x(this._.editor);
						if ((CKEDITOR.dialog._.currentTop = this._.parentDialog))
							CKEDITOR.dialog._.currentZIndex -= 10;
						else {
							CKEDITOR.dialog._.currentZIndex = null;
							a.removeListener("keydown", H);
							a.removeListener("keyup", G);
							var c = this._.editor;
							c.focus();
							setTimeout(function () {
								c.focusManager.unlock();
								CKEDITOR.env.iOS && c.window.focus();
							}, 0);
						}
						delete this._.parentDialog;
						this.foreach(function (a) {
							a.resetInitValue && a.resetInitValue();
						});
						this.setState(CKEDITOR.DIALOG_STATE_IDLE);
					}
				},
				addPage: function (a) {
					if (
						!a.requiredContent ||
						this._.editor.filter.check(a.requiredContent)
					) {
						for (
							var b = [],
								c = a.label
									? ' title\x3d"' + CKEDITOR.tools.htmlEncode(a.label) + '"'
									: "",
								f = CKEDITOR.dialog._.uiElementBuilders.vbox.build(
									this,
									{
										type: "vbox",
										className: "cke_dialog_page_contents",
										children: a.elements,
										expand: !!a.expand,
										padding: a.padding,
										style: a.style || "width: 100%;",
									},
									b
								),
								e = (this._.contents[a.id] = {}),
								g = f.getChild(),
								d = 0;
							(f = g.shift());

						)
							f.notAllowed || "hbox" == f.type || "vbox" == f.type || d++,
								(e[f.id] = f),
								"function" == typeof f.getChild &&
									g.push.apply(g, f.getChild());
						d || (a.hidden = !0);
						b = CKEDITOR.dom.element.createFromHtml(b.join(""));
						b.setAttribute("role", "tabpanel");
						f = CKEDITOR.env;
						e = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber();
						c = CKEDITOR.dom.element.createFromHtml(
							[
								'\x3ca class\x3d"cke_dialog_tab"',
								0 < this._.pageCount ? " cke_last" : "cke_first",
								c,
								a.hidden ? ' style\x3d"display:none"' : "",
								' id\x3d"',
								e,
								'"',
								f.gecko && !f.hc ? "" : ' href\x3d"javascript:void(0)"',
								' tabIndex\x3d"-1" hidefocus\x3d"true" role\x3d"tab"\x3e',
								a.label,
								"\x3c/a\x3e",
							].join("")
						);
						b.setAttribute("aria-labelledby", e);
						this._.tabs[a.id] = [c, b];
						this._.tabIdList.push(a.id);
						!a.hidden && this._.pageCount++;
						this._.lastTab = c;
						this.updateStyle();
						b.setAttribute("name", a.id);
						b.appendTo(this.parts.contents);
						c.unselectable();
						this.parts.tabs.append(c);
						a.accessKey &&
							(J(this, this, "CTRL+" + a.accessKey, L, F),
							(this._.accessKeyMap["CTRL+" + a.accessKey] = a.id));
					}
				},
				selectPage: function (a) {
					if (
						this._.currentTabId != a &&
						!this._.tabs[a][0].hasClass("cke_dialog_tab_disabled") &&
						!1 !==
							this.fire("selectPage", {
								page: a,
								currentPage: this._.currentTabId,
							})
					) {
						for (var c in this._.tabs) {
							var f = this._.tabs[c][0],
								e = this._.tabs[c][1];
							c != a && (f.removeClass("cke_dialog_tab_selected"), e.hide());
							e.setAttribute("aria-hidden", c != a);
						}
						var g = this._.tabs[a];
						g[0].addClass("cke_dialog_tab_selected");
						CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat
							? (b(g[1]),
							  g[1].show(),
							  setTimeout(function () {
									b(g[1], 1);
							  }, 0))
							: g[1].show();
						this._.currentTabId = a;
						this._.currentTabIndex = CKEDITOR.tools.indexOf(
							this._.tabIdList,
							a
						);
					}
				},
				updateStyle: function () {
					this.parts.dialog[
						(1 === this._.pageCount ? "add" : "remove") + "Class"
					]("cke_single_page");
				},
				hidePage: function (b) {
					var c = this._.tabs[b] && this._.tabs[b][0];
					c &&
						1 != this._.pageCount &&
						c.isVisible() &&
						(b == this._.currentTabId && this.selectPage(a.call(this)),
						c.hide(),
						this._.pageCount--,
						this.updateStyle());
				},
				showPage: function (a) {
					if ((a = this._.tabs[a] && this._.tabs[a][0]))
						a.show(), this._.pageCount++, this.updateStyle();
				},
				getElement: function () {
					return this._.element;
				},
				getName: function () {
					return this._.name;
				},
				getContentElement: function (a, b) {
					var c = this._.contents[a];
					return c && c[b];
				},
				getValueOf: function (a, b) {
					return this.getContentElement(a, b).getValue();
				},
				setValueOf: function (a, b, c) {
					return this.getContentElement(a, b).setValue(c);
				},
				getButton: function (a) {
					return this._.buttons[a];
				},
				click: function (a) {
					return this._.buttons[a].click();
				},
				disableButton: function (a) {
					return this._.buttons[a].disable();
				},
				enableButton: function (a) {
					return this._.buttons[a].enable();
				},
				getPageCount: function () {
					return this._.pageCount;
				},
				getParentEditor: function () {
					return this._.editor;
				},
				getSelectedElement: function () {
					return this.getParentEditor().getSelection().getSelectedElement();
				},
				addFocusable: function (a, b) {
					if ("undefined" == typeof b)
						(b = this._.focusList.length),
							this._.focusList.push(new k(this, a, b));
					else {
						this._.focusList.splice(b, 0, new k(this, a, b));
						for (var c = b + 1; c < this._.focusList.length; c++)
							this._.focusList[c].focusIndex++;
					}
				},
				setState: function (a) {
					if (this.state != a) {
						this.state = a;
						if (a == CKEDITOR.DIALOG_STATE_BUSY) {
							if (!this.parts.spinner) {
								var b = this.getParentEditor().lang.dir,
									c = {
										attributes: { class: "cke_dialog_spinner" },
										styles: { float: "rtl" == b ? "right" : "left" },
									};
								c.styles["margin-" + ("rtl" == b ? "left" : "right")] = "8px";
								this.parts.spinner = CKEDITOR.document.createElement("div", c);
								this.parts.spinner.setHtml("\x26#8987;");
								this.parts.spinner.appendTo(this.parts.title, 1);
							}
							this.parts.spinner.show();
							this.getButton("ok").disable();
						} else
							a == CKEDITOR.DIALOG_STATE_IDLE &&
								(this.parts.spinner && this.parts.spinner.hide(),
								this.getButton("ok").enable());
						this.fire("state", a);
					}
				},
			};
			CKEDITOR.tools.extend(CKEDITOR.dialog, {
				add: function (a, b) {
					(this._.dialogDefinitions[a] && "function" != typeof b) ||
						(this._.dialogDefinitions[a] = b);
				},
				exists: function (a) {
					return !!this._.dialogDefinitions[a];
				},
				getCurrent: function () {
					return CKEDITOR.dialog._.currentTop;
				},
				isTabEnabled: function (a, b, c) {
					a = a.config.removeDialogTabs;
					return !(
						a && a.match(new RegExp("(?:^|;)" + b + ":" + c + "(?:$|;)", "i"))
					);
				},
				okButton: (function () {
					var a = function (a, b) {
						b = b || {};
						return CKEDITOR.tools.extend(
							{
								id: "ok",
								type: "button",
								label: a.lang.common.ok,
								class: "cke_dialog_ui_button_ok",
								onClick: function (a) {
									a = a.data.dialog;
									!1 !== a.fire("ok", { hide: !0 }).hide && a.hide();
								},
							},
							b,
							!0
						);
					};
					a.type = "button";
					a.override = function (b) {
						return CKEDITOR.tools.extend(
							function (c) {
								return a(c, b);
							},
							{ type: "button" },
							!0
						);
					};
					return a;
				})(),
				cancelButton: (function () {
					var a = function (a, b) {
						b = b || {};
						return CKEDITOR.tools.extend(
							{
								id: "cancel",
								type: "button",
								label: a.lang.common.cancel,
								class: "cke_dialog_ui_button_cancel",
								onClick: function (a) {
									a = a.data.dialog;
									!1 !== a.fire("cancel", { hide: !0 }).hide && a.hide();
								},
							},
							b,
							!0
						);
					};
					a.type = "button";
					a.override = function (b) {
						return CKEDITOR.tools.extend(
							function (c) {
								return a(c, b);
							},
							{ type: "button" },
							!0
						);
					};
					return a;
				})(),
				addUIElement: function (a, b) {
					this._.uiElementBuilders[a] = b;
				},
			});
			CKEDITOR.dialog._ = {
				uiElementBuilders: {},
				dialogDefinitions: {},
				currentTop: null,
				currentZIndex: null,
			};
			CKEDITOR.event.implementOn(CKEDITOR.dialog);
			CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);
			var u = {
					resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
					minWidth: 600,
					minHeight: 400,
					buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],
				},
				w = function (a, b, c) {
					for (var f = 0, e; (e = a[f]); f++)
						if (e.id == b || (c && e[c] && (e = w(e[c], b, c)))) return e;
					return null;
				},
				q = function (a, b, c, f, e) {
					if (c) {
						for (var g = 0, d; (d = a[g]); g++) {
							if (d.id == c) return a.splice(g, 0, b), b;
							if (f && d[f] && (d = q(d[f], b, c, f, !0))) return d;
						}
						if (e) return null;
					}
					a.push(b);
					return b;
				},
				z = function (a, b, c) {
					for (var f = 0, e; (e = a[f]); f++) {
						if (e.id == b) return a.splice(f, 1);
						if (c && e[c] && (e = z(e[c], b, c))) return e;
					}
					return null;
				},
				t = function (a, b) {
					this.dialog = a;
					for (var c = b.contents, f = 0, g; (g = c[f]); f++)
						c[f] = g && new e(a, g);
					CKEDITOR.tools.extend(this, b);
				};
			t.prototype = {
				getContents: function (a) {
					return w(this.contents, a);
				},
				getButton: function (a) {
					return w(this.buttons, a);
				},
				addContents: function (a, b) {
					return q(this.contents, a, b);
				},
				addButton: function (a, b) {
					return q(this.buttons, a, b);
				},
				removeContents: function (a) {
					z(this.contents, a);
				},
				removeButton: function (a) {
					z(this.buttons, a);
				},
			};
			e.prototype = {
				get: function (a) {
					return w(this.elements, a, "children");
				},
				add: function (a, b) {
					return q(this.elements, a, b, "children");
				},
				remove: function (a) {
					z(this.elements, a, "children");
				},
			};
			var y,
				C = {},
				B,
				A = {},
				H = function (a) {
					var b = a.data.$.ctrlKey || a.data.$.metaKey,
						c = a.data.$.altKey,
						f = a.data.$.shiftKey,
						e = String.fromCharCode(a.data.$.keyCode);
					(b =
						A[
							(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (f ? "SHIFT+" : "") + e
						]) &&
						b.length &&
						((b = b[b.length - 1]),
						b.keydown && b.keydown.call(b.uiElement, b.dialog, b.key),
						a.data.preventDefault());
				},
				G = function (a) {
					var b = a.data.$.ctrlKey || a.data.$.metaKey,
						c = a.data.$.altKey,
						f = a.data.$.shiftKey,
						e = String.fromCharCode(a.data.$.keyCode);
					(b =
						A[
							(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (f ? "SHIFT+" : "") + e
						]) &&
						b.length &&
						((b = b[b.length - 1]),
						b.keyup &&
							(b.keyup.call(b.uiElement, b.dialog, b.key),
							a.data.preventDefault()));
				},
				J = function (a, b, c, f, e) {
					(A[c] || (A[c] = [])).push({
						uiElement: a,
						dialog: b,
						key: c,
						keyup: e || a.accessKeyUp,
						keydown: f || a.accessKeyDown,
					});
				},
				E = function (a) {
					for (var b in A) {
						for (var c = A[b], f = c.length - 1; 0 <= f; f--)
							(c[f].dialog != a && c[f].uiElement != a) || c.splice(f, 1);
						0 === c.length && delete A[b];
					}
				},
				F = function (a, b) {
					a._.accessKeyMap[b] && a.selectPage(a._.accessKeyMap[b]);
				},
				L = function () {};
			(function () {
				CKEDITOR.ui.dialog = {
					uiElement: function (a, b, c, f, e, g, d) {
						if (!(4 > arguments.length)) {
							var h = (f.call ? f(b) : f) || "div",
								k = ["\x3c", h, " "],
								m = (e && e.call ? e(b) : e) || {},
								l = (g && g.call ? g(b) : g) || {},
								n = (d && d.call ? d.call(this, a, b) : d) || "",
								q = (this.domId =
									l.id || CKEDITOR.tools.getNextId() + "_uiElement");
							b.requiredContent &&
								!a.getParentEditor().filter.check(b.requiredContent) &&
								((m.display = "none"), (this.notAllowed = !0));
							l.id = q;
							var t = {};
							b.type && (t["cke_dialog_ui_" + b.type] = 1);
							b.className && (t[b.className] = 1);
							b.disabled && (t.cke_disabled = 1);
							for (
								var u =
										l["class"] && l["class"].split ? l["class"].split(" ") : [],
									q = 0;
								q < u.length;
								q++
							)
								u[q] && (t[u[q]] = 1);
							u = [];
							for (q in t) u.push(q);
							l["class"] = u.join(" ");
							b.title && (l.title = b.title);
							t = (b.style || "").split(";");
							b.align &&
								((u = b.align),
								(m["margin-left"] = "left" == u ? 0 : "auto"),
								(m["margin-right"] = "right" == u ? 0 : "auto"));
							for (q in m) t.push(q + ":" + m[q]);
							b.hidden && t.push("display:none");
							for (q = t.length - 1; 0 <= q; q--) "" === t[q] && t.splice(q, 1);
							0 < t.length &&
								(l.style = (l.style ? l.style + "; " : "") + t.join("; "));
							for (q in l)
								k.push(q + '\x3d"' + CKEDITOR.tools.htmlEncode(l[q]) + '" ');
							k.push("\x3e", n, "\x3c/", h, "\x3e");
							c.push(k.join(""));
							(this._ || (this._ = {})).dialog = a;
							"boolean" == typeof b.isChanged &&
								(this.isChanged = function () {
									return b.isChanged;
								});
							"function" == typeof b.isChanged &&
								(this.isChanged = b.isChanged);
							"function" == typeof b.setValue &&
								(this.setValue = CKEDITOR.tools.override(
									this.setValue,
									function (a) {
										return function (c) {
											a.call(this, b.setValue.call(this, c));
										};
									}
								));
							"function" == typeof b.getValue &&
								(this.getValue = CKEDITOR.tools.override(
									this.getValue,
									function (a) {
										return function () {
											return b.getValue.call(this, a.call(this));
										};
									}
								));
							CKEDITOR.event.implementOn(this);
							this.registerEvents(b);
							this.accessKeyUp &&
								this.accessKeyDown &&
								b.accessKey &&
								J(this, a, "CTRL+" + b.accessKey);
							var r = this;
							a.on("load", function () {
								var b = r.getInputElement();
								if (b) {
									var c =
										r.type in { checkbox: 1, ratio: 1 } &&
										CKEDITOR.env.ie &&
										8 > CKEDITOR.env.version
											? "cke_dialog_ui_focused"
											: "";
									b.on("focus", function () {
										a._.tabBarMode = !1;
										a._.hasFocus = !0;
										r.fire("focus");
										c && this.addClass(c);
									});
									b.on("blur", function () {
										r.fire("blur");
										c && this.removeClass(c);
									});
								}
							});
							CKEDITOR.tools.extend(this, b);
							this.keyboardFocusable &&
								((this.tabIndex = b.tabIndex || 0),
								(this.focusIndex = a._.focusList.push(this) - 1),
								this.on("focus", function () {
									a._.currentFocusIndex = r.focusIndex;
								}));
						}
					},
					hbox: function (a, b, c, f, e) {
						if (!(4 > arguments.length)) {
							this._ || (this._ = {});
							var g = (this._.children = b),
								d = (e && e.widths) || null,
								h = (e && e.height) || null,
								k,
								m = { role: "presentation" };
							e && e.align && (m.align = e.align);
							CKEDITOR.ui.dialog.uiElement.call(
								this,
								a,
								e || { type: "hbox" },
								f,
								"table",
								{},
								m,
								function () {
									var a = [
										'\x3ctbody\x3e\x3ctr class\x3d"cke_dialog_ui_hbox"\x3e',
									];
									for (k = 0; k < c.length; k++) {
										var b = "cke_dialog_ui_hbox_child",
											f = [];
										0 === k && (b = "cke_dialog_ui_hbox_first");
										k == c.length - 1 && (b = "cke_dialog_ui_hbox_last");
										a.push('\x3ctd class\x3d"', b, '" role\x3d"presentation" ');
										d
											? d[k] && f.push("width:" + v(d[k]))
											: f.push("width:" + Math.floor(100 / c.length) + "%");
										h && f.push("height:" + v(h));
										e &&
											void 0 !== e.padding &&
											f.push("padding:" + v(e.padding));
										CKEDITOR.env.ie &&
											CKEDITOR.env.quirks &&
											g[k].align &&
											f.push("text-align:" + g[k].align);
										0 < f.length && a.push('style\x3d"' + f.join("; ") + '" ');
										a.push("\x3e", c[k], "\x3c/td\x3e");
									}
									a.push("\x3c/tr\x3e\x3c/tbody\x3e");
									return a.join("");
								}
							);
						}
					},
					vbox: function (a, b, c, f, e) {
						if (!(3 > arguments.length)) {
							this._ || (this._ = {});
							var g = (this._.children = b),
								d = (e && e.width) || null,
								h = (e && e.heights) || null;
							CKEDITOR.ui.dialog.uiElement.call(
								this,
								a,
								e || { type: "vbox" },
								f,
								"div",
								null,
								{ role: "presentation" },
								function () {
									var b = [
										'\x3ctable role\x3d"presentation" cellspacing\x3d"0" border\x3d"0" ',
									];
									b.push('style\x3d"');
									e && e.expand && b.push("height:100%;");
									b.push("width:" + v(d || "100%"), ";");
									CKEDITOR.env.webkit && b.push("float:none;");
									b.push('"');
									b.push(
										'align\x3d"',
										CKEDITOR.tools.htmlEncode(
											(e && e.align) ||
												("ltr" == a.getParentEditor().lang.dir
													? "left"
													: "right")
										),
										'" '
									);
									b.push("\x3e\x3ctbody\x3e");
									for (var f = 0; f < c.length; f++) {
										var k = [];
										b.push('\x3ctr\x3e\x3ctd role\x3d"presentation" ');
										d && k.push("width:" + v(d || "100%"));
										h
											? k.push("height:" + v(h[f]))
											: e &&
											  e.expand &&
											  k.push("height:" + Math.floor(100 / c.length) + "%");
										e &&
											void 0 !== e.padding &&
											k.push("padding:" + v(e.padding));
										CKEDITOR.env.ie &&
											CKEDITOR.env.quirks &&
											g[f].align &&
											k.push("text-align:" + g[f].align);
										0 < k.length && b.push('style\x3d"', k.join("; "), '" ');
										b.push(
											' class\x3d"cke_dialog_ui_vbox_child"\x3e',
											c[f],
											"\x3c/td\x3e\x3c/tr\x3e"
										);
									}
									b.push("\x3c/tbody\x3e\x3c/table\x3e");
									return b.join("");
								}
							);
						}
					},
				};
			})();
			CKEDITOR.ui.dialog.uiElement.prototype = {
				getElement: function () {
					return CKEDITOR.document.getById(this.domId);
				},
				getInputElement: function () {
					return this.getElement();
				},
				getDialog: function () {
					return this._.dialog;
				},
				setValue: function (a, b) {
					this.getInputElement().setValue(a);
					!b && this.fire("change", { value: a });
					return this;
				},
				getValue: function () {
					return this.getInputElement().getValue();
				},
				isChanged: function () {
					return !1;
				},
				selectParentTab: function () {
					for (
						var a = this.getInputElement();
						(a = a.getParent()) &&
						-1 == a.$.className.search("cke_dialog_page_contents");

					);
					if (!a) return this;
					a = a.getAttribute("name");
					this._.dialog._.currentTabId != a && this._.dialog.selectPage(a);
					return this;
				},
				focus: function () {
					this.selectParentTab().getInputElement().focus();
					return this;
				},
				registerEvents: function (a) {
					var b = /^on([A-Z]\w+)/,
						c,
						f = function (a, b, c, f) {
							b.on("load", function () {
								a.getInputElement().on(c, f, a);
							});
						},
						e;
					for (e in a)
						if ((c = e.match(b)))
							this.eventProcessors[e]
								? this.eventProcessors[e].call(this, this._.dialog, a[e])
								: f(this, this._.dialog, c[1].toLowerCase(), a[e]);
					return this;
				},
				eventProcessors: {
					onLoad: function (a, b) {
						a.on("load", b, this);
					},
					onShow: function (a, b) {
						a.on("show", b, this);
					},
					onHide: function (a, b) {
						a.on("hide", b, this);
					},
				},
				accessKeyDown: function () {
					this.focus();
				},
				accessKeyUp: function () {},
				disable: function () {
					var a = this.getElement();
					this.getInputElement().setAttribute("disabled", "true");
					a.addClass("cke_disabled");
				},
				enable: function () {
					var a = this.getElement();
					this.getInputElement().removeAttribute("disabled");
					a.removeClass("cke_disabled");
				},
				isEnabled: function () {
					return !this.getElement().hasClass("cke_disabled");
				},
				isVisible: function () {
					return this.getInputElement().isVisible();
				},
				isFocusable: function () {
					return this.isEnabled() && this.isVisible() ? !0 : !1;
				},
			};
			CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(
				new CKEDITOR.ui.dialog.uiElement(),
				{
					getChild: function (a) {
						if (1 > arguments.length) return this._.children.concat();
						a.splice || (a = [a]);
						return 2 > a.length
							? this._.children[a[0]]
							: this._.children[a[0]] && this._.children[a[0]].getChild
							? this._.children[a[0]].getChild(a.slice(1, a.length))
							: null;
					},
				},
				!0
			);
			CKEDITOR.ui.dialog.vbox.prototype = new CKEDITOR.ui.dialog.hbox();
			(function () {
				var a = {
					build: function (a, b, c) {
						for (
							var f = b.children, e, g = [], d = [], h = 0;
							h < f.length && (e = f[h]);
							h++
						) {
							var k = [];
							g.push(k);
							d.push(
								CKEDITOR.dialog._.uiElementBuilders[e.type].build(a, e, k)
							);
						}
						return new CKEDITOR.ui.dialog[b.type](a, d, g, c, b);
					},
				};
				CKEDITOR.dialog.addUIElement("hbox", a);
				CKEDITOR.dialog.addUIElement("vbox", a);
			})();
			CKEDITOR.dialogCommand = function (a, b) {
				this.dialogName = a;
				CKEDITOR.tools.extend(this, b, !0);
			};
			CKEDITOR.dialogCommand.prototype = {
				exec: function (a) {
					var b = this.tabId;
					a.openDialog(this.dialogName, function (a) {
						b && a.selectPage(b);
					});
				},
				canUndo: !1,
				editorFocus: 1,
			};
			(function () {
				var a = /^([a]|[^a])+$/,
					b = /^\d*$/,
					c = /^\d*(?:\.\d+)?$/,
					f = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/,
					e = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i,
					g = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
				CKEDITOR.VALIDATE_OR = 1;
				CKEDITOR.VALIDATE_AND = 2;
				CKEDITOR.dialog.validate = {
					functions: function () {
						var a = arguments;
						return function () {
							var b = this && this.getValue ? this.getValue() : a[0],
								c,
								f = CKEDITOR.VALIDATE_AND,
								e = [],
								g;
							for (g = 0; g < a.length; g++)
								if ("function" == typeof a[g]) e.push(a[g]);
								else break;
							g < a.length && "string" == typeof a[g] && ((c = a[g]), g++);
							g < a.length && "number" == typeof a[g] && (f = a[g]);
							var d = f == CKEDITOR.VALIDATE_AND ? !0 : !1;
							for (g = 0; g < e.length; g++)
								d = f == CKEDITOR.VALIDATE_AND ? d && e[g](b) : d || e[g](b);
							return d ? !0 : c;
						};
					},
					regex: function (a, b) {
						return function (c) {
							c = this && this.getValue ? this.getValue() : c;
							return a.test(c) ? !0 : b;
						};
					},
					notEmpty: function (b) {
						return this.regex(a, b);
					},
					integer: function (a) {
						return this.regex(b, a);
					},
					number: function (a) {
						return this.regex(c, a);
					},
					cssLength: function (a) {
						return this.functions(function (a) {
							return e.test(CKEDITOR.tools.trim(a));
						}, a);
					},
					htmlLength: function (a) {
						return this.functions(function (a) {
							return f.test(CKEDITOR.tools.trim(a));
						}, a);
					},
					inlineStyle: function (a) {
						return this.functions(function (a) {
							return g.test(CKEDITOR.tools.trim(a));
						}, a);
					},
					equals: function (a, b) {
						return this.functions(function (b) {
							return b == a;
						}, b);
					},
					notEqual: function (a, b) {
						return this.functions(function (b) {
							return b != a;
						}, b);
					},
				};
				CKEDITOR.on("instanceDestroyed", function (a) {
					if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) {
						for (var b; (b = CKEDITOR.dialog._.currentTop); ) b.hide();
						for (var c in C) C[c].remove();
						C = {};
					}
					a = a.editor._.storedDialogs;
					for (var f in a) a[f].destroy();
				});
			})();
			CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
				openDialog: function (a, b) {
					var c = null,
						f = CKEDITOR.dialog._.dialogDefinitions[a];
					null === CKEDITOR.dialog._.currentTop && r(this);
					if ("function" == typeof f)
						(c = this._.storedDialogs || (this._.storedDialogs = {})),
							(c = c[a] || (c[a] = new CKEDITOR.dialog(this, a))),
							b && b.call(c, c),
							c.show();
					else {
						if ("failed" == f)
							throw (
								(x(this),
								Error(
									'[CKEDITOR.dialog.openDialog] Dialog "' +
										a +
										'" failed when loading definition.'
								))
							);
						"string" == typeof f &&
							CKEDITOR.scriptLoader.load(
								CKEDITOR.getUrl(f),
								function () {
									"function" != typeof CKEDITOR.dialog._.dialogDefinitions[a] &&
										(CKEDITOR.dialog._.dialogDefinitions[a] = "failed");
									this.openDialog(a, b);
								},
								this,
								0,
								1
							);
					}
					CKEDITOR.skin.loadPart("dialog");
					return c;
				},
			});
		})(),
		CKEDITOR.plugins.add("dialog", {
			requires: "dialogui",
			init: function (a) {
				a.on(
					"doubleclick",
					function (d) {
						d.data.dialog && a.openDialog(d.data.dialog);
					},
					null,
					null,
					999
				);
			},
		}),
		(function () {
			CKEDITOR.plugins.add("a11yhelp", {
				requires: "dialog",
				availableLangs: {
					af: 1,
					ar: 1,
					az: 1,
					bg: 1,
					ca: 1,
					cs: 1,
					cy: 1,
					da: 1,
					de: 1,
					"de-ch": 1,
					el: 1,
					en: 1,
					"en-au": 1,
					"en-gb": 1,
					eo: 1,
					es: 1,
					"es-mx": 1,
					et: 1,
					eu: 1,
					fa: 1,
					fi: 1,
					fo: 1,
					fr: 1,
					"fr-ca": 1,
					gl: 1,
					gu: 1,
					he: 1,
					hi: 1,
					hr: 1,
					hu: 1,
					id: 1,
					it: 1,
					ja: 1,
					km: 1,
					ko: 1,
					ku: 1,
					lt: 1,
					lv: 1,
					mk: 1,
					mn: 1,
					nb: 1,
					nl: 1,
					no: 1,
					oc: 1,
					pl: 1,
					pt: 1,
					"pt-br": 1,
					ro: 1,
					ru: 1,
					si: 1,
					sk: 1,
					sl: 1,
					sq: 1,
					sr: 1,
					"sr-latn": 1,
					sv: 1,
					th: 1,
					tr: 1,
					tt: 1,
					ug: 1,
					uk: 1,
					vi: 1,
					zh: 1,
					"zh-cn": 1,
				},
				init: function (a) {
					var d = this;
					a.addCommand("a11yHelp", {
						exec: function () {
							var b = a.langCode,
								b = d.availableLangs[b]
									? b
									: d.availableLangs[b.replace(/-.*/, "")]
									? b.replace(/-.*/, "")
									: "en";
							CKEDITOR.scriptLoader.load(
								CKEDITOR.getUrl(d.path + "dialogs/lang/" + b + ".js"),
								function () {
									a.lang.a11yhelp = d.langEntries[b];
									a.openDialog("a11yHelp");
								}
							);
						},
						modes: { wysiwyg: 1, source: 1 },
						readOnly: 1,
						canUndo: !1,
					});
					a.setKeystroke(CKEDITOR.ALT + 48, "a11yHelp");
					CKEDITOR.dialog.add("a11yHelp", this.path + "dialogs/a11yhelp.js");
					a.on("ariaEditorHelpLabel", function (b) {
						b.data.label = a.lang.common.editorHelp;
					});
				},
			});
		})(),
		CKEDITOR.plugins.add("about", {
			requires: "dialog",
			init: function (a) {
				var d = a.addCommand("about", new CKEDITOR.dialogCommand("about"));
				d.modes = { wysiwyg: 1, source: 1 };
				d.canUndo = !1;
				d.readOnly = 1;
				a.ui.addButton &&
					a.ui.addButton("About", {
						label: a.lang.about.dlgTitle,
						command: "about",
						toolbar: "about",
					});
				CKEDITOR.dialog.add("about", this.path + "dialogs/about.js");
			},
		}),
		CKEDITOR.plugins.add("basicstyles", {
			init: function (a) {
				var d = 0,
					b = function (b, g, e, m) {
						if (m) {
							m = new CKEDITOR.style(m);
							var f = c[e];
							f.unshift(m);
							a.attachStyleStateChange(m, function (b) {
								!a.readOnly && a.getCommand(e).setState(b);
							});
							a.addCommand(
								e,
								new CKEDITOR.styleCommand(m, { contentForms: f })
							);
							a.ui.addButton &&
								a.ui.addButton(b, {
									label: g,
									command: e,
									toolbar: "basicstyles," + (d += 10),
								});
						}
					},
					c = {
						bold: [
							"strong",
							"b",
							[
								"span",
								function (a) {
									a = a.styles["font-weight"];
									return "bold" == a || 700 <= +a;
								},
							],
						],
						italic: [
							"em",
							"i",
							[
								"span",
								function (a) {
									return "italic" == a.styles["font-style"];
								},
							],
						],
						underline: [
							"u",
							[
								"span",
								function (a) {
									return "underline" == a.styles["text-decoration"];
								},
							],
						],
						strike: [
							"s",
							"strike",
							[
								"span",
								function (a) {
									return "line-through" == a.styles["text-decoration"];
								},
							],
						],
						subscript: ["sub"],
						superscript: ["sup"],
					},
					g = a.config,
					l = a.lang.basicstyles;
				b("Bold", l.bold, "bold", g.coreStyles_bold);
				b("Italic", l.italic, "italic", g.coreStyles_italic);
				b("Underline", l.underline, "underline", g.coreStyles_underline);
				b("Strike", l.strike, "strike", g.coreStyles_strike);
				b("Subscript", l.subscript, "subscript", g.coreStyles_subscript);
				b(
					"Superscript",
					l.superscript,
					"superscript",
					g.coreStyles_superscript
				);
				a.setKeystroke([
					[CKEDITOR.CTRL + 66, "bold"],
					[CKEDITOR.CTRL + 73, "italic"],
					[CKEDITOR.CTRL + 85, "underline"],
				]);
			},
		}),
		(CKEDITOR.config.coreStyles_bold = { element: "strong", overrides: "b" }),
		(CKEDITOR.config.coreStyles_italic = { element: "em", overrides: "i" }),
		(CKEDITOR.config.coreStyles_underline = { element: "u" }),
		(CKEDITOR.config.coreStyles_strike = { element: "s", overrides: "strike" }),
		(CKEDITOR.config.coreStyles_subscript = { element: "sub" }),
		(CKEDITOR.config.coreStyles_superscript = { element: "sup" }),
		(function () {
			var a = {
				exec: function (a) {
					var b = a.getCommand("blockquote").state,
						c = a.getSelection(),
						g = c && c.getRanges()[0];
					if (g) {
						var l = c.createBookmarks();
						if (CKEDITOR.env.ie) {
							var k = l[0].startNode,
								h = l[0].endNode,
								e;
							if (k && "blockquote" == k.getParent().getName())
								for (e = k; (e = e.getNext()); )
									if (e.type == CKEDITOR.NODE_ELEMENT && e.isBlockBoundary()) {
										k.move(e, !0);
										break;
									}
							if (h && "blockquote" == h.getParent().getName())
								for (e = h; (e = e.getPrevious()); )
									if (e.type == CKEDITOR.NODE_ELEMENT && e.isBlockBoundary()) {
										h.move(e);
										break;
									}
						}
						var m = g.createIterator();
						m.enlargeBr = a.config.enterMode != CKEDITOR.ENTER_BR;
						if (b == CKEDITOR.TRISTATE_OFF) {
							for (k = []; (b = m.getNextParagraph()); ) k.push(b);
							1 > k.length &&
								((b = a.document.createElement(
									a.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div"
								)),
								(h = l.shift()),
								g.insertNode(b),
								b.append(new CKEDITOR.dom.text("﻿", a.document)),
								g.moveToBookmark(h),
								g.selectNodeContents(b),
								g.collapse(!0),
								(h = g.createBookmark()),
								k.push(b),
								l.unshift(h));
							e = k[0].getParent();
							g = [];
							for (h = 0; h < k.length; h++)
								(b = k[h]), (e = e.getCommonAncestor(b.getParent()));
							for (
								b = { table: 1, tbody: 1, tr: 1, ol: 1, ul: 1 };
								b[e.getName()];

							)
								e = e.getParent();
							for (h = null; 0 < k.length; ) {
								for (b = k.shift(); !b.getParent().equals(e); )
									b = b.getParent();
								b.equals(h) || g.push(b);
								h = b;
							}
							for (; 0 < g.length; )
								if (((b = g.shift()), "blockquote" == b.getName())) {
									for (
										h = new CKEDITOR.dom.documentFragment(a.document);
										b.getFirst();

									)
										h.append(b.getFirst().remove()), k.push(h.getLast());
									h.replace(b);
								} else k.push(b);
							g = a.document.createElement("blockquote");
							for (g.insertBefore(k[0]); 0 < k.length; )
								(b = k.shift()), g.append(b);
						} else if (b == CKEDITOR.TRISTATE_ON) {
							h = [];
							for (e = {}; (b = m.getNextParagraph()); ) {
								for (k = g = null; b.getParent(); ) {
									if ("blockquote" == b.getParent().getName()) {
										g = b.getParent();
										k = b;
										break;
									}
									b = b.getParent();
								}
								g &&
									k &&
									!k.getCustomData("blockquote_moveout") &&
									(h.push(k),
									CKEDITOR.dom.element.setMarker(
										e,
										k,
										"blockquote_moveout",
										!0
									));
							}
							CKEDITOR.dom.element.clearAllMarkers(e);
							b = [];
							k = [];
							for (e = {}; 0 < h.length; )
								(m = h.shift()),
									(g = m.getParent()),
									m.getPrevious()
										? m.getNext()
											? (m.breakParent(m.getParent()), k.push(m.getNext()))
											: m.remove().insertAfter(g)
										: m.remove().insertBefore(g),
									g.getCustomData("blockquote_processed") ||
										(k.push(g),
										CKEDITOR.dom.element.setMarker(
											e,
											g,
											"blockquote_processed",
											!0
										)),
									b.push(m);
							CKEDITOR.dom.element.clearAllMarkers(e);
							for (h = k.length - 1; 0 <= h; h--) {
								g = k[h];
								a: {
									e = g;
									for (
										var m = 0, f = e.getChildCount(), n = void 0;
										m < f && (n = e.getChild(m));
										m++
									)
										if (
											n.type == CKEDITOR.NODE_ELEMENT &&
											n.isBlockBoundary()
										) {
											e = !1;
											break a;
										}
									e = !0;
								}
								e && g.remove();
							}
							if (a.config.enterMode == CKEDITOR.ENTER_BR)
								for (g = !0; b.length; )
									if (((m = b.shift()), "div" == m.getName())) {
										h = new CKEDITOR.dom.documentFragment(a.document);
										!g ||
											!m.getPrevious() ||
											(m.getPrevious().type == CKEDITOR.NODE_ELEMENT &&
												m.getPrevious().isBlockBoundary()) ||
											h.append(a.document.createElement("br"));
										for (
											g =
												m.getNext() &&
												!(
													m.getNext().type == CKEDITOR.NODE_ELEMENT &&
													m.getNext().isBlockBoundary()
												);
											m.getFirst();

										)
											m.getFirst().remove().appendTo(h);
										g && h.append(a.document.createElement("br"));
										h.replace(m);
										g = !1;
									}
						}
						c.selectBookmarks(l);
						a.focus();
					}
				},
				refresh: function (a, b) {
					this.setState(
						a.elementPath(b.block || b.blockLimit).contains("blockquote", 1)
							? CKEDITOR.TRISTATE_ON
							: CKEDITOR.TRISTATE_OFF
					);
				},
				context: "blockquote",
				allowedContent: "blockquote",
				requiredContent: "blockquote",
			};
			CKEDITOR.plugins.add("blockquote", {
				init: function (d) {
					d.blockless ||
						(d.addCommand("blockquote", a),
						d.ui.addButton &&
							d.ui.addButton("Blockquote", {
								label: d.lang.blockquote.toolbar,
								command: "blockquote",
								toolbar: "blocks,10",
							}));
				},
			});
		})(),
		"use strict",
		(function () {
			function a(a, c) {
				CKEDITOR.tools.extend(this, c, {
					editor: a,
					id: "cke-" + CKEDITOR.tools.getUniqueId(),
					area: a._.notificationArea,
				});
				c.type || (this.type = "info");
				this.element = this._createElement();
				a.plugins.clipboard &&
					CKEDITOR.plugins.clipboard.preventDefaultDropOnElement(this.element);
			}
			function d(a) {
				var c = this;
				this.editor = a;
				this.notifications = [];
				this.element = this._createElement();
				this._uiBuffer = CKEDITOR.tools.eventsBuffer(10, this._layout, this);
				this._changeBuffer = CKEDITOR.tools.eventsBuffer(
					500,
					this._layout,
					this
				);
				a.on("destroy", function () {
					c._removeListeners();
					c.element.remove();
				});
			}
			CKEDITOR.plugins.add("notification", {
				init: function (a) {
					function c(a) {
						var b = new CKEDITOR.dom.element("div");
						b.setStyles({ position: "fixed", "margin-left": "-9999px" });
						b.setAttributes({
							"aria-live": "assertive",
							"aria-atomic": "true",
						});
						b.setText(a);
						CKEDITOR.document.getBody().append(b);
						setTimeout(function () {
							b.remove();
						}, 100);
					}
					a._.notificationArea = new d(a);
					a.showNotification = function (c, d, k) {
						var h, e;
						"progress" == d ? (h = k) : (e = k);
						c = new CKEDITOR.plugins.notification(a, {
							message: c,
							type: d,
							progress: h,
							duration: e,
						});
						c.show();
						return c;
					};
					a.on("key", function (g) {
						if (27 == g.data.keyCode) {
							var d = a._.notificationArea.notifications;
							d.length &&
								(c(a.lang.notification.closed),
								d[d.length - 1].hide(),
								g.cancel());
						}
					});
				},
			});
			a.prototype = {
				show: function () {
					!1 !== this.editor.fire("notificationShow", { notification: this }) &&
						(this.area.add(this), this._hideAfterTimeout());
				},
				update: function (a) {
					var c = !0;
					!1 ===
						this.editor.fire("notificationUpdate", {
							notification: this,
							options: a,
						}) && (c = !1);
					var g = this.element,
						d = g.findOne(".cke_notification_message"),
						k = g.findOne(".cke_notification_progress"),
						h = a.type;
					g.removeAttribute("role");
					a.progress && "progress" != this.type && (h = "progress");
					h &&
						(g.removeClass(this._getClass()),
						g.removeAttribute("aria-label"),
						(this.type = h),
						g.addClass(this._getClass()),
						g.setAttribute("aria-label", this.type),
						"progress" != this.type || k
							? "progress" != this.type && k && k.remove()
							: ((k = this._createProgressElement()), k.insertBefore(d)));
					void 0 !== a.message &&
						((this.message = a.message), d.setHtml(this.message));
					void 0 !== a.progress &&
						((this.progress = a.progress),
						k && k.setStyle("width", this._getPercentageProgress()));
					c &&
						a.important &&
						(g.setAttribute("role", "alert"),
						this.isVisible() || this.area.add(this));
					this.duration = a.duration;
					this._hideAfterTimeout();
				},
				hide: function () {
					!1 !== this.editor.fire("notificationHide", { notification: this }) &&
						this.area.remove(this);
				},
				isVisible: function () {
					return 0 <= CKEDITOR.tools.indexOf(this.area.notifications, this);
				},
				_createElement: function () {
					var a = this,
						c,
						g,
						d = this.editor.lang.common.close;
					c = new CKEDITOR.dom.element("div");
					c.addClass("cke_notification");
					c.addClass(this._getClass());
					c.setAttributes({
						id: this.id,
						role: "alert",
						"aria-label": this.type,
					});
					"progress" == this.type && c.append(this._createProgressElement());
					g = new CKEDITOR.dom.element("p");
					g.addClass("cke_notification_message");
					g.setHtml(this.message);
					c.append(g);
					g = CKEDITOR.dom.element.createFromHtml(
						'\x3ca class\x3d"cke_notification_close" href\x3d"javascript:void(0)" title\x3d"' +
							d +
							'" role\x3d"button" tabindex\x3d"-1"\x3e\x3cspan class\x3d"cke_label"\x3eX\x3c/span\x3e\x3c/a\x3e'
					);
					c.append(g);
					g.on("click", function () {
						a.editor.focus();
						a.hide();
					});
					return c;
				},
				_getClass: function () {
					return "progress" == this.type
						? "cke_notification_info"
						: "cke_notification_" + this.type;
				},
				_createProgressElement: function () {
					var a = new CKEDITOR.dom.element("span");
					a.addClass("cke_notification_progress");
					a.setStyle("width", this._getPercentageProgress());
					return a;
				},
				_getPercentageProgress: function () {
					return Math.round(100 * (this.progress || 0)) + "%";
				},
				_hideAfterTimeout: function () {
					var a = this,
						c;
					this._hideTimeoutId && clearTimeout(this._hideTimeoutId);
					if ("number" == typeof this.duration) c = this.duration;
					else if ("info" == this.type || "success" == this.type)
						c =
							"number" == typeof this.editor.config.notification_duration
								? this.editor.config.notification_duration
								: 5e3;
					c &&
						(a._hideTimeoutId = setTimeout(function () {
							a.hide();
						}, c));
				},
			};
			d.prototype = {
				add: function (a) {
					this.notifications.push(a);
					this.element.append(a.element);
					1 == this.element.getChildCount() &&
						(CKEDITOR.document.getBody().append(this.element),
						this._attachListeners());
					this._layout();
				},
				remove: function (a) {
					var c = CKEDITOR.tools.indexOf(this.notifications, a);
					0 > c ||
						(this.notifications.splice(c, 1),
						a.element.remove(),
						this.element.getChildCount() ||
							(this._removeListeners(), this.element.remove()));
				},
				_createElement: function () {
					var a = this.editor,
						c = a.config,
						g = new CKEDITOR.dom.element("div");
					g.addClass("cke_notifications_area");
					g.setAttribute("id", "cke_notifications_area_" + a.name);
					g.setStyle("z-index", c.baseFloatZIndex - 2);
					return g;
				},
				_attachListeners: function () {
					var a = CKEDITOR.document.getWindow(),
						c = this.editor;
					a.on("scroll", this._uiBuffer.input);
					a.on("resize", this._uiBuffer.input);
					c.on("change", this._changeBuffer.input);
					c.on("floatingSpaceLayout", this._layout, this, null, 20);
					c.on("blur", this._layout, this, null, 20);
				},
				_removeListeners: function () {
					var a = CKEDITOR.document.getWindow(),
						c = this.editor;
					a.removeListener("scroll", this._uiBuffer.input);
					a.removeListener("resize", this._uiBuffer.input);
					c.removeListener("change", this._changeBuffer.input);
					c.removeListener("floatingSpaceLayout", this._layout);
					c.removeListener("blur", this._layout);
				},
				_layout: function () {
					function a() {
						c.setStyle("left", w(q + d.width - n - r));
					}
					var c = this.element,
						g = this.editor,
						d = g.ui.contentsElement.getClientRect(),
						k = g.ui.contentsElement.getDocumentPosition(),
						h,
						e,
						m = c.getClientRect(),
						f,
						n = this._notificationWidth,
						r = this._notificationMargin;
					f = CKEDITOR.document.getWindow();
					var x = f.getScrollPosition(),
						v = f.getViewPaneSize(),
						p = CKEDITOR.document.getBody(),
						u = p.getDocumentPosition(),
						w = CKEDITOR.tools.cssLength;
					(n && r) ||
						((f = this.element.getChild(0)),
						(n = this._notificationWidth = f.getClientRect().width),
						(r = this._notificationMargin =
							parseInt(f.getComputedStyle("margin-left"), 10) +
							parseInt(f.getComputedStyle("margin-right"), 10)));
					g.toolbar && ((h = g.ui.space("top")), (e = h.getClientRect()));
					h &&
					h.isVisible() &&
					e.bottom > d.top &&
					e.bottom < d.bottom - m.height
						? c.setStyles({ position: "fixed", top: w(e.bottom) })
						: 0 < d.top
						? c.setStyles({ position: "absolute", top: w(k.y) })
						: k.y + d.height - m.height > x.y
						? c.setStyles({ position: "fixed", top: 0 })
						: c.setStyles({
								position: "absolute",
								top: w(k.y + d.height - m.height),
						  });
					var q =
						"fixed" == c.getStyle("position")
							? d.left
							: "static" != p.getComputedStyle("position")
							? k.x - u.x
							: k.x;
					d.width < n + r
						? k.x + n + r > x.x + v.width
							? a()
							: c.setStyle("left", w(q))
						: k.x + n + r > x.x + v.width
						? c.setStyle("left", w(q))
						: k.x + d.width / 2 + n / 2 + r > x.x + v.width
						? c.setStyle("left", w(q - k.x + x.x + v.width - n - r))
						: 0 > d.left + d.width - n - r
						? a()
						: 0 > d.left + d.width / 2 - n / 2
						? c.setStyle("left", w(q - k.x + x.x))
						: c.setStyle("left", w(q + d.width / 2 - n / 2 - r / 2));
				},
			};
			CKEDITOR.plugins.notification = a;
		})(),
		(function () {
			var a =
				'\x3ca id\x3d"{id}" class\x3d"cke_button cke_button__{name} cke_button_{state} {cls}"' +
				(CKEDITOR.env.gecko && !CKEDITOR.env.hc
					? ""
					: " href\x3d\"javascript:void('{titleJs}')\"") +
				' title\x3d"{title}" tabindex\x3d"-1" hidefocus\x3d"true" role\x3d"button" aria-labelledby\x3d"{id}_label" aria-describedby\x3d"{id}_description" aria-haspopup\x3d"{hasArrow}" aria-disabled\x3d"{ariaDisabled}"';
			CKEDITOR.env.gecko &&
				CKEDITOR.env.mac &&
				(a += ' onkeypress\x3d"return false;"');
			CKEDITOR.env.gecko &&
				(a += ' onblur\x3d"this.style.cssText \x3d this.style.cssText;"');
			var a =
					a +
					(' onkeydown\x3d"return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus\x3d"return CKEDITOR.tools.callFunction({focusFn},event);" ' +
						(CKEDITOR.env.ie
							? 'onclick\x3d"return false;" onmouseup'
							: "onclick") +
						'\x3d"CKEDITOR.tools.callFunction({clickFn},this);return false;"\x3e\x3cspan class\x3d"cke_button_icon cke_button__{iconName}_icon" style\x3d"{style}"'),
				a =
					a +
					'\x3e\x26nbsp;\x3c/span\x3e\x3cspan id\x3d"{id}_label" class\x3d"cke_button_label cke_button__{name}_label" aria-hidden\x3d"false"\x3e{label}\x3c/span\x3e\x3cspan id\x3d"{id}_description" class\x3d"cke_button_label" aria-hidden\x3d"false"\x3e{ariaShortcut}\x3c/span\x3e{arrowHtml}\x3c/a\x3e',
				d = CKEDITOR.addTemplate(
					"buttonArrow",
					'\x3cspan class\x3d"cke_button_arrow"\x3e' +
						(CKEDITOR.env.hc ? "\x26#9660;" : "") +
						"\x3c/span\x3e"
				),
				b = CKEDITOR.addTemplate("button", a);
			CKEDITOR.plugins.add("button", {
				beforeInit: function (a) {
					a.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler);
				},
			});
			CKEDITOR.UI_BUTTON = "button";
			CKEDITOR.ui.button = function (a) {
				CKEDITOR.tools.extend(this, a, {
					title: a.label,
					click:
						a.click ||
						function (b) {
							b.execCommand(a.command);
						},
				});
				this._ = {};
			};
			CKEDITOR.ui.button.handler = {
				create: function (a) {
					return new CKEDITOR.ui.button(a);
				},
			};
			CKEDITOR.ui.button.prototype = {
				render: function (a, g) {
					function l() {
						var b = a.mode;
						b &&
							((b = this.modes[b]
								? void 0 !== k[b]
									? k[b]
									: CKEDITOR.TRISTATE_OFF
								: CKEDITOR.TRISTATE_DISABLED),
							(b =
								a.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : b),
							this.setState(b),
							this.refresh && this.refresh());
					}
					var k = null,
						h = CKEDITOR.env,
						e = (this._.id = CKEDITOR.tools.getNextId()),
						m = "",
						f = this.command,
						n,
						r,
						x;
					this._.editor = a;
					var v = {
							id: e,
							button: this,
							editor: a,
							focus: function () {
								CKEDITOR.document.getById(e).focus();
							},
							execute: function () {
								this.button.click(a);
							},
							attach: function (a) {
								this.button.attach(a);
							},
						},
						p = CKEDITOR.tools.addFunction(function (a) {
							if (v.onkey)
								return (
									(a = new CKEDITOR.dom.event(a)),
									!1 !== v.onkey(v, a.getKeystroke())
								);
						}),
						u = CKEDITOR.tools.addFunction(function (a) {
							var b;
							v.onfocus && (b = !1 !== v.onfocus(v, new CKEDITOR.dom.event(a)));
							return b;
						}),
						w = 0;
					v.clickFn = n = CKEDITOR.tools.addFunction(function () {
						w && (a.unlockSelection(1), (w = 0));
						v.execute();
						h.iOS && a.focus();
					});
					this.modes
						? ((k = {}),
						  a.on(
								"beforeModeUnload",
								function () {
									a.mode &&
										this._.state != CKEDITOR.TRISTATE_DISABLED &&
										(k[a.mode] = this._.state);
								},
								this
						  ),
						  a.on("activeFilterChange", l, this),
						  a.on("mode", l, this),
						  !this.readOnly && a.on("readOnly", l, this))
						: f &&
						  (f = a.getCommand(f)) &&
						  (f.on(
								"state",
								function () {
									this.setState(f.state);
								},
								this
						  ),
						  (m +=
								f.state == CKEDITOR.TRISTATE_ON
									? "on"
									: f.state == CKEDITOR.TRISTATE_DISABLED
									? "disabled"
									: "off"));
					var q;
					if (this.directional)
						a.on(
							"contentDirChanged",
							function (b) {
								var f = CKEDITOR.document.getById(this._.id),
									e = f.getFirst();
								b = b.data;
								b != a.lang.dir
									? f.addClass("cke_" + b)
									: f.removeClass("cke_ltr").removeClass("cke_rtl");
								e.setAttribute(
									"style",
									CKEDITOR.skin.getIconStyle(
										q,
										"rtl" == b,
										this.icon,
										this.iconOffset
									)
								);
							},
							this
						);
					f
						? (r = a.getCommandKeystroke(f)) &&
						  (x = CKEDITOR.tools.keystrokeToString(a.lang.common.keyboard, r))
						: (m += "off");
					r = this.name || this.command;
					var z = null,
						t = this.icon;
					q = r;
					this.icon && !/\./.test(this.icon)
						? ((q = this.icon), (t = null))
						: (this.icon && (z = this.icon),
						  CKEDITOR.env.hidpi && this.iconHiDpi && (z = this.iconHiDpi));
					z ? (CKEDITOR.skin.addIcon(z, z), (t = null)) : (z = q);
					m = {
						id: e,
						name: r,
						iconName: q,
						label: this.label,
						cls:
							(this.hasArrow ? "cke_button_expandable " : "") +
							(this.className || ""),
						state: m,
						ariaDisabled: "disabled" == m ? "true" : "false",
						title: this.title + (x ? " (" + x.display + ")" : ""),
						ariaShortcut: x
							? a.lang.common.keyboardShortcut + " " + x.aria
							: "",
						titleJs:
							h.gecko && !h.hc ? "" : (this.title || "").replace("'", ""),
						hasArrow:
							("string" === typeof this.hasArrow && this.hasArrow) ||
							(this.hasArrow ? "true" : "false"),
						keydownFn: p,
						focusFn: u,
						clickFn: n,
						style: CKEDITOR.skin.getIconStyle(
							z,
							"rtl" == a.lang.dir,
							t,
							this.iconOffset
						),
						arrowHtml: this.hasArrow ? d.output() : "",
					};
					b.output(m, g);
					if (this.onRender) this.onRender();
					return v;
				},
				setState: function (a) {
					if (this._.state == a) return !1;
					this._.state = a;
					var b = CKEDITOR.document.getById(this._.id);
					return b
						? (b.setState(a, "cke_button"),
						  b.setAttribute("aria-disabled", a == CKEDITOR.TRISTATE_DISABLED),
						  this.hasArrow
								? b.setAttribute("aria-expanded", a == CKEDITOR.TRISTATE_ON)
								: a === CKEDITOR.TRISTATE_ON
								? b.setAttribute("aria-pressed", !0)
								: b.removeAttribute("aria-pressed"),
						  !0)
						: !1;
				},
				getState: function () {
					return this._.state;
				},
				toFeature: function (a) {
					if (this._.feature) return this._.feature;
					var b = this;
					this.allowedContent ||
						this.requiredContent ||
						!this.command ||
						(b = a.getCommand(this.command) || b);
					return (this._.feature = b);
				},
			};
			CKEDITOR.ui.prototype.addButton = function (a, b) {
				this.add(a, CKEDITOR.UI_BUTTON, b);
			};
		})(),
		(function () {
			function a(a) {
				function b() {
					for (
						var f = c(),
							e = CKEDITOR.tools.clone(a.config.toolbarGroups) || d(a),
							m = 0;
						m < e.length;
						m++
					) {
						var l = e[m];
						if ("/" != l) {
							"string" == typeof l && (l = e[m] = { name: l });
							var p,
								u = l.groups;
							if (u)
								for (var w = 0; w < u.length; w++)
									(p = u[w]), (p = f[p]) && h(l, p);
							(p = f[l.name]) && h(l, p);
						}
					}
					return e;
				}
				function c() {
					var b = {},
						f,
						e,
						d;
					for (f in a.ui.items)
						(e = a.ui.items[f]),
							(d = e.toolbar || "others"),
							(d = d.split(",")),
							(e = d[0]),
							(d = parseInt(d[1] || -1, 10)),
							b[e] || (b[e] = []),
							b[e].push({ name: f, order: d });
					for (e in b)
						b[e] = b[e].sort(function (a, b) {
							return a.order == b.order
								? 0
								: 0 > b.order
								? -1
								: 0 > a.order
								? 1
								: a.order < b.order
								? -1
								: 1;
						});
					return b;
				}
				function h(b, c) {
					if (c.length) {
						b.items ? b.items.push(a.ui.create("-")) : (b.items = []);
						for (var f; (f = c.shift()); )
							(f = "string" == typeof f ? f : f.name),
								(m && -1 != CKEDITOR.tools.indexOf(m, f)) ||
									((f = a.ui.create(f)) && a.addFeature(f) && b.items.push(f));
					}
				}
				function e(a) {
					var b = [],
						c,
						f,
						e;
					for (c = 0; c < a.length; ++c)
						(f = a[c]),
							(e = {}),
							"/" == f
								? b.push(f)
								: CKEDITOR.tools.isArray(f)
								? (h(e, CKEDITOR.tools.clone(f)), b.push(e))
								: f.items &&
								  (h(e, CKEDITOR.tools.clone(f.items)),
								  (e.name = f.name),
								  b.push(e));
					return b;
				}
				var m = a.config.removeButtons,
					m = m && m.split(","),
					f = a.config.toolbar;
				"string" == typeof f && (f = a.config["toolbar_" + f]);
				return (a.toolbar = f ? e(f) : b());
			}
			function d(a) {
				return (
					a._.toolbarGroups ||
					(a._.toolbarGroups = [
						{ name: "document", groups: ["mode", "document", "doctools"] },
						{ name: "clipboard", groups: ["clipboard", "undo"] },
						{ name: "editing", groups: ["find", "selection", "spellchecker"] },
						{ name: "forms" },
						"/",
						{ name: "basicstyles", groups: ["basicstyles", "cleanup"] },
						{
							name: "paragraph",
							groups: ["list", "indent", "blocks", "align", "bidi"],
						},
						{ name: "links" },
						{ name: "insert" },
						"/",
						{ name: "styles" },
						{ name: "colors" },
						{ name: "tools" },
						{ name: "others" },
						{ name: "about" },
					])
				);
			}
			var b = function () {
				this.toolbars = [];
				this.focusCommandExecuted = !1;
			};
			b.prototype.focus = function () {
				for (var a = 0, b; (b = this.toolbars[a++]); )
					for (var c = 0, d; (d = b.items[c++]); )
						if (d.focus) {
							d.focus();
							return;
						}
			};
			var c = {
				modes: { wysiwyg: 1, source: 1 },
				readOnly: 1,
				exec: function (a) {
					a.toolbox &&
						((a.toolbox.focusCommandExecuted = !0),
						CKEDITOR.env.ie || CKEDITOR.env.air
							? setTimeout(function () {
									a.toolbox.focus();
							  }, 100)
							: a.toolbox.focus());
				},
			};
			CKEDITOR.plugins.add("toolbar", {
				requires: "button",
				init: function (g) {
					var d,
						k = function (a, b) {
							var c,
								f = "rtl" == g.lang.dir,
								n = g.config.toolbarGroupCycling,
								r = f ? 37 : 39,
								f = f ? 39 : 37,
								n = void 0 === n || n;
							switch (b) {
								case 9:
								case CKEDITOR.SHIFT + 9:
									for (; !c || !c.items.length; )
										if (
											((c =
												9 == b
													? (c ? c.next : a.toolbar.next) ||
													  g.toolbox.toolbars[0]
													: (c ? c.previous : a.toolbar.previous) ||
													  g.toolbox.toolbars[g.toolbox.toolbars.length - 1]),
											c.items.length)
										)
											for (
												a = c.items[d ? c.items.length - 1 : 0];
												a && !a.focus;

											)
												(a = d ? a.previous : a.next) || (c = 0);
									a && a.focus();
									return !1;
								case r:
									c = a;
									do (c = c.next), !c && n && (c = a.toolbar.items[0]);
									while (c && !c.focus);
									c ? c.focus() : k(a, 9);
									return !1;
								case 40:
									return (
										a.button && a.button.hasArrow
											? a.execute()
											: k(a, 40 == b ? r : f),
										!1
									);
								case f:
								case 38:
									c = a;
									do
										(c = c.previous),
											!c &&
												n &&
												(c = a.toolbar.items[a.toolbar.items.length - 1]);
									while (c && !c.focus);
									c ? c.focus() : ((d = 1), k(a, CKEDITOR.SHIFT + 9), (d = 0));
									return !1;
								case 27:
									return g.focus(), !1;
								case 13:
								case 32:
									return a.execute(), !1;
							}
							return !0;
						};
					g.on("uiSpace", function (c) {
						if (c.data.space == g.config.toolbarLocation) {
							c.removeListener();
							g.toolbox = new b();
							var e = CKEDITOR.tools.getNextId(),
								d = [
									'\x3cspan id\x3d"',
									e,
									'" class\x3d"cke_voice_label"\x3e',
									g.lang.toolbar.toolbars,
									"\x3c/span\x3e",
									'\x3cspan id\x3d"' +
										g.ui.spaceId("toolbox") +
										'" class\x3d"cke_toolbox" role\x3d"group" aria-labelledby\x3d"',
									e,
									'" onmousedown\x3d"return false;"\x3e',
								],
								e = !1 !== g.config.toolbarStartupExpanded,
								f,
								l;
							g.config.toolbarCanCollapse &&
								g.elementMode != CKEDITOR.ELEMENT_MODE_INLINE &&
								d.push(
									'\x3cspan class\x3d"cke_toolbox_main"' +
										(e ? "\x3e" : ' style\x3d"display:none"\x3e')
								);
							for (
								var r = g.toolbox.toolbars, x = a(g), v = x.length, p = 0;
								p < v;
								p++
							) {
								var u,
									w = 0,
									q,
									z = x[p],
									t = "/" !== z && ("/" === x[p + 1] || p == v - 1),
									y;
								if (z)
									if ((f && (d.push("\x3c/span\x3e"), (l = f = 0)), "/" === z))
										d.push(
											'\x3cspan class\x3d"cke_toolbar_break"\x3e\x3c/span\x3e'
										);
									else {
										y = z.items || z;
										for (var C = 0; C < y.length; C++) {
											var B = y[C],
												A;
											if (B) {
												var H = function (a) {
													a = a.render(g, d);
													G = w.items.push(a) - 1;
													0 < G &&
														((a.previous = w.items[G - 1]),
														(a.previous.next = a));
													a.toolbar = w;
													a.onkey = k;
													a.onfocus = function () {
														g.toolbox.focusCommandExecuted || g.focus();
													};
												};
												if (B.type == CKEDITOR.UI_SEPARATOR) l = f && B;
												else {
													A = !1 !== B.canGroup;
													if (!w) {
														u = CKEDITOR.tools.getNextId();
														w = { id: u, items: [] };
														q =
															z.name &&
															(g.lang.toolbar.toolbarGroups[z.name] || z.name);
														d.push(
															'\x3cspan id\x3d"',
															u,
															'" class\x3d"cke_toolbar' +
																(t ? ' cke_toolbar_last"' : '"'),
															q ? ' aria-labelledby\x3d"' + u + '_label"' : "",
															' role\x3d"toolbar"\x3e'
														);
														q &&
															d.push(
																'\x3cspan id\x3d"',
																u,
																'_label" class\x3d"cke_voice_label"\x3e',
																q,
																"\x3c/span\x3e"
															);
														d.push(
															'\x3cspan class\x3d"cke_toolbar_start"\x3e\x3c/span\x3e'
														);
														var G = r.push(w) - 1;
														0 < G &&
															((w.previous = r[G - 1]), (w.previous.next = w));
													}
													A
														? f ||
														  (d.push(
																'\x3cspan class\x3d"cke_toolgroup" role\x3d"presentation"\x3e'
														  ),
														  (f = 1))
														: f && (d.push("\x3c/span\x3e"), (f = 0));
													l && (H(l), (l = 0));
													H(B);
												}
											}
										}
										f && (d.push("\x3c/span\x3e"), (l = f = 0));
										w &&
											d.push(
												'\x3cspan class\x3d"cke_toolbar_end"\x3e\x3c/span\x3e\x3c/span\x3e'
											);
									}
							}
							g.config.toolbarCanCollapse && d.push("\x3c/span\x3e");
							if (
								g.config.toolbarCanCollapse &&
								g.elementMode != CKEDITOR.ELEMENT_MODE_INLINE
							) {
								var J = CKEDITOR.tools.addFunction(function () {
									g.execCommand("toolbarCollapse");
								});
								g.on("destroy", function () {
									CKEDITOR.tools.removeFunction(J);
								});
								g.addCommand("toolbarCollapse", {
									readOnly: 1,
									exec: function (a) {
										var b = a.ui.space("toolbar_collapser"),
											c = b.getPrevious(),
											f = a.ui.space("contents"),
											e = c.getParent(),
											g = parseInt(f.$.style.height, 10),
											d = e.$.offsetHeight,
											h = b.hasClass("cke_toolbox_collapser_min");
										h
											? (c.show(),
											  b.removeClass("cke_toolbox_collapser_min"),
											  b.setAttribute("title", a.lang.toolbar.toolbarCollapse))
											: (c.hide(),
											  b.addClass("cke_toolbox_collapser_min"),
											  b.setAttribute("title", a.lang.toolbar.toolbarExpand));
										b.getFirst().setText(h ? "▲" : "◀");
										f.setStyle("height", g - (e.$.offsetHeight - d) + "px");
										a.fire("resize", {
											outerHeight: a.container.$.offsetHeight,
											contentsHeight: f.$.offsetHeight,
											outerWidth: a.container.$.offsetWidth,
										});
									},
									modes: { wysiwyg: 1, source: 1 },
								});
								g.setKeystroke(
									CKEDITOR.ALT +
										(CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109),
									"toolbarCollapse"
								);
								d.push(
									'\x3ca title\x3d"' +
										(e
											? g.lang.toolbar.toolbarCollapse
											: g.lang.toolbar.toolbarExpand) +
										'" id\x3d"' +
										g.ui.spaceId("toolbar_collapser") +
										'" tabIndex\x3d"-1" class\x3d"cke_toolbox_collapser'
								);
								e || d.push(" cke_toolbox_collapser_min");
								d.push(
									'" onclick\x3d"CKEDITOR.tools.callFunction(' + J + ')"\x3e',
									'\x3cspan class\x3d"cke_arrow"\x3e\x26#9650;\x3c/span\x3e',
									"\x3c/a\x3e"
								);
							}
							d.push("\x3c/span\x3e");
							c.data.html += d.join("");
						}
					});
					g.on("destroy", function () {
						if (this.toolbox) {
							var a,
								b = 0,
								c,
								f,
								g;
							for (a = this.toolbox.toolbars; b < a.length; b++)
								for (f = a[b].items, c = 0; c < f.length; c++)
									(g = f[c]),
										g.clickFn && CKEDITOR.tools.removeFunction(g.clickFn),
										g.keyDownFn && CKEDITOR.tools.removeFunction(g.keyDownFn);
						}
					});
					g.on("uiReady", function () {
						var a = g.ui.space("toolbox");
						a && g.focusManager.add(a, 1);
					});
					g.addCommand("toolbarFocus", c);
					g.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
					g.ui.add("-", CKEDITOR.UI_SEPARATOR, {});
					g.ui.addHandler(CKEDITOR.UI_SEPARATOR, {
						create: function () {
							return {
								render: function (a, b) {
									b.push(
										'\x3cspan class\x3d"cke_toolbar_separator" role\x3d"separator"\x3e\x3c/span\x3e'
									);
									return {};
								},
							};
						},
					});
				},
			});
			CKEDITOR.ui.prototype.addToolbarGroup = function (a, b, c) {
				var h = d(this.editor),
					e = 0 === b,
					m = { name: a };
				if (c) {
					if (
						(c = CKEDITOR.tools.search(h, function (a) {
							return a.name == c;
						}))
					) {
						!c.groups && (c.groups = []);
						if (b && ((b = CKEDITOR.tools.indexOf(c.groups, b)), 0 <= b)) {
							c.groups.splice(b + 1, 0, a);
							return;
						}
						e ? c.groups.splice(0, 0, a) : c.groups.push(a);
						return;
					}
					b = null;
				}
				b &&
					(b = CKEDITOR.tools.indexOf(h, function (a) {
						return a.name == b;
					}));
				e
					? h.splice(0, 0, a)
					: "number" == typeof b
					? h.splice(b + 1, 0, m)
					: h.push(a);
			};
		})(),
		(CKEDITOR.UI_SEPARATOR = "separator"),
		(CKEDITOR.config.toolbarLocation = "top"),
		"use strict",
		(function () {
			function a(a, b, c) {
				b.type || (b.type = "auto");
				if (
					(c && !1 === a.fire("beforePaste", b)) ||
					(!b.dataValue && b.dataTransfer.isEmpty())
				)
					return !1;
				b.dataValue || (b.dataValue = "");
				if (CKEDITOR.env.gecko && "drop" == b.method && a.toolbox)
					a.once("afterPaste", function () {
						a.toolbox.focus();
					});
				return a.fire("paste", b);
			}
			function d(b) {
				function c() {
					var a = b.editable();
					if (CKEDITOR.plugins.clipboard.isCustomCopyCutSupported) {
						var e = function (a) {
							b.getSelection().isCollapsed() ||
								((b.readOnly && "cut" == a.name) ||
									A.initPasteDataTransfer(a, b),
								a.data.preventDefault());
						};
						a.on("copy", e);
						a.on("cut", e);
						a.on(
							"cut",
							function () {
								b.readOnly || b.extractSelectedHtml();
							},
							null,
							null,
							999
						);
					}
					a.on(A.mainPasteEvent, function (a) {
						("beforepaste" == A.mainPasteEvent && H) || y(a);
					});
					"beforepaste" == A.mainPasteEvent &&
						(a.on("paste", function (a) {
							G || (d(), a.data.preventDefault(), y(a), k("paste"));
						}),
						a.on("contextmenu", h, null, null, 0),
						a.on(
							"beforepaste",
							function (a) {
								!a.data || a.data.$.ctrlKey || a.data.$.shiftKey || h();
							},
							null,
							null,
							0
						));
					a.on("beforecut", function () {
						!H && m(b);
					});
					var g;
					a.attachListener(
						CKEDITOR.env.ie ? a : b.document.getDocumentElement(),
						"mouseup",
						function () {
							g = setTimeout(function () {
								C();
							}, 0);
						}
					);
					b.on("destroy", function () {
						clearTimeout(g);
					});
					a.on("keyup", C);
				}
				function e(a) {
					return {
						type: a,
						canUndo: "cut" == a,
						startDisabled: !0,
						fakeKeystroke: "cut" == a ? CKEDITOR.CTRL + 88 : CKEDITOR.CTRL + 67,
						exec: function () {
							"cut" == this.type && m();
							var a;
							var c = this.type;
							if (CKEDITOR.env.ie) a = k(c);
							else
								try {
									a = b.document.$.execCommand(c, !1, null);
								} catch (e) {
									a = !1;
								}
							a || b.showNotification(b.lang.clipboard[this.type + "Error"]);
							return a;
						},
					};
				}
				function g() {
					return {
						canUndo: !1,
						async: !0,
						fakeKeystroke: CKEDITOR.CTRL + 86,
						exec: function (b, c) {
							function f(c, d) {
								d = "undefined" !== typeof d ? d : !0;
								c
									? ((c.method = "paste"),
									  c.dataTransfer ||
											(c.dataTransfer = A.initPasteDataTransfer()),
									  a(b, c, d))
									: g &&
									  !b._.forcePasteDialog &&
									  b.showNotification(
											k,
											"info",
											b.config.clipboard_notificationDuration
									  );
								b._.forcePasteDialog = !1;
								b.fire("afterCommandExec", {
									name: "paste",
									command: e,
									returnValue: !!c,
								});
							}
							c = "undefined" !== typeof c && null !== c ? c : {};
							var e = this,
								g = "undefined" !== typeof c.notification ? c.notification : !0,
								d = c.type,
								h = CKEDITOR.tools.keystrokeToString(
									b.lang.common.keyboard,
									b.getCommandKeystroke(this)
								),
								k =
									"string" === typeof g
										? g
										: b.lang.clipboard.pasteNotification.replace(
												/%1/,
												'\x3ckbd aria-label\x3d"' +
													h.aria +
													'"\x3e' +
													h.display +
													"\x3c/kbd\x3e"
										  ),
								h = "string" === typeof c ? c : c.dataValue;
							d &&
							!0 !== b.config.forcePasteAsPlainText &&
							"allow-word" !== b.config.forcePasteAsPlainText
								? (b._.nextPasteType = d)
								: delete b._.nextPasteType;
							"string" === typeof h
								? f({ dataValue: h })
								: b.getClipboardData(f);
						},
					};
				}
				function d() {
					G = 1;
					setTimeout(function () {
						G = 0;
					}, 100);
				}
				function h() {
					H = 1;
					setTimeout(function () {
						H = 0;
					}, 10);
				}
				function k(a) {
					var c = b.document,
						e = c.getBody(),
						g = !1,
						d = function () {
							g = !0;
						};
					e.on(a, d);
					7 < CKEDITOR.env.version
						? c.$.execCommand(a)
						: c.$.selection.createRange().execCommand(a);
					e.removeListener(a, d);
					return g;
				}
				function m() {
					if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
						var a = b.getSelection(),
							c,
							e,
							g;
						a.getType() == CKEDITOR.SELECTION_ELEMENT &&
							(c = a.getSelectedElement()) &&
							((e = a.getRanges()[0]),
							(g = b.document.createText("")),
							g.insertBefore(c),
							e.setStartBefore(g),
							e.setEndAfter(c),
							a.selectRanges([e]),
							setTimeout(function () {
								c.getParent() && (g.remove(), a.selectElement(c));
							}, 0));
					}
				}
				function l(a, c) {
					var e = b.document,
						g = b.editable(),
						d = function (a) {
							a.cancel();
						},
						h;
					if (!e.getById("cke_pastebin")) {
						var k = b.getSelection(),
							m = k.createBookmarks();
						CKEDITOR.env.ie && k.root.fire("selectionchange");
						var n = new CKEDITOR.dom.element(
							(!CKEDITOR.env.webkit && !g.is("body")) || CKEDITOR.env.ie
								? "div"
								: "body",
							e
						);
						n.setAttributes({ id: "cke_pastebin", "data-cke-temp": "1" });
						var q = 0,
							e = e.getWindow();
						CKEDITOR.env.webkit
							? (g.append(n),
							  n.addClass("cke_editable"),
							  g.is("body") ||
									((q =
										"static" != g.getComputedStyle("position")
											? g
											: CKEDITOR.dom.element.get(g.$.offsetParent)),
									(q = q.getDocumentPosition().y)))
							: g.getAscendant(CKEDITOR.env.ie ? "body" : "html", 1).append(n);
						n.setStyles({
							position: "absolute",
							top: e.getScrollPosition().y - q + 10 + "px",
							width: "1px",
							height: Math.max(1, e.getViewPaneSize().height - 20) + "px",
							overflow: "hidden",
							margin: 0,
							padding: 0,
						});
						CKEDITOR.env.safari &&
							n.setStyles(
								CKEDITOR.tools.cssVendorPrefix("user-select", "text")
							);
						(q = n.getParent().isReadOnly())
							? (n.setOpacity(0), n.setAttribute("contenteditable", !0))
							: n.setStyle(
									"ltr" == b.config.contentsLangDirection ? "left" : "right",
									"-10000px"
							  );
						b.on("selectionChange", d, null, null, 0);
						if (CKEDITOR.env.webkit || CKEDITOR.env.gecko)
							h = g.once("blur", d, null, null, -100);
						q && n.focus();
						q = new CKEDITOR.dom.range(n);
						q.selectNodeContents(n);
						var t = q.select();
						CKEDITOR.env.ie &&
							(h = g.once("blur", function () {
								b.lockSelection(t);
							}));
						var u = CKEDITOR.document.getWindow().getScrollPosition().y;
						setTimeout(function () {
							CKEDITOR.env.webkit &&
								(CKEDITOR.document.getBody().$.scrollTop = u);
							h && h.removeListener();
							CKEDITOR.env.ie && g.focus();
							k.selectBookmarks(m);
							n.remove();
							var a;
							CKEDITOR.env.webkit &&
								(a = n.getFirst()) &&
								a.is &&
								a.hasClass("Apple-style-span") &&
								(n = a);
							b.removeListener("selectionChange", d);
							c(n.getHtml());
						}, 0);
					}
				}
				function z() {
					if ("paste" == A.mainPasteEvent)
						return b.fire("beforePaste", { type: "auto", method: "paste" }), !1;
					b.focus();
					d();
					var a = b.focusManager;
					a.lock();
					if (b.editable().fire(A.mainPasteEvent) && !k("paste"))
						return a.unlock(), !1;
					a.unlock();
					return !0;
				}
				function t(a) {
					if ("wysiwyg" == b.mode)
						switch (a.data.keyCode) {
							case CKEDITOR.CTRL + 86:
							case CKEDITOR.SHIFT + 45:
								a = b.editable();
								d();
								"paste" == A.mainPasteEvent && a.fire("beforepaste");
								break;
							case CKEDITOR.CTRL + 88:
							case CKEDITOR.SHIFT + 46:
								b.fire("saveSnapshot"),
									setTimeout(function () {
										b.fire("saveSnapshot");
									}, 50);
						}
				}
				function y(c) {
					var e = {
						type: "auto",
						method: "paste",
						dataTransfer: A.initPasteDataTransfer(c),
					};
					e.dataTransfer.cacheData();
					var g = !1 !== b.fire("beforePaste", e);
					g && A.canClipboardApiBeTrusted(e.dataTransfer, b)
						? (c.data.preventDefault(),
						  setTimeout(function () {
								a(b, e);
						  }, 0))
						: l(c, function (c) {
								e.dataValue = c.replace(
									/<span[^>]+data-cke-bookmark[^<]*?<\/span>/gi,
									""
								);
								g && a(b, e);
						  });
				}
				function C() {
					if ("wysiwyg" == b.mode) {
						var a = B("paste");
						b.getCommand("cut").setState(B("cut"));
						b.getCommand("copy").setState(B("copy"));
						b.getCommand("paste").setState(a);
						b.fire("pasteState", a);
					}
				}
				function B(a) {
					if (J && a in { paste: 1, cut: 1 }) return CKEDITOR.TRISTATE_DISABLED;
					if ("paste" == a) return CKEDITOR.TRISTATE_OFF;
					a = b.getSelection();
					var c = a.getRanges();
					return a.getType() == CKEDITOR.SELECTION_NONE ||
						(1 == c.length && c[0].collapsed)
						? CKEDITOR.TRISTATE_DISABLED
						: CKEDITOR.TRISTATE_OFF;
				}
				var A = CKEDITOR.plugins.clipboard,
					H = 0,
					G = 0,
					J = 0;
				(function () {
					b.on("key", t);
					b.on("contentDom", c);
					b.on("selectionChange", function (a) {
						J = a.data.selection.getRanges()[0].checkReadOnly();
						C();
					});
					if (b.contextMenu) {
						b.contextMenu.addListener(function (a, b) {
							J = b.getRanges()[0].checkReadOnly();
							return { cut: B("cut"), copy: B("copy"), paste: B("paste") };
						});
						var a = null;
						b.on("menuShow", function () {
							a && (a.removeListener(), (a = null));
							var c = b.contextMenu.findItemByCommandName("paste");
							c &&
								c.element &&
								(a = c.element.on("touchend", function () {
									b._.forcePasteDialog = !0;
								}));
						});
					}
					if (b.ui.addButton)
						b.once("instanceReady", function () {
							b._.pasteButtons &&
								CKEDITOR.tools.array.forEach(b._.pasteButtons, function (a) {
									if ((a = b.ui.get(a)))
										if ((a = CKEDITOR.document.getById(a._.id)))
											a.on("touchend", function () {
												b._.forcePasteDialog = !0;
											});
								});
						});
				})();
				(function () {
					function a(c, e, g, d, h) {
						var k = b.lang.clipboard[e];
						b.addCommand(e, g);
						b.ui.addButton &&
							b.ui.addButton(c, {
								label: k,
								command: e,
								toolbar: "clipboard," + d,
							});
						b.addMenuItems &&
							b.addMenuItem(e, {
								label: k,
								command: e,
								group: "clipboard",
								order: h,
							});
					}
					a("Cut", "cut", e("cut"), 10, 1);
					a("Copy", "copy", e("copy"), 20, 4);
					a("Paste", "paste", g(), 30, 8);
					b._.pasteButtons || (b._.pasteButtons = []);
					b._.pasteButtons.push("Paste");
				})();
				b.getClipboardData = function (a, c) {
					function e(a) {
						a.removeListener();
						a.cancel();
						c(a.data);
					}
					function g(a) {
						a.removeListener();
						a.cancel();
						c({
							type: h,
							dataValue: a.data.dataValue,
							dataTransfer: a.data.dataTransfer,
							method: "paste",
						});
					}
					var d = !1,
						h = "auto";
					c || ((c = a), (a = null));
					b.on(
						"beforePaste",
						function (a) {
							a.removeListener();
							d = !0;
							h = a.data.type;
						},
						null,
						null,
						1e3
					);
					b.on("paste", e, null, null, 0);
					!1 === z() &&
						(b.removeListener("paste", e),
						b._.forcePasteDialog && d && b.fire("pasteDialog")
							? (b.on("pasteDialogCommit", g),
							  b.on("dialogHide", function (a) {
									a.removeListener();
									a.data.removeListener("pasteDialogCommit", g);
									a.data._.committed || c(null);
							  }))
							: c(null));
				};
			}
			function b(a) {
				if (CKEDITOR.env.webkit) {
					if (
						!a.match(/^[^<]*$/g) &&
						!a.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi)
					)
						return "html";
				} else if (CKEDITOR.env.ie) {
					if (
						!a.match(/^([^<]|<br( ?\/)?>)*$/gi) &&
						!a.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi)
					)
						return "html";
				} else if (CKEDITOR.env.gecko) {
					if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi)) return "html";
				} else return "html";
				return "htmlifiedtext";
			}
			function c(a, b) {
				function c(a) {
					return (
						CKEDITOR.tools.repeat("\x3c/p\x3e\x3cp\x3e", ~~(a / 2)) +
						(1 == a % 2 ? "\x3cbr\x3e" : "")
					);
				}
				b = b
					.replace(/(?!\u3000)\s+/g, " ")
					.replace(/> +</g, "\x3e\x3c")
					.replace(/<br ?\/>/gi, "\x3cbr\x3e");
				b = b.replace(/<\/?[A-Z]+>/g, function (a) {
					return a.toLowerCase();
				});
				if (b.match(/^[^<]$/)) return b;
				CKEDITOR.env.webkit &&
					-1 < b.indexOf("\x3cdiv\x3e") &&
					((b = b
						.replace(
							/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g,
							"\x3cbr\x3e"
						)
						.replace(
							/^(<div>(<br>|)<\/div>){2}(?!$)/g,
							"\x3cdiv\x3e\x3c/div\x3e"
						)),
					b.match(/<div>(<br>|)<\/div>/) &&
						(b =
							"\x3cp\x3e" +
							b.replace(/(<div>(<br>|)<\/div>)+/g, function (a) {
								return c(a.split("\x3c/div\x3e\x3cdiv\x3e").length + 1);
							}) +
							"\x3c/p\x3e"),
					(b = b.replace(/<\/div><div>/g, "\x3cbr\x3e")),
					(b = b.replace(/<\/?div>/g, "")));
				CKEDITOR.env.gecko &&
					a.enterMode != CKEDITOR.ENTER_BR &&
					(CKEDITOR.env.gecko && (b = b.replace(/^<br><br>$/, "\x3cbr\x3e")),
					-1 < b.indexOf("\x3cbr\x3e\x3cbr\x3e") &&
						(b =
							"\x3cp\x3e" +
							b.replace(/(<br>){2,}/g, function (a) {
								return c(a.length / 4);
							}) +
							"\x3c/p\x3e"));
				return k(a, b);
			}
			function g(a) {
				function b() {
					var a = {},
						c;
					for (c in CKEDITOR.dtd)
						"$" != c.charAt(0) && "div" != c && "span" != c && (a[c] = 1);
					return a;
				}
				var c = {};
				return {
					get: function (e) {
						return "plain-text" == e
							? c.plainText || (c.plainText = new CKEDITOR.filter(a, "br"))
							: "semantic-content" == e
							? ((e = c.semanticContent) ||
									((e = new CKEDITOR.filter(a, {})),
									e.allow({
										$1: {
											elements: b(),
											attributes: !0,
											styles: !1,
											classes: !1,
										},
									}),
									(e = c.semanticContent = e)),
							  e)
							: e
							? new CKEDITOR.filter(a, e)
							: null;
					},
				};
			}
			function l(a, b, c) {
				b = CKEDITOR.htmlParser.fragment.fromHtml(b);
				var e = new CKEDITOR.htmlParser.basicWriter();
				c.applyTo(b, !0, !1, a.activeEnterMode);
				b.writeHtml(e);
				return e.getHtml();
			}
			function k(a, b) {
				a.enterMode == CKEDITOR.ENTER_BR
					? (b = b
							.replace(/(<\/p><p>)+/g, function (a) {
								return CKEDITOR.tools.repeat("\x3cbr\x3e", (a.length / 7) * 2);
							})
							.replace(/<\/?p>/g, ""))
					: a.enterMode == CKEDITOR.ENTER_DIV &&
					  (b = b.replace(/<(\/)?p>/g, "\x3c$1div\x3e"));
				return b;
			}
			function h(a) {
				a.data.preventDefault();
				a.data.$.dataTransfer.dropEffect = "none";
			}
			function e(b) {
				var c = CKEDITOR.plugins.clipboard;
				b.on("contentDom", function () {
					function e(c, g, d) {
						g.select();
						a(b, { dataTransfer: d, method: "drop" }, 1);
						d.sourceEditor.fire("saveSnapshot");
						d.sourceEditor.editable().extractHtmlFromRange(c);
						d.sourceEditor.getSelection().selectRanges([c]);
						d.sourceEditor.fire("saveSnapshot");
					}
					function g(e, d) {
						e.select();
						a(b, { dataTransfer: d, method: "drop" }, 1);
						c.resetDragDataTransfer();
					}
					function d(a, c, e) {
						var g = { $: a.data.$, target: a.data.getTarget() };
						c && (g.dragRange = c);
						e && (g.dropRange = e);
						!1 === b.fire(a.name, g) && a.data.preventDefault();
					}
					function h(a) {
						a.type != CKEDITOR.NODE_ELEMENT && (a = a.getParent());
						return a.getChildCount();
					}
					var k = b.editable(),
						m = CKEDITOR.plugins.clipboard.getDropTarget(b),
						l = b.ui.space("top"),
						z = b.ui.space("bottom");
					c.preventDefaultDropOnElement(l);
					c.preventDefaultDropOnElement(z);
					k.attachListener(m, "dragstart", d);
					k.attachListener(b, "dragstart", c.resetDragDataTransfer, c, null, 1);
					k.attachListener(
						b,
						"dragstart",
						function (a) {
							c.initDragDataTransfer(a, b);
						},
						null,
						null,
						2
					);
					k.attachListener(
						b,
						"dragstart",
						function () {
							var a = (c.dragRange = b.getSelection().getRanges()[0]);
							CKEDITOR.env.ie &&
								10 > CKEDITOR.env.version &&
								((c.dragStartContainerChildCount = a
									? h(a.startContainer)
									: null),
								(c.dragEndContainerChildCount = a ? h(a.endContainer) : null));
						},
						null,
						null,
						100
					);
					k.attachListener(m, "dragend", d);
					k.attachListener(b, "dragend", c.initDragDataTransfer, c, null, 1);
					k.attachListener(b, "dragend", c.resetDragDataTransfer, c, null, 100);
					k.attachListener(m, "dragover", function (a) {
						if (CKEDITOR.env.edge) a.data.preventDefault();
						else {
							var b = a.data.getTarget();
							b && b.is && b.is("html")
								? a.data.preventDefault()
								: CKEDITOR.env.ie &&
								  CKEDITOR.plugins.clipboard.isFileApiSupported &&
								  a.data.$.dataTransfer.types.contains("Files") &&
								  a.data.preventDefault();
						}
					});
					k.attachListener(
						m,
						"drop",
						function (a) {
							if (!a.data.$.defaultPrevented) {
								a.data.preventDefault();
								var e = a.data.getTarget();
								if (
									!e.isReadOnly() ||
									(e.type == CKEDITOR.NODE_ELEMENT && e.is("html"))
								) {
									var e = c.getRangeAtDropPosition(a, b),
										g = c.dragRange;
									e && d(a, g, e);
								}
							}
						},
						null,
						null,
						9999
					);
					k.attachListener(b, "drop", c.initDragDataTransfer, c, null, 1);
					k.attachListener(
						b,
						"drop",
						function (a) {
							if ((a = a.data)) {
								var d = a.dropRange,
									h = a.dragRange,
									k = a.dataTransfer;
								k.getTransferType(b) == CKEDITOR.DATA_TRANSFER_INTERNAL
									? setTimeout(function () {
											c.internalDrop(h, d, k, b);
									  }, 0)
									: k.getTransferType(b) == CKEDITOR.DATA_TRANSFER_CROSS_EDITORS
									? e(h, d, k)
									: g(d, k);
							}
						},
						null,
						null,
						9999
					);
				});
			}
			var m;
			CKEDITOR.plugins.add("clipboard", {
				requires: "dialog,notification,toolbar",
				init: function (a) {
					var h,
						k = g(a);
					a.config.forcePasteAsPlainText
						? (h = "plain-text")
						: a.config.pasteFilter
						? (h = a.config.pasteFilter)
						: !CKEDITOR.env.webkit ||
						  "pasteFilter" in a.config ||
						  (h = "semantic-content");
					a.pasteFilter = k.get(h);
					d(a);
					e(a);
					CKEDITOR.dialog.add(
						"paste",
						CKEDITOR.getUrl(this.path + "dialogs/paste.js")
					);
					if (CKEDITOR.env.gecko) {
						var m = ["image/png", "image/jpeg", "image/gif"],
							v;
						a.on(
							"paste",
							function (b) {
								var c = b.data,
									e = c.dataTransfer;
								if (
									!c.dataValue &&
									"paste" == c.method &&
									e &&
									1 == e.getFilesCount() &&
									v != e.id &&
									((e = e.getFile(0)), -1 != CKEDITOR.tools.indexOf(m, e.type))
								) {
									var g = new FileReader();
									g.addEventListener(
										"load",
										function () {
											b.data.dataValue =
												'\x3cimg src\x3d"' + g.result + '" /\x3e';
											a.fire("paste", b.data);
										},
										!1
									);
									g.addEventListener(
										"abort",
										function () {
											a.fire("paste", b.data);
										},
										!1
									);
									g.addEventListener(
										"error",
										function () {
											a.fire("paste", b.data);
										},
										!1
									);
									g.readAsDataURL(e);
									v = c.dataTransfer.id;
									b.stop();
								}
							},
							null,
							null,
							1
						);
					}
					a.on(
						"paste",
						function (b) {
							b.data.dataTransfer ||
								(b.data.dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer());
							if (!b.data.dataValue) {
								var c = b.data.dataTransfer,
									e = c.getData("text/html");
								if (e) (b.data.dataValue = e), (b.data.type = "html");
								else if ((e = c.getData("text/plain")))
									(b.data.dataValue = a.editable().transformPlainTextToHtml(e)),
										(b.data.type = "text");
							}
						},
						null,
						null,
						1
					);
					a.on(
						"paste",
						function (a) {
							var b = a.data.dataValue,
								c = CKEDITOR.dtd.$block;
							-1 < b.indexOf("Apple-") &&
								((b = b.replace(
									/<span class="Apple-converted-space">&nbsp;<\/span>/gi,
									" "
								)),
								"html" != a.data.type &&
									(b = b.replace(
										/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi,
										function (a, b) {
											return b.replace(/\t/g, "\x26nbsp;\x26nbsp; \x26nbsp;");
										}
									)),
								-1 <
									b.indexOf(
										'\x3cbr class\x3d"Apple-interchange-newline"\x3e'
									) &&
									((a.data.startsWithEOL = 1),
									(a.data.preSniffing = "html"),
									(b = b.replace(
										/<br class="Apple-interchange-newline">/,
										""
									))),
								(b = b.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1")));
							if (b.match(/^<[^<]+cke_(editable|contents)/i)) {
								var f,
									e,
									g = new CKEDITOR.dom.element("div");
								for (
									g.setHtml(b);
									1 == g.getChildCount() &&
									(f = g.getFirst()) &&
									f.type == CKEDITOR.NODE_ELEMENT &&
									(f.hasClass("cke_editable") || f.hasClass("cke_contents"));

								)
									g = e = f;
								e && (b = e.getHtml().replace(/<br>$/i, ""));
							}
							CKEDITOR.env.ie
								? (b = b.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function (b, f) {
										return f.toLowerCase() in c
											? ((a.data.preSniffing = "html"), "\x3c" + f)
											: b;
								  }))
								: CKEDITOR.env.webkit
								? (b = b.replace(/<\/(\w+)><div><br><\/div>$/, function (b, f) {
										return f in c
											? ((a.data.endsWithEOL = 1), "\x3c/" + f + "\x3e")
											: b;
								  }))
								: CKEDITOR.env.gecko && (b = b.replace(/(\s)<br>$/, "$1"));
							a.data.dataValue = b;
						},
						null,
						null,
						3
					);
					a.on(
						"paste",
						function (e) {
							e = e.data;
							var g = a._.nextPasteType || e.type,
								d = e.dataValue,
								h,
								m = a.config.clipboard_defaultContentType || "html",
								n =
									e.dataTransfer.getTransferType(a) ==
									CKEDITOR.DATA_TRANSFER_EXTERNAL,
								y = !0 === a.config.forcePasteAsPlainText;
							h = "html" == g || "html" == e.preSniffing ? "html" : b(d);
							delete a._.nextPasteType;
							"htmlifiedtext" == h && (d = c(a.config, d));
							if ("text" == g && "html" == h) d = l(a, d, k.get("plain-text"));
							else if ((n && a.pasteFilter && !e.dontFilter) || y)
								d = l(a, d, a.pasteFilter);
							e.startsWithEOL && (d = '\x3cbr data-cke-eol\x3d"1"\x3e' + d);
							e.endsWithEOL && (d += '\x3cbr data-cke-eol\x3d"1"\x3e');
							"auto" == g && (g = "html" == h || "html" == m ? "html" : "text");
							e.type = g;
							e.dataValue = d;
							delete e.preSniffing;
							delete e.startsWithEOL;
							delete e.endsWithEOL;
						},
						null,
						null,
						6
					);
					a.on(
						"paste",
						function (b) {
							b = b.data;
							b.dataValue &&
								(a.insertHtml(b.dataValue, b.type, b.range),
								setTimeout(function () {
									a.fire("afterPaste");
								}, 0));
						},
						null,
						null,
						1e3
					);
					a.on("pasteDialog", function (b) {
						setTimeout(function () {
							a.openDialog("paste", b.data);
						}, 0);
					});
				},
			});
			CKEDITOR.plugins.clipboard = {
				isCustomCopyCutSupported:
					(!CKEDITOR.env.ie || 16 <= CKEDITOR.env.version) && !CKEDITOR.env.iOS,
				isCustomDataTypesSupported:
					!CKEDITOR.env.ie || 16 <= CKEDITOR.env.version,
				isFileApiSupported: !CKEDITOR.env.ie || 9 < CKEDITOR.env.version,
				mainPasteEvent:
					CKEDITOR.env.ie && !CKEDITOR.env.edge ? "beforepaste" : "paste",
				addPasteButton: function (a, b, c) {
					a.ui.addButton &&
						(a.ui.addButton(b, c),
						a._.pasteButtons || (a._.pasteButtons = []),
						a._.pasteButtons.push(b));
				},
				canClipboardApiBeTrusted: function (a, b) {
					return a.getTransferType(b) != CKEDITOR.DATA_TRANSFER_EXTERNAL ||
						(CKEDITOR.env.chrome && !a.isEmpty()) ||
						(CKEDITOR.env.gecko &&
							(a.getData("text/html") || a.getFilesCount())) ||
						(CKEDITOR.env.safari &&
							603 <= CKEDITOR.env.version &&
							!CKEDITOR.env.iOS) ||
						(CKEDITOR.env.edge && 16 <= CKEDITOR.env.version)
						? !0
						: !1;
				},
				getDropTarget: function (a) {
					var b = a.editable();
					return (CKEDITOR.env.ie && 9 > CKEDITOR.env.version) || b.isInline()
						? b
						: a.document;
				},
				fixSplitNodesAfterDrop: function (a, b, c, e) {
					function g(a, c, f) {
						var e = a;
						e.type == CKEDITOR.NODE_TEXT && (e = a.getParent());
						if (e.equals(c) && f != c.getChildCount())
							return (
								(a = b.startContainer.getChild(b.startOffset - 1)),
								(c = b.startContainer.getChild(b.startOffset)),
								a &&
									a.type == CKEDITOR.NODE_TEXT &&
									c &&
									c.type == CKEDITOR.NODE_TEXT &&
									((f = a.getLength()),
									a.setText(a.getText() + c.getText()),
									c.remove(),
									b.setStart(a, f),
									b.collapse(!0)),
								!0
							);
					}
					var d = b.startContainer;
					"number" == typeof e &&
						"number" == typeof c &&
						d.type == CKEDITOR.NODE_ELEMENT &&
						(g(a.startContainer, d, c) || g(a.endContainer, d, e));
				},
				isDropRangeAffectedByDragRange: function (a, b) {
					var c = b.startContainer,
						e = b.endOffset;
					return (a.endContainer.equals(c) && a.endOffset <= e) ||
						(a.startContainer.getParent().equals(c) &&
							a.startContainer.getIndex() < e) ||
						(a.endContainer.getParent().equals(c) &&
							a.endContainer.getIndex() < e)
						? !0
						: !1;
				},
				internalDrop: function (b, c, e, g) {
					var d = CKEDITOR.plugins.clipboard,
						h = g.editable(),
						k,
						m;
					g.fire("saveSnapshot");
					g.fire("lockSnapshot", { dontUpdate: 1 });
					CKEDITOR.env.ie &&
						10 > CKEDITOR.env.version &&
						this.fixSplitNodesAfterDrop(
							b,
							c,
							d.dragStartContainerChildCount,
							d.dragEndContainerChildCount
						);
					(m = this.isDropRangeAffectedByDragRange(b, c)) ||
						(k = b.createBookmark(!1));
					d = c.clone().createBookmark(!1);
					m && (k = b.createBookmark(!1));
					b = k.startNode;
					c = k.endNode;
					m = d.startNode;
					c &&
						b.getPosition(m) & CKEDITOR.POSITION_PRECEDING &&
						c.getPosition(m) & CKEDITOR.POSITION_FOLLOWING &&
						m.insertBefore(b);
					b = g.createRange();
					b.moveToBookmark(k);
					h.extractHtmlFromRange(b, 1);
					c = g.createRange();
					c.moveToBookmark(d);
					a(g, { dataTransfer: e, method: "drop", range: c }, 1);
					g.fire("unlockSnapshot");
				},
				getRangeAtDropPosition: function (a, b) {
					var c = a.data.$,
						e = c.clientX,
						g = c.clientY,
						d = b.getSelection(!0).getRanges()[0],
						h = b.createRange();
					if (a.data.testRange) return a.data.testRange;
					if (
						document.caretRangeFromPoint &&
						b.document.$.caretRangeFromPoint(e, g)
					)
						(c = b.document.$.caretRangeFromPoint(e, g)),
							h.setStart(CKEDITOR.dom.node(c.startContainer), c.startOffset),
							h.collapse(!0);
					else if (c.rangeParent)
						h.setStart(CKEDITOR.dom.node(c.rangeParent), c.rangeOffset),
							h.collapse(!0);
					else {
						if (
							CKEDITOR.env.ie &&
							8 < CKEDITOR.env.version &&
							d &&
							b.editable().hasFocus
						)
							return d;
						if (document.body.createTextRange) {
							b.focus();
							c = b.document.getBody().$.createTextRange();
							try {
								for (var k = !1, m = 0; 20 > m && !k; m++) {
									if (!k)
										try {
											c.moveToPoint(e, g - m), (k = !0);
										} catch (l) {}
									if (!k)
										try {
											c.moveToPoint(e, g + m), (k = !0);
										} catch (t) {}
								}
								if (k) {
									var y = "cke-temp-" + new Date().getTime();
									c.pasteHTML('\x3cspan id\x3d"' + y + '"\x3e​\x3c/span\x3e');
									var C = b.document.getById(y);
									h.moveToPosition(C, CKEDITOR.POSITION_BEFORE_START);
									C.remove();
								} else {
									var B = b.document.$.elementFromPoint(e, g),
										A = new CKEDITOR.dom.element(B),
										H;
									if (A.equals(b.editable()) || "html" == A.getName())
										return d &&
											d.startContainer &&
											!d.startContainer.equals(b.editable())
											? d
											: null;
									H = A.getClientRect();
									e < H.left
										? h.setStartAt(A, CKEDITOR.POSITION_AFTER_START)
										: h.setStartAt(A, CKEDITOR.POSITION_BEFORE_END);
									h.collapse(!0);
								}
							} catch (G) {
								return null;
							}
						} else return null;
					}
					return h;
				},
				initDragDataTransfer: function (a, b) {
					var c = a.data.$ ? a.data.$.dataTransfer : null,
						e = new this.dataTransfer(c, b);
					"dragstart" === a.name && e.storeId();
					c
						? this.dragData && e.id == this.dragData.id
							? (e = this.dragData)
							: (this.dragData = e)
						: this.dragData
						? (e = this.dragData)
						: (this.dragData = e);
					a.data.dataTransfer = e;
				},
				resetDragDataTransfer: function () {
					this.dragData = null;
				},
				initPasteDataTransfer: function (a, b) {
					if (this.isCustomCopyCutSupported) {
						if (a && a.data && a.data.$) {
							var c = a.data.$.clipboardData,
								e = new this.dataTransfer(c, b);
							("copy" !== a.name && "cut" !== a.name) || e.storeId();
							this.copyCutData && e.id == this.copyCutData.id
								? ((e = this.copyCutData), (e.$ = c))
								: (this.copyCutData = e);
							return e;
						}
						return new this.dataTransfer(null, b);
					}
					return new this.dataTransfer(
						(CKEDITOR.env.edge && a && a.data.$ && a.data.$.clipboardData) ||
							null,
						b
					);
				},
				preventDefaultDropOnElement: function (a) {
					a && a.on("dragover", h);
				},
			};
			m = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported
				? "cke/id"
				: "Text";
			CKEDITOR.plugins.clipboard.dataTransfer = function (a, b) {
				a && (this.$ = a);
				this._ = {
					metaRegExp: /^<meta.*?>/i,
					bodyRegExp: /<body(?:[\s\S]*?)>([\s\S]*)<\/body>/i,
					fragmentRegExp: /\x3c!--(?:Start|End)Fragment--\x3e/g,
					data: {},
					files: [],
					nativeHtmlCache: "",
					normalizeType: function (a) {
						a = a.toLowerCase();
						return "text" == a || "text/plain" == a
							? "Text"
							: "url" == a
							? "URL"
							: a;
					},
				};
				this._.fallbackDataTransfer = new CKEDITOR.plugins.clipboard.fallbackDataTransfer(
					this
				);
				this.id = this.getData(m);
				this.id ||
					(this.id = "Text" == m ? "" : "cke-" + CKEDITOR.tools.getUniqueId());
				b &&
					((this.sourceEditor = b),
					this.setData("text/html", b.getSelectedHtml(1)),
					"Text" == m ||
						this.getData("text/plain") ||
						this.setData("text/plain", b.getSelection().getSelectedText()));
			};
			CKEDITOR.DATA_TRANSFER_INTERNAL = 1;
			CKEDITOR.DATA_TRANSFER_CROSS_EDITORS = 2;
			CKEDITOR.DATA_TRANSFER_EXTERNAL = 3;
			CKEDITOR.plugins.clipboard.dataTransfer.prototype = {
				getData: function (a, b) {
					a = this._.normalizeType(a);
					var c =
						"text/html" == a && b ? this._.nativeHtmlCache : this._.data[a];
					if (void 0 === c || null === c || "" === c) {
						if (this._.fallbackDataTransfer.isRequired())
							c = this._.fallbackDataTransfer.getData(a, b);
						else
							try {
								c = this.$.getData(a) || "";
							} catch (e) {
								c = "";
							}
						"text/html" != a || b || (c = this._stripHtml(c));
					}
					"Text" == a &&
						CKEDITOR.env.gecko &&
						this.getFilesCount() &&
						"file://" == c.substring(0, 7) &&
						(c = "");
					if ("string" === typeof c)
						var g = c.indexOf("\x3c/html\x3e"),
							c = -1 !== g ? c.substring(0, g + 7) : c;
					return c;
				},
				setData: function (a, b) {
					a = this._.normalizeType(a);
					"text/html" == a
						? ((this._.data[a] = this._stripHtml(b)),
						  (this._.nativeHtmlCache = b))
						: (this._.data[a] = b);
					if (
						CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ||
						"URL" == a ||
						"Text" == a
					)
						if (
							("Text" == m && "Text" == a && (this.id = b),
							this._.fallbackDataTransfer.isRequired())
						)
							this._.fallbackDataTransfer.setData(a, b);
						else
							try {
								this.$.setData(a, b);
							} catch (c) {}
				},
				storeId: function () {
					"Text" !== m && this.setData(m, this.id);
				},
				getTransferType: function (a) {
					return this.sourceEditor
						? this.sourceEditor == a
							? CKEDITOR.DATA_TRANSFER_INTERNAL
							: CKEDITOR.DATA_TRANSFER_CROSS_EDITORS
						: CKEDITOR.DATA_TRANSFER_EXTERNAL;
				},
				cacheData: function () {
					function a(c) {
						c = b._.normalizeType(c);
						var e = b.getData(c);
						"text/html" == c &&
							((b._.nativeHtmlCache = b.getData(c, !0)), (e = b._stripHtml(e)));
						e && (b._.data[c] = e);
					}
					if (this.$) {
						var b = this,
							c,
							e;
						if (CKEDITOR.plugins.clipboard.isCustomDataTypesSupported) {
							if (this.$.types)
								for (c = 0; c < this.$.types.length; c++) a(this.$.types[c]);
						} else a("Text"), a("URL");
						e = this._getImageFromClipboard();
						if ((this.$ && this.$.files) || e) {
							this._.files = [];
							if (this.$.files && this.$.files.length)
								for (c = 0; c < this.$.files.length; c++)
									this._.files.push(this.$.files[c]);
							0 === this._.files.length && e && this._.files.push(e);
						}
					}
				},
				getFilesCount: function () {
					return this._.files.length
						? this._.files.length
						: this.$ && this.$.files && this.$.files.length
						? this.$.files.length
						: this._getImageFromClipboard()
						? 1
						: 0;
				},
				getFile: function (a) {
					return this._.files.length
						? this._.files[a]
						: this.$ && this.$.files && this.$.files.length
						? this.$.files[a]
						: 0 === a
						? this._getImageFromClipboard()
						: void 0;
				},
				isEmpty: function () {
					var a = {},
						b;
					if (this.getFilesCount()) return !1;
					CKEDITOR.tools.array.forEach(
						CKEDITOR.tools.objectKeys(this._.data),
						function (b) {
							a[b] = 1;
						}
					);
					if (this.$)
						if (CKEDITOR.plugins.clipboard.isCustomDataTypesSupported) {
							if (this.$.types)
								for (var c = 0; c < this.$.types.length; c++)
									a[this.$.types[c]] = 1;
						} else (a.Text = 1), (a.URL = 1);
					"Text" != m && (a[m] = 0);
					for (b in a) if (a[b] && "" !== this.getData(b)) return !1;
					return !0;
				},
				_getImageFromClipboard: function () {
					var a;
					if (this.$ && this.$.items && this.$.items[0])
						try {
							if ((a = this.$.items[0].getAsFile()) && a.type) return a;
						} catch (b) {}
				},
				_stripHtml: function (a) {
					if (a && a.length) {
						a = a.replace(this._.metaRegExp, "");
						var b = this._.bodyRegExp.exec(a);
						b &&
							b.length &&
							((a = b[1]), (a = a.replace(this._.fragmentRegExp, "")));
					}
					return a;
				},
			};
			CKEDITOR.plugins.clipboard.fallbackDataTransfer = function (a) {
				this._dataTransfer = a;
				this._customDataFallbackType = "text/html";
			};
			CKEDITOR.plugins.clipboard.fallbackDataTransfer._isCustomMimeTypeSupported = null;
			CKEDITOR.plugins.clipboard.fallbackDataTransfer._customTypes = [];
			CKEDITOR.plugins.clipboard.fallbackDataTransfer.prototype = {
				isRequired: function () {
					var a = CKEDITOR.plugins.clipboard.fallbackDataTransfer,
						b = this._dataTransfer.$;
					if (null === a._isCustomMimeTypeSupported)
						if (b) {
							a._isCustomMimeTypeSupported = !1;
							if (CKEDITOR.env.edge && 17 <= CKEDITOR.env.version) return !0;
							try {
								b.setData("cke/mimetypetest", "cke test value"),
									(a._isCustomMimeTypeSupported =
										"cke test value" === b.getData("cke/mimetypetest")),
									b.clearData("cke/mimetypetest");
							} catch (c) {}
						} else return !1;
					return !a._isCustomMimeTypeSupported;
				},
				getData: function (a, b) {
					var c = this._getData(this._customDataFallbackType, !0);
					if (b) return c;
					var c = this._extractDataComment(c),
						e = null,
						e =
							a === this._customDataFallbackType
								? c.content
								: c.data && c.data[a]
								? c.data[a]
								: this._getData(a, !0);
					return null !== e ? e : "";
				},
				setData: function (a, b) {
					var c = a === this._customDataFallbackType;
					c && (b = this._applyDataComment(b, this._getFallbackTypeData()));
					var e = b,
						g = this._dataTransfer.$;
					try {
						g.setData(a, e), c && (this._dataTransfer._.nativeHtmlCache = e);
					} catch (d) {
						if (this._isUnsupportedMimeTypeError(d)) {
							c = CKEDITOR.plugins.clipboard.fallbackDataTransfer;
							-1 === CKEDITOR.tools.indexOf(c._customTypes, a) &&
								c._customTypes.push(a);
							var c = this._getFallbackTypeContent(),
								h = this._getFallbackTypeData();
							h[a] = e;
							try {
								(e = this._applyDataComment(c, h)),
									g.setData(this._customDataFallbackType, e),
									(this._dataTransfer._.nativeHtmlCache = e);
							} catch (k) {
								e = "";
							}
						}
					}
					return e;
				},
				_getData: function (a, b) {
					var c = this._dataTransfer._.data;
					if (!b && c[a]) return c[a];
					try {
						return this._dataTransfer.$.getData(a);
					} catch (e) {
						return null;
					}
				},
				_getFallbackTypeContent: function () {
					var a = this._dataTransfer._.data[this._customDataFallbackType];
					a ||
						(a = this._extractDataComment(
							this._getData(this._customDataFallbackType, !0)
						).content);
					return a;
				},
				_getFallbackTypeData: function () {
					var a = CKEDITOR.plugins.clipboard.fallbackDataTransfer._customTypes,
						b =
							this._extractDataComment(
								this._getData(this._customDataFallbackType, !0)
							).data || {},
						c = this._dataTransfer._.data;
					CKEDITOR.tools.array.forEach(
						a,
						function (a) {
							void 0 !== c[a]
								? (b[a] = c[a])
								: void 0 !== b[a] && (b[a] = b[a]);
						},
						this
					);
					return b;
				},
				_isUnsupportedMimeTypeError: function (a) {
					return a.message && -1 !== a.message.search(/element not found/gi);
				},
				_extractDataComment: function (a) {
					var b = { data: null, content: a || "" };
					if (a && 16 < a.length) {
						var c;
						(c = /\x3c!--cke-data:(.*?)--\x3e/g.exec(a)) &&
							c[1] &&
							((b.data = JSON.parse(decodeURIComponent(c[1]))),
							(b.content = a.replace(c[0], "")));
					}
					return b;
				},
				_applyDataComment: function (a, b) {
					var c = "";
					b &&
						CKEDITOR.tools.objectKeys(b).length &&
						(c =
							"\x3c!--cke-data:" +
							encodeURIComponent(JSON.stringify(b)) +
							"--\x3e");
					return c + (a && a.length ? a : "");
				},
			};
		})(),
		(CKEDITOR.config.clipboard_notificationDuration = 1e4),
		(function () {
			CKEDITOR.plugins.add("panel", {
				beforeInit: function (a) {
					a.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler);
				},
			});
			CKEDITOR.UI_PANEL = "panel";
			CKEDITOR.ui.panel = function (a, b) {
				b && CKEDITOR.tools.extend(this, b);
				CKEDITOR.tools.extend(this, { className: "", css: [] });
				this.id = CKEDITOR.tools.getNextId();
				this.document = a;
				this.isFramed = this.forceIFrame || this.css.length;
				this._ = { blocks: {} };
			};
			CKEDITOR.ui.panel.handler = {
				create: function (a) {
					return new CKEDITOR.ui.panel(a);
				},
			};
			var a = CKEDITOR.addTemplate(
					"panel",
					'\x3cdiv lang\x3d"{langCode}" id\x3d"{id}" dir\x3d{dir} class\x3d"cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style\x3d"z-index:{z-index}" role\x3d"presentation"\x3e{frame}\x3c/div\x3e'
				),
				d = CKEDITOR.addTemplate(
					"panel-frame",
					'\x3ciframe id\x3d"{id}" class\x3d"cke_panel_frame" role\x3d"presentation" frameborder\x3d"0" src\x3d"{src}"\x3e\x3c/iframe\x3e'
				),
				b = CKEDITOR.addTemplate(
					"panel-frame-inner",
					'\x3c!DOCTYPE html\x3e\x3chtml class\x3d"cke_panel_container {env}" dir\x3d"{dir}" lang\x3d"{langCode}"\x3e\x3chead\x3e{css}\x3c/head\x3e\x3cbody class\x3d"cke_{dir}" style\x3d"margin:0;padding:0" onload\x3d"{onload}"\x3e\x3c/body\x3e\x3c/html\x3e'
				);
			CKEDITOR.ui.panel.prototype = {
				render: function (c, g) {
					var l = {
						editorId: c.id,
						id: this.id,
						langCode: c.langCode,
						dir: c.lang.dir,
						cls: this.className,
						frame: "",
						env: CKEDITOR.env.cssClass,
						"z-index": c.config.baseFloatZIndex + 1,
					};
					this.getHolderElement = function () {
						var a = this._.holder;
						if (!a) {
							if (this.isFramed) {
								var a = this.document.getById(this.id + "_frame"),
									c = a.getParent(),
									a = a.getFrameDocument();
								CKEDITOR.env.iOS &&
									c.setStyles({
										overflow: "scroll",
										"-webkit-overflow-scrolling": "touch",
									});
								c = CKEDITOR.tools.addFunction(
									CKEDITOR.tools.bind(function () {
										this.isLoaded = !0;
										if (this.onLoad) this.onLoad();
									}, this)
								);
								a.write(
									b.output(
										CKEDITOR.tools.extend(
											{
												css: CKEDITOR.tools.buildStyleHtml(this.css),
												onload:
													"window.parent.CKEDITOR.tools.callFunction(" +
													c +
													");",
											},
											l
										)
									)
								);
								a.getWindow().$.CKEDITOR = CKEDITOR;
								a.on(
									"keydown",
									function (a) {
										var b = a.data.getKeystroke(),
											c = this.document.getById(this.id).getAttribute("dir");
										if (
											"input" !== a.data.getTarget().getName() ||
											(37 !== b && 39 !== b)
										)
											this._.onKeyDown && !1 === this._.onKeyDown(b)
												? ("input" === a.data.getTarget().getName() &&
														32 === b) ||
												  a.data.preventDefault()
												: (27 == b || b == ("rtl" == c ? 39 : 37)) &&
												  this.onEscape &&
												  !1 === this.onEscape(b) &&
												  a.data.preventDefault();
									},
									this
								);
								a = a.getBody();
								a.unselectable();
								CKEDITOR.env.air && CKEDITOR.tools.callFunction(c);
							} else a = this.document.getById(this.id);
							this._.holder = a;
						}
						return a;
					};
					if (this.isFramed) {
						var k = CKEDITOR.env.air
							? "javascript:void(0)"
							: CKEDITOR.env.ie && !CKEDITOR.env.edge
							? "javascript:void(function(){" +
							  encodeURIComponent(
									"document.open();(" +
										CKEDITOR.tools.fixDomain +
										")();document.close();"
							  ) +
							  "}())"
							: "";
						l.frame = d.output({ id: this.id + "_frame", src: k });
					}
					k = a.output(l);
					g && g.push(k);
					return k;
				},
				addBlock: function (a, b) {
					b = this._.blocks[a] =
						b instanceof CKEDITOR.ui.panel.block
							? b
							: new CKEDITOR.ui.panel.block(this.getHolderElement(), b);
					this._.currentBlock || this.showBlock(a);
					return b;
				},
				getBlock: function (a) {
					return this._.blocks[a];
				},
				showBlock: function (a) {
					a = this._.blocks[a];
					var b = this._.currentBlock,
						d =
							!this.forceIFrame || CKEDITOR.env.ie
								? this._.holder
								: this.document.getById(this.id + "_frame");
					b && b.hide();
					this._.currentBlock = a;
					CKEDITOR.fire("ariaWidget", d);
					a._.focusIndex = -1;
					this._.onKeyDown = a.onKeyDown && CKEDITOR.tools.bind(a.onKeyDown, a);
					a.show();
					return a;
				},
				destroy: function () {
					this.element && this.element.remove();
				},
			};
			CKEDITOR.ui.panel.block = CKEDITOR.tools.createClass({
				$: function (a, b) {
					this.element = a.append(
						a
							.getDocument()
							.createElement("div", {
								attributes: { tabindex: -1, class: "cke_panel_block" },
								styles: { display: "none" },
							})
					);
					b && CKEDITOR.tools.extend(this, b);
					this.element.setAttributes({
						role: this.attributes.role || "presentation",
						"aria-label": this.attributes["aria-label"],
						title: this.attributes.title || this.attributes["aria-label"],
					});
					this.keys = {};
					this._.focusIndex = -1;
					this.element.disableContextMenu();
				},
				_: {
					markItem: function (a) {
						-1 != a &&
							((a = this._.getItems().getItem((this._.focusIndex = a))),
							CKEDITOR.env.webkit && a.getDocument().getWindow().focus(),
							a.focus(),
							this.onMark && this.onMark(a));
					},
					markFirstDisplayed: function (a) {
						for (
							var b = function (a) {
									return (
										a.type == CKEDITOR.NODE_ELEMENT &&
										"none" == a.getStyle("display")
									);
								},
								d = this._.getItems(),
								k,
								h,
								e = d.count() - 1;
							0 <= e;
							e--
						)
							if (
								((k = d.getItem(e)),
								k.getAscendant(b) || ((h = k), (this._.focusIndex = e)),
								"true" == k.getAttribute("aria-selected"))
							) {
								h = k;
								this._.focusIndex = e;
								break;
							}
						h &&
							(a && a(),
							CKEDITOR.env.webkit && h.getDocument().getWindow().focus(),
							h.focus(),
							this.onMark && this.onMark(h));
					},
					getItems: function () {
						return this.element.find("a,input");
					},
				},
				proto: {
					show: function () {
						this.element.setStyle("display", "");
					},
					hide: function () {
						(this.onHide && !0 === this.onHide.call(this)) ||
							this.element.setStyle("display", "none");
					},
					onKeyDown: function (a, b) {
						var d = this.keys[a];
						switch (d) {
							case "next":
								for (
									var k = this._.focusIndex, d = this._.getItems(), h;
									(h = d.getItem(++k));

								)
									if (h.getAttribute("_cke_focus") && h.$.offsetWidth) {
										this._.focusIndex = k;
										h.focus(!0);
										break;
									}
								return h || b
									? !1
									: ((this._.focusIndex = -1), this.onKeyDown(a, 1));
							case "prev":
								k = this._.focusIndex;
								for (d = this._.getItems(); 0 < k && (h = d.getItem(--k)); ) {
									if (h.getAttribute("_cke_focus") && h.$.offsetWidth) {
										this._.focusIndex = k;
										h.focus(!0);
										break;
									}
									h = null;
								}
								return h || b
									? !1
									: ((this._.focusIndex = d.count()), this.onKeyDown(a, 1));
							case "click":
							case "mouseup":
								return (
									(k = this._.focusIndex),
									(h = 0 <= k && this._.getItems().getItem(k)) &&
										(h.$[d] ? h.$[d]() : h.$["on" + d]()),
									!1
								);
						}
						return !0;
					},
				},
			});
		})(),
		CKEDITOR.plugins.add("floatpanel", { requires: "panel" }),
		(function () {
			function a(a, c, g, l, k) {
				k = CKEDITOR.tools.genKey(
					c.getUniqueId(),
					g.getUniqueId(),
					a.lang.dir,
					a.uiColor || "",
					l.css || "",
					k || ""
				);
				var h = d[k];
				h ||
					((h = d[k] = new CKEDITOR.ui.panel(c, l)),
					(h.element = g.append(
						CKEDITOR.dom.element.createFromHtml(h.render(a), c)
					)),
					h.element.setStyles({ display: "none", position: "absolute" }));
				return h;
			}
			var d = {};
			CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
				$: function (b, c, g, d) {
					function k() {
						f.hide();
					}
					g.forceIFrame = 1;
					g.toolbarRelated &&
						b.elementMode == CKEDITOR.ELEMENT_MODE_INLINE &&
						(c = CKEDITOR.document.getById("cke_" + b.name));
					var h = c.getDocument();
					d = a(b, h, c, g, d || 0);
					var e = d.element,
						m = e.getFirst(),
						f = this;
					e.disableContextMenu();
					this.element = e;
					this._ = {
						editor: b,
						panel: d,
						parentElement: c,
						definition: g,
						document: h,
						iframe: m,
						children: [],
						dir: b.lang.dir,
						showBlockParams: null,
						markFirst: void 0 !== g.markFirst ? g.markFirst : !0,
					};
					b.on("mode", k);
					b.on("resize", k);
					h.getWindow().on(
						"resize",
						function () {
							this.reposition();
						},
						this
					);
				},
				proto: {
					addBlock: function (a, c) {
						return this._.panel.addBlock(a, c);
					},
					addListBlock: function (a, c) {
						return this._.panel.addListBlock(a, c);
					},
					getBlock: function (a) {
						return this._.panel.getBlock(a);
					},
					showBlock: function (a, c, g, d, k, h) {
						var e = this._.panel,
							m = e.showBlock(a);
						this._.showBlockParams = [].slice.call(arguments);
						this.allowBlur(!1);
						var f = this._.editor.editable();
						this._.returnFocus = f.hasFocus
							? f
							: new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
						this._.hideTimeout = 0;
						var n = this.element,
							f = this._.iframe,
							f =
								CKEDITOR.env.ie && !CKEDITOR.env.edge
									? f
									: new CKEDITOR.dom.window(f.$.contentWindow),
							r = n.getDocument(),
							x = this._.parentElement.getPositionedAncestor(),
							v = c.getDocumentPosition(r),
							r = x ? x.getDocumentPosition(r) : { x: 0, y: 0 },
							p = "rtl" == this._.dir,
							u = v.x + (d || 0) - r.x,
							w = v.y + (k || 0) - r.y;
						!p || (1 != g && 4 != g)
							? p || (2 != g && 3 != g) || (u += c.$.offsetWidth - 1)
							: (u += c.$.offsetWidth);
						if (3 == g || 4 == g) w += c.$.offsetHeight - 1;
						this._.panel._.offsetParentId = c.getId();
						n.setStyles({ top: w + "px", left: 0, display: "" });
						n.setOpacity(0);
						n.getFirst().removeStyle("width");
						this._.editor.focusManager.add(f);
						this._.blurSet ||
							((CKEDITOR.event.useCapture = !0),
							f.on(
								"blur",
								function (a) {
									function b() {
										delete this._.returnFocus;
										this.hide();
									}
									this.allowBlur() &&
										a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET &&
										this.visible &&
										!this._.activeChild &&
										(CKEDITOR.env.iOS
											? this._.hideTimeout ||
											  (this._.hideTimeout = CKEDITOR.tools.setTimeout(
													b,
													0,
													this
											  ))
											: b.call(this));
								},
								this
							),
							f.on(
								"focus",
								function () {
									this._.focused = !0;
									this.hideChild();
									this.allowBlur(!0);
								},
								this
							),
							CKEDITOR.env.iOS &&
								(f.on(
									"touchstart",
									function () {
										clearTimeout(this._.hideTimeout);
									},
									this
								),
								f.on(
									"touchend",
									function () {
										this._.hideTimeout = 0;
										this.focus();
									},
									this
								)),
							(CKEDITOR.event.useCapture = !1),
							(this._.blurSet = 1));
						e.onEscape = CKEDITOR.tools.bind(function (a) {
							if (this.onEscape && !1 === this.onEscape(a)) return !1;
						}, this);
						CKEDITOR.tools.setTimeout(
							function () {
								var a = CKEDITOR.tools.bind(function () {
									var a = n;
									a.removeStyle("width");
									if (m.autoSize) {
										var b = m.element.getDocument(),
											b = (CKEDITOR.env.webkit || CKEDITOR.env.edge
												? m.element
												: b.getBody()
											).$.scrollWidth;
										CKEDITOR.env.ie &&
											CKEDITOR.env.quirks &&
											0 < b &&
											(b +=
												(a.$.offsetWidth || 0) - (a.$.clientWidth || 0) + 3);
										a.setStyle("width", b + 10 + "px");
										b = m.element.$.scrollHeight;
										CKEDITOR.env.ie &&
											CKEDITOR.env.quirks &&
											0 < b &&
											(b +=
												(a.$.offsetHeight || 0) - (a.$.clientHeight || 0) + 3);
										a.setStyle("height", b + "px");
										e._.currentBlock.element
											.setStyle("display", "none")
											.removeStyle("display");
									} else a.removeStyle("height");
									p && (u -= n.$.offsetWidth);
									n.setStyle("left", u + "px");
									var b = e.element.getWindow(),
										a = n.$.getBoundingClientRect(),
										b = b.getViewPaneSize(),
										c = a.width || a.right - a.left,
										f = a.height || a.bottom - a.top,
										g = p ? a.right : b.width - a.left,
										d = p ? b.width - a.right : a.left;
									p
										? g < c &&
										  (u =
												d > c
													? u + c
													: b.width > c
													? u - a.left
													: u - a.right + b.width)
										: g < c &&
										  (u =
												d > c
													? u - c
													: b.width > c
													? u - a.right + b.width
													: u - a.left);
									c = a.top;
									b.height - a.top < f &&
										(w =
											c > f
												? w - f
												: b.height > f
												? w - a.bottom + b.height
												: w - a.top);
									CKEDITOR.env.ie &&
										!CKEDITOR.env.edge &&
										((b = a = new CKEDITOR.dom.element(n.$.offsetParent)),
										"html" == b.getName() && (b = b.getDocument().getBody()),
										"rtl" == b.getComputedStyle("direction") &&
											(u = CKEDITOR.env.ie8Compat
												? u -
												  2 * n.getDocument().getDocumentElement().$.scrollLeft
												: u - (a.$.scrollWidth - a.$.clientWidth)));
									var a = n.getFirst(),
										k;
									(k = a.getCustomData("activePanel")) &&
										k.onHide &&
										k.onHide.call(this, 1);
									a.setCustomData("activePanel", this);
									n.setStyles({ top: w + "px", left: u + "px" });
									n.setOpacity(1);
									h && h();
								}, this);
								e.isLoaded ? a() : (e.onLoad = a);
								CKEDITOR.tools.setTimeout(
									function () {
										var a =
											CKEDITOR.env.webkit &&
											CKEDITOR.document.getWindow().getScrollPosition().y;
										this.focus();
										m.element.focus();
										CKEDITOR.env.webkit &&
											(CKEDITOR.document.getBody().$.scrollTop = a);
										this.allowBlur(!0);
										this._.markFirst &&
											(CKEDITOR.env.ie
												? CKEDITOR.tools.setTimeout(function () {
														m.markFirstDisplayed
															? m.markFirstDisplayed()
															: m._.markFirstDisplayed();
												  }, 0)
												: m.markFirstDisplayed
												? m.markFirstDisplayed()
												: m._.markFirstDisplayed());
										this._.editor.fire("panelShow", this);
									},
									0,
									this
								);
							},
							CKEDITOR.env.air ? 200 : 0,
							this
						);
						this.visible = 1;
						this.onShow && this.onShow.call(this);
					},
					reposition: function () {
						var a = this._.showBlockParams;
						this.visible &&
							this._.showBlockParams &&
							(this.hide(), this.showBlock.apply(this, a));
					},
					focus: function () {
						if (CKEDITOR.env.webkit) {
							var a = CKEDITOR.document.getActive();
							a && !a.equals(this._.iframe) && a.$.blur();
						}
						(
							this._.lastFocused || this._.iframe.getFrameDocument().getWindow()
						).focus();
					},
					blur: function () {
						var a = this._.iframe.getFrameDocument().getActive();
						a && a.is("a") && (this._.lastFocused = a);
					},
					hide: function (a) {
						if (
							this.visible &&
							(!this.onHide || !0 !== this.onHide.call(this))
						) {
							this.hideChild();
							CKEDITOR.env.gecko &&
								this._.iframe.getFrameDocument().$.activeElement.blur();
							this.element.setStyle("display", "none");
							this.visible = 0;
							this.element.getFirst().removeCustomData("activePanel");
							if ((a = a && this._.returnFocus))
								CKEDITOR.env.webkit && a.type && a.getWindow().$.focus(),
									a.focus();
							delete this._.lastFocused;
							this._.showBlockParams = null;
							this._.editor.fire("panelHide", this);
						}
					},
					allowBlur: function (a) {
						var c = this._.panel;
						void 0 !== a && (c.allowBlur = a);
						return c.allowBlur;
					},
					showAsChild: function (a, c, g, d, k, h) {
						if (
							this._.activeChild != a ||
							a._.panel._.offsetParentId != g.getId()
						)
							this.hideChild(),
								(a.onHide = CKEDITOR.tools.bind(function () {
									CKEDITOR.tools.setTimeout(
										function () {
											this._.focused || this.hide();
										},
										0,
										this
									);
								}, this)),
								(this._.activeChild = a),
								(this._.focused = !1),
								a.showBlock(c, g, d, k, h),
								this.blur(),
								(CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) &&
									setTimeout(function () {
										a.element.getChild(0).$.style.cssText += "";
									}, 100);
					},
					hideChild: function (a) {
						var c = this._.activeChild;
						c &&
							(delete c.onHide,
							delete this._.activeChild,
							c.hide(),
							a && this.focus());
					},
				},
			});
			CKEDITOR.on("instanceDestroyed", function () {
				var a = CKEDITOR.tools.isEmpty(CKEDITOR.instances),
					c;
				for (c in d) {
					var g = d[c];
					a ? g.destroy() : g.element.hide();
				}
				a && (d = {});
			});
		})(),
		CKEDITOR.plugins.add("menu", {
			requires: "floatpanel",
			beforeInit: function (a) {
				for (
					var d = a.config.menu_groups.split(","),
						b = (a._.menuGroups = {}),
						c = (a._.menuItems = {}),
						g = 0;
					g < d.length;
					g++
				)
					b[d[g]] = g + 1;
				a.addMenuGroup = function (a, c) {
					b[a] = c || 100;
				};
				a.addMenuItem = function (a, g) {
					b[g.group] && (c[a] = new CKEDITOR.menuItem(this, a, g));
				};
				a.addMenuItems = function (a) {
					for (var b in a) this.addMenuItem(b, a[b]);
				};
				a.getMenuItem = function (a) {
					return c[a];
				};
				a.removeMenuItem = function (a) {
					delete c[a];
				};
			},
		}),
		(function () {
			function a(a) {
				a.sort(function (a, b) {
					return a.group < b.group
						? -1
						: a.group > b.group
						? 1
						: a.order < b.order
						? -1
						: a.order > b.order
						? 1
						: 0;
				});
			}
			var d =
				'\x3cspan class\x3d"cke_menuitem"\x3e\x3ca id\x3d"{id}" class\x3d"cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href\x3d"{href}" title\x3d"{title}" tabindex\x3d"-1" _cke_focus\x3d1 hidefocus\x3d"true" role\x3d"{role}" aria-label\x3d"{label}" aria-describedby\x3d"{id}_description" aria-haspopup\x3d"{hasPopup}" aria-disabled\x3d"{disabled}" {ariaChecked} draggable\x3d"false"';
			CKEDITOR.env.gecko &&
				CKEDITOR.env.mac &&
				(d += ' onkeypress\x3d"return false;"');
			CKEDITOR.env.gecko &&
				(d +=
					' onblur\x3d"this.style.cssText \x3d this.style.cssText;" ondragstart\x3d"return false;"');
			var d =
					d +
					(' onmouseover\x3d"CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout\x3d"CKEDITOR.tools.callFunction({moveOutFn},{index});" ' +
						(CKEDITOR.env.ie
							? 'onclick\x3d"return false;" onmouseup'
							: "onclick") +
						'\x3d"CKEDITOR.tools.callFunction({clickFn},{index}); return false;"\x3e'),
				b = CKEDITOR.addTemplate(
					"menuItem",
					d +
						'\x3cspan class\x3d"cke_menubutton_inner"\x3e\x3cspan class\x3d"cke_menubutton_icon"\x3e\x3cspan class\x3d"cke_button_icon cke_button__{iconName}_icon" style\x3d"{iconStyle}"\x3e\x3c/span\x3e\x3c/span\x3e\x3cspan class\x3d"cke_menubutton_label"\x3e{label}\x3c/span\x3e{shortcutHtml}{arrowHtml}\x3c/span\x3e\x3c/a\x3e\x3cspan id\x3d"{id}_description" class\x3d"cke_voice_label" aria-hidden\x3d"false"\x3e{ariaShortcut}\x3c/span\x3e\x3c/span\x3e'
				),
				c = CKEDITOR.addTemplate(
					"menuArrow",
					'\x3cspan class\x3d"cke_menuarrow"\x3e\x3cspan\x3e{label}\x3c/span\x3e\x3c/span\x3e'
				),
				g = CKEDITOR.addTemplate(
					"menuShortcut",
					'\x3cspan class\x3d"cke_menubutton_label cke_menubutton_shortcut"\x3e{shortcut}\x3c/span\x3e'
				);
			CKEDITOR.menu = CKEDITOR.tools.createClass({
				$: function (a, b) {
					b = this._.definition = b || {};
					this.id = CKEDITOR.tools.getNextId();
					this.editor = a;
					this.items = [];
					this._.listeners = [];
					this._.level = b.level || 1;
					var c = CKEDITOR.tools.extend({}, b.panel, {
							css: [CKEDITOR.skin.getPath("editor")],
							level: this._.level - 1,
							block: {},
						}),
						e = (c.block.attributes = c.attributes || {});
					!e.role && (e.role = "menu");
					this._.panelDefinition = c;
				},
				_: {
					onShow: function () {
						var a = this.editor.getSelection(),
							b = a && a.getStartElement(),
							c = this.editor.elementPath(),
							e = this._.listeners;
						this.removeAll();
						for (var g = 0; g < e.length; g++) {
							var f = e[g](b, a, c);
							if (f)
								for (var d in f) {
									var r = this.editor.getMenuItem(d);
									!r ||
										(r.command && !this.editor.getCommand(r.command).state) ||
										((r.state = f[d]), this.add(r));
								}
						}
					},
					onClick: function (a) {
						this.hide();
						if (a.onClick) a.onClick();
						else a.command && this.editor.execCommand(a.command);
					},
					onEscape: function (a) {
						var b = this.parent;
						b ? b._.panel.hideChild(1) : 27 == a && this.hide(1);
						return !1;
					},
					onHide: function () {
						this.onHide && this.onHide();
					},
					showSubMenu: function (a) {
						var b = this._.subMenu,
							c = this.items[a];
						if ((c = c.getItems && c.getItems())) {
							b
								? b.removeAll()
								: ((b = this._.subMenu = new CKEDITOR.menu(
										this.editor,
										CKEDITOR.tools.extend(
											{},
											this._.definition,
											{ level: this._.level + 1 },
											!0
										)
								  )),
								  (b.parent = this),
								  (b._.onClick = CKEDITOR.tools.bind(this._.onClick, this)));
							for (var e in c) {
								var g = this.editor.getMenuItem(e);
								g && ((g.state = c[e]), b.add(g));
							}
							var f = this._.panel
								.getBlock(this.id)
								.element.getDocument()
								.getById(this.id + String(a));
							setTimeout(function () {
								b.show(f, 2);
							}, 0);
						} else this._.panel.hideChild(1);
					},
				},
				proto: {
					add: function (a) {
						a.order || (a.order = this.items.length);
						this.items.push(a);
					},
					removeAll: function () {
						this.items = [];
					},
					show: function (b, c, g, e) {
						if (!this.parent && (this._.onShow(), !this.items.length)) return;
						c = c || ("rtl" == this.editor.lang.dir ? 2 : 1);
						var d = this.items,
							f = this.editor,
							n = this._.panel,
							r = this._.element;
						if (!n) {
							n = this._.panel = new CKEDITOR.ui.floatPanel(
								this.editor,
								CKEDITOR.document.getBody(),
								this._.panelDefinition,
								this._.level
							);
							n.onEscape = CKEDITOR.tools.bind(function (a) {
								if (!1 === this._.onEscape(a)) return !1;
							}, this);
							n.onShow = function () {
								n._.panel
									.getHolderElement()
									.getParent()
									.addClass("cke")
									.addClass("cke_reset_all");
							};
							n.onHide = CKEDITOR.tools.bind(function () {
								this._.onHide && this._.onHide();
							}, this);
							r = n.addBlock(this.id, this._.panelDefinition.block);
							r.autoSize = !0;
							var x = r.keys;
							x[40] = "next";
							x[9] = "next";
							x[38] = "prev";
							x[CKEDITOR.SHIFT + 9] = "prev";
							x["rtl" == f.lang.dir ? 37 : 39] = CKEDITOR.env.ie
								? "mouseup"
								: "click";
							x[32] = CKEDITOR.env.ie ? "mouseup" : "click";
							CKEDITOR.env.ie && (x[13] = "mouseup");
							r = this._.element = r.element;
							x = r.getDocument();
							x.getBody().setStyle("overflow", "hidden");
							x.getElementsByTag("html")
								.getItem(0)
								.setStyle("overflow", "hidden");
							this._.itemOverFn = CKEDITOR.tools.addFunction(function (a) {
								clearTimeout(this._.showSubTimeout);
								this._.showSubTimeout = CKEDITOR.tools.setTimeout(
									this._.showSubMenu,
									f.config.menu_subMenuDelay || 400,
									this,
									[a]
								);
							}, this);
							this._.itemOutFn = CKEDITOR.tools.addFunction(function () {
								clearTimeout(this._.showSubTimeout);
							}, this);
							this._.itemClickFn = CKEDITOR.tools.addFunction(function (a) {
								var b = this.items[a];
								if (b.state == CKEDITOR.TRISTATE_DISABLED) this.hide(1);
								else if (b.getItems) this._.showSubMenu(a);
								else this._.onClick(b);
							}, this);
						}
						a(d);
						for (
							var x = f.elementPath(),
								x = [
									'\x3cdiv class\x3d"cke_menu' +
										(x && x.direction() != f.lang.dir
											? " cke_mixed_dir_content"
											: "") +
										'" role\x3d"presentation"\x3e',
								],
								v = d.length,
								p = v && d[0].group,
								u = 0;
							u < v;
							u++
						) {
							var w = d[u];
							p != w.group &&
								(x.push(
									'\x3cdiv class\x3d"cke_menuseparator" role\x3d"separator"\x3e\x3c/div\x3e'
								),
								(p = w.group));
							w.render(this, u, x);
						}
						x.push("\x3c/div\x3e");
						r.setHtml(x.join(""));
						CKEDITOR.ui.fire("ready", this);
						this.parent
							? this.parent._.panel.showAsChild(n, this.id, b, c, g, e)
							: n.showBlock(this.id, b, c, g, e);
						f.fire("menuShow", [n]);
					},
					addListener: function (a) {
						this._.listeners.push(a);
					},
					hide: function (a) {
						this._.onHide && this._.onHide();
						this._.panel && this._.panel.hide(a);
					},
					findItemByCommandName: function (a) {
						var b = CKEDITOR.tools.array.filter(this.items, function (b) {
							return a === b.command;
						});
						return b.length
							? ((b = b[0]),
							  { item: b, element: this._.element.findOne("." + b.className) })
							: null;
					},
				},
			});
			CKEDITOR.menuItem = CKEDITOR.tools.createClass({
				$: function (a, b, c) {
					CKEDITOR.tools.extend(this, c, {
						order: 0,
						className: "cke_menubutton__" + b,
					});
					this.group = a._.menuGroups[this.group];
					this.editor = a;
					this.name = b;
				},
				proto: {
					render: function (a, d, h) {
						var e = a.id + String(d),
							m =
								"undefined" == typeof this.state
									? CKEDITOR.TRISTATE_OFF
									: this.state,
							f = "",
							n = this.editor,
							r,
							x,
							v =
								m == CKEDITOR.TRISTATE_ON
									? "on"
									: m == CKEDITOR.TRISTATE_DISABLED
									? "disabled"
									: "off";
						this.role in { menuitemcheckbox: 1, menuitemradio: 1 } &&
							(f =
								' aria-checked\x3d"' +
								(m == CKEDITOR.TRISTATE_ON ? "true" : "false") +
								'"');
						var p = this.getItems,
							u =
								"\x26#" +
								("rtl" == this.editor.lang.dir ? "9668" : "9658") +
								";",
							w = this.name;
						this.icon && !/\./.test(this.icon) && (w = this.icon);
						this.command &&
							((r = n.getCommand(this.command)),
							(r = n.getCommandKeystroke(r)) &&
								(x = CKEDITOR.tools.keystrokeToString(
									n.lang.common.keyboard,
									r
								)));
						a = {
							id: e,
							name: this.name,
							iconName: w,
							label: this.label,
							cls: this.className || "",
							state: v,
							hasPopup: p ? "true" : "false",
							disabled: m == CKEDITOR.TRISTATE_DISABLED,
							title: this.label + (x ? " (" + x.display + ")" : ""),
							ariaShortcut: x
								? n.lang.common.keyboardShortcut + " " + x.aria
								: "",
							href:
								"javascript:void('" + (this.label || "").replace("'") + "')",
							hoverFn: a._.itemOverFn,
							moveOutFn: a._.itemOutFn,
							clickFn: a._.itemClickFn,
							index: d,
							iconStyle: CKEDITOR.skin.getIconStyle(
								w,
								"rtl" == this.editor.lang.dir,
								w == this.icon ? null : this.icon,
								this.iconOffset
							),
							shortcutHtml: x ? g.output({ shortcut: x.display }) : "",
							arrowHtml: p ? c.output({ label: u }) : "",
							role: this.role ? this.role : "menuitem",
							ariaChecked: f,
						};
						b.output(a, h);
					},
				},
			});
		})(),
		(CKEDITOR.config.menu_groups =
			"clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div"),
		CKEDITOR.plugins.add("contextmenu", {
			requires: "menu",
			onLoad: function () {
				CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({
					base: CKEDITOR.menu,
					$: function (a) {
						this.base.call(this, a, {
							panel: {
								css: a.config.contextmenu_contentsCss,
								className: "cke_menu_panel",
								attributes: { "aria-label": a.lang.contextmenu.options },
							},
						});
					},
					proto: {
						addTarget: function (a, d) {
							function b() {
								g = !1;
							}
							var c, g;
							a.on(
								"contextmenu",
								function (a) {
									a = a.data;
									var b = CKEDITOR.env.webkit
										? c
										: CKEDITOR.env.mac
										? a.$.metaKey
										: a.$.ctrlKey;
									if (!d || !b)
										if ((a.preventDefault(), !g)) {
											if (CKEDITOR.env.mac && CKEDITOR.env.webkit) {
												var b = this.editor,
													e = new CKEDITOR.dom.elementPath(
														a.getTarget(),
														b.editable()
													).contains(function (a) {
														return a.hasAttribute("contenteditable");
													}, !0);
												e &&
													"false" == e.getAttribute("contenteditable") &&
													b.getSelection().fake(e);
											}
											var e = a.getTarget().getDocument(),
												m = a.getTarget().getDocument().getDocumentElement(),
												b = !e.equals(CKEDITOR.document),
												e = e.getWindow().getScrollPosition(),
												f = b ? a.$.clientX : a.$.pageX || e.x + a.$.clientX,
												l = b ? a.$.clientY : a.$.pageY || e.y + a.$.clientY;
											CKEDITOR.tools.setTimeout(
												function () {
													this.open(m, null, f, l);
												},
												CKEDITOR.env.ie ? 200 : 0,
												this
											);
										}
								},
								this
							);
							if (CKEDITOR.env.webkit) {
								var l = function () {
									c = 0;
								};
								a.on("keydown", function (a) {
									c = CKEDITOR.env.mac ? a.data.$.metaKey : a.data.$.ctrlKey;
								});
								a.on("keyup", l);
								a.on("contextmenu", l);
							}
							CKEDITOR.env.gecko &&
								!CKEDITOR.env.mac &&
								(a.on(
									"keydown",
									function (a) {
										a.data.$.shiftKey && 121 === a.data.$.keyCode && (g = !0);
									},
									null,
									null,
									0
								),
								a.on("keyup", b),
								a.on("contextmenu", b));
						},
						open: function (a, d, b, c) {
							!1 !== this.editor.config.enableContextMenu &&
								this.editor.getSelection().getType() !==
									CKEDITOR.SELECTION_NONE &&
								(this.editor.focus(),
								(a = a || CKEDITOR.document.getDocumentElement()),
								this.editor.selectionChange(1),
								this.show(a, d, b, c));
						},
					},
				});
			},
			beforeInit: function (a) {
				var d = (a.contextMenu = new CKEDITOR.plugins.contextMenu(a));
				a.on("contentDom", function () {
					d.addTarget(a.editable(), !1 !== a.config.browserContextMenuOnCtrl);
				});
				a.addCommand("contextMenu", {
					exec: function (a) {
						var c = 0,
							g = 0,
							d = a.getSelection().getRanges(),
							d = d[d.length - 1].getClientRects(a.editable().isInline());
						if ((d = d[d.length - 1]))
							(c = d["rtl" === a.lang.dir ? "left" : "right"]), (g = d.bottom);
						a.contextMenu.open(a.document.getBody().getParent(), null, c, g);
					},
				});
				a.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
				a.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu");
			},
		}),
		(function () {
			function a(a, b) {
				function k(b) {
					b = f.list[b];
					var c;
					b.equals(a.editable()) || "true" == b.getAttribute("contenteditable")
						? ((c = a.createRange()), c.selectNodeContents(b), (c = c.select()))
						: ((c = a.getSelection()), c.selectElement(b));
					CKEDITOR.env.ie &&
						a.fire("selectionChange", {
							selection: c,
							path: new CKEDITOR.dom.elementPath(b),
						});
					a.focus();
				}
				function h() {
					m &&
						m.setHtml(
							'\x3cspan class\x3d"cke_path_empty"\x3e\x26nbsp;\x3c/span\x3e'
						);
					delete f.list;
				}
				var e = a.ui.spaceId("path"),
					m,
					f = a._.elementsPath,
					n = f.idBase;
				b.html +=
					'\x3cspan id\x3d"' +
					e +
					'_label" class\x3d"cke_voice_label"\x3e' +
					a.lang.elementspath.eleLabel +
					'\x3c/span\x3e\x3cspan id\x3d"' +
					e +
					'" class\x3d"cke_path" role\x3d"group" aria-labelledby\x3d"' +
					e +
					'_label"\x3e\x3cspan class\x3d"cke_path_empty"\x3e\x26nbsp;\x3c/span\x3e\x3c/span\x3e';
				a.on("uiReady", function () {
					var b = a.ui.space("path");
					b && a.focusManager.add(b, 1);
				});
				f.onClick = k;
				var r = CKEDITOR.tools.addFunction(k),
					x = CKEDITOR.tools.addFunction(function (b, c) {
						var e = f.idBase,
							d;
						c = new CKEDITOR.dom.event(c);
						d = "rtl" == a.lang.dir;
						switch (c.getKeystroke()) {
							case d ? 39 : 37:
							case 9:
								return (
									(d = CKEDITOR.document.getById(e + (b + 1))) ||
										(d = CKEDITOR.document.getById(e + "0")),
									d.focus(),
									!1
								);
							case d ? 37 : 39:
							case CKEDITOR.SHIFT + 9:
								return (
									(d = CKEDITOR.document.getById(e + (b - 1))) ||
										(d = CKEDITOR.document.getById(e + (f.list.length - 1))),
									d.focus(),
									!1
								);
							case 27:
								return a.focus(), !1;
							case 13:
							case 32:
								return k(b), !1;
						}
						return !0;
					});
				a.on("selectionChange", function (b) {
					for (
						var d = [],
							h = (f.list = []),
							k = [],
							l = f.filters,
							z = !0,
							t = b.data.path.elements,
							y = t.length;
						y--;

					) {
						var C = t[y],
							B = 0;
						b = C.data("cke-display-name")
							? C.data("cke-display-name")
							: C.data("cke-real-element-type")
							? C.data("cke-real-element-type")
							: C.getName();
						(z = C.hasAttribute("contenteditable")
							? "true" == C.getAttribute("contenteditable")
							: z) ||
							C.hasAttribute("contenteditable") ||
							(B = 1);
						for (var A = 0; A < l.length; A++) {
							var H = l[A](C, b);
							if (!1 === H) {
								B = 1;
								break;
							}
							b = H || b;
						}
						B || (h.unshift(C), k.unshift(b));
					}
					h = h.length;
					for (l = 0; l < h; l++)
						(b = k[l]),
							(z = a.lang.elementspath.eleTitle.replace(/%1/, b)),
							(b = c.output({
								id: n + l,
								label: z,
								text: b,
								jsTitle: "javascript:void('" + b + "')",
								index: l,
								keyDownFn: x,
								clickFn: r,
							})),
							d.unshift(b);
					m || (m = CKEDITOR.document.getById(e));
					k = m;
					k.setHtml(
						d.join("") +
							'\x3cspan class\x3d"cke_path_empty"\x3e\x26nbsp;\x3c/span\x3e'
					);
					a.fire("elementsPathUpdate", { space: k });
				});
				a.on("readOnly", h);
				a.on("contentDomUnload", h);
				a.addCommand("elementsPathFocus", d.toolbarFocus);
				a.setKeystroke(CKEDITOR.ALT + 122, "elementsPathFocus");
			}
			var d = {
					toolbarFocus: {
						editorFocus: !1,
						readOnly: 1,
						exec: function (a) {
							(a = CKEDITOR.document.getById(a._.elementsPath.idBase + "0")) &&
								a.focus(CKEDITOR.env.ie || CKEDITOR.env.air);
						},
					},
				},
				b = "";
			CKEDITOR.env.gecko &&
				CKEDITOR.env.mac &&
				(b += ' onkeypress\x3d"return false;"');
			CKEDITOR.env.gecko &&
				(b += ' onblur\x3d"this.style.cssText \x3d this.style.cssText;"');
			var c = CKEDITOR.addTemplate(
				"pathItem",
				'\x3ca id\x3d"{id}" href\x3d"{jsTitle}" tabindex\x3d"-1" class\x3d"cke_path_item" title\x3d"{label}"' +
					b +
					' hidefocus\x3d"true"  onkeydown\x3d"return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick\x3d"CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role\x3d"button" aria-label\x3d"{label}"\x3e{text}\x3c/a\x3e'
			);
			CKEDITOR.plugins.add("elementspath", {
				init: function (b) {
					b._.elementsPath = {
						idBase: "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_",
						filters: [],
					};
					b.on("uiSpace", function (c) {
						"bottom" == c.data.space && a(b, c.data);
					});
				},
			});
		})(),
		(function () {
			function a(a, g) {
				var l, k;
				g.on(
					"refresh",
					function (a) {
						var c = [d],
							g;
						for (g in a.data.states) c.push(a.data.states[g]);
						this.setState(CKEDITOR.tools.search(c, b) ? b : d);
					},
					g,
					null,
					100
				);
				g.on(
					"exec",
					function (b) {
						l = a.getSelection();
						k = l.createBookmarks(1);
						b.data || (b.data = {});
						b.data.done = !1;
					},
					g,
					null,
					0
				);
				g.on(
					"exec",
					function () {
						a.forceNextSelectionCheck();
						l.selectBookmarks(k);
					},
					g,
					null,
					100
				);
			}
			var d = CKEDITOR.TRISTATE_DISABLED,
				b = CKEDITOR.TRISTATE_OFF;
			CKEDITOR.plugins.add("indent", {
				init: function (b) {
					var d = CKEDITOR.plugins.indent.genericDefinition;
					a(b, b.addCommand("indent", new d(!0)));
					a(b, b.addCommand("outdent", new d()));
					b.ui.addButton &&
						(b.ui.addButton("Indent", {
							label: b.lang.indent.indent,
							command: "indent",
							directional: !0,
							toolbar: "indent,20",
						}),
						b.ui.addButton("Outdent", {
							label: b.lang.indent.outdent,
							command: "outdent",
							directional: !0,
							toolbar: "indent,10",
						}));
					b.on("dirChanged", function (a) {
						var d = b.createRange(),
							g = a.data.node;
						d.setStartBefore(g);
						d.setEndAfter(g);
						for (var e = new CKEDITOR.dom.walker(d), m; (m = e.next()); )
							if (m.type == CKEDITOR.NODE_ELEMENT)
								if (!m.equals(g) && m.getDirection())
									d.setStartAfter(m), (e = new CKEDITOR.dom.walker(d));
								else {
									var f = b.config.indentClasses;
									if (f)
										for (
											var n = "ltr" == a.data.dir ? ["_rtl", ""] : ["", "_rtl"],
												r = 0;
											r < f.length;
											r++
										)
											m.hasClass(f[r] + n[0]) &&
												(m.removeClass(f[r] + n[0]), m.addClass(f[r] + n[1]));
									f = m.getStyle("margin-right");
									n = m.getStyle("margin-left");
									f
										? m.setStyle("margin-left", f)
										: m.removeStyle("margin-left");
									n
										? m.setStyle("margin-right", n)
										: m.removeStyle("margin-right");
								}
					});
				},
			});
			CKEDITOR.plugins.indent = {
				genericDefinition: function (a) {
					this.isIndent = !!a;
					this.startDisabled = !this.isIndent;
				},
				specificDefinition: function (a, b, d) {
					this.name = b;
					this.editor = a;
					this.jobs = {};
					this.enterBr = a.config.enterMode == CKEDITOR.ENTER_BR;
					this.isIndent = !!d;
					this.relatedGlobal = d ? "indent" : "outdent";
					this.indentKey = d ? 9 : CKEDITOR.SHIFT + 9;
					this.database = {};
				},
				registerCommands: function (a, b) {
					a.on("pluginsLoaded", function () {
						for (var a in b)
							(function (a, b) {
								var c = a.getCommand(b.relatedGlobal),
									d;
								for (d in b.jobs)
									c.on(
										"exec",
										function (c) {
											c.data.done ||
												(a.fire("lockSnapshot"),
												b.execJob(a, d) && (c.data.done = !0),
												a.fire("unlockSnapshot"),
												CKEDITOR.dom.element.clearAllMarkers(b.database));
										},
										this,
										null,
										d
									),
										c.on(
											"refresh",
											function (c) {
												c.data.states || (c.data.states = {});
												c.data.states[b.name + "@" + d] = b.refreshJob(
													a,
													d,
													c.data.path
												);
											},
											this,
											null,
											d
										);
								a.addFeature(b);
							})(this, b[a]);
					});
				},
			};
			CKEDITOR.plugins.indent.genericDefinition.prototype = {
				context: "p",
				exec: function () {},
			};
			CKEDITOR.plugins.indent.specificDefinition.prototype = {
				execJob: function (a, b) {
					var l = this.jobs[b];
					if (l.state != d) return l.exec.call(this, a);
				},
				refreshJob: function (a, b, l) {
					b = this.jobs[b];
					a.activeFilter.checkFeature(this)
						? (b.state = b.refresh.call(this, a, l))
						: (b.state = d);
					return b.state;
				},
				getContext: function (a) {
					return a.contains(this.context);
				},
			};
		})(),
		(function () {
			function a(a) {
				function c(e) {
					for (
						var d = l.startContainer, q = l.endContainer;
						d && !d.getParent().equals(e);

					)
						d = d.getParent();
					for (; q && !q.getParent().equals(e); ) q = q.getParent();
					if (!d || !q) return !1;
					for (var z = [], t = !1; !t; )
						d.equals(q) && (t = !0), z.push(d), (d = d.getNext());
					if (1 > z.length) return !1;
					d = e.getParents(!0);
					for (q = 0; q < d.length; q++)
						if (d[q].getName && k[d[q].getName()]) {
							e = d[q];
							break;
						}
					for (
						var d = g.isIndent ? 1 : -1,
							q = z[0],
							z = z[z.length - 1],
							t = CKEDITOR.plugins.list.listToArray(e, f),
							y = t[z.getCustomData("listarray_index")].indent,
							q = q.getCustomData("listarray_index");
						q <= z.getCustomData("listarray_index");
						q++
					)
						if (((t[q].indent += d), 0 < d)) {
							for (var C = t[q].parent, B = q - 1; 0 <= B; B--)
								if (t[B].indent === d) {
									C = t[B].parent;
									break;
								}
							t[q].parent = new CKEDITOR.dom.element(
								C.getName(),
								C.getDocument()
							);
						}
					for (
						q = z.getCustomData("listarray_index") + 1;
						q < t.length && t[q].indent > y;
						q++
					)
						t[q].indent += d;
					d = CKEDITOR.plugins.list.arrayToList(
						t,
						f,
						null,
						a.config.enterMode,
						e.getDirection()
					);
					if (!g.isIndent) {
						var A;
						if ((A = e.getParent()) && A.is("li"))
							for (
								var z = d.listNode.getChildren(), v = [], x, q = z.count() - 1;
								0 <= q;
								q--
							)
								(x = z.getItem(q)) && x.is && x.is("li") && v.push(x);
					}
					d && d.listNode.replace(e);
					if (v && v.length)
						for (q = 0; q < v.length; q++) {
							for (
								x = e = v[q];
								(x = x.getNext()) && x.is && x.getName() in k;

							)
								CKEDITOR.env.needsNbspFiller &&
									!e.getFirst(b) &&
									e.append(l.document.createText(" ")),
									e.append(x);
							e.insertAfter(A);
						}
					d && a.fire("contentDomInvalidated");
					return !0;
				}
				for (
					var g = this,
						f = this.database,
						k = this.context,
						l,
						x = a.getSelection(),
						x = (x && x.getRanges()).createIterator();
					(l = x.getNextRange());

				) {
					for (
						var v = l.getCommonAncestor();
						v && (v.type != CKEDITOR.NODE_ELEMENT || !k[v.getName()]);

					) {
						if (a.editable().equals(v)) {
							v = !1;
							break;
						}
						v = v.getParent();
					}
					v ||
						((v = l.startPath().contains(k)) &&
							l.setEndAt(v, CKEDITOR.POSITION_BEFORE_END));
					if (!v) {
						var p = l.getEnclosedNode();
						p &&
							p.type == CKEDITOR.NODE_ELEMENT &&
							p.getName() in k &&
							(l.setStartAt(p, CKEDITOR.POSITION_AFTER_START),
							l.setEndAt(p, CKEDITOR.POSITION_BEFORE_END),
							(v = p));
					}
					v &&
						l.startContainer.type == CKEDITOR.NODE_ELEMENT &&
						l.startContainer.getName() in k &&
						((p = new CKEDITOR.dom.walker(l)),
						(p.evaluator = d),
						(l.startContainer = p.next()));
					v &&
						l.endContainer.type == CKEDITOR.NODE_ELEMENT &&
						l.endContainer.getName() in k &&
						((p = new CKEDITOR.dom.walker(l)),
						(p.evaluator = d),
						(l.endContainer = p.previous()));
					if (v) return c(v);
				}
				return 0;
			}
			function d(a) {
				return a.type == CKEDITOR.NODE_ELEMENT && a.is("li");
			}
			function b(a) {
				return c(a) && g(a);
			}
			var c = CKEDITOR.dom.walker.whitespaces(!0),
				g = CKEDITOR.dom.walker.bookmark(!1, !0),
				l = CKEDITOR.TRISTATE_DISABLED,
				k = CKEDITOR.TRISTATE_OFF;
			CKEDITOR.plugins.add("indentlist", {
				requires: "indent",
				init: function (b) {
					function c(b) {
						d.specificDefinition.apply(this, arguments);
						this.requiredContent = ["ul", "ol"];
						b.on(
							"key",
							function (a) {
								var c = b.elementPath();
								if (
									"wysiwyg" == b.mode &&
									a.data.keyCode == this.indentKey &&
									c
								) {
									var e = this.getContext(c);
									!e ||
										(this.isIndent &&
											CKEDITOR.plugins.indentList.firstItemInPath(
												this.context,
												c,
												e
											)) ||
										(b.execCommand(this.relatedGlobal), a.cancel());
								}
							},
							this
						);
						this.jobs[this.isIndent ? 10 : 30] = {
							refresh: this.isIndent
								? function (a, b) {
										var c = this.getContext(b),
											e = CKEDITOR.plugins.indentList.firstItemInPath(
												this.context,
												b,
												c
											);
										return c && this.isIndent && !e ? k : l;
								  }
								: function (a, b) {
										return !this.getContext(b) || this.isIndent ? l : k;
								  },
							exec: CKEDITOR.tools.bind(a, this),
						};
					}
					var d = CKEDITOR.plugins.indent;
					d.registerCommands(b, {
						indentlist: new c(b, "indentlist", !0),
						outdentlist: new c(b, "outdentlist"),
					});
					CKEDITOR.tools.extend(c.prototype, d.specificDefinition.prototype, {
						context: { ol: 1, ul: 1 },
					});
				},
			});
			CKEDITOR.plugins.indentList = {};
			CKEDITOR.plugins.indentList.firstItemInPath = function (a, b, c) {
				var f = b.contains(d);
				c || (c = b.contains(a));
				return c && f && f.equals(c.getFirst(d));
			};
		})(),
		(function () {
			function a(a, b, c, e) {
				for (
					var f = CKEDITOR.plugins.list.listToArray(b.root, c), d = [], g = 0;
					g < b.contents.length;
					g++
				) {
					var h = b.contents[g];
					(h = h.getAscendant("li", !0)) &&
						!h.getCustomData("list_item_processed") &&
						(d.push(h),
						CKEDITOR.dom.element.setMarker(c, h, "list_item_processed", !0));
				}
				for (var h = b.root.getDocument(), k, m, g = 0; g < d.length; g++) {
					var l = d[g].getCustomData("listarray_index");
					k = f[l].parent;
					k.is(this.type) ||
						((m = h.createElement(this.type)),
						k.copyAttributes(m, { start: 1, type: 1 }),
						m.removeStyle("list-style-type"),
						(f[l].parent = m));
				}
				c = CKEDITOR.plugins.list.arrayToList(f, c, null, a.config.enterMode);
				for (
					var n, f = c.listNode.getChildCount(), g = 0;
					g < f && (n = c.listNode.getChild(g));
					g++
				)
					n.getName() == this.type && e.push(n);
				c.listNode.replace(b.root);
				a.fire("contentDomInvalidated");
			}
			function d(a, b, c) {
				var e = b.contents,
					f = b.root.getDocument(),
					d = [];
				if (1 == e.length && e[0].equals(b.root)) {
					var g = f.createElement("div");
					e[0].moveChildren && e[0].moveChildren(g);
					e[0].append(g);
					e[0] = g;
				}
				b = b.contents[0].getParent();
				for (g = 0; g < e.length; g++)
					b = b.getCommonAncestor(e[g].getParent());
				a = a.config.useComputedState;
				var h, k;
				a = void 0 === a || a;
				for (g = 0; g < e.length; g++)
					for (var m = e[g], l; (l = m.getParent()); ) {
						if (l.equals(b)) {
							d.push(m);
							!k && m.getDirection() && (k = 1);
							m = m.getDirection(a);
							null !== h && (h = h && h != m ? null : m);
							break;
						}
						m = l;
					}
				if (!(1 > d.length)) {
					e = d[d.length - 1].getNext();
					g = f.createElement(this.type);
					for (c.push(g); d.length; )
						(c = d.shift()),
							(a = f.createElement("li")),
							(m = c),
							m.is("pre") ||
							v.test(m.getName()) ||
							"false" == m.getAttribute("contenteditable")
								? c.appendTo(a)
								: (c.copyAttributes(a),
								  h &&
										c.getDirection() &&
										(a.removeStyle("direction"), a.removeAttribute("dir")),
								  c.moveChildren(a),
								  c.remove()),
							a.appendTo(g);
					h && k && g.setAttribute("dir", h);
					e ? g.insertBefore(e) : g.appendTo(b);
				}
			}
			function b(a, b, c) {
				function e(c) {
					if (
						!(
							!(m = k[c ? "getFirst" : "getLast"]()) ||
							(m.is && m.isBlockBoundary()) ||
							!(l = b.root[c ? "getPrevious" : "getNext"](
								CKEDITOR.dom.walker.invisible(!0)
							)) ||
							(l.is && l.isBlockBoundary({ br: 1 }))
						)
					)
						a.document
							.createElement("br")
							[c ? "insertBefore" : "insertAfter"](m);
				}
				for (
					var f = CKEDITOR.plugins.list.listToArray(b.root, c), d = [], g = 0;
					g < b.contents.length;
					g++
				) {
					var h = b.contents[g];
					(h = h.getAscendant("li", !0)) &&
						!h.getCustomData("list_item_processed") &&
						(d.push(h),
						CKEDITOR.dom.element.setMarker(c, h, "list_item_processed", !0));
				}
				h = null;
				for (g = 0; g < d.length; g++)
					(h = d[g].getCustomData("listarray_index")), (f[h].indent = -1);
				for (g = h + 1; g < f.length; g++)
					if (f[g].indent > f[g - 1].indent + 1) {
						d = f[g - 1].indent + 1 - f[g].indent;
						for (h = f[g].indent; f[g] && f[g].indent >= h; )
							(f[g].indent += d), g++;
						g--;
					}
				var k = CKEDITOR.plugins.list.arrayToList(
						f,
						c,
						null,
						a.config.enterMode,
						b.root.getAttribute("dir")
					).listNode,
					m,
					l;
				e(!0);
				e();
				k.replace(b.root);
				a.fire("contentDomInvalidated");
			}
			function c(a, b) {
				this.name = a;
				this.context = this.type = b;
				this.allowedContent = b + " li";
				this.requiredContent = b;
			}
			function g(a, b, c, e) {
				for (var f, d; (f = a[e ? "getLast" : "getFirst"](p)); )
					(d = f.getDirection(1)) !== b.getDirection(1) &&
						f.setAttribute("dir", d),
						f.remove(),
						c ? f[e ? "insertBefore" : "insertAfter"](c) : b.append(f, e);
			}
			function l(a) {
				function b(c) {
					var e = a[c ? "getPrevious" : "getNext"](r);
					e &&
						e.type == CKEDITOR.NODE_ELEMENT &&
						e.is(a.getName()) &&
						(g(a, e, null, !c), a.remove(), (a = e));
				}
				b();
				b(1);
			}
			function k(a) {
				return (
					a.type == CKEDITOR.NODE_ELEMENT &&
					(a.getName() in CKEDITOR.dtd.$block ||
						a.getName() in CKEDITOR.dtd.$listItem) &&
					CKEDITOR.dtd[a.getName()]["#"]
				);
			}
			function h(a, b, c) {
				a.fire("saveSnapshot");
				c.enlarge(CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS);
				var f = c.extractContents();
				b.trim(!1, !0);
				var d = b.createBookmark(),
					h = new CKEDITOR.dom.elementPath(b.startContainer),
					k = h.block,
					h = h.lastElement.getAscendant("li", 1) || k,
					m = new CKEDITOR.dom.elementPath(c.startContainer),
					n = m.contains(CKEDITOR.dtd.$listItem),
					m = m.contains(CKEDITOR.dtd.$list);
				k
					? (k = k.getBogus()) && k.remove()
					: m && (k = m.getPrevious(r)) && x(k) && k.remove();
				(k = f.getLast()) &&
					k.type == CKEDITOR.NODE_ELEMENT &&
					k.is("br") &&
					k.remove();
				(k = b.startContainer.getChild(b.startOffset))
					? f.insertBefore(k)
					: b.startContainer.append(f);
				n &&
					(f = e(n)) &&
					(h.contains(n) ? (g(f, n.getParent(), n), f.remove()) : h.append(f));
				for (; c.checkStartOfBlock() && c.checkEndOfBlock(); ) {
					m = c.startPath();
					f = m.block;
					if (!f) break;
					f.is("li") &&
						((h = f.getParent()),
						f.equals(h.getLast(r)) && f.equals(h.getFirst(r)) && (f = h));
					c.moveToPosition(f, CKEDITOR.POSITION_BEFORE_START);
					f.remove();
				}
				c = c.clone();
				f = a.editable();
				c.setEndAt(f, CKEDITOR.POSITION_BEFORE_END);
				c = new CKEDITOR.dom.walker(c);
				c.evaluator = function (a) {
					return r(a) && !x(a);
				};
				(c = c.next()) &&
					c.type == CKEDITOR.NODE_ELEMENT &&
					c.getName() in CKEDITOR.dtd.$list &&
					l(c);
				b.moveToBookmark(d);
				b.select();
				a.fire("saveSnapshot");
			}
			function e(a) {
				return (a = a.getLast(r)) &&
					a.type == CKEDITOR.NODE_ELEMENT &&
					a.getName() in m
					? a
					: null;
			}
			var m = { ol: 1, ul: 1 },
				f = CKEDITOR.dom.walker.whitespaces(),
				n = CKEDITOR.dom.walker.bookmark(),
				r = function (a) {
					return !(f(a) || n(a));
				},
				x = CKEDITOR.dom.walker.bogus();
			CKEDITOR.plugins.list = {
				listToArray: function (a, b, c, e, f) {
					if (!m[a.getName()]) return [];
					e || (e = 0);
					c || (c = []);
					for (var d = 0, g = a.getChildCount(); d < g; d++) {
						var h = a.getChild(d);
						h.type == CKEDITOR.NODE_ELEMENT &&
							h.getName() in CKEDITOR.dtd.$list &&
							CKEDITOR.plugins.list.listToArray(h, b, c, e + 1);
						if ("li" == h.$.nodeName.toLowerCase()) {
							var k = { parent: a, indent: e, element: h, contents: [] };
							f
								? (k.grandparent = f)
								: ((k.grandparent = a.getParent()),
								  k.grandparent &&
										"li" == k.grandparent.$.nodeName.toLowerCase() &&
										(k.grandparent = k.grandparent.getParent()));
							b &&
								CKEDITOR.dom.element.setMarker(
									b,
									h,
									"listarray_index",
									c.length
								);
							c.push(k);
							for (var l = 0, n = h.getChildCount(), r; l < n; l++)
								(r = h.getChild(l)),
									r.type == CKEDITOR.NODE_ELEMENT && m[r.getName()]
										? CKEDITOR.plugins.list.listToArray(
												r,
												b,
												c,
												e + 1,
												k.grandparent
										  )
										: k.contents.push(r);
						}
					}
					return c;
				},
				arrayToList: function (a, b, c, e, f) {
					c || (c = 0);
					if (!a || a.length < c + 1) return null;
					for (
						var d,
							g = a[c].parent.getDocument(),
							h = new CKEDITOR.dom.documentFragment(g),
							k = null,
							l = c,
							v = Math.max(a[c].indent, 0),
							x = null,
							p,
							F,
							L = e == CKEDITOR.ENTER_P ? "p" : "div";
						;

					) {
						var I = a[l];
						d = I.grandparent;
						p = I.element.getDirection(1);
						if (I.indent == v) {
							(k && a[l].parent.getName() == k.getName()) ||
								((k = a[l].parent.clone(!1, 1)),
								f && k.setAttribute("dir", f),
								h.append(k));
							x = k.append(I.element.clone(0, 1));
							p != k.getDirection(1) && x.setAttribute("dir", p);
							for (d = 0; d < I.contents.length; d++)
								x.append(I.contents[d].clone(1, 1));
							l++;
						} else if (I.indent == Math.max(v, 0) + 1)
							(I = a[l - 1].element.getDirection(1)),
								(l = CKEDITOR.plugins.list.arrayToList(
									a,
									null,
									l,
									e,
									I != p ? p : null
								)),
								!x.getChildCount() &&
									CKEDITOR.env.needsNbspFiller &&
									7 >= g.$.documentMode &&
									x.append(g.createText(" ")),
								x.append(l.listNode),
								(l = l.nextIndex);
						else if (-1 == I.indent && !c && d) {
							m[d.getName()]
								? ((x = I.element.clone(!1, !0)),
								  p != d.getDirection(1) && x.setAttribute("dir", p))
								: (x = new CKEDITOR.dom.documentFragment(g));
							var k = d.getDirection(1) != p,
								D = I.element,
								Q = D.getAttribute("class"),
								T = D.getAttribute("style"),
								R =
									x.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT &&
									(e != CKEDITOR.ENTER_BR || k || T || Q),
								K,
								W = I.contents.length,
								V;
							for (d = 0; d < W; d++)
								if (((K = I.contents[d]), n(K) && 1 < W))
									R ? (V = K.clone(1, 1)) : x.append(K.clone(1, 1));
								else if (
									K.type == CKEDITOR.NODE_ELEMENT &&
									K.isBlockBoundary()
								) {
									k && !K.getDirection() && K.setAttribute("dir", p);
									F = K;
									var X = D.getAttribute("style");
									X &&
										F.setAttribute(
											"style",
											X.replace(/([^;])$/, "$1;") +
												(F.getAttribute("style") || "")
										);
									Q && K.addClass(Q);
									F = null;
									V && (x.append(V), (V = null));
									x.append(K.clone(1, 1));
								} else
									R
										? (F ||
												((F = g.createElement(L)),
												x.append(F),
												k && F.setAttribute("dir", p)),
										  T && F.setAttribute("style", T),
										  Q && F.setAttribute("class", Q),
										  V && (F.append(V), (V = null)),
										  F.append(K.clone(1, 1)))
										: x.append(K.clone(1, 1));
							V && ((F || x).append(V), (V = null));
							x.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT &&
								l != a.length - 1 &&
								(CKEDITOR.env.needsBrFiller &&
									(p = x.getLast()) &&
									p.type == CKEDITOR.NODE_ELEMENT &&
									p.is("br") &&
									p.remove(),
								((p = x.getLast(r)) &&
									p.type == CKEDITOR.NODE_ELEMENT &&
									p.is(CKEDITOR.dtd.$block)) ||
									x.append(g.createElement("br")));
							p = x.$.nodeName.toLowerCase();
							("div" != p && "p" != p) || x.appendBogus();
							h.append(x);
							k = null;
							l++;
						} else return null;
						F = null;
						if (a.length <= l || Math.max(a[l].indent, 0) < v) break;
					}
					if (b)
						for (a = h.getFirst(); a; ) {
							if (
								a.type == CKEDITOR.NODE_ELEMENT &&
								(CKEDITOR.dom.element.clearMarkers(b, a),
								a.getName() in CKEDITOR.dtd.$listItem &&
									((c = a), (g = f = e = void 0), (e = c.getDirection())))
							) {
								for (f = c.getParent(); f && !(g = f.getDirection()); )
									f = f.getParent();
								e == g && c.removeAttribute("dir");
							}
							a = a.getNextSourceNode();
						}
					return { listNode: h, nextIndex: l };
				},
			};
			var v = /^h[1-6]$/,
				p = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT);
			c.prototype = {
				exec: function (c) {
					function e(a) {
						return m[a.root.getName()] && !f(a.root, [CKEDITOR.NODE_COMMENT]);
					}
					function f(a, b) {
						return CKEDITOR.tools.array.filter(
							a.getChildren().toArray(),
							function (a) {
								return -1 === CKEDITOR.tools.array.indexOf(b, a.type);
							}
						).length;
					}
					function g(a) {
						var b = !0;
						if (0 === a.getChildCount()) return !1;
						a.forEach(
							function (a) {
								if (a.type !== CKEDITOR.NODE_COMMENT) return (b = !1);
							},
							null,
							!0
						);
						return b;
					}
					this.refresh(c, c.elementPath());
					var h = c.config,
						k = c.getSelection(),
						n = k && k.getRanges();
					if (this.state == CKEDITOR.TRISTATE_OFF) {
						var B = c.editable();
						if (B.getFirst(r)) {
							var A = 1 == n.length && n[0];
							(h = A && A.getEnclosedNode()) &&
								h.is &&
								this.type == h.getName() &&
								this.setState(CKEDITOR.TRISTATE_ON);
						} else
							h.enterMode == CKEDITOR.ENTER_BR
								? B.appendBogus()
								: n[0].fixBlock(
										1,
										h.enterMode == CKEDITOR.ENTER_P ? "p" : "div"
								  ),
								k.selectRanges(n);
					}
					for (
						var h = k.createBookmarks(!0),
							B = [],
							x = {},
							n = n.createIterator(),
							v = 0;
						(A = n.getNextRange()) && ++v;

					) {
						var p = A.getBoundaryNodes(),
							E = p.startNode,
							F = p.endNode;
						E.type == CKEDITOR.NODE_ELEMENT &&
							"td" == E.getName() &&
							A.setStartAt(p.startNode, CKEDITOR.POSITION_AFTER_START);
						F.type == CKEDITOR.NODE_ELEMENT &&
							"td" == F.getName() &&
							A.setEndAt(p.endNode, CKEDITOR.POSITION_BEFORE_END);
						A = A.createIterator();
						for (
							A.forceBrBreak = this.state == CKEDITOR.TRISTATE_OFF;
							(p = A.getNextParagraph());

						)
							if (!p.getCustomData("list_block") && !g(p)) {
								CKEDITOR.dom.element.setMarker(x, p, "list_block", 1);
								for (
									var L = c.elementPath(p),
										E = L.elements,
										F = 0,
										L = L.blockLimit,
										I,
										D = E.length - 1;
									0 <= D && (I = E[D]);
									D--
								)
									if (m[I.getName()] && L.contains(I)) {
										L.removeCustomData("list_group_object_" + v);
										(E = I.getCustomData("list_group_object"))
											? E.contents.push(p)
											: ((E = { root: I, contents: [p] }),
											  B.push(E),
											  CKEDITOR.dom.element.setMarker(
													x,
													I,
													"list_group_object",
													E
											  ));
										F = 1;
										break;
									}
								F ||
									((F = L),
									F.getCustomData("list_group_object_" + v)
										? F.getCustomData("list_group_object_" + v).contents.push(p)
										: ((E = { root: F, contents: [p] }),
										  CKEDITOR.dom.element.setMarker(
												x,
												F,
												"list_group_object_" + v,
												E
										  ),
										  B.push(E)));
							}
					}
					for (I = []; 0 < B.length; )
						(E = B.shift()),
							this.state == CKEDITOR.TRISTATE_OFF
								? e(E) ||
								  (m[E.root.getName()]
										? a.call(this, c, E, x, I)
										: d.call(this, c, E, I))
								: this.state == CKEDITOR.TRISTATE_ON &&
								  m[E.root.getName()] &&
								  !e(E) &&
								  b.call(this, c, E, x);
					for (D = 0; D < I.length; D++) l(I[D]);
					CKEDITOR.dom.element.clearAllMarkers(x);
					k.selectBookmarks(h);
					c.focus();
				},
				refresh: function (a, b) {
					var c = b.contains(m, 1),
						e = b.blockLimit || b.root;
					c && e.contains(c)
						? this.setState(
								c.is(this.type) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF
						  )
						: this.setState(CKEDITOR.TRISTATE_OFF);
				},
			};
			CKEDITOR.plugins.add("list", {
				requires: "indentlist",
				init: function (a) {
					a.blockless ||
						(a.addCommand("numberedlist", new c("numberedlist", "ol")),
						a.addCommand("bulletedlist", new c("bulletedlist", "ul")),
						a.ui.addButton &&
							(a.ui.addButton("NumberedList", {
								label: a.lang.list.numberedlist,
								command: "numberedlist",
								directional: !0,
								toolbar: "list,10",
							}),
							a.ui.addButton("BulletedList", {
								label: a.lang.list.bulletedlist,
								command: "bulletedlist",
								directional: !0,
								toolbar: "list,20",
							})),
						a.on("key", function (b) {
							var c = b.data.domEvent.getKey(),
								f;
							if ("wysiwyg" == a.mode && c in { 8: 1, 46: 1 }) {
								var d = a.getSelection().getRanges()[0],
									g = d && d.startPath();
								if (d && d.collapsed) {
									var l = 8 == c,
										n = a.editable(),
										A = new CKEDITOR.dom.walker(d.clone());
									A.evaluator = function (a) {
										return r(a) && !x(a);
									};
									A.guard = function (a, b) {
										return !(
											b &&
											a.type == CKEDITOR.NODE_ELEMENT &&
											a.is("table")
										);
									};
									c = d.clone();
									if (l) {
										var v;
										(v = g.contains(m)) &&
										d.checkBoundaryOfElement(v, CKEDITOR.START) &&
										(v = v.getParent()) &&
										v.is("li") &&
										(v = e(v))
											? ((f = v),
											  (v = v.getPrevious(r)),
											  c.moveToPosition(
													v && x(v) ? v : f,
													CKEDITOR.POSITION_BEFORE_START
											  ))
											: (A.range.setStartAt(n, CKEDITOR.POSITION_AFTER_START),
											  A.range.setEnd(d.startContainer, d.startOffset),
											  (v = A.previous()) &&
													v.type == CKEDITOR.NODE_ELEMENT &&
													(v.getName() in m || v.is("li")) &&
													(v.is("li") ||
														(A.range.selectNodeContents(v),
														A.reset(),
														(A.evaluator = k),
														(v = A.previous())),
													(f = v),
													c.moveToElementEditEnd(f),
													c.moveToPosition(
														c.endPath().block,
														CKEDITOR.POSITION_BEFORE_END
													)));
										if (f) h(a, c, d), b.cancel();
										else {
											var p = g.contains(m);
											p &&
												d.checkBoundaryOfElement(p, CKEDITOR.START) &&
												((f = p.getFirst(r)),
												d.checkBoundaryOfElement(f, CKEDITOR.START) &&
													((v = p.getPrevious(r)),
													e(f)
														? v && (d.moveToElementEditEnd(v), d.select())
														: a.execCommand("outdent"),
													b.cancel()));
										}
									} else if ((f = g.contains("li"))) {
										if (
											(A.range.setEndAt(n, CKEDITOR.POSITION_BEFORE_END),
											(l = (n = f.getLast(r)) && k(n) ? n : f),
											(g = 0),
											(v = A.next()) &&
											v.type == CKEDITOR.NODE_ELEMENT &&
											v.getName() in m &&
											v.equals(n)
												? ((g = 1), (v = A.next()))
												: d.checkBoundaryOfElement(l, CKEDITOR.END) && (g = 2),
											g && v)
										) {
											d = d.clone();
											d.moveToElementEditStart(v);
											if (
												1 == g &&
												(c.optimize(), !c.startContainer.equals(f))
											) {
												for (f = c.startContainer; f.is(CKEDITOR.dtd.$inline); )
													(p = f), (f = f.getParent());
												p && c.moveToPosition(p, CKEDITOR.POSITION_AFTER_END);
											}
											2 == g &&
												(c.moveToPosition(
													c.endPath().block,
													CKEDITOR.POSITION_BEFORE_END
												),
												d.endPath().block &&
													d.moveToPosition(
														d.endPath().block,
														CKEDITOR.POSITION_AFTER_START
													));
											h(a, c, d);
											b.cancel();
										}
									} else
										A.range.setEndAt(n, CKEDITOR.POSITION_BEFORE_END),
											(v = A.next()) &&
												v.type == CKEDITOR.NODE_ELEMENT &&
												v.is(m) &&
												((v = v.getFirst(r)),
												g.block && d.checkStartOfBlock() && d.checkEndOfBlock()
													? (g.block.remove(),
													  d.moveToElementEditStart(v),
													  d.select())
													: e(v)
													? (d.moveToElementEditStart(v), d.select())
													: ((d = d.clone()),
													  d.moveToElementEditStart(v),
													  h(a, c, d)),
												b.cancel());
									setTimeout(function () {
										a.selectionChange(1);
									});
								}
							}
						}));
				},
			});
		})(),
		(function () {
			function a(a, b, c) {
				c = a.config.forceEnterMode || c;
				if ("wysiwyg" == a.mode) {
					b || (b = a.activeEnterMode);
					var e = a.elementPath();
					e && !e.isContextFor("p") && ((b = CKEDITOR.ENTER_BR), (c = 1));
					a.fire("saveSnapshot");
					b == CKEDITOR.ENTER_BR ? k(a, b, null, c) : h(a, b, null, c);
					a.fire("saveSnapshot");
				}
			}
			function d(a) {
				a = a.getSelection().getRanges(!0);
				for (var b = a.length - 1; 0 < b; b--) a[b].deleteContents();
				return a[0];
			}
			function b(a) {
				var b = a.startContainer.getAscendant(function (a) {
					return (
						a.type == CKEDITOR.NODE_ELEMENT &&
						"true" == a.getAttribute("contenteditable")
					);
				}, !0);
				if (a.root.equals(b)) return a;
				b = new CKEDITOR.dom.range(b);
				b.moveToRange(a);
				return b;
			}
			CKEDITOR.plugins.add("enterkey", {
				init: function (b) {
					b.addCommand("enter", {
						modes: { wysiwyg: 1 },
						editorFocus: !1,
						exec: function (b) {
							a(b);
						},
					});
					b.addCommand("shiftEnter", {
						modes: { wysiwyg: 1 },
						editorFocus: !1,
						exec: function (b) {
							a(b, b.activeShiftEnterMode, 1);
						},
					});
					b.setKeystroke([
						[13, "enter"],
						[CKEDITOR.SHIFT + 13, "shiftEnter"],
					]);
				},
			});
			var c = CKEDITOR.dom.walker.whitespaces(),
				g = CKEDITOR.dom.walker.bookmark(),
				l,
				k,
				h,
				e;
			CKEDITOR.plugins.enterkey = {
				enterBlock: function (a, f, h, l) {
					function x(a) {
						var b;
						if (
							a === CKEDITOR.ENTER_BR ||
							-1 ===
								CKEDITOR.tools.indexOf(["td", "th"], w.lastElement.getName()) ||
							1 !== w.lastElement.getChildCount()
						)
							return !1;
						a = w.lastElement.getChild(0).clone(!0);
						(b = a.getBogus()) && b.remove();
						return a.getText().length ? !1 : !0;
					}
					if ((h = h || d(a))) {
						h = b(h);
						var v = h.document,
							p = h.checkStartOfBlock(),
							u = h.checkEndOfBlock(),
							w = a.elementPath(h.startContainer),
							q = w.block,
							z = f == CKEDITOR.ENTER_DIV ? "div" : "p",
							t;
						if (q && p && u) {
							p = q.getParent();
							if (p.is("li") && 1 < p.getChildCount()) {
								v = new CKEDITOR.dom.element("li");
								t = a.createRange();
								v.insertAfter(p);
								q.remove();
								t.setStart(v, 0);
								a.getSelection().selectRanges([t]);
								return;
							}
							if (q.is("li") || q.getParent().is("li")) {
								q.is("li") || ((q = q.getParent()), (p = q.getParent()));
								t = p.getParent();
								h = !q.hasPrevious();
								var y = !q.hasNext();
								l = a.getSelection();
								var z = l.createBookmarks(),
									C = q.getDirection(1),
									u = q.getAttribute("class"),
									B = q.getAttribute("style"),
									A = t.getDirection(1) != C;
								a = a.enterMode != CKEDITOR.ENTER_BR || A || B || u;
								if (t.is("li"))
									h || y
										? (h && y && p.remove(),
										  q[y ? "insertAfter" : "insertBefore"](t))
										: q.breakParent(t);
								else {
									if (a)
										if (
											(w.block.is("li")
												? ((t = v.createElement(
														f == CKEDITOR.ENTER_P ? "p" : "div"
												  )),
												  A && t.setAttribute("dir", C),
												  B && t.setAttribute("style", B),
												  u && t.setAttribute("class", u),
												  q.moveChildren(t))
												: (t = w.block),
											h || y)
										)
											t[h ? "insertBefore" : "insertAfter"](p);
										else q.breakParent(p), t.insertAfter(p);
									else if ((q.appendBogus(!0), h || y))
										for (; (v = q[h ? "getFirst" : "getLast"]()); )
											v[h ? "insertBefore" : "insertAfter"](p);
									else
										for (q.breakParent(p); (v = q.getLast()); )
											v.insertAfter(p);
									q.remove();
								}
								l.selectBookmarks(z);
								return;
							}
							if (q && q.getParent().is("blockquote")) {
								q.breakParent(q.getParent());
								q.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1)) ||
									q.getPrevious().remove();
								q.getNext().getFirst(CKEDITOR.dom.walker.invisible(1)) ||
									q.getNext().remove();
								h.moveToElementEditStart(q);
								h.select();
								return;
							}
						} else if (q && q.is("pre") && !u) {
							k(a, f, h, l);
							return;
						}
						if ((B = h.splitBlock(z))) {
							a = B.previousBlock;
							q = B.nextBlock;
							p = B.wasStartOfBlock;
							u = B.wasEndOfBlock;
							q
								? ((y = q.getParent()),
								  y.is("li") && (q.breakParent(y), q.move(q.getNext(), 1)))
								: a &&
								  (y = a.getParent()) &&
								  y.is("li") &&
								  (a.breakParent(y),
								  (y = a.getNext()),
								  h.moveToElementEditStart(y),
								  a.move(a.getPrevious()));
							if (p || u)
								if (x(f)) h.moveToElementEditStart(h.getTouchedStartNode());
								else {
									if (a) {
										if (a.is("li") || (!e.test(a.getName()) && !a.is("pre")))
											t = a.clone();
									} else q && (t = q.clone());
									t
										? l && !t.is("li") && t.renameNode(z)
										: y && y.is("li")
										? (t = y)
										: ((t = v.createElement(z)),
										  a && (C = a.getDirection()) && t.setAttribute("dir", C));
									if ((v = B.elementPath))
										for (f = 0, l = v.elements.length; f < l; f++) {
											z = v.elements[f];
											if (z.equals(v.block) || z.equals(v.blockLimit)) break;
											CKEDITOR.dtd.$removeEmpty[z.getName()] &&
												((z = z.clone()), t.moveChildren(z), t.append(z));
										}
									t.appendBogus();
									t.getParent() || h.insertNode(t);
									t.is("li") && t.removeAttribute("value");
									!CKEDITOR.env.ie ||
										!p ||
										(u && a.getChildCount()) ||
										(h.moveToElementEditStart(u ? a : t), h.select());
									h.moveToElementEditStart(p && !u ? q : t);
								}
							else
								q.is("li") &&
									((t = h.clone()),
									t.selectNodeContents(q),
									(t = new CKEDITOR.dom.walker(t)),
									(t.evaluator = function (a) {
										return !(
											g(a) ||
											c(a) ||
											(a.type == CKEDITOR.NODE_ELEMENT &&
												a.getName() in CKEDITOR.dtd.$inline &&
												!(a.getName() in CKEDITOR.dtd.$empty))
										);
									}),
									(y = t.next()) &&
										y.type == CKEDITOR.NODE_ELEMENT &&
										y.is("ul", "ol") &&
										(CKEDITOR.env.needsBrFiller
											? v.createElement("br")
											: v.createText(" ")
										).insertBefore(y)),
									q && h.moveToElementEditStart(q);
							h.select();
							h.scrollIntoView();
						}
					}
				},
				enterBr: function (a, b, c, g) {
					if ((c = c || d(a))) {
						var k = c.document,
							l = c.checkEndOfBlock(),
							p = new CKEDITOR.dom.elementPath(
								a.getSelection().getStartElement()
							),
							u = p.block,
							w = u && p.block.getName();
						g || "li" != w
							? (!g && l && e.test(w)
									? (l = u.getDirection())
										? ((k = k.createElement("div")),
										  k.setAttribute("dir", l),
										  k.insertAfter(u),
										  c.setStart(k, 0))
										: (k.createElement("br").insertAfter(u),
										  CKEDITOR.env.gecko && k.createText("").insertAfter(u),
										  c.setStartAt(
												u.getNext(),
												CKEDITOR.env.ie
													? CKEDITOR.POSITION_BEFORE_START
													: CKEDITOR.POSITION_AFTER_START
										  ))
									: ((a =
											"pre" == w && CKEDITOR.env.ie && 8 > CKEDITOR.env.version
												? k.createText("\r")
												: k.createElement("br")),
									  c.deleteContents(),
									  c.insertNode(a),
									  CKEDITOR.env.needsBrFiller
											? (k.createText("﻿").insertAfter(a),
											  l && (u || p.blockLimit).appendBogus(),
											  (a.getNext().$.nodeValue = ""),
											  c.setStartAt(
													a.getNext(),
													CKEDITOR.POSITION_AFTER_START
											  ))
											: c.setStartAt(a, CKEDITOR.POSITION_AFTER_END)),
							  c.collapse(!0),
							  c.select(),
							  c.scrollIntoView())
							: h(a, b, c, g);
					}
				},
			};
			l = CKEDITOR.plugins.enterkey;
			k = l.enterBr;
			h = l.enterBlock;
			e = /^h[1-6]$/;
		})(),
		(function () {
			function a(a, b) {
				var c = {},
					g = [],
					l = {
						nbsp: " ",
						shy: "­",
						gt: "\x3e",
						lt: "\x3c",
						amp: "\x26",
						apos: "'",
						quot: '"',
					};
				a = a.replace(
					/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g,
					function (a, e) {
						var d = b ? "\x26" + e + ";" : l[e];
						c[d] = b ? l[e] : "\x26" + e + ";";
						g.push(d);
						return "";
					}
				);
				a = a.replace(/,$/, "");
				if (!b && a) {
					a = a.split(",");
					var k = document.createElement("div"),
						h;
					k.innerHTML = "\x26" + a.join(";\x26") + ";";
					h = k.innerHTML;
					k = null;
					for (k = 0; k < h.length; k++) {
						var e = h.charAt(k);
						c[e] = "\x26" + a[k] + ";";
						g.push(e);
					}
				}
				c.regex = g.join(b ? "|" : "");
				return c;
			}
			CKEDITOR.plugins.add("entities", {
				afterInit: function (d) {
					function b(a) {
						return e[a];
					}
					function c(a) {
						return "force" != g.entities_processNumerical && k[a]
							? k[a]
							: "\x26#" + a.charCodeAt(0) + ";";
					}
					var g = d.config;
					if ((d = (d = d.dataProcessor) && d.htmlFilter)) {
						var l = [];
						!1 !== g.basicEntities && l.push("nbsp,gt,lt,amp");
						g.entities &&
							(l.length &&
								l.push(
									"quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro"
								),
							g.entities_latin &&
								l.push(
									"Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml"
								),
							g.entities_greek &&
								l.push(
									"Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv"
								),
							g.entities_additional && l.push(g.entities_additional));
						var k = a(l.join(",")),
							h = k.regex ? "[" + k.regex + "]" : "a^";
						delete k.regex;
						g.entities && g.entities_processNumerical && (h = "[^ -~]|" + h);
						var h = new RegExp(h, "g"),
							e = a("nbsp,gt,lt,amp,shy", !0),
							m = new RegExp(e.regex, "g");
						d.addRules(
							{
								text: function (a) {
									return a.replace(m, b).replace(h, c);
								},
							},
							{ applyToAll: !0, excludeNestedEditable: !0 }
						);
					}
				},
			});
		})(),
		(CKEDITOR.config.basicEntities = !0),
		(CKEDITOR.config.entities = !0),
		(CKEDITOR.config.entities_latin = !0),
		(CKEDITOR.config.entities_greek = !0),
		(CKEDITOR.config.entities_additional = "#39"),
		CKEDITOR.plugins.add("popup"),
		CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
			popup: function (a, d, b, c) {
				d = d || "80%";
				b = b || "70%";
				"string" == typeof d &&
					1 < d.length &&
					"%" == d.substr(d.length - 1, 1) &&
					(d = parseInt((window.screen.width * parseInt(d, 10)) / 100, 10));
				"string" == typeof b &&
					1 < b.length &&
					"%" == b.substr(b.length - 1, 1) &&
					(b = parseInt((window.screen.height * parseInt(b, 10)) / 100, 10));
				640 > d && (d = 640);
				420 > b && (b = 420);
				var g = parseInt((window.screen.height - b) / 2, 10),
					l = parseInt((window.screen.width - d) / 2, 10);
				c =
					(c ||
						"location\x3dno,menubar\x3dno,toolbar\x3dno,dependent\x3dyes,minimizable\x3dno,modal\x3dyes,alwaysRaised\x3dyes,resizable\x3dyes,scrollbars\x3dyes") +
					",width\x3d" +
					d +
					",height\x3d" +
					b +
					",top\x3d" +
					g +
					",left\x3d" +
					l;
				var k = window.open("", null, c, !0);
				if (!k) return !1;
				try {
					-1 == navigator.userAgent.toLowerCase().indexOf(" chrome/") &&
						(k.moveTo(l, g), k.resizeTo(d, b)),
						k.focus(),
						(k.location.href = a);
				} catch (h) {
					window.open(a, null, c, !0);
				}
				return !0;
			},
		}),
		"use strict",
		(function () {
			function a(a) {
				this.editor = a;
				this.loaders = [];
			}
			function d(a, c, d) {
				var h = a.config.fileTools_defaultFileName;
				this.editor = a;
				this.lang = a.lang;
				"string" === typeof c
					? ((this.data = c),
					  (this.file = b(this.data)),
					  (this.loaded = this.total = this.file.size))
					: ((this.data = null),
					  (this.file = c),
					  (this.total = this.file.size),
					  (this.loaded = 0));
				d
					? (this.fileName = d)
					: this.file.name
					? (this.fileName = this.file.name)
					: ((a = this.file.type.split("/")),
					  h && (a[0] = h),
					  (this.fileName = a.join(".")));
				this.uploaded = 0;
				this.responseData = this.uploadTotal = null;
				this.status = "created";
				this.abort = function () {
					this.changeStatus("abort");
				};
			}
			function b(a) {
				var b = a.match(c)[1];
				a = a.replace(c, "");
				a = atob(a);
				var d = [],
					h,
					e,
					m,
					f;
				for (h = 0; h < a.length; h += 512) {
					e = a.slice(h, h + 512);
					m = Array(e.length);
					for (f = 0; f < e.length; f++) m[f] = e.charCodeAt(f);
					e = new Uint8Array(m);
					d.push(e);
				}
				return new Blob(d, { type: b });
			}
			CKEDITOR.plugins.add("filetools", {
				beforeInit: function (b) {
					b.uploadRepository = new a(b);
					b.on(
						"fileUploadRequest",
						function (a) {
							var b = a.data.fileLoader;
							b.xhr.open("POST", b.uploadUrl, !0);
							a.data.requestData.upload = { file: b.file, name: b.fileName };
						},
						null,
						null,
						5
					);
					b.on(
						"fileUploadRequest",
						function (a) {
							var c = a.data.fileLoader,
								d = new FormData();
							a = a.data.requestData;
							var e = b.config.fileTools_requestHeaders,
								m,
								f;
							for (f in a) {
								var n = a[f];
								"object" === typeof n && n.file
									? d.append(f, n.file, n.name)
									: d.append(f, n);
							}
							d.append("ckCsrfToken", CKEDITOR.tools.getCsrfToken());
							if (e) for (m in e) c.xhr.setRequestHeader(m, e[m]);
							c.xhr.send(d);
						},
						null,
						null,
						999
					);
					b.on(
						"fileUploadResponse",
						function (a) {
							var b = a.data.fileLoader,
								c = b.xhr,
								e = a.data;
							try {
								var d = JSON.parse(c.responseText);
								d.error && d.error.message && (e.message = d.error.message);
								if (d.uploaded) for (var f in d) e[f] = d[f];
								else a.cancel();
							} catch (g) {
								(e.message = b.lang.filetools.responseError),
									CKEDITOR.warn("filetools-response-error", {
										responseText: c.responseText,
									}),
									a.cancel();
							}
						},
						null,
						null,
						999
					);
				},
			});
			a.prototype = {
				create: function (a, b, c) {
					c = c || d;
					var h = this.loaders.length;
					a = new c(this.editor, a, b);
					a.id = h;
					this.loaders[h] = a;
					this.fire("instanceCreated", a);
					return a;
				},
				isFinished: function () {
					for (var a = 0; a < this.loaders.length; ++a)
						if (!this.loaders[a].isFinished()) return !1;
					return !0;
				},
			};
			d.prototype = {
				loadAndUpload: function (a, b) {
					var c = this;
					this.once(
						"loaded",
						function (d) {
							d.cancel();
							c.once(
								"update",
								function (a) {
									a.cancel();
								},
								null,
								null,
								0
							);
							c.upload(a, b);
						},
						null,
						null,
						0
					);
					this.load();
				},
				load: function () {
					var a = this,
						b = (this.reader = new FileReader());
					a.changeStatus("loading");
					this.abort = function () {
						a.reader.abort();
					};
					b.onabort = function () {
						a.changeStatus("abort");
					};
					b.onerror = function () {
						a.message = a.lang.filetools.loadError;
						a.changeStatus("error");
					};
					b.onprogress = function (b) {
						a.loaded = b.loaded;
						a.update();
					};
					b.onload = function () {
						a.loaded = a.total;
						a.data = b.result;
						a.changeStatus("loaded");
					};
					b.readAsDataURL(this.file);
				},
				upload: function (a, b) {
					var c = b || {};
					a
						? ((this.uploadUrl = a),
						  (this.xhr = new XMLHttpRequest()),
						  this.attachRequestListeners(),
						  this.editor.fire("fileUploadRequest", {
								fileLoader: this,
								requestData: c,
						  }) && this.changeStatus("uploading"))
						: ((this.message = this.lang.filetools.noUrlError),
						  this.changeStatus("error"));
				},
				attachRequestListeners: function () {
					function a() {
						"error" != c.status &&
							((c.message = c.lang.filetools.networkError),
							c.changeStatus("error"));
					}
					function b() {
						"abort" != c.status && c.changeStatus("abort");
					}
					var c = this,
						d = this.xhr;
					c.abort = function () {
						d.abort();
						b();
					};
					d.onerror = a;
					d.onabort = b;
					d.upload
						? ((d.upload.onprogress = function (a) {
								a.lengthComputable &&
									(c.uploadTotal || (c.uploadTotal = a.total),
									(c.uploaded = a.loaded),
									c.update());
						  }),
						  (d.upload.onerror = a),
						  (d.upload.onabort = b))
						: ((c.uploadTotal = c.total), c.update());
					d.onload = function () {
						c.update();
						if ("abort" != c.status)
							if (
								((c.uploaded = c.uploadTotal), 200 > d.status || 299 < d.status)
							)
								(c.message = c.lang.filetools["httpError" + d.status]),
									c.message ||
										(c.message = c.lang.filetools.httpError.replace(
											"%1",
											d.status
										)),
									c.changeStatus("error");
							else {
								for (
									var a = { fileLoader: c },
										b = ["message", "fileName", "url"],
										f = c.editor.fire("fileUploadResponse", a),
										g = 0;
									g < b.length;
									g++
								) {
									var l = b[g];
									"string" === typeof a[l] && (c[l] = a[l]);
								}
								c.responseData = a;
								delete c.responseData.fileLoader;
								!1 === f ? c.changeStatus("error") : c.changeStatus("uploaded");
							}
					};
				},
				changeStatus: function (a) {
					this.status = a;
					if ("error" == a || "abort" == a || "loaded" == a || "uploaded" == a)
						this.abort = function () {};
					this.fire(a);
					this.update();
				},
				update: function () {
					this.fire("update");
				},
				isFinished: function () {
					return !!this.status.match(/^(?:loaded|uploaded|error|abort)$/);
				},
			};
			CKEDITOR.event.implementOn(a.prototype);
			CKEDITOR.event.implementOn(d.prototype);
			var c = /^data:(\S*?);base64,/;
			CKEDITOR.fileTools || (CKEDITOR.fileTools = {});
			CKEDITOR.tools.extend(CKEDITOR.fileTools, {
				uploadRepository: a,
				fileLoader: d,
				getUploadUrl: function (a, b) {
					var c = CKEDITOR.tools.capitalize;
					return b && a[b + "UploadUrl"]
						? a[b + "UploadUrl"]
						: a.uploadUrl
						? a.uploadUrl
						: b && a["filebrowser" + c(b, 1) + "UploadUrl"]
						? a["filebrowser" + c(b, 1) + "UploadUrl"] +
						  "\x26responseType\x3djson"
						: a.filebrowserUploadUrl
						? a.filebrowserUploadUrl + "\x26responseType\x3djson"
						: null;
				},
				isTypeSupported: function (a, b) {
					return !!a.type.match(b);
				},
				isFileUploadSupported:
					"function" === typeof FileReader &&
					"function" === typeof new FileReader().readAsDataURL &&
					"function" === typeof FormData &&
					"function" === typeof new FormData().append &&
					"function" === typeof XMLHttpRequest &&
					"function" === typeof Blob,
			});
		})(),
		(function () {
			function a(a, b) {
				var c = [];
				if (b) for (var e in b) c.push(e + "\x3d" + encodeURIComponent(b[e]));
				else return a;
				return a + (-1 != a.indexOf("?") ? "\x26" : "?") + c.join("\x26");
			}
			function d(b) {
				return !b.match(/command=QuickUpload/) ||
					b.match(/(\?|&)responseType=json/)
					? b
					: a(b, { responseType: "json" });
			}
			function b(a) {
				a += "";
				return a.charAt(0).toUpperCase() + a.substr(1);
			}
			function c() {
				var c = this.getDialog(),
					e = c.getParentEditor();
				e._.filebrowserSe = this;
				var f =
						e.config["filebrowser" + b(c.getName()) + "WindowWidth"] ||
						e.config.filebrowserWindowWidth ||
						"80%",
					c =
						e.config["filebrowser" + b(c.getName()) + "WindowHeight"] ||
						e.config.filebrowserWindowHeight ||
						"70%",
					d = this.filebrowser.params || {};
				d.CKEditor = e.name;
				d.CKEditorFuncNum = e._.filebrowserFn;
				d.langCode || (d.langCode = e.langCode);
				d = a(this.filebrowser.url, d);
				e.popup(
					d,
					f,
					c,
					e.config.filebrowserWindowFeatures ||
						e.config.fileBrowserWindowFeatures
				);
			}
			function g(a) {
				var b = new CKEDITOR.dom.element(a.$.form);
				b &&
					((a = b.$.elements.ckCsrfToken)
						? (a = new CKEDITOR.dom.element(a))
						: ((a = new CKEDITOR.dom.element("input")),
						  a.setAttributes({ name: "ckCsrfToken", type: "hidden" }),
						  b.append(a)),
					a.setAttribute("value", CKEDITOR.tools.getCsrfToken()));
			}
			function l() {
				var a = this.getDialog();
				a.getParentEditor()._.filebrowserSe = this;
				return a
					.getContentElement(this["for"][0], this["for"][1])
					.getInputElement().$.value &&
					a.getContentElement(this["for"][0], this["for"][1]).getAction()
					? !0
					: !1;
			}
			function k(b, c, e) {
				var f = e.params || {};
				f.CKEditor = b.name;
				f.CKEditorFuncNum = b._.filebrowserFn;
				f.langCode || (f.langCode = b.langCode);
				c.action = a(e.url, f);
				c.filebrowser = e;
			}
			function h(a, m, x, v) {
				if (v && v.length)
					for (var p, u = v.length; u--; )
						if (
							((p = v[u]),
							("hbox" != p.type && "vbox" != p.type && "fieldset" != p.type) ||
								h(a, m, x, p.children),
							p.filebrowser)
						)
							if (
								("string" == typeof p.filebrowser &&
									(p.filebrowser = {
										action: "fileButton" == p.type ? "QuickUpload" : "Browse",
										target: p.filebrowser,
									}),
								"Browse" == p.filebrowser.action)
							) {
								var w = p.filebrowser.url;
								void 0 === w &&
									((w = a.config["filebrowser" + b(m) + "BrowseUrl"]),
									void 0 === w && (w = a.config.filebrowserBrowseUrl));
								w &&
									((p.onClick = c), (p.filebrowser.url = w), (p.hidden = !1));
							} else if (
								"QuickUpload" == p.filebrowser.action &&
								p["for"] &&
								((w = p.filebrowser.url),
								void 0 === w &&
									((w = a.config["filebrowser" + b(m) + "UploadUrl"]),
									void 0 === w && (w = a.config.filebrowserUploadUrl)),
								w)
							) {
								var q = p.onClick;
								p.onClick = function (b) {
									var c = b.sender,
										h = c
											.getDialog()
											.getContentElement(this["for"][0], this["for"][1])
											.getInputElement(),
										k =
											CKEDITOR.fileTools &&
											CKEDITOR.fileTools.isFileUploadSupported;
									if (q && !1 === q.call(c, b)) return !1;
									if (l.call(c, b)) {
										if ("form" !== a.config.filebrowserUploadMethod && k)
											return (
												(b = a.uploadRepository.create(h.$.files[0])),
												b.on("uploaded", function (a) {
													var b = a.sender.responseData;
													f.call(a.sender.editor, b.url, b.message);
												}),
												b.on("error", e.bind(this)),
												b.on("abort", e.bind(this)),
												b.loadAndUpload(d(w)),
												"xhr"
											);
										g(h);
										return !0;
									}
									return !1;
								};
								p.filebrowser.url = w;
								p.hidden = !1;
								k(
									a,
									x.getContents(p["for"][0]).get(p["for"][1]),
									p.filebrowser
								);
							}
			}
			function e(a) {
				var b = {};
				try {
					b = JSON.parse(a.sender.xhr.response) || {};
				} catch (c) {}
				this.enable();
				alert(b.error ? b.error.message : a.sender.message);
			}
			function m(a, b, c) {
				if (-1 !== c.indexOf(";")) {
					c = c.split(";");
					for (var e = 0; e < c.length; e++) if (m(a, b, c[e])) return !0;
					return !1;
				}
				return (a = a.getContents(b).get(c).filebrowser) && a.url;
			}
			function f(a, b) {
				var c = this._.filebrowserSe.getDialog(),
					e = this._.filebrowserSe["for"],
					f = this._.filebrowserSe.filebrowser.onSelect;
				e && c.getContentElement(e[0], e[1]).reset();
				if ("function" != typeof b || !1 !== b.call(this._.filebrowserSe))
					if (!f || !1 !== f.call(this._.filebrowserSe, a, b))
						if (
							("string" == typeof b && b && alert(b),
							a &&
								((e = this._.filebrowserSe),
								(c = e.getDialog()),
								(e = e.filebrowser.target || null)))
						)
							if (((e = e.split(":")), (f = c.getContentElement(e[0], e[1]))))
								f.setValue(a), c.selectPage(e[0]);
			}
			CKEDITOR.plugins.add("filebrowser", {
				requires: "popup,filetools",
				init: function (a) {
					a._.filebrowserFn = CKEDITOR.tools.addFunction(f, a);
					a.on("destroy", function () {
						CKEDITOR.tools.removeFunction(this._.filebrowserFn);
					});
				},
			});
			CKEDITOR.on("dialogDefinition", function (a) {
				if (a.editor.plugins.filebrowser)
					for (var b = a.data.definition, c, e = 0; e < b.contents.length; ++e)
						if ((c = b.contents[e]))
							h(a.editor, a.data.name, b, c.elements),
								c.hidden &&
									c.filebrowser &&
									(c.hidden = !m(b, c.id, c.filebrowser));
			});
		})(),
		(function () {
			function a(a) {
				var g = a.config,
					l = a.fire("uiSpace", { space: "top", html: "" }).html,
					k = (function () {
						function f(a, c, d) {
							e.setStyle(c, b(d));
							e.setStyle("position", a);
						}
						function h(a) {
							var b = l.getDocumentPosition();
							switch (a) {
								case "top":
									f("absolute", "top", b.y - q - y);
									break;
								case "pin":
									f("fixed", "top", B);
									break;
								case "bottom":
									f(
										"absolute",
										"top",
										b.y + (u.height || u.bottom - u.top) + y
									);
							}
							m = a;
						}
						var m,
							l,
							p,
							u,
							w,
							q,
							z,
							t = g.floatSpaceDockedOffsetX || 0,
							y = g.floatSpaceDockedOffsetY || 0,
							C = g.floatSpacePinnedOffsetX || 0,
							B = g.floatSpacePinnedOffsetY || 0;
						return function (f) {
							if ((l = a.editable())) {
								var n = f && "focus" == f.name;
								n && e.show();
								a.fire("floatingSpaceLayout", { show: n });
								e.removeStyle("left");
								e.removeStyle("right");
								p = e.getClientRect();
								u = l.getClientRect();
								w = d.getViewPaneSize();
								q = p.height;
								z =
									"pageXOffset" in d.$
										? d.$.pageXOffset
										: CKEDITOR.document.$.documentElement.scrollLeft;
								m
									? (q + y <= u.top
											? h("top")
											: q + y > w.height - u.bottom
											? h("pin")
											: h("bottom"),
									  (f = w.width / 2),
									  (f = g.floatSpacePreferRight
											? "right"
											: 0 < u.left && u.right < w.width && u.width > p.width
											? "rtl" == g.contentsLangDirection
												? "right"
												: "left"
											: f - u.left > u.right - f
											? "left"
											: "right"),
									  p.width > w.width
											? ((f = "left"), (n = 0))
											: ((n =
													"left" == f
														? 0 < u.left
															? u.left
															: 0
														: u.right < w.width
														? w.width - u.right
														: 0),
											  n + p.width > w.width &&
													((f = "left" == f ? "right" : "left"), (n = 0))),
									  e.setStyle(
											f,
											b(
												("pin" == m ? C : t) +
													n +
													("pin" == m ? 0 : "left" == f ? z : -z)
											)
									  ))
									: ((m = "pin"), h("pin"), k(f));
							}
						};
					})();
				if (l) {
					var h = new CKEDITOR.template(
							'\x3cdiv id\x3d"cke_{name}" class\x3d"cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' +
								CKEDITOR.env.cssClass +
								'" dir\x3d"{langDir}" title\x3d"' +
								(CKEDITOR.env.gecko ? " " : "") +
								'" lang\x3d"{langCode}" role\x3d"application" style\x3d"{style}"' +
								(a.title ? ' aria-labelledby\x3d"cke_{name}_arialbl"' : " ") +
								"\x3e" +
								(a.title
									? '\x3cspan id\x3d"cke_{name}_arialbl" class\x3d"cke_voice_label"\x3e{voiceLabel}\x3c/span\x3e'
									: " ") +
								'\x3cdiv class\x3d"cke_inner"\x3e\x3cdiv id\x3d"{topId}" class\x3d"cke_top" role\x3d"presentation"\x3e{content}\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e'
						),
						e = CKEDITOR.document
							.getBody()
							.append(
								CKEDITOR.dom.element.createFromHtml(
									h.output({
										content: l,
										id: a.id,
										langDir: a.lang.dir,
										langCode: a.langCode,
										name: a.name,
										style: "display:none;z-index:" + (g.baseFloatZIndex - 1),
										topId: a.ui.spaceId("top"),
										voiceLabel: a.title,
									})
								)
							),
						m = CKEDITOR.tools.eventsBuffer(500, k),
						f = CKEDITOR.tools.eventsBuffer(100, k);
					e.unselectable();
					e.on("mousedown", function (a) {
						a = a.data;
						a.getTarget().hasAscendant("a", 1) || a.preventDefault();
					});
					a.on("focus", function (b) {
						k(b);
						a.on("change", m.input);
						d.on("scroll", f.input);
						d.on("resize", f.input);
					});
					a.on("blur", function () {
						e.hide();
						a.removeListener("change", m.input);
						d.removeListener("scroll", f.input);
						d.removeListener("resize", f.input);
					});
					a.on("destroy", function () {
						d.removeListener("scroll", f.input);
						d.removeListener("resize", f.input);
						e.clearCustomData();
						e.remove();
					});
					a.focusManager.hasFocus && e.show();
					a.focusManager.add(e, 1);
				}
			}
			var d = CKEDITOR.document.getWindow(),
				b = CKEDITOR.tools.cssLength;
			CKEDITOR.plugins.add("floatingspace", {
				init: function (b) {
					b.on(
						"loaded",
						function () {
							a(this);
						},
						null,
						null,
						20
					);
				},
			});
		})(),
		CKEDITOR.plugins.add("listblock", {
			requires: "panel",
			onLoad: function () {
				var a = CKEDITOR.addTemplate(
						"panel-list",
						'\x3cul role\x3d"presentation" class\x3d"cke_panel_list"\x3e{items}\x3c/ul\x3e'
					),
					d = CKEDITOR.addTemplate(
						"panel-list-item",
						'\x3cli id\x3d"{id}" class\x3d"cke_panel_listItem" role\x3dpresentation\x3e\x3ca id\x3d"{id}_option" _cke_focus\x3d1 hidefocus\x3dtrue title\x3d"{title}" draggable\x3d"false" ondragstart\x3d"return false;" href\x3d"javascript:void(\'{val}\')"  {onclick}\x3d"CKEDITOR.tools.callFunction({clickFn},\'{val}\'); return false;" role\x3d"option"\x3e{text}\x3c/a\x3e\x3c/li\x3e'
					),
					b = CKEDITOR.addTemplate(
						"panel-list-group",
						'\x3ch1 id\x3d"{id}" draggable\x3d"false" ondragstart\x3d"return false;" class\x3d"cke_panel_grouptitle" role\x3d"presentation" \x3e{label}\x3c/h1\x3e'
					),
					c = /\'/g;
				CKEDITOR.ui.panel.prototype.addListBlock = function (a, b) {
					return this.addBlock(
						a,
						new CKEDITOR.ui.listBlock(this.getHolderElement(), b)
					);
				};
				CKEDITOR.ui.listBlock = CKEDITOR.tools.createClass({
					base: CKEDITOR.ui.panel.block,
					$: function (a, b) {
						b = b || {};
						var c = b.attributes || (b.attributes = {});
						(this.multiSelect = !!b.multiSelect) &&
							(c["aria-multiselectable"] = !0);
						!c.role && (c.role = "listbox");
						this.base.apply(this, arguments);
						this.element.setAttribute("role", c.role);
						c = this.keys;
						c[40] = "next";
						c[9] = "next";
						c[38] = "prev";
						c[CKEDITOR.SHIFT + 9] = "prev";
						c[32] = CKEDITOR.env.ie ? "mouseup" : "click";
						CKEDITOR.env.ie && (c[13] = "mouseup");
						this._.pendingHtml = [];
						this._.pendingList = [];
						this._.items = {};
						this._.groups = {};
					},
					_: {
						close: function () {
							if (this._.started) {
								var b = a.output({ items: this._.pendingList.join("") });
								this._.pendingList = [];
								this._.pendingHtml.push(b);
								delete this._.started;
							}
						},
						getClick: function () {
							this._.click ||
								(this._.click = CKEDITOR.tools.addFunction(function (a) {
									var b = this.toggle(a);
									if (this.onClick) this.onClick(a, b);
								}, this));
							return this._.click;
						},
					},
					proto: {
						add: function (a, b, k) {
							var h = CKEDITOR.tools.getNextId();
							this._.started ||
								((this._.started = 1), (this._.size = this._.size || 0));
							this._.items[a] = h;
							var e;
							e = CKEDITOR.tools.htmlEncodeAttr(a).replace(c, "\\'");
							a = {
								id: h,
								val: e,
								onclick: CKEDITOR.env.ie
									? 'onclick\x3d"return false;" onmouseup'
									: "onclick",
								clickFn: this._.getClick(),
								title: CKEDITOR.tools.htmlEncodeAttr(k || a),
								text: b || a,
							};
							this._.pendingList.push(d.output(a));
						},
						startGroup: function (a) {
							this._.close();
							var c = CKEDITOR.tools.getNextId();
							this._.groups[a] = c;
							this._.pendingHtml.push(b.output({ id: c, label: a }));
						},
						commit: function () {
							this._.close();
							this.element.appendHtml(this._.pendingHtml.join(""));
							delete this._.size;
							this._.pendingHtml = [];
						},
						toggle: function (a) {
							var b = this.isMarked(a);
							b ? this.unmark(a) : this.mark(a);
							return !b;
						},
						hideGroup: function (a) {
							var b =
								(a = this.element.getDocument().getById(this._.groups[a])) &&
								a.getNext();
							a &&
								(a.setStyle("display", "none"),
								b && "ul" == b.getName() && b.setStyle("display", "none"));
						},
						hideItem: function (a) {
							this.element
								.getDocument()
								.getById(this._.items[a])
								.setStyle("display", "none");
						},
						showAll: function () {
							var a = this._.items,
								b = this._.groups,
								c = this.element.getDocument(),
								d;
							for (d in a) c.getById(a[d]).setStyle("display", "");
							for (var e in b)
								(a = c.getById(b[e])),
									(d = a.getNext()),
									a.setStyle("display", ""),
									d && "ul" == d.getName() && d.setStyle("display", "");
						},
						mark: function (a) {
							this.multiSelect || this.unmarkAll();
							a = this._.items[a];
							var b = this.element.getDocument().getById(a);
							b.addClass("cke_selected");
							this.element
								.getDocument()
								.getById(a + "_option")
								.setAttribute("aria-selected", !0);
							this.onMark && this.onMark(b);
						},
						markFirstDisplayed: function () {
							var a = this;
							this._.markFirstDisplayed(function () {
								a.multiSelect || a.unmarkAll();
							});
						},
						unmark: function (a) {
							var b = this.element.getDocument();
							a = this._.items[a];
							var c = b.getById(a);
							c.removeClass("cke_selected");
							b.getById(a + "_option").removeAttribute("aria-selected");
							this.onUnmark && this.onUnmark(c);
						},
						unmarkAll: function () {
							var a = this._.items,
								b = this.element.getDocument(),
								c;
							for (c in a) {
								var d = a[c];
								b.getById(d).removeClass("cke_selected");
								b.getById(d + "_option").removeAttribute("aria-selected");
							}
							this.onUnmark && this.onUnmark();
						},
						isMarked: function (a) {
							return this.element
								.getDocument()
								.getById(this._.items[a])
								.hasClass("cke_selected");
						},
						focus: function (a) {
							this._.focusIndex = -1;
							var b = this.element.getElementsByTag("a"),
								c,
								d = -1;
							if (a)
								for (
									c = this.element
										.getDocument()
										.getById(this._.items[a])
										.getFirst();
									(a = b.getItem(++d));

								) {
									if (a.equals(c)) {
										this._.focusIndex = d;
										break;
									}
								}
							else this.element.focus();
							c &&
								setTimeout(function () {
									c.focus();
								}, 0);
						},
					},
				});
			},
		}),
		CKEDITOR.plugins.add("richcombo", {
			requires: "floatpanel,listblock,button",
			beforeInit: function (a) {
				a.ui.addHandler(CKEDITOR.UI_RICHCOMBO, CKEDITOR.ui.richCombo.handler);
			},
		}),
		(function () {
			var a =
				'\x3cspan id\x3d"{id}" class\x3d"cke_combo cke_combo__{name} {cls}" role\x3d"presentation"\x3e\x3cspan id\x3d"{id}_label" class\x3d"cke_combo_label"\x3e{label}\x3c/span\x3e\x3ca class\x3d"cke_combo_button" title\x3d"{title}" tabindex\x3d"-1"' +
				(CKEDITOR.env.gecko && !CKEDITOR.env.hc
					? ""
					: " href\x3d\"javascript:void('{titleJs}')\"") +
				' hidefocus\x3d"true" role\x3d"button" aria-labelledby\x3d"{id}_label" aria-haspopup\x3d"listbox"';
			CKEDITOR.env.gecko &&
				CKEDITOR.env.mac &&
				(a += ' onkeypress\x3d"return false;"');
			CKEDITOR.env.gecko &&
				(a += ' onblur\x3d"this.style.cssText \x3d this.style.cssText;"');
			var a =
					a +
					(' onkeydown\x3d"return CKEDITOR.tools.callFunction({keydownFn},event,this);" onfocus\x3d"return CKEDITOR.tools.callFunction({focusFn},event);" ' +
						(CKEDITOR.env.ie
							? 'onclick\x3d"return false;" onmouseup'
							: "onclick") +
						'\x3d"CKEDITOR.tools.callFunction({clickFn},this);return false;"\x3e\x3cspan id\x3d"{id}_text" class\x3d"cke_combo_text cke_combo_inlinelabel"\x3e{label}\x3c/span\x3e\x3cspan class\x3d"cke_combo_open"\x3e\x3cspan class\x3d"cke_combo_arrow"\x3e' +
						(CKEDITOR.env.hc
							? "\x26#9660;"
							: CKEDITOR.env.air
							? "\x26nbsp;"
							: "") +
						"\x3c/span\x3e\x3c/span\x3e\x3c/a\x3e\x3c/span\x3e"),
				d = CKEDITOR.addTemplate("combo", a);
			CKEDITOR.UI_RICHCOMBO = "richcombo";
			CKEDITOR.ui.richCombo = CKEDITOR.tools.createClass({
				$: function (a) {
					CKEDITOR.tools.extend(this, a, {
						canGroup: !1,
						title: a.label,
						modes: { wysiwyg: 1 },
						editorFocus: 1,
					});
					a = this.panel || {};
					delete this.panel;
					this.id = CKEDITOR.tools.getNextNumber();
					this.document =
						(a.parent && a.parent.getDocument()) || CKEDITOR.document;
					a.className = "cke_combopanel";
					a.block = { multiSelect: a.multiSelect, attributes: a.attributes };
					a.toolbarRelated = !0;
					this._ = { panelDefinition: a, items: {}, listeners: [] };
				},
				proto: {
					renderHtml: function (a) {
						var c = [];
						this.render(a, c);
						return c.join("");
					},
					render: function (a, c) {
						function g() {
							if (this.getState() != CKEDITOR.TRISTATE_ON) {
								var c = this.modes[a.mode]
									? CKEDITOR.TRISTATE_OFF
									: CKEDITOR.TRISTATE_DISABLED;
								a.readOnly &&
									!this.readOnly &&
									(c = CKEDITOR.TRISTATE_DISABLED);
								this.setState(c);
								this.setValue("");
								c != CKEDITOR.TRISTATE_DISABLED &&
									this.refresh &&
									this.refresh();
							}
						}
						var l = CKEDITOR.env,
							k = "cke_" + this.id,
							h = CKEDITOR.tools.addFunction(function (c) {
								r && (a.unlockSelection(1), (r = 0));
								m.execute(c);
							}, this),
							e = this,
							m = {
								id: k,
								combo: this,
								focus: function () {
									CKEDITOR.document.getById(k).getChild(1).focus();
								},
								execute: function (c) {
									var f = e._;
									if (f.state != CKEDITOR.TRISTATE_DISABLED)
										if ((e.createPanel(a), f.on)) f.panel.hide();
										else {
											e.commit();
											var d = e.getValue();
											d ? f.list.mark(d) : f.list.unmarkAll();
											f.panel.showBlock(e.id, new CKEDITOR.dom.element(c), 4);
										}
								},
								clickFn: h,
							};
						this._.listeners.push(a.on("activeFilterChange", g, this));
						this._.listeners.push(a.on("mode", g, this));
						this._.listeners.push(a.on("selectionChange", g, this));
						!this.readOnly && this._.listeners.push(a.on("readOnly", g, this));
						var f = CKEDITOR.tools.addFunction(function (a, b) {
								a = new CKEDITOR.dom.event(a);
								var c = a.getKeystroke();
								switch (c) {
									case 13:
									case 32:
									case 40:
										CKEDITOR.tools.callFunction(h, b);
										break;
									default:
										m.onkey(m, c);
								}
								a.preventDefault();
							}),
							n = CKEDITOR.tools.addFunction(function () {
								m.onfocus && m.onfocus();
							}),
							r = 0;
						m.keyDownFn = f;
						l = {
							id: k,
							name: this.name || this.command,
							label: this.label,
							title: this.title,
							cls: this.className || "",
							titleJs:
								l.gecko && !l.hc ? "" : (this.title || "").replace("'", ""),
							keydownFn: f,
							focusFn: n,
							clickFn: h,
						};
						d.output(l, c);
						if (this.onRender) this.onRender();
						return m;
					},
					createPanel: function (a) {
						if (!this._.panel) {
							var c = this._.panelDefinition,
								d = this._.panelDefinition.block,
								l = c.parent || CKEDITOR.document.getBody(),
								k = "cke_combopanel__" + this.name,
								h = new CKEDITOR.ui.floatPanel(a, l, c),
								c = h.addListBlock(this.id, d),
								e = this;
							h.onShow = function () {
								this.element.addClass(k);
								e.setState(CKEDITOR.TRISTATE_ON);
								e._.on = 1;
								e.editorFocus && !a.focusManager.hasFocus && a.focus();
								if (e.onOpen) e.onOpen();
							};
							h.onHide = function (c) {
								this.element.removeClass(k);
								e.setState(
									e.modes && e.modes[a.mode]
										? CKEDITOR.TRISTATE_OFF
										: CKEDITOR.TRISTATE_DISABLED
								);
								e._.on = 0;
								if (!c && e.onClose) e.onClose();
							};
							h.onEscape = function () {
								h.hide(1);
							};
							c.onClick = function (a, b) {
								e.onClick && e.onClick.call(e, a, b);
								h.hide();
							};
							this._.panel = h;
							this._.list = c;
							h.getBlock(this.id).onHide = function () {
								e._.on = 0;
								e.setState(CKEDITOR.TRISTATE_OFF);
							};
							this.init && this.init();
						}
					},
					setValue: function (a, c) {
						this._.value = a;
						var d = this.document.getById("cke_" + this.id + "_text");
						d &&
							(a || c
								? d.removeClass("cke_combo_inlinelabel")
								: ((c = this.label), d.addClass("cke_combo_inlinelabel")),
							d.setText("undefined" != typeof c ? c : a));
					},
					getValue: function () {
						return this._.value || "";
					},
					unmarkAll: function () {
						this._.list.unmarkAll();
					},
					mark: function (a) {
						this._.list.mark(a);
					},
					hideItem: function (a) {
						this._.list.hideItem(a);
					},
					hideGroup: function (a) {
						this._.list.hideGroup(a);
					},
					showAll: function () {
						this._.list.showAll();
					},
					add: function (a, c, d) {
						this._.items[a] = d || a;
						this._.list.add(a, c, d);
					},
					startGroup: function (a) {
						this._.list.startGroup(a);
					},
					commit: function () {
						this._.committed ||
							(this._.list.commit(),
							(this._.committed = 1),
							CKEDITOR.ui.fire("ready", this));
						this._.committed = 1;
					},
					setState: function (a) {
						if (this._.state != a) {
							var c = this.document.getById("cke_" + this.id);
							c.setState(a, "cke_combo");
							a == CKEDITOR.TRISTATE_DISABLED
								? c.setAttribute("aria-disabled", !0)
								: c.removeAttribute("aria-disabled");
							this._.state = a;
						}
					},
					getState: function () {
						return this._.state;
					},
					enable: function () {
						this._.state == CKEDITOR.TRISTATE_DISABLED &&
							this.setState(this._.lastState);
					},
					disable: function () {
						this._.state != CKEDITOR.TRISTATE_DISABLED &&
							((this._.lastState = this._.state),
							this.setState(CKEDITOR.TRISTATE_DISABLED));
					},
					destroy: function () {
						CKEDITOR.tools.array.forEach(this._.listeners, function (a) {
							a.removeListener();
						});
						this._.listeners = [];
					},
				},
				statics: {
					handler: {
						create: function (a) {
							return new CKEDITOR.ui.richCombo(a);
						},
					},
				},
			});
			CKEDITOR.ui.prototype.addRichCombo = function (a, c) {
				this.add(a, CKEDITOR.UI_RICHCOMBO, c);
			};
		})(),
		CKEDITOR.plugins.add("format", {
			requires: "richcombo",
			init: function (a) {
				if (!a.blockless) {
					for (
						var d = a.config,
							b = a.lang.format,
							c = d.format_tags.split(";"),
							g = {},
							l = 0,
							k = [],
							h = 0;
						h < c.length;
						h++
					) {
						var e = c[h],
							m = new CKEDITOR.style(d["format_" + e]);
						if (!a.filter.customConfig || a.filter.check(m))
							l++,
								(g[e] = m),
								(g[e]._.enterMode = a.config.enterMode),
								k.push(m);
					}
					0 !== l &&
						a.ui.addRichCombo("Format", {
							label: b.label,
							title: b.panelTitle,
							toolbar: "styles,20",
							allowedContent: k,
							panel: {
								css: [CKEDITOR.skin.getPath("editor")].concat(d.contentsCss),
								multiSelect: !1,
								attributes: { "aria-label": b.panelTitle },
							},
							init: function () {
								this.startGroup(b.panelTitle);
								for (var a in g) {
									var c = b["tag_" + a];
									this.add(a, g[a].buildPreview(c), c);
								}
							},
							onClick: function (b) {
								a.focus();
								a.fire("saveSnapshot");
								b = g[b];
								var c = a.elementPath();
								b.checkActive(c, a) || a.applyStyle(b);
								setTimeout(function () {
									a.fire("saveSnapshot");
								}, 0);
							},
							onRender: function () {
								a.on(
									"selectionChange",
									function (b) {
										var c = this.getValue();
										b = b.data.path;
										this.refresh();
										for (var e in g)
											if (g[e].checkActive(b, a)) {
												e != c && this.setValue(e, a.lang.format["tag_" + e]);
												return;
											}
										this.setValue("");
									},
									this
								);
							},
							onOpen: function () {
								this.showAll();
								for (var b in g) a.activeFilter.check(g[b]) || this.hideItem(b);
							},
							refresh: function () {
								var b = a.elementPath();
								if (b) {
									if (b.isContextFor("p"))
										for (var c in g) if (a.activeFilter.check(g[c])) return;
									this.setState(CKEDITOR.TRISTATE_DISABLED);
								}
							},
						});
				}
			},
		}),
		(CKEDITOR.config.format_tags = "p;h1;h2;h3;h4;h5;h6;pre;address;div"),
		(CKEDITOR.config.format_p = { element: "p" }),
		(CKEDITOR.config.format_div = { element: "div" }),
		(CKEDITOR.config.format_pre = { element: "pre" }),
		(CKEDITOR.config.format_address = { element: "address" }),
		(CKEDITOR.config.format_h1 = { element: "h1" }),
		(CKEDITOR.config.format_h2 = { element: "h2" }),
		(CKEDITOR.config.format_h3 = { element: "h3" }),
		(CKEDITOR.config.format_h4 = { element: "h4" }),
		(CKEDITOR.config.format_h5 = { element: "h5" }),
		(CKEDITOR.config.format_h6 = { element: "h6" }),
		(function () {
			var a = {
				canUndo: !1,
				exec: function (a) {
					var b = a.document.createElement("hr");
					a.insertElement(b);
				},
				allowedContent: "hr",
				requiredContent: "hr",
			};
			CKEDITOR.plugins.add("horizontalrule", {
				init: function (d) {
					d.blockless ||
						(d.addCommand("horizontalrule", a),
						d.ui.addButton &&
							d.ui.addButton("HorizontalRule", {
								label: d.lang.horizontalrule.toolbar,
								command: "horizontalrule",
								toolbar: "insert,40",
							}));
				},
			});
		})(),
		CKEDITOR.plugins.add("htmlwriter", {
			init: function (a) {
				var d = new CKEDITOR.htmlWriter();
				d.forceSimpleAmpersand = a.config.forceSimpleAmpersand;
				d.indentationChars = a.config.dataIndentationChars || "\t";
				a.dataProcessor.writer = d;
			},
		}),
		(CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({
			base: CKEDITOR.htmlParser.basicWriter,
			$: function () {
				this.base();
				this.indentationChars = "\t";
				this.selfClosingEnd = " /\x3e";
				this.lineBreakChars = "\n";
				this.sortAttributes = 1;
				this._.indent = 0;
				this._.indentation = "";
				this._.inPre = 0;
				this._.rules = {};
				var a = CKEDITOR.dtd,
					d;
				for (d in CKEDITOR.tools.extend(
					{},
					a.$nonBodyContent,
					a.$block,
					a.$listItem,
					a.$tableContent
				))
					this.setRules(d, {
						indent: !a[d]["#"],
						breakBeforeOpen: 1,
						breakBeforeClose: !a[d]["#"],
						breakAfterClose: 1,
						needsSpace: d in a.$block && !(d in { li: 1, dt: 1, dd: 1 }),
					});
				this.setRules("br", { breakAfterOpen: 1 });
				this.setRules("title", { indent: 0, breakAfterOpen: 0 });
				this.setRules("style", { indent: 0, breakBeforeClose: 1 });
				this.setRules("pre", { breakAfterOpen: 1, indent: 0 });
			},
			proto: {
				openTag: function (a) {
					var d = this._.rules[a];
					this._.afterCloser &&
						d &&
						d.needsSpace &&
						this._.needsSpace &&
						this._.output.push("\n");
					this._.indent
						? this.indentation()
						: d && d.breakBeforeOpen && (this.lineBreak(), this.indentation());
					this._.output.push("\x3c", a);
					this._.afterCloser = 0;
				},
				openTagClose: function (a, d) {
					var b = this._.rules[a];
					d
						? (this._.output.push(this.selfClosingEnd),
						  b && b.breakAfterClose && (this._.needsSpace = b.needsSpace))
						: (this._.output.push("\x3e"),
						  b && b.indent && (this._.indentation += this.indentationChars));
					b && b.breakAfterOpen && this.lineBreak();
					"pre" == a && (this._.inPre = 1);
				},
				attribute: function (a, d) {
					"string" == typeof d &&
						((d = CKEDITOR.tools.htmlEncodeAttr(d)),
						this.forceSimpleAmpersand && (d = d.replace(/&amp;/g, "\x26")));
					this._.output.push(" ", a, '\x3d"', d, '"');
				},
				closeTag: function (a) {
					var d = this._.rules[a];
					d &&
						d.indent &&
						(this._.indentation = this._.indentation.substr(
							this.indentationChars.length
						));
					this._.indent
						? this.indentation()
						: d && d.breakBeforeClose && (this.lineBreak(), this.indentation());
					this._.output.push("\x3c/", a, "\x3e");
					"pre" == a && (this._.inPre = 0);
					d &&
						d.breakAfterClose &&
						(this.lineBreak(), (this._.needsSpace = d.needsSpace));
					this._.afterCloser = 1;
				},
				text: function (a) {
					this._.indent &&
						(this.indentation(),
						!this._.inPre && (a = CKEDITOR.tools.ltrim(a)));
					this._.output.push(a);
				},
				comment: function (a) {
					this._.indent && this.indentation();
					this._.output.push("\x3c!--", a, "--\x3e");
				},
				lineBreak: function () {
					!this._.inPre &&
						0 < this._.output.length &&
						this._.output.push(this.lineBreakChars);
					this._.indent = 1;
				},
				indentation: function () {
					!this._.inPre &&
						this._.indentation &&
						this._.output.push(this._.indentation);
					this._.indent = 0;
				},
				reset: function () {
					this._.output = [];
					this._.indent = 0;
					this._.indentation = "";
					this._.afterCloser = 0;
					this._.inPre = 0;
					this._.needsSpace = 0;
				},
				setRules: function (a, d) {
					var b = this._.rules[a];
					b ? CKEDITOR.tools.extend(b, d, !0) : (this._.rules[a] = d);
				},
			},
		})),
		(function () {
			function a(a, c) {
				c || (c = a.getSelection().getSelectedElement());
				if (c && c.is("img") && !c.data("cke-realelement") && !c.isReadOnly())
					return c;
			}
			function d(a) {
				var c = a.getStyle("float");
				if ("inherit" == c || "none" == c) c = 0;
				c || (c = a.getAttribute("align"));
				return c;
			}
			CKEDITOR.plugins.add("image", {
				requires: "dialog",
				init: function (b) {
					if (!b.plugins.detectConflict("image", ["easyimage", "image2"])) {
						CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
						var c =
							"img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
						CKEDITOR.dialog.isTabEnabled(b, "image", "advanced") &&
							(c = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)");
						b.addCommand(
							"image",
							new CKEDITOR.dialogCommand("image", {
								allowedContent: c,
								requiredContent: "img[alt,src]",
								contentTransformations: [
									["img{width}: sizeToStyle", "img[width]: sizeToAttribute"],
									[
										"img{float}: alignmentToStyle",
										"img[align]: alignmentToAttribute",
									],
								],
							})
						);
						b.ui.addButton &&
							b.ui.addButton("Image", {
								label: b.lang.common.image,
								command: "image",
								toolbar: "insert,10",
							});
						b.on("doubleclick", function (a) {
							var b = a.data.element;
							!b.is("img") ||
								b.data("cke-realelement") ||
								b.isReadOnly() ||
								(a.data.dialog = "image");
						});
						b.addMenuItems &&
							b.addMenuItems({
								image: {
									label: b.lang.image.menu,
									command: "image",
									group: "image",
								},
							});
						b.contextMenu &&
							b.contextMenu.addListener(function (c) {
								if (a(b, c)) return { image: CKEDITOR.TRISTATE_OFF };
							});
					}
				},
				afterInit: function (b) {
					function c(c) {
						var l = b.getCommand("justify" + c);
						if (l) {
							if ("left" == c || "right" == c)
								l.on("exec", function (k) {
									var h = a(b),
										e;
									h &&
										((e = d(h)),
										e == c
											? (h.removeStyle("float"),
											  c == d(h) && h.removeAttribute("align"))
											: h.setStyle("float", c),
										k.cancel());
								});
							l.on("refresh", function (k) {
								var h = a(b);
								h &&
									((h = d(h)),
									this.setState(
										h == c
											? CKEDITOR.TRISTATE_ON
											: "right" == c || "left" == c
											? CKEDITOR.TRISTATE_OFF
											: CKEDITOR.TRISTATE_DISABLED
									),
									k.cancel());
							});
						}
					}
					b.plugins.image2 || (c("left"), c("right"), c("center"), c("block"));
				},
			});
		})(),
		(CKEDITOR.config.image_removeLinkByEmptyURL = !0),
		(function () {
			function a(a, b) {
				var d = c.exec(a),
					e = c.exec(b);
				if (d) {
					if (!d[2] && "px" == e[2]) return e[1];
					if ("px" == d[2] && !e[2]) return e[1] + "px";
				}
				return b;
			}
			var d = CKEDITOR.htmlParser.cssStyle,
				b = CKEDITOR.tools.cssLength,
				c = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i,
				g = {
					elements: {
						$: function (b) {
							var c = b.attributes;
							if (
								(c =
									(c =
										(c = c && c["data-cke-realelement"]) &&
										new CKEDITOR.htmlParser.fragment.fromHtml(
											decodeURIComponent(c)
										)) && c.children[0]) &&
								b.attributes["data-cke-resizable"]
							) {
								var g = new d(b).rules;
								b = c.attributes;
								var e = g.width,
									g = g.height;
								e && (b.width = a(b.width, e));
								g && (b.height = a(b.height, g));
							}
							return c;
						},
					},
				};
			CKEDITOR.plugins.add("fakeobjects", {
				init: function (a) {
					a.filter.allow(
						"img[!data-cke-realelement,src,alt,title](*){*}",
						"fakeobjects"
					);
				},
				afterInit: function (a) {
					(a = (a = a.dataProcessor) && a.htmlFilter) &&
						a.addRules(g, { applyToAll: !0 });
				},
			});
			CKEDITOR.editor.prototype.createFakeElement = function (a, c, g, e) {
				var m = this.lang.fakeobjects,
					m = m[g] || m.unknown;
				c = {
					class: c,
					"data-cke-realelement": encodeURIComponent(a.getOuterHtml()),
					"data-cke-real-node-type": a.type,
					alt: m,
					title: m,
					align: a.getAttribute("align") || "",
				};
				CKEDITOR.env.hc || (c.src = CKEDITOR.tools.transparentImageData);
				g && (c["data-cke-real-element-type"] = g);
				e &&
					((c["data-cke-resizable"] = e),
					(g = new d()),
					(e = a.getAttribute("width")),
					(a = a.getAttribute("height")),
					e && (g.rules.width = b(e)),
					a && (g.rules.height = b(a)),
					g.populate(c));
				return this.document.createElement("img", { attributes: c });
			};
			CKEDITOR.editor.prototype.createFakeParserElement = function (
				a,
				c,
				g,
				e
			) {
				var m = this.lang.fakeobjects,
					m = m[g] || m.unknown,
					f;
				f = new CKEDITOR.htmlParser.basicWriter();
				a.writeHtml(f);
				f = f.getHtml();
				c = {
					class: c,
					"data-cke-realelement": encodeURIComponent(f),
					"data-cke-real-node-type": a.type,
					alt: m,
					title: m,
					align: a.attributes.align || "",
				};
				CKEDITOR.env.hc || (c.src = CKEDITOR.tools.transparentImageData);
				g && (c["data-cke-real-element-type"] = g);
				e &&
					((c["data-cke-resizable"] = e),
					(e = a.attributes),
					(a = new d()),
					(g = e.width),
					(e = e.height),
					void 0 !== g && (a.rules.width = b(g)),
					void 0 !== e && (a.rules.height = b(e)),
					a.populate(c));
				return new CKEDITOR.htmlParser.element("img", c);
			};
			CKEDITOR.editor.prototype.restoreRealElement = function (b) {
				if (b.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT) return null;
				var c = CKEDITOR.dom.element.createFromHtml(
					decodeURIComponent(b.data("cke-realelement")),
					this.document
				);
				if (b.data("cke-resizable")) {
					var d = b.getStyle("width");
					b = b.getStyle("height");
					d && c.setAttribute("width", a(c.getAttribute("width"), d));
					b && c.setAttribute("height", a(c.getAttribute("height"), b));
				}
				return c;
			};
		})(),
		"use strict",
		(function () {
			function a(a) {
				return a.replace(/'/g, "\\$\x26");
			}
			function d(a) {
				for (var b, c = a.length, e = [], f = 0; f < c; f++)
					(b = a.charCodeAt(f)), e.push(b);
				return "String.fromCharCode(" + e.join(",") + ")";
			}
			function b(b, c) {
				var e = b.plugins.link,
					f = e.compiledProtectionFunction.params,
					d,
					g;
				g = [e.compiledProtectionFunction.name, "("];
				for (var h = 0; h < f.length; h++)
					(e = f[h].toLowerCase()),
						(d = c[e]),
						0 < h && g.push(","),
						g.push("'", d ? a(encodeURIComponent(c[e])) : "", "'");
				g.push(")");
				return g.join("");
			}
			function c(a) {
				a = a.config.emailProtection || "";
				var b;
				a &&
					"encode" != a &&
					((b = {}),
					a.replace(/^([^(]+)\(([^)]+)\)$/, function (a, c, e) {
						b.name = c;
						b.params = [];
						e.replace(/[^,\s]+/g, function (a) {
							b.params.push(a);
						});
					}));
				return b;
			}
			CKEDITOR.plugins.add("link", {
				requires: "dialog,fakeobjects",
				onLoad: function () {
					function a(b) {
						return c
							.replace(/%1/g, "rtl" == b ? "right" : "left")
							.replace(/%2/g, "cke_contents_" + b);
					}
					var b =
							"background:url(" +
							CKEDITOR.getUrl(
								this.path +
									"images" +
									(CKEDITOR.env.hidpi ? "/hidpi" : "") +
									"/anchor.png"
							) +
							") no-repeat %1 center;border:1px dotted #00f;background-size:16px;",
						c =
							".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" +
							b +
							"padding-%1:18px;cursor:auto;}.%2 img.cke_anchor{" +
							b +
							"width:16px;min-height:15px;height:1.15em;vertical-align:text-bottom;}";
					CKEDITOR.addCss(a("ltr") + a("rtl"));
				},
				init: function (a) {
					var b = "a[!href]";
					CKEDITOR.dialog.isTabEnabled(a, "link", "advanced") &&
						(b = b.replace(
							"]",
							",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type,download]{*}(*)"
						));
					CKEDITOR.dialog.isTabEnabled(a, "link", "target") &&
						(b = b.replace("]", ",target,onclick]"));
					a.addCommand(
						"link",
						new CKEDITOR.dialogCommand("link", {
							allowedContent: b,
							requiredContent: "a[href]",
						})
					);
					a.addCommand(
						"anchor",
						new CKEDITOR.dialogCommand("anchor", {
							allowedContent: "a[!name,id]",
							requiredContent: "a[name]",
						})
					);
					a.addCommand("unlink", new CKEDITOR.unlinkCommand());
					a.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand());
					a.setKeystroke(CKEDITOR.CTRL + 76, "link");
					a.setKeystroke(CKEDITOR.CTRL + 75, "link");
					a.ui.addButton &&
						(a.ui.addButton("Link", {
							label: a.lang.link.toolbar,
							command: "link",
							toolbar: "links,10",
						}),
						a.ui.addButton("Unlink", {
							label: a.lang.link.unlink,
							command: "unlink",
							toolbar: "links,20",
						}),
						a.ui.addButton("Anchor", {
							label: a.lang.link.anchor.toolbar,
							command: "anchor",
							toolbar: "links,30",
						}));
					CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
					CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
					a.on(
						"doubleclick",
						function (b) {
							var c = b.data.element.getAscendant({ a: 1, img: 1 }, !0);
							c &&
								!c.isReadOnly() &&
								(c.is("a")
									? ((b.data.dialog =
											!c.getAttribute("name") ||
											(c.getAttribute("href") && c.getChildCount())
												? "link"
												: "anchor"),
									  (b.data.link = c))
									: CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, c) &&
									  (b.data.dialog = "anchor"));
						},
						null,
						null,
						0
					);
					a.on(
						"doubleclick",
						function (b) {
							b.data.dialog in { link: 1, anchor: 1 } &&
								b.data.link &&
								a.getSelection().selectElement(b.data.link);
						},
						null,
						null,
						20
					);
					a.addMenuItems &&
						a.addMenuItems({
							anchor: {
								label: a.lang.link.anchor.menu,
								command: "anchor",
								group: "anchor",
								order: 1,
							},
							removeAnchor: {
								label: a.lang.link.anchor.remove,
								command: "removeAnchor",
								group: "anchor",
								order: 5,
							},
							link: {
								label: a.lang.link.menu,
								command: "link",
								group: "link",
								order: 1,
							},
							unlink: {
								label: a.lang.link.unlink,
								command: "unlink",
								group: "link",
								order: 5,
							},
						});
					a.contextMenu &&
						a.contextMenu.addListener(function (b) {
							if (!b || b.isReadOnly()) return null;
							b = CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b);
							if (!b && !(b = CKEDITOR.plugins.link.getSelectedLink(a)))
								return null;
							var c = {};
							b.getAttribute("href") &&
								b.getChildCount() &&
								(c = {
									link: CKEDITOR.TRISTATE_OFF,
									unlink: CKEDITOR.TRISTATE_OFF,
								});
							b &&
								b.hasAttribute("name") &&
								(c.anchor = c.removeAnchor = CKEDITOR.TRISTATE_OFF);
							return c;
						});
					this.compiledProtectionFunction = c(a);
				},
				afterInit: function (a) {
					a.dataProcessor.dataFilter.addRules({
						elements: {
							a: function (b) {
								return b.attributes.name
									? b.children.length
										? null
										: a.createFakeParserElement(b, "cke_anchor", "anchor")
									: null;
							},
						},
					});
					var b = a._.elementsPath && a._.elementsPath.filters;
					b &&
						b.push(function (b, c) {
							if (
								"a" == c &&
								(CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b) ||
									(b.getAttribute("name") &&
										(!b.getAttribute("href") || !b.getChildCount())))
							)
								return "anchor";
						});
				},
			});
			var g = /^javascript:/,
				l = /^mailto:([^?]+)(?:\?(.+))?$/,
				k = /subject=([^;?:@&=$,\/]*)/i,
				h = /body=([^;?:@&=$,\/]*)/i,
				e = /^#(.*)$/,
				m = /^((?:http|https|ftp|news):\/\/)?(.*)$/,
				f = /^(_(?:self|top|parent|blank))$/,
				n = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/,
				r = /^javascript:([^(]+)\(([^)]+)\)$/,
				x = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/,
				v = /(?:^|,)([^=]+)=(\d+|yes|no)/gi,
				p = /^tel:(.*)$/,
				u = {
					id: "advId",
					dir: "advLangDir",
					accessKey: "advAccessKey",
					name: "advName",
					lang: "advLangCode",
					tabindex: "advTabIndex",
					title: "advTitle",
					type: "advContentType",
					class: "advCSSClasses",
					charset: "advCharset",
					style: "advStyles",
					rel: "advRel",
				};
			CKEDITOR.plugins.link = {
				getSelectedLink: function (a, b) {
					var c = a.getSelection(),
						e = c.getSelectedElement(),
						f = c.getRanges(),
						d = [],
						g;
					if (!b && e && e.is("a")) return e;
					for (e = 0; e < f.length; e++)
						if (
							((g = c.getRanges()[e]),
							g.shrink(CKEDITOR.SHRINK_ELEMENT, !0, { skipBogus: !0 }),
							(g = a.elementPath(g.getCommonAncestor()).contains("a", 1)) && b)
						)
							d.push(g);
						else if (g) return g;
					return b ? d : null;
				},
				getEditorAnchors: function (a) {
					for (
						var b = a.editable(),
							c = b.isInline() && !a.plugins.divarea ? a.document : b,
							b = c.getElementsByTag("a"),
							c = c.getElementsByTag("img"),
							e = [],
							f = 0,
							d;
						(d = b.getItem(f++));

					)
						(d.data("cke-saved-name") || d.hasAttribute("name")) &&
							e.push({
								name: d.data("cke-saved-name") || d.getAttribute("name"),
								id: d.getAttribute("id"),
							});
					for (f = 0; (d = c.getItem(f++)); )
						(d = this.tryRestoreFakeAnchor(a, d)) &&
							e.push({
								name: d.getAttribute("name"),
								id: d.getAttribute("id"),
							});
					return e;
				},
				fakeAnchor: !0,
				tryRestoreFakeAnchor: function (a, b) {
					if (
						b &&
						b.data("cke-real-element-type") &&
						"anchor" == b.data("cke-real-element-type")
					) {
						var c = a.restoreRealElement(b);
						if (c.data("cke-saved-name")) return c;
					}
				},
				parseLinkAttributes: function (a, b) {
					var c =
							(b && (b.data("cke-saved-href") || b.getAttribute("href"))) || "",
						d = a.plugins.link.compiledProtectionFunction,
						y = a.config.emailProtection,
						C,
						B = {};
					c.match(g) &&
						("encode" == y
							? (c = c.replace(n, function (a, b, c) {
									c = c || "";
									return (
										"mailto:" +
										String.fromCharCode.apply(String, b.split(",")) +
										c.replace(/\\'/g, "'")
									);
							  }))
							: y &&
							  c.replace(r, function (a, b, c) {
									if (b == d.name) {
										B.type = "email";
										a = B.email = {};
										b = /(^')|('$)/g;
										c = c.match(/[^,\s]+/g);
										for (var e = c.length, f, g, h = 0; h < e; h++)
											(f = decodeURIComponent),
												(g = c[h].replace(b, "").replace(/\\'/g, "'")),
												(g = f(g)),
												(f = d.params[h].toLowerCase()),
												(a[f] = g);
										a.address = [a.name, a.domain].join("@");
									}
							  }));
					if (!B.type)
						if ((y = c.match(e)))
							(B.type = "anchor"),
								(B.anchor = {}),
								(B.anchor.name = B.anchor.id = y[1]);
						else if ((y = c.match(p))) (B.type = "tel"), (B.tel = y[1]);
						else if ((y = c.match(l))) {
							C = c.match(k);
							c = c.match(h);
							B.type = "email";
							var A = (B.email = {});
							A.address = y[1];
							C && (A.subject = decodeURIComponent(C[1]));
							c && (A.body = decodeURIComponent(c[1]));
						} else
							c &&
								(C = c.match(m)) &&
								((B.type = "url"),
								(B.url = {}),
								(B.url.protocol = C[1]),
								(B.url.url = C[2]));
					if (b) {
						if ((c = b.getAttribute("target")))
							B.target = { type: c.match(f) ? c : "frame", name: c };
						else if (
							(c =
								(c = b.data("cke-pa-onclick") || b.getAttribute("onclick")) &&
								c.match(x))
						)
							for (
								B.target = { type: "popup", name: c[1] };
								(y = v.exec(c[2]));

							)
								("yes" != y[2] && "1" != y[2]) ||
								y[1] in { height: 1, width: 1, top: 1, left: 1 }
									? isFinite(y[2]) && (B.target[y[1]] = y[2])
									: (B.target[y[1]] = !0);
						null !== b.getAttribute("download") && (B.download = !0);
						var c = {},
							H;
						for (H in u) (y = b.getAttribute(H)) && (c[u[H]] = y);
						if ((H = b.data("cke-saved-name") || c.advName)) c.advName = H;
						CKEDITOR.tools.isEmpty(c) || (B.advanced = c);
					}
					return B;
				},
				getLinkAttributes: function (c, e) {
					var f = c.config.emailProtection || "",
						g = {};
					switch (e.type) {
						case "url":
							var f =
									e.url && void 0 !== e.url.protocol
										? e.url.protocol
										: "http://",
								h = (e.url && CKEDITOR.tools.trim(e.url.url)) || "";
							g["data-cke-saved-href"] = 0 === h.indexOf("/") ? h : f + h;
							break;
						case "anchor":
							f = e.anchor && e.anchor.id;
							g["data-cke-saved-href"] =
								"#" + ((e.anchor && e.anchor.name) || f || "");
							break;
						case "email":
							var k = e.email,
								h = k.address;
							switch (f) {
								case "":
								case "encode":
									var m = encodeURIComponent(k.subject || ""),
										l = encodeURIComponent(k.body || ""),
										k = [];
									m && k.push("subject\x3d" + m);
									l && k.push("body\x3d" + l);
									k = k.length ? "?" + k.join("\x26") : "";
									"encode" == f
										? ((f = [
												"javascript:void(location.href\x3d'mailto:'+",
												d(h),
										  ]),
										  k && f.push("+'", a(k), "'"),
										  f.push(")"))
										: (f = ["mailto:", h, k]);
									break;
								default:
									(f = h.split("@", 2)),
										(k.name = f[0]),
										(k.domain = f[1]),
										(f = ["javascript:", b(c, k)]);
							}
							g["data-cke-saved-href"] = f.join("");
							break;
						case "tel":
							g["data-cke-saved-href"] = "tel:" + e.tel;
					}
					if (e.target)
						if ("popup" == e.target.type) {
							for (
								var f = [
										"window.open(this.href, '",
										e.target.name || "",
										"', '",
									],
									n = "resizable status location toolbar menubar fullscreen scrollbars dependent".split(
										" "
									),
									h = n.length,
									m = function (a) {
										e.target[a] && n.push(a + "\x3d" + e.target[a]);
									},
									k = 0;
								k < h;
								k++
							)
								n[k] += e.target[n[k]] ? "\x3dyes" : "\x3dno";
							m("width");
							m("left");
							m("height");
							m("top");
							f.push(n.join(","), "'); return false;");
							g["data-cke-pa-onclick"] = f.join("");
						} else
							"notSet" != e.target.type &&
								e.target.name &&
								(g.target = e.target.name);
					e.download && (g.download = "");
					if (e.advanced) {
						for (var r in u) (f = e.advanced[u[r]]) && (g[r] = f);
						g.name && (g["data-cke-saved-name"] = g.name);
					}
					g["data-cke-saved-href"] && (g.href = g["data-cke-saved-href"]);
					r = {
						target: 1,
						onclick: 1,
						"data-cke-pa-onclick": 1,
						"data-cke-saved-name": 1,
						download: 1,
					};
					e.advanced && CKEDITOR.tools.extend(r, u);
					for (var p in g) delete r[p];
					return { set: g, removed: CKEDITOR.tools.objectKeys(r) };
				},
				showDisplayTextForElement: function (a, b) {
					var c = {
							img: 1,
							table: 1,
							tbody: 1,
							thead: 1,
							tfoot: 1,
							input: 1,
							select: 1,
							textarea: 1,
						},
						e = b.getSelection();
					return (b.widgets && b.widgets.focused) ||
						(e && 1 < e.getRanges().length)
						? !1
						: !a || !a.getName || !a.is(c);
				},
			};
			CKEDITOR.unlinkCommand = function () {};
			CKEDITOR.unlinkCommand.prototype = {
				exec: function (a) {
					if (CKEDITOR.env.ie) {
						var b = a.getSelection().getRanges()[0],
							c =
								(b.getPreviousEditableNode() &&
									b.getPreviousEditableNode().getAscendant("a", !0)) ||
								(b.getNextEditableNode() &&
									b.getNextEditableNode().getAscendant("a", !0)),
							e;
						b.collapsed &&
							c &&
							((e = b.createBookmark()), b.selectNodeContents(c), b.select());
					}
					c = new CKEDITOR.style({
						element: "a",
						type: CKEDITOR.STYLE_INLINE,
						alwaysRemoveElement: 1,
					});
					a.removeStyle(c);
					e && (b.moveToBookmark(e), b.select());
				},
				refresh: function (a, b) {
					var c = b.lastElement && b.lastElement.getAscendant("a", !0);
					c && "a" == c.getName() && c.getAttribute("href") && c.getChildCount()
						? this.setState(CKEDITOR.TRISTATE_OFF)
						: this.setState(CKEDITOR.TRISTATE_DISABLED);
				},
				contextSensitive: 1,
				startDisabled: 1,
				requiredContent: "a[href]",
				editorFocus: 1,
			};
			CKEDITOR.removeAnchorCommand = function () {};
			CKEDITOR.removeAnchorCommand.prototype = {
				exec: function (a) {
					var b = a.getSelection(),
						c = b.createBookmarks(),
						e;
					if (
						b &&
						(e = b.getSelectedElement()) &&
						(e.getChildCount()
							? e.is("a")
							: CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, e))
					)
						e.remove(1);
					else if ((e = CKEDITOR.plugins.link.getSelectedLink(a)))
						e.hasAttribute("href")
							? (e.removeAttributes({ name: 1, "data-cke-saved-name": 1 }),
							  e.removeClass("cke_anchor"))
							: e.remove(1);
					b.selectBookmarks(c);
				},
				requiredContent: "a[name]",
			};
			CKEDITOR.tools.extend(CKEDITOR.config, {
				linkShowAdvancedTab: !0,
				linkShowTargetTab: !0,
			});
		})(),
		"use strict",
		(function () {
			function a(a, b, c) {
				return (
					n(b) &&
					n(c) &&
					c.equals(
						b.getNext(function (a) {
							return !(aa(a) || ba(a) || r(a));
						})
					)
				);
			}
			function d(a) {
				this.upper = a[0];
				this.lower = a[1];
				this.set.apply(this, a.slice(2));
			}
			function b(a) {
				var b = a.element;
				if (
					b &&
					n(b) &&
					(b = b.getAscendant(a.triggers, !0)) &&
					a.editable.contains(b)
				) {
					var c = k(b);
					if ("true" == c.getAttribute("contenteditable")) return b;
					if (c.is(a.triggers)) return c;
				}
				return null;
			}
			function c(a, b, c) {
				t(a, b);
				t(a, c);
				a = b.size.bottom;
				c = c.size.top;
				return a && c ? 0 | ((a + c) / 2) : a || c;
			}
			function g(a, b, c) {
				return (b = b[c ? "getPrevious" : "getNext"](function (b) {
					return (
						(b && b.type == CKEDITOR.NODE_TEXT && !aa(b)) ||
						(n(b) && !r(b) && !f(a, b))
					);
				}));
			}
			function l(a, b, c) {
				return a > b && a < c;
			}
			function k(a, b) {
				if (a.data("cke-editable")) return null;
				for (b || (a = a.getParent()); a && !a.data("cke-editable"); ) {
					if (a.hasAttribute("contenteditable")) return a;
					a = a.getParent();
				}
				return null;
			}
			function h(a) {
				var b = a.doc,
					c = G(
						'\x3cspan contenteditable\x3d"false" data-cke-magic-line\x3d"1" style\x3d"' +
							U +
							"position:absolute;border-top:1px dashed " +
							a.boxColor +
							'"\x3e\x3c/span\x3e',
						b
					),
					f = CKEDITOR.getUrl(
						this.path +
							"images/" +
							(J.hidpi ? "hidpi/" : "") +
							"icon" +
							(a.rtl ? "-rtl" : "") +
							".png"
					);
				A(c, {
					attach: function () {
						this.wrap.getParent() || this.wrap.appendTo(a.editable, !0);
						return this;
					},
					lineChildren: [
						A(
							G(
								'\x3cspan title\x3d"' +
									a.editor.lang.magicline.title +
									'" contenteditable\x3d"false"\x3e\x26#8629;\x3c/span\x3e',
								b
							),
							{
								base:
									U +
									"height:17px;width:17px;" +
									(a.rtl ? "left" : "right") +
									":17px;background:url(" +
									f +
									") center no-repeat " +
									a.boxColor +
									";cursor:pointer;" +
									(J.hc
										? "font-size: 15px;line-height:14px;border:1px solid #fff;text-align:center;"
										: "") +
									(J.hidpi ? "background-size: 9px 10px;" : ""),
								looks: [
									"top:-8px; border-radius: 2px;",
									"top:-17px; border-radius: 2px 2px 0px 0px;",
									"top:-1px; border-radius: 0px 0px 2px 2px;",
								],
							}
						),
						A(G(N, b), {
							base: S + "left:0px;border-left-color:" + a.boxColor + ";",
							looks: [
								"border-width:8px 0 8px 8px;top:-8px",
								"border-width:8px 0 0 8px;top:-8px",
								"border-width:0 0 8px 8px;top:0px",
							],
						}),
						A(G(N, b), {
							base: S + "right:0px;border-right-color:" + a.boxColor + ";",
							looks: [
								"border-width:8px 8px 8px 0;top:-8px",
								"border-width:8px 8px 0 0;top:-8px",
								"border-width:0 8px 8px 0;top:0px",
							],
						}),
					],
					detach: function () {
						this.wrap.getParent() && this.wrap.remove();
						return this;
					},
					mouseNear: function () {
						t(a, this);
						var b = a.holdDistance,
							c = this.size;
						return c &&
							l(a.mouse.y, c.top - b, c.bottom + b) &&
							l(a.mouse.x, c.left - b, c.right + b)
							? !0
							: !1;
					},
					place: function () {
						var b = a.view,
							c = a.editable,
							e = a.trigger,
							f = e.upper,
							d = e.lower,
							g = f || d,
							h = g.getParent(),
							k = {};
						this.trigger = e;
						f && t(a, f, !0);
						d && t(a, d, !0);
						t(a, h, !0);
						a.inInlineMode && y(a, !0);
						h.equals(c)
							? ((k.left = b.scroll.x), (k.right = -b.scroll.x), (k.width = ""))
							: ((k.left =
									g.size.left -
									g.size.margin.left +
									b.scroll.x -
									(a.inInlineMode
										? b.editable.left + b.editable.border.left
										: 0)),
							  (k.width =
									g.size.outerWidth +
									g.size.margin.left +
									g.size.margin.right +
									b.scroll.x),
							  (k.right = ""));
						f && d
							? (k.top =
									f.size.margin.bottom === d.size.margin.top
										? 0 | (f.size.bottom + f.size.margin.bottom / 2)
										: f.size.margin.bottom < d.size.margin.top
										? f.size.bottom + f.size.margin.bottom
										: f.size.bottom + f.size.margin.bottom - d.size.margin.top)
							: f
							? d || (k.top = f.size.bottom + f.size.margin.bottom)
							: (k.top = d.size.top - d.size.margin.top);
						e.is(R) || l(k.top, b.scroll.y - 15, b.scroll.y + 5)
							? ((k.top = a.inInlineMode ? 0 : b.scroll.y), this.look(R))
							: e.is(K) || l(k.top, b.pane.bottom - 5, b.pane.bottom + 15)
							? ((k.top = a.inInlineMode
									? b.editable.height +
									  b.editable.padding.top +
									  b.editable.padding.bottom
									: b.pane.bottom - 1),
							  this.look(K))
							: (a.inInlineMode &&
									(k.top -= b.editable.top + b.editable.border.top),
							  this.look(W));
						a.inInlineMode &&
							(k.top--,
							(k.top += b.editable.scroll.top),
							(k.left += b.editable.scroll.left));
						for (var m in k) k[m] = CKEDITOR.tools.cssLength(k[m]);
						this.setStyles(k);
					},
					look: function (a) {
						if (this.oldLook != a) {
							for (var b = this.lineChildren.length, c; b--; )
								(c = this.lineChildren[b]).setAttribute(
									"style",
									c.base + c.looks[0 | (a / 2)]
								);
							this.oldLook = a;
						}
					},
					wrap: new H("span", a.doc),
				});
				for (b = c.lineChildren.length; b--; ) c.lineChildren[b].appendTo(c);
				c.look(W);
				c.appendTo(c.wrap);
				c.unselectable();
				c.lineChildren[0].on("mouseup", function (b) {
					c.detach();
					e(
						a,
						function (b) {
							var c = a.line.trigger;
							b[c.is(I) ? "insertBefore" : "insertAfter"](
								c.is(I) ? c.lower : c.upper
							);
						},
						!0
					);
					a.editor.focus();
					J.ie ||
						a.enterMode == CKEDITOR.ENTER_BR ||
						a.hotNode.scrollIntoView();
					b.data.preventDefault(!0);
				});
				c.on("mousedown", function (a) {
					a.data.preventDefault(!0);
				});
				a.line = c;
			}
			function e(a, b, c) {
				var e = new CKEDITOR.dom.range(a.doc),
					f = a.editor,
					d;
				J.ie && a.enterMode == CKEDITOR.ENTER_BR
					? (d = a.doc.createText(V))
					: ((d =
							((d = k(a.element, !0)) && d.data("cke-enter-mode")) ||
							a.enterMode),
					  (d = new H(L[d], a.doc)),
					  d.is("br") || a.doc.createText(V).appendTo(d));
				c && f.fire("saveSnapshot");
				b(d);
				e.moveToPosition(d, CKEDITOR.POSITION_AFTER_START);
				f.getSelection().selectRanges([e]);
				a.hotNode = d;
				c && f.fire("saveSnapshot");
			}
			function m(a, c) {
				return {
					canUndo: !0,
					modes: { wysiwyg: 1 },
					exec: (function () {
						function f(b) {
							var d = J.ie && 9 > J.version ? " " : V,
								g =
									a.hotNode &&
									a.hotNode.getText() == d &&
									a.element.equals(a.hotNode) &&
									a.lastCmdDirection === !!c;
							e(a, function (e) {
								g && a.hotNode && a.hotNode.remove();
								e[c ? "insertAfter" : "insertBefore"](b);
								e.setAttributes({
									"data-cke-magicline-hot": 1,
									"data-cke-magicline-dir": !!c,
								});
								a.lastCmdDirection = !!c;
							});
							J.ie ||
								a.enterMode == CKEDITOR.ENTER_BR ||
								a.hotNode.scrollIntoView();
							a.line.detach();
						}
						return function (e) {
							e = e.getSelection().getStartElement();
							var d;
							e = e.getAscendant(P, 1);
							if (
								!p(a, e) &&
								e &&
								!e.equals(a.editable) &&
								!e.contains(a.editable)
							) {
								(d = k(e)) &&
									"false" == d.getAttribute("contenteditable") &&
									(e = d);
								a.element = e;
								d = g(a, e, !c);
								var h;
								n(d) &&
								d.is(a.triggers) &&
								d.is(O) &&
								(!g(a, d, !c) ||
									((h = g(a, d, !c)) && n(h) && h.is(a.triggers)))
									? f(d)
									: ((h = b(a, e)),
									  n(h) &&
											(g(a, h, !c)
												? (e = g(a, h, !c)) && n(e) && e.is(a.triggers) && f(h)
												: f(h)));
							}
						};
					})(),
				};
			}
			function f(a, b) {
				if (!b || b.type != CKEDITOR.NODE_ELEMENT || !b.$) return !1;
				var c = a.line;
				return c.wrap.equals(b) || c.wrap.contains(b);
			}
			function n(a) {
				return a && a.type == CKEDITOR.NODE_ELEMENT && a.$;
			}
			function r(a) {
				if (!n(a)) return !1;
				var b;
				(b = x(a)) ||
					(n(a)
						? ((b = { left: 1, right: 1, center: 1 }),
						  (b = !(
								!b[a.getComputedStyle("float")] && !b[a.getAttribute("align")]
						  )))
						: (b = !1));
				return b;
			}
			function x(a) {
				return !!{ absolute: 1, fixed: 1 }[a.getComputedStyle("position")];
			}
			function v(a, b) {
				return n(b) ? b.is(a.triggers) : null;
			}
			function p(a, b) {
				if (!b) return !1;
				for (var c = b.getParents(1), e = c.length; e--; )
					for (var f = a.tabuList.length; f--; )
						if (c[e].hasAttribute(a.tabuList[f])) return !0;
				return !1;
			}
			function u(a, b, c) {
				b = b[c ? "getLast" : "getFirst"](function (b) {
					return a.isRelevant(b) && !b.is(da);
				});
				if (!b) return !1;
				t(a, b);
				return c ? b.size.top > a.mouse.y : b.size.bottom < a.mouse.y;
			}
			function w(a) {
				var b = a.editable,
					c = a.mouse,
					e = a.view,
					g = a.triggerOffset;
				y(a);
				var h =
						c.y >
						(a.inInlineMode
							? e.editable.top + e.editable.height / 2
							: Math.min(e.editable.height, e.pane.height) / 2),
					b = b[h ? "getLast" : "getFirst"](function (a) {
						return !(aa(a) || ba(a));
					});
				if (!b) return null;
				f(a, b) &&
					(b = a.line.wrap[h ? "getPrevious" : "getNext"](function (a) {
						return !(aa(a) || ba(a));
					}));
				if (!n(b) || r(b) || !v(a, b)) return null;
				t(a, b);
				return !h && 0 <= b.size.top && l(c.y, 0, b.size.top + g)
					? ((a = a.inInlineMode || 0 === e.scroll.y ? R : W),
					  new d([null, b, I, T, a]))
					: h &&
					  b.size.bottom <= e.pane.height &&
					  l(c.y, b.size.bottom - g, e.pane.height)
					? ((a =
							a.inInlineMode ||
							l(b.size.bottom, e.pane.height - g, e.pane.height)
								? K
								: W),
					  new d([b, null, D, T, a]))
					: null;
			}
			function q(a) {
				var c = a.mouse,
					e = a.view,
					f = a.triggerOffset,
					h = b(a);
				if (!h) return null;
				t(a, h);
				var f = Math.min(f, 0 | (h.size.outerHeight / 2)),
					k = [],
					m,
					q;
				if (l(c.y, h.size.top - 1, h.size.top + f)) q = !1;
				else if (l(c.y, h.size.bottom - f, h.size.bottom + 1)) q = !0;
				else return null;
				if (r(h) || u(a, h, q) || h.getParent().is(X)) return null;
				var N = g(a, h, !q);
				if (N) {
					if (N && N.type == CKEDITOR.NODE_TEXT) return null;
					if (n(N)) {
						if (r(N) || !v(a, N) || N.getParent().is(X)) return null;
						k = [N, h][q ? "reverse" : "concat"]().concat([Q, T]);
					}
				} else
					h.equals(a.editable[q ? "getLast" : "getFirst"](a.isRelevant))
						? (y(a),
						  q &&
						  l(c.y, h.size.bottom - f, e.pane.height) &&
						  l(h.size.bottom, e.pane.height - f, e.pane.height)
								? (m = K)
								: l(c.y, 0, h.size.top + f) && (m = R))
						: (m = W),
						(k = [null, h]
							[q ? "reverse" : "concat"]()
							.concat([
								q ? D : I,
								T,
								m,
								h.equals(a.editable[q ? "getLast" : "getFirst"](a.isRelevant))
									? q
										? K
										: R
									: W,
							]));
				return 0 in k ? new d(k) : null;
			}
			function z(a, b, c, e) {
				for (
					var f = b.getDocumentPosition(),
						d = {},
						g = {},
						h = {},
						k = {},
						m = ca.length;
					m--;

				)
					(d[ca[m]] =
						parseInt(
							b.getComputedStyle.call(b, "border-" + ca[m] + "-width"),
							10
						) || 0),
						(h[ca[m]] =
							parseInt(b.getComputedStyle.call(b, "padding-" + ca[m]), 10) ||
							0),
						(g[ca[m]] =
							parseInt(b.getComputedStyle.call(b, "margin-" + ca[m]), 10) || 0);
				(c && !e) || C(a, e);
				k.top = f.y - (c ? 0 : a.view.scroll.y);
				k.left = f.x - (c ? 0 : a.view.scroll.x);
				k.outerWidth = b.$.offsetWidth;
				k.outerHeight = b.$.offsetHeight;
				k.height = k.outerHeight - (h.top + h.bottom + d.top + d.bottom);
				k.width = k.outerWidth - (h.left + h.right + d.left + d.right);
				k.bottom = k.top + k.outerHeight;
				k.right = k.left + k.outerWidth;
				a.inInlineMode &&
					(k.scroll = { top: b.$.scrollTop, left: b.$.scrollLeft });
				return A({ border: d, padding: h, margin: g, ignoreScroll: c }, k, !0);
			}
			function t(a, b, c) {
				if (!n(b)) return (b.size = null);
				if (!b.size) b.size = {};
				else if (b.size.ignoreScroll == c && b.size.date > new Date() - M)
					return null;
				return A(b.size, z(a, b, c), { date: +new Date() }, !0);
			}
			function y(a, b) {
				a.view.editable = z(a, a.editable, b, !0);
			}
			function C(a, b) {
				a.view || (a.view = {});
				var c = a.view;
				if (!(!b && c && c.date > new Date() - M)) {
					var e = a.win,
						c = e.getScrollPosition(),
						e = e.getViewPaneSize();
					A(
						a.view,
						{
							scroll: {
								x: c.x,
								y: c.y,
								width: a.doc.$.documentElement.scrollWidth - e.width,
								height: a.doc.$.documentElement.scrollHeight - e.height,
							},
							pane: {
								width: e.width,
								height: e.height,
								bottom: e.height + c.y,
							},
							date: +new Date(),
						},
						!0
					);
				}
			}
			function B(a, b, c, e) {
				for (
					var f = e,
						g = e,
						h = 0,
						k = !1,
						m = !1,
						l = a.view.pane.height,
						n = a.mouse;
					n.y + h < l && 0 < n.y - h;

				) {
					k || (k = b(f, e));
					m || (m = b(g, e));
					!k && 0 < n.y - h && (f = c(a, { x: n.x, y: n.y - h }));
					!m && n.y + h < l && (g = c(a, { x: n.x, y: n.y + h }));
					if (k && m) break;
					h += 2;
				}
				return new d([f, g, null, null]);
			}
			CKEDITOR.plugins.add("magicline", {
				init: function (a) {
					var c = a.config,
						k = c.magicline_triggerOffset || 30,
						l = {
							editor: a,
							enterMode: c.enterMode,
							triggerOffset: k,
							holdDistance: 0 | (k * (c.magicline_holdDistance || 0.5)),
							boxColor: c.magicline_color || "#ff0000",
							rtl: "rtl" == c.contentsLangDirection,
							tabuList: ["data-cke-hidden-sel"].concat(
								c.magicline_tabuList || []
							),
							triggers: c.magicline_everywhere
								? P
								: {
										table: 1,
										hr: 1,
										div: 1,
										ul: 1,
										ol: 1,
										dl: 1,
										form: 1,
										blockquote: 1,
								  },
						},
						N,
						t,
						u;
					l.isRelevant = function (a) {
						return n(a) && !f(l, a) && !r(a);
					};
					a.on(
						"contentDom",
						function () {
							var k = a.editable(),
								n = a.document,
								B = a.window;
							A(
								l,
								{
									editable: k,
									inInlineMode: k.isInline(),
									doc: n,
									win: B,
									hotNode: null,
								},
								!0
							);
							l.boundary = l.inInlineMode
								? l.editable
								: l.doc.getDocumentElement();
							k.is(F.$inline) ||
								(l.inInlineMode &&
									!x(k) &&
									k.setStyles({ position: "relative", top: null, left: null }),
								h.call(this, l),
								C(l),
								k.attachListener(a, "beforeUndoImage", function () {
									l.line.detach();
								}),
								k.attachListener(
									a,
									"beforeGetData",
									function () {
										l.line.wrap.getParent() &&
											(l.line.detach(),
											a.once(
												"getData",
												function () {
													l.line.attach();
												},
												null,
												null,
												1e3
											));
									},
									null,
									null,
									0
								),
								k.attachListener(
									l.inInlineMode ? n : n.getWindow().getFrame(),
									"mouseout",
									function (b) {
										if ("wysiwyg" == a.mode)
											if (l.inInlineMode) {
												var c = b.data.$.clientX;
												b = b.data.$.clientY;
												C(l);
												y(l, !0);
												var e = l.view.editable,
													f = l.view.scroll;
												(c > e.left - f.x &&
													c < e.right - f.x &&
													b > e.top - f.y &&
													b < e.bottom - f.y) ||
													(clearTimeout(u), (u = null), l.line.detach());
											} else clearTimeout(u), (u = null), l.line.detach();
									}
								),
								k.attachListener(k, "keyup", function () {
									l.hiddenMode = 0;
								}),
								k.attachListener(k, "keydown", function (b) {
									if ("wysiwyg" == a.mode)
										switch (b.data.getKeystroke()) {
											case 2228240:
											case 16:
												(l.hiddenMode = 1), l.line.detach();
										}
								}),
								k.attachListener(
									l.inInlineMode ? k : n,
									"mousemove",
									function (b) {
										t = !0;
										if ("wysiwyg" == a.mode && !a.readOnly && !u) {
											var c = { x: b.data.$.clientX, y: b.data.$.clientY };
											u = setTimeout(function () {
												l.mouse = c;
												u = l.trigger = null;
												C(l);
												t &&
													!l.hiddenMode &&
													a.focusManager.hasFocus &&
													!l.line.mouseNear() &&
													(l.element = Y(l, !0)) &&
													((l.trigger = w(l) || q(l) || Z(l)) &&
													!p(l, l.trigger.upper || l.trigger.lower)
														? l.line.attach().place()
														: ((l.trigger = null), l.line.detach()),
													(t = !1));
											}, 30);
										}
									}
								),
								k.attachListener(B, "scroll", function () {
									"wysiwyg" == a.mode &&
										(l.line.detach(),
										J.webkit &&
											((l.hiddenMode = 1),
											clearTimeout(N),
											(N = setTimeout(function () {
												l.mouseDown || (l.hiddenMode = 0);
											}, 50))));
								}),
								k.attachListener(E ? n : B, "mousedown", function () {
									"wysiwyg" == a.mode &&
										(l.line.detach(), (l.hiddenMode = 1), (l.mouseDown = 1));
								}),
								k.attachListener(E ? n : B, "mouseup", function () {
									l.hiddenMode = 0;
									l.mouseDown = 0;
								}),
								a.addCommand("accessPreviousSpace", m(l)),
								a.addCommand("accessNextSpace", m(l, !0)),
								a.setKeystroke([
									[c.magicline_keystrokePrevious, "accessPreviousSpace"],
									[c.magicline_keystrokeNext, "accessNextSpace"],
								]),
								a.on("loadSnapshot", function () {
									var b, c, e, f;
									for (f in { p: 1, br: 1, div: 1 })
										for (
											b = a.document.getElementsByTag(f), e = b.count();
											e--;

										)
											if ((c = b.getItem(e)).data("cke-magicline-hot")) {
												l.hotNode = c;
												l.lastCmdDirection =
													"true" === c.data("cke-magicline-dir") ? !0 : !1;
												return;
											}
								}),
								(this.backdoor = {
									accessFocusSpace: e,
									boxTrigger: d,
									isLine: f,
									getAscendantTrigger: b,
									getNonEmptyNeighbour: g,
									getSize: z,
									that: l,
									triggerEdge: q,
									triggerEditable: w,
									triggerExpand: Z,
								}));
						},
						this
					);
				},
			});
			var A = CKEDITOR.tools.extend,
				H = CKEDITOR.dom.element,
				G = H.createFromHtml,
				J = CKEDITOR.env,
				E = CKEDITOR.env.ie && 9 > CKEDITOR.env.version,
				F = CKEDITOR.dtd,
				L = {},
				I = 128,
				D = 64,
				Q = 32,
				T = 16,
				R = 4,
				K = 2,
				W = 1,
				V = " ",
				X = F.$listItem,
				da = F.$tableContent,
				O = A({}, F.$nonEditable, F.$empty),
				P = F.$block,
				M = 100,
				U =
					"width:0px;height:0px;padding:0px;margin:0px;display:block;z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;",
				S = U + "border-color:transparent;display:block;border-style:solid;",
				N = "\x3cspan\x3e" + V + "\x3c/span\x3e";
			L[CKEDITOR.ENTER_BR] = "br";
			L[CKEDITOR.ENTER_P] = "p";
			L[CKEDITOR.ENTER_DIV] = "div";
			d.prototype = {
				set: function (a, b, c) {
					this.properties = a + b + (c || W);
					return this;
				},
				is: function (a) {
					return (this.properties & a) == a;
				},
			};
			var Y = (function () {
					function a(b, c) {
						var e = b.$.elementFromPoint(c.x, c.y);
						return e && e.nodeType ? new CKEDITOR.dom.element(e) : null;
					}
					return function (b, c, e) {
						if (!b.mouse) return null;
						var d = b.doc,
							g = b.line.wrap;
						e = e || b.mouse;
						var h = a(d, e);
						c && f(b, h) && (g.hide(), (h = a(d, e)), g.show());
						return !h ||
							h.type != CKEDITOR.NODE_ELEMENT ||
							!h.$ ||
							(J.ie &&
								9 > J.version &&
								!b.boundary.equals(h) &&
								!b.boundary.contains(h))
							? null
							: h;
					};
				})(),
				aa = CKEDITOR.dom.walker.whitespaces(),
				ba = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_COMMENT),
				Z = (function () {
					function b(f) {
						var d = f.element,
							g,
							h,
							k;
						if (!n(d) || d.contains(f.editable) || d.isReadOnly()) return null;
						k = B(
							f,
							function (a, b) {
								return !b.equals(a);
							},
							function (a, b) {
								return Y(a, !0, b);
							},
							d
						);
						g = k.upper;
						h = k.lower;
						if (a(f, g, h)) return k.set(Q, 8);
						if (g && d.contains(g))
							for (; !g.getParent().equals(d); ) g = g.getParent();
						else
							g = d.getFirst(function (a) {
								return e(f, a);
							});
						if (h && d.contains(h))
							for (; !h.getParent().equals(d); ) h = h.getParent();
						else
							h = d.getLast(function (a) {
								return e(f, a);
							});
						if (!g || !h) return null;
						t(f, g);
						t(f, h);
						if (!l(f.mouse.y, g.size.top, h.size.bottom)) return null;
						for (
							var d = Number.MAX_VALUE, m, q, N, u;
							h && !h.equals(g) && (q = g.getNext(f.isRelevant));

						)
							(m = Math.abs(c(f, g, q) - f.mouse.y)),
								m < d && ((d = m), (N = g), (u = q)),
								(g = q),
								t(f, g);
						if (!N || !u || !l(f.mouse.y, N.size.top, u.size.bottom))
							return null;
						k.upper = N;
						k.lower = u;
						return k.set(Q, 8);
					}
					function e(a, b) {
						return !(
							(b && b.type == CKEDITOR.NODE_TEXT) ||
							ba(b) ||
							r(b) ||
							f(a, b) ||
							(b.type == CKEDITOR.NODE_ELEMENT && b.$ && b.is("br"))
						);
					}
					return function (c) {
						var e = b(c),
							f;
						if ((f = e)) {
							f = e.upper;
							var d = e.lower;
							f =
								!f ||
								!d ||
								r(d) ||
								r(f) ||
								d.equals(f) ||
								f.equals(d) ||
								d.contains(f) ||
								f.contains(d)
									? !1
									: v(c, f) && v(c, d) && a(c, f, d)
									? !0
									: !1;
						}
						return f ? e : null;
					};
				})(),
				ca = ["top", "left", "right", "bottom"];
		})(),
		(CKEDITOR.config.magicline_keystrokePrevious =
			CKEDITOR.CTRL + CKEDITOR.SHIFT + 51),
		(CKEDITOR.config.magicline_keystrokeNext =
			CKEDITOR.CTRL + CKEDITOR.SHIFT + 52),
		(function () {
			function a(a) {
				if (!a || a.type != CKEDITOR.NODE_ELEMENT || "form" != a.getName())
					return [];
				for (var b = [], c = ["style", "className"], e = 0; e < c.length; e++) {
					var d = a.$.elements.namedItem(c[e]);
					d &&
						((d = new CKEDITOR.dom.element(d)),
						b.push([d, d.nextSibling]),
						d.remove());
				}
				return b;
			}
			function d(a, b) {
				if (
					a &&
					a.type == CKEDITOR.NODE_ELEMENT &&
					"form" == a.getName() &&
					0 < b.length
				)
					for (var c = b.length - 1; 0 <= c; c--) {
						var e = b[c][0],
							d = b[c][1];
						d ? e.insertBefore(d) : e.appendTo(a);
					}
			}
			function b(b, c) {
				var g = a(b),
					e = {},
					m = b.$;
				c || ((e["class"] = m.className || ""), (m.className = ""));
				e.inline = m.style.cssText || "";
				c || (m.style.cssText = "position: static; overflow: visible");
				d(g);
				return e;
			}
			function c(b, c) {
				var g = a(b),
					e = b.$;
				"class" in c && (e.className = c["class"]);
				"inline" in c && (e.style.cssText = c.inline);
				d(g);
			}
			function g(a) {
				if (!a.editable().isInline()) {
					var b = CKEDITOR.instances,
						c;
					for (c in b) {
						var e = b[c];
						"wysiwyg" != e.mode ||
							e.readOnly ||
							((e = e.document.getBody()),
							e.setAttribute("contentEditable", !1),
							e.setAttribute("contentEditable", !0));
					}
					a.editable().hasFocus && (a.toolbox.focus(), a.focus());
				}
			}
			CKEDITOR.plugins.add("maximize", {
				init: function (a) {
					function d() {
						var b = m.getViewPaneSize();
						a.resize(b.width, b.height, null, !0);
					}
					if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
						var h = a.lang,
							e = CKEDITOR.document,
							m = e.getWindow(),
							f,
							n,
							r,
							x = CKEDITOR.TRISTATE_OFF;
						a.addCommand("maximize", {
							modes: { wysiwyg: !CKEDITOR.env.iOS, source: !CKEDITOR.env.iOS },
							readOnly: 1,
							editorFocus: !1,
							exec: function () {
								var v = a.container.getFirst(function (a) {
										return (
											a.type == CKEDITOR.NODE_ELEMENT && a.hasClass("cke_inner")
										);
									}),
									p = a.ui.space("contents");
								if ("wysiwyg" == a.mode) {
									var u = a.getSelection();
									f = u && u.getRanges();
									n = m.getScrollPosition();
								} else {
									var w = a.editable().$;
									f = !CKEDITOR.env.ie && [w.selectionStart, w.selectionEnd];
									n = [w.scrollLeft, w.scrollTop];
								}
								if (this.state == CKEDITOR.TRISTATE_OFF) {
									m.on("resize", d);
									r = m.getScrollPosition();
									for (u = a.container; (u = u.getParent()); )
										u.setCustomData("maximize_saved_styles", b(u)),
											u.setStyle("z-index", a.config.baseFloatZIndex - 5);
									p.setCustomData("maximize_saved_styles", b(p, !0));
									v.setCustomData("maximize_saved_styles", b(v, !0));
									p = {
										overflow: CKEDITOR.env.webkit ? "" : "hidden",
										width: 0,
										height: 0,
									};
									e.getDocumentElement().setStyles(p);
									!CKEDITOR.env.gecko &&
										e.getDocumentElement().setStyle("position", "fixed");
									(CKEDITOR.env.gecko && CKEDITOR.env.quirks) ||
										e.getBody().setStyles(p);
									CKEDITOR.env.ie
										? setTimeout(function () {
												m.$.scrollTo(0, 0);
										  }, 0)
										: m.$.scrollTo(0, 0);
									v.setStyle(
										"position",
										CKEDITOR.env.gecko && CKEDITOR.env.quirks
											? "fixed"
											: "absolute"
									);
									v.$.offsetLeft;
									v.setStyles({
										"z-index": a.config.baseFloatZIndex - 5,
										left: "0px",
										top: "0px",
									});
									v.addClass("cke_maximized");
									d();
									p = v.getDocumentPosition();
									v.setStyles({ left: -1 * p.x + "px", top: -1 * p.y + "px" });
									CKEDITOR.env.gecko && g(a);
								} else if (this.state == CKEDITOR.TRISTATE_ON) {
									m.removeListener("resize", d);
									for (var u = [p, v], q = 0; q < u.length; q++)
										c(u[q], u[q].getCustomData("maximize_saved_styles")),
											u[q].removeCustomData("maximize_saved_styles");
									for (u = a.container; (u = u.getParent()); )
										c(u, u.getCustomData("maximize_saved_styles")),
											u.removeCustomData("maximize_saved_styles");
									CKEDITOR.env.ie
										? setTimeout(function () {
												m.$.scrollTo(r.x, r.y);
										  }, 0)
										: m.$.scrollTo(r.x, r.y);
									v.removeClass("cke_maximized");
									CKEDITOR.env.webkit &&
										(v.setStyle("display", "inline"),
										setTimeout(function () {
											v.setStyle("display", "block");
										}, 0));
									a.fire("resize", {
										outerHeight: a.container.$.offsetHeight,
										contentsHeight: p.$.offsetHeight,
										outerWidth: a.container.$.offsetWidth,
									});
								}
								this.toggleState();
								if ((u = this.uiItems[0]))
									(p =
										this.state == CKEDITOR.TRISTATE_OFF
											? h.maximize.maximize
											: h.maximize.minimize),
										(u = CKEDITOR.document.getById(u._.id)),
										u.getChild(1).setHtml(p),
										u.setAttribute("title", p),
										u.setAttribute("href", 'javascript:void("' + p + '");');
								"wysiwyg" == a.mode
									? f
										? (CKEDITOR.env.gecko && g(a),
										  a.getSelection().selectRanges(f),
										  (w = a.getSelection().getStartElement()) &&
												w.scrollIntoView(!0))
										: m.$.scrollTo(n.x, n.y)
									: (f && ((w.selectionStart = f[0]), (w.selectionEnd = f[1])),
									  (w.scrollLeft = n[0]),
									  (w.scrollTop = n[1]));
								f = n = null;
								x = this.state;
								a.fire("maximize", this.state);
							},
							canUndo: !1,
						});
						a.ui.addButton &&
							a.ui.addButton("Maximize", {
								label: h.maximize.maximize,
								command: "maximize",
								toolbar: "tools,10",
							});
						a.on(
							"mode",
							function () {
								var b = a.getCommand("maximize");
								b.setState(
									b.state == CKEDITOR.TRISTATE_DISABLED
										? CKEDITOR.TRISTATE_DISABLED
										: x
								);
							},
							null,
							null,
							100
						);
					}
				},
			});
		})(),
		(function () {
			function a(a, b, c) {
				var g = CKEDITOR.cleanWord;
				g
					? c()
					: ((a = CKEDITOR.getUrl(
							a.config.pasteFromWordCleanupFile || b + "filter/default.js"
					  )),
					  CKEDITOR.scriptLoader.load(a, c, null, !0));
				return !g;
			}
			CKEDITOR.plugins.add("pastefromword", {
				requires: "clipboard",
				init: function (d) {
					function b(a) {
						var b =
								CKEDITOR.plugins.pastefromword &&
								CKEDITOR.plugins.pastefromword.images,
							c,
							d = [];
						if (
							b &&
							a.editor.filter.check("img[src]") &&
							((c = b.extractTagsFromHtml(a.data.dataValue)),
							0 !== c.length &&
								((b = b.extractFromRtf(a.data.dataTransfer["text/rtf"])),
								0 !== b.length &&
									(CKEDITOR.tools.array.forEach(
										b,
										function (a) {
											d.push(
												a.type
													? "data:" +
															a.type +
															";base64," +
															CKEDITOR.tools.convertBytesToBase64(
																CKEDITOR.tools.convertHexStringToBytes(a.hex)
															)
													: null
											);
										},
										this
									),
									c.length === d.length)))
						)
							for (b = 0; b < c.length; b++)
								0 === c[b].indexOf("file://") &&
									d[b] &&
									(a.data.dataValue = a.data.dataValue.replace(c[b], d[b]));
					}
					var c = 0,
						g = this.path,
						l =
							void 0 === d.config.pasteFromWord_inlineImages
								? !0
								: d.config.pasteFromWord_inlineImages;
					d.addCommand("pastefromword", {
						canUndo: !1,
						async: !0,
						exec: function (a, b) {
							c = 1;
							a.execCommand("paste", {
								type: "html",
								notification:
									b && "undefined" !== typeof b.notification
										? b.notification
										: !0,
							});
						},
					});
					CKEDITOR.plugins.clipboard.addPasteButton(d, "PasteFromWord", {
						label: d.lang.pastefromword.toolbar,
						command: "pastefromword",
						toolbar: "clipboard,50",
					});
					d.on(
						"paste",
						function (b) {
							var h = b.data,
								e = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported
									? h.dataTransfer.getData("text/html", !0)
									: null,
								m = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported
									? h.dataTransfer.getData("text/rtf")
									: null,
								e = e || h.dataValue,
								f = { dataValue: e, dataTransfer: { "text/rtf": m } },
								m = /(class=\"?Mso|style=(?:\"|\')[^\"]*?\bmso\-|w:WordDocument|<o:\w+>|<\/font>)/,
								m =
									/<meta\s*name=(?:\"|\')?generator(?:\"|\')?\s*content=(?:\"|\')?microsoft/gi.test(
										e
									) || m.test(e);
							if (e && (c || m) && (!1 !== d.fire("pasteFromWord", f) || c)) {
								h.dontFilter = !0;
								var l = a(d, g, function () {
									if (l) d.fire("paste", h);
									else if (
										!d.config.pasteFromWordPromptCleanup ||
										c ||
										confirm(d.lang.pastefromword.confirmCleanup)
									)
										(f.dataValue = CKEDITOR.cleanWord(f.dataValue, d)),
											d.fire("afterPasteFromWord", f),
											(h.dataValue = f.dataValue),
											!0 === d.config.forcePasteAsPlainText
												? (h.type = "text")
												: CKEDITOR.plugins.clipboard.isCustomCopyCutSupported ||
												  "allow-word" !== d.config.forcePasteAsPlainText ||
												  (h.type = "html");
									c = 0;
								});
								l && b.cancel();
							}
						},
						null,
						null,
						3
					);
					if (CKEDITOR.plugins.clipboard.isCustomDataTypesSupported && l)
						d.on("afterPasteFromWord", b);
				},
			});
		})(),
		(function () {
			var a = {
				canUndo: !1,
				async: !0,
				exec: function (a, b) {
					var c = a.lang,
						g = CKEDITOR.tools.keystrokeToString(
							c.common.keyboard,
							a.getCommandKeystroke(CKEDITOR.env.ie ? a.commands.paste : this)
						),
						l =
							b && "undefined" !== typeof b.notification
								? b.notification
								: !b ||
								  !b.from ||
								  ("keystrokeHandler" === b.from && CKEDITOR.env.ie),
						c =
							l && "string" === typeof l
								? l
								: c.pastetext.pasteNotification.replace(
										/%1/,
										'\x3ckbd aria-label\x3d"' +
											g.aria +
											'"\x3e' +
											g.display +
											"\x3c/kbd\x3e"
								  );
					a.execCommand("paste", { type: "text", notification: l ? c : !1 });
				},
			};
			CKEDITOR.plugins.add("pastetext", {
				requires: "clipboard",
				init: function (d) {
					var b = CKEDITOR.env.safari
						? CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + 86
						: CKEDITOR.CTRL + CKEDITOR.SHIFT + 86;
					d.addCommand("pastetext", a);
					d.setKeystroke(b, "pastetext");
					CKEDITOR.plugins.clipboard.addPasteButton(d, "PasteText", {
						label: d.lang.pastetext.button,
						command: "pastetext",
						toolbar: "clipboard,40",
					});
					if (d.config.forcePasteAsPlainText)
						d.on("beforePaste", function (a) {
							"html" != a.data.type && (a.data.type = "text");
						});
					d.on("pasteState", function (a) {
						d.getCommand("pastetext").setState(a.data);
					});
				},
			});
		})(),
		CKEDITOR.plugins.add("removeformat", {
			init: function (a) {
				a.addCommand(
					"removeFormat",
					CKEDITOR.plugins.removeformat.commands.removeformat
				);
				a.ui.addButton &&
					a.ui.addButton("RemoveFormat", {
						label: a.lang.removeformat.toolbar,
						command: "removeFormat",
						toolbar: "cleanup,10",
					});
			},
		}),
		(CKEDITOR.plugins.removeformat = {
			commands: {
				removeformat: {
					exec: function (a) {
						for (
							var d =
									a._.removeFormatRegex ||
									(a._.removeFormatRegex = new RegExp(
										"^(?:" +
											a.config.removeFormatTags.replace(/,/g, "|") +
											")$",
										"i"
									)),
								b =
									a._.removeAttributes ||
									(a._.removeAttributes = a.config.removeFormatAttributes.split(
										","
									)),
								c = CKEDITOR.plugins.removeformat.filter,
								g = a.getSelection().getRanges().createIterator(),
								l = function (a) {
									return a.type == CKEDITOR.NODE_ELEMENT;
								},
								k = [],
								h;
							(h = g.getNextRange());

						) {
							var e = h.createBookmark();
							h = a.createRange();
							h.setStartBefore(e.startNode);
							e.endNode && h.setEndAfter(e.endNode);
							h.collapsed || h.enlarge(CKEDITOR.ENLARGE_ELEMENT);
							var m = h.createBookmark(),
								f = m.startNode,
								n = m.endNode,
								r = function (b) {
									for (
										var e = a.elementPath(b), f = e.elements, g = 1, h;
										(h = f[g]) && !h.equals(e.block) && !h.equals(e.blockLimit);
										g++
									)
										d.test(h.getName()) && c(a, h) && b.breakParent(h);
								};
							r(f);
							if (n)
								for (
									r(n), f = f.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT);
									f && !f.equals(n);

								)
									if (f.isReadOnly()) {
										if (f.getPosition(n) & CKEDITOR.POSITION_CONTAINS) break;
										f = f.getNext(l);
									} else
										(r = f.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT)),
											("img" == f.getName() && f.data("cke-realelement")) ||
												f.hasAttribute("data-cke-bookmark") ||
												!c(a, f) ||
												(d.test(f.getName())
													? f.remove(1)
													: (f.removeAttributes(b),
													  a.fire("removeFormatCleanup", f))),
											(f = r);
							m.startNode.remove();
							m.endNode && m.endNode.remove();
							h.moveToBookmark(e);
							k.push(h);
						}
						a.forceNextSelectionCheck();
						a.getSelection().selectRanges(k);
					},
				},
			},
			filter: function (a, d) {
				for (var b = a._.removeFormatFilters || [], c = 0; c < b.length; c++)
					if (!1 === b[c](d)) return !1;
				return !0;
			},
		}),
		(CKEDITOR.editor.prototype.addRemoveFormatFilter = function (a) {
			this._.removeFormatFilters || (this._.removeFormatFilters = []);
			this._.removeFormatFilters.push(a);
		}),
		(CKEDITOR.config.removeFormatTags =
			"b,big,cite,code,del,dfn,em,font,i,ins,kbd,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var"),
		(CKEDITOR.config.removeFormatAttributes =
			"class,style,lang,width,height,align,hspace,valign"),
		CKEDITOR.plugins.add("resize", {
			init: function (a) {
				function d(b) {
					var d = e.width,
						g = e.height,
						k = d + (b.data.$.screenX - h.x) * ("rtl" == l ? -1 : 1);
					b = g + (b.data.$.screenY - h.y);
					m &&
						(d = Math.max(c.resize_minWidth, Math.min(k, c.resize_maxWidth)));
					f &&
						(g = Math.max(c.resize_minHeight, Math.min(b, c.resize_maxHeight)));
					a.resize(m ? d : null, g);
				}
				function b() {
					CKEDITOR.document.removeListener("mousemove", d);
					CKEDITOR.document.removeListener("mouseup", b);
					a.document &&
						(a.document.removeListener("mousemove", d),
						a.document.removeListener("mouseup", b));
				}
				var c = a.config,
					g = a.ui.spaceId("resizer"),
					l = a.element ? a.element.getDirection(1) : "ltr";
				!c.resize_dir && (c.resize_dir = "vertical");
				void 0 === c.resize_maxWidth && (c.resize_maxWidth = 3e3);
				void 0 === c.resize_maxHeight && (c.resize_maxHeight = 3e3);
				void 0 === c.resize_minWidth && (c.resize_minWidth = 750);
				void 0 === c.resize_minHeight && (c.resize_minHeight = 250);
				if (!1 !== c.resize_enabled) {
					var k = null,
						h,
						e,
						m =
							("both" == c.resize_dir || "horizontal" == c.resize_dir) &&
							c.resize_minWidth != c.resize_maxWidth,
						f =
							("both" == c.resize_dir || "vertical" == c.resize_dir) &&
							c.resize_minHeight != c.resize_maxHeight,
						n = CKEDITOR.tools.addFunction(function (f) {
							k || (k = a.getResizable());
							e = {
								width: k.$.offsetWidth || 0,
								height: k.$.offsetHeight || 0,
							};
							h = { x: f.screenX, y: f.screenY };
							c.resize_minWidth > e.width && (c.resize_minWidth = e.width);
							c.resize_minHeight > e.height && (c.resize_minHeight = e.height);
							CKEDITOR.document.on("mousemove", d);
							CKEDITOR.document.on("mouseup", b);
							a.document &&
								(a.document.on("mousemove", d), a.document.on("mouseup", b));
							f.preventDefault && f.preventDefault();
						});
					a.on("destroy", function () {
						CKEDITOR.tools.removeFunction(n);
					});
					a.on(
						"uiSpace",
						function (b) {
							if ("bottom" == b.data.space) {
								var c = "";
								m && !f && (c = " cke_resizer_horizontal");
								!m && f && (c = " cke_resizer_vertical");
								var e =
									'\x3cspan id\x3d"' +
									g +
									'" class\x3d"cke_resizer' +
									c +
									" cke_resizer_" +
									l +
									'" title\x3d"' +
									CKEDITOR.tools.htmlEncode(a.lang.common.resize) +
									'" onmousedown\x3d"CKEDITOR.tools.callFunction(' +
									n +
									', event)"\x3e' +
									("ltr" == l ? "◢" : "◣") +
									"\x3c/span\x3e";
								"ltr" == l && "ltr" == c
									? (b.data.html += e)
									: (b.data.html = e + b.data.html);
							}
						},
						a,
						null,
						100
					);
					a.on("maximize", function (b) {
						a.ui
							.space("resizer")
							[b.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]();
					});
				}
			},
		}),
		CKEDITOR.plugins.add("menubutton", {
			requires: "button,menu",
			onLoad: function () {
				var a = function (a) {
					var b = this._,
						c = b.menu;
					b.state !== CKEDITOR.TRISTATE_DISABLED &&
						(b.on && c
							? c.hide()
							: ((b.previousState = b.state),
							  c ||
									((c = b.menu = new CKEDITOR.menu(a, {
										panel: {
											className: "cke_menu_panel",
											attributes: { "aria-label": a.lang.common.options },
										},
									})),
									(c.onHide = CKEDITOR.tools.bind(function () {
										var c = this.command
											? a.getCommand(this.command).modes
											: this.modes;
										this.setState(
											!c || c[a.mode]
												? b.previousState
												: CKEDITOR.TRISTATE_DISABLED
										);
										b.on = 0;
									}, this)),
									this.onMenu && c.addListener(this.onMenu)),
							  this.setState(CKEDITOR.TRISTATE_ON),
							  (b.on = 1),
							  setTimeout(function () {
									c.show(CKEDITOR.document.getById(b.id), 4);
							  }, 0)));
				};
				CKEDITOR.ui.menuButton = CKEDITOR.tools.createClass({
					base: CKEDITOR.ui.button,
					$: function (d) {
						delete d.panel;
						this.base(d);
						this.hasArrow = "menu";
						this.click = a;
					},
					statics: {
						handler: {
							create: function (a) {
								return new CKEDITOR.ui.menuButton(a);
							},
						},
					},
				});
			},
			beforeInit: function (a) {
				a.ui.addHandler(CKEDITOR.UI_MENUBUTTON, CKEDITOR.ui.menuButton.handler);
			},
		}),
		(CKEDITOR.UI_MENUBUTTON = "menubutton"),
		"use strict",
		CKEDITOR.plugins.add("scayt", {
			requires: "menubutton,dialog",
			tabToOpen: null,
			dialogName: "scaytDialog",
			onLoad: function (a) {
				CKEDITOR.plugins.scayt.onLoadTimestamp = new Date().getTime();
				"moono-lisa" == (CKEDITOR.skinName || a.config.skin) &&
					CKEDITOR.document.appendStyleSheet(
						this.path + "skins/" + CKEDITOR.skin.name + "/scayt.css"
					);
				CKEDITOR.document.appendStyleSheet(this.path + "dialogs/dialog.css");
			},
			init: function (a) {
				var d = this,
					b = CKEDITOR.plugins.scayt;
				this.bindEvents(a);
				this.parseConfig(a);
				this.addRule(a);
				CKEDITOR.dialog.add(
					this.dialogName,
					CKEDITOR.getUrl(this.path + "dialogs/options.js")
				);
				this.addMenuItems(a);
				var c = a.lang.scayt,
					g = CKEDITOR.env;
				a.ui.add("Scayt", CKEDITOR.UI_MENUBUTTON, {
					label: c.text_title,
					title: a.plugins.wsc ? a.lang.wsc.title : c.text_title,
					modes: { wysiwyg: !(g.ie && (8 > g.version || g.quirks)) },
					toolbar: "spellchecker,20",
					refresh: function () {
						var c = a.ui.instances.Scayt.getState();
						a.scayt &&
							(c = b.state.scayt[a.name]
								? CKEDITOR.TRISTATE_ON
								: CKEDITOR.TRISTATE_OFF);
						a.fire("scaytButtonState", c);
					},
					onRender: function () {
						var b = this;
						a.on("scaytButtonState", function (a) {
							void 0 !== typeof a.data && b.setState(a.data);
						});
					},
					onMenu: function () {
						var c = a.scayt;
						a.getMenuItem("scaytToggle").label =
							a.lang.scayt[
								c && b.state.scayt[a.name] ? "btn_disable" : "btn_enable"
							];
						var d = {
							scaytToggle: CKEDITOR.TRISTATE_OFF,
							scaytOptions: c
								? CKEDITOR.TRISTATE_OFF
								: CKEDITOR.TRISTATE_DISABLED,
							scaytLangs: c
								? CKEDITOR.TRISTATE_OFF
								: CKEDITOR.TRISTATE_DISABLED,
							scaytDict: c ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
							scaytAbout: c
								? CKEDITOR.TRISTATE_OFF
								: CKEDITOR.TRISTATE_DISABLED,
							WSC: a.plugins.wsc
								? CKEDITOR.TRISTATE_OFF
								: CKEDITOR.TRISTATE_DISABLED,
						};
						a.config.scayt_uiTabs[0] || delete d.scaytOptions;
						a.config.scayt_uiTabs[1] || delete d.scaytLangs;
						a.config.scayt_uiTabs[2] || delete d.scaytDict;
						c &&
							!CKEDITOR.plugins.scayt.isNewUdSupported(c) &&
							(delete d.scaytDict,
							(a.config.scayt_uiTabs[2] = 0),
							CKEDITOR.plugins.scayt.alarmCompatibilityMessage());
						return d;
					},
				});
				a.contextMenu &&
					a.addMenuItems &&
					(a.contextMenu.addListener(function (b, c) {
						var g = a.scayt,
							e,
							m;
						g &&
							(m = g.getSelectionNode()) &&
							((e = d.menuGenerator(a, m)),
							g.showBanner(
								"." +
									a.contextMenu._.definition.panel.className
										.split(" ")
										.join(" .")
							));
						return e;
					}),
					(a.contextMenu._.onHide = CKEDITOR.tools.override(
						a.contextMenu._.onHide,
						function (b) {
							return function () {
								var c = a.scayt;
								c && c.hideBanner();
								return b.apply(this);
							};
						}
					)));
			},
			addMenuItems: function (a) {
				var d = this,
					b = CKEDITOR.plugins.scayt;
				a.addMenuGroup("scaytButton");
				for (
					var c = a.config.scayt_contextMenuItemsOrder.split("|"), g = 0;
					g < c.length;
					g++
				)
					c[g] = "scayt_" + c[g];
				if (
					(c = ["grayt_description", "grayt_suggest", "grayt_control"].concat(
						c
					)) &&
					c.length
				)
					for (g = 0; g < c.length; g++) a.addMenuGroup(c[g], g - 10);
				a.addCommand("scaytToggle", {
					exec: function (a) {
						var c = a.scayt;
						b.state.scayt[a.name] = !b.state.scayt[a.name];
						!0 === b.state.scayt[a.name]
							? c || b.createScayt(a)
							: c && b.destroy(a);
					},
				});
				a.addCommand("scaytAbout", {
					exec: function (a) {
						a.scayt.tabToOpen = "about";
						b.openDialog(d.dialogName, a);
					},
				});
				a.addCommand("scaytOptions", {
					exec: function (a) {
						a.scayt.tabToOpen = "options";
						b.openDialog(d.dialogName, a);
					},
				});
				a.addCommand("scaytLangs", {
					exec: function (a) {
						a.scayt.tabToOpen = "langs";
						b.openDialog(d.dialogName, a);
					},
				});
				a.addCommand("scaytDict", {
					exec: function (a) {
						a.scayt.tabToOpen = "dictionaries";
						b.openDialog(d.dialogName, a);
					},
				});
				c = {
					scaytToggle: {
						label: a.lang.scayt.btn_enable,
						group: "scaytButton",
						command: "scaytToggle",
					},
					scaytAbout: {
						label: a.lang.scayt.btn_about,
						group: "scaytButton",
						command: "scaytAbout",
					},
					scaytOptions: {
						label: a.lang.scayt.btn_options,
						group: "scaytButton",
						command: "scaytOptions",
					},
					scaytLangs: {
						label: a.lang.scayt.btn_langs,
						group: "scaytButton",
						command: "scaytLangs",
					},
					scaytDict: {
						label: a.lang.scayt.btn_dictionaries,
						group: "scaytButton",
						command: "scaytDict",
					},
				};
				a.plugins.wsc &&
					(c.WSC = {
						label: a.lang.wsc.toolbar,
						group: "scaytButton",
						onClick: function () {
							var b = CKEDITOR.plugins.scayt,
								c = a.scayt,
								d =
									a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE
										? a.container.getText()
										: a.document.getBody().getText();
							(d = d.replace(/\s/g, ""))
								? (c &&
										b.state.scayt[a.name] &&
										c.setMarkupPaused &&
										c.setMarkupPaused(!0),
								  a.lockSelection(),
								  a.execCommand("checkspell"))
								: alert("Nothing to check!");
						},
					});
				a.addMenuItems(c);
			},
			bindEvents: function (a) {
				var d = CKEDITOR.plugins.scayt,
					b = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE,
					c = function () {
						d.destroy(a);
					},
					g = function () {
						!d.state.scayt[a.name] || a.readOnly || a.scayt || d.createScayt(a);
					},
					l = function () {
						var c = a.editable();
						c.attachListener(
							c,
							"focus",
							function (c) {
								CKEDITOR.plugins.scayt && !a.scayt && setTimeout(g, 0);
								c =
									CKEDITOR.plugins.scayt &&
									CKEDITOR.plugins.scayt.state.scayt[a.name] &&
									a.scayt;
								var d, f;
								if ((b || c) && a._.savedSelection) {
									c = a._.savedSelection.getSelectedElement();
									c = !c && a._.savedSelection.getRanges();
									for (var h = 0; h < c.length; h++)
										(f = c[h]),
											"string" === typeof f.startContainer.$.nodeValue &&
												((d = f.startContainer.getText().length),
												(d < f.startOffset || d < f.endOffset) &&
													a.unlockSelection(!1));
								}
							},
							this,
							null,
							-10
						);
					},
					k = function () {
						b
							? a.config.scayt_inlineModeImmediateMarkup
								? g()
								: (a.on("blur", function () {
										setTimeout(c, 0);
								  }),
								  a.on("focus", g),
								  a.focusManager.hasFocus && g())
							: g();
						l();
						var d = a.editable();
						d.attachListener(
							d,
							"mousedown",
							function (b) {
								b = b.data.getTarget();
								var c = a.widgets && a.widgets.getByElement(b);
								c &&
									(c.wrapper = b.getAscendant(function (a) {
										return a.hasAttribute("data-cke-widget-wrapper");
									}, !0));
							},
							this,
							null,
							-10
						);
					};
				a.on("contentDom", k);
				a.on("beforeCommandExec", function (b) {
					var c = a.scayt,
						g = !1,
						f = !1,
						k = !0;
					b.data.name in d.options.disablingCommandExec && "wysiwyg" == a.mode
						? c &&
						  (d.destroy(a),
						  a.fire("scaytButtonState", CKEDITOR.TRISTATE_DISABLED))
						: ("bold" !== b.data.name &&
								"italic" !== b.data.name &&
								"underline" !== b.data.name &&
								"strike" !== b.data.name &&
								"subscript" !== b.data.name &&
								"superscript" !== b.data.name &&
								"enter" !== b.data.name &&
								"cut" !== b.data.name &&
								"language" !== b.data.name) ||
						  !c ||
						  ("cut" === b.data.name && ((k = !1), (f = !0)),
						  "language" === b.data.name && (f = g = !0),
						  a.fire("reloadMarkupScayt", {
								removeOptions: {
									removeInside: k,
									forceBookmark: f,
									language: g,
								},
								timeout: 0,
						  }));
				});
				a.on("beforeSetMode", function (b) {
					if ("source" == b.data) {
						if ((b = a.scayt))
							d.destroy(a),
								a.fire("scaytButtonState", CKEDITOR.TRISTATE_DISABLED);
						a.document && a.document.getBody().removeAttribute("_jquid");
					}
				});
				a.on("afterCommandExec", function (b) {
					"wysiwyg" != a.mode ||
						("undo" != b.data.name && "redo" != b.data.name) ||
						setTimeout(function () {
							d.reloadMarkup(a.scayt);
						}, 250);
				});
				a.on("readOnly", function (b) {
					var c;
					b &&
						((c = a.scayt),
						!0 === b.editor.readOnly
							? c && c.fire("removeMarkupInDocument", {})
							: c
							? d.reloadMarkup(c)
							: "wysiwyg" == b.editor.mode &&
							  !0 === d.state.scayt[b.editor.name] &&
							  (d.createScayt(a),
							  b.editor.fire("scaytButtonState", CKEDITOR.TRISTATE_ON)));
				});
				a.on("beforeDestroy", c);
				a.on(
					"setData",
					function () {
						c();
						(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ||
							a.plugins.divarea) &&
							k();
					},
					this,
					null,
					50
				);
				a.on("reloadMarkupScayt", function (b) {
					var c = b.data && b.data.removeOptions,
						g = b.data && b.data.timeout,
						f = b.data && b.data.language,
						k = a.scayt;
					k &&
						setTimeout(function () {
							f &&
								((c.selectionNode = a.plugins.language.getCurrentLangElement(
									a
								)),
								(c.selectionNode =
									(c.selectionNode && c.selectionNode.$) || null));
							k.removeMarkupInSelectionNode(c);
							d.reloadMarkup(k);
						}, g || 0);
				});
				a.on(
					"insertElement",
					function () {
						a.fire("reloadMarkupScayt", {
							removeOptions: { forceBookmark: !0 },
						});
					},
					this,
					null,
					50
				);
				a.on(
					"insertHtml",
					function () {
						a.scayt && a.scayt.setFocused && a.scayt.setFocused(!0);
						a.fire("reloadMarkupScayt");
					},
					this,
					null,
					50
				);
				a.on(
					"insertText",
					function () {
						a.scayt && a.scayt.setFocused && a.scayt.setFocused(!0);
						a.fire("reloadMarkupScayt");
					},
					this,
					null,
					50
				);
				a.on("scaytDialogShown", function (b) {
					b.data.selectPage(a.scayt.tabToOpen);
				});
			},
			parseConfig: function (a) {
				var d = CKEDITOR.plugins.scayt;
				d.replaceOldOptionsNames(a.config);
				"boolean" !== typeof a.config.scayt_autoStartup &&
					(a.config.scayt_autoStartup = !1);
				d.state.scayt[a.name] = a.config.scayt_autoStartup;
				"boolean" !== typeof a.config.grayt_autoStartup &&
					(a.config.grayt_autoStartup = !1);
				"boolean" !== typeof a.config.scayt_inlineModeImmediateMarkup &&
					(a.config.scayt_inlineModeImmediateMarkup = !1);
				d.state.grayt[a.name] = a.config.grayt_autoStartup;
				a.config.scayt_contextCommands ||
					(a.config.scayt_contextCommands = "ignoreall|add");
				a.config.scayt_contextMenuItemsOrder ||
					(a.config.scayt_contextMenuItemsOrder =
						"suggest|moresuggest|control");
				a.config.scayt_sLang || (a.config.scayt_sLang = "en_US");
				if (
					void 0 === a.config.scayt_maxSuggestions ||
					"number" != typeof a.config.scayt_maxSuggestions ||
					0 > a.config.scayt_maxSuggestions
				)
					a.config.scayt_maxSuggestions = 3;
				if (
					void 0 === a.config.scayt_minWordLength ||
					"number" != typeof a.config.scayt_minWordLength ||
					1 > a.config.scayt_minWordLength
				)
					a.config.scayt_minWordLength = 3;
				if (
					void 0 === a.config.scayt_customDictionaryIds ||
					"string" !== typeof a.config.scayt_customDictionaryIds
				)
					a.config.scayt_customDictionaryIds = "";
				if (
					void 0 === a.config.scayt_userDictionaryName ||
					"string" !== typeof a.config.scayt_userDictionaryName
				)
					a.config.scayt_userDictionaryName = null;
				if (
					"string" === typeof a.config.scayt_uiTabs &&
					3 === a.config.scayt_uiTabs.split(",").length
				) {
					var b = [],
						c = [];
					a.config.scayt_uiTabs = a.config.scayt_uiTabs.split(",");
					CKEDITOR.tools.search(a.config.scayt_uiTabs, function (a) {
						1 === Number(a) || 0 === Number(a)
							? (c.push(!0), b.push(Number(a)))
							: c.push(!1);
					});
					null === CKEDITOR.tools.search(c, !1)
						? (a.config.scayt_uiTabs = b)
						: (a.config.scayt_uiTabs = [1, 1, 1]);
				} else a.config.scayt_uiTabs = [1, 1, 1];
				"string" != typeof a.config.scayt_serviceProtocol &&
					(a.config.scayt_serviceProtocol = null);
				"string" != typeof a.config.scayt_serviceHost &&
					(a.config.scayt_serviceHost = null);
				"string" != typeof a.config.scayt_servicePort &&
					(a.config.scayt_servicePort = null);
				"string" != typeof a.config.scayt_servicePath &&
					(a.config.scayt_servicePath = null);
				a.config.scayt_moreSuggestions ||
					(a.config.scayt_moreSuggestions = "on");
				"string" !== typeof a.config.scayt_customerId &&
					(a.config.scayt_customerId =
						"1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2");
				"string" !== typeof a.config.scayt_customPunctuation &&
					(a.config.scayt_customPunctuation = "-");
				"string" !== typeof a.config.scayt_srcUrl &&
					((d = document.location.protocol),
					(d = -1 != d.search(/https?:/) ? d : "http:"),
					(a.config.scayt_srcUrl =
						d +
						"//svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js"));
				"boolean" !== typeof CKEDITOR.config.scayt_handleCheckDirty &&
					(CKEDITOR.config.scayt_handleCheckDirty = !0);
				"boolean" !== typeof CKEDITOR.config.scayt_handleUndoRedo &&
					(CKEDITOR.config.scayt_handleUndoRedo = !0);
				CKEDITOR.config.scayt_handleUndoRedo = CKEDITOR.plugins.undo
					? CKEDITOR.config.scayt_handleUndoRedo
					: !1;
				"boolean" !== typeof a.config.scayt_multiLanguageMode &&
					(a.config.scayt_multiLanguageMode = !1);
				"object" !== typeof a.config.scayt_multiLanguageStyles &&
					(a.config.scayt_multiLanguageStyles = {});
				a.config.scayt_ignoreAllCapsWords &&
					"boolean" !== typeof a.config.scayt_ignoreAllCapsWords &&
					(a.config.scayt_ignoreAllCapsWords = !1);
				a.config.scayt_ignoreDomainNames &&
					"boolean" !== typeof a.config.scayt_ignoreDomainNames &&
					(a.config.scayt_ignoreDomainNames = !1);
				a.config.scayt_ignoreWordsWithMixedCases &&
					"boolean" !== typeof a.config.scayt_ignoreWordsWithMixedCases &&
					(a.config.scayt_ignoreWordsWithMixedCases = !1);
				a.config.scayt_ignoreWordsWithNumbers &&
					"boolean" !== typeof a.config.scayt_ignoreWordsWithNumbers &&
					(a.config.scayt_ignoreWordsWithNumbers = !1);
				if (a.config.scayt_disableOptionsStorage) {
					var d = CKEDITOR.tools.isArray(a.config.scayt_disableOptionsStorage)
							? a.config.scayt_disableOptionsStorage
							: "string" === typeof a.config.scayt_disableOptionsStorage
							? [a.config.scayt_disableOptionsStorage]
							: void 0,
						g = "all options lang ignore-all-caps-words ignore-domain-names ignore-words-with-mixed-cases ignore-words-with-numbers".split(
							" "
						),
						l = [
							"lang",
							"ignore-all-caps-words",
							"ignore-domain-names",
							"ignore-words-with-mixed-cases",
							"ignore-words-with-numbers",
						],
						k = CKEDITOR.tools.search,
						h = CKEDITOR.tools.indexOf;
					a.config.scayt_disableOptionsStorage = (function (a) {
						for (var b = [], c = 0; c < a.length; c++) {
							var d = a[c],
								r = !!k(a, "options");
							if (
								!k(g, d) ||
								(r &&
									k(l, function (a) {
										if ("lang" === a) return !1;
									}))
							)
								return;
							k(l, d) && l.splice(h(l, d), 1);
							if ("all" === d || (r && k(a, "lang"))) return [];
							"options" === d && (l = ["lang"]);
						}
						return (b = b.concat(l));
					})(d);
				}
			},
			addRule: function (a) {
				var d = CKEDITOR.plugins.scayt,
					b = a.dataProcessor,
					c = b && b.htmlFilter,
					g = a._.elementsPath && a._.elementsPath.filters,
					b = b && b.dataFilter,
					l = a.addRemoveFormatFilter,
					k = function (b) {
						if (
							a.scayt &&
							(b.hasAttribute(d.options.data_attribute_name) ||
								b.hasAttribute(d.options.problem_grammar_data_attribute))
						)
							return !1;
					},
					h = function (b) {
						var c = !0;
						a.scayt &&
							(b.hasAttribute(d.options.data_attribute_name) ||
								b.hasAttribute(d.options.problem_grammar_data_attribute)) &&
							(c = !1);
						return c;
					};
				g && g.push(k);
				b &&
					b.addRules({
						elements: {
							span: function (a) {
								var b =
										a.hasClass(d.options.misspelled_word_class) &&
										a.attributes[d.options.data_attribute_name],
									c =
										a.hasClass(d.options.problem_grammar_class) &&
										a.attributes[d.options.problem_grammar_data_attribute];
								d && (b || c) && delete a.name;
								return a;
							},
						},
					});
				c &&
					c.addRules({
						elements: {
							span: function (a) {
								var b =
										a.hasClass(d.options.misspelled_word_class) &&
										a.attributes[d.options.data_attribute_name],
									c =
										a.hasClass(d.options.problem_grammar_class) &&
										a.attributes[d.options.problem_grammar_data_attribute];
								d && (b || c) && delete a.name;
								return a;
							},
						},
					});
				l && l.call(a, h);
			},
			scaytMenuDefinition: function (a) {
				var d = this,
					b = CKEDITOR.plugins.scayt;
				a = a.scayt;
				return {
					scayt: {
						scayt_ignore: {
							label: a.getLocal("btn_ignore"),
							group: "scayt_control",
							order: 1,
							exec: function (a) {
								a.scayt.ignoreWord();
							},
						},
						scayt_ignoreall: {
							label: a.getLocal("btn_ignoreAll"),
							group: "scayt_control",
							order: 2,
							exec: function (a) {
								a.scayt.ignoreAllWords();
							},
						},
						scayt_add: {
							label: a.getLocal("btn_addWord"),
							group: "scayt_control",
							order: 3,
							exec: function (a) {
								var b = a.scayt;
								setTimeout(function () {
									b.addWordToUserDictionary();
								}, 10);
							},
						},
						scayt_option: {
							label: a.getLocal("btn_options"),
							group: "scayt_control",
							order: 4,
							exec: function (a) {
								a.scayt.tabToOpen = "options";
								b.openDialog(d.dialogName, a);
							},
							verification: function (a) {
								return 1 == a.config.scayt_uiTabs[0] ? !0 : !1;
							},
						},
						scayt_language: {
							label: a.getLocal("btn_langs"),
							group: "scayt_control",
							order: 5,
							exec: function (a) {
								a.scayt.tabToOpen = "langs";
								b.openDialog(d.dialogName, a);
							},
							verification: function (a) {
								return 1 == a.config.scayt_uiTabs[1] ? !0 : !1;
							},
						},
						scayt_dictionary: {
							label: a.getLocal("btn_dictionaries"),
							group: "scayt_control",
							order: 6,
							exec: function (a) {
								a.scayt.tabToOpen = "dictionaries";
								b.openDialog(d.dialogName, a);
							},
							verification: function (a) {
								return 1 == a.config.scayt_uiTabs[2] ? !0 : !1;
							},
						},
						scayt_about: {
							label: a.getLocal("btn_about"),
							group: "scayt_control",
							order: 7,
							exec: function (a) {
								a.scayt.tabToOpen = "about";
								b.openDialog(d.dialogName, a);
							},
						},
					},
					grayt: {
						grayt_problemdescription: {
							label: "Grammar problem description",
							group: "grayt_description",
							order: 1,
							state: CKEDITOR.TRISTATE_DISABLED,
							exec: function (a) {},
						},
						grayt_ignore: {
							label: a.getLocal("btn_ignore"),
							group: "grayt_control",
							order: 2,
							exec: function (a) {
								a.scayt.ignorePhrase();
							},
						},
						grayt_ignoreall: {
							label: a.getLocal("btn_ignoreAll"),
							group: "grayt_control",
							order: 3,
							exec: function (a) {
								a.scayt.ignoreAllPhrases();
							},
						},
					},
				};
			},
			buildSuggestionMenuItems: function (a, d, b) {
				var c = {},
					g = {},
					l = b ? "word" : "phrase",
					k = b ? "startGrammarCheck" : "startSpellCheck",
					h = a.scayt;
				if (0 < d.length && "no_any_suggestions" !== d[0])
					if (b)
						for (b = 0; b < d.length; b++) {
							var e =
								"scayt_suggest_" +
								CKEDITOR.plugins.scayt.suggestions[b].replace(" ", "_");
							a.addCommand(
								e,
								this.createCommand(CKEDITOR.plugins.scayt.suggestions[b], l, k)
							);
							b < a.config.scayt_maxSuggestions
								? (a.addMenuItem(e, {
										label: d[b],
										command: e,
										group: "scayt_suggest",
										order: b + 1,
								  }),
								  (c[e] = CKEDITOR.TRISTATE_OFF))
								: (a.addMenuItem(e, {
										label: d[b],
										command: e,
										group: "scayt_moresuggest",
										order: b + 1,
								  }),
								  (g[e] = CKEDITOR.TRISTATE_OFF),
								  "on" === a.config.scayt_moreSuggestions &&
										(a.addMenuItem("scayt_moresuggest", {
											label: h.getLocal("btn_moreSuggestions"),
											group: "scayt_moresuggest",
											order: 10,
											getItems: function () {
												return g;
											},
										}),
										(c.scayt_moresuggest = CKEDITOR.TRISTATE_OFF)));
						}
					else
						for (b = 0; b < d.length; b++)
							(e =
								"grayt_suggest_" +
								CKEDITOR.plugins.scayt.suggestions[b].replace(" ", "_")),
								a.addCommand(
									e,
									this.createCommand(
										CKEDITOR.plugins.scayt.suggestions[b],
										l,
										k
									)
								),
								a.addMenuItem(e, {
									label: d[b],
									command: e,
									group: "grayt_suggest",
									order: b + 1,
								}),
								(c[e] = CKEDITOR.TRISTATE_OFF);
				else
					(c.no_scayt_suggest = CKEDITOR.TRISTATE_DISABLED),
						a.addCommand("no_scayt_suggest", { exec: function () {} }),
						a.addMenuItem("no_scayt_suggest", {
							label: h.getLocal("btn_noSuggestions") || "no_scayt_suggest",
							command: "no_scayt_suggest",
							group: "scayt_suggest",
							order: 0,
						});
				return c;
			},
			menuGenerator: function (a, d) {
				var b = a.scayt,
					c = this.scaytMenuDefinition(a),
					g = {},
					l = a.config.scayt_contextCommands.split("|"),
					k = d.getAttribute(b.getLangAttribute()) || b.getLang(),
					h,
					e,
					m,
					f;
				e = b.isScaytNode(d);
				m = b.isGraytNode(d);
				e
					? ((c = c.scayt),
					  (h = d.getAttribute(b.getScaytNodeAttributeName())),
					  b.fire("getSuggestionsList", { lang: k, word: h }),
					  (g = this.buildSuggestionMenuItems(
							a,
							CKEDITOR.plugins.scayt.suggestions,
							e
					  )))
					: m &&
					  ((c = c.grayt),
					  (g = d.getAttribute(b.getGraytNodeAttributeName())),
					  b.getGraytNodeRuleAttributeName
							? ((h = d.getAttribute(b.getGraytNodeRuleAttributeName())),
							  b.getProblemDescriptionText(g, h, k))
							: b.getProblemDescriptionText(g, k),
					  (f = b.getProblemDescriptionText(g, h, k)),
					  c.grayt_problemdescription &&
							f &&
							((f = f.replace(/([.!?])\s/g, "$1\x3cbr\x3e")),
							(c.grayt_problemdescription.label = f)),
					  b.fire("getGrammarSuggestionsList", {
							lang: k,
							phrase: g,
							rule: h,
					  }),
					  (g = this.buildSuggestionMenuItems(
							a,
							CKEDITOR.plugins.scayt.suggestions,
							e
					  )));
				if (e && "off" == a.config.scayt_contextCommands) return g;
				for (var n in c)
					(e &&
						-1 == CKEDITOR.tools.indexOf(l, n.replace("scayt_", "")) &&
						"all" != a.config.scayt_contextCommands) ||
						(m &&
							"grayt_problemdescription" !== n &&
							-1 == CKEDITOR.tools.indexOf(l, n.replace("grayt_", "")) &&
							"all" != a.config.scayt_contextCommands) ||
						((g[n] =
							"undefined" != typeof c[n].state
								? c[n].state
								: CKEDITOR.TRISTATE_OFF),
						"function" !== typeof c[n].verification ||
							c[n].verification(a) ||
							delete g[n],
						a.addCommand(n, { exec: c[n].exec }),
						a.addMenuItem(n, {
							label: a.lang.scayt[c[n].label] || c[n].label,
							command: n,
							group: c[n].group,
							order: c[n].order,
						}));
				return g;
			},
			createCommand: function (a, d, b) {
				return {
					exec: function (c) {
						c = c.scayt;
						var g = {};
						g[d] = a;
						c.replaceSelectionNode(g);
						"startGrammarCheck" === b &&
							c.removeMarkupInSelectionNode({ grammarOnly: !0 });
						c.fire(b);
					},
				};
			},
		}),
		(CKEDITOR.plugins.scayt = {
			charsToObserve: [
				{
					charName: "cke-fillingChar",
					charCode: (function () {
						var a = CKEDITOR.version.match(/^\d(\.\d*)*/),
							a = a && a[0],
							d;
						if (a) {
							d = "4.5.7";
							var b,
								a = a.replace(/\./g, "");
							d = d.replace(/\./g, "");
							b = a.length - d.length;
							b = 0 <= b ? b : 0;
							d = parseInt(a) >= parseInt(d) * Math.pow(10, b);
						}
						return d
							? Array(7).join(String.fromCharCode(8203))
							: String.fromCharCode(8203);
					})(),
				},
			],
			onLoadTimestamp: "",
			state: { scayt: {}, grayt: {} },
			warningCounter: 0,
			suggestions: [],
			options: {
				disablingCommandExec: { source: !0, newpage: !0, templates: !0 },
				data_attribute_name: "data-scayt-word",
				misspelled_word_class: "scayt-misspell-word",
				problem_grammar_data_attribute: "data-grayt-phrase",
				problem_grammar_class: "gramm-problem",
			},
			backCompatibilityMap: {
				scayt_service_protocol: "scayt_serviceProtocol",
				scayt_service_host: "scayt_serviceHost",
				scayt_service_port: "scayt_servicePort",
				scayt_service_path: "scayt_servicePath",
				scayt_customerid: "scayt_customerId",
			},
			openDialog: function (a, d) {
				var b = d.scayt;
				(b.isAllModulesReady && !1 === b.isAllModulesReady()) ||
					(d.lockSelection(), d.openDialog(a));
			},
			alarmCompatibilityMessage: function () {
				5 > this.warningCounter &&
					(console.warn(
						"You are using the latest version of SCAYT plugin for CKEditor with the old application version. In order to have access to the newest features, it is recommended to upgrade the application version to latest one as well. Contact us for more details at support@webspellchecker.net."
					),
					(this.warningCounter += 1));
			},
			isNewUdSupported: function (a) {
				return a.getUserDictionary ? !0 : !1;
			},
			reloadMarkup: function (a) {
				var d;
				a &&
					((d = a.getScaytLangList()),
					a.reloadMarkup
						? a.reloadMarkup()
						: (this.alarmCompatibilityMessage(),
						  d &&
								d.ltr &&
								d.rtl &&
								a.fire("startSpellCheck, startGrammarCheck")));
			},
			replaceOldOptionsNames: function (a) {
				for (var d in a)
					d in this.backCompatibilityMap &&
						((a[this.backCompatibilityMap[d]] = a[d]), delete a[d]);
			},
			createScayt: function (a) {
				var d = this,
					b = CKEDITOR.plugins.scayt;
				this.loadScaytLibrary(a, function (a) {
					function g(a) {
						return new SCAYT.CKSCAYT(
							a,
							function () {},
							function () {}
						);
					}
					var l;
					a.window &&
						(l =
							"BODY" == a.editable().$.nodeName
								? a.window.getFrame()
								: a.editable());
					if (l) {
						l = {
							lang: a.config.scayt_sLang,
							container: l.$,
							customDictionary: a.config.scayt_customDictionaryIds,
							userDictionaryName: a.config.scayt_userDictionaryName,
							localization: a.langCode,
							customer_id: a.config.scayt_customerId,
							customPunctuation: a.config.scayt_customPunctuation,
							debug: a.config.scayt_debug,
							data_attribute_name: d.options.data_attribute_name,
							misspelled_word_class: d.options.misspelled_word_class,
							problem_grammar_data_attribute:
								d.options.problem_grammar_data_attribute,
							problem_grammar_class: d.options.problem_grammar_class,
							"options-to-restore": a.config.scayt_disableOptionsStorage,
							focused: a.editable().hasFocus,
							ignoreElementsRegex: a.config.scayt_elementsToIgnore,
							ignoreGraytElementsRegex: a.config.grayt_elementsToIgnore,
							minWordLength: a.config.scayt_minWordLength,
							multiLanguageMode: a.config.scayt_multiLanguageMode,
							multiLanguageStyles: a.config.scayt_multiLanguageStyles,
							graytAutoStartup: a.config.grayt_autoStartup,
							charsToObserve: b.charsToObserve,
						};
						a.config.scayt_serviceProtocol &&
							(l.service_protocol = a.config.scayt_serviceProtocol);
						a.config.scayt_serviceHost &&
							(l.service_host = a.config.scayt_serviceHost);
						a.config.scayt_servicePort &&
							(l.service_port = a.config.scayt_servicePort);
						a.config.scayt_servicePath &&
							(l.service_path = a.config.scayt_servicePath);
						"boolean" === typeof a.config.scayt_ignoreAllCapsWords &&
							(l["ignore-all-caps-words"] = a.config.scayt_ignoreAllCapsWords);
						"boolean" === typeof a.config.scayt_ignoreDomainNames &&
							(l["ignore-domain-names"] = a.config.scayt_ignoreDomainNames);
						"boolean" === typeof a.config.scayt_ignoreWordsWithMixedCases &&
							(l["ignore-words-with-mixed-cases"] =
								a.config.scayt_ignoreWordsWithMixedCases);
						"boolean" === typeof a.config.scayt_ignoreWordsWithNumbers &&
							(l["ignore-words-with-numbers"] =
								a.config.scayt_ignoreWordsWithNumbers);
						var k;
						try {
							k = g(l);
						} catch (h) {
							d.alarmCompatibilityMessage(),
								delete l.charsToObserve,
								(k = g(l));
						}
						k.subscribe("suggestionListSend", function (a) {
							for (var b = {}, c = [], d = 0; d < a.suggestionList.length; d++)
								b["word_" + a.suggestionList[d]] ||
									((b["word_" + a.suggestionList[d]] = a.suggestionList[d]),
									c.push(a.suggestionList[d]));
							CKEDITOR.plugins.scayt.suggestions = c;
						});
						k.subscribe("selectionIsChanged", function (b) {
							a.getSelection().isLocked &&
								"restoreSelection" !== b.action &&
								a.lockSelection();
							"restoreSelection" === b.action && a.selectionChange(!0);
						});
						k.subscribe("graytStateChanged", function (e) {
							b.state.grayt[a.name] = e.state;
						});
						k.addMarkupHandler &&
							k.addMarkupHandler(function (b) {
								var d = a.editable(),
									f = d.getCustomData(b.charName);
								f && ((f.$ = b.node), d.setCustomData(b.charName, f));
							});
						a.scayt = k;
						a.fire(
							"scaytButtonState",
							a.readOnly ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_ON
						);
					} else b.state.scayt[a.name] = !1;
				});
			},
			destroy: function (a) {
				a.scayt && a.scayt.destroy();
				delete a.scayt;
				a.fire("scaytButtonState", CKEDITOR.TRISTATE_OFF);
			},
			loadScaytLibrary: function (a, d) {
				var b,
					c = function () {
						CKEDITOR.fireOnce("scaytReady");
						a.scayt || ("function" === typeof d && d(a));
					};
				"undefined" === typeof window.SCAYT ||
				"function" !== typeof window.SCAYT.CKSCAYT
					? ((b = a.config.scayt_srcUrl + "?" + this.onLoadTimestamp),
					  CKEDITOR.scriptLoader.load(b, function (a) {
							a && c();
					  }))
					: window.SCAYT && "function" === typeof window.SCAYT.CKSCAYT && c();
			},
		}),
		CKEDITOR.on("dialogDefinition", function (a) {
			var d = a.data.name;
			a = a.data.definition.dialog;
			"scaytDialog" !== d &&
				"checkspell" !== d &&
				(a.on("show", function (a) {
					a = a.sender && a.sender.getParentEditor();
					var c = CKEDITOR.plugins.scayt,
						d = a.scayt;
					d &&
						c.state.scayt[a.name] &&
						d.setMarkupPaused &&
						d.setMarkupPaused(!0);
				}),
				a.on("hide", function (a) {
					a = a.sender && a.sender.getParentEditor();
					var c = CKEDITOR.plugins.scayt,
						d = a.scayt;
					d &&
						c.state.scayt[a.name] &&
						d.setMarkupPaused &&
						d.setMarkupPaused(!1);
				}));
			if ("scaytDialog" === d)
				a.on(
					"cancel",
					function (a) {
						return !1;
					},
					this,
					null,
					-1
				);
			if ("checkspell" === d)
				a.on(
					"cancel",
					function (a) {
						a = a.sender && a.sender.getParentEditor();
						var c = CKEDITOR.plugins.scayt,
							d = a.scayt;
						d &&
							c.state.scayt[a.name] &&
							d.setMarkupPaused &&
							d.setMarkupPaused(!1);
						a.unlockSelection();
					},
					this,
					null,
					-2
				);
			if ("link" === d)
				a.on("ok", function (a) {
					var c = a.sender && a.sender.getParentEditor();
					c &&
						setTimeout(function () {
							c.fire("reloadMarkupScayt", {
								removeOptions: { removeInside: !0, forceBookmark: !0 },
								timeout: 0,
							});
						}, 0);
				});
			if ("replace" === d)
				a.on("hide", function (a) {
					a = a.sender && a.sender.getParentEditor();
					var c = CKEDITOR.plugins.scayt,
						d = a.scayt;
					a &&
						setTimeout(function () {
							d && (d.fire("removeMarkupInDocument", {}), c.reloadMarkup(d));
						}, 0);
				});
		}),
		CKEDITOR.on("scaytReady", function () {
			if (!0 === CKEDITOR.config.scayt_handleCheckDirty) {
				var a = CKEDITOR.editor.prototype;
				a.checkDirty = CKEDITOR.tools.override(a.checkDirty, function (a) {
					return function () {
						var c = null,
							d = this.scayt;
						if (
							CKEDITOR.plugins.scayt &&
							CKEDITOR.plugins.scayt.state.scayt[this.name] &&
							this.scayt
						) {
							if ((c = "ready" == this.status))
								var l = d.removeMarkupFromString(this.getSnapshot()),
									d = d.removeMarkupFromString(this._.previousValue),
									c = c && d !== l;
						} else c = a.call(this);
						return c;
					};
				});
				a.resetDirty = CKEDITOR.tools.override(a.resetDirty, function (a) {
					return function () {
						var c = this.scayt;
						CKEDITOR.plugins.scayt &&
						CKEDITOR.plugins.scayt.state.scayt[this.name] &&
						this.scayt
							? (this._.previousValue = c.removeMarkupFromString(
									this.getSnapshot()
							  ))
							: a.call(this);
					};
				});
			}
			if (!0 === CKEDITOR.config.scayt_handleUndoRedo) {
				var a = CKEDITOR.plugins.undo.Image.prototype,
					d = "function" == typeof a.equalsContent ? "equalsContent" : "equals";
				a[d] = CKEDITOR.tools.override(a[d], function (a) {
					return function (c) {
						var d = c.editor.scayt,
							l = this.contents,
							k = c.contents,
							h = null;
						CKEDITOR.plugins.scayt &&
							CKEDITOR.plugins.scayt.state.scayt[c.editor.name] &&
							c.editor.scayt &&
							((this.contents = d.removeMarkupFromString(l) || ""),
							(c.contents = d.removeMarkupFromString(k) || ""));
						h = a.apply(this, arguments);
						this.contents = l;
						c.contents = k;
						return h;
					};
				});
			}
		}),
		(function () {
			var a = {
				preserveState: !0,
				editorFocus: !1,
				readOnly: 1,
				exec: function (a) {
					this.toggleState();
					this.refresh(a);
				},
				refresh: function (a) {
					if (a.document) {
						var b =
							this.state == CKEDITOR.TRISTATE_ON
								? "attachClass"
								: "removeClass";
						a.editable()[b]("cke_show_borders");
					}
				},
			};
			CKEDITOR.plugins.add("showborders", {
				modes: { wysiwyg: 1 },
				onLoad: function () {
					var a;
					a = (CKEDITOR.env.ie6Compat
						? [
								".%1 table.%2,",
								".%1 table.%2 td, .%1 table.%2 th",
								"{",
								"border : #d3d3d3 1px dotted",
								"}",
						  ]
						: ".%1 table.%2,;.%1 table.%2 \x3e tr \x3e td, .%1 table.%2 \x3e tr \x3e th,;.%1 table.%2 \x3e tbody \x3e tr \x3e td, .%1 table.%2 \x3e tbody \x3e tr \x3e th,;.%1 table.%2 \x3e thead \x3e tr \x3e td, .%1 table.%2 \x3e thead \x3e tr \x3e th,;.%1 table.%2 \x3e tfoot \x3e tr \x3e td, .%1 table.%2 \x3e tfoot \x3e tr \x3e th;{;border : #d3d3d3 1px dotted;}".split(
								";"
						  )
					)
						.join("")
						.replace(/%2/g, "cke_show_border")
						.replace(/%1/g, "cke_show_borders ");
					CKEDITOR.addCss(a);
				},
				init: function (d) {
					var b = d.addCommand("showborders", a);
					b.canUndo = !1;
					!1 !== d.config.startupShowBorders &&
						b.setState(CKEDITOR.TRISTATE_ON);
					d.on(
						"mode",
						function () {
							b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(d);
						},
						null,
						null,
						100
					);
					d.on("contentDom", function () {
						b.state != CKEDITOR.TRISTATE_DISABLED && b.refresh(d);
					});
					d.on("removeFormatCleanup", function (a) {
						a = a.data;
						d.getCommand("showborders").state == CKEDITOR.TRISTATE_ON &&
							a.is("table") &&
							(!a.hasAttribute("border") ||
								0 >= parseInt(a.getAttribute("border"), 10)) &&
							a.addClass("cke_show_border");
					});
				},
				afterInit: function (a) {
					var b = a.dataProcessor;
					a = b && b.dataFilter;
					b = b && b.htmlFilter;
					a &&
						a.addRules({
							elements: {
								table: function (a) {
									a = a.attributes;
									var b = a["class"],
										d = parseInt(a.border, 10);
									(d && !(0 >= d)) ||
										(b && -1 != b.indexOf("cke_show_border")) ||
										(a["class"] = (b || "") + " cke_show_border");
								},
							},
						});
					b &&
						b.addRules({
							elements: {
								table: function (a) {
									a = a.attributes;
									var b = a["class"];
									b &&
										(a["class"] = b
											.replace("cke_show_border", "")
											.replace(/\s{2}/, " ")
											.replace(/^\s+|\s+$/, ""));
								},
							},
						});
				},
			});
			CKEDITOR.on("dialogDefinition", function (a) {
				var b = a.data.name;
				if ("table" == b || "tableProperties" == b)
					if (
						((a = a.data.definition),
						(b = a.getContents("info").get("txtBorder")),
						(b.commit = CKEDITOR.tools.override(b.commit, function (a) {
							return function (b, d) {
								a.apply(this, arguments);
								var k = parseInt(this.getValue(), 10);
								d[!k || 0 >= k ? "addClass" : "removeClass"]("cke_show_border");
							};
						})),
						(a = (a = a.getContents("advanced")) && a.get("advCSSClasses")))
					)
						(a.setup = CKEDITOR.tools.override(a.setup, function (a) {
							return function () {
								a.apply(this, arguments);
								this.setValue(this.getValue().replace(/cke_show_border/, ""));
							};
						})),
							(a.commit = CKEDITOR.tools.override(a.commit, function (a) {
								return function (b, d) {
									a.apply(this, arguments);
									parseInt(d.getAttribute("border"), 10) ||
										d.addClass("cke_show_border");
								};
							}));
			});
		})(),
		(function () {
			CKEDITOR.plugins.add("sourcearea", {
				init: function (d) {
					function b() {
						var a = g && this.equals(CKEDITOR.document.getActive());
						this.hide();
						this.setStyle("height", this.getParent().$.clientHeight + "px");
						this.setStyle("width", this.getParent().$.clientWidth + "px");
						this.show();
						a && this.focus();
					}
					if (d.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
						var c = CKEDITOR.plugins.sourcearea;
						d.addMode("source", function (c) {
							var g = d.ui
								.space("contents")
								.getDocument()
								.createElement("textarea");
							g.setStyles(
								CKEDITOR.tools.extend(
									{
										width: CKEDITOR.env.ie7Compat ? "99%" : "100%",
										height: "100%",
										resize: "none",
										outline: "none",
										"text-align": "left",
									},
									CKEDITOR.tools.cssVendorPrefix(
										"tab-size",
										d.config.sourceAreaTabSize || 4
									)
								)
							);
							g.setAttribute("dir", "ltr");
							g.addClass("cke_source")
								.addClass("cke_reset")
								.addClass("cke_enable_context_menu");
							d.ui.space("contents").append(g);
							g = d.editable(new a(d, g));
							g.setData(d.getData(1));
							CKEDITOR.env.ie &&
								(g.attachListener(d, "resize", b, g),
								g.attachListener(CKEDITOR.document.getWindow(), "resize", b, g),
								CKEDITOR.tools.setTimeout(b, 0, g));
							d.fire("ariaWidget", this);
							c();
						});
						d.addCommand("source", c.commands.source);
						d.ui.addButton &&
							d.ui.addButton("Source", {
								label: d.lang.sourcearea.toolbar,
								command: "source",
								toolbar: "mode,10",
							});
						d.on("mode", function () {
							d.getCommand("source").setState(
								"source" == d.mode
									? CKEDITOR.TRISTATE_ON
									: CKEDITOR.TRISTATE_OFF
							);
						});
						var g = CKEDITOR.env.ie && 9 == CKEDITOR.env.version;
					}
				},
			});
			var a = CKEDITOR.tools.createClass({
				base: CKEDITOR.editable,
				proto: {
					setData: function (a) {
						this.setValue(a);
						this.status = "ready";
						this.editor.fire("dataReady");
					},
					getData: function () {
						return this.getValue();
					},
					insertHtml: function () {},
					insertElement: function () {},
					insertText: function () {},
					setReadOnly: function (a) {
						this[(a ? "set" : "remove") + "Attribute"]("readOnly", "readonly");
					},
					detach: function () {
						a.baseProto.detach.call(this);
						this.clearCustomData();
						this.remove();
					},
				},
			});
		})(),
		(CKEDITOR.plugins.sourcearea = {
			commands: {
				source: {
					modes: { wysiwyg: 1, source: 1 },
					editorFocus: !1,
					readOnly: 1,
					exec: function (a) {
						"wysiwyg" == a.mode && a.fire("saveSnapshot");
						a.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
						a.setMode("source" == a.mode ? "wysiwyg" : "source");
					},
					canUndo: !1,
				},
			},
		}),
		CKEDITOR.plugins.add("specialchar", {
			availableLangs: {
				af: 1,
				ar: 1,
				az: 1,
				bg: 1,
				ca: 1,
				cs: 1,
				cy: 1,
				da: 1,
				de: 1,
				"de-ch": 1,
				el: 1,
				en: 1,
				"en-au": 1,
				"en-ca": 1,
				"en-gb": 1,
				eo: 1,
				es: 1,
				"es-mx": 1,
				et: 1,
				eu: 1,
				fa: 1,
				fi: 1,
				fr: 1,
				"fr-ca": 1,
				gl: 1,
				he: 1,
				hr: 1,
				hu: 1,
				id: 1,
				it: 1,
				ja: 1,
				km: 1,
				ko: 1,
				ku: 1,
				lt: 1,
				lv: 1,
				nb: 1,
				nl: 1,
				no: 1,
				oc: 1,
				pl: 1,
				pt: 1,
				"pt-br": 1,
				ro: 1,
				ru: 1,
				si: 1,
				sk: 1,
				sl: 1,
				sq: 1,
				sv: 1,
				th: 1,
				tr: 1,
				tt: 1,
				ug: 1,
				uk: 1,
				vi: 1,
				zh: 1,
				"zh-cn": 1,
			},
			requires: "dialog",
			init: function (a) {
				var d = this;
				CKEDITOR.dialog.add(
					"specialchar",
					this.path + "dialogs/specialchar.js"
				);
				a.addCommand("specialchar", {
					exec: function () {
						var b = a.langCode,
							b = d.availableLangs[b]
								? b
								: d.availableLangs[b.replace(/-.*/, "")]
								? b.replace(/-.*/, "")
								: "en";
						CKEDITOR.scriptLoader.load(
							CKEDITOR.getUrl(d.path + "dialogs/lang/" + b + ".js"),
							function () {
								CKEDITOR.tools.extend(a.lang.specialchar, d.langEntries[b]);
								a.openDialog("specialchar");
							}
						);
					},
					modes: { wysiwyg: 1 },
					canUndo: !1,
				});
				a.ui.addButton &&
					a.ui.addButton("SpecialChar", {
						label: a.lang.specialchar.toolbar,
						command: "specialchar",
						toolbar: "insert,50",
					});
			},
		}),
		(CKEDITOR.config.specialChars = "! \x26quot; # $ % \x26amp; ' ( ) * + - . / 0 1 2 3 4 5 6 7 8 9 : ; \x26lt; \x3d \x26gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ \x26euro; \x26lsquo; \x26rsquo; \x26ldquo; \x26rdquo; \x26ndash; \x26mdash; \x26iexcl; \x26cent; \x26pound; \x26curren; \x26yen; \x26brvbar; \x26sect; \x26uml; \x26copy; \x26ordf; \x26laquo; \x26not; \x26reg; \x26macr; \x26deg; \x26sup2; \x26sup3; \x26acute; \x26micro; \x26para; \x26middot; \x26cedil; \x26sup1; \x26ordm; \x26raquo; \x26frac14; \x26frac12; \x26frac34; \x26iquest; \x26Agrave; \x26Aacute; \x26Acirc; \x26Atilde; \x26Auml; \x26Aring; \x26AElig; \x26Ccedil; \x26Egrave; \x26Eacute; \x26Ecirc; \x26Euml; \x26Igrave; \x26Iacute; \x26Icirc; \x26Iuml; \x26ETH; \x26Ntilde; \x26Ograve; \x26Oacute; \x26Ocirc; \x26Otilde; \x26Ouml; \x26times; \x26Oslash; \x26Ugrave; \x26Uacute; \x26Ucirc; \x26Uuml; \x26Yacute; \x26THORN; \x26szlig; \x26agrave; \x26aacute; \x26acirc; \x26atilde; \x26auml; \x26aring; \x26aelig; \x26ccedil; \x26egrave; \x26eacute; \x26ecirc; \x26euml; \x26igrave; \x26iacute; \x26icirc; \x26iuml; \x26eth; \x26ntilde; \x26ograve; \x26oacute; \x26ocirc; \x26otilde; \x26ouml; \x26divide; \x26oslash; \x26ugrave; \x26uacute; \x26ucirc; \x26uuml; \x26yacute; \x26thorn; \x26yuml; \x26OElig; \x26oelig; \x26#372; \x26#374 \x26#373 \x26#375; \x26sbquo; \x26#8219; \x26bdquo; \x26hellip; \x26trade; \x26#9658; \x26bull; \x26rarr; \x26rArr; \x26hArr; \x26diams; \x26asymp;".split(
			" "
		)),
		(function () {
			CKEDITOR.plugins.add("stylescombo", {
				requires: "richcombo",
				init: function (a) {
					var d = a.config,
						b = a.lang.stylescombo,
						c = {},
						g = [],
						l = [];
					a.on("stylesSet", function (b) {
						if ((b = b.data.styles)) {
							for (var h, e, m, f = 0, n = b.length; f < n; f++)
								((h = b[f]),
								(a.blockless && h.element in CKEDITOR.dtd.$block) ||
									("string" == typeof h.type &&
										!CKEDITOR.style.customHandlers[h.type]) ||
									((e = h.name),
									(h = new CKEDITOR.style(h)),
									a.filter.customConfig && !a.filter.check(h))) ||
									((h._name = e),
									(h._.enterMode = d.enterMode),
									(h._.type = m = h.assignedTo || h.type),
									(h._.weight =
										f +
										1e3 *
											(m == CKEDITOR.STYLE_OBJECT
												? 1
												: m == CKEDITOR.STYLE_BLOCK
												? 2
												: 3)),
									(c[e] = h),
									g.push(h),
									l.push(h));
							g.sort(function (a, b) {
								return a._.weight - b._.weight;
							});
						}
					});
					a.ui.addRichCombo("Styles", {
						label: b.label,
						title: b.panelTitle,
						toolbar: "styles,10",
						allowedContent: l,
						panel: {
							css: [CKEDITOR.skin.getPath("editor")].concat(d.contentsCss),
							multiSelect: !0,
							attributes: { "aria-label": b.panelTitle },
						},
						init: function () {
							var a, c, e, d, f, l;
							f = 0;
							for (l = g.length; f < l; f++)
								(a = g[f]),
									(c = a._name),
									(d = a._.type),
									d != e &&
										(this.startGroup(b["panelTitle" + String(d)]), (e = d)),
									this.add(
										c,
										a.type == CKEDITOR.STYLE_OBJECT ? c : a.buildPreview(),
										c
									);
							this.commit();
						},
						onClick: function (b) {
							a.focus();
							a.fire("saveSnapshot");
							b = c[b];
							var d = a.elementPath();
							if (b.group && b.removeStylesFromSameGroup(a)) a.applyStyle(b);
							else a[b.checkActive(d, a) ? "removeStyle" : "applyStyle"](b);
							a.fire("saveSnapshot");
						},
						onRender: function () {
							a.on(
								"selectionChange",
								function (b) {
									var d = this.getValue();
									b = b.data.path.elements;
									for (var e = 0, g = b.length, f; e < g; e++) {
										f = b[e];
										for (var l in c)
											if (c[l].checkElementRemovable(f, !0, a)) {
												l != d && this.setValue(l);
												return;
											}
									}
									this.setValue("");
								},
								this
							);
						},
						onOpen: function () {
							var d = a.getSelection(),
								d =
									d.getSelectedElement() || d.getStartElement() || a.editable(),
								d = a.elementPath(d),
								g = [0, 0, 0, 0];
							this.showAll();
							this.unmarkAll();
							for (var e in c) {
								var m = c[e],
									f = m._.type;
								m.checkApplicable(d, a, a.activeFilter)
									? g[f]++
									: this.hideItem(e);
								m.checkActive(d, a) && this.mark(e);
							}
							g[CKEDITOR.STYLE_BLOCK] ||
								this.hideGroup(b["panelTitle" + String(CKEDITOR.STYLE_BLOCK)]);
							g[CKEDITOR.STYLE_INLINE] ||
								this.hideGroup(b["panelTitle" + String(CKEDITOR.STYLE_INLINE)]);
							g[CKEDITOR.STYLE_OBJECT] ||
								this.hideGroup(b["panelTitle" + String(CKEDITOR.STYLE_OBJECT)]);
						},
						refresh: function () {
							var b = a.elementPath();
							if (b) {
								for (var d in c)
									if (c[d].checkApplicable(b, a, a.activeFilter)) return;
								this.setState(CKEDITOR.TRISTATE_DISABLED);
							}
						},
						reset: function () {
							c = {};
							g = [];
						},
					});
				},
			});
		})(),
		(function () {
			function a(a) {
				return {
					editorFocus: !1,
					canUndo: !1,
					modes: { wysiwyg: 1 },
					exec: function (b) {
						if (b.editable().hasFocus) {
							var c = b.getSelection(),
								d;
							if (
								(d = new CKEDITOR.dom.elementPath(
									c.getCommonAncestor(),
									c.root
								).contains({ td: 1, th: 1 }, 1))
							) {
								var c = b.createRange(),
									e = CKEDITOR.tools.tryThese(
										function () {
											var b = d.getParent().$.cells[
												d.$.cellIndex + (a ? -1 : 1)
											];
											b.parentNode.parentNode;
											return b;
										},
										function () {
											var b = d.getParent(),
												b = b.getAscendant("table").$.rows[
													b.$.rowIndex + (a ? -1 : 1)
												];
											return b.cells[a ? b.cells.length - 1 : 0];
										}
									);
								if (e || a)
									if (e)
										(e = new CKEDITOR.dom.element(e)),
											c.moveToElementEditStart(e),
											(c.checkStartOfBlock() && c.checkEndOfBlock()) ||
												c.selectNodeContents(e);
									else return !0;
								else {
									for (
										var m = d.getAscendant("table").$,
											e = d.getParent().$.cells,
											m = new CKEDITOR.dom.element(m.insertRow(-1), b.document),
											f = 0,
											n = e.length;
										f < n;
										f++
									)
										m.append(
											new CKEDITOR.dom.element(e[f], b.document).clone(!1, !1)
										).appendBogus();
									c.moveToElementEditStart(m);
								}
								c.select(!0);
								return !0;
							}
						}
						return !1;
					},
				};
			}
			var d = { editorFocus: !1, modes: { wysiwyg: 1, source: 1 } },
				b = {
					exec: function (a) {
						a.container.focusNext(!0, a.tabIndex);
					},
				},
				c = {
					exec: function (a) {
						a.container.focusPrevious(!0, a.tabIndex);
					},
				};
			CKEDITOR.plugins.add("tab", {
				init: function (g) {
					for (
						var l = !1 !== g.config.enableTabKeyTools,
							k = g.config.tabSpaces || 0,
							h = "";
						k--;

					)
						h += " ";
					if (h)
						g.on("key", function (a) {
							9 == a.data.keyCode && (g.insertText(h), a.cancel());
						});
					if (l)
						g.on("key", function (a) {
							((9 == a.data.keyCode && g.execCommand("selectNextCell")) ||
								(a.data.keyCode == CKEDITOR.SHIFT + 9 &&
									g.execCommand("selectPreviousCell"))) &&
								a.cancel();
						});
					g.addCommand("blur", CKEDITOR.tools.extend(b, d));
					g.addCommand("blurBack", CKEDITOR.tools.extend(c, d));
					g.addCommand("selectNextCell", a());
					g.addCommand("selectPreviousCell", a(!0));
				},
			});
		})(),
		(CKEDITOR.dom.element.prototype.focusNext = function (a, d) {
			var b = void 0 === d ? this.getTabIndex() : d,
				c,
				g,
				l,
				k,
				h,
				e;
			if (0 >= b)
				for (h = this.getNextSourceNode(a, CKEDITOR.NODE_ELEMENT); h; ) {
					if (h.isVisible() && 0 === h.getTabIndex()) {
						l = h;
						break;
					}
					h = h.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT);
				}
			else
				for (
					h = this.getDocument().getBody().getFirst();
					(h = h.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT));

				) {
					if (!c)
						if (!g && h.equals(this)) {
							if (((g = !0), a)) {
								if (!(h = h.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT)))
									break;
								c = 1;
							}
						} else g && !this.contains(h) && (c = 1);
					if (h.isVisible() && !(0 > (e = h.getTabIndex()))) {
						if (c && e == b) {
							l = h;
							break;
						}
						e > b && (!l || !k || e < k)
							? ((l = h), (k = e))
							: l || 0 !== e || ((l = h), (k = e));
					}
				}
			l && l.focus();
		}),
		(CKEDITOR.dom.element.prototype.focusPrevious = function (a, d) {
			for (
				var b = void 0 === d ? this.getTabIndex() : d,
					c,
					g,
					l,
					k = 0,
					h,
					e = this.getDocument().getBody().getLast();
				(e = e.getPreviousSourceNode(!1, CKEDITOR.NODE_ELEMENT));

			) {
				if (!c)
					if (!g && e.equals(this)) {
						if (((g = !0), a)) {
							if (!(e = e.getPreviousSourceNode(!0, CKEDITOR.NODE_ELEMENT)))
								break;
							c = 1;
						}
					} else g && !this.contains(e) && (c = 1);
				if (e.isVisible() && !(0 > (h = e.getTabIndex())))
					if (0 >= b) {
						if (c && 0 === h) {
							l = e;
							break;
						}
						h > k && ((l = e), (k = h));
					} else {
						if (c && h == b) {
							l = e;
							break;
						}
						h < b && (!l || h > k) && ((l = e), (k = h));
					}
			}
			l && l.focus();
		}),
		CKEDITOR.plugins.add("table", {
			requires: "dialog",
			init: function (a) {
				function d(a) {
					return CKEDITOR.tools.extend(a || {}, {
						contextSensitive: 1,
						refresh: function (a, b) {
							this.setState(
								b.contains("table", 1)
									? CKEDITOR.TRISTATE_OFF
									: CKEDITOR.TRISTATE_DISABLED
							);
						},
					});
				}
				if (!a.blockless) {
					var b = a.lang.table;
					a.addCommand(
						"table",
						new CKEDITOR.dialogCommand("table", {
							context: "table",
							allowedContent:
								"table{width,height}[align,border,cellpadding,cellspacing,summary];caption tbody thead tfoot;th td tr[scope];" +
								(a.plugins.dialogadvtab
									? "table" + a.plugins.dialogadvtab.allowedContent()
									: ""),
							requiredContent: "table",
							contentTransformations: [
								["table{width}: sizeToStyle", "table[width]: sizeToAttribute"],
								["td: splitBorderShorthand"],
								[
									{
										element: "table",
										right: function (a) {
											if (a.styles) {
												var b;
												if (a.styles.border)
													b = CKEDITOR.tools.style.parse.border(
														a.styles.border
													);
												else if (
													CKEDITOR.env.ie &&
													8 === CKEDITOR.env.version
												) {
													var d = a.styles;
													d["border-left"] &&
														d["border-left"] === d["border-right"] &&
														d["border-right"] === d["border-top"] &&
														d["border-top"] === d["border-bottom"] &&
														(b = CKEDITOR.tools.style.parse.border(
															d["border-top"]
														));
												}
												b &&
													b.style &&
													"solid" === b.style &&
													b.width &&
													0 !== parseFloat(b.width) &&
													(a.attributes.border = 1);
												"collapse" == a.styles["border-collapse"] &&
													(a.attributes.cellspacing = 0);
											}
										},
									},
								],
							],
						})
					);
					a.addCommand(
						"tableProperties",
						new CKEDITOR.dialogCommand("tableProperties", d())
					);
					a.addCommand(
						"tableDelete",
						d({
							exec: function (a) {
								var b = a.elementPath().contains("table", 1);
								if (b) {
									var d = b.getParent(),
										k = a.editable();
									1 != d.getChildCount() ||
										d.is("td", "th") ||
										d.equals(k) ||
										(b = d);
									a = a.createRange();
									a.moveToPosition(b, CKEDITOR.POSITION_BEFORE_START);
									b.remove();
									a.select();
								}
							},
						})
					);
					a.ui.addButton &&
						a.ui.addButton("Table", {
							label: b.toolbar,
							command: "table",
							toolbar: "insert,30",
						});
					CKEDITOR.dialog.add("table", this.path + "dialogs/table.js");
					CKEDITOR.dialog.add(
						"tableProperties",
						this.path + "dialogs/table.js"
					);
					a.addMenuItems &&
						a.addMenuItems({
							table: {
								label: b.menu,
								command: "tableProperties",
								group: "table",
								order: 5,
							},
							tabledelete: {
								label: b.deleteTable,
								command: "tableDelete",
								group: "table",
								order: 1,
							},
						});
					a.on("doubleclick", function (a) {
						a.data.element.is("table") && (a.data.dialog = "tableProperties");
					});
					a.contextMenu &&
						a.contextMenu.addListener(function () {
							return {
								tabledelete: CKEDITOR.TRISTATE_OFF,
								table: CKEDITOR.TRISTATE_OFF,
							};
						});
				}
			},
		}),
		(function () {
			function a(a, b) {
				function c(a) {
					return b
						? b.contains(a) && a.getAscendant("table", !0).equals(b)
						: !0;
				}
				function e(a) {
					0 < d.length ||
						a.type != CKEDITOR.NODE_ELEMENT ||
						!v.test(a.getName()) ||
						a.getCustomData("selected_cell") ||
						(CKEDITOR.dom.element.setMarker(f, a, "selected_cell", !0),
						d.push(a));
				}
				var d = [],
					f = {};
				if (!a) return d;
				for (var g = a.getRanges(), h = 0; h < g.length; h++) {
					var k = g[h];
					if (k.collapsed)
						(k = k.getCommonAncestor().getAscendant({ td: 1, th: 1 }, !0)) &&
							c(k) &&
							d.push(k);
					else {
						var k = new CKEDITOR.dom.walker(k),
							m;
						for (k.guard = e; (m = k.next()); )
							(m.type == CKEDITOR.NODE_ELEMENT && m.is(CKEDITOR.dtd.table)) ||
								((m = m.getAscendant({ td: 1, th: 1 }, !0)) &&
									!m.getCustomData("selected_cell") &&
									c(m) &&
									(CKEDITOR.dom.element.setMarker(f, m, "selected_cell", !0),
									d.push(m)));
					}
				}
				CKEDITOR.dom.element.clearAllMarkers(f);
				return d;
			}
			function d(b, c) {
				for (
					var e = p(b) ? b : a(b),
						d = e[0],
						f = d.getAscendant("table"),
						d = d.getDocument(),
						g = e[0].getParent(),
						h = g.$.rowIndex,
						e = e[e.length - 1],
						k = e.getParent().$.rowIndex + e.$.rowSpan - 1,
						e = new CKEDITOR.dom.element(f.$.rows[k]),
						h = c ? h : k,
						g = c ? g : e,
						e = CKEDITOR.tools.buildTableMap(f),
						f = e[h],
						h = c ? e[h - 1] : e[h + 1],
						e = e[0].length,
						d = d.createElement("tr"),
						k = 0;
					f[k] && k < e;
					k++
				) {
					var m;
					1 < f[k].rowSpan && h && f[k] == h[k]
						? ((m = f[k]), (m.rowSpan += 1))
						: ((m = new CKEDITOR.dom.element(f[k]).clone()),
						  m.removeAttribute("rowSpan"),
						  m.appendBogus(),
						  d.append(m),
						  (m = m.$));
					k += m.colSpan - 1;
				}
				c ? d.insertBefore(g) : d.insertAfter(g);
				return d;
			}
			function b(c) {
				if (c instanceof CKEDITOR.dom.selection) {
					var e = c.getRanges(),
						d = a(c),
						f = d[0].getAscendant("table"),
						g = CKEDITOR.tools.buildTableMap(f),
						h = d[0].getParent().$.rowIndex,
						d = d[d.length - 1],
						k = d.getParent().$.rowIndex + d.$.rowSpan - 1,
						d = [];
					c.reset();
					for (c = h; c <= k; c++) {
						for (
							var m = g[c], l = new CKEDITOR.dom.element(f.$.rows[c]), n = 0;
							n < m.length;
							n++
						) {
							var r = new CKEDITOR.dom.element(m[n]),
								p = r.getParent().$.rowIndex;
							1 == r.$.rowSpan
								? r.remove()
								: (--r.$.rowSpan,
								  p == c &&
										((p = g[c + 1]),
										p[n - 1]
											? r.insertAfter(new CKEDITOR.dom.element(p[n - 1]))
											: new CKEDITOR.dom.element(f.$.rows[c + 1]).append(
													r,
													1
											  )));
							n += r.$.colSpan - 1;
						}
						d.push(l);
					}
					g = f.$.rows;
					e[0].moveToPosition(f, CKEDITOR.POSITION_BEFORE_START);
					h = new CKEDITOR.dom.element(
						g[k + 1] || (0 < h ? g[h - 1] : null) || f.$.parentNode
					);
					for (c = d.length; 0 <= c; c--) b(d[c]);
					return f.$.parentNode ? h : (e[0].select(), null);
				}
				c instanceof CKEDITOR.dom.element &&
					((f = c.getAscendant("table")),
					1 == f.$.rows.length ? f.remove() : c.remove());
				return null;
			}
			function c(a) {
				for (var b = a.getParent().$.cells, c = 0, e = 0; e < b.length; e++) {
					var d = b[e],
						c = c + d.colSpan;
					if (d == a.$) break;
				}
				return c - 1;
			}
			function g(a, b) {
				for (var e = b ? Infinity : 0, d = 0; d < a.length; d++) {
					var f = c(a[d]);
					if (b ? f < e : f > e) e = f;
				}
				return e;
			}
			function l(b, c) {
				for (
					var e = p(b) ? b : a(b),
						d = e[0].getAscendant("table"),
						f = g(e, 1),
						e = g(e),
						h = c ? f : e,
						k = CKEDITOR.tools.buildTableMap(d),
						d = [],
						f = [],
						e = [],
						m = k.length,
						l = 0;
					l < m;
					l++
				)
					d.push(k[l][h]), f.push(c ? k[l][h - 1] : k[l][h + 1]);
				for (l = 0; l < m; l++)
					d[l] &&
						(1 < d[l].colSpan && f[l] == d[l]
							? ((k = d[l]), (k.colSpan += 1))
							: ((h = new CKEDITOR.dom.element(d[l])),
							  (k = h.clone()),
							  k.removeAttribute("colSpan"),
							  k.appendBogus(),
							  k[c ? "insertBefore" : "insertAfter"].call(k, h),
							  e.push(k),
							  (k = k.$)),
						(l += k.rowSpan - 1));
				return e;
			}
			function k(b) {
				function c(a) {
					var b, e, d;
					b = a.getRanges();
					if (1 !== b.length) return a;
					b = b[0];
					if (b.collapsed || 0 !== b.endOffset) return a;
					e = b.endContainer;
					d = e.getName().toLowerCase();
					if ("td" !== d && "th" !== d) return a;
					for (
						(d = e.getPrevious()) ||
						(d = e.getParent().getPrevious().getLast());
						d.type !== CKEDITOR.NODE_TEXT && "br" !== d.getName().toLowerCase();

					)
						if (((d = d.getLast()), !d)) return a;
					b.setEndAt(d, CKEDITOR.POSITION_BEFORE_END);
					return b.select();
				}
				CKEDITOR.env.webkit && !b.isFake && (b = c(b));
				var e = b.getRanges(),
					d = a(b),
					f = d[0],
					g = d[d.length - 1],
					d = f.getAscendant("table"),
					h = CKEDITOR.tools.buildTableMap(d),
					k,
					m,
					l = [];
				b.reset();
				var n = 0;
				for (b = h.length; n < b; n++)
					for (var r = 0, p = h[n].length; r < p; r++)
						void 0 === k && h[n][r] == f.$ && (k = r),
							h[n][r] == g.$ && (m = r);
				for (n = k; n <= m; n++)
					for (r = 0; r < h.length; r++)
						(g = h[r]),
							(f = new CKEDITOR.dom.element(d.$.rows[r])),
							(g = new CKEDITOR.dom.element(g[n])),
							g.$ &&
								(1 == g.$.colSpan ? g.remove() : --g.$.colSpan,
								(r += g.$.rowSpan - 1),
								f.$.cells.length || l.push(f));
				k =
					h[0].length - 1 > m
						? new CKEDITOR.dom.element(h[0][m + 1])
						: k && -1 !== h[0][k - 1].cellIndex
						? new CKEDITOR.dom.element(h[0][k - 1])
						: new CKEDITOR.dom.element(d.$.parentNode);
				l.length == b &&
					(e[0].moveToPosition(d, CKEDITOR.POSITION_AFTER_END),
					e[0].select(),
					d.remove());
				return k;
			}
			function h(a, b) {
				var c = a.getStartElement().getAscendant({ td: 1, th: 1 }, !0);
				if (c) {
					var e = c.clone();
					e.appendBogus();
					b ? e.insertBefore(c) : e.insertAfter(c);
				}
			}
			function e(b) {
				if (b instanceof CKEDITOR.dom.selection) {
					var c = b.getRanges(),
						d = a(b),
						f = d[0] && d[0].getAscendant("table"),
						g;
					a: {
						var h = 0;
						g = d.length - 1;
						for (var k = {}, l, n; (l = d[h++]); )
							CKEDITOR.dom.element.setMarker(k, l, "delete_cell", !0);
						for (h = 0; (l = d[h++]); )
							if (
								((n = l.getPrevious()) && !n.getCustomData("delete_cell")) ||
								((n = l.getNext()) && !n.getCustomData("delete_cell"))
							) {
								CKEDITOR.dom.element.clearAllMarkers(k);
								g = n;
								break a;
							}
						CKEDITOR.dom.element.clearAllMarkers(k);
						h = d[0].getParent();
						(h = h.getPrevious())
							? (g = h.getLast())
							: ((h = d[g].getParent()),
							  (g = (h = h.getNext()) ? h.getChild(0) : null));
					}
					b.reset();
					for (b = d.length - 1; 0 <= b; b--) e(d[b]);
					g
						? m(g, !0)
						: f &&
						  (c[0].moveToPosition(f, CKEDITOR.POSITION_BEFORE_START),
						  c[0].select(),
						  f.remove());
				} else
					b instanceof CKEDITOR.dom.element &&
						((c = b.getParent()),
						1 == c.getChildCount() ? c.remove() : b.remove());
			}
			function m(a, b) {
				var c = a.getDocument(),
					e = CKEDITOR.document;
				CKEDITOR.env.ie && 10 == CKEDITOR.env.version && (e.focus(), c.focus());
				c = new CKEDITOR.dom.range(c);
				c["moveToElementEdit" + (b ? "End" : "Start")](a) ||
					(c.selectNodeContents(a), c.collapse(b ? !1 : !0));
				c.select(!0);
			}
			function f(a, b, c) {
				a = a[b];
				if ("undefined" == typeof c) return a;
				for (b = 0; a && b < a.length; b++) {
					if (c.is && a[b] == c.$) return b;
					if (b == c) return new CKEDITOR.dom.element(a[b]);
				}
				return c.is ? -1 : null;
			}
			function n(b, c, e) {
				var d = a(b),
					g;
				if (
					(c ? 1 != d.length : 2 > d.length) ||
					((g = b.getCommonAncestor()) &&
						g.type == CKEDITOR.NODE_ELEMENT &&
						g.is("table"))
				)
					return !1;
				var h;
				b = d[0];
				g = b.getAscendant("table");
				var k = CKEDITOR.tools.buildTableMap(g),
					m = k.length,
					l = k[0].length,
					n = b.getParent().$.rowIndex,
					r = f(k, n, b);
				if (c) {
					var p;
					try {
						var v = parseInt(b.getAttribute("rowspan"), 10) || 1;
						h = parseInt(b.getAttribute("colspan"), 10) || 1;
						p =
							k["up" == c ? n - v : "down" == c ? n + v : n][
								"left" == c ? r - h : "right" == c ? r + h : r
							];
					} catch (x) {
						return !1;
					}
					if (!p || b.$ == p) return !1;
					d["up" == c || "left" == c ? "unshift" : "push"](
						new CKEDITOR.dom.element(p)
					);
				}
				c = b.getDocument();
				var L = n,
					v = (p = 0),
					I = !e && new CKEDITOR.dom.documentFragment(c),
					D = 0;
				for (c = 0; c < d.length; c++) {
					h = d[c];
					var Q = h.getParent(),
						T = h.getFirst(),
						R = h.$.colSpan,
						K = h.$.rowSpan,
						Q = Q.$.rowIndex,
						W = f(k, Q, h),
						D = D + R * K,
						v = Math.max(v, W - r + R);
					p = Math.max(p, Q - n + K);
					e ||
						((R = h),
						(K = R.getBogus()) && K.remove(),
						R.trim(),
						h.getChildren().count() &&
							(Q == L ||
								!T ||
								(T.isBlockBoundary && T.isBlockBoundary({ br: 1 })) ||
								((L = I.getLast(CKEDITOR.dom.walker.whitespaces(!0))),
								!L || (L.is && L.is("br")) || I.append("br")),
							h.moveChildren(I)),
						c ? h.remove() : h.setHtml(""));
					L = Q;
				}
				if (e) return p * v == D;
				I.moveChildren(b);
				b.appendBogus();
				v >= l ? b.removeAttribute("rowSpan") : (b.$.rowSpan = p);
				p >= m ? b.removeAttribute("colSpan") : (b.$.colSpan = v);
				e = new CKEDITOR.dom.nodeList(g.$.rows);
				d = e.count();
				for (c = d - 1; 0 <= c; c--)
					(g = e.getItem(c)), g.$.cells.length || (g.remove(), d++);
				return b;
			}
			function r(b, c) {
				var e = a(b);
				if (1 < e.length) return !1;
				if (c) return !0;
				var e = e[0],
					d = e.getParent(),
					g = d.getAscendant("table"),
					h = CKEDITOR.tools.buildTableMap(g),
					k = d.$.rowIndex,
					m = f(h, k, e),
					l = e.$.rowSpan,
					n;
				if (1 < l) {
					n = Math.ceil(l / 2);
					for (
						var l = Math.floor(l / 2),
							d = k + n,
							g = new CKEDITOR.dom.element(g.$.rows[d]),
							h = f(h, d),
							r,
							d = e.clone(),
							k = 0;
						k < h.length;
						k++
					)
						if (((r = h[k]), r.parentNode == g.$ && k > m)) {
							d.insertBefore(new CKEDITOR.dom.element(r));
							break;
						} else r = null;
					r || g.append(d);
				} else
					for (
						l = n = 1,
							g = d.clone(),
							g.insertAfter(d),
							g.append((d = e.clone())),
							r = f(h, k),
							m = 0;
						m < r.length;
						m++
					)
						r[m].rowSpan++;
				d.appendBogus();
				e.$.rowSpan = n;
				d.$.rowSpan = l;
				1 == n && e.removeAttribute("rowSpan");
				1 == l && d.removeAttribute("rowSpan");
				return d;
			}
			function x(b, c) {
				var e = a(b);
				if (1 < e.length) return !1;
				if (c) return !0;
				var e = e[0],
					d = e.getParent(),
					g = d.getAscendant("table"),
					g = CKEDITOR.tools.buildTableMap(g),
					h = f(g, d.$.rowIndex, e),
					k = e.$.colSpan;
				if (1 < k) (d = Math.ceil(k / 2)), (k = Math.floor(k / 2));
				else {
					for (var k = (d = 1), m = [], l = 0; l < g.length; l++) {
						var n = g[l];
						m.push(n[h]);
						1 < n[h].rowSpan && (l += n[h].rowSpan - 1);
					}
					for (g = 0; g < m.length; g++) m[g].colSpan++;
				}
				g = e.clone();
				g.insertAfter(e);
				g.appendBogus();
				e.$.colSpan = d;
				g.$.colSpan = k;
				1 == d && e.removeAttribute("colSpan");
				1 == k && g.removeAttribute("colSpan");
				return g;
			}
			var v = /^(?:td|th)$/,
				p = CKEDITOR.tools.isArray;
			CKEDITOR.plugins.tabletools = {
				requires: "table,dialog,contextmenu",
				init: function (c) {
					function f(a) {
						return CKEDITOR.tools.extend(a || {}, {
							contextSensitive: 1,
							refresh: function (a, b) {
								this.setState(
									b.contains({ td: 1, th: 1 }, 1)
										? CKEDITOR.TRISTATE_OFF
										: CKEDITOR.TRISTATE_DISABLED
								);
							},
						});
					}
					function g(a, b) {
						var e = c.addCommand(a, b);
						c.addFeature(e);
					}
					var p = c.lang.table,
						v = CKEDITOR.tools.style.parse;
					g(
						"cellProperties",
						new CKEDITOR.dialogCommand(
							"cellProperties",
							f({
								allowedContent:
									"td th{width,height,border-color,background-color,white-space,vertical-align,text-align}[colspan,rowspan]",
								requiredContent: "table",
								contentTransformations: [
									[
										{
											element: "td",
											left: function (a) {
												return (
													a.styles.background &&
													v.background(a.styles.background).color
												);
											},
											right: function (a) {
												a.styles["background-color"] = v.background(
													a.styles.background
												).color;
											},
										},
										{
											element: "td",
											check: "td{vertical-align}",
											left: function (a) {
												return a.attributes && a.attributes.valign;
											},
											right: function (a) {
												a.styles["vertical-align"] = a.attributes.valign;
												delete a.attributes.valign;
											},
										},
									],
									[
										{
											element: "tr",
											check: "td{height}",
											left: function (a) {
												return a.styles && a.styles.height;
											},
											right: function (a) {
												CKEDITOR.tools.array.forEach(a.children, function (b) {
													b.name in { td: 1, th: 1 } &&
														(b.attributes["cke-row-height"] = a.styles.height);
												});
												delete a.styles.height;
											},
										},
									],
									[
										{
											element: "td",
											check: "td{height}",
											left: function (a) {
												return (a = a.attributes) && a["cke-row-height"];
											},
											right: function (a) {
												a.styles.height = a.attributes["cke-row-height"];
												delete a.attributes["cke-row-height"];
											},
										},
									],
								],
							})
						)
					);
					CKEDITOR.dialog.add(
						"cellProperties",
						this.path + "dialogs/tableCell.js"
					);
					g(
						"rowDelete",
						f({
							requiredContent: "table",
							exec: function (a) {
								a = a.getSelection();
								(a = b(a)) && m(a);
							},
						})
					);
					g(
						"rowInsertBefore",
						f({
							requiredContent: "table",
							exec: function (b) {
								b = b.getSelection();
								b = a(b);
								d(b, !0);
							},
						})
					);
					g(
						"rowInsertAfter",
						f({
							requiredContent: "table",
							exec: function (b) {
								b = b.getSelection();
								b = a(b);
								d(b);
							},
						})
					);
					g(
						"columnDelete",
						f({
							requiredContent: "table",
							exec: function (a) {
								a = a.getSelection();
								(a = k(a)) && m(a, !0);
							},
						})
					);
					g(
						"columnInsertBefore",
						f({
							requiredContent: "table",
							exec: function (b) {
								b = b.getSelection();
								b = a(b);
								l(b, !0);
							},
						})
					);
					g(
						"columnInsertAfter",
						f({
							requiredContent: "table",
							exec: function (b) {
								b = b.getSelection();
								b = a(b);
								l(b);
							},
						})
					);
					g(
						"cellDelete",
						f({
							requiredContent: "table",
							exec: function (a) {
								a = a.getSelection();
								e(a);
							},
						})
					);
					g(
						"cellMerge",
						f({
							allowedContent: "td[colspan,rowspan]",
							requiredContent: "td[colspan,rowspan]",
							exec: function (a, b) {
								b.cell = n(a.getSelection());
								m(b.cell, !0);
							},
						})
					);
					g(
						"cellMergeRight",
						f({
							allowedContent: "td[colspan]",
							requiredContent: "td[colspan]",
							exec: function (a, b) {
								b.cell = n(a.getSelection(), "right");
								m(b.cell, !0);
							},
						})
					);
					g(
						"cellMergeDown",
						f({
							allowedContent: "td[rowspan]",
							requiredContent: "td[rowspan]",
							exec: function (a, b) {
								b.cell = n(a.getSelection(), "down");
								m(b.cell, !0);
							},
						})
					);
					g(
						"cellVerticalSplit",
						f({
							allowedContent: "td[rowspan]",
							requiredContent: "td[rowspan]",
							exec: function (a) {
								m(x(a.getSelection()));
							},
						})
					);
					g(
						"cellHorizontalSplit",
						f({
							allowedContent: "td[colspan]",
							requiredContent: "td[colspan]",
							exec: function (a) {
								m(r(a.getSelection()));
							},
						})
					);
					g(
						"cellInsertBefore",
						f({
							requiredContent: "table",
							exec: function (a) {
								a = a.getSelection();
								h(a, !0);
							},
						})
					);
					g(
						"cellInsertAfter",
						f({
							requiredContent: "table",
							exec: function (a) {
								a = a.getSelection();
								h(a);
							},
						})
					);
					c.addMenuItems &&
						c.addMenuItems({
							tablecell: {
								label: p.cell.menu,
								group: "tablecell",
								order: 1,
								getItems: function () {
									var b = c.getSelection(),
										e = a(b);
									return {
										tablecell_insertBefore: CKEDITOR.TRISTATE_OFF,
										tablecell_insertAfter: CKEDITOR.TRISTATE_OFF,
										tablecell_delete: CKEDITOR.TRISTATE_OFF,
										tablecell_merge: n(b, null, !0)
											? CKEDITOR.TRISTATE_OFF
											: CKEDITOR.TRISTATE_DISABLED,
										tablecell_merge_right: n(b, "right", !0)
											? CKEDITOR.TRISTATE_OFF
											: CKEDITOR.TRISTATE_DISABLED,
										tablecell_merge_down: n(b, "down", !0)
											? CKEDITOR.TRISTATE_OFF
											: CKEDITOR.TRISTATE_DISABLED,
										tablecell_split_vertical: x(b, !0)
											? CKEDITOR.TRISTATE_OFF
											: CKEDITOR.TRISTATE_DISABLED,
										tablecell_split_horizontal: r(b, !0)
											? CKEDITOR.TRISTATE_OFF
											: CKEDITOR.TRISTATE_DISABLED,
										tablecell_properties:
											0 < e.length
												? CKEDITOR.TRISTATE_OFF
												: CKEDITOR.TRISTATE_DISABLED,
									};
								},
							},
							tablecell_insertBefore: {
								label: p.cell.insertBefore,
								group: "tablecell",
								command: "cellInsertBefore",
								order: 5,
							},
							tablecell_insertAfter: {
								label: p.cell.insertAfter,
								group: "tablecell",
								command: "cellInsertAfter",
								order: 10,
							},
							tablecell_delete: {
								label: p.cell.deleteCell,
								group: "tablecell",
								command: "cellDelete",
								order: 15,
							},
							tablecell_merge: {
								label: p.cell.merge,
								group: "tablecell",
								command: "cellMerge",
								order: 16,
							},
							tablecell_merge_right: {
								label: p.cell.mergeRight,
								group: "tablecell",
								command: "cellMergeRight",
								order: 17,
							},
							tablecell_merge_down: {
								label: p.cell.mergeDown,
								group: "tablecell",
								command: "cellMergeDown",
								order: 18,
							},
							tablecell_split_horizontal: {
								label: p.cell.splitHorizontal,
								group: "tablecell",
								command: "cellHorizontalSplit",
								order: 19,
							},
							tablecell_split_vertical: {
								label: p.cell.splitVertical,
								group: "tablecell",
								command: "cellVerticalSplit",
								order: 20,
							},
							tablecell_properties: {
								label: p.cell.title,
								group: "tablecellproperties",
								command: "cellProperties",
								order: 21,
							},
							tablerow: {
								label: p.row.menu,
								group: "tablerow",
								order: 1,
								getItems: function () {
									return {
										tablerow_insertBefore: CKEDITOR.TRISTATE_OFF,
										tablerow_insertAfter: CKEDITOR.TRISTATE_OFF,
										tablerow_delete: CKEDITOR.TRISTATE_OFF,
									};
								},
							},
							tablerow_insertBefore: {
								label: p.row.insertBefore,
								group: "tablerow",
								command: "rowInsertBefore",
								order: 5,
							},
							tablerow_insertAfter: {
								label: p.row.insertAfter,
								group: "tablerow",
								command: "rowInsertAfter",
								order: 10,
							},
							tablerow_delete: {
								label: p.row.deleteRow,
								group: "tablerow",
								command: "rowDelete",
								order: 15,
							},
							tablecolumn: {
								label: p.column.menu,
								group: "tablecolumn",
								order: 1,
								getItems: function () {
									return {
										tablecolumn_insertBefore: CKEDITOR.TRISTATE_OFF,
										tablecolumn_insertAfter: CKEDITOR.TRISTATE_OFF,
										tablecolumn_delete: CKEDITOR.TRISTATE_OFF,
									};
								},
							},
							tablecolumn_insertBefore: {
								label: p.column.insertBefore,
								group: "tablecolumn",
								command: "columnInsertBefore",
								order: 5,
							},
							tablecolumn_insertAfter: {
								label: p.column.insertAfter,
								group: "tablecolumn",
								command: "columnInsertAfter",
								order: 10,
							},
							tablecolumn_delete: {
								label: p.column.deleteColumn,
								group: "tablecolumn",
								command: "columnDelete",
								order: 15,
							},
						});
					c.contextMenu &&
						c.contextMenu.addListener(function (a, b, c) {
							return (a = c.contains({ td: 1, th: 1 }, 1)) && !a.isReadOnly()
								? {
										tablecell: CKEDITOR.TRISTATE_OFF,
										tablerow: CKEDITOR.TRISTATE_OFF,
										tablecolumn: CKEDITOR.TRISTATE_OFF,
								  }
								: null;
						});
				},
				getCellColIndex: c,
				insertRow: d,
				insertColumn: l,
				getSelectedCells: a,
			};
			CKEDITOR.plugins.add("tabletools", CKEDITOR.plugins.tabletools);
		})(),
		(CKEDITOR.tools.buildTableMap = function (a, d, b, c, g) {
			a = a.$.rows;
			b = b || 0;
			c = "number" === typeof c ? c : a.length - 1;
			g = "number" === typeof g ? g : -1;
			var l = -1,
				k = [];
			for (d = d || 0; d <= c; d++) {
				l++;
				!k[l] && (k[l] = []);
				for (
					var h = -1, e = b;
					e <= (-1 === g ? a[d].cells.length - 1 : g);
					e++
				) {
					var m = a[d].cells[e];
					if (!m) break;
					for (h++; k[l][h]; ) h++;
					for (
						var f = isNaN(m.colSpan) ? 1 : m.colSpan,
							m = isNaN(m.rowSpan) ? 1 : m.rowSpan,
							n = 0;
						n < m && !(d + n > c);
						n++
					) {
						k[l + n] || (k[l + n] = []);
						for (var r = 0; r < f; r++) k[l + n][h + r] = a[d].cells[e];
					}
					h += f - 1;
					if (-1 !== g && h >= g) break;
				}
			}
			return k;
		}),
		(function () {
			function a(a) {
				return (
					CKEDITOR.plugins.widget && CKEDITOR.plugins.widget.isDomWidget(a)
				);
			}
			function d(a, b) {
				var c = a.getAscendant("table"),
					e = b.getAscendant("table"),
					d = CKEDITOR.tools.buildTableMap(c),
					f = m(a),
					g = m(b),
					h = [],
					k = {},
					l,
					n;
				c.contains(e) && ((b = b.getAscendant({ td: 1, th: 1 })), (g = m(b)));
				f > g && ((c = f), (f = g), (g = c), (c = a), (a = b), (b = c));
				for (c = 0; c < d[f].length; c++)
					if (a.$ === d[f][c]) {
						l = c;
						break;
					}
				for (c = 0; c < d[g].length; c++)
					if (b.$ === d[g][c]) {
						n = c;
						break;
					}
				l > n && ((c = l), (l = n), (n = c));
				for (c = f; c <= g; c++)
					for (f = l; f <= n; f++)
						(e = new CKEDITOR.dom.element(d[c][f])),
							e.$ &&
								!e.getCustomData("selected_cell") &&
								(h.push(e),
								CKEDITOR.dom.element.setMarker(k, e, "selected_cell", !0));
				CKEDITOR.dom.element.clearAllMarkers(k);
				return h;
			}
			function b(a) {
				if (a)
					return (
						(a = a.clone()),
						a.enlarge(CKEDITOR.ENLARGE_ELEMENT),
						(a = a.getEnclosedNode()) &&
							a.is &&
							a.is(CKEDITOR.dtd.$tableContent)
					);
			}
			function c(a) {
				return (
					(a = a.editable().findOne(".cke_table-faked-selection")) &&
					a.getAscendant("table")
				);
			}
			function g(a, b) {
				var c = a.editable().find(".cke_table-faked-selection"),
					e;
				a.fire("lockSnapshot");
				a.editable().removeClass("cke_table-faked-selection-editor");
				for (e = 0; e < c.count(); e++)
					c.getItem(e).removeClass("cke_table-faked-selection");
				0 < c.count() &&
					c
						.getItem(0)
						.getAscendant("table")
						.data("cke-table-faked-selection-table", !1);
				a.fire("unlockSnapshot");
				b &&
					((u = { active: !1 }),
					a.getSelection().isInTable() && a.getSelection().reset());
			}
			function l(a, b) {
				var c = [],
					e,
					d;
				for (d = 0; d < b.length; d++)
					(e = a.createRange()),
						e.setStartBefore(b[d]),
						e.setEndAfter(b[d]),
						c.push(e);
				a.getSelection().selectRanges(c);
			}
			function k(a) {
				var b = a.editable().find(".cke_table-faked-selection");
				1 > b.count() ||
					((b = d(b.getItem(0), b.getItem(b.count() - 1))), l(a, b));
			}
			function h(b, c, e) {
				var f = q(b.getSelection(!0));
				c = c.is("table") ? null : c;
				var h;
				(h = u.active && !u.first) &&
					!(h = c) &&
					((h = b.getSelection().getRanges()),
					(h = 1 < f.length || (h[0] && !h[0].collapsed) ? !0 : !1));
				if (h) (u.first = c || f[0]), (u.dirty = c ? !1 : 1 !== f.length);
				else if (
					u.active &&
					c &&
					u.first.getAscendant("table").equals(c.getAscendant("table"))
				) {
					f = d(u.first, c);
					if (!u.dirty && 1 === f.length && !a(e.data.getTarget()))
						return g(b, "mouseup" === e.name);
					u.dirty = !0;
					u.last = c;
					l(b, f);
				}
			}
			function e(a) {
				var b = (a = a.editor || a.sender.editor) && a.getSelection(),
					c = (b && b.getRanges()) || [],
					e;
				if (b && (g(a), b.isInTable() && b.isFake)) {
					1 === c.length &&
						c[0]._getTableElement() &&
						c[0]._getTableElement().is("table") &&
						(e = c[0]._getTableElement());
					e = q(b, e);
					a.fire("lockSnapshot");
					for (b = 0; b < e.length; b++)
						e[b].addClass("cke_table-faked-selection");
					0 < e.length &&
						(a.editable().addClass("cke_table-faked-selection-editor"),
						e[0]
							.getAscendant("table")
							.data("cke-table-faked-selection-table", ""));
					a.fire("unlockSnapshot");
				}
			}
			function m(a) {
				return a.getAscendant("tr", !0).$.rowIndex;
			}
			function f(b) {
				function e(a, b) {
					return a && b
						? a.equals(b) ||
								a.contains(b) ||
								b.contains(a) ||
								a.getCommonAncestor(b).is(v)
						: !1;
				}
				function d(a) {
					return (
						!a.getAscendant("table", !0) && a.getDocument().equals(l.document)
					);
				}
				function m(a, b, c, e) {
					if (
						"mousedown" === a.name &&
						(CKEDITOR.tools.getMouseButton(a) === CKEDITOR.MOUSE_BUTTON_LEFT ||
							!e)
					)
						return !0;
					if (
						(b =
							a.name === (CKEDITOR.env.gecko ? "mousedown" : "mouseup") &&
							!d(a.data.getTarget()))
					)
						(a = a.data.getTarget().getAscendant({ td: 1, th: 1 }, !0)),
							(b = !(a && a.hasClass("cke_table-faked-selection")));
					return b;
				}
				if (
					b.data.getTarget().getName &&
					("mouseup" === b.name || !a(b.data.getTarget()))
				) {
					var l = b.editor || b.listenerData.editor,
						n = l.getSelection(1),
						r = c(l),
						p = b.data.getTarget(),
						q = p && p.getAscendant({ td: 1, th: 1 }, !0),
						p = p && p.getAscendant("table", !0),
						v = { table: 1, thead: 1, tbody: 1, tfoot: 1, tr: 1, td: 1, th: 1 };
					m(b, n, r, p) && g(l, !0);
					!u.active &&
						"mousedown" === b.name &&
						CKEDITOR.tools.getMouseButton(b) === CKEDITOR.MOUSE_BUTTON_LEFT &&
						p &&
						((u = { active: !0 }),
						CKEDITOR.document.on("mouseup", f, null, { editor: l }));
					(q || p) && h(l, q || p, b);
					"mouseup" === b.name &&
						(CKEDITOR.tools.getMouseButton(b) === CKEDITOR.MOUSE_BUTTON_LEFT &&
							(d(b.data.getTarget()) || e(r, p)) &&
							k(l),
						(u = { active: !1 }),
						CKEDITOR.document.removeListener("mouseup", f));
				}
			}
			function n(a) {
				var b = a.data.getTarget().getAscendant({ td: 1, th: 1 }, !0);
				b &&
					!b.hasClass("cke_table-faked-selection") &&
					(a.cancel(), a.data.preventDefault());
			}
			function r(a, b) {
				function c(a) {
					a.cancel();
				}
				var e = a.getSelection(),
					d = e.createBookmarks(),
					f = a.document,
					g = a.createRange(),
					h = f.getDocumentElement().$,
					k = CKEDITOR.env.ie && 9 > CKEDITOR.env.version,
					m = a.blockless || CKEDITOR.env.ie ? "span" : "div",
					l,
					n,
					r,
					p;
				f.getById("cke_table_copybin") ||
					((l = f.createElement(m)),
					(n = f.createElement(m)),
					n.setAttributes({ id: "cke_table_copybin", "data-cke-temp": "1" }),
					l.setStyles({
						position: "absolute",
						width: "1px",
						height: "1px",
						overflow: "hidden",
					}),
					l.setStyle(
						"ltr" == a.config.contentsLangDirection ? "left" : "right",
						"-5000px"
					),
					l.setHtml(a.getSelectedHtml(!0)),
					a.fire("lockSnapshot"),
					n.append(l),
					a.editable().append(n),
					(p = a.on("selectionChange", c, null, null, 0)),
					k && (r = h.scrollTop),
					g.selectNodeContents(l),
					g.select(),
					k && (h.scrollTop = r),
					setTimeout(function () {
						n.remove();
						e.selectBookmarks(d);
						p.removeListener();
						a.fire("unlockSnapshot");
						b && (a.extractSelectedHtml(), a.fire("saveSnapshot"));
					}, 100));
			}
			function x(a) {
				var b = a.editor || a.sender.editor;
				b.getSelection().isInTable() && r(b, "cut" === a.name);
			}
			function v(a) {
				this._reset();
				a && this.setSelectedCells(a);
			}
			function p(a, b, c) {
				a.on("beforeCommandExec", function (c) {
					-1 !== CKEDITOR.tools.array.indexOf(b, c.data.name) &&
						(c.data.selectedCells = q(a.getSelection()));
				});
				a.on("afterCommandExec", function (e) {
					-1 !== CKEDITOR.tools.array.indexOf(b, e.data.name) && c(a, e.data);
				});
			}
			var u = { active: !1 },
				w,
				q,
				z,
				t,
				y;
			v.prototype = {};
			v.prototype._reset = function () {
				this.cells = { first: null, last: null, all: [] };
				this.rows = { first: null, last: null };
			};
			v.prototype.setSelectedCells = function (a) {
				this._reset();
				a = a.slice(0);
				this._arraySortByDOMOrder(a);
				this.cells.all = a;
				this.cells.first = a[0];
				this.cells.last = a[a.length - 1];
				this.rows.first = a[0].getAscendant("tr");
				this.rows.last = this.cells.last.getAscendant("tr");
			};
			v.prototype.getTableMap = function () {
				var a = z(this.cells.first),
					b;
				a: {
					b = this.cells.last;
					var c = b.getAscendant("table"),
						e = m(b),
						c = CKEDITOR.tools.buildTableMap(c),
						d;
					for (d = 0; d < c[e].length; d++)
						if (new CKEDITOR.dom.element(c[e][d]).equals(b)) {
							b = d;
							break a;
						}
					b = void 0;
				}
				return CKEDITOR.tools.buildTableMap(
					this._getTable(),
					m(this.rows.first),
					a,
					m(this.rows.last),
					b
				);
			};
			v.prototype._getTable = function () {
				return this.rows.first.getAscendant("table");
			};
			v.prototype.insertRow = function (a, b, c) {
				if ("undefined" === typeof a) a = 1;
				else if (0 >= a) return;
				for (
					var e = this.cells.first.$.cellIndex,
						d = this.cells.last.$.cellIndex,
						f = c ? [] : this.cells.all,
						g,
						h = 0;
					h < a;
					h++
				)
					(g = t(c ? this.cells.all : f, b)),
						(g = CKEDITOR.tools.array.filter(
							g.find("td, th").toArray(),
							function (a) {
								return c ? !0 : a.$.cellIndex >= e && a.$.cellIndex <= d;
							}
						)),
						(f = b ? g.concat(f) : f.concat(g));
				this.setSelectedCells(f);
			};
			v.prototype.insertColumn = function (a) {
				function b(a) {
					a = m(a);
					return a >= d && a <= f;
				}
				if ("undefined" === typeof a) a = 1;
				else if (0 >= a) return;
				for (
					var c = this.cells, e = c.all, d = m(c.first), f = m(c.last), c = 0;
					c < a;
					c++
				)
					e = e.concat(CKEDITOR.tools.array.filter(y(e), b));
				this.setSelectedCells(e);
			};
			v.prototype.emptyCells = function (a) {
				a = a || this.cells.all;
				for (var b = 0; b < a.length; b++) a[b].setHtml("");
			};
			v.prototype._arraySortByDOMOrder = function (a) {
				a.sort(function (a, b) {
					return a.getPosition(b) & CKEDITOR.POSITION_PRECEDING ? -1 : 1;
				});
			};
			var C = {
				onPaste: function (a) {
					function c(a) {
						return Math.max.apply(
							null,
							CKEDITOR.tools.array.map(
								a,
								function (a) {
									return a.length;
								},
								0
							)
						);
					}
					function e(a) {
						var b = f.createRange();
						b.selectNodeContents(a);
						b.select();
					}
					var f = a.editor,
						g = f.getSelection(),
						h = q(g),
						k = this.findTableInPastedContent(f, a.data.dataValue),
						m = g.isInTable(!0) && this.isBoundarySelection(g),
						n,
						r;
					!h.length ||
						(1 === h.length && !b(g.getRanges()[0]) && !m) ||
						(m && !k) ||
						((h = h[0].getAscendant("table")),
						(n = new v(q(g, h))),
						f.once("afterPaste", function () {
							var a;
							if (r) {
								a = new CKEDITOR.dom.element(r[0][0]);
								var b = r[r.length - 1];
								a = d(a, new CKEDITOR.dom.element(b[b.length - 1]));
							} else a = n.cells.all;
							l(f, a);
						}),
						k
							? (a.stop(),
							  m
									? (n.insertRow(1, 1 === m, !0), g.selectElement(n.rows.first))
									: (n.emptyCells(), l(f, n.cells.all)),
							  (a = n.getTableMap()),
							  (r = CKEDITOR.tools.buildTableMap(k)),
							  n.insertRow(r.length - a.length),
							  n.insertColumn(c(r) - c(a)),
							  (a = n.getTableMap()),
							  this.pasteTable(n, a, r),
							  f.fire("saveSnapshot"),
							  setTimeout(function () {
									f.fire("afterPaste");
							  }, 0))
							: (e(n.cells.first),
							  f.once("afterPaste", function () {
									f.fire("lockSnapshot");
									n.emptyCells(n.cells.all.slice(1));
									l(f, n.cells.all);
									f.fire("unlockSnapshot");
							  })));
				},
				isBoundarySelection: function (a) {
					a = a.getRanges()[0];
					var b = a.endContainer.getAscendant("tr", !0);
					if (b && a.collapsed) {
						if (a.checkBoundaryOfElement(b, CKEDITOR.START)) return 1;
						if (a.checkBoundaryOfElement(b, CKEDITOR.END)) return 2;
					}
					return 0;
				},
				findTableInPastedContent: function (a, b) {
					var c = a.dataProcessor,
						e = new CKEDITOR.dom.element("body");
					c || (c = new CKEDITOR.htmlDataProcessor(a));
					e.setHtml(c.toHtml(b), { fixForBody: !1 });
					return 1 < e.getChildCount() ? null : e.findOne("table");
				},
				pasteTable: function (a, b, c) {
					var e,
						d = z(a.cells.first),
						f = a._getTable(),
						g = {},
						h,
						k,
						m,
						l;
					for (m = 0; m < c.length; m++)
						for (
							h = new CKEDITOR.dom.element(
								f.$.rows[a.rows.first.$.rowIndex + m]
							),
								l = 0;
							l < c[m].length;
							l++
						)
							if (
								((k = new CKEDITOR.dom.element(c[m][l])),
								(e =
									b[m] && b[m][l] ? new CKEDITOR.dom.element(b[m][l]) : null),
								k && !k.getCustomData("processed"))
							) {
								if (e && e.getParent()) k.replace(e);
								else if (0 === l || c[m][l - 1])
									(e =
										0 !== l ? new CKEDITOR.dom.element(c[m][l - 1]) : null) &&
									h.equals(e.getParent())
										? k.insertAfter(e)
										: 0 < d
										? h.$.cells[d]
											? k.insertAfter(new CKEDITOR.dom.element(h.$.cells[d]))
											: h.append(k)
										: h.append(k, !0);
								CKEDITOR.dom.element.setMarker(g, k, "processed", !0);
							} else k.getCustomData("processed") && e && e.remove();
					CKEDITOR.dom.element.clearAllMarkers(g);
				},
			};
			CKEDITOR.plugins.tableselection = {
				getCellsBetween: d,
				keyboardIntegration: function (a) {
					function b(a) {
						var c = a.getEnclosedNode();
						c && "function" === typeof c.is && c.is({ td: 1, th: 1 })
							? c.setText("")
							: a.deleteContents();
						CKEDITOR.tools.array.forEach(a._find("td"), function (a) {
							a.appendBogus();
						});
					}
					var c = a.editable();
					c.attachListener(
						c,
						"keydown",
						(function (a) {
							function c(b, e) {
								if (!e.length) return null;
								var f = a.createRange(),
									g = CKEDITOR.dom.range.mergeRanges(e);
								CKEDITOR.tools.array.forEach(g, function (a) {
									a.enlarge(CKEDITOR.ENLARGE_ELEMENT);
								});
								var h = g[0].getBoundaryNodes(),
									k = h.startNode,
									h = h.endNode;
								if (k && k.is && k.is(d)) {
									for (
										var m = k.getAscendant("table", !0),
											l = k.getPreviousSourceNode(!1, CKEDITOR.NODE_ELEMENT, m),
											n = !1,
											r = function (a) {
												return !k.contains(a) && a.is && a.is("td", "th");
											};
										l && !r(l);

									)
										l = l.getPreviousSourceNode(!1, CKEDITOR.NODE_ELEMENT, m);
									!l &&
										h &&
										h.is &&
										!h.is("table") &&
										h.getNext() &&
										((l = h.getNext().findOne("td, th")), (n = !0));
									if (l) f["moveToElementEdit" + (n ? "Start" : "End")](l);
									else
										f.setStartBefore(k.getAscendant("table", !0)),
											f.collapse(!0);
									g[0].deleteContents();
									return [f];
								}
								if (k) return f.moveToElementEditablePosition(k), [f];
							}
							var e = { 37: 1, 38: 1, 39: 1, 40: 1, 8: 1, 46: 1, 13: 1 },
								d = CKEDITOR.tools.extend(
									{ table: 1 },
									CKEDITOR.dtd.$tableContent
								);
							delete d.td;
							delete d.th;
							return function (d) {
								var f = d.data.getKey(),
									g = d.data.getKeystroke(),
									h,
									k = 37 === f || 38 == f,
									m,
									l,
									n;
								if (
									e[f] &&
									!a.readOnly &&
									(h = a.getSelection()) &&
									h.isInTable() &&
									h.isFake
								) {
									m = h.getRanges();
									l = m[0]._getTableElement();
									n = m[m.length - 1]._getTableElement();
									if (13 !== f || a.plugins.enterkey)
										d.data.preventDefault(), d.cancel();
									if (36 < f && 41 > f)
										m[0].moveToElementEditablePosition(k ? l : n, !k),
											h.selectRanges([m[0]]);
									else if (13 !== f || 13 === g || g === CKEDITOR.SHIFT + 13) {
										for (d = 0; d < m.length; d++) b(m[d]);
										(d = c(l, m))
											? (m = d)
											: m[0].moveToElementEditablePosition(l);
										h.selectRanges(m);
										13 === f && a.plugins.enterkey
											? (a.fire("lockSnapshot"),
											  13 === g
													? a.execCommand("enter")
													: a.execCommand("shiftEnter"),
											  a.fire("unlockSnapshot"),
											  a.fire("saveSnapshot"))
											: 13 !== f && a.fire("saveSnapshot");
									}
								}
							};
						})(a),
						null,
						null,
						-1
					);
					c.attachListener(
						c,
						"keypress",
						function (c) {
							var e = a.getSelection(),
								d = c.data.$.charCode || 13 === c.data.getKey(),
								f;
							if (
								!a.readOnly &&
								e &&
								e.isInTable() &&
								e.isFake &&
								d &&
								!(c.data.getKeystroke() & CKEDITOR.CTRL)
							) {
								c = e.getRanges();
								d = c[0].getEnclosedNode().getAscendant({ td: 1, th: 1 }, !0);
								for (f = 0; f < c.length; f++) b(c[f]);
								d &&
									(c[0].moveToElementEditablePosition(d),
									e.selectRanges([c[0]]));
							}
						},
						null,
						null,
						-1
					);
				},
				isSupportedEnvironment: !(CKEDITOR.env.ie && 11 > CKEDITOR.env.version),
			};
			CKEDITOR.plugins.add("tableselection", {
				requires: "clipboard,tabletools",
				onLoad: function () {
					w = CKEDITOR.plugins.tabletools;
					q = w.getSelectedCells;
					z = w.getCellColIndex;
					t = w.insertRow;
					y = w.insertColumn;
					CKEDITOR.document.appendStyleSheet(
						this.path + "styles/tableselection.css"
					);
				},
				init: function (a) {
					CKEDITOR.plugins.tableselection.isSupportedEnvironment &&
						(a.addContentsCss &&
							a.addContentsCss(this.path + "styles/tableselection.css"),
						a.on("contentDom", function () {
							var b = a.editable(),
								c = b.isInline() ? b : a.document,
								d = { editor: a };
							b.attachListener(c, "mousedown", f, null, d);
							b.attachListener(c, "mousemove", f, null, d);
							b.attachListener(c, "mouseup", f, null, d);
							b.attachListener(b, "dragstart", n);
							b.attachListener(a, "selectionCheck", e);
							CKEDITOR.plugins.tableselection.keyboardIntegration(a);
							CKEDITOR.plugins.clipboard &&
								!CKEDITOR.plugins.clipboard.isCustomCopyCutSupported &&
								(b.attachListener(b, "cut", x), b.attachListener(b, "copy", x));
						}),
						a.on("paste", C.onPaste, C),
						p(
							a,
							"rowInsertBefore rowInsertAfter columnInsertBefore columnInsertAfter cellInsertBefore cellInsertAfter".split(
								" "
							),
							function (a, b) {
								l(a, b.selectedCells);
							}
						),
						p(
							a,
							["cellMerge", "cellMergeRight", "cellMergeDown"],
							function (a, b) {
								l(a, [b.commandData.cell]);
							}
						),
						p(a, ["cellDelete"], function (a) {
							g(a, !0);
						}));
				},
			});
		})(),
		"use strict",
		(function () {
			var a = [
					CKEDITOR.CTRL + 90,
					CKEDITOR.CTRL + 89,
					CKEDITOR.CTRL + CKEDITOR.SHIFT + 90,
				],
				d = { 8: 1, 46: 1 };
			CKEDITOR.plugins.add("undo", {
				init: function (c) {
					function e(a) {
						f.enabled && !1 !== a.data.command.canUndo && f.save();
					}
					function d() {
						f.enabled = c.readOnly ? !1 : "wysiwyg" == c.mode;
						f.onChange();
					}
					var f = (c.undoManager = new b(c)),
						g = (f.editingHandler = new l(f)),
						k = c.addCommand("undo", {
							exec: function () {
								f.undo() && (c.selectionChange(), this.fire("afterUndo"));
							},
							startDisabled: !0,
							canUndo: !1,
						}),
						x = c.addCommand("redo", {
							exec: function () {
								f.redo() && (c.selectionChange(), this.fire("afterRedo"));
							},
							startDisabled: !0,
							canUndo: !1,
						});
					c.setKeystroke([
						[a[0], "undo"],
						[a[1], "redo"],
						[a[2], "redo"],
					]);
					f.onChange = function () {
						k.setState(
							f.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
						);
						x.setState(
							f.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
						);
					};
					c.on("beforeCommandExec", e);
					c.on("afterCommandExec", e);
					c.on("saveSnapshot", function (a) {
						f.save(a.data && a.data.contentOnly);
					});
					c.on("contentDom", g.attachListeners, g);
					c.on("instanceReady", function () {
						c.fire("saveSnapshot");
					});
					c.on("beforeModeUnload", function () {
						"wysiwyg" == c.mode && f.save(!0);
					});
					c.on("mode", d);
					c.on("readOnly", d);
					c.ui.addButton &&
						(c.ui.addButton("Undo", {
							label: c.lang.undo.undo,
							command: "undo",
							toolbar: "undo,10",
						}),
						c.ui.addButton("Redo", {
							label: c.lang.undo.redo,
							command: "redo",
							toolbar: "undo,20",
						}));
					c.resetUndo = function () {
						f.reset();
						c.fire("saveSnapshot");
					};
					c.on("updateSnapshot", function () {
						f.currentImage && f.update();
					});
					c.on("lockSnapshot", function (a) {
						a = a.data;
						f.lock(a && a.dontUpdate, a && a.forceUpdate);
					});
					c.on("unlockSnapshot", f.unlock, f);
				},
			});
			CKEDITOR.plugins.undo = {};
			var b = (CKEDITOR.plugins.undo.UndoManager = function (a) {
				this.strokesRecorded = [0, 0];
				this.locked = null;
				this.previousKeyGroup = -1;
				this.limit = a.config.undoStackSize || 20;
				this.strokesLimit = 25;
				this.editor = a;
				this.reset();
			});
			b.prototype = {
				type: function (a, c) {
					var d = b.getKeyGroup(a),
						f = this.strokesRecorded[d] + 1;
					c = c || f >= this.strokesLimit;
					this.typing ||
						((this.hasUndo = this.typing = !0),
						(this.hasRedo = !1),
						this.onChange());
					c
						? ((f = 0), this.editor.fire("saveSnapshot"))
						: this.editor.fire("change");
					this.strokesRecorded[d] = f;
					this.previousKeyGroup = d;
				},
				keyGroupChanged: function (a) {
					return b.getKeyGroup(a) != this.previousKeyGroup;
				},
				reset: function () {
					this.snapshots = [];
					this.index = -1;
					this.currentImage = null;
					this.hasRedo = this.hasUndo = !1;
					this.locked = null;
					this.resetType();
				},
				resetType: function () {
					this.strokesRecorded = [0, 0];
					this.typing = !1;
					this.previousKeyGroup = -1;
				},
				refreshState: function () {
					this.hasUndo = !!this.getNextImage(!0);
					this.hasRedo = !!this.getNextImage(!1);
					this.resetType();
					this.onChange();
				},
				save: function (a, b, d) {
					var f = this.editor;
					if (this.locked || "ready" != f.status || "wysiwyg" != f.mode)
						return !1;
					var g = f.editable();
					if (!g || "ready" != g.status) return !1;
					g = this.snapshots;
					b || (b = new c(f));
					if (!1 === b.contents) return !1;
					if (this.currentImage)
						if (b.equalsContent(this.currentImage)) {
							if (a || b.equalsSelection(this.currentImage)) return !1;
						} else !1 !== d && f.fire("change");
					g.splice(this.index + 1, g.length - this.index - 1);
					g.length == this.limit && g.shift();
					this.index = g.push(b) - 1;
					this.currentImage = b;
					!1 !== d && this.refreshState();
					return !0;
				},
				restoreImage: function (a) {
					var b = this.editor,
						c;
					a.bookmarks && (b.focus(), (c = b.getSelection()));
					this.locked = { level: 999 };
					this.editor.loadSnapshot(a.contents);
					a.bookmarks
						? c.selectBookmarks(a.bookmarks)
						: CKEDITOR.env.ie &&
						  ((c = this.editor.document.getBody().$.createTextRange()),
						  c.collapse(!0),
						  c.select());
					this.locked = null;
					this.index = a.index;
					this.currentImage = this.snapshots[this.index];
					this.update();
					this.refreshState();
					b.fire("change");
				},
				getNextImage: function (a) {
					var b = this.snapshots,
						c = this.currentImage,
						d;
					if (c)
						if (a)
							for (d = this.index - 1; 0 <= d; d--) {
								if (((a = b[d]), !c.equalsContent(a))) return (a.index = d), a;
							}
						else
							for (d = this.index + 1; d < b.length; d++)
								if (((a = b[d]), !c.equalsContent(a))) return (a.index = d), a;
					return null;
				},
				redoable: function () {
					return this.enabled && this.hasRedo;
				},
				undoable: function () {
					return this.enabled && this.hasUndo;
				},
				undo: function () {
					if (this.undoable()) {
						this.save(!0);
						var a = this.getNextImage(!0);
						if (a) return this.restoreImage(a), !0;
					}
					return !1;
				},
				redo: function () {
					if (this.redoable() && (this.save(!0), this.redoable())) {
						var a = this.getNextImage(!1);
						if (a) return this.restoreImage(a), !0;
					}
					return !1;
				},
				update: function (a) {
					if (!this.locked) {
						a || (a = new c(this.editor));
						for (
							var b = this.index, d = this.snapshots;
							0 < b && this.currentImage.equalsContent(d[b - 1]);

						)
							--b;
						d.splice(b, this.index - b + 1, a);
						this.index = b;
						this.currentImage = a;
					}
				},
				updateSelection: function (a) {
					if (!this.snapshots.length) return !1;
					var b = this.snapshots,
						c = b[b.length - 1];
					return c.equalsContent(a) && !c.equalsSelection(a)
						? ((this.currentImage = b[b.length - 1] = a), !0)
						: !1;
				},
				lock: function (a, b) {
					if (this.locked) this.locked.level++;
					else if (a) this.locked = { level: 1 };
					else {
						var d = null;
						if (b) d = !0;
						else {
							var f = new c(this.editor, !0);
							this.currentImage &&
								this.currentImage.equalsContent(f) &&
								(d = f);
						}
						this.locked = { update: d, level: 1 };
					}
				},
				unlock: function () {
					if (this.locked && !--this.locked.level) {
						var a = this.locked.update;
						this.locked = null;
						if (!0 === a) this.update();
						else if (a) {
							var b = new c(this.editor, !0);
							a.equalsContent(b) || this.update();
						}
					}
				},
			};
			b.navigationKeyCodes = {
				37: 1,
				38: 1,
				39: 1,
				40: 1,
				36: 1,
				35: 1,
				33: 1,
				34: 1,
			};
			b.keyGroups = { PRINTABLE: 0, FUNCTIONAL: 1 };
			b.isNavigationKey = function (a) {
				return !!b.navigationKeyCodes[a];
			};
			b.getKeyGroup = function (a) {
				var c = b.keyGroups;
				return d[a] ? c.FUNCTIONAL : c.PRINTABLE;
			};
			b.getOppositeKeyGroup = function (a) {
				var c = b.keyGroups;
				return a == c.FUNCTIONAL ? c.PRINTABLE : c.FUNCTIONAL;
			};
			b.ieFunctionalKeysBug = function (a) {
				return CKEDITOR.env.ie && b.getKeyGroup(a) == b.keyGroups.FUNCTIONAL;
			};
			var c = (CKEDITOR.plugins.undo.Image = function (a, b) {
					this.editor = a;
					a.fire("beforeUndoImage");
					var c = a.getSnapshot();
					CKEDITOR.env.ie &&
						c &&
						(c = c.replace(/\s+data-cke-expando=".*?"/g, ""));
					this.contents = c;
					b ||
						(this.bookmarks =
							(c = c && a.getSelection()) && c.createBookmarks2(!0));
					a.fire("afterUndoImage");
				}),
				g = /\b(?:href|src|name)="[^"]*?"/gi;
			c.prototype = {
				equalsContent: function (a) {
					var b = this.contents;
					a = a.contents;
					CKEDITOR.env.ie &&
						(CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) &&
						((b = b.replace(g, "")), (a = a.replace(g, "")));
					return b != a ? !1 : !0;
				},
				equalsSelection: function (a) {
					var b = this.bookmarks;
					a = a.bookmarks;
					if (b || a) {
						if (!b || !a || b.length != a.length) return !1;
						for (var c = 0; c < b.length; c++) {
							var d = b[c],
								g = a[c];
							if (
								d.startOffset != g.startOffset ||
								d.endOffset != g.endOffset ||
								!CKEDITOR.tools.arrayCompare(d.start, g.start) ||
								!CKEDITOR.tools.arrayCompare(d.end, g.end)
							)
								return !1;
						}
					}
					return !0;
				},
			};
			var l = (CKEDITOR.plugins.undo.NativeEditingHandler = function (a) {
				this.undoManager = a;
				this.ignoreInputEvent = !1;
				this.keyEventsStack = new k();
				this.lastKeydownImage = null;
			});
			l.prototype = {
				onKeydown: function (d) {
					var e = d.data.getKey();
					if (229 !== e)
						if (-1 < CKEDITOR.tools.indexOf(a, d.data.getKeystroke()))
							d.data.preventDefault();
						else if (
							(this.keyEventsStack.cleanUp(d),
							(d = this.undoManager),
							this.keyEventsStack.getLast(e) || this.keyEventsStack.push(e),
							(this.lastKeydownImage = new c(d.editor)),
							b.isNavigationKey(e) || this.undoManager.keyGroupChanged(e))
						)
							if (d.strokesRecorded[0] || d.strokesRecorded[1])
								d.save(!1, this.lastKeydownImage, !1), d.resetType();
				},
				onInput: function () {
					if (this.ignoreInputEvent) this.ignoreInputEvent = !1;
					else {
						var a = this.keyEventsStack.getLast();
						a || (a = this.keyEventsStack.push(0));
						this.keyEventsStack.increment(a.keyCode);
						this.keyEventsStack.getTotalInputs() >=
							this.undoManager.strokesLimit &&
							(this.undoManager.type(a.keyCode, !0),
							this.keyEventsStack.resetInputs());
					}
				},
				onKeyup: function (a) {
					var e = this.undoManager;
					a = a.data.getKey();
					var d = this.keyEventsStack.getTotalInputs();
					this.keyEventsStack.remove(a);
					if (
						!(
							b.ieFunctionalKeysBug(a) &&
							this.lastKeydownImage &&
							this.lastKeydownImage.equalsContent(new c(e.editor, !0))
						)
					)
						if (0 < d) e.type(a);
						else if (b.isNavigationKey(a)) this.onNavigationKey(!0);
				},
				onNavigationKey: function (a) {
					var b = this.undoManager;
					(!a && b.save(!0, null, !1)) || b.updateSelection(new c(b.editor));
					b.resetType();
				},
				ignoreInputEventListener: function () {
					this.ignoreInputEvent = !0;
				},
				activateInputEventListener: function () {
					this.ignoreInputEvent = !1;
				},
				attachListeners: function () {
					var a = this.undoManager.editor,
						c = a.editable(),
						d = this;
					c.attachListener(
						c,
						"keydown",
						function (a) {
							d.onKeydown(a);
							if (b.ieFunctionalKeysBug(a.data.getKey())) d.onInput();
						},
						null,
						null,
						999
					);
					c.attachListener(
						c,
						CKEDITOR.env.ie ? "keypress" : "input",
						d.onInput,
						d,
						null,
						999
					);
					c.attachListener(c, "keyup", d.onKeyup, d, null, 999);
					c.attachListener(
						c,
						"paste",
						d.ignoreInputEventListener,
						d,
						null,
						999
					);
					c.attachListener(c, "drop", d.ignoreInputEventListener, d, null, 999);
					a.on("afterPaste", d.activateInputEventListener, d, null, 999);
					c.attachListener(
						c.isInline() ? c : a.document.getDocumentElement(),
						"click",
						function () {
							d.onNavigationKey();
						},
						null,
						null,
						999
					);
					c.attachListener(
						this.undoManager.editor,
						"blur",
						function () {
							d.keyEventsStack.remove(9);
						},
						null,
						null,
						999
					);
				},
			};
			var k = (CKEDITOR.plugins.undo.KeyEventsStack = function () {
				this.stack = [];
			});
			k.prototype = {
				push: function (a) {
					a = this.stack.push({ keyCode: a, inputs: 0 });
					return this.stack[a - 1];
				},
				getLastIndex: function (a) {
					if ("number" != typeof a) return this.stack.length - 1;
					for (var b = this.stack.length; b--; )
						if (this.stack[b].keyCode == a) return b;
					return -1;
				},
				getLast: function (a) {
					a = this.getLastIndex(a);
					return -1 != a ? this.stack[a] : null;
				},
				increment: function (a) {
					this.getLast(a).inputs++;
				},
				remove: function (a) {
					a = this.getLastIndex(a);
					-1 != a && this.stack.splice(a, 1);
				},
				resetInputs: function (a) {
					if ("number" == typeof a) this.getLast(a).inputs = 0;
					else for (a = this.stack.length; a--; ) this.stack[a].inputs = 0;
				},
				getTotalInputs: function () {
					for (var a = this.stack.length, b = 0; a--; )
						b += this.stack[a].inputs;
					return b;
				},
				cleanUp: function (a) {
					a = a.data.$;
					a.ctrlKey || a.metaKey || this.remove(17);
					a.shiftKey || this.remove(16);
					a.altKey || this.remove(18);
				},
			};
		})(),
		"use strict",
		(function () {
			function a(a, b) {
				CKEDITOR.tools.extend(
					this,
					{ editor: a, editable: a.editable(), doc: a.document, win: a.window },
					b,
					!0
				);
				this.inline = this.editable.isInline();
				this.inline || (this.frame = this.win.getFrame());
				this.target = this[this.inline ? "editable" : "doc"];
			}
			function d(a, b) {
				CKEDITOR.tools.extend(this, b, { editor: a }, !0);
			}
			function b(a, b) {
				var c = a.editable();
				CKEDITOR.tools.extend(
					this,
					{
						editor: a,
						editable: c,
						inline: c.isInline(),
						doc: a.document,
						win: a.window,
						container: CKEDITOR.document.getBody(),
						winTop: CKEDITOR.document.getWindow(),
					},
					b,
					!0
				);
				this.hidden = {};
				this.visible = {};
				this.inline || (this.frame = this.win.getFrame());
				this.queryViewport();
				var d = CKEDITOR.tools.bind(this.queryViewport, this),
					h = CKEDITOR.tools.bind(this.hideVisible, this),
					k = CKEDITOR.tools.bind(this.removeAll, this);
				c.attachListener(this.winTop, "resize", d);
				c.attachListener(this.winTop, "scroll", d);
				c.attachListener(this.winTop, "resize", h);
				c.attachListener(this.win, "scroll", h);
				c.attachListener(
					this.inline ? c : this.frame,
					"mouseout",
					function (a) {
						var b = a.data.$.clientX;
						a = a.data.$.clientY;
						this.queryViewport();
						(b <= this.rect.left ||
							b >= this.rect.right ||
							a <= this.rect.top ||
							a >= this.rect.bottom) &&
							this.hideVisible();
						(0 >= b ||
							b >= this.winTopPane.width ||
							0 >= a ||
							a >= this.winTopPane.height) &&
							this.hideVisible();
					},
					this
				);
				c.attachListener(a, "resize", d);
				c.attachListener(a, "mode", k);
				a.on("destroy", k);
				this.lineTpl = new CKEDITOR.template(
					'\x3cdiv data-cke-lineutils-line\x3d"1" class\x3d"cke_reset_all" style\x3d"{lineStyle}"\x3e\x3cspan style\x3d"{tipLeftStyle}"\x3e\x26nbsp;\x3c/span\x3e\x3cspan style\x3d"{tipRightStyle}"\x3e\x26nbsp;\x3c/span\x3e\x3c/div\x3e'
				).output({
					lineStyle: CKEDITOR.tools.writeCssText(
						CKEDITOR.tools.extend({}, l, this.lineStyle, !0)
					),
					tipLeftStyle: CKEDITOR.tools.writeCssText(
						CKEDITOR.tools.extend(
							{},
							g,
							{
								left: "0px",
								"border-left-color": "red",
								"border-width": "6px 0 6px 6px",
							},
							this.tipCss,
							this.tipLeftStyle,
							!0
						)
					),
					tipRightStyle: CKEDITOR.tools.writeCssText(
						CKEDITOR.tools.extend(
							{},
							g,
							{
								right: "0px",
								"border-right-color": "red",
								"border-width": "6px 6px 6px 0",
							},
							this.tipCss,
							this.tipRightStyle,
							!0
						)
					),
				});
			}
			function c(a) {
				var b;
				if ((b = a && a.type == CKEDITOR.NODE_ELEMENT))
					b = !(k[a.getComputedStyle("float")] || k[a.getAttribute("align")]);
				return b && !h[a.getComputedStyle("position")];
			}
			CKEDITOR.plugins.add("lineutils");
			CKEDITOR.LINEUTILS_BEFORE = 1;
			CKEDITOR.LINEUTILS_AFTER = 2;
			CKEDITOR.LINEUTILS_INSIDE = 4;
			a.prototype = {
				start: function (a) {
					var b = this,
						c = this.editor,
						d = this.doc,
						g,
						h,
						k,
						l,
						u = CKEDITOR.tools.eventsBuffer(50, function () {
							c.readOnly ||
								"wysiwyg" != c.mode ||
								((b.relations = {}),
								(h = d.$.elementFromPoint(k, l)) &&
									h.nodeType &&
									((g = new CKEDITOR.dom.element(h)),
									b.traverseSearch(g),
									isNaN(k + l) || b.pixelSearch(g, k, l),
									a && a(b.relations, k, l)));
						});
					this.listener = this.editable.attachListener(
						this.target,
						"mousemove",
						function (a) {
							k = a.data.$.clientX;
							l = a.data.$.clientY;
							u.input();
						}
					);
					this.editable.attachListener(
						this.inline ? this.editable : this.frame,
						"mouseout",
						function () {
							u.reset();
						}
					);
				},
				stop: function () {
					this.listener && this.listener.removeListener();
				},
				getRange: (function () {
					var a = {};
					a[CKEDITOR.LINEUTILS_BEFORE] = CKEDITOR.POSITION_BEFORE_START;
					a[CKEDITOR.LINEUTILS_AFTER] = CKEDITOR.POSITION_AFTER_END;
					a[CKEDITOR.LINEUTILS_INSIDE] = CKEDITOR.POSITION_AFTER_START;
					return function (b) {
						var c = this.editor.createRange();
						c.moveToPosition(this.relations[b.uid].element, a[b.type]);
						return c;
					};
				})(),
				store: (function () {
					function a(b, c, d) {
						var e = b.getUniqueId();
						e in d ? (d[e].type |= c) : (d[e] = { element: b, type: c });
					}
					return function (b, d) {
						var g;
						d & CKEDITOR.LINEUTILS_AFTER &&
							c((g = b.getNext())) &&
							g.isVisible() &&
							(a(g, CKEDITOR.LINEUTILS_BEFORE, this.relations),
							(d ^= CKEDITOR.LINEUTILS_AFTER));
						d & CKEDITOR.LINEUTILS_INSIDE &&
							c((g = b.getFirst())) &&
							g.isVisible() &&
							(a(g, CKEDITOR.LINEUTILS_BEFORE, this.relations),
							(d ^= CKEDITOR.LINEUTILS_INSIDE));
						a(b, d, this.relations);
					};
				})(),
				traverseSearch: function (a) {
					var b, d, g;
					do
						if (((g = a.$["data-cke-expando"]), !(g && g in this.relations))) {
							if (a.equals(this.editable)) break;
							if (c(a))
								for (b in this.lookups)
									(d = this.lookups[b](a)) && this.store(a, d);
						}
					while (
						(!a ||
							a.type != CKEDITOR.NODE_ELEMENT ||
							"true" != a.getAttribute("contenteditable")) &&
						(a = a.getParent())
					);
				},
				pixelSearch: (function () {
					function a(d, e, g, h, k) {
						for (var l = 0, u; k(g); ) {
							g += h;
							if (25 == ++l) break;
							if ((u = this.doc.$.elementFromPoint(e, g)))
								if (u == d) l = 0;
								else if (
									b(d, u) &&
									((l = 0), c((u = new CKEDITOR.dom.element(u))))
								)
									return u;
						}
					}
					var b =
						CKEDITOR.env.ie || CKEDITOR.env.webkit
							? function (a, b) {
									return a.contains(b);
							  }
							: function (a, b) {
									return !!(a.compareDocumentPosition(b) & 16);
							  };
					return function (b, d, g) {
						var h = this.win.getViewPaneSize().height,
							k = a.call(this, b.$, d, g, -1, function (a) {
								return 0 < a;
							});
						d = a.call(this, b.$, d, g, 1, function (a) {
							return a < h;
						});
						if (k)
							for (this.traverseSearch(k); !k.getParent().equals(b); )
								k = k.getParent();
						if (d)
							for (this.traverseSearch(d); !d.getParent().equals(b); )
								d = d.getParent();
						for (; k || d; ) {
							k && (k = k.getNext(c));
							if (!k || k.equals(d)) break;
							this.traverseSearch(k);
							d && (d = d.getPrevious(c));
							if (!d || d.equals(k)) break;
							this.traverseSearch(d);
						}
					};
				})(),
				greedySearch: function () {
					this.relations = {};
					for (
						var a = this.editable.getElementsByTag("*"), b = 0, d, g, h;
						(d = a.getItem(b++));

					)
						if (
							!d.equals(this.editable) &&
							d.type == CKEDITOR.NODE_ELEMENT &&
							(d.hasAttribute("contenteditable") || !d.isReadOnly()) &&
							c(d) &&
							d.isVisible()
						)
							for (h in this.lookups)
								(g = this.lookups[h](d)) && this.store(d, g);
					return this.relations;
				},
			};
			d.prototype = {
				locate: (function () {
					function a(b, d) {
						var e = b.element[
							d === CKEDITOR.LINEUTILS_BEFORE ? "getPrevious" : "getNext"
						]();
						return e && c(e)
							? ((b.siblingRect = e.getClientRect()),
							  d == CKEDITOR.LINEUTILS_BEFORE
									? (b.siblingRect.bottom + b.elementRect.top) / 2
									: (b.elementRect.bottom + b.siblingRect.top) / 2)
							: d == CKEDITOR.LINEUTILS_BEFORE
							? b.elementRect.top
							: b.elementRect.bottom;
					}
					return function (b) {
						var c;
						this.locations = {};
						for (var d in b)
							(c = b[d]),
								(c.elementRect = c.element.getClientRect()),
								c.type & CKEDITOR.LINEUTILS_BEFORE &&
									this.store(
										d,
										CKEDITOR.LINEUTILS_BEFORE,
										a(c, CKEDITOR.LINEUTILS_BEFORE)
									),
								c.type & CKEDITOR.LINEUTILS_AFTER &&
									this.store(
										d,
										CKEDITOR.LINEUTILS_AFTER,
										a(c, CKEDITOR.LINEUTILS_AFTER)
									),
								c.type & CKEDITOR.LINEUTILS_INSIDE &&
									this.store(
										d,
										CKEDITOR.LINEUTILS_INSIDE,
										(c.elementRect.top + c.elementRect.bottom) / 2
									);
						return this.locations;
					};
				})(),
				sort: (function () {
					var a, b, c, d;
					return function (g, h) {
						a = this.locations;
						b = [];
						for (var k in a)
							for (var l in a[k])
								if (((c = Math.abs(g - a[k][l])), b.length)) {
									for (d = 0; d < b.length; d++)
										if (c < b[d].dist) {
											b.splice(d, 0, { uid: +k, type: l, dist: c });
											break;
										}
									d == b.length && b.push({ uid: +k, type: l, dist: c });
								} else b.push({ uid: +k, type: l, dist: c });
						return "undefined" != typeof h ? b.slice(0, h) : b;
					};
				})(),
				store: function (a, b, c) {
					this.locations[a] || (this.locations[a] = {});
					this.locations[a][b] = c;
				},
			};
			var g = {
					display: "block",
					width: "0px",
					height: "0px",
					"border-color": "transparent",
					"border-style": "solid",
					position: "absolute",
					top: "-6px",
				},
				l = {
					height: "0px",
					"border-top": "1px dashed red",
					position: "absolute",
					"z-index": 9999,
				};
			b.prototype = {
				removeAll: function () {
					for (var a in this.hidden)
						this.hidden[a].remove(), delete this.hidden[a];
					for (a in this.visible)
						this.visible[a].remove(), delete this.visible[a];
				},
				hideLine: function (a) {
					var b = a.getUniqueId();
					a.hide();
					this.hidden[b] = a;
					delete this.visible[b];
				},
				showLine: function (a) {
					var b = a.getUniqueId();
					a.show();
					this.visible[b] = a;
					delete this.hidden[b];
				},
				hideVisible: function () {
					for (var a in this.visible) this.hideLine(this.visible[a]);
				},
				placeLine: function (a, b) {
					var c, d, g;
					if ((c = this.getStyle(a.uid, a.type))) {
						for (g in this.visible)
							if (this.visible[g].getCustomData("hash") !== this.hash) {
								d = this.visible[g];
								break;
							}
						if (!d)
							for (g in this.hidden)
								if (this.hidden[g].getCustomData("hash") !== this.hash) {
									this.showLine((d = this.hidden[g]));
									break;
								}
						d || this.showLine((d = this.addLine()));
						d.setCustomData("hash", this.hash);
						this.visible[d.getUniqueId()] = d;
						d.setStyles(c);
						b && b(d);
					}
				},
				getStyle: function (a, b) {
					var c = this.relations[a],
						d = this.locations[a][b],
						g = {};
					g.width = c.siblingRect
						? Math.max(c.siblingRect.width, c.elementRect.width)
						: c.elementRect.width;
					g.top = this.inline
						? d + this.winTopScroll.y - this.rect.relativeY
						: this.rect.top + this.winTopScroll.y + d;
					if (
						g.top - this.winTopScroll.y < this.rect.top ||
						g.top - this.winTopScroll.y > this.rect.bottom
					)
						return !1;
					this.inline
						? (g.left = c.elementRect.left - this.rect.relativeX)
						: (0 < c.elementRect.left
								? (g.left = this.rect.left + c.elementRect.left)
								: ((g.width += c.elementRect.left), (g.left = this.rect.left)),
						  0 <
								(c =
									g.left + g.width - (this.rect.left + this.winPane.width)) &&
								(g.width -= c));
					g.left += this.winTopScroll.x;
					for (var h in g) g[h] = CKEDITOR.tools.cssLength(g[h]);
					return g;
				},
				addLine: function () {
					var a = CKEDITOR.dom.element.createFromHtml(this.lineTpl);
					a.appendTo(this.container);
					return a;
				},
				prepare: function (a, b) {
					this.relations = a;
					this.locations = b;
					this.hash = Math.random();
				},
				cleanup: function () {
					var a, b;
					for (b in this.visible)
						(a = this.visible[b]),
							a.getCustomData("hash") !== this.hash && this.hideLine(a);
				},
				queryViewport: function () {
					this.winPane = this.win.getViewPaneSize();
					this.winTopScroll = this.winTop.getScrollPosition();
					this.winTopPane = this.winTop.getViewPaneSize();
					this.rect = this.getClientRect(
						this.inline ? this.editable : this.frame
					);
				},
				getClientRect: function (a) {
					a = a.getClientRect();
					var b = this.container.getDocumentPosition(),
						c = this.container.getComputedStyle("position");
					a.relativeX = a.relativeY = 0;
					"static" != c &&
						((a.relativeY = b.y),
						(a.relativeX = b.x),
						(a.top -= a.relativeY),
						(a.bottom -= a.relativeY),
						(a.left -= a.relativeX),
						(a.right -= a.relativeX));
					return a;
				},
			};
			var k = { left: 1, right: 1, center: 1 },
				h = { absolute: 1, fixed: 1 };
			CKEDITOR.plugins.lineutils = { finder: a, locator: d, liner: b };
		})(),
		(function () {
			function a(a) {
				return a.getName && !a.hasAttribute("data-cke-temp");
			}
			CKEDITOR.plugins.add("widgetselection", {
				init: function (a) {
					if (CKEDITOR.env.webkit) {
						var b = CKEDITOR.plugins.widgetselection;
						a.on("contentDom", function (a) {
							a = a.editor;
							var d = a.editable();
							d.attachListener(
								d,
								"keydown",
								function (a) {
									a.data.getKeystroke() == CKEDITOR.CTRL + 65 &&
										CKEDITOR.tools.setTimeout(function () {
											b.addFillers(d) || b.removeFillers(d);
										}, 0);
								},
								null,
								null,
								-1
							);
							a.on("selectionCheck", function (a) {
								b.removeFillers(a.editor.editable());
							});
							a.on("paste", function (a) {
								a.data.dataValue = b.cleanPasteData(a.data.dataValue);
							});
							"selectall" in a.plugins && b.addSelectAllIntegration(a);
						});
					}
				},
			});
			CKEDITOR.plugins.widgetselection = {
				startFiller: null,
				endFiller: null,
				fillerAttribute: "data-cke-filler-webkit",
				fillerContent: "\x26nbsp;",
				fillerTagName: "div",
				addFillers: function (d) {
					var b = d.editor;
					if (!this.isWholeContentSelected(d) && 0 < d.getChildCount()) {
						var c = d.getFirst(a),
							g = d.getLast(a);
						c &&
							c.type == CKEDITOR.NODE_ELEMENT &&
							!c.isEditable() &&
							((this.startFiller = this.createFiller()),
							d.append(this.startFiller, 1));
						g &&
							g.type == CKEDITOR.NODE_ELEMENT &&
							!g.isEditable() &&
							((this.endFiller = this.createFiller(!0)),
							d.append(this.endFiller, 0));
						if (this.hasFiller(d))
							return (
								(b = b.createRange()), b.selectNodeContents(d), b.select(), !0
							);
					}
					return !1;
				},
				removeFillers: function (a) {
					if (this.hasFiller(a) && !this.isWholeContentSelected(a)) {
						var b = a.findOne(
								this.fillerTagName + "[" + this.fillerAttribute + "\x3dstart]"
							),
							c = a.findOne(
								this.fillerTagName + "[" + this.fillerAttribute + "\x3dend]"
							);
						this.startFiller && b && this.startFiller.equals(b)
							? this.removeFiller(this.startFiller, a)
							: (this.startFiller = b);
						this.endFiller && c && this.endFiller.equals(c)
							? this.removeFiller(this.endFiller, a)
							: (this.endFiller = c);
					}
				},
				cleanPasteData: function (a) {
					a &&
						a.length &&
						(a = a
							.replace(this.createFillerRegex(), "")
							.replace(this.createFillerRegex(!0), ""));
					return a;
				},
				isWholeContentSelected: function (a) {
					var b = a.editor.getSelection().getRanges()[0];
					return !b || (b && b.collapsed)
						? !1
						: ((b = b.clone()),
						  b.enlarge(CKEDITOR.ENLARGE_ELEMENT),
						  !!(
								b &&
								a &&
								b.startContainer &&
								b.endContainer &&
								0 === b.startOffset &&
								b.endOffset === a.getChildCount() &&
								b.startContainer.equals(a) &&
								b.endContainer.equals(a)
						  ));
				},
				hasFiller: function (a) {
					return (
						0 <
						a
							.find(this.fillerTagName + "[" + this.fillerAttribute + "]")
							.count()
					);
				},
				createFiller: function (a) {
					var b = new CKEDITOR.dom.element(this.fillerTagName);
					b.setHtml(this.fillerContent);
					b.setAttribute(this.fillerAttribute, a ? "end" : "start");
					b.setAttribute("data-cke-temp", 1);
					b.setStyles({
						display: "block",
						width: 0,
						height: 0,
						padding: 0,
						border: 0,
						margin: 0,
						position: "absolute",
						top: 0,
						left: "-9999px",
						opacity: 0,
						overflow: "hidden",
					});
					return b;
				},
				removeFiller: function (a, b) {
					if (a) {
						var c = b.editor,
							g = b.editor.getSelection().getRanges()[0].startPath(),
							l = c.createRange(),
							k,
							h;
						g.contains(a) && ((k = a.getHtml()), (h = !0));
						g = "start" == a.getAttribute(this.fillerAttribute);
						a.remove();
						k && 0 < k.length && k != this.fillerContent
							? (b.insertHtmlIntoRange(k, c.getSelection().getRanges()[0]),
							  l.setStartAt(
									b.getChild(b.getChildCount() - 1),
									CKEDITOR.POSITION_BEFORE_END
							  ),
							  c.getSelection().selectRanges([l]))
							: h &&
							  (g
									? l.setStartAt(
											b.getFirst().getNext(),
											CKEDITOR.POSITION_AFTER_START
									  )
									: l.setEndAt(
											b.getLast().getPrevious(),
											CKEDITOR.POSITION_BEFORE_END
									  ),
							  b.editor.getSelection().selectRanges([l]));
					}
				},
				createFillerRegex: function (a) {
					var b = this.createFiller(a)
						.getOuterHtml()
						.replace(/style="[^"]*"/gi, 'style\x3d"[^"]*"')
						.replace(/>[^<]*</gi, "\x3e[^\x3c]*\x3c");
					return new RegExp((a ? "" : "^") + b + (a ? "$" : ""));
				},
				addSelectAllIntegration: function (a) {
					var b = this;
					a.editable().attachListener(
						a,
						"beforeCommandExec",
						function (c) {
							var g = a.editable();
							"selectAll" == c.data.name && g && b.addFillers(g);
						},
						null,
						null,
						9999
					);
				},
			};
		})(),
		"use strict",
		(function () {
			function a(a) {
				this.editor = a;
				this.registered = {};
				this.instances = {};
				this.selected = [];
				this.widgetHoldingFocusedEditable = this.focused = null;
				this._ = { nextId: 0, upcasts: [], upcastCallbacks: [], filters: {} };
				H(this);
				A(this);
				this.on("checkWidgets", k);
				this.editor.on("contentDomInvalidated", this.checkWidgets, this);
				B(this);
				t(this);
				y(this);
				z(this);
				C(this);
			}
			function d(a, b, c, e, f) {
				var g = a.editor;
				CKEDITOR.tools.extend(
					this,
					e,
					{
						editor: g,
						id: b,
						inline: "span" == c.getParent().getName(),
						element: c,
						data: CKEDITOR.tools.extend(
							{},
							"function" == typeof e.defaults ? e.defaults() : e.defaults
						),
						dataReady: !1,
						inited: !1,
						ready: !1,
						edit: d.prototype.edit,
						focusedEditable: null,
						definition: e,
						repository: a,
						draggable: !1 !== e.draggable,
						_: {
							downcastFn:
								e.downcast && "string" == typeof e.downcast
									? e.downcasts[e.downcast]
									: e.downcast,
						},
					},
					!0
				);
				a.fire("instanceCreated", this);
				da(this, e);
				this.init && this.init();
				this.inited = !0;
				(a = this.element.data("cke-widget-data")) &&
					this.setData(JSON.parse(decodeURIComponent(a)));
				f && this.setData(f);
				this.data.classes || this.setData("classes", this.getClasses());
				this.dataReady = !0;
				P(this);
				this.fire("data", this.data);
				this.isInited() &&
					g.editable().contains(this.wrapper) &&
					((this.ready = !0), this.fire("ready"));
			}
			function b(a, b, c) {
				CKEDITOR.dom.element.call(this, b.$);
				this.editor = a;
				this._ = {};
				b = this.filter = c.filter;
				CKEDITOR.dtd[this.getName()].p
					? ((this.enterMode = b
							? b.getAllowedEnterMode(a.enterMode)
							: a.enterMode),
					  (this.shiftEnterMode = b
							? b.getAllowedEnterMode(a.shiftEnterMode, !0)
							: a.shiftEnterMode))
					: (this.enterMode = this.shiftEnterMode = CKEDITOR.ENTER_BR);
			}
			function c(a, b) {
				a.addCommand(b.name, {
					exec: function (a, c) {
						function d() {
							a.widgets.finalizeCreation(h);
						}
						var e = a.widgets.focused;
						if (e && e.name == b.name) e.edit();
						else if (b.insert) b.insert({ editor: a, commandData: c });
						else if (b.template) {
							var e =
									"function" == typeof b.defaults ? b.defaults() : b.defaults,
								e = CKEDITOR.dom.element.createFromHtml(b.template.output(e)),
								f,
								g = a.widgets.wrapElement(e, b.name),
								h = new CKEDITOR.dom.documentFragment(g.getDocument());
							h.append(g);
							(f = a.widgets.initOn(e, b, c && c.startupData))
								? ((e = f.once(
										"edit",
										function (b) {
											if (b.data.dialog)
												f.once("dialog", function (b) {
													b = b.data;
													var c, e;
													c = b.once("ok", d, null, null, 20);
													e = b.once("cancel", function (b) {
														(b.data && !1 === b.data.hide) ||
															a.widgets.destroy(f, !0);
													});
													b.once("hide", function () {
														c.removeListener();
														e.removeListener();
													});
												});
											else d();
										},
										null,
										null,
										999
								  )),
								  f.edit(),
								  e.removeListener())
								: d();
						}
					},
					allowedContent: b.allowedContent,
					requiredContent: b.requiredContent,
					contentForms: b.contentForms,
					contentTransformations: b.contentTransformations,
				});
			}
			function g(a, b) {
				function c(a, d) {
					var e = b.upcast.split(","),
						f,
						g;
					for (g = 0; g < e.length; g++)
						if (((f = e[g]), f === a.name))
							return b.upcasts[f].call(this, a, d);
					return !1;
				}
				function d(b, c, e) {
					var f = CKEDITOR.tools.getIndex(a._.upcasts, function (a) {
						return a[2] > e;
					});
					0 > f && (f = a._.upcasts.length);
					a._.upcasts.splice(f, 0, [CKEDITOR.tools.bind(b, c), c.name, e]);
				}
				var e = b.upcast,
					f = b.upcastPriority || 10;
				e && ("string" == typeof e ? d(c, b, f) : d(e, b, f));
			}
			function l(a, b) {
				a.focused = null;
				if (b.isInited()) {
					var c = b.editor.checkDirty();
					a.fire("widgetBlurred", { widget: b });
					b.setFocused(!1);
					!c && b.editor.resetDirty();
				}
			}
			function k(a) {
				a = a.data;
				if ("wysiwyg" == this.editor.mode) {
					var b = this.editor.editable(),
						c = this.instances,
						e,
						f,
						g,
						h;
					if (b) {
						for (e in c)
							c[e].isReady() &&
								!b.contains(c[e].wrapper) &&
								this.destroy(c[e], !0);
						if (a && a.initOnlyNew) c = this.initOnAll();
						else {
							var k = b.find(".cke_widget_wrapper"),
								c = [];
							e = 0;
							for (f = k.count(); e < f; e++) {
								g = k.getItem(e);
								if ((h = !this.getByElement(g, !0))) {
									a: {
										h = p;
										for (var l = g; (l = l.getParent()); )
											if (h(l)) {
												h = !0;
												break a;
											}
										h = !1;
									}
									h = !h;
								}
								h &&
									b.contains(g) &&
									(g.addClass("cke_widget_new"),
									c.push(this.initOn(g.getFirst(d.isDomWidgetElement))));
							}
						}
						a && a.focusInited && 1 == c.length && c[0].focus();
					}
				}
			}
			function h(a) {
				if ("undefined" != typeof a.attributes && a.attributes["data-widget"]) {
					var b = e(a),
						c = m(a),
						d = !1;
					b &&
						b.value &&
						b.value.match(/^\s/g) &&
						((b.parent.attributes["data-cke-white-space-first"] = 1),
						(b.value = b.value.replace(/^\s/g, "\x26nbsp;")),
						(d = !0));
					c &&
						c.value &&
						c.value.match(/\s$/g) &&
						((c.parent.attributes["data-cke-white-space-last"] = 1),
						(c.value = c.value.replace(/\s$/g, "\x26nbsp;")),
						(d = !0));
					d && (a.attributes["data-cke-widget-white-space"] = 1);
				}
			}
			function e(a) {
				return a
					.find(function (a) {
						return 3 === a.type;
					}, !0)
					.shift();
			}
			function m(a) {
				return a
					.find(function (a) {
						return 3 === a.type;
					}, !0)
					.pop();
			}
			function f(a, b, c) {
				if (!c.allowedContent && !c.disallowedContent) return null;
				var d = this._.filters[a];
				d || (this._.filters[a] = d = {});
				a = d[b];
				a ||
					((a = c.allowedContent
						? new CKEDITOR.filter(c.allowedContent)
						: this.editor.filter.clone()),
					(d[b] = a),
					c.disallowedContent && a.disallow(c.disallowedContent));
				return a;
			}
			function n(a) {
				var b = [],
					c = a._.upcasts,
					e = a._.upcastCallbacks;
				return {
					toBeWrapped: b,
					iterator: function (a) {
						var f, g, h, k, l;
						if ("data-cke-widget-wrapper" in a.attributes)
							return (
								(a = a.getFirst(d.isParserWidgetElement)) && b.push([a]), !1
							);
						if ("data-widget" in a.attributes) return b.push([a]), !1;
						if ((l = c.length)) {
							if (a.attributes["data-cke-widget-upcasted"]) return !1;
							k = 0;
							for (f = e.length; k < f; ++k) if (!1 === e[k](a)) return;
							for (k = 0; k < l; ++k)
								if (((f = c[k]), (h = {}), (g = f[0](a, h))))
									return (
										g instanceof CKEDITOR.htmlParser.element && (a = g),
										(a.attributes["data-cke-widget-data"] = encodeURIComponent(
											JSON.stringify(h)
										)),
										(a.attributes["data-cke-widget-upcasted"] = 1),
										b.push([a, f[1]]),
										!1
									);
						}
					},
				};
			}
			function r(a, b) {
				return {
					tabindex: -1,
					contenteditable: "false",
					"data-cke-widget-wrapper": 1,
					"data-cke-filter": "off",
					class:
						"cke_widget_wrapper cke_widget_new cke_widget_" +
						(a ? "inline" : "block") +
						(b ? " cke_widget_" + b : ""),
				};
			}
			function x(a, b, c) {
				if (a.type == CKEDITOR.NODE_ELEMENT) {
					var d = CKEDITOR.dtd[a.name];
					if (d && !d[c.name]) {
						var d = a.split(b),
							e = a.parent;
						b = d.getIndex();
						a.children.length || (--b, a.remove());
						d.children.length || d.remove();
						return x(e, b, c);
					}
				}
				a.add(c, b);
			}
			function v(a, b) {
				return "boolean" == typeof a.inline
					? a.inline
					: !!CKEDITOR.dtd.$inline[b];
			}
			function p(a) {
				return a.hasAttribute("data-cke-temp");
			}
			function u(a, b, c, d) {
				var e = a.editor;
				e.fire("lockSnapshot");
				c
					? ((d = c.data("cke-widget-editable")),
					  (d = b.editables[d]),
					  (a.widgetHoldingFocusedEditable = b),
					  (b.focusedEditable = d),
					  c.addClass("cke_widget_editable_focused"),
					  d.filter && e.setActiveFilter(d.filter),
					  e.setActiveEnterMode(d.enterMode, d.shiftEnterMode))
					: (d || b.focusedEditable.removeClass("cke_widget_editable_focused"),
					  (b.focusedEditable = null),
					  (a.widgetHoldingFocusedEditable = null),
					  e.setActiveFilter(null),
					  e.setActiveEnterMode(null, null));
				e.fire("unlockSnapshot");
			}
			function w(a) {
				a.contextMenu &&
					a.contextMenu.addListener(function (b) {
						if ((b = a.widgets.getByElement(b, !0)))
							return b.fire("contextMenu", {});
					});
			}
			function q(a, b) {
				return CKEDITOR.tools.trim(b);
			}
			function z(a) {
				var b = a.editor,
					c = CKEDITOR.plugins.lineutils;
				b.on("dragstart", function (c) {
					var e = c.data.target;
					d.isDomDragHandler(e) &&
						((e = a.getByElement(e)),
						c.data.dataTransfer.setData("cke/widget-id", e.id),
						b.focus(),
						e.focus());
				});
				b.on("drop", function (c) {
					var d = c.data.dataTransfer,
						e = d.getData("cke/widget-id"),
						f = d.getTransferType(b),
						d = b.createRange();
					"" !== e && f === CKEDITOR.DATA_TRANSFER_CROSS_EDITORS
						? c.cancel()
						: "" !== e &&
						  f == CKEDITOR.DATA_TRANSFER_INTERNAL &&
						  (e = a.instances[e]) &&
						  (d.setStartBefore(e.wrapper),
						  d.setEndAfter(e.wrapper),
						  (c.data.dragRange = d),
						  delete CKEDITOR.plugins.clipboard.dragStartContainerChildCount,
						  delete CKEDITOR.plugins.clipboard.dragEndContainerChildCount,
						  c.data.dataTransfer.setData(
								"text/html",
								b.editable().getHtmlFromRange(d).getHtml()
						  ),
						  b.widgets.destroy(e, !0));
				});
				b.on("contentDom", function () {
					var e = b.editable();
					CKEDITOR.tools.extend(
						a,
						{
							finder: new c.finder(b, {
								lookups: {
									default: function (b) {
										if (
											!b.is(CKEDITOR.dtd.$listItem) &&
											b.is(CKEDITOR.dtd.$block) &&
											!d.isDomNestedEditable(b) &&
											!a._.draggedWidget.wrapper.contains(b)
										) {
											var c = d.getNestedEditable(e, b);
											if (c) {
												b = a._.draggedWidget;
												if (a.getByElement(c) == b) return;
												c = CKEDITOR.filter.instances[c.data("cke-filter")];
												b = b.requiredContent;
												if (c && b && !c.check(b)) return;
											}
											return (
												CKEDITOR.LINEUTILS_BEFORE | CKEDITOR.LINEUTILS_AFTER
											);
										}
									},
								},
							}),
							locator: new c.locator(b),
							liner: new c.liner(b, {
								lineStyle: {
									cursor: "move !important",
									"border-top-color": "#666",
								},
								tipLeftStyle: { "border-left-color": "#666" },
								tipRightStyle: { "border-right-color": "#666" },
							}),
						},
						!0
					);
				});
			}
			function t(a) {
				var b = a.editor;
				b.on("contentDom", function () {
					var c = b.editable(),
						e = c.isInline() ? c : b.document,
						f,
						g;
					c.attachListener(e, "mousedown", function (c) {
						var e = c.data.getTarget();
						f = e instanceof CKEDITOR.dom.element ? a.getByElement(e) : null;
						g = 0;
						f &&
							(f.inline &&
							e.type == CKEDITOR.NODE_ELEMENT &&
							e.hasAttribute("data-cke-widget-drag-handler")
								? ((g = 1),
								  a.focused != f && b.getSelection().removeAllRanges())
								: d.getNestedEditable(f.wrapper, e)
								? (f = null)
								: (c.data.preventDefault(), CKEDITOR.env.ie || f.focus()));
					});
					c.attachListener(e, "mouseup", function () {
						g && f && f.wrapper && ((g = 0), f.focus());
					});
					CKEDITOR.env.ie &&
						c.attachListener(e, "mouseup", function () {
							setTimeout(function () {
								f &&
									f.wrapper &&
									c.contains(f.wrapper) &&
									(f.focus(), (f = null));
							});
						});
				});
				b.on(
					"doubleclick",
					function (b) {
						var c = a.getByElement(b.data.element);
						if (c && !d.getNestedEditable(c.wrapper, b.data.element))
							return c.fire("doubleclick", { element: b.data.element });
					},
					null,
					null,
					1
				);
			}
			function y(a) {
				a.editor.on(
					"key",
					function (b) {
						var c = a.focused,
							d = a.widgetHoldingFocusedEditable,
							e;
						c
							? (e = c.fire("key", { keyCode: b.data.keyCode }))
							: d &&
							  ((c = b.data.keyCode),
							  (b = d.focusedEditable),
							  c == CKEDITOR.CTRL + 65
									? ((c = b.getBogus()),
									  (d = d.editor.createRange()),
									  d.selectNodeContents(b),
									  c && d.setEndAt(c, CKEDITOR.POSITION_BEFORE_START),
									  d.select(),
									  (e = !1))
									: 8 == c || 46 == c
									? ((e = d.editor.getSelection().getRanges()),
									  (d = e[0]),
									  (e = !(
											1 == e.length &&
											d.collapsed &&
											d.checkBoundaryOfElement(
												b,
												CKEDITOR[8 == c ? "START" : "END"]
											)
									  )))
									: (e = void 0));
						return e;
					},
					null,
					null,
					1
				);
			}
			function C(a) {
				function b(c) {
					a.focused && F(a.focused, "cut" == c.name);
				}
				var c = a.editor;
				c.on("contentDom", function () {
					var a = c.editable();
					a.attachListener(a, "copy", b);
					a.attachListener(a, "cut", b);
				});
			}
			function B(a) {
				var b = a.editor;
				b.on("selectionCheck", function () {
					a.fire("checkSelection");
				});
				a.on("checkSelection", a.checkSelection, a);
				b.on("selectionChange", function (c) {
					var e =
							(c = d.getNestedEditable(
								b.editable(),
								c.data.selection.getStartElement()
							)) && a.getByElement(c),
						f = a.widgetHoldingFocusedEditable;
					f
						? (f === e && f.focusedEditable.equals(c)) ||
						  (u(a, f, null), e && c && u(a, e, c))
						: e && c && u(a, e, c);
				});
				b.on("dataReady", function () {
					G(a).commit();
				});
				b.on("blur", function () {
					var b;
					(b = a.focused) && l(a, b);
					(b = a.widgetHoldingFocusedEditable) && u(a, b, null);
				});
			}
			function A(a) {
				var b = a.editor,
					c = {};
				b.on(
					"toDataFormat",
					function (b) {
						var f = CKEDITOR.tools.getNextNumber(),
							g = [];
						b.data.downcastingSessionId = f;
						c[f] = g;
						b.data.dataValue.forEach(
							function (b) {
								var c = b.attributes,
									f;
								if ("data-cke-widget-white-space" in c) {
									f = e(b);
									var h = m(b);
									f.parent.attributes["data-cke-white-space-first"] &&
										(f.value = f.value.replace(/^&nbsp;/g, " "));
									h.parent.attributes["data-cke-white-space-last"] &&
										(h.value = h.value.replace(/&nbsp;$/g, " "));
								}
								if ("data-cke-widget-id" in c) {
									if ((c = a.instances[c["data-cke-widget-id"]]))
										(f = b.getFirst(d.isParserWidgetElement)),
											g.push({
												wrapper: b,
												element: f,
												widget: c,
												editables: {},
											}),
											"1" != f.attributes["data-cke-widget-keep-attr"] &&
												delete f.attributes["data-widget"];
								} else if ("data-cke-widget-editable" in c)
									return (
										(g[g.length - 1].editables[
											c["data-cke-widget-editable"]
										] = b),
										!1
									);
							},
							CKEDITOR.NODE_ELEMENT,
							!0
						);
					},
					null,
					null,
					8
				);
				b.on(
					"toDataFormat",
					function (a) {
						if (a.data.downcastingSessionId) {
							a = c[a.data.downcastingSessionId];
							for (var b, d, e, f, g, h; (b = a.shift()); ) {
								d = b.widget;
								e = b.element;
								f = d._.downcastFn && d._.downcastFn.call(d, e);
								for (h in b.editables)
									(g = b.editables[h]),
										delete g.attributes.contenteditable,
										g.setHtml(d.editables[h].getData());
								f || (f = e);
								b.wrapper.replaceWith(f);
							}
						}
					},
					null,
					null,
					13
				);
				b.on("contentDomUnload", function () {
					a.destroyAll(!0);
				});
			}
			function H(a) {
				var b = a.editor,
					c,
					e;
				b.on(
					"toHtml",
					function (b) {
						var e = n(a),
							f;
						for (
							b.data.dataValue.forEach(e.iterator, CKEDITOR.NODE_ELEMENT, !0);
							(f = e.toBeWrapped.pop());

						) {
							var g = f[0],
								h = g.parent;
							h.type == CKEDITOR.NODE_ELEMENT &&
								h.attributes["data-cke-widget-wrapper"] &&
								h.replaceWith(g);
							a.wrapElement(f[0], f[1]);
						}
						c = b.data.protectedWhitespaces
							? 3 == b.data.dataValue.children.length &&
							  d.isParserWidgetWrapper(b.data.dataValue.children[1])
							: 1 == b.data.dataValue.children.length &&
							  d.isParserWidgetWrapper(b.data.dataValue.children[0]);
					},
					null,
					null,
					8
				);
				b.on("dataReady", function () {
					if (e)
						for (
							var c = b.editable().find(".cke_widget_wrapper"),
								f,
								g,
								h = 0,
								k = c.count();
							h < k;
							++h
						)
							(f = c.getItem(h)),
								(g = f.getFirst(d.isDomWidgetElement)),
								g.type == CKEDITOR.NODE_ELEMENT && g.data("widget")
									? (g.replace(f), a.wrapElement(g))
									: f.remove();
					e = 0;
					a.destroyAll(!0);
					a.initOnAll();
				});
				b.on(
					"loadSnapshot",
					function (b) {
						/data-cke-widget/.test(b.data) && (e = 1);
						a.destroyAll(!0);
					},
					null,
					null,
					9
				);
				b.on("paste", function (a) {
					a = a.data;
					a.dataValue = a.dataValue.replace(U, q);
					a.range &&
						(a = d.getNestedEditable(b.editable(), a.range.startContainer)) &&
						(a = CKEDITOR.filter.instances[a.data("cke-filter")]) &&
						b.setActiveFilter(a);
				});
				b.on("afterInsertHtml", function (d) {
					d.data.intoRange
						? a.checkWidgets({ initOnlyNew: !0 })
						: (b.fire("lockSnapshot"),
						  a.checkWidgets({ initOnlyNew: !0, focusInited: c }),
						  b.fire("unlockSnapshot"));
				});
			}
			function G(a) {
				var b = a.selected,
					c = [],
					d = b.slice(0),
					e = null;
				return {
					select: function (a) {
						0 > CKEDITOR.tools.indexOf(b, a) && c.push(a);
						a = CKEDITOR.tools.indexOf(d, a);
						0 <= a && d.splice(a, 1);
						return this;
					},
					focus: function (a) {
						e = a;
						return this;
					},
					commit: function () {
						var f = a.focused !== e,
							g,
							h;
						a.editor.fire("lockSnapshot");
						for (f && (g = a.focused) && l(a, g); (g = d.pop()); )
							b.splice(CKEDITOR.tools.indexOf(b, g), 1),
								g.isInited() &&
									((h = g.editor.checkDirty()),
									g.setSelected(!1),
									!h && g.editor.resetDirty());
						f &&
							e &&
							((h = a.editor.checkDirty()),
							(a.focused = e),
							a.fire("widgetFocused", { widget: e }),
							e.setFocused(!0),
							!h && a.editor.resetDirty());
						for (; (g = c.pop()); ) b.push(g), g.setSelected(!0);
						a.editor.fire("unlockSnapshot");
					},
				};
			}
			function J(a, b, c) {
				var d = 0;
				b = L(b);
				var e = a.data.classes || {},
					f;
				if (b) {
					for (e = CKEDITOR.tools.clone(e); (f = b.pop()); )
						c ? e[f] || (d = e[f] = 1) : e[f] && (delete e[f], (d = 1));
					d && a.setData("classes", e);
				}
			}
			function E(a) {
				a.cancel();
			}
			function F(a, b) {
				var c = a.editor,
					d = c.document,
					e = CKEDITOR.env.edge && 16 <= CKEDITOR.env.version;
				if (!d.getById("cke_copybin")) {
					var f = (!c.blockless && !CKEDITOR.env.ie) || e ? "div" : "span",
						e = d.createElement(f),
						g = d.createElement(f),
						f = CKEDITOR.env.ie && 9 > CKEDITOR.env.version;
					g.setAttributes({ id: "cke_copybin", "data-cke-temp": "1" });
					e.setStyles({
						position: "absolute",
						width: "1px",
						height: "1px",
						overflow: "hidden",
					});
					e.setStyle(
						"ltr" == c.config.contentsLangDirection ? "left" : "right",
						"-5000px"
					);
					var h = c.createRange();
					h.setStartBefore(a.wrapper);
					h.setEndAfter(a.wrapper);
					e.setHtml(
						'\x3cspan data-cke-copybin-start\x3d"1"\x3e​\x3c/span\x3e' +
							c.editable().getHtmlFromRange(h).getHtml() +
							'\x3cspan data-cke-copybin-end\x3d"1"\x3e​\x3c/span\x3e'
					);
					c.fire("saveSnapshot");
					c.fire("lockSnapshot");
					g.append(e);
					c.editable().append(g);
					var k = c.on("selectionChange", E, null, null, 0),
						l = a.repository.on("checkSelection", E, null, null, 0);
					if (f)
						var m = d.getDocumentElement().$,
							n = m.scrollTop;
					h = c.createRange();
					h.selectNodeContents(e);
					h.select();
					f && (m.scrollTop = n);
					setTimeout(function () {
						b || a.focus();
						g.remove();
						k.removeListener();
						l.removeListener();
						c.fire("unlockSnapshot");
						b && !c.readOnly && (a.repository.del(a), c.fire("saveSnapshot"));
					}, 100);
				}
			}
			function L(a) {
				return (a = (a = a.getDefinition().attributes) && a["class"])
					? a.split(/\s+/)
					: null;
			}
			function I() {
				var a = CKEDITOR.document.getActive(),
					b = this.editor,
					c = b.editable();
				(c.isInline() ? c : b.document.getWindow().getFrame()).equals(a) &&
					b.focusManager.focus(c);
			}
			function D() {
				CKEDITOR.env.gecko && this.editor.unlockSelection();
				CKEDITOR.env.webkit ||
					(this.editor.forceNextSelectionCheck(),
					this.editor.selectionChange(1));
			}
			function Q(a) {
				var b = null;
				a.on("data", function () {
					var a = this.data.classes,
						c;
					if (b != a) {
						for (c in b) (a && a[c]) || this.removeClass(c);
						for (c in a) this.addClass(c);
						b = a;
					}
				});
			}
			function T(a) {
				a.on(
					"data",
					function () {
						if (a.wrapper) {
							var b = this.getLabel
								? this.getLabel()
								: this.editor.lang.widget.label.replace(
										/%1/,
										this.pathName || this.element.getName()
								  );
							a.wrapper.setAttribute("role", "region");
							a.wrapper.setAttribute("aria-label", b);
						}
					},
					null,
					null,
					9999
				);
			}
			function R(a) {
				if (a.draggable) {
					var b = a.editor,
						c = a.wrapper.getLast(d.isDomDragHandlerContainer),
						e;
					c
						? (e = c.findOne("img"))
						: ((c = new CKEDITOR.dom.element("span", b.document)),
						  c.setAttributes({
								class: "cke_reset cke_widget_drag_handler_container",
								style:
									"background:rgba(220,220,220,0.5);background-image:url(" +
									b.plugins.widget.path +
									"images/handle.png)",
						  }),
						  (e = new CKEDITOR.dom.element("img", b.document)),
						  e.setAttributes({
								class: "cke_reset cke_widget_drag_handler",
								"data-cke-widget-drag-handler": "1",
								src: CKEDITOR.tools.transparentImageData,
								width: 15,
								title: b.lang.widget.move,
								height: 15,
								role: "presentation",
						  }),
						  a.inline && e.setAttribute("draggable", "true"),
						  c.append(e),
						  a.wrapper.append(c));
					a.wrapper.on("dragover", function (a) {
						a.data.preventDefault();
					});
					a.wrapper.on("mouseenter", a.updateDragHandlerPosition, a);
					setTimeout(function () {
						a.on("data", a.updateDragHandlerPosition, a);
					}, 50);
					if (
						!a.inline &&
						(e.on("mousedown", K, a),
						CKEDITOR.env.ie && 9 > CKEDITOR.env.version)
					)
						e.on("dragstart", function (a) {
							a.data.preventDefault(!0);
						});
					a.dragHandlerContainer = c;
				}
			}
			function K(a) {
				function b() {
					var c;
					for (p.reset(); (c = h.pop()); ) c.removeListener();
					var d = k;
					c = a.sender;
					var e = this.repository.finder,
						f = this.repository.liner,
						g = this.editor,
						l = this.editor.editable();
					CKEDITOR.tools.isEmpty(f.visible) ||
						((d = e.getRange(d[0])),
						this.focus(),
						g.fire("drop", { dropRange: d, target: d.startContainer }));
					l.removeClass("cke_widget_dragging");
					f.hideVisible();
					g.fire("dragend", { target: c });
				}
				if (CKEDITOR.tools.getMouseButton(a) === CKEDITOR.MOUSE_BUTTON_LEFT) {
					var c = this.repository.finder,
						d = this.repository.locator,
						e = this.repository.liner,
						f = this.editor,
						g = f.editable(),
						h = [],
						k = [],
						l,
						m;
					this.repository._.draggedWidget = this;
					var n = c.greedySearch(),
						p = CKEDITOR.tools.eventsBuffer(50, function () {
							l = d.locate(n);
							k = d.sort(m, 1);
							k.length && (e.prepare(n, l), e.placeLine(k[0]), e.cleanup());
						});
					g.addClass("cke_widget_dragging");
					h.push(
						g.on("mousemove", function (a) {
							m = a.data.$.clientY;
							p.input();
						})
					);
					f.fire("dragstart", { target: a.sender });
					h.push(f.document.once("mouseup", b, this));
					g.isInline() || h.push(CKEDITOR.document.once("mouseup", b, this));
				}
			}
			function W(a) {
				var b,
					c,
					d = a.editables;
				a.editables = {};
				if (a.editables)
					for (b in d)
						(c = d[b]),
							a.initEditable(b, "string" == typeof c ? { selector: c } : c);
			}
			function V(a) {
				if (a.mask) {
					var b = a.wrapper.findOne(".cke_widget_mask");
					b ||
						((b = new CKEDITOR.dom.element("img", a.editor.document)),
						b.setAttributes({
							src: CKEDITOR.tools.transparentImageData,
							class: "cke_reset cke_widget_mask",
						}),
						a.wrapper.append(b));
					a.mask = b;
				}
			}
			function X(a) {
				if (a.parts) {
					var b = {},
						c,
						d;
					for (d in a.parts) (c = a.wrapper.findOne(a.parts[d])), (b[d] = c);
					a.parts = b;
				}
			}
			function da(a, b) {
				O(a);
				X(a);
				W(a);
				V(a);
				R(a);
				Q(a);
				T(a);
				if (CKEDITOR.env.ie && 9 > CKEDITOR.env.version)
					a.wrapper.on("dragstart", function (b) {
						var c = b.data.getTarget();
						d.getNestedEditable(a, c) ||
							(a.inline && d.isDomDragHandler(c)) ||
							b.data.preventDefault();
					});
				a.wrapper.removeClass("cke_widget_new");
				a.element.addClass("cke_widget_element");
				a.on(
					"key",
					function (b) {
						b = b.data.keyCode;
						if (13 == b) a.edit();
						else {
							if (b == CKEDITOR.CTRL + 67 || b == CKEDITOR.CTRL + 88) {
								F(a, b == CKEDITOR.CTRL + 88);
								return;
							}
							if (b in S || CKEDITOR.CTRL & b || CKEDITOR.ALT & b) return;
						}
						return !1;
					},
					null,
					null,
					999
				);
				a.on("doubleclick", function (b) {
					a.edit() && b.cancel();
				});
				if (b.data) a.on("data", b.data);
				if (b.edit) a.on("edit", b.edit);
			}
			function O(a) {
				(a.wrapper = a.element.getParent()).setAttribute(
					"data-cke-widget-id",
					a.id
				);
			}
			function P(a) {
				a.element.data(
					"cke-widget-data",
					encodeURIComponent(JSON.stringify(a.data))
				);
			}
			function M() {
				function a() {}
				function b(a, c, d) {
					return d && this.checkElement(a)
						? (a = d.widgets.getByElement(a, !0)) && a.checkStyleActive(this)
						: !1;
				}
				var c = {};
				CKEDITOR.style.addCustomHandler({
					type: "widget",
					setup: function (a) {
						this.widget = a.widget;
						if (
							(this.group = "string" == typeof a.group ? [a.group] : a.group)
						) {
							a = this.widget;
							var b;
							c[a] || (c[a] = {});
							for (var d = 0, e = this.group.length; d < e; d++)
								(b = this.group[d]),
									c[a][b] || (c[a][b] = []),
									c[a][b].push(this);
						}
					},
					apply: function (a) {
						var b;
						a instanceof CKEDITOR.editor &&
							this.checkApplicable(a.elementPath(), a) &&
							((b = a.widgets.focused),
							this.group && this.removeStylesFromSameGroup(a),
							b.applyStyle(this));
					},
					remove: function (a) {
						a instanceof CKEDITOR.editor &&
							this.checkApplicable(a.elementPath(), a) &&
							a.widgets.focused.removeStyle(this);
					},
					removeStylesFromSameGroup: function (a) {
						var b,
							d,
							e = !1;
						if (!(a instanceof CKEDITOR.editor)) return !1;
						d = a.elementPath();
						if (this.checkApplicable(d, a))
							for (var f = 0, g = this.group.length; f < g; f++) {
								b = c[this.widget][this.group[f]];
								for (var h = 0; h < b.length; h++)
									b[h] !== this &&
										b[h].checkActive(d, a) &&
										(a.widgets.focused.removeStyle(b[h]), (e = !0));
							}
						return e;
					},
					checkActive: function (a, b) {
						return this.checkElementMatch(a.lastElement, 0, b);
					},
					checkApplicable: function (a, b) {
						return b instanceof CKEDITOR.editor
							? this.checkElement(a.lastElement)
							: !1;
					},
					checkElementMatch: b,
					checkElementRemovable: b,
					checkElement: function (a) {
						return d.isDomWidgetWrapper(a)
							? (a = a.getFirst(d.isDomWidgetElement)) &&
									a.data("widget") == this.widget
							: !1;
					},
					buildPreview: function (a) {
						return a || this._.definition.name;
					},
					toAllowedContentRules: function (a) {
						if (!a) return null;
						a = a.widgets.registered[this.widget];
						var b,
							c = {};
						if (!a) return null;
						if (a.styleableElements) {
							b = this.getClassesArray();
							if (!b) return null;
							c[a.styleableElements] = { classes: b, propertiesOnly: !0 };
							return c;
						}
						return a.styleToAllowedContentRules
							? a.styleToAllowedContentRules(this)
							: null;
					},
					getClassesArray: function () {
						var a =
							this._.definition.attributes &&
							this._.definition.attributes["class"];
						return a ? CKEDITOR.tools.trim(a).split(/\s+/) : null;
					},
					applyToRange: a,
					removeFromRange: a,
					applyToObject: a,
				});
			}
			CKEDITOR.plugins.add("widget", {
				requires: "lineutils,clipboard,widgetselection",
				onLoad: function () {
					void 0 !== CKEDITOR.document.$.querySelectorAll &&
						(CKEDITOR.addCss(
							".cke_widget_wrapper{position:relative;outline:none}.cke_widget_inline{display:inline-block}.cke_widget_wrapper:hover\x3e.cke_widget_element{outline:2px solid #ffd25c;cursor:default}.cke_widget_wrapper:hover .cke_widget_editable{outline:2px solid #ffd25c}.cke_widget_wrapper.cke_widget_focused\x3e.cke_widget_element,.cke_widget_wrapper .cke_widget_editable.cke_widget_editable_focused{outline:2px solid #47a4f5}.cke_widget_editable{cursor:text}.cke_widget_drag_handler_container{position:absolute;width:15px;height:0;display:none;opacity:0.75;transition:height 0s 0.2s;line-height:0}.cke_widget_wrapper:hover\x3e.cke_widget_drag_handler_container{height:15px;transition:none}.cke_widget_drag_handler_container:hover{opacity:1}img.cke_widget_drag_handler{cursor:move;width:15px;height:15px;display:inline-block}.cke_widget_mask{position:absolute;top:0;left:0;width:100%;height:100%;display:block}.cke_editable.cke_widget_dragging, .cke_editable.cke_widget_dragging *{cursor:move !important}"
						),
						M());
				},
				beforeInit: function (b) {
					void 0 !== CKEDITOR.document.$.querySelectorAll &&
						(b.widgets = new a(b));
				},
				afterInit: function (a) {
					if (void 0 !== CKEDITOR.document.$.querySelectorAll) {
						var b = a.widgets.registered,
							c,
							d,
							e;
						for (d in b)
							(c = b[d]),
								(e = c.button) &&
									a.ui.addButton &&
									a.ui.addButton(CKEDITOR.tools.capitalize(c.name, !0), {
										label: e,
										command: c.name,
										toolbar: "insert,10",
									});
						w(a);
					}
				},
			});
			a.prototype = {
				MIN_SELECTION_CHECK_INTERVAL: 500,
				add: function (a, b) {
					b = CKEDITOR.tools.prototypedCopy(b);
					b.name = a;
					b._ = b._ || {};
					this.editor.fire("widgetDefinition", b);
					b.template && (b.template = new CKEDITOR.template(b.template));
					c(this.editor, b);
					g(this, b);
					return (this.registered[a] = b);
				},
				addUpcastCallback: function (a) {
					this._.upcastCallbacks.push(a);
				},
				checkSelection: function () {
					var a = this.editor.getSelection(),
						b = a.getSelectedElement(),
						c = G(this),
						e;
					if (b && (e = this.getByElement(b, !0)))
						return c.focus(e).select(e).commit();
					a = a.getRanges()[0];
					if (!a || a.collapsed) return c.commit();
					a = new CKEDITOR.dom.walker(a);
					for (a.evaluator = d.isDomWidgetWrapper; (b = a.next()); )
						c.select(this.getByElement(b));
					c.commit();
				},
				checkWidgets: function (a) {
					this.fire("checkWidgets", CKEDITOR.tools.copy(a || {}));
				},
				del: function (a) {
					if (this.focused === a) {
						var b = a.editor,
							c = b.createRange(),
							d;
						(d = c.moveToClosestEditablePosition(a.wrapper, !0)) ||
							(d = c.moveToClosestEditablePosition(a.wrapper, !1));
						d && b.getSelection().selectRanges([c]);
					}
					a.wrapper.remove();
					this.destroy(a, !0);
				},
				destroy: function (a, b) {
					this.widgetHoldingFocusedEditable === a && u(this, a, null, b);
					a.destroy(b);
					delete this.instances[a.id];
					this.fire("instanceDestroyed", a);
				},
				destroyAll: function (a, b) {
					var c,
						d,
						e = this.instances;
					if (b && !a) {
						d = b.find(".cke_widget_wrapper");
						for (var e = d.count(), f = 0; f < e; ++f)
							(c = this.getByElement(d.getItem(f), !0)) && this.destroy(c);
					} else for (d in e) (c = e[d]), this.destroy(c, a);
				},
				finalizeCreation: function (a) {
					(a = a.getFirst()) &&
						d.isDomWidgetWrapper(a) &&
						(this.editor.insertElement(a),
						(a = this.getByElement(a)),
						(a.ready = !0),
						a.fire("ready"),
						a.focus());
				},
				getByElement: (function () {
					function a(c) {
						return c.is(b) && c.data("cke-widget-id");
					}
					var b = { div: 1, span: 1 };
					return function (b, c) {
						if (!b) return null;
						var d = a(b);
						if (!c && !d) {
							var e = this.editor.editable();
							do b = b.getParent();
							while (b && !b.equals(e) && !(d = a(b)));
						}
						return this.instances[d] || null;
					};
				})(),
				initOn: function (a, b, c) {
					b
						? "string" == typeof b && (b = this.registered[b])
						: (b = this.registered[a.data("widget")]);
					if (!b) return null;
					var e = this.wrapElement(a, b.name);
					return e
						? e.hasClass("cke_widget_new")
							? ((a = new d(this, this._.nextId++, a, b, c)),
							  a.isInited() ? (this.instances[a.id] = a) : null)
							: this.getByElement(a)
						: null;
				},
				initOnAll: function (a) {
					a = (a || this.editor.editable()).find(".cke_widget_new");
					for (var b = [], c, e = a.count(); e--; )
						(c = this.initOn(a.getItem(e).getFirst(d.isDomWidgetElement))) &&
							b.push(c);
					return b;
				},
				onWidget: function (a) {
					var b = Array.prototype.slice.call(arguments);
					b.shift();
					for (var c in this.instances) {
						var d = this.instances[c];
						d.name == a && d.on.apply(d, b);
					}
					this.on("instanceCreated", function (c) {
						c = c.data;
						c.name == a && c.on.apply(c, b);
					});
				},
				parseElementClasses: function (a) {
					if (!a) return null;
					a = CKEDITOR.tools.trim(a).split(/\s+/);
					for (var b, c = {}, d = 0; (b = a.pop()); )
						-1 == b.indexOf("cke_") && (c[b] = d = 1);
					return d ? c : null;
				},
				wrapElement: function (a, b) {
					var c = null,
						d,
						e;
					if (a instanceof CKEDITOR.dom.element) {
						b = b || a.data("widget");
						d = this.registered[b];
						if (!d) return null;
						if (
							(c = a.getParent()) &&
							c.type == CKEDITOR.NODE_ELEMENT &&
							c.data("cke-widget-wrapper")
						)
							return c;
						a.hasAttribute("data-cke-widget-keep-attr") ||
							a.data("cke-widget-keep-attr", a.data("widget") ? 1 : 0);
						a.data("widget", b);
						(e = v(d, a.getName())) && h(a);
						c = new CKEDITOR.dom.element(e ? "span" : "div");
						c.setAttributes(r(e, b));
						c.data("cke-display-name", d.pathName ? d.pathName : a.getName());
						a.getParent(!0) && c.replace(a);
						a.appendTo(c);
					} else if (a instanceof CKEDITOR.htmlParser.element) {
						b = b || a.attributes["data-widget"];
						d = this.registered[b];
						if (!d) return null;
						if (
							(c = a.parent) &&
							c.type == CKEDITOR.NODE_ELEMENT &&
							c.attributes["data-cke-widget-wrapper"]
						)
							return c;
						"data-cke-widget-keep-attr" in a.attributes ||
							(a.attributes["data-cke-widget-keep-attr"] = a.attributes[
								"data-widget"
							]
								? 1
								: 0);
						b && (a.attributes["data-widget"] = b);
						(e = v(d, a.name)) && h(a);
						c = new CKEDITOR.htmlParser.element(e ? "span" : "div", r(e, b));
						c.attributes["data-cke-display-name"] = d.pathName
							? d.pathName
							: a.name;
						d = a.parent;
						var f;
						d && ((f = a.getIndex()), a.remove());
						c.add(a);
						d && x(d, f, c);
					}
					return c;
				},
				_tests_createEditableFilter: f,
			};
			CKEDITOR.event.implementOn(a.prototype);
			d.prototype = {
				addClass: function (a) {
					this.element.addClass(a);
					this.wrapper.addClass(d.WRAPPER_CLASS_PREFIX + a);
				},
				applyStyle: function (a) {
					J(this, a, 1);
				},
				checkStyleActive: function (a) {
					a = L(a);
					var b;
					if (!a) return !1;
					for (; (b = a.pop()); ) if (!this.hasClass(b)) return !1;
					return !0;
				},
				destroy: function (a) {
					this.fire("destroy");
					if (this.editables)
						for (var b in this.editables) this.destroyEditable(b, a);
					a ||
						("0" == this.element.data("cke-widget-keep-attr") &&
							this.element.removeAttribute("data-widget"),
						this.element.removeAttributes([
							"data-cke-widget-data",
							"data-cke-widget-keep-attr",
						]),
						this.element.removeClass("cke_widget_element"),
						this.element.replace(this.wrapper));
					this.wrapper = null;
				},
				destroyEditable: function (a, b) {
					var c = this.editables[a],
						d = !0;
					c.removeListener("focus", D);
					c.removeListener("blur", I);
					this.editor.focusManager.remove(c);
					if (c.filter) {
						for (var e in this.repository.instances) {
							var f = this.repository.instances[e];
							f.editables &&
								(f = f.editables[a]) &&
								f !== c &&
								c.filter === f.filter &&
								(d = !1);
						}
						d &&
							(c.filter.destroy(),
							(d = this.repository._.filters[this.name]) && delete d[a]);
					}
					b ||
						(this.repository.destroyAll(!1, c),
						c.removeClass("cke_widget_editable"),
						c.removeClass("cke_widget_editable_focused"),
						c.removeAttributes([
							"contenteditable",
							"data-cke-widget-editable",
							"data-cke-enter-mode",
						]));
					delete this.editables[a];
				},
				edit: function () {
					var a = { dialog: this.dialog },
						b = this;
					if (!1 === this.fire("edit", a) || !a.dialog) return !1;
					this.editor.openDialog(a.dialog, function (a) {
						var c, d;
						!1 !== b.fire("dialog", a) &&
							((c = a.on("show", function () {
								a.setupContent(b);
							})),
							(d = a.on("ok", function () {
								var c,
									d = b.on(
										"data",
										function (a) {
											c = 1;
											a.cancel();
										},
										null,
										null,
										0
									);
								b.editor.fire("saveSnapshot");
								a.commitContent(b);
								d.removeListener();
								c && (b.fire("data", b.data), b.editor.fire("saveSnapshot"));
							})),
							a.once("hide", function () {
								c.removeListener();
								d.removeListener();
							}));
					});
					return !0;
				},
				getClasses: function () {
					return this.repository.parseElementClasses(
						this.element.getAttribute("class")
					);
				},
				hasClass: function (a) {
					return this.element.hasClass(a);
				},
				initEditable: function (a, c) {
					var d = this._findOneNotNested(c.selector);
					return d && d.is(CKEDITOR.dtd.$editable)
						? ((d = new b(this.editor, d, {
								filter: f.call(this.repository, this.name, a, c),
						  })),
						  (this.editables[a] = d),
						  d.setAttributes({
								contenteditable: "true",
								"data-cke-widget-editable": a,
								"data-cke-enter-mode": d.enterMode,
						  }),
						  d.filter && d.data("cke-filter", d.filter.id),
						  d.addClass("cke_widget_editable"),
						  d.removeClass("cke_widget_editable_focused"),
						  c.pathName && d.data("cke-display-name", c.pathName),
						  this.editor.focusManager.add(d),
						  d.on("focus", D, this),
						  CKEDITOR.env.ie && d.on("blur", I, this),
						  (d._.initialSetData = !0),
						  d.setData(d.getHtml()),
						  !0)
						: !1;
				},
				_findOneNotNested: function (a) {
					a = this.wrapper.find(a);
					for (var b, c, e = 0; e < a.count(); e++)
						if (
							((b = a.getItem(e)),
							(c = b.getAscendant(d.isDomWidgetWrapper)),
							this.wrapper.equals(c))
						)
							return b;
					return null;
				},
				isInited: function () {
					return !(!this.wrapper || !this.inited);
				},
				isReady: function () {
					return this.isInited() && this.ready;
				},
				focus: function () {
					var a = this.editor.getSelection();
					if (a) {
						var b = this.editor.checkDirty();
						a.fake(this.wrapper);
						!b && this.editor.resetDirty();
					}
					this.editor.focus();
				},
				removeClass: function (a) {
					this.element.removeClass(a);
					this.wrapper.removeClass(d.WRAPPER_CLASS_PREFIX + a);
				},
				removeStyle: function (a) {
					J(this, a, 0);
				},
				setData: function (a, b) {
					var c = this.data,
						d = 0;
					if ("string" == typeof a) c[a] !== b && ((c[a] = b), (d = 1));
					else {
						var e = a;
						for (a in e) c[a] !== e[a] && ((d = 1), (c[a] = e[a]));
					}
					d && this.dataReady && (P(this), this.fire("data", c));
					return this;
				},
				setFocused: function (a) {
					this.wrapper[a ? "addClass" : "removeClass"]("cke_widget_focused");
					this.fire(a ? "focus" : "blur");
					return this;
				},
				setSelected: function (a) {
					this.wrapper[a ? "addClass" : "removeClass"]("cke_widget_selected");
					this.fire(a ? "select" : "deselect");
					return this;
				},
				updateDragHandlerPosition: function () {
					var a = this.editor,
						b = this.element.$,
						c = this._.dragHandlerOffset,
						b = { x: b.offsetLeft, y: b.offsetTop - 15 };
					(c && b.x == c.x && b.y == c.y) ||
						((c = a.checkDirty()),
						a.fire("lockSnapshot"),
						this.dragHandlerContainer.setStyles({
							top: b.y + "px",
							left: b.x + "px",
							display: "block",
						}),
						a.fire("unlockSnapshot"),
						!c && a.resetDirty(),
						(this._.dragHandlerOffset = b));
				},
			};
			CKEDITOR.event.implementOn(d.prototype);
			d.getNestedEditable = function (a, b) {
				return !b || b.equals(a)
					? null
					: d.isDomNestedEditable(b)
					? b
					: d.getNestedEditable(a, b.getParent());
			};
			d.isDomDragHandler = function (a) {
				return (
					a.type == CKEDITOR.NODE_ELEMENT &&
					a.hasAttribute("data-cke-widget-drag-handler")
				);
			};
			d.isDomDragHandlerContainer = function (a) {
				return (
					a.type == CKEDITOR.NODE_ELEMENT &&
					a.hasClass("cke_widget_drag_handler_container")
				);
			};
			d.isDomNestedEditable = function (a) {
				return (
					a.type == CKEDITOR.NODE_ELEMENT &&
					a.hasAttribute("data-cke-widget-editable")
				);
			};
			d.isDomWidgetElement = function (a) {
				return a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("data-widget");
			};
			d.isDomWidgetWrapper = function (a) {
				return (
					a.type == CKEDITOR.NODE_ELEMENT &&
					a.hasAttribute("data-cke-widget-wrapper")
				);
			};
			d.isDomWidget = function (a) {
				return a
					? this.isDomWidgetWrapper(a) || this.isDomWidgetElement(a)
					: !1;
			};
			d.isParserWidgetElement = function (a) {
				return a.type == CKEDITOR.NODE_ELEMENT && !!a.attributes["data-widget"];
			};
			d.isParserWidgetWrapper = function (a) {
				return (
					a.type == CKEDITOR.NODE_ELEMENT &&
					!!a.attributes["data-cke-widget-wrapper"]
				);
			};
			d.WRAPPER_CLASS_PREFIX = "cke_widget_wrapper_";
			b.prototype = CKEDITOR.tools.extend(
				CKEDITOR.tools.prototypedCopy(CKEDITOR.dom.element.prototype),
				{
					setData: function (a) {
						this._.initialSetData || this.editor.widgets.destroyAll(!1, this);
						this._.initialSetData = !1;
						a = this.editor.dataProcessor.toHtml(a, {
							context: this.getName(),
							filter: this.filter,
							enterMode: this.enterMode,
						});
						this.setHtml(a);
						this.editor.widgets.initOnAll(this);
					},
					getData: function () {
						return this.editor.dataProcessor.toDataFormat(this.getHtml(), {
							context: this.getName(),
							filter: this.filter,
							enterMode: this.enterMode,
						});
					},
				}
			);
			var U = /^(?:<(?:div|span)(?: data-cke-temp="1")?(?: id="cke_copybin")?(?: data-cke-temp="1")?>)?(?:<(?:div|span)(?: style="[^"]+")?>)?<span [^>]*data-cke-copybin-start="1"[^>]*>.?<\/span>([\s\S]+)<span [^>]*data-cke-copybin-end="1"[^>]*>.?<\/span>(?:<\/(?:div|span)>)?(?:<\/(?:div|span)>)?$/i,
				S = { 37: 1, 38: 1, 39: 1, 40: 1, 8: 1, 46: 1 };
			CKEDITOR.plugins.widget = d;
			d.repository = a;
			d.nestedEditable = b;
		})(),
		(function () {
			function a(a, c, d) {
				this.editor = a;
				this.notification = null;
				this._message = new CKEDITOR.template(c);
				this._singularMessage = d ? new CKEDITOR.template(d) : null;
				this._tasks = [];
				this._doneTasks = this._doneWeights = this._totalWeights = 0;
			}
			function d(a) {
				this._weight = a || 1;
				this._doneWeight = 0;
				this._isCanceled = !1;
			}
			CKEDITOR.plugins.add("notificationaggregator", {
				requires: "notification",
			});
			a.prototype = {
				createTask: function (a) {
					a = a || {};
					var c = !this.notification,
						d;
					c && (this.notification = this._createNotification());
					d = this._addTask(a);
					d.on("updated", this._onTaskUpdate, this);
					d.on("done", this._onTaskDone, this);
					d.on(
						"canceled",
						function () {
							this._removeTask(d);
						},
						this
					);
					this.update();
					c && this.notification.show();
					return d;
				},
				update: function () {
					this._updateNotification();
					this.isFinished() && this.fire("finished");
				},
				getPercentage: function () {
					return 0 === this.getTaskCount()
						? 1
						: this._doneWeights / this._totalWeights;
				},
				isFinished: function () {
					return this.getDoneTaskCount() === this.getTaskCount();
				},
				getTaskCount: function () {
					return this._tasks.length;
				},
				getDoneTaskCount: function () {
					return this._doneTasks;
				},
				_updateNotification: function () {
					this.notification.update({
						message: this._getNotificationMessage(),
						progress: this.getPercentage(),
					});
				},
				_getNotificationMessage: function () {
					var a = this.getTaskCount(),
						c = {
							current: this.getDoneTaskCount(),
							max: a,
							percentage: Math.round(100 * this.getPercentage()),
						};
					return (1 == a && this._singularMessage
						? this._singularMessage
						: this._message
					).output(c);
				},
				_createNotification: function () {
					return new CKEDITOR.plugins.notification(this.editor, {
						type: "progress",
					});
				},
				_addTask: function (a) {
					a = new d(a.weight);
					this._tasks.push(a);
					this._totalWeights += a._weight;
					return a;
				},
				_removeTask: function (a) {
					var c = CKEDITOR.tools.indexOf(this._tasks, a);
					-1 !== c &&
						(a._doneWeight && (this._doneWeights -= a._doneWeight),
						(this._totalWeights -= a._weight),
						this._tasks.splice(c, 1),
						this.update());
				},
				_onTaskUpdate: function (a) {
					this._doneWeights += a.data;
					this.update();
				},
				_onTaskDone: function () {
					this._doneTasks += 1;
					this.update();
				},
			};
			CKEDITOR.event.implementOn(a.prototype);
			d.prototype = {
				done: function () {
					this.update(this._weight);
				},
				update: function (a) {
					if (!this.isDone() && !this.isCanceled()) {
						a = Math.min(this._weight, a);
						var c = a - this._doneWeight;
						this._doneWeight = a;
						this.fire("updated", c);
						this.isDone() && this.fire("done");
					}
				},
				cancel: function () {
					this.isDone() ||
						this.isCanceled() ||
						((this._isCanceled = !0), this.fire("canceled"));
				},
				isDone: function () {
					return this._weight === this._doneWeight;
				},
				isCanceled: function () {
					return this._isCanceled;
				},
			};
			CKEDITOR.event.implementOn(d.prototype);
			CKEDITOR.plugins.notificationAggregator = a;
			CKEDITOR.plugins.notificationAggregator.task = d;
		})(),
		"use strict",
		(function () {
			CKEDITOR.plugins.add("uploadwidget", {
				requires: "widget,clipboard,filetools,notificationaggregator",
				init: function (a) {
					a.filter.allow("*[!data-widget,!data-cke-upload-id]");
				},
			});
			CKEDITOR.fileTools || (CKEDITOR.fileTools = {});
			CKEDITOR.tools.extend(CKEDITOR.fileTools, {
				addUploadWidget: function (a, d, b) {
					var c = CKEDITOR.fileTools,
						g = a.uploadRepository,
						l = b.supportedTypes ? 10 : 20;
					if (b.fileToElement)
						a.on(
							"paste",
							function (b) {
								b = b.data;
								var h = a.widgets.registered[d],
									e = b.dataTransfer,
									l = e.getFilesCount(),
									f = h.loadMethod || "loadAndUpload",
									n,
									r;
								if (!b.dataValue && l)
									for (r = 0; r < l; r++)
										if (
											((n = e.getFile(r)),
											!h.supportedTypes ||
												c.isTypeSupported(n, h.supportedTypes))
										) {
											var x = h.fileToElement(n);
											n = g.create(n, void 0, h.loaderType);
											x &&
												(n[f](h.uploadUrl, h.additionalRequestParameters),
												CKEDITOR.fileTools.markElement(x, d, n.id),
												("loadAndUpload" != f && "upload" != f) ||
													h.skipNotifications ||
													CKEDITOR.fileTools.bindNotifications(a, n),
												(b.dataValue += x.getOuterHtml()));
										}
							},
							null,
							null,
							l
						);
					CKEDITOR.tools.extend(b, {
						downcast: function () {
							return new CKEDITOR.htmlParser.text("");
						},
						init: function () {
							var b = this,
								c = this.wrapper
									.findOne("[data-cke-upload-id]")
									.data("cke-upload-id"),
								d = g.loaders[c],
								l = CKEDITOR.tools.capitalize,
								f,
								n;
							d.on("update", function (g) {
								if ("abort" === d.status && "function" === typeof b.onAbort)
									b.onAbort(d);
								if (b.wrapper && b.wrapper.getParent()) {
									a.fire("lockSnapshot");
									g = "on" + l(d.status);
									if (
										"abort" === d.status ||
										"function" !== typeof b[g] ||
										!1 !== b[g](d)
									)
										(n = "cke_upload_" + d.status),
											b.wrapper &&
												n != f &&
												(f && b.wrapper.removeClass(f),
												b.wrapper.addClass(n),
												(f = n)),
											("error" != d.status && "abort" != d.status) ||
												a.widgets.del(b);
									a.fire("unlockSnapshot");
								} else
									(CKEDITOR.instances[a.name] &&
										a
											.editable()
											.find('[data-cke-upload-id\x3d"' + c + '"]')
											.count()) ||
										d.abort(),
										g.removeListener();
							});
							d.update();
						},
						replaceWith: function (b, c) {
							if ("" === b.trim()) a.widgets.del(this);
							else {
								var d = this == a.widgets.focused,
									g = a.editable(),
									f = a.createRange(),
									l,
									r;
								d || (r = a.getSelection().createBookmarks());
								f.setStartBefore(this.wrapper);
								f.setEndAfter(this.wrapper);
								d && (l = f.createBookmark());
								g.insertHtmlIntoRange(b, f, c);
								a.widgets.checkWidgets({ initOnlyNew: !0 });
								a.widgets.destroy(this, !0);
								d
									? (f.moveToBookmark(l), f.select())
									: a.getSelection().selectBookmarks(r);
							}
						},
						_getLoader: function () {
							var a = this.wrapper.findOne("[data-cke-upload-id]");
							return a
								? this.editor.uploadRepository.loaders[a.data("cke-upload-id")]
								: null;
						},
					});
					a.widgets.add(d, b);
				},
				markElement: function (a, d, b) {
					a.setAttributes({ "data-cke-upload-id": b, "data-widget": d });
				},
				bindNotifications: function (a, d) {
					function b() {
						c = a._.uploadWidgetNotificaionAggregator;
						if (!c || c.isFinished())
							(c = a._.uploadWidgetNotificaionAggregator = new CKEDITOR.plugins.notificationAggregator(
								a,
								a.lang.uploadwidget.uploadMany,
								a.lang.uploadwidget.uploadOne
							)),
								c.once("finished", function () {
									var b = c.getTaskCount();
									0 === b
										? c.notification.hide()
										: c.notification.update({
												message:
													1 == b
														? a.lang.uploadwidget.doneOne
														: a.lang.uploadwidget.doneMany.replace("%1", b),
												type: "success",
												important: 1,
										  });
								});
					}
					var c,
						g = null;
					d.on("update", function () {
						!g &&
							d.uploadTotal &&
							(b(), (g = c.createTask({ weight: d.uploadTotal })));
						g && "uploading" == d.status && g.update(d.uploaded);
					});
					d.on("uploaded", function () {
						g && g.done();
					});
					d.on("error", function () {
						g && g.cancel();
						a.showNotification(d.message, "warning");
					});
					d.on("abort", function () {
						g && g.cancel();
						CKEDITOR.instances[a.name] &&
							a.showNotification(a.lang.uploadwidget.abort, "info");
					});
				},
			});
		})(),
		"use strict",
		(function () {
			function a(a) {
				9 >= a && (a = "0" + a);
				return String(a);
			}
			function d(c) {
				var d = new Date(),
					d = [
						d.getFullYear(),
						d.getMonth() + 1,
						d.getDate(),
						d.getHours(),
						d.getMinutes(),
						d.getSeconds(),
					];
				b += 1;
				return (
					"image-" + CKEDITOR.tools.array.map(d, a).join("") + "-" + b + "." + c
				);
			}
			var b = 0;
			CKEDITOR.plugins.add("uploadimage", {
				requires: "uploadwidget",
				onLoad: function () {
					CKEDITOR.addCss(".cke_upload_uploading img{opacity: 0.3}");
				},
				init: function (a) {
					if (CKEDITOR.plugins.clipboard.isFileApiSupported) {
						var b = CKEDITOR.fileTools,
							l = b.getUploadUrl(a.config, "image");
						l &&
							(b.addUploadWidget(a, "uploadimage", {
								supportedTypes: /image\/(jpeg|png|gif|bmp)/,
								uploadUrl: l,
								fileToElement: function () {
									var a = new CKEDITOR.dom.element("img");
									a.setAttribute(
										"src",
										"data:image/gif;base64,R0lGODlhDgAOAIAAAAAAAP///yH5BAAAAAAALAAAAAAOAA4AAAIMhI+py+0Po5y02qsKADs\x3d"
									);
									return a;
								},
								parts: { img: "img" },
								onUploading: function (a) {
									this.parts.img.setAttribute("src", a.data);
								},
								onUploaded: function (a) {
									var b = this.parts.img.$;
									this.replaceWith(
										'\x3cimg src\x3d"' +
											a.url +
											'" width\x3d"' +
											(a.responseData.width || b.naturalWidth) +
											'" height\x3d"' +
											(a.responseData.height || b.naturalHeight) +
											'"\x3e'
									);
								},
							}),
							a.on("paste", function (k) {
								if (k.data.dataValue.match(/<img[\s\S]+data:/i)) {
									k = k.data;
									var h = document.implementation.createHTMLDocument(""),
										h = new CKEDITOR.dom.element(h.body),
										e,
										m,
										f;
									h.data("cke-editable", 1);
									h.appendHtml(k.dataValue);
									e = h.find("img");
									for (f = 0; f < e.count(); f++) {
										m = e.getItem(f);
										var n = m.getAttribute("src"),
											r = n && "data:" == n.substring(0, 5),
											x = null === m.data("cke-realelement");
										r &&
											x &&
											!m.data("cke-upload-id") &&
											!m.isReadOnly(1) &&
											((r =
												((r = n.match(/image\/([a-z]+?);/i)) && r[1]) || "jpg"),
											(n = a.uploadRepository.create(n, d(r))),
											n.upload(l),
											b.markElement(m, "uploadimage", n.id),
											b.bindNotifications(a, n));
									}
									k.dataValue = h.getHtml();
								}
							}));
					}
				},
			});
		})(),
		CKEDITOR.plugins.add("wsc", {
			requires: "dialog",
			parseApi: function (a) {
				a.config.wsc_onFinish =
					"function" === typeof a.config.wsc_onFinish
						? a.config.wsc_onFinish
						: function () {};
				a.config.wsc_onClose =
					"function" === typeof a.config.wsc_onClose
						? a.config.wsc_onClose
						: function () {};
			},
			parseConfig: function (a) {
				a.config.wsc_customerId =
					a.config.wsc_customerId ||
					CKEDITOR.config.wsc_customerId ||
					"1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk";
				a.config.wsc_customDictionaryIds =
					a.config.wsc_customDictionaryIds ||
					CKEDITOR.config.wsc_customDictionaryIds ||
					"";
				a.config.wsc_userDictionaryName =
					a.config.wsc_userDictionaryName ||
					CKEDITOR.config.wsc_userDictionaryName ||
					"";
				a.config.wsc_customLoaderScript =
					a.config.wsc_customLoaderScript ||
					CKEDITOR.config.wsc_customLoaderScript;
				a.config.wsc_interfaceLang = a.config.wsc_interfaceLang;
				CKEDITOR.config.wsc_cmd =
					a.config.wsc_cmd || CKEDITOR.config.wsc_cmd || "spell";
				CKEDITOR.config.wsc_version = "v4.3.0-master-d769233";
				CKEDITOR.config.wsc_removeGlobalVariable = !0;
			},
			onLoad: function (a) {
				"moono-lisa" == (CKEDITOR.skinName || a.config.skin) &&
					CKEDITOR.document.appendStyleSheet(
						this.path + "skins/" + CKEDITOR.skin.name + "/wsc.css"
					);
			},
			init: function (a) {
				var d = CKEDITOR.env;
				this.parseConfig(a);
				this.parseApi(a);
				a.addCommand(
					"checkspell",
					new CKEDITOR.dialogCommand("checkspell")
				).modes = {
					wysiwyg:
						!CKEDITOR.env.opera &&
						!CKEDITOR.env.air &&
						document.domain == window.location.hostname &&
						!(d.ie && (8 > d.version || d.quirks)),
				};
				"undefined" == typeof a.plugins.scayt &&
					a.ui.addButton &&
					a.ui.addButton("SpellChecker", {
						label: a.lang.wsc.toolbar,
						click: function (a) {
							var c =
								a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE
									? a.container.getText()
									: a.document.getBody().getText();
							(c = c.replace(/\s/g, ""))
								? a.execCommand("checkspell")
								: alert("Nothing to check!");
						},
						toolbar: "spellchecker,10",
					});
				CKEDITOR.dialog.add(
					"checkspell",
					this.path +
						(CKEDITOR.env.ie && 7 >= CKEDITOR.env.version
							? "dialogs/wsc_ie.js"
							: window.postMessage
							? "dialogs/wsc.js"
							: "dialogs/wsc_ie.js")
				);
			},
		}),
		(function () {
			function a(a) {
				function b(a) {
					var c = !1;
					f.attachListener(
						f,
						"keydown",
						function () {
							var b = h.getBody().getElementsByTag(a);
							if (!c) {
								for (var d = 0; d < b.count(); d++)
									b.getItem(d).setCustomData("retain", !0);
								c = !0;
							}
						},
						null,
						null,
						1
					);
					f.attachListener(f, "keyup", function () {
						var b = h.getElementsByTag(a);
						c &&
							(1 == b.count() &&
								!b.getItem(0).getCustomData("retain") &&
								CKEDITOR.tools.isEmpty(b.getItem(0).getAttributes()) &&
								b.getItem(0).remove(1),
							(c = !1));
					});
				}
				var c = this.editor,
					h = a.document,
					e = h.body,
					m = h.getElementById("cke_actscrpt");
				m && m.parentNode.removeChild(m);
				(m = h.getElementById("cke_shimscrpt")) && m.parentNode.removeChild(m);
				(m = h.getElementById("cke_basetagscrpt")) &&
					m.parentNode.removeChild(m);
				e.contentEditable = !0;
				CKEDITOR.env.ie &&
					((e.hideFocus = !0),
					(e.disabled = !0),
					e.removeAttribute("disabled"));
				delete this._.isLoadingData;
				this.$ = e;
				h = new CKEDITOR.dom.document(h);
				this.setup();
				this.fixInitialSelection();
				var f = this;
				CKEDITOR.env.ie &&
					!CKEDITOR.env.edge &&
					h.getDocumentElement().addClass(h.$.compatMode);
				CKEDITOR.env.ie && !CKEDITOR.env.edge && c.enterMode != CKEDITOR.ENTER_P
					? b("p")
					: CKEDITOR.env.edge &&
					  15 > CKEDITOR.env.version &&
					  c.enterMode != CKEDITOR.ENTER_DIV &&
					  b("div");
				if (
					CKEDITOR.env.webkit ||
					(CKEDITOR.env.ie && 10 < CKEDITOR.env.version)
				)
					h.getDocumentElement().on("mousedown", function (a) {
						a.data.getTarget().is("html") &&
							setTimeout(function () {
								c.editable().focus();
							});
					});
				d(c);
				try {
					c.document.$.execCommand("2D-position", !1, !0);
				} catch (n) {}
				(CKEDITOR.env.gecko ||
					(CKEDITOR.env.ie && "CSS1Compat" == c.document.$.compatMode)) &&
					this.attachListener(this, "keydown", function (a) {
						var b = a.data.getKeystroke();
						if (33 == b || 34 == b)
							if (CKEDITOR.env.ie)
								setTimeout(function () {
									c.getSelection().scrollIntoView();
								}, 0);
							else if (c.window.$.innerHeight > this.$.offsetHeight) {
								var d = c.createRange();
								d[33 == b ? "moveToElementEditStart" : "moveToElementEditEnd"](
									this
								);
								d.select();
								a.data.preventDefault();
							}
					});
				CKEDITOR.env.ie &&
					this.attachListener(h, "blur", function () {
						try {
							h.$.selection.empty();
						} catch (a) {}
					});
				CKEDITOR.env.iOS &&
					this.attachListener(h, "touchend", function () {
						a.focus();
					});
				e = c.document.getElementsByTag("title").getItem(0);
				e.data("cke-title", e.getText());
				CKEDITOR.env.ie && (c.document.$.title = this._.docTitle);
				CKEDITOR.tools.setTimeout(
					function () {
						"unloaded" == this.status && (this.status = "ready");
						c.fire("contentDom");
						this._.isPendingFocus && (c.focus(), (this._.isPendingFocus = !1));
						setTimeout(function () {
							c.fire("dataReady");
						}, 0);
					},
					0,
					this
				);
			}
			function d(a) {
				function b() {
					var d;
					a.editable().attachListener(a, "selectionChange", function () {
						var b = a.getSelection().getSelectedElement();
						b &&
							(d && (d.detachEvent("onresizestart", c), (d = null)),
							b.$.attachEvent("onresizestart", c),
							(d = b.$));
					});
				}
				function c(a) {
					a.returnValue = !1;
				}
				if (CKEDITOR.env.gecko)
					try {
						var d = a.document.$;
						d.execCommand(
							"enableObjectResizing",
							!1,
							!a.config.disableObjectResizing
						);
						d.execCommand(
							"enableInlineTableEditing",
							!1,
							!a.config.disableNativeTableHandles
						);
					} catch (e) {}
				else
					CKEDITOR.env.ie &&
						11 > CKEDITOR.env.version &&
						a.config.disableObjectResizing &&
						b(a);
			}
			function b() {
				var a = [];
				if (8 <= CKEDITOR.document.$.documentMode) {
					a.push(
						"html.CSS1Compat [contenteditable\x3dfalse]{min-height:0 !important}"
					);
					var b = [],
						c;
					for (c in CKEDITOR.dtd.$removeEmpty)
						b.push("html.CSS1Compat " + c + "[contenteditable\x3dfalse]");
					a.push(b.join(",") + "{display:inline-block}");
				} else
					CKEDITOR.env.gecko &&
						(a.push("html{height:100% !important}"),
						a.push(
							"img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}"
						));
				a.push("html{cursor:text;*cursor:auto}");
				a.push("img,input,textarea{cursor:default}");
				return a.join("\n");
			}
			var c;
			CKEDITOR.plugins.add("wysiwygarea", {
				init: function (a) {
					a.config.fullPage &&
						a.addFeature({
							allowedContent:
								"html head title; style [media,type]; body (*)[id]; meta link [*]",
							requiredContent: "body",
						});
					a.addMode("wysiwyg", function (b) {
						function d(f) {
							f && f.removeListener();
							a.editable(new c(a, e.$.contentWindow.document.body));
							a.setData(a.getData(1), b);
						}
						var h =
								"document.open();" +
								(CKEDITOR.env.ie
									? "(" + CKEDITOR.tools.fixDomain + ")();"
									: "") +
								"document.close();",
							h = CKEDITOR.env.air
								? "javascript:void(0)"
								: CKEDITOR.env.ie && !CKEDITOR.env.edge
								? "javascript:void(function(){" + encodeURIComponent(h) + "}())"
								: "",
							e = CKEDITOR.dom.element.createFromHtml(
								'\x3ciframe src\x3d"' +
									h +
									'" frameBorder\x3d"0"\x3e\x3c/iframe\x3e'
							);
						e.setStyles({ width: "100%", height: "100%" });
						e.addClass("cke_wysiwyg_frame").addClass("cke_reset");
						h = a.ui.space("contents");
						h.append(e);
						var m =
							(CKEDITOR.env.ie && !CKEDITOR.env.edge) || CKEDITOR.env.gecko;
						if (m) e.on("load", d);
						var f = a.title,
							n = a.fire("ariaEditorHelpLabel", {}).label;
						f &&
							(CKEDITOR.env.ie && n && (f += ", " + n),
							e.setAttribute("title", f));
						if (n) {
							var f = CKEDITOR.tools.getNextId(),
								r = CKEDITOR.dom.element.createFromHtml(
									'\x3cspan id\x3d"' +
										f +
										'" class\x3d"cke_voice_label"\x3e' +
										n +
										"\x3c/span\x3e"
								);
							h.append(r, 1);
							e.setAttribute("aria-describedby", f);
						}
						a.on("beforeModeUnload", function (a) {
							a.removeListener();
							r && r.remove();
						});
						e.setAttributes({
							tabIndex: a.tabIndex,
							allowTransparency: "true",
						});
						!m && d();
						a.fire("ariaWidget", e);
					});
				},
			});
			CKEDITOR.editor.prototype.addContentsCss = function (a) {
				var b = this.config,
					c = b.contentsCss;
				CKEDITOR.tools.isArray(c) || (b.contentsCss = c ? [c] : []);
				b.contentsCss.push(a);
			};
			c = CKEDITOR.tools.createClass({
				$: function () {
					this.base.apply(this, arguments);
					this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function (b) {
						CKEDITOR.tools.setTimeout(a, 0, this, b);
					}, this);
					this._.docTitle = this.getWindow().getFrame().getAttribute("title");
				},
				base: CKEDITOR.editable,
				proto: {
					setData: function (a, c) {
						var d = this.editor;
						if (c)
							this.setHtml(a), this.fixInitialSelection(), d.fire("dataReady");
						else {
							this._.isLoadingData = !0;
							d._.dataStore = { id: 1 };
							var h = d.config,
								e = h.fullPage,
								m = h.docType,
								f = CKEDITOR.tools
									.buildStyleHtml(b())
									.replace(/<style>/, '\x3cstyle data-cke-temp\x3d"1"\x3e');
							e || (f += CKEDITOR.tools.buildStyleHtml(d.config.contentsCss));
							var n = h.baseHref
								? '\x3cbase href\x3d"' +
								  h.baseHref +
								  '" data-cke-temp\x3d"1" /\x3e'
								: "";
							e &&
								(a = a
									.replace(/<!DOCTYPE[^>]*>/i, function (a) {
										d.docType = m = a;
										return "";
									})
									.replace(/<\?xml\s[^\?]*\?>/i, function (a) {
										d.xmlDeclaration = a;
										return "";
									}));
							a = d.dataProcessor.toHtml(a);
							e
								? (/<body[\s|>]/.test(a) || (a = "\x3cbody\x3e" + a),
								  /<html[\s|>]/.test(a) ||
										(a = "\x3chtml\x3e" + a + "\x3c/html\x3e"),
								  /<head[\s|>]/.test(a)
										? /<title[\s|>]/.test(a) ||
										  (a = a.replace(
												/<head[^>]*>/,
												"$\x26\x3ctitle\x3e\x3c/title\x3e"
										  ))
										: (a = a.replace(
												/<html[^>]*>/,
												"$\x26\x3chead\x3e\x3ctitle\x3e\x3c/title\x3e\x3c/head\x3e"
										  )),
								  n && (a = a.replace(/<head[^>]*?>/, "$\x26" + n)),
								  (a = a.replace(/<\/head\s*>/, f + "$\x26")),
								  (a = m + a))
								: (a =
										h.docType +
										'\x3chtml dir\x3d"' +
										h.contentsLangDirection +
										'" lang\x3d"' +
										(h.contentsLanguage || d.langCode) +
										'"\x3e\x3chead\x3e\x3ctitle\x3e' +
										this._.docTitle +
										"\x3c/title\x3e" +
										n +
										f +
										"\x3c/head\x3e\x3cbody" +
										(h.bodyId ? ' id\x3d"' + h.bodyId + '"' : "") +
										(h.bodyClass ? ' class\x3d"' + h.bodyClass + '"' : "") +
										"\x3e" +
										a +
										"\x3c/body\x3e\x3c/html\x3e");
							CKEDITOR.env.gecko &&
								((a = a.replace(
									/<body/,
									'\x3cbody contenteditable\x3d"true" '
								)),
								2e4 > CKEDITOR.env.version &&
									(a = a.replace(
										/<body[^>]*>/,
										"$\x26\x3c!-- cke-content-start --\x3e"
									)));
							h =
								'\x3cscript id\x3d"cke_actscrpt" type\x3d"text/javascript"' +
								(CKEDITOR.env.ie ? ' defer\x3d"defer" ' : "") +
								"\x3evar wasLoaded\x3d0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" +
								this._.frameLoadedHandler +
								",window);wasLoaded\x3d1;}" +
								(CKEDITOR.env.ie
									? "onload();"
									: 'document.addEventListener("DOMContentLoaded", onload, false );') +
								"\x3c/script\x3e";
							CKEDITOR.env.ie &&
								9 > CKEDITOR.env.version &&
								(h +=
									'\x3cscript id\x3d"cke_shimscrpt"\x3ewindow.parent.CKEDITOR.tools.enableHtml5Elements(document)\x3c/script\x3e');
							n &&
								CKEDITOR.env.ie &&
								10 > CKEDITOR.env.version &&
								(h +=
									'\x3cscript id\x3d"cke_basetagscrpt"\x3evar baseTag \x3d document.querySelector( "base" );baseTag.href \x3d baseTag.href;\x3c/script\x3e');
							a = a.replace(/(?=\s*<\/(:?head)>)/, h);
							this.clearCustomData();
							this.clearListeners();
							d.fire("contentDomUnload");
							var r = this.getDocument();
							try {
								r.write(a);
							} catch (x) {
								setTimeout(function () {
									r.write(a);
								}, 0);
							}
						}
					},
					getData: function (a) {
						if (a) return this.getHtml();
						a = this.editor;
						var b = a.config,
							c = b.fullPage,
							d = c && a.docType,
							e = c && a.xmlDeclaration,
							m = this.getDocument(),
							c = c
								? m.getDocumentElement().getOuterHtml()
								: m.getBody().getHtml();
						CKEDITOR.env.gecko &&
							b.enterMode != CKEDITOR.ENTER_BR &&
							(c = c.replace(/<br>(?=\s*(:?$|<\/body>))/, ""));
						c = a.dataProcessor.toDataFormat(c);
						e && (c = e + "\n" + c);
						d && (c = d + "\n" + c);
						return c;
					},
					focus: function () {
						this._.isLoadingData
							? (this._.isPendingFocus = !0)
							: c.baseProto.focus.call(this);
					},
					detach: function () {
						var a = this.editor,
							b = a.document,
							d;
						try {
							d = a.window.getFrame();
						} catch (h) {}
						c.baseProto.detach.call(this);
						this.clearCustomData();
						b.getDocumentElement().clearCustomData();
						CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
						d && d.getParent()
							? (d.clearCustomData(),
							  (a = d.removeCustomData("onResize")) && a.removeListener(),
							  d.remove())
							: CKEDITOR.warn("editor-destroy-iframe");
					},
				},
			});
		})(),
		(CKEDITOR.config.disableObjectResizing = !1),
		(CKEDITOR.config.disableNativeTableHandles = !0),
		(CKEDITOR.config.disableNativeSpellChecker = !0),
		(CKEDITOR.config.plugins =
			"dialogui,dialog,a11yhelp,about,basicstyles,blockquote,notification,button,toolbar,clipboard,panel,floatpanel,menu,contextmenu,elementspath,indent,indentlist,list,enterkey,entities,popup,filetools,filebrowser,floatingspace,listblock,richcombo,format,horizontalrule,htmlwriter,image,fakeobjects,link,magicline,maximize,pastefromword,pastetext,removeformat,resize,menubutton,scayt,showborders,sourcearea,specialchar,stylescombo,tab,table,tabletools,tableselection,undo,lineutils,widgetselection,widget,notificationaggregator,uploadwidget,uploadimage,wsc,wysiwygarea"),
		(CKEDITOR.config.skin = "moono-lisa"),
		(function () {
			var a = function (a, b) {
				var c = CKEDITOR.getUrl("plugins/" + b);
				a = a.split(",");
				for (var g = 0; g < a.length; g++)
					CKEDITOR.skin.icons[a[g]] = {
						path: c,
						offset: -a[++g],
						bgsize: a[++g],
					};
			};
			CKEDITOR.env.hidpi
				? a(
						"about,0,,bold,24,,italic,48,,strike,72,,subscript,96,,superscript,120,,underline,144,,bidiltr,168,,bidirtl,192,,blockquote,216,,copy-rtl,240,,copy,264,,cut-rtl,288,,cut,312,,paste-rtl,336,,paste,360,,codesnippet,384,,bgcolor,408,,textcolor,432,,copyformatting,456,,creatediv,480,,docprops-rtl,504,,docprops,528,,easyimagealigncenter,552,,easyimagealignleft,576,,easyimagealignright,600,,easyimagealt,624,,easyimagefull,648,,easyimageside,672,,easyimageupload,696,,embed,720,,embedsemantic,744,,emojipanel,768,,find-rtl,792,,find,816,,replace,840,,flash,864,,button,888,,checkbox,912,,form,936,,hiddenfield,960,,imagebutton,984,,radio,1008,,select-rtl,1032,,select,1056,,textarea-rtl,1080,,textarea,1104,,textfield-rtl,1128,,textfield,1152,,horizontalrule,1176,,iframe,1200,,image,1224,,indent-rtl,1248,,indent,1272,,outdent-rtl,1296,,outdent,1320,,justifyblock,1344,,justifycenter,1368,,justifyleft,1392,,justifyright,1416,,language,1440,,anchor-rtl,1464,,anchor,1488,,link,1512,,unlink,1536,,bulletedlist-rtl,1560,,bulletedlist,1584,,numberedlist-rtl,1608,,numberedlist,1632,,mathjax,1656,,maximize,1680,,newpage-rtl,1704,,newpage,1728,,pagebreak-rtl,1752,,pagebreak,1776,,pastefromword-rtl,1800,,pastefromword,1824,,pastetext-rtl,1848,,pastetext,1872,,placeholder,1896,,preview-rtl,1920,,preview,1944,,print,1968,,removeformat,1992,,save,2016,,scayt,2040,,selectall,2064,,showblocks-rtl,2088,,showblocks,2112,,smiley,2136,,source-rtl,2160,,source,2184,,sourcedialog-rtl,2208,,sourcedialog,2232,,specialchar,2256,,table,2280,,templates-rtl,2304,,templates,2328,,uicolor,2352,,redo-rtl,2376,,redo,2400,,undo-rtl,2424,,undo,2448,,simplebox,4944,auto,spellchecker,2496,",
						"icons_hidpi.png"
				  )
				: a(
						"about,0,auto,bold,24,auto,italic,48,auto,strike,72,auto,subscript,96,auto,superscript,120,auto,underline,144,auto,bidiltr,168,auto,bidirtl,192,auto,blockquote,216,auto,copy-rtl,240,auto,copy,264,auto,cut-rtl,288,auto,cut,312,auto,paste-rtl,336,auto,paste,360,auto,codesnippet,384,auto,bgcolor,408,auto,textcolor,432,auto,copyformatting,456,auto,creatediv,480,auto,docprops-rtl,504,auto,docprops,528,auto,easyimagealigncenter,552,auto,easyimagealignleft,576,auto,easyimagealignright,600,auto,easyimagealt,624,auto,easyimagefull,648,auto,easyimageside,672,auto,easyimageupload,696,auto,embed,720,auto,embedsemantic,744,auto,emojipanel,768,auto,find-rtl,792,auto,find,816,auto,replace,840,auto,flash,864,auto,button,888,auto,checkbox,912,auto,form,936,auto,hiddenfield,960,auto,imagebutton,984,auto,radio,1008,auto,select-rtl,1032,auto,select,1056,auto,textarea-rtl,1080,auto,textarea,1104,auto,textfield-rtl,1128,auto,textfield,1152,auto,horizontalrule,1176,auto,iframe,1200,auto,image,1224,auto,indent-rtl,1248,auto,indent,1272,auto,outdent-rtl,1296,auto,outdent,1320,auto,justifyblock,1344,auto,justifycenter,1368,auto,justifyleft,1392,auto,justifyright,1416,auto,language,1440,auto,anchor-rtl,1464,auto,anchor,1488,auto,link,1512,auto,unlink,1536,auto,bulletedlist-rtl,1560,auto,bulletedlist,1584,auto,numberedlist-rtl,1608,auto,numberedlist,1632,auto,mathjax,1656,auto,maximize,1680,auto,newpage-rtl,1704,auto,newpage,1728,auto,pagebreak-rtl,1752,auto,pagebreak,1776,auto,pastefromword-rtl,1800,auto,pastefromword,1824,auto,pastetext-rtl,1848,auto,pastetext,1872,auto,placeholder,1896,auto,preview-rtl,1920,auto,preview,1944,auto,print,1968,auto,removeformat,1992,auto,save,2016,auto,scayt,2040,auto,selectall,2064,auto,showblocks-rtl,2088,auto,showblocks,2112,auto,smiley,2136,auto,source-rtl,2160,auto,source,2184,auto,sourcedialog-rtl,2208,auto,sourcedialog,2232,auto,specialchar,2256,auto,table,2280,auto,templates-rtl,2304,auto,templates,2328,auto,uicolor,2352,auto,redo-rtl,2376,auto,redo,2400,auto,undo-rtl,2424,auto,undo,2448,auto,simplebox,2472,auto,spellchecker,2496,auto",
						"icons.png"
				  );
		})());
})();
