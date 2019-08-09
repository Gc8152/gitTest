package com.yusys.service.HttpService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;
import org.springframework.stereotype.Service;

@Service
public class HttpProxyService implements IHttpProxyService {

	@Override
	public String doHttpPost(String url, HttpServletRequest req) {
		HttpClient httpClient = new HttpClient();
		PostMethod post = new PostMethod(url);
		post.addRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		try {
			post.setRequestBody(postParam(req));
			httpClient.executeMethod(post);
			String returnString = post.getResponseBodyAsString();
			post.releaseConnection();
			return resultFormat(returnString);
		} catch (HttpException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "";
	}
	/**
	 * 返回值去掉jsonp字样
	 * @param result
	 * @return
	 */
	public String resultFormat(String result){
		if (result.startsWith("jsonp_success(")) {
			return result.substring(14, result.length()-1);
		}
		return result;
	}
	/**
	 * 获取密文参数
	 * @param request
	 * @return
	 */
	public NameValuePair[] postParam(HttpServletRequest req){
		Map map=req.getParameterMap();
		Iterator iterator=map.keySet().iterator();
		List<NameValuePair> listParam=new ArrayList<NameValuePair>();
		while (iterator.hasNext()) {
			String key=(String) iterator.next();
			if("call".equals(key)||"proxy_url".equals(key)){
				continue;
			}
			Object value=map.get(key);
			if (value!=null && (value instanceof Object[])) {
				Object[] array=(Object[]) value;
				for (int i = 0; i < array.length; i++) {
					NameValuePair nameValuepair = new NameValuePair(key,array[i].toString());
					listParam.add(nameValuepair);
				}
			}else{
				NameValuePair nameValuepair = new NameValuePair(key,map.get(key).toString());
				listParam.add(nameValuepair);
			}			
		}
		NameValuePair[] nameValue=new NameValuePair[listParam.size()];
		return listParam.toArray(nameValue);
	}
}
