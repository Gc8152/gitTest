package com.yusys.service.SHolidaysService;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface ISHolidaysService{
	//查询所有假日标记
	public List<Map<String, String>> queryHolidays(HttpServletRequest req,String actorno);
	//创建一条工作日或假日
	public Map<String, String> insertHoliday(HttpServletRequest req,String actorno);
	//删除节假日标记
	public Map<String, String> deleteHoliday(HttpServletRequest req,String actorno);
	//保存每月节假日信息
    public Map<String, String> savePatch(HttpServletRequest req,String actorno);
  //查询所有工作日
  	public Map<String, Object> queryWork(HttpServletRequest req,String actorno);
	
}
