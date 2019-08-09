package com.yusys.resources.optPersonCheck.dao;
import java.util.List;
import java.util.Map;
public interface OptCheckDao {
	
	/**
	 * 根据身份证号查询外包人员信息 
	 * @param op_id
	 * @return
	 */
	public Map<String, String> queryOutPersonInfoByCardNo(Map<String,String> map);
	
	/**
	 * 插入外包人员考核信息
	 * @param pmap
	 */
	public void insertOptCheckInfo(Map<String, String> pmap);
	/**
	 * 检查考核是否存在
	 * @param pmap
	 * @return
	 */
	public List<Map<String, String>> findCheckIsRepeat(Map<String, String> pmap);	
	//修改行员考核信息
	public void optCheckUpdate(Map<String, String> pmap);	
}