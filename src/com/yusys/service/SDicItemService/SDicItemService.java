package com.yusys.service.SDicItemService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.dao.SDicItemDao;
import com.yusys.service.SDicService.ISDicService;

@Service
@Transactional
public class SDicItemService implements ISDicItemService{
	@Resource
	private SDicItemDao dicItemDao;
	
	@Resource
	private ISDicService dicService;
	
	//新增
	@Override
	public Map<String, String> save(HttpServletRequest req, String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"item_code","item_name","dic_code","state","is_default","order_id"};
			//非必填的参数列表
			String[] nomust=new String[]{"memo"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("opt_no", "admin");//创建人			
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//创建时间
			dicItemDao.save(pmap);
			resultMap.put("result", "true");
			dicService.refreshDicItemToRedis(pmap.get("dic_code"));
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//删除
	@Override			
	public Map<String, String> delete(HttpServletRequest req, String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String[] must=new String[]{"item_code","dic_code"};
		String []nomust=new String[]{};
		
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if (pmap==null) {
			resultMap.put("result", "false");
			return resultMap;
		}

		try {
			dicItemDao.delete(pmap);
			resultMap.put("result", "true");
			dicService.refreshDicItemToRedis(pmap.get("dic_code"));
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}	
	//修改
	@Override
	public Map<String, String> update(HttpServletRequest req, String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String[] must=new String[]{"item_code","item_name","dic_code","state","is_default","order_id"};
		String []nomust=new String[]{"memo"};
		
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if (pmap==null) {
			resultMap.put("result", "false");
			return resultMap;
		}
		pmap.put("opt_no", "admin");//创建人			
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//修改
		try {
			dicItemDao.update(pmap);
			resultMap.put("result", "true");
			dicService.refreshDicItemToRedis(pmap.get("dic_code"));
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	
	//根据ID查找
	@Override
	public Map<String, Object> findById(HttpServletRequest req, String userid) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		try {
			//必填参数列表
			String[] must=new String[]{"item_code","dic_code"};
			//非必填的参数列表
//			String[] nomust=new String[]{"supmenu_no","memo"};
			String[] nomust=new String[]{};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", null);
				return resultMap;
			}

			List<Map<String, String>> list = dicItemDao.findById(pmap);
			if(list.size()>0){
				resultMap.put("result", true);
				resultMap.put("list", list);
				dicService.refreshDicItemToRedis(pmap.get("dic_code"));
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
	//多条件查询所有字典项
	@Override
	public Map<String, Object> findAll(HttpServletRequest req, String userid) {
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			pmap.put("item_code", req.getParameter("item_code"));
			pmap.put("item_name", req.getParameter("item_name"));
			pmap.put("dic_code", req.getParameter("dic_code"));
			
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);			
			
			List<Map<String, String>> list = dicItemDao.findAll(pmap);
			
			map.put("rows", list);
			map.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	@Override
	//根据字典类别编码查询字典项内容 houf 
	public List<Map<String, String>> findItemContent(HttpServletRequest req,
			String userid) {
		String diCode=req.getParameter("dic_ode");
		return dicItemDao.findItemContent(diCode);
	}	
}
