package com.yusys.supplier.supplierinfo.dao;

import java.util.List;
import java.util.Map;

public interface SSupplierDao {

	/**
	 * 查询供应商主要联系人个数
	 * @param pmap
	 * @return
	 */
	public int isLiasionsCount(Map<String, String> pmap);
	//导入修改供应商信息
	public void updateImportSupInfoByNum(Map<String, String> map);
	/**
	 * 查询供应商联系人个数
	 * @param pmap
	 * @return
	 */
	public int liasionsCount(Map<String, String> pmap);
	/**
	 * 根据联系人编号删除供应商联系人
	 */
	public void deleteLinkmanInfoByNum(Map<String, String> map);
	/**
	 * 删除股东
	 */
	public void deleteShareholder(Map<String, String> map);
	/**
	 * 删除财务信息
	 */
	public void deleteFinancialInfo(Map<String, String> map);
	/**
	 * 修改一条财务信息
	 */
	public void updateFinancialInfo(Map<String, String> map);
	/**
	 * 根据供应商编号查询签约信息
	 */
	public List<Map<String, Object>> querySignInfoByNum(Map<String, Object> map);
	/**
	 * 增加签约信息
	 */
	public void addSupplierSignInfo(Map<String, String> map);
	/**
	 * 删除一条签约信息
	 */
	public void deleteSignInfoByNum(Map<String, String> map);
	/**
	 * 根据附件编号删除供应商附件
	 */
	public void deleteEnclInfoByNum(Map<String, String> map);
	/**
	 * 导入供应商信息
	 */
	public void importSuppliero(Map<String,Object> map);
	/**
	 * 导入联络人信息
	 */
	public void importPlierLinkList(Map<String,String> list);
	/**
	 * 导入股权信息
	 */
	public void importSupOwnerList(Map<String,String> list);
	/**
	 * 导入财务信息
	 */
	public void importFinancialList(Map<String,String> list);
	
	/**
	 * 导入供应商 基本信息
	 * @param map
	 */
	public void importSupplier(Map<String,String> map);
	/**
	 * 导入供应商联系人 信息
	 * @param map
	 */
	public void importSupplierLinkMan(Map<String,String> map);
	/**
	 * 导入股权信息
	 * @param map
	 */
	public void importSupplierOwnershipStructure(Map<String,String> map);
	/**
	 * 导入供应商 财务信息
	 * @param map
	 */
	public void importSupplierFinancialInfo(Map<String,String> map);
	/**
	 * 导入供应商 签约信息
	 * @param map
	 */
	public void importSupplierSignInfo(Map<String,String> map);
	/**
	 * 导入供应商 资质信息
	 * @param map
	 */
	public void importSupplierEnclosureInfo(Map<String,String> map);
	
	/**
	 * 查询供应商id
	 * @param map
	 * @return
	 */
	public List<Map<String, String>> querySupplierNum(Map<String, String> map);
	//查询尽职调查数据
	public List<Map<String, String>> queryDuediligence(Map<String, String> map);
	/**
	 * 所属区域下拉树
	 * @return
	 */
	public List<Map<String, String>> queryAlladdress();
}
