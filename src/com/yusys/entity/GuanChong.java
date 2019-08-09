package com.yusys.entity;

import java.util.Date;

public class GuanChong {
	private String req_name;
	private String req_businesser;
	private String req_business_phone;
	private String req_put_dept;
	private String req_dept;
	private String req_operation_date;
	public String getReq_name() {
		return req_name;
	}
	public void setReq_name(String req_name) {
		this.req_name = req_name;
	}
	public String getReq_businesser() {
		return req_businesser;
	}
	public void setReq_businesser(String req_businesser) {
		this.req_businesser = req_businesser;
	}
	public String getReq_business_phone() {
		return req_business_phone;
	}
	public void setReq_business_phone(String req_business_phone) {
		this.req_business_phone = req_business_phone;
	}
	public String getReq_put_dept() {
		return req_put_dept;
	}
	public void setReq_put_dept(String req_put_dept) {
		this.req_put_dept = req_put_dept;
	}
	public String getReq_dept() {
		return req_dept;
	}
	public void setReq_dept(String req_dept) {
		this.req_dept = req_dept;
	}
	public String getReq_operation_date() {
		return req_operation_date;
	}
	public void setReq_operation_date(String req_operation_date) {
		this.req_operation_date = req_operation_date;
	}
	public GuanChong(String req_name, String req_businesser, String req_business_phone, String req_put_dept,
			String req_dept, String req_operation_date) {
		super();
		this.req_name = req_name;
		this.req_businesser = req_businesser;
		this.req_business_phone = req_business_phone;
		this.req_put_dept = req_put_dept;
		this.req_dept = req_dept;
		this.req_operation_date = req_operation_date;
	}
	public GuanChong() {
		super();
	}
	@Override
	public String toString() {
		return "GuanChong [req_name=" + req_name + ", req_businesser=" + req_businesser + ", req_business_phone="
				+ req_business_phone + ", req_put_dept=" + req_put_dept + ", req_dept=" + req_dept
				+ ", req_operation_date=" + req_operation_date + "]";
	}
	
	

}
