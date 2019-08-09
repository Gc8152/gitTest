package com.yusys.resources.optPersonCheck.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.ui.ModelMap;
import org.springframework.web.multipart.MultipartFile;

public interface IOptCheckService {
	
	/**
	 * 导入外包人员考核信息 
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> importOptCheckInfo(String userId, MultipartFile file,int[]head_num, int []column_num);
	
}
