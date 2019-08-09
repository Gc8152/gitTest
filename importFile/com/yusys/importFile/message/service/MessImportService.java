/**
 * @author zq
 *
 */
package com.yusys.importFile.message.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDataFormatter;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.params.ExcelExportEntity;
import org.jeecgframework.poi.excel.entity.vo.MapExcelConstants;
import org.jeecgframework.poi.excel.entity.vo.NormalExcelConstants;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.ExcelExportEntityUtil;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.SingleExcelView;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.importFile.message.dao.MessImportDao;
@Service
@Transactional
public class MessImportService  implements IMessImportService{
	public final static DateFormat DEFAULT_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");
	private static final Logger logger = Logger.getLogger(MessImportService.class);
	
	@Resource
	private MessImportDao messImportDao;
	
	@Resource
	private TaskDBUtil taskDBUtil;
	/**
	 * 导入数据
	 */
	
	public Map<String, Object> importPhaseFile(HttpServletRequest req,String userid,MultipartFile file,int []head_num,int []column_num) {
		String[] nomust=new String[]{"APP_ID"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, null, nomust);
		pmap.put("userid", userid);
		return importExcel(file, userid, head_num, column_num,0,pmap);
	}
	
	/**
	 * 
	 * @param req
	 * @param file
	 * @param column_num 列數量
	 * @return
	 * @throws Exception 
	 */
	public Map<String, Object> importExcel(MultipartFile file,String userid,int[] head_num,int []column_num,int maxSheet_num,Map<String,String> pmap){
		Map<String, Object> map = new HashMap<String, Object>();
		String fileName = file.getOriginalFilename();
		// 获取文件拓展名
		String extendName = fileName.substring(fileName.lastIndexOf(".") + 1,
				fileName.length());
		// 拓展名是xls
		InputStream is;
		try {
			is = file.getInputStream();
			if (extendName.equals("xls")) {
				return importXLS(is,userid,head_num,column_num,maxSheet_num,pmap);
			}else if (extendName.equals("xlsx")) {
				return importXLSX(is,userid,head_num,column_num,maxSheet_num,pmap);
			}
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		return map;
	}
	
	/**
	 * XLS格式的 excel
	 * @param is
	 * @param column_num
	 * @return
	 */
	private Map<String, Object> importXLS(InputStream is,String userid,int[] head_num,int []column_num,int maxSheet_num,Map<String,String> pmap){
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			HSSFWorkbook hssfWorkbook = new HSSFWorkbook(is);
			// 读取表格
			//for (int numSheet = 0; numSheet < hssfWorkbook.getNumberOfSheets(); numSheet++) {
			for (int numSheet = 0; numSheet < 1; numSheet++) {
				int currentNum=head_num[numSheet];
				HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(numSheet);
				if (hssfSheet == null) {
					continue;
				}
				List<List<String>> formData=new ArrayList<List<String>>();
				// 读取每一行 new int[]{1,1,1,1,2,2}
				for (int rowNum = head_num[numSheet]; rowNum <= hssfSheet.getLastRowNum(); rowNum++) {
					HSSFRow hssfRow = hssfSheet.getRow(rowNum);
					currentNum++;
					if (hssfRow != null) {
						List<String> rowData=new ArrayList<String>();
						for (int i = 0; i <column_num[numSheet]; i++) {
							rowData.add(getValue(hssfRow.getCell(i)));
						}
						int rs=saveRowData(userid,rowData,numSheet,pmap);
						if(0 == rs){
							throw new RuntimeException("第"+(numSheet+1)+"页签"+"第"+currentNum+"行");
						}
						if(2 == rs){
							break;
						}
						formData.add(rowData);
						
					}
				}
				map = saveFormData(userid,formData,numSheet,pmap);
				if("false".equals(map.get("result"))){
					return map;
				}
			}
			map.put("result", "true");
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 保存行数据
	 * @param userid
	 * @param rowData
	 * @return 大于0保存成功小于或者等于0保存失败
	 */
	public int saveRowData(String userid,List<String> rowData,int numSheet,Map<String,String> pmap){
		int j = 0;
		String str = "";
		for(int i=0;i<9;i++){
			if(i == 1 || i == 2 || i == 5 || i == 6 || i == 7 || i == 8){
				str = rowData.get(i);
				if(null == str || "".equals(str)){
					j++;
				}
			}
		}
		if(0 != j && 6 != j){
			return 0;
		}
		if(6 == j){
			return 2;
		}
		return 1;
	}
	
	/**
	 * 保存excel表单数据
	 * @param userid
	 * @param rowData
	 * @return 大于0保存成功小于或者等于0保存失败
	 */
	public Map<String, Object> saveFormData(String userid,List<List<String>> rowsData,int numSheet,Map<String,String> pmap){
			return importExcelSheetOne(userid,rowsData,pmap);
	}
	
	/**
	 * 導入XLSX格式的Excel
	 * @param is
	 * @param column_num
	 * @return
	 * @throws Exception 
	 */
	private Map<String, Object> importXLSX(InputStream is,String userid,int[] head_num,int column_num[],int maxSheet_num,Map<String,String> pmap){
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
			
			for (int numSheet = 0; numSheet <xssfWorkbook.getNumberOfSheets(); numSheet++) {
				if (maxSheet_num!=0&&numSheet>=maxSheet_num) {
					break;
				}
				int currentNum=head_num[numSheet];
				XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(numSheet);
				if (xssfSheet == null) {
					continue;
				}
				int x=xssfSheet.getLastRowNum();
				List<List<String>> formData=new ArrayList<List<String>>();
				for (int rowNum = head_num[numSheet]; rowNum <= x; rowNum++) {
					XSSFRow xssfRow = xssfSheet.getRow(rowNum);
					currentNum++;
					if (xssfRow != null) {
						List<String> rowData=new ArrayList<String>();
						for (int i = 0; i < column_num[numSheet]; i++) {
							rowData.add(getValue(xssfRow.getCell(i)));
						}
						int rs=saveRowData(userid,rowData,numSheet,pmap);
						if(0 == rs){
							map.put("msg","第"+currentNum+"行有必填项未填");
							map.put("result","false");
							return map;
							//throw new RuntimeException("第"+(numSheet+1)+"页签"+"第"+currentNum+"行");
						}
						if(2 == rs){
							break;
						}
						formData.add(rowData);
						
					}
				}
				map = saveFormData(userid,formData,numSheet,pmap);
				if("false".equals(map.get("result"))){
					return map;
				}
			}
			map.put("result","true");
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return map;
	}

	
	private Map<String, Object> importExcelSheetOne(String userid,List<List<String>> rowsData,Map<String,String> map){
		Map<String, Object> rmap0 = new HashMap<String, Object>();
		List<Map<String,String>> inList = new ArrayList<Map<String,String>>();
		List<Map<String,String>> outList = new ArrayList<Map<String,String>>();
		for(List<String> ls : rowsData){
			if(ls.size() < 11){
				rmap0.put("result", "false");
				rmap0.put("msg", "模板格式错误，应至少12列");
				return rmap0;
			}
			Map<String,String> rmap = new HashMap<String,String>();
			//0  序号     1 类型输入输出     2 英文名一    3 英文名二   4 英文名三  5 中文名
			rmap.put("DATA_ENGNAME", ls.get(2));
			rmap.put("DATA_ENGNAMEA", ls.get(3));
			rmap.put("DATA_ENGNAMEB", ls.get(4));
			rmap.put("DATA_CHNNAME", ls.get(5));//中文名
			rmap.put("DATA_TYPE", ls.get(6).toLowerCase());//类型
			rmap.put("MSG_LENGTH", ls.get(7));//长度
			rmap.put("IS_NECESSARY", ls.get(8));//是否必输
			rmap.put("STANDARD_CODE", ls.get(9));//标准代码
			rmap.put("DATA_INSTRUCTION", ls.get(10));//内容说明
			rmap.put("INFO_REMARK", ls.get(11));//备注
			if("输入".equals(ls.get(1))){
				inList.add(rmap);
			}else if("输出".equals(ls.get(1))){
				outList.add(rmap);
			}else{
				rmap0.put("result", "false");
				rmap0.put("msg", "第"+ls.get(0)+"行未标明输入或输出");
				return rmap0;
			}
			
		}
		rmap0.put("inlist", inList);
		rmap0.put("outlist", outList);
		return rmap0;
	}
	
	
	/**
	 * 将xlsx格式的表格数据转换为字符串的方法
	 * @param cell
	 * @return
	 */
	private String getValue(XSSFCell cell) {
		if(cell==null) {
			 return "";
		 }else{
			 int dateFormate=cell.getCellStyle().getDataFormat();
			 if(dateFormate==14||dateFormate==178||dateFormate==180
					 ||dateFormate==181||dateFormate==181){
				 return getDateValue(cell);
			 }
			 String cellSring="";
			 
			 switch (cell.getCellType()) { 
			 case HSSFCell.CELL_TYPE_STRING: // 字符串  
				 cellSring = cell.getStringCellValue();
				 break;  
			 case HSSFCell.CELL_TYPE_NUMERIC: // 数字  
				 HSSFDataFormatter dataFormatter = new HSSFDataFormatter();
				 cellSring=dataFormatter.formatCellValue(cell);
				 break; 
			 case HSSFCell.CELL_TYPE_BOOLEAN: // Boolean 
				 cellSring=String.valueOf(cell.getBooleanCellValue());
				 break;  
			 case HSSFCell.CELL_TYPE_FORMULA: // 公式  
				 cellSring=String.valueOf(cell.getCellFormula());
				 break;  
			 case HSSFCell.CELL_TYPE_BLANK: // 空值  
				 cellSring=""; 
				 break;  
			 case HSSFCell.CELL_TYPE_ERROR: // 故障  
				 cellSring=""; 
				 break;  
			 default:  
				 cellSring="ERROR";  
				 break; 
			 }        
			 return cellSring;
		 }
    }
	/**
	 * 将xls格式表格数据转换为字符串的方法
	 * @param cell
	 * @return
	 */
	private String getValue(HSSFCell cell) {
		if (cell == null) {
			return "";
		} else {
			int dateFormate = cell.getCellStyle().getDataFormat();
			if (dateFormate == 14 || dateFormate == 178 || dateFormate == 180
					|| dateFormate == 181 || dateFormate == 181) {
				return getDateValue(cell);
			}
			String cellSring = "";
			switch (cell.getCellType()) {
			case HSSFCell.CELL_TYPE_STRING: // 字符串
				cellSring = cell.getStringCellValue();
				break;
			case HSSFCell.CELL_TYPE_NUMERIC: // 数字
				cellSring = String.valueOf(cell.getNumericCellValue());
				break;
			case HSSFCell.CELL_TYPE_BOOLEAN: // Boolean
				cellSring = String.valueOf(cell.getBooleanCellValue());
				break;
			case HSSFCell.CELL_TYPE_FORMULA: // 公式
				cellSring = String.valueOf(cell.getCellFormula());
				break;
			case HSSFCell.CELL_TYPE_BLANK: // 空值
				cellSring = "";
				break;
			case HSSFCell.CELL_TYPE_ERROR: // 故障
				cellSring = "";
				break;
			default:
				cellSring = "ERROR";
				break;
			}
			return cellSring;
		}
	}

	// 日期格式特殊处理
	private String getDateValue(XSSFCell xssfCell) {
		Date date = null;
		String time = "";
		try {
			date = xssfCell.getDateCellValue();
			time = DEFAULT_DATE_FORMAT.format(date);
		} catch (Exception e) {
			return "";
		}
		return time;
	}

	// 日期格式特殊处理
	private String getDateValue(HSSFCell cell) {
		Date date = null;
		String time = "";
		try {
			date = cell.getDateCellValue();
			time = DEFAULT_DATE_FORMAT.format(date);
		} catch (Exception e) {
			return "";
		}
		return time;
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
	
	
	
	/**
	 * 导出报文内容
	 */
	@Override
	public void exportPhaseFile(ModelMap modelMap,HttpServletRequest req,String userId,HttpServletResponse res) {
		//查询条件
		String[] noMust={"APP_ID","INTER_ID","INTER_VERSION"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, null, noMust);
		
		pmap.put("userid", userId);
		List<Map<String, String>> exportList=messImportDao.qContentList(pmap);
		//设置导出表的表头
		List<ExcelExportEntity> entity = new ArrayList<ExcelExportEntity>();
		String[] key={"类型","1级字段名(英文)","2级字段名(英文)","3级字段名(英文)","类型",
				"长度","是否必输","标准代码","内容说明","备注"};
		String[] value={"IN_OUT_TYPE","DATA_ENGNAME","DATA_ENGNAMEA","DATA_ENGNAMEB","DATA_TYPE_NAME",
				"MSG_LENGTH","IS_NECESSARY_NAME","STANDARD_CODE","DATA_INSTRUCTION","INFO_REMARK"};
		entity=ExcelExportEntityUtil.exportExcelContent(key,value);
		modelMap.put(MapExcelConstants.ENTITY_LIST, entity);
		modelMap.put(MapExcelConstants.MAP_LIST, exportList);
		modelMap.put(MapExcelConstants.FILE_NAME, "报文内容");
		modelMap.put(NormalExcelConstants.PARAMS, new ExportParams("报文输入输出内容","导出信息"));
		SingleExcelView sev=new SingleExcelView();
		try {
			sev.renderMergedOutputModel(modelMap,req,res);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	
	/**
	 * 导出ESB接口信息
	 */
	@Override
	public void exportEsbInter(ModelMap modelMap,HttpServletRequest req,String userId,HttpServletResponse res) {
		//查询条件
		String[] noMust={"apply_id","applicant","app_type","consumer_name",
				"ESBvice_name","inter_name","inter_code","trade_code","req_task_code"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, null, noMust);
		//要求完成时间较小值
		String req_finish_time = RequestUtils.getParamValue(req, "req_finish_time");
		if(req_finish_time!=null && !"".equals(req_finish_time)){
			if(req_finish_time.equals("点击选择")){
				req_finish_time=null;
			}
			pmap.put("req_finish_time",req_finish_time);
		}
		//要求完成时间较大值
		String req_finish_time1 = RequestUtils.getParamValue(req, "req_finish_time1");
		if(req_finish_time1!=null && !"".equals(req_finish_time1)){
			if(req_finish_time1.equals("点击选择")){
				req_finish_time1=null;
			}
			pmap.put("req_finish_time1",req_finish_time1);
		}
		pmap.put("userid", userId);
		//查询结果
		List<Map<String, String>> exportList=messImportDao.qAnalyseList(pmap);
		//设置导出表的表头
		List<ExcelExportEntity> entity = new ArrayList<ExcelExportEntity>();
		String[] key={"关联任务编号","接口名称","接口交易码","申请类型","接口申请状态",
				"消费方应用名称","服务方应用名称","要求完成日期","申请人","当前处理人","申请日期"};
		String[] value={"REQ_TASK_CODE","INTER_NAME","TRADE_CODE","APP_TYPE_NAME","INTER_APP_STATUS_NAME",
				"CON_SYSTEM_NAME","SER_SYSTEM_NAME","REQ_FINISH_TIME","APP_USER_NAME","CURRENT_MAN2","APP_TIME"};
		int[] width = {18,20,20,10,15,18,18,15,10,12,20};
//		entity=ExcelExportEntityUtil.exportExcelContent(key,value);

		for(int i=0;i<key.length;i++){
			entity.add(new ExcelExportEntity(key[i], value[i], width[i]));
		}
		
		modelMap.put(MapExcelConstants.ENTITY_LIST, entity);
		modelMap.put(MapExcelConstants.MAP_LIST, exportList);
		modelMap.put(MapExcelConstants.FILE_NAME, "接口申请信息");
		modelMap.put(NormalExcelConstants.PARAMS, new ExportParams("接口申请单","接口申请单"));
		SingleExcelView sev=new SingleExcelView();
		try {
			sev.renderMergedOutputModel(modelMap,req,res);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	
}





