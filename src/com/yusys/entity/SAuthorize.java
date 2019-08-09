package com.yusys.entity;

public class SAuthorize {
	private Integer id;//主键         
	private String auth_no;//授权人
	private String org_no;//机构编号
	private String role_no;//授权角色 
	private String bauth_no;//被授权人
	private String system_id;//应用系统
	private String query_op;//查询系统
	private String option_op;//操作权限
	private String approve_op;//审批权限
	private String auth_type;//授权类型
	private String auth_state;//授权状态
	private String start_time;//开始时间
	private String end_time;//结束时间
	private String opt_no;//操作人
	private String opt_time;//操作时间
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getAuth_no() {
		return auth_no;
	}
	public void setAuth_no(String auth_no) {
		this.auth_no = auth_no;
	}
	public String getOrg_no() {
		return org_no;
	}
	public void setOrg_no(String org_no) {
		this.org_no = org_no;
	}
	public String getRole_no() {
		return role_no;
	}
	public void setRole_no(String role_no) {
		this.role_no = role_no;
	}
	public String getBauth_no() {
		return bauth_no;
	}
	public void setBauth_no(String bauth_no) {
		this.bauth_no = bauth_no;
	}
	public String getSystem_id() {
		return system_id;
	}
	public void setSystem_id(String system_id) {
		this.system_id = system_id;
	}
	public String getQuery_op() {
		return query_op;
	}
	public void setQuery_op(String query_op) {
		this.query_op = query_op;
	}
	public String getOption_op() {
		return option_op;
	}
	public void setOption_op(String option_op) {
		this.option_op = option_op;
	}
	public String getApprove_op() {
		return approve_op;
	}
	public void setApprove_op(String approve_op) {
		this.approve_op = approve_op;
	}
	public String getAuth_type() {
		return auth_type;
	}
	public void setAuth_type(String auth_type) {
		this.auth_type = auth_type;
	}
	public String getAuth_state() {
		return auth_state;
	}
	public void setAuth_state(String auth_state) {
		this.auth_state = auth_state;
	}
	public String getStart_time() {
		return start_time;
	}
	public void setStart_time(String start_time) {
		this.start_time = start_time;
	}
	public String getEnd_time() {
		return end_time;
	}
	public void setEnd_time(String end_time) {
		this.end_time = end_time;
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
	public SAuthorize(Integer id, String auth_no, String org_no,
			String role_no, String bauth_no, String system_id, String query_op,
			String option_op, String approve_op, String auth_type,
			String auth_state, String start_time, String end_time,
			String opt_no, String opt_time) {
		super();
		this.id = id;
		this.auth_no = auth_no;
		this.org_no = org_no;
		this.role_no = role_no;
		this.bauth_no = bauth_no;
		this.system_id = system_id;
		this.query_op = query_op;
		this.option_op = option_op;
		this.approve_op = approve_op;
		this.auth_type = auth_type;
		this.auth_state = auth_state;
		this.start_time = start_time;
		this.end_time = end_time;
		this.opt_no = opt_no;
		this.opt_time = opt_time;
	}
	public SAuthorize() {
		super();
		// TODO Auto-generated constructor stub
	}
	@Override
	public String toString() {
		return "SAuthorize [id=" + id + ", auth_no=" + auth_no + ", org_no="
				+ org_no + ", role_no=" + role_no + ", bauth_no=" + bauth_no
				+ ", system_id=" + system_id + ", query_op=" + query_op
				+ ", option_op=" + option_op + ", approve_op=" + approve_op
				+ ", auth_type=" + auth_type + ", auth_state=" + auth_state
				+ ", start_time=" + start_time + ", end_time=" + end_time
				+ ", opt_no=" + opt_no + ", opt_time=" + opt_time + "]";
	}

}
