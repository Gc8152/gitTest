package com.yusys.Utils;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public class RequestUtils {
	public static final String chartCode="GBK";
	public static final String check_code="checkCode_yx_101";
	/**
	 * 请求对象request转成map 
	 * @param req
	 * @param must   必填列表
	 * @param nomust 非必填列表
	 * @return
	 */
	public static Map<String, String> requestToMap(HttpServletRequest req,String[] must,String []nomust){
		Map<String, String> map=new HashMap<String, String>();
		String p=null;
		if (must!=null) {
			for (int i = 0; i < must.length; i++) {
				p=getParamValue(req,must[i]);
				if (p==null) {
					p=getParamValue(req,must[i]+"[]");
				}
				if (p!=null&&p.trim().length()>0) {
					map.put(must[i], p);
				}else{//必填项出现 未填
					return null;
				}
			}
		}
		if (nomust!=null) {
			for (int i = 0; i < nomust.length; i++) {
				p=getParamValue(req,nomust[i]);
				if (p!=null&&p.trim().length()>0) {
					map.put(nomust[i], p);
				}else{
					map.put(nomust[i], "");
				}
			}
		}
		return map;
	}
	/**
	 * 请求对象request转成map 
	 * @param req
	 * @param must   必填列表
	 * @param nomust 非必填列表
	 * @return
	 */
	public static Map<String, Object> requestToMapTwo(HttpServletRequest req,String[] must,String []nomust){
		Map<String, Object> map=new HashMap<String, Object>();
		String p=null;
		if (must!=null) {
			for (int i = 0; i < must.length; i++) {
				p=getParamValue(req,must[i]);
				if (p==null) {
					p=getParamValue(req,must[i]+"[]");
				}
				if (p!=null&&p.trim().length()>0) {
					map.put(must[i], p);
				}else{//必填项出现 未填
					return null;
				}
			}
		}
		if (nomust!=null) {
			for (int i = 0; i < nomust.length; i++) {
				p=getParamValue(req,nomust[i]);
				if (p!=null&&p.trim().length()>0) {
					map.put(nomust[i], p);
				}else{
					map.put(nomust[i], "");
				}
			}
		}
		return map;
	}
	/**
	 * 获取参数值
	 * @param req
	 * @param paramName
	 * @return
	 */
	public static String getParamValue(HttpServletRequest req,String paramName){
		//增加传值过滤，防止sql注入
		///////////////////
		return req.getParameter(paramName);
	}
	
	/**
	 * 获取参数值如果值等于空则返回一个空字符串
	 * @param req
	 * @param paramName
	 * @return
	 */
	public static String getParamValueNulStr(HttpServletRequest req,String paramName){
		String v=getParamValue( req, paramName);
		if (v!=null) {
			return v;
		}
		return "";
	}
	
	/**
	 * 分页方法
	 * @param req 页面传入数据
	 * @param list 查询结果集
	 * @return
	 */
	public static List<Map<String,String>> pagination(HttpServletRequest req,List<Map<String,String>> list){
		int currentPage = req.getParameter("offset") == null ? 1 : Integer.parseInt(req.getParameter("offset"));
		int showCount = req.getParameter("limit") == null ? 10 : Integer.parseInt(req.getParameter("limit"));
		int end=currentPage+showCount;
		if(end>=list.size()){
			end=list.size();
		}
		List<Map<String,String>> pagList=list.subList(currentPage, end);
		
		return pagList;
	}
	
	/**
	 * 获得用户的加密key
	 * @param userId
	 * @return
	 */
	public static String getMkey(String userid){
		return getMkey(userid,0);
	}
	

	/**
	 * 获得用户的加密key
	 * @param userid
	 * @param hour
	 * @return
	 */
	private static String getMkey(String userid,int minute){
		if (userid==null||userid.trim().length()==0) {
			return null;
		}
		return MD5.getMD5ofStr(userid+getYMDHM(minute)+"TaskOA_SYS");
	}
	
	/**
	 * 检查加密key
	 * @param userid
	 * @param mkey
	 * @return
	 */
	public static boolean checkMkey(String userid,String mkey){
		if (userid==null||mkey==null||userid.trim().length()==0||mkey.trim().length()==0) {
			return false;
		}
		if (mkey.equals(getMkey(userid,0))) {
			return true;
		}else if (mkey.equals(getMkey(userid,-1))) {
			return true;
		}else if (mkey.equals(getMkey(userid,1))) {
			return true;
		}else if (mkey.equals(getMkey(userid,2))) {
			return true;
		}else if (mkey.equals(getMkey(userid,-2))) {
			return true;
		}else if (mkey.equals(getMkey(userid,3))) {
			return true;
		}else if (mkey.equals(getMkey(userid,-3))) {
			return true;
		}
		return false;
	}

	/**
	 * 年月日时分
	 * @return
	 */
	public static String getYMDHM(int minute){
		Calendar calendar = Calendar.getInstance();
		if (minute!=0) {
			calendar.add(Calendar.MINUTE, minute);
		}
		StringBuffer sb=new StringBuffer();
		int y = calendar.get(Calendar.YEAR);
		int m = calendar.get(Calendar.MONTH) + 1;
		int d = calendar.get(Calendar.DAY_OF_MONTH);
		int H = calendar.get(Calendar.HOUR_OF_DAY);
		int M = calendar.get(Calendar.MINUTE);
		sb.append(y);
		sb.append("-");
		sb.append((m < 10 ? "0" : "") );
		sb.append(m);
		sb.append("-");
		sb.append((d < 10 ? "0" : ""));
		sb.append(d);
		sb.append(" ");
		sb.append((H < 10 ? "0" : ""));
		sb.append(H);
		sb.append(":");
		sb.append((M < 10 ? "0" : ""));
		sb.append(M);
		return sb.toString();
	}

	public static void main(String[] args) {//82A37D128CB4FD782D152E9E5F64AE2B
		System.out.println(getMkey("0"));
		//System.out.println(checkMkey("0", "1D38F2952019655AB6D4EE7E6E730147"));
		//System.out.println(getYMDHM(1));
	}
}