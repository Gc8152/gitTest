package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface QApprovalDao {
	//查询审批记录
	public List<Map<String,Object>> queryApprovalList(Map<String,Object> map);
	//根据流程实例ID查询流程详情
	public List<Map<String, String>> queryProcessDetail(Map<String, String> pmap);
}
