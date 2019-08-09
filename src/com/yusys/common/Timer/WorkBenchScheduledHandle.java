package com.yusys.common.Timer;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.PersistJobDataAfterExecution;
import org.springframework.scheduling.quartz.QuartzJobBean;

import com.yusys.Utils.TaskDBUtil;
import com.yusys.dao.ScheduledDao;

/**
 * 待办工作 定时处理类
 * 
 * @author tanbo
 * 
 */
@PersistJobDataAfterExecution  
@DisallowConcurrentExecution
public class WorkBenchScheduledHandle extends QuartzJobBean {
	private static final Logger logger = Logger
			.getLogger(WorkBenchScheduledHandle.class);
	
	@Override
	protected void executeInternal(JobExecutionContext context)
			throws JobExecutionException {
		calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_MONTH, 1);// 给日期增加一天 即 今天生成明天的工作事项;
		String ymd = getYmd();// 明天的年月日
		int wd = getWeekDate();// 明天是周几
		ScheduledDao scheduledDao = (ScheduledDao)TaskDBUtil.getWebContext().getBean("scheduledDao");
		
		TaskDBUtil taskDBUtil  = (TaskDBUtil)TaskDBUtil.getWebContext().getBean("taskDBUtil");
		
		Map<String, String> cfgHoliday = taskDBUtil.getCfgHoliDayByDate(ymd);

		// 未被标记的工作日 或者是被标记为工作的日期
		if ((cfgHoliday == null && wd <= 5)
				|| (cfgHoliday != null && "1".equals(String.valueOf(cfgHoliday
						.get("S_TYPE"))))) {
			int day = getMonthDate();// 明天是几号
			calendar.add(Calendar.DAY_OF_MONTH, -7);// 向前推七天
			String ymd7 = getYmd();// 一个星期之前
			calendar.add(Calendar.DAY_OF_MONTH, 7);// 复位

			calendar.add(Calendar.MONTH, -1);// 向前推一个月
			String ymd30 = getYmd();// 获取一个月之前的今天

			Map<String, String> pMap = new HashMap<String, String>();
			pMap.put("ymd", ymd);
			pMap.put("ymd7", ymd7);
			pMap.put("ymd30", ymd30);
			pMap.put("week", wd + "");
			pMap.put("day", day + "");

			boolean isfb_task = true;
			boolean isfs_task = true;
			boolean isnofs_task = true;
			long startTimer = System.currentTimeMillis();
			for (;;) {
				if ((!isfb_task && !isfs_task && !isnofs_task)
						|| (System.currentTimeMillis() - startTimer) > (3600 * 1000)) {
					break;
				}
				logger.info("#######################feedback:" + pMap);
				// 待反馈任务
				List<Map<String, String>> fbmap = scheduledDao
						.getNeedWorkBenchInfoFBTask(pMap);
				if ((fbmap == null || fbmap.size() == 0)) {
					isfb_task = false;
				}

				logger.info("#######################feedback.size():"
						+ fbmap.size());

				if (isfb_task) {
					String sendPer;
					for (int i = 0; fbmap != null && i < fbmap.size(); i++) {
						Map<String, String> map = fbmap.get(i);
						if ("03".equals(map.get("TASK_TYPE"))) {// 协同任务
							sendPer = map.get("TASK_COORDINATOR");
						} else {
							sendPer = map.get("TASK_EXECUTOR");
						}
						try {
							taskDBUtil.addTaskRemindInfo("3",
									String.valueOf(map.get("TASK_ID")),
									map.get("TASK_NAME"), sendPer);
						} catch (Exception e) {
							logger.info("任务反馈提醒生成失败:"
									+ String.valueOf(map.get("TASK_ID")) + ";"
									+ map.get("TASK_NAME") + ";" + sendPer);
							e.printStackTrace();
						}
					}
					fbmap.clear();
				}

				// 待完成任务
				List<Map<String, String>> fsmap = scheduledDao
						.getNeedWorkBenchInfoFSTask(pMap);
				if (fsmap == null || fsmap.size() == 0) {
					isfs_task = false;
				}

				if (isfs_task) {
					for (int i = 0; i < fsmap.size(); i++) {
						Map<String, String> map = fsmap.get(i);
						String sendPer = "";
						try {
							if ("03".equals(map.get("TASK_TYPE"))) {// 协同任务
								sendPer = map.get("TASK_COORDINATOR");
							} else {
								sendPer = map.get("TASK_EXECUTOR");
							}
							taskDBUtil.addTaskRemindInfo("5",
									String.valueOf(map.get("TASK_ID")),
									map.get("TASK_NAME"), sendPer);
						} catch (Exception e) {
							logger.info("任务待完成生成失败:"
									+ String.valueOf(map.get("TASK_ID")) + ";"
									+ map.get("TASK_NAME") + ";" + sendPer);
							e.printStackTrace();
						}
					}
					fsmap.clear();
				}
				// 到期未完成的任务 to 创建人
				List<Map<String, String>> nofsmap = scheduledDao
						.getWorkBenchInfoNoFSTask(pMap);
				if (nofsmap == null || nofsmap.size() == 0) {
					isnofs_task = false;
				}
				if (isnofs_task) {
					for (int i = 0; i < nofsmap.size(); i++) {
						Map<String, String> map = nofsmap.get(i);
						try {
							taskDBUtil.addTaskRemindInfo("13",
									String.valueOf(map.get("TASK_ID")),
									map.get("TASK_NAME"),
									map.get("TASK_CREATOR"));
						} catch (Exception e) {
							logger.info("任务到期未完成提醒生成失败:"
									+ String.valueOf(map.get("TASK_ID")) + ";"
									+ map.get("TASK_NAME") + ";"
									+ map.get("TASK_CREATOR"));
							e.printStackTrace();
						}
					}
				}
			}
		}
	}

	/**
	 * 日期操作对象
	 */
	private Calendar calendar = null;

	/**
	 * 月份的第几天
	 * 
	 * @return
	 */
	private int getMonthDate() {
		return calendar.get(Calendar.DATE);
	}

	/**
	 * 星期的第几天 因为 星期日=1 星期一=2 所以需要进行转换
	 * 
	 * @return
	 */
	private int getWeekDate() {
		int wd = calendar.get(Calendar.DAY_OF_WEEK) - 1;
		if (wd == 0) {
			return 7;
		}
		return wd;
	}

	/**
	 * 年月日
	 * 
	 * @return
	 */
	private String getYmd() {
		int y = calendar.get(Calendar.YEAR);
		int m = calendar.get(Calendar.MONTH) + 1;
		int d = calendar.get(Calendar.DAY_OF_MONTH);
		return y + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "")
				+ d;
	}

}