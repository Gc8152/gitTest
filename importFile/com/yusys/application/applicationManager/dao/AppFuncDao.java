package com.yusys.application.applicationManager.dao;

import java.util.Map;

public interface AppFuncDao {
	
	public String findSystemidByname(String pmap);
	
	public String findModalByname(Map<String, String> pmap);
	
	public void addFuncPoint(Map<String, String> pmap);
}
