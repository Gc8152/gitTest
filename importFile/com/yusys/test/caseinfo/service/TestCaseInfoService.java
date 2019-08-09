package com.yusys.test.caseinfo.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.ImportExcel2;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.test.caseinfo.dao.TestCaseInfoDao;
@Service
@Transactional
public class TestCaseInfoService extends ImportExcel2 implements ITestCaseInfoService {
	
	@Resource
	private TaskDBUtil taskDBUtil;
	@Resource
	private TestCaseInfoDao testCaseInfoDao;
	@Override
	public Map<String, String> importTestCaseInfo(String userid,MultipartFile file, int[] head_num, int[] column_num) {
		return importExcel(file, userid, head_num, column_num, column_num.length);
	}
	/**
	 * 保存行数据
	 * @param userid
	 * @param rowData
	 * @return 大于0保存成功小于或者等于0保存失败
	 */
	public String saveRowData(String userid,List<String> rowData,int numSheet){
		boolean row_empty=true;
		for (int i = 0; i < rowData.size(); i++) {
			if(rowData.get(i).trim().length()!=0){
				row_empty=false;
				break;
			}
		}
		StringBuilder msg=new StringBuilder();
		if(!row_empty){//处理和判断不为空的行数据
			String case_num=rowData.get(0);//案例编号
			Map<String, String> caseInfo=null;
			if(case_num!=null&&case_num.trim().length()>0){
				caseInfo=testCaseInfoDao.findDesignTestCases(case_num.trim());
			}
			if (caseInfo!=null&&!"00".equals(caseInfo.get("EXECUTE_STATE"))) {
				return "已执行的案例不能使用导入更新【"+case_num+"】";
			}
			String task_num=rowData.get(2);//需求任务编号
			String case_name=rowData.get(1);
			if (case_name.trim().length()==0) {
				msg.append("案例名称不能为空!");
			}
			String sys_name=rowData.get(4);
			if (sys_name.trim().length()==0) {
				msg.append("应用名称不能为空!");
			}
			String module_name=rowData.get(5);
			if (module_name.trim().length()==0) {
				msg.append("模块名称不能为空!");
			}
			String func_name=rowData.get(6);
			if (func_name.trim().length()==0) {
				msg.append("功能名称不能为空!");
			}
			String test_type1=rowData.get(7);
			if (test_type1.trim().length()==0) {//UAT、SIT
				msg.append("测试类型不能为空!");
			}else if((test_type1=taskDBUtil.findDicItemCode("TM_DIC_CASE_TYPE1", test_type1.trim()))==null){
				msg.append("测试类型不正确!");
			}
			String case_level=rowData.get(8);
			if (case_level.trim().length()==0) {
				msg.append("优先级不能为空!");
			}else if((case_level=taskDBUtil.findDicItemCode("TM_DIC_CASE_LEVEL", case_level.trim()))==null){
				msg.append("优先级不正确!");
			}
			String design_person=rowData.get(9);
			if (design_person.trim().length()==0) {
				msg.append("设计人不能为空!");
			}else if((design_person=testCaseInfoDao.findUserNoInfo(design_person))==null){
				msg.append("设计人不存在!");
			}
			String design_date=rowData.get(10);
			if (design_date.trim().length()==0) {
				msg.append("设计日期不能为空!");
			}
			String test_attribute=rowData.get(11);
			if (test_attribute.trim().length()==0) {//正面、反面
				msg.append("测试要点类型不能为空!");
			}else if((test_attribute=taskDBUtil.findDicItemCode("TM_DIC_TEST_ATTRIBUTE", test_attribute.trim()))==null){
				msg.append("测试要点类型不不正确!");
			}
			String testpoint_name=rowData.get(12);
			if (testpoint_name.trim().length()==0) {
				msg.append("测试检查要点不能为空!");
			}
			String pre_condition=rowData.get(13);
			if (pre_condition.trim().length()==0) {
//				msg.append("前置条件不能为空!");
				pre_condition="";
			}
			
			String input_data=rowData.get(14);
			if (input_data.trim().length()==0) {
				msg.append("输入数据不能为空!");
			}
			String opt_descript=rowData.get(15);
			if (opt_descript.trim().length()==0) {
				msg.append("操作步骤不能为空!");
			}
			String expect_result=rowData.get(16);
			if (expect_result.trim().length()==0) {
				msg.append("预期结果不能为空!");
			}
			if(msg.toString().trim().length()==0){
//				case_num = "AL" + taskDBUtil.getSequenceValByName("TM_SEQ_CASE_ID");
				String func_id=findTestFunctionInfo(module_name,func_name,task_num);
				String testpoint_id= "TP_"+DateTimeUtils.getRandom19();
				if(func_id==null){
					msg.append("【任务、模块、功能】信息不匹配!");
				}/*else if((testpoint_id=findTestPointInfo(test_attribute, testpoint_name, func_id))==null){
					msg.append("测试要点信息与功能信息不匹配!");
				}else if(testCaseInfoDao.findTestCaseInfo(testpoint_id)!=null){
					msg.append("该测试要点已经存在案例信息!");
				}*/else{
					Map<String, String> pointMap=new HashMap<String, String>();
					
					pointMap.put("FUNC_ID",func_id);
					pointMap.put("TEST_ATTRIBUTE", test_attribute);
					pointMap.put("TESTPOINT_NAME", testpoint_name);
					pointMap.put("OPT_PERSON", userid);
					pointMap.put("OPT_TIME", DateTimeUtils.getFormatCurrentTime());
					if (caseInfo!=null&&caseInfo.get("TESTPOINT_ID")!=null) {
						pointMap.put("TESTPOINT_ID", caseInfo.get("TESTPOINT_ID"));
						testCaseInfoDao.updateMainPoint(pointMap);
					}else{
						pointMap.put("TESTPOINT_ID", testpoint_id);
						testCaseInfoDao.addMainPoint(pointMap);
					}
					
					Map<String, String> pmap=new HashMap<String, String>();
					pmap.put("case_name", case_name);
					pmap.put("case_type1", test_type1);
					pmap.put("pre_condition", pre_condition);
					pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
					pmap.put("pri_level", case_level);
					pmap.put("case_version", "00");
					pmap.put("case_type2", "05");
					pmap.put("opt_person", userid);
					pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
					pmap.put("execute_state", "00");
					pmap.put("design_person",design_person);
					pmap.put("design_date", design_date);
					pmap.put("task_num", task_num);
					pmap.put("func_no",func_id);
					
					if (caseInfo!=null&&caseInfo.get("TESTPOINT_ID")!=null) {
						pmap.put("case_num", case_num);
						pmap.put("case_id", caseInfo.get("CASE_ID"));
						pmap.put("testpoint_id", caseInfo.get("TESTPOINT_ID"));
					}else{
						pmap.put("testpoint_id", testpoint_id);
					}
					String result=saveTestCaseInfo(userid, pmap, input_data, opt_descript, expect_result);
					if(result!=null){
						return result;
					}
				}
			}
		}
		return msg.toString();
	}
	/**
	 * 
	 * @param userid
	 * @param pmap
	 * @param input_data
	 * @param opt_descript
	 * @param expect_result
	 * @return
	 */
	public String  saveTestCaseInfo(String userid,Map<String, String> pmap,String input_data,String opt_descript,String expect_result){
		//这里需要先根据是否有case_来判断是更新还是创建
		if(pmap.containsKey("case_id")&&pmap.get("case_id").trim().length()>0){
			testCaseInfoDao.delRealOpt(pmap.get("case_id").trim());
			String result=saveTestCaseOptInfo(userid, pmap.get("case_id").trim(), input_data, opt_descript, expect_result);
			if(result!=null){
				return result;
			}
			testCaseInfoDao.updateDesignTestCases(pmap);
		}else{
			String case_id="CIIP"+DateTimeUtils.getRandom19();
			String result=saveTestCaseOptInfo(userid, case_id, input_data, opt_descript, expect_result);
			if(result!=null){
				return result;
			}
			String case_num = "AL" + taskDBUtil.getSequenceValByName("TM_SEQ_CASE_ID");
			pmap.put("case_num", case_num);
			pmap.put("case_id", case_id);
			testCaseInfoDao.saveDesignTestCases(pmap);
		}
		return null;
	}
	/**
	 * 
	 * @param userid
	 * @param case_id
	 * @param input_data
	 * @param opt_descript
	 * @param expect_result
	 */
	public String saveTestCaseOptInfo(String userid,String case_id,String input_data,String opt_descript,String expect_result){
		List<String> input_data_list=new ArrayList<String>();
		optDataSplit(input_data_list, input_data);
		List<String> opt_descript_list=new ArrayList<String>();
		optDataSplit(opt_descript_list, opt_descript);
		List<String> expect_result_list=new ArrayList<String>();
		optDataSplit(expect_result_list, expect_result);
		if(input_data_list.size()!=opt_descript_list.size()||opt_descript_list.size()!=expect_result_list.size()){
			return "【输入数据、操作步骤、预期结果】数据条数不一致!";
		}
		for (int i = 0; i < input_data_list.size(); i++) {
			Map<String, String> pmap=new HashMap<String, String>();
			pmap.put("input_data", input_data_list.get(i));
			pmap.put("opt_descript", opt_descript_list.get(i));
			pmap.put("expect_result", expect_result_list.get(i));
			pmap.put("opt_order", (i+1)+"");
			pmap.put("step_id", "CI"+DateTimeUtils.getRandom19());
			pmap.put("case_id", case_id);
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
			pmap.put("opt_person", userid);
			pmap.put("case_version", "00");
			testCaseInfoDao.addRealOpt(pmap);
		}
		return null;
	}
	public String getPreIndex(String str){
		String str1=str.trim();
		if (str1.trim().startsWith("1.")) {
			return ".";
		}else if (str1.startsWith("1:")) {
			return ":";
		}else if (str1.startsWith("1、")) {
			return "、";
		}else if (str1.startsWith("1：")) {
			return "：";
		}else if (str1.startsWith("1_")) {
			return "_";
		}
		return "";
	}
	public  void optDataSplit(List<String> lmap,String str){
		String[] input_datas=str.split("\n");
		int index=1;
		String pre=getPreIndex(str);
		
		StringBuilder opt=new StringBuilder();
		for (int i = 0; i < input_datas.length; i++) {
			if(input_datas[i].startsWith(index+pre)){
				opt=new StringBuilder(input_datas[i].substring((index+pre).length()));
			}else if(input_datas[i].startsWith((index+1)+pre)){
				lmap.add(opt.toString());
				opt=new StringBuilder(input_datas[i].substring((index+pre).length()));
				index++;
			}else{
				opt.append(input_datas[i]);
			}
		}
		lmap.add(opt.toString());
	}
	public String findTestFunctionInfo(String module_name, String func_name, String task_num){
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("module_name", module_name);
		pmap.put("func_name", func_name);
		pmap.put("task_num", task_num);
		return testCaseInfoDao.findTestFunctionInfo(pmap);
	}
	
	public String findTestPointInfo(String test_attribute,String testpoint_name,String func_id){
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("test_attribute", test_attribute);
		pmap.put("testpoint_name", testpoint_name);
		pmap.put("func_id", func_id);
		String str=testCaseInfoDao.findTestPointInfo(pmap);
		return str;
	}
	public static void main(String[] args) {
		
	}
}




























