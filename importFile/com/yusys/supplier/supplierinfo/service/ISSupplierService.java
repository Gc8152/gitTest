package com.yusys.supplier.supplierinfo.service;

import java.util.List;
import java.util.Map;



import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartFile;

public interface ISSupplierService {
	/**
	 * 导入供应商相关数据
	 */
	public Map<String,String> importSupplierInfo(String userid,MultipartFile file,int[]head_num, int []column_num);
	/**
	 * 区域树
	 * @param req
	 * @param userId
	 * @return
	 */
	List<Map<String, String>> queryAlladdress(HttpServletRequest req, String userId);
	/**
	 * 中文转拼音
	 * @param str
	 * @return
	 */
	public String cnToPinYin(String str);
}
