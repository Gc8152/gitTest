package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.ResponseUtils;
import com.yusys.service.HttpService.IHttpProxyService;

@Controller
@RequestMapping("/httpProxy")
public class HttpProxyController extends BaseController{	
	@Resource
	private IHttpProxyService httpProxyService;
	@RequestMapping("/test")
	public void test(HttpServletRequest req,HttpServletResponse res) {
		//http://127.0.0.1:8080/dev_background/test/test.asp?SID=0&call=jq_1519873739694&req_code=&req_name=&req_state=+&req_put_dept=&org=&req_operation_date=&req_operation_date1=&callback=jq_1519873739694&limit=10&offset=0&_=1519873735715
		String url="http://10.229.169.63:8081/dev_construction/requirement_input/queryRequirementInfoList.asp";
		try {
			ResponseUtils.jsonMessage(res,httpProxyService.doHttpPost(url, req));
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
	/**
	 * 单独代理的
	 * @param req
	 * @param res
	 */
	@RequestMapping("sOrder/submitOrderInfo")
	public void submitOrderInfo(HttpServletRequest req,HttpServletResponse res) {
		String url=req.getParameter("proxy_url")+"/sOrder/submitOrderInfo.asp?SID="+getUserId(req);
		try {
			ResponseUtils.jsonMessage(res,httpProxyService.doHttpPost(url, req));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/**
	 * 可代理全部的
	 * @param req
	 * @param res
	 */
	@RequestMapping("/proxy")
	public void proxy(HttpServletRequest req,HttpServletResponse res) {
		String url=req.getParameter("proxy_url")+"?SID="+getUserId(req);
		try {
			ResponseUtils.jsonMessage(res,httpProxyService.doHttpPost(url, req));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}





