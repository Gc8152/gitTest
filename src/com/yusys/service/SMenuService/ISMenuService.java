package com.yusys.service.SMenuService;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yusys.entity.SMenu;

public interface ISMenuService {
	
	/**
	 * 查询
	 * @param param
	 * @param userid
	 * @return
	 */
	public List<Map<String, String>> queryAllPageMenu(HttpServletRequest req,String userid);
	/**
	 * 创建菜单
	 * @param sMenu
	 */
	public Map<String, String> createMenuInfo(HttpServletRequest req,String userid);
	
	/**
	 * 修改菜单
	 * @param sMenu
	 */
	public Map<String, String> updateMenuInfo(HttpServletRequest req,String userid);
	
	/**
	 * 删除菜单
	 * @param menuNo
	 */
	public Map<String, String> deleteMenuInfo(HttpServletRequest req,String userid);
	/**
	 * 根据菜单编号查询一个菜单
	 * @param menu_no
	 * @return
	 */
	public SMenu findOneMenuInfoByNo(HttpServletRequest req,String userid);
	/**
	 * 创建页面按钮
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> createPageButton(HttpServletRequest req,String userid);
	/**
	 * 修改页面按钮
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> updatePageButton(HttpServletRequest req,String userid);
	
	/**
	 * 修改页面按钮 标识
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> updatePageButtonFlag(HttpServletRequest req,String userid);
	/**
	 * 移除页面按钮
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> removePageButton(HttpServletRequest req,String userid);
	/**
	 * 查询页面按钮
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, Object> queryPageButton(HttpServletRequest req,String userid);
	
	/**
	 * 创建页面属性信息
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> createPageProperty(HttpServletRequest req,String userid);
	/**
	 * 修改页面属性信息
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> updatePageProperty(HttpServletRequest req,String userid);
	
	/**
	 * 修改页面属性 标识
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> updatePagePropertyFlag(HttpServletRequest req,String userid);
	/**
	 * 移除页面属性信息
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> removePageProperty(HttpServletRequest req,String userid);
	/**
	 * 查询页面属性信息
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, Object> queryPageProperty(HttpServletRequest req,String userid);
	/**
	 * 菜单关联角色查询
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, Object> TableRoleMenu(HttpServletRequest req,String userid);
}