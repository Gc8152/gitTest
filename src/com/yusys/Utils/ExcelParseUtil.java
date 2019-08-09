package com.yusys.Utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 * 操作Excel
 * 
 * */
public class ExcelParseUtil {

	public static List<Map<String, Object>> getImportData(File file) throws IOException {
		return null;
	}

	/**
	 * 解析Excel行
	 * 
	 * @param row
	 * @param begin
	 * @param colcount
	 * @return
	 */
	public static Object[] parseRow(Row row, short begin, short colcount) {
		Object[] v = new Object[colcount];
		short lastCellNum = row.getLastCellNum();
		if (lastCellNum < 1) {
			return null;
		}
		for (short i = begin; i < colcount + begin; i++) {
			v[i - begin] = parseCell(row.getCell(i));
		}

		return v;
	}

	/**
	 * 解析Excel为给出的key Map格式
	 * 
	 * @param row
	 * @param beginColumn
	 * @param keys
	 * @return
	 */
	public static Map<String, Object> parseRow(Row row, short beginColumn, String[] keys) {
		if (keys == null || keys.length == 0) {
			return null;
		}
		Map<String, Object> map = new HashMap<String, Object> ();
		int colcount = keys.length;
		for (short i = beginColumn; i < colcount + beginColumn; i++) {
			map.put(keys[i - beginColumn], parseCell(row.getCell(i)));
		}
		return map;
	}

	/**
	 * 解析Excel单元格
	 * 
	 * @param c
	 * @return
	 */
	public static Object parseCell(Cell c) {
		if (c == null || c.getCellType() == Cell.CELL_TYPE_BLANK) {
			return "";
		} else if (c.getCellType() == Cell.CELL_TYPE_STRING) {
			return c.getRichStringCellValue().getString().trim();
		} else if (c.getCellType() == Cell.CELL_TYPE_NUMERIC) {
			if (DateUtil.isCellDateFormatted(c)) {
				//return String.valueOf(c.getDateCellValue());
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				return sdf.format(HSSFDateUtil.getJavaDate(c.getNumericCellValue())).toString();
			} else {
		
				double value = c.getNumericCellValue();
	            int intValue = (int) value;
	            String cellValue = value - intValue == 0 ? String.valueOf(intValue) : new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP).toPlainString();
	            return subZeroAndDot(cellValue);
			}
		} else if (c.getCellType() == Cell.CELL_TYPE_FORMULA) {
			return String.valueOf(c.getNumericCellValue());
		} else {
			return "";
		}
	}

	/**
	 * 
	 * @param wb
	 * @return
	 */
	public static List<Sheet> listSheets(Workbook wb) {
		int numOfSheets = wb.getNumberOfSheets();
		List<Sheet> shs = new ArrayList<Sheet> ();
		for (int i = 0; i < numOfSheets; i++) {
			shs.add(wb.getSheetAt(i));
		}
		return shs;
	}

	/**
	 * 解析EXCEL成List<Object[]>
	 * 
	 * @param path
	 * @param beginRowIndex
	 * @param beginColumn
	 * @param colcount
	 * @return
	 */
	public static List<Object[]> parseWorkbook(File path, int beginRowIndex, int endRowIndex, short beginColumn, short colcount,int page) throws IOException {
		List<Object[]> list = new ArrayList<Object[]> ();
		if (path == null)
			return list;

		Workbook wb = null;
		String fileName = path.getName().toLowerCase();
		if (fileName.endsWith("xls")) {
			wb = new HSSFWorkbook(new FileInputStream(path));
		} else if (fileName.endsWith("xlsx")) {
			wb = new XSSFWorkbook(new FileInputStream(path));
		}
		list = parseWorkbook(wb, beginRowIndex, endRowIndex, beginColumn, colcount,page);

		return list;
	}
	
	/**
	 * 获取文件信息
	 * @param path
	 * @return
	 * @throws IOException
	 */
	public static Workbook getWordbook(File path) throws IOException{
		Workbook wb = null;
		String fileName = path.getName().toLowerCase();
		if (fileName.endsWith("xls")) {
			wb = new HSSFWorkbook(new FileInputStream(path));
		} else if (fileName.endsWith("xlsx")) {
			wb = new XSSFWorkbook(new FileInputStream(path));
		}
		return wb;
	}
	
	
	public static Sheet getSheet(File path) throws IOException {
		Workbook wb = null;
		String fileName = path.getName().toLowerCase();
		if (fileName.endsWith("xls")) {
			wb = new HSSFWorkbook(new FileInputStream(path));
		} else if (fileName.endsWith("xlsx")) {
			wb = new XSSFWorkbook(new FileInputStream(path));
		}
		return wb.getSheetAt(0);
	}

	/**
	 * 解析HSSFWorkbook
	 * 
	 * @param ins
	 * @param beginRowIndex 开始行（从0开始）
	 * @param rowcount 行总数（从0开始）
	 * @param beginColumn 开始列（从0开始）
	 * @param colcount 列总数
	 * @return
	 */
	public static List<Object[]> parseHSSFWorkbook(InputStream ins, int beginRowIndex, int rowcount, short beginColumn, short colcount,int page) throws IOException {

		List<Object[]> list = new ArrayList<Object[]> ();
		if (ins == null) {
			return list;
		}
		Workbook wb = new HSSFWorkbook(ins);
		list = parseWorkbook(wb, beginRowIndex, rowcount, beginColumn, colcount, page);
		return list;
	}

	/**
	 * 解析HSSFWorkbook
	 * 
	 * @param ins
	 * @param beginRowIndex 开始行（从0开始）
	 * @param rowcount 行总数（-1表示默认行）
	 * @param beginColumn 开始列（从0开始）
	 * @param colcount 列总数
	 * @return
	 */
	public static List<Object[]> parseXSSFWorkbook(InputStream ins, int beginRowIndex, int rowcount, short beginColumn, short colcount,int page) throws IOException {
		List<Object[]> list = new ArrayList<Object[]> ();
		if (ins == null) {
			return list;
		}

		Workbook wb = new XSSFWorkbook(ins);
		list = parseWorkbook(wb, beginRowIndex, rowcount, beginColumn, colcount,page);

		return list;
	}

	/**
	 * 解析HSSFWorkbook 会把一个EXCEL文件的所有工作簿都读出来
	 * 
	 * @param wb
	 * @param beginRowIndex
	 * @param endRowIndex
	 * @param beginColumn
	 * @param colcount
	 * @return
	 */
	public static List<Object[]> parseWorkbook(Workbook wb, int beginRowIndex, int rowcount, short beginColumn, short colcount,int page) {
		List<Object[]> list = new ArrayList<Object[]> ();
		if (wb == null) {
			return list;
		}
		Sheet sheet = wb.getSheetAt(page);
		List<Object[]> listObj = parseSheet(sheet, beginRowIndex, rowcount, beginColumn, colcount);
		if(listObj.size()>0){
			list.addAll(listObj);
		}
		return list;
	}

	/**
	 * 解析HSSFSheet
	 * 
	 * @param sheet
	 * @param beginRowIndex
	 * @param endRowIndex
	 * @param beginColumn
	 * @param colcount
	 * @return
	 */
	public static List<Object[]> parseSheet(Sheet sheet, int beginRowIndex, int rowcount, short beginColumn, short colcount) {
		List<Object[]> list = new ArrayList<Object[]> ();
		if (sheet == null) {
			return list;
		}
		if (rowcount == -1) {
			rowcount = sheet.getLastRowNum();
		}
		if (sheet.getRow(rowcount) == null) {
			return list;
		}
		for (int j = beginRowIndex; j <= rowcount; j++) {
			list.add(parseRow(sheet.getRow(j), beginColumn, colcount));
		}
		return list;
	}

	public static List<Map<String, Object>> parseSheet(Sheet sheet, int beginRowIndex, int rowcount, short beginColumn, String[] keys) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>> ();

		if (sheet == null || keys == null || keys.length == 0) {
			return list;
		}
		if (rowcount < 0) {
			rowcount = sheet.getLastRowNum();
		}
		for (int j = beginRowIndex; j <= rowcount; j++) {
			Map<String, Object> map = parseRow(sheet.getRow(j), beginColumn, keys);
			if (map != null && !map.isEmpty()) {
				list.add(map);
			}
		}
		return list;
	}

	/**
	 * 将Excel某一列读成key为参数keys的Map
	 * 
	 * @param sheet
	 * @param beginRowIndex 开始行（从0开始）
	 * @param colIndex 列标（从0开始）
	 * @param keys
	 * @return
	 */
	public static Map<String, Object> parseSheet(Sheet sheet, int beginRowIndex, short colIndex, String[] keys) {
		Map<String, Object> map = new HashMap<String, Object> ();
		if (sheet == null || keys == null || keys.length == 0) {
			return map;
		}
		int rowcount = keys.length;
		for (int j = beginRowIndex; j <= rowcount; j++) {
			map.put(keys[j = beginRowIndex], parseCell(sheet.getRow(j).getCell(colIndex)));
		}
		return map;
	}


	public static List<CellRangeAddress> getCombineCell(Sheet sheet) {
		List<CellRangeAddress> list = new ArrayList<CellRangeAddress> ();
		int sheetmergerCount = sheet.getNumMergedRegions(); // 遍历合并单元格
		for (int i = 0; i < sheetmergerCount; i++) { // 获得合并单元格加入list中
			CellRangeAddress ca = sheet.getMergedRegion(i);
			if (ca.getLastRow() > 1) continue;
			list.add(ca);
		}

		CellRangeAddress min = null;
		for (int i = 0; i < list.size(); i++) {
			min = list.get(i);
			int pos = i;
			for (int j = i + 1; j < list.size(); j++) {
				CellRangeAddress next = list.get(j);
				if (next.getFirstColumn() < min.getFirstColumn()) {
					min = next;
					pos = j;
				}
			}
			list.set(pos, list.get(i));
			list.set(i, min);
		}
		return list;
	}

	public static Boolean isCombineCell(List<CellRangeAddress> listCombineCell,
		HSSFCell cell, HSSFSheet sheet) {
		int firstC = 0;
		int lastC = 0;
		int firstR = 0;
		int lastR = 0;
		for (CellRangeAddress ca: listCombineCell) {
			// 获得合并单元格的起始行, 结束行, 起始列,结束列
			firstC = ca.getFirstColumn();
			lastC = ca.getLastColumn();
			firstR = ca.getFirstRow();
			lastR = ca.getLastRow();
			if (cell.getColumnIndex() <= lastC && cell.getColumnIndex() >= firstC) {
				if (cell.getRowIndex() <= lastR && cell.getRowIndex() >= firstR) {
					return true;
				}
			}
		}
		return false;
	}
	public static String subZeroAndDot(String s){  
        if(s.indexOf(".") > 0){  
            s = s.replaceAll("0+?$", "");//去掉多余的0  
            s = s.replaceAll("[.]$", "");//如最后一位是.则去掉  
        }  
        return s;  
    }  
	public static void main(String[] args) {
		File file = new File("d:\\133776081250303.xlsx");
		try {

			List<Object[]> list = ExcelParseUtil.parseWorkbook(file, 0, -1, Short.parseShort("0"), Short.parseShort("15"),0);
			System.out.println(list.toString());
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}