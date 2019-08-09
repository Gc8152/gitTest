package com.yusys.application.applicationManager.web;

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
import com.yusys.application.applicationManager.service.IAppFuncService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/applicationManager")
public class AppImpController extends BaseController {
	
	@Resource
	  private IAppFuncService applicationService;
	/**
	 * 导入测试案例信息
	 * 
	 * @param req
	 * @param res
	 * @param file
	 */
	@RequestMapping("/queryFuncReport")
	public void importFunc(HttpServletRequest req,HttpServletResponse res, MultipartFile file) {
		Map<String, String> smap = null;
		try {
			smap=applicationService.importFunc(getUserId(req),file, new int[] {2}, new int[] {5});
		} catch (RuntimeException e) {
			e.printStackTrace();
			smap=new HashMap<String, String>();
			smap.put("result", "false");
			smap.put("error_info", e.getMessage());
		}
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(smap));
	}
}