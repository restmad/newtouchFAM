/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.TabPanel = Ext.extend(Ext.Panel, {
    monitorResize:true,
    deferredRender:true,
    tabWidth:120,
    minTabWidth:30,
    resizeTabs:false,
    enableTabScroll:false,
    scrollIncrement:0,
    scrollRepeatInterval:400,
    scrollDuration:0.35,
    animScroll:true,
    tabPosition:"top",
    baseCls:"x-tab-panel",
    autoTabs:false,
    autoTabSelector:"div.x-tab",
    activeTab:null,
    tabMargin:2,
    plain:false,
    wheelIncrement:20,
    idDelimiter:"__",
    itemCls:"x-tab-item",
    elements:"body",
    headerAsText:false,
    frame:false,
    hideBorders:true,
    initComponent:function()
    {
        this.frame = false;
        Ext.TabPanel.superclass.initComponent.call(this);
        this.addEvents("beforetabchange", "tabchange", "contextmenu");
        this.setLayout(new Ext.layout.CardLayout({deferredRender:this.deferredRender}));
        if (this.tabPosition == "top") {
            this.elements += ",header";
            this.stripTarget = "header"
        }
        else
        {
            this.elements += ",footer";
            this.stripTarget = "footer"
        }
        if (!this.stack) {
            this.stack = Ext.TabPanel.AccessStack()
        }
        this.initItems()
    },render:function()
    {
        Ext.TabPanel.superclass.render.apply(this, arguments);
        if (this.activeTab !== undefined) {
            var A = this.activeTab;
            delete this.activeTab;
            this.setActiveTab(A)
        }
    },onRender:function(C, A)
    {
        Ext.TabPanel.superclass.onRender.call(this, C, A);
        if (this.plain) {
            var E = this.tabPosition == "top" ? "header" : "footer";
            this[E].addClass("x-tab-panel-" + E + "-plain")
        }
        var B = this[this.stripTarget];
        this.stripWrap = B.createChild({cls:"x-tab-strip-wrap",cn:{tag:"ul",cls:"x-tab-strip x-tab-strip-" + this.tabPosition}});
        this.stripSpacer = B.createChild({cls:"x-tab-strip-spacer"});
        this.strip = new Ext.Element(this.stripWrap.dom.firstChild);
        this.edge = this.strip.createChild({tag:"li",cls:"x-tab-edge"});
        this.strip.createChild({cls:"x-clear"});
        this.body.addClass("x-tab-panel-body-" + this.tabPosition);
        if (!this.itemTpl) {
            var D = new Ext.Template("<li class=\"{cls}\" id=\"{id}\"><a class=\"x-tab-strip-close\" onclick=\"return false;\"></a>", "<a class=\"x-tab-right\" href=\"#\" onclick=\"return false;\"><em class=\"x-tab-left\">", "<span class=\"x-tab-strip-inner\"><span class=\"x-tab-strip-text {iconCls}\">{text}</span></span>", "</em></a></li>");
            D.disableFormats = true;
            D.compile();
            Ext.TabPanel.prototype.itemTpl = D
        }
        this.items.each(this.initTab, this)
    },afterRender:function()
    {
        Ext.TabPanel.superclass.afterRender.call(this);
        if (this.autoTabs) {
            this.readTabs(false)
        }
    },initEvents:function()
    {
        Ext.TabPanel.superclass.initEvents.call(this);
        this.on("add", this.onAdd, this);
        this.on("remove", this.onRemove, this);
        this.strip.on("mousedown", this.onStripMouseDown, this);
        this.strip.on("click", this.onStripClick, this);
        this.strip.on("contextmenu", this.onStripContextMenu, this);
        if (this.enableTabScroll) {
            this.strip.on("mousewheel", this.onWheel, this)
        }
    },findTargets:function(C)
    {
        var B = null;
        var A = C.getTarget("li", this.strip);
        if (A) {
            B = this.getComponent(A.id.split(this.idDelimiter)[1]);
            if (B.disabled) {
                return{close:null,item:null,el:null}
            }
        }
        return{close:C.getTarget(".x-tab-strip-close", this.strip),item:B,el:A}
    },onStripMouseDown:function(B)
    {
        B.preventDefault();
        if (B.button != 0) {
            return
        }
        var A = this.findTargets(B);
        if (A.close) {
            this.remove(A.item);
            return
        }
        if (A.item && A.item != this.activeTab) {
            this.setActiveTab(A.item)
        }
    },onStripClick:function(B)
    {
        var A = this.findTargets(B);
        if (!A.close && A.item && A.item != this.activeTab) {
            this.setActiveTab(A.item)
        }
    },onStripContextMenu:function(B)
    {
        B.preventDefault();
        var A = this.findTargets(B);
        if (A.item) {
            this.fireEvent("contextmenu", this, A.item, B)
        }
    },readTabs:function(D)
    {
        if (D === true) {
            this.items.each(function(G)
            {
                this.remove(G)
            }, this)
        }
        var C = this.el.query(this.autoTabSelector);
        for (var B = 0,A = C.length; B < A; B++) {
            var E = C[B];
            var F = E.getAttribute("title");
            E.removeAttribute("title");
            this.add({title:F,el:E})
        }
    },initTab:function(D, B)
    {
        var E = this.strip.dom.childNodes[B];
        var A = D.closable ? "x-tab-strip-closable" : "";
        if (D.disabled) {
            A += " x-item-disabled"
        }
        if (D.iconCls) {
            A += " x-tab-with-icon"
        }
        if (D.tabCls) {
            A += " " + D.tabCls
        }
        var F = {id:this.id + this.idDelimiter + D.getItemId(),text:D.title,cls:A,iconCls:D.iconCls || ""};
        var C = E ? this.itemTpl.insertBefore(E, F) : this.itemTpl.append(this.strip, F);
        Ext.fly(C).addClassOnOver("x-tab-strip-over");
        if (D.tabTip) {
            Ext.fly(C).child("span.x-tab-strip-text", true).qtip = D.tabTip
        }
        D.on("disable", this.onItemDisabled, this);
        D.on("enable", this.onItemEnabled, this);
        D.on("titlechange", this.onItemTitleChanged, this);
        D.on("beforeshow", this.onBeforeShowItem, this)
    },onAdd:function(C, B, A)
    {
        this.initTab(B, A);
        if (this.items.getCount() == 1) {
            this.syncSize()
        }
        this.delegateUpdates()
    },onBeforeAdd:function(B)
    {
        var A = B.events ? (this.items.containsKey(B.getItemId()) ? B : null) : this.items.get(B);
        if (A) {
            this.setActiveTab(B);
            return false
        }
        Ext.TabPanel.superclass.onBeforeAdd.apply(this, arguments);
        var C = B.elements;
        B.elements = C ? C.replace(",header", "") : C;
        B.border = (B.border === true)
    },onRemove:function(C, B)
    {
        Ext.removeNode(this.getTabEl(B));
        this.stack.remove(B);
        if (B == this.activeTab) {
            var A = this.stack.next();
            if (A) {
                this.setActiveTab(A)
            }
            else
            {
                this.setActiveTab(0)
            }
        }
        this.delegateUpdates()
    },onBeforeShowItem:function(A)
    {
        if (A != this.activeTab) {
            this.setActiveTab(A);
            return false
        }
    },onItemDisabled:function(B)
    {
        var A = this.getTabEl(B);
        if (A) {
            Ext.fly(A).addClass("x-item-disabled")
        }
        this.stack.remove(B)
    },onItemEnabled:function(B)
    {
        var A = this.getTabEl(B);
        if (A) {
            Ext.fly(A).removeClass("x-item-disabled")
        }
    },onItemTitleChanged:function(B)
    {
        var A = this.getTabEl(B);
        if (A) {
            Ext.fly(A).child("span.x-tab-strip-text", true).innerHTML = B.title
        }
    },getTabEl:function(A)
    {
        var B = (typeof A === "number") ? this.items.items[A].getItemId() : A.getItemId();
        return document.getElementById(this.id + this.idDelimiter + B)
    },onResize:function()
    {
        Ext.TabPanel.superclass.onResize.apply(this, arguments);
        this.delegateUpdates()
    },beginUpdate:function()
    {
        this.suspendUpdates = true
    },endUpdate:function()
    {
        this.suspendUpdates = false;
        this.delegateUpdates()
    },hideTabStripItem:function(B)
    {
        B = this.getComponent(B);
        var A = this.getTabEl(B);
        if (A) {
            A.style.display = "none";
            this.delegateUpdates()
        }
    },unhideTabStripItem:function(B)
    {
        B = this.getComponent(B);
        var A = this.getTabEl(B);
        if (A) {
            A.style.display = "";
            this.delegateUpdates()
        }
    },delegateUpdates:function()
    {
        if (this.suspendUpdates) {
            return
        }
        if (this.resizeTabs && this.rendered) {
            this.autoSizeTabs()
        }
        if (this.enableTabScroll && this.rendered) {
            this.autoScrollTabs()
        }
    },autoSizeTabs:function()
    {
        var G = this.items.length;
        var B = this.tabPosition != "bottom" ? "header" : "footer";
        var C = this[B].dom.offsetWidth;
        var A = this[B].dom.clientWidth;
        if (!this.resizeTabs || G < 1 || !A) {
            return
        }
        var I = Math.max(Math.min(Math.floor((A - 4) / G) - this.tabMargin, this.tabWidth), this.minTabWidth);
        this.lastTabWidth = I;
        var K = this.stripWrap.dom.getElementsByTagName("li");
        for (var E = 0,H = K.length - 1; E < H; E++) {
            var J = K[E];
            var L = J.childNodes[1].firstChild.firstChild;
            var F = J.offsetWidth;
            var D = L.offsetWidth;
            L.style.width = (I - (F - D)) + "px"
        }
    },adjustBodyWidth:function(A)
    {
        if (this.header) {
            this.header.setWidth(A)
        }
        if (this.footer) {
            this.footer.setWidth(A)
        }
        return A
    },setActiveTab:function(C)
    {
        C = this.getComponent(C);
        if (!C || this.fireEvent("beforetabchange", this, C, this.activeTab) === false) {
            return
        }
        if (!this.rendered) {
            this.activeTab = C;
            return
        }
        if (this.activeTab != C) {
            if (this.activeTab) {
                var A = this.getTabEl(this.activeTab);
                if (A) {
                    Ext.fly(A).removeClass("x-tab-strip-active")
                }
                this.activeTab.fireEvent("deactivate", this.activeTab)
            }
            var B = this.getTabEl(C);
            Ext.fly(B).addClass("x-tab-strip-active");
            this.activeTab = C;
            this.stack.add(C);
            this.layout.setActiveItem(C);
            if (this.layoutOnTabChange && C.doLayout) {
                C.doLayout()
            }
            if (this.scrolling) {
                this.scrollToTab(C, this.animScroll)
            }
            C.fireEvent("activate", C);
            this.fireEvent("tabchange", this, C)
        }
    },getActiveTab:function()
    {
        return this.activeTab || null
    },getItem:function(A)
    {
        return this.getComponent(A)
    },autoScrollTabs:function()
    {
        var G = this.items.length;
        var D = this.header.dom.offsetWidth;
        var C = this.header.dom.clientWidth;
        var F = this.stripWrap;
        var E = F.dom;
        var B = E.offsetWidth;
        var H = this.getScrollPos();
        var A = this.edge.getOffsetsTo(this.stripWrap)[0] + H;
        if (!this.enableTabScroll || G < 1 || B < 20) {
            return
        }
        if (A <= C) {
            E.scrollLeft = 0;
            F.setWidth(C);
            if (this.scrolling) {
                this.scrolling = false;
                this.header.removeClass("x-tab-scrolling");
                this.scrollLeft.hide();
                this.scrollRight.hide();
                if (Ext.isAir) {
                    E.style.marginLeft = "";
                    E.style.marginRight = ""
                }
            }
        }
        else
        {
            if (!this.scrolling) {
                this.header.addClass("x-tab-scrolling");
                if (Ext.isAir) {
                    E.style.marginLeft = "18px";
                    E.style.marginRight = "18px"
                }
            }
            C -= F.getMargins("lr");
            F.setWidth(C > 20 ? C : 20);
            if (!this.scrolling) {
                if (!this.scrollLeft) {
                    this.createScrollers()
                }
                else
                {
                    this.scrollLeft.show();
                    this.scrollRight.show()
                }
            }
            this.scrolling = true;
            if (H > (A - C)) {
                E.scrollLeft = A - C
            }
            else
            {
                this.scrollToTab(this.activeTab, false)
            }
            this.updateScrollButtons()
        }
    },createScrollers:function()
    {
        var C = this.stripWrap.dom.offsetHeight;
        var A = this.header.insertFirst({cls:"x-tab-scroller-left"});
        A.setHeight(C);
        A.addClassOnOver("x-tab-scroller-left-over");
        this.leftRepeater = new Ext.util.ClickRepeater(A, {interval:this.scrollRepeatInterval,handler:this.onScrollLeft,scope:this});
        this.scrollLeft = A;
        var B = this.header.insertFirst({cls:"x-tab-scroller-right"});
        B.setHeight(C);
        B.addClassOnOver("x-tab-scroller-right-over");
        this.rightRepeater = new Ext.util.ClickRepeater(B, {interval:this.scrollRepeatInterval,handler:this.onScrollRight,scope:this});
        this.scrollRight = B
    },getScrollWidth:function()
    {
        return this.edge.getOffsetsTo(this.stripWrap)[0] + this.getScrollPos()
    },getScrollPos:function()
    {
        return parseInt(this.stripWrap.dom.scrollLeft, 10) || 0
    },getScrollArea:function()
    {
        return parseInt(this.stripWrap.dom.clientWidth, 10) || 0
    },getScrollAnim:function()
    {
        return{duration:this.scrollDuration,callback:this.updateScrollButtons,scope:this}
    },getScrollIncrement:function()
    {
        return this.scrollIncrement || (this.resizeTabs ? this.lastTabWidth + 2 : 100)
    },scrollToTab:function(E, A)
    {
        if (!E) {
            return
        }
        var C = this.getTabEl(E);
        var G = this.getScrollPos(),D = this.getScrollArea();
        var F = Ext.fly(C).getOffsetsTo(this.stripWrap)[0] + G;
        var B = F + C.offsetWidth;
        if (F < G) {
            this.scrollTo(F, A)
        }
        else
        {
            if (B > (G + D)) {
                this.scrollTo(B - D, A)
            }
        }
    },scrollTo:function(B, A)
    {
        this.stripWrap.scrollTo("left", B, A ? this.getScrollAnim() : false);
        if (!A) {
            this.updateScrollButtons()
        }
    },onWheel:function(D)
    {
        var E = D.getWheelDelta() * this.wheelIncrement * -1;
        D.stopEvent();
        var F = this.getScrollPos();
        var C = F + E;
        var A = this.getScrollWidth() - this.getScrollArea();
        var B = Math.max(0, Math.min(A, C));
        if (B != F) {
            this.scrollTo(B, false)
        }
    },onScrollRight:function()
    {
        var A = this.getScrollWidth() - this.getScrollArea();
        var C = this.getScrollPos();
        var B = Math.min(A, C + this.getScrollIncrement());
        if (B != C) {
            this.scrollTo(B, this.animScroll)
        }
    },onScrollLeft:function()
    {
        var B = this.getScrollPos();
        var A = Math.max(0, B - this.getScrollIncrement());
        if (A != B) {
            this.scrollTo(A, this.animScroll)
        }
    },updateScrollButtons:function()
    {
        var A = this.getScrollPos();
        this.scrollLeft[A == 0 ? "addClass" : "removeClass"]("x-tab-scroller-left-disabled");
        this.scrollRight[A >= (this.getScrollWidth() - this.getScrollArea()) ? "addClass" : "removeClass"]("x-tab-scroller-right-disabled")
    }});
Ext.reg("tabpanel", Ext.TabPanel);
Ext.TabPanel.prototype.activate = Ext.TabPanel.prototype.setActiveTab;
Ext.TabPanel.AccessStack = function()
{
    var A = [];
    return{add:function(B)
    {
        A.push(B);
        if (A.length > 10) {
            A.shift()
        }
    },remove:function(E)
    {
        var D = [];
        for (var C = 0,B = A.length; C < B; C++) {
            if (A[C] != E) {
                D.push(A[C])
            }
        }
        A = D
    },next:function()
    {
        return A.pop()
    }}
};