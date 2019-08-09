package com.yusys.resources.outpersonattendance.entity;

/**
 * 人员考勤数据
 * @author lenovo
 *
 */
public class OptAttendance {

	private String acc_id;//考勤id
	
	private String op_code;//
	
	private String op_name;
	
	private String acc_type;
	
	private String berw_time;
	
	private String aftw_time;
	
	private String work_hours;

	public String getAcc_id() {
		return acc_id;
	}

	public void setAcc_id(String acc_id) {
		this.acc_id = acc_id;
	}

	public String getOp_code() {
		return op_code;
	}

	public void setOp_code(String op_code) {
		this.op_code = op_code;
	}

	public String getOp_name() {
		return op_name;
	}

	public void setOp_name(String op_name) {
		this.op_name = op_name;
	}

	public String getAcc_type() {
		return acc_type;
	}

	public void setAcc_type(String acc_type) {
		this.acc_type = acc_type;
	}

	public String getBerw_time() {
		return berw_time;
	}

	public void setBerw_time(String berw_time) {
		this.berw_time = berw_time;
	}

	public String getAftw_time() {
		return aftw_time;
	}

	public void setAftw_time(String aftw_time) {
		this.aftw_time = aftw_time;
	}

	public String getWork_hours() {
		return work_hours;
	}

	public void setWork_hours(String work_hours) {
		this.work_hours = work_hours;
	}
	
}
