package com.yusys.entity;

/**
 * 系统日志表
 * @author Administrator
 *
 */
public class SLog {
	private String user_name;		//用户名
	private String login_name;		//登陆名
	private String ip_address;		//登陆IP
	private String host_name;		//主机名
	private String opt_url;			//操作路径
	private String opt_time;		//操作时间
	private String type;			//类型
	private String menu_no;			//菜单编号
	private String state;			//状态
	private String memo;			//备注
	
	public String getUser_name() {
		return user_name;
	}
	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}
	public String getLogin_name() {
		return login_name;
	}
	public void setLogin_name(String login_name) {
		this.login_name = login_name;
	}
	public String getIp_address() {
		return ip_address;
	}
	public void setIp_address(String ip_address) {
		this.ip_address = ip_address;
	}
	public String getHost_name() {
		return host_name;
	}
	public void setHost_name(String host_name) {
		this.host_name = host_name;
	}
	public String getOpt_url() {
		return opt_url;
	}
	public void setOpt_url(String opt_url) {
		this.opt_url = opt_url;
	}
	public String getOpt_time() {
		return opt_time;
	}
	public void setOpt_time(String opt_time) {
		this.opt_time = opt_time;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getMenu_no() {
		return menu_no;
	}
	public void setMenu_no(String menu_no) {
		this.menu_no = menu_no;
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
}
