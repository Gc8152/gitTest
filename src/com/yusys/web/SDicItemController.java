package com.yusys.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SDicItemService.ISDicItemService;

/**
 * 控制跳转
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/SDicItem")
public class SDicItemController   extends BaseController {
	
	@Resource
	private ISDicItemService isdicitemservice;
	
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
	
	//新增字典项
	@RequestMapping("/save")
	public void SaveSdic(HttpServletRequest req,HttpServletResponse res)	{
		
		writeUTFJson(res,JsonUtils.beanToJson(isdicitemservice.save(req,getUserId(req))));		
	}

	//删除字典项
	@RequestMapping("/delete")
	public void DeleteSdic(HttpServletRequest req,HttpServletResponse res)	{
		
		writeUTFJson(res,JsonUtils.beanToJson(isdicitemservice.delete(req,getUserId(req))));
	}

	//修改字典项
	@RequestMapping("/update")
	public void UpdateSdic(HttpServletRequest req,HttpServletResponse res)	{
		
		writeUTFJson(res,JsonUtils.beanToJson(isdicitemservice.update(req,getUserId(req))));		
	}
	//根据ID查找字典项
	@RequestMapping("/findById")
	public void FindById(HttpServletRequest req,HttpServletResponse res)	{
		
		writeUTFJson(res,JsonUtils.beanToJson(isdicitemservice.findById(req,getUserId(req))));
	}	
	//多条件查询所有字典项
	@RequestMapping("/findAllSDicItem")
	public void findAllSDic(HttpServletRequest req,HttpServletResponse res)	{
		
		writeUTFJson(res,JsonUtils.beanToJsonp(req,isdicitemservice.findAll(req,getUserId(req))));
	}	
	//根据字典项编码查询字典项内容 houhf 2016-09-19
	@RequestMapping("/findItemContent")
	public void findItemContent(HttpServletRequest req,HttpServletResponse res)	{
		ResponseUtils.jsonMessage(res,JsonUtils.beanListToJson(isdicitemservice.findItemContent(req,getUserId(req))));
	}

}
