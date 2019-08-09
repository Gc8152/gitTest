package com.yusys.dao;

import java.util.List;
import java.util.Map;


public interface SAuthorizeDao {
	//新增类别
	
	public void save(Map<String, String> map);
	//删除类别
	public void delete(Map<String, Object> map);
	//修改类别
	public void update(Map<String, String> map);
	//根据类别编码查询类别
	public List<Map<String, String>> findById(Map<String, String> map);
	//查询所有类别
	public List<Map<String, String>> findAll(Map<String, String> map);

}
