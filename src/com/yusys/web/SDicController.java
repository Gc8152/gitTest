package com.yusys.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.ResponseUtils;
import com.yusys.service.SDicService.ISDicService;

/**
 * 控制跳转
 * 
 * @author Administrator
 * 
 */
@Controller
@RequestMapping("/SDic")
public class SDicController extends BaseController {

	@Resource
	private ISDicService sdicService;

	public void writeUTFJson(HttpServletResponse res, String json) {
		PrintWriter writer = null;
		try {
			res.setCharacterEncoding("UTF-8");
			writer = res.getWriter();
			writer.write(json);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (writer != null) {
				writer.flush();
			}
		}
	}

	// 新增类别
	@RequestMapping("/save")
	public void SaveSdic(HttpServletRequest req, HttpServletResponse res) {
		writeUTFJson(res,
				JsonUtils.beanToJson(sdicService.save(req, getUserId(req))));
	}

	// 删除类别
	@RequestMapping("/delete")
	public void DeleteSdic(HttpServletRequest req, HttpServletResponse res) {

		writeUTFJson(res,
				JsonUtils.beanToJson(sdicService.delete(req, getUserId(req))));
	}

	// 修改类别
	@RequestMapping("/update")
	public void UpdateSdic(HttpServletRequest req, HttpServletResponse res) {

		writeUTFJson(res,
				JsonUtils.beanToJson(sdicService.update(req, getUserId(req))));
	}

	// 根据ID查找类别
	@RequestMapping("/findById")
	public void FindById(HttpServletRequest req, HttpServletResponse res) {

		writeUTFJson(res,
				JsonUtils.beanToJson(sdicService.findById(req, getUserId(req))));
	}

	// 多条件查询所有类别信息
	@RequestMapping("/findAllSDic")
	public void findAllSDic(HttpServletRequest req, HttpServletResponse res) {

		writeUTFJson(res,
				JsonUtils.beanToJsonp(req,sdicService.findAll(req, getUserId(req))));
	}
	@RequestMapping("/findItemByDic")
	public void findItemByDic(HttpServletRequest req, HttpServletResponse res) {

		ResponseUtils.jsonMessage(res,
				sdicService.findItemByDic(req, getUserId(req)));
	}
}
