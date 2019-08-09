package com.yusys.resources.outpersonattendance.service;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;
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
import com.yusys.Utils.IDFactory;
import com.yusys.Utils.ImportExcel2;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.dao.SHolidaysDao;
import com.yusys.resources.outperson.dao.OutPersonInfoDao;
import com.yusys.resources.outpersonattendance.dao.OptAttendanceDao;
import com.yusys.supplier.supplierinfo.dao.SSupplierDao;

@Service
@Transactional
public class OptAttendanceService  extends ImportExcel2 implements IOptAttendanceService{
	@Resource
	private OptAttendanceDao optAttendanceDao;
	@Resource
	private OutPersonInfoDao outPersonInfoDao;
	@Resource
	private SSupplierDao sSupplierDao;
	@Resource
	private SHolidaysDao holidaysDao;
	@Resource 
	TaskDBUtil taskDBUtil;
	private static final Logger logger = Logger.getLogger(OptAttendanceService.class);
	@Override
	public Map<String, Object> queryOptAttendanceList(HttpServletRequest req,
			String userid) {
		String[]must=new String[]{"limit","offset"};
		String[]nomust=new String[]{"op_name","supplier_num","berw_date","aftw_date","acc_type","acc_status","op_code"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
		try {
			if (pmap!=null&&pmap.containsKey("op_name")&&!"".equals(pmap.get("op_name"))) {
				pmap.put("op_name_like", "%"+URLDecoder.decode(pmap.get("op_name"), "UTF-8").trim()+"%");
			}else if(pmap!=null&&pmap.containsKey("berw_date")&&!"".equals(pmap.get("berw_date"))){
				pmap.put("berw_date",URLDecoder.decode(pmap.get("berw_date"), "UTF-8").trim());
			}else if(pmap!=null&&pmap.containsKey("aftw_date")&&!"".equals(pmap.get("aftw_date"))){
				pmap.put("aftw_date", URLDecoder.decode(pmap.get("aftw_date"), "UTF-8").trim());
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		pmap.put("userid", userid);
		List<Map<String, String>> rows=optAttendanceDao.queryOptAttendanceList(pmap);
		Map<String, Object>smap=new HashMap<String, Object>();
		smap.put("total", pmap.get("total"));
		smap.put("rows", rows);
		return smap;
	}
	@Override
	public Map<String, String> addOptAttendance(HttpServletRequest req,
			String userid) {
		Map<String, String> smap=new HashMap<String, String>();
		String[]must=new String[]{"op_code","user_no","berw_time","aftw_time","acc_type","work_date","acc_status"};
		String []nomust=new String[]{"memo"};
		try {
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			String acc_id = IDFactory.getIDStr();
			pmap.put("acc_id", acc_id);
			SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
			Date  start_time = sdf.parse(pmap.get("berw_time"));
			Date  end_time = sdf.parse(pmap.get("aftw_time"));
			int hours = (DateTimeUtils.getIntervalSeconds(start_time, end_time))%3600;
			pmap.put("work_hours",hours+"");
			optAttendanceDao.addOptAttendance(pmap);
			smap.put("result", "true");
			return smap;
		} catch (Exception e) {
			e.printStackTrace();
			smap.put("result", "false");
			return smap;
		}
	}
	@Override
	public Map<String, String> updateOptAttendance(HttpServletRequest req,
			String userid) {
		Map<String, String> smap=new HashMap<String, String>();
		String[]must=new String[]{"acc_id","op_code","user_no","berw_time","aftw_time","acc_type","work_date","acc_status"};
		String []nomust=new String[]{"memo"};
		try {
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
			Date  start_time = sdf.parse(pmap.get("berw_time"));
			Date  end_time = sdf.parse(pmap.get("aftw_time"));
			int hours = (DateTimeUtils.getIntervalSeconds(start_time, end_time))%3600;
			pmap.put("work_hours",hours+"");
			optAttendanceDao.updateOptAttendance(pmap);
			smap.put("result", "true");
			return smap;
		} catch (Exception e) {
			e.printStackTrace();
			smap.put("result", "false");
			return smap;
		}
	}
	//导入
	@Override
	public Map<String, String> importOptattendance(String userId,MultipartFile file, int[] head_num, int[] column_num) {
		return importExcel(file, userId, head_num, column_num,1);
	}
	@Override//导入公共方法
	public String saveRowData(String userid,List<String> rowData,int numSheet){
		if (numSheet==0) {
			return importExcelSheetOne(rowData);//人员考勤信息
		}else{
			return null;
		}
	}
	// Excel的第一个页签导入  类别信息信息  
	private String importExcelSheetOne(List<String> rowData){
		if(rowData==null){
			return null;
		}else{
			String[]importOptAttendance=new String[]{"","user_no","op_name","op_code","supplier_name","acc_type","work_date","berw_time","aftw_time","work_hours","work_overhours","acc_status","memo"};
			String [] importOptAttendance_name=new String[]{"","用户编号","外包人员姓名","身份证号","供应商名称","考勤类型","考勤日期","上班时间","下班时间","工时时长","加班工时","考勤状态","备注"};
			Map<String, String> pmap=new HashMap<String, String>();
			try {
				for (int i = 1; i < importOptAttendance.length; i++) {
//					if(importOptAttendance[i]=="memo"){
						//非必填项
						if(rowData.get(i)==null||rowData.get(i).trim().length()==0){
							pmap.put(importOptAttendance[i], "");
						}else{
							pmap.put(importOptAttendance[i], rowData.get(i));
						}
//					}else{
//						if (rowData.get(i)==null||rowData.get(i).trim().length()==0) {
//							return importOptAttendance_name[i]+"不能为空";
//						}
//						pmap.put(importOptAttendance[i], rowData.get(i));
//					}
				}
//				List<Map<String,String>> optList = outPersonInfoDao.judgeCode(pmap.get("op_code").trim());
//				for(Map<String,String> opt: optList){
//					if (opt.get("OP_NAME")!=null && opt.get("OP_NAME").trim().length()>0){
//						pmap.put("op_name", opt.get("OP_NAME"));
//					}
//				}
				if(pmap.get("op_name")==null || pmap.get("op_name").length()==0){
					return "外包人员姓名不正确！";
				}			
				if(pmap.get("op_code")==null || pmap.get("op_code").length()==0){
					return "外包人员身份证号不正确！";
				}
				if(pmap.get("user_no")==null || pmap.get("user_no").length()==0){
					return "用户编号不正确！";
				}
//				Map<String,String> sup = new HashMap<String,String>();
//				sup.put("sup_name", pmap.get("supplier_name").trim());
//				List<Map<String,String>> sup_numList=sSupplierDao.querySupplierNum(sup);
//				for(Map<String,String> sup_num : sup_numList){
//					if (sup_num.get("SUP_NUM")!=null && sup_num.get("SUP_NUM").trim().length()>0&& sup_num.get("EFFICIENT").equals("00")){
//						pmap.put("sup_num", sup_num.get("SUP_NUM"));
//					}
//				}
//				if(pmap.get("sup_num")==null || pmap.get("sup_num").length()==0){
//					return "供应商名称不正确！";
//				}
				String acc_type=pmap.get("acc_type");//人员考勤类型
				if (acc_type!=null&&!"".equals(acc_type.trim())) {
					acc_type=taskDBUtil.findDicItemCode("C_DIC_ATTENDANCE_TYPE",acc_type);
					if (acc_type==null||"".equals(acc_type.trim())) {
						return "考勤类型错误";
					}
					pmap.put("acc_type",acc_type);
				}else{
					return "考勤类型不正确！";
				}
				String berw_time=pmap.get("berw_time");//上班时间
				if (berw_time!=null&&!"".equals(berw_time.trim())) {
					pmap.put("berw_time",berw_time);
				}else{
					pmap.put("berw_time","");
				}
				String aftw_time=pmap.get("aftw_time");//下班时间
				if (aftw_time!=null&&!"".equals(aftw_time.trim())) {
					pmap.put("aftw_time",aftw_time);
				}else{
					pmap.put("aftw_time","");
				}
				String work_hours=pmap.get("work_hours");//工时时长
				if (work_hours!=null&&!"".equals(work_hours.trim())) {
/*					SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
					Date  start_time = sdf.parse(pmap.get("berw_time"));
					Date  end_time = sdf.parse(pmap.get("aftw_time"));
					int hours = (DateTimeUtils.getIntervalSeconds(start_time, end_time))%3600;
					if(!(hours+"").equals(work_hours)){
						return "工时时长不正确！";
					}else{
						pmap.put("work_hours",hours+"");
					}*/
					pmap.put("work_hours",work_hours);
				}else{
					return "标准工时不正确！";
				}
				String work_overhours=pmap.get("work_overhours");//加班工时
				if (work_overhours!=null && !"".equals(work_overhours.trim())) {
					pmap.put("work_overhours",work_overhours);
				}else{
					pmap.put("work_overhours","");
				}
				String work_date=pmap.get("work_date");
				if (work_date!=null&&!"".equals(work_date.trim())) {
					Map<String, String> hmap=new HashMap<String, String>();
					hmap.put("s_date",work_date+"%");
					List<Map<String, String>> list=holidaysDao.queryHolidays(hmap);
					if(list.size()==0){
						return "考勤日期不正确！";
					}
					pmap.put("work_date",work_date);
				}else{
					return "考勤日期不正确！";
				}
				String acc_status=pmap.get("acc_status");
				if (acc_status!=null&&!"".equals(acc_status.trim())) {
					acc_status=taskDBUtil.findDicItemCode("C_DIC_ATTENDANCE_STATUS",acc_status);
					if (acc_status==null||"".equals(acc_status.trim())) {
						return "考勤状态错误";
					}
					pmap.put("acc_status",acc_status);
				}else{
					return "考勤状态不正确！";
				}
				String memo=pmap.get("memo");
				if (memo!=null && !"".equals(memo.trim())) {
					pmap.put("memo",memo);
				}else{
					pmap.put("memo","");
				}
				List<Map<String,String>> list=optAttendanceDao.queryOptAttByUserNoAndIdcard(pmap);
				if(list==null || list.size()<=0) {
					return  "人员身份证和用户编号不对应！";
				}
				List<Map<String,String>> isExist=optAttendanceDao.queryOptAttByCodeAndDate(pmap);
				if(isExist==null||isExist.size()<=0){
					String acc_id = IDFactory.getIDStr();
					pmap.put("acc_id", acc_id);
					optAttendanceDao.addOptAttendance(pmap);//保存外包人员考勤信息数据
				}else{//外包人员考勤信息存在时
					String acc_id = isExist.get(0).get("ACC_ID");
					pmap.put("acc_id", acc_id);
					optAttendanceDao.updateOptAttendance(pmap);//更新外包人员考勤信息数据	
				}
				//x修改结束
				return null;
			} catch (Exception e) {
				logger.info(e.getMessage());
			}
			return "数据格式有误!";
		}
	}
}