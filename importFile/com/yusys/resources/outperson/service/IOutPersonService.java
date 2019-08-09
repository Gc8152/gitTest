package com.yusys.resources.outperson.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.ui.ModelMap;
import org.springframework.web.multipart.MultipartFile;

public interface IOutPersonService {
	/**
	 * 导出外包人员信息
	 * @param modelMap
	 * @param req
	 * @param userId
	 * @param res
	 */
	public void exportOutPersonInfo(ModelMap modelMap, HttpServletRequest req,String userId, HttpServletResponse res);
	
	/**
	 * 导入外包人员信息 
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> importOutPersonInfo(String userId, MultipartFile file,int[]head_num, int []column_num);
	
}
