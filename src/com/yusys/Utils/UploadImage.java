package com.yusys.Utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartFile;

import com.yusys.dao.SFileInfoDao;

public class UploadImage {
	@Resource
	private SFileInfoDao fileInfoDao;
	
	public UploadImage(){
	}
	public UploadImage(SFileInfoDao fileInfoDao){
		this.fileInfoDao=fileInfoDao;
	}
	private SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmssSSS");
	/**
	 * 
	 * @param file 文件对象
	 * @param userid 操作人id
	 * @param path_id 存放路径的ID
	 * @param file_id 文件ID
	 * @return
	 */
	public Map<String, String> uploadImage(MultipartFile file,String userid,String path_id,String file_id){
		Map<String, String> map = new HashMap<String, String>();
		String fileName = file.getOriginalFilename();
		// 获取文件拓展名
		String extendName = fileName.substring(fileName.lastIndexOf(".") + 1,fileName.length());
		// 拓展名是xls
		InputStream is=null;
		FileOutputStream fos =null;
		try {
			Map<String, String> path=fileInfoDao.getFilePathById(path_id);
			File dir = new File(path.get("PATH"));
			if (!dir.exists()) {
				dir.mkdirs();
			}
			is = file.getInputStream();
			String file_count=is.available()+"";
			String id=fmt.format(new Date());
			fos = new FileOutputStream(path.get("PATH")+"\\"+id+"."+extendName);
			writeToFile(is,fos);
			map.put("result", "true");
			map.put("file_id", id);
			addFileInfo(userid,id,file_id,path_id,fileName,"."+extendName,file_count);
			return map;
		} catch (IOException e1) {
			e1.printStackTrace();
		}finally{
			if (is!=null) {
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if (fos!=null) {
				try {
					fos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		map.put("result", "false");
		return map;
	}
	/**
	 * 移除图片
	 * @param path_id
	 * @param id
	 * @param file_id
	 * @return
	 */
	public boolean removeImage(String path_id,String id,String file_id){
		Map<String, String> path=fileInfoDao.getFilePathById(path_id);
		File dir = new File(path.get("PATH"));
		if (!dir.exists()) {		
			return true;
		}
		if (id!=null&&id.trim().length()>0) {
			Map<String, String> map=fileInfoDao.getFileInfoById(id);
			removeFile(path.get("PATH")+"/"+map.get("ID")+map.get("FILE_TYPE"));
			Map<String, String> param = new HashMap<String, String>();
			param.put("id", id);
			fileInfoDao.delFildInfo(param);
		}else if (file_id!=null&&file_id.trim().length()>0) {
			List<Map<String, String>> maps=fileInfoDao.getFileInfoByFId(file_id);
			for (int i = 0; i < maps.size(); i++) {
				removeFile(path.get("PATH")+"/"+maps.get(i).get("ID")+maps.get(i).get("FILE_TYPE"));
			}
			fileInfoDao.delFildInfoByFileId(file_id);
		}
		return true;
	}
	/**
	 * 写入文件
	 * @param is
	 * @param fos
	 * @throws IOException
	 */
	private void writeToFile(InputStream is,FileOutputStream fos) throws IOException{
		byte[] b = new byte[1024];
		while((is.read(b)) != -1){
		fos.write(b);
		}
	}
	
	/**
	 * 增加文件信息 
	 * @param userid
	 * @param id
	 * @param path_id
	 * @param file_name
	 * @param file_type
	 * @param file_count
	 */
	private void addFileInfo(String userid,String id,String file_id,String path_id,String file_name,String file_type,String file_count){
		Map<String, String> map=new HashMap<String, String>();
		map.put("id", id);
		map.put("path_id", path_id);
		map.put("file_name", file_name);
		map.put("file_type", file_type);
		map.put("file_count", file_count);
		map.put("file_id", (file_id==null||file_id.trim().length()==0)?id:file_id);
		map.put("is_view", "00");
		map.put("opt_person", userid);
		map.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		fileInfoDao.addFileInfo(map);
	}
	
	/**
	 * 删除文件
	 * @param path
	 */
	private void removeFile(String path){
		try {
			File file=new File(path);
			file.delete();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/**
	 * 文件预览
	 * @param res
	 * @param path_id
	 */
	public void fileViewToPage(HttpServletResponse response,String path_id,String fid){
		Map<String, String> paramMap=new HashMap<String, String>();
		paramMap.put("id", fid);
		List<Map<String, String>> m=fileInfoDao.findFileInfo(paramMap);
		response.setHeader("Content-Type", "image/"+m.get(0).get("FILE_TYPE").substring(1));
		InputStream is=null;
		try {
			is=new FileInputStream(m.get(0).get("PATH")+"/"+m.get(0).get("ID")+m.get(0).get("FILE_TYPE"));
			OutputStream os=response.getOutputStream();
			int len=0;
			byte[] buffer=new byte[1024];
			while ((len=is.read(buffer))!=-1) {
				os.write(buffer,0,len);
			}
			is.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}catch (IOException e) {
			e.printStackTrace();
		}finally{
			if (is!=null) {
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
}
