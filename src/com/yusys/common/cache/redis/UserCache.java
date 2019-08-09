package com.yusys.common.cache.redis;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;

import com.yusys.Utils.ResponseUtils;
import com.yusys.dao.SPermissionDao;

public class UserCache extends IMyCache {

	private static final Logger logger = Logger.getLogger(UserCache.class);
	@Resource
	private SPermissionDao permissionDao;
	@Override
	protected void dataToCache() {
		logger.info("####开始同步用户权限数据到redis缓存");
		/*if (permissionDao!=null) {
			Map<String, String> map=new HashMap<String, String>();
			map.put("all", "all");
			int j=0;
			for (;;) {
				map.put("offset", (j*5)+"");
				map.put("limit", "5");
				List<Map<String, Object>> userPerms=permissionDao.queryUserPermiss(map);
				if(userPerms==null||userPerms.size()==0){
					return;
				}
				j++;
				for (int i = 0; i < userPerms.size(); i++) {
					Map<String, Object> umap=userPerms.get(i);
					logger.info("##同步用户:"+umap.get("USER_NO")+"的权限");
					try {
						setCache(umap.get("USER_NO")+IMyCache.perm_menu, ResponseUtils.oracleClob2Str(umap.get("PERM_MENU")));
						setCache(umap.get("USER_NO")+IMyCache.perm_opt, ResponseUtils.oracleClob2Str(umap.get("PERM_OPT")));
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		}else{
			logger.info("##############permissionDao is null ");
		}*/
		logger.info("####用户权限数据同步 到redis缓存 完成.....");
		setCache("b", "b");
	}
}