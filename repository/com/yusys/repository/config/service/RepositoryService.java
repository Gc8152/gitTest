package com.yusys.repository.config.service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.repository.config.dao.RepositoryDao;
@Service
@Transactional
public class RepositoryService implements IRepositoryService{
	
	private static final Logger logger = Logger.getLogger(RepositoryService.class);
	
	@Resource
    private TaskDBUtil taskDBUtil;
	@Resource
	private RepositoryDao repositoryDao;
	
	//保存知识
		@Override
		public Map<String, String> saveIntell(HttpServletRequest req, String userid) {
			Map<String, String> resultMap =new HashMap<String, String>();
			try{
				
				
				String[] must=new String[]{};
				String[] noMust=new String[]{"INTELL_ID","INTELL_CODE","TITLE","CATEGORY_CODE",
						"CATEGORY_NAME","STATUS","STATUS_NAME","CONTENT","FILE_ID","VERSION_CODE","UPDATE_EXPLAIN"};
				Map<String, String> pmap=RequestUtils.requestToMap(req, must, noMust);
				if(pmap==null){
					resultMap.put("result", "false");
					return resultMap;
				}
				String intell_id = pmap.get("INTELL_ID");
				String status = pmap.get("STATUS");
				String update_explain = pmap.get("UPDATE_EXPLAIN");
				if(null != intell_id && !"".equals(intell_id)  ){
					if("00".equals(status)) {//修改(草拟)
						pmap.put("UPDATE_PERSON", userid);
						pmap.put("UPDATE_TIME", DateTimeUtils.getFormatCurrentTime());
					}else if("01".equals(status)||"02".equals(status)){//01已发布02取消发布
						pmap.put("RELEASE_PERSON", userid);
						pmap.put("RELEASE_TIME", DateTimeUtils.getFormatCurrentTime());
						pmap.put("UPDATE_EXPLAIN", update_explain);
						pmap.put("UPDATE_PERSON", userid);
						pmap.put("UPDATE_TIME", DateTimeUtils.getFormatCurrentTime());
					}
					repositoryDao.updateRepositoryInfo(pmap);
					
					//添加版本信息
					pmap.put("UPDATE_PERSON", userid);
					pmap.put("UPDATE_TIME", DateTimeUtils.getFormatCurrentTime());
					
					//INTELL_ID,VERSION_CODE,CONTENT,UPDATE_PERSON,UPDATE_TIME,TITLE,UPDATE_EXPLAIN
					repositoryDao.insertRepositoryContent(pmap);
					//repositoryDao.updateRepositoryContent(pmap);
				}else {//新增
					intell_id = taskDBUtil.getSequenceValByName("K_SEQ_INTELL_ID");//获取序列
					if(intell_id.length()<=1){
						intell_id="0000"+intell_id;
					}else if(intell_id.length()==2){
						intell_id="000"+intell_id;
					}else if(intell_id.length()==3){
						intell_id="00"+intell_id;
					}else if(intell_id.length()==4){
						intell_id="0"+intell_id;
					}
					pmap.put("INTELL_ID", intell_id);	
					pmap.put("INTELL_CODE", "m_"+intell_id);
					pmap.put("STATUS", "00");//草拟
					pmap.put("CREATE_PERSON", userid);
					pmap.put("CREATE_TIME", DateTimeUtils.getFormatCurrentTime());
					repositoryDao.insertRepository(pmap);
					
					
				}
				resultMap.put("result", "true");
				resultMap.put("msg", "保存成功");
				return resultMap;
			}catch(Exception e){
				e.printStackTrace();
			}
			resultMap.put("result", "false");
			return resultMap;		
		}
	/*
	  * 查列表
	  * 
	  */
	@Override
	public Map<String, Object> queryIntell(HttpServletRequest req, String userid) {

		Map<String, Object> resultMap = new HashMap<String, Object>();
		String[]must=new String[]{"limit","offset"};	//分页用的
		String[]nomust=new String[]{"CATEGORY_CODE","TITLE","STATUS"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);		
		if (pmap==null) {
			resultMap.put("result", "false");
			resultMap.put("mess", "缺少必填项!");
			return resultMap;
		}
		try {		
			List<Map<String, String>> list = repositoryDao.queryAllRepositoryList(pmap);			
			resultMap.put("rows", list);
			resultMap.put("total", pmap.containsKey("total")?pmap.get("total"):list.size());
			resultMap.put("result","true");
		} catch (Exception e) {
			logger.info("操作  RepositoryService.queryIntell 出错 uri为 --->>>" + req.getRequestURI());
			e.printStackTrace();
		}
		return resultMap;
		
	}
	/*
	  * 查询类别
	  */
	@Override
	public Map<String, Object> getCategoryCode(HttpServletRequest req, String userid) {
		
		String CATEGORY_CODE_TOP = RequestUtils.getParamValue(req, "CATEGORY_CODE_TOP");
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("CATEGORY_CODE_TOP", CATEGORY_CODE_TOP);
		try {		
			List<Map<String, String>> list = repositoryDao.getCategoryCode(resultMap);			
			resultMap.put("rows", list);
			resultMap.put("result", "true");
			//resultMap.put("total", pmap.containsKey("total")?pmap.get("total"):list.size());
		} catch (Exception e) {
			logger.info("操作  RepositoryService.getCategoryCode 出错 uri为 --->>>" + req.getRequestURI());
			resultMap.put("result", "false");
			e.printStackTrace();
		}
		return resultMap;
		
	}
	
	//删除
	@Override
	public Map<String, Object> cannelOroverdueOrDelete(HttpServletRequest req, String userId) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, String> pmap = new HashMap<String, String>();
		String intell_id = RequestUtils.getParamValue(req, "INTELL_ID");
		String type = RequestUtils.getParamValue(req, "TYPE");
		pmap.put("INTELL_ID", intell_id);
		//pmap.put("is_delete", "01");// 
		try {
			if(intell_id !=null) {
				if(type!="" && "cannel".equals(type)) {//对已发布修改状态
					pmap.put("STATUS","02");
					repositoryDao.cannelOroverdueOrDelete(pmap); 
				}else if(type!="" && "overdue".equals(type)) {//
					pmap.put("STATUS","03");
					repositoryDao.cannelOroverdueOrDelete(pmap); 
				}else if(type!="" && "delete".equals(type)) {
					pmap.put("STATUS","04");
					repositoryDao.delete(pmap); //物理删除
				}
				
				resultMap.put("result", "true");
			}
		} catch (Exception e) {
			logger.info("操作  RepositoryService.cannelOroverdueOrDelete 出错 uri为 --->>>" + req.getRequestURI());
			resultMap.put("result", "false");
			e.printStackTrace();
		}
		return resultMap;
	}
	//发布
	@Override
	public Map<String, Object> releaseRepository(HttpServletRequest req, String userid) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			String[] must=new String[]{};
			String[] noMust=new String[]{"INTELL_ID","INTELL_CODE","TITLE","CATEGORY_CODE",
					"CATEGORY_NAME","STATUS","STATUS_NAME","CONTENT","FILE_ID","VERSION_CODE","UPDATE_EXPLAIN"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, noMust);
			String intell_id=pmap.get("INTELL_ID");
			String status=pmap.get("STATUS");
			if(intell_id !=null) {
				//pmap.put("INTELL_ID", intell_id);
				if((status!=""&&"00".equals(status))||(status!=""&&"02".equals(status))) {
					String version_code=pmap.get("VERSION_CODE");
					if(null!=version_code &&!"".equals(version_code)) {
					int version=Integer.parseInt(version_code.substring(1, version_code.length()-2))+1;
					pmap.put("VERSION_CODE", "V"+version+".0");
					}else {
						pmap.put("VERSION_CODE", "V1.0");
					}
					pmap.put("STATUS","01");
					pmap.put("RELEASE_PERSON", userid);
					pmap.put("RELEASE_TIME", DateTimeUtils.getFormatCurrentTime());
					repositoryDao.releaseRepository(pmap);
					//repositoryDao.releaseRepositoryContent(pmap);
					//添加版本信息
					pmap.put("UPDATE_PERSON", userid);
					pmap.put("UPDATE_TIME", DateTimeUtils.getFormatCurrentTime());
					
					//INTELL_ID,VERSION_CODE,CONTENT,UPDATE_PERSON,UPDATE_TIME,TITLE,UPDATE_EXPLAIN
					repositoryDao.insertRepositoryContent(pmap);
				
				}
				resultMap.put("result", "true");
			}
		} catch (Exception e) {
			logger.info("操作  RepositoryService.releaseRepository 出错 uri为 --->>>" + req.getRequestURI());
			resultMap.put("result", "false");
			e.printStackTrace();
		}
		return resultMap;
	}
	//根据版本查询知识详情
	@Override
	public Map<String, Object> queryIntellByVersion(HttpServletRequest req, String userId) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		//String[]must=new String[]{"limit","offset"};	//分页用的
		String[]nomust=new String[]{"INTELL_ID","VERSION_CODE"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, null, nomust);		
		if (pmap==null) {
			resultMap.put("result", "false");
			resultMap.put("mess", "缺少必填项!");
			return resultMap;
		}
		try {		
			List<Map<String, String>> list = repositoryDao.queryIntellByVersion(pmap);			
			resultMap.put("rows", list);
			resultMap.put("total", pmap.containsKey("total")?pmap.get("total"):list.size());
		} catch (Exception e) {
			logger.info("操作  RepositoryService.queryIntellByVersion 出错 uri为 --->>>" + req.getRequestURI());
			e.printStackTrace();
		}
		return resultMap;
	}
	//根据id查询全部的版本
	@Override
	public Map<String, Object> queryAllVersion(HttpServletRequest req, String userId) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String[]must=new String[]{"limit","offset","INTELL_ID"};	//分页用的
		String[]nomust=new String[]{};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);	
		//String intell_id=req.getParameter("INTELL_ID");
		
		if (pmap==null) {
			resultMap.put("result", "false");
			resultMap.put("mess", "缺少必填项!");
			return resultMap;
		}
		try {	
			//pmap.put("INTELL_ID", intell_id);
			List<Map<String, String>> list = repositoryDao.queryAllVersionList(pmap);			
			resultMap.put("rows", list);
			resultMap.put("result","true");
			resultMap.put("total", pmap.containsKey("total")?pmap.get("total"):list.size());
		} catch (Exception e) {
			logger.info("操作  RepositoryService.queryAllVersion 出错 uri为 --->>>" + req.getRequestURI());
			e.printStackTrace();
		}
		return resultMap;
	}
	//根据类别编号查询该类别树下全部的列表 
	@Override
	public List<Map<String, String>> queryOneCategoryTreeList(HttpServletRequest req, String userId) {
		try {
			String CATEGORY_CODE = req.getParameter("CATEGORY_CODE");
			//String category_code = RequestUtils.getParamValue(req, "CATEGORY_CODE");
			if(null != CATEGORY_CODE  && !"".equals(CATEGORY_CODE)){
				List<Map<String, String>> list= repositoryDao.queryOneCategoryTreeList(CATEGORY_CODE);
				return list;
			}
		} catch (Exception e) {
			logger.info("操作  RepositoryService.queryOneCategoryTreeList 出错 uri为 --->>>" + req.getRequestURI());
			e.printStackTrace();
		}
		return null;
	}
	//查询该属于该类别的全部
	@Override
	public Map<String, Object> queryBelongCategoryList(HttpServletRequest req, String userId) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String[]must=new String[]{"limit","offset"};	//分页用的
		String[]nomust=new String[]{"CATEGORY_CODE","TITLE","STATUS","START_TIME","END_TIME"};
		Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);		
		if (pmap==null) {
			resultMap.put("result", "false");
			resultMap.put("mess", "缺少必填项!");
			return resultMap;
		}
		try {		
			List<Map<String, String>> list = repositoryDao.queryBelongCategoryList(pmap);			
			resultMap.put("rows", list);
			resultMap.put("total", pmap.containsKey("total")?pmap.get("total"):list.size());
			resultMap.put("result","true");
		} catch (Exception e) {
			logger.info("操作  RepositoryService.queryBelongCategoryList 出错 uri为 --->>>" + req.getRequestURI());
			e.printStackTrace();
		}
		return resultMap;
	}
	/** ****************************************类别配置**************************************************  */
	@Override
	public List<Map<String, String>> queryAllCategory(HttpServletRequest req, String userId) {
		
		try {
			String category_code = req.getParameter("CATEGORY_CODE");
			if(category_code==null||"".equals(category_code)){
				category_code="0";
				}
			List<Map<String, String>> list= repositoryDao.queryAllCategory(category_code);
				
			return list;
		} catch (Exception e) {
			logger.info("操作  RepositoryService.queryAllCategory 出错 uri为 --->>>" + req.getRequestURI());
			e.printStackTrace();
		}
		return null;
		
	}
	//根据类别编号查询详情
	@Override
	public Map<String, String> findOneCategoryByNo(HttpServletRequest req, String userId) {
		String category_code=RequestUtils.getParamValue(req, "CATEGORY_CODE");
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("CATEGORY_CODE", category_code);
		try {
			 Map<String, String> map=repositoryDao.findOneCategoryByNo(pmap);
			 return map;
		} catch (Exception e) {
			logger.info("操作  RepositoryService.findOneCategoryByNo 出错 uri为 --->>>" + req.getRequestURI());
			e.printStackTrace();
		}
		return null;
	}
	//添加类别
	@Override
	public Map<String, Object> createCategory(HttpServletRequest req, String userId) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		try {
			//必填参数列表
			String[] must=new String[]{"CATEGORY_CODE","CATEGORY_NAME","ORDER_NO","CATEGORY_CODE_TOP","CATEGORY_NAME_TOP","TYPE"};
			//非必填的参数列表
			String[] nomust=new String[]{"CATEGORY_EXPLAIN","MENU_ICON","FLAG"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				resultMap.put("msg", "缺少必填项!");
				return resultMap;
			}
			
			String type=pmap.get("TYPE");
			if(type!=null&&"add".equals(type)) {
				//验证编号是否重复
				pmap.put("CATEGORY_CODE", pmap.get("CATEGORY_CODE").toLowerCase());
				Map<String,String>map=repositoryDao.findOneCategoryByNo(pmap);
				if(map!=null && !"".equals(map)){
					resultMap.put("result", "false");
					resultMap.put("msg", "类别编号重复");
					return resultMap;
				}
				pmap.put("UPDATE_PERSON", userId);//创建人			
				pmap.put("UPDATE_TIME", DateTimeUtils.getFormatCurrentTime());//创建时间
				pmap.put("FLAG", "00");//删除标志 00未删除 01已删除
				repositoryDao.createCategory(pmap);
				resultMap.put("result", "true");
				resultMap.put("msg", "新增成功");
			}else if(type!=null && "edit".equals(type)){
				pmap.put("UPDATE_PERSON", userId);//创建人			
				pmap.put("UPDATE_TIME", DateTimeUtils.getFormatCurrentTime());//创建时间
				repositoryDao.updateCategory(pmap);
				resultMap.put("result", "true");
				resultMap.put("msg", "修改成功");
			}
			
			
		} catch (Exception e) {
			logger.info("操作  RepositoryService.createCategory 出错 uri为 --->>>" + req.getRequestURI());
			resultMap.put("result", "false");
			resultMap.put("msg", "添加失败");
			e.printStackTrace();
		}
		return resultMap;
	}
	//删除类别
	@Override
	public Map<String, Object> deleteCategory(HttpServletRequest req, String userid) {

		Map<String, Object> resultMap=new HashMap<String, Object>();
		String category_code=RequestUtils.getParamValue(req, "CATEGORY_CODE");
		if (category_code==null||"".equals(category_code.trim())) {
			resultMap.put("result", "false");
			return resultMap;
		}
		Map<String, String> pmap=new HashMap<String, String>();
		pmap.put("CATEGORY_CODE", category_code);
//		pmap.put("UPDATE_PERSON",userid);
//		pmap.put("UPDATE_TIME", DateTimeUtils.getFormatCurrentTime());
		pmap.put("FLAG", "01");//01表示已经删除
		
		
		try {
			repositoryDao.deleteCategory(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			logger.info("操作  RepositoryService.deleteCategory 出错 uri为 --->>>" + req.getRequestURI());
			resultMap.put("result", "false");
			e.printStackTrace();
		}
		return resultMap;
	}
	


}
