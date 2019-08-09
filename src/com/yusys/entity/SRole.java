package com.yusys.entity;

/**
 * Created with IntelliJ IDEA.
 * User: wuxw
 * Date: 15-11-3
 * Time: 下午4:01
 * To change this template use File | Settings | File Templates.
 */
public class SRole {
	//角色编号
    private String role_no;
    //角色名称
    private String role_name;
    //排序字段 序号
    private String order_no;
    //类型
    private String flag;
    //备注
    private  String memo;
    //创建人员
    private String create_no;
    //创建时间
    private String create_time;
    //修改人员
    private String update_no;
    // 修改时间
    private String update_time;
    //安全级别
    private String safe_level;
    
	public String getRole_no() {
		return role_no;
	}
	public void setRole_no(String role_no) {
		this.role_no = role_no;
	}
	public String getRole_name() {
		return role_name;
	}
	public void setRole_name(String role_name) {
		this.role_name = role_name;
	}
	public String getOrder_no() {
		return order_no;
	}
	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
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
	public String getSafe_level() {
		return safe_level;
	}
	public void setSafe_level(String safe_level) {
		this.safe_level = safe_level;
	}
	@Override
	public String toString() {
		return "SRole [role_no=" + role_no + ", role_name=" + role_name
				+ ", order_no=" + order_no + ", flag=" + flag + ", memo="
				+ memo + ", create_no=" + create_no + ", create_time="
				+ create_time + ", update_no=" + update_no + ", update_time="
				+ update_time + ", safe_level=" + safe_level + "]";
	}
	public SRole(String role_no, String role_name, String order_no,
			String flag, String memo, String create_no, String create_time,
			String update_no, String update_time, String safe_level) {
		super();
		this.role_no = role_no;
		this.role_name = role_name;
		this.order_no = order_no;
		this.flag = flag;
		this.memo = memo;
		this.create_no = create_no;
		this.create_time = create_time;
		this.update_no = update_no;
		this.update_time = update_time;
		this.safe_level = safe_level;
	}
	public SRole() {
		super();
		// TODO Auto-generated constructor stub
	}

}
