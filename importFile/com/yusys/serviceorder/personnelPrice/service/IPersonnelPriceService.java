package com.yusys.serviceorder.personnelPrice.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartFile;

/**
 * 人员单价维护信息service接口
 * @author houhf
 * Time 2016-09-19
 */
public interface IPersonnelPriceService {
	/**
	 * 导入外包人员信单价信息
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> importOutPersonPrice(String userId, MultipartFile file,
			int[]head_num, int []column_num);
	
}
