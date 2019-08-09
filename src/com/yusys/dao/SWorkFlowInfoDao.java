package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface SWorkFlowInfoDao {
	//查询所有流程信息
	public List<Map<String,Object>> queryAllProcessInfo(Map<String,Object> map);
	//向流程表中插入一条数据
	public int addOneProcessInfo(Map<String,Object> map);
	//根据选择的id删除流程表中该信息
	public void deleteOneProcessInfo(Map<String,String> map);
	//根据规则ID删除矩阵下所有路由节点和审批规则
	public void deleteMatrixRoteById(Map<String,String> map);
	//修改一条流程记录
	public int updateOneProcessInfo(Map<String,String> map);
	//通过流程id,或加矩阵id,查询流程矩阵信息 
	public List<Map<String,Object>> queryMatrixById(Map<String,Object> map);
	//通过规则id查询规则表中对应信息
	public Map<String,String> queryOneRuleById(Map<String,Object> map);
	//向规则表中插入一条数据
	public void addOneRuleInfo(Map<String,String> map);
	//向矩阵表中插入一条数据
	public void addOneMatrixInfo(Map<String,String> map);
	//根据id删除矩阵表中的记录信息
	public void deleteOneMatInfo(Map<String,String> map);
	//根据规则id删除规则表中的记录信息
	public void deleteOneRuleInfo(Map<String,String> map);
	//修改规则表中一条数据
	public int updateOneRuleInfo(Map<String,String> map);
	//修改矩阵表中所有对应的数据-
	public void updateAllMatInfo(Map<String,String> map);
	//向审批流程表中插入一条记录
	public void addApproveRuleInfo(Map<String,Object> map);
	//根据id查找矩阵下的审批路由信息
	public List<Map<String,Object>> queryMatixRoteById(Map<String,Object> map);
	//根据流程id删除节点表中该信息
	public void deleteNoteInfoByWfId(Map<String,String> map);
	//根据流程id删除矩阵表中该信息
	public void deleteMatrixInfoByWfId(Map<String,String> map);
	//根据矩阵ID删除审批流程表对应信息
	public void deleteProcessByMId(Map<String,String> map);
	//根据流程ID修改流程状态
	public int updateProcessSateById(Map<String,String> map);
	//根据矩阵ID修改矩阵状态
	public void updateMatrixSateById(Map<String,String> map);
	
	/**
	 * 查询 流程矩阵 节点 信息 
	 * @param map
	 * @return
	 */
	public List<Map<String,String>> queryMatrixNodeInfos(Map<String,Object> map);
	/**
	 * 根据ID删除 审批 流程数据 
	 * @param p_id
	 */
	public void deleteMatrixRoteByPId(String p_id);
	
	//根据id查找矩阵下的审批路由信息
	public List<Map<String,String>> queryMatixRoteByMId(Map<String,String> map);
	
	/**
	 * 查询 流程矩阵 节点ID 
	 * @param map
	 * @return
	 */
	public List<String> queryMProcessNodeIds(Map<String,String> map);
	/**
	 * 修改流程状态
	 * @param map
	 */
	public void updateMatrixProcessState(Map<String,String> map);
	/**
	 * 根据P_ID&N_ID查询ORDER_ID
	 * @param pmap
	 * @return
	 */
	public Map<String, String> getProNodeOrderId(Map<String, Object> pmap);
}
