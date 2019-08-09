package com.yusys.service.SUserService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yusys.entity.SUser;

public interface ISUserService{
	//查询所有用户
	public Map<String, Object> queryAllUser(HttpServletRequest req,String actorno);
	//查询用户详细信息
	public SUser queryOneUser(HttpServletRequest req,String actorno);
	//创建用户
	public Map<String, String> insertNewUser(HttpServletRequest req,String actorno);
	//修改用户信息
	public Map<String, String> updateUser(HttpServletRequest req,String actorno);
	//删除用户(标记位删除)
	public Map<String, String> delteUser(HttpServletRequest req,String actorno);
	//查询用户密码
	public Map<String, String> findUserPass(HttpServletRequest req,String actorno);
	//修改用户密码
	public Map<String, String> updatePass(HttpServletRequest req,String actorno);
	/**
	 * 用户登录
	 * @param req
	 * @param actorno
	 * @return
	 */
	public  Map<String, Object> userLogin(HttpServletRequest req,String actorno) ;
	/**
	 * 根据用户编号登录
	 * @param userid
	 * @return
	 */
	public  Map<String, Object> userLogin(String userid) ;
	public  Map<String,Object> userLoginForWorkNo(String workNo);
	/**
	 * @author  罗一飞
	 * @param POP框查询所有用户
	 */
	public Map<String, Object>  popFindAllUser(HttpServletRequest req,String userid);//查所有

    public SUser querySUserByNoCache(String user_no);

    public String addUserByCache(String user_no);
	public Map<String, Object> queryDicPerm(String userId);
    /**
     * 通过角色和部门查询用户
     */
	public String queryUserByParam(String org,String role);
	 /**
     * 通过用户查外包人员关联的项目经理
     */
	public String queryManagerByParam(String user_id);
	/**
	 * 修改用户皮肤
	 * 
	 * @param @param req
	 * @param @return
	 * @return Map<String,String> 
	 * @throws 
	 *
	 */
	public Map<String,String> updateSkinType(HttpServletRequest req);
/*	//验证登陆名
	public Object queryLoginName(HttpServletRequest req, String login_name);*/
	
	public Map<String,String> resetAllUserPass(HttpServletRequest req,String userid);
	//查询一个用户的所有角色
	public Map<String, Object> queryAllRoleByUser(HttpServletRequest req);
	 //维护个人信息
	public Object maintain(HttpServletRequest req);
	//人员管理
	public Map<String, Object>  popFindUser(HttpServletRequest req,String userid);
	
}
