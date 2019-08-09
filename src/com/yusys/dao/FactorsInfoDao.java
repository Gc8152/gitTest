package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface FactorsInfoDao {
	//查询业务要素表所有信息
	public List<Map<String,Object>> queryAllFactorsInfo(Map<String,Object> map);
	//向业务要素表中插入一条信息
	public int addOneFactorsInfo(Map<String,Object> map);
	//向业务要素表中删除一条信息
	public int deleteOneFactorsInfo(Map<String,Object> map);
	//修改一条业务要素表信息
	public int updateOneFactorsInfo(Map<String,Object> map);
	//根据业务系统编号查询其所有流程
	public List<Map<String, Object>> queryAllAFByCode(Map<String, Object> mp);
	//根据流程ID及要素编号变更节点基本信息表中的节点值
	public int updateNOfValueByCode(Map<String, Object> ump);
	//查询要素变更待更新的所有节点信息
	public List<Map<String, Object>> queryAllWaitUpdNode(Map<String, Object> mp);
	//批量修改要素变更时所有的节点信息
	public void batchUpdateNOfValue(List<Map<String, Object>> mps);
}
