var calls = getMillisecond();
(function(){//合同页面初始化
	initSelect(getCurrentPageObj().find("#contract_sort"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CONTRACT_SORT"});//合同类型
	initVlidate(getCurrentPageObj());//初始化页面验证
	//初始化供应商pop
	var obj = getCurrentPageObj().find("#supplier_name");
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("contractSupplier_Pop",{singleSelect:true,parent_company:getCurrentPageObj().find("#supplier_name"),
			parent_sup_num:getCurrentPageObj().find("input[name='UC.supplier_ids']")});
	});
	//需求一级部门
	obj=getCurrentPageObj().find("#demand_deptname_one");
	obj.unbind("click");
	obj.click(function(){
		//openSelectTreeDivToBody($(this),"op_office_pop_fd_tree",dev_outsource+"SOrg/queryorgtreelist.asp?SID="+SID+"&call="+calls,30,function(node){
		openSelectTreeDivToBody($(this),"op_office_pop_fd_tree","SOrg/queryOrgTreeWithCenterList.asp",30,function(node){
			getCurrentPageObj().find("#demand_deptname_one").val(node.name);
			getCurrentPageObj().find("input[name='UC.demand_deptno_one']").val(node.id);
		});
	});
	//初始化责任一级部门
	obj=getCurrentPageObj().find("#responsibility_deptname_one");
	obj.unbind("click");
	obj.click(function(){										  
		//openSelectTreeDivToBody($(this),"contractTreedept_id",dev_outsource+"SOrg/queryorgtreedeptlist.asp?SID="+SID+"&call="+calls,30,function(node){
		openSelectTreeDivToBody($(this),"contractTreedept_id","SOrg/queryOrgTreeWithCenterList.asp",30,function(node){
			getCurrentPageObj().find("#responsibility_deptname_one").val(node.name);
			getCurrentPageObj().find("#responsibility_deptno_one").val(node.id);
		});
	});
	obj=getCurrentPageObj().find("#supplier_name").unbind("click");
	obj.click(function(){
		openSupplierPop("contractSupplier_Pop",
				{singleSelect:true,parent_company:getCurrentPageObj().find("#supplier_name"),parent_sup_num:getCurrentPageObj().find("input[name='AC.supplier_ids']")});
	});
})();
//级联加载责任二级部门
function clickuptTwoDept(){
	var responsibility_deptno_one=getCurrentPageObj().find("#responsibility_deptno_one").val();
	if(responsibility_deptno_one!=undefined&&responsibility_deptno_one!=null&&responsibility_deptno_one!=""){
		var obj=getCurrentPageObj().find("#responsibility_deptname_two");
		obj.unbind("click");
		obj.click(function(){
			//openSelectTreeDivToBody($(this),"contractTreeoffices_id",dev_outsource+"SOrg/queryorgtreeofficeslist.asp?suporg_code="+responsibility_deptno_one.toUpperCase()+"&SID="+SID+"&call="+calls,30,function(node){
			openSelectTreeDivToBody($(this),"contractTreeoffices_id","SOrg/queryOrgTreeWithCenterList.asp?suporg_code="+responsibility_deptno_one.toUpperCase(),30,function(node){
				getCurrentPageObj().find("#responsibility_deptname_two").val(node.name);
				getCurrentPageObj().find("#responsibility_deptno_two").val(node.id);
			});
		});
	}else{
		alert("请先选择责任一级部门");
	}
}

//二次点击责任一级部门时，将责任二级部门的值清空
function clickUpDeptOne(responsibility_deptno_one){
	if(responsibility_deptno_one!=undefined&&responsibility_deptno_one!=null&&responsibility_deptno_one!=""){
		getCurrentPageObj().find("#responsibility_deptno_two").val("");		
		getCurrentPageObj().find("#responsibility_deptname_two").val("");
	}
}
var updatePhaseRowNum = 1;//付款阶段编号
var updateConRowNum = 1;
//采购信息初始化
var updatepurchaseNum=1;
var updateupPurchaseNum=1;
//页面赋值
var conType="";
var contractPur;
function initContractInfo_update(ids){
	baseAjaxJsonp(dev_outsource+"contractInfo/queryOneContractInfo.asp?contract_code="+ids+"&SID="+SID+"&call="+calls,null,function(data){//通过baseAjax访问后台查询合同的所有基本信息
		if(data){
			//合同信息展现
			var contractInfoData = data["contractInfo"];
			for(var p in contractInfoData){
				if("CONTRACT_SORT"== p){
					initSelect(getCurrentPageObj().find("select[name='UC."+p.toLowerCase()+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},
							{dic_code:"C_DIC_CONTRACT_SORT"},contractInfoData[p]);
					var contract_sort = contractInfoData[p];
					if("C_DIC_CONTRACT_SORT_FRAME" == contract_sort){
						getCurrentPageObj().find("#updateCon_phase_add_title").css({"display":"none"});
						getCurrentPageObj().find("#updateCon_phase_add_table").css({"display":"none"});
					}
				}else if("CONTRACT_TYPE"== p){
					initSelect(getCurrentPageObj().find("select[name='UC."+p.toLowerCase()+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},
							{dic_code:contractInfoData["CONTRACT_SORT"]},contractInfoData[p]);
					conType=contractInfoData[p];
					if(contractInfoData[p]=="01"||contractInfoData[p]=="02"){
						$("#purchase_Up").show();
					}
				}else if("FILE_ID" == p){
					if(contractInfoData["FILE_ID"]&&$.trim(contractInfoData["FILE_ID"])!=""){
						getCurrentPageObj().find("#normalUpdateContractFile").val(contractInfoData["FILE_ID"]);
						findFileInfo(contractInfoData["FILE_ID"],function(data){
							if(data.rows.length>0){
								defaultShowFileInfo(contractInfoData["FILE_ID"],getCurrentPageObj().find("#updateContractFileButton").parent(),data,true,"updateContractFileDiv");
							}
						});
	   				}
				}else{
					getCurrentPageObj().find("#"+p.toLowerCase()).val(contractInfoData[p]);
				}
			}
			var contractPhaseDatas = data["contractPhases"];
			//付款阶段信息展现----------------------------------------------start------------------------
			if(contractPhaseDatas!=""){
				for(var i=0;i<contractPhaseDatas.length;i++){
					 var trStr="<tr id=\"contractPhase_update_"+updatePhaseRowNum+"\" >"+
									 //付款阶段编号
									 "<td style='display:none'>"+
									 "<input type=\"text\" name=\"UCP.phase_code_"+updatePhaseRowNum+"\" id=\"phase_code_"+updatePhaseRowNum+"\"/>"+
									 "</td>"+
						 			//付款阶段名称
							 		"<td >" +
							 			"<select id=\"phase_name_"+updatePhaseRowNum+"\" name=\"UCP.phase_name_"+updatePhaseRowNum+"\"   validate=\"v.required\" valititle=\"付款阶段名称为必填项\"></select>" +
							 		"</td>"+
							 		//付款条件
							 		"<td >"+
							 			"<select  name=\"UCP.payment_condition_"+updatePhaseRowNum+"\" id=\"payment_condition_"+updatePhaseRowNum+"\" validate=\"v.required\" valititle=\"付款条件为必填项\"></select>"+
							 		"</td>"+
							 		//付款类型
							 		"<td >"+
							 			"<select id=\"payment_type_"+updatePhaseRowNum+"\" name=\"UCP.payment_type_"+updatePhaseRowNum+"\"  /></select>"+
							 		"</td>"+
							 		//占比（%）
							 		"<td>"+
							 			"<input class=\"table-rate-input\" type=\"text\" name=\"UCP.payment_scale_"+updatePhaseRowNum+"\" id=\"payment_scale_"+updatePhaseRowNum+"\" onchange=\"update_checkAndCalculatePyayment(this,'"+updatePhaseRowNum+"');\"  validate=\"v.required\"  />"+
									"</td>"+
									//付款金额（元）
									"<td >"+
										"<input type=\"text\" name=\"UCP.payment_money_"+updatePhaseRowNum+"\" id=\"payment_money_"+updatePhaseRowNum+"\" readonly=\"readonly\" />"+
									"</td>"+
									//删除按钮
									"<td >" +
									"<a onclick=\"delUpdatePhase('"+updatePhaseRowNum+"');\" name=\"update_Phase_del_"+updatePhaseRowNum+"\" id=\"update_Phase_del_"+updatePhaseRowNum+"\" >删除</a>" +
									"</td>"+
						 		"</tr>";
					//添加付款阶段信息行
					 getCurrentPageObj().find("#contractPhase_update_table").append(trStr);
					 for(var phaseKey in contractPhaseDatas[i]){
						 var phaseKeyLow = phaseKey.toLowerCase();
						 //处理付款类型的下拉
						 if("payment_type" == phaseKeyLow.toString()){
							 initSelect(getCurrentPageObj().find("select[name='UCP."+phaseKeyLow+"_"+updatePhaseRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CONTRACT_PHASE_PAY_TYPE"},contractPhaseDatas[i][phaseKey]);
						 }else if("phase_name" == phaseKeyLow.toString()){
							 //付款阶段字典项
							 initSelect(getCurrentPageObj().find("select[name='UCP.phase_name_"+updatePhaseRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CONTRACT_PAY_PHASES"},contractPhaseDatas[i][phaseKey]);
						 }else if("payment_condition" == phaseKeyLow.toString()){
							 //付款条件字典项
							 initSelect(getCurrentPageObj().find("select[name='UCP.payment_condition_"+updatePhaseRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CON_PAYMENT_CONDITION"},contractPhaseDatas[i][phaseKey]);
						 }else{
							 getCurrentPageObj().find("[name='UCP."+phaseKeyLow+"_"+updatePhaseRowNum+"']").val(contractPhaseDatas[i][phaseKey]);
						 }
					 }
					//序号自增
					 updatePhaseRowNum ++;
					 initVlidate(getCurrentPageObj().find("#contractPhase_update_table"));
				}
			}
			//付款阶段信息展现----------------------------------------------end------------------------
			//采购信息
			var contractPurchaseD=data["contractPurchase"];
			contractPur=data["contractPurchase"];
			if(contractPurchaseD!=null&&contractPurchaseD!=""){
				for (var i = 0; i < contractPurchaseD.length; i++) {
					 var trStr="<tr id=\"contractPurchaseUp_"+updatepurchaseNum+"\" >"+
						 "<td style='display:none'>"+
						 	"<input type=\"text\" name=\"CPU.id_"+updatepurchaseNum+"\" id=\"id_"+updatepurchaseNum+"\"/>"+
						 "</td>"+
					//产品名称
				 		"<td >" +
				 			"<input type=\"text\" validate=\"v.required\" name=\"CPU.product_name_"+updatepurchaseNum+"\" id=\"product_name_"+updatepurchaseNum+"\"/>" +
				 		"</td>"+
				 		//产品型号
				 		"<td >"+
				 			"<input type=\"text\" validate=\"v.required\" name=\"CPU.product_model_"+updatepurchaseNum+"\" id=\"product_model_"+updatepurchaseNum+"\"/>"+
				 		"</td>"+
				 		//材质
				 		"<td >"+
				 			"<input type=\"text\" validate=\"v.required\" name=\"CPU.material_"+updatepurchaseNum+"\" id=\"material_"+updatepurchaseNum+"\"/>"+
				 		"</td>"+
				 		//数量
				 		"<td>"+
				 			"<input type=\"text\" validate=\"v.isint\"  name=\"CPU.purchase_num_"+updatepurchaseNum+"\" id=\"purchase_num_"+updatepurchaseNum+"\"/>"+
						"</td>"+
						//备注
						"<td >"+
							"<input type=\"text\" name=\"CPU.memo_"+updatepurchaseNum+"\" id=\"memo_"+updatepurchaseNum+"\"/>"+
						"</td>"+
						//删除按钮
						"<td >" +
						"<a onclick=\"delContractPurchaseUp('"+updatepurchaseNum+"');\" name=\"contractPurchaseUp_del_"+updatepurchaseNum+"\" id=\"contractPurchaseUp_del_"+updatepurchaseNum+"\" >删除</button></a>" +
						"</td>"+
			 		"</tr>";
					 //添加
					 getCurrentPageObj().find("#contractPurchase_table_Up").append(trStr);
					 for(var phaseKey in contractPurchaseD[i]){
						 var phaseKeyLow = phaseKey.toLowerCase();
						 //处理付款类型的下拉
						getCurrentPageObj().find("[name='CPU."+phaseKeyLow+"_"+updatepurchaseNum+"']").val(contractPurchaseD[i][phaseKey]);
					 }
					//序号自增
					 updatepurchaseNum ++;
					 initVlidate(getCurrentPageObj().find("#contractPurchase_table_Up"));
				}
			}
		}
	},calls);
}	


function updateContractInfoMsg(status){	
	 //校验必填项
	if(vlidate(getCurrentPageObj(),"",false)&&contractTimeCompare()){//比较时间
		 var contract_code = getCurrentPageObj().find("#contract_code").val();
		 if(contract_code.length>20){
			 alert("合同编号控制在20个字符之内");
			 return;			 
		 }
		 //不是框架合同则要求必须填写付款阶段
		 var contractSort = getCurrentPageObj().find("select[name='UC.contract_sort']").val();
		 //判断合同状态是否为框架合同
		 if(contractSort != "C_DIC_CONTRACT_SORT_FRAME"){
			 var phase_nums = 0;
			 var getFirstPhases = 0; //是否存在首付款阶段信息
			 var alreadyExist = 0; //是否存在重复的付款阶段
			 var totalPersent = 0; //付款阶段半分比总和是否为100%
			 var s="";
			 //获取所有付款阶段名称的对象
			 var phaseName = $("select[name^='UCP.phase_name_']").map(function(){return this.value;}).get();
			 var paymentScale = $("input[name^='UCP.payment_scale_']").map(function(){return this.value;}).get();
			 //转换为字符串
			 if(phaseName.length > 1){
				  s = phaseName.join(",")+",";
			 }
			 for ( var i = 0; i < phaseName.length; i++) {
				 //每一阶段名称
				 var phase_name = phaseName[i];
				 //每一付款阶段百分比
				 var payment_scale = ""+paymentScale[i];
				 if(undefined != phase_name && "" != phase_name && phase_name != null){
					 phase_nums ++;
				 }
				 if(phase_name == "01"){
					 getFirstPhases ++;
				 }
				 if(phaseName.length > 1){
					 var sArr=s.split(",");
					 for(var j=0;j<sArr.length;j++){
						 for(var k=0;k<sArr.length;k++){
							 if(sArr[k]==sArr[j]&&k!=j){
								 alreadyExist ++;
							 }
						 }
					 }
				 }
				 if(payment_scale != null && payment_scale != "" && payment_scale != undefined){
					 totalPersent = parseFloat(totalPersent) + parseFloat(payment_scale);
				 }
			 }
			 if(phase_nums<1){
				 alert("请至少填写一项付款阶段信息！");
				 return;
			 }
			 if(getFirstPhases == 0){
				 alert("请填写首付款阶段信息！");
				 return;
			 }
			 if(alreadyExist>0){
				 alert("请不要填写重复的付款阶段！");
				 return;
			 }
			 if(parseFloat(totalPersent).toFixed(2) != 100.00){
				 alert("付款阶段的百分比不满足100%！");
				 return;
			 }
		 }
		 var contract_type=$("#contract_type").val();
	 	 
	 	 if(contract_type=="01"||contract_type=="02"){
	 		 var alreadyPurchase = 0; //是否存在重复的
	 		 var purchase_nums = 0; //是否存在付款阶段信息
	 		 var b="";
	 		 var purchase=$("input[name^='CPU.product_name_']").map(function(){return this.value;}).get();
	 		 if(purchase.length>1){
	 			 var b = purchase.join(",")+",";
	 		 }
	 		 for (var i = 0; i < purchase.length; i++) {
	 			 var purchase_name = purchase[i];
	 			if(purchase.length > 1 && b.replace(purchase_name[i]+",", "").indexOf(purchase_name[i]+",")>-1){
	 				alreadyPurchase ++;
				 }
	 			if(undefined != purchase_name && "" != purchase_name && purchase_name != null){
	 				purchase_nums ++;
				 }
			}
	 		 if(alreadyPurchase>0){
	 			 alert("请不要填写重复的产品！");
				 return;
	 		 }
	 		 if(purchase_nums<=0){
	 			alert("请至少填写一项产品信息！");
				 return;
	 		 }
	 	 }
		var params = {};
		//取出所有name属性带UC.的对象，并将之放入params集合里面
		var vals=getCurrentPageObj().find("[name^='UC.']");
		for(var i=0;i<vals.length;i++){
			var val=$(vals[i]);
			if($.trim(val.val())!=""){
				params[val.attr("name").substr(3)]=val.val();
			}
		}
		//取值
		var phaseVals=getCurrentPageObj().find("[name^='UCP.']");
		for(var i=0;i<phaseVals.length;i++){
			var val=$(phaseVals[i]);
			if($.trim(val.val())!=""){
				params[val.attr("name").substr(4)]=val.val();
			}
		}
		//采购信息
		 var purchaseVals=getCurrentPageObj().find("[name^='CPU.']");
		 for(var i=0;i<purchaseVals.length;i++){
			 var val=$(purchaseVals[i]);
			 if($.trim(val.val())!=""){
				 params[val.attr("name").substr(4)]=val.val();
			 }
		 }
		 if(status == "save"){
			 params["contract_state"]= "0001";  //待执行 
		 }else if(status == "submit"){
			 params["contract_state"]= "00";  //执行中
		 }
		params["conlocaRowNum"]=updateConRowNum;
		params["updatePhaseRowNum"]=updatePhaseRowNum;
		params["updatepurchaseNum"]=updatepurchaseNum;
		params["updateupPurchaseNum"]=updateupPurchaseNum;
		baseAjaxJsonp(dev_outsource+"contractInfo/updateContractInfo.asp?SID="+SID+"&call="+calls,params,function(data){
			if(data != undefined&&data!=null&&data.result=="true"){
				update_contract_updateAndClose("保存成功！",true);
			}else{
				alert("保存失败！");
			}
		},calls);
	}
}
//更新按钮点击事件处理-----end---------


/**
 * 合同类别和合同类型级联
 * */
function changeContractTypeDicUpdate(e){
	initSelect(getCurrentPageObj().find("#contract_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});//合同类型（字典项）
	if(e == "C_DIC_CONTRACT_SORT_FRAME"){
		getCurrentPageObj().find("#updateCon_phase_add_title").css({"display":"none"});
		getCurrentPageObj().find("#updateCon_phase_add_table").css({"display":"none"});
	}else{
		getCurrentPageObj().find("#updateCon_phase_add_title").css({"display":"block"});
		getCurrentPageObj().find("#updateCon_phase_add_table").css({"display":"block"});
	}
}
/**
 * 采购信息显示
 */
function changeContractTypeUpdate(item){
	var contract_sort=getCurrentPageObj().find("#contract_sort").val();//只有常规合同的01、02的合同类型弹出软硬件采购信息
	if(contract_sort=="C_DIC_CONTRACT_SORT_NORMAL"){
		if(item=="01"||item=="02"){
			if(conType==item){
				if(contractPur!=null&&contractPur!=""){
					for (var i = 0; i < contractPur.length; i++) {
						 var trStr="<tr id=\"contractPurchaseUp_"+updatepurchaseNum+"\" >"+
							 "<td style='display:none'>"+
							 	"<input type=\"text\" name=\"CPU.id_"+updatepurchaseNum+"\" id=\"id_"+updatepurchaseNum+"\"/>"+
							 "</td>"+
						//产品名称
					 		"<td >" +
					 			"<input type=\"text\" validate=\"v.required\" valititle=\"产品名称为必填项\" name=\"CPU.product_name_"+updatepurchaseNum+"\" id=\"product_name_"+updatepurchaseNum+"\"/>" +
					 		"</td>"+
					 		//产品型号
					 		"<td >"+
					 			"<input type=\"text\" validate=\"v.required\" valititle=\"产品型号为必填项\" name=\"CPU.product_model_"+updatepurchaseNum+"\" id=\"product_model_"+updatepurchaseNum+"\"/>"+
					 		"</td>"+
					 		//材质
					 		"<td >"+
					 			"<input type=\"text\" validate=\"v.required\" valititle=\"材质为必填项\" name=\"CPU.material_"+updatepurchaseNum+"\" id=\"material_"+updatepurchaseNum+"\"/>"+
					 		"</td>"+
					 		//数量
					 		"<td>"+
					 			"<input type=\"text\" validate=\"v.isint\" valititle=\"数量为必填项\"  name=\"CPU.purchase_num_"+updatepurchaseNum+"\" id=\"purchase_num_"+updatepurchaseNum+"\"/>"+
							"</td>"+
							//备注
							"<td >"+
								"<input type=\"text\" name=\"CPU.memo_"+updatepurchaseNum+"\" id=\"memo_"+updatepurchaseNum+"\"/>"+
							"</td>"+
							//删除按钮
							"<td >" +
							"<a onclick=\"delContractPurchaseUp('"+updatepurchaseNum+"');\" name=\"contractPurchaseUp_del_"+updatepurchaseNum+"\" id=\"contractPurchaseUp_del_"+updatepurchaseNum+"\" >删除</button></a>" +
							"</td>"+
				 		"</tr>";
						 //添加
						 getCurrentPageObj().find("#contractPurchase_table_Up").append(trStr);
						 for(var phaseKey in contractPur[i]){
							 var phaseKeyLow = phaseKey.toLowerCase();
							 //处理付款类型的下拉
							getCurrentPageObj().find("[name='CPU."+phaseKeyLow+"_"+updatepurchaseNum+"']").val(contractPur[i][phaseKey]);
						 }
						//序号自增
						 updatepurchaseNum ++;
						 initVlidate(getCurrentPageObj().find("#contractPurchase_table_Up"));
					}
				}
			}else{
				$("#contractPurchase_table_Up tr:not(:first)").empty();
			}
			$("#purchase_Up").show();
		}else{
			$("#purchase_Up").hide();
			$("#contractPurchase_table_Up tr:not(:first)").empty();
		}
	}else{
		$("#purchase_Up").hide();
		$("#contractPurchase_table tr:not(:first)").empty();
		
	}
}

//删除
function delContractPurchaseUp(row){
	var delePurchaseObj = getCurrentPageObj().find("#id_"+row);
	if(delePurchaseObj){
		var delPurchaseCode = delePurchaseObj.val();
		//添加付款阶段信息删除的编号隐藏域
		getCurrentPageObj().find("#contractPurchase_add_Up").append("<input type=\"hidden\" name=\"CPU.delete_purchase_code_"+row+"\" value=\""+delPurchaseCode+"\" />");
	}
	getCurrentPageObj().find("#contractPurchaseUp_"+row).remove();
	
}
/**
 * 页面按钮初始化
 */
 $(function(){
	/**
	 * 附件上传;
	 */
	var file_id = getCurrentPageObj().find("#normalUpdateContractFile").val();
	if(""==$.trim(file_id)){
		getCurrentPageObj().find("#normalUpdateContractFile").val(Math.uuid());
	}
	getCurrentPageObj().find("#updateContractFileButton").click(function(){
		openFileUploadInfo('normalUpdateContractFile','ADD_CONTRACT',getCurrentPageObj().find("#normalUpdateContractFile").val(),function(data){
			defaultShowFileInfo(getCurrentPageObj().find("#normalUpdateContractFile").val(),getCurrentPageObj().find("#updateContractFileButton").parent(),data,true,"updateContractFileDiv");
		});
	});
	 //合同付款阶段信insertContractInfo息新增---------------------------start----------------------------------
	 getCurrentPageObj().find("#contractPhase_update_add").click(function(){//
		 var tr="<tr id=\"contractPhase_update_"+updatePhaseRowNum+"\" >"+
					 //付款阶段编号
					 "<td style='display:none'>"+
					 	"<input type=\"text\" name=\"UCP.phase_code_"+updatePhaseRowNum+"\" id=\"phase_code_"+updatePhaseRowNum+"\"/>"+
					 "</td>"+
					 //付款阶段名称
					 "<td >" +
					 	"<select id=\"phase_name_"+updatePhaseRowNum+"\" name=\"UCP.phase_name_"+updatePhaseRowNum+"\"   validate=\"v.required\" valititle=\"付款阶段名称为必填项\" ></select>" +
					 "</td>"+
					 //付款条件
					 "<td >"+
					 	"<select  name=\"UCP.payment_condition_"+updatePhaseRowNum+"\" id=\"payment_condition_"+updatePhaseRowNum+"\" validate=\"v.required\" valititle=\"付款条件为必填项\"></select>"+
					 "</td>"+
					 //付款类型
					 "<td >"+
					 	"<select id=\"payment_type_"+updatePhaseRowNum+"\" name=\"UCP.payment_type_"+updatePhaseRowNum+"\" /></select>"+
					 "</td>"+
					 //占比（%）
					 "<td>"+
					 	"<input class=\"table-rate-input\" type=\"text\" name=\"UCP.payment_scale_"+updatePhaseRowNum+"\" id=\"payment_scale_"+updatePhaseRowNum+"\" " +
					 			"onchange=\"update_checkAndCalculatePyayment(this,'"+updatePhaseRowNum+"');\" validate=\"v.required\" valititle=\"占比为必填项\" />"+
					 "</td>"+
					 //付款金额（元）
					 "<td >"+
					 	"<input type=\"text\" name=\"UCP.payment_money_"+updatePhaseRowNum+"\" id=\"payment_money_"+updatePhaseRowNum+"\" readonly=\"readonly\" />"+
					 "</td>"+
					 //删除按钮
					 "<td >" +
					 	"<a onclick=\"delUpdatePhase('"+updatePhaseRowNum+"');\" name=\"update_Phase_del_"+updatePhaseRowNum+"\" id=\"update_Phase_del_"+updatePhaseRowNum+"\" >删除</a>" +
					 "</td>"+
				 "</tr>";
		 //添加合同付款阶段信息行
		 getCurrentPageObj().find("#contractPhase_update_table").append(tr);
		 //添加付款类型下拉
		 initSelect(getCurrentPageObj().find("select[name='UCP.payment_type_"+updatePhaseRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CONTRACT_PHASE_PAY_TYPE"});
		 //付款阶段字典项
		 initSelect(getCurrentPageObj().find("select[name='UCP.phase_name_"+updatePhaseRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CONTRACT_PAY_PHASES"});
		 //付款条件字典项
		 initSelect(getCurrentPageObj().find("select[name='UCP.payment_condition_"+updatePhaseRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CON_PAYMENT_CONDITION"});
		 //序号自增
		 updatePhaseRowNum++;
		 initVlidate(getCurrentPageObj().find("#contractPhase_update_table"));
		 //合同付款阶段信息新增按钮处理-----end---------
	 });
	//采购信息
		//初始化软硬件采购序号
		 getCurrentPageObj().find("#contractPurchase_add_Up").click(function(){
			 var tr="<tr id=\"contractPurchaseUp_"+updatepurchaseNum+"\" >"+
			 "<td style='display:none'>"+
			 	"<input type=\"text\" name=\"CPU.id_"+updatepurchaseNum+"\" id=\"id_"+updatepurchaseNum+"\"/>"+
			 "</td>"+
			 //产品名称
			 "<td ><input type=\"text\" validate=\"v.required\" valititle=\"产品名称为必填项\" name=\"CPU.product_name_"+updatepurchaseNum+"\" id=\"product_name_"+updatepurchaseNum+"\"/></td>"+
			 //产品型号
			 "<td ><input type=\"text\" validate=\"v.required\" valititle=\"产品型号为必填项\" name=\"CPU.product_model_"+updatepurchaseNum+"\" id=\"product_model_"+updatepurchaseNum+"\"/></td>"+
			 //材质
			 "<td ><input type=\"text\" validate=\"v.required\" valititle=\"材质为必填项\" name=\"CPU.material_"+updatepurchaseNum+"\" id=\"material_"+updatepurchaseNum+"\"/></td>"+
			 //数量
			 "<td ><input type=\"text\" validate=\"v.isint\" valititle=\"数量为必填项\" name=\"CPU.purchase_num_"+updatepurchaseNum+"\" id=\"purchase_num_"+updatepurchaseNum+"\"/></td>"+
			 //备注
			 "<td ><input type=\"text\" name=\"CPU.memo_"+updatepurchaseNum+"\" id=\"memo_"+updatepurchaseNum+"\"/></td>"+
			 //删除按钮
			 "<td ><a onclick=\"delContractPurchaseUp('"+updatepurchaseNum+"');\" name=\"contractPurchaseUp_del_"+updatepurchaseNum+"\" id=\"contractPurchaseUp_del_"+updatepurchaseNum+"\" >删除</button></a></tr>";
			 //
			 getCurrentPageObj().find("#contractPurchase_table_Up").append(tr);
			 //序号自增
			 updatepurchaseNum++;
			 initVlidate(getCurrentPageObj().find("#contractPurchase_table_Up"));
		});
 });
//更改合同金额（不含税）
 function u_changeConMoney(obj){
 	if(!checkFloatNum(obj)){
 		return;
 	}
 	var con_money = obj.value;
 	var con_taxmoney = getCurrentPageObj().find("[name^='UC.con_taxmoney']").val();
 	if("" != con_money){
 		if(parseFloat(con_money)>parseFloat(con_taxmoney)){
 			alert("“总金额（不含税）”不能多于“总金额（含税）”的金额！");
 			obj.value="0";
 			return;
 		}
 	}
 	//判断总金额是否大于已付金额和扣款金额
 	var con_money=getCurrentPageObj().find("#con_money").val();
 	var pay_money=getCurrentPageObj().find("#pay_money").val();
 	var deduction=getCurrentPageObj().find("#deduction").val();
 	if(con_money<pay_money||con_money<deduction){
 		alert("总金额不能小于已付金额或扣款金额");
 		getCurrentPageObj().find("#pay_money").val(con_money);
 	}
 }
 //校验折扣
 function checkUpRateNum(obj){
		var flag = true;
		var reg = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
		var form=$(obj);
		var uuid=form.attr("validateId");
		if(!reg.test(obj.value)){
	        flag = false;
	    }else{
	    	if(parseFloat(obj.value) > parseFloat(100.00)){
	            flag = false;
	    	}
	    }
		if(!flag){
			if(uuid==undefined||uuid==""){
				uuid=Math.uuid();
			}
			form.attr("validateId",uuid);
			$(obj).parent().append('<div  id="'+uuid+'"  class="tag-content" >'+'请填写100以内数字，保留两位小数'+'</div>');
	        obj.value='';
		}
		return flag;
	}
 
 //更改合同金额（含税）
 function u_changeConTaxMoney(obj){
 	if(!checkFloatNum(obj)){
 		return;
 	}
 	var con_taxmoney = obj.value;
 	var con_money = getCurrentPageObj().find("[name^='UC.con_money']").val();
 	if("" != con_money){
 		if(parseFloat(con_money)>parseFloat(con_taxmoney)){
 			alert("“总金额（不含税）”不能多于“总金额（含税）”的金额！");
 			obj.value="0";
 			return;
 		}
 	}

 	//总金额改变之后更改付款金额
 	var paymentScales=getCurrentPageObj().find("[name^='UCP.payment_scale_']");
 	for(var i=0;i<paymentScales.length;i++){
 		var paymentScale=$(paymentScales[i]).val();
 		if("" == paymentScale){
 			getCurrentPageObj().find("[name='UCP.payment_money_"+(i+1)+"']").val(0);
 		}else{
 			var paymentMoney = parseFloat(con_taxmoney)*(parseFloat(paymentScale)/100.0);
 			getCurrentPageObj().find("[name='UCP.payment_money_"+(i+1)+"']").val(parseFloat(paymentMoney).toFixed(2));
 		}
 	}
 }
//合同付款阶段信息删除
function delUpdatePhase(row){
	var delePhaseObj = getCurrentPageObj().find("#phase_code_"+row);
	if(delePhaseObj){
		var delPhaseCode = delePhaseObj.val();
		//添加付款阶段信息删除的编号隐藏域
		getCurrentPageObj().find("#contractPhase_update_add").append("<input type=\"hidden\" name=\"UCP.delete_phase_code_"+row+"\" value=\""+delPhaseCode+"\" />");
	}
	getCurrentPageObj().find("#contractPhase_update_"+row).remove();
}
//时间比较
function contractTimeCompare(){
	var flag = true;
	//保修开始时间
	var guarantee_starttime = getCurrentPageObj().find("input[name='UC.guarantee_starttime']").val();
	//保修结束时间
	var guarantee_endtime = getCurrentPageObj().find("input[name='UC.guarantee_endtime']").val();
	if(guarantee_starttime!=""&&guarantee_endtime!=""){
		if(guarantee_starttime>guarantee_endtime){
			alert('保修开始时间不能大于保修结束时间!');
			return false;
		}
	}
	return flag;
}




function update_contract_updateAndClose(msg,callback){
	setTimeout(function(){
		  $.Zebra_Dialog(msg, {
	          'type':     'close',
	          'title':    '提示',
	          'buttons':  ['确定'],
	          'onClose':  function(caption) {
            	if(callback){
            		$("li.current a").click();
            		$("#contractInfoTable").bootstrapTable('refresh');
            	}
	          }
	      });
	},206);
};


function checkNum(obj){
	var reg = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
	if(!reg.test(obj.value)){
        alert("请输入两位小数的数字!");
        obj.value='';
    	return false;
    }
	return true;
}

//计算付款阶段金额并验证占比不超过100%
function update_checkAndCalculatePyayment(obj,rowNum){
	if(!checkNum(obj)){
		return;
	}
	var flag = false;
	var con_taxmoney = getCurrentPageObj().find("[name^='UC.con_taxmoney']").val();
	//取值
	var subScales=getCurrentPageObj().find("[name^='UCP.payment_scale_']");
	var totalScales = 0;
	for(var i=0;i<subScales.length;i++){
		var subScale=$(subScales[i]);
		if($.trim(subScale.val())!=""){
			totalScales = parseFloat(totalScales)+parseFloat(subScale.val());
		}
	}
	if(parseFloat(totalScales)>100.0){
		alert("付款阶段的占比之和不能超过100%！");
		obj.value=0;
		getCurrentPageObj().find("[name='UCP.payment_money_"+rowNum+"']").val(0);
	}else{
		if(""!=con_taxmoney){
			var paymentScale = obj.value;
			if("" == paymentScale){
				getCurrentPageObj().find("[name='UCP.payment_money_"+rowNum+"']").val(0);
			}else{
				var paymentMoney = parseFloat(con_taxmoney)*(parseFloat(paymentScale)/100.0);
				getCurrentPageObj().find("[name='UCP.payment_money_"+rowNum+"']").val(parseFloat(paymentMoney).toFixed(2));
			}
		}
		flag = true;
	}
	return flag;
}


//校验付款阶段号唯一
function checkContractPhaseCode(obj,rowNum){
	var flag = false;
	var phaseCode = obj.value;
	//取值
	var phases=getCurrentPageObj().find("[name^='UCP.phase_code_']");
	for(var i=0;i<phases.length;i++){
		var phase=$(phases[i]);
		if(phase.attr("name")=="UCP.phase_code_"+rowNum){
			continue;
		}
		if(phase.val()==phaseCode){
			flag = true;
			break;
		}
	}
	if(flag){
		 alert("请勿录入重复的付款阶段编号！");
		 obj.value = "";
	}else{
		var oldPhaseCode = getCurrentPageObj().find("[name='ucp_old_phase_code_"+rowNum+"']").val();
		var params = {"phase_code":phaseCode,"old_phase_code":oldPhaseCode};
		baseAjaxJsonp(dev_outsource+"contractInfo/checkContractPhaseCodeIsExist.asp?SID="+SID+"&call="+calls,params,function(data){
			if(data != undefined&&data!=null&&data.result=="true"){
				alert("付款阶段编号已存在，请选择其他付款阶段编号录入！");
				obj.value = "";
				return;
			}
		},calls);
	}
}
