package com.yusys.Utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDataFormatter;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

/**
 * 上传Excel的公用类
 * 
 * @author Administrator
 * 
 */
public abstract class ImportExcel2 {
	public final static DateFormat DEFAULT_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");
	/**
	 * 保存行数据
	 * @param userid
	 * @param rowData
	 * @return 大于0保存成功小于或者等于0保存失败
	 */
	public String saveRowData(String userid,List<String> rowData,int numSheet){
		return null;
	}
	/**
	 * 保存excel表单数据
	 * @param userid
	 * @param rowData
	 * @return 大于0保存成功小于或者等于0保存失败
	 */
	public String saveFormData(String userid,List<List<String>> rowsData,int numSheet){
		return null;
	}
	/**
	 *  
	 * @param req
	 * @param file
	 * @param column_num 列数量 第一个数表示第一个Sheet 的列数
	 * @param head_num 表头数量 第一个数表示第一个Sheet 的表头行数
	 * @return
	 * @throws Exception 
	 */
	public Map<String, String> importExcel(MultipartFile file,String userid,int[] head_num,int []column_num){
		return importExcel(file,userid,head_num,column_num,0);
	}
	/**
	 * 
	 * @param req
	 * @param file
	 * @param column_num 列數量
	 * @return
	 * @throws Exception 
	 */
	public Map<String, String> importExcel(MultipartFile file,String userid,int[] head_num,int []column_num,int maxSheet_num){
		Map<String, String> map = new HashMap<String, String>();
		String fileName = file.getOriginalFilename();
		// 获取文件拓展名
		String extendName = fileName.substring(fileName.lastIndexOf(".") + 1,
				fileName.length());
		// 拓展名是xls
		InputStream is;
		try {
			is = file.getInputStream();
			if (extendName.equals("xls")) {
				return importXLS(is,userid,head_num,column_num,maxSheet_num);
			}else if (extendName.equals("xlsx")) {
				return importXLSX(is,userid,head_num,column_num,maxSheet_num);
			}
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		return map;
	}
	/**
	 *  
	 * @param req
	 * @param file
	 * @param column_num 列數量 第一个数表示第一个Sheet 的列数
	 * @param head_num 表头數量 第一个数表示第一个Sheet 的表头行数
	 * @return
	 * @throws Exception 
	 */
	public Map<String, String> importExcelSycn(File file,String userid,int[] head_num,int []column_num){
		return importExcelSycn(file,userid,head_num,column_num,0);
	}
	/**
	 * 
	 * @param req
	 * @param file
	 * @param column_num 列數量
	 * @return
	 * @throws Exception 
	 */
	public Map<String, String> importExcelSycn(File file,String userid,int[] head_num,int []column_num,int maxSheet_num){
		Map<String, String> map = new HashMap<String, String>();
		String fileName = file.getName();
		// 获取文件拓展名
		String extendName = fileName.substring(fileName.lastIndexOf(".") + 1,
				fileName.length());
		// 拓展名是xls
		InputStream is;
		try {
			is = new FileInputStream(file);
			if (extendName.equals("xls")) {
				return importXLS(is,userid,head_num,column_num,maxSheet_num);
			}else if (extendName.equals("xlsx")) {
				return importXLSX(is,userid,head_num,column_num,maxSheet_num);
			}
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		return map;
	}
	/**
	 * 流 导入
	 * @param is
	 * @param userid
	 * @param head_num
	 * @param column_num
	 * @param maxSheet_num
	 * @return
	 */
	public Map<String, String> importXLSSync(InputStream is,String userid,int[] head_num,int []column_num,int maxSheet_num){
		return importXLS(is,userid,head_num,column_num,maxSheet_num); 
	}
	/**
	 * 系统导入XLS格式表格
	 * @param is 文件流 Excel对象
	 * @param userid 当前用户
	 * @param head_num 表格每个sheet页表头行数
	 * @param column_num 表格列数
	 * @param maxSheet_num sheet页最大个数
	 * @return 返回结果（错误提示信息）
	 */
	private Map<String, String> importXLS(InputStream is,String userid,int[] head_num,int []column_num,int maxSheet_num){
		Map<String, String> map = new HashMap<String, String>();
		try {
			HSSFWorkbook hssfWorkbook = (HSSFWorkbook)new HSSFWorkbook(is);//获取Excel表格
			// 读取表格 遍历表格sheet页
			int sheetNum=hssfWorkbook.getNumberOfSheets();//excel表格sheet页数目
			int headrowNum=head_num.length;//excel表头行数
			int y=hssfWorkbook.getNumberOfSheets();
			for (int numSheet = 0; numSheet < y; numSheet++) {//遍历页面sheet页
				HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(numSheet);//获取当前sheet对象
//				if (hssfSheet == null) {
//					break;
//				}
				if(numSheet>=headrowNum){//当sheet页的个数大于等于预设定的表头的个数时 跳出当前循环
					break;
				}
				int currentNum=head_num[numSheet];
				List<List<String>> formData=new ArrayList<List<String>>();
				// 读取每一行
				int x=hssfSheet.getLastRowNum();
				for (int rowNum = head_num[numSheet]; rowNum <=x; rowNum++) {
					HSSFRow hssfRow = hssfSheet.getRow(rowNum);
					currentNum++;
					if (hssfRow != null) {
						List<String> rowData=new ArrayList<String>();
						for (int i = 0; i <column_num[numSheet]; i++) {
							rowData.add(getValue(hssfRow.getCell(i)));
						}
						String rs=saveRowData(userid,rowData,numSheet);
						if(rs!=null&&!"".equals(rs.trim())){
							throw new RuntimeException("第"+(numSheet+1)+"页签"+"第"+currentNum+"行，"+rs);
						}
						formData.add(rowData);
					}
				}
				String rs=saveFormData(userid,formData,numSheet);
				if(rs!=null&&!"".equals(rs.trim())){
					throw new RuntimeException("第"+(numSheet+1)+"页签"+rs);
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
	 * 導入XLSX格式的Excel
	 * @param is
	 * @param column_num
	 * @return
	 * @throws Exception 
	 */
	private Map<String, String> importXLSX(InputStream is,String userid,int[] head_num,int column_num[],int maxSheet_num){
		Map<String, String> map = new HashMap<String, String>();
		try {
			XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
			int sheetNum=xssfWorkbook.getNumberOfSheets();
			for (int numSheet = 0; numSheet <sheetNum; numSheet++) {
				if(numSheet>=head_num.length){
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
						String rs=saveRowData(userid,rowData,numSheet);
						if(rs!=null&&!"".equals(rs.trim())){
							throw new RuntimeException("第"+(numSheet+1)+"页签"+"第"+currentNum+"行:"+rs);
						}
						formData.add(rowData);
					}
				}
				String rs=saveFormData(userid,formData,numSheet);
				if(rs!=null&&!"".equals(rs.trim())){
					throw new RuntimeException("第"+(numSheet+1)+"页签"+rs);
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
}
