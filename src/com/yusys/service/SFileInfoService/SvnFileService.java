package com.yusys.service.SFileInfoService;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.AbstractMultipartHttpServletRequest;
import org.tigris.subversion.svnclientadapter.ISVNClientAdapter;
import org.tigris.subversion.svnclientadapter.SVNClientException;
import org.tigris.subversion.svnclientadapter.SVNRevision;
import org.tigris.subversion.svnclientadapter.SVNUrl;
import org.tigris.subversion.svnclientadapter.svnkit.SvnKitClientAdapter;

import com.google.common.net.UrlEscapers;
import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.dao.SFileInfoDao;
import com.yusys.dao.SFtpFileInfoDao;
import com.yusys.service.SFilePathService.ISFilePathService;
import com.yusys.webservice.client.IScmtClientService;

@Service
@Transactional
public class SvnFileService implements ISvnFileService {
	
	private Logger logger=Logger.getLogger(SvnFileService.class);
	@Resource
	private SFileInfoDao fileInfoDao;
	@Resource
	private SFtpFileInfoDao sFileFtpDao;
	@Resource
	private ISFilePathService sFilePathService;
	private ISVNClientAdapter adapter = null;
	@Resource
	private IScmtClientService scmtClientService;
	/**
	 * 文档目录前缀
	 */
	private String pre_fix_doc="文档目录";
	
//	private String root = null;// svn root目录
	private String tem_dir = null;// 临时文件夹目录
	private String common_doc = null;
	private String password=null;
	private ISVNClientAdapter getAdapter() {
		logger.info("######################default_root");
		Map<String, String> svnInfo =scmtClientService.getSvnDefaultDocLoginInfo();
		tem_dir = svnInfo.get("TEM_DIR");
		common_doc = svnInfo.get("COMMON_DOC");
		if(!svnInfo.get("PASSWORD").equals(password)) {
			adapter = new SvnKitClientAdapter();
			adapter.setUsername(svnInfo.get("USERNAME"));
			adapter.setPassword(svnInfo.get("PASSWORD"));
			password=svnInfo.get("PASSWORD");
		}
		return adapter;
	}
	
	private void initAdapter() {
		getAdapter();
	}
	/**
	 * 获取svn根目录
	 * 
	 * @return
	 */
	public String getSvnRoot(String sys_flag) {
		Map<String, String> map=null;
		try {
			logger.info(sys_flag+"######################start_root");
			map=scmtClientService.getSvnDocLoginInfo(sys_flag);
		} catch (Exception e) {
			logger.info(sys_flag+"######################获取文档仓库信息失败！");
		}
		logger.info("######################end_root");
		if(map==null) {
			throw new RuntimeException("该应用的文档库未创建！");
		}
		return map.get("ROOT");
	}

	/**
	 * 获取文件临时目录(文件中转)
	 * 
	 * @return
	 */
	public String getFileTmpDir() {
		initAdapter();
		//Linux下不能用"\\"来做目录分割符,所以这里用"/"
		String dir = tem_dir + DateTimeUtils.getRandom19() + "/";
		File file = new File(dir);
		if (!file.exists()) {
			file.mkdirs();
		} else if (!file.isDirectory()) {
			file.delete();
			file.mkdirs();
		}
		return dir;
	}

	@Override
	public Map<String, String> uploadFileToSvn(HttpServletRequest req, HttpServletResponse res, String userid)
			throws Exception {
		Map<String, String> resultMap = new HashMap<String, String>();
		String[] must = new String[] {};
		String[] nomust = new String[] { "FILE_TYPE", "BUSINESS_CODE", "MODULE_FLAG", "PHASE", "PATH_ID", "is_dic",
				"path_id", "DESCR", "FILE_VERSION", "PATH_ID", "path_id", "FILE_ID", "file_id" };
		Map<String, String> pmap = RequestUtils.requestToMap(req, must, nomust);
		String path = null;// 文件存储在svn上的路径
		String file_id = null;
		String path_id = null;
		boolean isFtp = false;// 是否为ftp表的附件存储
		initAdapter();
		if (!pmap.get("PATH_ID").equals("")) {// ftp相关表的配置查询
			isFtp = true;
			path_id = pmap.get("PATH_ID");
			pmap = sFilePathService.getFtpPathByPathId(pmap, req.getParameterMap(), true, common_doc);
			pmap.put("OPT_TIME", DateTimeUtils.getFormatCurrentTime());
			pmap.put("OPT_PERSON", userid);
			path = pmap.get("PATH_NAME");
			file_id = pmap.get("FILE_ID");
		} else {
			path_id = pmap.get("path_id");
			Map<String, String> pathInfo = fileInfoDao.getFilePathById(pmap.get("path_id"));// 获取路径配置
			file_id = pmap.get("file_id");
			path = pathInfo.get("PATH");
		}
		String svn_dir=path.replace(pmap.get("DOCUMENT_DOC"), pre_fix_doc);
		path="/"+ pmap.get("DOCUMENT_DOC")+svn_dir;
		pmap.put("PATH_NAME",path);
		MultiValueMap<String, MultipartFile> multiValueMap = ((AbstractMultipartHttpServletRequest) req)
				.getMultiFileMap();
		if (multiValueMap != null) {
			String tem_dir = getFileTmpDir();
			List<String> fileNames = new ArrayList<String>();

			File importFile = new File(tem_dir);
			try {
				Set<String> keySet = multiValueMap.keySet();
				String curFileName = null;
				for (String key : keySet) {
					LinkedList<MultipartFile> list = (LinkedList<MultipartFile>) multiValueMap.get(key);
					for (int i = 0; i < list.size(); i++) {
						MultipartFile file = list.get(i);
						curFileName = file.getOriginalFilename();
						fileNames.add(curFileName);
						// 获取文件拓展名
						String extendName = curFileName.substring(curFileName.lastIndexOf(".") + 1,
								curFileName.length());
						InputStream is = null;
						is = file.getInputStream();
						String file_count = is.available() + "";
						writeFileToDisk(tem_dir, is, curFileName);
						if (isFtp) {
							// pmap.put("FILE_TYPE", extendName);
							pmap.put("FILE_NAME", curFileName);
							sFileFtpDao.addFileInfo(pmap);
							sFileFtpDao.addFileRelInfo(pmap);
						} else {
							addFileInfo(userid, DateTimeUtils.getRandom19(), file_id, path_id, curFileName,
									"." + extendName, file_count);
						}
					}
				}
				scmtClientService.mkdirSvn(pmap.get("DOCUMENT_DOC"), svn_dir);
				
				String msg = doImport(importFile, getSvnRoot(pmap.get("DOCUMENT_DOC")) +path, curFileName,
						DateTimeUtils.getFormatCurrentTime() + "_" + userid);
				if (msg != null && msg.trim().length() > 0) {
					throw new RuntimeException(msg);
				}
				resultMap.put("msg", "上传成功!");
				resultMap.put("result", "true");
				return resultMap;
			} finally {
				for (int i = 0; i < fileNames.size(); i++) {
					try {
						new File(tem_dir + fileNames.get(i)).delete();
					} catch (Exception e) {
					}
				}
				importFile.delete();
			}
		}
		return resultMap;
	}

	/**
	 * 增加文件信息
	 * 
	 * @param userid
	 * @param id
	 * @param path_id
	 * @param file_name
	 * @param file_type
	 * @param file_count
	 */
	private void addFileInfo(String userid, String id, String file_id, String path_id, String file_name,
			String file_type, String file_count) {
		Map<String, String> map = new HashMap<String, String>();
		map.put("id", id);
		map.put("path_id", path_id);
		map.put("file_name", file_name);
		map.put("file_type", file_type);
		map.put("file_count", file_count);
		map.put("file_id", (file_id == null || file_id.trim().length() == 0) ? id : file_id);
		map.put("is_view", "");
		map.put("opt_person", userid);
		map.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		fileInfoDao.addFileInfo(map);
	}

	@Override
	public void reviewFileBySvn(HttpServletRequest req, HttpServletResponse res) {
		Map<String, String> param = RequestUtils.requestToMap(req, null,
				new String[] { "FILE_ID", "FILE_NAME", "PATH_ID", "PATH_NAME", "id" });
		List<Map<String, String>> m = fileInfoDao.findFileInfo(param);
		if (m != null && m.size() > 0) {
			res.setHeader("Content-Type", "image/" + m.get(0).get("FILE_TYPE").substring(1));
			try {
				svnDownLoadFile(m.get(0).get("FILE_NAME"), m.get(0).get("PATH"), res);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	@Override
	public void downloadFileBySvn(boolean isFtp, HttpServletRequest req, HttpServletResponse res) {
		Map<String, String> param = RequestUtils.requestToMap(req, null,
				new String[] { "FILE_ID", "FILE_NAME", "PATH_ID", "PATH_NAME", "id" });
		if (!isFtp) {// 非ftp附件下载
			List<Map<String, String>> m = fileInfoDao.findFileInfo(param);
			if (m != null && m.size() > 0) {
				res.setHeader("Content-Disposition",
						"attachment;filename=" + UrlEscapers.urlFragmentEscaper().escape(m.get(0).get("FILE_NAME")));
				try {
					svnDownLoadFile(m.get(0).get("FILE_NAME"), m.get(0).get("PATH"), res);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		} else {
			param = sFileFtpDao.getFileInfoById(RequestUtils.getParamValue(req, "id"));
			if (param != null && !param.isEmpty()) {
				try {
					svnDownLoadFile(param.get("FILE_NAME"), param.get("PATH_NAME"), res);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

	public void svnDownLoadFile(String file_name, String path_name, HttpServletResponse res) throws Exception {
		// Map<String, String> param=
		// sFileFtpDao.getFileInfoById(RequestUtils.getParamValue(req, "id"));
		String file_path = path_name + "/" + file_name;
		// if (param!=null&&!param.isEmpty()) {
		File file = new File(getFileTmpDir() + file_path);
		InputStream is = null;
		try {
			String[] paths=path_name.split("/");
			String msg = doExport(getSvnRoot(paths[1]) + file_path, file);
			if (msg != null) {
				throw new RuntimeException(msg);
			}
			String urlDecodeStr = UrlEscapers.urlFragmentEscaper().escape(file_name);
			res.setHeader("Content-Disposition", "attachment;filename=" + urlDecodeStr);
			OutputStream os = res.getOutputStream();
			is = new FileInputStream(file);
			int len = 0;
			byte[] buffer = new byte[1024];
			while ((len = is.read(buffer)) != -1) {
				os.write(buffer, 0, len);
			}
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			file.delete();
		}
		// }
	}

	public Map<String, String> deleteFile(Map<String, String> paramMap, HttpServletRequest req,
			HttpServletResponse res) {
		paramMap.put("id", "(\'" + paramMap.get("id").replace(",", "\',\'") + "\')");
		List<Map<String, String>> m = fileInfoDao.queryFileInID(paramMap);
		Map<String, String> result = new HashMap<String, String>();
		try {
			for (Map<String, String> file : m) {
				String[] paths=file.get("PATH").split("/");
				doRemove(getSvnRoot(paths[1]) + file.get("PATH") + "/" + file.get("FILE_NAME"), "删除文件");
			}
			fileInfoDao.delFildInfo(paramMap);
			result.put("result", "true");
			return result;
		} catch (Exception e) {
			e.printStackTrace();
		}
		result.put("result", "false");
		return result;
	}

	public Map<String, String> ftpDeleteFile(String ids, HttpServletRequest req, HttpServletResponse res) {
		Map<String, String> result = new HashMap<String, String>();
		String[] idArr = ids.split(",");
		String param = "";
		if (idArr != null && idArr.length > 0) {
			for (String str : idArr) {
				param += ",'" + str + "'";
			}
			String idsStr = param.substring(1);
			Map<String, String> paramMap = new HashMap<String, String>();
			paramMap.put("idsStr", idsStr);
			List<Map<String, String>> fileList = sFileFtpDao.findFileInfoByIds(paramMap);
			if (fileList != null && !fileList.isEmpty()) {
				for (Map<String, String> fileinfo : fileList) {
					try {
						String path = fileinfo.get("PATH_NAME");
						path += "/" + fileinfo.get("FILE_NAME");
						sFileFtpDao.deleteFileInfo(fileinfo.get("ID"));
						sFileFtpDao.deleteFileInfoRel(fileinfo.get("FILE_ID"));
						String[] paths=path.split("/");
						doRemove(getSvnRoot(paths[1]) + path, "删除文件");
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				try {
					result.put("result", "true");
				} catch (Exception e) {
					e.printStackTrace();
					result.put("result", "false");
				}
			}
		}
		return result;
	}

	@Override
	public Map<String, String> delFileInfoBySvn(HttpServletRequest req, HttpServletResponse res) {
		String ids = RequestUtils.getParamValue(req, "ids");
		if (ids != null && ids.trim().length() > 0) {
			return ftpDeleteFile(ids, req, res);
		} else {
			Map<String, String> paramMap = RequestUtils.requestToMap(req, new String[] { "id" }, null);
			return deleteFile(paramMap, req, res);
		}
	}

	/**
	 * 保存文件到磁盘
	 * 
	 * @param dir
	 * @param is
	 * @param fileName
	 */
	private void writeFileToDisk(String dir, InputStream is, String fileName) {
		OutputStream os = null;
		try {
			os = new FileOutputStream(dir + fileName);
			int ch = 0;
			while ((ch = is.read()) != -1) {
				os.write(ch);
			}
			os.flush();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				os.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 导入指定目录下的文件
	 * 
	 * @param file
	 * @param svn_file_dir
	 */
	public String doImport(File file, String svn_file_dir, String curFileName, String msg) {
		logger.info("上传附件到svn服务:"+svn_file_dir);
		try {
			getAdapter().doImport(file, new SVNUrl(svn_file_dir), msg, true);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (SVNClientException e) {
			e.printStackTrace();
			String message=e.getMessage();
			if (message.indexOf("svn: E160020") >= 0||message.indexOf("svn: E175005") >= 0) {
				return "文件已经存在!【" + curFileName + "】";
			}else if(e.getMessage().indexOf("E204900")>0) {
				logger.info("文档仓库不存在:"+message);
				return "文档仓库不存在!";
			}else {
				logger.info("文件上传出现未知异常:"+message);
				return "文件上传出现未知异常!!";
			}
		}
		return null;
	}

	/**
	 * 导出文件到file对象
	 * 
	 * @param svn_file_path
	 *            svn文件的路径
	 * @param file
	 *            文件对象 new File("D://测试地址说明1.txt")
	 */
	public String doExport(String svn_file_path, File file) {
		try {
			getAdapter().doExport(new SVNUrl(svn_file_path), file, SVNRevision.HEAD, true);
			return null;
		} catch (MalformedURLException e) {
			e.printStackTrace();
			return "服务器异常!";
		} catch (SVNClientException e) {
			e.printStackTrace();
			String msg = e.getMessage();
			if (msg.indexOf("svn: E170000") >= 0) {
				return "文件不存在!";
			}
		}
		return null;
	}

	/**
	 * 移除远程SVN上的文件夹或者文件
	 * 
	 * @param svn_file_path
	 *            svn文件的路径
	 * @param msg
	 *            备注_日志
	 */
	public void doRemove(String svn_file_path, String msg) {
		try {
			getAdapter().remove(new SVNUrl[] { new SVNUrl(svn_file_path) }, msg);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (SVNClientException e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) {
		SvnFileService svn = new SvnFileService();
//		System.out.println("12="+svn.getRemotDocBaseInfo("http://172.30.248.91:8080/scmtServer/svn/svnService?wsdl"));
//		svn.doExport(
//				"svn://10.229.169.63/%E7%A0%94%E5%8F%91%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0/%E6%A8%A1%E6%9D%BF%E4%B8%8E%E9%99%84%E4%BB%B6/%E4%B8%B4%E6%97%B6%E6%96%87%E4%BB%B6%E5%A4%B9/F04FD2FC-FCF2-4ABA-862B-E46B2D82022D/backlog_info.js",
//				new File("D:\\svn_tem_dir"));
		svn.doImport(new File("C:\\Users\\tanbo\\Desktop\\excel_export"), "http://172.30.248.205:2297/svn/YUSYS_GGCK11_DOC", ""	, "");
	}
}
