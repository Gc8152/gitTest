package com.yusys.service.SConfigService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.SendMail;
import com.yusys.Utils.SendMessageTask;
import com.yusys.dao.SConfigDao;
@Transactional
@Service
public class SConfigService implements ISConfigService{
	@Resource
	private SConfigDao sConfigdao;
	 
	@SuppressWarnings("unused")
	private static final Logger logger = Logger.getLogger(SConfigService.class);
	 @Override
	/**
	 *修改一条邮箱配置记录
	 */
	public Map<String, String> updateEmail(HttpServletRequest req, String userid) {
		Map<String, String> resultMap =new HashMap<String, String>();
		try{
			String[] must=new String[]{"email_ip","email_name","email_num","email_password","mobile_address","contentManager_address"};
			String[] noMust={};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, noMust);
			if(pmap==null){
				resultMap.put("result", "false");
				return resultMap;
			}					
			Map<String,String> map=new HashMap<String, String>();
			Set<String> keys = pmap.keySet();
			for(String key:keys){
				map.put("conf_code", key);
				map.put("conf_value", pmap.get(key));
				map.put("opt_no", "admin");//修改人
				map.put("opt_time", DateTimeUtils.getFormatCurrentTime());//修改时间
				sConfigdao.updateEmail(map);
				map.clear();
			}
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	/**
	 * 查询配置的邮箱信息
	 */
	@Override
	public Map<String, String> findEmailInfo(String userid) {
		Map<String, String> map=new HashMap<String,String>();			
		List<Map<String,String>> listMap=sConfigdao.findEmailInfo();
		for(int i=0;i<listMap.size();i++){
			map.put(listMap.get(i).get("CONF_CODE"),listMap.get(i).get("CONF_VALUE"));
		}
		return map;
	}
	
	/**
	 * 查询阀值信息
	 */
	public Map<String, String> queryConUser(HttpServletRequest req,
			String actorno) {
		HttpSession session=req.getSession();
		ServletContext application=	session.getServletContext();
		Integer loginCount = (Integer) application.getAttribute("loginCount");
		List<Map<String,String>> listMap = sConfigdao.queryConUser();
		Map<String,String> mp=new HashMap<String, String>();
		for(int i=0;i<listMap.size();i++){
			mp.put(listMap.get(i).get("CONF_CODE"),listMap.get(i).get("CONF_VALUE"));
		}
		String	user_online = loginCount.toString();
		mp.put("user_online", user_online);
		return mp;
	}
	
	/**
	 * 修改当前阀值
	 */
	public Map<String, String> updateConUser(HttpServletRequest req,
			String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		String user_now = RequestUtils.getParamValue(req, "user_now");
		try{
			if(user_now==null||"".equals(user_now)){
				resultMap.put("result", "false");
				return resultMap;
			}
			sConfigdao.updateConUser(user_now);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		return resultMap;
	}
	/**
	 * 查询当前设定值
	 */
	public Integer queryUserNow(){
		String usernow = sConfigdao.queryUserNow();
		Integer user_now = Integer.valueOf(usernow);
		return user_now;
	}
	
	@SuppressWarnings("static-access")
	@Override
	public boolean sendEmail(String to, String title, String content,
			List<String> filenames) {
		Map<String, String> emailMap=sConfigdao.findEmailInfoHtoC();
		SendMail sendMail = new SendMail(emailMap.get("EMAIL_IP"));
		return sendMail.sendAndCc(emailMap.get("EMAIL_IP"), emailMap.get("EMAIL_NAME"), to, "", 
				title, content, emailMap.get("EMAIL_NUM"), emailMap.get("EMAIL_PASSWORD"), filenames);
//		String sendText=getEmailSendContent(to, emailMap.get("EMAIL_NAME"), title, content);
//		String result=executeOAInterface(sendText);
//		if (result.indexOf("<result>1</result>")!=-1) {
//			return true;
//		}
//		return false;
	}
	
	@SuppressWarnings("static-access")
	public boolean sendMobileMsg(String phone,String message) {
		try {
			Map<String, String> emailMap=sConfigdao.findEmailInfoHtoC();
			SendMessageTask messageTask=new SendMessageTask();
			return messageTask.sendMobileMsg(emailMap.get("MOBILE_ADDRESS"),phone, message);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	/**
	 * 查询session超时,用于配置超时时间
	 */
	@Override
	public Integer queryMaxSessionActive() {
		String session_now = sConfigdao.queryMaxSessionActive();
		Integer maxSessionActive = Integer.parseInt(session_now);
		return maxSessionActive;
	}
	/**
	 * 查询session超时时间
	 */
	@Override
	public Map<String, String> queryConSession(HttpServletRequest req,
			String actorno) {
		List<Map<String,String>> listMap = sConfigdao.queryConSession();
		Map<String,String> mp=new HashMap<String, String>();
		for(int i=0;i<listMap.size();i++){
			mp.put(listMap.get(i).get("CONF_CODE"),listMap.get(i).get("CONF_VALUE"));
		}
		return mp;
	}
	/**
	 * 修改session超时时间
	 */
	@Override
	public Map<String, String> updateConSession(HttpServletRequest req,
			String actorno) {
		Map<String, String> resultMap=new HashMap<String, String>();
		HttpSession session=req.getSession();
		String session_now = RequestUtils.getParamValue(req, "session_now");
		try{
			if(session_now==null||"".equals(session_now)){
				resultMap.put("result", "false");
				return resultMap;
			}
			sConfigdao.updateConSession(session_now);
			int maxSessionActive = Integer.parseInt(session_now);
			session.setMaxInactiveInterval(maxSessionActive);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		return resultMap;
	}
	@Override
	public Map<String, String> queryConByConfCode(HttpServletRequest req) {
		String conf_code = RequestUtils.getParamValue(req, "conf_code");
		Map<String,String> map = sConfigdao.queryConByConfCode(conf_code);
		return map;
	}

	/**
	 * 文件上传到内容管理平台
	 * @param file_path
	 * @param fileName
	 * @return
	 */
	/*public String executeContentManagerUpload(String file_path,String fileName){
		try {
			Map<String, String> emailMap=sConfigdao.findEmailInfoHtoC();
			logger.info("同步内容管理平台数据请求信息 ["+emailMap.get("CONTENTMANAGER_ADDRESS")+"]/n["+file_path+"]");
			return ContentManagerClient.fileUploadToContentManager(emailMap.get("CONTENTMANAGER_ADDRESS"), fileName, ContentManagerClient.getFileToBytes(file_path));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}*/
	
	/**
	 * 从内容管理平台下载文件
	 * @param doc_id
	 * @return
	 */
/*	public byte[] executeContentManagerDownLoad(String doc_id){
		Map<String, String> emailMap=sConfigdao.findEmailInfoHtoC();
		logger.info("下载内容管理平台数据请求信息 ["+emailMap.get("CONTENTMANAGER_ADDRESS")+"]/n["+doc_id+"]");
		try {
			return ContentManagerClient.fileDownLoadByContentManager(emailMap.get("CONTENTMANAGER_ADDRESS"), doc_id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}*/
	

}
