package com.yusys.dao;

import java.util.List;
import java.util.Map;

import com.yusys.entity.GuanChong;
import com.yusys.entity.SRole;

public interface GuanChongDao {
	//添加需求
   public void insertRequirements(Map<String, String> map);
   //显示需求列表
   public List<Map<String, String>> queryAllUser(Map<String, String> map);
   	//修改需求
   public void updateRequirements(Map<String, String> map);
   
   //删除需求
   public void deleteRequirement(Map<String, Object> map);
   //添加紧急需求
   
}