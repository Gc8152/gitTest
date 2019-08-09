package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface SConfigDao {
	/**
	 * 新增邮箱配置
	 * @param map
	 */
	public void updateEmail(Map<String, String> map); 
	/**
	 * 查询邮箱配置
	 * @return
	 */
	public List<Map<String,String>> findEmailInfo();
	//查询用户阀值信息
	public List<Map<String,String>> queryConUser();
	//修改当前用户阀值
	public void updateConUser(String map);
	//查询当前设定值
	public String queryUserNow();
	//查询session超时,用于配置超时时间
	public String queryMaxSessionActive();
	//查询session超时
	public List<Map<String,String>> queryConSession();
	//修改session超时
	public void updateConSession(String map);
	/**
	 * 查询邮箱配置 行转列
	 * @return
	 */
	public Map<String, String> findEmailInfoHtoC();
	/**
	 * 通过配置编码，查新配置参数信息
	 * 
	 * @param @param conf_code
	 * @param @return
	 * @return Map<String,String> 
	 * @throws 
	 */
	public Map<String, String> queryConByConfCode(String conf_code);
}
