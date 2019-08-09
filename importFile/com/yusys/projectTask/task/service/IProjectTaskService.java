package com.yusys.projectTask.task.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartFile;

public interface IProjectTaskService {

	/**
	 * 导入开发任务信息
	 */
	public Map<String,String> importProjectTask(HttpServletRequest req,String userid,MultipartFile file,int[]head_num, int []column_num);
	

}
