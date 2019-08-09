package com.yusys.resources.outperson.service;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.params.ExcelExportEntity;
import org.jeecgframework.poi.excel.entity.vo.MapExcelConstants;
import org.jeecgframework.poi.excel.entity.vo.NormalExcelConstants;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.ExcelExportEntityUtil;
import com.yusys.Utils.ImportExcel2;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.SingleExcelView;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.resources.outperson.dao.OutPersonInfoDao;
import com.yusys.supplier.supplierinfo.dao.SSupplierDao;

@Service
@Transactional
public class OutPersonInfoService  extends ImportExcel2 implements IOutPersonService{
	@Resource
	private OutPersonInfoDao outPersonInfoDao;
	@Resource 
	TaskDBUtil taskDBUtil;
	@Resource
	private SSupplierDao sSupplierDao;
	
	private static final Logger logger = Logger.getLogger(OutPersonInfoService.class);
	
		// Excel的第一个页签导入  人员基本 信息
		private String importExcelSheetOne(String userid,List<String> rowData){
			if(rowData==null){
				return null;
			}else{
				String[]importOutPerson=new String[]{"",
						"op_name","idcard_no","op_sex","op_birthday","op_phone"	,"op_email","op_education","op_degree","graduate_time","graduate_college","college_type","op_special",
						"start_worktime","year_work","year_work_finance","join_bank_time","op_specialtype","op_skills",/*"op_state",*/"sup_name","supcontact_man","supcontact_num",
						"purch_type","dev_direction","dev_grade","op_belongsystem","op_office","op_office_name","op_staff","op_staff_name","memo"};
				String [] importOutPerson_name=new String[]{"","人员姓名","身份证号码","性别","出生年月","联系电话","电子邮箱","学历","学位","毕业时间","毕业院校","毕业院校类型","专业",
						"参加工作时间","工作年限","金融领域工作年限","入本行时间","专业分类","技术特长",/*"人员状态",*/"供应商全称","所属公司负责人","所属公司联系方式",
						"人员采购类型","开发方向","人员级别","所属应用","行内归属部门编号","行内归属部门名称","行方项目经理工号","行方项目经理名称","备注"};
				Map<String, String> pmap=new HashMap<String, String>();
				try {
					for (int i = 1; i < importOutPerson.length; i++) {
						if(importOutPerson[i]=="memo" || importOutPerson[i]==""||importOutPerson[i]=="join_bank_time"||importOutPerson[i]=="op_staff"||
								importOutPerson[i]=="op_staff_name"||importOutPerson[i]=="op_office"||importOutPerson[i]=="op_office_name"||
								importOutPerson[i]=="start_worktime"||importOutPerson[i]=="year_work"||importOutPerson[i]=="work_finance_time"||
								importOutPerson[i]=="year_work_finance"||importOutPerson[i]=="op_education"||importOutPerson[i]=="op_degree"||
								importOutPerson[i]=="graduate_time"||importOutPerson[i]=="graduate_college"||importOutPerson[i]=="college_type"||importOutPerson[i]=="op_special"){
							//非必填项
							if(rowData.get(i)==null||rowData.get(i).trim().length()==0){
								pmap.put(importOutPerson[i], "");
							}else{
								pmap.put(importOutPerson[i], rowData.get(i));
							}
						}else{
							if (rowData.get(i)==null||rowData.get(i).trim().length()==0) {
								return importOutPerson_name[i]+"不能为空";
							}
							pmap.put(importOutPerson[i], rowData.get(i));
						}
					}
					Map<String,String> sup = new HashMap<String,String>();
					sup.put("sup_name", pmap.get("sup_name").trim());
					List<Map<String,String>> sup_numList=sSupplierDao.querySupplierNum(sup);
					for(Map<String,String> sup_num : sup_numList){
						if (sup_num.get("SUP_NUM")!=null && sup_num.get("SUP_NUM").trim().length()>0
								&& sup_num.get("EFFICIENT").equals("00")) {
							pmap.put("sup_num", sup_num.get("SUP_NUM"));
						}
					}
					if(pmap.get("sup_num")==null || pmap.get("sup_num").length()==0){
						return "供应商名称不正确";
					}
					//检查应用名称
					Map<String,String> system = new HashMap<String,String>();
					system.put("system_name", pmap.get("op_belongsystem").trim());
					Map<String,String> systemmap=outPersonInfoDao.querySystem(system);
					if(systemmap.get("SYSTEM_ID")!=null && systemmap.get("SYSTEM_ID").length()>0){
						pmap.put("op_belongsystem_no", systemmap.get("SYSTEM_ID"));
					}else {
						return "所属应用名称不正确";
					}
					
//					String op_state=pmap.get("op_state");//人员状态
//					if (op_state!=null&&!"".equals(op_state.trim())) {
//						op_state=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_STATUS",op_state);
//						if (op_state==null||"".equals(op_state.trim())) {
//							return "人员状态错误！";
//						}
//						pmap.put("op_state",op_state);
//					}else{
//						pmap.put("op_state","");
//					}
					pmap.put("op_state","03");
					String purch_type=pmap.get("purch_type");//人员采购类型
					if (purch_type!=null&&!"".equals(purch_type.trim())) {
						purch_type=taskDBUtil.findDicItemCode("C_DIC_PURCH_TYPE",purch_type);
						if (purch_type==null||"".equals(purch_type.trim())) {
							return "人员采购类型错误！";
						}
						pmap.put("purch_type",purch_type);
					}else{
						pmap.put("purch_type","");
					}
					String college_type=pmap.get("college_type");
					if (college_type!=null&&!"".equals(college_type.trim())) {
						college_type=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_COLLEGE_TYPE",college_type);
						if (college_type==null||"".equals(college_type.trim())) {
							return "院校类型错误！";
						}
						pmap.put("college_type",college_type);
					}else{
						pmap.put("college_type","");
					}
					String op_degree =pmap.get("op_degree");
					if (op_degree!=null&&!"".equals(op_degree.trim())) {
						op_degree=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_DEGREE",op_degree);
						if (op_degree==null||"".equals(op_degree.trim())) {
							return "学位错误！";
						}
						pmap.put("op_degree",op_degree);
					}else{
						pmap.put("op_degree","");
					}
					String op_education=pmap.get("op_education");
					if (op_education!=null&&!"".equals(op_education.trim())) {
						op_education=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_EDU",op_education);
						if (op_education==null||"".equals(op_education.trim())) {
							return "学历错误";
						}
						pmap.put("op_education",op_education);
					}else{
						pmap.put("op_education","");
					}
					String op_specialtype=pmap.get("op_specialtype");
					if (op_specialtype!=null&&!"".equals(op_specialtype.trim())) {
						op_specialtype=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_PROFESSION",op_specialtype);
						if (op_specialtype==null||"".equals(op_specialtype.trim())) {
							return "专业分类错误";
						}
						pmap.put("op_specialtype",op_specialtype);
					}else{
						pmap.put("op_specialtype","");
					}
					
					String op_skills=pmap.get("op_skills");
					if (op_skills!=null&&!"".equals(op_skills.trim())) {
						op_skills=taskDBUtil.findDicItemCode(pmap.get("op_specialtype"),op_skills);
						if (op_skills==null||"".equals(op_skills.trim())) {
							return "技术特长错误";
						}
						pmap.put("op_skills",op_skills);
					}else{
						pmap.put("op_skills","");
					}
					String dev_direction=pmap.get("dev_direction");
					if (dev_direction!=null&&!"".equals(dev_direction.trim())) {
						dev_direction=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_DEV_DIRECT",dev_direction);
						if (dev_direction==null||"".equals(dev_direction.trim())) {
							return "开发方向错误";
						}
						pmap.put("dev_direction",dev_direction);
					}else{
						pmap.put("dev_direction","");
					}
					String dev_grade =pmap.get("dev_grade");
					if (dev_grade!=null&&!"".equals(dev_grade.trim())) {
						dev_grade=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_LEVEL",dev_grade);
						if (dev_grade==null||"".equals(dev_grade.trim())) {
							return "人员级别错误";
						}
						pmap.put("dev_grade",dev_grade);
					}else{
						pmap.put("dev_grade","");
					}
					if ("男".equals(pmap.get("op_sex").trim())) {
						pmap.put("op_sex","01");
					}else{
						pmap.put("op_sex","02");
					}
					String op_office=taskDBUtil.findOrgCodeByName(pmap.get("op_office"));
					if (op_office==null) {
						op_office="";
					}
					pmap.put("op_office", op_office);
					pmap.put("opt_person", userid);
					pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
					pmap.put("work_finance_time", "");
				
					//工作量信息结束--------------------------------------------------------------------------
					//判断外包人员是否存在  存在且状态为03时更新  不存在插入
					 Map<String, String> isExist=outPersonInfoDao.findOutPersonIdByIdcard(pmap.get("idcard_no"));
					if(isExist==null){
						pmap.put("op_id", taskDBUtil.getSequenceValByName("C_SEQ_OUTPERSON_ID"));
						pmap.put("op_code", pmap.get("idcard_no"));
						outPersonInfoDao.addOutPersonInfoExc(pmap);//保存外包人员基本信息
					}else if("03".equals(isExist.get("OP_STATE"))){//外包人员存在时且状态为03待入场
						pmap.put("op_id", isExist.get("OP_ID"));
						outPersonInfoDao.updateOutPersonExc(pmap);//更新外包人员数据
					}else {
						return isExist.get("OP_NAME")+"已存在！";
					}
					//x修改结束
					return null;
				} catch (Exception e) {
					e.printStackTrace();
				}
				return "数据格式有误";
			}
		}
		/**
		 * 保存行数据
		 * @param userid
		 * @param rowData
		 * @return
		 */
		public String saveRowData(String userid,List<String> rowData,int numSheet){
			if (numSheet==0) {
				return importExcelSheetOne(userid,rowData);//人员基本信息
			}/*else if (numSheet==1) {
				return importExcelSheetTwo(userid,rowData);//资质级别信息
			}*/else if (numSheet==2) {
				return importExcelSheetThree(userid,rowData);//工作履历信息
			}else if (numSheet==3) {
				return importExcelSheetFour(userid,rowData);//项目经历信息
			}else if (numSheet==4) {
				return importExcelSheetFive(userid,rowData);//资质证书信息
			}else if (numSheet==5) {
				return importExcelSheetSix(userid,rowData);//专业技能信息
			}/*else if (numSheet==6) {
				return importExcelSheetSeven(userid,rowData);//资源信息
			}*/else{
				return null;
			}
		}
		//第七个页签 ，导入资源池
		private String importExcelSheetSeven(String userid, List<String> rowData){
			if(rowData==null){
				return null;
			}else{
				String[]columns=new String[]{"","idcard_no","op_name","purch_type","ass_code","contract_code","work_month","service_startime",
						"service_endtime","project_role","is_key","duty_explain"};
				String []columns_name=new String[]{"","身份证号码","人员姓名","人员采购类型","非项目任务书编号","合同编号","工作量（人月）","开始时间","结束时间",
						"项目角色","是否关键人员","职责说明"};
				Map<String, String> pmap=new HashMap<String, String>();
				for (int i = 1; i < columns.length; i++) {
					if(columns[i]=="ass_code"||columns[i]=="contract_code"||columns[i]=="work_month"||columns[i]=="service_startime"
							||columns[i]=="service_endtime"){
						if(rowData.get(i)==null||rowData.get(i).trim().length()==0){
							pmap.put(columns[i], "");
						}else{
							pmap.put(columns[i], rowData.get(i));
						}
					}else{
						if (rowData.get(i)==null||rowData.get(i).trim().length()==0) {
							return columns_name[i]+"不能为空";
						}
						pmap.put(columns[i], rowData.get(i));
					}
				}
				
				try {
					
					String purch_type=pmap.get("purch_type");
					if (purch_type!=null&&purch_type.trim().length()>0) {
						 purch_type = taskDBUtil.findDicItemCode("C_DIC_PURCH_TYPE", purch_type);
						if (purch_type==null||purch_type.trim().length()==0) {
							return "资质类别不正确";
						}else{
							pmap.put("purch_type", purch_type);
						}
					}else{
						pmap.put("purch_type", "");
					}
					String project_role=pmap.get("project_role");
					if (project_role!=null&&project_role.trim().length()>0) {
						project_role = taskDBUtil.findDicItemCode("C_OUT_PROJECT_ROLE", project_role);
						if (project_role==null||project_role.trim().length()==0) {
							return "项目角色不正确";
						}else{
							pmap.put("project_role", project_role);
						}
					}else{
						pmap.put("project_role", "");
					}
					String is_key=pmap.get("is_key");
					if (is_key!=null&&is_key.trim().length()>0) {
						is_key = taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_YN", is_key);
						if (is_key==null||is_key.trim().length()==0) {
							return "是否关键人员不正确";
						}else{
							pmap.put("is_key", is_key);
						}
					}else{
						pmap.put("is_key", "");
					}
					//工作量信息开始
					if("01".equals(purch_type)){//非项目任务
						if(pmap.get("ass_code")==null||"".equals(pmap.get("ass_code"))){
							return "人员采购类型为'非项目任务'时,非项目任务书编号不能为空!";
						}
						List<Map<String, String>> m=outPersonInfoDao.checkIsExistByAssCode(pmap);
						if (m!=null&&m.size()>0) {
							outPersonInfoDao.delByAssCode(pmap);//删除已经存在的信息
						}
					}else if("02".equals(purch_type)){
						if(pmap.get("contract_code")==null||"".equals(pmap.get("contract_code"))){
							return "人员采购类型为'包项目'时,工作量信息合同编号不能为空!";
						}
						//检查 资源池信息是否存在 
						List<Map<String, String>> m=outPersonInfoDao.checkIsExistByContract(pmap);
						if (m!=null&&m.size()>0) {
							outPersonInfoDao.delByContract(pmap);//删除已经存在的信息
						}
					}
					pmap.put("op_id", taskDBUtil.getSequenceValByName("C_SEQ_OUTPERSON_RESPOOL_ID"));
					pmap.put("opt_person", userid);
					pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
					outPersonInfoDao.addResPoolInfoExc(pmap);
					return null;
				} catch (Exception e) {
					e.printStackTrace();
				}
				return "数据格式有误！";
			}
			}
		//第六个页签，导入专业技能
		private String importExcelSheetSix(String userid, List<String> rowData){
			if(rowData==null){
				return null;
			}else{
				String[]columns=new String[]{"","idcard_no","op_name","skill_type","skill","proficiency_degree","using_time","memo"};
				String []columns_name=new String[]{"","身份证号码","人员姓名","技能类型","技能名称","熟练度","掌握时间（月）","备注"};
				Map<String, String> pmap=new HashMap<String, String>();
				for (int i = 1; i < columns.length; i++) {
					if(columns[i]=="memo"){
						//非必填项
						if(rowData.get(i)==null||rowData.get(i).trim().length()==0){
							pmap.put(columns[i], "");
						}else{
							pmap.put(columns[i], rowData.get(i));
						}
					}else{
						if (rowData.get(i)==null||rowData.get(i).trim().length()==0) {
							return columns_name[i]+"不能为空";
						}
						pmap.put(columns[i], rowData.get(i));
					}
				}
				try {
					String skill_type=pmap.get("skill_type");
					if (skill_type!=null&&!"".equals(skill_type.trim())) {
						skill_type=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_SKILL",skill_type);
						if (skill_type==null||"".equals(skill_type.trim())) {
							return "技能类型错误";
						}
						pmap.put("skill_type",skill_type);
					}else{
						pmap.put("skill_type","");
					}
					
					String skill=pmap.get("skill");
					if (skill!=null&&!"".equals(skill.trim())) {
						String skill_type2=pmap.get("skill_type");
						skill=taskDBUtil.findDicItemCode(skill_type2,skill);
						if (skill==null||"".equals(skill.trim())) {
							return "技能名称错误";
						}
						pmap.put("skill",skill);
					}else{
						pmap.put("skill","");
					}
					String proficiency_degree=pmap.get("proficiency_degree");
					if (proficiency_degree!=null&&!"".equals(proficiency_degree.trim())) {
						proficiency_degree=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_SKILL_PROFICIENCY",proficiency_degree);
						if (proficiency_degree==null||"".equals(proficiency_degree.trim())) {
							return "技能类型错误";
						}
						pmap.put("proficiency_degree",proficiency_degree);
					}else{
						pmap.put("proficiency_degree","");
					}
					//查询专业技能是否存在
					List<Map<String,String>> list=outPersonInfoDao.findzyjnInfo(pmap);
					if(list.size()>0){//在导入外包人员信息时 若存在 先删除在插入
						outPersonInfoDao.delfindzyjnInfo(pmap);
					}
					pmap.put("op_id", taskDBUtil.getSequenceValByName("C_SEQ_OUTPERSON_SKILL_ID"));
					pmap.put("opt_person", userid);
					pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
					outPersonInfoDao.addSkillInfoExc(pmap);
					return null;
				} catch (Exception e) {
					e.printStackTrace();
				}
				return "数据格式有误！";
			}
			}
		//第五个页签，导入资质证书
		private String importExcelSheetFive(String userid, List<String> rowData){
			if(rowData==null){
				return null;
			}else{
				String[]columns=new String[]{"","idcard_no","op_name","certificate_name","issuing_unit","issuing_time","indate","memo"};
				String []columns_name=new String[]{"","身份证号码","人员姓名","资质证书","发行单位","发行时间","有效期（年）","备注"};
				Map<String, String> pmap=new HashMap<String, String>();
				for (int i = 1; i < columns.length; i++) {
					if(columns[i]=="memo"||columns[i]=="issuing_unit"||columns[i]=="issuing_time"||columns[i]=="indate"){
						//非必填项
						if(rowData.get(i)==null||rowData.get(i).trim().length()==0){
							pmap.put(columns[i], "");
						}else{
							pmap.put(columns[i], rowData.get(i));
						}
					}else{
						if (rowData.get(i)==null||rowData.get(i).trim().length()==0) {
							return columns_name[i]+"不能为空";
						}
						pmap.put(columns[i], rowData.get(i));
					}
				}
				try {
					//查询资质证书信息是否存在
					List<Map<String,String>> list=outPersonInfoDao.findzzzs(pmap);
					if(list.size()>0){//在导入外包人员信息时 若存在 先删除在插入
						outPersonInfoDao.delfindzzzsfo(pmap);
					}
					pmap.put("op_id", taskDBUtil.getSequenceValByName("C_SEQ_OUTPERSON_QUALIFICATE_ID"));
					pmap.put("opt_person", userid);
					pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
					outPersonInfoDao.addQualificateInfoExc(pmap);
					return null;
				} catch (Exception e) {
					e.printStackTrace();
				}
				return "数据格式有误！";
			}
			}
		//第四个页签，导入项目经历
		private String importExcelSheetFour(String userid, List<String> rowData){
			if(rowData==null){
				return null;
			}else{
				String[]columns=new String[]{"","idcard_no","op_name","project_name","start_time","end_time","project_abstract","paly_role","project_responsibility","memo"};
				String []columns_name=new String[]{"","身份证号码","人员姓名","项目名称","开始时间","结束时间","项目简介","担任角色","项目职责","备注"};
				Map<String, String> pmap=new HashMap<String, String>();
				for (int i = 1; i < columns.length; i++) {
					if(columns[i]=="memo"||columns[i]=="end_time"||columns[i]=="project_abstract"||columns[i]=="paly_role"||columns[i]=="project_responsibility"){
						//非必填项
						if(rowData.get(i)==null||rowData.get(i).trim().length()==0){
							pmap.put(columns[i], "");
						}else{
							pmap.put(columns[i], rowData.get(i));
						}
					}else{
						if (rowData.get(i)==null||rowData.get(i).trim().length()==0) {
							return columns_name[i]+"不能为空";
						}
						pmap.put(columns[i], rowData.get(i));
					}
				}
				
				try {
					//查询项目经理信息是否存在
					List<Map<String,String>> list=outPersonInfoDao.findProjectInfo(pmap);
					if(list.size()>0){//在导入外包人员信息时 若存在 先删除在插入
						outPersonInfoDao.delProjectInfo(pmap);
					}
					pmap.put("op_id", taskDBUtil.getSequenceValByName("C_SEQ_OUTPERSON_PROJECT_ID"));
					pmap.put("opt_person", userid);
					pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
					outPersonInfoDao.addProjectInfoExc(pmap);
					return null;
				} catch (Exception e) {
					e.printStackTrace();
				}
				return "数据格式有误！";
			}
			}
		//第三个页签，导入工作履历
		private String importExcelSheetThree(String userid, List<String> rowData){
			if(rowData==null){
				return null;
			}else{
				String[]columns=new String[]{"","idcard_no","op_name","company_name","start_time","end_time","enterprise_nature",
						"industry_belong","position","work_content","leave_reason","memo"};
				String []columns_name=new String[]{"","身份证号码","人员姓名","单位名称","开始时间","结束时间","公司性质","所属行业","担任职务",
						"工作内容描述","离职原因","备注"};
				Map<String, String> pmap=new HashMap<String, String>();
				for (int i = 1; i < columns.length; i++) {
					if(columns[i]=="memo"||columns[i]=="enterprise_nature"||columns[i]=="industry_belong"||columns[i]=="end_time"
							||columns[i]=="leave_reason"||columns[i]=="position"||columns[i]=="work_content"){
						//非必填项
						if(rowData.get(i)==null||rowData.get(i).trim().length()==0){
							pmap.put(columns[i], "");
						}else{
							pmap.put(columns[i], rowData.get(i));
						}
					}else{
						if (rowData.get(i)==null||rowData.get(i).trim().length()==0) {
							return columns_name[i]+"不能为空";
						}
						pmap.put(columns[i], rowData.get(i));
					}
				}
				try {
					String enterprise_nature=pmap.get("enterprise_nature");
					if (enterprise_nature!=null&&!"".equals(enterprise_nature.trim())) {
						enterprise_nature=taskDBUtil.findDicItemCode("SUP_DIC_NATURE_BUSINESS",enterprise_nature);
						if (enterprise_nature==null||"".equals(enterprise_nature.trim())) {
							return "公司性质错误";
						}
						pmap.put("enterprise_nature",enterprise_nature);
					}else{
						pmap.put("enterprise_nature","");
					}
					//查询工作履历信息是否存在
					List<Map<String,String>> list=outPersonInfoDao.findWorkInfo(pmap);
					if(list.size()>0){//在导入外包人员信息是 若存在 先删除在插入
						outPersonInfoDao.delWorkInfo(pmap);
					}
					pmap.put("op_id", taskDBUtil.getSequenceValByName("C_SEQ_OUTPERSON_WORK_ID"));
					pmap.put("opt_person", userid);
					pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
					outPersonInfoDao.addWorkInfoExc(pmap);
					return null;
				} catch (Exception e) {
					e.printStackTrace();
				}
				return "数据格式有误！";
			}
			}
		//第二个页签，导入资质级别
		private String importExcelSheetTwo(String userid, List<String> rowData){
			Map<String, String> resultMap2=new HashMap<String, String>();
			Map<String, String> resultMap3=new HashMap<String, String>();
			if(rowData==null){
				return null;
			}else{
				String[]columns=new String[]{"","idcard_no","op_name","qualificate_level","op_grade","is_current","start_time","end_time","memo"};
				String []columns_name=new String[]{"","身份证号码","人员姓名","资质级别","人员档次","是否当前档次","档次开始时间","档次结束时间","备注"};
				Map<String, String> pmap=new HashMap<String, String>();
				for (int i = 1; i < columns.length; i++) {
					if(columns[i]=="memo"||columns[i]=="end_time"){
						//非必填项
						if(rowData.get(i)==null||rowData.get(i).trim().length()==0){
							pmap.put(columns[i], "");
						}else{
							pmap.put(columns[i], rowData.get(i));
						}
					}else{
						if (rowData.get(i)==null||rowData.get(i).trim().length()==0) {
							return columns_name[i]+"不能为空";
						}
						pmap.put(columns[i], rowData.get(i));
					}
				}
				try {
					String qualificate_level=pmap.get("qualificate_level");
					if (qualificate_level!=null&&!"".equals(qualificate_level.trim())) {
						qualificate_level=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_QULITY_LEVEL",qualificate_level);
						if (qualificate_level==null||"".equals(qualificate_level.trim())) {
							return "资质级别错误";
						}
						pmap.put("qualificate_level",qualificate_level);
					}else{
						pmap.put("qualificate_level","");
					}
					String op_grade=pmap.get("op_grade");
					if (op_grade!=null&&!"".equals(op_grade.trim())) {
						op_grade=taskDBUtil.findDicItemCode(pmap.get("qualificate_level"),op_grade);
						if (op_grade==null||"".equals(op_grade.trim())) {
							return "人员档次错误";
						}
						pmap.put("op_grade",op_grade);
					}else{
						pmap.put("op_grade","");
					}
					String is_current=pmap.get("is_current");
					if (is_current!=null&&!"".equals(is_current.trim())) {
						is_current=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_YN",is_current);
						if (is_current==null||"".equals(is_current.trim())) {
							return "是否当前档次错误";
						}
						pmap.put("is_current",is_current);
					}else{
						pmap.put("is_current","");
					}
					pmap.put("op_code", pmap.get("idcard_no"));
					List<Map<String, String>> isCurrent=outPersonInfoDao.findIsCurrentByOpCode(pmap);//查询是否当前资质
					List<Map<String,String>> time=outPersonInfoDao.queryTimeByTime(pmap);//查询时间是否有重叠
					//查询当前记录是否存在
					List<Map<String, String>> isExist=outPersonInfoDao.findIsExist(pmap);
					if(isExist.size()>0){//如果已经存在先删除
						outPersonInfoDao.delIsExistBy(pmap);
					}
					if(!time.isEmpty()&&time.size()>0){
						resultMap3.put("result", "false");
					}
					if(pmap.get("is_current").equals("01")){
						if(isCurrent.size()>0&&!isCurrent.isEmpty()){
							for (Map<String, String> map : isCurrent) {
								if(map.get("IS_CURRENT")!=null&&map.get("IS_CURRENT").equals("01")){
									if(pmap.get("start_time")!=null&&map.get("START_TIME")!=null){
										if(pmap.get("start_time").compareTo(map.get("START_TIME"))>= 0){
											//新导入的资质的开始时间大于等于当前资质的时间时 更新是否当前资质为否
											outPersonInfoDao.updateIsCurrentByOpCode(pmap);
										}
									}
								}
							}
						}else{
							resultMap2.put("result", "false");
						}
					}
					if(!resultMap2.isEmpty()&&resultMap2.get("result").equals("false")){
						return"当前资质信息有误或已存在！";
					}else{
						if(!resultMap3.isEmpty()&&resultMap3.get("result").equals("false")){
							return "资质时间有重叠！";
						}else{
							pmap.put("op_id", taskDBUtil.getSequenceValByName("C_SEQ_OUTPERSON_QUALILEVEL_ID"));
							pmap.put("opt_person", userid);
							pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
							outPersonInfoDao.addQualiLevelInfoExc(pmap);
							return null;
						}
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				return "数据格式有误！";
			}
		}
		@Override
		public Map<String, String> importOutPersonInfo(String userId,MultipartFile file, int[] head_num, int[] column_num) {
			return importExcel(file, userId, head_num, column_num,7);
		}
		
		
		@Override//导出外包人员信息 根据查询条件
		public void exportOutPersonInfo(ModelMap modelMap, HttpServletRequest req,
				String userId, HttpServletResponse res) {
			List<Map<String,Object>> exportList=new ArrayList<Map<String,Object>>();
			String[] noMust={"op_code","supplier_id","op_office","op_name","op_state"};//查询体条件
			Map<String,String> pmap=RequestUtils.requestToMap(req, null, noMust);
			String opName=pmap.get("op_name");//中文字段解码 添加模糊查询
			try{
				if(null != opName && !"".equals(opName.trim())){
					pmap.put("op_name", "%"+URLDecoder.decode(opName,"UTF-8")+"%");
				}
			}catch(Exception e){
				e.printStackTrace();
			}
			pmap.put("userid", userId);	//用于权限控制用
			exportList=outPersonInfoDao.exportOutPersonInfo(pmap);
			//设置导出表的表头
			List<ExcelExportEntity> entity = new ArrayList<ExcelExportEntity>();
			String[] key={"序号","身份证","人员姓名","厂商名称","人员状态","人员采购类型","任务书编号","合同编号","工作量","人员资质","行内归属部门","行内项目经理",
					"性别","出生年月","最高学历","毕业学校","专业","参加工作时间","工作年限","银行/金融领域工作年限","入本行时间","手机号","技术特长","专业分类","备注"};
			String[] value={"RN","IDCARD_NO","OP_NAME","SUP_NAME","OP_STATE_NAME","PURCH_TYPE_NAME","ASS_CODE","CONTRACT_CODE","WORK_MONTH","OP_QUALIFICATION_NAME","ORG_NAME","OP_STAFF_NAME",
					"OP_SEX","OP_BIRTHDAY","OP_EDUCATION_NAME","GRADUATE_COLLEGE","OP_SPECIAL","START_WORKTIME","YEAR_WORK","WORK_FINANCE_TIME","JOIN_BANK_TIME","OP_PHONE",
					"OP_SKILLS_NAME","OP_POSITION_NAME","MEMO"};
			entity=ExcelExportEntityUtil.exportExcelContent(key,value);
			modelMap.put(MapExcelConstants.ENTITY_LIST, entity);
			modelMap.put(MapExcelConstants.MAP_LIST, exportList);
			modelMap.put(MapExcelConstants.FILE_NAME, "外包人员列表");
			modelMap.put(NormalExcelConstants.PARAMS, new ExportParams("外包人员列表","导出信息"));
			SingleExcelView sev=new SingleExcelView();
			try {
				sev.renderMergedOutputModel(modelMap,req,res);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}	
}