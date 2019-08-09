package com.yusys.projectTask.task.web;

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
import com.yusys.projectTask.task.service.IProjectTaskService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/projectTask")
public class projectTaskController extends BaseController {

	@Resource
	private IProjectTaskService projectTaskService;
	/**
	 * 导入开发任务信息
	 * 
	 * @param req
	 * @param res
	 * @param file
	 */
	@RequestMapping("/importTest")
	public void importProjectTask(HttpServletRequest req,HttpServletResponse res, MultipartFile file) {
		Map<String, String> smap = null;
		try {	
			smap=projectTaskService.importProjectTask(req,getUserId(req),file, new int[] {3}, new int[] {10});
		} catch (RuntimeException e) {
			smap=new HashMap<String, String>();
			smap.put("result", "false");
			smap.put("error_info", e.getMessage());
			e.printStackTrace();
		}
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(smap));
	}
}
