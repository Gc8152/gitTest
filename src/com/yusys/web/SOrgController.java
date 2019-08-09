package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SOrgService.ISOrgService;

@Controller
@RequestMapping("/SOrg")
public class SOrgController extends BaseController{
	@Resource
	private ISOrgService orgService;
	
	public void writeUTFJson(HttpServletResponse res,String json){
		ResponseUtils.jsonMessage(res, json);
	}
	//查列表
	@RequestMapping("/queryorgtreelist")
	public void queryOrgTreeList(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanListToJson(orgService.queryOrgTreeList(req,getUserId(req))).toLowerCase().replace("isparent","isParent"));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//查询树状结构列表不包含中心
	@RequestMapping("/queryOrgTreeWithCenterList")
	public void queryOrgTreeWithCenterList(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanListToJson(orgService.queryOrgTreeWithCenterList(req,getUserId(req))).toLowerCase().replace("isparent","isParent"));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//查询到上一级列表
	@RequestMapping("/queryorgtreedeptlist")
	public void queryOrgTreeDeptList(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanListToJson(orgService.queryOrgTreeDeptList(req,getUserId(req))).toLowerCase());
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	//查询末级列表
	@RequestMapping("/queryorgtreeofficeslist")
	public void queryOrgTreeOfficesList(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanListToJson(orgService.queryOrgTreeOfficesList(req,getUserId(req))).toLowerCase());
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	//根据处室查询岗位
	@RequestMapping("/queryorgtreepostlist")
	public void queryOrgTreePostList(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanListToJson(orgService.queryOrgTreePostList(req,getUserId(req))).toLowerCase());
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	//创建机构
	@RequestMapping("/createsorg")
	public void createSOrg(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(orgService.insertNewOrg(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//查询详情
	@RequestMapping("/findonesorg")
	public void findonesorg(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(orgService.findOrgByOrgNo(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//修改
	@RequestMapping("/updatesorg")
	public void updatePayDate(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(orgService.updatePayDate(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//删除
	@RequestMapping("/deletesorg")
	public void delete(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(orgService.delete(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//根据用户编码查询出该用户的所有管理机构
	@RequestMapping("/findAllOrgById")
	public void findAllOrgById(HttpServletRequest req,HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJsonp(req,orgService.findAllOrgById(req,getUserId(req))));
	}
	
	//系统启用状态修改
	@RequestMapping("/updateSysEnableFlag")
	public void updateSysEnableFlag(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(orgService.updateSysEnableFlag(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//机构下创建岗位
	@RequestMapping("/insertOrgPosition")
	 public void insertOrgPosition(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(orgService.insertOrgPosition(req,getUserId(req))));
	 }
	//修改机构下岗位
	 @RequestMapping("/updateOrgPosition")
	 public void updateOrgPosition(HttpServletRequest req,HttpServletResponse res){
		 writeUTFJson(res,JsonUtils.beanToJson(orgService.updateOrgPosition(req,getUserId(req))));
	 }
	 //删除机构下岗位
	 @RequestMapping("/updateOrgPositionFlag")
	 public void updateOrgPositionFlag(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(orgService.updateOrgPositionFlag(req,getUserId(req))));
	 }
	 //查询机构下岗位
	 @RequestMapping("/queryOrgPosition")
	 public void queryOrgPosition(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJsonp(req,orgService.queryOrgPosition(req,getUserId(req))));
	 }
	 //查询机构下所有用户信息
	 @RequestMapping("/queryUserPosition")
	 public void queryUserPosition(HttpServletRequest req,HttpServletResponse res){
		 	writeUTFJson(res, JsonUtils.beanToJsonp(req,orgService.queryUserPosition(req,getUserId(req))));	
	 }
}
