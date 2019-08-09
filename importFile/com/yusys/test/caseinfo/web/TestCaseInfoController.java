package com.yusys.test.caseinfo.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.test.caseinfo.service.ITestCaseInfoService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/caseInfo")
public class TestCaseInfoController extends BaseController {
	
	@Resource
	private ITestCaseInfoService testCaseInfoService;
	/**
	 * 导入测试案例信息
	 * 
	 * @param req
	 * @param res
	 * @param file
	 */
	@RequestMapping("/importTestCaseInfo")
	public void importSupplierInfo(HttpServletRequest req,HttpServletResponse res, MultipartFile file) {
		Map<String, String> smap = null;
		try {
			smap=testCaseInfoService.importTestCaseInfo(getUserId(req),file, new int[] {6}, new int[] {17});
		} catch (RuntimeException e) {
			smap=new HashMap<String, String>();
			smap.put("result", "false");
			smap.put("error_info", e.getMessage());
		}
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(smap));
	}
}