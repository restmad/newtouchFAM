Ext.namespace("bcm.basedata.Index");

bcm.basedata.Index.IndexColumnTreePanel = Ext.extend(Ext.tree.ColumnTree,
{
	screenWidth : screen.width,
	layout : "fit",
	autoWidth : true,
	autoScroll : true,
	rootVisible : true,
	m_CurrentCode : "",
	m_DetailPolicyLevel : 1,
	m_IndexEditWin : null,
	initComponent : function()
	{
		this.getCurrentCode();

		this.getDetailPolicyLevel();

		this.root = new Ext.tree.AsyncTreeNode(
		{
			id : "root",
			text : "预算项目",
			level : 0,
			ctType : ""
		});

		if (this.m_DetailPolicyLevel == 0)
		{
			this.loader = new Ext.tree.TreeLoader(
			{
				dataUrl : "bcm/index/tree",
				uiProviders :
				{
					"col" : Ext.tree.ColumnNodeUI
				},
				xy_ColumnTree : true
			});
		}
		else
		{
			this.loader = new Ext.tree.TreeLoader(
			{
				dataUrl : "bcm/index/tree",
				uiProviders :
				{
					"col" : Ext.tree.ColumnNodeUI
				},
				xy_ColumnTree : true
			});
		}

		this.columns = [
		{
			header : "名称",
			width : 300,
			dataIndex : "text"
		},
		{
			header : "编码",
			width : 100,
			dataIndex : "indexCode"
		},
		{
			header : "级别",
			width : 50,
			dataIndex : "level"
		},
		{
			header : "末级",
			width : 50,
			dataIndex : "isLeaf",
			renderer : ssc.common.RenderUtil.YesOrNo_FocusYes
		},
		{
			header : "类型",
			width : 80,
			dataIndex : "indexTypeName"
		},
		{
			header : "启用",
			width : 50,
			dataIndex : "status",
			renderer : ssc.common.RenderUtil.EnableStatus_Color
		},
		{
			header : "所属方案",
			width : 100,
			dataIndex : "caseName"
		} ];

		if (this.m_DetailPolicyLevel == 0)
		{
			this.columns.push(
			{
				header : "控制方式",
				dataIndex : "ctrlType",
				width : 60,
				renderer : bcm.render.CtrlType,
				align : "center",
				sortable : true
			},
			{
				header : "控制周期",
				dataIndex : "ctrlPeriod",
				width : 60,
				renderer : bcm.render.CtrlPeriod,
				align : "center",
				sortable : true
			},
			{
				header : "控制属性",
				dataIndex : "ctrlAttr",
				width : 60,
				renderer : bcm.render.CtrlAttr,
				align : "center",
				sortable : true
			},
			{
				header : "告警率",
				dataIndex : "warnPercent",
				width : 60,
				renderer : ssc.common.RenderUtil.Percent100,
				align : "center",
				sortable : true
			},
			{
				header : "容差率",
				dataIndex : "alwPercent",
				width : 60,
				renderer : ssc.common.RenderUtil.Percent100,
				align : "center",
				sortable : true
			},
			{
				header : "明细率",
				dataIndex : "detailPercent",
				width : 60,
				renderer : ssc.common.RenderUtil.Percent100,
				align : "center",
				sortable : true
			});
		}

		this.cmbCase = new bcm.component.CaseListComboBox(
		{
			xy_InitLoadData : true,
			xy_InitDataID : this.m_CurrentCode,
			xy_ParentObjHandle : this,
			xy_SelectEvent : this.onComboboxCaseSelect
		});
		this.btnAddIndex = new Ext.Toolbar.Button(
		{
			text : "新增",
			iconCls : "xy-add",
			scope : this,
			disabled : false,
			handler : this.btn_AddIndexEvent
		});
		this.btnUpdateIndex = new Ext.Toolbar.Button(
		{
			text : "修改",
			iconCls : "xy-edit",
			scope : this,
			disabled : true,
			handler : this.btn_UpdateIndexEvent
		});
		this.btnDeleteIndex = new Ext.Toolbar.Button(
		{
			text : "删除",
			iconCls : "xy-delete",
			scope : this,
			disabled : true,
			handler : this.btn_DeleteIndexEvent
		});

		this.tbar = [ this.cmbCase, "-",
		              this.btnAddIndex, "-",
		              this.btnUpdateIndex, "-",
		              this.btnDeleteIndex ];

		if (this.m_DetailPolicyLevel == 0)
		{
			this.tbar.push("-",
			{
				text : "调整控制策略属性",
				iconCls : "xy-opions",
				handler : this.btn_UpdatePropertyEvent,
				scope : this
			});
		}

		bcm.basedata.Index.IndexColumnTreePanel.superclass.initComponent.call(this);

		this.loader.baseParams.currentCaseCode = this.m_CurrentCode;
		this.loader.baseParams.jsonCondition = Ext.encode(
		{
			casecode : this.m_CurrentCode
		});

		this.on("click", this.onTreeClickEvent);

		this.root.expand();
	},
	getCurrentCode : function()
	{
		Ext.Ajax.request(
		{
			url : "bcm/case/getcurrentcasecode",
			method : "post",
			sync : true,
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);

				if (data.success)
				{
					this.m_CurrentCode = data.data;
				}
				else
				{
					MsgUtil.alert(data.msg);
					return;
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	},
	getDetailPolicyLevel : function()
	{
		Ext.Ajax.request(
		{
			url : "bcm/globalparam/getdetailpolicylevel",
			method : "post",
			sync : true,
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);

				if (data.success)
				{
					this.m_DetailPolicyLevel = data.data;
				}
				else
				{
					MsgUtil.alert(data.msg);
					return;
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	},
	onLoaderBeforeLoad : function(treeLoader, node)
	{
		treeLoader.baseParams.level  = node.attributes.level;
		treeLoader.baseParams.ctType = node.attributes.ctType;
	},
	onComboboxCaseSelect : function()
	{
		this.loader.baseParams.currentCaseCode = this.cmbCase.getKeyValue();
		this.loader.baseParams.jsonCondition = Ext.encode(
		{
			casecode : this.cmbCase.getKeyValue()
		});
		this.loader.on("beforeload", this.onLoaderBeforeLoad, this);

		this.loader.load(this.root, function()
		{
			this.root.expand();
		}.createDelegate(this));
	},
	getSelected : function()
	{
		var chooseNode = this.getSelectionModel().getSelectedNode();
		if (chooseNode == null)
		{
			MsgUtil.alert("提示", "请先选择一条数据");
			return null;
		}
		return chooseNode;
	},
	btn_AddIndexEvent : function()
	{
		var node = this.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择一个节点作为上级！");
			return;
		}
		var entity =
		{
			caseCode : this.cmbCase.getKeyValue(),
			parentID : node.attributes.indexID,
			parentCode : node.attributes.indexCode,
			parentName : node.attributes.indexName
		};
		if (node.id == "root")
		{
			entity.parentID = "";
			entity.parentCode = "";
			entity.parentName = "";
		}

		this.m_IndexEditWin = new bcm.basedata.Index.IndexEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.rootReloader.createDelegate(this),
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Add
		});
		this.m_IndexEditWin.show();
	},
	btn_UpdateIndexEvent : function()
	{
		var node = this.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要修改的预算项目！");
			return;
		}
		if (node.id == "root")
		{
			MsgUtil.alert("不能修改根节点！");
			return;
		}
		var entity = {};
		Ext.apply(entity, node.attributes);
		entity.loader = undefined;
		entity.__proto__ = undefined;

		this.m_IndexEditWin = new bcm.basedata.Index.IndexEditWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.rootReloader.createDelegate(this),
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_IndexEditWin.show();
	},
	btn_DeleteIndexEvent : function()
	{
		var node = this.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要删除的预算项目");
			return;
		}

		if (node.id == "root")
		{
			MsgUtil.alert("不能删除根节点");
			return;
		}
		if (node.childNodes.length > 0
				|| node.leaf == 0
				|| node.leaf == false)
		{
			MsgUtil.alert("还有下级预算项目，不能删除");
			return;
		}
		var entity = {};
		Ext.apply(entity, node.attributes);
		entity.loader = undefined;
		entity.__proto__ = undefined;

		var msg = "如果预算项目已发生过业务数据，则不能删除<br>";
		msg += "是否删除所选的预算项目" + entity.text + "?";
		MsgUtil.confirm(msg, function(btn, text)
		{
			if (btn == "yes")
			{
				this.deleteIndex(entity);
			}
		}, this);
	},
	deleteIndex : function(entity)
	{
		Ext.Ajax.request(
		{
			url : "bcm/index/delete",
			method : "post",
			params :
			{
				jsonString : Ext.encode(entity)
			},
			success : function(response, options)
			{
				var data = Ext.decode(response.responseText);
				if (data.success)
				{
					this.rootReloader();
				}
				else
				{
					MsgUtil.alert(data.msg);
				}
			},
			failure : ssc.common.ExceptionUtil.AjaxRequestFailureEvent,
			scope : this
		});
	},
	btn_UpdatePropertyEvent : function()
	{
		var node = this.getSelectionModel().getSelectedNode();
		if (null == node)
		{
			MsgUtil.alert("请先选择需要修改的预算项目！");
			return;
		}
		if (node.id == "root")
		{
			MsgUtil.alert("不能修改根节点！");
			return;
		}
		var entity = {};
		Ext.apply(entity, node.attributes);
		entity.loader = undefined;
		entity.__proto__ = undefined;

		this.m_IndexPropertyWin = new bcm.basedata.Index.IndexPropertyWin(
		{
			xy_ParentObjHandle : this,
			xy_OKClickEvent : this.rootReloader.createDelegate(this),
			xy_Entity : entity,
			xy_EditMode : ssc.component.DialogEditModeEnum.Update
		});
		this.m_IndexPropertyWin.show();
	},
	onTreeClickEvent :  function(node)
	{
		if(node == null)
		{
			this.btnUpdateIndex.disable();
			this.btnDeleteIndex.disable();
		}
		else if(node.id == "root" && node.attributes.level == "0")
		{
			this.btnUpdateIndex.disable();
			this.btnDeleteIndex.disable();
		}
		else
		{
			this.btnUpdateIndex.enable();
			this.btnDeleteIndex.enable();
		}
	},
	rootReloader : function()
	{
		this.root.reload();
	}
});
Ext.reg("bcm_core_basedata_index_indexcolumntreepanel", bcm.basedata.Index.IndexColumnTreePanel);

function init()
{
	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [
		{
			id : "bcm_core_basedata_index_indexcolumntreepanel",
			xtype : "bcm_core_basedata_index_indexcolumntreepanel"
		} ]
	});
}
Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);