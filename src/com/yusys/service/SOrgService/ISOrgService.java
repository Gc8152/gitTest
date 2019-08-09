package com.yusys.service.SOrgService;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.yusys.entity.SOrg;

public interface ISOrgService{
	//查询树形结构列表
	public List<Map<String, String>> queryOrgTreeList(HttpServletRequest req,String userid);
	//查询树状结构列表不包含中心
	public List<Map<String, String>> queryOrgTreeWithCenterList(HttpServletRequest req,String userid);
	//添加部门
	public Map<String, String> insertNewOrg(HttpServletRequest req,String actorno);
	//通过序号查找部门详细信息
	public SOrg findOrgByOrgNo(HttpServletRequest req,String actorno);
	//保存部门修改信息
	public Map<String, String> updatePayDate(HttpServletRequest req,String actorno);
	//删除(修改标记位)
	public Map<String, String> delete(HttpServletRequest req,String actorno);
	//根据用户编码查询出该用户的所有机构 
	public Map<String, Object>  findAllOrgById(HttpServletRequest req,String userid);
	//系统启用状态修改
	public Map<String, String> updateSysEnableFlag(HttpServletRequest req,String actorno);
	
	//机构下创建岗位
	public Map<String, String> insertOrgPosition(HttpServletRequest req,String actorno);
	//修改岗位
	public Map<String, String> updateOrgPosition(HttpServletRequest req,String actorno);
	//删除岗位
	public Map<String, String> updateOrgPositionFlag(HttpServletRequest req,String actorno);
	//查询一条岗位信息
	//public Map<String, String> queryOneOrgPosition(HttpServletRequest req,String actorno);
	//查询机构下岗位
	public Map<String, Object> queryOrgPosition(HttpServletRequest req,String actorno);
	//查询机构
	public List<Map<String, String>> queryOrgTreeDeptList(HttpServletRequest req, String userId);
	//查询末级机构
	public List<Map<String, String>> queryOrgTreeOfficesList(HttpServletRequest req, String userId);
	//查询末级机构
	public List<Map<String, String>> queryOrgTreePostList(HttpServletRequest req, String userId);
	//查询机构下所有用户信息
	public Map<String, Object> queryUserPosition(HttpServletRequest req, String userId);
}
