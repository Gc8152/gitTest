package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.fastdfsService.IFastdfsService;

@Controller
@RequestMapping("/fastdfs")
public class FastdfsController extends BaseController{

	@Resource
	private IFastdfsService fastdfsService;
	/**
	 * 通过fastdfs上传文件
	 * @param @param req
	 * @param @param res
	 * @return void 
	 * @throws 
	 *
	 */
	@RequestMapping("/uploadByFastdfs")
	public void UploadByFastdfs(HttpServletRequest req,HttpServletResponse res) {
		writeUTFJson(res,
				JsonUtils.beanToJson(fastdfsService.UploadByFastdfs(req,getUserId(req))));
	}
	/**
	 * 通过fastdfs下载文件
	 * @param @param req
	 * @param @param res
	 * @return void 
	 * @throws 
	 *
	 */
	@RequestMapping("/downloadByFastdfs")
	public void DownloadByFastdfs(HttpServletRequest req,HttpServletResponse res) {
		fastdfsService.DownloadByFastdfs(req,res);
	}
	/**
	 * 通过fastdfs删除文件
	 * @param @param req
	 * @param @param res
	 * @return void 
	 * @throws 
	 *
	 */
	@RequestMapping("/deleteByFastdfs")
	public void DeleteByFastdfs(HttpServletRequest req,HttpServletResponse res) {
		writeUTFJson(res,
				JsonUtils.beanToJson(fastdfsService.DeleteByFastdfs(req)));
	}
}
