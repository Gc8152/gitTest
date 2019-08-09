package com.yusys.web;


import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.RequestUtils;
import com.yusys.dao.SOrgDao;
import com.yusys.dao.SUserDao;
import com.yusys.entity.SUser;

@Controller
@RequestMapping("/report")
public class ReportController extends BaseController{
	@Resource
	private SUserDao userDao; 
	@Resource
	private SOrgDao orgDao;
	
	private final static String preStr="reportPage/"; 
	@RequestMapping("/userReport")
	public void userReport(HttpServletRequest req, HttpServletResponse res) {
		StringBuffer s=new StringBuffer();
		String url="";//"http://"+s.append(req.getServerName()).append(":").append(req.getServerPort()).append(req.getContextPath()).toString();
		String menu_flag = req.getParameter("menu_flag");
		
		//根据页面菜单ID判断要找开哪个报表JSP
		String reportJspName = null;
		if (menu_flag==null) {
			
		}else if("task_detail_report".equals(menu_flag)||menu_flag.endsWith("task_detail_report")){
			reportJspName = "taskDetailReport.jsp";
		}else if("depart_total_report".equals(menu_flag)||menu_flag.endsWith("depart_total_report")){
			reportJspName = "departTotalReport.jsp";
		}else if("person_total_report".equals(menu_flag)||menu_flag.endsWith("person_total_report")){
			reportJspName = "personTotalReport.jsp";
		}else if("feedback_total_report".equals(menu_flag)||menu_flag.endsWith("feedback_total_report")){
			reportJspName = "feedbackInfoTotalReport.jsp";
		}else if("assess_total_report".equals(menu_flag)||menu_flag.endsWith("assess_total_report")){
			reportJspName = "assessInfoTotalReport.jsp";
		}else if("demand_report".equals(menu_flag)||menu_flag.endsWith("demand_report")){
			reportJspName = "demandDetailReport.jsp";
		}else if("demand_task_report".equals(menu_flag)||menu_flag.endsWith("demand_task_report")){
			reportJspName = "demandTaskDetailReport.jsp";
		}else if("project_report".equals(menu_flag)||menu_flag.endsWith("project_report")){
			reportJspName = "projectDetailReport.jsp";
		}else if("report_interlist".equals(menu_flag)||menu_flag.endsWith("report_interlist")){
			reportJspName = "interDetailReport.jsp";
		}else if("report_interuserelation".equals(menu_flag)||menu_flag.endsWith("report_interuserelation")){
			reportJspName = "interUseRelationReport.jsp";
		}else if("report_interapplist".equals(menu_flag)||menu_flag.endsWith("report_interapplist")){
			reportJspName = "interAppReport.jsp";
		}else if("prd_plan_fowllor".equals(menu_flag)||menu_flag.endsWith("prd_plan_fowllor")){
			reportJspName = "prdPlanFowllorReport.jsp";
		}else if("prd_permit_detail".equals(menu_flag)||menu_flag.endsWith("prd_permit_detail")){
			reportJspName = "prdPermitDetailReport.jsp";
		}
		else if("system_detail_report".equals(menu_flag)||menu_flag.endsWith("system_detail_report")){
			reportJspName = "systemDetailReport.jsp";
		}else if("product_approve_version".equals(menu_flag)||menu_flag.endsWith("product_approve_version")){
			reportJspName = "prdTaskApproveReport.jsp";
		}else if("defect_report".equals(menu_flag)||menu_flag.endsWith("defect_report")){
			reportJspName = "defect_report.jsp";
		}
		//报表页面
		req.setAttribute("src", preStr+reportJspName);
		//IFRAME布局页面
		toJsp(req, res, "../reportJsp/turn2report.jsp");
	}
	@RequestMapping("/relevanceReport")
	public void relevanceReport(HttpServletRequest req, HttpServletResponse res) {
		String corg_code=RequestUtils.getParamValue(req, "org_code");
		SUser user=getUser(req);
		String porg_code=user.getOrg_no();
		Map<String, String> map=new HashMap<String, String>();
		map.put("corg_code", corg_code);
		map.put("porg_code", porg_code);
		map.put("userid", user.getUser_no());
		Map<String, String> smap=orgDao.checkChildOrg(map);
		if (smap!=null&&smap.size()>0) {
			toJsp(req, res, "../reportPage/oneDepartReport.jsp");
		}else{
			 res.setCharacterEncoding("UTF-8");
		        res.setContentType("text/html;charset=UTF-8");
		        PrintWriter printWriter = null;
		        try {
		            printWriter = res.getWriter();
		            printWriter.print("您没有权限访问该报表!");
		        } catch (IOException e) {
		            e.printStackTrace();
		        } finally {
		            if (null != printWriter) {
		                printWriter.close();
		            }
		        }
		}
	}
	@RequestMapping("/onePersonReportInfo")
	public void onePersonReportInfo(HttpServletRequest req, HttpServletResponse res) {
		String user_code=RequestUtils.getParamValue(req, "user_code");
		SUser user=getUser(req);
		Map<String, String> map=new HashMap<String, String>();
		map.put("user_no", user_code);
		map.put("currentUserNo", user.getUser_no());
		SUser suser=userDao.findByParam(map);
		if(user.getUser_no().equals(user_code)||(suser!=null&&suser.getUser_no()!=null)){
			toJsp(req, res, "../reportPage/onePersonReport.jsp");
		}else{
			 res.setCharacterEncoding("UTF-8");
		        res.setContentType("text/html;charset=UTF-8");
		        PrintWriter printWriter = null;
		        try {
		            printWriter = res.getWriter();
		            printWriter.print("您没有权限访问该报表!");
		        } catch (IOException e) {
		            e.printStackTrace();
		        } finally {
		            if (null != printWriter) {
		                printWriter.close();
		            }
		        }
		}
	}
}
