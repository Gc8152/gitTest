package com.yusys.entity;

/**
 * @author :yuanqt 
 * @date：2017年3月5日
 * @describe: 工作时间配置实体
 */

public class WorkTimePO {
 
	//主键
	private String serNo;//
	
	//早上迟到时间
	private String am_late_time;
	
	//早上上班时间
	private String am_work_up_time;
	
	//早上下班时间
	private String am_work_down_time;
	
	//下午迟到时间
	private String pm_late_time;
	
	//下午上班时间
	private String pm_work_up_time;
	
	//下午下班时间
	private String pm_work_down_time;
	
	//加班结束时间
	private String ot_end_time;
	
	//加班开始时间
	private String ot_start_time;
	
	//早退时间
	private String leave_early_time;
	
	//是否允许提前报工
	private String is_allow;
	
	//补漏报期限
	private String deadline;

	public String getSerNo() {
		return serNo;
	}

	public void setSerNo(String serNo) {
		this.serNo = serNo;
	}

	public String getAm_late_time() {
		return am_late_time;
	}

	public void setAm_late_time(String am_late_time) {
		this.am_late_time = am_late_time;
	}

	public String getAm_work_up_time() {
		return am_work_up_time;
	}

	public void setAm_work_up_time(String am_work_up_time) {
		this.am_work_up_time = am_work_up_time;
	}

	public String getAm_work_down_time() {
		return am_work_down_time;
	}

	public void setAm_work_down_time(String am_work_down_time) {
		this.am_work_down_time = am_work_down_time;
	}

	public String getPm_late_time() {
		return pm_late_time;
	}

	public void setPm_late_time(String pm_late_time) {
		this.pm_late_time = pm_late_time;
	}

	public String getPm_work_up_time() {
		return pm_work_up_time;
	}

	public void setPm_work_up_time(String pm_work_up_time) {
		this.pm_work_up_time = pm_work_up_time;
	}

	public String getPm_work_down_time() {
		return pm_work_down_time;
	}

	public void setPm_work_down_time(String pm_work_down_time) {
		this.pm_work_down_time = pm_work_down_time;
	}

	public String getOt_end_time() {
		return ot_end_time;
	}

	public void setOt_end_time(String ot_end_time) {
		this.ot_end_time = ot_end_time;
	}

	public String getOt_start_time() {
		return ot_start_time;
	}

	public void setOt_start_time(String ot_start_time) {
		this.ot_start_time = ot_start_time;
	}

	public String getLeave_early_time() {
		return leave_early_time;
	}

	public void setLeave_early_time(String leave_early_time) {
		this.leave_early_time = leave_early_time;
	}

	public String getIs_allow() {
		return is_allow;
	}

	public void setIs_allow(String is_allow) {
		this.is_allow = is_allow;
	}

	public String getDeadline() {
		return deadline;
	}

	public void setDeadline(String deadline) {
		this.deadline = deadline;
	}

	/**
	 * @param serNo
	 * @param am_late_time
	 * @param am_work_up_time
	 * @param am_work_down_time
	 * @param pm_late_time
	 * @param pm_work_up_time
	 * @param pm_work_down_time
	 * @param ot_end_time
	 * @param ot_start_time
	 * @param leave_early_time
	 * @param is_allow
	 * @param deadline
	 */
	public WorkTimePO(String serNo, String am_late_time,
			String am_work_up_time, String am_work_down_time,
			String pm_late_time, String pm_work_up_time,
			String pm_work_down_time, String ot_end_time, String ot_start_time,
			String leave_early_time, String is_allow, String deadline) {
		super();
		this.serNo = serNo;
		this.am_late_time = am_late_time;
		this.am_work_up_time = am_work_up_time;
		this.am_work_down_time = am_work_down_time;
		this.pm_late_time = pm_late_time;
		this.pm_work_up_time = pm_work_up_time;
		this.pm_work_down_time = pm_work_down_time;
		this.ot_end_time = ot_end_time;
		this.ot_start_time = ot_start_time;
		this.leave_early_time = leave_early_time;
		this.is_allow = is_allow;
		this.deadline = deadline;
	}

	/**
	 * 
	 */
	public WorkTimePO() {
		super();
	}
	
	
}
