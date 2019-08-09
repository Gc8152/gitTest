package com.yusys.dao;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface SFileInfoDao {
	/**
	 * 查询SVN基本信息
	 * @return
	 */
	public Map<String, String>  getSvnBaseInfo(String id);
	/**
	 * 修改SVN基本信息
	 * @param pmap
	 */
	public void updateSvnBaseInfo(Map<String, String> pmap);
	
	/**
	 * 获取文件路径配置信息
	 * @param pathId
	 * @return
	 */
	public Map<String, String> getFilePathById(String pathId);
	/**
	 * 新增附件信息
	 * @param map
	 */
	public void addFileInfo(Map<String, String> map);
	/**
	 * 查询附件
	 * @param map
	 * @return
	 */
	public List<Map<String, String>> findFileInfo(Map<String, String> map);
	/**
	 * 删除文件记录
	 * @param id
	 */
	public void delFildInfo(Map<String, String> map);
	/**
	 * 删除文件信息
	 * @param file_id
	 */
	public void delFildInfoByFileId(String file_id);
	/**
	 * 查询附件信息
	 * @param file_id
	 * @return
	 */
	public List<Map<String, String>> getFileInfoByFId(String file_id);
	/**
	 * 查询附件信息
	 * @param file_id
	 * @return
	 */
	public Map<String, String> getFileInfoById(String id);
	/**
	 * 设置文件预览
	 * @param id
	 */
	public void setFileIsView(String id);
	
	public void setContentManagerDocId(Map<String, String> map);
	/**
	 * 查询附件in id
	 * @param id
	 */
	List<Map<String,String>> queryFileInID(Map<String,String> req);
	/**
	 * 通过文件名查询文件是否存在
	 * @param paramMap
	 * @return 
	 * @author liubin
	 */
	public List<Map<String, String>> findFileInfoByName(Map<String, String> paramMap);
}
