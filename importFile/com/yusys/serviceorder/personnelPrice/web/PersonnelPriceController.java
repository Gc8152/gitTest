package com.yusys.serviceorder.personnelPrice.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.JsonUtils;
import com.yusys.serviceorder.personnelPrice.service.IPersonnelPriceService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/pPrice")
public class PersonnelPriceController extends BaseController{
	//人员单价接口
	@Resource
	private IPersonnelPriceService service;
	/**
	 * 批量导入外包人员单价信息
	 * @param req
	 * @param res
	 * @throws Exception 
	 */
	@RequestMapping("/importOutPersonPrice")
	public void importOutPersonPrice(HttpServletRequest req,HttpServletResponse res,MultipartFile file) throws Exception{
		Map<String, String> smap=null;
		try {
			smap=service.importOutPersonPrice(getUserId(req),file,new int[]{1},new int[]{9});
		} catch (RuntimeException e) {
			smap=new HashMap<String, String>();
			smap.put("result","false");
			e.printStackTrace();
			smap.put("error_info",e.getMessage());
		}
		writeUTFJson(res,JsonUtils.beanToJson(smap));
	}
}
