package com.yusys.Utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import com.yusys.dao.SOrgDao;
import com.yusys.dao.SRoleDao;
import com.yusys.dao.SUtilDao;
import com.yusys.service.SPermissionService.ISPermissionService;

@Service
@Transactional
public class TaskDBUtil {
	/**
	 * spring容器
	 */
	private static WebApplicationContext wac;
	/**
	 * 获取spring 的 web容器
	 * 
	 * @return
	 */
	public static synchronized WebApplicationContext getWebContext() {
		if (wac == null) {
			wac = ContextLoader.getCurrentWebApplicationContext();
		}
		return wac;
	}
	
	 @Resource
	 private SUtilDao utilDao;
	 @Resource
	 private SRoleDao sRoleDao;
	 @Resource
	 private SOrgDao sOrgDao;
	 @Resource
	 private ISPermissionService ispermissionservice;
	 /**
	  * 增加用户角色并生成权限
	  * @param user_no
	  * @param role_no
	  * @param org_no
	  */
	 public void userAddRoleToPermiss(String user_no,String role_no,String org_no){
		//给新用户添加  普通用户的角色 
		 	userAddRole(user_no,role_no,org_no);
			try {
				ispermissionservice.startCreatePermiss(user_no, "0");
			} catch (Exception e) {
				e.printStackTrace();
			}
	}
	 /**
	  * 查询 机构编号
	  * @param org_name
	  * @return
	  */
	 public String findOrgCodeByName(String org_name){
		 return utilDao.findOrgCodeByName(org_name);
	 }
	 /**
	  * 查询角色信息
	  * @param role_no
	  * @param user_no
	  * @param org_code
	  * @return
	  */
	public List<Map<String, String>> findSRoleByUserRole(String role_no,String user_no,String org_code){
		Map<String, String> map=new HashMap<String, String>();
		map.put("role_no", role_no);
		map.put("user_no", user_no);
		map.put("org_code", org_code);
		return sRoleDao.findSRoleByUserRole(map);
	}
	/**
	 * 删除用户角色
	 * @param user_no
	 * @param org_code
	 * @param role_code
	 */
	public void deleteUserManagerRole(String user_no,String org_code,String role_code){
		Map<String, Object> map=new HashMap<String, Object>();
		map.put("org_code", org_code);
		if (role_code!=null) {
			String[] roles=role_code.split(",");
			map.put("roles", roles);
		}
		map.put("userid", user_no);
		sOrgDao.deleteUserManagerRole(map);
	}
	/**
	 * 给用户增加角色信息
	 * @param user_no
	 * @param role_no
	 * @param org_no
	 */
	 public void userAddRole(String user_no,String role_no,String org_no){
		 List<Map<String, String>> lmaps=findSRoleByUserRole(role_no, user_no, org_no);
		 if (lmaps==null||lmaps.size()==0) {
			 //给新用户添加  普通用户的角色 
			 Map<String,String> roleRequirement  = new HashMap<String,String>();
			 roleRequirement.put("user_no", user_no);
			 roleRequirement.put("role_no",role_no);
			 roleRequirement.put("org_code", org_no);
			 roleRequirement.put("state", "00");
			 roleRequirement.put("opt_no", "0");
			 roleRequirement.put("opt_time", DateTimeUtils.getFormatCurrentTime());
			 sRoleDao.addUserRole(roleRequirement);
		}
	 }
	 public void userRemoveRole(String user_no,String role_no,String org_no){
			//给新用户添加  普通用户的角色 
				Map<String,String> roleRequirement  = new HashMap<String,String>();
				roleRequirement.put("user_no", user_no);
				roleRequirement.put("role_no",role_no);
				roleRequirement.put("org_code", org_no);
				roleRequirement.put("state", "00");
				roleRequirement.put("opt_no", "0");
				roleRequirement.put("opt_time", DateTimeUtils.getFormatCurrentTime());
				sRoleDao.addUserRole(roleRequirement);
				try {
					ispermissionservice.startCreatePermiss(user_no, "0");
				} catch (Exception e) {
					e.printStackTrace();
				}
		}
	/**
	 * 获取序列的值
	 * @param seqName
	 * @return
	 */
	public  String getSequenceValByName(String seqName){
		Map<String, String> mseq=new HashMap<String, String>();
		mseq.put("name", seqName);
		return utilDao.findSenqunceByName(mseq);
	}
	/**
	 * 获取用户的名称
	 * @return
	 */
	public String getUserNames(List<String> list){
		List<Map<String, String>> lmap=getUsers(list);
		StringBuilder sb=new StringBuilder();
		if (lmap!=null&&lmap.size()>0) {
			sb.append(lmap.get(0).get("USER_NAME"));
			for (int i = 1; i < lmap.size(); i++) {
				sb.append(","+lmap.get(i).get("USER_NAME"));
			}
		}
		return sb.toString();
	}
	/**
	 * 获取用户的名称
	 * @return
	 */
	public String getUserNames(String[] ars){
		List<String> list=new ArrayList<String>();
		Collections.addAll(list, ars);
		return getUserNames(list);
	}
	/**
	 * 获取多个用户
	 * @param list
	 * @return
	 */
	public List<Map<String, String>> getUsers(List<String> list){
		return utilDao.queryUsersByIds(list);
	}
	
	/**
	 * 增加任务提醒信息
	 * @param wid[任务拒绝=7,任务被取消=8,任务已完成=9,任务有反馈=10,任务有变更=12,任务到期未完成=13,任务完成被打回=14,任务已评价=15]
	 *  wid[任务待接收=2,任务待反馈=3,任务待审批=4,待完成任务=5,待评价任务=11]
	 * @param taskid
	 * @param task_name
	 * @param send_person
	 */
	public void addTaskRemindInfo(String wid,String taskid,String task_name,String send_person){
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("task_id", taskid);
		if("8".equals(wid)||"14".equals(wid)||"15".equals(wid)||"11".equals(wid)){//任务取消 任务完成被打回  任务已评价  删除任务对应其他的工作台代办
			utilDao.utilDeleteTaskRemind(pmap);
		}
		pmap.put("id", getSequenceValByName("T_SEQ_WORKBENCHID"));
		pmap.put("w_id", wid);
		pmap.put("req_name", task_name);
		pmap.put("flag", "0");
		/*if(!("8".equals(wid)||"14".equals(wid)||"15".equals(wid)||"11".equals(wid))){//非 任务取消 任务完成被打回  任务已评价  删除任务和代表类型对应的其他的工作台代办
			utilDao.utilDeleteTaskRemind(pmap);
		}*/
		pmap.put("send_person", send_person);
		pmap.put("send_time",DateTimeUtils.getFormatCurrentTime());
		utilDao.utilDeleteTaskRemind(pmap);
		utilDao.createWorkbenchRemind(pmap);
	}
	/**
	 * 增加任务提醒信息
	 * @param wid[任务拒绝=7,任务被取消=8,任务已完成=9,任务有反馈=10,任务有变更=12,任务到期未完成=13,任务完成被打回=14,任务已评价=15]
	 *  wid[任务待接收=2,任务待反馈=3,任务待审批=4,待完成任务=5,待评价任务=11]
	 * @param taskid
	 */
	public void addTaskRemindInfo(String wid,String taskid){
		Map<String, String> map=utilDao.utilFindOneTaskById(taskid);
		if ("03".equals(map.get("TASK_TYPE"))&&"2".equals(wid)) {//协同任务传代接收 自动转成受理中
			wid="4";
		}
		if ("01".equals(map.get("TASK_STATE"))) {
			wid="2";
		}
		if (map!=null&&map.size()>0) {
			if("8".equals(wid)||"12".equals(wid)||"14".equals(wid)||"15".equals(wid)
					||"2".equals(wid)||"3".equals(wid)||"4".equals(wid)||"5".equals(wid)){//任务取消给执行人或者协同人发送一个提醒
				String qxperson="";
				if ("03".equals(map.get("TASK_TYPE"))) {//如果协同任务去协同人
					qxperson=map.get("TASK_COORDINATOR");
				}else{//其他任务 取 执行人
					qxperson=map.get("TASK_EXECUTOR");
				}
				addTaskRemindInfo(wid,taskid,map.get("TASK_NAME"),qxperson);
			}else if("7".equals(wid)||"9".equals(wid)||"10".equals(wid)||"13".equals(wid)||"11".equals(wid)){//任务拒绝、任务完成、任务反馈、任务到期未完成 给创建人发送一个提醒
				addTaskRemindInfo(wid,taskid,map.get("TASK_NAME"),map.get("TASK_CREATOR"));
			}
		}
	}
	
	/**
	 * 任务待办数据 处理完成之后 删除
	 * @param wid[任务待接收=2,任务待反馈=3,任务待审批=4,待完成任务=5,待评价任务=11]
	 * @param taskid
	 * @param send_person
	 */
	public void removeTaskRemindInfo(String wid,String taskid,String send_person){
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("w_id", wid);
		pmap.put("task_id", taskid);
		pmap.put("send_person", send_person);
		utilDao.utilDeleteTaskRemind(pmap);
	}
	/**
	 * 修改工作台接收人
	 * @param taskid
	 * @param send_person
	 * @param old_send_person
	 */
	public void updateWorkBenchSendPerson(String taskid,String send_person,String old_send_person){
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("task_id", taskid);
		pmap.put("send_person", send_person);
		pmap.put("old_send_person", old_send_person);
		pmap.put("send_time", DateTimeUtils.getFormatCurrentTime());
		utilDao.updateWorkBenchSendPerson(pmap);
	}
	/**
	 * 根据年月日获取 假期配置
	 * @param date
	 * @return
	 */
	public Map<String, String> getCfgHoliDayByDate(String date){
		return utilDao.getCfgHoliDayByDate(date);
	}
	
	public static String getUUID(){
		UUID uuid = UUID.randomUUID();
        return uuid.toString().replace("-", "");
	}
	/**
	 *根据字典类别和字典值 查询字典编码
	 * @param dic_code
	 * @param item_name
	 * @return
	 */
	public String findDicItemCode(String dic_code,String item_name){
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("dic_code", dic_code);pmap.put("item_name", item_name.trim());
		return utilDao.findDicItemCode(pmap);
	}
}
