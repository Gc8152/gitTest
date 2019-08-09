package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface SFilePathDao {
	//查询文件服务器信息
	public List<Map<String, String>> getServerInfo(Map<String, String> map);
	//新增文件服务器信息
	public void addServerInfo(Map<String, String> map);
	//修改文件服务器信息
	public void updateServerInfo(Map<String,  String> map);
	//查询所有文件路径
	public List<Map<String, String>> queryListFilePath(Map<String, String> map);
	//根据ID查询文件路径
	public List<Map<String, String>> queryOneFilePath(Map<String, String> map);
	//根据PATH_TYPE查询
	public List<Map<String, String>> queryOneByType(Map<String, String> map);
	//新增一条文件路径
	public void addFilePath(Map<String,  String> map);
	//修改一条文件路径
	public void updateFilePath(Map<String,  String> map);
	//删除一条文件路径
	public void deleteFilePath(Map<String,  String> map);
	//查询一条路径下的文件数
	public String queryFileNumById(Map<String,  String> map);
	//更新一条路径下的文件数
	public void updateFileNum(Map<String,  String> map);

	public List<Map<String, String>> queryFilePath(Map<String, String> pmap);
	
	//根据path_id查询关联的路径标签列表
	public List<Map<String, String>> queryPathTagByPathId(Map<String, String> pmap);
	//根据req_code查询系统名称(baoliu)
	public Map<String, String> getSystemName(Map<String, String> pmap);
	//根据req_task_code查询系统名称跟版本名称
	public Map<String, String> getSystemNameAndVersionName(Map<String, String> pmap);
	public Map<String, String> getSystemNameAndVersionNameBySubReq(Map<String, String> pmap);
	
	/**
	 * 根据系统名称获取系统简称
	 * @param pmap
	 * @return
	 */
	public String querySystemShortByName(String system_name);
}
