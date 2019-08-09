package com.yusys.dao;

import java.util.List;
import java.util.Map;

import com.yusys.entity.SFunction;


public interface SFunctionDao {
	/*
	 * 查询全部常用功能
	 */
	public List<Map<Object, String>> queryAllFunctions(Map<String, String> map);
	/*
	 * 根据menu_code删除常用功能
	 */
	public void delFunctionByMenucode(Map<String, String> map);
	/*
	 * 根据menu_code查询常用功能
	 */
	public Map<String, String> findFunctionByMenucode(String menu_code);
	/*
	 * 插入常用功能
	 */
	public void addFunction(SFunction sFunction);
	/*
	 * 查询编号
	 */
	public String findMenuCode(String menu_code);
	/*
	 * 修改失主信息
	 */
	public void updateFunction(SFunction sFunction);
	/**
	 * 根据人员查询常用功能
	 */
	public List<Map<String, String>> queryAllFunctionByUser(String user_id);
	/**
	 * 根据人员查询工作台显示的常用功能
	 */
	public List<Map<String, String>> queryAllWorkbenchFunctionByUser(String userid);
	/**
	 * 删除用户常规操作
	 * @param map
	 */
	public void delWorkbenchFunctionByMenucode(Map<String, String> map);
	/**
	 * 增加 用户常规操作
	 * @param map
	 */
	public void addUserWorkBenchFunction(Map<String, String> map);
	/**
	 * 根据角色编号和菜单编号删除用户常规操作
	 * @param map
	 */
	public void delWorkbenchFunctionByMenucodeAndRoleNo(Map<String, String> map);
}
