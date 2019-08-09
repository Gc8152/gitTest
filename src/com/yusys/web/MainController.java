package com.yusys.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.pack.RecePack;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.LogUtil;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.common.cache.redis.IMyCache;
import com.yusys.common.cache.redis.RedisCache;
import com.yusys.entity.SUser;
import com.yusys.service.SConfigService.SConfigService;
import com.yusys.service.SPermissionService.ISPermissionService;
import com.yusys.service.SUserService.ISUserService;

/**
 * 控制用户跳转
 * 
 * @author Administrator
 * 
 */
@Controller
@RequestMapping("/")
public class MainController extends BaseController {
	private static final Logger logger = Logger.getLogger(MainController.class);
	@Resource
	private ISUserService suserService;
	@Resource
	private ISPermissionService permissionService;
	@Resource
	private RedisCache redisCache;
	@Resource
	private LogUtil logUtil;
	@Resource
	public SConfigService sConfigService;
	/**
	 * 登入 设置cookie
	 * 
	 * @param req
	 * @param res
	 */
	@RequestMapping("login")
	public void login(HttpServletRequest req, HttpServletResponse res) {
		Map<String, Object> vmap = new HashMap<String, Object>();
		vmap = suserService.userLogin(req, "");
		if ("true".equals(vmap.get("result"))) {
			setSessionData(req,vmap.get("userinfo"));
		}
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(vmap));
	}
	/**
	 * 设置session数据
	 * @param req
	 * @param object
	 */
	private void setSessionData(HttpServletRequest req,Object object){
		HttpSession session=req.getSession();
		int maxSessionActive = sConfigService.queryMaxSessionActive();
		session.setMaxInactiveInterval(maxSessionActive);//0或-1无限期
		session.setAttribute("userinfo", object);
		SUser su = (SUser)object;
		//登陆后将session放到redis中
		redisCache.set(su.getUser_no(), su.getUser_no(), maxSessionActive);
		logUtil.insertLogInfo(req,su.getUser_no(),"用户登录",logUtil.SUCCESS, "",logUtil.LOGIN,"");
	}
	/**
	 * 移除session数据
	 * @param req
	 */
	private void removeSessionData(HttpServletRequest req){
		HttpSession session=req.getSession();
		ServletContext application=	session.getServletContext();
		Integer loginCount = (Integer) application.getAttribute("loginCount");
		if(loginCount!=null){
			loginCount--;
			application.setAttribute("loginCount", loginCount);
		}
		session.removeAttribute("userinfo");
	}
	/**
	 * 登出清除cookie
	 * 
	 * @param req
	 * @param res
	 */
	@RequestMapping("logout")
	public void logout(HttpServletRequest req, HttpServletResponse res) {
		if (req.getSession(false) != null) {
			removeSessionData(req);
			//退出 减人数
			/*ServletContext context=req.getSession().getServletContext();
			Integer count=(Integer)context.getAttribute("count");   
			int co=count==null?1:count.intValue();   
			count=new Integer(co-1);
			context.setAttribute("count", count);   */
		}
		ResponseUtils.jsonMessage(res, "{\"result\":\"true\"}");
	}
	@RequestMapping("index")
	public void toIndex(HttpServletRequest req, HttpServletResponse res) {
		if (checkMkeyLogin(req)||isLogined(req)) {// 已经登录过了，跳转页面
			toJsp(req,res,"WEB-INF/pages/main.jsp");
			return;
		}else{
			toJsp(req,res,"errorPage/timeout.jsp");
		}
	}
	@RequestMapping("oAMain")
	public void oaToMain(HttpServletRequest req, HttpServletResponse res) {
		if (checkMkeyLogin(req)) {
			toJsp(req,res,"WEB-INF/pages/oa_main.jsp");
			return;
		}else{
			toJsp(req,res,"errorPage/timeout.jsp");
		}
	}
	/**
	 * 用户菜单
	 * @param req
	 * @param res
	 */
	@RequestMapping("user/usermenu")
	public void getUserMenu(HttpServletRequest req, HttpServletResponse res) {
		if (isLogined(req)) {
			SUser user=(SUser)req.getSession(false).getAttribute("userinfo");
			ResponseUtils.jsonMessage(res, permissionService.queryUserPermiss(req, IMyCache.perm_menu,user.getUser_no()));
		}
	}
	/**
	 * 用户操作
	 * @param req
	 * @param res
	 */
	@RequestMapping("user/usermenuopt")
	public void getUserMenuOpt(HttpServletRequest req, HttpServletResponse res) {
		if (isLogined(req)) {
			SUser user=(SUser)req.getSession(false).getAttribute("userinfo");
			ResponseUtils.jsonMessage(res, permissionService.queryUserPermiss(req, IMyCache.perm_opt,user.getUser_no()));
		}
	}
	/**
	 * 用户菜单属性
	 * @param req
	 * @param res
	 */
	@RequestMapping("user/usermenuproperty")
	public void getUserMenuProperty(HttpServletRequest req, HttpServletResponse res) {
		if (isLogined(req)) {
			SUser user=(SUser)req.getSession(false).getAttribute("userinfo");
			ResponseUtils.jsonMessage(res, permissionService.queryUserPermiss(req, "PERM_PROPERTY",user.getUser_no()));
		}
	}
	/**
	 * 是否已经登录
	 * @param req
	 * @return
	 */
	private boolean isLogined(HttpServletRequest req){
		if (req.getSession(false) != null&&req.getSession(false).getAttribute("userinfo")!=null) {
			return true;
		}
		return false;
	}
	/**
	 * 检查并登录
	 * @param req
	 * @return
	 */
	private boolean checkMkeyLogin(HttpServletRequest req){
		try {
			String mkey=RequestUtils.getParamValue(req, "m");
			String userid=RequestUtils.getParamValue(req, "u");
			if (RequestUtils.checkMkey(userid, mkey)) {
				Map<String, Object> userInfo=suserService.userLogin(userid);
				if ("true".equals(userInfo.get("result"))) {
					setSessionData(req,userInfo.get("userinfo"));
					return true;
				}
			}
			
		} catch (Exception e) {
		}
		return false;
	}
	
	@RequestMapping("main")
	public void toMain(HttpServletRequest req, HttpServletResponse res) {
		if (getAllUserId(req)) {// 已经登录过了，跳转页面
			toJsp(req,res,"WEB-INF/pages/main.jsp");
			return;
		}else{
			toJsp(req,res,"errorPage/timeout.jsp");
		}
	}
	
	private Boolean getAllUserId(HttpServletRequest req){
		try {
			HttpSession session = req.getSession();
			RecePack userPack = (RecePack)session.getAttribute(org.jn.Client.getFUser());
			String userid = userPack.getUser();
			if(userid!=null && !"".equals(userid)){
				Map<String, Object> userInfo=suserService.userLoginForWorkNo(userid);
				if ("true".equals(userInfo.get("result"))) {
					setSessionData(req,userInfo.get("userinfo"));
					return true;
				}
			}
		} catch (Exception e) {
		}
		
		return false;
	}
	
}
