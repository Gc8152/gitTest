package com.yusys.service.afconfig;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;


import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.dao.SWorkFlowInfoDao;
import com.yusys.dao.WorkFlowNodeDao;
@Service
public class SWorkFlowInfoService implements ISWorkFlowInfoService {
	@Resource
	private WorkFlowNodeDao workFlowNodeDao;
	@Resource
	private SWorkFlowInfoDao sWorkFlowInfoDao;
	@Resource
	private TaskDBUtil taskDBUtil;
	
	//查询所有流程信息
	@Override
	public Map<String, Object> queryAllProcessInfo(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		//从前台获取请求参数
		String af_name = RequestUtils.getParamValue(req, "af_name");
		String af_sys_name = RequestUtils.getParamValue(req, "af_sys_name");
		String af_state = RequestUtils.getParamValue(req, "af_state");
		String af_id = RequestUtils.getParamValue(req, "af_id");
		try {
			//中文避免乱码
			if(af_name!=null){
				af_name=URLDecoder.decode(af_name,"UTF-8");
			}
			if(af_sys_name!=null){
				af_sys_name=URLDecoder.decode(af_sys_name,"UTF-8");
			}
			if(af_state!=null){
				af_state=URLDecoder.decode(af_state,"UTF-8");
			}
		} catch (Exception e) {			
			e.printStackTrace();
		}
		//模糊查询
		if(af_sys_name!=null && !"".equals(af_sys_name)){
			pmap.put("af_sys_name","%"+af_sys_name+"%");
		}
		if(af_name!=null && !"".equals(af_name)){
			pmap.put("af_name","%"+af_name+"%");
		}
		if(af_state!=null && !"".equals(af_state)){
			pmap.put("af_state","%"+af_state+"%");
		}
		if(af_id!=null && !"".equals(af_id)){
			pmap.put("af_id",af_id);
		}
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		//调用dao查询数据,返回所有的流程信息
		List<Map<String, Object>> list = sWorkFlowInfoDao.queryAllProcessInfo(pmap);
		retmap.put("rows", list);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}
	//插入一条流程信息
	@Override
	public Map<String, String> addOneProcessInfo(HttpServletRequest req,String userid) {
		//存放返回结果
		Map<String, String> resultMap=new HashMap<String, String>();
		//获取当前日期"yyyy-MM-dd"
		String today = DateTimeUtils.getFormatCurrentTime();
		//生成序列赋给主键
		String af_id = taskDBUtil.getSequenceValByName("AF_SEQ_AF_INFO");
		try{
			//必填参数列表
			String[] must=new String[]{"af_name","af_state","af_sys_name"};
			//非必填的参数列表
			String[] nomust=new String[]{"af_memo"};
			Map<String, Object> pmap=RequestUtils.requestToMapTwo(req, must, nomust);
			pmap.put("af_id", af_id);
			pmap.put("opt_time", today);//插入操作时间
			pmap.put("opt_person", userid);//插入操作人
			int rs = sWorkFlowInfoDao.addOneProcessInfo(pmap);
			if(rs > 0){
				resultMap.put("result", "true");
				resultMap.put("af_id", af_id);
				return resultMap;
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//点击流程列表页删除按钮，修改流程状态为停用
	@Override
	public Map<String, String> deleteOneProcessInfo(HttpServletRequest req) {
		String af_id = RequestUtils.getParamValue(req, "af_id");//获取流程表id
		Map<String,String> wmap = new HashMap<String,String>();
		wmap.put("af_id", af_id);
		wmap.put("af_state", "01");
		try {
			int rs = sWorkFlowInfoDao.updateProcessSateById(wmap);
			if(rs > 0){
				wmap.put("result", "true");
			}
		} catch (Exception e) {
			e.printStackTrace();
			wmap.put("result", "false");
		}
		return wmap;
	}
	/*//根据选择的id删除流程表中该信息
	@Override
	public Map<String, String> deleteOneProcessInfo(HttpServletRequest req) {
		String af_id = RequestUtils.getParamValue(req, "af_id");//获取流程表id
		Map<String,String> map = new HashMap<String,String>();
		Map<String,String> wmap = new HashMap<String,String>();
		Map<String,Object> wmap1 = new HashMap<String,Object>();
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();//存储矩阵表记录
		List<Map<String,Object>> list1 = new ArrayList<Map<String,Object>>();//存储审批流程表记录
		List<Map<String,Object>> list2 = new ArrayList<Map<String,Object>>();//存储节点记录
		Map<String,String> result_map = new HashMap<String,String>();
		Map<String,Object> result_map1 = new HashMap<String,Object>();
		Map<String,String> result_map2 = new HashMap<String,String>();
		Map<String,String> result_map3 = new HashMap<String,String>();
		String m_id = "";
		String r_id = "";
		wmap.put("af_id", af_id);
		wmap1.put("af_id", af_id);
		try {
			//通过流程id获取矩阵表矩阵id,从而获得规则id
			list = sWorkFlowInfoDao.queryAllMatrixById(wmap1);
			if(list.size()>0){
				for(Map<String,Object> map1:list){
					m_id=(String)map1.get("M_ID");//获取矩阵id
					r_id=(String)map1.get("R_ID");//获取矩阵表规则id
					result_map.put("m_id", m_id);
					result_map.put("r_id", r_id);
					result_map1.put("m_id", map1.get("M_ID"));
					//通过规则id删除规则表信息
					sWorkFlowInfoDao.deleteOneRuleInfo(result_map);
					//通过矩阵id获取审批流程表审批规则id
					list1 = sWorkFlowInfoDao.queryMatixRoteById(result_map1);
					if(list1.size()>0){
						for(Map<String,Object> map2:list1){
							r_id=(String)map2.get("R_ID");
							result_map2.put("r_id", r_id);
							//通过审批规则id删除规则表对应信息
							sWorkFlowInfoDao.deleteOneRuleInfo(result_map2);
							//通过矩阵id删除审批流程表信息
							sWorkFlowInfoDao.deleteProcessByMId(result_map);
						}
					}
				}
				//根据流程id删除矩阵表信息
				sWorkFlowInfoDao.deleteMatrixInfoByWfId(wmap);
			}
			//通过流程id获取节点id,从而获取规则id
			list2 = workFlowNodeDao.queryAllNode4WF(wmap1);
			if(list2.size()>0){
				for(Map<String,Object> map3:list2){
					r_id=(String)map3.get("R_ID");
					result_map3.put("r_id", r_id);
					//通过id删除规则表信息
					sWorkFlowInfoDao.deleteOneRuleInfo(result_map3);
				}
				//根据流程id删除节点表信息
				sWorkFlowInfoDao.deleteNoteInfoByWfId(wmap);
			}
			//根据id删除流程表信息
			sWorkFlowInfoDao.deleteOneProcessInfo(wmap);
			map.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			map.put("result", "false");
		}
		return map;
	}*/
	//修改一条流程记录
	@Override
	public Map<String, Object> updateOneProcessInfo(HttpServletRequest req,String userid) {
		Map<String,Object> resultMap = new HashMap<String, Object>();//
		Map<String,String> map = new HashMap<String, String>();//存储传过来的参数
		String af_id = RequestUtils.getParamValue(req,"af_id");//获取请求参数
		String af_name = RequestUtils.getParamValue(req,"af_name");
		String af_sys_name = RequestUtils.getParamValue(req,"af_sys_name");
		String af_state = RequestUtils.getParamValue(req,"af_state");
		String af_memo = RequestUtils.getParamValue(req,"af_memo");
		//获取当前日期"yyyy-MM-dd"
		String today = DateTimeUtils.getFormatCurrentTime();
		try {
			if(af_memo==null||"".equals(af_memo)){
				map.put("af_memo", "");
			}else{
				map.put("af_memo", af_memo);
			}
			map.put("af_id", af_id);
			map.put("af_name", af_name);
			map.put("af_sys_name", af_sys_name);
			map.put("af_state", af_state);
			map.put("opt_person", userid);
			map.put("opt_time", today);
			resultMap.put("result", "true");
			int rs = sWorkFlowInfoDao.updateOneProcessInfo(map);
			if(rs > 0){
				resultMap.put("result", "true");
				resultMap.put("af_id", af_id);
				return resultMap;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//通过流程id查询流程矩阵表中所有信息
	@Override
	public Map<String, Object> queryMatrixById(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		//从前台获取请求参数
		String af_id = RequestUtils.getParamValue(req, "af_id");
		if(af_id!=null && !"".equals(af_id)){
			pmap.put("af_id",af_id);
		}
		String m_id = RequestUtils.getParamValue(req, "m_id");
		if(m_id!=null && !"".equals(m_id)){
			pmap.put("m_id",m_id);
		}
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		//通过流程id,返回所有的矩阵信息
		List<Map<String, Object>> list = sWorkFlowInfoDao.queryMatrixById(pmap);
		retmap.put("rows", list);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}
	//通过流程id查询节点表中对应信息
	@Override
	public Map<String, Object> queryAllNode4AF(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		//从前台获取请求参数
		String af_id = RequestUtils.getParamValue(req, "af_id");
		pmap.put("af_id",af_id);
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		//通过流程id,返回所有的矩阵信息
		List<Map<String, Object>> list = workFlowNodeDao.queryAllNodeAF(pmap);
		retmap.put("rows", list);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}
	//向规则表和矩阵表插入数据
	@Override
	public Map<String, String> addInfo4RuleAndMatix(HttpServletRequest req,String userid) {
		Map<String,String> resultMap = new HashMap<String, String>();//存放返回结果标识
		Map<String,String> ruleMap = new HashMap<String, String>();//存储插入规则表的数据
		Map<String,String> matixMap = new HashMap<String, String>();//存储插入矩阵表的数据
		Map<String,String> recordMap = new HashMap<String, String>();//存储矩阵对应的节点
		//生成规则表id
		String r_id = taskDBUtil.getSequenceValByName("AF_SEQ_AF_RULE");
		//生成矩阵表id
		String m_id = taskDBUtil.getSequenceValByName("AF_SEQ_AF_MATRIX");
		//获取请求参数
		String r_name = RequestUtils.getParamValue(req,"r_name");//规则名称
		String r_exp = RequestUtils.getParamValue(req,"r_exp");//规则表达式
		String af_id = RequestUtils.getParamValue(req,"af_id");//流程id
		String m_state = RequestUtils.getParamValue(req,"m_state");//状态
		String record = RequestUtils.getParamValue(req,"records");//节点记录
		try {
			String obj = "";
			String n_id = "";
			String today = DateTimeUtils.getFormatCurrentTime();
			//向规则表中插入数据
			ruleMap.put("r_id", r_id);
			ruleMap.put("r_name", r_name);
			ruleMap.put("r_exp", r_exp);
			ruleMap.put("opt_time", today);
			ruleMap.put("memo", "");
			ruleMap.put("opt_person", userid);
			sWorkFlowInfoDao.addOneRuleInfo(ruleMap);
			//获取插入矩阵表的数据
			Object[] records = JsonUtils.jsonToObjectArray(record);
			for (int i = 0; i < records.length; i++) {
				String order_id = String.valueOf(i+1);
				obj = records[i].toString();
				recordMap = JsonUtils.jsonToMapTwo(obj);
				n_id = recordMap.get("N_ID");
				matixMap.put("m_id", m_id);
				matixMap.put("af_id", af_id);
				matixMap.put("n_id", n_id);
				matixMap.put("r_id", r_id);
				matixMap.put("m_state", m_state);
				matixMap.put("order_id", order_id);
				matixMap.put("opt_person", userid);
				matixMap.put("opt_time", today);
				matixMap.put("memo", "");
				sWorkFlowInfoDao.addOneMatrixInfo(matixMap);
			}
			resultMap.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	//根据id删除矩阵表信息和规则表信息
	@Override
	public Map<String, String> deleteInfo4RuleAndMatix(HttpServletRequest req) {
		String r_id = RequestUtils.getParamValue(req, "r_id");//矩阵规则ID
		String m_id = RequestUtils.getParamValue(req, "m_id");//矩阵ID
		Map<String,String> rMap = new HashMap<String, String>();
		Map<String,String> mMap = new HashMap<String, String>();
		Map<String,Object> mMap1 = new HashMap<String, Object>();
		Map<String,String> resultMap = new HashMap<String, String>();
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		try {
			rMap.put("r_id", r_id);
			mMap.put("m_id", m_id);
			mMap.put("m_state","01");
			//物理删除
			/*mMap1.put("m_id", m_id);
			//通过矩阵id获取审批流程表审批规则id
			list = sWorkFlowInfoDao.queryMatixRoteById(mMap1);
			if(list.size()>0){
				for(Map<String,Object> map1:list){
					r_id=(String)map1.get("R_ID");
					mMap.put("r_id", r_id);
					//删除审批规则信息
					sWorkFlowInfoDao.deleteOneRuleInfo(mMap);
					//删除流程审批表信息
					sWorkFlowInfoDao.deleteProcessByMId(mMap);
				}
			}
			//删除矩阵表信息
			sWorkFlowInfoDao.deleteOneMatInfo(mMap);
			//删除规则表信息
			sWorkFlowInfoDao.deleteOneRuleInfo(rMap);*/
			//假删除
			sWorkFlowInfoDao.updateMatrixSateById(mMap);
			resultMap.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	//根据id更新矩阵表信息和规则表信息
	@Override
	public Map<String, String> updateInfo4RuleAndMatix(HttpServletRequest req,String userid) {
		Map<String,String> resultMap = new HashMap<String, String>();//存放返回结果标识
		Map<String,String> ruleMap = new HashMap<String, String>();//存储更新规则表的数据
		Map<String,String> matixMap = new HashMap<String, String>();//存储更新矩阵表的数据
		Map<String,String> recordMap = new HashMap<String, String>();//存储矩阵的节点
		//1.获取请求参数
		String r_name = RequestUtils.getParamValue(req,"r_name");//规则名称
		String r_exp = RequestUtils.getParamValue(req,"r_exp");//规则表达式
		String m_state = RequestUtils.getParamValue(req,"m_state");//规则表达式
		String r_id = RequestUtils.getParamValue(req,"r_id");//规则id
		String m_id = RequestUtils.getParamValue(req,"m_id");//矩阵id
		String af_id = RequestUtils.getParamValue(req,"af_id");//流程id
		String record = RequestUtils.getParamValue(req,"records");//节点记录
		//2.准备待更新数据
		Object[] records = JsonUtils.jsonToObjectArray(record);
		String obj = "";
		String n_id = "";
		String order_id = "";
		try {
			String today = DateTimeUtils.getFormatCurrentTime();
			//向规则表中更新数据
			ruleMap.put("r_name", r_name);
			ruleMap.put("r_exp", r_exp);
			ruleMap.put("opt_time", today);
			ruleMap.put("r_id", r_id);
			ruleMap.put("memo", "");
			sWorkFlowInfoDao.updateOneRuleInfo(ruleMap);
			ruleMap.put("m_id", m_id);
			//根据矩阵id删除矩阵表数据
			sWorkFlowInfoDao.deleteOneMatInfo(ruleMap);
			//获取更新矩阵表的数据
			for(int i=0;i<records.length;i++){
				obj = records[i].toString();
				recordMap = JsonUtils.jsonToMapTwo(obj);
				n_id = recordMap.get("N_ID");
				matixMap.put("n_id", n_id);
				matixMap.put("m_id", m_id);
				matixMap.put("opt_time", today);
				matixMap.put("r_id", r_id);
				matixMap.put("m_state", m_state);
				matixMap.put("af_id", af_id);
				matixMap.put("opt_person", userid);
				matixMap.put("memo", "");
				matixMap.put("order_id", String.valueOf(i+1));
				sWorkFlowInfoDao.addOneMatrixInfo(matixMap);
			}
			resultMap.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	/*
	 * 增加审批流程 
	 */
	@Override
	public Map<String, String> addApproveRuleInfo(HttpServletRequest req,String userid) {
		String []must=new String[]{"m_id","r_id","nids"};
		String []nomust=new String[]{"p_id","order_id","memo","af_id"};
		Map<String, Object> pmap=RequestUtils.requestToMapTwo(req, must, nomust);
		Map<String, String> smap=new HashMap<String, String>();
		if (pmap==null) {
			smap.put("result", "false");
			smap.put("msg", "确少必填项!");
			return smap;
		}
		if ("".equals(pmap.get("p_id").toString().trim())) {
			pmap.put("p_id", taskDBUtil.getSequenceValByName("AF_SEQ_AF_ROTE"));
		}else{
			sWorkFlowInfoDao.deleteMatrixRoteByPId(pmap.get("p_id").toString());
		}
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//插入操作时间
		pmap.put("opt_person", userid);
		pmap.put("state", "00");
		String [] nids = pmap.get("nids").toString().split(",");
		for (int i = 0; i < nids.length; i++) {
			if (!"".equals(nids[i].trim())) {
				pmap.put("n_id", nids[i]);
				Map<String,String> ord_map = sWorkFlowInfoDao.getProNodeOrderId(pmap);
				pmap.put("order_id", ord_map.containsKey("ORDER_ID")?String.valueOf(ord_map.get("ORDER_ID")):"0");
				sWorkFlowInfoDao.addApproveRuleInfo(pmap);
			}
		}
		smap.put("result", "true");
		return smap;
	}
	//根据规则ID删除矩阵下所有路由节点和审批规则
	@Override
	public Map<String, String> deleteMatrixRoteById(HttpServletRequest req) {
		String r_id = RequestUtils.getParamValue(req, "r_id");
		Map<String,String> rMap = new HashMap<String, String>();
		Map<String,String> resultMap = new HashMap<String, String>();
		try {
			rMap.put("r_id", r_id);
			sWorkFlowInfoDao.deleteOneMatInfo(rMap);
			sWorkFlowInfoDao.deleteMatrixRoteById(rMap);
			resultMap.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	@Override
	public Map<String, Object> queryMatrixNodeInfos(HttpServletRequest req) {
		Map<String, Object> map=new HashMap<String, Object>();
		String []must=new String[]{"m_id","af_id"};
		Map<String, Object> pmap=RequestUtils.requestToMapTwo(req, must, null);
		if (pmap==null) {
			return new HashMap<String, Object>();
		}
		List<Map<String, String>> rowsData = sWorkFlowInfoDao.queryMatrixNodeInfos(pmap);
		map.put("rows", rowsData);
		map.put("total", pmap.get("total"));
		return map;
	}
	@Override
	public Map<String, String> deleteAFProcess(HttpServletRequest req) {
		String p_id=RequestUtils.getParamValue(req, "p_id");
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("p_id", p_id);
		pmap.put("state", "01");
		sWorkFlowInfoDao.updateMatrixProcessState(pmap);
		Map<String, String> smap=new HashMap<String, String>();
		smap.put("result", "true");
		return smap;
	}
	//根据id查找矩阵下的审批路由信息
	@Override
	public Map<String, Object> queryMatixProcessByMId(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String m_id = RequestUtils.getParamValue(req,"m_id");
		String af_id = RequestUtils.getParamValue(req,"af_id");
		pmap.put("m_id",m_id);
		pmap.put("af_id",af_id);
		List<Map<String, String>> list=sWorkFlowInfoDao.queryMatixRoteByMId(pmap);
		if(list.size()>0){
			for (int i = 0; i < list.size(); i++) {
				pmap.put("p_id", (String) list.get(i).get("P_ID"));
				String ids=sWorkFlowInfoDao.queryMProcessNodeIds(pmap).toString();
				list.get(i).put("nids", ","+ids.substring(1, ids.length()-1).replace(" ", "")+",");
			}
		}
		retmap.put("rows", list);
		retmap.put("total", list.size());
		return retmap;
	}
	/**
	 * 增加流程规则 
	 * @param req
	 */
	public Map<String,String>  addAFRule(HttpServletRequest req,String userid){
		Map<String,String> smap=new HashMap<String, String>();
		Map<String,String> ruleMap = new HashMap<String, String>();//存储插入规则表的数据
		String r_name=RequestUtils.getParamValue(req, "r_name");
		String r_exp=RequestUtils.getParamValue(req, "r_exp");
		if (r_name==null||r_exp==null||"".equals(r_name.trim())||"".equals(r_exp.trim())) {
			smap.put("result", "false");
		}
		//生成规则表id
		String r_id = taskDBUtil.getSequenceValByName("AF_SEQ_AF_RULE");
		//向规则表中插入数据
		ruleMap.put("r_id", r_id);
		ruleMap.put("r_name", r_name);
		ruleMap.put("r_exp", r_exp);
		ruleMap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		ruleMap.put("memo", "");
		ruleMap.put("opt_person", userid);
		sWorkFlowInfoDao.addOneRuleInfo(ruleMap);
		smap.put("r_id", r_id);
		smap.put("result", "true");
		return smap;
	}
	//修改审批规则
	@Override
	public Map<String, String> updateAFRule(HttpServletRequest req, String userid) {
		Map<String,String> map = new HashMap<String, String>();
		Map<String,String> ruleMap = new HashMap<String, String>();
		//1.获取相关值
		String r_id = RequestUtils.getParamValue(req, "r_id");
		String r_name = RequestUtils.getParamValue(req, "r_name");
		String r_exp = RequestUtils.getParamValue(req, "r_exp");
		//2.
		ruleMap.put("r_id", r_id);
		ruleMap.put("r_name", r_name);
		ruleMap.put("r_exp", r_exp);
		ruleMap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		ruleMap.put("opt_person", userid);
		ruleMap.put("memo", "");
		int rs = sWorkFlowInfoDao.updateOneRuleInfo(ruleMap);
		map.put("r_id", r_id);
		if(rs > 0){
			map.put("result", "true");
		}else {
			map.put("result", "false");
		}
		return map;
	}
}
