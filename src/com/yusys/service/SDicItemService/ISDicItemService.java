package com.yusys.service.SDicItemService;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;


public interface ISDicItemService {
	public Map<String, String>	 save(HttpServletRequest req,String userid);//保存
	public Map<String, String>   delete(HttpServletRequest req,String userid);//删除
	public Map<String, String>   update(HttpServletRequest req,String userid);//修改
	public Map<String, Object> findById(HttpServletRequest req,String userid);//按ID查询
	public Map<String, Object>  findAll(HttpServletRequest req,String userid);//查所有
	//根据字典类别编码查询字典项内容 houf 
	public List<Map<String, String>>  findItemContent(HttpServletRequest req,String userid);
	
}
