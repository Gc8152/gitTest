package com.yusys.service.SPermissionService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.common.cache.redis.IMyCache;
import com.yusys.common.cache.redis.RedisCache;
import com.yusys.dao.SPermissionDao;
@Service
@Transactional
public class SPermissionService implements ISPermissionService {
	 private static final Logger logger = Logger.getLogger(SPermissionService.class);
	@Resource
	private SPermissionDao permissionDao;
	
	@Resource
	private RedisCache redisCache;
	
	/**
	 * 查询用户权限数据
	 * @param req
	 * @param userid
	 * @return
	 */
	
	public String queryUserPermiss(HttpServletRequest req,String type,String userid){
		if (userid==null||"".equals(userid.trim())) {
			return "";
		}
		Map<String, String> map=new HashMap<String, String>();
		try {
			
			map.put("user_no", userid);
			map.put(type, "a");
			String para=userid+type;
			Object opt=redisCache.get(para,null);
			if(opt!=null){
				return ResponseUtils.oracleClob2Str(opt);
			}else{
				Map<String, Object> permiss=permissionDao.queryUserPermiss(map).get(0);
				return ResponseUtils.oracleClob2Str(permiss.get(type));
			}
		} catch (Exception e) {
			try {
				Map<String, Object> permiss1=permissionDao.queryUserPermiss(map).get(0);
				return ResponseUtils.oracleClob2Str(permiss1.get(type));
			} catch (Exception e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			
		}
		return "";
	}
	/**
	 * 增加用户权限信息
	 */
	@Override
	public Map<String, String> addUserPermiss(HttpServletRequest req, String userid) throws Exception{ 
		String crtype=RequestUtils.getParamValue(req, "crtype");
		boolean issucess=false;
		if ("byuser".equals(crtype)) {
			issucess=startCreatePermiss(RequestUtils.getParamValue(req, "crobj"),userid);
		}else if("byrole".equals(crtype)){
			String role_nos[]=RequestUtils.getParamValue(req, "crobj").split(",");
			for(int i=0;i<role_nos.length;i++){
				issucess=startCreateByRole(role_nos[i],userid);
			}
		}else if("byorg".equals(crtype)){
			issucess=startCreateByOrg(RequestUtils.getParamValue(req, "crobj"),userid);
		}else if("all".equals(crtype)){
			issucess=startCreateByAllUser(userid);
		}
		Map<String, String> resultMap=new HashMap<String, String>();
		resultMap.put("result", issucess+"");
		return resultMap;
	}
	/**
	 * 根据角色生成权限
	 * @param role_no
	 * @return
	 */
	public boolean startCreateByRole(String role_no,String userid){
		if(role_no==null||"".equals(role_no.trim())){
			return false;
		}
		
		Map<String, String> map=new HashMap<String, String>();
		map.put("role_no", role_no);
		List<String> user_nos=permissionDao.queryUsersByParam(map);
		try {
			for(int i=0;i<user_nos.size();i++){
				logger.info("..start user:"+user_nos.get(i)+" permission");
				startCreatePermiss(user_nos.get(i), userid);
				logger.info("...success permission ");
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	/**
	 * 根据机构生成权限
	 * @param role_no
	 * @return
	 */
	public boolean startCreateByOrg(String org_code,String userid){
		logger.info("org code :"+org_code);
		if(org_code==null||"".equals(org_code.trim())){
			return false;
		}
		
		Map<String, String> map=new HashMap<String, String>();
		map.put("org_code", org_code);
		List<String> user_nos=permissionDao.queryUsersByParam(map);
		try {
			for(int i=0;i<user_nos.size();i++){
				logger.info("..start user:"+user_nos.get(i)+" permission");
				startCreatePermiss(user_nos.get(i), userid);
				logger.info("...success permission");
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	/**
	 * 开始创建所有用户权限
	 * @param userid
	 * @return
	 */
	public boolean startCreateByAllUser(String userid) throws Exception{
		List<String> user_nos=permissionDao.queryAllUsers("");
			for(int i=0;i<user_nos.size();i++){
				logger.info("..start user:"+user_nos.get(i)+" permission");
				startCreatePermiss(user_nos.get(i), userid);
				logger.info("...success permission");
			}
			return true;
	}
	
	/**
	 * 根据用户编号生成用户权限
	 * @param userno
	 * @return
	 */
	@Override
	public boolean startCreatePermiss(String userno,String currentUserid) throws Exception{
		if (userno==null||"".equals(userno.trim())) {
			return false;	
		}
		long start=System.currentTimeMillis();
		try {
			permissionDao.delUserPermiss(userno);
			Map<String, String> map=new HashMap<String, String>();
			List<Map<String, String>> userRoles=permissionDao.queryUserRoles(userno);//用户角色
			map.put("user_no", userno);
			map.put("user_roles", JsonUtils.listToJson(userRoles));
			
			List<Map<String, String>> meuns=getMenus(userRoles);
			
			map.put("perm_menu", (userRoles==null||userRoles.size()==0)?"[]":JsonUtils.beanToJson(getUserMenuMap(meuns)));//角色对应的菜单
			map.put("perm_opt", getMenuActions(userRoles));
			map.put("perm_data", getMenuDataLevel(userRoles));
			
			map.put("perm_property", getMenuProperty(userRoles));
			map.put("flag", "00");
			map.put("opt_no", currentUserid);
			map.put("opt_time", DateTimeUtils.getFormatCurrentTime());
			permissionDao.addUserPermiss(map);
			if (redisCache!=null) {
				redisCache.put(userno+IMyCache.perm_menu, map.get("perm_menu"));
				redisCache.put(userno+IMyCache.perm_opt, map.get("perm_opt"));
			}
			logger.info(userno+" one user Permiss time:"+(System.currentTimeMillis()-start));
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
	/**
	 * 获取菜单列表
	 * @param userRoles
	 * @return
	 */
	public List<Map<String, String>> getMenus(List<Map<String, String>> userRoles){
		if(userRoles==null||userRoles.size()==0){
			return new ArrayList<Map<String,String>>();
		}
		return permissionDao.queryUserMenus(userRoles);
	}

	/**
	 * [] to {}
	 * @return
	 */
	private Map<String, List<Map<String, String>>> getUserMenuMap(List<Map<String, String>> menuList){
		if (menuList==null||menuList.size()==0) {
			return new HashMap<String, List<Map<String,String>>>();
		}
		List<Map<String,String>> level1=new ArrayList<Map<String,String>>();
		
		List<Map<String,String>> level2=new ArrayList<Map<String,String>>();
		
		Map<String, String> groupMenu=new HashMap<String, String>();
		Map<String, String> groupMenu2=new HashMap<String, String>();	
		Map<String, List<Map<String, String>>> menusGroupMap=new HashMap<String, List<Map<String,String>>>();
		for (int i = 0; i < menuList.size(); i++) {
			if("0".equals(menuList.get(i).get("MENU_LEVEL"))){//菜单级别为0的 是一级菜单。
				level1.add(menuList.get(i));
				groupMenu.put(menuList.get(i).get("MENU_NO"), menuList.get(i).get("MENU_NO"));
				continue;
			}
			String level1MenuNO=groupMenu.get(menuList.get(i).get("SUPMENU_NO"));//获取该菜单的上级菜单
			List<Map<String, String>> levelMenus=menusGroupMap.get(level1MenuNO);
			if(levelMenus==null){
				levelMenus=new ArrayList<Map<String,String>>();
			}
			if(level1MenuNO==null || "null".equals(level1MenuNO)){
				continue;
			}
			levelMenus.add(menuList.get(i));
			menusGroupMap.put(level1MenuNO,levelMenus);
			groupMenu.put(menuList.get(i).get("MENU_NO"), level1MenuNO);
			
			if("1".equals(menuList.get(i).get("MENU_LEVEL"))){//菜单级别为1的 是二级菜单。
				level2.add(menuList.get(i));
				groupMenu2.put(menuList.get(i).get("MENU_NO"), menuList.get(i).get("MENU_NO"));
				continue;
			}
			
			String level2MenuNO=groupMenu2.get(menuList.get(i).get("SUPMENU_NO"));//获取该菜单的上级菜单
			List<Map<String, String>> level2Menus=menusGroupMap.get(level2MenuNO+"_2");
			if(level2Menus==null){
				level2Menus=new ArrayList<Map<String,String>>();
			}else{
			}
			level2Menus.add(menuList.get(i));
			menusGroupMap.put(level2MenuNO+"_2",level2Menus);
			groupMenu2.put(menuList.get(i).get("MENU_NO"), level2MenuNO);
		}
		menusGroupMap.put("level1", level1);
		menusGroupMap.put("level2", level2);
		
		return menusGroupMap;
	}
	
	/**
	 * 菜单对应操作{menu_no1:['add','upd','del'],menu_no2:['add','upd','del']}
	 * @param userRoles
	 * @return
	 */
	private String getMenuActions(List<Map<String, String>> userRoles){
		if(userRoles==null||userRoles.size()==0){
			return "{}";
		}
		
		List<Map<String, String>> roleMenuActions=permissionDao.queryUserMenuActions(userRoles);//用户菜单操作
		
		Map<String, String> roleMenu=new HashMap<String,String>();//角色对应的菜单
		
		Map<String, List<String>> menuAction=new HashMap<String, List<String>>();//菜单对应的action
		
		Map<String, Integer> actionCount=new HashMap<String, Integer>();//记录action出现的次数
		Map<String, Map<String, String>> actionRoleCount=new HashMap<String,  Map<String, String>>();//记录角色操作action出现的次数
		
		List<String> menunos=new ArrayList<String>();//菜单编号集合
		String role_no=null;
		for (int i = 0; i < roleMenuActions.size(); i++) {
			roleMenu.put(roleMenuActions.get(i).get("ROLE_NO"), "1");//记录数据所包含的角色
			//用一个对象记录 按钮出现的 次数
			Integer count=actionCount.get(roleMenuActions.get(i).get("MENU_NO"));
			if (count==null){
				role_no=roleMenuActions.get(i).get("ROLE_NO");
				count=0;count++;
				actionCount.put(roleMenuActions.get(i).get("MENU_NO"),count);
			}else if(role_no!=null&&!role_no.equals(roleMenuActions.get(i).get("ROLE_NO"))){
				role_no=roleMenuActions.get(i).get("ROLE_NO");
				count++;
				actionCount.put(roleMenuActions.get(i).get("MENU_NO"),count);
			}
			
			if(roleMenuActions.get(i).get("ACTION_NO")!=null){
				Map<String, String> map=actionRoleCount.get(roleMenuActions.get(i).get("MENU_NO")+"_"+roleMenuActions.get(i).get("ACTION_NO"));
				if(map!=null&&map.get(roleMenuActions.get(i).get("ROLE_NO"))!=null){
					String c=map.get(roleMenuActions.get(i).get("ROLE_NO"));
					map.put(roleMenuActions.get(i).get("ROLE_NO"),(Integer.parseInt(c)+1)+"");
				}else{
					map=new HashMap<String, String>();
					map.put("ROLE_NO", roleMenuActions.get(i).get("ROLE_NO"));
					map.put(roleMenuActions.get(i).get("ROLE_NO"), "1");
				}
				actionRoleCount.put(roleMenuActions.get(i).get("MENU_NO")+"_"+roleMenuActions.get(i).get("ACTION_NO"),map);
			}
			
			
			//记录所有的菜单编号
			List<String> menuactions=menuAction.get(roleMenuActions.get(i).get("MENU_NO"));
			if(menuactions==null){
				menunos.add(roleMenuActions.get(i).get("MENU_NO"));
				menuactions=new ArrayList<String>();
			}
			
			//当循环到最后一次并且该操作是第一次出现
			if(count<=1){
				menuactions.add(roleMenuActions.get(i).get("ACTION_NO"));
			}
			menuAction.put(roleMenuActions.get(i).get("MENU_NO"),menuactions);
		}
		/**
		 * 判断该角色 是否设置了不可用的菜单操作,
		 */
	/*	for (int i = 0; i < userRoles.size(); i++) {
			String s=roleMenu.get(userRoles.get(i).get("ROLE_NO"));
			if (s==null||"".equals(s)) {//如果其中一个角色没有 配置 不可用操作，则 全部都可以操作 
				return "{}";
			}
		}*/
		/**
		 * 判断菜单操作按钮配置的不可用次数，不可用 次数和角色数一致则说明该菜单是真的 不给该用户使用
		 */
		for (int i = 0; i < menunos.size(); i++) {
			List<String> actions=menuAction.get(menunos.get(i));
			if (actions==null) {
				menuAction.put(menunos.get(i),new ArrayList<String>());
				continue;
			}
			for (int j = actions.size()-1; j >=0 ; j--) {
				Map<String, String> map=actionRoleCount.get(menunos.get(i)+"_"+actions.get(j));
				if (map!=null) {
					String rc=map.get(map.get("ROLE_NO"));
					Integer c=actionCount.get(menunos.get(i));
					if (!rc.equals(c+"")) {
						actions.remove(j);
					}
				}
			}
		}
		return JsonUtils.beanToJson(menuAction);
	}
	
	
	
	/**
	 * 菜单数据级别{menu_no1:1,menu_no2:2}
	 * @param userRoles
	 * @return
	 */
	private String getMenuDataLevel(List<Map<String, String>> userRoles){
		if(userRoles==null||userRoles.size()==0){
			return "{}";
		}
		List<Map<String, String>> dataLevel=permissionDao.queryUserMenuDataLevel(userRoles);
		Map<String, String> dataLevelMap=new HashMap<String,String>();
		for (int i = 0; i < dataLevel.size(); i++) {
			dataLevelMap.put(dataLevel.get(i).get("MENU_NO"), dataLevel.get(i).get("DATA_NO"));
		}
		return JsonUtils.beanToJson(dataLevelMap);
	}
	
	/**
	 *  菜单属性{menu_no1:['code','name','age'],menu_no2:['code','name','age']}
	 * @param userRoles
	 * @return
	 */
	private String getMenuProperty(List<Map<String, String>> userRoles){
		if(userRoles==null||userRoles.size()==0){
			return "{}";
		}
		
		List<Map<String, String>> roleMenuPropertys=permissionDao.queryUserMenuPropertys(userRoles);//用户菜单属性
		
		Map<String, String> roleMenu=new HashMap<String,String>();//角色对应的菜单
		
		Map<String, List<String>> menuProperty=new HashMap<String, List<String>>();//菜单对应的属性
		
		Map<String, Integer> propertyCount=new HashMap<String, Integer>();//记录property出现的次数
		
		List<String> menunos=new ArrayList<String>();//菜单编号集合
		
		for (int i = 0; i < roleMenuPropertys.size(); i++) {
			roleMenu.put(roleMenuPropertys.get(i).get("ROLE_NO"), "1");//记录数据所包含的角色
			
			Integer count=propertyCount.get(roleMenuPropertys.get(i).get("PROPERTY_NO"));
			if (count==null) {
				count=0;
			}
			count++;
			propertyCount.put(roleMenuPropertys.get(i).get("PROPERTY_NO"),count);
			
			List<String> menupropertys=menuProperty.get(roleMenuPropertys.get(i).get("MENU_NO"));
			if(menupropertys==null){
				menunos.add(roleMenuPropertys.get(i).get("MENU_NO"));
				menupropertys=new ArrayList<String>();
			}
			if(count<=1){
				menupropertys.add(roleMenuPropertys.get(i).get("PROPERTY_NO"));
			}
			menuProperty.put(roleMenuPropertys.get(i).get("MENU_NO"),menupropertys);
		}
		/**
		 * 判断该角色 是否设置了不可用的菜单操作,
		 */
		for (int i = 0; i < userRoles.size(); i++) {
			String s=roleMenu.get(userRoles.get(i).get("ROLE_NO"));
			if (s==null||"".equals(s)) {//如果其中一个角色没有 配置 不可用操作，则 全部都可以操作 
				return "{}";
			}
		}
		/**
		 * 判断菜单操作按钮配置的不可用次数，不可用 次数和角色数一致则说明该菜单是真的 不给该用户使用
		 */
		for (int i = 0; i < menunos.size(); i++) {
			List<String> actions=menuProperty.get(menunos.get(i));
			if (actions==null) {
				menuProperty.put(menunos.get(i),new ArrayList<String>());
				continue;
			}
			for (int j = actions.size()-1; j >=0 ; j--) {
				Integer c=propertyCount.get(actions.get(j));
				if (c==null||c<userRoles.size()) {
					actions.remove(j);
				}
			}
		}
		return JsonUtils.beanToJson(menuProperty);
	}

}