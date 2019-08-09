package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;

import com.yusys.service.help_solve.ISolutionService;
import com.yusys.web.BaseController;


@Controller
@RequestMapping("/Problem")
public class SolutionController extends BaseController{
	@Resource
	private ISolutionService Solutionservice;
	
	
	//查询全部
	@RequestMapping("/findProblemAll")
	public void findProblemAll(HttpServletRequest req,HttpServletResponse res){		
		try {
			writeUTFJson(res,JsonUtils.beanToJsonp(req,Solutionservice.findProblemInfoAll(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	//查询全部
		@RequestMapping("/findProblemAll1")
		public void findProblemAll1(HttpServletRequest req,HttpServletResponse res){		
			try {
				writeUTFJson(res,JsonUtils.beanToJson(Solutionservice.findProblemInfoAll(req,getUserId(req))));
			} catch (Exception e) {
				e.printStackTrace();
			}	
		}
		//查询一个信息
		@RequestMapping("/findProblemOne1")
		public void findProblemOne1(HttpServletRequest req,HttpServletResponse res){		
			try {
				writeUTFJson(res,JsonUtils.beanToJsonp(req,Solutionservice.findProblemInfoOne(req,getUserId(req))));
			} catch (Exception e) {
				e.printStackTrace();
			}	
		}
	//查询一个信息
	@RequestMapping("/findProblemOne")
	public void findProblemOne(HttpServletRequest req,HttpServletResponse res){		
		try {
			writeUTFJson(res,JsonUtils.beanToJson(Solutionservice.findProblemInfoOne(req,getUserId(req))));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	
	//添加问题解决方案
		@RequestMapping("/findProblemAdd")
		public void findProblemAdd(HttpServletRequest req,HttpServletResponse res){		
			try {
				writeUTFJson(res,JsonUtils.beanToJson(Solutionservice.findProblemInfoAdd(req,getUserId(req))));
			} catch (Exception e) {
				e.printStackTrace();
			}	
		}
		
		
		@RequestMapping("/findProblemDelete")
	//删除一条记录
		public void findProblemDelete(HttpServletRequest req,HttpServletResponse res){
			try {
				writeUTFJson(res,JsonUtils.beanToJson(Solutionservice.findPrpblemInfoDelete(req,getUserId(req))));
			} catch (Exception e) {
				e.printStackTrace();
			}	
		}
		
	@RequestMapping("/findProblemFile")
	//查询business_code的file_id
		public void findProblemFile(HttpServletRequest req,HttpServletResponse res){
			try {
				writeUTFJson(res,JsonUtils.beanToJson(Solutionservice.findProblemFile(req,getUserId(req))));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	@RequestMapping("/findProblemFileDelete")
		//根据file_id删除附件
		public void findProblemFileDelete(HttpServletRequest req,HttpServletResponse res){
			try {
				writeUTFJson(res,JsonUtils.beanToJson(Solutionservice.findProblemFileDelete(req,getUserId(req))));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}			
			
			
	@RequestMapping("/findProblemUpdate")
	//修改一条数据
		public void findProblemUpdate(HttpServletRequest req,HttpServletResponse res){
			try {
				writeUTFJson(res,JsonUtils.beanToJson(Solutionservice.findProblemInfoUpdate(req,getUserId(req))));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
}
