package com.yusys.entity;
	
	/**
	 * 字典项表
	 * @author Administrator
	 *
	 */
public class SDicItem {
	private String item_code;		//字典编码
	private String item_name;	//文本值
	private String dic_code;		//类别编码
	private String state;				//状态
	private String is_default;		//是否默认
	private String order_id;			//序号
	private String memo;			//说明
	private String opt_no;			//操作人
	private String opt_time;		//操作时间
	
	public String getItem_code() {
		return item_code;
	}
	public void setItem_code(String item_code) {
		this.item_code = item_code;
	}
	public String getItem_name() {
		return item_name;
	}
	public void setItem_name(String item_name) {
		this.item_name = item_name;
	}
	public String getDic_code() {
		return dic_code;
	}
	public void setDic_code(String dic_code) {
		this.dic_code = dic_code;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getIs_default() {
		return is_default;
	}
	public void setIs_default(String is_default) {
		this.is_default = is_default;
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
	
}
