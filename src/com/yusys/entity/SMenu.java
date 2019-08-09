package com.yusys.entity;

/**
 * tableName=s_menu 菜单表
 * 
 * @author tanbo
 * 
 */
public class SMenu {
	/**
	 * 菜单编号
	 */
	private String menu_no;
	/**
	 * 菜单名称
	 */
	private String menu_name;
	/**
	 * 上级菜单编号
	 */
	private String supmenu_no;
	/**
	 * 菜单URL
	 */
	private String menu_url;
	/**
	 * 菜单类型
	 */
	private String menu_type;
	/**
	 * 菜单图标
	 */
	private String menu_icon;
	/**
	 * 所属系统ID
	 */
	private String system_id;
	/**
	 * 排序字段
	 */
	private String order_id;
	/**
	 * 备注
	 */
	private String memo;
	/**
	 * 创建人
	 */
	private String create_no;
	/**
	 * 创建时间
	 */
	private String create_time;
	/**
	 * 修改人
	 */
	private String update_no;
	/**
	 * 修改时间
	 */
	private String update_time;
	/**
	 * 是否删除标示位 00未删除 01已删除
	 */
	private String flag;

	/**
	 * 菜单级别
	 */
	private String menu_level;

	public String getMenu_no() {
		return menu_no;
	}

	public void setMenu_no(String menu_no) {
		this.menu_no = menu_no;
	}

	public String getMenu_name() {
		return menu_name;
	}

	public void setMenu_name(String menu_name) {
		this.menu_name = menu_name;
	}

	public String getSupmenu_no() {
		return supmenu_no;
	}

	public void setSupmenu_no(String supmenu_no) {
		this.supmenu_no = supmenu_no;
	}

	public String getMenu_url() {
		return menu_url;
	}

	public void setMenu_url(String menu_url) {
		this.menu_url = menu_url;
	}

	public String getMenu_type() {
		return menu_type;
	}

	public void setMenu_type(String menu_type) {
		this.menu_type = menu_type;
	}

	public String getMenu_icon() {
		return menu_icon;
	}

	public void setMenu_icon(String menu_icon) {
		this.menu_icon = menu_icon;
	}

	public String getSystem_id() {
		return system_id;
	}

	public void setSystem_id(String system_id) {
		this.system_id = system_id;
	}

	public String getOrder_id() {
		return order_id;
	}

	public void setOrder_id(String order_id) {
		this.order_id = order_id;
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

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	public String getMenu_level() {
		return menu_level;
	}

	public void setMenu_level(String menu_level) {
		this.menu_level = menu_level;
	}

}
