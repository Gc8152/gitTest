package com.yusys.service.SWorkTime;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.RequestUtils;
import com.yusys.dao.WorkTimeDao;
import com.yusys.entity.WorkTimePO;

/**
 * @author :yuanqt
 * @date：2017年3月5日
 * @describe:
 */
@Service
@Transactional
public class WorkTimeService implements IWorkTimeService {
	@Resource
	private WorkTimeDao wtDao;

	@Override
	public Map<String, String> insert(HttpServletRequest req, String actorno) {
		Map<String, String> resultMap = new HashMap<String, String>();
		String serNo = req.getParameter("serNo");
		
		try {
			// 必填参数列表
			String[] must = new String[] {"serNo"};
			// 非必填的参数列表
			String[] nomust = new String[] { "am_work_up_time",
					"am_work_down_time", "pm_work_up_time",
					"pm_work_down_time", "ot_start_time", "ot_end_time","is_allow", "deadline","pm_late_time","am_late_time"};
			Map<String, String> pmap = RequestUtils.requestToMap(req, must,
					nomust);
			if (pmap == null) {
				resultMap.put("result", "false");
				resultMap.put("msg", "缺少必填项!");
				return resultMap;
			}
			// 主键为空执行保存操作，不为空则执行修改操作
			if (null == serNo || "".equals(serNo)) {
				pmap.put("serNo", "workTimeCfg");// 主键为workTimeCfg
				wtDao.insert11111(pmap);
				resultMap.put("result", "true");
				resultMap.put("serNo", "workTimeCfg");
				return resultMap;
			} else {
				wtDao.update(pmap);
				resultMap.put("result", "true");
				resultMap.put("serNo", "workTimeCfg");
				return resultMap;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		resultMap.put("result", "false");
		resultMap.put("msg", "未知错误!");
		return resultMap;
	}

	@Override
	public WorkTimePO queryOne(HttpServletRequest req, String actorno) {
		String serNo=req.getParameter("serNo");
		Map<String, String> pmap = new HashMap<String, String>();
		pmap.put("serNo", serNo);
        WorkTimePO wtPO=wtDao.queryOne(pmap);
		return wtPO;
	}


}
