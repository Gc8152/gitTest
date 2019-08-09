package com.yusys.service.afapp;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.yusys.Utils.RequestUtils;
import com.yusys.dao.ApprovalDao;

@Service
public class ApprovalService implements IApprovalService{
	
	@Resource
	private ApprovalDao approvalDao;

	@Override
	public Map<String, Object> queryApprovalList(HttpServletRequest req) {
		Map<String, Object> rsMap = new HashMap<String,Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		String p_name = RequestUtils.getParamValue(req, "p_name");
		String af_sys_name = RequestUtils.getParamValue(req, "af_sys_name");
		String p_id = RequestUtils.getParamValue(req, "p_id");
		String n_id = RequestUtils.getParamValue(req, "n_id");
		String app_person = RequestUtils.getParamValue(req, "app_person");
		try {
			if(p_name != null){
				p_name = URLDecoder.decode(p_name,"UTF-8");
			}
		} catch (Exception e) {			
			e.printStackTrace();
		}
		if(p_name != null && !"".equals(p_name)){
			pmap.put("p_name","%"+p_name+"%");
		}
		if(af_sys_name != null && !"".equals(af_sys_name)){
			pmap.put("af_sys_name",af_sys_name);
		}
		if(p_id != null && !"".equals(p_id)){
			pmap.put("p_id",p_id);
		}
		if(n_id != null && !"".equals(n_id)){
			pmap.put("n_id",n_id);
		}
		if(app_person != null && !"".equals(app_person)){
			pmap.put("app_person",app_person);
		}
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String, Object>> list = approvalDao.queryApprovalList(pmap);
		rsMap.put("rows", list);
		rsMap.put("total", pmap.get("total"));
		return rsMap;
	}

	@Override
	public Map<String,Object> updateApprPerson(HttpServletRequest req) {
		Map<String,Object> rsMap = new HashMap<String,Object>();
		//TODO
		Map<String,String> stMap = new HashMap<String,String>();
		String ud_app_person = req.getParameter("actorno");
		String app_person = req.getParameter("app_person");
		String n_id = req.getParameter("n_id");
		String instance_id = req.getParameter("instance_id");
		stMap.put("instance_id", instance_id);
		stMap.put("n_id", n_id);
		stMap.put("app_person", app_person);
		stMap.put("ud_app_person", ud_app_person);
		int rs = approvalDao.updateApprovalPerson(stMap);
		if(rs > 0){
			rsMap.put("result", "true");
			return rsMap;
		}
		rsMap.put("result", "false");
		return rsMap;
	}
}
