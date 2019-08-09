package com.yusys.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.AFConstant;
import com.yusys.Utils.ApprovalFlowUtil;
import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.dao.AFAppDao;
import com.yusys.service.afapp.IAFAppBizBaseService;

@Controller
@RequestMapping("/AFLaunch")
public class AFLaunchController extends BaseController{
	@Resource
	private AFAppDao afAppDao;
	@Resource
	private ApprovalFlowUtil approvalFlowUtil;
	@Resource
	private IAFAppBizBaseService aFAppBizBaseService;

	/*发起审批流程示例*/
	@RequestMapping("/startAFProcess")
	public void startAFProcess(HttpServletRequest req,HttpServletResponse res) {
		List<Map<String,Object>> lmap = new ArrayList<Map<String,Object>>();
		Map<String,Object> map = new HashMap<String,Object>();
		//1.获取流程路由值和节点值
		Map<String, Object> nrMap = approvalFlowUtil.getRoutesAndNodes(req);
		//2.发起流程所需的lmap参数
		map.put("af_id",req.getParameter("af_id"));
		map.put("biz_id", req.getParameter("biz_id"));
		map.put("res_group_id", req.getParameter("res_group_id"));
		String actor_no = req.getParameter("actor_no");
		if(actor_no!=null && !"".equals(actor_no)){
			map.put("actor_no", actor_no);
		} else {
			map.put("actor_no", getUserId(req));
		}
		map.put("node", nrMap.containsKey("node")?nrMap.get("node"):"");
		map.put("route",nrMap.containsKey("route")?nrMap.get("route"):"");
		map.put("dep_no", req.getParameter("dep_no"));
		lmap.add(map);
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.launchAFProcess(lmap)));
	}
	/*查询审批流列表信息*/
	@RequestMapping("/queryAFApprovalLists")
	public void queryAFApprovalLists(HttpServletRequest req,HttpServletResponse res) {
		String instance_ids = req.getParameter("instance_id");
		String instance_id = instance_ids.split(",")[0];
		Map<String, String> instMap = afAppDao.queryInsByInstanceId(instance_id);
		String af_id = (instMap != null && instMap.containsKey("AF_ID"))?
				String.valueOf(instMap.get("AF_ID")):"";
		if(!af_id.isEmpty()){
			Map<String,String> map = new HashMap<String,String>();
			map.put("instance_id", instance_ids);
			List<Map<String, String>> appr_lists = aFAppBizBaseService.queryApprovalLists(map);
			Map<String, Object> rsMap = new HashMap<String,Object>();
			rsMap.put("rows", appr_lists);
			rsMap.put("total", appr_lists.size());
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,rsMap));
		}
	}
	@RequestMapping("/queryNextPerson")
	public void queryNextPerson(HttpServletRequest req,HttpServletResponse res) {
		String instance_id = req.getParameter("instance_id");
		Map<String,String> map = new HashMap<String,String>();
		map.put("instance_id", instance_id);
		Map<String, Object> npMap = aFAppBizBaseService.queryNextPerson(map);
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(npMap));
	}
	
	/*查询审批流历史记录*/
	@RequestMapping("/queryAFAppHisLists")
	public void queryAFAppHisLists(HttpServletRequest req,HttpServletResponse res) {
		String biz_id = req.getParameter("biz_id");
		String system_flag = req.getParameter("system_flag");
		Map<String,String> instMap = new HashMap<String, String>();
		instMap.put("biz_id", biz_id);
		instMap.put("system_flag", system_flag);
		Map<String,String> instMap1 = new HashMap<String, String>();
		instMap1 = afAppDao.queryInsByBizSys(instMap);
		String instance_id = (instMap1 != null && instMap1.containsKey("INSTANCE_ID"))?
				String.valueOf(instMap1.get("INSTANCE_ID")):"";
		if(!instance_id.isEmpty()){
			Map<String,String> map = new HashMap<String,String>();
			map.put("instance_id", instance_id);
			List<Map<String, String>> appr_lists = aFAppBizBaseService.queryApprovalLists(map);
			Map<String, Object> rsMap = new HashMap<String,Object>();
			rsMap.put("rows", appr_lists);
			rsMap.put("total", appr_lists.size());
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,rsMap));
		}
	}
	/*提交审批结果*/
	@RequestMapping("/doSaveApprSubmit")
	public void doSaveApprSubmit(HttpServletRequest req, HttpServletResponse res) throws Exception {
		try {
			String actor_no = req.getParameter("userId");
			String appr_state = req.getParameter("auditState");
			String appr_content = req.getParameter("auditContent");
			String instance_id = req.getParameter("instance_id");
			String n_id = req.getParameter("n_id");
			String next_person = req.getParameter("next_person");
			Map<String, String> instMap = afAppDao.queryInsByInstanceId(instance_id);
			String af_id = (instMap != null && instMap.containsKey("AF_ID"))?
					String.valueOf(instMap.get("AF_ID")):"";
			if(!af_id.isEmpty()){
				Map<String,Object> sMap = new HashMap<String,Object>();
				sMap.put("actor_no", actor_no);
				sMap.put("appr_state", appr_state);
				sMap.put("appr_content", appr_content);
				sMap.put("instance_id", instance_id);
				sMap.put("n_id", n_id);
				sMap.put("next_person", next_person);
				if(appr_state.equals(AFConstant.APPROVAL)){//批准
					ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.approvalPass(sMap)));
				}else if(appr_state.equals(AFConstant.REJECT)){//拒绝（打回）
					String backType = req.getParameter("backType");//打回类型：00打回至发起人；01打回至上一节点审批人
					//1.查询上一节点审批人
					List<Map<String, String>> bf_personlist = afAppDao.queryUpPerson(sMap);
					if(bf_personlist!=null && bf_personlist.size()>0){//上一节点审批人信息不为空
						Map<String, String> bf_map = bf_personlist.get(0);
						String up_n_actorno  = bf_map.containsKey("APP_PERSON")&&
								!String.valueOf(bf_map.get("APP_PERSON")).isEmpty()?
										String.valueOf(bf_map.get("APP_PERSON")):"";
						sMap.put("top_name", bf_map.get("N_NAME"));
						sMap.put("top_roleid", bf_map.get("ROLE_ID"));
						sMap.put("top_n_id", bf_map.get("N_ID"));
						sMap.put("top_order_id", bf_map.get("ORDER_ID"));
						//2.查询发起人
						String app_person = afAppDao.queryAppPerson(instance_id);
						//3.打回至发起人，若打回人和发起人是同一个人，则调用打回至发起人的方法，同时流程结束
						if(backType.equals(AFConstant.BACKTYPE_LAUNCH)||(backType.equals(AFConstant.BACKTYPE_UP) 
								&& app_person.equals(up_n_actorno))){
							ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.approvalReject(sMap)));
						}else {//4.打回至上一节点审批人，非发起人
							sMap.put("up_n_actorno", up_n_actorno);
							ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.approvalRejectToSomeOne(sMap)));
						}
					}else{
						//上一个节点没有人，则默认打回发起人
						ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.approvalReject(sMap)));
					}
				}else if(appr_state.equals(AFConstant.BACK)){//撤回（拿回）
					ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.approvalBack(sMap)));
				}else if(appr_state.equals(AFConstant.ENTRUST)){//委托
					String entrust_actorno = req.getParameter("new_app_person");
					sMap.put("entrust_actorno", entrust_actorno);
					ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.approvalEntrust(sMap)));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/*查询历史审批记录*/
	@RequestMapping("/queryApprHistoryRecord")
	public void queryApprHistoryRecord(HttpServletRequest req, HttpServletResponse res){
		String instance_id = req.getParameter("instance_id");
		Map<String, String> instMap = afAppDao.queryInsByInstanceId(instance_id);
		String af_id = (instMap != null && instMap.containsKey("AF_ID"))?
				String.valueOf(instMap.get("AF_ID")):"";
		if(!af_id.isEmpty()){
			Map<String,String> sMap = new HashMap<String,String>();
			sMap.put("instance_id", instance_id);
			List<Map<String, String>> his_lists = aFAppBizBaseService.queryHistoryApprRecord(sMap);
			Map<String, Object> rsMap = new HashMap<String,Object>();
			rsMap.put("rows", his_lists);
			rsMap.put("total", his_lists.size());
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,rsMap));
		}
	}
	/*批量发起流程*/
	@RequestMapping("/batchStartAFProcess")
	public void batchStartAFProcess(HttpServletRequest req, HttpServletResponse res){
		List<Map<String,Object>> lmap = new ArrayList<Map<String,Object>>();
		Map<String,Object> map = new HashMap<String,Object>();
		//节点要素值
		Map<String,Object> map1 = new HashMap<String,Object>();
		map1.put("n_dmanager", "0,24");
		map1.put("n_pcoo", "12");
		map1.put("n_pmanager", "23,25");
		map1.put("n_pceo", "10");
		//路由要素值
		Map<String,Object> map2 = new HashMap<String,Object>();
		map2.put("r_projectstate","00");
		map2.put("r_projectscale","00");
		//发起流程所需的lmap参数
		map.put("af_id", "10");
		map.put("actor_no", "admin");
		map.put("node", map1);
		map.put("route", map2);
		lmap.add(map);
		//lmap中添加多个map对象，测试批量发起
		Map<String,Object> m2 = new HashMap<String,Object>();
		//节点要素值
		Map<String,Object> map3 = new HashMap<String,Object>();
		map3.put("n_dmanager", "23,24");
		map3.put("n_pcoo", "12");
		map3.put("n_pmanager", "0,25");
		map3.put("n_pceo", "10");
		//路由要素值
		Map<String,Object> map4 = new HashMap<String,Object>();
		map4.put("r_projectstate","00");
		map4.put("r_projectscale","00");
		//发起流程所需的lmap参数
		m2.put("af_id", "10");
		m2.put("actor_no", "admin");
		m2.put("node", map3);
		m2.put("route", map4);
		lmap.add(m2);
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.launchAFProcess(lmap)));
	}
	/*批量批准成功*/
	@RequestMapping("batchApprPass")
	public void batchApprPass(HttpServletRequest req, HttpServletResponse res){
		String instance_id = req.getParameter("instance_id");
		if(instance_id.length()>0 && instance_id.contains(",")){
			String[] inst = instance_id.split(",");
			List<String> list = new ArrayList<String>();
			List<Map<String,Object>> lmap = new ArrayList<Map<String,Object>>();
			//1.查询流程实例对应的流程ID
			for(int i = 0; i < inst.length; i++){ 
				String instanceid = inst[i];
				Map<String, String> instMap = afAppDao.queryInsByInstanceId(instanceid);
				String af_id = (instMap != null && instMap.containsKey("AF_ID"))?
						String.valueOf(instMap.get("AF_ID")):"";
				if(!af_id.isEmpty()){
					if(!list.contains(af_id)){
						list.add(af_id);
					}
					Map<String,Object> m = new HashMap<String,Object>();
					m.put(af_id, instanceid);
					lmap.add(m);
				}
			}
			//2.组合流程ID所在的流程实例
			List<Map<String,Object>> listMap = new ArrayList<Map<String,Object>>();
			for(int j = 0; j < list.size(); j++){
				String af_id = list.get(j);
				String instances = "";
				for(int k = 0; k < lmap.size(); k++){
					Map<String,Object> mp = lmap.get(k);
					if(mp.containsKey(af_id)){
						instances += String.valueOf(mp.get(af_id))+",";
					}
				}
				Map<String,Object> m = new HashMap<String,Object>();
				m.put(af_id, instances);
				listMap.add(m);
			}
			//3.批量批准流程ID下的所有流程实例
			for(int m = 0; m < listMap.size(); m++){
				Map<String,Object> lm = listMap.get(m);
				for(String key : lm.keySet()){
					if(!key.isEmpty()){
						Map<String,Object> map = new HashMap<String,Object>();
						String actor_no = req.getParameter("actor_no");
						map.put("actor_no", actor_no);
						map.put("instance_id", lm.get(key));
						ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.batchApprovalPass(map)));
					}
				}
			}
		}else {
			Map<String, String> instMap = afAppDao.queryInsByInstanceId(instance_id);
			String af_id = (instMap != null && instMap.containsKey("AF_ID"))?
					String.valueOf(instMap.get("AF_ID")):"";
			if(!af_id.isEmpty()){
				Map<String,Object> map = new HashMap<String,Object>();
				String actor_no = req.getParameter("actor_no");
				map.put("actor_no", actor_no);
				map.put("instance_id", instance_id);
				ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.batchApprovalPass(map)));
			}
		}
	}
	/*批量审批拒绝*/
	@RequestMapping("batchApprReject")
	public void batchApprReject(HttpServletRequest req, HttpServletResponse res){
		String instance_id = req.getParameter("instance_id");
		if(instance_id.length()>0 && instance_id.contains(",")){
			String[] inst = instance_id.split(",");
			List<String> list = new ArrayList<String>();
			List<Map<String,Object>> lmap = new ArrayList<Map<String,Object>>();
			//1.查询流程实例对应的流程ID
			for(int i = 0; i < inst.length; i++){ 
				String instanceid = inst[i];
				Map<String, String> instMap = afAppDao.queryInsByInstanceId(instanceid);
				String af_id = (instMap != null && instMap.containsKey("AF_ID"))?
						String.valueOf(instMap.get("AF_ID")):"";
				if(!af_id.isEmpty()){
					if(!list.contains(af_id)){
						list.add(af_id);
					}
					Map<String,Object> m = new HashMap<String,Object>();
					m.put(af_id, instanceid);
					lmap.add(m);
				}
			}
			//2.组合流程ID所在的流程实例
			List<Map<String,Object>> listMap = new ArrayList<Map<String,Object>>();
			for(int j = 0; j < list.size(); j++){
				String af_id = list.get(j);
				String instances = "";
				for(int k = 0; k < lmap.size(); k++){
					Map<String,Object> mp = lmap.get(k);
					if(mp.containsKey(af_id)){
						instances += String.valueOf(mp.get(af_id))+",";
					}
				}
				Map<String,Object> m = new HashMap<String,Object>();
				m.put(af_id, instances);
				listMap.add(m);
			}
			//3.流程ID下的所有流程实例
			for(int m = 0; m < listMap.size(); m++){
				Map<String,Object> lm = listMap.get(m);
				for(String key : lm.keySet()){
					if(!key.isEmpty()){
						Map<String,Object> map = new HashMap<String,Object>();
						String actor_no = req.getParameter("actor_no");
						map.put("actor_no", actor_no);
						map.put("instance_id", lm.get(key));
						ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.batchApprovalReject(map)));
					}
				}
			}
		}else {
			Map<String, String> instMap = afAppDao.queryInsByInstanceId(instance_id);
			String af_id = (instMap != null && instMap.containsKey("AF_ID"))?
					String.valueOf(instMap.get("AF_ID")):"";
			if(!af_id.isEmpty()){
				Map<String,Object> map = new HashMap<String,Object>();
				String actor_no = req.getParameter("actor_no");
				map.put("actor_no", actor_no);
				map.put("instance_id", instance_id);
				ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.batchApprovalReject(map)));
			}
		}
	}
	/*批量审批撤回*/
	@RequestMapping("batchApprBack")
	public void batchApprBack(HttpServletRequest req, HttpServletResponse res){
		String instance_id = req.getParameter("instance_id");
		if(instance_id.length()>0 && instance_id.contains(",")){
			String[] inst = instance_id.split(",");
			List<String> list = new ArrayList<String>();
			List<Map<String,Object>> lmap = new ArrayList<Map<String,Object>>();
			//1.查询流程实例对应的流程ID
			for(int i = 0; i < inst.length; i++){ 
				String instanceid = inst[i];
				Map<String, String> instMap = afAppDao.queryInsByInstanceId(instanceid);
				String af_id = (instMap != null && instMap.containsKey("AF_ID"))?
						String.valueOf(instMap.get("AF_ID")):"";
				if(!af_id.isEmpty()){
					if(!list.contains(af_id)){
						list.add(af_id);
					}
					Map<String,Object> m = new HashMap<String,Object>();
					m.put(af_id, instanceid);
					lmap.add(m);
				}
			}
			//2.组合流程ID所在的流程实例
			List<Map<String,Object>> listMap = new ArrayList<Map<String,Object>>();
			for(int j = 0; j < list.size(); j++){
				String af_id = list.get(j);
				String instances = "";
				for(int k = 0; k < lmap.size(); k++){
					Map<String,Object> mp = lmap.get(k);
					if(mp.containsKey(af_id)){
						instances += String.valueOf(mp.get(af_id))+",";
					}
				}
				Map<String,Object> m = new HashMap<String,Object>();
				m.put(af_id, instances);
				listMap.add(m);
			}
			//3.流程ID下的所有流程实例
			for(int m = 0; m < listMap.size(); m++){
				Map<String,Object> lm = listMap.get(m);
				for(String key : lm.keySet()){
					if(!key.isEmpty()){
						Map<String,Object> map = new HashMap<String,Object>();
						String actor_no = req.getParameter("actor_no");
						map.put("actor_no", actor_no);
						map.put("instance_id", lm.get(key));
						ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.batchApprovalBack(map)));
					}
				}
			}
		}else {
			Map<String, String> instMap = afAppDao.queryInsByInstanceId(instance_id);
			String af_id = (instMap != null && instMap.containsKey("AF_ID"))?
					String.valueOf(instMap.get("AF_ID")):"";
			if(!af_id.isEmpty()){
				Map<String,Object> map = new HashMap<String,Object>();
				String actor_no = req.getParameter("actor_no");
				map.put("actor_no", actor_no);
				map.put("instance_id", instance_id);
				ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(aFAppBizBaseService.batchApprovalBack(map)));
			}
		}
	}
}
