package com.yusys.resources.optPersonCheck.entity;

public class OptCheck {
 private String card_no;//身份证号
 private String p_name;//人员名字
 private String check_type;//考核类别
 private String check_score;//考核分数
 private String check_person;//考核人
 public String getCard_no() {
		return card_no;
	}
	public void setCard_no(String card_no) {
		this.card_no = card_no;
	}
	public String getP_name() {
		return p_name;
	}
	public void setP_name(String p_name) {
		this.p_name = p_name;
	}
	public String getCheck_type() {
		return check_type;
	}
	public void setCheck_type(String check_type) {
		this.check_type = check_type;
	}
	public String getCheck_score() {
		return check_score;
	}
	public void setCheck_score(String check_score) {
		this.check_score = check_score;
	}
	public String getCheck_person() {
		return check_person;
	}
	public void setCheck_person(String check_person) {
		this.check_person = check_person;
	}
 
}
