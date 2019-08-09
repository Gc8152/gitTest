package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SConfigService.ISConfigService;
@Controller
@RequestMapping("/SConfig")
public class SConfigController  extends BaseController{
	@Resource
	private ISConfigService service;
	//乱码转换方法
	public void writeUTFJson(HttpServletResponse res,String json){
		ResponseUtils.jsonMessage(res, json);
	}
	@RequestMapping("/updateEmail")	
	public void findAll(HttpServletRequest req,HttpServletResponse resp){		
		try {
			writeUTFJson(resp,JsonUtils.beanToJson(service.updateEmail(req, getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 查询用户阀值信息
	 */
	@RequestMapping("/queryConUser")
	public void queryConUser(HttpServletRequest req,HttpServletResponse resp){
		try{
			writeUTFJson(resp,JsonUtils.beanToJson(service.queryConUser(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 查询session超时
	 */
	@RequestMapping("/queryConSession")
	public void queryConSession(HttpServletRequest req,HttpServletResponse resp){
		try{
			writeUTFJson(resp,JsonUtils.beanToJson(service.queryConSession(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	/**
	 * 通过配置编码，查新配置参数信息 
	 * @param @param req
	 * @param @param resp
	 * @return void 
	 * @throws 
	 *
	 */
	@RequestMapping("/queryConByConfCode")
	public void queryConByConfCode(HttpServletRequest req,HttpServletResponse resp){
		try{
			writeUTFJson(resp,JsonUtils.beanToJson(service.queryConByConfCode(req)));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	@RequestMapping("/findEmailInfo")	
	public void findEmailInfo(HttpServletRequest req,HttpServletResponse resp){		
		try {
			writeUTFJson(resp,JsonUtils.beanToJson(service.findEmailInfo(getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}	
	/**
	 * 修改当前用户阀值
	 */
	@RequestMapping("/updateConUser")
	public void updateConUser(HttpServletRequest req,HttpServletResponse resp){
		try{
			writeUTFJson(resp,JsonUtils.beanToJson(service.updateConUser(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	/**
	 * 修改session超时
	 */
	@RequestMapping("/updateConSession")
	public void updateConSession(HttpServletRequest req,HttpServletResponse resp){
		try{
			writeUTFJson(resp,JsonUtils.beanToJson(service.updateConSession(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
