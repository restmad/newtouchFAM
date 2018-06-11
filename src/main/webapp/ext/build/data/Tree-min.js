/*
 * Ext JS Library 2.0.2 Copyright(c) 2006-2008, Ext JS, LLC. licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.data.Tree = function(A) {
	this.nodeHash = {};
	this.root = null;
	if (A) {
		this.setRootNode(A)
	}
	this.addEvents("append", "remove", "move", "insert", "beforeappend",
			"beforeremove", "beforemove", "beforeinsert");
	Ext.data.Tree.superclass.constructor.call(this)
};
Ext.extend(Ext.data.Tree, Ext.util.Observable, {
			pathSeparator : "/",
			proxyNodeEvent : function() {
				return this.fireEvent.apply(this, arguments)
			},
			getRootNode : function() {
				return this.root
			},
			setRootNode : function(A) {
				this.root = A;
				A.ownerTree = this;
				A.isRoot = true;
				this.registerNode(A);
				return A
			},
			getNodeById : function(A) {
				return this.nodeHash[A]
			},
			registerNode : function(A) {
				this.nodeHash[A.id] = A
			},
			unregisterNode : function(A) {
				delete this.nodeHash[A.id]
			},
			toString : function() {
				return "[Tree" + (this.id ? " " + this.id : "") + "]"
			}
		});
Ext.data.Node = function(A) {
	this.attributes = A || {};
	this.leaf = this.attributes.leaf;
	this.id = this.attributes.id;
	if (!this.id) {
		this.id = Ext.id(null, "ynode-");
		this.attributes.id = this.id
	}
	this.childNodes = [];
	if (!this.childNodes.indexOf) {
		this.childNodes.indexOf = function(D) {
			for (var C = 0, B = this.length; C < B; C++) {
				if (this[C] == D) {
					return C
				}
			}
			return -1
		}
	}
	this.parentNode = null;
	this.firstChild = null;
	this.lastChild = null;
	this.previousSibling = null;
	this.nextSibling = null;
	this.addEvents({
				"append" : true,
				"remove" : true,
				"move" : true,
				"insert" : true,
				"beforeappend" : true,
				"beforeremove" : true,
				"beforemove" : true,
				"beforeinsert" : true
			});
	this.listeners = this.attributes.listeners;
	Ext.data.Node.superclass.constructor.call(this)
};
Ext.extend(Ext.data.Node, Ext.util.Observable, {
	fireEvent : function(B) {
		if (Ext.data.Node.superclass.fireEvent.apply(this, arguments) === false) {
			return false
		}
		var A = this.getOwnerTree();
		if (A) {
			if (A.proxyNodeEvent.apply(A, arguments) === false) {
				return false
			}
		}
		return true
	},
	isLeaf : function() {
		return this.leaf === true
	},
	setFirstChild : function(A) {
		this.firstChild = A
	},
	setLastChild : function(A) {
		this.lastChild = A
	},
	isLast : function() {
		return (!this.parentNode ? true : this.parentNode.lastChild == this)
	},
	isFirst : function() {
		return (!this.parentNode ? true : this.parentNode.firstChild == this)
	},
	hasChildNodes : function() {
		return !this.isLeaf() && this.childNodes.length > 0
	},
	appendChild : function(E) {
		var F = false;
		if (Ext.isArray(E)) {
			F = E
		} else {
			if (arguments.length > 1) {
				F = arguments
			}
		}
		if (F) {
			for (var D = 0, A = F.length; D < A; D++) {
				this.appendChild(F[D])
			}
		} else {
			if (this.fireEvent("beforeappend", this.ownerTree, this, E) === false) {
				return false
			}
			var B = this.childNodes.length;
			var C = E.parentNode;
			if (C) {
				if (E.fireEvent("beforemove", E.getOwnerTree(), E, C, this, B) === false) {
					return false
				}
				C.removeChild(E)
			}
			B = this.childNodes.length;
			if (B == 0) {
				this.setFirstChild(E)
			}
			this.childNodes.push(E);
			E.parentNode = this;
			var G = this.childNodes[B - 1];
			if (G) {
				E.previousSibling = G;
				G.nextSibling = E
			} else {
				E.previousSibling = null
			}
			E.nextSibling = null;
			this.setLastChild(E);
			E.setOwnerTree(this.getOwnerTree());
			this.fireEvent("append", this.ownerTree, this, E, B);
			if (C) {
				E.fireEvent("move", this.ownerTree, E, C, this, B)
			}
			return E
		}
	},
	removeChild : function(B) {
		var A = this.childNodes.indexOf(B);
		if (A == -1) {
			return false
		}
		if (this.fireEvent("beforeremove", this.ownerTree, this, B) === false) {
			return false
		}
		this.childNodes.splice(A, 1);
		if (B.previousSibling) {
			B.previousSibling.nextSibling = B.nextSibling
		}
		if (B.nextSibling) {
			B.nextSibling.previousSibling = B.previousSibling
		}
		if (this.firstChild == B) {
			this.setFirstChild(B.nextSibling)
		}
		if (this.lastChild == B) {
			this.setLastChild(B.previousSibling)
		}
		B.setOwnerTree(null);
		B.parentNode = null;
		B.previousSibling = null;
		B.nextSibling = null;
		this.fireEvent("remove", this.ownerTree, this, B);
		return B
	},
	insertBefore : function(D, A) {
		if (!A) {
			return this.appendChild(D)
		}
		if (D == A) {
			return false
		}
		if (this.fireEvent("beforeinsert", this.ownerTree, this, D, A) === false) {
			return false
		}
		var B = this.childNodes.indexOf(A);
		var C = D.parentNode;
		var E = B;
		if (C == this && this.childNodes.indexOf(D) < B) {
			E--
		}
		if (C) {
			if (D.fireEvent("beforemove", D.getOwnerTree(), D, C, this, B, A) === false) {
				return false
			}
			C.removeChild(D)
		}
		if (E == 0) {
			this.setFirstChild(D)
		}
		this.childNodes.splice(E, 0, D);
		D.parentNode = this;
		var F = this.childNodes[E - 1];
		if (F) {
			D.previousSibling = F;
			F.nextSibling = D
		} else {
			D.previousSibling = null
		}
		D.nextSibling = A;
		A.previousSibling = D;
		D.setOwnerTree(this.getOwnerTree());
		this.fireEvent("insert", this.ownerTree, this, D, A);
		if (C) {
			D.fireEvent("move", this.ownerTree, D, C, this, E, A)
		}
		return D
	},
	remove : function() {
		this.parentNode.removeChild(this);
		return this
	},
	item : function(A) {
		return this.childNodes[A]
	},
	replaceChild : function(A, B) {
		this.insertBefore(A, B);
		this.removeChild(B);
		return B
	},
	indexOf : function(A) {
		return this.childNodes.indexOf(A)
	},
	getOwnerTree : function() {
		if (!this.ownerTree) {
			var A = this;
			while (A) {
				if (A.ownerTree) {
					this.ownerTree = A.ownerTree;
					break
				}
				A = A.parentNode
			}
		}
		return this.ownerTree
	},
	getDepth : function() {
		var B = 0;
		var A = this;
		while (A.parentNode) {
			++B;
			A = A.parentNode
		}
		return B
	},
	setOwnerTree : function(B) {
		if (B != this.ownerTree) {
			if (this.ownerTree) {
				this.ownerTree.unregisterNode(this)
			}
			this.ownerTree = B;
			var D = this.childNodes;
			for (var C = 0, A = D.length; C < A; C++) {
				D[C].setOwnerTree(B)
			}
			if (B) {
				B.registerNode(this)
			}
		}
	},
	getPath : function(B) {
		B = B || "id";
		var D = this.parentNode;
		var A = [this.attributes[B]];
		while (D) {
			A.unshift(D.attributes[B]);
			D = D.parentNode
		}
		var C = this.getOwnerTree().pathSeparator;
		return C + A.join(C)
	},
	bubble : function(C, B, A) {
		var D = this;
		while (D) {
			if (C.apply(B || D, A || [D]) === false) {
				break
			}
			D = D.parentNode
		}
	},
	cascade : function(F, E, B) {
		if (F.apply(E || this, B || [this]) !== false) {
			var D = this.childNodes;
			for (var C = 0, A = D.length; C < A; C++) {
				D[C].cascade(F, E, B)
			}
		}
	},
	eachChild : function(F, E, B) {
		var D = this.childNodes;
		for (var C = 0, A = D.length; C < A; C++) {
			if (F.apply(E || this, B || [D[C]]) === false) {
				break
			}
		}
	},
	findChild : function(D, E) {
		var C = this.childNodes;
		for (var B = 0, A = C.length; B < A; B++) {
			if (C[B].attributes[D] == E) {
				return C[B]
			}
		}
		return null
	},
	findChildBy : function(E, D) {
		var C = this.childNodes;
		for (var B = 0, A = C.length; B < A; B++) {
			if (E.call(D || C[B], C[B]) === true) {
				return C[B]
			}
		}
		return null
	},
	sort : function(E, D) {
		var C = this.childNodes;
		var A = C.length;
		if (A > 0) {
			var F = D ? function() {
				E.apply(D, arguments)
			} : E;
			C.sort(F);
			for (var B = 0; B < A; B++) {
				var G = C[B];
				G.previousSibling = C[B - 1];
				G.nextSibling = C[B + 1];
				if (B == 0) {
					this.setFirstChild(G)
				}
				if (B == A - 1) {
					this.setLastChild(G)
				}
			}
		}
	},
	contains : function(A) {
		return A.isAncestor(this)
	},
	isAncestor : function(A) {
		var B = this.parentNode;
		while (B) {
			if (B == A) {
				return true
			}
			B = B.parentNode
		}
		return false
	},
	toString : function() {
		return "[Node" + (this.id ? " " + this.id : "") + "]"
	}
});