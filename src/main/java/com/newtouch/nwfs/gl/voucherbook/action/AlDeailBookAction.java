package com.newtouch.nwfs.gl.voucherbook.action;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.xml.rpc.holders.IntHolder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.newtouch.cloud.common.entity.ActionResult;
import com.newtouch.cloud.common.entity.ConditionMap;
import com.newtouch.cloud.common.entity.EntityMap;
import com.newtouch.cloud.common.entity.PageData;
import com.newtouch.cloud.common.jasperreports.JRClassicBaseAction;
import com.newtouch.cloud.common.jasperreports.model.wrapper.JasperReportsClassicModelWrapper;
import com.newtouch.nwfs.gl.voucherbook.bp.AlDetailBookBP;

@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
@RequestMapping("/voucherbook/aldetailbook")
public class AlDeailBookAction extends JRClassicBaseAction
{
	
	@Autowired
	private AlDetailBookBP bp;
	
	/**
	 * 获取会计期
	 * @return
	 */
	@RequestMapping("/getPeriod")
	@ResponseBody
	public Object getCurrentPeriodInfo(@RequestParam(required=false, defaultValue="{}") String jsonCondition)
	{
		ActionResult result = new ActionResult();
		try
		{
			ConditionMap cdtMap = new ConditionMap(jsonCondition);
			Object[] period = this.bp.getCurrentPeriodInfo(cdtMap);
			if (period!=null)
			{
				result.put("success", true);
				result.put("uqglobalperiodid", period[0] == ""? "" : period[0].toString());
				result.put("varname", period[1] == ""? "" : period[1].toString());
				result.put("intyearmonth", period[2] == ""? "" : period[2].toString());
				result.put("dtbegin", period[3] == ""? "" : period[3].toString());
				result.put("dtend", period[4] == ""? "" : period[4].toString());
			}
			
		}
		catch (Exception e) 
    	{
			result.put("success", false);
			result.put("msg", e.getMessage());
		}
		return result;
	}

	@Override
	protected List<?> fillReportData(JasperReportsClassicModelWrapper jrModel,
			HttpServletRequest request, ConditionMap cdtMap, String format,
			String fileName, IntHolder intTotalCount) throws Exception 
	{
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		jrModel.setFileName(fileName + df.format(new Date()) + "." + format);
		//设置表头的值
		jrModel.setAttribute("accountname", cdtMap.get("accountname"));
		jrModel.setAttribute("startperiod", cdtMap.get("startperiod"));
		jrModel.setAttribute("endperiod", cdtMap.get("endperiod"));
		jrModel.setAttribute("disledgerlevel", cdtMap.get("disledgerlevel"));

		PageData<EntityMap> page = this.bp.getReportData(cdtMap);
		intTotalCount.value = page.getTotal();
		return page.getData();
	}
	
	@RequestMapping("/getTableName")
	@ResponseBody
	public Object getTableName(@RequestParam(required=false, defaultValue="{}") String jsonCondition)
	{
		ActionResult result = new ActionResult();
		ConditionMap cdtMap = null ;
		cdtMap  = new ConditionMap(jsonCondition);
		try 
		{
			String tablename = this.bp.getTableName(cdtMap);
			result.setSuccess(true);
			result.put("tablename", tablename);
		}
		catch (Exception e) 
		{
			result.setSuccess(false);
			result.setMsg(e.getMessage());
		}
		return result;
	}
	
}
