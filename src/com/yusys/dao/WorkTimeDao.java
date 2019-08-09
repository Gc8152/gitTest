package com.yusys.dao;

import java.util.Map;

import com.yusys.entity.WorkTimePO;

/**
 * @author :yuanqt
 * @date：2017年3月5日
 * @describe:
 */

public interface WorkTimeDao {

	// 创建工作时间配置信息
	public void insert11111(Map<String, String> map);

	// 查询单条工作时间配置信息
	public WorkTimePO queryOne(Map<String, String> pmap);

	// 修改工作时间配置信息
	public void update(Map<String, String> map);
}
