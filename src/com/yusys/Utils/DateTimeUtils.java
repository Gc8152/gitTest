package com.yusys.Utils;

import java.security.MessageDigest;
/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 15-11-9
 * Time: 下午1:48
 * To change this template use File | Settings | File Templates.
 */
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import sun.misc.BASE64Encoder;
/**
 * 日期工具类
 * @author wuxw
 *
 */
public class DateTimeUtils {
    /** 日期格式 ** */
    public static final String DATE_PATTERN = "yyyy-MM-dd";
    public static final String DATE_PATTERN2 = "yyyyMMdd";
    /** 日期格式 ** */
    public static final String TIME_PATTERN = "yyyy-MM-dd HH:mm:ss";

    /**
     * 获得当前的系统时间
     *
     * @return 当前的系统日期
     */
    public static Date getCurrentTime() {
        return new Date();
    }

    /**
     * 获得当前的系统日期，不带有时分秒
     *
     * @return 当前的系统日期
     */
    public static Date getCurrentDate() {

        Date date = new Date();
        Calendar c = Calendar.getInstance();
        c.setTime(date);

        c.clear(Calendar.HOUR);
        c.clear(Calendar.MINUTE);
        c.clear(Calendar.SECOND);
        c.clear(Calendar.MILLISECOND);

        date = c.getTime();
        return date;
    }

    /**
     * 得到当前系统日期,格式："yyyy-MM-dd"
     *
     * @return
     */
    public static String getFormatCurrentDate() {
        return format(getCurrentDate(), DATE_PATTERN);
    }
    /**
     * 得到当前系统日期,格式："yyyyMMdd"
     *
     * @return
     */
    public static String getFormatCurrentDate2() {
        return format(getCurrentDate(), DATE_PATTERN2);
    }


    /**
     * 得到当前系统日期,格式："yyyy-MM-dd HH:mm:ss"
     *
     * @return
     */
    public static String getFormatCurrentTime() {
        return format(getCurrentTime(), TIME_PATTERN);
    }

    /**
     * 输出字符串类型的格式化日期
     *
     * @param dt
     *            Date
     * @param pattern
     *            时间格式
     * @return sDate
     */
    public static String format(Date dt, String pattern) {
        String sDate;
        SimpleDateFormat formatter = new SimpleDateFormat(pattern);
        sDate = formatter.format(dt);
        return sDate;
    }

    /**
     * 获取当前月份
     *
     * @return
     */
    public static String getCurrentMonth() {
        return getDateMonth(getCurrentDate());
    }
    /**
     * 获取当前年份
     *
     * @return
     */
    public static String getCurrentYear() {
    	Calendar calendar=Calendar.getInstance();
    	String year = calendar.get(Calendar.YEAR)+"";
    	return year;
    }
    /**
     * 得到指定日期的月份
     *
     * @return
     */
    public static String getDateMonth(Date date) {

        SimpleDateFormat format1 = new SimpleDateFormat(DATE_PATTERN);
        format1.setLenient(false);
        String dateStr = format1.format(date);
        int begin = dateStr.indexOf('-') + 1;
        int end = dateStr.lastIndexOf('-');
        String month = dateStr.substring(begin, end);
        return month;
    }

    /**
     * 得到指定日期后若干天的日期
     *
     * @param date
     *            指定日期
     * @param days
     *            天数
     * @return
     */
    public static Date afterDaysSinceDate(Date date, int days) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.DATE, days);
        date = c.getTime();
        return date;
    }

    /**
     * 判断两个Date是否在同一天
     *
     * @param date1
     *            date1
     * @param date2
     *            date2
     * @return
     */
    public static boolean isTwoDatesInSameDay(Date date1, Date date2) {
        Date preDate1 = preDay(date1);
        Date nextDate1 = nextDay(date1);
        if (date2.after(preDate1) && date2.before(nextDate1)) {
            return true;
        }
        return false;
    }

    /**
     * 得到指定日期的下一天
     *
     * @param date
     *            日期
     * @return
     */
    public static Date nextDay(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.DATE, 1);
        date = c.getTime();
        return date;
    }

    /**
     * 得到指定日期的前一天
     *
     * @param date
     *            日期
     * @return
     */
    public static Date preDay(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.DATE, -1);
        date = c.getTime();
        return date;
    }

    /**
     * 得到当前月份的下一个月份
     *
     * @return
     */
    public static Date addMonth(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.MONTH, 1);
        date = c.getTime();
        return date;
    }

    /**
     * 得到年份与月份
     *
     * @return String
     */
    public static String getYearMonth(Date date) {
        String yearMonthStr = format(date, DATE_PATTERN);
        int index = yearMonthStr.lastIndexOf('-');
        yearMonthStr = yearMonthStr.substring(0, index);
        return yearMonthStr;
    }

    /**
     * 得到当前月的最后一天
     *
     * @return
     */
    public static Date getLastDayOfMonth(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.MONTH, 1);
        c.set(Calendar.DAY_OF_MONTH, 1);
        c.add(Calendar.DAY_OF_MONTH, -1);
        date = c.getTime();
        return date;
    }

    /**
     * 得到当前月的第一天
     *
     * @return
     */
    public static Date getFirstDayOfMonth(Date date) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.DAY_OF_MONTH, 1);
        date = c.getTime();
        return date;
    }

    /**
     * 判断一个日期是否在指定的时间段内
     *
     * @return String
     */
    public static boolean inTimeSegment(Date start, Date end, Date date) {
        start = preDay(start);
        end = nextDay(end);
        if (date.after(start) && date.before(end)) {
            return true;
        }
        return false;
    }

    /**
     * 判断当前日期是否在指定的时间段内
     *
     * @param start
     *            时间段开始时间
     * @param end
     *            时间段结束时间
     * @return 如果当前日期在指定时间段内，则为true，否则为false
     */
    public static boolean isCurrentDateInTimeSegment(Date start, Date end) {
        Date date = getCurrentDate();
        if (inTimeSegment(start, end, date)) {
            return true;
        }
        return false;
    }

    /**
     * 得到两个日期的间隔天数
     *
     * @param start
     * @param end
     * @return
     */
    public static int getBetweenDays(Date start, Date end) {
        if (start.after(end))
            return -1;

        Calendar startC = Calendar.getInstance();
        startC.setTime(start);
        Calendar endC = Calendar.getInstance();
        endC.setTime(end);
        endC.add(Calendar.DAY_OF_YEAR, 1);
        int days = 0;
        do {
            days++;
            startC.add(Calendar.DAY_OF_YEAR, 1);
        } while (startC.before(endC));
        return days;
    }

    /**
     * 计算两个时间之间相隔秒数
     *
     * @param start
     *            开始时间
     * @param end
     *            结束时间
     * @return
     */
    public static int getIntervalSeconds(Date start, Date end) {
        // 分别得到两个时间的毫秒数
        long sl = start.getTime();
        long el = end.getTime();

        long ei = el - sl;
        return (int) (ei / 1000);
    }

    /**
     * 得到指定月份的天数
     *
     * @param date
     *            日期
     * @return
     */
    public static int daysInMonth(Date date) {
        Date start = getFirstDayOfMonth(date);
        Date end = getLastDayOfMonth(date);
        String startStr = format(start, "yyyyMMdd");
        String endStr = format(end, "yyyyMMdd");
        return Integer.parseInt(endStr) - Integer.parseInt(startStr) + 1;
    }
    /**
     * 获取十九位随机数
     * @return
     */
    public static String getRandom19(){
    	StringBuilder num19=new StringBuilder();
    	for (int i = 0; i < 19; i++) {
    		num19.append((int)(1+Math.random()*9)+"");
		}
    	return num19.toString();
    }
    /**
     * 
     * @param token
     * @return
     */
	public static String MD5Base64(String token ) {
		try {
			MessageDigest md=MessageDigest.getInstance("md5");
			byte[]md5=md.digest(token.getBytes());
			System.out.println(new String(md5));
			BASE64Encoder encoder=new BASE64Encoder();
			return encoder.encode(md5);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}



