package com.yusys.resources.outperson.dao;
import java.util.List;
import java.util.Map;

import com.yusys.resources.outperson.entity.RankPersonInfo;
public interface OutPersonInfoDao {
	/**
	 * 增加外包人员信息
	 * @param pmap
	 */
	public void addOutPersonInfo(Map<String, String> pmap);
	/**
	 * 新增一条人员信息
	 * @param map
	 */
	public void addRankPerson(RankPersonInfo p);
	/**
	 * 修改时 查询 外包人员信息 
	 * @param op_id
	 * @return
	 */
	public Map<String, String> findOutPersonInfoByUpdate(String op_id);
	/**
	 * 删除 外包人员信息 
	 * @param op_id
	 * @return
	 */
	public void deleteFindOutPersonInfo(String op_id);
	/**
	 * 删除职级评定人员信息 
	 * @param op_id
	 * @return
	 */
	public void deleteRankPerson(String op_id);
	/**
	 * 删除职级评定信息 
	 * @param op_id
	 * @return
	 */
	public void deleteRankPerInfo(String op_id);
	/**
	 * 修改外包人员 
	 * @param pmap
	 */
	public void updateOutPerson(Map<String, String> pmap);
	/**
	 * 查询外包任务信息
	 * @param pmap
	 */
	public List<Map<String, String>> findOutPersonToList(Map<String, String> pmap);
	/**
	 * 判断身份证是否存在
	 * @param pmap
	 */
	public List<Map<String, String>> judgeCode(String op_code);
	/**
	 * 根据供应商名称 获取供应商ID
	 * @param supplier_name
	 * @return
	 */
	public String findSupplierIdByName(String supplier_name);
	/**
	 * 增加外包人员工作资源信息
	 * @param pmap
	 */
	public void addOutPersonWorkResourceInfo(Map<String, String> pmap);
	/**
	 *修改外包人员工作资源信息
	 * @param pmap
	 */
	public void updateOutPersonWorkResourceInfo(Map<String, String> pmap);
	/**
	 * 删除外包人员工作资源信息
	 * @param op_id
	 */
	public void deleteOutPersonWorkInfo(String op_id);
	/**
	 * 查询外包人员工作资源信息
	 * @param op_id
	 * @return
	 */
	public List<Map<String, String>> findOutPersonWorkInfo(String op_id);
	/**
	 * 检查外包人员工作资源信息是否重复
	 * @param pmap
	 * @return
	 */
	public Map<String,String> checkOutPersonWorkRepeatInfo(Map<String, String> pmap);
	/**
	 *根据查询条件导出外包人员向信息
	 * @param pmap
	 * @return
	 */
	public List<Map<String,Object>> exportOutPersonInfo(Map<String, String> pmap);
	/**
	 * 新增教育经历
	 * @param pmap
	 */
	public void addEduInfo(Map<String, String> pmap);
	/**
	 * 修改教育经历
	 * @param pmap
	 */
	public void updateEduInfo(Map<String, String> pmap);
	/**
	 * 删除教育经历
	 * @param pmap
	 */
	public void deleteEduInfo(Map<String, String> pmap);
	/**
	 * 新增工作履历
	 * @param pmap
	 */
	public void addWorkInfo(Map<String, String> pmap);
	/**
	 * 修改工作履历
	 * @param pmap
	 */
	public void updateWorkInfo(Map<String, String> pmap);
	/**
	 * 删除工作履历
	 * @param pmap
	 */
	public void deleteWorkInfo(Map<String, String> pmap);
	/**
	 * 新增资质证书
	 * @param pmap
	 */
	public void addQualificateInfo(Map<String, String> pmap);
	/**
	 * 修改资质证书
	 * @param pmap
	 */
	public void updateQualificateInfo(Map<String, String> pmap);
	/**
	 * 删除资质证书
	 * @param pmap
	 */
	public void deleteQualificateInfo(Map<String, String> pmap);
	/**
	 *新增专业技能
	 * @param pmap
	 */
	public void addSkillInfo(Map<String, String> pmap);
	/**
	 * 修改专业技能
	 * @param pmap
	 */
	public void updateSkillInfo(Map<String, String> pmap);
	/**
	 * 删除专业技能
	 * @param pmap
	 */
	public void deleteSkillInfo(Map<String, String> pmap);
	/**
	 * 新增项目经历
	 * @param pmap
	 */
	public void addProjectInfo(Map<String, String> pmap);
	/**
	 * 修改项目经历
	 * @param pmap
	 */
	public void updateProjectInfo(Map<String, String> pmap);
	/**
	 * 删除项目经历
	 * @param pmap
	 */
	public void deleteProjectInfo(Map<String, String> pmap);
	/**
	 * 新增资质级别
	 * @param pmap
	 */
	public void addQualiLevelInfo(Map<String, String> pmap);
	/**
	 * 修改资质级别
	 * @param pmap
	 */
	public void updateQualiLevelInfo(Map<String, String> pmap);
	/**
	 * 删除资质级别
	 * @param pmap
	 */
	public void deleteQualiLevelInfo(Map<String, String> pmap);
	/**
	 * 新增资源池
	 * @param pmap
	 */
	public void addResPoolInfo(Map<String, String> pmap);
	/**
	 * 修改资源池
	 * @param pmap
	 */
	public void updateResPoolInfo(Map<String, String> pmap);
	/**
	 * 删除资源池
	 * @param pmap
	 */
	public void deleteResPoolInfo(Map<String, String> pmap);
	
	//通过身份证查外包人员
	public  Map<String, String> findOutPersonIdByIdcard(String string);
	//保存外包人员基本信息(导入)
	public void addOutPersonInfoExc(Map<String, String> pmap);
	//修改外包人员基本信息(导入)
	public void updateOutPersonExc(Map<String, String> pmap);
	//导入资源池
	public void addResPoolInfoExc(Map<String, String> pmap);
	//导入专业技能
	public void addSkillInfoExc(Map<String, String> pmap);
	//导入资质证书
	public void addQualificateInfoExc(Map<String, String> pmap);
	//导入项目经历
	public void addProjectInfoExc(Map<String, String> pmap);
	//导入工作履历
	public void addWorkInfoExc(Map<String, String> pmap);
	//导入资质级别
	public void addQualiLevelInfoExc(Map<String, String> pmap);
	//外包人员离场信息录入
	public void addOutPersonLeaveInfo(Map<String, String> pmap);
	//外包人员离场信息查看
	public List<Map<String, String>> findOutPersonLeaveDetailInfo(
			Map<String, String> pmap);
	//职级评定/升级新增
	public void addOutPersonRank(Map<String, String> pmap);
	//职级评定/升级修改
	public void updateOutPerInfoRank(Map<String, String> pmap);
	//查询判断是否以保存
	public String findOutPersonRankByOpid(String string);
	/**
	 * 查询最近3次考核分数 
	 * @param pmap
	 * @return
	 */
	public List<Map<String, String>> findNearThreeTimesCheck(Map<String, String> pmap);
	//查询是否是当前资质
	public List<Map<String, String>> findIsCurrentByOpCode(Map<String, String> pmap);
	//新增时判断资质级别时间是否有重叠
	public List<Map<String, String>> queryTimeByTime(Map<String, String> pmap);
	//根据合同编号 查询外包人员数量
	public String getOutpersonNum(String contract_code);
	/**
	 * 跑批 插入离场待办
	 * @param pmap
	 */
	public void insertOutPersonOutWait(Map<String, String> pmap);
	/**
	 * 查询外包人员半年年考核情况
	 * @param op_id
	 * @return
	 */
	public List<Map<String, String>> findOutPersonHalfYearsCheck(String op_id);
	/**
	 * 是否完成职级评定
	 * @param contract_code
	 * @return
	 */
	public String isRankDoneAlready(String contract_code);
	/**
	 *  查询外包人员入场申请信息
	 * @param pmap
	 * @return
	 */
	public Map<String, String> findEpaMessage(Map<String, String> pmap);
	/**
	 * 新增外包人员入场申请信息
	 * @param pmap
	 */
	public void saveEtaMessage(Map<String, String> pmap);
	/**
	 * 修改外包人员入场申请信息
	 * @param pmap
	 */
	public void updateEtaMessage(Map<String, String> pmap);
	/**
	 * 外包人员离场申请信息
	 * @param pmap
	 */
	public void saveLaMessage(Map<String, String> pmap);
	/**
	 * 插入外包人员每日打卡信息
	 * @param req
	 * @param userId
	 * @return
	 */
	public void saveSyncEveryday(Map<String, String> pmap);
	/**
	 *插入个人维度信息
	 * @param req
	 * @param userId
	 * @return
	 */
	public void saveSyncPerson(Map<String, String> pmap);
	/**
	 * 插入考勤机信息2
	 * @param req
	 * @param userId
	 * @return
	 */
	public void saveAttendance2(Map<String, String> pmap);
	/**
	 * 查询该外包人员的当前资质是否存在
	 * @param pmap
	 * @return
	 */
	public List<Map<String, String>> findIsExist(Map<String, String> pmap);
	/**
	 * 导入时 已存在的数据先删除再插入
	 * @param pmap
	 */
	public void delIsExistBy(Map<String, String> pmap);
	/**
	 * 查询资源池信息是否存在 根据非项目任务编号
	 * @param pmap
	 * @return
	 */
	public List<Map<String, String>> checkIsExistByAssCode(Map<String, String> pmap);
	/**
	 * 查询资源池信息是否存在 根据合同编号
	 * @param pmap
	 * @return
	 */
	public List<Map<String, String>> checkIsExistByContract(Map<String, String> pmap);
	/**
	 * 根据非项目任务编号 身份证号码  人员id 删除资源池信息
	 * @param pmap
	 */
	public void delByAssCode(Map<String, String> pmap);
	/**
	 * 根据合同编号 身份证号码  人员id 删除资源池信息
	 * @param pmap
	 */
	public void delByContract(Map<String, String> pmap);
	/**
	 * 根据单位名称 开始时间 结束时间 id 身份证编号 查询工作经历是否存在
	 * @param pmap
	 * @return
	 */
	public List<Map<String, String>> findWorkInfo(Map<String, String> pmap);
	/**
	 * 根据单位名称 开始时间 结束时间 id 身份证编号 查询工作经历删除已经存在的工作经历信息
	 * @param pmap
	 * @return
	 */
	public void delWorkInfo(Map<String, String> pmap);
	/**
	 * 根据资质证书名称 发行时间 发行单位 id 身份证编号 查询资质证书信息是否已经
	 * @param pmap
	 * @return
	 */
	public List<Map<String, String>> findzzzs(Map<String, String> pmap);
	/**
	 * 根据资质证书名称 发行时间 发行单位 id 身份证编号 删除资质证书信息是否已经
	 * @param pmap
	 * @return
	 */
	public void delfindzzzsfo(Map<String, String> pmap);
	/**
	 * 根据技能类型技能名称 熟练度 掌握时间 id 身份证编号 查询资专业技能是否已经
	 * @param pmap
	 * @return
	 */
	public List<Map<String, String>> findzyjnInfo(Map<String, String> pmap);
	/**
	 * 根据技能类型技能名称 熟练度 掌握时间  id 身份证编号 删除专业技能 已存在
	 * @param pmap
	 * @return
	 */
	public void delfindzyjnInfo(Map<String, String> pmap);
	/**
	 * 根据项目名称 开始时间  结束时间 id 身份证编号 删除专业技能 已存在
	 * @param pmap
	 * @return
	 */
	public List<Map<String, String>> findProjectInfo(Map<String, String> pmap);
	/**
	 * 根据根据项目名称 开始时间  结束时间  id 身份证编号 删除专业技能 已存在
	 * @param pmap
	 * @return
	 */
	public void delProjectInfo(Map<String, String> pmap);
	/**
	 * 根据人员编号 资质开始时间 资质级别  人员档次 修改外包人员的是否当前资质的状态
	 * @param pmap
	 */
	public void updateIsCurrentByOpCode(Map<String, String> pmap);
	/**
	 * 根据应用名称查询应用编号，判断应用名称是否存在
	 * @param pmap
	 */
	public  Map<String, String> querySystem(Map<String, String> pmap);
	
}