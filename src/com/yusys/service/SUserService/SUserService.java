package com.yusys.service.SUserService;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.dao.SConfigDao;
import com.yusys.dao.SUserDao;
import com.yusys.entity.SUser;

@Service
@Transactional
public class SUserService implements ISUserService {
	@Resource
	private SUserDao sUserdao;
	@Resource
	private SConfigDao sConfigdao;
	
	/**
	 * 登陆名、密码和人数验证
	 */
	@Override
	public Map<String, Object> userLogin(HttpServletRequest req,String actorno) {
		//String check_code=(String)req.getSession().getAttribute(RequestUtils.check_code);
		//req.getSession().removeAttribute(RequestUtils.check_code);
		Map<String, Object> resultMap=new HashMap<String, Object>();
		String []must={"loginname","password"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			resultMap.put("result", "false");
			resultMap.put("msg", "缺少必填项!");
			return resultMap;
		}
		String loginname=pmap.get("loginname");
		HttpSession session=req.getSession();
		ServletContext application=	session.getServletContext();
		try{
			Integer loginCount = (Integer) application.getAttribute("loginCount");
			if(null==loginCount||loginCount<1){
				loginCount=1;
			}else{
				loginCount++;
			}
			String count = sConfigdao.queryUserNow();
			if(count==null||count.equals("")){
				count = "0";
			}
			Integer counts = Integer.parseInt(count);
			if(!"admin".equals(loginname)){
				if(loginCount>counts){
					resultMap.put("result", "false");
					resultMap.put("loginname_error", "登录人数过多,请稍后重试!");
					return resultMap;
				}
			}
			application.setAttribute("loginCount", loginCount);
			String password=pmap.get("password");
			pmap.remove("password");
			SUser user=sUserdao.findByParam(pmap);
			if(user==null){
				resultMap.put("result", "false");
				resultMap.put("loginname_error", "用户名错误!");
				return resultMap;
			}
			/*if(check_code==null||!pmap.get("check_code").equals(check_code)){
				resultMap.put("result", "false");
				resultMap.put("msg", "验证码错误!");
				return resultMap;
			}*/
			if(!"password@123".equals(password)){
				pmap.put("password", JsonUtils.MD5Encryption(password));
			} else {
				pmap.put("password", "");
			}
			SUser user1=sUserdao.findByParam(pmap);
			if(user1==null){
				resultMap.put("result", "false");
				resultMap.put("password_error", "密码错误!");
				return resultMap;
			}
			if(!isPasswordStandard(password)){//如果用户密码不符合要求
				user1.setStandard("notNormal");
			}
			//resultMap.put("userid", user.getUser_no());
			//resultMap.put("loginname", user.getLogin_name());
			resultMap.put("userinfo", user1);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}
	
	@Override
	public Map<String, Object> userLogin(String userid) {
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("user_no", userid);
		SUser user=sUserdao.findByParam(pmap);
		
		Map<String, Object> resultMap=new HashMap<String, Object>();
		if(user==null){
			resultMap.put("result", "false");
			resultMap.put("msg", "用户名或者密码错误!");
			return resultMap;
		}
		resultMap.put("userinfo", user);
		resultMap.put("result", "true");
		return resultMap;
	}
	
	/**
	 * 判断用户密码是否符合要求
	 * @param password
	 * @return
	 */
	public boolean isPasswordStandard(String password) {
		String str = "^[a-zA-Z]\\w{7,17}$";//以字母开头，包含数字和下划线长度为8-18位的密码
		boolean isAdapt = password.matches(str);//判断密码是否符合规则，是则返回true，否则返回false
		return isAdapt;
	}
	
	/**
	 * 查询所有用户
	 * @param req
	 * @param actorno
	 * @return
	 */
	public Map<String, Object> queryAllUser(HttpServletRequest req,String actorno){
		Map<String, Object> map=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String user_no = RequestUtils.getParamValue(req, "user_no");
		String user_name = RequestUtils.getParamValue(req, "user_name");
		String org_name = RequestUtils.getParamValue(req, "org_name");
		String user_name1 = "";
		try {
			user_name1 = URLDecoder.decode(user_name,"UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		String org_name1 = "";
		try {
			org_name1 = URLDecoder.decode(org_name,"UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		String login_name = RequestUtils.getParamValue(req, "login_name");
		String state = RequestUtils.getParamValue(req, "state");
		String is_banker = RequestUtils.getParamValue(req, "is_banker");
		
		if(user_no!=""){
			pmap.put("user_no","%"+user_no+"%");			
		}
		if(user_name!=""){
			pmap.put("user_name","%"+user_name1+"%");
		}
		if(login_name!=""){
			pmap.put("login_name","%"+login_name+"%");
		}
		if(org_name!=""){
			pmap.put("org_name","%"+org_name1+"%");
		}
		pmap.put("state",state);
		pmap.put("is_banker",is_banker);
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		System.out.println("pmap:"+pmap);
		List<Map<String, String>> m=sUserdao.queryAllUser(pmap);
		map.put("rows", m);
		map.put("total", pmap.get("total"));
		return map;
	} 
	/**
	 * 创建用户
	 */
	public Map<String, String> insertNewUser(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		String password = RequestUtils.getParamValue(req, "password");
		try{
			//必填参数列表
			String[] must=new String[]{"user_no","login_name","user_name","state","org_no_code","user_mail",
					"is_banker"};
			//非必填的参数列表
			String[] nomust=new String[]{"nick_name","memo","user_post","user_level","user_mobile","outpersion_id","work_no"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			String password1 = JsonUtils.MD5Encryption(password);
			pmap.put("password", password1);
			pmap.put("create_no",actorno);
			pmap.put("create_time", DateTimeUtils.getFormatCurrentTime());
			pmap.put("skin_type","00");
//			pmap.put("login_name",pmap.get("work_no"));
			
			@SuppressWarnings("unchecked")
			List<Map<String,String>> fm = (List<Map<String, String>>) sUserdao.queryOneUser(pmap);
		List<Map<String, String>> ls=sUserdao.queryLoginName(pmap);
			if(fm.size() > 0){
				resultMap.put("msg", "此用户编号已存在！");
				return resultMap;
			}else if(ls.size()>0){
				resultMap.put("msg", "此登录名称已存在！");
				return resultMap;
			}
			else {
				int rs = sUserdao.insertNewUser(pmap);
				if(rs > 0){
					resultMap.put("result", "true");
					return resultMap;
				}
				
			}
			/*//sUserdao.insertNewUser(pmap);
			resultMap.put("result", "true");
			return resultMap;*/
		}catch(Exception e){
			e.printStackTrace();
		}
		return resultMap;
	}
	/**
	 * 查询用户详细信息
	 */
	public SUser queryOneUser(HttpServletRequest req,String actorno){
		String user_no = RequestUtils.getParamValue(req, "user_no");
		try{
			return sUserdao.queryOneUser(user_no);
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 修改用户信息
	 */
	public Map<String, String> updateUser(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			//必填参数列表
			String[] must=new String[]{"user_no","user_name","state","org_no_code",
					"user_mail","is_banker"};
			//非必填的参数列表
			String[] nomust=new String[]{"nick_name","memo","user_post","user_level","user_mobile","outpersion_id","work_no"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("login_name",pmap.get("work_no"));
			pmap.put("update_no",actorno);
			pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());
			sUserdao.updateUser(pmap);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		return resultMap;
	}
	/**
	 * 删除个人信息
	 */
	public Map<String, String> delteUser(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			String user_no=RequestUtils.getParamValue(req, "user_no");
			if (user_no==null||"".equals(user_no.trim())) {
				resultMap.put("result", "false");
				return resultMap;
			}
			Map<String, Object> pmap=new HashMap<String, Object>();
			
			pmap.put("user_no", user_no);
			pmap.put("update_no",actorno);
			pmap.put("update_time", DateTimeUtils.getFormatCurrentTime());
			try {
				sUserdao.delteUser(pmap);
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
	/**
	 * 查询角色
	 */
	public Map<String, Object> queryRoleuser(HttpServletRequest req,String actorno){
		Map<String, Object> map=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String user_no = RequestUtils.getParamValue(req, "user_no");
		pmap.put("user_no",user_no);
		
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String, String>> m=sUserdao.queryRoleuser(pmap);
		//List<Map<String,String>> pagination = RequestUtils.pagination(req, m);
		map.put("rows", m);
		map.put("total", pmap.get("total"));
		return map;
	} 
	/**
	 * 插入权限
	 */
	public Map<String, String> insertRoleuser(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		Map<String, String> pmap= new HashMap<String, String>();
		try{
			String user_no = RequestUtils.getParamValue(req, "user_no");
			String[] role_no = req.getParameterValues("role_no");
			for(int i = 0 ;i< role_no.length ; i++){
				if (role_no[i]==null||role_no[i]=="") {
					resultMap.put("result", "false");
					return resultMap;
				}
				pmap.put("user_no", user_no);
				pmap.put("role_no", role_no[i]);
				pmap.put("opt_no",actorno);
				pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
				sUserdao.insertNewUser(pmap);
			}
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		return resultMap;
	}

	/**
	 * @author  罗一飞
     * POP框查询所有用户
	 * @param
	 */
	@Override
	public Map<String, Object> popFindAllUser(HttpServletRequest req,String userid) {
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			String system_num = req.getParameter("system_num");
			    pmap.put("system_num", system_num);
			pmap.put("state", req.getParameter("PopUserState"));
			if(req.getParameter("PopUserNo")!=null&&!"".equals(req.getParameter("PopUserNo"))){
				pmap.put("user_no", req.getParameter("PopUserNo"));
			}
			String PopUserLoginName=req.getParameter("PopUserLoginName");
			if(PopUserLoginName!=null&&!"".equals(PopUserLoginName)){
				PopUserLoginName = URLDecoder.decode(PopUserLoginName,"UTF-8");
				pmap.put("login_name",  "%"+PopUserLoginName+"%");
			}
			String PopUserName = req.getParameter("PopUserName");
			if(PopUserName!=null&&!"".equals(PopUserName)){
				PopUserName = URLDecoder.decode(PopUserName,"UTF-8");
				pmap.put("user_name",  "%"+PopUserName+"%");
			}
			String role_name = req.getParameter("role_name");
			if(role_name!=null&&!"".equals(role_name)){
				role_name = URLDecoder.decode(role_name,"UTF-8");
				pmap.put("role_name",  "%"+role_name+"%");
			}
			pmap.put("login_no", req.getParameter("login_no"));
			if(req.getParameter("notLoginNo_org")!=null){
				pmap.put("notLoginNo_org", req.getParameter("notLoginNo_org"));
			}
			if(req.getParameter("org_nos")!=null&&!"".equals(req.getParameter("org_nos"))){
				pmap.put("org_nos","(\'"+req.getParameter("org_nos").replace(",","\',\'")+"\')");
			}
			if(req.getParameter("org_code")!=null&&!"".equals(req.getParameter("org_code"))){
				pmap.put("org_no",req.getParameter("org_code"));
			}
			if(req.getParameter("role")!=null&&!"".equals(req.getParameter("role"))){
				pmap.put("role","(\'"+req.getParameter("role").replace(",","\',\'")+"\')");
			}
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> m = sUserdao.popFindAllUser(pmap);
			map.put("rows", m);
			map.put("total", pmap.get("total"));		

		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	
	
	/**
	 * 查询用户密码
	 */
	public Map<String, String> findUserPass(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		String user_no = RequestUtils.getParamValue(req, "user_no");
		String password = RequestUtils.getParamValue(req, "password");
		try{
			//页面上的旧密码
			String password1 = null;
			if(!"".equals(password)&&password!=null){
				password1 = JsonUtils.MD5Encryption(password);
			}
			//数据库中的密码
			String pass_word = sUserdao.findUserPass(user_no);
			if(pass_word.equals(password1)){
				resultMap.put("result", "true");
				return resultMap;
			}else{
				resultMap.put("result", "false");
				return resultMap;
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		return resultMap;
	}
	
	/**
	 * 修改用户密码
	 */
	public Map<String , String > updatePass(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		String user_no = RequestUtils.getParamValue(req, "user_no");
		String password = RequestUtils.getParamValue(req, "password");
		String old_pwd  = RequestUtils.getParamValue(req, "old_pwd");
		try{
			String password1 = JsonUtils.MD5Encryption(password);
			Map<String, String> pmap = new HashMap<String, String>();
			pmap.put("user_no", user_no);
			pmap.put("password", password1);
			if (old_pwd!=null&&old_pwd.trim().length()>0) {
				pmap.put("old_pwd", JsonUtils.MD5Encryption(old_pwd));
			}
			sUserdao.updatePass(pmap);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
    @Override
    @Cacheable(key="'querySUserByNoCache'+#user_no", value="userCache")
    public SUser querySUserByNoCache(String user_no){
        SUser sUser= sUserdao.queryOneUser(user_no);
        return  sUser;
    }
    @CachePut(key ="#userno",value ="userCache")
    public String addUserByCache(String userno){
    	return "OK";
    }
    /**
     * 查询用户管理字典项的权限
     * @return
     */
	@Override
	public Map<String, Object> queryDicPerm(String userId) {
		Map<String,String> param = new HashMap<String, String>();
		param.put("user_no", userId);
		List<Map<String, String>> user_role=sUserdao.queryRoleuser(param);
		Map<String, Object> retMap = new HashMap<String, Object>();
		StringBuffer sb = new StringBuffer();
		for(int i=0;i<user_role.size();i++){
			if("admin".equals(user_role.get(i).get("ROLE_NO"))){
				sb=new StringBuffer();
				sb.append(",admin");
				break;
			}else{
				sb.append(","+user_role.get(i).get("ROLE_NO"));
			}
		}
		retMap.put("dicperm", sb.substring(1).toString());
		return retMap;
	}
    /**
     * 通过角色和部门查询用户
     */
	public String queryUserByParam(String org,String role){
		Map<String,String> param = new HashMap<String, String>();
		String users="";//返回节点审批人(根据部门&角色或者角色查询)
		if(role.contains(",")){//多个角色
			String[] roles=role.split(",");
			for(int i=0;i<roles.length;i++){
				param.put("role",roles[i]);
				param.put("org",org);
				List<String> user_no = sUserdao.queryUserByParam(param);
				if(user_no!=null && user_no.size()>0){
					for(int j = 0;j<user_no.size();j++){
						users += user_no.get(j) + ",";
					}
				}
			}
			users = users.substring(0, users.length()-1);
		}else{//单个角色
			param.put("org",org);
			param.put("role",role);
			List<String> user_no = sUserdao.queryUserByParam(param);
			if(user_no!=null && user_no.size()>0){
				for(int i = 0;i<user_no.size();i++){
					users += user_no.get(i) + ",";
				}
				users = users.substring(0, users.length()-1);
			}
		}
		return users;
	}
	 /**
     * 通过用户查外包人员关联的项目经理
     */
	public String queryManagerByParam(String user_id){
		return sUserdao.queryManagerByParam(user_id);
	}
	@Override
	public Map<String, String> updateSkinType(HttpServletRequest req) {
		HttpSession session=req.getSession();
		Map<String, String> resultMap=new HashMap<String, String>();
		Map<String,String> pmapMap = new HashMap<String, String>();
		String user_no = RequestUtils.getParamValue(req, "user_no");
		String skin_type = RequestUtils.getParamValue(req, "skin_type");
		pmapMap.put("user_no", user_no);
		pmapMap.put("skin_type", skin_type);
		sUserdao.updateSkinType(pmapMap);
		SUser user=sUserdao.findByParam(pmapMap);
		if(user!=null){
			session.setAttribute("userinfo", user);
		}
		resultMap.put("result", "true");
		return resultMap;
	}

	/**
	 * 初始化所有用户密码
	 */
	@Override
	public Map<String, String> resetAllUserPass(HttpServletRequest req,
			String userid) {
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			List<Map<String, String>> users=sUserdao.queryAllUser(resultMap);
			for(int i=0;i<users.size();i++){
				String user_no = users.get(i).get("USER_NO");
				String password = "123456";
				if(!"0".equals(user_no)){
					String password1 = JsonUtils.MD5Encryption(password);
					Map<String, String> pmap = new HashMap<String, String>();
					pmap.put("user_no", user_no);
					pmap.put("password", password1);
					sUserdao.updatePass(pmap);
				}
			}
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> userLoginForWorkNo(String workNo) {
		
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("work_no", workNo);
		SUser user=sUserdao.findByParam(pmap);
		
		Map<String, Object> resultMap=new HashMap<String, Object>();
		if(user==null){
			resultMap.put("result", "false");
			resultMap.put("msg", "用户名或者密码错误!");
			return resultMap;
		}
		resultMap.put("userinfo", user);
		resultMap.put("result", "true");
		return resultMap;
	}
	//查询一个用户的所有角色
	@Override
	public Map<String, Object> queryAllRoleByUser(HttpServletRequest req) {
		Map<String, Object> map=new HashMap<String,Object>();
		try{
			String[] must = {"limit","offset","user_no"};
			String[] nomust = new String[]{"role_no","org_code"};	
			Map<String, String> pmap = RequestUtils.requestToMap(req, must, nomust);
			List<Map<String,String>> list = sUserdao.queryAllRoleByUser(pmap);
			map.put("rows", list);
			map.put("total", pmap.get("total"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
	//维护个人信息
	@Override
	public Map<String, Object> maintain(HttpServletRequest req) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		Map<String, Object> map=new HashMap<String,Object>();
		String user_no=RequestUtils.getParamValue(req, "user_no");
		String user_mobile = RequestUtils.getParamValue(req, "user_mobile");
		String user_mail = RequestUtils.getParamValue(req, "user_mail");
		String memo = RequestUtils.getParamValue(req, "memo");
		try{
			if(memo!=null&&!"".equals(memo)){
				memo=URLDecoder.decode(memo,"UTF-8");
			}
			map.put("user_no", user_no);
			map.put("user_mobile", user_mobile);
			map.put("user_mail", user_mail);
			map.put("memo", memo);
			sUserdao.maintain(map);//修改维护信息
			resultMap.put("result", "true");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultMap;
	}
	
	//人员管理
	@Override
	public Map<String, Object> popFindUser(HttpServletRequest req,String userid) {
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			Map<String, String> pmap = new HashMap<String, String>();
			String system_num = req.getParameter("system_num");
			    pmap.put("system_num", system_num);
			pmap.put("state", req.getParameter("PopUserState"));
			if(req.getParameter("PopUserNo")!=null&&!"".equals(req.getParameter("PopUserNo"))){
				pmap.put("user_no", req.getParameter("PopUserNo"));
			}
			String PopUserLoginName=req.getParameter("PopUserLoginName");
			if(PopUserLoginName!=null&&!"".equals(PopUserLoginName)){
				PopUserLoginName = URLDecoder.decode(PopUserLoginName,"UTF-8");
				pmap.put("login_name",  "%"+PopUserLoginName+"%");
			}
			String PopUserName = req.getParameter("PopUserName");
			if(PopUserName!=null&&!"".equals(PopUserName)){
				PopUserName = URLDecoder.decode(PopUserName,"UTF-8");
				pmap.put("user_name",  "%"+PopUserName+"%");
			}
			String role_name = req.getParameter("role_name");
			if(role_name!=null&&!"".equals(role_name)){
				role_name = URLDecoder.decode(role_name,"UTF-8");
				pmap.put("role_name",  "%"+role_name+"%");
			}
			pmap.put("login_no", req.getParameter("login_no"));
			if(req.getParameter("notLoginNo_org")!=null){
				pmap.put("notLoginNo_org", req.getParameter("notLoginNo_org"));
			}
			if(req.getParameter("org_nos")!=null&&!"".equals(req.getParameter("org_nos"))){
				pmap.put("org_nos","(\'"+req.getParameter("org_nos").replace(",","\',\'")+"\')");
			}
			if(req.getParameter("org_code")!=null&&!"".equals(req.getParameter("org_code"))){
				pmap.put("org_no",req.getParameter("org_code"));
			}
			if(req.getParameter("role")!=null&&!"".equals(req.getParameter("role"))){
				pmap.put("role","(\'"+req.getParameter("role").replace(",","\',\'")+"\')");
			}
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			List<Map<String, String>> m = sUserdao.popFindUser(pmap);
			map.put("rows", m);
			map.put("total", pmap.get("total"));		

		} catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}
}