package com.yusys.dao;

import java.util.List;
import java.util.Map;


public interface SolutionDao {
	//显示所有信息
	public List<Map<String, String>> findSolutionInfoAll(Map<String, String> pmap);
		
	//添加信息
	public void findSolutionInfoAdd(Map<String, String> pmap);
	//删除信息
	public  void findSolutionInfoDelete(Map<String, String> pmap);
	//删除信息
	public  void SolutionInfoDelete(Map<String, String> pmap);
	
	//查询business_code的file_id
	public List<Map<String, String>> findSolutionInfoFile(Map<String, String> pmap);
	
	//删除business_code
	public void findSolutionFileDelete(Map<String, String> pmap);
	
	//根据file_id删除附件 
	public void findSolutionInfoFileDelete(Map<String, String> pmap);
	
	//修改信息
	public void findSolutionInfoUpdate(Map<String, String> pmap);
	
	//根据条件查询
	public List<Map<String, String>> findSolutionInfoOne(Map<String, String> pmap);
}