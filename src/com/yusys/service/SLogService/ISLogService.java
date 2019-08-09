package com.yusys.service.SLogService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface ISLogService{
	//登陆日志查询页面
	public Map<String, Object> queryLoginLog(HttpServletRequest req,String actorno);
	//操作日志查询页面
	public Map<String, Object> queryOperaLog(HttpServletRequest req,String actorno);
	//新增操作日志
	public Map<String, String> insertNewLog(HttpServletRequest req,String actorno);
	//新增操作日志
	public Map<String, String> insertNewLog(HttpServletRequest request,Map<String, String> pmap);
	//新增日志配置
	public Map<String, String> savelogConfig(HttpServletRequest req, String userId,String userName);
	//查询最新的日志配置
	public Map<String, Object> queryLastLogConfig();
	//定时删除日志
	public void deleteLogbylimittime();
}
