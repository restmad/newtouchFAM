/*
 * Ext JS Library 2.0.2 Copyright(c) 2006-2008, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.BoxComponent = Ext.extend(Ext.Component, {
			initComponent : function() {
				Ext.BoxComponent.superclass.initComponent.call(this);
				this.addEvents("resize", "move")
			},
			boxReady : false,
			deferHeight : false,
			setSize : function(B, D) {
				if (typeof B == "object") {
					D = B.height;
					B = B.width
				}
				if (!this.boxReady) {
					this.width = B;
					this.height = D;
					return this
				}
				if (this.lastSize && this.lastSize.width == B
						&& this.lastSize.height == D) {
					return this
				}
				this.lastSize = {
					width : B,
					height : D
				};
				var C = this.adjustSize(B, D);
				var F = C.width, A = C.height;
				if (F !== undefined || A !== undefined) {
					var E = this.getResizeEl();
					if (!this.deferHeight && F !== undefined && A !== undefined) {
						E.setSize(F, A)
					} else {
						if (!this.deferHeight && A !== undefined) {
							E.setHeight(A)
						} else {
							if (F !== undefined) {
								E.setWidth(F)
							}
						}
					}
					this.onResize(F, A, B, D);
					this.fireEvent("resize", this, F, A, B, D)
				}
				return this
			},
			setWidth : function(A) {
				return this.setSize(A)
			},
			setHeight : function(A) {
				return this.setSize(undefined, A)
			},
			getSize : function() {
				return this.el.getSize()
			},
			getPosition : function(A) {
				if (A === true) {
					return [this.el.getLeft(true), this.el.getTop(true)]
				}
				return this.xy || this.el.getXY()
			},
			getBox : function(A) {
				var B = this.el.getSize();
				if (A === true) {
					B.x = this.el.getLeft(true);
					B.y = this.el.getTop(true)
				} else {
					var C = this.xy || this.el.getXY();
					B.x = C[0];
					B.y = C[1]
				}
				return B
			},
			updateBox : function(A) {
				this.setSize(A.width, A.height);
				this.setPagePosition(A.x, A.y);
				return this
			},
			getResizeEl : function() {
				return this.resizeEl || this.el
			},
			getPositionEl : function() {
				return this.positionEl || this.el
			},
			setPosition : function(A, F) {
				if (A && typeof A[1] == "number") {
					F = A[1];
					A = A[0]
				}
				this.x = A;
				this.y = F;
				if (!this.boxReady) {
					return this
				}
				var B = this.adjustPosition(A, F);
				var E = B.x, D = B.y;
				var C = this.getPositionEl();
				if (E !== undefined || D !== undefined) {
					if (E !== undefined && D !== undefined) {
						C.setLeftTop(E, D)
					} else {
						if (E !== undefined) {
							C.setLeft(E)
						} else {
							if (D !== undefined) {
								C.setTop(D)
							}
						}
					}
					this.onPosition(E, D);
					this.fireEvent("move", this, E, D)
				}
				return this
			},
			setPagePosition : function(A, C) {
				if (A && typeof A[1] == "number") {
					C = A[1];
					A = A[0]
				}
				this.pageX = A;
				this.pageY = C;
				if (!this.boxReady) {
					return
				}
				if (A === undefined || C === undefined) {
					return
				}
				var B = this.el.translatePoints(A, C);
				this.setPosition(B.left, B.top);
				return this
			},
			onRender : function(B, A) {
				Ext.BoxComponent.superclass.onRender.call(this, B, A);
				if (this.resizeEl) {
					this.resizeEl = Ext.get(this.resizeEl)
				}
				if (this.positionEl) {
					this.positionEl = Ext.get(this.positionEl)
				}
			},
			afterRender : function() {
				Ext.BoxComponent.superclass.afterRender.call(this);
				this.boxReady = true;
				this.setSize(this.width, this.height);
				if (this.x || this.y) {
					this.setPosition(this.x, this.y)
				} else {
					if (this.pageX || this.pageY) {
						this.setPagePosition(this.pageX, this.pageY)
					}
				}
			},
			syncSize : function() {
				delete this.lastSize;
				this.setSize(this.autoWidth ? undefined : this.el.getWidth(),
						this.autoHeight ? undefined : this.el.getHeight());
				return this
			},
			onResize : function(D, B, A, C) {
			},
			onPosition : function(A, B) {
			},
			adjustSize : function(A, B) {
				if (this.autoWidth) {
					A = "auto"
				}
				if (this.autoHeight) {
					B = "auto"
				}
				return {
					width : A,
					height : B
				}
			},
			adjustPosition : function(A, B) {
				return {
					x : A,
					y : B
				}
			}
		});
Ext.reg("box", Ext.BoxComponent);