package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SMenuService.ISMenuService;

@Controller
@RequestMapping("/SMenu")
public class SMenuController extends BaseController{
	@Resource
	private ISMenuService menuService;
	
	public void writeUTFJson(HttpServletResponse res,String json){
		ResponseUtils.jsonMessage(res, json);
	}
	 @RequestMapping("/queryAllmenu")
	 public void queryAllMenu(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanListToJson(menuService.queryAllPageMenu(req,getUserId(req))).toLowerCase());
	 }
	 
	 @RequestMapping("/createmenu")
	 public void createMenu(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(menuService.createMenuInfo(req,getUserId(req))));
	 }
	 @RequestMapping("/deletemenu")
	 public void deleteMenu(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(menuService.deleteMenuInfo(req,getUserId(req))));
	 }
	 
	 @RequestMapping("/findOneMenu")
	 public void findOneMenu(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(menuService.findOneMenuInfoByNo(req,getUserId(req))));
	 }
	 
	 @RequestMapping("/updateMenu")
	 public void updateMenu(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(menuService.updateMenuInfo(req,getUserId(req))));
	 }
	 
	 @RequestMapping("/createButton")
	 public void createButton(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(menuService.createPageButton(req,getUserId(req))));
	 }
	 
	 @RequestMapping("/updateButton")
	 public void updateButton(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(menuService.updatePageButton(req,getUserId(req))));
	 }
	 @RequestMapping("/updateButtonFlag")
	 public void updateButtonFlag(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(menuService.updatePageButtonFlag(req,getUserId(req))));
	 }
	 @RequestMapping("/removeButton")
	 public void removeButton(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(menuService.removePageButton(req,getUserId(req))));
	 }
	 @RequestMapping("/queryButton")
	 public void queryButton(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJsonp(req,menuService.queryPageButton(req,getUserId(req))));
	 }
	 
	 @RequestMapping("/createProperty")
	 public void createProperty(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(menuService.createPageProperty(req,getUserId(req))));
	 }
	 @RequestMapping("/updateProperty")
	 public void updateProperty(HttpServletRequest req,HttpServletResponse res){
		 writeUTFJson(res,JsonUtils.beanToJson(menuService.updatePageProperty(req,getUserId(req))));
	 }
	 @RequestMapping("/updatePropertyFlag")
	 public void updatePropertyFlag(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(menuService.updatePagePropertyFlag(req,getUserId(req))));
	 }
	 @RequestMapping("/removeProperty")
	 public void removeProperty(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(menuService.removePageProperty(req,getUserId(req))));
	 }
	 @RequestMapping("/queryProperty")
	 public void queryProperty(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJsonp(req,menuService.queryPageProperty(req,getUserId(req))));
	 }
	 @RequestMapping("/TableRoleMenu")
	 public void TableRoleMenu(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJsonp(req,menuService.TableRoleMenu(req,getUserId(req))));
	 }
	 
}