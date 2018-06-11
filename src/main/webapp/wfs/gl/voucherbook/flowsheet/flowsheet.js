Ext.namespace("gl.voucherbook.flowsheet");

gl.voucherbook.flowsheet.QueryFormPanel = Ext.extend(Ext.FormPanel, 
{
	frame : true,
	labelWidth : 100,
	labelAlign : "right",
	width : 500,
	height : 300,
	xy_MainPanel : null,
	initComponent : function() 
	{
		//定义会计期组件
		this.comPeriod = new Ext.app.XyComboBoxCom(
    	{
    		id : 'comPeriod',
    		anchor : '95%',
    		labelStyle : 'text-align:right;',
    		fieldLabel : '会计期',
    		XyAllowDelete : false,
    		rootTitle :'',
		    fields : ["column0", "column1", "column2", "column3"],
            displayField : "column3",
            othervalue : "column0",
            valueField : "column1",
            scriptPath : 'wfs',
            sqlFile : 'selectperiodall'

    	});
		
    	//定义items
    	this.items = [this.comPeriod];
    	
    	gl.voucherbook.flowsheet.QueryFormPanel.superclass.initComponent.call(this);
    	
    	this.getPeriod();
    	
	},
	
	getPeriod : function()
	{
		var obj = {"flag":"1"};
		Ext.Ajax.request(
		{		  
			url : "voucherbook/aldetailbook/getPeriod", 
			params :
			{	
				jsonCondition : Ext.encode(obj)
          	},
			success : function(response)
			{
				var r = Ext.decode(response.responseText);
				if (r.success) 
				{
					var data = 
	    			{
						column0 : r.uqglobalperiodid,
						column1 : r.intyearmonth,
						column2 : r.dtend,
	    				column3 : r.varname,
	    				column4 : r.dtbegin,
	    				column5 : r.dtend
	    			}
					Ext.getCmp("comPeriod").hiddenData = data;
					Ext.getCmp("comPeriod").setXyValue(data);
				}
			}
		});
		
	},
	
	query : function() 
	{	
		//获取开始会计期年月
		var comperiod = this.comPeriod.getXyValue();
		var periodid = this.comPeriod.getOtherValue();
		
		//获取开始会计期年月组件显示的值
		var comperioddisplay = this.comPeriod.getDisplayValue();
		
		
		if(comperiod==null||comperiod==undefined||comperiod=="")
		{
			Ext.Msg.alert("提示", "请选择会计期");
			return false;
		};

		var params = 
		{ 
			comperiod: comperiod,
			comperioddisplay : comperioddisplay,
			periodid : periodid
		};
		
		this.xy_MainPanel.QueryEvent.call(this.xy_MainPanel,
		{
			/**
			 * 报表jasper文件路径(非url)，从webapp/webRoot目录算起
			 */
			jasper : "/wfs/gl/voucherbook/flowsheet/flowsheet.jasper",
			/**
			 * (导出)报表jasper文件路径(非url)，从webapp/webRoot目录算起
			 */
			jasper_export : "/wfs/gl/voucherbook/flowsheet/flowsheet_export.jasper",
			/**
			 * 报表标题，必填
			 */
			title : "现金流量表",
			/**
			 * 导出/下载默认文件名
			 */
			fileName : "现金流量表",
			/**
			 * 报表查询参数
			 */
			jsonCondition : Ext.encode(params)
		},
		/**
		 * 报表查询url，与Action的@RequestMapping保持一致
		 */
		"/voucherbook/flowsheet");
	}
});

function init() {
	var pnlMain = new ssc.component.JRReportMainPanel(
	{
		xy_QueryPanel : gl.voucherbook.flowsheet.QueryFormPanel,
		xy_QueryWindowWidth : 330,
		xy_QueryWindowHeight : 110
	});

	var m_view = new Ext.Viewport(
	{
		layout : "fit",
		items : [pnlMain]
	});
	
};

Ext.BLANK_IMAGE_URL = "resources/images/s.gif";
Ext.onReady(init);