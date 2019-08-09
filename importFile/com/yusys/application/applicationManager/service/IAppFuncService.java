package com.yusys.application.applicationManager.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface IAppFuncService {
	/**
	 * 导入供应商相关数据
	 */
	public Map<String,String> importFunc(String userid,MultipartFile file,int[]head_num, int []column_num);
}
