package com.yusys.common.cache.redis;

import org.springframework.cache.Cache;

/**
 * 缓存初始化接口
 * @author Administrator
 *
 */
public abstract class IMyCache {
	/**
	 * 菜单权限追加标识
	 */
	public final static String perm_menu="PERM_MENU";
	/**
	 * 操作权限追加标识
	 */
	public final static String perm_opt="PERM_OPT";
	/**
	 * 字典项追加标识
	 */
	public final static String dic="DIC";
	/**
	 *	日志配置追加标识
	 */
	public final static String log="LOG";
	
	private Cache cache;
	public final void initCache( Cache cache){
		this.cache=cache;
		dataToCache();
	}
	
	/**
	 * 设置缓存数据
	 * @param key
	 * @param value
	 */
	protected final void setCache(String key,Object value){
		if(cache!=null){
			cache.put(key, value);
		}
	}
	/**
	 * 初始化数据
	 */
	protected abstract void dataToCache();
}