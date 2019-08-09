package com.yusys.service.SHolidaysService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.dao.SHolidaysDao;

@Service
@Transactional
public class SHolidaysService implements ISHolidaysService {
	@Resource
	private SHolidaysDao holidaysDao;
	
	/**
	 * 查询节假日所有标记
	 */
	@Override
	public List<Map<String, String>> queryHolidays(HttpServletRequest req,
			String actorno) {
		Map<String, String> hmap=new HashMap<String, String>();
		String s_date = RequestUtils.getParamValue(req, "s_date");
		if(s_date!=null && !"".equals(s_date)){
			hmap.put("s_date",s_date+"%");//yyyymm
		}
		List<Map<String, String>> list=holidaysDao.queryHolidays(hmap);
		return list;
	}
	/**
	 * 写入节假日标记
	 */
	@Override
	public Map<String, String> insertHoliday(HttpServletRequest req,
			String actorno) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String[] nomust=new String[]{"s_type","s_date"};
		Map<String, String> hmap=RequestUtils.requestToMap(req,null , nomust);
		if (hmap==null || hmap.size()==0) {
			resultMap.put("result", "false");
			return resultMap;
		}
		hmap.put("opt_person", actorno);
		hmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
		holidaysDao.deleteHoliday(hmap);
		holidaysDao.insertHoliday(hmap);
		resultMap.put("result", "true");
		return resultMap;
	}
	/**
	 * 删除节假日标记
	 */
	@Override
	public Map<String, String> deleteHoliday(HttpServletRequest req,
			String actorno) {
		Map<String, String> resultMap=new HashMap<String, String>();
		String s_date = RequestUtils.getParamValue(req, "s_date");
		if(s_date!=null &&! "".equals(s_date)){
			Map<String, String> hmap = new HashMap<String, String>();
			hmap.put("s_date", s_date);//yyyymmdd
			holidaysDao.deleteHoliday(hmap);
			resultMap.put("result", "true");
		}else{
			resultMap.put("result", "false");
		}
		return resultMap;
	}
	/**
	 * 保存每月节假日信息
	 */
	@Override
	public Map<String, String> savePatch(HttpServletRequest req, String actorno) {
		Map<String, String> resultMap=new HashMap<String, String>();
		Map<String, String> hmap=new HashMap<String, String>();
		String data=RequestUtils.getParamValue(req, "data");
		String year=RequestUtils.getParamValue(req, "year");
		Map<String, String> delMap=new HashMap<String, String>();
		delMap.put("s_date", year+"%");//先删除本月历史数据
		holidaysDao.deletePatch(delMap);
		String[] temp=data.split(";");
		for (int i = 0; i < temp.length; i++) {
			hmap.put("opt_person", actorno);
			hmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
			hmap.put("s_date", temp[i].split(":")[0]);
			hmap.put("s_type", temp[i].split(":")[1]);
			holidaysDao.insertHoliday(hmap);//逐条保存本月节假日数据
		}
		resultMap.put("result", "true");
		return resultMap;
	}
	
	/**
	 * 查询所有工作日以及本月的日期是否已经配置
	 */
	@Override
	public Map<String, Object> queryWork(HttpServletRequest req,
			String actorno) {
		Map<String, Object> map=new HashMap<String, Object>();
		Map<String, String> hmap=new HashMap<String, String>();
		String params = RequestUtils.getParamValue(req, "params");
		if(params!=null && !"".equals(params)){
			hmap.put("s_date",params+"%");//yyyymm
		}
		hmap.put("w_date",params);
		hmap.put("staff_id",actorno);
		Map<String, String> list=holidaysDao.queryWork(hmap);
		Map<String, String> workConfig=holidaysDao.queryWorkConfig(hmap);
		Map<String, String> bookedDate=holidaysDao.queryBookedDate(hmap);
		map.put("bookedDate", bookedDate);
		map.put("list", list);
		map.put("workConfig", workConfig);
		return map;
	}
    
}