package com.yusys.supplier.supplierinfo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.ImportExcel2;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.supplier.supplierinfo.dao.SSupplierDao;

@Service
@Transactional
public class SSupplierService extends ImportExcel2 implements ISSupplierService {
	@Resource
	private SSupplierDao sSupplierDao;
	@Resource
	private TaskDBUtil taskDBUtil;
	/**
	 * 保存excel表单数据
	 * @param userid
	 * @param rowData
	 * @return 大于0保存成功小于或者等于0保存失败
	 */
	public String saveFormData(String userid, List<List<String>> rowsData,
			int numSheet) {
		if (numSheet == 1) {
			return importExcelSheetOne(userid, rowsData);
		}
		return null;
	}
	/**
	 * 保存行数据
	 * @param userid
	 * @param rowData
	 * @return
	 */
	public String saveRowData(String userid, List<String> rowData, int numSheet) {
		if (numSheet == 2) {
			return importExcelSheetTwo(userid, rowData);
		} else if (numSheet == 3) {
			return importExcelSheetThree(userid, rowData);
		} else if (numSheet == 4) {
			return importExcelSheetFour(userid, rowData);
		} else if (numSheet == 5) {
			return importExcelSheetFive(userid, rowData);
		} else if (numSheet == 6) {
			return importExcelSheetSix(userid, rowData);
		} else {
			return null;
		}
	}
	public List<Map<String,String>> querySupplierNum(String sup_name,String sup_num,String simp_name){
		Map<String, String> pmap=new HashMap<String, String>();
		if(sup_name!=null){
			pmap.put("sup_name", sup_name.trim());
		}
		if(simp_name!=null){
			pmap.put("sup_simp_name", simp_name.trim());
		}
		if(sup_num!=null){
			pmap.put("sup_num", sup_num.trim());
		}
		List<Map<String,String>> listMap=sSupplierDao.querySupplierNum(pmap);
		return listMap;
		
	}
	/**
	 * 导入第六个页签 资质文件息
	 * 
	 * @param userid
	 * @param rowData
	 * @return
	 */
	private String importExcelSheetSix(String userid, List<String> rowData) {
		if (rowData == null) {
			return null;
		} else {
			String[] columns = new String[] { "", "sup_name", "encl_type","encl_name", "issue_authority", "efficient_time","end_time" };
			Map<String, String> pmap = new HashMap<String, String>();
			for (int i = 0; i < columns.length; i++) {
				if (columns[i] == "sup_name") {
					if (rowData.get(i) == null|| rowData.get(i).trim().length() == 0) {
						return null;
					}
					pmap.put(columns[i], rowData.get(i));
				} else {
					// 非必填项
					if (rowData.get(i) == null|| rowData.get(i).trim().length() == 0) {
						pmap.put(columns[i], "");
					} else {
						pmap.put(columns[i], rowData.get(i));
					}
				}
			}
			try {
				List<Map<String, String>> sup_numList = querySupplierNum(pmap.get("sup_name").trim(),null,null);
				for (Map<String, String> sup_num : sup_numList) {
					if (sup_num.get("SUP_NUM") != null&& sup_num.get("SUP_NUM").trim().length() > 0&& sup_num.get("EFFICIENT").equals("00")){
						pmap.put("sup_num", sup_num.get("SUP_NUM"));
					}
				}
				if (pmap.get("sup_num") == null|| pmap.get("sup_num").length() == 0) {
					return "供应商名称不正确";
				}
				pmap.put("updateman", userid);
				pmap.put("updatetime", DateTimeUtils.getFormatCurrentTime());
				pmap.put("createman", userid);
				pmap.put("createtime", DateTimeUtils.getFormatCurrentTime());
				String encl_type = pmap.get("encl_type");
				if (encl_type != null && encl_type.trim().length() > 0) {
					String encl_type1 = taskDBUtil.findDicItemCode("SUP_DIC_ENCL_TYPE", encl_type);
					if (encl_type1 == null || encl_type1.trim().length() == 0) {
						return "资质类别不正确";
					} else {
						pmap.put("encl_type", encl_type1);
					}
				} else {
					pmap.put("encl_type", encl_type);
				}
				pmap.put("encl_num", taskDBUtil.getSequenceValByName("SUP_SEQ_SUP_ENCLOSURE_INFO"));
				sSupplierDao.importSupplierEnclosureInfo(pmap);
				return null;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return "数据格式有误！";
		}
	}
	/**
	 * 导入第五个页签 签约信息
	 * @param userid
	 * @param rowData
	 * @return
	 */
	private String importExcelSheetFive(String userid, List<String> rowData) {
		if (rowData == null) {
			return null;
		} else {
			String[] columns = new String[] { "", "sup_name", "sign_type","cus_name", "product", "sign_date", "sign_money","linkman_name", "link_tel" };
			Map<String, String> pmap = new HashMap<String, String>();
			for (int i = 0; i < columns.length; i++) {
				if (columns[i] == "sup_name") {
					// 必填项
					if (rowData.get(i) == null|| rowData.get(i).trim().length() == 0) {
						return null;
					}
					pmap.put(columns[i], rowData.get(i));
				} else {
					// 非必填项
					if (rowData.get(i) == null|| rowData.get(i).trim().length() == 0) {
						pmap.put(columns[i], "");
					} else {
						pmap.put(columns[i], rowData.get(i));
					}
				}
			}
			try {
				List<Map<String, String>> sup_numList = querySupplierNum(pmap.get("sup_name").trim(),null,null);
				for (Map<String, String> sup_num : sup_numList) {
					if (sup_num.get("SUP_NUM")!= null&&sup_num.get("SUP_NUM").trim().length()>0&& sup_num.get("EFFICIENT").equals("00")){
						pmap.put("sup_num", sup_num.get("SUP_NUM"));
					}
				}
				if (pmap.get("sup_num")==null||pmap.get("sup_num").length()==0){
					return "供应商名称不正确";
				}
				pmap.put("updateman", userid);
				pmap.put("updatetime", DateTimeUtils.getFormatCurrentTime());
				pmap.put("createman", userid);
				pmap.put("createtime", DateTimeUtils.getFormatCurrentTime());
				String sign_type=pmap.get("sign_type");
				if (sign_type !=null && sign_type.trim().length()>0) {
					String sign_type1 = taskDBUtil.findDicItemCode("SUP_DIC_SIGN_TYPE", pmap.get("sign_type"));
					if (sign_type1 == null || sign_type1.trim().length() == 0) {
						return "签约类别不正确";
					} else {
						pmap.put("sign_type", sign_type1);
					}
				} else {
					pmap.put("sign_type", sign_type);
				}
				pmap.put("sign_num",taskDBUtil.getSequenceValByName("S_SEQ_SUP_SIGN_INFO"));
				sSupplierDao.importSupplierSignInfo(pmap);
				return null;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return "数据格式有误！";
		}
	}
	/**
	 * 导入第四个页签 财务信息
	 * @param userid
	 * @param rowData
	 * @return
	 */
	private String importExcelSheetFour(String userid, List<String> rowData) {
		if (rowData == null) {
			return null;
		} else {
			String[] columns = new String[] { "", "sup_name", "year",
					"total_assets", "net_assets", "sales_amount",
					"net_profits", "total_assets_rate",
					"asset_liability_ratio", "net_cash_flows",
					"cash_equivalents", "current_assets_ratio" };
			Map<String, String> pmap = new HashMap<String, String>();
			for (int i = 0; i < columns.length; i++) {
				if (columns[i] == "sup_name") {
					// 必填项
					if (rowData.get(i) == null || rowData.get(i).trim().length()== 0) {
						return null;
					}
					pmap.put(columns[i], rowData.get(i));
				} else {
					// 非必填项
					if (rowData.get(i) == null||rowData.get(i).trim().length()== 0) {
						pmap.put(columns[i], null);
					} else {
						pmap.put(columns[i], rowData.get(i));
					}
				}
			}
			try {
				List<Map<String, String>> sup_numList = querySupplierNum(pmap.get("sup_name").trim(),null,null);
				for (Map<String, String> sup_num : sup_numList) {
					if (sup_num.get("SUP_NUM")!=null&&sup_num.get("SUP_NUM").trim().length()>0&&sup_num.get("EFFICIENT").equals("00")){
						pmap.put("sup_num", sup_num.get("SUP_NUM"));
					}
				}
				if (pmap.get("sup_num")==null||pmap.get("sup_num").length()==0){
					return "供应商名称不正确";
				}
				pmap.put("updateman", userid);
				pmap.put("updatetime", DateTimeUtils.getFormatCurrentTime());
				pmap.put("createman", userid);
				pmap.put("createtime", DateTimeUtils.getFormatCurrentTime());
				pmap.put("financial_num", taskDBUtil.getSequenceValByName("SUP_SEQ_SUP_FINANCIAL_INFO"));
				sSupplierDao.importSupplierFinancialInfo(pmap);
				return null;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return "数据格式有误！";
		}
	}
	/**
	 * 导入第三个页签 股权解构信息
	 * @param userid
	 * @param rowData
	 * @return
	 */
	private String importExcelSheetThree(String userid, List<String> rowData) {
		if (rowData == null) {
			return null;
		} else {
			String[] columns = new String[] { "", "sup_name","shareholder_name", "amount", "shareholding_ratio" };
			Map<String, String> pmap = new HashMap<String, String>();
			for (int i = 1; i < columns.length; i++) {
				if (columns[i] == "sup_name") {
					// 必填项
					if (rowData.get(i) == null|| rowData.get(i).trim().length() == 0) {
						return null;
					}
					pmap.put(columns[i], rowData.get(i));
				} else {
					// 非必填项
					if (rowData.get(i) == null|| rowData.get(i).trim().length() == 0) {
						pmap.put(columns[i], null);
					} else {
						pmap.put(columns[i], rowData.get(i));
					}
				}
			}
			try {
				List<Map<String, String>> sup_numList = querySupplierNum(pmap.get("sup_name").trim(),null,null);
				for (Map<String, String> sup_num : sup_numList) {
					if (sup_num.get("SUP_NUM") != null&& sup_num.get("SUP_NUM").trim().length() > 0&& sup_num.get("EFFICIENT").equals("00")) {
						pmap.put("sup_num", sup_num.get("SUP_NUM"));
					}
				}
				if (pmap.get("sup_num") == null|| pmap.get("sup_num").length() == 0) {
					return "供应商名称不正确";
				}
				// 如果没有导入供应商联系人信息则不验证常用联系人
				if (sSupplierDao.liasionsCount(pmap) > 0) {
					int count = sSupplierDao.isLiasionsCount(pmap);
					if (count == 0) {
						return "供应商缺少常用联系人";
					}
				}
				pmap.put("updateman", userid);
				pmap.put("updatetime", DateTimeUtils.getFormatCurrentTime());
				pmap.put("createman", userid);
				pmap.put("createtime", DateTimeUtils.getFormatCurrentTime());
				pmap.put("shareholder_num", taskDBUtil.getSequenceValByName("S_SEQ_SUP_OWNERSHIP_STRUCTURE"));
				sSupplierDao.importSupplierOwnershipStructure(pmap);
				return null;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return "数据格式有误！";
		}
	}
	/**
	 * 导入第二个页签 联络人信息
	 * @param userid
	 * @param rowData
	 * @return
	 */
	private String importExcelSheetTwo(String userid, List<String> rowData) {
		if (rowData == null) {
			return null;
		} else {
			String columns[] = new String[] { "", "sup_name", "linkman_type","name", "post", "tel", "email", "is_liasions" };
			Map<String, String> pmap = new HashMap<String, String>();
			for (int i = 0; i < columns.length; i++) {
				if (columns[i] == "sup_name") {
					// 必填项
					if (rowData.get(i) == null|| rowData.get(i).trim().length() == 0) {
						return null;
					}
					pmap.put(columns[i], rowData.get(i));
				} else {
					// 非必填项
					if (rowData.get(i) == null|| rowData.get(i).trim().length() == 0) {
						pmap.put(columns[i], "");
					} else {
						pmap.put(columns[i], rowData.get(i));
					}
				}
			}
			try {
				List<Map<String, String>> sup_numList = querySupplierNum(pmap.get("sup_name").trim(),null,null);
				for (Map<String, String> sup_num : sup_numList) {
					if (sup_num.get("SUP_NUM") != null&& sup_num.get("SUP_NUM").trim().length() > 0&& sup_num.get("EFFICIENT").equals("00")) {
						pmap.put("sup_num", sup_num.get("SUP_NUM"));
					}
				}
				if(pmap.get("sup_num") == null|| pmap.get("sup_num").length() == 0) {
					return "供应商名称不正确";
				}
				pmap.put("opt_person", userid);
				pmap.put("opt_time", DateTimeUtils.getFormatCurrentTime());
				String linkman_type = pmap.get("linkman_type");
				if (linkman_type != null && linkman_type.trim().length() > 0) {
					String linkman_type1 = taskDBUtil.findDicItemCode("SUP_DIC_LINKMAN_TYPE", linkman_type);
					if (linkman_type1 == null|| linkman_type1.trim().length() == 0) {
						return "联络人类型不正确";
					} else {
						pmap.put("linkman_type", linkman_type1);
					}
				} else {
					pmap.put("linkman_type", linkman_type);
				}
				String is_liasions = pmap.get("is_liasions");
				if (is_liasions != null && is_liasions.trim().length() > 0) {
					String is_liasions1 = taskDBUtil.findDicItemCode("SUP_DIC_ISLIASIONS", is_liasions);
					if (is_liasions1 == null|| is_liasions1.trim().length() == 0) {
						return "常用联系人填写不正确";
					} else {
						pmap.put("is_liasions", is_liasions1);
					}
				} else {
					pmap.put("is_liasions", is_liasions);
				}
				pmap.put("linkman_num", taskDBUtil.getSequenceValByName("SUP_SEQ_SUP_LINKMAN_INFO"));
				int count = sSupplierDao.isLiasionsCount(pmap);
				if (pmap.get("is_liasions").equals("00")) {
					if (count > 0) {
						return "供应商常用联系人有且只有一个";
					} else {
						sSupplierDao.importSupplierLinkMan(pmap);
					}
				} else {
					sSupplierDao.importSupplierLinkMan(pmap);
				}
				return null;
			} catch (Exception e) {
				e.printStackTrace();
			}
			return "数据格式有误！";
		}
	}
	/**
	 * 导入的第一个sheet[供应商基本信息]
	 * @param userid
	 * @param rowsData
	 * @return
	 */
	private String importExcelSheetOne(String userid,List<List<String>> rowsData) {
		Map<String, String> map = new HashMap<String, String>();
		String sup_name = rowsData.get(0).get(2);// 供应商名称
		if (sup_name == null || sup_name.trim().length() == 0) {
			return "供应商名称为空";
		}
		List<Map<String,String>> listMap=querySupplierNum(sup_name,null,null);
		if(listMap!=null&&listMap.size()>0){
			return "供应商名称重复";
		}
		map.put("sup_name", sup_name);
		try {
			// 应行方要求，暂时去掉供应商导入除供应商名称外所有的必填项验证
			String sup_simp_name = rowsData.get(0).get(6);// 供应商简称
			if (sup_simp_name == null || sup_simp_name.trim().length() == 0) {
				 return "供应商简称为空";
			}
			listMap=querySupplierNum(null,null,sup_simp_name);
			if(listMap!=null&&listMap.size()>0){
				return "供应商简称重复";
			}
			map.put("sup_simp_name", sup_simp_name);
			String establish_time = rowsData.get(0).get(8);// 成立时间
			if (establish_time == null || establish_time.trim().length() == 0) {
//				 return "成立时间为空";
				establish_time="";
			}
			map.put("establish_time", establish_time);
			String registered_addr = rowsData.get(1).get(2);// 注册地址
			if (registered_addr == null || registered_addr.trim().length() == 0) {
//				 return "注册地址为空";
				registered_addr="";
			}
			map.put("registered_addr", registered_addr);
			// 非必填
			String business_registraion_num = rowsData.get(1).get(6);// 工商登记号
			if (business_registraion_num == null|| business_registraion_num.trim().length() == 0) {
//				 return "工商登记号为空";
				business_registraion_num="";
			}
			map.put("business_registraion_num", business_registraion_num);
			map.put("tax_registration_num", business_registraion_num);
			String sup_level = rowsData.get(1).get(8);// 供应商级别
			String sup_level1 = "";
			if (sup_level != null && sup_level.trim().length() > 0) {
				sup_level1 = taskDBUtil.findDicItemCode("S_DIC_SUP_LEVEL",
						sup_level);
				if (sup_level1 == null || sup_level1.trim().length() == 0) {
//					return "供应商级别填写有误";
					sup_level1="";
				}
			}
			map.put("sup_level", sup_level1);
			String is_listed = rowsData.get(2).get(6);// 是否上市
			if (is_listed == null || is_listed.trim().length() == 0) {
//				 return "是否上市有误";
				is_listed="";
			}
			map.put("is_listed", is_listed.equals("是") ? "01" : "02");
			String listed_addr = rowsData.get(2).get(8);// 上市地点
			map.put("listed_addr", listed_addr == null ? "" : listed_addr);
			String company_address = rowsData.get(3).get(2);// 通讯地址
			if (company_address == null || company_address.trim().length() == 0) {
//				 return "通讯地址为空";
				company_address="";
			}
			map.put("company_address", company_address);
			// 非必填
			String stock_code = rowsData.get(3).get(6);// 股票代码
			map.put("stock_code", stock_code == null ? "" : stock_code);
			String address = rowsData.get(3).get(8);// 所属省份
			map.put("address", address == null ? "" : address);
			String sup_num = rowsData.get(4).get(6);// 组织机构代码
			if (sup_num == null|| sup_num.trim().length() == 0) {
//				 return "组织机构代码为空";
				sup_num="9"+DateTimeUtils.getRandom19();
			}
			List<Map<String,String>> sup_map=querySupplierNum(null,sup_num,null);
			if(sup_map!=null&&sup_map.size()>0){
				return "组织机构代码重复";
			}
			map.put("sup_num", sup_num);
			String register_money = rowsData.get(5).get(2);// 注册资金
			if (register_money == null || register_money.trim().length() == 0) {
//				 return "注册资金为空";
				register_money="";
			}
			map.put("register_money", register_money == "" ? null: register_money);
			String tax_registration_addr = rowsData.get(5).get(5);// 税务登记证登记地址
			if (tax_registration_addr == null|| tax_registration_addr.trim().length() == 0) {
//				 return "税务登记证登记地址为空";
				tax_registration_addr="";
			}
			map.put("tax_registration_addr", tax_registration_addr);
			String business_scope = rowsData.get(6).get(2);// 主营范围
			if (business_scope == null || business_scope.trim().length() == 0) {
				// return "主营范围为空";
			}
			map.put("business_scope", business_scope);
			// 非必填
			String sup_url = rowsData.get(6).get(4);// 公司主页
			map.put("sup_url", sup_url == null ? "" : sup_url);
			String ordinary_vat_payr = rowsData.get(6).get(6);
			String ordinary_vat_payr1 = "";
			if (ordinary_vat_payr != null&& ordinary_vat_payr.trim().length() > 0) {
				ordinary_vat_payr1 = taskDBUtil.findDicItemCode("SUP_DIC_ORDINARY_VAT_PAYR", ordinary_vat_payr);// 增值税一般纳税人/小规模纳税人
				if (ordinary_vat_payr1 == null|| ordinary_vat_payr1.trim().length() == 0) {
//					return "增值税一般纳税人/小规模纳税人有误";
					ordinary_vat_payr1="";
				}
			}
			map.put("ordinary_vat_payr", ordinary_vat_payr1);
			String nature_business = rowsData.get(7).get(2);// "企业性质（工商登记）*
			String nature_business1="";
			if (nature_business == null || nature_business.trim().length() == 0) {
//				 return "企业性质为空";
				nature_business="";
			}else{
				nature_business1 = taskDBUtil.findDicItemCode("SUP_DIC_NATURE_BUSINESS", nature_business);// 企业性质
			}
			map.put("nature_business", nature_business1);
			String representative = rowsData.get(7).get(4);// 法定代表人
			if (representative == null || representative.trim().length() == 0) {
//				 return "法定代表人为空";
				representative="";
			}
			map.put("representative", representative);
			String core_business = rowsData.get(6).get(8);// 公司核心业务
			if (core_business == null || core_business.trim().length() == 0) {
				 //return "公司核心业务为空";
			}
			map.put("core_business", core_business);
			String is_payer = rowsData.get(7).get(6);// 是否营业税纳税人
			if (is_payer == null || is_payer.trim().length() == 0) {
				// return "是否营业税纳税人有误";
			}
			map.put("is_payer", is_payer.equals("是") ? "01" : "02");
			String market_share = rowsData.get(7).get(8);// 公司核心业务的行业地位/市场份额
			if (market_share == null || market_share.trim().length() == 0) {
				// return "公司核心业务的行业地位/市场份额有误";
			}
			map.put("market_share", market_share);

			String tel = rowsData.get(8).get(2);// 客服电话
			if (tel == null || tel.trim().length() == 0) {
//				 return "客服电话为空";
				tel="";
			}
			map.put("tel", tel);
			String industry = rowsData.get(8).get(4);// 所属行业
			if (industry == null || industry.trim().length() == 0) {
//				 return "所属行业为空";
				industry="";
			}
			map.put("industry", industry);

			String sub_org_num = rowsData.get(8).get(6);// 不同城市分支机构数量
			if (sub_org_num == null || sub_org_num.trim().length() == 0) {
				// return "不同城市分支机构数量为空";
			}
			map.put("sub_org_num", sub_org_num == "" ? null : sub_org_num);
			String group_company = rowsData.get(8).get(8);// 本企业是否为集团总公司或集团公司内企业
			if (group_company == null || group_company.trim().length() == 0) {
//				 return "本企业是否为集团总公司或集团公司内企业为空";
				group_company="";
			}
			map.put("group_company", group_company.equals("是") ? "00" : "01");
			String emp_num = rowsData.get(9).get(2);// 在本企业领取薪酬员工总数
			if (emp_num == null || emp_num.trim().length() == 0) {
//				 return "在本企业领取薪酬员工总数为空";
				emp_num="";
			}
			map.put("emp_num", emp_num == "" ? null : emp_num);
			String three_emp_num = rowsData.get(9).get(4);// 签约3年以上专业及技术员工人数
			if (three_emp_num == null || three_emp_num.trim().length() == 0) {
//				 return "签约3年以上专业及技术员工人数为空";
				three_emp_num="";
			}
			map.put("three_emp_num", three_emp_num == "" ? null : three_emp_num);
			map.put("input_id", userid);
			map.put("input_date", DateTimeUtils.getFormatCurrentDate());
			map.put("efficient", "00");
			map.put("sup_status", "04");
			List<Map<String, String>> duediligence=sSupplierDao.queryDuediligence(map);//查询供应商准入审批是否通过 
//			if(duediligence!=null&&duediligence.size()>0){
//				for (Map<String, String> map2 : duediligence) {
//					if(map2.get("SUP_CODE")!=null&&map2.get("SUP_CODE").trim().length()>0
//							&&map2.get("SPSTATE")!=null&&map2.get("SPSTATE").equals("1")&&map2.get("IS_ACCESS")!=null
//							&&map2.get("IS_ACCESS").equals("00")){
						List<Map<String, String>> sup_numList = querySupplierNum(map.get("sup_name").trim(),null,null);//查询供应商信息是否已存在
						if(sup_numList!=null&&sup_numList.size()>0){
							for (Map<String, String> sup_numMap : sup_numList) {
								if (sup_numMap.get("SUP_NUM") != null&& sup_numMap.get("SUP_NUM").trim().length()> 0){
									map.put("sup_num", sup_numMap.get("SUP_NUM"));
									sSupplierDao.updateImportSupInfoByNum(map);
									// 删掉供应商除基本信息外的其他信息
									sSupplierDao.deleteLinkmanInfoByNum(map);
									sSupplierDao.deleteEnclInfoByNum(map);
									sSupplierDao.deleteFinancialInfo(map);
									sSupplierDao.deleteShareholder(map);
									sSupplierDao.deleteSignInfoByNum(map);
									return null;
								}else{
//									map.put("sup_num",map2.get("SUP_CODE")); 这一行先注释掉
									map.put("sup_num",map.get("sup_num"));
									//map.put("sup_num", business_registraion_num);
									sSupplierDao.importSupplier(map);
									return null;
								}
							}
						}else{
//							map.put("sup_num",map2.get("SUP_CODE"));
							map.put("sup_num",map.get("sup_num"));
							//map.put("sup_num", business_registraion_num);
							sSupplierDao.importSupplier(map);
							return null;
						}
//					}else{
//						return"供应商尽职调查信息不存在或未准入!";
//					}
//				}
//			}else{
//				return"供应商尽职调查信息不存在或未准入!";
//			}
			return null;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "数据格式有误！";
	}
	/**
	 * 导入供应商添加的数据 head_num:每个sheet页数据开始的下标组成的数组 column_num：每个sheet页数据的有效列个数的数组
	 */
	public Map<String, String> importSupplierInfo(String userid,MultipartFile file, int[] head_num, int[] column_num) {
		return importExcel(file, userid, head_num, column_num, 6);
	}
	

	/**
	 * 所属区域下拉树
	 */
	@Override
	public List<Map<String,String>> queryAlladdress(HttpServletRequest req,String userId) {
		try {
			List<Map<String,String>> retmap =sSupplierDao.queryAlladdress();
			return retmap;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	@Override
	public String cnToPinYin(String str) {
		StringBuilder py=new StringBuilder();
		HanyuPinyinOutputFormat defaultFormat = new HanyuPinyinOutputFormat();
		defaultFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);// 输出拼音全部小写
		defaultFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);// 不带声调
		defaultFormat.setVCharType(HanyuPinyinVCharType.WITH_V);
		char[] cl_chars = str.trim().toCharArray();
		try {
			for (int i = 0; i < cl_chars.length; i++) {
				if (String.valueOf(cl_chars[i]).matches("[\u4e00-\u9fa5]+")) {// 如果字符是中文,则将中文转为汉语拼音
					py.append(PinyinHelper.toHanyuPinyinStringArray(
							cl_chars[i], defaultFormat)[0]);
				} else {// 如果字符不是中文,则不转换
					py.append(cl_chars[i]);
				}
			}
			return py.toString();
		} catch (BadHanyuPinyinOutputFormatCombination e) {
			e.printStackTrace();
		}
		return "";
	}
}