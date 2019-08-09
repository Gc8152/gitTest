package com.yusys.repository.config.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.repository.config.service.IRepositoryService;
import com.yusys.web.BaseController;
@Controller
@RequestMapping("/Repository")
public class RepositoryController extends BaseController{
	@Resource
	private IRepositoryService service;
	//乱码转换方法
	public void writeUTFJson(HttpServletResponse res,String json){
		ResponseUtils.jsonMessage(res, json);
	}
	
	//查询全部
	@RequestMapping("/queryIntell")
	public void queryIntell(HttpServletRequest req,HttpServletResponse resp){		
		try {
			String json = JsonUtils.beanToJsonp(req,service.queryIntell(req,getUserId(req)));
			writeUTFJson(resp,json);
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	//新增
	@RequestMapping("/saveIntell")
	public void saveIntell(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp, JsonUtils.beanToJson(service.saveIntell(req,getUserId(req))));
			
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	
	//查询类别
	@RequestMapping("/getCategoryCode")
	public void getCategoryCode(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp, JsonUtils.beanToJson(service.getCategoryCode(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	
	//审核发布
	@RequestMapping("/releaseRepository")
	public void releaseRepository(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp, JsonUtils.beanToJson(service.releaseRepository(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	//删除
	@RequestMapping("/cannelOroverdueOrDelete")
	public void cannelOroverdueOrDelete(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp, JsonUtils.beanToJson(service.cannelOroverdueOrDelete(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	//查询该属于该类别的全部
		@RequestMapping("/queryBelongCategoryList")
		public void queryBelongCategoryList(HttpServletRequest req,HttpServletResponse resp){		
			try {
				String json = JsonUtils.beanToJsonp(req,service.queryBelongCategoryList(req,getUserId(req)));
				writeUTFJson(resp,json);
			} catch (Exception e) {
				e.printStackTrace();
			}	
		}
	 /** ****************************************知识库全员查看**************************************************  */	 
	//根据版本查询知识详情
	@RequestMapping("/queryIntellByVersion")
	public void queryIntellByVersion(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp, JsonUtils.beanToJson(service.queryIntellByVersion(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	//查询全部的版本
	@RequestMapping("/queryAllVersion")
	public void queryAllVersion(HttpServletRequest req,HttpServletResponse resp){		
		try {
			String json = JsonUtils.beanToJsonp(req,service.queryAllVersion(req,getUserId(req)));
			writeUTFJson(resp,json);
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	//根据类别编号查询该类别下全部的列表 
	 @RequestMapping("/queryOneCategoryTreeList")
	 public void queryOneCategoryTreeList(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanListToJson(service.queryOneCategoryTreeList(req,getUserId(req))));
	 }
/** ****************************************类别配置**************************************************  */
	@RequestMapping("/queryCategoryTreeList")
	 public void queryAllCategory(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanListToJson(service.queryAllCategory(req,getUserId(req))).toLowerCase());
	 }
	 
	 @RequestMapping("/createCategory")
	 public void createCategory(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(service.createCategory(req,getUserId(req))));
	 }
	 @RequestMapping("/deleteCategory")
	 public void deleteCategory(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(service.deleteCategory(req,getUserId(req))));
	 }
	 //根据类别编号查询详情
	 @RequestMapping("/findOneCategoryByNo")
	 public void findOneCategoryByNo(HttpServletRequest req,HttpServletResponse res){
			writeUTFJson(res,JsonUtils.beanToJson(service.findOneCategoryByNo(req,getUserId(req))));
	 }
	
}
