package com.yusys.resources.outpersonattendance.web;


import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.resources.outpersonattendance.service.IOptAttendanceService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/optattendance")
public class OptAttendanceSController extends BaseController{
	@Resource
	private IOptAttendanceService optAttendanceService;
	/**
	 * 批量导入外包人员考勤信息
	 * @param req
	 * @param res
	 * @throws Exception 
	 */
	@RequestMapping("/importOptattendance")
	public void importOptattendance(HttpServletRequest req,HttpServletResponse res,MultipartFile file) throws Exception{
		Map<String, String> smap=null;
		try {
			smap=optAttendanceService.importOptattendance(getUserId(req),file,new int[]{1},new int[]{13});
		} catch (RuntimeException e) {
			smap=new HashMap<String, String>();
			smap.put("result","false");
			e.printStackTrace();
			smap.put("error_info",e.getMessage());
		}
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(smap));
	}
}
