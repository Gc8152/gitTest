package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface SPermissionDao {
	/**
	 * 增加用户权限
	 * @param map
	 */
	public void addUserPermiss(Map<String, String> map);
	/**
	 * 查询用户权限信息
	 * @param map
	 * @return
	 */
	public List<Map<String,Object>> queryUserPermiss(Map<String, String> map);
	/**
	 * 查询用户角色
	 * @param map
	 * @return
	 */
	public List<Map<String,String>> queryUserRoles(String user_no);
	/**
	 * 删除用户角色
	 * @param user_no
	 */
	public void delUserPermiss(String user_no);
	/**
	 * 查询用户菜单
	 * @param map
	 * @return
	 */
	public List<Map<String, String>> queryUserMenus(List<Map<String, String>> role_nos);
	
	/**
	 * 查询用户操作
	 * @param role_nos
	 * @return
	 */
	public List<Map<String, String>> queryUserMenuActions(List<Map<String, String>> role_nos);
	/**
	 * 查询用户菜单级别
	 * @param role_nos
	 * @return
	 */
	public List<Map<String, String>> queryUserMenuDataLevel(List<Map<String, String>> role_nos);
	
	/**
	 * 查询用户菜单字段
	 * @param role_nos
	 * @return
	 */
	public List<Map<String, String>> queryUserMenuPropertys(List<Map<String, String>> role_nos);
	/**
	 * 查询所有的用户编号
	 * @param user_no
	 * @return
	 */
	public List<String> queryAllUsers(String user_no);
	/**
	 * 根据角色编号 查询用户编号
	 * @param role_no
	 * @return
	 */
	public List<String> queryUsersByParam(Map<String, String> map);
	
}