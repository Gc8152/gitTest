package com.yusys.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.service.SAuthorizeService.ISAuthorizeService;

/**
 * 		授权管理
 * @author LuoyF
 * 		2016.03.18
 *
 */
@Controller
@RequestMapping("/SAuthorize")
public class SAuthorizeController extends BaseController {

	@Resource
	private ISAuthorizeService service;
	
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
	
		//新增类别
		@RequestMapping("/save")
		public void SaveSdic(HttpServletRequest req,HttpServletResponse res)	{
			writeUTFJson(res,JsonUtils.beanToJson(	service.save(req,getUserId(req))));		
		}
		//删除类别
		@RequestMapping("/delete")
		public void DeleteSdic(HttpServletRequest req,HttpServletResponse res)	{
			writeUTFJson(res,JsonUtils.beanToJson(service.delete(req,getUserId(req))));
		}
		//修改类别
		@RequestMapping("/update")
		public void UpdateSdic(HttpServletRequest req,HttpServletResponse res)	{
			writeUTFJson(res,JsonUtils.beanToJson(service.update(req,getUserId(req))));		
		}
		//根据用户ID  查询授权信息
		@RequestMapping("/findById")		
		public void FindById(HttpServletRequest req,HttpServletResponse res)	{
			writeUTFJson(res,JsonUtils.beanToJson(service.FindById(req,getUserId(req))));
		}	
		//多条件查询所有类别信息
		@RequestMapping("/findAll")
		public void findAllSDic(HttpServletRequest req,HttpServletResponse res)	{
			writeUTFJson(res,JsonUtils.beanToJsonp(req,service.findAll(req,getUserId(req))));
		}

}
