package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SRemindService.ISRemindService;

@Controller
@RequestMapping("/myRemind")
public class SRemindController extends BaseController{
	@Resource
	private ISRemindService service;
	/**
	 * 查询所有提醒
	 */
	@RequestMapping("/findMyRemindByUserid")	
	public void findMyRemindByUserid(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(service.findMyRemindByUserid(req, getUserId(req))));
	  }
	/**
	 * 查询所有提醒详情
	 */
	@RequestMapping("/querySubRemindByType")	
	public void querySubRemindByType(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req, service.querySubRemindByType(req, getUserId(req))));
	  }
	/**
	 * 根据类型删除提醒
	 */
	@RequestMapping("/deleteSubRemind")	
	public void deleteSubRemind(HttpServletRequest req,HttpServletResponse res){
		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(service.deleteSubRemind(req, getUserId(req))));
	  }
}
