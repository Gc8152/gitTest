package com.yusys.service.factorsconfig;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.dao.FactorsInfoDao;
@Service
public class SFactorsInfoService implements ISFactorsInfoService {
	@Resource
	private FactorsInfoDao factorsInfoDao;
	
	@Override
	public Map<String, Object> queryAllFactorsInfo(HttpServletRequest req) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, Object> pmap=new HashMap<String, Object>();
		//从前台获取请求参数
		String b_code = RequestUtils.getParamValue(req, "b_code");
		String b_name = RequestUtils.getParamValue(req, "b_name");
		/*try {
			if(b_name!=null&&b_name!=""){
				b_name = new String(b_name.getBytes("ISO-8859-1"),"UTF-8");
			}
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}*/
		String b_state = RequestUtils.getParamValue(req, "b_state");
		String b_category = RequestUtils.getParamValue(req, "b_category");
		String system_code = RequestUtils.getParamValue(req, "system_code");
		try {
			//中文避免乱码
			if(b_name!=null){
				b_name=URLDecoder.decode(b_name,"UTF-8");
			}
			if(system_code!=null){
				system_code=URLDecoder.decode(system_code,"UTF-8");
			}
			if(b_category!=null){
				b_category=URLDecoder.decode(b_category,"UTF-8");
			}
			if(b_state!=null){
				b_state=URLDecoder.decode(b_state,"UTF-8");
			}
		} catch (Exception e) {			
			e.printStackTrace();
		}
		//模糊查询
		if(b_code!=null && !"".equals(b_code)){
			pmap.put("b_code",b_code);
		}
		if(b_name!=null && !"".equals(b_name)){
			pmap.put("b_name","%"+b_name+"%");
		}
		if(b_state!=null && !"".equals(b_state)){
			pmap.put("b_state",b_state);
		}
		if(b_category!=null && !"".equals(b_category)){
			pmap.put("b_category",b_category);
		}
		if(system_code!=null && !"".equals(system_code)){
			pmap.put("system_code",system_code);
		}
		String limit = RequestUtils.getParamValue(req,"limit");
		String offset = RequestUtils.getParamValue(req,"offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		//调用dao查询数据,返回所有的流程信息
		List<Map<String, Object>> list=factorsInfoDao.queryAllFactorsInfo(pmap);
		retmap.put("rows", list);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}
	//向业务要素表中插入一条信息
	@Override
	public Map<String, String> addOneFactorsInfo(HttpServletRequest req,String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"b_code","b_name","b_state",
					"b_type","b_category","system_code"};
			//非必填的参数列表
			String[] nomust=new String[]{"memo"};
			Map<String, Object> pmap=RequestUtils.requestToMapTwo(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("opt_person", userid);
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
			Map<String, Object> mp = new HashMap<String, Object>();
			mp.put("b_code", pmap.get("b_code"));
			mp.put("system_code", pmap.get("system_code"));
			mp.put("b_category", pmap.get("b_category"));
			List<Map<String,Object>> fm = factorsInfoDao.queryAllFactorsInfo(mp);
			if(fm.size() > 0){
				resultMap.put("msg", "此业务要素编号已存在！");
				return resultMap;
			}
			int rs = factorsInfoDao.addOneFactorsInfo(pmap);
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
	//向业务要素表中删除一条信息
	@Override
	public Map<String, String> deleteOneFactorsInfo(HttpServletRequest req) {
		String b_code = req.getParameter("b_code");
		String system_code = req.getParameter("system_code");
		Map<String,Object> bMap = new HashMap<String, Object>();
		Map<String,String> resultMap = new HashMap<String, String>();
		try {
			bMap.put("b_code", b_code);
			bMap.put("system_code", system_code);
			int rs = factorsInfoDao.deleteOneFactorsInfo(bMap);
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
	//修改一条业务要素表信息
	@Override
	public Map<String, String> updateOneFactorsInfos(HttpServletRequest req,String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"b_code","b_name","b_state","b_type",
					"b_category","system_code","v_b_code","v_system_code"};
			//非必填的参数列表
			String[] nomust=new String[]{"memo"};
			Map<String, Object> pmap=RequestUtils.requestToMapTwo(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}			
			//修改操作
			pmap.put("opt_person", userid);//创建人			
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//创建时间
			int rs = factorsInfoDao.updateOneFactorsInfo(pmap);
			//修改成功返回结果
			if(rs > 0){			
				resultMap.put("result", "true");
				return resultMap;
			}else {
				resultMap.put("msg", "修改失败！");
				resultMap.put("result", "false");
				return resultMap;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
}