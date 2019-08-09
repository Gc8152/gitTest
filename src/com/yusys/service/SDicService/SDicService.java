package com.yusys.service.SDicService;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.LogUtil;
import com.yusys.Utils.RequestUtils;
import com.yusys.common.cache.redis.IMyCache;
import com.yusys.common.cache.redis.RedisCache;
import com.yusys.dao.SDicDao;

@Service
@Transactional
public class SDicService implements ISDicService{
	@Resource
	private SDicDao sdicdao;
	
	@Resource
	private RedisCache redisCache;
	@Resource
	private LogUtil logUtil;
	//新增
	@Override
	public Map<String, String> save(HttpServletRequest req,String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		//必填参数列表
		String[] must=new String[]{"dic_code","dic_name","state","menu_no","manager_role"};
		//非必填的参数列表
		String[] nomust=new String[]{"memo"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		try {
			if (pmap==null) {
				resultMap.put("result", "false");
			}else{
				pmap.put("opt_no", "admin");//创建人			
				pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//创建时间
				sdicdao.save(pmap);
				resultMap.put("result", "true");
				refreshDicItemToRedis(pmap.get("dic_code"));
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		logUtil.insertLogInfo(req,userid,"新增字典ID:"+pmap.get("dic_code"),resultMap.get("result").equals("true")?logUtil.SUCCESS:logUtil.FAILURE,"字典数据管理",logUtil.OPT,pmap.get("dic_code"));
		return resultMap;
	}
	//删除
	@Override
	public Map<String, String> delete(HttpServletRequest req,String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String dic_code=RequestUtils.getParamValue(req, "dic_code");
		Map<String, Object> pmap=new HashMap<String, Object>();
		pmap.put("dic_code", dic_code);
		if (dic_code==null||"".equals(dic_code.trim())) {
			resultMap.put("result", "false");
		}else{
			try {
				sdicdao.delete(pmap);
				sdicdao.deleteitem(pmap);
				resultMap.put("result", "true");
				refreshDicItemToRedis(dic_code);
			} catch (Exception e) {
				e.printStackTrace();
				resultMap.put("result", "false");
			}
		}
		logUtil.insertLogInfo(req,userid,"删除字典ID:"+pmap.get("dic_code"),resultMap.get("result").equals("true")?logUtil.SUCCESS:logUtil.FAILURE,"字典数据管理",logUtil.OPT,dic_code);
		return resultMap;
	}
	//修改
	@Override
	public Map<String, String> update(HttpServletRequest req, String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String []must=new String[]{"dic_code","dic_name","state","menu_no","manager_role"};
		String []nomust=new String[]{"memo"};
		
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if (pmap==null) {
			resultMap.put("result", "false");
		}else{
			pmap.put("opt_no", "admin");//创建人			
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//修改
			try {
				sdicdao.update(pmap);
				resultMap.put("result", "true");
			} catch (Exception e) {
				e.printStackTrace();
				resultMap.put("result", "false");
			}
		}
		logUtil.insertLogInfo(req,userid,"修改字典ID:"+pmap.get("dic_code"),resultMap.get("result").equals("true")?logUtil.SUCCESS:logUtil.FAILURE,"字典数据管理",logUtil.OPT,pmap.get("dic_code"));
		return resultMap;
	}
	
	//根据ID查询类别
	@Override
	public Map<String, Object>  findById(HttpServletRequest req,String userid) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		try {
			//必填参数列表
			String[] must=new String[]{"dic_code"};
			//非必填的参数列表
//			String[] nomust=new String[]{"supmenu_no","memo"};
			String[] nomust=new String[]{};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", null);
				return resultMap;
			}

			List<Map<String, String>> list = sdicdao.findById(pmap);
			if(list.size()>0){
				resultMap.put("result", true);
				resultMap.put("list", list);
			}else{
				resultMap.put("result", false);
			}
			
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}

	//查询所有类别
	@Override
	public Map<String, Object> findAll(HttpServletRequest req,String userid) {
		Map<String, Object> map=new HashMap<String, Object>();
		Map<String, String> pmap = new HashMap<String, String>();
		try {
			String dic_code=RequestUtils.getParamValueNulStr(req, "dic_code");
			if (dic_code!=null&&dic_code.trim().length()!=0) {
				pmap.put("dic_code", "%"+dic_code+"%");
			}
			String dic_name=RequestUtils.getParamValueNulStr(req,"dic_name");
			if(dic_name!=null){
				dic_name=URLDecoder.decode(dic_name,"UTF-8");
				pmap.put("dic_name",  "%"+dic_name+"%");
			}
			pmap.put("state", RequestUtils.getParamValueNulStr(req,"state"));
			pmap.put("menu_no", RequestUtils.getParamValueNulStr(req,"menu_no"));
			pmap.put("manager_role", RequestUtils.getParamValueNulStr(req,"manager_role"));
			String role = RequestUtils.getParamValueNulStr(req,"role");
			if(!"admin".equals(role)){
				pmap.put("role","(\'"+role.replace(",","\',\'")+"\')");
			}
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> m=sdicdao.findAll1(pmap);
			map.put("rows", m);
			map.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	@Override
	public String findItemByDic(HttpServletRequest req,String userid) {
		String []must={"dic_code"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		try {
			if (pmap!=null) {
				String listMap=redisCache.get(pmap.get("dic_code")+IMyCache.dic, null);
				if (listMap==null||listMap.trim().length()==0) {
					return JsonUtils.listToJson(sdicdao.findItemByDic(pmap));
				}
				return listMap;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "[]";
	}
	
	/**
	 * 刷新字典项缓存
	 */
	public void refreshDicItemToRedis(String dic_code){
		if (dic_code!=null) {
			Map<String, String> pmap=new HashMap<String, String>();
			pmap.put("dic_code", dic_code);
			redisCache.put(dic_code+IMyCache.dic, JsonUtils.listToJson(sdicdao.findItemByDic(pmap)));
		}
	}
}
