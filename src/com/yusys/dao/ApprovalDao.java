package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface ApprovalDao {
	//查询审批流列表
	public List<Map<String,Object>> queryApprovalList(Map<String,Object> map);
	//修改流程实例节点审批人
	public int updateApprovalPerson(Map<String, String> stMap);
}
