package com.yusys.dao;

import java.util.List;
import java.util.Map;


public interface SUtilDao {
	/**
	 * 根据机构名称查询机构编号
	 * @param org_name
	 * @return
	 */
	public String findOrgCodeByName(String org_name);
	/**
	 * 根据年月日获取 假期配置
	 * @param date
	 * @return
	 */
	Map<String, String> getCfgHoliDayByDate(String date);
	
	/**
	 * 根据参数获取序列
	 * @param name
	 * @return
	 */
	public String findSenqunceByName(Map<String, String> map);
	
	/**
	 * 根据多个id查询用户集合
	 * @param list
	 * @return
	 */
	public List<Map<String, String>> queryUsersByIds(List<String> list);
	/**
	 * 增加消息提醒
	 * @param map
	 */
	public void createWorkbenchRemind(Map<String, String> map); 
	/**
	 * 查询一个任务信息
	 * @param task_id
	 * @return
	 */
	public Map<String, String> utilFindOneTaskById(String task_id);
	/**
	 * 删除任务提醒
	 * @param map
	 */
	public void utilDeleteTaskRemind(Map<String, String> map);
	/**
	 * 修改工作台接收人
	 * @param map
	 */
	public void updateWorkBenchSendPerson(Map<String, String> map);
	/**
	 *  查询字典编码
	 * @param map
	 * @return
	 */
	public String findDicItemCode(Map<String, String> map);
}
