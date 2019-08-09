package com.yusys.web;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.yusys.entity.SUser;

public abstract class BaseController {
	/**
	 * 获取用户信息
	 * @param req
	 * @return
	 */
	public SUser getUser(HttpServletRequest req){
		SUser user=(SUser)req.getSession(false).getAttribute("userinfo");
		return user;
	}
	/**
	 * 获取用户id
	 * @param req
	 * @return
	 */
	public String getUserId(HttpServletRequest req){
		SUser user=getUser(req);
		if (user==null) {
			return "";
		}
		return user.getUser_no();
	}
	public void toJsp(HttpServletRequest req, HttpServletResponse res,String url){
		try {
			req.getRequestDispatcher(url).forward(req, res);
		} catch (ServletException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 将返回的json字符串处理为utf-8格式的编码
	 * @param res
	 * @param json
	 */
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
}
