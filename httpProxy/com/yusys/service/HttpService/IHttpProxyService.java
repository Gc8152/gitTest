package com.yusys.service.HttpService;

import javax.servlet.http.HttpServletRequest;

public interface IHttpProxyService {
	/**
	 * 代理post请求
	 * @param url
	 * @param req
	 * @return
	 */
	public String doHttpPost(String url,HttpServletRequest req);
}
