package com.yusys.dao;

import java.util.List;
import java.util.Map;
import com.yusys.entity.SPathTag;

public interface SPathTagDao {
	//查询所有标签
	public List<SPathTag> queryListPathTag();
	//新增自定义标签
	public void addPathTag(Map<String, String> map);
	//删除自定义标签
	public void deletePathTag(Map<String,  String> map);
	//根据标签ID查询
	public SPathTag queryOneTag(String tag_id);
	//查询当前路径有的标签
	public List<SPathTag> queryFilePathTag(Map<String, String> map);
	//查询当前路径没有的标签
	public List<SPathTag> queryFilePathNoTag(Map<String, String> map);
	//新增路径标签
	public void addFilePathTag(Map<String, String> map);
	//移除文件路径标签
	public void deleteFilePathTag(Map<String,  String> map);
}
