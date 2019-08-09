package com.yusys.service.QApprovalService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface IQApprovalService {
	//查询审批记录
	public Map<String,Object> queryApprovalList(HttpServletRequest req);
	//查询流程实例详情页面
	public Map<String,Object> queryProcessDetail(HttpServletRequest req);
	//修改审批人
	public Map<String,String> updateAppPerson(HttpServletRequest req,String user_id);
}
