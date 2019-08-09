package com.yusys.service.SMenuService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.dao.SMenuDao;
import com.yusys.entity.SMenu;
@Service
@Transactional
public class SMenuService implements ISMenuService {

	@Resource
	private SMenuDao menuDao;
	
	public List<Map<String, String>> queryAllPageMenu(HttpServletRequest req,String userid){
		try {
			return menuDao.queryAllPageMenu("aa");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 创建菜单
	 */
	@Override
	public Map<String, String> createMenuInfo(HttpServletRequest req,String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try {
			//必填参数列表
			String[] must=new String[]{"menu_no","menu_name","menu_type","menu_level","order_id"};
			//非必填的参数列表
			String[] nomust=new String[]{"supmenu_no","menu_url","memo","menu_icon"};//MENU_ICON
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				resultMap.put("msg", "缺少必填项!");
				return resultMap;
			}
			pmap.put("menu_no", pmap.get("menu_no").toLowerCase());
			if(menuDao.findOneMenuInfoByNo(pmap.get("menu_no"))!=null){
				resultMap.put("result", "false");
				resultMap.put("msg", "菜单编号重复");
				return resultMap;
			}
			
			pmap.put("create_no", "admin");//创建人			
			pmap.put("create_time", DateTimeUtils.getFormatCurrentTime());//创建时间
			pmap.put("flag", "00");//删除标志 00未删除 01已删除
			pmap.put("system_id", "001sy");//所属系统ID
			pmap.put("menu_icon", "001.icon");//菜单图标
			menuDao.createMenuInfo(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}

	@Override
	public Map<String, String> updateMenuInfo(HttpServletRequest req,String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String []must=new String[]{"old_menu_no","menu_no","menu_name","menu_type","menu_level","order_id"};
		String []nomust=new String[]{"supmenu_no","menu_url","memo","menu_icon","haveId"};
		
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		if (pmap==null) {
			resultMap.put("result", "false");
			resultMap.put("msg", "缺少必填项!");
			return resultMap;
		}
		pmap.put("menu_no", pmap.get("menu_no").toLowerCase());
		if(!pmap.get("menu_no").equals(pmap.get("old_menu_no"))&&menuDao.findOneMenuInfoByNo(pmap.get("menu_no"))!=null){
			resultMap.put("result", "false");
			resultMap.put("msg", "菜单编号重复");
			return resultMap;
		}
		pmap.put("update_no",userid);
		pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());
		try {
			int gap=0;
			if(pmap.get("supmenu_no")!=null &&! "".equals(pmap.get("supmenu_no"))){
				SMenu supmenu=menuDao.findOneMenuInfoByNo(pmap.get("supmenu_no"));
				int supLevel=Integer.parseInt(supmenu.getMenu_level());
				int currLevel=Integer.parseInt(pmap.get("menu_level"));
				if(!pmap.get("menu_level").equals((supLevel+1)+"")){
					pmap.put("menu_level",(supLevel+1)+"");//重新设置级别 (当前级别=父的级别+1)
					gap=currLevel-supLevel+1;//菜单修改前后的级别差
					pmap.put("gap", gap+"");
				}
			}
			menuDao.updateMenuInfo(pmap);
			if(!pmap.get("menu_no").equals(pmap.get("old_menu_no"))){
				menuDao.updateChilMenuSupNo(pmap);
				menuDao.updateMenuButtonMenuNo(pmap);
				menuDao.updateMenuPropertyMenuNo(pmap);
			}
			
			if(gap!=0){
				menuDao.updateChilMenuLevel(pmap);
			}
			
			if(pmap.get("haveId")!=null&&!"".equals(pmap.get("haveId"))){
				menuDao.clearMenuSupNoInfo(pmap.get("haveId"));
			}
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}
	/**
	 * 删除菜单
	 */
	@Override
	public Map<String, String> deleteMenuInfo(HttpServletRequest req,String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String menu_no=RequestUtils.getParamValue(req, "menu_nos");
		if (menu_no==null||"".equals(menu_no.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}
		Map<String, Object> pmap=new HashMap<String, Object>();
		pmap.put("menu_nos", menu_no.split(","));
		pmap.put("update_no",userid);
		pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());
		try {
			menuDao.deleteMenuInfo(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}

	/**
	 * 查询一条数据
	 */
	@Override
	public SMenu findOneMenuInfoByNo(HttpServletRequest req,String userid) {
		String menu_no=RequestUtils.getParamValue(req, "menu_no");
		try {
			return menuDao.findOneMenuInfoByNo(menu_no);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 创建页面按钮
	 */
	@Override
	public Map<String, String> createPageButton(HttpServletRequest req,String userid){
		Map<String, String> resultMap=new HashMap<String, String>();
		String [] must={"menu_no","action_no","action_descr"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			resultMap.put("result", "false");
			resultMap.put("msg", "缺少必填项!");
			return resultMap;
		}else if(menuDao.queryOnePageButton(pmap)!=null){
			resultMap.put("result", "false");
			resultMap.put("msg", "按钮编号重复!");
			return resultMap;
		}
		
		pmap.put("flag", "00");
		pmap.put("alert_info", "保存成功!");
		pmap.put("opt_no",userid);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		try {
			//menuDao.deletePageButton(pmap);
			menuDao.createPageButton(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}
	/**
	 * 修改页面按钮信息
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> updatePageButton(HttpServletRequest req,String userid){
		Map<String, String> resultMap=new HashMap<String, String>();
		String [] must={"menu_no","old_action_no","action_no","action_descr"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			resultMap.put("result", "false");
			resultMap.put("msg", "缺少必填项!");
			return resultMap;
		}else if(!pmap.get("old_action_no").equals(pmap.get("action_no"))&&menuDao.queryOnePageButton(pmap)!=null){
			resultMap.put("result", "false");
			resultMap.put("msg", "按钮编号重复!");
			return resultMap;
		}
		pmap.put("alert_info", "修改成功!");
		pmap.put("opt_no",userid);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		try {
			//menuDao.deletePageButton(pmap);
			menuDao.updateButtonInfo(pmap);			
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}
	/**
	 * 修改页面按钮标识
	 * @param req
	 * @param userid
	 * @return
	 */
	@Override
	public Map<String, String> updatePageButtonFlag(HttpServletRequest req,String userid){
		Map<String, String> resultMap=new HashMap<String, String>();
		String [] must={"menu_no","action_no","flag"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			resultMap.put("result", "false");
			return resultMap;
		}
		pmap.put("alert_info", "修改成功!");
		pmap.put("opt_no",userid);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		try {
			menuDao.updateButtonFlag(pmap);			
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	/**
	 * 移除页面按钮
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> removePageButton(HttpServletRequest req,String userid){
		Map<String, String> resultMap=new HashMap<String, String>();
		String [] must={"menu_no","action_no"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			resultMap.put("result", "false");
			return resultMap;
		}
		try {
			menuDao.deletePageButton(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	/**
	 * 查询页面按钮
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, Object> queryPageButton(HttpServletRequest req,String userid){
		String menu_no=RequestUtils.getParamValue(req, "menu_no");
		if (menu_no==null||"".equals(menu_no.trim())) {
			return null;
		}
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			List<Map<String, String>> m=menuDao.queryPageButton(menu_no);
			map.put("rows", m);
			map.put("total", m.size());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	/**
	 * 创建页面属性信息
	 */
	@Override
	public Map<String, String> createPageProperty(HttpServletRequest req,String userid){
		Map<String, String> resultMap=new HashMap<String, String>();
		String [] must={"menu_no","property_no","property_name"};
		//#{menu_no},#{action_no},#{action_descr},#{flag},#{opt_no},#{opt_time}
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			resultMap.put("result", "false");
			resultMap.put("msg", "缺少必填项!");
			return resultMap;
		}else if(menuDao.queryOnePageProperty(pmap)!=null){
			resultMap.put("result", "false");
			resultMap.put("msg", "属性编号重复!");
			return resultMap;
		}
		pmap.put("flag", "00");
		pmap.put("alert_info", "保存成功!");
		pmap.put("opt_no",userid);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		try {
			//menuDao.deletePageProperty(pmap);
			menuDao.createPageProperty(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}

	/**
	 * 修改页面属性信息
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> updatePageProperty(HttpServletRequest req,String userid){
		Map<String, String> resultMap=new HashMap<String, String>();
		String [] must={"menu_no","old_property_no","property_no","property_name"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			resultMap.put("result", "false");
			resultMap.put("msg", "缺少必填项!");
			return resultMap;
		}else if(!pmap.get("old_property_no").equals(pmap.get("property_no"))&&menuDao.queryOnePageProperty(pmap)!=null){
			resultMap.put("result", "false");
			resultMap.put("msg", "属性编号重复!");
			return resultMap;
		}
		pmap.put("opt_no",userid);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		try {
			menuDao.updatePropertyInfo(pmap);			
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}

	/**
	 * 修改页面属性标识
	 * @param req
	 * @param userid
	 * @return
	 */
	@Override
	public Map<String, String> updatePagePropertyFlag(HttpServletRequest req,String userid){
		Map<String, String> resultMap=new HashMap<String, String>();
		String [] must={"menu_no","property_no","flag"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			resultMap.put("result", "false");
			return resultMap;
		}
		pmap.put("opt_no",userid);
		pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		try {
			menuDao.updatePropertyFlag(pmap);			
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	/**
	 * 移除页面属性信息
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> removePageProperty(HttpServletRequest req,String userid){
		Map<String, String> resultMap=new HashMap<String, String>();
		String [] must={"menu_no","property_no"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			resultMap.put("result", "false");
			return resultMap;
		}
		try {
			menuDao.deletePageProperty(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	/**
	 * 查询页面属性信息
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, Object> queryPageProperty(HttpServletRequest req,String userid){
		String menu_no=RequestUtils.getParamValue(req, "menu_no");
		if (menu_no==null||"".equals(menu_no.trim())) {
			return null;
		}
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			List<Map<String, String>> list=menuDao.queryPageProperty(menu_no);
			//map.put("rows", RequestUtils.pagination(req, list));
			map.put("rows", list);
			map.put("total", list.size());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	/**
	 * 菜单关联角色查询
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, Object> TableRoleMenu(HttpServletRequest req,String userid){
		Map<String, Object> map=new HashMap<String, Object>();
		Map<String, String> pmap = new HashMap<String, String>();
		try {
			String menu_no=RequestUtils.getParamValue(req, "menu_no");
			if (menu_no==null||"".equals(menu_no.trim())) {
				return null;
			}
			pmap.put("menu_no", req.getParameter("menu_no"));
			
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			
			List<Map<String, String>> list=menuDao.TableRoleMenu(pmap);
			//map.put("rows", RequestUtils.pagination(req, list));
			map.put("rows", list);
			//map.put("total", list.size());
			map.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
}
