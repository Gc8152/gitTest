package com.yusys.web;


import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SFileInfoService.ISFileInfoService;
import com.yusys.service.SFileInfoService.ISvnFileService;

/**
 * 附件上传
 * 
 * @author Administrator
 * 
 */
@Controller
@RequestMapping("/")
public class SvnFileInfoController  extends BaseController{
	
	@Resource
	private ISFileInfoService fileInfoService;
	@Resource
	private ISvnFileService svnFileService;
	
	public void writeUTFJson(HttpServletResponse res, String json) {
		ResponseUtils.jsonMessage(res, json);
	}

	/**
	 * 上传操作
	 */
	@RequestMapping("sfileSvn/uploadFile")
	public void uploadFile(HttpServletRequest req, HttpServletResponse res){
//		String userid=null;
//		try {
//			userid=getUserId(req);
//		} catch (Exception e) {
//		}
//		if (userid==null) {
//			userid=RequestUtils.getParamValue(req, "u");
//			String m=RequestUtils.getParamValue(req, "m");
//			if (m==null||userid==null||!m.equals(MD5.getMD5ofStr(userid+MD5.PASSWORDTYPE))) {
//				writeUTFJson(res,"{\"logintimeout\":true}");
//				return;
//			}
//		}
//		writeUTFJson(res,
//				JsonUtils.beanToJson(fileInfoService.fileUpload(req, userid)));
		try {
			writeUTFJson(res,JsonUtils.beanToJson(svnFileService.uploadFileToSvn(req, res, getUserId(req))));
		} catch (Exception e) {
			String msg=e.getMessage();
			if (msg!=null&&msg.length()>20) {
				writeUTFJson(res, "{\"result\":\"false\",\"msg\":\"文件上传异常!\"}");
			}else{
				writeUTFJson(res, "{\"result\":\"false\",\"msg\":\""+msg+"\"}");
			}
		}
	}
	/**
	 * 查询附件信息
	 */
	@RequestMapping("sfileSvn/findFileInfo")
	public void findFile(HttpServletRequest req, HttpServletResponse res){
		
		writeUTFJson(res,
				JsonUtils.beanToJson(fileInfoService.findFileInfo(req, getUserId(req))));
	}
	/**
	 * 附件下载
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/fileDownLoad")
	public void fileDownLoad(HttpServletRequest req, HttpServletResponse res){
		try {
			svnFileService.downloadFileBySvn(false,req, res);
		} catch (Exception e) {
			String msg=e.getMessage();
			if (msg!=null&&msg.length()>10) {
				writeUTFJson(res, "{\"result\":\"false\",\"message\":\"文件下载出错!\"}");
			}else{
				writeUTFJson(res, "{\"result\":\"false\",\"message\":\""+msg+"\"}");
			}
		}
	}
	/**
	 * 附件预览
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/filePreView")
	public void filePreView(HttpServletRequest req, HttpServletResponse res){
		svnFileService.reviewFileBySvn(req,res);
	}
	/**
	 * 附件删除
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/delFileInfo")
	public void delFileInfo(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(svnFileService.delFileInfoBySvn(req,res)));
	}
	/**
	 * 由ID查询附件信息
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/queryFileInID")
	public void queryFileInID(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJsonp(req,fileInfoService.queryFileInID(req)));
	}
	
	/**
	 * 由业务COde查询FTP文件信息
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/queryFTPFileByBusinessCode")
	public void queryFTPFileByBusinessCode(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanListToJson(fileInfoService.queryFTPFileByBusinessCode(req)));
	}
	
	/**
	 * 查询附件列表(批量业务编号)
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/findFileInfoByBusinessCodes")
	public void findFileInfoByBusinessCodes(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanListToJson(fileInfoService.findFileInfoByBusinessCodes(req)));
	}
	
	/**
	 * 由文件uuid查询FTP文件信息
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/queryFTPFileByID")
	public void queryFTPFileByID(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanListToJson(fileInfoService.queryFTPFileByID(req)));
	}
	
	/**
	 * 删除FTP附件(通过文件id和文件名删除一个或多个)
	 * @param req
	 * @param res
	 */
	/*@RequestMapping("sfileSvn/delFTPFileByFileName")
	public void delFTPFileByFileName(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(fileInfoService.delFTPFileByFileName(req)));
	}*/
	
	/**
	 * 删除FTP附件(通过文件id删除其关联的所有文件)
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/delFTPFile")
	public void delFTPFile(HttpServletRequest req, HttpServletResponse res){
//		writeUTFJson(res,JsonUtils.beanToJson(fileInfoService.delFTPFile(req)));
		writeUTFJson(res,JsonUtils.beanToJson(svnFileService.delFileInfoBySvn(req,res)));
		//ftpDeleteFile
	}
	
	/**
	 * 上传FTP附件
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/uploadFTPFile")
	public void uploadFTPFile(HttpServletRequest req, HttpServletResponse res){
		try {
			writeUTFJson(res,JsonUtils.beanToJson(svnFileService.uploadFileToSvn(req, res, getUserId(req))));
		} catch(RuntimeException e) {
			writeUTFJson(res, "{\"result\":\"false\",\"message\":\""+e.getMessage()+"\"}");
		}catch (Exception e) {
			e.printStackTrace();
			writeUTFJson(res, "{\"result\":\"false\",\"message\":\"文件上传异常!\"}");
		}
	}
	/**
	 * 附件预览
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/ftpFilePreView")
	public void ftpFilePreView(HttpServletRequest req, HttpServletResponse res){
		if(!fileInfoService.ftpFilePreFileView(req,res, getUserId(req))){
			/*writeUTFJson(res, "{result:false,message:\"没有找到该文件!\"}");*/
		}
	}
	/**
	 * 下载FTP附件
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/downloadFTPFile")
	public void downloadFTPFile(HttpServletRequest req, HttpServletResponse res){
//		Map<String, Object> result = fileInfoService.downloadFTPFile(req, res);
		/*if(result.get("result").equals("false")){
			writeUTFJson(res, "{result:false,message:\"文件下载出错!\"}");
		}*/
		//writeUTFJson(res,JsonUtils.beanToJson(fileInfoService.downloadFTPFile(req, res)));
		try {
			svnFileService.downloadFileBySvn(true,req, res);
		} catch (Exception e) {
			String msg=e.getMessage();
			if (msg!=null&&msg.length()>10) {
				writeUTFJson(res, "{\"result\":\"false\",\"message\":\"文件下载出错!\"}");
			}else{
				writeUTFJson(res, "{\"result\":\"false\",\"message\":\""+msg+"\"}");
			}
		}
	}
	
	/**
	 * 下载FTP附件
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/mvFTPFile")
	public void mvFtpFile(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJson(fileInfoService.mvFtpFile(req)));
		/*if(result.get("result").equals("false")){
			writeUTFJson(res, "{result:false,message:\"文件下载出错!\"}");
		}*/
		//writeUTFJson(res,JsonUtils.beanToJson(fileInfoService.downloadFTPFile(req, res)));
	}
	
	/**
	 * 验证文件是否存在
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfileSvn/verifyFileExit")
	public void verifyFileExit(HttpServletRequest req, HttpServletResponse res){
//		writeUTFJson(res, JsonUtils.beanToJson(fileInfoService.verifyFileExit(req)));
		writeUTFJson(res, "{\"result\":\"true\"}");
	}
	
	/**
	 * 验证文件名是否存在数据库记录中
	 * @param filename
	 */
	@RequestMapping("sfileSvn/verifyFileRecordExit")
	public void verifyFileRecordExit(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJson(fileInfoService.verifyFileRecordExit(req)));
	}
	
	/**
	 * 验证文件名是否存在数据库记录中
	 * @param filename
	 */
	@RequestMapping("sfileSvn/delFtpFileByBid")
	public void delFtpFileByBid(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJson(fileInfoService.delFtpFileByBid(req)));
	}
}