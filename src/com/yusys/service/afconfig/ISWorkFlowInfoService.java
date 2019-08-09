package com.yusys.service.afconfig;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface ISWorkFlowInfoService {
	//查询所有流程信息
	public Map<String,Object> queryAllProcessInfo(HttpServletRequest req);
	//向流程表中插入一条数据
	public Map<String,String> addOneProcessInfo(HttpServletRequest req,String userid);
	//根据选择的id删除流程表中该信息
	public Map<String,String> deleteOneProcessInfo(HttpServletRequest req);
	//修改一条流程记录
	public Map<String,Object> updateOneProcessInfo(HttpServletRequest req,String userid);
	//通过流程id查询流程矩阵表中所有信息 
	public Map<String,Object> queryMatrixById(HttpServletRequest req);
	//通过流程id查询节点表中对应信息
	public Map<String,Object> queryAllNode4AF(HttpServletRequest req);
	//向规则表和矩阵表插入数据
	public Map<String,String> addInfo4RuleAndMatix(HttpServletRequest req,String userid);
	//根据id删除矩阵表信息和规则表信息
	public Map<String,String> deleteInfo4RuleAndMatix(HttpServletRequest req);
	//根据id更新矩阵表信息和规则表信息
	public Map<String,String> updateInfo4RuleAndMatix(HttpServletRequest req,String userid);
	//保存矩阵的审批规则信息
	public Map<String,String>  addApproveRuleInfo(HttpServletRequest req,String userid);
	//根据id查找矩阵下的审批信息
	public Map<String,Object> queryMatixProcessByMId(HttpServletRequest req);
	//根据规则ID删除矩阵下所有路由节点和审批规则
	public Map<String,String> deleteMatrixRoteById(HttpServletRequest req);
	
	/**
	 * 查询矩阵节点信息
	 * @param req
	 * @return
	 */
	public Map<String, Object> queryMatrixNodeInfos(HttpServletRequest req);
	/**
	 * 删除审批流程
	 * @param req
	 * @return
	 */
	public Map<String, String>  deleteAFProcess(HttpServletRequest req);
	/**
	 * 增加流程规则
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String,String>  addAFRule(HttpServletRequest req,String userid);
	/**
	 * 修改流程规则
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String,String>  updateAFRule(HttpServletRequest req,String userid);
}
