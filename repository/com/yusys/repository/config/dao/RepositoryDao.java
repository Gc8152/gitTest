package com.yusys.repository.config.dao;

import java.util.List;
import java.util.Map;

public interface RepositoryDao {
	//查询列表
	List<Map<String, String>> queryAllRepositoryList(Map<String, String> pmap);
	//新增
	void insertRepository(Map<String, String> pmap);
	
	void insertRepositoryContent(Map<String, String> pmap1);
	
	
	
	//查询类别
	List<Map<String, String>> getCategoryCode(Map<String, Object> pmap);
	//修改知识基本表
	void updateRepositoryInfo(Map<String, String> pmap);
	//修改内容表
	void updateRepositoryContent(Map<String, String> pmap);
	//删除取消已过期
	void cannelOroverdueOrDelete(Map<String, String> pmap);
	//物理删除
	void delete(Map<String, String> pmap);
	//发布
	void releaseRepository(Map<String, String> pmap);
	void releaseRepositoryContent(Map<String, String> pmap);
	//根据版本查询知识详情
	List<Map<String, String>> queryIntellByVersion(Map<String, String> pmap);
	//查询全部的版本
	List<Map<String, String>> queryAllVersionList(Map<String, String> pmap);
	//根据类别编号查询该类别下全部的列表 
	List<Map<String, String>> queryOneCategoryTreeList(String category_code);
	//查询该属于该类别的全部
	List<Map<String, String>> queryBelongCategoryList(Map<String, String> pmap);
	/** *********************************类别配置***********************************  */
	//查询所有类别
	List<Map<String, String>> queryAllCategory(String string);
	//新增类别
	void createCategory(Map<String, String> pmap);

	//删除类别
	void deleteCategory(Map<String, String> pmap);
	//根据类别编号查询详情
	Map<String, String> findOneCategoryByNo(Map<String, String> pmap);
	//修改类别
	void updateCategory(Map<String, String> pmap);
	//查找一条最新的附件
	Map<String, String> queryLatestFtpFile(String id);
	
	
	
	
	
	
	
	
	
}
