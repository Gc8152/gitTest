package com.yusys.test.caseinfo.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface ITestCaseInfoService {
	/**
	 * 导入供应商相关数据
	 */
	public Map<String,String> importTestCaseInfo(String userid,MultipartFile file,int[]head_num, int []column_num);
}
