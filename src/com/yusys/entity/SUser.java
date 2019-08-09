package com.yusys.entity;

import java.io.Serializable;

/**
 * 用户实体
 * @author Administrator
 *
 */
public class SUser implements Serializable{
  
	private static final long serialVersionUID = 1L;
	
	private String user_no;  //用户编号
    private String user_name;//用户姓名
    private String login_name;//登陆名
    private String password; //密码
    private String nick_name;//昵称
    private String state;//状态
    private String user_post;//用户岗位
    private String user_level;//用户等级
    private String org_no;//所属部门
	private String org_no_code;
    private String org_no_name;//所属部门名称
    private String org_name;//所属中心名称
    private String user_mail;//用户邮箱
    private String user_mobile;//电话
    private String memo; //备注
    private String create_no;//创建人
    private String create_time;//创建时间
    private String update_no;//修改人
    private String update_time;//修改时间
    private String enable_flag;//是否可用
    private String iscreate;//是否能创建
    private String org_manager;
    private String is_banker;//是否行员
    private String skin_type; //用户皮肤
    private String is_banker_name;//是否行员名称
    private String state_name;//状态名称
    private String user_post_name;//用户岗位名称
    private String user_level_name;//用户等级名称
    private String work_no;
    private String standard;//用户密码是否符合规范标识
    private String op_name;
    private String op_code;
    private String user_roles;//用户所拥有的所有的角色
    public String getStandard() {
		return standard;
	}
	public void setStandard(String standard) {
		this.standard = standard;
	}
    
	public String getWork_no() {
		return work_no;
	}
	public void setWork_no(String work_no) {
		this.work_no = work_no;
	}
	public String getOrg_no_name() {
		return org_no_name;
	}
	public String getOrg_name() {
		return org_name;
	}
	public void setOrg_no_name(String org_no_name) {
		this.org_no_name = org_no_name;
	}
	public String getUser_no() {
		return user_no;
	}
	public void setUser_no(String user_no) {
		this.user_no = user_no;
	}
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
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getNick_name() {
		return nick_name;
	}
	public void setNick_name(String nick_name) {
		this.nick_name = nick_name;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getUser_post() {
		return user_post;
	}
	public void setUser_post(String user_post) {
		this.user_post = user_post;
	}
	public String getUser_level() {
		return user_level;
	}
	public void setUser_level(String user_level) {
		this.user_level = user_level;
	}
	public String getOrg_no() {
		return org_no;
	}
	public void setOrg_no(String org_no) {
		this.org_no = org_no;
	}
	public String getUser_mail() {
		return user_mail;
	}
	public void setUser_mail(String user_mail) {
		this.user_mail = user_mail;
	}
	public String getUser_mobile() {
		return user_mobile;
	}
	public void setUser_mobile(String user_mobile) {
		this.user_mobile = user_mobile;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public String getCreate_no() {
		return create_no;
	}
	public void setCreate_no(String create_no) {
		this.create_no = create_no;
	}
	public String getCreate_time() {
		return create_time;
	}
	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}
	public String getUpdate_no() {
		return update_no;
	}
	public void setUpdate_no(String update_no) {
		this.update_no = update_no;
	}
	public String getUpdate_time() {
		return update_time;
	}
	public void setUpdate_time(String update_time) {
		this.update_time = update_time;
	}
	public String getOrg_no_code() {
		return org_no_code;
	}
	public void setOrg_no_code(String org_no_code) {
		this.org_no_code = org_no_code;
	}
	public String getEnable_flag() {
		return enable_flag;
	}
	public void setEnable_flag(String enable_flag) {
		this.enable_flag = enable_flag;
	}
	public String getIscreate() {
		return iscreate;
	}
	public void setIscreate(String iscreate) {
		this.iscreate = iscreate;
	}
	public String getOrg_manager() {
		return org_manager;
	}
	public void setOrg_manager(String org_manager) {
		this.org_manager = org_manager;
	}
	public String getIs_banker() {
		return is_banker;
	}
	public void setIs_banker(String is_banker) {
		this.is_banker = is_banker;
	}
	public String getSkin_type() {
		return skin_type;
	}
	public void setSkin_type(String skin_type) {
		this.skin_type = skin_type;
	}
	public String getIs_banker_name() {
		return is_banker_name;
	}
	public void setIs_banker_name(String is_banker_name) {
		this.is_banker_name = is_banker_name;
	}
	public String getState_name() {
		return state_name;
	}
	public void setState_name(String state_name) {
		this.state_name = state_name;
	}
	public String getUser_post_name() {
		return user_post_name;
	}
	public void setUser_post_name(String user_post_name) {
		this.user_post_name = user_post_name;
	}
	public String getUser_level_name() {
		return user_level_name;
	}
	public void setUser_level_name(String user_level_name) {
		this.user_level_name = user_level_name;
	}
	public String getOp_name() {
		return op_name;
	}
	public void setOp_name(String op_name) {
		this.op_name = op_name;
	}
	public String getOp_code() {
		return op_code;
	}
	public void setOp_code(String op_code) {
		this.op_code = op_code;
	}
	public String getUser_roles() {
		return user_roles;
	}
	public void setUser_roles(String user_roles) {
		this.user_roles = user_roles;
	}
	
}
