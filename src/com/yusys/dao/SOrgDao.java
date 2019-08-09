package com.yusys.dao;

import java.util.List;
import java.util.Map;

import com.yusys.entity.SOrg;

public interface SOrgDao {
	//查询树状结构
	public List<Map<String, String>> queryOrgTreeList(String param);
	//查询上一级树形结构
	public List<Map<String, String>> queryOrgTreeDeptList(String param);
	//查询末级树形结构
	public List<Map<String, String>> queryOrgTreeOfficesList(String it);
	//创建机构
	public void insertNewOrg(Map<String, String> map);
	//通过序号查询详细信息
	public SOrg findOrgByOrgNo(String org_code);
	//保存部门修改信息
	public void updateOrg(Map<String, String> map);
	//删除(修改标记位)
	public void deleteOrgInfo(Map<String, String> map);
	//根据用户编码查询出该用户的所有角色	
    public List<Map<String, String>> findAllOrgById(Map<String, String> map);
    //查询所有机构
    public List<Map<String, String>> findAllOrg(Map<String, String> map);
    //系统启用状态修改
  	public void updateSysEnableFlag(Map<String, String> map);
  	/**
  	 * 查询用户是否为部门领导
  	 * @param task_id
  	 * @return
  	 */
  	public List<Map<String, String>> queryUserIsOrgManager(String userid);
  	/**
  	 * 删除用户 部门经理的角色
  	 * @param userid
  	 */
  	public void deleteUserManagerRole(Map<String, Object> map);
  	
  	public void openOrDeptEnable(Map<String, String> map);
  	
  	public Map<String, String> checkChildOrg(Map<String, String> map);
  	
  	//机构下创建岗位
  	public void insertOrgPosition(Map<String, String> map);
  	//修改岗位信息
  	public void updateOrgPosition(Map<String, String> map);
    //删除岗位修改标记
  	public void updateOrgPositionFlag(Map<String, String> map);
  	//查询一个岗位信息
  	public Map<String, String> queryOneOrgPosition(Map<String, String> map);
  	//查询机构下岗位
  	public List<Map<String, String>> queryOrgPosition(Map<String, String> map);
  	//查询机构下岗位--tree
	public List<Map<String, String>> queryOrgTreePostList(String it);
	//查询机构下用户信息
  	public List<Map<String, String>> queryUserPosition(Map<String, String> map);
	
}
