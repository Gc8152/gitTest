package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.afapp.IApprovalService;

@Controller
@RequestMapping("/OperateApproval")
public class AFApprListController extends BaseController{
	@Resource
	private IApprovalService iApprovalService;
	
	//跳转审批列表页面
	@RequestMapping("/viewApprList")
	public String toApprovalPage(HttpServletRequest req){
		return "approvalflow/appr/approval-list";
	}
	//查询审批流列表信息
	@RequestMapping("/queryApprovalList")
	public void queryApprovalList(HttpServletRequest req,HttpServletResponse res) {
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iApprovalService.queryApprovalList(req)));
	}
	//跳转审批人员详情页面
	@RequestMapping("/toApprovalDetail")
	public String toApprovalDetail(HttpServletRequest req,HttpServletResponse res,
			String p_id,String n_id,String app_person) {
		req.setAttribute("p_id", p_id);
		req.setAttribute("n_id", n_id);
		req.setAttribute("app_person", app_person);
		return "approvalflow/appr/approval-detail";
	}
	//查询审批人员详情信息
	@RequestMapping("/viewApprovalDetail")
	public void viewApprovalDetail(HttpServletRequest req,HttpServletResponse res) {
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iApprovalService.queryApprovalList(req)));
	}
	//修改流程实例审批人员
	@RequestMapping("/updateApprPerson")
	public void updateApprPerson(HttpServletRequest req,HttpServletResponse res) {
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iApprovalService.updateApprPerson(req)));
	}
}
