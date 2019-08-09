package com.yusys.resources.outpersonattendance.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.ui.ModelMap;
import org.springframework.web.multipart.MultipartFile;

public interface IOptAttendanceService {
	/**
	 * 增加人员考勤信息
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> addOptAttendance(HttpServletRequest req, String userid);
	/**
	 * 修改人员考勤信息
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, String> updateOptAttendance(HttpServletRequest req, String userid);
	/**
	 * 查询人员考勤列表信息
	 * @param req
	 * @param userid
	 * @return
	 */
	public Map<String, Object> queryOptAttendanceList(HttpServletRequest req, String userid);
	/**
	 * 批量导入外包人员考勤信息
	 * @param userId
	 * @param file
	 * @param head_num
	 * @param column_num
	 * @return
	 */
	public Map<String, String> importOptattendance(String userId,MultipartFile file, int[] head_num, int[] column_num); 
}
