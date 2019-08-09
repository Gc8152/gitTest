package com.yusys.service.help_solve;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.dao.SolutionDao;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;


@Service
@Transactional
public class SolutionService implements ISolutionService{

	
	@Resource
    private SolutionDao sSolutionDao;
	
	@Resource
	private TaskDBUtil taskDBUtil;

	@Override
	//查询全部
	public Map<String,Object> findProblemInfoAll(HttpServletRequest req,String userid) {	
		Map<String, Object> resultMap=new HashMap<String,Object>();
		//String problem_id=RequestUtils.getParamValue(req, "problem_id");
		Map<String, String> pmap=new HashMap<String, String>();
		//pmap.put("problem_id",problem_id);
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String,String>> list=sSolutionDao.findSolutionInfoAll(pmap);
		resultMap.put("rows", list);
		resultMap.put("total", pmap.get("total"));
		resultMap.put("result","true");
		resultMap.put("present_userid", userid);	//操作人
		return resultMap;
	}
	//查询
	@Override
	public Map<String, Object> findProblemInfoOne(HttpServletRequest req,String userid) {
		Map<String, Object> resultMap=new HashMap<String,Object>();
			Map<String, String> pmap=new HashMap<String, String>();		
			String limit = RequestUtils.getParamValue(req, "limit");
			String offset = RequestUtils.getParamValue(req, "offset");
			pmap.put("limit",limit);
			pmap.put("offset",offset);
			try {
				String problem_name=RequestUtils.getParamValue(req, "problem_name");
				try {
					problem_name=URLDecoder.decode(problem_name,"UTF-8");
				} catch (Exception e) {			
					e.printStackTrace();
				}	
				pmap.put("problem_name", "%"+problem_name+"%");
				//需求提出日期较小值
				String req_operation_date = RequestUtils.getParamValue(req, "req_operation_date");
				if(req_operation_date!=null && !"".equals(req_operation_date)){
					//req_operation_date=new String(req_operation_date.getBytes("ISO-8859-1"),"UTF-8");
					if(req_operation_date.equals("点击选择")){//解决ie8下初始赋值的情况
						req_operation_date=null;
					}
					pmap.put("req_operation_date",req_operation_date);
				}
			
				//需求提出日期较大值
				String req_operation_date1 = RequestUtils.getParamValue(req, "req_operation_date1");
				if(req_operation_date1!=null && !"".equals(req_operation_date1)){
					//req_operation_date1=new String(req_operation_date1.getBytes("ISO-8859-1"),"UTF-8");
					if(req_operation_date1.equals("点击选择")){
						req_operation_date1=null;
					}
					pmap.put("req_operation_date1",req_operation_date1);
				}
				List<Map<String,String>> list=sSolutionDao.findSolutionInfoOne(pmap);
				resultMap.put("rows", list);
				resultMap.put("total", pmap.get("total"));
				resultMap.put("result","true");
				return resultMap;	
			} catch (Exception e) {
				e.printStackTrace();
			}
			return resultMap;	
	}
	//增加信息
	@Override
	public Map<String, Object> findProblemInfoAdd(HttpServletRequest req,String userid) {
		Map<String, Object> resultMap =new HashMap<String, Object>();
		String file_id=RequestUtils.getParamValue(req, "file_id");
		try{		
			String[] must={"problem_name"};
			String[] noMust=new String[]{"problem_description","problem_solution"};
			String problem_id = taskDBUtil.getSequenceValByName("G_REQ_REQUIREMENT_INFOID");	//根据序列区id
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, noMust);
			if(pmap==null){
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("problem_id", problem_id);
			pmap.put("file_id",file_id);
			pmap.put("create_time", DateTimeUtils.getFormatCurrentTime());//操作时间
			pmap.put("create_id", userid);	//操作人
			sSolutionDao.findSolutionInfoAdd(pmap);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;		
	}
	//修改
	@Override
	public Map<String, Object> findProblemInfoUpdate(HttpServletRequest req,String userid)  {
		Map<String, Object> resultMap =new HashMap<String, Object>();
		try{	
			String[] must={"problem_name"};
			String[] noMust=new String[]{"problem_description","problem_solution"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, noMust);
			if(pmap==null){
				resultMap.put("result", "false");
				return resultMap;
			}
			//pmap.put("create_time", DateTimeUtils.getFormatCurrentTime());//操作时间
			sSolutionDao.findSolutionInfoUpdate(pmap);
			resultMap.put("result", "true");
			return resultMap;
		}catch(Exception e){
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;	
	}
	//删除
	@Override
	public Map<String, Object> findPrpblemInfoDelete(HttpServletRequest req,String userid) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		String problem_name=RequestUtils.getParamValue(req, "problem_name");
		try {
			problem_name=URLDecoder.decode(problem_name,"UTF-8");
		} catch (Exception e) {			
			e.printStackTrace();
		}	
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("problem_name", problem_name);
		try{
			sSolutionDao.findSolutionInfoDelete(pmap);	
			resultMap.put("result", "true");
			return resultMap;
		} catch(Exception e){
			e.printStackTrace();
			resultMap.put("result", "false");
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//查询business_code的file_id
	@Override
	public Map<String, Object> findProblemFile(HttpServletRequest req,String userid) 
	{
			Map<String, Object> resultMap=new HashMap<String, Object>();
			String business_code=RequestUtils.getParamValue(req, "business_code");
			Map<String, String> pmap=new HashMap<String, String>();
			pmap.put("business_code", business_code);
			try{
				List<Map<String,String>> list=sSolutionDao.findSolutionInfoFile(pmap);
				sSolutionDao.findSolutionFileDelete(pmap);
				resultMap.put("rows", list);
				resultMap.put("total", pmap.get("total"));
				resultMap.put("result","true");
				return resultMap;	
			} catch(Exception e){
				e.printStackTrace();
				resultMap.put("result", "false");
			}
			resultMap.put("result", "false");
			return resultMap;
	}
	//根据file_id删除附件  
	@Override
	public Map<String, Object> findProblemFileDelete(HttpServletRequest req,String userid) 
	{
			Map<String, Object> resultMap=new HashMap<String, Object>();
			String file_id=RequestUtils.getParamValue(req, "file_id");
			Map<String, String> pmap=new HashMap<String, String>();
			pmap.put("file_id", file_id);
			try{
				//List<Map<String,String>> list=sSolutionDao.findSolutionInfoFileID(pmap);
				sSolutionDao.findSolutionInfoFileDelete(pmap);	
				resultMap.put("result", "true");
				return resultMap;	
			} catch(Exception e){
				e.printStackTrace();
				resultMap.put("result", "false");
			}
			resultMap.put("result", "false");
			return resultMap;
	}
	
}