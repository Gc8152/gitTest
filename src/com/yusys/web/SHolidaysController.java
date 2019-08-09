package com.yusys.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SHolidaysService.ISHolidaysService;

/**
 * 控制用户跳转
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/SHolidays")
public class SHolidaysController  extends BaseController {
//	private static final Logger logger = Logger.getLogger(SHolidaysController.class); 
	
	@Resource
	private ISHolidaysService holidayService;

	/**
	 * 查询所有标记的假日及工作日
	 */
	@RequestMapping("/queryHolidays")
	public void queryHolidays(HttpServletRequest req,HttpServletResponse res){
		try{
			ResponseUtils.jsonMessage(res,JsonUtils.beanListToJson(holidayService.queryHolidays(req,getUserId(req))).toLowerCase());
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 创建一条休息日或工作日
	 */
	@RequestMapping("/insertHoliday")
	public void insertHoliday(HttpServletRequest req,HttpServletResponse res){
		try{
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(holidayService.insertHoliday(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 删除一条休息日或工作日
	 */
	@RequestMapping("/deleteHoliday")
	public void deleteHoliday(HttpServletRequest req,HttpServletResponse res){
		try{
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(holidayService.deleteHoliday(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	/**
	 * 删除一条休息日或工作日
	 */
	@RequestMapping("/getCurrentDate")
	public void getCurrentDate(HttpServletRequest req,HttpServletResponse res){
		Map<String, String> cuMap=new HashMap<String, String>();
		try{
			String dt=DateTimeUtils.getFormatCurrentDate();
			cuMap.put("currentDate", dt);
			cuMap.put("currentDateJ", dt.replaceAll("-", "/"));
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(cuMap));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 创建一条休息日或工作日
	 */
	@RequestMapping("/savePatch")
	public void savePatch(HttpServletRequest req,HttpServletResponse res){
		try{
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(holidayService.savePatch(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 任务报工中的日历控件查询工作状态
	 */
	@RequestMapping("/queryWork")
	public void queryWork(HttpServletRequest req,HttpServletResponse res){
		try{
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(holidayService.queryWork(req,getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
