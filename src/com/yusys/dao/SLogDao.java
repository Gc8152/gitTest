package com.yusys.dao;

import java.util.List;
import java.util.Map;



public interface SLogDao {
	//登陆日志查询页面
	public List<Map<String, String>> queryLoginLog(Map<String, String> map);
	//操作日志查询页面
	public List<Map<String, String>> queryOperaLog(Map<String, String> map);
	//创建机构
	public void insertNewLog(Map<String, String> map);
	//保存日志配置
	public void savelogConfig(Map<String, String> param);
	//查询最新的日志配置
	public Map<String,Object> queryLastLogConfig();
	//定时删除日志 
	public void deleteLogbylimittime(Map<String, String> param);
}
