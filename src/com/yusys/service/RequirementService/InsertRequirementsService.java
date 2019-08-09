package com.yusys.service.RequirementService;

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
import com.yusys.Utils.TaskDBUtil;
import com.yusys.dao.GuanChongDao;

import com.yusys.entity.GuanChong;


@Service
@Transactional
public class InsertRequirementsService implements IInsertRequirementsService {
	@Resource
	private GuanChongDao guanchongDao;
	
	@Resource
    private TaskDBUtil taskDBUtil;
	
	@Override
	public Map<String, String> insertRequirementInfo(HttpServletRequest req) {
		
		Map<String, String> resultMap =new HashMap<String, String>();
		try{			
			
			String[] must=new String[]{"req_name","req_businesser","req_business_phone","req_put_dept","req_dept","req_operation_date","req_description"};
			
			String[] noMust=new String[]{};
			
			Map<String,String> pmap=RequestUtils.requestToMap(req, must, noMust);
			
			if(pmap==null){
				resultMap.put("result", "false");
				return resultMap;
			}
			
			guanchongDao.insertRequirements(pmap);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;	
		
	}

	@Override
	public Map<String, String> updateRequirementsInfo(HttpServletRequest req) {

		Map<String, String> resultMap =new HashMap<String, String>();
		try{			
			
			String[] must=new String[]{"req_name","req_businesser","req_business_phone","req_put_dept","req_dept","req_operation_date","req_description"};
			
			String[] noMust=new String[]{};
			
			Map<String,String> pmap=RequestUtils.requestToMap(req, must, noMust);
			
			if(pmap==null){
				resultMap.put("result", "false");
				return resultMap;
			}
			guanchongDao.updateRequirements(pmap);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;	
		
	}

	@Override
	public Map<String, Object> queryAllUser(HttpServletRequest req) {
		Map<String, Object> map=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		
		String req_name = RequestUtils.getParamValue(req, "req_name");
		try {
			req_name=URLDecoder.decode(req_name,"UTF-8");
		} catch (Exception e) {			
			e.printStackTrace();
		}
		String state = RequestUtils.getParamValue(req, "state");
		
		pmap.put("req_name",req_name);			
		
		
		pmap.put("state",state);
		
		
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		System.out.println("pmap:"+pmap);
		List<Map<String, String>> m=guanchongDao.queryAllUser(pmap);
		
		map.put("rows", m);
		map.put("total", pmap.get("total"));
		return map;
	}

	@Override
	public Map<String, String> deleteRequirement(HttpServletRequest req) {
		Map<String, String> resultMap=new HashMap<String, String>();
		
		try{
			String req_name=RequestUtils.getParamValue(req, "req_name");
			System.out.println("req_name:"+req_name);
			Map<String, Object> pmap=new HashMap<String, Object>();
			
			pmap.put("req_name", req_name);
			
			System.out.println("pmap"+pmap);
			try {
				guanchongDao.deleteRequirement(pmap);
				resultMap.put("result", "true");
				return resultMap;
			} catch (Exception e) {
				e.printStackTrace();
			}

		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;

	}

	

	

	
	
	
	
	
}
