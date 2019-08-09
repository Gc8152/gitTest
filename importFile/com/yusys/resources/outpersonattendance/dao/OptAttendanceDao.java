package com.yusys.resources.outpersonattendance.dao;
import java.util.List;
import java.util.Map;

import com.yusys.resources.outperson.entity.RankPersonInfo;
public interface OptAttendanceDao {
	/**
	 * 增加人员考勤信息
	 * @param pmap
	 */
	public void addOptAttendance(Map<String, String> pmap);
	/**
	 * 修改人员考勤信息
	 * @param pmap
	 */
	public void updateOptAttendance(Map<String, String> pmap);
	/**
	 * 查询人员考勤列表信息
	 * @param pmap
	 * @return
	 */
	public List<Map<String, String>> queryOptAttendanceList(Map<String, String> pmap);
	/**
	 * 查询人员考勤详情信息
	 * @param pmap
	 * @return
	 */
	public Map<String, String> queryOptAttendanceDetail(Map<String, String> pmap);
	/**
	 * 根据人员op_code跟日期查询人员考勤信息
	 * @param pmap
	 * @return
	 */
	public List<Map<String,String>> queryOptAttByCodeAndDate(Map<String, String> pmap);
	/**
	 * 根据用户编号和身份证号查询人员信息
	 * @param pmap
	 * @return
	 */
	public List<Map<String, String>> queryOptAttByUserNoAndIdcard(Map<String, String> pmap);
}