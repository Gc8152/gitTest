package com.yusys.web;


import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.service.SFilePathService.ISFilePathService;


@Controller
@RequestMapping("/SFilePath")
public class SFilePathController extends BaseController{
	@Resource
	private ISFilePathService sFilePathService;
	
	//查询文件服务器信息
	@RequestMapping("/getServerInfo")
	public void getServerInfo(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(sFilePathService.getServerInfo(req)));
	}
	
	//保存文件服务器信息
	@RequestMapping("/saveServerInfo")
	public void saveServerInfo(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(sFilePathService.saveServerInfo(req)));
	}
	
	//查询所有文件路径
	@RequestMapping("/queryListFilePath")
	public void queryListFilePath(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJsonp(req,sFilePathService.queryListFilePath(req)));
	}
	//根据ID查询文件路径
	@RequestMapping("/queryOneFilePath")
	public void queryOneFilePath(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(sFilePathService.queryOneFilePath(req)));
	}
	
	//根据ID查询文件路径
	@RequestMapping("/queryOneByType")
	public void queryOneByType(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(sFilePathService.queryOneByType(req)));
	}
	
	@RequestMapping("/deleteFilePath")
	//删除一条记录
	public void deleteFilePath(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(sFilePathService.deleteFilePath(req)));
	}
	
	//新增一条文件路径
	@RequestMapping("/addFilePath")
	public void addFilePath(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(sFilePathService.addFilePath(req,getUserId(req))));
	}
	
	//更新一条文件路径
	@RequestMapping("/updateFilePath")
	public void updateFilePath(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(sFilePathService.updateFilePath(req,getUserId(req))));
	}
	
	//获取一条文件路径
	@RequestMapping("/getRealFilePath")
	public void getRealFilePath(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(sFilePathService.getRealFilePath(req,getUserId(req),getUser(req).getUser_name())));
	}
	
	//
	@RequestMapping("/getSystemNameAndVersionName")
	public void getSystemNameAndVersionName(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJson(sFilePathService.getSystemNameAndVersionName(req)));
	}

	@RequestMapping("/getSystemNameAndVersionNameBySubReq")
	public void getSystemNameAndVersionNameBySubReq(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJson(sFilePathService.getSystemNameAndVersionNameBySubReq(req)));
	}
}
