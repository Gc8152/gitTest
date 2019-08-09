package com.yusys.Utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yusys.dao.AFAppDao;
import com.yusys.entity.SUser;
import com.yusys.service.SUserService.ISUserService;
@Service
@Transactional
public class ApprovalFlowUtil {
	@Resource
	private ISUserService suserService;
	@Resource
	private AFAppDao afAppDao;
	/**
	 * 获取流程所有路由要素和节点要素
	 * @param systemFlag 系统标识
	 * @param param 业务要素
	 * @return
	 */
	public Map<String, Object> getRoutesAndNodes(HttpServletRequest req){
		Map<String, Object> map = new HashMap<String,Object>();
		Map<String, Object> routeMap = new HashMap<String, Object>();
		Map<String, Object> nodeMap = new HashMap<String, Object>();
		String af_id = req.getParameter("af_id");
		List<Map<String,Object>> list = afAppDao.queryAllAFBySysCode(req.getParameter("systemFlag"));
		List<Map<String,Object>> list1 = afAppDao.queryAllAFByAfId(af_id);
		//存储路由要素值
		if(list.size()>0){
			for(int i = 0;i<list.size();i++){
				String b_code = (String) list.get(i).get("B_CODE");
				//要素类别是路由要素
				if(list.get(i).get("B_CATEGORY").equals(AFConstant.NODE_FACTOR)){
					routeMap.put(b_code, req.getParameter(b_code));
				}
			}
		}
		//存储节点要素值
		if(list1.size()>0){
			for(int j = 0;j<list1.size();j++){
				Map<String,Object> ml = list1.get(j);
				String n_id = ml.containsKey("N_ID")?String.valueOf(ml.get("N_ID")):"";
				String n_type = ml.containsKey("N_TYPE")?String.valueOf(ml.get("N_TYPE")):"";
				String n_value = ml.containsKey("N_VALUE")?String.valueOf(ml.get("N_VALUE")):"";
				String n_role = ml.containsKey("N_ROLE")?String.valueOf(ml.get("N_ROLE")):"";
				String n_person = ml.containsKey("N_PERSON")?String.valueOf(ml.get("N_PERSON")):"";
				//节点审批人取数规则：节点要素；节点类型：单人审批;节点值不为空，角色编号为空
				if(n_person.equals(AFConstant.APPROVER_NODE) && !n_value.isEmpty() && 
						n_role.isEmpty() && n_type.equals(AFConstant.AF_NODE_TYPE_SINGLE)){
					nodeMap.put(n_id, req.getParameter(n_value));
				}else if(n_person.equals(AFConstant.APPROVER_RULE)){//节点审批人取数规则：角色
					String users = "";
					//根据部门+角色匹配人；或者角色匹配人；
					if((!n_value.isEmpty() && !n_role.isEmpty()) || 
							(n_value.isEmpty() && !n_role.isEmpty())){
						if("o_project_manager".equals(n_value)) {//当流程是外包人员请销假时
							users = suserService.queryManagerByParam(req.getParameter("user_id"));
						}else {
						    users = suserService.queryUserByParam(req.getParameter(n_value),n_role);
						}
					}else {//匹配人员有无
						users = "";
					}
					//给节点绑定人员
					if(n_type.equals(AFConstant.AF_NODE_TYPE_SINGLE)){//节点类型：单人审批
						//nodeMap.put(n_id, users.contains(",")?users.substring(0, users.indexOf(",")):users);
						nodeMap.put(n_id, users);
					}else {//节点类型：多人并行；多人竞争
						nodeMap.put(n_id, users);
					}
				}else if(n_person.equals(AFConstant.APPROVER_NODE) && !n_value.isEmpty() && 
						n_role.isEmpty() && n_type.equals(AFConstant.AF_NODE_TYPE_PARALLEL)){
					nodeMap.put(n_id, req.getParameter(n_value));
				}else {//其他情况，节点匹配人员有无
					nodeMap.put(n_id, "");
				}
			}
		}
		map.put("route",routeMap);
		map.put("node",nodeMap);
		return map;
	}
}
