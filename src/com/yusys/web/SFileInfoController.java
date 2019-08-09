package com.yusys.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.MD5;
import com.yusys.Utils.MyException;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SFileInfoService.ISFileInfoService;

/**
 * 附件上传
 * 
 * @author Administrator
 * 
 */
@Controller
@RequestMapping("/")
public class SFileInfoController  extends BaseController{
	
	@Resource
	private ISFileInfoService fileInfoService;
	
	public void writeUTFJson(HttpServletResponse res, String json) {
		ResponseUtils.jsonMessage(res, json);
	}

	/**
	 * 上传操作
	 */
	@RequestMapping("sfile/uploadFile")
	public void uploadFile(HttpServletRequest req, HttpServletResponse res)throws MyException{
		String userid=getUserId(req);
		if (userid==null) {
			userid=RequestUtils.getParamValue(req, "u");
			String m=RequestUtils.getParamValue(req, "m");
			if (m==null||userid==null||!m.equals(MD5.getMD5ofStr(userid+MD5.PASSWORDTYPE))) {
				writeUTFJson(res,"{\"logintimeout\":true}");
				return;
			}
		}
		writeUTFJson(res,
				JsonUtils.beanToJson(fileInfoService.fileUpload(req, userid)));
	}
	/**
	 * 查询附件信息
	 */
	@RequestMapping("sfile/findFileInfo")
	public void findFile(HttpServletRequest req, HttpServletResponse res){
		
		writeUTFJson(res,
				JsonUtils.beanToJson(fileInfoService.findFileInfo(req, getUserId(req))));
	}
	/**
	 * 附件下载
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfile/fileDownLoad")
	public void fileDownLoad(HttpServletRequest req, HttpServletResponse res){
		if(!fileInfoService.fileDownLoad(req,res, getUserId(req))){
			writeUTFJson(res, "{result:false,message:\"没有找到该文件!\"}");
		}
	}
	/**
	 * 附件预览
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfile/filePreView")
	public void filePreView(HttpServletRequest req, HttpServletResponse res){
		if(!fileInfoService.filePreFileView(req,res, getUserId(req))){
			writeUTFJson(res, "{result:false,message:\"没有找到该文件!\"}");
		}
	}
	/**
	 * 附件删除
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfile/delFileInfo")
	public void delFileInfo(HttpServletRequest req, HttpServletResponse res){
		Map<String, String> smap=new HashMap<String, String>();
		if(!fileInfoService.delFileInfo(req, getUserId(req))){
			smap.put("result", "false");			
			smap.put("message", "您没有删除该文件的权利!或者改文件不存在");
		}else{
			smap.put("result", "true");
		}
		writeUTFJson(res, JsonUtils.beanToJson(smap));
	}
	/**
	 * 由ID查询附件信息
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfile/queryFileInID")
	public void queryFileInID(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJsonp(req,fileInfoService.queryFileInID(req)));
	}
	
	/**
	 * 由业务COde查询FTP文件信息
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfile/queryFTPFileByBusinessCode")
	public void queryFTPFileByBusinessCode(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanListToJson(fileInfoService.queryFTPFileByBusinessCode(req)));
	}
	
	/**
	 * 查询附件列表(批量业务编号)
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfile/findFileInfoByBusinessCodes")
	public void findFileInfoByBusinessCodes(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanListToJson(fileInfoService.findFileInfoByBusinessCodes(req)));
	}
	
	/**
	 * 由文件uuid查询FTP文件信息
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfile/queryFTPFileByID")
	public void queryFTPFileByID(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanListToJson(fileInfoService.queryFTPFileByID(req)));
	}
	
	/**
	 * 删除FTP附件(通过文件id和文件名删除一个或多个)
	 * @param req
	 * @param res
	 */
	/*@RequestMapping("sfile/delFTPFileByFileName")
	public void delFTPFileByFileName(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(fileInfoService.delFTPFileByFileName(req)));
	}*/
	
	/**
	 * 删除FTP附件(通过文件id删除其关联的所有文件)
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfile/delFTPFile")
	public void delFTPFile(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(fileInfoService.delFTPFile(req)));
	}
	
	/**
	 * 上传FTP附件
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfile/uploadFTPFile")
	public void uploadFTPFile(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(fileInfoService.uploadFTPFile(req)));
	}
	/**
	 * 附件预览
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfile/ftpFilePreView")
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
	@RequestMapping("sfile/downloadFTPFile")
	public void downloadFTPFile(HttpServletRequest req, HttpServletResponse res){
		Map<String, Object> result = fileInfoService.downloadFTPFile(req, res);
		/*if(result.get("result").equals("false")){
			writeUTFJson(res, "{result:false,message:\"文件下载出错!\"}");
		}*/
		//writeUTFJson(res,JsonUtils.beanToJson(fileInfoService.downloadFTPFile(req, res)));
	}
	
	/**
	 * 下载FTP附件
	 * @param req
	 * @param res
	 */
	@RequestMapping("sfile/mvFTPFile")
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
	@RequestMapping("sfile/verifyFileExit")
	public void verifyFileExit(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJson(fileInfoService.verifyFileExit(req)));
	}
	
	/**
	 * 验证文件名是否存在数据库记录中
	 * @param filename
	 */
	@RequestMapping("sfile/verifyFileRecordExit")
	public void verifyFileRecordExit(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJson(fileInfoService.verifyFileRecordExit(req)));
	}
	
	/**
	 * 验证文件名是否存在数据库记录中
	 * @param filename
	 */
	@RequestMapping("sfile/delFtpFileByBid")
	public void delFtpFileByBid(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res, JsonUtils.beanToJson(fileInfoService.delFtpFileByBid(req)));
	}
}