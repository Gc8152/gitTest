package com.yusys.entity;

public class SConfig {
	private String id;//id
	private String conf_type;//配置类别
	private String conf_code;//配置编码
	private String conf_name;//配置名称
	private String conf_value;//配置值
	private String memo;//描述
	private String opt_no;//操作人
	private String opt_time;//操作时间
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getConf_type() {
		return conf_type;
	}
	public void setConf_type(String conf_type) {
		this.conf_type = conf_type;
	}
	public String getConf_code() {
		return conf_code;
	}
	public void setConf_code(String conf_code) {
		this.conf_code = conf_code;
	}
	public String getConf_name() {
		return conf_name;
	}
	public void setConf_name(String conf_name) {
		this.conf_name = conf_name;
	}
	public String getConf_value() {
		return conf_value;
	}
	public void setConf_value(String conf_value) {
		this.conf_value = conf_value;
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
	public SConfig(String id, String conf_type, String conf_code,
			String conf_name, String conf_value, String memo, String opt_no,
			String opt_time) {
		super();
		this.id = id;
		this.conf_type = conf_type;
		this.conf_code = conf_code;
		this.conf_name = conf_name;
		this.conf_value = conf_value;
		this.memo = memo;
		this.opt_no = opt_no;
		this.opt_time = opt_time;
	}
	public SConfig() {
		super();
		// TODO Auto-generated constructor stub
	}
	@Override
	public String toString() {
		return "SConfig [id=" + id + ", conf_type=" + conf_type
				+ ", conf_code=" + conf_code + ", conf_name=" + conf_name
				+ ", conf_value=" + conf_value + ", memo=" + memo + ", opt_no="
				+ opt_no + ", opt_time=" + opt_time + "]";
	}
}
