package com.yusys.Utils;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.common.cache.redis.IMyCache;
import com.yusys.common.cache.redis.RedisCache;
import com.yusys.service.SLogService.ISLogService;
@Service
@Transactional
public class LogUtil {
	//日志类型标识
	public final String OPT = "opt";//操作日志
	public final String LOGIN = "login";//登录日志
	public final String ERROR = "error";//异常日志
	//操作结果标识
	public final String SUCCESS = "成功";
	public final String FAILURE = "失败";
	@Resource
    private  ISLogService logService;
	@Resource
	private RedisCache redisCache;
	/**
	 * 插入日志信息
	 * @param req  请求
	 * @param user_no 用户编号
	 * @param memo 日志详情
	 * @param result 日志结果(成功  or 失败)
	 * @param menu_no  菜单编号
	 * @param type  日志类型 login,opt,error
	 * @param business_id  业务id
	 */
	public  void insertLogInfo(HttpServletRequest req,String user_no,String memo,String result,String menu_no,String type,String business_id){
		boolean flag = true;
		String logConfig = redisCache.get(IMyCache.log, null);
		Map<String, Object> logConfigMap;
		if(logConfig!=null&&logConfig.trim().length()!=0){
			logConfigMap=JsonUtils.jsonToMap(logConfig);
			if("login".equals(type)){
				if("01".equals(logConfigMap.get("loginlog_state"))){
					flag=false;
				}
			}else if("opt".equals(type)){
				if("01".equals(logConfigMap.get("optlog_state"))){
					flag=false;
				}
			}else if("error".equals(type)){
				if("01".equals(logConfigMap.get("errorlog_state"))){
					flag=false;
				}
			}
		}
		if(flag){
			Map<String, String> pmap=new HashMap<String, String>();
			pmap.put("user_no", user_no);
			pmap.put("memo", memo);
			pmap.put("state", result);
			pmap.put("menu_no", menu_no);
			pmap.put("type", type);
			pmap.put("opt_url",req.getRequestURI().substring(1));
			pmap.put("business_id", business_id);
			logService.insertNewLog(req,pmap);
		}
	}
}
