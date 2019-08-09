package com.yusys.projectTask.task.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.ImportExcel;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.projectTask.task.dao.ProjectTaskDao;

@Service
@Transactional
public class ProjectTaskService extends ImportExcel implements IProjectTaskService{

	
	private static final Logger logger = Logger.getLogger(ProjectTaskService.class);
	@Resource
	private TaskDBUtil taskDBUtil;
	
	@Resource
	private ProjectTaskDao projectTaskDao;
	
	
	@Override
	public Map<String, String> importProjectTask(HttpServletRequest req,String userid,MultipartFile file, int[] head_num, int[] column_num) {
		
		//TODO
		//在这里查询数据库是否存在
		String[] nomust = new String[]{"REQ_TASK_ID","TASK_NAME","TYPE","P_TASK_ID","TASK_TYPE","PROJECT_ID","TASK_STATE","TASK_DESC","TASK_LEVEL","EXECUTOR","PLAN_STARTTIME",
				"PLAN_ENDTIME","ACTUAL_STARTTIME","ACTUAL_ENDTIME","DELAY_REASON","CREATOR","CREATE_TIME",
				"UPDATE_PERSON","UPDATE_TIME"};
		
		Map<String, String> pmap=RequestUtils.requestToMap(req, null, nomust);
		return importExcel(file, userid, head_num, column_num, pmap);
	}
	
	/**
	 * 保存行数据
	 * @param userid
	 * @param rowData
	 * @return 大于0保存成功小于或者等于0保存失败
	 */
	public String saveRowData(String userid,List<String> rowData,int numSheet,Map<String,String> pmap ){
		boolean row_empty=true;
		for (int i = 0; i < rowData.size(); i++) {
			if(rowData.get(i).trim().length()!=0){
				row_empty=false;
				break;
			}
		}
		StringBuilder msg=new StringBuilder();
		if(!row_empty){//处理和判断不为空的行数据
			String task_name=rowData.get(1);			
			String task_level=rowData.get(2);
			String task_type=rowData.get(3);
			String executor=rowData.get(4);
			String executor_name=rowData.get(5);
			String plan_startTime=rowData.get(6);
			String plan_endTime=rowData.get(7);
			String task_desc=rowData.get(8);
			
			//任务优先级和任务类型判断

			if (task_name.trim().length()==0){
				msg.append("任务名称不能为空!");
			}
			if (task_type.trim().length()==0) {
				msg.append("开发任务类型不能为空!");
			}/*else if((task_type=taskDBUtil.findDicItemCode("P_DIC_RISK_TYPE1", task_type.trim()))==null){
				msg.append("开发任务类型不不正确!");
			}*/
			if (task_level.trim().length()==0) {
				msg.append("任务优先级不能为空!");
			}else if((task_level=taskDBUtil.findDicItemCode("G_DIC_REQUIREMENT_LEVEL", task_level.trim()))==null){
				msg.append("任务优先级不不正确!");
			}
			if (plan_startTime.trim().length()==0){
				msg.append("计划开始时间不能为空!");
			}
			if (plan_endTime.trim().length()==0){
				msg.append("计划结束时间不能为空!");
			}
			if (task_desc.trim().length()==0){
				msg.append("任务描述不能为空!");
			}
			Map<String,String> map = new HashMap<String,String>();
			
			if(executor.trim().length()==0){
				msg.append("执行人不能为空!");
			}else{				
				map.put("user_no", executor.split("\\.")[0]);
				List<Map<String,String>> list = projectTaskDao.queryUsrForName(map);
				if(list.size()>0){
					pmap.put("EXECUTOR", list.get(0).get("USER_NO"));
				}else{
					msg.append("执行人不存在！");
				}
			}
			
			if(msg.toString().trim().length()==0){

					String task_id = taskDBUtil.getSequenceValByName("P_SEQ_PROJECT_TASK_ID");	
					pmap.put("P_TASK_ID", task_id);
					pmap.put("CREATE_TIME",DateTimeUtils.getFormatCurrentTime());
					pmap.put("CREATOR", userid);									
					pmap.put("TASK_NAME", task_name);
					pmap.put("TASK_LEVEL", task_level);
					pmap.put("TASK_TYPE", "01");//01为开发任务
					pmap.put("PLAN_STARTTIME", plan_startTime);
					pmap.put("TASK_STATE", "02");//02为已发布状态
					pmap.put("PLAN_ENDTIME", plan_endTime);
					pmap.put("TASK_DESC", task_desc);
					try {
						projectTaskDao.addTask(pmap);
					} catch (Exception e) {
						logger.info("操作 projectTaskManagerDao.addTask 出错 uri为 --->>>" +"错误信息为："+e);
						e.printStackTrace();
					}
			}
		}
		return msg.toString();
	}
	
}
