package com.yusys.service.SFilePathService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface ISFilePathService {
	//查询文件服务器信息
	public Map<String,Object> getServerInfo(HttpServletRequest req);
	//新增文件服务器信息
	public Map<String,String> saveServerInfo(HttpServletRequest req);
	//查询所有文件路径
	public Map<String, Object> queryListFilePath(HttpServletRequest req);
	//根据ID查询文件路径
	public Map<String, Object> queryOneFilePath(HttpServletRequest req);
	//根据类型查询文件路径
	public Map<String, Object> queryOneByType(HttpServletRequest req);
	//新增一条文件路径
	public Map<String,String> addFilePath(HttpServletRequest req,String userId);
	//删除一条文件路径
	public Map<String,String> deleteFilePath(HttpServletRequest req);
	//新增一条文件路径
	public Map<String,String> updateFilePath(HttpServletRequest req,String userId);
	//获取文件路径
	public Map<String, String> getRealFilePath(HttpServletRequest req,String userId,String userName);
	//
	Map<String, String> getFtpPathInfo(String userId, String userName, String path_id, String path_type);
	
	/**
	 * 获取上传路径方法
	 * @param pmap
	 * @param param
	 * @param isSvn是否svn上传
	 * @param common_doc 公共文档标识(YUSYS_GGCK_DOC)
	 * @return
	 */
	public Map<String, String> getFtpPathByPathId(Map<String, String> pmap, Map<String, Object> param,boolean isSvn,String common_doc);
	public Map<String, String> getSystemNameAndVersionName(HttpServletRequest req);
	public Map<String, String> getSystemNameAndVersionNameBySubReq(HttpServletRequest req);
}
