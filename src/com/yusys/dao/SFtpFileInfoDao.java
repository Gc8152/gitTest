package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface SFtpFileInfoDao {

	/**
	 * 新增文件信息
	 * @param map
	 */
	void addFileInfo(Map<String, String> param) throws Exception;
	/**
	 * 新增文件业务关联信息
	 * @param map
	 */
	void addFileRelInfo(Map<String, String> pmap) throws Exception;
	/**
	 * 查询文件信息
	 * @param business_code
	 * @return
	 */
	List<Map<String, Object>> findFileInfo(Map<String, String> paramMap);
	
	/**
	 * 查询文件信息
	 * @param file_id
	 * @return
	 */
	List<Map<String, Object>> findFileInfoByFileId(Map<String, String> paramMap);
	/**
	 * 查询附件信息
	 * @param file_id
	 * @return
	 */
	List<Map<String, String>> findFileInfoByIds(Map<String, String> paramMap);

	/**
	 * 删除附件in id
	 * @param id
	 */
	void deleteFileInfo(String id) throws Exception;
	
	/**
	 * 删除附件关联 file_id
	 * @param id
	 */
	void deleteFileInfoRel(String file_id) throws Exception;
	
	/**
	 * 获取附件in id
	 * @param id
	 */
	Map<String, String> getFileInfoById(String id);
	
	/**
	 * 更新附件关联信息
	 * @param id
	 */
	void updateFileRelInfo(Map<String, Object> pathMap);
	/**
	 * 更新附件信息
	 * @param id
	 */
	void updateFileInfo(Map<String, Object> pathMap);
	/**
	 * 验证文件名是否存在数据库记录中
	 * @param filename
	 */
	List<Map<String, String>> getFileListByFileName(Map<String, String> pmap);
	/**
	 * 通过业务编号（批量）查询文件列表
	 * @param file_id
	 * @param phase
	 */
	List<Map<String, Object>> findFileInfoByBusinessCodes(Map<String, String> paramMap);
}
