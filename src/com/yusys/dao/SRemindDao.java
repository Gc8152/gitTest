package com.yusys.dao;

import java.util.List;
import java.util.Map;

public interface SRemindDao {
	/**
	 * 根据人员查询我的提醒
	 */
	public List<Map<String,Object>> findMyRemindByUserid(Map<String, String> pmap); 
	/**
	 * 根据类型删除提醒
	 */
	public void delRemindByType(Map<String, String> pmap);
	//根据类型减少提醒数
    public void updateRemindNum(Map<String,String> pmap);
    //查询提醒详情
    public List<Map<String,Object>> querySubRemindByType(Map<String,String> pmap);
    //删除一条提醒详情
    public void deleteSubRemind(Map<String,String> pmap);
    //统计提醒数量
    public List<Map<String,Object>> countRemindNum(Map<String,String> pmap);
}
