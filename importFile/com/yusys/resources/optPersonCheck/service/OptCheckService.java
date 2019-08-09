package com.yusys.resources.optPersonCheck.service;

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
import com.yusys.resources.optPersonCheck.dao.OptCheckDao;
import com.yusys.resources.outperson.dao.OutPersonInfoDao;
import com.yusys.supplier.supplierinfo.dao.SSupplierDao;

@Service
@Transactional
public class OptCheckService extends ImportExcel2 implements IOptCheckService {
	@Resource
	private OptCheckDao optCheckDao;
	@Resource
	TaskDBUtil taskDBUtil;

	private static final Logger logger = Logger.getLogger(OptCheckService.class);

	/**
	 * 导入人员考核信息
	 * @param userid
	 * @param file(文件)
	 * @param head_num（Excel中的标题行数）
	 * @param column_num（Excel中的列数）
	 * @return
	 */
	@Override
	public Map<String, String> importOptCheckInfo(String userId,MultipartFile file, int[] head_num, int[] column_num) {
		return importExcel(file, userId, head_num, column_num);
	}

	/**
	 * 保存行数据(重载父类中的方法)
	 * @param userid
	 * @param rowData(行数据)
	 * @param numSheet（Excel中的页签数）
	 * @return
	 */
	public String saveRowData(String userid, List<String> rowData, int numSheet) {
		if (numSheet == 0) {// 第一个sheet页
			return importExcelSheetOne(userid, rowData);// 保存人员考核信息
		}
		return null;
	}

	// Excel的第一个页签导入：人员考核信息
	private String importExcelSheetOne(String userid, List<String> rowData) {

		if (rowData == null) {
			return null;
		} else {
			try {
				Map<String, String> pmap = new HashMap<String, String>();
                boolean cardno = false;
                boolean opName = false;   
                boolean spType = false;
                boolean chType = false;
                
				// 身份证号
				String card_no = rowData.get(0);
				if ("".equals(card_no) || card_no == null) {
					cardno = true;
				} else {
					pmap.put("card_no", card_no);
				}

				// 人员姓名
				String op_name = rowData.get(1);
				if ("".equals(op_name) || op_name == null) {
					opName = true;
				}

				// 供应商不做存储

				// 专业分类
				String specialtype = rowData.get(3);
				if (specialtype == null || "".equals(specialtype)) {
					spType = true;
				} else {
					pmap.put("specialtype", specialtype);
				}

				// 考核类别
				String check_type = rowData.get(4);
				if ("".equals(check_type) || null == check_type) {
					chType = true;
				} else {
					pmap.put("check_type", check_type);
				}
                
				if(cardno&&opName&&spType&&chType){//前四项都没有填，说明是空行
					return "";
				}
				
				
				if(cardno){
					return "身份证号不能为空！";
				}
				
				Map<String, String> hmap = optCheckDao.queryOutPersonInfoByCardNo(pmap);// 根据身份证号查询外包人员信息
				if (hmap == null || "".equals(hmap)) {
					return "该行身份证号无系统对应的人员！";
				}
				
				if(opName){
					return "人员姓名不能为空！";
				}
				
				//系统人员姓名与导入的姓名对比
				if (!hmap.get("OP_NAME").equals(op_name)) {
					pmap.put("op_id", "");
					return "该行身份证对应的系统人员姓名与要导入的人员姓名不相符，请检查！";
				} else {
					pmap.put("op_id", hmap.get("OP_ID"));
				}
				
				if(spType){
					return "专业分类不能为空！";
				}
				if(chType){
					return "考核类别不能为空！";
				}
				
				// 考核开始时间
				String check_starttime = rowData.get(5);
				if ("".equals(check_starttime) || null == check_starttime) {
					return "考核开始时间不能为空！";
				} else {
					pmap.put("check_starttime", check_starttime);
				}

				// 考核结束时间
				String check_endtime = rowData.get(6);
				if ("".equals(check_endtime) || null == check_endtime) {
					return "考核结束时间不能为空！";
				} else {
					pmap.put("check_endtime", check_endtime);
				}

				// 考核分数
				String check_score = rowData.get(7);
				if ("".equals(check_score) || null == check_score) {
					return "考核分数不能为空！";
				} else {
					pmap.put("check_score", check_score);
				}

				// 考核人
				String check_person = rowData.get(8);
				if ("".equals(check_person) || null == check_person) {
					return "考核人不能为空！";
				} else {
					pmap.put("check_person", check_person);
				}

				// 考核日期
				String check_date = rowData.get(9);
				if ("".equals(check_date) || null == check_date) {
					return "考核日期不能为空！";
				} else {
					pmap.put("check_date", check_date);
				}
				pmap.put("opt_person", userid);
				pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
				List<Map<String, String>> cli = optCheckDao.findCheckIsRepeat(pmap);
				if(cli == null||cli.size()<=0){
					String check_id = taskDBUtil
							.getSequenceValByName("C_SEQ_OUTPERSON_CHECKID");// 考核表主键序列
					pmap.put("check_id", check_id);
					optCheckDao.insertOptCheckInfo(pmap);// 插入外包人员考核信息
				}else{
					check_type = taskDBUtil.findDicItemCode("C_DIC_STAFF_CHECKTYPE",check_type);
					pmap.put("check_id", (cli.get(0)).get("CHECK_ID"));
					pmap.put("check_type",check_type);
					optCheckDao.optCheckUpdate(pmap);
				}

			} catch (Exception e) {
				e.printStackTrace();
				return "系统错误！";
			}
		}
		return "";
	}
}