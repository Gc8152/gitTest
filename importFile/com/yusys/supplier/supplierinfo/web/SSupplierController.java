package com.yusys.supplier.supplierinfo.web;

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
import com.yusys.supplier.supplierinfo.service.ISSupplierService;
import com.yusys.web.BaseController;

@Controller
@RequestMapping("/SupplierInfo")
public class SSupplierController extends BaseController {

	@Resource
	private ISSupplierService issupplierService;
	/**
	 * 导入供应商信息
	 * 
	 * @param req
	 * @param res
	 * @param file
	 */
	@RequestMapping("/importSupplierInfo")
	public void importSupplierInfo(HttpServletRequest req,HttpServletResponse res, MultipartFile file) {
		Map<String, String> smap = null;
		try {
			smap=issupplierService.importSupplierInfo(getUserId(req),file, new int[] { 1, 1, 1, 1, 1, 2,2 }, new int[] { 1, 9, 9, 5, 12, 9, 7 });
		} catch (RuntimeException e) {
			smap=new HashMap<String, String>();
			smap.put("result", "false");
			smap.put("error_info", e.getMessage());
		}
		ResponseUtils.jsonMessage(res, JsonUtils.beanToJson(smap));
	}
	
	@RequestMapping("/queryAlladdress")
	public void queryAlladdress(HttpServletRequest req,HttpServletResponse res){
//		ResponseUtils.jsonMessage(res,JsonUtils.beanToJson(supDicService.queryAllSupDic(req,getUserId(req))));
		writeUTFJson(res,JsonUtils.beanListToJson(issupplierService.queryAlladdress(req,getUserId(req))).toLowerCase());
	}
	/**
	 * 中文转拼音
	 * @param req
	 * @param res
	 */
	@RequestMapping("/znToPinYin")
	public void cnToPinYin(HttpServletRequest req,HttpServletResponse res){
		String str=req.getParameter("cn");
		if(str==null||str.trim().length()==0){
			str="";
		}else{
			str=issupplierService.cnToPinYin(str);
		}
		writeUTFJson(res,"{\"py\":\""+str+"\"}");
	}
}
