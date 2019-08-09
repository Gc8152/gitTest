package com.yusys.service.SRoleService;

import com.yusys.entity.SRole;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 15-11-3
 * Time: 下午4:22
 * To change this template use File | Settings | File Templates.
 */
public interface ISRoleService  {

    public List<SRole> querySRoleListByActorNo(HttpServletRequest req,String userid);
    //查询单个记录
    public SRole findSRoleById(HttpServletRequest req,String userid);
    //新增
    public Map<String, String> saveSRole(HttpServletRequest req,String userid);
    //修改
    public Map<String, String> updateSRole(HttpServletRequest req,String userid);
    //删除    
    public Map<String, String> deleteSRole(HttpServletRequest req,String userid);
    //查询全部
    public Map<String, Object> findSRoleInfoAll(HttpServletRequest req,String userid);
    //角色菜单配置
    public Map<String, String> SRoleMenuDis(HttpServletRequest req,String userid);
    //角色操作配置
    public Map<String, String> sRoleOperDis(HttpServletRequest req,String userid);
    //角色数据权限
    public Map<String, String> sRoleDataAuth(HttpServletRequest req,String userid);
    //角色字段权限
    public Map<String, String> sRoleFieldAuth(HttpServletRequest req,String userid);
    //选中菜单树复选框
    public List<Map<String,String>> treeMenuChecked(HttpServletRequest req);
    //角色操作配置 复选框选中
    public List<Map<String,String>> oprDisChecked(HttpServletRequest req);
    //角色数据权限复选框选中
    public List<Map<String,String>> dataAuthChecked(HttpServletRequest req);
    //角色字段权限复选框被选中
    public List<Map<String,String>> filedAuthChecked(HttpServletRequest req);
	//根据用户编码查询出该用户的所有角色    
	public Map<String, Object>  findAllRoleById(HttpServletRequest req,String userid);
    /**
     * 查询用户当前的角色
     * @param actorno
     * @return
     */
    public List<SRole> queryUserRole(HttpServletRequest req,String userid);
    /**
     * 查询用户当前没有的角色
     * @param actorno
     * @return
     */
    public List<SRole> queryUserNoRole(HttpServletRequest req,String userid);
    
    /**
     * 添加用户角色
     * @param map
     */
    public  Map<String, String> addUserRole(HttpServletRequest req,String userid);
    	
    /**
     * 移除用户角色
     * @param map
     */
    public  Map<String, String> rmUserRole(HttpServletRequest req,String userid);
	//查询角色
	Map<String,Object> querySrole(HttpServletRequest req);
	//查询所有常用功能
	public Map<String,Object> queryAllFunctionById(HttpServletRequest req,String userid);
	//删除常用功能
	public Map<String,String> delFunctionByMenuCode(HttpServletRequest req,String userid);
	//查询其他所有常用功能菜单信息
	public Map<String,Object> queryOtherFunction(HttpServletRequest req,String userid);
	//插入常用功能
	 public  Map<String, String> addFunction(HttpServletRequest req,String userid);
	//查询所有关联人员
	public Map<String,Object> queryAllRelateUser(HttpServletRequest req,String userid);
	//移除用户指定机构的角色
	public  Map<String, String>  deleteUserOrgRole(HttpServletRequest req, String userId);
	

}
