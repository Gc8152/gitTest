package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface AFAppDao {
	/**
	 * 查询流程矩阵
	 * @param p_id
	 * @return
	 */
	public List<Map<String, String>> queryProcessByPID(String p_id);
	/**
	 * 查询流程矩阵
	 * @param af_id
	 * @return
	 */
	public List<Map<String, String>> queryAFMatrixByAFId(String af_id);
	/**
	 * 查询流程矩阵下的审批流配置
	 * @param m_id
	 * @return
	 */
	public List<Map<String, String>> queryAFProcessByMId(String m_id);
	/**
	 * 增加流程实例
	 * @param map
	 */
	public int addAFInstance(Map<String, String> map);
	/**
	 * 已经审批过的审批信息
	 * @param instance_id
	 * @return
	 */
	public List<Map<String, String >> queryAppedProcessInfo(String instance_id);
	/**
	 * 流程待审批人员信息 
	 * @param instance_id
	 * @return
	 */
	public List<Map<String, String >> queryAppingPersonInfo(String instance_id);
	/**
	 * 根据审批过程数据增加流程审批记录数据
	 */
	public int addAFAppRecordByProcess(Map<String, String > map);
	/**
	 * 增加流程发起审批记录数据
	 */
	public int addAFAppRecord(Map<String, String > map);
	/**
	 * 删除流程审批过程记录
	 */
	public int deleteAFAppProcessRecord(Map<String, String > map);
	/**
	 * 增加审批过程记录
	 * @param map
	 */
	public int addAFAppProcessRecord(Map<String, String > map);
	/**
	 * 查询流程实例的发起人
	 * @param instance_id
	 * @return
	 */
	public Map<String, String> queryInsOriginator(String instance_id);
	/**
	 * 查询流程所有审批节点
	 * @param valueOf
	 * @return
	 */
	public List<Map<String, String>> queryProcNodePerson(String valueOf);
	/**
	 * 查询流程未审批节点清单
	 * @param noMap
	 * @return
	 */
	public List<Map<String, String>> queryNoApprPerson(Map<String, String> noMap);
	/**
	 * 根据不同条件查询审批人
	 * @param noMap
	 * @return
	 */
	public List<Map<String,String>> queryApprPerson(Map<String, String> noMap);
	/**
	 * 查询流程实例基本信息
	 * @param instance_id
	 * @return
	 */
	public Map<String, String> queryInsByInstanceId(String instance_id);
	/**
	 * 根据系统标识和业务id查询最近的流程实例id
	 * @param instance_id
	 * @return
	 */
	public Map<String, String> queryInsByBizSys(Map<String, String> noMap);
	/**
	 * 根据节点ID查询该节点基本信息
	 * @param n_id
	 * @return
	 */
	public Map<String, String> queryNodeInfoByNid(String n_id);
	/**
	 * 根据流程实例ID批量删除审批过程表数据
	 * @param instance_ids
	 * @return
	 */
	public int delBatchProcessRecord(String[] instance_ids);
	/**
	 * 批量新增审批记录数据
	 * @param lmap
	 * @return
	 */
	public int addBatchAFAppRecord(List<Map<String, String>> lmap);
	/**
	 * 根据员工工号查询所参与过的所有流程实例ID
	 * @param app_person
	 * @return
	 */
	public List<String> queryAllInstByActorno(String app_person);
	/**
	 * 插入流程审批业务模块与流程实例记录信息
	 * @param maps
	 * @return
	 */
	public void insertAppFlowRecord(Map<String, String> maps);
	/**
     * 插入流程审批业务模块与流程实例记录信息
     * @param maps
     * @return
     */
	public void updateAppFlowRecord(Map<String, String> maps);
	/*
	 *修改流程实例状态 
	 */
	public void updateSate(Map<String, String> pmap);
	/*
	 *修改流程审批业务模块与流程实例记录表状态 
	 */
	public void updateIfEnd(Map<String, String> pmap);
	/*
	 *批量修改流程实例状态 
	 */
	public void updateSateBatch(String[] instance_ids);
	/**
	 * 修改审批人
	 * @param maps
	 * @return
	 */
	public int updateAppPerson(Map<String, String> pmap);
	/**
	 * 插入审批人变更信息
	 * @param maps
	 * @return
	 */
	public int addAppPersonChangeInfo(Map<String, String> pmap);

	/**
	 * 根据流程实例id查业务id
	 * @param maps
	 * @return
	 */
	public String queryBizId(String instance_id);

	/**
	 * 修改下一个审批人
	 * @param maps
	 * @return
	 */
	public void updateNextAppPerson(Map<String, String> pmap);
	/**
	 * 根据系统标识查询业务要素
	 * @param instance_id
	 * @return
	 */
	public List<Map<String, Object>> queryAllAFBySysCode(String system_code);
	/**
	 * 根据流程id查询节点配置
	 * @param instance_id
	 * @return
	 */
	public List<Map<String, Object>> queryAllAFByAfId(String af_id);
	/**
	 * 调整审批人排序字段值
	 * @param newMap
	 * @return
	 */
	public int updateAFProcRecordSort(Map<String, String> newMap);
	/**
	 * 查询发起人
	 * @param maps
	 * @return
	 */
	public String queryAppPerson(String instance_id);
	/**
	 * 查询上一节点审批人
	 * @param maps
	 * @return
	 */
	public List<Map<String, String>> queryUpPerson(Map<String, Object> map);
}
