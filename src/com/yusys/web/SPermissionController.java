package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SPermissionService.ISPermissionService;

@Controller
@RequestMapping("/SPerm")
public class SPermissionController extends BaseController{
	
	@Resource
	private ISPermissionService permissionService;
	
	public void writeUTFJson(HttpServletResponse res,String json){
		ResponseUtils.jsonMessage(res, json);
	}
	 @RequestMapping("/addUserPerm")
	 public void addUserPerm(HttpServletRequest req,HttpServletResponse res)throws Exception{
		    writeUTFJson(res,JsonUtils.beanToJson(permissionService.addUserPermiss(req,getUserId(req))));
	 }
}
