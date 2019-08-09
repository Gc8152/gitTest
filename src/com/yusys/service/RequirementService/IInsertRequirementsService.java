package com.yusys.service.RequirementService;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.yusys.entity.GuanChong;
import com.yusys.entity.SRole;

public interface IInsertRequirementsService {
	//插入需求基本信息
	public Map<String, String> insertRequirementInfo(HttpServletRequest req);
	
	//修改需求
	public Map<String, String> updateRequirementsInfo(HttpServletRequest req);
	//查询
	public Map<String, Object> queryAllUser(HttpServletRequest req);
	
	public Map<String,String> deleteRequirement(HttpServletRequest req);
}
