package com.yusys.service.SFileInfoService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * svn附件操作
 * @author tanbo
 *
 */
public interface ISvnFileService {
	/**
	 * 上传附件
	 * @param req
	 * @param res
	 * @return
	 */
	public Map<String, String> uploadFileToSvn(HttpServletRequest req, HttpServletResponse res,String userid)throws Exception;
	/**
	 * 下载附件
	 * @param req
	 * @param res
	 */
	public void downloadFileBySvn(boolean isFtp,HttpServletRequest req, HttpServletResponse res);
	/**
	 * 删除附件
	 * @param req
	 * @param res
	 * @return
	 */
	public Map<String, String> delFileInfoBySvn(HttpServletRequest req, HttpServletResponse res);
	/**
	 * 附件预览
	 * @param req
	 * @param res
	 */
	public void reviewFileBySvn(HttpServletRequest req, HttpServletResponse res);
	
}