Ext.namespace('gl.component');

gl.component.xycheckedtree = Ext.extend(Ext.form.TwinTriggerField, 
{
    call : Ext.emptyFn,
    initComponent : function()
    {
    	gl.component.xycheckedtree.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e)
        {
            if (e.getKey() == e.ENTER)
            {
                this.onTrigger1Click();
            }
        }, this);
        if (this.XyAllowDelete === false)
        {
            this.triggerConfig = 
            {
                tag : "span",
                cls : "x-form-twin-triggers",
                cn : [{
                        tag : "img",
                        src : Ext.BLANK_IMAGE_URL,
                        cls : "x-form-trigger " + this.trigger1Class
                    }]
            };
        }
        else
        {
            this.triggerConfig = 
            {
                tag : "span",
                cls : "x-form-twin-triggers",
                cn : [
                    {
                        tag : "img",
                        src : Ext.BLANK_IMAGE_URL,
                        cls : "x-form-trigger " + this.trigger1Class
                    },
                    {
                        tag : "img",
                        src : Ext.BLANK_IMAGE_URL,
                        cls : "x-form-trigger " + this.trigger2Class
                    }
                ]
            };
        }
		this.on('render', function(f) 
				{
					this.onLoad();
				}, this);
		this.addListener("valuechange", this.call);
	},
	loaded : false,
	m_window : null,
	m_tree : null,
	validationEvent : false,
	validateOnBlur : false,
	trigger1Class : 'x-form-search-trigger',
	trigger2Class : 'x-form-clear-trigger',
	readOnly : true,
	leafSelect : true,
	rootTitle : '请选择',
	hiddenData : null,
	allExpand : false,
	dataUrl : null,
	param : null,
	winWidth : 300,
	winHeight : 400,
	scriptPath : null,
	sqlProcFile : "",
	firstSqlFile : null,
	otherSqlFile : null,
	XyCache : true,
	onLoad : function() 
	{
        if (this.hiddenData != null) 
        {
            this.setXyValue(this.hiddenData);
		}
	},
	loadException : function(This, node, response) 
	{
		showExtLoadException(This, node, response);
	},
	reload : function() 
	{
		this.loaded = false;
	},
	setValue : function(A) 
	{
		this.value = A;
		if (this.rendered) 
		{
			this.el.dom.value = (A === null || A === undefined || A == "" ? "" : A.text);
			this.validate()
		}
	},
	setXyValue : function(A)
	{
		if (A === undefined || A === null || A === "")
		{
			this.hiddenData = null;
			this.setValue("");
		}
		else
		{
			if (typeof A == "object") 
			{}
			else 
			{
				A = JSON.parse(A);
			}
			this.hiddenData = A;
			this.setValue(A);
		}
	},
	getXyValue : function() 
	{
		if (this.hiddenData != null && this.hiddenData["id"] != null)
		{
			return this.hiddenData["id"];
		}
		return "";
	},
	getDisplayValue : function() 
	{
		if (this.hiddenData != null
				&& this.hiddenData["text"] != null)
		{
			return this.hiddenData["text"];
		}
		return "";
	},
	onTrigger2Click : function() 
	{
		if (this.disabled) 
		{
			return;
		}
		var oldValue = this.hiddenData;
		this.setValue("");
		this.hiddenData = null;
		if (oldValue != null) 
		{
			this.fireEvent("valuechange", oldValue, null);
		}
	},
	onTrigger1Click : function() 
	{
		if (this.disabled) 
		{
			return;
		}
		if (this.m_window != null) 
		{
			if (this.loaded) 
			{
				this.m_window.show();
				return;
			}
			else 
			{
				this.m_tree.loader.load(this.m_tree.root);
				this.m_window.show();
				this.m_tree.root.expand(this.allExpand);
				this.loaded = true;
				return;
			}
		}
		var m_this = this;
		var root = new Ext.tree.AsyncTreeNode(
		{
			id : "root",
			text : this.rootTitle
		});

        var url = this.dataUrl;
        if (url == null || url == "")
        {
            url = "wf/XyCheckedTreeAction.action";// 为空的话调用默认action地址,否则调用用户传入的地址
        }

        var m_loader = new Ext.tree.TreeLoader(
        {
            dataUrl : url
        });
        m_loader.on("beforeload", function(treeLoader, node)
        {
            treeLoader.baseParams.scriptPath = m_this.scriptPath;
            if (m_this.sqlProcFile == '')
            {
                treeLoader.baseParams.firstSqlFile = m_this.firstSqlFile;
                treeLoader.baseParams.otherSqlFile = m_this.otherSqlFile;
            }
            else
            {
                treeLoader.baseParams.sqlProcFile = m_this.sqlProcFile;
            }
            if (m_this.param != null)
            {
                for (var i = 0; i < m_this.param.length; i++)
                {
                    treeLoader.baseParams[m_this.param[i].name] = m_this.param[i].value;
                }
            }
        });
        m_loader.on("loadexception", showExtLoadException);

        this.m_tree = new Ext.tree.TreePanel(
        {
            root : root,
            loader : m_loader,
            height : this.winHeight,
            animate : true,
            enableDD : false,
            border : false,
            rootVisible : true,
            autoScroll : true
        });

        this.m_window = new Ext.Window(
        {
            title : this.rootTitle,
            modal : true,
            width : this.winWidth,
            height : this.winHeight,
            autoScroll : true,
            closeAction : 'hide',
            resizable : false,
            layout : 'fit',
            items : [this.m_tree],
            buttons : [
                {
                    text : '确定',
                    handler : submitCall
                },
                {
                    text : '取消',
                    handler : closeCall
                }
            ]
        });
        this.m_window.show();
        root.expand();
        this.loaded = true;
        this.m_tree.on("dblclick", tree_dbclick);

        function submitCall()
        {
        	var newid = "";
        	var newtext = "";
        	//遍历所有节点
        	root.eachChild(function(child)
        	{
        		var ischecked = child.attributes.checked;
        		//如果是选中的则拼接newnode的id和text
        		if(ischecked)
    			{
        			newid += child.id + ",";
        			newtext += child.text + ",";
    			}
        	});
        	//去掉最后的“,”
        	if(newid.length > 0)
        	{
        		newid = newid.substring(0,newid.length-1);
        	}
        	if(newtext.length > 0)
        	{
        		newtext = newtext.substring(0,newtext.length-1);
        	}
        	
        	var newnode = new Ext.tree.AsyncTreeNode(
        	{
				id : newid,
				text : newtext
			});
        	
            var oldValue = m_this.hiddenData;
            m_this.hiddenData = newnode;
            var newValue = m_this.hiddenData;
            m_this.setValue(newnode);
            
            m_loader.un("loadexception", showExtLoadException);
            m_this.m_window.hide();
            if (oldValue == null || oldValue.id != newValue.id)
            {
                m_this.fireEvent("valuechange", oldValue, newValue);
            }
        }

        function closeCall()
        {
            m_loader.un("loadexception", showExtLoadException);
            m_this.m_window.hide();
        }

        function tree_dbclick(node)
        {
            if (node.id == 'root')
            {
                return;
            }
            var a = node.attributes.checked;
            if(a != undefined)
        	{
            	node.attributes.checked = !a;
        	}
        }
    }
});
Ext.reg("xycheckedtree", gl.component.xycheckedtree);