package com.yusys.service.SAuthorizeService;

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
import com.yusys.dao.SAuthorizeDao;
@Service
@Transactional
public class SAuthorizeService implements  ISAuthorizeService{
	@Resource
	private SAuthorizeDao sAuthorizeDao;

	//新增
	@Override
	public Map<String, String> save(HttpServletRequest req, String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"auth_no","org_no","role_no","bauth_no","system_id","query_op",
												"option_op","approve_op","auth_type","auth_state","start_time","end_time"};
			//非必填的参数列表
//			String[] nomust=new String[]{"supmenu_no","memo"};
			String[] nomust=new String[]{};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("opt_no", "admin");//创建人			
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//修改			
			sAuthorizeDao.save(pmap);
			resultMap.put("result", "true");
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
		String id=RequestUtils.getParamValue(req, "id");
		if (id==null||"".equals(id.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}
		Map<String, Object> pmap=new HashMap<String, Object>();
		pmap.put("id", id);
		try {
			sAuthorizeDao.delete(pmap);
			resultMap.put("result", "true");
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
		String []must=new String[]{"id","auth_no","org_no","role_no","bauth_no","system_id","query_op",
				"option_op","approve_op","auth_type","auth_state","start_time","end_time"};
		String []nomust=new String[]{};
		
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if (pmap==null) {
			resultMap.put("result", "false");
			return resultMap;
		}
		pmap.put("opt_no", "admin");//创建人			
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//修改
		try {
			sAuthorizeDao.update(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//根据用户ID  查询授权信息
	@Override
	public  Map<String, Object> FindById(HttpServletRequest req, String userid){
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			String id=req.getParameter("id");	
			if(id!=null&& id!=""){
				pmap.put("id",  id);
			}		
			List<Map<String, String>> list = sAuthorizeDao.findById(pmap);
			//分页
			int currentPage = req.getParameter("offset") == null ? 0 : Integer.parseInt(req.getParameter("offset"));
			int showCount = req.getParameter("limit") == null ? 10 : Integer.parseInt(req.getParameter("limit"));
			int end=currentPage+showCount;
			if(end>=list.size()){
				end=list.size();
			}
//			List<Map<String,String>> currrentList=list.subList(currentPage, end);
			
			map.put("rows", list);
			map.put("total", list.size());			

		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	//查询所有类别
	@Override
	public Map<String, Object> findAll(HttpServletRequest req, String userid) {
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			
			String auth_name=req.getParameter("auth_name");									//授权人
			if(auth_name!=null && auth_name!=""){
				auth_name=URLDecoder.decode(auth_name,"UTF-8");
				pmap.put("auth_name",  "%"+auth_name+"%");
			}
			String bauth_name=req.getParameter("bauth_name");								//被授权人
			if(bauth_name!=null && bauth_name!=""){
				bauth_name=URLDecoder.decode(bauth_name,"UTF-8");
				pmap.put("bauth_name",  "%"+bauth_name+"%");
			}			
			String role_name=req.getParameter("role_name");									 //授权角色编号
			if(role_name!=null && role_name!=""){
				role_name=URLDecoder.decode(role_name,"UTF-8");
				pmap.put("role_name",  "%"+role_name+"%");
			}				
			String org_name=req.getParameter("org_name");										//授权机构编号
			if(org_name!=null && org_name!=""){
				org_name=URLDecoder.decode(org_name,"UTF-8");
				pmap.put("org_name",  "%"+org_name+"%");
			}						
			String auth_type=req.getParameter("auth_type");								//授权类型
			if(auth_type!=null){
				pmap.put("auth_type",  auth_type);
			}				
			String query_op=req.getParameter("query_op");								//查询权限
			if(query_op!=null&& query_op!=""){
				pmap.put("query_op",  query_op);
			}				
			String option_op=req.getParameter("option_op");								//操作权限
			if(option_op!=null&& option_op!=""){
				pmap.put("option_op",  option_op);
			}				
			String approve_op=req.getParameter("approve_op");						//审批权限
			if(approve_op!=null&& approve_op!=""){
				pmap.put("approve_op",  approve_op);
			}		
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> list = sAuthorizeDao.findAll(pmap);
			map.put("rows",list);
			map.put("total", pmap.get("total"));			

		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}


}
