package com.yusys.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.service.SLogService.ISLogService;

@Controller
@RequestMapping("/SLog")
public class SLogController extends BaseController {
	@Resource
	private ISLogService logService;
	
	public void writeUTFJson(HttpServletResponse res,String json){
		PrintWriter writer=null;
		try {
			res.setCharacterEncoding("UTF-8"); 
			writer=res.getWriter();
			writer.write(json);
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			if (writer!=null) {
				writer.flush();
			}
		}
	}
	//登陆日志查询页面
	@RequestMapping("/queryloginlog")
	public void queryLoginLog(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJsonp(req,logService.queryLoginLog(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	//操作日志查询页面
	@RequestMapping("/queryoperalog")
	public void queryOrgTreeList(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJsonp(req,logService.queryOperaLog(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	//创建日志
	@RequestMapping("/insertnewlog")
	public void createSOrg(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(logService.insertNewLog(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	//保存日志配置信息
	@RequestMapping("/savelogConfig")
	public void savelogConfig(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(logService.savelogConfig(req,getUserId(req),getUser(req).getUser_name())));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	//保存日志配置信息
	@RequestMapping("/queryLastLogConfig")
	public void queryLastLogConfig(HttpServletRequest req,HttpServletResponse res){
		try{
			writeUTFJson(res,JsonUtils.beanToJson(logService.queryLastLogConfig()).toLowerCase());
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
