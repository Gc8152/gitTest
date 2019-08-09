package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface SHolidaysDao {
	//查询所有节假日标记
	public List<Map<String, String>> queryHolidays(Map<String, String> map);
	//创建节假日标记
	public void insertHoliday(Map<String, String> map);
	//删除节假日标记
	public void deleteHoliday(Map<String, String> map);
	//删除节假日标记
    public void deletePatch(Map<String, String> map);
  //查询所有节假日标记
  	public Map<String, String> queryWork(Map<String, String> map);
  //查询某月日期是否配置
  	public Map<String, String> queryWorkConfig(Map<String, String> map);
  	
  //查询所有已报工的日期
  	public Map<String, String> queryBookedDate(Map<String, String> map);
}
