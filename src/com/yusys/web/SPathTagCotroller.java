package com.yusys.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.service.SPathTagService.ISPathTagService;


@Controller
@RequestMapping("/SPathTag")
public class SPathTagCotroller extends BaseController {
	@Resource
	private ISPathTagService sPathTagService;
	
	@RequestMapping("/queryListPathTag")
	//查询所有标签
	public void queryListPathTag(HttpServletRequest req,HttpServletResponse res){
		try {
			writeUTFJson(res,JsonUtils.beanListToJson(sPathTagService.queryListPathTag(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	//新增自定义标签
	@RequestMapping("/addPathTag")
	public void addPathTag(HttpServletRequest req, HttpServletResponse res){
		writeUTFJson(res,JsonUtils.beanToJson(sPathTagService.addPathTag(req,getUserId(req))));
	}
	
	//查询当前路径有的标签
	@RequestMapping("/queryFilePathTag")
	public void queryFilePathTag(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(sPathTagService.queryFilePathTag(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	//查询当前路径没有的标签
	@RequestMapping("/queryFilePathNoTag")
	public void queryFilePathNoTag(HttpServletRequest req,HttpServletResponse resp){
		try {
			writeUTFJson(resp,JsonUtils.beanListToJson(sPathTagService.queryFilePathNoTag(req)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
