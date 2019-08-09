package com.yusys.dao;

import java.util.Map;

/**
 * 附件信息管理
 * @author yangbin3
 * @date 2017-5-4
 */
public interface SAttachmentDao {
	//添加一条附件信息
	public void insertAttachment(Map<String,String> map);
}
