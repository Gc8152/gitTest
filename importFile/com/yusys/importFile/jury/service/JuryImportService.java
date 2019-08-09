/**
 * @author huangyingkui
 *
 */
package com.yusys.importFile.jury.service;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.AbstractMultipartHttpServletRequest;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.ImportExcel;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.entity.SUser;
import com.yusys.importFile.jury.dao.JuryImportDao;
import com.yusys.service.SFileInfoService.ISFileInfoService;
@Service
@Transactional
public class JuryImportService extends ImportExcel implements IJuryImportService{
	private static final Logger logger = Logger.getLogger(JuryImportService.class);
	
	@Resource
	private JuryImportDao juryImportDao;
	@Resource
	private ISFileInfoService fileInfoService;
	
	@Resource
	private TaskDBUtil taskDBUtil;
	/**
	 * 导入数据
	 */
	
	public Map<String, String> importPhaseFile(HttpServletRequest req,String userid,MultipartFile file,int []head_num,int []column_num) {
		String[] nomust=new String[]{"system_id","system_name","req_task_state","req_task_code","sub_req_id","req_code","jury_phased","sub_req_name"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, null, nomust);
		String sub_req_name=pmap.get("sub_req_name");
		if(sub_req_name!=null&&!"".equals(sub_req_name)){
			try {
				sub_req_name=URLDecoder.decode(sub_req_name,"UTF-8");
				pmap.remove("sub_req_name");
				pmap.put("sub_req_name", sub_req_name);
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		String system_name=pmap.get("system_name");
		if(system_name!=null&&!"".equals(system_name)){
			try {
				system_name=URLDecoder.decode(system_name,"UTF-8");
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		pmap.put("userid", userid);
		String file_id=TaskDBUtil.getUUID();
		pmap.put("file_id", file_id);
		Map<String, String> smap=importExcel(file, userid, head_num, column_num,pmap);
		SUser user=(SUser)req.getSession(false).getAttribute("userinfo");
		MultiValueMap multiValueMap = ((AbstractMultipartHttpServletRequest)req).getMultiFileMap(); 
		Map<String, String> pmap1=new HashMap<String, String>();
		pmap1.put("FILE_TYPE", "05");
		pmap1.put("FILE_ID", file_id);//**
		pmap1.put("BUSINESS_CODE", pmap.get("req_task_code"));
		pmap1.put("MODULE_FLAG", "S_DIC_REQ_ANL_FILE");
		pmap1.put("PHASE", "03");
		pmap1.put("PATH_ID", "GZ1056");
		pmap1.put("is_dic", "true");
		Map<String, Object> param=new HashMap<String, Object>();
		param.putAll(pmap1);
		param.put("SYSTEM_NAME", system_name);
		param.put("REQ_CODE", pmap.get("req_code"));
		param.put("DIC_NAME", "需求分析说明书");
		fileInfoService.uploadFTPFile(param, user, pmap1, multiValueMap);
		return smap;
	}
	/**
	 * 保存excel表单数据
	 * @param userid
	 * @param rowData
	 * @return 大于0保存成功小于或者等于0保存失败
	 */
	public String saveFormData(String userid,List<List<String>> rowsData,int numSheet,Map<String,String> pmap){
		if (numSheet==0) {
			return importExcelSheetOne(userid,rowsData,pmap);
		}
		return null;
	}
	
	private String importExcelSheetOne(String userid,List<List<String>> rowsData,Map<String,String> map){
		//Map<String, String> map=new HashMap<String, String>();
		//{sub_req_id=270, system_id=16, req_task_state=03}
		
		String sponsor_time=rowsData.get(0).get(2);//评审申请日期(发起时间)
		if (sponsor_time==null||sponsor_time.trim().length()==0) {
			return "评审申请日期不能为空";
		}
		map.put("sponsor_time", sponsor_time);
		//JURY_STATUS
		String at_jury_grade=rowsData.get(0).get(6);//评审级别
		if (at_jury_grade==null||at_jury_grade.trim().length()==0) {
			return "评审等级不能为空";
		}
		
		String process = ""; 
		if("03".equals(map.get("req_task_state"))){
			process = "需求分析";
		}else if("05".equals(map.get("req_task_state"))){
			process = "开发设计";
		}else if("09001".equals(map.get("req_task_state"))){
			process = "测试案例";
		}
		map.put("jury_name", map.get("sub_req_name")+"_"+process+"_"+at_jury_grade);
		
		at_jury_grade = "一级评审".equals(at_jury_grade)?"01":"02";
		map.put("at_jury_grade", at_jury_grade);
		
			
		//测试要查找对应评审负责人id
		String jury_principal_id=rowsData.get(1).get(2);//评审负责人
		if (jury_principal_id==null||jury_principal_id.trim().length()==0) {
			return "评审负责人不能为空";
		}
		map.put("user_name", jury_principal_id);
		List<Map<String,String>> list = juryImportDao.queryUsrForName(map);
		if(list!=null&&list.size()>0){
			map.put("jury_principal_id", list.get(0).get("USER_NO"));
			map.put("compere_id", list.get(0).get("USER_NO"));//主持人
		}else{
			return "评审负责人:"+jury_principal_id+"不存在";
		}
		String end_time=rowsData.get(1).get(6);//评审日期（结束日期）
		if (end_time==null||end_time.trim().length()==0) {
			return "评审日期不能为空";
		}
		map.put("end_time", end_time);
		
//拆分统计  -----------------start 添加评委人员
		String jury_person=rowsData.get(2).get(2);//评委名单
		if (jury_person==null||jury_person.trim().length()==0) {
			return "评委名单不能为空";
		}
		
		String[] juryPersonList = jury_person.split(",");
		List<Map<String,String>> allMap = new ArrayList<Map<String,String>>();
		for(int i=0;i<juryPersonList.length;i++){//评委
			Map<String,String> person = new HashMap<String, String>();
			person.put("user_name", juryPersonList[i]);
			List<Map<String,String>> list1 = juryImportDao.queryUsrForName(person);
			if(list1!=null&&list1.size()>0){
				
				//map.put("jury_principal_id", list1.get(0).get("USER_NO"));
				Map<String,String> map1 = new HashMap<String, String>();
				map1.put("reviewer_user_id", list1.get(0).get("USER_NO"));
				map1.put("jury_role", "01");
				map1.put("jury_grade", at_jury_grade);//评审级别
				map1.put("is_finish_jury", "00");
				map1.put("finish_time", DateTimeUtils.getFormatCurrentDate());
				allMap.add(map1);
				
			}else{
				return "评委:"+juryPersonList[i]+"不存在";
			}
		}
		String jury_man=rowsData.get(3).get(2);//列席人
		String[] juryManList = jury_man.split(",");
		for(int i=0;i<juryManList.length;i++){//评委
			boolean flag = true;
			for(int k=0;k<juryPersonList.length;k++){//列席人
				if(juryPersonList[k].equals(juryManList[i])){//如果评委和列席人不相同，则插入
					flag = false;
					break;
				}
			}
			if(flag){
				Map<String,String> person = new HashMap<String, String>();
				person.put("user_name", juryManList[i]);
				List<Map<String,String>> list1 = juryImportDao.queryUsrForName(person);
				if(list1!=null&&list1.size()>0){
					//map.put("jury_principal_id", list1.get(0).get("USER_NO"));
					
					Map<String,String> map1 = new HashMap<String, String>();
					map1.put("reviewer_user_id", list1.get(0).get("USER_NO"));
					map1.put("jury_role", "02");
					map1.put("jury_grade", at_jury_grade);//评审级别
					map1.put("is_finish_jury", "00");
					map1.put("finish_time", DateTimeUtils.getFormatCurrentDate());
					allMap.add(map1);
				}else{
					return "列席人:"+juryManList[i]+"不存在";
				}
			}
		}
			
		/*************将评委和列席人两数组拼在一起****************/
		/*String[] a3 = new String[juryPersonList.length + juryManList.length];
		  System.arraycopy(juryPersonList, 0, a3, 0, juryPersonList.length);
		  System.arraycopy(juryManList, 0, a3, juryPersonList.length, juryManList.length);
		  if(!checkRepeat(a3)){
			  return "评委人名单和列席人名单有重复，请检查";
		  }*/
///-------------end 结束添加评委		
		
		
		String jury_result=rowsData.get(4).get(2);//评审结论不能为空
		if (jury_result==null||jury_result.trim().length()==0) {
			return "评审结论不能为空";
		}
		jury_result = "通过".equals(jury_result)?"01":"02";
		String jury_phased = map.get("jury_phased");
		if("01".equals(at_jury_grade)){
			if("02".equals(jury_phased)||"04".equals(jury_phased)||"06".equals(jury_phased)){
				return "当前任务只能导入二级评审记录";
			}
		}
		
		//查找字典取值
		map.put("jury_result", jury_result);
		
		String jury_desc=rowsData.get(5).get(2);//评审结论不能为空
		map.put("jury_desc", jury_desc);
		
		
		map.put("sponsor_id", userid);//发起人
		map.put("jury_type", "02");//评审方式，会议评审
		map.put("feedback_time", DateTimeUtils.getFormatCurrentDate());//反馈时间：：默认当天
		map.put("jury_status", "07");//评审完成
		String jury_id = taskDBUtil.getSequenceValByName("G_SEQ_JURY_INFO_ID");
		map.put("jury_id", jury_id);
		try {
			
			juryImportDao.insertJuryInfo(map);		//添加评审记录表
			
			//String jury_task_id = taskDBUtil.getSequenceValByName("G_SEQ_JURY_TASK_ID");
			//map.put("jury_task_id", jury_task_id);
			map.put("jury_status", jury_result);	//评审结论
			map.put("jury_grade", at_jury_grade);	//评审级别
			map.put("add_time", DateTimeUtils.getFormatCurrentDate());
			juryImportDao.deleteJuryTask(map);
			juryImportDao.insertJuryTask(map);
			
			//JURY_TASK_ID,TASK_ID,JURY_ID,REQ_TASK_STATE,JURY_GRADE,JURY_STATUS,ADD_TIME
			
			for(int i=0;i<allMap.size();i++){
				Map<String,String> personMap = allMap.get(i);
				personMap.put("jury_id", jury_id);
				juryImportDao.insertJuryUser(personMap);
			}
			
			//String jury_e=rowsData.get(8).get(1);//评审结论不能为空
			//sponsor_time,at_jury_grade,end_time,jury_result,jury_desc,system_id,sponsor_id,jury_type,feedback_time,jury_status;		  improve_desc
			String[]columns=new String[]{"","defect_name","defect_question_solve","","","sponsor_user_id","dispose_time","check_user_id","improve_desc"};
			String[]columns_name=new String[]{"","问题","问题及解决方案描述","","","责任人","要求整改完成时间","验证人","改进要求"};
			Map<String, String> pmap=new HashMap<String, String>();
			for (int i = 8; i < rowsData.size(); i++) {
				List<String> rowData = rowsData.get(i);
				boolean flag=false;
				for(int j=1;j<columns.length;j++){//问题每个单元格全有值
					if (rowData.get(j)!=null && rowData.get(j).trim().length()!=0) {
						flag = true;
					}
				}
				if(flag){
					for(int j=1;j<columns.length;j++){
						
						if(j!=3&&j!=4){
							int k=i+2;
							if(j!=1){
								if (rowData.get(j)==null||rowData.get(j).trim().length()==0) {
									return "第"+k+"行"+columns_name[j]+"不能为空";
								}
							}
							if(j==2){
								pmap.put("defect_desc",rowData.get(j));
							}
							pmap.put(columns[j], rowData.get(j));
							if(j==5||j==7){
								pmap.put("user_name", rowData.get(j));
								List<Map<String,String>> list2 = juryImportDao.queryUsrForName(pmap);
								if(list2!=null && list2.size()>0)
									pmap.put(columns[j], list2.get(0).get("USER_NO"));
								else
									return "第"+k+"行用户"+rowData.get(j)+"不存在";
							}
						}
					}
					String defect_id = taskDBUtil.getSequenceValByName("G_SEQ_JURY_DEFECT_ID");
					pmap.put("defect_id", defect_id);
					pmap.put("defect_state", "02");//将缺陷改为已处理，待验证
					pmap.put("jury_id", jury_id);
					pmap.put("jury_grade_key", at_jury_grade);
					
					juryImportDao.insertJuryDefect(pmap);
				}
			}
			/**
			 * 更新评审任务状态
			 */
			map.put("opt_time", DateTimeUtils.getFormatCurrentTime());
			map.put("opt_person",map.get("userid"));
			String phased_state = "";
			map.put("phased_state", phased_state);
			//jury_result  评审结论   at_jury_grade  评审级别
			if("01".equals(jury_result)){
				if("01".equals(at_jury_grade)){	
					map.put("phased_state", "02");
				}else if("02".equals(at_jury_grade)){
					map.put("phased_state", "05");
				}else if("03".equals(at_jury_grade)){
					map.put("phased_state", "08");
				}
			}else if("02".equals(jury_result)){
				if("01".equals(at_jury_grade)){	
					map.put("phased_state", "03");
				}else if("02".equals(at_jury_grade)){
					map.put("phased_state", "06");
				}else if("03".equals(at_jury_grade)){
					map.put("phased_state", "09");
				}
				
			}
			//评审任务结束
			juryImportDao.updatePhasedReqTask(map);
			return null;
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return "未知错误";
	}
	public boolean checkRepeat(String[] array){
		  Set<String> set = new HashSet<String>();
		  for(String str : array){
		    set.add(str);
		  }
		  if(set.size() != array.length){
		    return false;//有重复
		  }else{
		    return true;//不重复
		  }
		}
}

