package com.yusys.resources.outperson.web;


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
import com.yusys.resources.outperson.service.IOutPersonService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/outperson")
public class OutPersonController extends BaseController{
	@Resource
	private IOutPersonService outPersonService;
	/**
	 * 批量导入外包人员信息
	 * @param req
	 * @param res
	 * @throws Exception 
	 */
	@RequestMapping("/importOutPersonInfo")
	public void importOutPersonInfo(HttpServletRequest req,HttpServletResponse res,MultipartFile file) throws Exception{
		Map<String, String> smap=null;
		try {
			smap=outPersonService.importOutPersonInfo(getUserId(req),file,new int[]{1,1,1,1,1,1,1},new int[]{32,9,12,10,8,8,12});
		} catch (RuntimeException e) {
			smap=new HashMap<String, String>();
			smap.put("result","false");
			e.printStackTrace();
			smap.put("error_info",e.getMessage());
		}
		writeUTFJson(res,JsonUtils.beanToJson(smap));
	}
	/**
	 * 导出外包人员信息
	 * @param req
	 * @param res
	 */
	@RequestMapping("/exportOutPersonInfo")
	public void exportOutPersonInfo(ModelMap modelMap,HttpServletRequest req,HttpServletResponse res){
		outPersonService.exportOutPersonInfo(modelMap,req, getUserId(req),res);
	}
}
