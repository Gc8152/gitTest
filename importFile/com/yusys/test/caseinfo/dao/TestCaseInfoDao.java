package com.yusys.test.caseinfo.dao;

import java.util.Map;

public interface TestCaseInfoDao {
	
	public String findTestFunctionInfo(Map<String, String> pmap);
	
	public String findTestPointInfo(Map<String, String> pmap);
	
	public String findTestCaseInfo(String testpoint_id);
	
	public String findUserNoInfo(String user_name);
	
	public void saveDesignTestCases(Map<String, String> pmap);
	
	public void updateDesignTestCases(Map<String, String> pmap);
	
	public void addRealOpt(Map<String, String> pmap);
	
	public void delRealOpt(String case_id);
	
	public void addMainPoint(Map<String, String> pmap);
	
	public void updateMainPoint(Map<String, String> pmap);
	
	public Map<String, String> findDesignTestCases(String case_num);
}
