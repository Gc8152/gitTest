package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface WorkFlowNodeDao {
	//查询流程下所有节点
	public List<Map<String,Object>> queryAllNodeAF(Map<String,Object> map);
	//根据条件查询对应的节点信息
	public List<Map<String,Object>> queryOneNodeInfo(Map<String,String> map);
	//插入一个节点
	public int addNodeInfo(Map<String,String> map);
	//更新一个节点信息
	public int updateNodeInfo(Map<String,Object> map);
	//根据选择的id删除该节点
	public int deleteNodeInfo(Map<String,String> map);	
	//根据流程ID查询所属业务系统下的节点要素
	public List<Map<String,Object>> queryNodeFactorById(Map<String,String> map);
}
