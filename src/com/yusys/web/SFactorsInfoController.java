package com.yusys.web;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.factorsconfig.ISFactorsInfoService;

@Controller
@RequestMapping("/AFFact")
public class SFactorsInfoController extends BaseController{

	@Resource
	private ISFactorsInfoService  iSFactorsInfoService;
	
	//业务要素配置首页
	@RequestMapping("/toFactList")
	public String toAFList(){
		return "approvalflow/sbscfig/sbscfig-querylist";
	}
	//查询所有业务要素信息
	@RequestMapping("/queryAllFactorsInfo")
	public void queryallempinfo(HttpServletRequest req,HttpServletResponse res)	{
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,iSFactorsInfoService.queryAllFactorsInfo(req)));
	}
	//指向业务要素新增页面
	@RequestMapping("/toFactAddPage")
	public String toFactAddPage(){
		return "approvalflow/sbscfig/sbscfig-addelement";
	}
	//向业务要素表中插入一条信息
	@RequestMapping("/addOneFactInfo")
	public void addOneFactInfo(HttpServletRequest req,HttpServletResponse res)	{
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSFactorsInfoService.addOneFactorsInfo(req,getUserId(req))));
	}
	//根据选择的id删除要素表中该信息 
	@RequestMapping("/deleteOneFactorsInfo")
	public void deleteOneFactorsInfo(HttpServletRequest req,HttpServletResponse res)	{
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSFactorsInfoService.deleteOneFactorsInfo(req)));
	}
	//指向业务要素修改页面
	@RequestMapping("/toFactUpdatePage")
	public String toFactUpdatePage(HttpServletRequest req,String operate,String b_code,String system_code){
		req.setAttribute("operate", operate);
		req.setAttribute("b_code", b_code);
		req.setAttribute("system_code", system_code);
		return "approvalflow/sbscfig/sbscfig-addelement";
	}
	//修改一条业务要素表信息
	@RequestMapping("/updateOneFactorsInfo")
	public void updateOneFactorsInfo(HttpServletRequest req,HttpServletResponse res)	{
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSFactorsInfoService.updateOneFactorsInfos(req,getUserId(req))));
	}
	//指向业务要素查看页面
	@RequestMapping("/toViewCheckPage")
	public String toViewCheckPage(HttpServletRequest req,String b_code,String system_code){
		req.setAttribute("b_code", b_code);
		req.setAttribute("system_code", system_code);
		return "approvalflow/sbscfig/sbscfig-checkelement";
	}
}
