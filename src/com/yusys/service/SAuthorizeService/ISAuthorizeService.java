package com.yusys.service.SAuthorizeService;


import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public interface ISAuthorizeService{
	
	public Map<String, String>	 save(HttpServletRequest req,String userid);//保存
	public Map<String, String>   delete(HttpServletRequest req,String userid);//删除
	public Map<String, String>   update(HttpServletRequest req,String userid);//修改
	public Map<String, Object>  FindById(HttpServletRequest req,String userid);    //根据用户ID  查询授权信息
	public Map<String, Object>  findAll(HttpServletRequest req,String userid);//查所有

}
