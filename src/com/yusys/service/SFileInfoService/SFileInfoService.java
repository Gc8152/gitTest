package com.yusys.service.SFileInfoService;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
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

import com.alibaba.fastjson.JSON;
import com.artofsolving.jodconverter.DefaultDocumentFormatRegistry;
import com.artofsolving.jodconverter.DocumentConverter;
import com.artofsolving.jodconverter.DocumentFormat;
import com.artofsolving.jodconverter.openoffice.connection.OpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.connection.SocketOpenOfficeConnection;
import com.artofsolving.jodconverter.openoffice.converter.OpenOfficeDocumentConverter;
import com.google.common.net.UrlEscapers;
import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.MyException;
import com.yusys.Utils.RequestUtils;
import com.yusys.dao.SFtpFileInfoDao;
import com.yusys.dao.SFileInfoDao;
import com.yusys.entity.SUser;
import com.yusys.service.SConfigService.ISConfigService;
import com.yusys.service.SFilePathService.ISFilePathService;

@Service
@Transactional
public class SFileInfoService implements ISFileInfoService {
	private static final Logger logger = Logger.getLogger(SFileInfoService.class);
	/**
	 *  可预览的图片
	 */
	private static Map<String, String> isViewImage=new HashMap<String, String>();
	
	private SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMddHHmmssSSS");
	
	static{
		isViewImage.put(".png", "png");
		isViewImage.put(".jpg", "jpg");
		isViewImage.put(".jpeg", "jpeg");
		isViewImage.put(".bmp", "bmp");
		isViewImage.put(".gif", "gif");
	}
	
	@Resource
	private ISFileFtpService iSFileFtpService;
	
	@Resource
	private SFtpFileInfoDao sFileFtpDao;
	
	@Resource
	private ISFilePathService sFilePathService;
	
	@Resource
	private SFileInfoDao fileInfoDao;
	@Resource
	private ISConfigService sConfigService;
	
	@Override
	public Map<String, Object> findFileInfo(HttpServletRequest request,String userid){
		Map<String, String> paramMap=RequestUtils.requestToMap(request, new String[]{"file_id"}, null);
		if(paramMap==null){
			Map<String, Object>  smap=new HashMap<String, Object>();
			smap.put("result", "false");
			return smap;
		}

		 String limit = RequestUtils.getParamValue(request, "limit");
		 String offset = RequestUtils.getParamValue(request, "offset");
		 if (limit!=null&&offset!=null) {
			 paramMap.put("limit",limit);
			 paramMap.put("offset",offset);
		 }
		 List<Map<String, String>> m=fileInfoDao.findFileInfo(paramMap);
		 Map<String, Object> map=new HashMap<String, Object>();
		 map.put("rows", m);
		 map.put("total", paramMap.containsKey("total")?paramMap.get("total"):m.size());
		return map;
	}
	
	@Override
	public Map<String, String> fileUpload(HttpServletRequest request, String userid) throws MyException {
		Map<String, String> paramMap=RequestUtils.requestToMap(request, new String[]{"path_id","file_name","file_id"}, null);
		Map<String, String> map=new HashMap<String, String>();
		if(paramMap==null){
			map.put("result", "false");
			map.put("msg", "缺少参数!");
			return map;
		}
		try {
			paramMap.put("file_name", URLDecoder.decode(paramMap.get("file_name"), "UTF-8"));
			//查询文件是否存在
			List<Map<String, String>> f=fileInfoDao.findFileInfoByName(paramMap);
			//存在则直接返回
			if(f!=null && f.size()!=0) {
				throw new MyException(paramMap.get("file_name"));
			}
		}catch (UnsupportedEncodingException e2) {
			e2.printStackTrace();
		}
		return fileUploadToDisk(request,paramMap.get("file_name"), ""/*path.get("PATH")*/,null);
	}
	
	/**
	 * 上传附件到磁盘
	 * @param request
	 * @param fileName
	 * @param basePath
	 * @param formName
	 * @return keys[id,file_count,file_type]
	 */
	private Map<String, String> fileUploadToDisk(HttpServletRequest request,String fileName,String basePath,String formName) {
		Map<String, String> map=new HashMap<String, String>();
		String userid= "";
		SUser user=(SUser)request.getSession(false).getAttribute("userinfo");
		if(null != user)userid=user.getUser_no();
		String file_id = RequestUtils.getParamValue(request, "file_id");
		String path_id = RequestUtils.getParamValue(request, "path_id");
		if (formName==null) {
			formName="file";
		}
		try {
			System.out.println(request.getCharacterEncoding());
			request.setCharacterEncoding("GBK");
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		//FIXME 此处request中的文件对象被spring-mvc.xml中配置的上传文件过滤器进行的了封装过滤，因此使用以下方法处理文件上传；若取消拦截处理则恢复注释代码即可
		MultiValueMap multiValueMap = ((AbstractMultipartHttpServletRequest)request).getMultiFileMap(); 
		if(null != multiValueMap){
			Set<String> keySet = ((AbstractMultipartHttpServletRequest)request).getMultiFileMap().keySet();
			if(null != keySet && keySet.size() > 0){
				for (String key : keySet) {
					LinkedList list = (LinkedList) multiValueMap.get(key);
					if(null != list && list.size() > 0){
						for (Object object : list) {
							if(object instanceof MultipartFile){
								MultipartFile file = (MultipartFile)object ;
								String curFileName = file.getOriginalFilename();
								// 获取文件拓展名
								String extendName = curFileName.substring(curFileName.lastIndexOf(".") + 1,curFileName.length()).toLowerCase();
								// 拓展名是
								InputStream is=null;
								FileOutputStream fos =null;
								try {
									Map<String, String> path=fileInfoDao.getFilePathById(path_id);
										System.out.println("######:"+path);
										is = file.getInputStream();
										String file_count=is.available()+"";
										if(iSFileFtpService.uploadFile(path.get("PATH"), curFileName, is)){
											String id=fmt.format(new Date());
											addFileInfo(userid,id,file_id,path_id,curFileName,"."+extendName,file_count);
											map.put("result", "true");
										}else{
											map.put("result", "false");
										}
								} catch (Exception e) {
									e.printStackTrace();
								}finally{
									if (is!=null) {
										try {
											is.close();
										} catch (IOException e) {
											e.printStackTrace();
											map.put("result", "false");
										}
									}
									if (fos!=null) {
										try {
											fos.close();
										} catch (IOException e) {
											e.printStackTrace();
											map.put("result", "false");
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return map;
	}

	@Override
	public boolean fileDownLoad(HttpServletRequest request,
			HttpServletResponse response, String userid) {
		Map<String, String> paramMap=RequestUtils.requestToMap(request, new String[]{"id"}, null);
		List<Map<String, String>> m=fileInfoDao.findFileInfo(paramMap);
		try {
			response.setHeader("Content-Disposition", "attachment;filename="
					+UrlEscapers.urlFragmentEscaper().escape(m.get(0).get("FILE_NAME")));
			OutputStream os=response.getOutputStream();
			System.out.println("######:"+m.get(0));
			if(iSFileFtpService.downloadFile(m.get(0).get("PATH"), m.get(0).get("FILE_NAME"), os)){
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
//		InputStream is=null;
//		if (m!=null&&m.size()>0) {
//			try {
//				response.setHeader("Content-Disposition", "attachment;filename="+URLEncoder.encode(m.get(0).get("FILE_NAME"),"UTF-8"));
//				is=new FileInputStream(m.get(0).get("PATH")+"/"+m.get(0).get("ID")+m.get(0).get("FILE_TYPE"));
//				OutputStream os=response.getOutputStream();
//				int len=0;
//				byte[] buffer=new byte[1024];
//				while ((len=is.read(buffer))!=-1) {
//					os.write(buffer,0,len);
//				}
//				return true;
//			} catch (Exception e) {
//				e.printStackTrace();
//			}finally{
//				if (is!=null) {
//					try {
//						is.close();
//					} catch (IOException e) {
//						e.printStackTrace();
//					}
//				}
//			}
//		}
//		return false;
	}

	@Override
	public boolean delFileInfo(HttpServletRequest request, String userid) {
		Map<String, String> paramMap=RequestUtils.requestToMap(request, new String[]{"id"}, null);
		paramMap.put("id","(\'"+paramMap.get("id").replace(",","\',\'")+"\')");
		paramMap.put("userid", userid);
		List<Map<String, String>> m=fileInfoDao.queryFileInID(paramMap);
		for(Map<String, String> file:m){
			java.io.File filePath = new java.io.File(file.get("PATH")+"/"+file.get("ID")+m.get(0).get("FILE_TYPE"));
			filePath.delete();
			
			java.io.File filePdfPath = new java.io.File(file.get("PATH")+"/pdf/"+file.get("ID")+".pdf");
			filePdfPath.delete();
			java.io.File fileSWFPath = new java.io.File(file.get("PATH")+"/swf/"+file.get("ID")+".swf");
			fileSWFPath.delete();
		}
		try {
			fileInfoDao.delFildInfo(paramMap);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public boolean filePreFileView(HttpServletRequest request,
			HttpServletResponse response, String userid) {
		Map<String, String> paramMap=RequestUtils.requestToMap(request, new String[]{"id"}, null);
		List<Map<String, String>> m=fileInfoDao.findFileInfo(paramMap);
		if (m!=null&&m.size()>0) {
			try {
				if(isViewImage.containsKey(m.get(0).get("FILE_TYPE"))){
					response.setHeader("Content-Type", "image/"+m.get(0).get("FILE_TYPE").substring(1));
					OutputStream os=response.getOutputStream();
					if(iSFileFtpService.downloadFile(m.get(0).get("PATH"), m.get(0).get("FILE_NAME"), os)){
						return true;
					} else {
						return false;
					}
				}
				return true;
			} catch (Exception e) {
				e.printStackTrace();
			}finally{
			}
		}
		return false;
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
		if(isViewImage.containsKey(file_type)){
			map.put("is_view", "00");
		}else{
			map.put("is_view", "");
		}
		map.put("opt_person", userid);
		map.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		fileInfoDao.addFileInfo(map);
	}
	/**
	 * 查询文件信息 in ID
	 * @param id
	 */
	public Map<String,Object> queryFileInID(HttpServletRequest req){
		Map<String,String> param = RequestUtils.requestToMap(req,null,new String[]{"id"});
		Map<String, Object> retmap = new HashMap<String, Object>();
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		param.put("limit",limit);
		param.put("offset",offset);
		if("".equals(param.get("id"))){
			param.put("id","('')");
		}else{
			param.put("id","(\'"+param.get("id").replace(",","\',\'")+"\')");
		}
		List<Map<String,String>> files = fileInfoDao.queryFileInID(param);
		retmap.put("rows", files);
		retmap.put("total", param.get("total"));
		return retmap;
	}
	
	/**
	 * 附件列表
	 */
	@Override
	public List<Map<String, Object>> queryFTPFileByBusinessCode(HttpServletRequest req) {
		String file_id = req.getParameter("business_code");
		String phase = req.getParameter("phase");
		
		Map<String, String> paramMap = new HashMap<String, String>();
		List<Map<String, Object>> result;
		
		paramMap.put("BUSINESS_CODE", file_id);
		paramMap.put("PHASE", phase);
		result = sFileFtpDao.findFileInfo(paramMap);
		return result;
	}
	
	/**
	 * 查询附件列表(批量业务编号)
	 */
	public List<Map<String, Object>> findFileInfoByBusinessCodes(HttpServletRequest req){
		String file_id = req.getParameter("business_code");
		String phase = req.getParameter("phase");
		
		Map<String, String> paramMap = new HashMap<String, String>();
		List<Map<String, Object>> result;
		
		paramMap.put("BUSINESS_CODE", file_id);
		paramMap.put("PHASE", phase);
		result = sFileFtpDao.findFileInfoByBusinessCodes(paramMap);
		return result;
	}
	
	/**
	 * 附件列表
	 */
	@Override
	public List<Map<String, Object>> queryFTPFileByID(HttpServletRequest req) {
		String file_ids = req.getParameter("file_ids");
		
		String[] ids = file_ids.split(",");
		String id = "";
		for(int i=0; i<ids.length; i++){
			id += ",'" + ids[i] + "'";
		}
		String file_id = id.substring(1);
		
		Map<String, String> paramMap = new HashMap<String, String>();
		List<Map<String, Object>> result;
		
		paramMap.put("file_id", file_id);
		result = sFileFtpDao.findFileInfoByFileId(paramMap);
		return result;
	}

	/**
	 * 删除附件
	 */
	@Override
	public Map<String, Object> delFTPFile(HttpServletRequest req) {
		String ids = req.getParameter("ids");
		Map<String, Object> result = new HashMap<String, Object>();
		String[] idArr = ids.split(",");
		String param = "";
		if(idArr!=null&&idArr.length>0){
			for(String str : idArr){
				param += ",'" + str + "'";
			}
			String idsStr = param.substring(1);
			Map<String, String> paramMap = new HashMap<String, String>();
			paramMap.put("idsStr", idsStr);
			List<Map<String, String>> fileList = sFileFtpDao.findFileInfoByIds(paramMap);
			if(fileList!=null&&!fileList.isEmpty()){
				for(Map<String, String> fileinfo : fileList){
					try {
						String path = fileinfo.get("PATH_NAME");
						String name = fileinfo.get("FILE_NAME");
						iSFileFtpService.deleteFile(path, name);
						sFileFtpDao.deleteFileInfo(fileinfo.get("ID"));
						sFileFtpDao.deleteFileInfoRel(fileinfo.get("FILE_ID"));
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				try {
					result.put("result", "true");
				} catch(Exception e){
					e.printStackTrace();
					result.put("result", "false");
				}
			}
		} else {
			result.put("result", "false");
		}
		
		return result;
	}
	/**
	 * 上传FTP附件
	 */
	@Override
	public Map<String, Object> uploadFTPFile(HttpServletRequest req) {
//		String[] must=new String[]{"FILE_TYPE","FILE_ID","BUSINESS_CODE","MODULE_FLAG", "PHASE", "PATH_ID", "is_dic"};
//		String[] nomust=new String[]{"DESCR","FILE_VERSION"};
//		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
//		Map<String, Object> param = req.getParameterMap();
//		
//		SUser user=(SUser)req.getSession(false).getAttribute("userinfo");
//		String userid= "";
//		if(null != user)userid=user.getUser_no();
//		
//		pmap = sFilePathService.getFtpPathByPathId(pmap, param);
//		pmap.put("OPT_TIME", DateTimeUtils.getFormatCurrentTime());
//		pmap.put("OPT_PERSON", userid);
//		
//		Map<String, Object> resultMap = new HashMap<String, Object>();
//		Map<String, Object> fileUploadResult = new HashMap<String, Object>();
//		boolean isSuccess = true;
//		
//		if("true".equals(pmap.get("result"))){
//			MultiValueMap multiValueMap = ((AbstractMultipartHttpServletRequest)req).getMultiFileMap(); 
//			if(null != multiValueMap && !multiValueMap.isEmpty()){
//				Set<String> keySet = ((AbstractMultipartHttpServletRequest)req).getMultiFileMap().keySet();
//				if(null != keySet && keySet.size() > 0){
//					for (String key : keySet) {
//						LinkedList list = (LinkedList) multiValueMap.get(key);
//						if(null != list && list.size() > 0){
//							for (Object object : list) {
//								if(object instanceof MultipartFile){
//									MultipartFile file = (MultipartFile)object;
//									String fileName = file.getOriginalFilename();
//									try {
//										if(iSFileFtpService.uploadFile(pmap.get("PATH_NAME"), fileName, file.getInputStream())){
//											pmap.put("FILE_NAME", fileName);
//											
//											//文件信息存储还需要额外的信息
//											sFileFtpDao.addFileInfo(pmap);
//											
//											String business_code = pmap.get("BUSINESS_CODE");
//											String business_codes[] = business_code.split(",");
//											if(null!=business_code&&business_codes.length>0){
//												for(int i=0; i<business_codes.length;i++){
//													String str = business_codes[i];
//													pmap.put("BUSINESS_CODE", str);
//													sFileFtpDao.addFileRelInfo(pmap);
//												}
//											}
//											fileUploadResult.put(fileName, "true");
//										} else {
//											fileUploadResult.put(fileName, "false");
//											isSuccess = false;
//										}
//									} catch (Exception e) {
//										e.printStackTrace();
//										isSuccess = false;
//										fileUploadResult.put(fileName, "上传文件失败");
//									}
//								}
//							}
//						}
//					}
//				}
//			} else {
//				resultMap.put("msg", "参数不全");
//			}
//			resultMap.put("msg", fileUploadResult);
//			resultMap.put("result", String.valueOf(isSuccess));
//		} else {
//			resultMap.put("result", "false");
//			resultMap.put("msg", pmap.get("msg"));
//		}
//		return resultMap;
		
		SUser user=(SUser)req.getSession(false).getAttribute("userinfo");
		String[] must=new String[]{"FILE_TYPE","FILE_ID","BUSINESS_CODE","MODULE_FLAG", "PHASE", "PATH_ID", "is_dic"};
		String[] nomust=new String[]{"DESCR","FILE_VERSION"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		MultiValueMap multiValueMap = ((AbstractMultipartHttpServletRequest)req).getMultiFileMap(); 
		return uploadFTPFile(req.getParameterMap(),user,pmap,multiValueMap);
	}
	public Map<String, Object> uploadFTPFile(Map<String, Object> param,SUser user,Map<String, String> pmap,MultiValueMap multiValueMap){
		String userid= "";
		if(null != user)userid=user.getUser_no();
		pmap = sFilePathService.getFtpPathByPathId(pmap, param,false,null);
		pmap.put("OPT_TIME", DateTimeUtils.getFormatCurrentTime());
		pmap.put("OPT_PERSON", userid);
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Object> fileUploadResult = new HashMap<String, Object>();
		boolean isSuccess = true;
		
		if("true".equals(pmap.get("result"))){
			if(null != multiValueMap && !multiValueMap.isEmpty()){
				Set<String> keySet = multiValueMap.keySet();
				if(null != keySet && keySet.size() > 0){
					for (String key : keySet) {
						LinkedList list = (LinkedList) multiValueMap.get(key);
						if(null != list && list.size() > 0){
							for (Object object : list) {
								if(object instanceof MultipartFile){
									MultipartFile file = (MultipartFile)object;
									String fileName = file.getOriginalFilename();
									try {
										if(iSFileFtpService.uploadFile(pmap.get("PATH_NAME"), fileName, file.getInputStream())){
											pmap.put("FILE_NAME", fileName);
											
											//文件信息存储还需要额外的信息
											sFileFtpDao.addFileInfo(pmap);
											
											String business_code = pmap.get("BUSINESS_CODE");
											String business_codes[] = business_code.split(",");
											if(null!=business_code&&business_codes.length>0){
												for(int i=0; i<business_codes.length;i++){
													String str = business_codes[i];
													pmap.put("BUSINESS_CODE", str);
													sFileFtpDao.addFileRelInfo(pmap);
												}
											}
											fileUploadResult.put(fileName, "true");
										} else {
											fileUploadResult.put(fileName, "false");
											isSuccess = false;
										}
									} catch (Exception e) {
										e.printStackTrace();
										isSuccess = false;
										fileUploadResult.put(fileName, "上传文件失败");
									}
								}
							}
						}
					}
				}
			} else {
				resultMap.put("msg", "参数不全");
			}
			resultMap.put("msg", fileUploadResult);
			resultMap.put("result", String.valueOf(isSuccess));
		} else {
			resultMap.put("result", "false");
			resultMap.put("msg", pmap.get("msg"));
		}
		return resultMap;
	}
	public Map<String, Object> verifyFileExit(HttpServletRequest req){
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, String> param = sFileFtpDao.getFileInfoById(RequestUtils.getParamValue(req, "id"));
		boolean exit = false;
		if(null!=param&&!param.isEmpty()){
			try {
				 exit = iSFileFtpService.isFileExitInFtp(param.get("PATH_NAME"), param.get("FILE_NAME"));
				 if(exit==false){
					 resultMap.put("msg", "文件不存在");
				 }
			} catch (Exception e) {
				e.printStackTrace();
				resultMap.put("msg", "查询文件出错");
			}
		} else {
			resultMap.put("msg", "文件相关记录信息不存在");
		}
		resultMap.put("result", exit);
		return resultMap;
	}
	
	@Override
	public Map<String, Object> downloadFTPFile(HttpServletRequest req, HttpServletResponse res) {
		// TODO Auto-generated method stub
		Map<String, String> param=RequestUtils.requestToMap(req, new String[]{"FILE_ID","FILE_NAME","PATH_ID","PATH_NAME"}, null);
		param = sFileFtpDao.getFileInfoById(RequestUtils.getParamValue(req, "id"));
		Map<String, Object>	result = new HashMap<String, Object>();
		if (param!=null&&!param.isEmpty()) {
			try {
				String urlDecodeStr = UrlEscapers.urlFragmentEscaper().escape(param.get("FILE_NAME"));
				res.setHeader("Content-Disposition", "attachment;filename="+urlDecodeStr);
				OutputStream os=res.getOutputStream();
				if(iSFileFtpService.downloadFile(param.get("PATH_NAME"), param.get("FILE_NAME"), os)){
					result.put("result", true);
				} else {
					result.put("result", false);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return result;
	}
	
	public Map<String, String> mvFtpFile(HttpServletRequest req){
		String[] must = {"system_name","fromBid","toBid","SID","is_dic"};
		Map<String, String> param = RequestUtils.requestToMap(req, must, null);
		Map<String, String> resultMap = null;
		try {
			resultMap = mvFile(param.get("system_name"), param.get("fromBid"), param.get("toBid"), param.get("SID"), param.get("is_dic"));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return resultMap;
	}
	
	public Map<String, String> mvFile(String system_name, String fromBid, String toBid, String userid, String is_dic) throws Exception{
		int succNum = 0;
		int sumNum = 0;
		Map<String, String> paramMap = new HashMap<String, String>();
		Map<String, Object> pathMap = new HashMap<String, Object>();
		Map<String, String> resultMap = new HashMap<String, String>();
		String[] TAG_PARAM = {system_name};
		pathMap.put("SYSTEM_NAME", TAG_PARAM);
		paramMap.put("is_dic", is_dic);
		pathMap.put("REQ_CODE", toBid);
		//paramMap.put("SYSTEM_NAME", system_name);
		//查询条件未包含阶段，数据将存在两个阶段：01未需求输入阶段，06为需求评估文档
		List<Map<String, Object>> fileList = new ArrayList<Map<String,Object>>();
		String[] fromBids = fromBid.split(",");
		if(fromBids.length>0){
			for(String temp : fromBids){
				paramMap.put("BUSINESS_CODE", temp);
				fileList.addAll(sFileFtpDao.findFileInfo(paramMap));
			}
		}
		//1查询出所有需要移动到文件
		if(!fileList.isEmpty()){
			sumNum = fileList.size();
			for(Map<String, Object> file : fileList){
				String fromPath = (String) file.get("PATH_NAME");
				String phase = (String) file.get("PHASE");
				String toPath = (String) pathMap .get(phase+(String)file.get("FILE_TYPE"));
				if(toPath==null){
					if("0101".equals(phase)){
						paramMap.put("PATH_ID", "GZ1066");
					} else if("0102".equals(phase)){
						paramMap.put("PATH_ID", "GZ1067");
					}
					pathMap.put("DIC_NAME", new String[]{(String) file.get("DIC_NAME")});
					paramMap = sFilePathService.getFtpPathByPathId(paramMap, pathMap,false,null);
					toPath = paramMap.get("PATH_NAME");
					pathMap.put(phase+(String)file.get("FILE_TYPE"), toPath);
				}
				//2移动文件
				boolean result =true;// iSFileFtpService.mvFile(fromPath + "/" + file.get("FILE_NAME"), toPath + "/" + file.get("FILE_NAME"));
				//3更新文件在数据库中的记录（关联业务id以及文件路径等信息）
				if(result){
					pathMap.put("BUSINESS_CODE", toBid);
					pathMap.put("fr_id", file.get("FR_ID"));
					sFileFtpDao.updateFileRelInfo(pathMap);
					pathMap.put("file_id", file.get("FILE_ID"));
					pathMap.put("path_name", fromPath);
					sFileFtpDao.updateFileInfo(pathMap);
					succNum++;
				}
			}
		}
		resultMap.put("updateNum", String.valueOf(sumNum));
		resultMap.put("succNum", String.valueOf(succNum));
		resultMap.put("isSucc", sumNum==succNum?"true":"false");
		return resultMap;
	}
	
	/**
	 * 验证文件名是否存在数据库记录中
	 * @param filename
	 */
	public Map<String, String> verifyFileRecordExit(HttpServletRequest req) {
		Map<String, String> pmap = new HashMap<String, String>();
		String filename = req.getParameter("filename");
		String path_id = req.getParameter("path_id");
		String paramObjStr = req.getParameter("paramObj");
		//String is_dic = req.getParameter("is_dic");
		
		pmap.put("filename", filename);
		pmap.put("PATH_ID", path_id);
		//pmap.put("is_dic", is_dic);
		
		Map<String, Object> pathParamMap = JSON.parseObject(paramObjStr, Map.class);
		Map<String, String> pathMap = sFilePathService.getFtpPathByPathId(pmap, pathParamMap,false,null);
		String path = pathMap.get("PATH_NAME");
		
		pmap.put("path_name", path);
		
		List<Map<String, String>> fileList = sFileFtpDao.getFileListByFileName(pmap);
		if(fileList.size()!=0){
			pmap.put("result", "false");
		} else {
			pmap.put("result", "true");
		}
		return pmap;
	}
	
	/**
	 * 验证文件名是否存在数据库记录中
	 * @param filename
	 */
	public Map<String,String> delFtpFileByBid(HttpServletRequest req){
		Map<String, String> pmap = new HashMap<String, String>();
		String business_code = req.getParameter("business_code");
		pmap.put("BUSINESS_CODE", business_code);
		List<Map<String, Object>> fileList = sFileFtpDao.findFileInfo(pmap);
		if(fileList!=null&&!fileList.isEmpty()){
			for (int i = 0; i < fileList.size(); i++) {
				try {
					sFileFtpDao.deleteFileInfo((String)fileList.get(i).get("ID"));
					sFileFtpDao.deleteFileInfoRel((String)fileList.get(i).get("FILE_ID"));
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					throw new RuntimeException();
				}
			}
		}
		return pmap;
	}
	
	@Override
	public boolean ftpFilePreFileView(HttpServletRequest req, HttpServletResponse res, String userid) {
		Map<String, String> param = sFileFtpDao.getFileInfoById(RequestUtils.getParamValue(req, "id"));
		String filename = param.get("FILE_NAME");
		String extStr = filename.substring(filename.lastIndexOf(".")+1, filename.length());
		OutputStream out = null;
		try {
			boolean isImage=false;
			if (param!=null&&!param.isEmpty()) {
				out = res.getOutputStream();
				InputStream in = null;
				//图片文件
				if(isViewImage.containsKey(extStr)){
					isImage=true;
					res.setHeader("Content-Type", "image/"+extStr);
					iSFileFtpService.downloadFile(param.get("PATH_NAME"), param.get("FILE_NAME"), out);
				}
				if(iSFileFtpService.isFileExitInFtp(param.get("PATH_NAME"), param.get("FILE_NAME"))){
					in = iSFileFtpService.getFileStream(param.get("PATH_NAME"), param.get("FILE_NAME"));
					String md5Str = getMd5(in);
					in.close();
					//in.reset();
					if(iSFileFtpService.isFileExitInFtp("/temp/swf/", md5Str)){
						//如果转换文件夹中有缓存
						iSFileFtpService.downloadFile("/temp/swf/", md5Str, out);
					} else {
						//如果没有缓存，进行文件转换
						in = iSFileFtpService.getFileStream(param.get("PATH_NAME"), param.get("FILE_NAME"));
						
						File pdfFileDir = new File("fileconvertTemp/pdf/");
						File swfFileDir = new File("fileconvertTemp/swf/");
						String pdfFile = "fileconvertTemp/pdf/"+ md5Str;
						String swfFile = "fileconvertTemp/swf/"+ md5Str;
						if(!pdfFileDir.isDirectory()){
							boolean b = pdfFileDir.mkdirs();
						}
						if(!swfFileDir.isDirectory()){ 
							boolean c = swfFileDir.mkdirs();
						}
						
						convert(in, pdfFile, extStr);
						convertToSwf(pdfFile, swfFile);
						
						boolean b = iSFileFtpService.uploadFile("/temp/swf", md5Str, new FileInputStream(swfFile));
						InputStream is = new FileInputStream(swfFile);
						int len=0;
						byte[] buffer=new byte[1024];
						while ((len=is.read(buffer))!=-1) {
							out.write(buffer,0,len);
						}
						is.close();
						(new File(pdfFile)).delete();
						(new File(swfFile)).delete();
						return true;
					}
				} else {
					try {
						out.close();
					} catch (IOException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
					return true;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			try {
				out.close();
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
			
		return false;
	}
	
	private String getMd5(InputStream in) throws Exception{
		byte[] buffer = new byte[1024];    
		MessageDigest md5 = MessageDigest.getInstance("MD5");    
		int numRead = 0;    
		while ((numRead = in.read(buffer)) > 0) {    
		    md5.update(buffer, 0, numRead);    
		}
		BigInteger bi = new BigInteger(1, md5.digest());
		return bi.toString(16);
	}
	
	private void convert(InputStream in, String file, String extStr) throws Exception{
		OutputStream out = null;
		OpenOfficeConnection connection = new SocketOpenOfficeConnection(8100);
		try {
			out = new FileOutputStream(file);
			connection.connect();
			DocumentConverter converter = new OpenOfficeDocumentConverter(connection);
			
			DefaultDocumentFormatRegistry formatReg = new DefaultDocumentFormatRegistry(); 
			DocumentFormat ext = formatReg.getFormatByFileExtension(extStr); 
			DocumentFormat pdf = formatReg.getFormatByFileExtension("pdf");
			
			converter.convert(in, ext, out, pdf);
			
			out.flush();
			out.close();
			
			connection.disconnect();
			logger.info("####PDF文件："+file+"转换为SWF文件："+pdf);
			/*logger.info("-=-=-=-=:"+connection.isConnected());
			logger.info("****pdf转换成功，PDF输出：" + pdfFile.getPath()
					+ "****");*/
		} catch (java.net.ConnectException e) {
			e.printStackTrace();
			logger.info("****pdf转换器异常，openoffice服务未启动！****");
			throw e;
		}catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	private void convertToSwf(String pdf, String swf) throws Exception{
		int environment = 1;
		Runtime r = Runtime.getRuntime();
		if(environment==1){//windows环境
			try {//设置好环境变量 直接用pdf2swf.exe文件执行指令 否则  用E:/Program Files (x86)/SWFTools/pdf2swf.exe 
				Process p = r.exec("pdf2swf "+ pdf + " -o "+ swf + " -T 9");
				//Process p = r.exec("E:\\soft\\SWFTools\\pdf2swf.exe "+ pdf + " -o "+ swf + " -T 9");
				//干掉指令执行之后返回的缓冲区
				/*loadStream(p.getInputStream());
				loadStream(p.getErrorStream());
				loadStream(p.getInputStream());
				logger.info("****swf转换成功，文件输出：" + swfFile.getPath() + "****");*/
				int ptr = 0;
				InputStream in = new BufferedInputStream(p.getInputStream());
				StringBuffer buffer = new StringBuffer();

				while ((ptr = in.read()) != -1) {
					buffer.append((char) ptr);
				}
				String ii = buffer.toString();
				logger.debug("####PDF文件："+pdf+"转换为SWF文件："+swf+", 转换信息：");
				logger.debug(ii);
				p.destroy();
			} catch (IOException e) {
				e.printStackTrace();
				throw e;
			}
		}else if(environment==2){// linux环境处理
			try {
				Process p = r.exec("pdf2swf " + pdf	+ " -o " + swf + " -T 9");
				int ptr = 0;
				InputStream in = new BufferedInputStream(p.getInputStream());
				StringBuffer buffer = new StringBuffer();

				while ((ptr = in.read()) != -1) {
					buffer.append((char) ptr);
				}
				String ii = buffer.toString();
				logger.debug("####PDF文件："+pdf+"转换为SWF文件："+swf+", 转换信息：");
				logger.debug(ii);
				p.destroy();
			} catch (Exception e) {
				e.printStackTrace();
				throw e;
			}
		}
	}
}
