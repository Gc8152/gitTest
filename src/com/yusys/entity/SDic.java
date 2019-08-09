package com.yusys.entity;

/**
 * 字典类别表实体
 * @author Administrator
 *
 */
public class SDic {
	
	private String dic_code; 	// 类别编码
	private String dic_name;  // 类别名称
	private String state;  //  状态
	private String memo;  // 说明
	private String opt_no;  // 操作人
	private String opt_time;  // 操作时间
	
	
	public String getDic_code() {
		return dic_code;
	}
	public void setDic_code(String dic_code) {
		this.dic_code = dic_code;
	}
	public String getDic_name() {
		return dic_name;
	}
	public void setDic_name(String dic_name) {
		this.dic_name = dic_name;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public String getOpt_no() {
		return opt_no;
	}
	public void setOpt_no(String opt_no) {
		this.opt_no = opt_no;
	}
	public String getOpt_time() {
		return opt_time;
	}
	public void setOpt_time(String opt_time) {
		this.opt_time = opt_time;
	}
	
} 
