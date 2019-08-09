package com.yusys.Utils;

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
public abstract class ImportExcel {

	public final static DateFormat DEFAULT_DATE_FORMAT = new SimpleDateFormat(
			"yyyy-MM-dd");
	/**
	 * 保存行数据
	 * @param userid
	 * @param rowData
	 * @return 大于0保存成功小于或者等于0保存失败
	 */
	public String saveRowData(String userid,List<String> rowData,int numSheet,Map<String,String> pmap){
		return null;
	}
	/**
	 * 保存excel表单数据
	 * @param userid
	 * @param rowData
	 * @return 大于0保存成功小于或者等于0保存失败
	 */
	public String saveFormData(String userid,List<List<String>> rowsData,int numSheet,Map<String,String> pmap){
		return null;
	}
	
	/**
	 * 
	 * @param req
	 * @param file
	 * @param column_num 列數量
	 * @return
	 * @throws Exception 
	 */
	public Map<String, String> importExcel(MultipartFile file,String userid,int[] head_num,int []column_num,Map<String,String> pmap){
		return importExcel(file,userid,head_num,column_num,0,pmap);
	}
	/**
	 * 
	 * @param req
	 * @param file
	 * @param column_num 列數量
	 * @return
	 * @throws Exception 
	 */
	public Map<String, String> importExcel(MultipartFile file,String userid,int[] head_num,int []column_num,int maxSheet_num,Map<String,String> pmap){
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
	private Map<String, String> importXLS(InputStream is,String userid,int[] head_num,int []column_num,int maxSheet_num,Map<String,String> pmap){
		Map<String, String> map = new HashMap<String, String>();
		try {
			HSSFWorkbook hssfWorkbook = new HSSFWorkbook(is);
			// 读取表格
			for (int numSheet = 0; numSheet < hssfWorkbook.getNumberOfSheets(); numSheet++) {
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
						String rs=saveRowData(userid,rowData,numSheet,pmap);
						if(rs!=null&&!"".equals(rs.trim())){
							throw new RuntimeException("第"+(numSheet+1)+"页签"+"第"+currentNum+"行，"+rs);
						}
						formData.add(rowData);
					}
				}
				String rs=saveFormData(userid,formData,numSheet,pmap);
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
	private Map<String, String> importXLSX(InputStream is,String userid,int[] head_num,int column_num[],int maxSheet_num,Map<String,String> pmap){
		Map<String, String> map = new HashMap<String, String>();
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
						String rs=saveRowData(userid,rowData,numSheet,pmap);
						if(rs!=null&&!"".equals(rs.trim())){
							throw new RuntimeException("第"+(numSheet+1)+"页签"+"第"+currentNum+"行:"+rs);
						}
						formData.add(rowData);
					}
				}
				String rs=saveFormData(userid,formData,numSheet,pmap);
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
