package com.yusys.serviceorder.personnelPrice.dao;

import java.util.List;
import java.util.Map;

import com.yusys.serviceorder.personnelPrice.entity.PersonnelPriceInfo;
import com.yusys.serviceorder.personnelPrice.entity.PersonnelTypeInfo;

/**
 * 人员单价信息维护DAO
 * @author Houhf
 * Time 2016-09-18
 */
public interface PersonnelPriceDao {
	/**
	 * 查询全部人员单价信息
	 * @param map查询条件
	 * @return 返回结果
	 */
	public List<Map<String,Object>> queryFrameContInfo(Map<String,String> map);
	/**
	 * 判断人员单价是否已存在
	 * @param map查询条件
	 * @return 返回结果
	 */
	public List<Map<String,String>> findOutPersonPriceByIdcard(Map<String,String> map);
	/**
	 * 新增一条人员单价详细信息
	 * @param map 人员单价基本信息
	 */
	public void addPersonPrice(PersonnelPriceInfo p);
	/**
	 * 根据资质级别和人员档次修改人员单价详情信息
	 * @param map 人员单价基本信息
	 */
	public void updateOnePersonPrice(PersonnelPriceInfo p);
	/**
	 * 新增一条人员单价类别信息
	 * @param map 人员单价类别信息
	 */
	public void addPersonType(PersonnelTypeInfo p);
    /**
	 * 查询一条人员单价详情信息
	 * @param pmap 主键id
	 * @return
	 */
    public List<Map<String,Object>> findPPDetailById(Map<String, String> pmap);
    /**
     * 查询一条人员单价详情信息
     * @param pmap 主键id
     * @return
     */
    public List<Map<String,Object>> findPPDetailByLevel(Map<String, String> pmap);
    /**
     * 修改一条人员单价信息
     * @param map 修改内容
     */
    public void updatePersonPrice(PersonnelTypeInfo p);
}
