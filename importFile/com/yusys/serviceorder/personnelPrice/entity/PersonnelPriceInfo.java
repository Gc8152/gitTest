package com.yusys.serviceorder.personnelPrice.entity;

public class PersonnelPriceInfo {
	/**
	 * 主键ID
	 */
	private Integer p_id;
	/**
	 * 岗位
	 */
	private String p_post;
	/**
	 * 含税单价
	 */
	private String p_level;
	private String p_price_tax;
	/**
	 * 不含税单价
	 */
	private String p_price;
	/**
	 * 备注
	 */
	private String p_memo;
	/**
	 * 操作人
	 */
	private String opt_person;
	/**
	 * 操作时间
	 */
	private String opt_time;
	public Integer getP_id() {
		return p_id;
	}
	public void setP_id(Integer p_id) {
		this.p_id = p_id;
	}
	public String getP_post() {
		return p_post;
	}
	public void setP_post(String p_post) {
		this.p_post = p_post;
	}
	public String getP_level() {
		return p_level;
	}
	public void setP_level(String p_level) {
		this.p_level = p_level;
	}
	public String getP_price_tax() {
		return p_price_tax;
	}
	public void setP_price_tax(String p_price_tax) {
		this.p_price_tax = p_price_tax;
	}
	public String getP_price() {
		return p_price;
	}
	public void setP_price(String p_price) {
		this.p_price = p_price;
	}
	public String getP_memo() {
		return p_memo;
	}
	public void setP_memo(String p_memo) {
		this.p_memo = p_memo;
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
	public PersonnelPriceInfo(Integer p_id, String p_post, String p_level,
			String p_price_tax, String p_price, String p_memo,
			String opt_person, String opt_time) {
		super();
		this.p_id = p_id;
		this.p_post = p_post;
		this.p_level = p_level;
		this.p_price_tax = p_price_tax;
		this.p_price = p_price;
		this.p_memo = p_memo;
		this.opt_person = opt_person;
		this.opt_time = opt_time;
	}
	public PersonnelPriceInfo() {
		super();
		// TODO Auto-generated constructor stub
	}
	@Override
	public String toString() {
		return "PersonnelPriceInfo [p_id=" + p_id + ", p_post=" + p_post
				+ ", p_level=" + p_level + ", p_price_tax=" + p_price_tax
				+ ", p_price=" + p_price + ", p_memo=" + p_memo
				+ ", opt_person=" + opt_person + ", opt_time=" + opt_time + "]";
	}
	
	
}
