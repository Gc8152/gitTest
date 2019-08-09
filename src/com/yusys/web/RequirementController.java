package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.RequirementService.InsertRequirementsService;


@Controller
@RequestMapping("/requirement_input")
public class RequirementController extends BaseController {
	
	@Resource
	private InsertRequirementsService service;
	
	//新增一条需求
	@RequestMapping("/insertRequirementInfo")
	@ResponseBody
	public void insertRequirementInfo(HttpServletRequest req,HttpServletResponse res)	{	
		
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,service.insertRequirementInfo(req)));	
	}
	//修改需求
	@RequestMapping("/updateRequirementInfo")
	@ResponseBody
	public void updateRequirements(HttpServletRequest req,HttpServletResponse res) {
	
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,service.updateRequirementsInfo(req)));
	}
	
	//查询
	@RequestMapping("/queryalluser")
	@ResponseBody
	public void queryAllUser(HttpServletRequest req,HttpServletResponse res){
		try{
		writeUTFJson(res,JsonUtils.beanToJsonp(req,service.queryAllUser(req)).toLowerCase());
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	//删除
	@RequestMapping("/deleteRequirementInfo")
	@ResponseBody
	public void deleteRequirement(HttpServletRequest req,HttpServletResponse res){
		try {
			res.getWriter().write(JsonUtils.beanToJson(service.deleteRequirement(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
}
