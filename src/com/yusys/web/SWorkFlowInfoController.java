package com.yusys.web;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.afconfig.ISWorkFlowInfoService;

@Controller
@RequestMapping("/AFConfig")
public class SWorkFlowInfoController extends BaseController{

	@Resource
	private ISWorkFlowInfoService iSWorkFlowInfoService;
	
	//流程配置首页
	@RequestMapping("/toAFList")
	public String toAFList(){
		return "approvalflow/swfi/swfi-querylist";
	}
	//查询所有流程信息
	@RequestMapping("/queryAllProcessInfo")
	public void queryallempinfo(HttpServletRequest req,HttpServletResponse res) {
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,iSWorkFlowInfoService.queryAllProcessInfo(req)));
	}
	
	//指向流程新增页面
	@RequestMapping("/toAFAddPage")
	public String toAFAddPage(){
		return "approvalflow/swfi/swfi-addprocess";
	}
	//新增一条流程
	@RequestMapping("/addOneProcessInfo")
	public void addOneProcessInfo(HttpServletRequest req,HttpServletResponse res) {
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.addOneProcessInfo(req,getUserId(req))));
	}
	
	//指向流程修改页面
	@RequestMapping("/toAFUpdatePage")
	public String toAFUpdatePage(HttpServletRequest req,String operate,String af_id){
		req.setAttribute("operate", operate);
		req.setAttribute("af_id", af_id);
		return "approvalflow/swfi/swfi-addprocess";
	}
	//根据选择的id修改流程表中该信息
	@RequestMapping("/updateOneProcessInfo")
	public void updateOneProcessInfo(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.updateOneProcessInfo(req,getUserId(req))));
	}
	
	//根据选择的id删除流程表中该信息
	@RequestMapping("/deleteOneProcessInfo")
	public void deleteOneProcessInfo(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.deleteOneProcessInfo(req)));
	}
	
	//指向流程节点配置页面
	@RequestMapping("/toAFNoteConfigPage")
	public String toAFNoteConfigPage(HttpServletRequest req,String af_id){
		req.setAttribute("af_id", af_id);
		return "approvalflow/swfi/swfi-noteconfig";
	}
	//通过流程id查询节点表中对应信息
	@RequestMapping("/queryAllAFNode")
	public void queryAllAFNode(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,iSWorkFlowInfoService.queryAllNode4AF(req)));
	}
	
	//指向流程矩阵配置页面
	@RequestMapping("/toAFMatrixPage")
	public String toAFMatrixPage(HttpServletRequest req,String af_id){
		req.setAttribute("af_id", af_id);
		return "approvalflow/swfi/swfi-procatrixconfig";
	}
	//通过流程id查询流程矩阵表中所有信息
	@RequestMapping("/queryMatrixById")
	public void queryMatrixById(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,iSWorkFlowInfoService.queryMatrixById(req)));
	}
	
	//向规则表和矩阵表插入数据
	@RequestMapping("/addOneMatrixInfo")
	public void addOneMatrixInfo(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.addInfo4RuleAndMatix(req,getUserId(req))));
	}
	//根据id删除矩阵表信息和规则表信息
	@RequestMapping("/deleteOneMatInfo")
	public void deleteInfo4RuleAndMatix(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.deleteInfo4RuleAndMatix(req)));
	}
	//根据id更新矩阵表信息和规则表信息
	@RequestMapping("/updateOneMatrixInfo")
	public void updateInfo4RuleAndMatix(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.updateInfo4RuleAndMatix(req,getUserId(req))));
	}
	
	//指向审批规则配置页面
	@RequestMapping("/toAFApprRuleCFPage")
	public String toAFApprRuleCFPage(HttpServletRequest req,String af_id,String m_id){
		req.setAttribute("af_id", af_id);
		req.setAttribute("m_id", m_id);
		return "approvalflow/swfi/swfi-approverulesconfig";
	}
	//根据id查找矩阵下的审批路由信息
	@RequestMapping("/queryMatixProcessByMId")
	public void queryMatixRoteById(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.queryMatixProcessByMId(req)));
	}
	
	//根据规则ID删除矩阵下所有路由节点和审批规则
	@RequestMapping("/deleteMatrixRoteById")
	public void deleteMatrixRoteById(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.deleteMatrixRoteById(req)));
	}
	
	//查询矩阵节点信息
	@RequestMapping("/queryMNodeInfos")
	public void queryMNodeInfos(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.queryMatrixNodeInfos(req)));
	}
	
	//删除审批流配置信息 
	@RequestMapping("/deleteAFProcess")
	public void deleteAFProcess(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.deleteAFProcess(req)));
	}
	
	//保存矩阵的审批规则信息
	@RequestMapping("/addApproveRuleInfo")
	public void addApproveRuleInfo(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.addApproveRuleInfo(req,getUserId(req))));
	}
	//增加流程审批规则
	@RequestMapping("/addAFRule")
	public void addAFRule(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.addAFRule(req,getUserId(req))));
	}
	//修改流程审批规则
	@RequestMapping("/updateAFRule")
	public void updateAFRule(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iSWorkFlowInfoService.updateAFRule(req,getUserId(req))));
	}
}