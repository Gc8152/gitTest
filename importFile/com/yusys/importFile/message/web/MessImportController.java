/**
 * @author zq
 *
 */
package com.yusys.importFile.message.web;


import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.importFile.message.service.IMessImportService;
import com.yusys.web.BaseController;



/**
 * 缺项-控制跳转
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/messimport")
public class MessImportController extends BaseController{
	@Resource
	private IMessImportService  messImportService;

	@RequestMapping("/importPhaseFile")
	public void importPhaseFile(HttpServletRequest req,HttpServletResponse res,MultipartFile file)	{		
		Map<String, String> smap=new HashMap<String, String>(); 
		try {
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(messImportService.importPhaseFile(req,getUserId(req), file, new int[]{1},  new int[]{12})));		
		} catch (RuntimeException e) {
			smap.put("result","false");
			smap.put("error_info",e.getMessage());
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(smap));
		}
	
	}
	

	
	/**
	 * 导出 报文内容
	 * @param req
	 * @param res
	 */
	@RequestMapping("/exportPhaseFile")
	public void exportPhaseFile(ModelMap modelMap,HttpServletRequest req,HttpServletResponse res){
		messImportService.exportPhaseFile(modelMap,req, getUserId(req),res);
	}
	
	/**
	 * 导出 ESB接口信息
	 * @param req
	 * @param res
	 */
	@RequestMapping("/exportEsbInter")
	public void exportEsbInter(ModelMap modelMap,HttpServletRequest req,HttpServletResponse res){
		messImportService.exportEsbInter(modelMap,req, getUserId(req),res);
	}
	
	
	
}
