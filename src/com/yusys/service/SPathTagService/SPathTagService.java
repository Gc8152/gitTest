package com.yusys.service.SPathTagService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ccb.sys.util.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.dao.SPathTagDao;
import com.yusys.entity.SPathTag;
import com.yusys.service.SFilePathService.FilePathConstant;

@Service
@Transactional
public class SPathTagService implements ISPathTagService {
	
	@Resource
	private SPathTagDao sPathTagDao;
	@Resource
	private TaskDBUtil seq;
	//查询所有标签
	public List<SPathTag> queryListPathTag(HttpServletRequest req) {
		 return sPathTagDao.queryListPathTag();
	}

	//新增自定义标签
	public Map<String, String> addPathTag(HttpServletRequest req, String userId) {
		Map<String, String> resultMap=new HashMap<String, String>();
		Map<String, String> pmap=new HashMap<String, String>();
		try{
			String tag_name = RequestUtils.getParamValue(req, "tag_name");
			pmap.put("tag_name", tag_name);
			pmap.put("tag_id",seq.getSequenceValByName("S_SEQ_PATHTAGID"));
			pmap.put("flag","00");
			pmap.put("tag_type",FilePathConstant.C_TYPE);//01自定义标签
			pmap.put("opt_id",userId);
			pmap.put("opt_time",DateTimeUtils.getFormatCurrentDate());
			sPathTagDao.addPathTag(pmap);
			resultMap.put("msg", "保存成功");
			resultMap.put("result", "true");
		}catch(Exception e){
			resultMap.put("msg", "保存失败");
			resultMap.put("result", "false");
			e.printStackTrace();
		}
		return resultMap;
	}

	//删除自定义标签
	public Map<String, String> deletePathTag(HttpServletRequest req,
			String userId) {
		
		return null;
	}

	//查询当前路径有的标签
	public List<SPathTag> queryFilePathTag(HttpServletRequest req) {
		String[]must={"path_id"};
		Map<String, String>pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			return new ArrayList<SPathTag>();
		}else{
			return sPathTagDao.queryFilePathTag(pmap);
		}
	}

	//查询当前路径有的标签
	public List<SPathTag> queryFilePathNoTag(HttpServletRequest req) {
		String[]must={"path_id"};
		Map<String, String>pmap=RequestUtils.requestToMap(req, must, null);
		if (pmap==null) {
			return new ArrayList<SPathTag>();
		}else{
			return sPathTagDao.queryFilePathNoTag(pmap);
		}
	}

}
