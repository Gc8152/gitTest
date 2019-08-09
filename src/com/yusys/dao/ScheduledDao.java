package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface ScheduledDao {
	/**
	 * 获取需要工作台信息的待反馈任务
	 * @param map
	 * @return
	 */
	List<Map<String, String>> getNeedWorkBenchInfoFBTask(Map<String, String> map);

	/**
	 * 获取需要工作台信息的待完成任务
	 * @param map
	 * @return
	 */
	List<Map<String, String>> getNeedWorkBenchInfoFSTask(Map<String, String> map);
	
	/**
	 * 获取需要工作台信息的到期未完成任务
	 * @param map
	 * @return
	 */
	List<Map<String, String>> getWorkBenchInfoNoFSTask(Map<String, String> map);
}
