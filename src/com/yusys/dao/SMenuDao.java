package com.yusys.dao;

import java.util.List;
import java.util.Map;

import com.yusys.entity.SMenu;

public interface SMenuDao {
	
	/**
	 * 查询所有
	 * @param param
	 * @return
	 */
	public List<Map<String, String>> queryAllPageMenu(String param);
	
	/**
	 * 创建菜单
	 * @param sMenu
	 */
	public void createMenuInfo(Map<String, String> map);
	
	/**
	 * 修改菜单
	 * @param sMenu
	 */
	public void updateMenuInfo(Map<String, String> map);
	
	/**
	 * 删除菜单
	 * @param menuNo
	 */
	public void deleteMenuInfo(Map<String, Object> map);
	/**
	 * 根据菜单编号查询一个菜单
	 * @param menu_no
	 * @return
	 */
	public SMenu findOneMenuInfoByNo(String menu_no);
	/**
	 * 创建页面菜单按钮
	 * @param map
	 */
	public void  createPageButton(Map<String, String> map);
	
	/**
	 * 查询一个按钮
	 * @param action_no
	 * @return
	 */
	public Map<String, String> queryOnePageButton(Map<String, String> map);
	/**
	 * 查询一个属性
	 * @param action_no
	 * @return
	 */
	public Map<String, String> queryOnePageProperty(Map<String, String> map);
	/**
	 * 修改按钮
	 * @param map
	 */
	public void updateButtonInfo(Map<String, String> map);
	/**
	 * 修改按钮标识
	 * @param map
	 */
	public void updateButtonFlag(Map<String, String> map);
	/**
	 * 删除页面按钮
	 * @param map
	 */
	public void deletePageButton(Map<String, String> map);
	/**
	 * 查询
	 * @return
	 */
	
	public List<Map<String, String>> queryPageButton(String menu_no);
	/**
	 * 创建页面属性信息
	 * @param map
	 */
	public void  createPageProperty(Map<String, String> map);
	/**
	 * 修改属性信息
	 * @param map
	 */
	public void updatePropertyInfo(Map<String, String> map);
	/**
	 * 修改属性标识
	 * @param map
	 */
	public void updatePropertyFlag(Map<String, String> map);
	/**
	 * 删除页面属性信息
	 * @param map
	 */
	public void deletePageProperty(Map<String, String> map);
	/**
	 * 查询
	 * @return
	 */
	public List<Map<String, String>> queryPageProperty(String menu_no);
	/**
	 * 修改子菜单的 父菜单编号
	 * @param map
	 */
	public void updateChilMenuSupNo(Map<String, String> map);
	/**
	 * 修改子菜单的 菜单级别
	 * @param map
	 */
	public void updateChilMenuLevel(Map<String, String> map);
	/**
	 * 修改子菜单按钮的 菜单编号
	 * @param map
	 */
	public void updateMenuButtonMenuNo(Map<String, String> map);
	/**
	 * 修改菜单属性的 菜单编号
	 * @param map
	 */
	public void updateMenuPropertyMenuNo(Map<String, String> map);
	/**
	 * 清空父节点
	 * @param haveId
	 */
	public void clearMenuSupNoInfo(String haveId);
	/**
	 * 菜单关联角色查询
	 * @return
	 */
	public List<Map<String, String>> TableRoleMenu(Map<String, String> map);
}