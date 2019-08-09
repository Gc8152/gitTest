package com.yusys.entity;
/**
 * 部门表
 * @author Administrator
 *
 */
public class SOrg {
	private String org_code;		//部门编号
	private String suporg_code;		//上级部门编号
	private String suporg_name;		//上级部门名称
	private String org_name;		//部门名称
	private String org_shortname;	//部门简称
	private String org_enname;		//英文名称
	private String order_no;		//序号
	private String launch_date;		//设立日期
	private String org_level;		//部门级别
	private String org_type;		//部门类型
	private String state;			//状态
	private String org_manager;		//部门经理
	private String org_manager_code;		//部门经理
	private String org_manager_name;//部门经理中文名
	private String org_area;		//所属大区
	private String business_type;	//业务类型
	private String org_address;		//地址
	private String memo;			//备注
	private String org_extend1;		//扩展字段1
	private String org_extend2;		//扩展字段2
	private String org_extend3;		//扩展字段3
	private String create_no;		//创建人
	private String create_time;		//创建时间
	private String update_no;		//修改人
	private String update_time;		//修改时间
	private String org_vp;          //分管领导编号
	private String org_vpname;      //分管领导姓名
	private String enable_flag;     //系统启用标记（00启用，01停用）
	
	
	public String getOrg_vp() {
		return org_vp;
	}
	public void setOrg_vp(String org_vp) {
		this.org_vp = org_vp;
	}
	public String getOrg_vpname() {
		return org_vpname;
	}
	public void setOrg_vpname(String org_vpname) {
		this.org_vpname = org_vpname;
	}
	public String getEnable_flag() {
		return enable_flag;
	}
	public void setEnable_flag(String enable_flag) {
		this.enable_flag = enable_flag;
	}
	public String getSuporg_name() {
		return suporg_name;
	}
	public void setSuporg_name(String suporg_name) {
		this.suporg_name = suporg_name;
	}
	public String getOrg_manager_name() {
		return org_manager_name;
	}
	public void setOrg_manager_name(String org_manager_name) {
		this.org_manager_name = org_manager_name;
	}
	public String getOrg_code() {
		return org_code;
	}
	public void setOrg_code(String org_code) {
		this.org_code = org_code;
	}
	public String getSuporg_code() {
		return suporg_code;
	}
	public void setSuporg_code(String suporg_code) {
		this.suporg_code = suporg_code;
	}
	public String getOrg_name() {
		return org_name;
	}
	public void setOrg_name(String org_name) {
		this.org_name = org_name;
	}
	public String getOrg_shortname() {
		return org_shortname;
	}
	public void setOrg_shortname(String org_shortname) {
		this.org_shortname = org_shortname;
	}
	public String getOrg_enname() {
		return org_enname;
	}
	public void setOrg_enname(String org_enname) {
		this.org_enname = org_enname;
	}
	public String getOrder_no() {
		return order_no;
	}
	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}
	public String getLaunch_date() {
		return launch_date;
	}
	public void setLaunch_date(String launch_date) {
		this.launch_date = launch_date;
	}
	public String getOrg_level() {
		return org_level;
	}
	public void setOrg_level(String org_level) {
		this.org_level = org_level;
	}
	public String getOrg_type() {
		return org_type;
	}
	public void setOrg_type(String org_type) {
		this.org_type = org_type;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getOrg_manager() {
		return org_manager;
	}
	public void setOrg_manager(String org_manager) {
		this.org_manager = org_manager;
	}
	public String getOrg_area() {
		return org_area;
	}
	public void setOrg_area(String org_area) {
		this.org_area = org_area;
	}
	public String getBusiness_type() {
		return business_type;
	}
	public void setBusiness_type(String business_type) {
		this.business_type = business_type;
	}
	public String getOrg_address() {
		return org_address;
	}
	public void setOrg_address(String org_address) {
		this.org_address = org_address;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public String getOrg_extend1() {
		return org_extend1;
	}
	public void setOrg_extend1(String org_extend1) {
		this.org_extend1 = org_extend1;
	}
	public String getOrg_extend2() {
		return org_extend2;
	}
	public void setOrg_extend2(String org_extend2) {
		this.org_extend2 = org_extend2;
	}
	public String getOrg_extend3() {
		return org_extend3;
	}
	public void setOrg_extend3(String org_extend3) {
		this.org_extend3 = org_extend3;
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
	public String getOrg_manager_code() {
		return org_manager_code;
	}
	public void setOrg_manager_code(String org_manager_code) {
		this.org_manager_code = org_manager_code;
	}
	
}
