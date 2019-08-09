package com.yusys.service.fastdfsService;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.FastDFSUtil;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.dao.SAttachmentDao;
@Service
@Transactional
public class FastdfsService implements IFastdfsService{

	@Resource
	private TaskDBUtil taskDBUtil;
	@Resource
	private SAttachmentDao attachmentDao;
	@Override
	public Map<String, String> UploadByFastdfs(HttpServletRequest req,String userId) {
		Map<String,String> resultMap = new HashMap<String, String>();
		
		 // 转型为MultipartHttpRequest：    
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) req;    
        // 获得文件：    
        MultipartFile file = multipartRequest.getFile("importFile"); 
		
        Map<String, Object> retMap = FastDFSUtil.upload(file);
        
        String code = (String) retMap.get("code");
	    String group = (String) retMap.get("group");
	    String msg = (String) retMap.get("msg");
	
	    if ("0000".equals(code)){
	          //TODO:将上传文件的路径保存到数据库
	      	Map<String,String> tempMap = new HashMap<String, String>();
	      	String attachment_id = taskDBUtil.getSequenceValByName("S_SEQ_ATTACHMENT_ID");;
	      	tempMap.put("attachment_id", attachment_id);
	      	tempMap.put("path_id", msg);
	      	tempMap.put("group_id", group);
	      	String tempFileName = file.getOriginalFilename();
	      	tempMap.put("file_name", tempFileName);
	      	tempMap.put("fileExtName", tempFileName.substring(tempFileName.lastIndexOf(".")));
	      	tempMap.put("file_count", String.valueOf(file.getSize()));
	      	tempMap.put("relation_table", "s_attachment");
	      	tempMap.put("opt_person", userId);
	      	tempMap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
	      	attachmentDao.insertAttachment(tempMap);
	      	resultMap.put("msg", "文件上传成功");
	      }else {
	      	resultMap.put("msg", msg);
	      }
		
//		CommonsMultipartFile[] files = (CommonsMultipartFile[]) req.getAttribute("");
//		for(int i = 0;i<files.length;i++){
//            Map<String, Object> retMap = FastDFSUtil.upload(files[i]);
//            String code = (String) retMap.get("code");
//            String group = (String) retMap.get("group");
//            String msg = (String) retMap.get("msg");
//
//            if ("0000".equals(code)){
//                //TODO:将上传文件的路径保存到mysql数据库
//            	
//            	resultMap.put("msg", "文件上传成功");
//            }else {
//            	resultMap.put("msg", "文件上传失败");
//            }


//        }
		return resultMap;
	}

	@Override
	public void DownloadByFastdfs(HttpServletRequest req,
			HttpServletResponse res) {
		String group = "group1";
		String filepath = "M00/00/00/wKj7Z1kKl0aAUHAVAAAAk5fc824990.txt";
		String downname = "fastdfs下载测试.txt";
		FastDFSUtil.download(res, group, filepath, downname);
		
	}

	@Override
	public Map<String, Object> DeleteByFastdfs(HttpServletRequest req) {
		Map<String,Object> resultMap = new HashMap<String, Object>();
		String group = "group1";
		String filepath = "M00/00/00/wKj7Z1kAfUiAV9bjAA4OALMLGtI239.doc";
		resultMap = FastDFSUtil.delete(group, filepath);
		
		return resultMap;
	}

	
}
