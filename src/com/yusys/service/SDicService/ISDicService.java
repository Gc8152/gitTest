package com.yusys.service.SDicService;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;


public interface ISDicService {
	public Map<String, String>	 save(HttpServletRequest req,String userid);//保存
	public Map<String, String>   delete(HttpServletRequest req,String userid);//删除
	public Map<String, String>   update(HttpServletRequest req,String userid);//修改
	public Map<String, Object> findById(HttpServletRequest req,String userid);//按ID查询
	public Map<String, Object>  findAll(HttpServletRequest req,String userid);//查所有
	public String findItemByDic(HttpServletRequest req,String userid);
	/**
	 * 刷新字典项数据到redis
	 * @param dic_code
	 * @return
	 */
	public void refreshDicItemToRedis(String dic_code);
	
}
