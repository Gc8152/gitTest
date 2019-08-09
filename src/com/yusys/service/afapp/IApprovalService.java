package com.yusys.service.afapp;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface IApprovalService {
	//查询审批列表
	public Map<String,Object> queryApprovalList(HttpServletRequest req);
	//修改流程实例审批人员
	public Map<String,Object> updateApprPerson(HttpServletRequest req);
}
