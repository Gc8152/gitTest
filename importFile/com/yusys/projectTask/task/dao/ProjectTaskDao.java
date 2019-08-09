package com.yusys.projectTask.task.dao;

import java.util.List;
import java.util.Map;

public interface ProjectTaskDao {

	//新增开发任务
	void addTask(Map<String,String> map);
	
	//根据用户名验证用户
	public  List<Map<String,String>> queryUsrForName(Map<String,String> map);
}
