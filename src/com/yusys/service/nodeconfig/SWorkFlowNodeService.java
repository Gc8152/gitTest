package com.yusys.service.nodeconfig;

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
public class SWorkFlowNodeService implements ISWorkFlowNodeService{
	@Resource
	private SWorkFlowInfoDao sWorkFlowInfoDao;
	@Resource
	private WorkFlowNodeDao workFlowNodeDao;
	@Resource
	private TaskDBUtil taskDBUtil;
	
	//新增保存
	@Override	
	public Map<String, String> addNodeInfo(HttpServletRequest req,String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"n_name","n_state","n_type","af_id","n_person"};
			//非必填的参数列表
			String[] nomust=new String[]{"n_factor","n_roleCode","memo"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("r_id", "");
			pmap.put("n_rule_type", "");
			String n_id = taskDBUtil.getSequenceValByName("AF_SEQ_AF_NODE");
			pmap.put("n_id", n_id);
			pmap.put("opt_person", userid);
			pmap.put("opt_time",  DateTimeUtils.getFormatCurrentTime());
			workFlowNodeDao.addNodeInfo(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//修改保存
	@Override
	public Map<String, String> updateNodeInfo(HttpServletRequest req,String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"n_name","n_state","n_type","af_id","n_person","n_id"};
			//非必填的参数列表
			String[] nomust=new String[]{"n_factor","n_roleCode","memo"};
			Map<String, Object> pmap=RequestUtils.requestToMapTwo(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("opt_person", userid);//创建人			
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//创建时间
			//修改节点表数据
			int rs = workFlowNodeDao.updateNodeInfo(pmap);
			if(rs > 0){
				resultMap.put("result", "true");
				return resultMap;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	
	//删除节点
	@Override
	public Map<String, String> deleteNodeInfo(HttpServletRequest req) {
		Map<String, String> resultMap=new HashMap<String, String>();
		Map<String, String> pmap=new HashMap<String, String>();
		String n_id = RequestUtils.getParamValue(req, "n_id");
		pmap.put("n_id", n_id);	
		try {
			int rs = workFlowNodeDao.deleteNodeInfo(pmap);
			if(rs > 0){
				resultMap.put("result", "true");
				return resultMap;
			}
		} catch (Exception e) {
			resultMap.put("result", "false");
			e.printStackTrace();
		}
		return resultMap;
	}
	//查询流程ID下的节点
	@Override
	public Map<String, Object> queryAllNodeAF(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		//从前台获取请求参数
		String af_id = RequestUtils.getParamValue(req, "af_id");
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		pmap.put("af_id",af_id);
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		//调用dao查询数据,返回所有的流程信息
		List<Map<String, Object>> list=workFlowNodeDao.queryAllNodeAF(pmap);
		retmap.put("rows", list);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}

	//根据条件查找一个节点信息
	@Override
	public Map<String, String> queryOneNodeInfo(HttpServletRequest req) {
		Map<String, String> resultMap=new HashMap<String, String>();
		Map<String, String> pmap=new HashMap<String, String>();
		String af_id = RequestUtils.getParamValue(req, "af_id");
		String flag = RequestUtils.getParamValue(req, "flag");
		pmap.put("af_id", af_id);
		List<Map<String, Object>> nodeList = workFlowNodeDao.queryOneNodeInfo(pmap);
		//新增保存的校验
		if("add".equals(flag)&&nodeList.size()>0){
			resultMap.put("result", "true");
		//修改保存的校验	
		}else if("update".equals(flag)&&nodeList.size()>1){
			resultMap.put("result", "true");
		}else{
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	//根据ID查找一个节点信息
	@Override
	public Map<String, Object> queryOneNodeById(HttpServletRequest req) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String n_id = RequestUtils.getParamValue(req, "n_id");
		pmap.put("n_id", n_id);
		List<Map<String, Object>> nodeList = workFlowNodeDao.queryOneNodeInfo(pmap);
		if(nodeList.size()>0){
			resultMap = (Map<String, Object>)nodeList.get(0);
		}else{
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	//根据流程ID查询所属业务系统下的节点要素
	@Override
	public Map<String, Object> queryNodeFactorById(HttpServletRequest req) {
		// TODO Auto-generated method stub
		Map<String,Object> rsMap = new HashMap<String,Object>();
		String af_id = RequestUtils.getParamValue(req, "af_id");
		Map<String,String> map = new HashMap<String,String>();
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		map.put("af_id", af_id);
		map.put("limit",limit);
		map.put("offset",offset);
		List<Map<String, Object>> list = workFlowNodeDao.queryNodeFactorById(map);
		rsMap.put("rows", list);
		rsMap.put("total", map.get("total"));
		return rsMap;
	}
}
