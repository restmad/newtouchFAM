/*
 * Ext JS Library 2.0.2 Copyright(c) 2006-2008, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.Tip = Ext.extend(Ext.Panel, {
	minWidth : 40,
	maxWidth : 300,
	shadow : "sides",
	defaultAlign : "tl-bl?",
	autoRender : true,
	quickShowInterval : 250,
	frame : true,
	hidden : true,
	baseCls : "x-tip",
	floating : {
		shadow : true,
		shim : true,
		useDisplay : true,
		constrain : false
	},
	autoHeight : true,
	initComponent : function() {
		Ext.Tip.superclass.initComponent.call(this);
		if (this.closable && !this.title) {
			this.elements += ",header"
		}
	},
	afterRender : function() {
		Ext.Tip.superclass.afterRender.call(this);
		if (this.closable) {
			this.addTool({
						id : "close",
						handler : this.hide,
						scope : this
					})
		}
	},
	showAt : function(A) {
		Ext.Tip.superclass.show.call(this);
		if (this.measureWidth !== false
				&& (!this.initialConfig || typeof this.initialConfig.width != "number")) {
			var B = this.body.getTextWidth();
			if (this.title) {
				B = Math.max(B, this.header.child("span")
								.getTextWidth(this.title))
			}
			B += this.getFrameWidth() + (this.closable ? 20 : 0)
					+ this.body.getPadding("lr");
			this.setWidth(B.constrain(this.minWidth, this.maxWidth))
		}
		if (this.constrainPosition) {
			A = this.el.adjustForConstraints(A)
		}
		this.setPagePosition(A[0], A[1])
	},
	showBy : function(A, B) {
		if (!this.rendered) {
			this.render(Ext.getBody())
		}
		this.showAt(this.el.getAlignToXY(A, B || this.defaultAlign))
	},
	initDraggable : function() {
		this.dd = new Ext.Tip.DD(this, typeof this.draggable == "boolean"
						? null
						: this.draggable);
		this.header.addClass("x-tip-draggable")
	}
});
Ext.Tip.DD = function(B, A) {
	Ext.apply(this, A);
	this.tip = B;
	Ext.Tip.DD.superclass.constructor.call(this, B.el.id, "WindowDD-" + B.id);
	this.setHandleElId(B.header.id);
	this.scroll = false
};
Ext.extend(Ext.Tip.DD, Ext.dd.DD, {
			moveOnly : true,
			scroll : false,
			headerOffsets : [100, 25],
			startDrag : function() {
				this.tip.el.disableShadow()
			},
			endDrag : function(A) {
				this.tip.el.enableShadow(true)
			}
		});