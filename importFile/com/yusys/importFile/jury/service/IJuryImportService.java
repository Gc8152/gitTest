package com.yusys.importFile.jury.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartFile;

public interface IJuryImportService {
	public Map<String,String> importPhaseFile(HttpServletRequest req,String userid,MultipartFile file,int[]head_num, int []column_num);
	
}
