package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SWorkTime.IWorkTimeService;

/**
 * @author :yuanqt
 * @date：2017年3月5日
 * @describe:
 */
@Controller
@RequestMapping("/workTime")
public class WorkTimeController extends BaseController{

	@Resource
	private IWorkTimeService iwtService;
	
	/**
	 * 查询所有标记的假日及工作日
	 */
	@RequestMapping("/query")
	public void query(HttpServletRequest req,HttpServletResponse res){
		try{
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iwtService.queryOne(req, getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	@RequestMapping("/insert")
	public void insert(HttpServletRequest req,HttpServletResponse res){
		try{
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(iwtService.insert(req, getUserId(req))));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
}
