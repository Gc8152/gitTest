package com.yusys.Utils;

public class AFConstant {
	//节点类型
	public final static String AF_NODE_TYPE_SINGLE = "00";//单人审批
	public final static String AF_NODE_TYPE_COMPETE = "01";//多人竞争
	public final static String AF_NODE_TYPE_PARALLEL = "02";//多人并行审批
	//审批结论
	public final static String APPROVAL = "00";//批准
	public final static String REJECT = "01";//拒绝（打回）
	public final static String BACK = "02";//撤回（拿回）
	public final static String ENTRUST = "03";//委托
	//流程实例状态
	public final static String COMPLETE = "00";//已完成
	public final static String CHECKING = "01";//审批中
	//是否逻辑删除
	public final static String LOGIC_DEL_YES = "00";//逻辑删除
	public final static String LOGIC_DEL_NO = "01";//未逻辑删除
	//打回类型
	public final static String BACKTYPE_LAUNCH = "00";//发起人
	public final static String BACKTYPE_UP = "01";//上一节点审批人
	//要素类别
	public final static String ROUTE_FACTOR = "00";//节点要素
	public final static String NODE_FACTOR = "01";//路由要素
	//节点审批人
	public final static String APPROVER_NODE = "01";//节点要素
	public final static String APPROVER_RULE = "02";//角色
	/**
	 * 流程ID--立项审批
	 */
	public static String AF_ID_PROJECT_APPROVE = "10";
	/**
	 * 系统标识--项目管理
	 */
	public static String SYSTEM_PROJECT = "project";
	
	/**
	 * 节点要素--需求设计中心
	 */
	public static String NODE_DMANAGER = "n_dmanager";
	/**
	 * 节点要素--产品经理所属部门主管
	 */
	public static String NODE_PMANAGER = "n_pmanager";
	/**
	 * 节点要素--软件开发中心领导审批
	 */
	public static String NODE_PCOO = "n_pcoo";
	/**
	 * 路由要素--项目规模
	 */
	public static String ROUTE_PROJECT_SCALE = "r_projectscale";
	/**
	 * 角色编号--需求设计中心
	 */
	public static String ROLE_REQ = "0030";
	/**
	 * 角色编号--产品经理所属部门主管
	 */
	public static String ROLE_MAN = "0031";
	/**
	 * 角色编号--软件开发中心领导审批
	 */
	public static String ROLE_LL = "0033";
	
	
	/**
	 * 需求审批类型
	 */
	public static String SYSTEM_CONSTR = "requirement_assess";
	/**
	 * 人月数
	 */
	public static String WORKLOAD_MONTH = "r_workloadmonth";
	/**
	 * 产品经理所属部门主管
	 */
	public static String REQ_NODE_PMANAGER	= "n_orgmanager";
	/**
	 * 架构规划中心
	 */
	public static String REQ_FRAMEWORK = "n_framework";
	/**
	 * 架构规划处角色
	 */
	public static String ROLE_FLOW = "0034";
	/**
	 * 提出部门负责人
	 */
	public static String REQ_NODE_DEPTPRINCIPAL	= "n_deptprincipal";
	/**
	 * 会签部门负责人
	 */
	public static String REQ_DEPTCOUNTERSIGN = "n_deptcountersign";
	/**
	 * 角色编号--会签部门主管
	 */
	public static String ROLE_COUNTERSIGN = "0040";
}
