package com.yusys.common.cache.redis;

import java.util.Map;
import javax.annotation.Resource;
import org.apache.log4j.Logger;

import com.yusys.Utils.JsonUtils;
import com.yusys.dao.SLogDao;

public class LogConfigCache extends IMyCache {
	private static final Logger logger = Logger.getLogger(LogConfigCache.class);
	@Resource
	private SLogDao sLogDao;
	@Override
	protected void dataToCache() {
		logger.info("####开始同步日志配置数据到redis缓存");
		/*if (sLogDao!=null) {
			Map<String, Object> logConfig=sLogDao.queryLastLogConfig();
			if(logConfig!=null){
				try {
					setCache(IMyCache.log,JsonUtils.beanToJson(logConfig));
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}else{
			logger.info("##############sLogDao is null ");
		}*/
		logger.info("####日志配置数据同步 到redis缓存 完成.....");
		setCache("b", "b");
	}
}
