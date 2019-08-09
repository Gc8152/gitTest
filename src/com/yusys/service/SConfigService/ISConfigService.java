package com.yusys.service.SConfigService;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface ISConfigService {
	/**
	 * 新增一条配置信息
	 * @param req
	 * @param userid
	 * @return
	 */
    public Map<String, String> updateEmail(HttpServletRequest req,String userid);
    /**
     * 查询邮箱配置信息
     * @param req
     * @param userid
     * @return
     */
    public Map<String,String>  findEmailInfo(String userid);
	//查询阀值信息
	public Map<String, String> queryConUser(HttpServletRequest req,String actorno);
	//修改当前阀值
	public Map<String, String> updateConUser(HttpServletRequest req,String actorno);
	//查询当前设定阀值
	public Integer queryUserNow();
	//查询session超时,用于配置超时时间
	public Integer queryMaxSessionActive();
	//查询session超时
	public Map<String, String> queryConSession(HttpServletRequest req,String actorno);
	//修改session超时
	public Map<String, String> updateConSession(HttpServletRequest req,String actorno);
	/**
	 * 发送邮件
	 * @param to 收件人邮箱 多个可以用逗号隔开
	 * @param title 标题
	 * @param content 内容
	 * @param filenames 附件集合 如 ["D:\\test.txt","E:\\test2.txt"]
	 */
	public boolean sendEmail( String to,String title, String content, List<String> filenames);
	
	/**
	 * 通过配置编码，查新配置参数信息 
	 * @param @param req
	 * @param @return
	 * @return Map<String,String> 
	 * @throws 
	 *
	 */
	public Map<String, String> queryConByConfCode(HttpServletRequest req);
	/**
	 * 执行调用oa接口
	 * @param content
	 * @return
	 */
	//public String executeOAInterface(String content);
	/**
	 * 发送短线的接口
	 * @param phone
	 * @param message
	 * @return
	 */
	//public boolean sendMobileMsg(String phone,String message);
	/**
	 * 上传文件到内容管理平台
	 * @param file_path
	 * @param fileName
	 * @return
	 */
	//public String executeContentManagerUpload(String file_path,String fileName);
	/**
	 * 从内容管理平台下载
	 * @param doc_id
	 * @return
	 */
	//public byte[] executeContentManagerDownLoad(String doc_id);
	
}
