package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SFunctionService.ISFunctionService;

@Controller
@RequestMapping("/SFunction")
public class SFunctionController extends BaseController{
	@Resource
	private ISFunctionService service;
	/**
	 * 查询所有常用功能信息
	 */
	@RequestMapping("/queryallfunctions")	
	public void queryallfunctions(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,service.queryAllFunctions(req, getUserId(req))));
	  }
	/**
	 * 删除常用功能
	 */
	@RequestMapping("/delFunctionByMenuCode")	
	public void delFunctionByMenuCode(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(service.delFunctionByMenuCode(req, getUserId(req))));
	  }
	/**
	 * 查看一条常用功能
	 */
	@RequestMapping("/selFunctionByMenuCode")	
	public void selFunctionByMenuCode(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(service.queryFunctionByMenucode(req, getUserId(req))));
	  }
	/**
	 * 插入一条常用功能
	 */
	@RequestMapping("/addfunction")	
	public void addfunction(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(service.saveFunction(req, getUserId(req))));
	  }
	/**
	 * 修改一条常用功能
	 */
	@RequestMapping("/updatefunction")	
	public void updatefunction(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(service.updateFunction(req, getUserId(req))));
	  }
	/**
	 * 根据人员查询工作台常用功能
	 */
	@RequestMapping("/queryAllWorkbenchFunctionByUser")	
	public void queryAllFunctionByUser(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanListToJson(service.queryAllWorkbenchFunctionByUser(req, getUserId(req))));
	  }
	/**
	 * 根据人员删除工作台常用功能
	 */
	@RequestMapping("/delWorkbenchFunctionByMenucode")	
	public void delWorkbenchFunctionByMenucode(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(service.delWorkbenchFunctionByMenucode(req, getUserId(req))));
	  }
	/**
	 * 根据人员查询其他常用功能
	 */
	@RequestMapping("/queryOtherWorkbenchFunctionByUser")	
	public void queryOtherWorkbenchFunctionByUser(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanListToJson(service.queryAllFunctionByUser(req, getUserId(req))));
	  }
	/**
	 * 增加工作台常用功能
	 */
	@RequestMapping("/addUserWorkBenchFunction")	
	public void addUserWorkBenchFunction(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(service.addUserWorkBenchFunction(req, getUserId(req))));
	  }
	/**
	 * 查询当前登录用户
	 */
	@RequestMapping("/queryuserno")	
	public void queryuserno(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,getUserId(req));
	  }
}
