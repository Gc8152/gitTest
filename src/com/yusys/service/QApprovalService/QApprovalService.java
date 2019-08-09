package com.yusys.service.QApprovalService;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.dao.AFAppDao;
import com.yusys.dao.QApprovalDao;
@Service
@Transactional
public class QApprovalService implements IQApprovalService{
	
	@Resource
	private QApprovalDao qApprovalDao;
	
	@Resource
	private AFAppDao afAppDao;

	@Override
	public Map<String, Object> queryApprovalList(HttpServletRequest req) {
		Map<String, Object> rsMap = new HashMap<String,Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		String biz_id = RequestUtils.getParamValue(req, "biz_id");
		String af_name = RequestUtils.getParamValue(req, "af_name");
		String instance_state = RequestUtils.getParamValue(req, "instance_state");
		try {
			if(af_name != null){
				af_name = URLDecoder.decode(af_name,"UTF-8");
			}
		} catch (Exception e) {			
			e.printStackTrace();
		}
		if(biz_id != null && !"".equals(biz_id)){
			pmap.put("biz_id",biz_id);
		}
		if(af_name != null && !"".equals(af_name)){
			pmap.put("af_name","%"+af_name+"%");
		}
		if(instance_state != null && !"".equals(instance_state)){
			pmap.put("instance_state",instance_state);
		}
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String, Object>> list = qApprovalDao.queryApprovalList(pmap);
		rsMap.put("rows", list);
		rsMap.put("total", pmap.get("total"));
		return rsMap;
	}

	@Override
	public Map<String, Object> queryProcessDetail(HttpServletRequest req) {
		Map<String, Object> rsMap=new HashMap<String, Object>();
		try {
			String[] must = new String[]{"instance_id"};
			String[] nomust = new String[]{};
			Map<String, String> pmap = RequestUtils.requestToMap(req, must, nomust);
			if (pmap == null) {
				rsMap.put("result", false);
				return rsMap;
			}
			List<Map<String, String>> list = qApprovalDao.queryProcessDetail(pmap);
			if(list.size() > 0){
				rsMap.put("result", true);
				rsMap.put("rows", list);
			}else{
				rsMap.put("result", false);
			}
			return rsMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		rsMap.put("result", "false");
		return rsMap;
	}
	//修改流程节点审批人
	@Override
	public Map<String, String> updateAppPerson(HttpServletRequest req,String user_id) {
		Map<String, String> resultMap =new HashMap<String, String>();
		try {
			Map<String, String> pmap = new HashMap<String,String>();
			String new_app_person = req.getParameter("app_person");
			String instance_id = req.getParameter("instance_id");
			String n_id = req.getParameter("n_id");
			String old_app_person = req.getParameter("app_person_code");
			//1.修改流程节点审批人
			pmap.put("new_app_person", new_app_person);
			pmap.put("instance_id", instance_id);
			pmap.put("n_id", n_id);
			pmap.put("old_app_person", old_app_person);
			int rs = afAppDao.updateAppPerson(pmap);
			//2.记录流程审批节点变更记录
			pmap.put("mark", req.getParameter("mark"));
			pmap.put("opt_person", user_id);
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
			int rs_c = afAppDao.addAppPersonChangeInfo(pmap);
			//3.返回操作结果
			if(rs > 0 && rs_c > 0){
				resultMap.put("result", "true");
			}else {
				resultMap.put("result", "flase");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}				
		return resultMap;
	}
}
