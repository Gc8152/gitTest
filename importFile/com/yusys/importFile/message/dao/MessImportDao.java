package com.yusys.importFile.message.dao;

import java.util.List;
import java.util.Map;

public interface MessImportDao {
	
	//接口报文内容
	public List<Map<String, String>> qContentList(Map<String,String> map);
	//查询ESB申请列表
	public List<Map<String, String>>  qAnalyseList(Map<String, String> map); 

}
