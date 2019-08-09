package com.yusys.application.applicationManager.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.ImportExcel2;
import com.yusys.application.applicationManager.dao.AppFuncDao;

@Service
@Transactional
public class AppFuncService extends ImportExcel2 implements IAppFuncService {
	
	@Resource
	private AppFuncDao appfuncdao;
	@Override
	public Map<String, String> importFunc(String userid,MultipartFile file, int[] head_num, int[] column_num) {
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
			String func_seq=rowData.get(0);//序号
			String sys_name=rowData.get(1);//应用名称
			String modal_name=rowData.get(2);//模块名称
			String func_name=rowData.get(3);//功能名称
			String func_remark=rowData.get(4);//描述
			String currDate= DateTimeUtils.getFormatCurrentTime();//创建时间
			if (func_seq.trim().length()==0) {
				msg.append("序号不能为空!");
			}
			if (sys_name.trim().length()==0) {
				msg.append("应用名称不能为空!");
			}
			if (modal_name.trim().length()==0) {
				msg.append("模块名称不能为空!");
			}
			if (func_name.trim().length()==0) {
				msg.append("功能点名称不能为空!");
			}
			if(msg.toString().trim().length()==0){
				String system_id=appfuncdao.findSystemidByname(sys_name.trim());
				if(system_id==null){
					msg.append("没有该项应用!");
				}else{
					Map<String, String> pointMap=new HashMap<String, String>();
					pointMap.put("system_id", system_id);
					String modal_id=findModalByname(system_id,modal_name.trim());
					if(modal_id!=null){
						pointMap.put("supfunc_no",modal_id);
					}else{
					   pointMap.put("func_seq","");
					   modal_id=DateTimeUtils.getRandom19();
						pointMap.put("func_no",modal_id);
						pointMap.put("func_name",modal_name);
						pointMap.put("func_type","01");
						pointMap.put("supfunc_no",system_id);
						pointMap.put("user_id",userid);
						pointMap.put("curr_time",currDate);
						pointMap.put("func_remark","");
						
						appfuncdao.addFuncPoint(pointMap);
						pointMap.put("supfunc_no",modal_id);
					}
					
					if(func_name.trim().length()>0){
						pointMap.put("func_seq",func_seq);
						pointMap.put("func_no", DateTimeUtils.getRandom19());
						pointMap.put("func_name",func_name);
						pointMap.put("func_type","02");
						pointMap.put("user_id",userid);
						pointMap.put("curr_time",currDate);
						if(func_remark!=null&&func_remark.trim().length()>0){
							pointMap.put("func_remark",func_remark);
						}else{
							pointMap.put("func_remark","");
						}
						appfuncdao.addFuncPoint(pointMap);
					}
					
				}
			}
		}
		return msg.toString();
	}
	
	public String findModalByname(String system_id,String module_name){
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("system_id", system_id);
		pmap.put("func_name", module_name);
		return appfuncdao.findModalByname(pmap);
	}
	public static void main(String[] args) {
		
	}
}




























