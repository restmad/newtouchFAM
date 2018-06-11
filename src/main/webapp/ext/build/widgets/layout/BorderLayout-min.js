/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.layout.BorderLayout=Ext.extend(Ext.layout.ContainerLayout,{monitorResize:true,rendered:false,onLayout:function(B,X){var C;if(!this.rendered){X.position();X.addClass("x-border-layout-ct");var M=B.items.items;C=[];for(var Q=0,R=M.length;Q<R;Q++){var U=M[Q];var F=U.region;if(U.collapsed){C.push(U)}U.collapsed=false;if(!U.rendered){U.cls=U.cls?U.cls+" x-border-panel":"x-border-panel";U.render(X,Q)}this[F]=F!="center"&&U.split?new Ext.layout.BorderLayout.SplitRegion(this,U.initialConfig,F):new Ext.layout.BorderLayout.Region(this,U.initialConfig,F);this[F].render(X,U)}this.rendered=true}var L=X.getViewSize();if(L.width<20||L.height<20){if(C){this.restoreCollapsed=C}return }else{if(this.restoreCollapsed){C=this.restoreCollapsed;delete this.restoreCollapsed}}var J=L.width,S=L.height;var I=J,P=S,G=0,H=0;var N=this.north,K=this.south,E=this.west,T=this.east,U=this.center;if(!U){throw"No center region defined in BorderLayout "+B.id}if(N&&N.isVisible()){var W=N.getSize();var O=N.getMargins();W.width=J-(O.left+O.right);W.x=O.left;W.y=O.top;G=W.height+W.y+O.bottom;P-=G;N.applyLayout(W)}if(K&&K.isVisible()){var W=K.getSize();var O=K.getMargins();W.width=J-(O.left+O.right);W.x=O.left;var V=(W.height+O.top+O.bottom);W.y=S-V+O.top;P-=V;K.applyLayout(W)}if(E&&E.isVisible()){var W=E.getSize();var O=E.getMargins();W.height=P-(O.top+O.bottom);W.x=O.left;W.y=G+O.top;var A=(W.width+O.left+O.right);H+=A;I-=A;E.applyLayout(W)}if(T&&T.isVisible()){var W=T.getSize();var O=T.getMargins();W.height=P-(O.top+O.bottom);var A=(W.width+O.left+O.right);W.x=J-A+O.left;W.y=G+O.top;I-=A;T.applyLayout(W)}var O=U.getMargins();var D={x:H+O.left,y:G+O.top,width:I-(O.left+O.right),height:P-(O.top+O.bottom)};U.applyLayout(D);if(C){for(var Q=0,R=C.length;Q<R;Q++){C[Q].collapse(false)}}if(Ext.isIE&&Ext.isStrict){X.repaint()}}});Ext.layout.BorderLayout.Region=function(B,A,C){Ext.apply(this,A);this.layout=B;this.position=C;this.state={};if(typeof this.margins=="string"){this.margins=this.layout.parseMargins(this.margins)}this.margins=Ext.applyIf(this.margins||{},this.defaultMargins);if(this.collapsible){if(typeof this.cmargins=="string"){this.cmargins=this.layout.parseMargins(this.cmargins)}if(this.collapseMode=="mini"&&!this.cmargins){this.cmargins={left:0,top:0,right:0,bottom:0}}else{this.cmargins=Ext.applyIf(this.cmargins||{},C=="north"||C=="south"?this.defaultNSCMargins:this.defaultEWCMargins)}}};Ext.layout.BorderLayout.Region.prototype={collapsible:false,split:false,floatable:true,minWidth:50,minHeight:50,defaultMargins:{left:0,top:0,right:0,bottom:0},defaultNSCMargins:{left:5,top:5,right:5,bottom:5},defaultEWCMargins:{left:5,top:0,right:5,bottom:0},isCollapsed:false,render:function(B,C){this.panel=C;C.el.enableDisplayMode();this.targetEl=B;this.el=C.el;var A=C.getState,D=this.position;C.getState=function(){return Ext.apply(A.call(C)||{},this.state)}.createDelegate(this);if(D!="center"){C.allowQueuedExpand=false;C.on({beforecollapse:this.beforeCollapse,collapse:this.onCollapse,beforeexpand:this.beforeExpand,expand:this.onExpand,hide:this.onHide,show:this.onShow,scope:this});if(this.collapsible){C.collapseEl="el";C.slideAnchor=this.getSlideAnchor()}if(C.tools&&C.tools.toggle){C.tools.toggle.addClass("x-tool-collapse-"+D);C.tools.toggle.addClassOnOver("x-tool-collapse-"+D+"-over")}}},getCollapsedEl:function(){if(!this.collapsedEl){if(!this.toolTemplate){var B=new Ext.Template("<div class=\"x-tool x-tool-{id}\">&#160;</div>");B.disableFormats=true;B.compile();Ext.layout.BorderLayout.Region.prototype.toolTemplate=B}this.collapsedEl=this.targetEl.createChild({cls:"x-layout-collapsed x-layout-collapsed-"+this.position,id:this.panel.id+"-xcollapsed"});this.collapsedEl.enableDisplayMode("block");if(this.collapseMode=="mini"){this.collapsedEl.addClass("x-layout-cmini-"+this.position);this.miniCollapsedEl=this.collapsedEl.createChild({cls:"x-layout-mini x-layout-mini-"+this.position,html:"&#160;"});this.miniCollapsedEl.addClassOnOver("x-layout-mini-over");this.collapsedEl.addClassOnOver("x-layout-collapsed-over");this.collapsedEl.on("click",this.onExpandClick,this,{stopEvent:true})}else{var A=this.toolTemplate.append(this.collapsedEl.dom,{id:"expand-"+this.position},true);A.addClassOnOver("x-tool-expand-"+this.position+"-over");A.on("click",this.onExpandClick,this,{stopEvent:true});if(this.floatable!==false){this.collapsedEl.addClassOnOver("x-layout-collapsed-over");this.collapsedEl.on("click",this.collapseClick,this)}}}return this.collapsedEl},onExpandClick:function(A){if(this.isSlid){this.afterSlideIn();this.panel.expand(false)}else{this.panel.expand()}},onCollapseClick:function(A){this.panel.collapse()},beforeCollapse:function(B,A){this.lastAnim=A;if(this.splitEl){this.splitEl.hide()}this.getCollapsedEl().show();this.panel.el.setStyle("z-index",100);this.isCollapsed=true;this.layout.layout()},onCollapse:function(A){this.panel.el.setStyle("z-index",1);if(this.lastAnim===false||this.panel.animCollapse===false){this.getCollapsedEl().dom.style.visibility="visible"}else{this.getCollapsedEl().slideIn(this.panel.slideAnchor,{duration:0.2})}this.state.collapsed=true;this.panel.saveState()},beforeExpand:function(A){var B=this.getCollapsedEl();this.el.show();if(this.position=="east"||this.position=="west"){this.panel.setSize(undefined,B.getHeight())}else{this.panel.setSize(B.getWidth(),undefined)}B.hide();B.dom.style.visibility="hidden";this.panel.el.setStyle("z-index",100)},onExpand:function(){this.isCollapsed=false;if(this.splitEl){this.splitEl.show()}this.layout.layout();this.panel.el.setStyle("z-index",1);this.state.collapsed=false;this.panel.saveState()},collapseClick:function(A){if(this.isSlid){A.stopPropagation();this.slideIn()}else{A.stopPropagation();this.slideOut()}},onHide:function(){if(this.isCollapsed){this.getCollapsedEl().hide()}else{if(this.splitEl){this.splitEl.hide()}}},onShow:function(){if(this.isCollapsed){this.getCollapsedEl().show()}else{if(this.splitEl){this.splitEl.show()}}},isVisible:function(){return !this.panel.hidden},getMargins:function(){return this.isCollapsed&&this.cmargins?this.cmargins:this.margins},getSize:function(){return this.isCollapsed?this.getCollapsedEl().getSize():this.panel.getSize()},setPanel:function(A){this.panel=A},getMinWidth:function(){return this.minWidth},getMinHeight:function(){return this.minHeight},applyLayoutCollapsed:function(A){var B=this.getCollapsedEl();B.setLeftTop(A.x,A.y);B.setSize(A.width,A.height)},applyLayout:function(A){if(this.isCollapsed){this.applyLayoutCollapsed(A)}else{this.panel.setPosition(A.x,A.y);this.panel.setSize(A.width,A.height)}},beforeSlide:function(){this.panel.beforeEffect()},afterSlide:function(){this.panel.afterEffect()},initAutoHide:function(){if(this.autoHide!==false){if(!this.autoHideHd){var A=new Ext.util.DelayedTask(this.slideIn,this);this.autoHideHd={"mouseout":function(B){if(!B.within(this.el,true)){A.delay(500)}},"mouseover":function(B){A.cancel()},scope:this}}this.el.on(this.autoHideHd)}},clearAutoHide:function(){if(this.autoHide!==false){this.el.un("mouseout",this.autoHideHd.mouseout);this.el.un("mouseover",this.autoHideHd.mouseover)}},clearMonitor:function(){Ext.getDoc().un("click",this.slideInIf,this)},slideOut:function(){if(this.isSlid||this.el.hasActiveFx()){return }this.isSlid=true;var A=this.panel.tools;if(A&&A.toggle){A.toggle.hide()}this.el.show();if(this.position=="east"||this.position=="west"){this.panel.setSize(undefined,this.collapsedEl.getHeight())}else{this.panel.setSize(this.collapsedEl.getWidth(),undefined)}this.restoreLT=[this.el.dom.style.left,this.el.dom.style.top];this.el.alignTo(this.collapsedEl,this.getCollapseAnchor());this.el.setStyle("z-index",102);if(this.animFloat!==false){this.beforeSlide();this.el.slideIn(this.getSlideAnchor(),{callback:function(){this.afterSlide();this.initAutoHide();Ext.getDoc().on("click",this.slideInIf,this)},scope:this,block:true})}else{this.initAutoHide();Ext.getDoc().on("click",this.slideInIf,this)}},afterSlideIn:function(){this.clearAutoHide();this.isSlid=false;this.clearMonitor();this.el.setStyle("z-index","");this.el.dom.style.left=this.restoreLT[0];this.el.dom.style.top=this.restoreLT[1];var A=this.panel.tools;if(A&&A.toggle){A.toggle.show()}},slideIn:function(A){if(!this.isSlid||this.el.hasActiveFx()){Ext.callback(A);return }this.isSlid=false;if(this.animFloat!==false){this.beforeSlide();this.el.slideOut(this.getSlideAnchor(),{callback:function(){this.el.hide();this.afterSlide();this.afterSlideIn();Ext.callback(A)},scope:this,block:true})}else{this.el.hide();this.afterSlideIn()}},slideInIf:function(A){if(!A.within(this.el)){this.slideIn()}},anchors:{"west":"left","east":"right","north":"top","south":"bottom"},sanchors:{"west":"l","east":"r","north":"t","south":"b"},canchors:{"west":"tl-tr","east":"tr-tl","north":"tl-bl","south":"bl-tl"},getAnchor:function(){return this.anchors[this.position]},getCollapseAnchor:function(){return this.canchors[this.position]},getSlideAnchor:function(){return this.sanchors[this.position]},getAlignAdj:function(){var A=this.cmargins;switch(this.position){case"west":return[0,0];break;case"east":return[0,0];break;case"north":return[0,0];break;case"south":return[0,0];break}},getExpandAdj:function(){var B=this.collapsedEl,A=this.cmargins;switch(this.position){case"west":return[-(A.right+B.getWidth()+A.left),0];break;case"east":return[A.right+B.getWidth()+A.left,0];break;case"north":return[0,-(A.top+A.bottom+B.getHeight())];break;case"south":return[0,A.top+A.bottom+B.getHeight()];break}}};Ext.layout.BorderLayout.SplitRegion=function(B,A,C){Ext.layout.BorderLayout.SplitRegion.superclass.constructor.call(this,B,A,C);this.applyLayout=this.applyFns[C]};Ext.extend(Ext.layout.BorderLayout.SplitRegion,Ext.layout.BorderLayout.Region,{splitTip:"Drag to resize.",collapsibleSplitTip:"Drag to resize. Double click to hide.",useSplitTips:false,splitSettings:{north:{orientation:Ext.SplitBar.VERTICAL,placement:Ext.SplitBar.TOP,maxFn:"getVMaxSize",minProp:"minHeight",maxProp:"maxHeight"},south:{orientation:Ext.SplitBar.VERTICAL,placement:Ext.SplitBar.BOTTOM,maxFn:"getVMaxSize",minProp:"minHeight",maxProp:"maxHeight"},east:{orientation:Ext.SplitBar.HORIZONTAL,placement:Ext.SplitBar.RIGHT,maxFn:"getHMaxSize",minProp:"minWidth",maxProp:"maxWidth"},west:{orientation:Ext.SplitBar.HORIZONTAL,placement:Ext.SplitBar.LEFT,maxFn:"getHMaxSize",minProp:"minWidth",maxProp:"maxWidth"}},applyFns:{west:function(C){if(this.isCollapsed){return this.applyLayoutCollapsed(C)}var D=this.splitEl.dom,B=D.style;this.panel.setPosition(C.x,C.y);var A=D.offsetWidth;B.left=(C.x+C.width-A)+"px";B.top=(C.y)+"px";B.height=Math.max(0,C.height)+"px";this.panel.setSize(C.width-A,C.height)},east:function(C){if(this.isCollapsed){return this.applyLayoutCollapsed(C)}var D=this.splitEl.dom,B=D.style;var A=D.offsetWidth;this.panel.setPosition(C.x+A,C.y);B.left=(C.x)+"px";B.top=(C.y)+"px";B.height=Math.max(0,C.height)+"px";this.panel.setSize(C.width-A,C.height)},north:function(C){if(this.isCollapsed){return this.applyLayoutCollapsed(C)}var D=this.splitEl.dom,B=D.style;var A=D.offsetHeight;this.panel.setPosition(C.x,C.y);B.left=(C.x)+"px";B.top=(C.y+C.height-A)+"px";B.width=Math.max(0,C.width)+"px";this.panel.setSize(C.width,C.height-A)},south:function(C){if(this.isCollapsed){return this.applyLayoutCollapsed(C)}var D=this.splitEl.dom,B=D.style;var A=D.offsetHeight;this.panel.setPosition(C.x,C.y+A);B.left=(C.x)+"px";B.top=(C.y)+"px";B.width=Math.max(0,C.width)+"px";this.panel.setSize(C.width,C.height-A)}},render:function(A,C){Ext.layout.BorderLayout.SplitRegion.superclass.render.call(this,A,C);var D=this.position;this.splitEl=A.createChild({cls:"x-layout-split x-layout-split-"+D,html:"&#160;",id:this.panel.id+"-xsplit"});if(this.collapseMode=="mini"){this.miniSplitEl=this.splitEl.createChild({cls:"x-layout-mini x-layout-mini-"+D,html:"&#160;"});this.miniSplitEl.addClassOnOver("x-layout-mini-over");this.miniSplitEl.on("click",this.onCollapseClick,this,{stopEvent:true})}var B=this.splitSettings[D];this.split=new Ext.SplitBar(this.splitEl.dom,C.el,B.orientation);this.split.placement=B.placement;this.split.getMaximumSize=this[B.maxFn].createDelegate(this);this.split.minSize=this.minSize||this[B.minProp];this.split.on("beforeapply",this.onSplitMove,this);this.split.useShim=this.useShim===true;this.maxSize=this.maxSize||this[B.maxProp];if(C.hidden){this.splitEl.hide()}if(this.useSplitTips){this.splitEl.dom.title=this.collapsible?this.collapsibleSplitTip:this.splitTip}if(this.collapsible){this.splitEl.on("dblclick",this.onCollapseClick,this)}},getSize:function(){if(this.isCollapsed){return this.collapsedEl.getSize()}var A=this.panel.getSize();if(this.position=="north"||this.position=="south"){A.height+=this.splitEl.dom.offsetHeight}else{A.width+=this.splitEl.dom.offsetWidth}return A},getHMaxSize:function(){var B=this.maxSize||10000;var A=this.layout.center;return Math.min(B,(this.el.getWidth()+A.el.getWidth())-A.getMinWidth())},getVMaxSize:function(){var B=this.maxSize||10000;var A=this.layout.center;return Math.min(B,(this.el.getHeight()+A.el.getHeight())-A.getMinHeight())},onSplitMove:function(B,A){var C=this.panel.getSize();this.lastSplitSize=A;if(this.position=="north"||this.position=="south"){this.panel.setSize(C.width,A);this.state.height=A}else{this.panel.setSize(A,C.height);this.state.width=A}this.layout.layout();this.panel.saveState();return false},getSplitBar:function(){return this.split}});Ext.Container.LAYOUTS["border"]=Ext.layout.BorderLayout;