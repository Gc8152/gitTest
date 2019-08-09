package com.yusys.service.SLogService;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;



import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.JsonUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.common.cache.redis.IMyCache;
import com.yusys.common.cache.redis.RedisCache;
import com.yusys.dao.SLogDao;


@Service
@Transactional
public  class SLogService implements ISLogService{
	private static final Logger logger = Logger.getLogger(SLogService.class);
	@Resource
	private SLogDao sLogDao;
	@Resource
	private RedisCache redisCache;
	
	/**
	 * 登陆日志查询页面
	 */
	public Map<String, Object> queryLoginLog(HttpServletRequest req,String actorno){
		Map<String, Object> map=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String login_name = RequestUtils.getParamValue(req, "login_name");
		String user_name = RequestUtils.getParamValue(req, "user_name");
		String user_name1 = "";
		try {
			user_name1 = URLDecoder.decode(user_name,"UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		String opt_time1 = RequestUtils.getParamValue(req, "opt_time1");
		String opt_time2 = RequestUtils.getParamValue(req, "opt_time2");
		pmap.put("login_name","%"+login_name+"%");
		pmap.put("user_name","%"+user_name1+"%");
		pmap.put("opt_time1",opt_time1);
		pmap.put("opt_time2",opt_time2);
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);
		List<Map<String, String>> m=sLogDao.queryLoginLog(pmap);
		//List<Map<String,String>> pagination = RequestUtils.pagination(req, m);
		map.put("rows", m);
		map.put("total", pmap.get("total"));
		return map;
	}
	/**
	 * 操作日志查询页面
	 */
	public Map<String, Object> queryOperaLog(HttpServletRequest req,String actorno){
		Map<String, Object> map=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String login_name = RequestUtils.getParamValue(req, "login_name");
		String user_name = RequestUtils.getParamValue(req, "user_name");
		String user_name1 = "";
		try {
			user_name1 = URLDecoder.decode(user_name,"UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		String business_id = RequestUtils.getParamValue(req, "business_id");
		String opt_time1 = RequestUtils.getParamValue(req, "opt_time1");
		String opt_time2 = RequestUtils.getParamValue(req, "opt_time2");
		pmap.put("login_name", "%"+login_name+"%");
		pmap.put("user_name", "%"+user_name1+"%");
		if(business_id!=null&&!"".equals(business_id)){
			pmap.put("business_id", "%"+business_id+"%");
		}
		pmap.put("opt_time1",opt_time1);
		pmap.put("opt_time2",opt_time2);
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		pmap.put("limit",limit);
		pmap.put("offset",offset);

		List<Map<String, String>> m=sLogDao.queryOperaLog(pmap);
		//List<Map<String,String>> pagination = RequestUtils.pagination(req, m);
		map.put("rows", m);
		map.put("total", pmap.get("total"));
		return map;
	}
	/**
	 * 创建日志
	 */
	public Map<String, String> insertNewLog(HttpServletRequest req,String actorno){
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			//必填参数列表登陆名,操作路径,类型,菜单编号,状态,登陆IP,主机名
			String[] must=new String[]{"login_name","opt_url","type","menu_no","state"};
			//非必填的参数列表备注
			String[] nomust=new String[]{"memo"};
			Map<String, String> pmap=RequestUtils.requestToMap(req, must, nomust);
			if (pmap==null) {
				resultMap.put("result", "false");
				return resultMap;
			}
			pmap.put("ip_address",req.getRemoteAddr());	//获取主机ip
			pmap.put("host_name",req.getLocalName());	//获取主机名
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//操作时间
			sLogDao.insertNewLog(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	public Map<String, String> insertNewLog(HttpServletRequest req,Map<String,String> pmap){
		Map<String, String> resultMap=new HashMap<String, String>();
		try{
			pmap.put("ip_address",req.getRemoteAddr());	//获取主机ip
			pmap.put("host_name",req.getLocalName());	//获取主机名
			pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());//操作时间
			sLogDao.insertNewLog(pmap);
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		return resultMap;
	}
	//新增日志配置信息
	@Override
	public Map<String,String> savelogConfig(HttpServletRequest req, String userId,String userName) {
		Map<String,String> retMap = new HashMap<String, String>();
		String [] must = {"loginlog_state","loginlog_timelimit","optlog_state","optlog_timelimit","errorlog_state","errorlog_timelimit","sendlog_state","sendlog_timelimit"};
		Map<String,String> param = RequestUtils.requestToMap(req, must, null);
		if(param==null){
			retMap.put("result", "false");
			return retMap;
		}
		param.put("last_opt_person",userId);
		param.put("last_opt_time",DateTimeUtils.getFormatCurrentTime());
		try {
			sLogDao.savelogConfig(param);
			if (redisCache!=null) {
				param.put("last_opt_person",userName);
				redisCache.put(IMyCache.log,JsonUtils.beanToJson(param));
			}
			logger.info("update log config:"+DateTimeUtils.getFormatCurrentTime());
			retMap.put("result", "true");
		} catch (Exception e) {
			retMap.put("result", "false");
			e.printStackTrace();
		}
		return retMap;
	}
	//查询日志配置信息
	@Override
	public Map<String, Object> queryLastLogConfig() {
		Map<String,Object> retMap = new HashMap<String, Object>();
		Map<String, Object> logConfig;
		try {
			String listMap=redisCache.get(IMyCache.log, null);
			if (listMap==null||listMap.trim().length()==0) {
				logConfig = sLogDao.queryLastLogConfig();
			}else{
				logConfig = JsonUtils.jsonToMap(listMap);
			}
			retMap.put("logConfig", logConfig);
			retMap.put("result", "true");
		} catch (Exception e) {
			retMap.put("result", "false");
			e.printStackTrace();
		}
		return retMap;
	}
	//定时删除日志信息
	@Override
	public void deleteLogbylimittime() {
		String listMap=redisCache.get(IMyCache.log, null);
		try {
			sLogDao.deleteLogbylimittime(JsonUtils.jsonToMap(listMap));
			logger.info("Timing taskdelete log success:"+DateTimeUtils.getFormatCurrentTime());
		} catch (Exception e) {
			logger.info("Timing taskdelete log fail:"+DateTimeUtils.getFormatCurrentTime());
		}
	}
}
