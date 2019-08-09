package com.yusys.importFile.jury.dao;

import java.util.List;
import java.util.Map;

public interface JuryImportDao {
	//添加评审结论
	public void insertJuryInfo(Map<String,String> map);
	//根据用户名验证用户
	public List<Map<String,String>> queryUsrForName(Map<String,String> map);
	//添加评审缺陷
	public void insertJuryDefect(Map<String,String> map);
	
	public void insertJuryUser(Map<String,String> map);
	
	public void insertJuryTask(Map<String,String> map);
	
	public void deleteJuryTask(Map<String,String> map);
	
	public void updatePhasedReqTask(Map<String,String> map);
}
