package com.yusys.service.SFunctionService;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yusys.entity.SFunction;

public interface ISFunctionService {
   /*
    * 查询全部常用功能
    */
	public Map<String,Object> queryAllFunctions(HttpServletRequest req,String userid);
	/*
	 * 根据menu_code删除常用功能
	 */
	public Map<String,String> delFunctionByMenuCode(HttpServletRequest req,String userid);
	/*
	 * 根据menu_code查询常用功能
	 */
	public Map<String, Object> queryFunctionByMenucode(HttpServletRequest req,String userid);
	/*
	 * 插入常用功能
	 */
	public Map<String, String> saveFunction(HttpServletRequest req, String userId);
	/*
	 * 修改常用功能
	 */
	public Map<String, String> updateFunction(HttpServletRequest req, String userId);
	/**
	 * 根据人员查询常用功能
	 */
	public List<Map<String, String>> queryAllFunctionByUser(HttpServletRequest req, String userid);
	/**
	 * 根据人员查询工作台显示的常用功能
	 */
	public List<Map<String, String>> queryAllWorkbenchFunctionByUser(HttpServletRequest req,String userid);
	/**
	 * 删除用户工作台常用功能
	 * @param 
	 */
	public Map<String, String> delWorkbenchFunctionByMenucode(HttpServletRequest req,String userid);
	/**
	 * 增加用户常规操作
	 * @param map
	 */
	public Map<String, String> addUserWorkBenchFunction(HttpServletRequest req,String userid);

}
