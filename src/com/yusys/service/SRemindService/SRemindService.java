package com.yusys.service.SRemindService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.Utils.RequestUtils;
import com.yusys.dao.SRemindDao;
@Service
@Transactional
public class SRemindService implements ISRemindService{
	@Resource
	private SRemindDao sRemindDao;
	/**
	 * 根据人员查询我的提醒
	 */
	@Override
	public Map<String, Object> findMyRemindByUserid(HttpServletRequest req,
			String userid) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		if(limit!=null&&!"".equals(limit)){
			pmap.put("limit",limit);
		}
		if(offset!=null&&!"".equals(offset)){
			pmap.put("offset",offset);
		}
		pmap.put("userid", userid);
		List<Map<String, Object>> m=sRemindDao.findMyRemindByUserid(pmap);
		retmap.put("rows", m);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}
	
	/**
	 *  根据类型，人员查询我的提醒详情
	 */
	public Map<String, Object> querySubRemindByType(HttpServletRequest req,
			String userid) {
		Map<String, Object> retmap=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		String limit = RequestUtils.getParamValue(req, "limit");
		String offset = RequestUtils.getParamValue(req, "offset");
		if(limit!=null&&!"".equals(limit)){
			pmap.put("limit",limit);
		}
		if(offset!=null&&!"".equals(offset)){
			pmap.put("offset",offset);
		}
		pmap.put("user_id", userid);
		pmap.put("remind_type", RequestUtils.getParamValue(req, "remind_type"));
		List<Map<String, Object>> m=sRemindDao.querySubRemindByType(pmap);
		retmap.put("rows", m);
		retmap.put("total", pmap.get("total"));
		return retmap;
	}
	//根据类型，人员删除我的提醒详情
	public Map<String, Object> deleteSubRemind(HttpServletRequest req,
			String userid) {
		Map<String, Object> resultMap=new HashMap<String, Object>();
		Map<String, String> pmap=new HashMap<String, String>();
		try {
			String remind_type = RequestUtils.getParamValue(req, "remind_type");
			pmap.put("remind_type", remind_type);
			pmap.put("user_id", userid);
			String id = RequestUtils.getParamValue(req, "id");
			pmap.put("id", id);
			//点击提醒后就删除提醒消息
			sRemindDao.deleteSubRemind(pmap);
			//统计子表提醒数量
			List<Map<String, Object>> m = sRemindDao.countRemindNum(pmap);
			//数量大于0，更新数量，等于0就删除父表的提醒
			if(m.size()>0){
				Object num = m.get(0).get("REMIND_NUM");
				pmap.put("remind_num", num.toString());
				sRemindDao.updateRemindNum(pmap);
			}else{
				sRemindDao.delRemindByType(pmap);
			}
			resultMap.put("result", "true");
			return resultMap;
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("result", "false");
			return resultMap;
		} 
	}

}
