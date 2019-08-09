/**
 * @author huangyingkui
 *
 */
package com.yusys.importFile.jury.web;


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
import com.yusys.importFile.jury.service.IJuryImportService;
import com.yusys.web.BaseController;



/**
 * 缺项-控制跳转
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/IImport")
public class JuryImportController extends BaseController{
	@Resource
	private IJuryImportService  JuryImportService;

	@RequestMapping("/importPhaseFile")
	public void importPhaseFile(HttpServletRequest req,HttpServletResponse res,MultipartFile file)	{		
		Map<String, String> smap=new HashMap<String, String>(); 
		try {
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(JuryImportService.importPhaseFile(req,getUserId(req), file, new int[]{1,1,1,1,2,2},  new int[]{9,7,5,11,8,6})));		
		} catch (RuntimeException e) {
			smap.put("result","false");
			smap.put("error_info",e.getMessage());
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(smap));
		}
		//ResponseUtils.jsonMessage(res,JsonUtils.beanToJsonp(req,smap));
	
	}
}
