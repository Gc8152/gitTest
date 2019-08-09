package com.yusys.serviceorder.personnelPrice.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yusys.Utils.DateTimeUtils;
import com.yusys.Utils.ImportExcel2;
import com.yusys.Utils.TaskDBUtil;
import com.yusys.serviceorder.personnelPrice.dao.PersonnelPriceDao;
import com.yusys.serviceorder.personnelPrice.entity.PersonnelPriceInfo;
import com.yusys.serviceorder.personnelPrice.entity.PersonnelTypeInfo;
import com.yusys.supplier.supplierinfo.dao.SSupplierDao;

/**
 * 人员单价信息维护实现接口
 * @author houhf
 * Time 2016-09-19
 */
@Service
@Transactional
public class PersonnelPriceService extends ImportExcel2 implements IPersonnelPriceService{
	private static final Logger logger=Logger.getLogger(PersonnelPriceService.class);
	//人员单价信息维护DAO
	@Resource
	private PersonnelPriceDao dao;
	//查询供应商信息
	@Resource
	private SSupplierDao sSupplierDao;
	//工具类 用于获取sequence的值
	@Resource
	private TaskDBUtil taskDBUtil;
	//导入
	@Override
	public Map<String, String> importOutPersonPrice(String userId,MultipartFile file, int[] head_num, int[] column_num) {
		return importExcel(file, userId, head_num, column_num,7);
	}
	@Override//导入公共方法
	public String saveRowData(String userid,List<String> rowData,int numSheet){
		if (numSheet==0) {
			return importExcelSheetOne(userid,rowData);//类别信息
		}else{
			return null;
		}
	}
	// Excel的第一个页签导入  类别信息信息  
	private String importExcelSheetOne(String userid,List<String> rowData){
		if(rowData==null){
			return null;
		}else{
			String[]importOutPerson=new String[]{"","supplier_name","contract","p_starttime","p_endtime","p_post","p_level","p_price_tax","p_memo"};
			String [] importOutPerson_name=new String[]{"","供应商名称","框架合同号","开始时间","结束时间","开发方向","人员级别","单价（含税：元）","备注"};
			Map<String, String> pmap=new HashMap<String, String>();
			try {
				for (int i = 1; i < importOutPerson.length; i++) {
					if(importOutPerson[i]=="p_endtime"||importOutPerson[i]=="p_memo"){
						//非必填项
						if(rowData.get(i)==null||rowData.get(i).trim().length()==0){
							pmap.put(importOutPerson[i], "");
						}else{
							pmap.put(importOutPerson[i], rowData.get(i));
						}
					}else{
						if (rowData.get(i)==null||rowData.get(i).trim().length()==0) {
							return importOutPerson_name[i]+"不能为空";
						}
						pmap.put(importOutPerson[i], rowData.get(i));
					}
				}
				Map<String,String> sup = new HashMap<String,String>();
				sup.put("sup_name", pmap.get("supplier_name").trim());
				List<Map<String,String>> sup_numList=sSupplierDao.querySupplierNum(sup);
				for(Map<String,String> sup_num : sup_numList){
					if (sup_num.get("SUP_NUM")!=null && sup_num.get("SUP_NUM").trim().length()>0&& sup_num.get("EFFICIENT").equals("00")){
						pmap.put("sup_num", sup_num.get("SUP_NUM"));
					}
				}
				if(pmap.get("sup_num")==null || pmap.get("sup_num").length()==0){
					return "供应商名称不正确！";
				}
				
				String contract=pmap.get("contract");//人员状态
				if (contract!=null&&!"".equals(contract.trim())) {
					pmap.put("contract",contract);
					List<Map<String,Object>> frameList=dao.queryFrameContInfo(pmap);
					if(frameList.size()<=0){
						return "框架合同号不正确！";
					}
				}else{
					pmap.put("contract","");
					return "框架合同号不正确！";
				}
				String p_starttime=pmap.get("p_starttime");//人员状态
				if (p_starttime!=null&&!"".equals(p_starttime.trim())) {
					pmap.put("p_starttime",p_starttime);
				}else{
					return "开始时间不正确！";
				}
				String p_endtime=pmap.get("p_endtime");//人员状态
				if (p_endtime!=null&&!"".equals(p_endtime.trim())) {
					pmap.put("p_endtime",p_endtime);
				}else{
					pmap.put("p_endtime","");
				}
				String p_price_tax=pmap.get("p_price_tax");//人员状态
				if (p_price_tax!=null&&!"".equals(p_price_tax.trim())) {
					pmap.put("p_price_tax",p_price_tax);
				}else{
					pmap.put("p_price_tax","");
					return "单价（含税：元）不正确！";
				}
				String p_post=pmap.get("p_post");
				if (p_post!=null&&!"".equals(p_post.trim())) {
					p_post=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_DEV_DIRECT",p_post);
					if (p_post==null||"".equals(p_post.trim())) {
						return "开发方向错误！";
					}
					pmap.put("p_post",p_post);
				}else{
					pmap.put("p_post","");
				}
				String p_level=pmap.get("p_level").substring(0,1);
				if (p_level!=null&&!"".equals(p_level.trim())) {
					p_level=taskDBUtil.findDicItemCode("C_DIC_OUTPERSION_LEVEL",p_level);
					if (p_level==null||"".equals(p_level.trim())) {
						return "人员级别错误！";
					}
					pmap.put("p_level",p_level);
				}else{
					pmap.put("p_level","");
				}
				PersonnelTypeInfo pti=new PersonnelTypeInfo();
				PersonnelPriceInfo p=new PersonnelPriceInfo();
				pti.setSupplier_id(pmap.get("sup_num"));
				pti.setContract(pmap.get("contract"));
				pti.setP_starttime(pmap.get("p_starttime"));
				pti.setP_endtime(pmap.get("p_endtime"));
				pti.setOpt_time(DateTimeUtils.getFormatCurrentTime());
				pti.setOpt_person(userid);
				List<Map<String,String>> isExist=dao.findOutPersonPriceByIdcard(pmap);
				if(isExist==null||isExist.size()<=0){
					String pk_id=taskDBUtil.getSequenceValByName("C_SEQ_PP_ID");
					pti.setP_id(Integer.parseInt(pk_id));
					dao.addPersonType(pti);//保存外包人员基本信息
					p.setP_id(Integer.parseInt(pk_id));
					p.setOpt_person(userid);
					p.setOpt_time(DateTimeUtils.getFormatCurrentTime());
					p.setP_memo(pmap.get("p_memo"));
					p.setP_post(pmap.get("p_post"));
					p.setP_level(pmap.get("p_level"));
					p.setP_price_tax(pmap.get("p_price_tax"));
					p.setP_price("");
					dao.addPersonPrice(p);//保存外包人员基本信息
				}else{//外包人员存在时
					Object ob=isExist.get(0).get("P_ID");
					pti.setP_id(Integer.parseInt(String.valueOf(ob)));
					dao.updatePersonPrice(pti);//更新外包人员数据
					pmap.put("p_id", String.valueOf(ob));
//					dao.delPPDetail(pmap);//先将人员单价信息全部删除
					p.setP_id(Integer.parseInt(String.valueOf(ob)));
					p.setOpt_person(userid);
					p.setOpt_time(DateTimeUtils.getFormatCurrentTime());
					p.setP_memo(pmap.get("p_memo"));
					p.setP_post(pmap.get("p_post"));
					p.setP_level(pmap.get("p_level"));
					p.setP_price_tax(pmap.get("p_price_tax"));
					p.setP_price("");
					List<Map<String,Object>> levelList=dao.findPPDetailByLevel(pmap);
					if(levelList!=null&&levelList.size()>0){
						dao.updateOnePersonPrice(p);//人员档次已存在，修改人员档次
					}else{
						dao.addPersonPrice(p);//保存外包人员基本信息
					}
				}
				//x修改结束
				return null;
			} catch (Exception e) {
				logger.info(e.getMessage());
			}
			return "数据格式有误!";
		}
	}
}