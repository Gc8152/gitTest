package com.yusys.Utils;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Workbook;
import org.jeecgframework.poi.excel.entity.params.ExcelExportEntity;
import org.jeecgframework.poi.excel.export.styler.ExcelExportStylerBorderImpl;
/**
 * Excel 自定义styler 的例子
 * @author houhf
 *   2015年3月29日 下午9:04:41
 */
public class ExcelExportStatisticStyler extends ExcelExportStylerBorderImpl {
    private CellStyle contextCellStyle;
    public ExcelExportStatisticStyler(Workbook workbook) {
        super(workbook);
        createContextCellStyle();
    }
    private void createContextCellStyle() {
    	contextCellStyle = workbook.createCellStyle();
    	contextCellStyle.setBorderLeft((short) 1); // 左边框
    	contextCellStyle.setBorderRight((short) 1); // 右边框
    	contextCellStyle.setBorderBottom((short) 1);//下边框
    	contextCellStyle.setBorderTop((short) 1);//上边框
    	contextCellStyle.setAlignment(CellStyle.ALIGN_LEFT);//内容居左
    	contextCellStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);//垂直居中
    	contextCellStyle.setDataFormat(STRING_FORMAT);//数据格式
    	contextCellStyle.setWrapText(false);
        HSSFDataFormat df = (HSSFDataFormat) workbook.createDataFormat();  //此处设置数据格式  
        contextCellStyle.setDataFormat(df.getFormat("#,#0.00")); //数据格式只显示整数，如果是小数点后保留两位，可以写contentStyle.setDataFormat(df.getFormat("#,#0.00"));  

    }
    @Override
    public CellStyle getStyles(boolean noneStyler, ExcelExportEntity entity) {
        return contextCellStyle;
    }
}
