package com.yusys.service.SFileInfoService;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.MultiValueMap;

import com.yusys.Utils.MyException;
import com.yusys.entity.SUser;

public interface ISFileInfoService {
	/**
	 * 上传附件
	 * @param request
	 * @param userid
	 * @return
	 */
	public Map<String, String> fileUpload(HttpServletRequest request,String userid) throws MyException;
	
	/**
	 * 查询附件信息
	 * @param request
	 * @param userid
	 * @return
	 */
	public Map<String, Object> findFileInfo(HttpServletRequest request,String userid);
	
	/**
	 * 附件下载
	 * @param request
	 * @param response
	 * @param userid
	 */
	public boolean fileDownLoad(HttpServletRequest request,HttpServletResponse response,String userid);
	/**
	 * 附件预览
	 * @param request
	 * @param response
	 * @param userid
	 */
	public boolean filePreFileView(HttpServletRequest request,HttpServletResponse response,String userid);
	
	/**
	 * 附件删除
	 * @param request
	 * @param response
	 * @param userid
	 */
	public boolean delFileInfo(HttpServletRequest request,String userid);
	/**
	 * 查询附件in id
	 * @param id
	 */
	public Map<String,Object> queryFileInID(HttpServletRequest req);

	/**
	 * 由ID查询FTP文件信息
	 * @param req
	 * @param res
	 */
	public List<Map<String, Object>> queryFTPFileByID(HttpServletRequest req);

	/**
	 * 删除FTP附件(通过文件id和文件名删除一个或多个)
	 * @param req
	 * @param res
	 */
	/*public Map<String, Object> delFTPFileByFileName(HttpServletRequest req);*/

	/**
	 * 删除FTP附件(通过文件id删除其关联的所有文件)
	 * @param req
	 * @param res
	 */
	public Map<String, Object> delFTPFile(HttpServletRequest req);

	/**
	 * 上传FTP附件
	 * @param req
	 * @param res
	 */
	public Map<String, Object> uploadFTPFile(HttpServletRequest req);
	/**
	 * 上传FTP附件
	 * @param param
	 * @param user
	 * @param pmap
	 * @param multiValueMap
	 * @return
	 */
	public Map<String, Object> uploadFTPFile(Map<String, Object> param,SUser user,Map<String, String> pmap,MultiValueMap multiValueMap);

	/**
	 * 下载FTP附件
	 * @param req
	 * @param res 
	 * @param res
	 */
	public Map<String, Object> downloadFTPFile(HttpServletRequest req, HttpServletResponse res);

	public Map<String, Object> verifyFileExit(HttpServletRequest req);

	boolean ftpFilePreFileView(HttpServletRequest request, HttpServletResponse response, String userid);

	public List queryFTPFileByBusinessCode(HttpServletRequest req);

	Map<String, String> mvFtpFile(HttpServletRequest req);

	/**
	 * 验证文件名是否存在数据库记录中
	 * @param filename
	 */
	public Map<String, String> verifyFileRecordExit(HttpServletRequest req);

	public List<Map<String, Object>> findFileInfoByBusinessCodes(HttpServletRequest req);

	public Map<String,String> delFtpFileByBid(HttpServletRequest req);
	
}