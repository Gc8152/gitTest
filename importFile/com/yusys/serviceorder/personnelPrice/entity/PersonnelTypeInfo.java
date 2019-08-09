package com.yusys.serviceorder.personnelPrice.entity;
/**
 * 人员信息单价维护实体类
 * @author Houhhf
 * Time 2016-09-18
 */
public class PersonnelTypeInfo {
    /**
	 * 主键ID
	 */   
	private Integer p_id;
	/**
	 * 供应商ID
	 */
	private String supplier_id;
	/**
	 *合同编号
	 */
	private String contract;
	/**
	 * 开始时间
	 */
	private String  p_starttime;
	/**
	 * 结束时间
	 */
	private String   p_endtime;
	/**
	 * 分类
	 */
	private String p_category;
	/**
	 * 类型
	 */
	private String p_type;
	/**
	 * 备注
	 */
	private String p_memo;
	/**
	 * 操作人
	 */
	private String opt_person;
	/**
	 *操作时间
	 */
	private String opt_time ;
	public Integer getP_id() {
		return p_id;
	}
	public void setP_id(Integer p_id) {
		this.p_id = p_id;
	}
	public String getSupplier_id() {
		return supplier_id;
	}
	public void setSupplier_id(String supplier_id) {
		this.supplier_id = supplier_id;
	}
	public String getContract() {
		return contract;
	}
	public void setContract(String contract) {
		this.contract = contract;
	}
	public String getP_starttime() {
		return p_starttime;
	}
	public void setP_starttime(String p_starttime) {
		this.p_starttime = p_starttime;
	}
	public String getP_endtime() {
		return p_endtime;
	}
	public void setP_endtime(String p_endtime) {
		this.p_endtime = p_endtime;
	}
	public String getP_category() {
		return p_category;
	}
	public void setP_category(String p_category) {
		this.p_category = p_category;
	}
	public String getP_type() {
		return p_type;
	}
	public void setP_type(String p_type) {
		this.p_type = p_type;
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
	public PersonnelTypeInfo(Integer p_id, String supplier_id,
			String contract, String p_starttime, String p_endtime,
			String p_category, String p_type, String p_memo, String opt_person,
			String opt_time) {
		super();
		this.p_id = p_id;
		this.supplier_id = supplier_id;
		this.contract = contract;
		this.p_starttime = p_starttime;
		this.p_endtime = p_endtime;
		this.p_category = p_category;
		this.p_type = p_type;
		this.p_memo = p_memo;
		this.opt_person = opt_person;
		this.opt_time = opt_time;
	}
	public PersonnelTypeInfo() {
		super();
	}
	@Override
	public String toString() {
		return "PersonnelTypeInfo [p_id=" + p_id + ", supplier_id="
				+ supplier_id + ", contract=" + contract + ", p_starttime="
				+ p_starttime + ", p_endtime=" + p_endtime + ", p_category="
				+ p_category + ", p_type=" + p_type + ", p_memo=" + p_memo
				+ ", opt_person=" + opt_person + ", opt_time=" + opt_time + "]";
	}
	
}
