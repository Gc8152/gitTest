package com.yusys.repository.config.service;


import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface IRepositoryService {
	   //查询全部
		public Map<String, Object> queryIntell(HttpServletRequest req,String userid);
	    //新增
	    public Map<String, String> saveIntell(HttpServletRequest req,String userid);
		//查询类别
	    public Map<String, Object> getCategoryCode(HttpServletRequest req, String userId);
	    //取消删除已过期
		public Map<String, Object> cannelOroverdueOrDelete(HttpServletRequest req, String userId);
		//发布
		public Map<String, Object> releaseRepository(HttpServletRequest req, String userId);
		//根据版本查询知识详情
		public Map<String, Object> queryIntellByVersion(HttpServletRequest req, String userId);
		//查询全部的版本
		public Map<String, Object> queryAllVersion(HttpServletRequest req, String userId);
		public List<Map<String, String>> queryOneCategoryTreeList(HttpServletRequest req, String userId);
		//查询该属于该类别的全部
		public Map<String, Object> queryBelongCategoryList(HttpServletRequest req, String userId);
		/** *********************************类别配置***********************************  */
		//查询所有类别
		public List<Map<String, String>> queryAllCategory(HttpServletRequest req, String userId);
		//新增类别
		public Map<String, Object> createCategory(HttpServletRequest req, String userId);
		//删除类别
		public Map<String, Object> deleteCategory(HttpServletRequest req, String userId);
		//根据类别编号查询详情
		public Map<String, String> findOneCategoryByNo(HttpServletRequest req, String userId);
		
		

}
