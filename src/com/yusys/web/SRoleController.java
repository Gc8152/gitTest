package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SRoleService.ISRoleService;
@Controller
@RequestMapping("/SRole")
public class SRoleController extends BaseController{
	@Resource
	private ISRoleService service;
	//乱码转换方法
	public void writeUTFJson(HttpServletResponse res,String json){
		ResponseUtils.jsonMessage(res, json);
	}
	
	
	@RequestMapping("/findSRoleAll")
	//查询全部
	public void findAll(HttpServletRequest req,HttpServletResponse resp){		
		try {
			String json = JsonUtils.beanToJsonp(req,service.findSRoleInfoAll(req,getUserId(req)));
			writeUTFJson(resp,json);
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@RequestMapping("/saveSRole")
	//新增
	public void saveSRole(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(service.saveSRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@RequestMapping("/deleteSRole")
	//删除一条记录
	public void deleteSRoleByNo(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(service.deleteSRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@RequestMapping("/deleteUserOrgRole")
	//删除用户指定机构的角色
	public void deleteUserOrgRole(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(service.deleteUserOrgRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@RequestMapping("/findSRoleById")
	//查询一条数据
	public void findSRoleByNo(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanToJson(service.findSRoleById(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	@RequestMapping("/updateSRole")
	//修改一条数据
	public void updateSRole(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(service.updateSRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/sRoleMenuDis")
	//角色菜单配置
	public void sRoleMenuDis(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(service.SRoleMenuDis(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/sRoleOperDis")
	//角色操作配置
	public void sRoleOperDis(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(service.sRoleOperDis(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/sRoleDataAuth")
	//角色数据权限
	public void sRoleDataAuth(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(service.sRoleDataAuth(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/sRoleFieldAuth")
	//角色字段权限
	public void sRoleFieldAuth(HttpServletRequest req,HttpServletResponse resp){
		try {
			resp.getWriter().write(JsonUtils.beanToJson(service.sRoleFieldAuth(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/findUserRole")
	//角色字段权限
	public void findUserRole(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(service.queryUserRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/findUserNoRole")
	//角色字段权限
	public void findUserNoRole(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(service.queryUserNoRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}	
	@RequestMapping("/addUserRole")
	//角色字段权限
	public void addUserRole(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanToJson(service.addUserRole(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	@RequestMapping("/treeMenuChecked")	
	public void treeMenuChecked(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(service.treeMenuChecked(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/**
	 *  操作列表选中
	 */
	@RequestMapping("/OperateChecked")	
	public void oprDisChecked(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(service.oprDisChecked(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	//数据权限选中
	@RequestMapping("/DataAuthChecked")	
	public void dataAuthChecked(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(service.dataAuthChecked(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	//字段权限被选中
	@RequestMapping("/fileAuthChecked")	
	public void fileAuthChecked(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(service.filedAuthChecked(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	//根据用户编码查询出该用户的所有角色
	@RequestMapping("/findAllRoleById")
	public void findAllSDic(HttpServletRequest req,HttpServletResponse res)	{
		writeUTFJson(res,JsonUtils.beanToJsonp(req,service.findAllRoleById(req,getUserId(req))));
	}
	//根据用户编码查询出该用户的所有角色
		@RequestMapping("/findAllRoles")
		public void findAllRoles(HttpServletRequest req,HttpServletResponse res)	{
			writeUTFJson(res,JsonUtils.beanToJsonp(req,service.findAllRoleById(req,getUserId(req))));
		}
	//查询所有角色
	@RequestMapping("/querySrole")
	public void querySrole(HttpServletRequest req,HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJson(service.querySrole(req)));
	}
	//查询所有常用功能
	@RequestMapping("/queryallfunction")
	public void queryallfunction(HttpServletRequest req,HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJsonp(req,service.queryAllFunctionById(req, getUserId(req))));
	}
	//删除常用功能
	@RequestMapping("/delFunctionByMenuCode")
	public void delFunctionByMenuCode(HttpServletRequest req,HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJson(service.delFunctionByMenuCode(req, getUserId(req))));
	}
	//查询其他所有常用功能菜单信息
	@RequestMapping("/queryOtherFunction")
	public void queryOtherFunction(HttpServletRequest req,HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJsonp(req,service.queryOtherFunction(req,getUserId(req))));
	}
	//插入常用功能
	@RequestMapping("/addFunction")
	public void addFunction(HttpServletRequest req,HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJson(service.addFunction(req, getUserId(req))));
	}
	
	//查询所有相关人员
	@RequestMapping("/queryallrelateUser")
	public void queryallrelateUser(HttpServletRequest req,HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJsonp(req,service.queryAllRelateUser(req, getUserId(req))));
	}
}
