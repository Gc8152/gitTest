package com.yusys.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.MD5;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.Utils.UploadImage;
import com.yusys.dao.SFileInfoDao;
import com.yusys.service.SFileInfoService.ISFileInfoService;

/**
 * 附件上传
 * 
 * @author Administrator
 * 
 */
@Controller
@RequestMapping("/image")
public class SImageController  extends BaseController{
	
	@Resource
	private SFileInfoDao fileInfoDao;
	
	private UploadImage uploadImage=null;
	
	public void writeUTFJson(HttpServletResponse res, String json) {
		ResponseUtils.jsonMessage(res, json);
	}
	/**
	 * 检查 上传图片 的类 是否 实例 
	 */
	private synchronized void checkUploadImage(){
		if(uploadImage==null){
			uploadImage=new UploadImage(fileInfoDao);
		}
	}
	/**
	 * 上传操作
	 */
	@RequestMapping("uploadImage")
	public void uploadFile(HttpServletRequest req, HttpServletResponse res,MultipartFile file){
		checkUploadImage();
		Map<String, String> smap=uploadImage.uploadImage(file, getUserId(req),RequestUtils.getParamValue(req, "path_id"),RequestUtils.getParamValue(req, "file_id"));
		if (smap!=null&&smap.get("file_id")!=null) {
			ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(smap));
		}
	}
	/**
	 * 图片预览
	 * @param req
	 * @param res
	 */
	@RequestMapping("/imageFileViewToPage")
	public void imageFileViewToPage(HttpServletRequest req,HttpServletResponse res) throws Exception{
		checkUploadImage();
		uploadImage.fileViewToPage(res,RequestUtils.getParamValue(req, "path_id"),RequestUtils.getParamValue(req, "file_id"));
	}
	/**
	 * 删除 图片
	 * @param req
	 * @param res
	 * @param file
	 * @throws Exception
	 */
	@RequestMapping("/deleteImg")
	public void deleteWorkPlaceImg(HttpServletRequest req,HttpServletResponse res) throws Exception{
		checkUploadImage();
		if(uploadImage.removeImage(RequestUtils.getParamValue(req, "path_id"),RequestUtils.getParamValue(req, "file_id"),null)){
			ResponseUtils.jsonMessage(res,"{\"result\":\"true\"}");
		}
	}
}