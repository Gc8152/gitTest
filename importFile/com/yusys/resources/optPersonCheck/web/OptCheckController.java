package com.yusys.resources.optPersonCheck.web;


import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.resources.optPersonCheck.service.IOptCheckService;
import com.yusys.resources.outperson.service.IOutPersonService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/OptCheck")
public class OptCheckController extends BaseController{
	@Resource
	private IOptCheckService outPersonService;
	
	/**
	 * 批量导入外包人员考核信息
	 * @param req
	 * @param res
	 * @throws Exception 
	 */
	@RequestMapping("/importOptCheck")
	public void importOutPersonInfo(HttpServletRequest req,HttpServletResponse res,MultipartFile file) throws Exception{
		Map<String, String> smap=null;
		try {
			smap=outPersonService.importOptCheckInfo(getUserId(req),file,new int[]{1},new int[]{10});
		} catch (RuntimeException e) {
			smap=new HashMap<String, String>();
			smap.put("result","false");
			e.printStackTrace();
			smap.put("error_info",e.getMessage());
		}
		writeUTFJson(res,JsonUtils.beanToJson(smap));
	}
}
