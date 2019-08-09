package com.yusys.entity;
/*
 * 常用功能配置
 */
public class SFunction {
   private String menu_code;//菜单编号
   private String menu_name;//菜单名称
   private String menu_url;//菜单地址
   private String menu_img;//菜单图片
   private String menu_memo;//备注
   private String opt_person;//操作人
   private String opt_time;//操作时间
public String getMenu_code() {
	return menu_code;
}
public void setMenu_code(String menu_code) {
	this.menu_code = menu_code;
}

public String getMenu_memo() {
	return menu_memo;
}
public void setMenu_memo(String menu_memo) {
	this.menu_memo = menu_memo;
}
public String getMenu_name() {
	return menu_name;
}
public void setMenu_name(String menu_name) {
	this.menu_name = menu_name;
}
public String getMenu_url() {
	return menu_url;
}
public void setMenu_url(String menu_url) {
	this.menu_url = menu_url;
}
public String getMenu_img() {
	return menu_img;
}
public void setMenu_img(String menu_img) {
	this.menu_img = menu_img;
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
