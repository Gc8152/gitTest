package com.yusys.service.help_solve;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;


public interface ISolutionService {
	
	//查询全部
	public Map<String, Object>  findProblemInfoAll(HttpServletRequest req, String userId);
	
	//添加信息
	public Map<String, Object>  findProblemInfoAdd(HttpServletRequest req, String userId);

	 //删除  
    public Map<String, Object> findPrpblemInfoDelete(HttpServletRequest req,String userid);
    
    //查询business_code的file_id 
    public Map<String, Object> findProblemFile(HttpServletRequest req,String userid);
   
  //根据file_id删除附件   
    public Map<String, Object> findProblemFileDelete(HttpServletRequest req,String userid);
    
  //修改
    public Map<String, Object> findProblemInfoUpdate(HttpServletRequest req, String userId);
    
	//查询一个信息
    public Map<String, Object> findProblemInfoOne(HttpServletRequest req,String userid);

}

