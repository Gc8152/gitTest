package com.yusys.service.SWorkTime;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yusys.entity.WorkTimePO;

/**
 * @author :yuanqt
 * @date：2017年3月5日
 * @describe:
 */

public interface IWorkTimeService {

	// 创建工作时间配置信息
	public  Map<String,String> insert(HttpServletRequest req,
			String actorno);

	// 查询单条工作时间配置信息
	public WorkTimePO queryOne(HttpServletRequest req,
			String actorno);
}
