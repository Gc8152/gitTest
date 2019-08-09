package com.yusys.Utils;
public class MyException extends Exception {
	public MyException() { 
		super();
	}
	public MyException(String message) {
		System.out.println("上传发生异常，"+message+"文件名重复！");
	}

}
