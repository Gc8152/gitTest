package com.yusys.service.fastdfsService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface IFastdfsService {
	/**
	 * 通过fastdfs上传文件
	 * @param @param req
	 * @param @return
	 * @return Map<String,String> 
	 * @throws 
	 *
	 */
	public Map<String,String> UploadByFastdfs(HttpServletRequest req,String userId);
	/**
	 * 通过fastdfs下载文件
	 * @param @param req
	 * @param @param res
	 * @return void 
	 * @throws 
	 *
	 */
	public void DownloadByFastdfs(HttpServletRequest req,HttpServletResponse res);
	/**
	 * 通过fastdfs删除文件
	 * @param @param req
	 * @param @return
	 * @return Map<String,Object> 
	 * @throws 
	 *
	 */
	public Map<String,Object> DeleteByFastdfs(HttpServletRequest req);
}
