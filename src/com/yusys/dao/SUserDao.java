package com.yusys.dao;

import java.util.List;
import java.util.Map;

import com.yusys.entity.SUser;

public interface SUserDao {
	//登陆
	public SUser findByParam(Map<String, String> map);
	//查询所有用户
	public List<Map<String, String>> queryAllUser(Map<String, String> map);
	//创建用户
	public int insertNewUser(Map<String, String> map);
	//查询单个用户信息
	public SUser queryOneUser(String user_no);
	//修改个人信息
	public void updateUser(Map<String, String> map);
	//删除用户信息
	public void delteUser(Map<String, Object> map);
	//查询角色
	public List<Map<String, String>> queryRoleuser(Map<String, String> map);
	//POP框查多条件询所有用户
	public List<Map<String, String>> popFindAllUser(Map<String, String> map);
	//查询用户密码
	public String findUserPass(String user_no);
	//修改用户密码
	public void updatePass(Map<String, String> map);
	//根据用户角色和部门查询人员编号
	public List<String> queryUserByParam(Map<String, String> param);
	// 通过用户查外包人员关联的项目经理
	public String queryManagerByParam(String user_id);
	//修改用户皮肤
	public void updateSkinType(Map<String, String> map);
	//验证登陆名
	public  List<Map<String, String>> queryLoginName(Map<String, String> pmap);
	//计算用户是否存在
	public List<Map<String, String>> queryOneUser(Map<String, String> pmap);
	//查询一个用户的所有角色
	public List<Map<String, String>> queryAllRoleByUser(Map<String, String> pmap);
	//维护个人信息
	public void maintain(Map<String, Object> map);
	//人员添加
	public List<Map<String, String>> popFindUser(Map<String, String> map);	
	
}
