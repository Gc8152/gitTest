package com.yusys.service.nodeconfig;

import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public interface ISWorkFlowNodeService {
	//查询流程下所有节点
	public Map<String,Object> queryAllNodeAF(HttpServletRequest req);
	//根据ID查找节点
	public Map<String, Object> queryOneNodeById(HttpServletRequest req);
	//插入一个节点
	public Map<String,String> addNodeInfo(HttpServletRequest req,String userid);
	//更新节点
	public Map<String,String> updateNodeInfo(HttpServletRequest req,String userid);
	//根据选择的id删除该节点
	public Map<String,String> deleteNodeInfo(HttpServletRequest req);
	//根据条件查找节点
	public Map<String,String> queryOneNodeInfo(HttpServletRequest req);
	//根据流程ID查询所属业务系统下的节点要素
	public Map<String,Object> queryNodeFactorById(HttpServletRequest req);
}
