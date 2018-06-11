/*
 * Ext JS Library 2.0.2 Copyright(c) 2006-2008, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.tree.TreeNodeUI = function(A) {
	this.node = A;
	this.rendered = false;
	this.animating = false;
	this.wasLeaf = true;
	this.ecc = "x-tree-ec-icon x-tree-elbow";
	this.emptyIcon = Ext.BLANK_IMAGE_URL
};
Ext.tree.TreeNodeUI.prototype = {
	removeChild : function(A) {
		if (this.rendered) {
			this.ctNode.removeChild(A.ui.getEl())
		}
	},
	beforeLoad : function() {
		this.addClass("x-tree-node-loading")
	},
	afterLoad : function() {
		this.removeClass("x-tree-node-loading")
	},
	onTextChange : function(B, C, A) {
		if (this.rendered) {
			this.textNode.innerHTML = C
		}
	},
	onDisableChange : function(A, B) {
		this.disabled = B;
		if (this.checkbox) {
			this.checkbox.disabled = B
		}
		if (B) {
			this.addClass("x-tree-node-disabled")
		} else {
			this.removeClass("x-tree-node-disabled")
		}
	},
	onSelectedChange : function(A) {
		if (A) {
			this.focus();
			this.addClass("x-tree-selected")
		} else {
			this.removeClass("x-tree-selected")
		}
	},
	onMove : function(A, G, E, F, D, B) {
		this.childIndent = null;
		if (this.rendered) {
			var H = F.ui.getContainer();
			if (!H) {
				this.holder = document.createElement("div");
				this.holder.appendChild(this.wrap);
				return
			}
			var C = B ? B.ui.getEl() : null;
			if (C) {
				H.insertBefore(this.wrap, C)
			} else {
				H.appendChild(this.wrap)
			}
			this.node.renderIndent(true)
		}
	},
	addClass : function(A) {
		if (this.elNode) {
			Ext.fly(this.elNode).addClass(A)
		}
	},
	removeClass : function(A) {
		if (this.elNode) {
			Ext.fly(this.elNode).removeClass(A)
		}
	},
	remove : function() {
		if (this.rendered) {
			this.holder = document.createElement("div");
			this.holder.appendChild(this.wrap)
		}
	},
	fireEvent : function() {
		return this.node.fireEvent.apply(this.node, arguments)
	},
	initEvents : function() {
		this.node.on("move", this.onMove, this);
		if (this.node.disabled) {
			this.addClass("x-tree-node-disabled");
			if (this.checkbox) {
				this.checkbox.disabled = true
			}
		}
		if (this.node.hidden) {
			this.hide()
		}
		var B = this.node.getOwnerTree();
		var A = B.enableDD || B.enableDrag || B.enableDrop;
		if (A && (!this.node.isRoot || B.rootVisible)) {
			Ext.dd.Registry.register(this.elNode, {
						node : this.node,
						handles : this.getDDHandles(),
						isHandle : false
					})
		}
	},
	getDDHandles : function() {
		return [this.iconNode, this.textNode, this.elNode]
	},
	hide : function() {
		this.node.hidden = true;
		if (this.wrap) {
			this.wrap.style.display = "none"
		}
	},
	show : function() {
		this.node.hidden = false;
		if (this.wrap) {
			this.wrap.style.display = ""
		}
	},
	onContextMenu : function(A) {
		if (this.node.hasListener("contextmenu")
				|| this.node.getOwnerTree().hasListener("contextmenu")) {
			A.preventDefault();
			this.focus();
			this.fireEvent("contextmenu", this.node, A)
		}
	},
	onClick : function(B) {
		if (this.dropping) {
			B.stopEvent();
			return
		}
		if (this.fireEvent("beforeclick", this.node, B) !== false) {
			var A = B.getTarget("a");
			if (!this.disabled && this.node.attributes.href && A) {
				this.fireEvent("click", this.node, B);
				return
			} else {
				if (A && B.ctrlKey) {
					B.stopEvent()
				}
			}
			B.preventDefault();
			if (this.disabled) {
				return
			}
			if (this.node.attributes.singleClickExpand && !this.animating
					&& this.node.hasChildNodes()) {
				this.node.toggle()
			}
			this.fireEvent("click", this.node, B)
		} else {
			B.stopEvent()
		}
	},
	onDblClick : function(A) {
		A.preventDefault();
		if (this.disabled) {
			return
		}
		if (this.checkbox) {
			this.toggleCheck()
		}
		if (!this.animating && this.node.hasChildNodes()) {
			this.node.toggle()
		}
		this.fireEvent("dblclick", this.node, A)
	},
	onOver : function(A) {
		this.addClass("x-tree-node-over")
	},
	onOut : function(A) {
		this.removeClass("x-tree-node-over")
	},
	onCheckChange : function() {
		var A = this.checkbox.checked;
		this.node.attributes.checked = A;
		this.fireEvent("checkchange", this.node, A)
	},
	ecClick : function(A) {
		if (!this.animating
				&& (this.node.hasChildNodes() || this.node.attributes.expandable)) {
			this.node.toggle()
		}
	},
	startDrop : function() {
		this.dropping = true
	},
	endDrop : function() {
		setTimeout(function() {
					this.dropping = false
				}.createDelegate(this), 50)
	},
	expand : function() {
		this.updateExpandIcon();
		this.ctNode.style.display = ""
	},
	focus : function() {
		if (!this.node.preventHScroll) {
			try {
				this.anchor.focus()
			} catch (C) {
			}
		} else {
			if (!Ext.isIE) {
				try {
					var B = this.node.getOwnerTree().getTreeEl().dom;
					var A = B.scrollLeft;
					this.anchor.focus();
					B.scrollLeft = A
				} catch (C) {
				}
			}
		}
	},
	toggleCheck : function(B) {
		var A = this.checkbox;
		if (A) {
			A.checked = (B === undefined ? !A.checked : B)
		}
	},
	blur : function() {
		try {
			this.anchor.blur()
		} catch (A) {
		}
	},
	animExpand : function(B) {
		var A = Ext.get(this.ctNode);
		A.stopFx();
		if (!this.node.hasChildNodes()) {
			this.updateExpandIcon();
			this.ctNode.style.display = "";
			Ext.callback(B);
			return
		}
		this.animating = true;
		this.updateExpandIcon();
		A.slideIn("t", {
					callback : function() {
						this.animating = false;
						Ext.callback(B)
					},
					scope : this,
					duration : this.node.ownerTree.duration || 0.25
				})
	},
	highlight : function() {
		var A = this.node.getOwnerTree();
		Ext.fly(this.wrap).highlight(A.hlColor || "C3DAF9", {
					endColor : A.hlBaseColor
				})
	},
	collapse : function() {
		this.updateExpandIcon();
		this.ctNode.style.display = "none"
	},
	animCollapse : function(B) {
		var A = Ext.get(this.ctNode);
		A.enableDisplayMode("block");
		A.stopFx();
		this.animating = true;
		this.updateExpandIcon();
		A.slideOut("t", {
					callback : function() {
						this.animating = false;
						Ext.callback(B)
					},
					scope : this,
					duration : this.node.ownerTree.duration || 0.25
				})
	},
	getContainer : function() {
		return this.ctNode
	},
	getEl : function() {
		return this.wrap
	},
	appendDDGhost : function(A) {
		A.appendChild(this.elNode.cloneNode(true))
	},
	getDDRepairXY : function() {
		return Ext.lib.Dom.getXY(this.iconNode)
	},
	onRender : function() {
		this.render()
	},
	render : function(B) {
		var D = this.node, A = D.attributes;
		var C = D.parentNode
				? D.parentNode.ui.getContainer()
				: D.ownerTree.innerCt.dom;
		if (!this.rendered) {
			this.rendered = true;
			this.renderElements(D, A, C, B);
			if (A.qtip) {
				if (this.textNode.setAttributeNS) {
					this.textNode.setAttributeNS("ext", "qtip", A.qtip);
					if (A.qtipTitle) {
						this.textNode.setAttributeNS("ext", "qtitle",
								A.qtipTitle)
					}
				} else {
					this.textNode.setAttribute("ext:qtip", A.qtip);
					if (A.qtipTitle) {
						this.textNode.setAttribute("ext:qtitle", A.qtipTitle)
					}
				}
			} else {
				if (A.qtipCfg) {
					A.qtipCfg.target = Ext.id(this.textNode);
					Ext.QuickTips.register(A.qtipCfg)
				}
			}
			this.initEvents();
			if (!this.node.expanded) {
				this.updateExpandIcon(true)
			}
		} else {
			if (B === true) {
				C.appendChild(this.wrap)
			}
		}
	},
	renderElements : function(D, I, H, J) {
		this.indentMarkup = D.parentNode
				? D.parentNode.ui.getChildIndent()
				: "";
		var E = typeof I.checked == "boolean";
		var B = I.href ? I.href : Ext.isGecko ? "" : "#";
		var C = [
				"<li class=\"x-tree-node\"><div ext:tree-node-id=\"",
				D.id,
				"\" class=\"x-tree-node-el x-tree-node-leaf x-unselectable ",
				I.cls,
				"\" unselectable=\"on\">",
				"<span class=\"x-tree-node-indent\">",
				this.indentMarkup,
				"</span>",
				"<img src=\"",
				this.emptyIcon,
				"\" class=\"x-tree-ec-icon x-tree-elbow\" />",
				"<img src=\"",
				I.icon || this.emptyIcon,
				"\" class=\"x-tree-node-icon",
				(I.icon ? " x-tree-node-inline-icon" : ""),
				(I.iconCls ? " " + I.iconCls : ""),
				"\" unselectable=\"on\" />",
				E
						? ("<input class=\"x-tree-node-cb\" type=\"checkbox\" " + (I.checked
								? "checked=\"checked\" />"
								: "/>"))
						: "",
				"<a hidefocus=\"on\" class=\"x-tree-node-anchor\" href=\"", B,
				"\" tabIndex=\"1\" ",
				I.hrefTarget ? " target=\"" + I.hrefTarget + "\"" : "",
				"><span unselectable=\"on\">", D.text, "</span></a></div>",
				"<ul class=\"x-tree-node-ct\" style=\"display:none;\"></ul>",
				"</li>"].join("");
		var A;
		if (J !== true && D.nextSibling && (A = D.nextSibling.ui.getEl())) {
			this.wrap = Ext.DomHelper.insertHtml("beforeBegin", A, C)
		} else {
			this.wrap = Ext.DomHelper.insertHtml("beforeEnd", H, C)
		}
		this.elNode = this.wrap.childNodes[0];
		this.ctNode = this.wrap.childNodes[1];
		var G = this.elNode.childNodes;
		this.indentNode = G[0];
		this.ecNode = G[1];
		this.iconNode = G[2];
		var F = 3;
		if (E) {
			this.checkbox = G[3];
			F++
		}
		this.anchor = G[F];
		this.textNode = G[F].firstChild
	},
	getAnchor : function() {
		return this.anchor
	},
	getTextEl : function() {
		return this.textNode
	},
	getIconEl : function() {
		return this.iconNode
	},
	isChecked : function() {
		return this.checkbox ? this.checkbox.checked : false
	},
	updateExpandIcon : function() {
		if (this.rendered) {
			var F = this.node, D, C;
			var A = F.isLast() ? "x-tree-elbow-end" : "x-tree-elbow";
			var E = F.hasChildNodes();
			if (E || F.attributes.expandable) {
				if (F.expanded) {
					A += "-minus";
					D = "x-tree-node-collapsed";
					C = "x-tree-node-expanded"
				} else {
					A += "-plus";
					D = "x-tree-node-expanded";
					C = "x-tree-node-collapsed"
				}
				if (this.wasLeaf) {
					this.removeClass("x-tree-node-leaf");
					this.wasLeaf = false
				}
				if (this.c1 != D || this.c2 != C) {
					Ext.fly(this.elNode).replaceClass(D, C);
					this.c1 = D;
					this.c2 = C
				}
			} else {
				if (!this.wasLeaf) {
					Ext.fly(this.elNode).replaceClass("x-tree-node-expanded",
							"x-tree-node-leaf");
					delete this.c1;
					delete this.c2;
					this.wasLeaf = true
				}
			}
			var B = "x-tree-ec-icon " + A;
			if (this.ecc != B) {
				this.ecNode.className = B;
				this.ecc = B
			}
		}
	},
	getChildIndent : function() {
		if (!this.childIndent) {
			var A = [];
			var B = this.node;
			while (B) {
				if (!B.isRoot || (B.isRoot && B.ownerTree.rootVisible)) {
					if (!B.isLast()) {
						A.unshift("<img src=\"" + this.emptyIcon
								+ "\" class=\"x-tree-elbow-line\" />")
					} else {
						A.unshift("<img src=\"" + this.emptyIcon
								+ "\" class=\"x-tree-icon\" />")
					}
				}
				B = B.parentNode
			}
			this.childIndent = A.join("")
		}
		return this.childIndent
	},
	renderIndent : function() {
		if (this.rendered) {
			var A = "";
			var B = this.node.parentNode;
			if (B) {
				A = B.ui.getChildIndent()
			}
			if (this.indentMarkup != A) {
				this.indentNode.innerHTML = A;
				this.indentMarkup = A
			}
			this.updateExpandIcon()
		}
	},
	destroy : function() {
		if (this.elNode) {
			Ext.dd.Registry.unregister(this.elNode.id)
		}
		delete this.elNode;
		delete this.ctNode;
		delete this.indentNode;
		delete this.ecNode;
		delete this.iconNode;
		delete this.checkbox;
		delete this.anchor;
		delete this.textNode;
		Ext.removeNode(this.ctNode)
	}
};
Ext.tree.RootTreeNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
			render : function() {
				if (!this.rendered) {
					var A = this.node.ownerTree.innerCt.dom;
					this.node.expanded = true;
					A.innerHTML = "<div class=\"x-tree-root-node\"></div>";
					this.wrap = this.ctNode = A.firstChild
				}
			},
			collapse : Ext.emptyFn,
			expand : Ext.emptyFn
		});