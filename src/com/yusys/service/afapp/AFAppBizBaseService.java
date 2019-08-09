package com.yusys.service.afapp;

import groovy.lang.Binding;
import groovy.lang.GroovyShell;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.AFConstant;
import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.IDFactory;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.dao.AFAppDao;

/**
 * read-only
 * 流程审批操作的父类
 * @author fupx
 */
@Service
@Transactional
public class AFAppBizBaseService implements IAFAppBizBaseService{
	
	@Resource
	private AFAppDao afAppDao;
	
	private IDFactory uuidFactory;
	
	@Resource
	private TaskDBUtil taskDBUtil;
	
	/**
	 * 发起流程
	 * @param lmap
	 * @return
	 * 支持批量发起流程
	 * lmap基本信息如下
	 * actor_no：当前发起人
	 * af_id：流程ID
	 * bizId：业务ID
	 * node：节点要素值
	 * route：路由要素值
	 */
	@SuppressWarnings("unchecked")
	public Map<String,Object> launchAFProcess(List<Map<String,Object>> lmap){
		Map<String,Object> rsMap = new HashMap<String,Object>();
		List<Map<String,String>> list_map = new ArrayList<Map<String,String>>();
		for(int i = 0; i < lmap.size(); i++){
			Map<String,Object> map = lmap.get(i);
			//1.根据流程ID查询流程所有的矩阵信息
			String af_id = map.containsKey("af_id")&&map.get("af_id")!=null?String.valueOf(map.get("af_id")):"";
			String res_group_id = map.containsKey("res_group_id")&&map.get("res_group_id")!=null?String.valueOf(map.get("res_group_id")):"";
			List<Map<String, String>> matrixs = new ArrayList<Map<String, String>>();
			if(!af_id.isEmpty()){
				matrixs = afAppDao.queryAFMatrixByAFId(af_id);
				if(matrixs == null || matrixs.size() == 0){
					rsMap.put("result","false");
					rsMap.put("msg", "此流程目前暂无流程矩阵");
					return rsMap;
				}
			}else {
				rsMap.put("result","false");
				rsMap.put("msg", "此流程ID不存在");
				return rsMap;
			}
			Map<String,String> sysMap = matrixs.get(0);
			//获取流程所属业务系统
			String af_sys_name = sysMap.containsKey("AF_SYS_NAME")?String.valueOf(sysMap.get("AF_SYS_NAME")):"";
			//2.根据路由条件匹配流程矩阵
			Map<String,Object> mRoute = (Map<String, Object>) map.get("route");
			Map<String,String> mat = queryMatrixByRoute(matrixs,mRoute);
			String m_id = "";
			if(mat.containsKey("m_id") && mat.get("m_id") != null && 
					!String.valueOf(mat.get("m_id")).isEmpty()){
				m_id = String.valueOf(mat.get("m_id"));
			}else {
				rsMap.put("result","false");
				rsMap.put("msg", "暂无匹配到对应的流程矩阵");
				return rsMap;
			}
			//3.根据流程矩阵及路由条件,节点条件匹配具体审批流程
			Map<String,Object> mNode = new HashMap<String,Object>();
			if(map.containsKey("node") && map.get("node") != null && 
					!String.valueOf(map.get("node")).isEmpty()){
				mNode = (Map<String, Object>) map.get("node");
			}else {
				rsMap.put("result","false");
				rsMap.put("msg", "请检查传入的节点要素值是否存在");
				return rsMap;
			}
			Map<String, Object> proc = new HashMap<String, Object>();
			String p_id = "";
			if(!m_id.isEmpty()){
				proc = queryProcByMatAndRoute(m_id,mRoute,mNode);
				if(proc.containsKey("p_id") && proc.get("p_id") != null && 
						!String.valueOf(proc.get("p_id")).isEmpty()){
					p_id = String.valueOf(proc.get("p_id"));
				}else {
					rsMap.put("result","false");
					rsMap.put("msg", "目前要素值无法匹配到相应的审批流程");
					return rsMap;
				}
			}
			//4.添加流程实例记录及审批记录及审批过程表记录
			//4.1检查流程节点审批人
			List<Map<String,String>> actornos = new ArrayList<Map<String,String>>();
			
			
			if(proc.containsKey("actornos") && proc.get("actornos") != null && 
					!String.valueOf(proc.get("actornos")).isEmpty()){
				actornos = (List<Map<String, String>>) proc.get("actornos");
				
			}else {
				rsMap.put("result","false");
				rsMap.put("msg", "无法匹配到相应的节点审批人");
				return rsMap;
			}
			//4.2流程发起人不允许为空
			String actorno = "";
			if(map.containsKey("actor_no") && map.get("actor_no") != null && 
					!String.valueOf(map.get("actor_no")).isEmpty()){
				actorno = String.valueOf(map.get("actor_no"));
			}else {
				rsMap.put("result","false");
				rsMap.put("msg", "流程发起人不允许为空");
				return rsMap;
			}
			String instanceid = uuidFactory.getIDStr();
			String bizid = String.valueOf(map.get("biz_id"));
			//4.3查询流程审批节点记录
			List<Map<String,String>> app_proc_list = afAppDao.queryProcessByPID(p_id);
			Map<String,String> laun_map = new HashMap<String,String>();
			laun_map.put("instance_id", instanceid);
			laun_map.put("actor_no", actorno);
			laun_map.put("launch", "launch");
			int proc_rs = 0;
			int ins_rs = 0;
			int re_rs = 0;
			if(actornos.size() >= app_proc_list.size()){//4.4添加记录
				proc_rs = addAFApprProcess(instanceid,actornos);
				ins_rs = addAFInstance(af_id,instanceid,p_id,actorno,bizid);
				re_rs = addApprovalRecord(laun_map);
			}else {
				rsMap.put("result","false");
				rsMap.put("msg", "缺少节点审批人");
				return rsMap;
			}
			Map<String,String> resultMap = new HashMap<String,String>();
			//5.发起流程结果
			//5.1流程发起成功
			if(ins_rs > 0 && re_rs > 0 && proc_rs > 0 && proc_rs >= app_proc_list.size()){
				resultMap.put("result","true");
				resultMap.put("msg","流程发起成功");
				resultMap.put("instanceid",instanceid);
				//5.2获取下一节点审批人
				Map<String,String> noMap = new HashMap<String,String>();
				noMap.put("res_group_id", res_group_id);
				noMap.put("p_id", p_id);
				noMap.put("instance_id", instanceid);
				List<Map<String, String>> noApprPerson = afAppDao.queryNoApprPerson(noMap);
				if(noApprPerson.size() > 0){
					noMap.put("n_id", noApprPerson.get(0).get("N_ID"));
				}
				resultMap.put("nextPerson",getNextNodeApprPerson(noMap));
				resultMap.put("mark","start");
				list_map.add(resultMap);
				//5.3新增流程业务表记录
				Map<String, String> maps = new HashMap<String, String>();
				maps.put("record_id",taskDBUtil.getSequenceValByName("AF_SEQ_BIZ_RECORD"));
				maps.put("biz_id", bizid);
				maps.put("instance_id",instanceid);
				maps.put("curr_actorno",getNextNodeApprPerson(noMap));
				maps.put("system_flag", af_sys_name);
				maps.put("create_date",DateTimeUtils.getFormatCurrentTime());
				maps.put("if_end", AFConstant.CHECKING);
				maps.put("flag", AFConstant.LOGIC_DEL_NO);
				//流程发起成功后更新业务流程表中flag标记为逻辑删除
				afAppDao.updateAppFlowRecord(maps);
				//流程发起成功后添加业务流程表记录
				afAppDao.insertAppFlowRecord(maps);
				//5.4返回发起流程结果
				rsMap = getResultOfStartAF(list_map);
			}else {//6流程发起失败
				resultMap.put("result","false");
				if(ins_rs == 0 || re_rs == 0){
					resultMap.put("msg","请检查您传入的参数是否有误~");
				}else if(proc_rs == 0){
					resultMap.put("msg","请检查节点要素值是否有误~");
				}else {
					resultMap.put("msg","请核实您传入参数的属性是否准确~");
				}
				list_map.add(resultMap);
				rsMap = getResultOfStartAF(list_map);
			}
		}
		return rsMap;
	}
	
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
	public Map<String,Object> approvalPass(Map<String,Object> map){
		Map<String,Object> rsMap = new HashMap<String,Object>();
		Map<String,String> m = new HashMap<String,String>();
		//1.记录审批通过的数据到审批记录表
		String n_id = map.containsKey("instance_id")?String.valueOf(map.get("n_id")):"";
		String currPerson = map.containsKey("actor_no")?String.valueOf(map.get("actor_no")):"";
		String instance_id = map.containsKey("instance_id")?String.valueOf(map.get("instance_id")):"";
		m.put("app_person", currPerson);
		m.put("instance_id", instance_id);
		m.put("app_state", map.containsKey("appr_state")?String.valueOf(map.get("appr_state")):"");
		m.put("app_content", map.containsKey("appr_content")?String.valueOf(map.get("appr_content")):"");
		m.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		int rs = afAppDao.addAFAppRecordByProcess(m);
		//2.审批记录成功后，同时删除在审批过程表中的数据
		String currDelP = "";
		int d_rs = 0;
		if(rs > 0){
			//3.查询审批通过过程表数据
			List<Map<String,String>> listMap = afAppDao.queryApprPerson(m);
			if(listMap != null && listMap.size() > 0){
				for(int i = 0; i < listMap.size(); i++){
					Map<String,String> p_map = listMap.get(i);
					String ntype = p_map.containsKey("N_TYPE")?String.valueOf(p_map.get("N_TYPE")):"";
					String nid = p_map.containsKey("N_ID")?String.valueOf(p_map.get("N_ID")):"";
					if(ntype.equals(AFConstant.AF_NODE_TYPE_COMPETE)){
						Map<String,String> m2 = new HashMap<String,String>();
						m2.put("instance_id", instance_id);
						m2.put("n_id", nid);
						//3.1.1查询节点类型为多人竞争时待删除审批人
						if(n_id.equals(nid)){
							currDelP = getCurrToDelApprPerson(m2);
						}
						//3.1.2删除审批过程表中数据
						int d1_rs = afAppDao.deleteAFAppProcessRecord(m2);
						if(d1_rs > 0){
							d_rs++;
						}
					}else {
						//3.2.1查询节点类型为非多人竞争时待删除审批人
						if(n_id.equals(nid)){
							currDelP = currPerson;
						}
						//3.2.2删除审批过程表中数据
						Map<String,String> m3 = new HashMap<String,String>();
						m3.put("instance_id", instance_id);
						m3.put("n_id", nid);
						m3.put("app_person", currPerson);
						int d2_rs = afAppDao.deleteAFAppProcessRecord(m3);
						if(d2_rs > 0){
							d_rs++;
						}
					}
				}
			}
		}
		if(d_rs > 0){
			//4.判断流程是否走完
			Map<String,String> noMap = new HashMap<String,String>();
			Map<String,String> ins_map = afAppDao.queryInsByInstanceId(instance_id);
			String biz_id = afAppDao.queryBizId(instance_id);
			noMap.put("p_id", ins_map.containsKey("P_ID")?String.valueOf(ins_map.get("P_ID")):"");
			noMap.put("instance_id", instance_id);
			List<Map<String, String>> noApprPerson = afAppDao.queryNoApprPerson(noMap);
			noMap.put("next_person", String.valueOf(map.get("next_person")));
			if(noApprPerson.size() > 0){
				noMap.put("n_id", noApprPerson.get(0).get("N_ID"));
				rsMap.put("result", "true");
				rsMap.put("msg","批准成功");
				rsMap.put("nextPerson",getNextNodeApprPerson(noMap));
				rsMap.put("delPerson",currDelP);
				rsMap.put("mark","processing");
				//更新业务流程表中下一个审批人
				Map<String,String> pmap=new HashMap<String, String>();
				pmap.put("instance_id", instance_id);
				pmap.put("NextAppPerson",getNextNodeApprPerson(noMap));
				afAppDao.updateNextAppPerson(pmap);
			}else {
				rsMap.put("result", "true");
				rsMap.put("msg","流程审批完成");
				rsMap.put("nextPerson","");
				rsMap.put("delPerson",currDelP);
				rsMap.put("mark","over");
				rsMap.put("biz_id", biz_id);
				Map<String,String> pmap=new HashMap<String, String>();
				pmap.put("instance_id", instance_id);
				pmap.put("state", AFConstant.COMPLETE);
				pmap.put("if_end", AFConstant.COMPLETE);
				pmap.put("NextAppPerson","");
				//修改流程实例表中的流程实例状态状态
				afAppDao.updateSate(pmap);
				//更新业务流程表中下一个审批人及流程实例状态
				afAppDao.updateIfEnd(pmap);
				afAppDao.updateNextAppPerson(pmap);
			}
		}else {
			rsMap.put("result", "false");
			rsMap.put("msg","批准失败");
		}
		return rsMap;
	}
	
	//查找下一个节点审批人列表
	public Map<String,Object> queryNextPerson(Map<String,String> map){
		String instance_id = map.get("instance_id");
		String n_type= map.get("n_type");  //当前节点类型
		Map<String,String> noMap = new HashMap<String,String>();
		Map<String,String> ins_map = afAppDao.queryInsByInstanceId(instance_id);
		noMap.put("p_id", ins_map.containsKey("P_ID")?String.valueOf(ins_map.get("P_ID")):"");
		noMap.put("instance_id", instance_id);
		List<Map<String, String>> noApprPerson = afAppDao.queryNoApprPerson(noMap);
		Map<String,Object> npMap = new HashMap<String, Object>();
		List<Map<String,String>> nextLMap= new ArrayList<Map<String,String>>();
		List<Map<String,String>> next_man = new ArrayList<Map<String,String>>();
		boolean flag = true;
		if(noApprPerson.size()>0){//判断当前节点是不是多人并行审批的，如是多个并行且存在多个人则不可选下一个节点审批人
			noMap.put("n_id", noApprPerson.get(0).get("N_ID"));
			next_man = afAppDao.queryApprPerson(noMap);
			if(next_man!=null && next_man.size()>1 && "02".equals(next_man.get(0).get("N_TYPE")))
				flag=false;
		}
		if(noApprPerson.size() > 1 && flag){
			noMap.put("n_id", noApprPerson.get(1).get("N_ID"));
			
			nextLMap = afAppDao.queryApprPerson(noMap);
		}
		npMap.put("nextPerson", nextLMap);
		return npMap;
	}
	
	
	
	/**
	 * 批量审批通过
	 * @param map
	 * @return
	 * map基本信息
	 * actor_no：当前审批人
	 * instance_id：流程实例ID（以逗号隔开的字符串）
	 */
	public Map<String,Object> batchApprovalPass(Map<String,Object> map){
		Map<String,Object> rsMap = new HashMap<String,Object>();
		String insts = map.containsKey("instance_id")?String.valueOf(map.get("instance_id")):"";
		String actor_no = map.containsKey("actor_no")?String.valueOf(map.get("actor_no")):"";
		String[] instance_ids = {};
		if(!insts.isEmpty() && insts.contains(",")){
			instance_ids = insts.split(",");
		}else {
			instance_ids = new String[1];
			instance_ids[0] = insts;
		}
		int d_rs = 0;
		List<Map<String,String>> listM = new ArrayList<Map<String,String>>();
		if(instance_ids.length > 0){
			for(int k = 0; k < instance_ids.length; k++){
				String instance_id = instance_ids[k];
				//1.记录审批通过的数据到审批记录表
				Map<String,String> m = new HashMap<String,String>();
				m.put("app_person", actor_no);
				m.put("instance_id", instance_id);
				m.put("app_state", AFConstant.APPROVAL);
				m.put("app_content", "同意(批量审批)");
				m.put("opt_time", DateTimeUtils.getFormatCurrentTime());
				int rs = afAppDao.addAFAppRecordByProcess(m);
				//2.查询审批过程表数据
				List<Map<String,String>> listMap = afAppDao.queryApprPerson(m);
				//3.添加成功删除审批过程表数据
				String allCurrDel = "";
				if(listMap.size() > 0 && rs > 0){
					for(int i = 0; i < listMap.size(); i++){
						Map<String,String> mp = listMap.get(i);
						String n_id = mp.containsKey("N_ID")?String.valueOf(mp.get("N_ID")):"";
						String n_type = mp.containsKey("N_TYPE")?String.valueOf(mp.get("N_TYPE")):"";
						if(n_type.equals(AFConstant.AF_NODE_TYPE_COMPETE)){
							Map<String,String> m2 = new HashMap<String,String>();
							m2.put("instance_id", instance_id);
							m2.put("n_id", n_id);
							//3.1.1查询节点类型为多人竞争时待删除审批人
							allCurrDel += ","+getCurrToDelApprPerson(m2);
							//3.1.2删除审批过程表中数据
							int d1_rs = afAppDao.deleteAFAppProcessRecord(m2);
							if(d1_rs > 0){
								d_rs++;
							}
						}else {
							//3.2.1查询节点类型为非多人竞争时待删除审批人
							allCurrDel = actor_no;
							//3.2.2删除审批过程表中数据
							Map<String,String> m3 = new HashMap<String,String>();
							m3.put("instance_id", instance_id);
							m3.put("n_id", n_id);
							m3.put("app_person", actor_no);
							int d2_rs = afAppDao.deleteAFAppProcessRecord(m3);
							if(d2_rs > 0){
								d_rs++;
							}
						}
					}
				}
				//3.3批量待删除人员工号集合（用于清理待办返回的待删除人员工号）
				Map<String,String> am = new HashMap<String,String>();
				am.put("instance_id", instance_id);
				am.put("delPersn", allCurrDel);
				//查询下一节点审批人
				Map<String,String> noMap = new HashMap<String,String>();
				Map<String,String> ins_map = afAppDao.queryInsByInstanceId(instance_id);
				noMap.put("p_id", ins_map.containsKey("P_ID")?String.valueOf(ins_map.get("P_ID")):"");
				noMap.put("instance_id", instance_id);
				List<Map<String, String>> noApprPerson = afAppDao.queryNoApprPerson(noMap);
				//根据流程实例ID获取业务ID
				String biz_id = afAppDao.queryBizId(instance_id);
				//判断流程是否走完
				if(noApprPerson.size() > 0){//流程未结束
					noMap.put("n_id", noApprPerson.get(0).get("N_ID"));
					am.put("nextPerson", getNextNodeApprPerson(noMap));
					am.put("mark", "processing");
					am.put("biz_id", biz_id);
					//更新业务流程表中下一个审批人信息
					Map<String,String> pmap=new HashMap<String, String>();
					pmap.put("instance_id", instance_id);
					pmap.put("NextAppPerson",getNextNodeApprPerson(noMap));
					afAppDao.updateNextAppPerson(pmap);
				}else {//流程结束
					//查询发起人
					Map<String, String> originator = afAppDao.queryInsOriginator(instance_id);
					am.put("originator",originator.containsKey("APP_PERSON")?String.valueOf(originator.get("APP_PERSON")):"");
					am.put("nextPerson", "");
					am.put("mark", "over");
					am.put("biz_id", biz_id);
					Map<String,String> pmap = new HashMap<String,String>();
					pmap.put("instance_id", instance_id);
					pmap.put("state", AFConstant.COMPLETE);
					pmap.put("NextAppPerson","");
					pmap.put("if_end", AFConstant.COMPLETE);
					//流程结束，更新流程实例表中流程实例状态
					afAppDao.updateSate(pmap);
					//流程结束，更新业务流程表中流程实例状态及当前审批人信息
					afAppDao.updateNextAppPerson(pmap);
					afAppDao.updateIfEnd(pmap);
				}
				listM.add(am);
			}
		}
		//4.返回批量审批结果集
		if(d_rs > 0){
			rsMap.put("result","true");
			rsMap.put("msg","批量批准成功");
			rsMap.put("batchMark", "batchApprovalSucc");
			rsMap.put("lists",listM);
		}else {
			rsMap.put("result", "false");
			rsMap.put("msg","批量批准失败");
			rsMap.put("batchMark", "batchApprovalFail");
			rsMap.put("lists",listM);
		}
		return rsMap;
	}
	
	/**
	 * 单个流程
	 * 审批拒绝(即打回至发起人)
	 * @param map
	 * @return
	 * map基本信息
	 * actor_no：当前审批人
	 * appr_state：审批结论
	 * appr_content：审批意见
	 * instance_id：流程实例ID
	 */
	public Map<String,Object> approvalReject(Map<String,Object> map){
		Map<String,Object> rsMap = new HashMap<String,Object>();
		Map<String,String> s_map = new HashMap<String,String>();
		//1.添加数据至审批记录表
		String currPerson = map.containsKey("actor_no")?String.valueOf(map.get("actor_no")):"";
		String instance_id = map.containsKey("instance_id")?String.valueOf(map.get("instance_id")):"";
		s_map.put("app_person", currPerson);
		s_map.put("instance_id", instance_id);
		s_map.put("app_state", map.containsKey("appr_state")?String.valueOf(map.get("appr_state")):"");
		s_map.put("app_content", map.containsKey("appr_content")?String.valueOf(map.get("appr_content")):"");
		s_map.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		int rs = afAppDao.addAFAppRecordByProcess(s_map);
		//2.同时删除审批过程表中数据
		String currDelP = "";
		int d_rs = 0;
		String n_type = "";
		String n_id = "";
		if(rs > 0){
			//3.查询审批通过过程表数据
			Map<String,String> m1 = new HashMap<String,String>();
			m1.put("instance_id", instance_id);
			m1.put("app_person", currPerson);
			List<Map<String,String>> listMap = afAppDao.queryApprPerson(m1);
			Map<String,String> m3 = new HashMap<String,String>();
			m3.put("instance_id", instance_id);
			if(listMap.size() > 0){
				Map<String,String> p_map = listMap.get(0);
				n_type = p_map.containsKey("N_TYPE")?String.valueOf(p_map.get("N_TYPE")):"";
				n_id = p_map.containsKey("N_ID")?String.valueOf(p_map.get("N_ID")):"";
				if(n_type.equals(AFConstant.AF_NODE_TYPE_COMPETE)){
					Map<String,String> m2 = new HashMap<String,String>();
					m2.put("instance_id", instance_id);
					m2.put("n_id", n_id);
					//3.1.1查询节点类型为多人竞争时待删除审批人
					currDelP = getCurrToDelApprPerson(m2);
					//3.1.2删除审批过程表中数据
					int d1_rs = afAppDao.deleteAFAppProcessRecord(m3);
					if(d1_rs > 0){
						d_rs++;
					}
				}else {
					//3.2.1节点类型为非多人竞争时，当前审批人
					currDelP = currPerson;
					//3.2.2删除审批过程表中数据
					int d2_rs = afAppDao.deleteAFAppProcessRecord(m3);
					if(d2_rs > 0){
						d_rs++;
					}
				}
			}
		}
		//更新业务流程表中当前审批人信息
		Map<String,String> pmap2=new HashMap<String, String>();
		pmap2.put("instance_id", instance_id);
		pmap2.put("NextAppPerson","");
		afAppDao.updateNextAppPerson(pmap2);
		//4.返回审批拒绝结果
		if(d_rs > 0){
			rsMap.put("result", "true");
			rsMap.put("msg","审批拒绝成功");
			String biz_id = afAppDao.queryBizId(instance_id);
			Map<String, String> originator = afAppDao.queryInsOriginator(instance_id);
			rsMap.put("originator",originator.containsKey("APP_PERSON")?String.valueOf(originator.get("APP_PERSON")):"");
			rsMap.put("delPerson",currDelP);
			rsMap.put("mark","reject");
			rsMap.put("biz_id", biz_id);
			Map<String,String> pmap = new HashMap<String,String>();
			pmap.put("instance_id", instance_id);
			pmap.put("state", AFConstant.COMPLETE);
			pmap.put("NextAppPerson","");
			pmap.put("if_end", AFConstant.COMPLETE);
			//流程结束，更新流程实例表中流程实例状态
			afAppDao.updateSate(pmap);
			//流程结束，更新业务流程表中流程实例状态及当前审批人信息
			afAppDao.updateNextAppPerson(pmap);
			afAppDao.updateIfEnd(pmap);
		}else {
			rsMap.put("result", "false");
			rsMap.put("msg","拒绝失败");
		}
		return rsMap;
	}
	
	/**
	 * 单个流程打回至上一节点（除发起人以外）
	 * n_id：当前审批节点ID
	 * actor_no：当前审批人工号
	 * appr_state：审批结论
	 * appr_content：审批意见
	 * instance_id：流程实例ID
	 * up_n_actorno：上一审批节点人工号
	 * @param map
	 * @return
	 */
	public Map<String,Object> approvalRejectToSomeOne(Map<String,Object> map){
		Map<String,Object> rsMap = new HashMap<String,Object>();
		//1.获取map的信息
		String instance_id = map.containsKey("instance_id")?String.valueOf(map.get("instance_id")):"";
		String app_person = map.containsKey("actor_no")?String.valueOf(map.get("actor_no")):"";
		String n_id = map.containsKey("n_id")?String.valueOf(map.get("n_id")):"";
		String app_state = map.containsKey("appr_state")?String.valueOf(map.get("appr_state")):"";
		String app_content = map.containsKey("appr_content")?String.valueOf(map.get("appr_content")):"";
		String top_name = map.containsKey("top_name")?String.valueOf(map.get("top_name")):"";
		String top_roleid = map.containsKey("top_roleid")?String.valueOf(map.get("top_roleid")):"";
		String top_n_id = map.containsKey("top_n_id")?String.valueOf(map.get("top_n_id")):"";
		String top_order_id = map.containsKey("top_order_id")?String.valueOf(map.get("top_order_id")):"";
		
		
		//2.添加当前审批人到审批记录表
		//2.1根据流程实例ID、节点ID、当前审批人查询全量信息
		Map<String,String> m = new HashMap<String,String>();
		m.put("instance_id", instance_id);
		m.put("app_person", app_person);
		m.put("n_id", n_id);
		List<Map<String,String>> lists = afAppDao.queryApprPerson(m);
		Map<String,String> mp = (lists != null&&lists.size()>0?lists.get(0):(new HashMap<String,String>()));
		String n_name = mp.containsKey("N_NAME")?String.valueOf(mp.get("N_NAME")):"";
		String role_id = mp.containsKey("ROLE_ID")?String.valueOf(mp.get("ROLE_ID")):"";
		String order_id = mp.containsKey("ORDER_ID")?String.valueOf(mp.get("ORDER_ID")):"";
		m.put("id", uuidFactory.getIDStr());
		m.put("app_state", app_state);
		m.put("app_content", app_content);
		m.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		m.put("n_name", n_name);
		m.put("role_id", role_id);
		m.put("order_id", order_id);
		//2.2添加当前审批人信息到审批记录表
		int rs = afAppDao.addAFAppRecord(m);
		//3.删除当前审批人在审批过程表中记录数据
		int del_p = afAppDao.deleteAFAppProcessRecord(m);
		//4.添加打回人及被打回人到审批过程表记录
		List<Map<String,String>> lmap = new ArrayList<Map<String,String>>();
		//5.添加被打回人信息至审批过程表
		Map<String,String> m1 = new HashMap<String,String>();
		
		m1.put("n_id", top_n_id);
		m1.put("n_actorno", map.containsKey("up_n_actorno")&&
				map.get("up_n_actorno")!=null?String.valueOf(map.get("up_n_actorno")):"");
		m1.put("n_name", top_name);//上一个节点审批人岗位信息
		m1.put("role_id", top_roleid);
		m1.put("order_id", top_order_id);
		lmap.add(m1);
		//6.添加打回人信息至审批过程表
		Map<String,String> m2 = new HashMap<String,String>();
		m2.put("n_id", n_id);
		m2.put("n_actorno", app_person);
		m2.put("n_name", n_name);
		m2.put("role_id", role_id);
		m2.put("order_id", String.valueOf((Integer.parseInt(order_id)+2)));
		lmap.add(m2);
		int rs_p = addAFApprProcess(instance_id,lmap);
		if(rs > 0 && del_p > 0 && rs_p > 0){
			rsMap.put("result", "true");
			rsMap.put("msg", "打回成功");
		}
		//7.更新业务流程表中当前审批人记录
		Map<String,String> pmap=new HashMap<String, String>();
		pmap.put("instance_id", instance_id);
		pmap.put("NextAppPerson",map.containsKey("up_n_actorno")&&
				map.get("up_n_actorno")!=null?String.valueOf(map.get("up_n_actorno")):"");
		afAppDao.updateNextAppPerson(pmap);
		return rsMap;
	}
	
	/**
	 * 批量审批拒绝
	 * @param map
	 * @return
	 * map基本信息
	 * actor_no：当前审批人
	 * instance_id：流程实例ID（以逗号隔开的字符串）
	 */
	public Map<String,Object> batchApprovalReject(Map<String,Object> map){
		Map<String,Object> rsMap = new HashMap<String,Object>();
		//1.添加拒绝数据至审批记录表
		String actor_no = map.containsKey("actor_no")?String.valueOf(map.get("actor_no")):"";
		String instance_id = map.containsKey("instance_id")?String.valueOf(map.get("instance_id")):"";
		String[] instance_ids = {};
		if(!instance_id.isEmpty() && instance_id.contains(",")){
			instance_ids = instance_id.split(",");
		}else {
			instance_ids = new String[1];
			instance_ids[0] = instance_id;
		}
		int result = 0;
		List<Map<String,String>> listM = new ArrayList<Map<String,String>>();
		if(instance_ids.length > 0){
			List<Map<String,String>> lmap = new ArrayList<Map<String,String>>();
			for(int i = 0; i < instance_ids.length; i++){
				String inst = instance_ids[i];
				String biz_id = afAppDao.queryBizId(inst);
				Map<String,String> qMap = new HashMap<String,String>();
				qMap.put("app_person", actor_no);
				qMap.put("instance_id", inst);
				List<Map<String,String>> listMap = afAppDao.queryApprPerson(qMap);
				String n_id = "";
				if(listMap.size() > 0){
					Map<String,String> mp = listMap.get(0);
					n_id = mp.containsKey("N_ID")?String.valueOf(mp.get("N_ID")):"";
				}
				//1.1添加记录集
				Map<String,String> st_map = new HashMap<String,String>();
				st_map.put("id",uuidFactory.getIDStr());
				st_map.put("n_id",n_id);
				st_map.put("app_person",actor_no);
				st_map.put("app_state",AFConstant.REJECT);
				st_map.put("app_content","");
				st_map.put("instance_id",inst);
				st_map.put("opt_time",DateTimeUtils.getFormatCurrentTime());
				Map<String,String> nmap = afAppDao.queryNodeInfoByNid(n_id);
				st_map.put("n_name",nmap.containsKey("N_NAME")?String.valueOf(nmap.get("N_NAME")):"");
				st_map.put("role_id","");
				lmap.add(st_map);
				//1.2查询待删除人清单
				Map<String,String> delmap = new HashMap<String,String>();
				delmap.put("instance_id", inst);
				String currDelP = getCurrToDelApprPerson(delmap);//待删除人
				delmap.put("delPerson", currDelP);
				Map<String, String> originator = afAppDao.queryInsOriginator(inst);//发起人
				delmap.put("originator",originator.containsKey("APP_PERSON")?String.valueOf(originator.get("APP_PERSON")):"");
				delmap.put("mark", "reject");
				delmap.put("biz_id", biz_id);
				listM.add(delmap);
				Map<String,String> pmap = new HashMap<String,String>();
				pmap.put("instance_id", inst);
				pmap.put("state", AFConstant.COMPLETE);
				pmap.put("if_end", AFConstant.COMPLETE);
				pmap.put("NextAppPerson","");
				//流程结束，修改流程实例表中流程状态
				afAppDao.updateSate(pmap);
				//流程结束，更新业务流程表中流程实例状态及当前审批人信息
				afAppDao.updateNextAppPerson(pmap);
				afAppDao.updateIfEnd(pmap);
			}
			result = afAppDao.addBatchAFAppRecord(lmap);
		}
		//2.审批记录添加成功后，批量删除审批过程表中数据
		int batch_rs = 0;
		if(result == instance_ids.length){
			batch_rs = afAppDao.delBatchProcessRecord(instance_ids);
		}
		//3.返回批量审批拒绝结果集
		if(batch_rs > 0){
			rsMap.put("result", "true");
			rsMap.put("msg", "批量拒绝成功");
			rsMap.put("batchMark", "batchRejectSucc");
			rsMap.put("lists", listM);
		}else {
			rsMap.put("result", "false");
			rsMap.put("msg","批量拒绝失败");
			rsMap.put("batchMark", "batchRejectFail");
			rsMap.put("lists", listM);
		}
		return rsMap;
	}
	
	/**
	 * 单个流程
	 * 审批撤回（拿回），只有发起人可拿回
	 * @param map
	 * @return
	 * map基本信息
	 * actor_no：当前审批人
	 * appr_state：审批结论
	 * appr_content：审批意见
	 * instance_id：流程实例ID
	 */
	public Map<String,Object> approvalBack(Map<String,Object> map){
		Map<String,Object> rsMap = new HashMap<String,Object>();
		//1.记录审批撤回（拿回）记录
		Map<String,String> st_map = new HashMap<String,String>();
		String actor_no = map.containsKey("actor_no")?String.valueOf(map.get("actor_no")):"";
		String appr_state = map.containsKey("appr_state")?String.valueOf(map.get("appr_state")):"";
		String appr_content = map.containsKey("appr_content")?String.valueOf(map.get("appr_content")):"";
		String instance_id = map.containsKey("instance_id")?String.valueOf(map.get("instance_id")):"";
		String app_person = afAppDao.queryAppPerson(instance_id);
		String biz_id = afAppDao.queryBizId(instance_id);
		if(!app_person.equals(actor_no)){
			rsMap.put("result", "false");
			rsMap.put("msg","不是发起人");
			return rsMap;
		}
		st_map.put("instance_id", instance_id);
		st_map.put("actor_no", actor_no);
		st_map.put("app_state", appr_state);
		st_map.put("app_content", appr_content);
		st_map.put("back", "back");
		int rs = addApprovalRecord(st_map);
		//2.删除该流程实例ID在审批过程表中的数据
		int rs_del = 0;
		String currDelP = "";
		if(rs > 0){
			Map<String,String> delmap = new HashMap<String,String>();
			delmap.put("instance_id", instance_id);
			//2.1查询待删除人员
			currDelP = getCurrToDelApprPerson(delmap);
			//2.2撤回成功删除审批过程表数据
			rs_del = afAppDao.deleteAFAppProcessRecord(delmap);
		}
		//3.返回审批撤回后的结果
		if(rs_del > 0){
			rsMap.put("result", "true");
			rsMap.put("msg", "撤回成功");
			rsMap.put("delPerson", currDelP);
			rsMap.put("biz_id", biz_id);
			rsMap.put("mark", "back");
			Map<String,String> pmap = new HashMap<String,String>();
			pmap.put("instance_id", instance_id);
			pmap.put("state", AFConstant.COMPLETE);
			pmap.put("if_end", AFConstant.COMPLETE);
			pmap.put("NextAppPerson","");
			//流程结束，修改流程实例表中流程状态
			afAppDao.updateSate(pmap);
			//流程结束，更新业务流程表中流程实例状态及当前审批人信息
			afAppDao.updateNextAppPerson(pmap);
			afAppDao.updateIfEnd(pmap);
		}else {
			rsMap.put("result", "false");
			rsMap.put("biz_id", biz_id);
			rsMap.put("msg","撤回失败");
		}
		return rsMap;
	}
	/**
	 * 批量审批撤回
	 * @param map
	 * @return
	 * map基本信息
	 * actor_no：当前审批人
	 * instance_id：流程实例ID（以逗号隔开的字符串）
	 */
	public Map<String,Object> batchApprovalBack(Map<String,Object> map){
		Map<String,Object> rsMap = new HashMap<String,Object>();
		//1.添加审批撤回记录数据至审批记录表
		String actor_no = map.containsKey("actor_no")?String.valueOf(map.get("actor_no")):"";
		String instance_id = map.containsKey("instance_id")?String.valueOf(map.get("instance_id")):"";
		String[] instance_ids = {};
		if(!instance_id.isEmpty() && instance_id.contains(",")){
			instance_ids = instance_id.split(",");
		}else {
			instance_ids = new String[1];
			instance_ids[0] = instance_id;
		}
		int result = 0;
		List<Map<String,String>> listM = new ArrayList<Map<String,String>>();
		if(instance_ids.length > 0){
			List<Map<String,String>> lmap = new ArrayList<Map<String,String>>();
			for(int i = 0; i < instance_ids.length; i++){
				//1.1添加记录集
				Map<String,String> st_map = new HashMap<String,String>();
				String inst = instance_ids[i];
				st_map.put("id",uuidFactory.getIDStr());
				st_map.put("n_id","");
				st_map.put("app_person",actor_no);
				st_map.put("app_state",AFConstant.BACK);
				st_map.put("app_content", "");
				st_map.put("instance_id",inst);
				st_map.put("opt_time",DateTimeUtils.getFormatCurrentTime());
				st_map.put("n_name","发起人");
				st_map.put("role_id", "");
				lmap.add(st_map);
				//1.2查询待删除人清单
				Map<String,String> delmap = new HashMap<String,String>();
				delmap.put("instance_id", inst);
				String currDelP = getCurrToDelApprPerson(delmap);//待删除人
				delmap.put("delPerson", currDelP);
				delmap.put("mark", "back");
				listM.add(delmap);
				Map<String,String> pmap = new HashMap<String,String>();
				pmap.put("instance_id", inst);
				pmap.put("state", AFConstant.COMPLETE);
				pmap.put("NextAppPerson","");
				pmap.put("if_end", AFConstant.COMPLETE);
				//流程结束，修改流程实例表中流程状态
				afAppDao.updateSate(pmap);
				//流程结束，更新业务流程表中流程实例状态及当前审批人信息
				afAppDao.updateNextAppPerson(pmap);
				afAppDao.updateIfEnd(pmap);
			}
			result = afAppDao.addBatchAFAppRecord(lmap);
		}
		//2.记录成功批量删除流程实例在审批过程表中的数据
		int batch_rs = 0;
		if(result == instance_ids.length){
			batch_rs = afAppDao.delBatchProcessRecord(instance_ids);
		}
		//3.返回批量撤回结果
		if(batch_rs > 0){
			rsMap.put("result", "true");
			rsMap.put("msg", "批量撤回成功");
			rsMap.put("batchMark", "batchBackupSucc");
			rsMap.put("lists", listM);
		}else {
			rsMap.put("result", "false");
			rsMap.put("msg","批量撤回失败");
			rsMap.put("batchMark", "batchBackupFail");
			rsMap.put("lists", listM);
		}
		return rsMap;
	}
	
	/**
	 * 查询流程审批列表
	 * @param map
	 * @return
	 * map基本信息
	 * instance_id：流程实例ID
	 */
	public List<Map<String, String>> queryApprovalLists(Map<String,String> map){
		List<Map<String, String>> rs_lmap = new ArrayList<Map<String, String>>();
		if(!map.containsKey("instance_id") || map.get("instance_id") == null){
			return rs_lmap;
		}
		String instance_id =String.valueOf(map.get("instance_id"));
		String[] instance_ids = instance_id.split(",");
		for(int i=0;i<instance_ids.length;i++){
			instance_id = instance_ids[i];
		   if(!instance_id.isEmpty()){
			  //1.查询发起人
			  List<Map<String, String>> origi = new ArrayList<Map<String,String>>();
			  Map<String, String> originator = afAppDao.queryInsOriginator(instance_id);
			  if(originator != null){
				  origi.add(originator);
			   }
			  rs_lmap.addAll(origi);
			  //2.查询已审批过的审批信息(排除发起人)
			  List<Map<String, String>> processed = afAppDao.queryAppedProcessInfo(instance_id);
			  if(processed.size() > 0){
				  rs_lmap.addAll(processed);
			   }
			  //3.查询流程实例ID在审批过程表中的审批数据
			  List<Map<String, String>> process = afAppDao.queryAppingPersonInfo(instance_id);
			  if(process.size() > 0){
				rs_lmap.addAll(process);
			  }
		    }
		}
		return rs_lmap;
	}
	
	/**
	 * 查询流程历史审批记录
	 * @param map
	 * @return
	 * map基本信息
	 * instance_id：流程实例ID
	 */
	public List<Map<String, String>> queryHistoryApprRecord(Map<String,String> map){
		List<Map<String, String>> rs_lmap = new ArrayList<Map<String, String>>();
		if(!map.containsKey("instance_id") || map.get("instance_id") == null){
			return rs_lmap;
		}
		String instance_id = String.valueOf(map.get("instance_id"));
		if(!instance_id.isEmpty()){
			//1.查询发起人
			List<Map<String, String>> origi = new ArrayList<Map<String,String>>();
			Map<String, String> originator = afAppDao.queryInsOriginator(instance_id);
			if(originator != null){
				origi.add(originator);
			}
			rs_lmap.addAll(origi);
			//2.历史审批记录
			List<Map<String, String>> rs_hist = afAppDao.queryAppedProcessInfo(instance_id);
			if(rs_hist.size() > 0){
				rs_lmap.addAll(rs_hist);
			}
		}
		return rs_lmap;
	}
	
	/**
	 * 查询下一节点审批人
	 * @param map
	 * @return
	 * map基本信息
	 * n_id：节点ID
	 * instance_id：流程实例ID
	 */
	public String getNextNodeApprPerson(Map<String,String> map){
		String nextPerson = map.containsKey("next_person")?String.valueOf(map.get("next_person")):"";
		List<Map<String,String>> nextLMap = afAppDao.queryApprPerson(map);
		if(!"".equals(nextPerson)){
			Map<String,String> nextMap = new HashMap<String, String>();
			nextMap.put("nextPerson", nextPerson);
			nextMap.put("n_id", nextLMap.get(0).get("N_ID"));
			nextMap.put("instance_id", map.get("instance_id"));
			afAppDao.deleteAFAppProcessRecord(nextMap);
			return nextPerson;
		}else{
			
			String next_person = "";
			if(nextLMap.size() > 0){
				for(int j = 0; j < nextLMap.size(); j++){
					Map<String,String> nmap = nextLMap.get(j);
					String nperson = nmap.containsKey("APP_PERSON")?String.valueOf(nmap.get("APP_PERSON")):"";
					next_person += nperson+",";
				}
			}
			next_person = next_person.length() > 0?next_person.substring(0, next_person.length()-1):"";
			return next_person;
		}
	}
	
	/**
	 * 仅当节点类型为：多人竞争
	 * 审批批准后查询当前无需再参与审批清单
	 * @param map
	 * @return
	 * map基本信息
	 * n_id：节点ID
	 * instance_id：流程实例ID
	 */
	public String getCurrToDelApprPerson(Map<String,String> map){
		List<Map<String,String>> currDMap = afAppDao.queryApprPerson(map);
		String currDelP = "";
		if(currDMap.size() > 0){
			for(int j = 0; j < currDMap.size(); j++){
				Map<String,String> nmap = currDMap.get(j);
				String nperson = nmap.containsKey("APP_PERSON")?String.valueOf(nmap.get("APP_PERSON")):"";
				currDelP += nperson+",";
			}
		}
		currDelP = currDelP.length() > 0?currDelP.substring(0, currDelP.length()-1):"";
		return currDelP;
	}
	
	/**
	 * 根据路由条件匹配流程矩阵
	 * @param matrixs 矩阵
	 * @param route 路由
	 * @return
	 */
	public Map<String,String> queryMatrixByRoute(List<Map<String, String>> matrixs,
			Map<String,Object> route){
		Map<String,String> map = new HashMap<String,String>();
		if(matrixs.size() > 0){
			for(int i = 0; i < matrixs.size(); i++){
				Map<String, String> m = matrixs.get(i);
				String r_exp = m.containsKey("R_EXP")?String.valueOf(m.get("R_EXP")):"";
				String newR_exp = compileExp(r_exp,route);
				Binding bind = new Binding();
				GroovyShell shell = new GroovyShell(bind);
				Object obj = shell.evaluate(newR_exp);
				if ("true".equals(obj+"") || r_exp.isEmpty()) {
					map.put("m_id", String.valueOf(m.get("M_ID")));
					return map;
				}
			}
		}
		return map;
	}

	/**
	 * 根据矩阵ID及路由值,节点值匹配审批流程
	 * @param m_id 矩阵ID
	 * @param route 路由值
	 * @param node 节点值
	 * @return
	 */
	public Map<String, Object> queryProcByMatAndRoute(String m_id,
			Map<String,Object> route,Map<String,Object> node){
		Map<String, Object> map = new HashMap<String, Object>();
		List<Map<String, String>> process = afAppDao.queryAFProcessByMId(m_id);
		if(process.size() > 0){
			for(int i = 0; i < process.size(); i++){
				Map<String, String> m = process.get(i);
				String r_exp = m.containsKey("R_EXP")?String.valueOf(m.get("R_EXP")):"";
				String newR_exp = compileExp(r_exp,route);
				Binding bind = new Binding();
				GroovyShell shell = new GroovyShell(bind);
				boolean bool = (Boolean) shell.evaluate(newR_exp);
				if (bool) {
					map.put("p_id", String.valueOf(m.get("P_ID")));
					List<Map<String,String>> list_maps = afAppDao.queryProcNodePerson(String.valueOf(m.get("P_ID")));
					if(list_maps.size() > 0){
						List<Map<String,String>> newLMap = new ArrayList<Map<String,String>>();
						for(int j = 0; j < list_maps.size(); j++){
							Map<String,String> lm = list_maps.get(j);
							String n_id = lm.containsKey("N_ID")?String.valueOf(lm.get("N_ID")):"";
							String n_type = lm.containsKey("N_TYPE")?String.valueOf(lm.get("N_TYPE")):"";
							//节点人可能是多人逗号隔开的工号
							String kv = String.valueOf(node.get(n_id));
							if(!kv.isEmpty()){
								if(n_type.equals(AFConstant.AF_NODE_TYPE_SINGLE)){//单人审批
									if(kv.contains(",")&&j==0){
										Map<String,String> person_m = new HashMap<String,String>();
										person_m.put("n_id", n_id);
										person_m.put("n_actorno", kv.contains(",")?kv.substring(0, kv.indexOf(",")):kv);
										Map<String,String> nmap = afAppDao.queryNodeInfoByNid(n_id);
										person_m.put("n_name", nmap.containsKey("N_NAME")?String.valueOf(nmap.get("N_NAME")):"");
										newLMap.add(person_m);
										break;
									}
									if(kv.contains(",")){
										String[] act = kv.split(",");
										for(int n = 0; n < act.length; n++){
											Map<String,String> person_m = new HashMap<String,String>();
											person_m.put("n_id", n_id);
											person_m.put("n_actorno", act[n]);
											Map<String,String> nmap = afAppDao.queryNodeInfoByNid(n_id);
											person_m.put("n_name", nmap.containsKey("N_NAME")?String.valueOf(nmap.get("N_NAME")):"");
											newLMap.add(person_m);
										}
									}else {
										Map<String,String> person_m = new HashMap<String,String>();
										person_m.put("n_id", n_id);
										person_m.put("n_actorno", kv);
										Map<String,String> nmap = afAppDao.queryNodeInfoByNid(n_id);
										person_m.put("n_name", nmap.containsKey("N_NAME")?String.valueOf(nmap.get("N_NAME")):"");
										newLMap.add(person_m);
									}
								}else {//多人并行审批；多人竞争审批；
									if(kv.contains(",")){
										String[] act = kv.split(",");
										for(int n = 0; n < act.length; n++){
											Map<String,String> person_m = new HashMap<String,String>();
											person_m.put("n_id", n_id);
											person_m.put("n_actorno", act[n]);
											Map<String,String> nmap = afAppDao.queryNodeInfoByNid(n_id);
											person_m.put("n_name", nmap.containsKey("N_NAME")?String.valueOf(nmap.get("N_NAME")):"");
											newLMap.add(person_m);
										}
									}else {
										Map<String,String> person_m = new HashMap<String,String>();
										person_m.put("n_id", n_id);
										person_m.put("n_actorno", kv);
										Map<String,String> nmap = afAppDao.queryNodeInfoByNid(n_id);
										person_m.put("n_name", nmap.containsKey("N_NAME")?String.valueOf(nmap.get("N_NAME")):"");
										newLMap.add(person_m);
									}
								}
							}else {//节点审批人匹配有误
								return map;
							}
						}
						map.put("actornos", newLMap);
					}
					return map;
				}
			}
		}
		return map;
	}

	/**
	 * 添加流程实例
	 * @param af_id 流程ID
	 * @param instanceid 流程实例ID
	 * @param p_id 流程审批ID
	 * @param userid 当前
	 */
	public int addAFInstance(String af_id,String instanceid,String p_id,String userid,String bizid){
		Map<String, String> smap = new HashMap<String, String>();
		smap.put("instance_id", instanceid);
		smap.put("state",AFConstant.CHECKING);
		smap.put("af_id",af_id);
		smap.put("p_id",p_id);
		smap.put("opt_id",bizid);
		smap.put("opt_person",userid);
		smap.put("opt_time",DateTimeUtils.getFormatCurrentTime());
		return afAppDao.addAFInstance(smap);
	}
	
	/**
	 * 添加流程审批过程数据
	 * @param instanceid 流程实例ID
	 * @param lmap 审批节点及审批人
	 * @return
	 */
	public int addAFApprProcess(String instanceid,List<Map<String,String>> lmap){
		int result = 0;
		Map<String,Integer> mp = new HashMap<String,Integer>();
		if(lmap.size() > 0){
			for(int i = 0; i < lmap.size(); i++){
				Map<String,String> map = lmap.get(i);
				String n_id = String.valueOf(map.get("n_id"));
				if(mp.containsKey(n_id)){
					mp.put(n_id, mp.get(n_id)+1);
				}else {
					mp.put(n_id, 0);
				}
				Map<String,String> nmap = new HashMap<String,String>();
				nmap.put("id", uuidFactory.getIDStr());
				nmap.put("n_id", n_id);
				nmap.put("app_person", String.valueOf(map.get("n_actorno")));
				nmap.put("app_state", "");
				nmap.put("app_content", "");
				nmap.put("instance_id", instanceid);
				nmap.put("opt_time", "");
				nmap.put("n_name", map.containsKey("n_name")&&
						map.get("n_name")!=null?String.valueOf(map.get("n_name")):"");
				nmap.put("role_id", map.containsKey("role_id")&&
						map.get("role_id")!=null?String.valueOf(map.get("role_id")):"");
				//区分是发起流程时添加审批过程记录数据；或是打回至某人添加的过程审批记录
				String order_sort = map.containsKey("order_id")?String.valueOf(map.get("order_id")):"";
				nmap.put("order_id", order_sort.isEmpty()?(mp.containsKey(n_id)?String.valueOf(mp.get(n_id)):"0"):order_sort);
				int rs = afAppDao.addAFAppProcessRecord(nmap);
				result += rs;
			}
		}
		return result;
	}

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
	public int addApprovalRecord(Map<String,String> map){
		String app_person = map.containsKey("actor_no")?String.valueOf(map.get("actor_no")):"";
		String instance_id = map.containsKey("instance_id")?String.valueOf(map.get("instance_id")):"";
		Map<String, String> pmap = new HashMap<String, String>();
		pmap.put("id",uuidFactory.getIDStr());
		pmap.put("n_id","");
		pmap.put("app_person",app_person);
		pmap.put("instance_id",instance_id);
		pmap.put("opt_time",DateTimeUtils.getFormatCurrentTime());
		pmap.put("n_name","发起人");
		if(map.containsKey("launch") && !String.valueOf(map.get("launch")).isEmpty()){
			pmap.put("app_state",AFConstant.APPROVAL);
			pmap.put("app_content","同意发起");
			pmap.put("order_id","0");
		}else {
			pmap.put("app_state",AFConstant.BACK);
			pmap.put("app_content",map.containsKey("app_content")?String.valueOf(map.get("app_content")):"");
			pmap.put("order_id","1");
		}
		pmap.put("role_id","");
		return afAppDao.addAFAppRecord(pmap);
	}
	
	/**
	 * 返回流程发起结果
	 * @param list_map
	 * @return
	 * 支持流程单条发起及批量发起
	 */
	public Map<String, Object> getResultOfStartAF(List<Map<String,String>> list_map){
		Map<String, Object> rsMap = new HashMap<String, Object>();
		List<Map<String,String>> lists = new ArrayList<Map<String,String>>();
		if(list_map.size() == 1){//单条发起流程
			Map<String,String> mp = list_map.get(0);
			lists.add(mp);
			rsMap.put("result", mp.get("result"));
			rsMap.put("msg", mp.get("msg"));
			rsMap.put("lists", lists);
			return rsMap;
		}else if(list_map.size() > 1){//批量发起流程
			int ct = 0;
			for(int j = 0; j < list_map.size(); j++){
				Map<String,String> mp = list_map.get(j);
				if(String.valueOf(mp.get("result")).equals("true")){
					ct++;
				}
				lists.add(mp);
			}
			if(ct==list_map.size()){
				rsMap.put("result", "true");
				rsMap.put("msg", "批量发起成功!");
				rsMap.put("batchMark", "batchLaunchSucc");
				rsMap.put("lists", lists);
			}else {
				rsMap.put("result", "false");
				rsMap.put("msg", "批量发起失败!");
				rsMap.put("batchMark", "batchLaunchFail");
				rsMap.put("lists", lists);
			}
		}
		return rsMap;
	}
	
	/**
	 * 根据员工工号查询参与审批过的所有流程实例ID
	 * @param actorno
	 * @return
	 */
	public List<String> queryInstancesByActorno(String actorno){
		List<String> lists = new ArrayList<String>();
		List<String> listM = afAppDao.queryAllInstByActorno(actorno);
		if(listM.size() > 0){
			return listM;
		}
		return lists;
	}
	
	/**
	 * 将表达式转换成可执行语句 
	 * @param r_exp
	 * @param map
	 * @return
	 */
	public String compileExp(String r_exp,Map<String, Object> map){
		r_exp = r_exp.replace(" ", "");
		r_exp = r_exp.replace("\n", "");
		byte[] r_exps = r_exp.getBytes();
		List<String> names = new ArrayList<String>();
		List<Integer> lbs = new ArrayList<Integer>();
		boolean isgetName = false;
		for (int i = 0; i < r_exps.length; i++) {
			if (r_exps[i] == 36) {
				if (!isgetName) {
					isgetName = true;
					continue;
				}else{
					isgetName = false;
					byte []bs = new byte[lbs.size()];
					for (int j = 0; j < lbs.size(); j++) {
						bs[j] = Byte.parseByte(lbs.get(j)+"");
					}
					lbs.clear();
					names.add(new String(bs));
				}
			}
			if (isgetName) {
				lbs.add((int) r_exps[i]);
			}
		}
		for (int i = 0; i < names.size(); i++) {
			String v = String.valueOf(map.get(names.get(i)));
			if (!isChangeToInt(v)&&!isChangeToDouble(v)) {
				r_exp = r_exp.replace("$"+names.get(i)+"$", "'"+v+"'");
			}else{
				r_exp = r_exp.replace("$"+names.get(i)+"$", v);
			}
		}
		return r_exp;
	}
	
	/**
	 * 字符串能否转成Int
	 * @param str
	 * @return
	 */
	public boolean isChangeToInt(String str){
		try {
			Integer.parseInt(str);
			return true;
		} catch (Exception e) {}
		return false;
	}
	
	/**
	 * 字符串能否转成double
	 * @param doub
	 * @return
	 */
	public boolean isChangeToDouble(String doub){
		try {
			Double.parseDouble(doub);
			return true;
		} catch (Exception e) {}
		return false;
	}
	
	/**
	 * 委托功能
	 * @param map
	 * @return
	 */
	public Map<String,Object> approvalEntrust(Map<String,Object> map){
		Map<String,Object> rsMap = new HashMap<String,Object>();
		//获取参数
		//流程实例ID
		String instance_id = map.containsKey("instance_id")?String.valueOf(map.get("instance_id")):"";
		//节点ID
		String n_id = map.containsKey("n_id")?String.valueOf(map.get("n_id")):"";
		//当前委托人
		String actor_no = map.containsKey("actor_no")?String.valueOf(map.get("actor_no")):"";
		//被委托人
		String entrust_actorno = map.containsKey("entrust_actorno")?String.valueOf(map.get("entrust_actorno")):"";
		//审批状态
		String appr_state = map.containsKey("appr_state")?String.valueOf(map.get("appr_state")):"";
		//审批内容
		String appr_content = map.containsKey("appr_content")?String.valueOf(map.get("appr_content")):"";
		//根据流程实例ID和节点ID查询审批过程表数据
		Map<String,String> newMap = new HashMap<String,String>();
		newMap.put("instance_id", instance_id);
		newMap.put("n_id", n_id);
		List<Map<String,String>> listM =  afAppDao.queryApprPerson(newMap);
		int order_id = 0;
		for(int i = 0; i < listM.size(); i++){
			Map<String,String> m = listM.get(i);
			String instanceid = m.containsKey("INSTANCE_ID")?String.valueOf(m.get("INSTANCE_ID")):"";
			String nid = m.containsKey("N_ID")?String.valueOf(m.get("N_ID")):"";
			String actorno = m.containsKey("APP_PERSON")?String.valueOf(m.get("APP_PERSON")):"";
			int sort = m.containsKey("ORDER_ID")?Integer.parseInt(String.valueOf(m.get("ORDER_ID"))):0;
			//匹配当前委托人
			if(instance_id.equals(instanceid) && n_id.equals(nid) && actor_no.equals(actorno)){
				//1.添加当前审批记录至审批记录表
				Map<String,String> recordmap = new HashMap<String,String>();
				recordmap.put("app_person", actorno);
				recordmap.put("instance_id", instanceid);
				recordmap.put("app_state", appr_state);
				recordmap.put("app_content", appr_content);
				recordmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
				int rs = afAppDao.addAFAppRecordByProcess(recordmap);
				//2.添加被委托人至审批过程表记录
				order_id = m.containsKey("ORDER_ID")?Integer.parseInt(String.valueOf(m.get("ORDER_ID"))):0;
				Map<String,String> nmap = new HashMap<String,String>();
				nmap.put("id", uuidFactory.getIDStr());
				nmap.put("n_id", nid);
				nmap.put("app_person", entrust_actorno);
				nmap.put("app_state", m.containsKey("APP_STATE")?String.valueOf(m.get("APP_STATE")):"");
				nmap.put("app_content", m.containsKey("APP_CONTENT")?String.valueOf(m.get("APP_CONTENT")):"");
				nmap.put("instance_id", instanceid);
				nmap.put("opt_time", m.containsKey("OPT_TIME")?String.valueOf(m.get("OPT_TIME")):"");
				nmap.put("n_name", String.valueOf(m.get("N_NAME")));
				nmap.put("role_id", m.containsKey("N_ROLE")?String.valueOf(m.get("N_ROLE")):"");
				nmap.put("order_id", String.valueOf(order_id+1));
				int rs_p = afAppDao.addAFAppProcessRecord(nmap);
				//3.删除当前审批人在审批过程表中的记录
				recordmap.put("n_id", nid);
				int del_pro = afAppDao.deleteAFAppProcessRecord(recordmap);
				if(rs > 0 && rs_p > 0 && del_pro > 0){
					rsMap.put("msg", "委托成功");
					rsMap.put("mark", "entrust_success");
					rsMap.put("curr_actorno", actorno);
					rsMap.put("entrust", entrust_actorno);
				}
			}
			//调整当前审批之外的审批人顺序
			if(sort > order_id){
				newMap.put("app_person", actorno);
				newMap.put("order_id", String.valueOf(sort+1));
				int rs_pro = afAppDao.updateAFProcRecordSort(newMap);
				if(rs_pro <= 0){
					rsMap.put(String.valueOf(sort), "该流程实例:"+instanceid+
							"所在节点:"+nid+"上的人:"+actorno+"所处顺序调整失败。");
				}
			}
		}
		//更新流程业务表中当前审批人记录
		Map<String,String> noMap = new HashMap<String,String>();
		noMap.put("instance_id", instance_id);
		noMap.put("n_id", n_id);
		Map<String,String> pmap=new HashMap<String, String>();
		pmap.put("instance_id", instance_id);
		pmap.put("NextAppPerson",getNextNodeApprPerson(noMap));
		afAppDao.updateNextAppPerson(pmap);
		return rsMap;
	}
}