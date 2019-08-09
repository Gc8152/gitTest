package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.QApprovalService.IQApprovalService;
import com.yusys.service.afapp.IAFAppBizBaseService;

@Controller
@RequestMapping("/QApproval")
public class QApprovalController extends BaseController{
	@Resource
	private IQApprovalService iQApprovalService;
	
	//查询审批流列表信息
	@RequestMapping("/queryApprovalList")
	public void queryApprovalList(HttpServletRequest req,HttpServletResponse res) {
		try {
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,iQApprovalService.queryApprovalList(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	
	//查看流程审批记录
	@RequestMapping("/queryProcessDetail")
	public void queryProcessDetail(HttpServletRequest req,HttpServletResponse res){
		try {
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,iQApprovalService.queryProcessDetail(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	//修改审批人
	@RequestMapping("/updateAppPerson")
	public void updateAppPerson(HttpServletRequest req,HttpServletResponse res){
		try {
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iQApprovalService.updateAppPerson(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
