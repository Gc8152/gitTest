package com.yusys.Utils;

import java.util.ArrayList;
import java.util.List;

import org.jeecgframework.poi.excel.entity.params.ExcelExportEntity;

public class ExcelExportEntityUtil {
	public static List<ExcelExportEntity> exportExcelContent(String[] key,String[] value){
		List<ExcelExportEntity> entity= new ArrayList<ExcelExportEntity>();
		if(key.length==value.length){
			for(int i=0;i<key.length;i++){
				entity.add(new ExcelExportEntity(key[i],value[i]));
			}
		}
		return entity;
	}

}
