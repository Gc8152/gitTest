package com.yusys.common.cache.redis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;

import com.yusys.Utils.JsonUtils;
import com.yusys.dao.SDicDao;

public class DicCache extends IMyCache {
	private static final Logger logger = Logger.getLogger(DicCache.class);
	@Resource
	private SDicDao sdicdao;
	/**
	 * 字典项数据初始化。
	 */
	@Override
	protected void dataToCache() {
		logger.info("####开始同步字典数据到redis服务器");
		/*Map<String, String> pmap=new HashMap<String, String>();
		List<Map<String, String>> dicList=sdicdao.findItemByDic(pmap);
		List<Map<String, String>> list=new ArrayList<Map<String,String>>();
		for (int i = 0; i < dicList.size(); i++) {
			list.add(dicList.get(i));
			if (i<(dicList.size()-2)&&!dicList.get(i).get("DIC_CODE").equals(dicList.get(i+1).get("DIC_CODE"))) {
				setCache(dicList.get(i).get("DIC_CODE")+IMyCache.dic,JsonUtils.listToJson(list));
				logger.info("##同步dic_code="+dicList.get(i).get("DIC_CODE")+",条数="+list.size());
				list=new ArrayList<Map<String,String>>();
			}
		}
		if(dicList.size()>0){
			setCache(dicList.get(dicList.size()-1).get("DIC_CODE")+IMyCache.dic, JsonUtils.listToJson(list));
			logger.info("##同步dic_code="+dicList.get(dicList.size()-1).get("DIC_CODE")+",条数="+list.size());
		}*/
		logger.info("####同步字典数据到redis服务器完成");
	}
}