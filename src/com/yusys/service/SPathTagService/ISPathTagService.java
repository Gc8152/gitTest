package com.yusys.service.SPathTagService;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import com.yusys.entity.SPathTag;

public interface ISPathTagService {
	//查询所有标签
	 public List<SPathTag> queryListPathTag(HttpServletRequest req);
	//新增自定义标签
	public Map<String,String> addPathTag(HttpServletRequest req,String userId);
	//删除自定义标签
	public Map<String,String> deletePathTag(HttpServletRequest req,String userId);
	//查询当前路径有的标签
	public List<SPathTag> queryFilePathTag(HttpServletRequest req);
	//查询当前路径没有的标签
	public List<SPathTag> queryFilePathNoTag(HttpServletRequest req);
}
