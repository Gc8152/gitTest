package com.yusys.entity;

/**
 * 节假日实体
 * @author Administrator
 *
 */
public class SHolidays {
	
	private int s_type;//类别（1休息日，2工作日）
    private String s_date;//日期: yyyy-mm-dd
    private String opt_person;//操作人
    private String opt_time;//操作时间
	public int getS_type() {
		return s_type;
	}
	public void setS_type(int s_type) {
		this.s_type = s_type;
	}
	public String getS_date() {
		return s_date;
	}
	public void setS_date(String s_date) {
		this.s_date = s_date;
	}
	public String getOpt_person() {
		return opt_person;
	}
	public void setOpt_person(String opt_person) {
		this.opt_person = opt_person;
	}
	public String getOpt_time() {
		return opt_time;
	}
	public void setOpt_time(String opt_time) {
		this.opt_time = opt_time;
	}

}
