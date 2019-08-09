package com.yusys.service.SFilePathService;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.dao.SFilePathDao;
import com.yusys.dao.SPathTagDao;
import com.yusys.entity.SPathTag;

@Service
@Transactional
public class SFilePathService implements ISFilePathService{
	
	@Resource
	private SFilePathDao sFilePathDao;
	@Resource
	private SPathTagDao sPathTagDao;

	//查询服务器信息
	public Map<String, Object> getServerInfo(HttpServletRequest req) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try{
			List<Map<String, String>> list = sFilePathDao.getServerInfo(null);
			if(list.size()>0){
				resultMap.put("result", true);
				resultMap.put("list", list);
			}else{
				resultMap.put("result", false);
			}
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}

	//保存文件服务器信息
	public Map<String, String> saveServerInfo(HttpServletRequest req) {
		Map<String, String> resultMap=new HashMap<String, String>();
		//必填参数列表
		String[] must=new String[]{"servername","username","password","port"};
		//非必填的参数列表
		String[] nomust=new String[]{"id"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		try {
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			String id = req.getParameter("id");
			//新增
			if(id==null||id.equals("")){
				pmap.put("id","1");
				sFilePathDao.addServerInfo(pmap);
				resultMap.put("msg", "保存成功");
				resultMap.put("result", "true");
			//修改
			}else{
				sFilePathDao.updateServerInfo(pmap);
				resultMap.put("msg", "修改成功");
				resultMap.put("result", "true");
			}
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("msg", "系统繁忙");
			resultMap.put("result", "false");
		}
		return resultMap;
	}

	//查询所有文件路径
	public Map<String, Object> queryListFilePath(HttpServletRequest req) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String path_id = RequestUtils.getParamValue(req, "path_id");
		String status = RequestUtils.getParamValue(req, "status");
		String type = RequestUtils.getParamValue(req, "type");
		if(path_id!=""){
			pmap.put("path_id","%"+path_id+"%");			
		}
		if(status !="" && status != null){
			pmap.put("status",status);
		}
		if(type !="" && type != null){
			pmap.put("path_type",type);
		}
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String, String>> m = sFilePathDao.queryListFilePath(pmap);
		resultMap.put("rows", m);
		resultMap.put("total", pmap.get("total"));
		return resultMap;
	}

	//删除一条文件路径
	public Map<String, String> deleteFilePath(HttpServletRequest req) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String path_id = RequestUtils.getParamValue(req, "path_id");
		if (path_id==null||"".equals(path_id.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("path_id", path_id);
		try{
			sFilePathDao.deleteFilePath(pmap);				
			resultMap.put("result", "true");
			resultMap.put("msg", "删除成功！");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "删除失败");
		return resultMap;
	}
	//根据ID查询文件路径
	public Map<String, Object> queryOneFilePath(HttpServletRequest req) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		try {
			//必填参数列表
			String[] must=new String[]{"path_id"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must,null);
			if (pmap==null) {
				resultMap.put("result", null);
				return resultMap;
			}

			List<Map<String, String>> list = sFilePathDao.queryOneFilePath(pmap);
			if(list.size()>0){
				resultMap.put("result", true);
				resultMap.put("list", list);
			}else{
				resultMap.put("result", false);
			}
			
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//根据类型查询文件路径
	public Map<String, Object> queryOneByType(HttpServletRequest req) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		try {
			//必填参数列表
			String[] must=new String[]{"path_type"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must,null);
			if (pmap==null) {
				resultMap.put("result", null);
				return resultMap;
			}
			List<Map<String, String>> list = sFilePathDao.queryOneByType(pmap);
			if(list.size()>0){
				resultMap.put("result", true);
				resultMap.put("list", list);
			}else{
				resultMap.put("result", false);
			}
			
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//新增一条文件路径
	public Map<String, String> addFilePath(HttpServletRequest req,String userId) {
		Map<String, String> resultMap=new HashMap<String, String>();
		//必填参数列表
		String[] must=new String[]{"path_id","status","path_type","path"};
		//非必填的参数列表
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		try {
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("flag", "00");
			pmap.put("opt_id", userId);
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentDate());
			//插入文件路径表
			sFilePathDao.addFilePath(pmap);
			//插入路径标签表
			String tagids=req.getParameter("tag_ids");
			if (tagids==null) {
				tagids="";
			}
			String []tag_ids = tagids.split(",");
			for (int i = 0; i < tag_ids.length; i++) {
				if(null!=tag_ids[i]&&!"".equals(tag_ids[i].trim())){
					pmap.put("order_id",Integer.toString(i));
					pmap.put("tag_id", tag_ids[i]);
					sPathTagDao.addFilePathTag(pmap);
				}
			}
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}

	//更新一条文件路径
	public Map<String, String> updateFilePath(HttpServletRequest req,String userId) {
		Map<String, String> resultMap=new HashMap<String, String>();
		//必填参数列表
		String[] must=new String[]{"path_id","status","path_type","path"};
		//非必填的参数列表
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, null);
		try {
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("flag", "00");
			pmap.put("opt_id", userId);
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentDate());
			//更新文件路径表
			sFilePathDao.updateFilePath(pmap);
			//插入路径标签表
			String tagids=req.getParameter("tag_ids");
			if (tagids==null) {
				tagids="";
			}
			String []tag_ids = tagids.split(",");
			sPathTagDao.deleteFilePathTag(pmap);
			for (int i = 0; i < tag_ids.length; i++) {
				if(null!=tag_ids[i]&&!"".equals(tag_ids[i].trim())){
					pmap.put("order_id",Integer.toString(i));
					pmap.put("tag_id", tag_ids[i]);
					sPathTagDao.addFilePathTag(pmap);
				}
			}
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	//获取文件路径的方法
	public Map<String, String> getRealFilePath(HttpServletRequest req,String userId,String userName) {
		//Map<String, String> resultMap=new HashMap<String, String>();
		String path_id = req.getParameter("PATH_ID");
		String path_type = req.getParameter("PATH_TYPE");
		Map<String, String> result = getFtpPathInfo(userId, userName, path_id, path_type);
		return result;
	}

	public Map<String, String> getFtpPathInfo(String userId, String userName, String path_id, String path_type) {
		Map<String, String> pmap = new HashMap<String,String>();
		Map<String, String> result = new HashMap<String, String>();
		String realFilePath ="";
		try{
			if(!(path_id==null||"".equals(path_id.trim()))){//普通文件上传
				pmap.put("path_id", path_id);
				List<Map<String, String>> list = sFilePathDao.queryOneFilePath(pmap);
				realFilePath = list.get(0).get("PATH");
			}
			if(!(path_type==null||"".equals(path_type.trim()))){//按照文件类型上传的
				pmap.put("path_type", path_type);
				List<Map<String, String>> m = sFilePathDao.queryOneByType(pmap);//根据文件类型得到path_id
				Map<String, String> spmap = new HashMap<String,String>();
				path_id = m.get(0).get("PATH_ID");
				spmap.put("path_id", path_id);
				List<SPathTag> list = sPathTagDao.queryFilePathTag(spmap);//查询该path_id下的标签集合
				//realFilePath = makePath(list,userId,userName);//调用生成路径方法
			}
			result.put("result", "true");
			result.put("PATH_NAME", realFilePath);
			result.put("FILE_TYPE", path_type);
			result.put("PATH_ID", path_id);
		}catch(Exception e){
			e.printStackTrace();
			result.put("result", "false");
			result.put("msg", "获取文件路径失败");
		}
		return result;
	}
	
	//根据路径id获取并生成路径
	public Map<String, String> getFtpPathByPathId(Map<String, String> pmap, Map<String, Object> param,boolean isSvn,String common_doc) {
		Set<String> keys=param.keySet();
		Iterator<String> ks= keys.iterator();
		System.out.println(pmap);
		System.out.println("   start");
		while (ks.hasNext()) {
			String key=ks.next();
			Object value=param.get(key);
			if(value instanceof String[]){
				System.out.println(key+"="+((String[])value)[0]);
			}else{
				System.out.print(key+"="+value);
			}
		}
		System.out.println("   end");
		String path_id = pmap.get("PATH_ID");
		String realFilePath ="";
		String document_doc="";
		if (isSvn) {
			document_doc=common_doc;
		}
		try{
			if(!(path_id==null||"".equals(path_id.trim()))){//普通文件上传
				List<Map<String, String>> list = sFilePathDao.queryPathTagByPathId(pmap);
				if(list!=null&&!list.isEmpty()){
					for(Map<String, String> map : list){
						String tag_type = map.get("TAG_TYPE");
						String pathPart;
						if("00".equals(tag_type)){
							
							if(map.get("TAG_PARAM")!=null&&"java.lang.String".equals(param.get(map.get("TAG_PARAM")).getClass().getName())){
								pathPart = (String)param.get(map.get("TAG_PARAM"));
							} else {	
								pathPart = ((String[])param.get(map.get("TAG_PARAM")))[0];
							}
							if (isSvn&&"SYSTEM_NAME".equals(map.get("TAG_PARAM"))) {
								document_doc=sFilePathDao.querySystemShortByName(pathPart)+"_DOC";
								pathPart="";
							}
						} else {
							pathPart = map.get("TAG_NAME");
						}
						if(!"".equals(pathPart)&&pathPart!=null) {
							realFilePath += "/" + pathPart;
						}
					}
				}
				if("true".equals(pmap.get("is_dic"))){
					if(param.get("DIC_NAME") instanceof String[]){
						realFilePath += "/" + ((String[])param.get("DIC_NAME"))[0];
					}else{
						realFilePath += "/" + param.get("DIC_NAME");
					}
				}
			}
			pmap.put("result", "true");
			if (isSvn) {
				realFilePath="/"+document_doc+realFilePath;
			}
			pmap.put("PATH_NAME", realFilePath);
		}catch(Exception e){
			e.printStackTrace();
			pmap.put("result", "false");
			pmap.put("msg", "获取文件路径失败");
		}
		pmap.put("DOCUMENT_DOC", document_doc);
		return pmap;
	}
	
	//根据（需求任务编号）获取相关系统及应用的参数
	public Map<String, String> getSystemNameAndVersionName(HttpServletRequest req) {
		Map<String, String> pmap=new HashMap<String, String>();
		String req_task_code = RequestUtils.getParamValueNulStr(req, "req_task_code");
		pmap.put("req_task_code", req_task_code);
		Map<String, String> resultMap = sFilePathDao.getSystemNameAndVersionName(pmap);
		resultMap.put("REQ_TASK_CODE", req_task_code);
		return resultMap;
	}
	
	//根据子需求编号获取相关系统及应用名称
	public Map<String, String> getSystemNameAndVersionNameBySubReq(HttpServletRequest req){
		Map<String, String> pmap=new HashMap<String, String>();
		String sub_req_code = RequestUtils.getParamValueNulStr(req, "sub_req_code");
		pmap.put("sub_req_code", sub_req_code);
		Map<String, String> resultMap = sFilePathDao.getSystemNameAndVersionNameBySubReq(pmap);
		return resultMap;
	}
	
}
