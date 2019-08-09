package com.yusys.service.factorsconfig;

import java.util.Map;
import javax.servlet.http.HttpServletRequest;

public interface ISFactorsInfoService {
	//查询业务要素表所有信息
	public Map<String,Object> queryAllFactorsInfo(HttpServletRequest req);
	//向业务要素表中插入一条信息
	public Map<String,String> addOneFactorsInfo(HttpServletRequest req,String userid);
	//向业务要素表中删除一条信息
	public Map<String,String> deleteOneFactorsInfo(HttpServletRequest req);
	//修改一条业务要素表信息
	public Map<String,String> updateOneFactorsInfos(HttpServletRequest req,String userid);
}
