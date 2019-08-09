package com.yusys.service.SRemindService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface ISRemindService {
	/**
	 * 根据人员查询我的提醒
	 */
	public Map<String,Object> findMyRemindByUserid(HttpServletRequest req,String userid);
	/**
	 * 根据类型，人员删除我的提醒详情
	 */
	public Map<String,Object> deleteSubRemind(HttpServletRequest req,String userid);
	/**
	 * 根据类型减少提醒数
	 */
	//public Map<String,Object> updateRemindNum(HttpServletRequest req,String userid);
	/**
	 * 根据类型，人员查询我的提醒详情
	 */
	public Map<String,Object> querySubRemindByType(HttpServletRequest req,String userid);
	
}
