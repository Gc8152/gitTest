package com.yusys.service.afapp;

import java.util.List;
import java.util.Map;

public interface IAFAppBizBaseService {
	

	/**
	 * 发起流程
	 * @param lmap
	 * @return
	 * 支持批量发起流程
	 * lmap基本信息如下
	 * actor_no：当前发起人
	 * af_id：流程ID
	 * node：节点要素值
	 * route：路由要素值
	 */
	public Map<String,Object> launchAFProcess(List<Map<String,Object>> lmap);
	
	/**
	 * 单个流程
	 * 审批通过
	 * @param map
	 * @return
	 * map基本信息
	 * actor_no：当前审批人
	 * appr_state：审批结论
	 * appr_content：审批意见
	 * instance_id：流程实例ID
	 */
	public Map<String,Object> approvalPass(Map<String,Object> map);
	
	/**
	 * 批量审批通过
	 * @param map
	 * @return
	 * map基本信息
	 * actor_no：当前审批人
	 * instance_id：流程实例ID（以逗号隔开的字符串）
	 */
	public Map<String,Object> batchApprovalPass(Map<String,Object> map);
	
	/**
	 * 单个流程
	 * 审批拒绝
	 * @param map
	 * @return
	 * map基本信息
	 * actor_no：当前审批人
	 * appr_state：审批结论
	 * appr_content：审批意见
	 * instance_id：流程实例ID
	 */
	public Map<String,Object> approvalReject(Map<String,Object> map);
	
	/**
	 * 批量审批拒绝
	 * @param map
	 * @return
	 * map基本信息
	 * actor_no：当前审批人
	 * instance_id：流程实例ID（以逗号隔开的字符串）
	 */
	public Map<String,Object> batchApprovalReject(Map<String,Object> map);
	
	/**
	 * 单个流程
	 * 审批撤回
	 * @param map
	 * @return
	 * map基本信息
	 * actor_no：当前审批人
	 * appr_state：审批结论
	 * appr_content：审批意见
	 * instance_id：流程实例ID
	 */
	public Map<String,Object> approvalBack(Map<String,Object> map);
	/**
	 * 批量审批撤回
	 * @param map
	 * @return
	 * map基本信息
	 * actor_no：当前审批人
	 * instance_id：流程实例ID（以逗号隔开的字符串）
	 */
	public Map<String,Object> batchApprovalBack(Map<String,Object> map);
	
	/**
	 * 查询流程审批列表
	 * @param map
	 * @return
	 * map基本信息
	 * instance_id：流程实例ID
	 */
	public List<Map<String, String>> queryApprovalLists(Map<String,String> map);
	
	/**
	 * 查询流程历史审批记录
	 * @param map
	 * @return
	 * map基本信息
	 * instance_id：流程实例ID
	 */
	public List<Map<String, String>> queryHistoryApprRecord(Map<String,String> map);
	
	/**
	 * 查询下一节点审批人
	 * @param map
	 * @return
	 * map基本信息
	 * n_id：节点ID
	 * instance_id：流程实例ID
	 */
	public String getNextNodeApprPerson(Map<String,String> map);
	
	/**
	 * 仅当节点类型为：多人竞争
	 * 审批批准后查询当前无需再参与审批清单
	 * @param map
	 * @return
	 * map基本信息
	 * n_id：节点ID
	 * instance_id：流程实例ID
	 */
	public String getCurrToDelApprPerson(Map<String,String> map);
	
	/**
	 * 根据路由条件匹配流程矩阵
	 * @param matrixs 矩阵
	 * @param route 路由
	 * @return
	 */
	public Map<String,String> queryMatrixByRoute(List<Map<String, String>> matrixs,
			Map<String,Object> route);

	/**
	 * 根据矩阵ID及路由,节点匹配审批流程
	 * @param m_id 矩阵ID
	 * @param route 路由
	 * @return
	 */
	public Map<String, Object> queryProcByMatAndRoute(String m_id,
			Map<String,Object> route,Map<String,Object> node);

	/**
	 * 添加流程实例
	 * @param af_id 流程ID
	 * @param instanceid 流程实例ID
	 * @param p_id 流程审批ID
	 * @param userid 当前
	 */
	public int addAFInstance(String af_id,String instanceid,String p_id,String userid,String bizid);
	
	/**
	 * 添加流程审批过程数据
	 * @param instanceid 流程实例ID
	 * @param lmap 审批节点及审批人
	 * @return
	 */
	public int addAFApprProcess(String instanceid,List<Map<String,String>> lmap);

	/**
	 * 添加流程发起审批记录数据
	 * @param map
	 * @return
	 * map基本信息
	 * actor_no 发起人工号
	 * instance_id 流程实例ID
	 * launch 发起标识
	 * appr_content 内容
	 */
	public int addApprovalRecord(Map<String,String> map);
	
	/**
	 * 返回流程发起结果
	 * @param list_map
	 * @return
	 * 支持流程单条发起及批量发起
	 */
	public Map<String, Object> getResultOfStartAF(List<Map<String,String>> list_map);
	
	/**
	 * 根据员工工号查询参与审批过的所有流程实例ID
	 * @param actorno
	 * @return
	 */
	public List<String> queryInstancesByActorno(String actorno);
	
	/**
	 * 将表达式转换成可执行语句 
	 * @param r_exp
	 * @param map
	 * @return
	 */
	public String compileExp(String r_exp,Map<String, Object> map);
	
	/**
	 * 字符串能否转成Int
	 * @param str
	 * @return
	 */
	public boolean isChangeToInt(String str);
	
	/**
	 * 字符串能否转成double
	 * @param doub
	 * @return
	 */
	public boolean isChangeToDouble(String doub);
	
	/**
	 * 委托
	 * @param map
	 * @return
	 */
	public Map<String,Object> approvalEntrust(Map<String,Object> map);

	/**
	 * 打回至某节点审批人
	 * @param sMap
	 * @return
	 */
	public Map<String,Object> approvalRejectToSomeOne(Map<String, Object> sMap);
	
	/**
	 * 查找下一节点审批人及节点类型
	 * @param sMap
	 * @return
	 */
	public Map<String,Object> queryNextPerson(Map<String,String> sMap);
}