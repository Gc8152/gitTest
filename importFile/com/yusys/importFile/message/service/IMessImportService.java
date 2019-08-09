package com.yusys.importFile.message.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.ui.ModelMap;
import org.springframework.web.multipart.MultipartFile;

public interface IMessImportService {
	//导入报文内容
	public Map<String,Object> importPhaseFile(HttpServletRequest req,String userid,MultipartFile file,int[]head_num, int []column_num);
	//导出报文内容
	public void exportPhaseFile(ModelMap modelMap,HttpServletRequest req,String userId,HttpServletResponse res);
	//导出ESB接口信息
	public void exportEsbInter(ModelMap modelMap,HttpServletRequest req,String userId,HttpServletResponse res);

}
