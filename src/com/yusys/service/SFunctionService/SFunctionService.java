package com.yusys.service.SFunctionService;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.dao.SFunctionDao;
import com.yusys.dao.SRoleDao;
import com.yusys.entity.SFunction;
@Service
@Transactional
public class SFunctionService implements ISFunctionService{
	@Resource
    private SFunctionDao sFunctionDao;
	@Resource
	private SRoleDao sRoleDao;
	 /*
	   * 查询全部常用功能
	   */
	@Override
	public Map<String, Object> queryAllFunctions(HttpServletRequest req,
			String userid) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		String []nomust=new String[]{"menu_code","menu_name"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, null, nomust);
		
		if (pmap!=null&&pmap.containsKey("menu_name")&&!"".equals(pmap.get("menu_name"))) {
			try {
				pmap.put("menu_name", "%"+URLDecoder.decode(pmap.get("menu_name"), "UTF-8")+"%");
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		pmap.put("userid", userid);
		List<Map<Object, String>> m=sFunctionDao.queryAllFunctions(pmap);
		retmap.put("rows", m);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}
	public SFunctionDao getsFunctionDao() {
		return sFunctionDao;
	}
	public void setsFunctionDao(SFunctionDao sFunctionDao) {
		this.sFunctionDao = sFunctionDao;
	}
	/*
	 * 根据menu_code删除常用功能
	 */
	@Override
	public Map<String, String> delFunctionByMenuCode(HttpServletRequest req,
			String userid) {	
		Map<String,String> resultMap=new HashMap<String, String>();
		String menu_code=RequestUtils.getParamValue(req, "menu_code");
		if (menu_code==null||"".equals(menu_code.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("menu_code", menu_code);
		try{
			sFunctionDao.delFunctionByMenucode(pmap);
			sRoleDao.delFunctionByMenuCode(pmap);
			sFunctionDao.delWorkbenchFunctionByMenucode(pmap);
			resultMap.put("result", "true");
			return resultMap;
		}catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	/*
	 * 根据menu_code查询常用功能
	 */
	@Override
	public Map<String, Object> queryFunctionByMenucode(HttpServletRequest req,
			String userid) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		String menu_code=RequestUtils.getParamValue(req, "menu_code");
		Map<String, String> functionMap=sFunctionDao.findFunctionByMenucode(menu_code);
		resultMap.put("fun", functionMap);
		return resultMap;
	}
	//查询code
		private String queryMenuCoed(String menu_code) {
			return sFunctionDao.findMenuCode(menu_code);
		}
	/*
	 * 插入常用功能
	 */
	@Override
	public Map<String, String> saveFunction(HttpServletRequest req,
			String userId) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String jsonart=req.getParameter("f");
		JSONArray jsonArt=JSONArray.fromObject(jsonart);
		List<SFunction> sFunction=
				(List<SFunction>)JSONArray.toCollection(jsonArt, SFunction.class);		
		for (SFunction sFunction2 : sFunction) {
			String artStr=queryMenuCoed(sFunction2.getMenu_code());
			if(artStr!=null&&artStr.trim().length()>0){
				resultMap.put("result", "repeat");
				return resultMap;
			}
			if(sFunction2.getMenu_memo()==null||"".equals(sFunction2.getMenu_memo())){
				sFunction2.setMenu_memo("");
			}
			sFunction2.setOpt_person(userId);
			sFunction2.setOpt_time(DateTimeUtils.getFormatCurrentTime());
			sFunctionDao.addFunction(sFunction2);
		}
		resultMap.put("result", "true");
		return resultMap;
	}
	/*
	 * 修改常用功能
	 */
	@Override
	public Map<String, String> updateFunction(HttpServletRequest req,
			String userId) {
		Map<String, String> resultMap=new HashMap<String, String>();
	     String jsonart=req.getParameter("f");
	     JSONArray jsonArt=JSONArray.fromObject(jsonart);
			List<SFunction> sFunction=
					(List<SFunction>)JSONArray.toCollection(jsonArt, SFunction.class);
			for (SFunction sfunction : sFunction) {
				sFunctionDao.updateFunction(sfunction);
			}
			resultMap.put("result", "true");
			return resultMap;
	}
	/**
	 * 根据人员查询常用功能
	 */
	@Override
	public List<Map<String, String>> queryAllFunctionByUser(HttpServletRequest req,
			String userid) {
		List<Map<String, String>> map=sFunctionDao.queryAllFunctionByUser(userid);
		return sFunctionDao.queryAllFunctionByUser(userid);
	}
	@Override
	public List<Map<String, String>> queryAllWorkbenchFunctionByUser(
			HttpServletRequest req, String userid) {
		List<Map<String, String>> map=sFunctionDao.queryAllWorkbenchFunctionByUser(userid);
		return sFunctionDao.queryAllWorkbenchFunctionByUser(userid);
	}
	@Override
	public Map<String, String> delWorkbenchFunctionByMenucode(
			HttpServletRequest req, String userid) {		
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("userid", userid);
		pmap.put("menu_code", RequestUtils.getParamValue(req, "menu_code"));
		sFunctionDao.delWorkbenchFunctionByMenucode(pmap);
		pmap.clear();
		pmap.put("result", "true");
		return pmap;
	}
	@Override
	public Map<String, String> addUserWorkBenchFunction(HttpServletRequest req,
			String userid) {
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("opt_person", userid);
		pmap.put("user_code", userid);
		pmap.put("menu_code", RequestUtils.getParamValue(req, "menu_code"));
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		pmap.put("order_id", "");
		sFunctionDao.addUserWorkBenchFunction(pmap);
		pmap.clear();
		pmap.put("result", "true");
		return pmap;
	}

}
