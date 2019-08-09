package com.yusys.service.SOrgService;

import java.net.URLDecoder;
import java.util.ArrayList;
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
import com.yusys.dao.SOrgDao;
import com.yusys.dao.SUserDao;
import com.yusys.entity.SOrg;
import com.yusys.service.SPermissionService.ISPermissionService;
@Service
@Transactional
public class SOrgService implements ISOrgService{
	
	@Resource
	private SOrgDao sOrgDao;
	@Resource
	private SUserDao sUserDao;
	@Resource
	private ISPermissionService permissionService;
	
	@Resource
	private TaskDBUtil taskDBUtil;
	
	@Resource
	private ISPermissionService sPermissionService;
	
	/**
	 * 查询树状结构列表
	 */
	@Override
	public List<Map<String, String>> queryOrgTreeList(HttpServletRequest req,String userid){
		try {
			String org_no = req.getParameter("id");
			if(org_no==null||"".equals(org_no)){
				org_no="0";
			}
			List<Map<String, String>> list = sOrgDao.queryOrgTreeList(org_no);
			return list;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 查询树状结构列表不包含中心
	 */
	public List<Map<String, String>> queryOrgTreeWithCenterList(HttpServletRequest req,String userid){
		try {
			String org_no = req.getParameter("id");
			if(org_no==null||"".equals(org_no)){
				org_no="0";
			}
			List<Map<String, String>> list = sOrgDao.queryOrgTreeList(org_no);
			if("1".equals(org_no)){
				//int i = 0;
				for(int i = 0; i<list.size(); i++){
					Map<String, String> item = list.get(i);
					if("1101".equals(item.get("ID"))){
						item.put("ISPARENT", "false");
						break;
					}
				}
			}
			return list;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 查询上一级树状结构列表
	 */
	@Override
	public List<Map<String, String>> queryOrgTreeDeptList(
			HttpServletRequest req, String userId) {
		try {
			return sOrgDao.queryOrgTreeDeptList("aa");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	/**
	 *查询末级机构 
	 */
	@Override
	public List<Map<String, String>> queryOrgTreeOfficesList(
			HttpServletRequest req, String userId) {
		String it=RequestUtils.getParamValue(req, "suporg_code");
		try {
			return sOrgDao.queryOrgTreeOfficesList(it);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 根据处室查询岗位
	 */
	@Override
	public List<Map<String, String>> queryOrgTreePostList(
			HttpServletRequest req, String userId) {
		String it=RequestUtils.getParamValue(req, "org_code");
		try {
			return sOrgDao.queryOrgTreePostList(it);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 创建机构
	 */
	@Override
	public Map<String, String> insertNewOrg(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			//必填参数列表机构编号,机构名称,部门经理,设立日期,vp,序号
			String[] must=new String[]{"org_code","org_name","org_manager_code","launch_date","org_vp"};
			//非必填的参数列表上级部门编号,地址
			String[] nomust=new String[]{"suporg_code","org_address","order_no","update_time"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("state", "00");
			pmap.put("create_no",actorno);
			pmap.put("create_time", DateTimeUtils.getFormatCurrentTime());
			sOrgDao.insertNewOrg(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	/**
	 * 查询部门详细信息
	 */
	@Override
	public SOrg findOrgByOrgNo(HttpServletRequest req,String actorno){
		String org_code = RequestUtils.getParamValue(req, "org_code");
		try{
			return sOrgDao.findOrgByOrgNo(org_code);
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 修改部门详细信息
	 */
	@Override
	public Map<String, String> updatePayDate(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			String[] must=new String[]{"old_org_code","org_code","org_name","org_manager_code","launch_date","org_vp"};
			String[] nomust=new String[]{"org_address","suporg_code","order_no"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("update_no",actorno);
			pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());
			/*if ("00".equals(pmap.get("enable_flag"))&&"".equals(pmap.get("org_vp").trim())&&"".equals(pmap.get("org_level").trim())) {
				resultMap.put("result", "false");
				return resultMap;
			}*/
			sOrgDao.updateOrg(pmap);
			
			/*SOrg org=sOrgDao.findOrgByOrgNo(pmap.get("org_code"));
			Map<String, String> umap=new HashMap<String, String>();
			umap.put("org_code", pmap.get("org_code"));
			List<Map<String, String>> ulist=sUserDao.queryAllUser(umap);
			
			if (ulist==null) {
				return null;
			}
			*//**
			 * 启用部门
			 *//*
			if ("00".equals(pmap.get("enable_flag"))) {
				if (!pmap.get("org_vp").equals(org.getOrg_vp())) {//如果分管领导发生了变更 需要删除原分管领导的权限
					taskDBUtil.deleteUserManagerRole(org.getOrg_vp(), pmap.get("org_code"), "003,004");
				}
				taskDBUtil.userAddRoleToPermiss(pmap.get("org_vp"),"004", pmap.get("org_code"));
				if (ulist!=null) {
					for (int i = 0; i < ulist.size(); i++) {
						String user_no=ulist.get(i).get("USER_NO");
						taskDBUtil.userAddRole(user_no, "004", pmap.get("org_code"));
					}
				}
			}else if ("01".equals(pmap.get("enable_flag"))){//停用部门
				taskDBUtil.deleteUserManagerRole(org.getOrg_vp(), pmap.get("org_code"), "003,004");//干掉分管领导的权限
				if (ulist!=null) {
					for (int i = 0; i < ulist.size(); i++) {
						String user_no=ulist.get(i).get("USER_NO");
						taskDBUtil.deleteUserManagerRole(user_no, pmap.get("org_code"), "004");
					}
				}
			}
			sOrgDao.openOrDeptEnable(pmap);
			sPermissionService.startCreateByOrg(pmap.get("org_code"), "0");*/
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	/**
	 * 删除(修改标记位)
	 */
	@Override
	public Map<String, String> delete(HttpServletRequest req,String actorno){
		
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			String[] must=new String[]{"org_code"};
			String[] nomust=new String[]{};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("state","01");
			pmap.put("update_no",actorno);
			pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());
			sOrgDao.deleteOrgInfo(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//根据用户ID查询所有机构,和查询所有机构
	@Override
	public Map<String, Object> findAllOrgById(HttpServletRequest req,	String userid) {
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			List<Map<String, String>> list = null;
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);			
			if(req.getParameter("user_no")!=null){
				pmap.put("user_no", req.getParameter("user_no"));
				list = sOrgDao.findAllOrgById(pmap);
			}else{
				String pop_orgName = req.getParameter("pop_orgName");
				if(pop_orgName!=null&&!("undefined".equals(pop_orgName))){
					pop_orgName=URLDecoder.decode(pop_orgName,"UTF-8");
					pmap.put("org_name",  "%"+pop_orgName+"%");
				}
				String pop_orgManager = req.getParameter("pop_orgManager");
				if(pop_orgManager!=null&&!("undefined".equals(pop_orgManager))&&!"".equals(pop_orgManager)){
					pop_orgManager=URLDecoder.decode(pop_orgManager,"UTF-8");
					pmap.put("org_manager",  "%"+pop_orgManager+"%");
				}
				String pop_orgNo = req.getParameter("pop_orgNo");				
				if(pop_orgNo!=null&&!("undefined".equals(pop_orgNo))){
					pmap.put("org_code", req.getParameter("pop_orgNo"));
				}
				String pop_orgState = req.getParameter("pop_orgState");				
				if(pop_orgState!=null&&!("undefined".equals(pop_orgState))){
					pmap.put("state", req.getParameter("pop_orgState"));
				}
				list = sOrgDao.findAllOrg(pmap);
			}
			
			map.put("rows", list);
			map.put("total", pmap.get("total"));		
		}catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	//系统启用状态修改，同时生效部门用户权限
	@Override
	public Map<String, String> updateSysEnableFlag(HttpServletRequest req,
			String actorno) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			String[] must=new String[]{"org_code","enable_flag"};
			String[] nomust=new String[]{};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("update_no",actorno);
			pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());
			sOrgDao.updateSysEnableFlag(pmap);
			
			//启用系统使用权限时，自动生成部门人员的系统权限
			if(pmap.get("enable_flag")!=null && "00".equals(pmap.get("enable_flag"))){
				permissionService.startCreateByOrg(pmap.get("org_code"),actorno);
			}
			
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	
	//机构下创建岗位
	@Override
	public Map<String, String> insertOrgPosition(HttpServletRequest req,
			String actorno) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String [] must={"org_code","p_code","p_name"};
		String[] nomust=new String[]{"p_memo"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if (pmap==null) {
			resultMap.put("result", "false");
			resultMap.put("msg", "缺少必填项!");
			return resultMap;
		}else if(sOrgDao.queryOneOrgPosition(pmap)!=null){
			resultMap.put("result", "false");
			resultMap.put("msg", "岗位编号重复!");
			return resultMap;
		}
		
		pmap.put("p_flag", "00");
		pmap.put("alert_info", "保存成功!");
		pmap.put("opt_person",actorno);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		try {
			sOrgDao.insertOrgPosition(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}
	//更新岗位信息
	@Override
	public Map<String, String> updateOrgPosition(HttpServletRequest req,
			String actorno) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String [] must={"old_p_code","org_code","p_code","p_name"};
		String[] nomust=new String[]{"p_memo"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if (pmap==null) {
			resultMap.put("result", "false");
			resultMap.put("msg", "缺少必填项!");
			return resultMap;
		}else if(!pmap.get("old_p_code").equals(pmap.get("p_code"))&&sOrgDao.queryOneOrgPosition(pmap)!=null){
			resultMap.put("result", "false");
			resultMap.put("msg", "岗位编号重复!");
			return resultMap;
		}
		pmap.put("alert_info", "修改成功!");
		pmap.put("opt_person",actorno);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		try {
			sOrgDao.updateOrgPosition(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}
	//更新岗位删除标记
	@Override
	public Map<String, String> updateOrgPositionFlag(HttpServletRequest req,
			String actorno) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String [] must={"org_code","p_code","p_flag"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			resultMap.put("result", "false");
			return resultMap;
		}
		pmap.put("alert_info", "删除成功!");
		pmap.put("opt_person",actorno);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		try {
			sOrgDao.updateOrgPositionFlag(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//查询机构下的岗位
	@Override
	public Map<String, Object> queryOrgPosition(HttpServletRequest req,
			String actorno) {
		Map<String, String> pmap=new HashMap<String, String>();
		String org_code = req.getParameter("org_code");
		pmap.put("org_code", org_code);
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			List<Map<String, String>> m=sOrgDao.queryOrgPosition(pmap);
			if(m == null){
				m = new ArrayList<Map<String, String>>();
			}
			map.put("rows", m);
			map.put("total", m.size());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	//查询机构下的所有用户
	@Override
	public Map<String, Object> queryUserPosition(HttpServletRequest req,
			String userId) {
		Map<String, String> pmap=new HashMap<String, String>();
		String org_code = req.getParameter("org_code");
		pmap.put("org_code", org_code);
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			List<Map<String, String>> m=sOrgDao.queryUserPosition(pmap);
			if(m == null){
				m = new ArrayList<Map<String, String>>();
			}
			map.put("rows", m);
			map.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	
}
