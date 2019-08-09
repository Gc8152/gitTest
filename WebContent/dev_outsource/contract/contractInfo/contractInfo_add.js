/**
 * 字典初始化方法：初始化所有下拉菜单
 */
var calls = getMillisecond();
function initAddContractInfoPage(){
	initSelect(getCurrentPageObj().find("#contract_sort"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CONTRACT_SORT"});//合同类别（字典项）
	initVlidate(getCurrentPageObj());  
	//初始化合同编号POP框
	/*	var obj=getCurrentPageObj().find("#contract_code");
	obj.unbind("click");
	obj.click(function(){
		openConPop("conCheckPop",{singleSelect:true,
			contract_name:getCurrentPageObj().find("#contract_name"),
			contract_code:getCurrentPageObj().find("#contract_code"),
			con_taxmoney:getCurrentPageObj().find("#con_taxmoney"),
			sup_name:getCurrentPageObj().find("#supplier_name"),
			supplier_id:getCurrentPageObj().find("#supplier_ids")
			});
	});*/
	//供应商名称
	getCurrentPageObj().find("#supplier_name").unbind("click");
	getCurrentPageObj().find("#supplier_name").click(function(){
		openSupplierPop("contract_supplier_Pop",
				{singleSelect:true,parent_company:getCurrentPageObj().find("#supplier_name"),parent_sup_num:getCurrentPageObj().find("input[name='AC.supplier_ids']")});
	});
	//需求一级部门
	var obj=getCurrentPageObj().find("input[name='AC.demand_deptname_one']");
	obj.unbind("click");
	obj.click(function(){
	//	openSelectTreeDivToBody($(this),"op_office_pop_fd_tree",dev_outsource+"SOrg/queryorgtreelist.asp?SID="+SID+"&call="+calls,30,function(node){
		openSelectTreeDivToBody($(this),"op_office_pop_fd_tree","SOrg/queryOrgTreeWithCenterList.asp",30,function(node){
			getCurrentPageObj().find("input[name='AC.demand_deptname_one']").val(node.name);
			getCurrentPageObj().find("input[name='AC.demand_deptno_one']").val(node.id);
		});
	});
	//初始化责任一级部门
	var obj=getCurrentPageObj().find("#responsibility_deptname_one");
	obj.unbind("click");
	obj.click(function(){	
		//openSelectTreeDivToBody($(this),"contractTreedept_id",dev_outsource+"SOrg/queryorgtreedeptlist.asp?SID="+SID+"&call="+calls,30,function(node){
		openSelectTreeDivToBody($(this),"contractTreedept_id","SOrg/queryOrgTreeWithCenterList.asp",30,function(node){
			getCurrentPageObj().find("#responsibility_deptname_one").val(node.name);
			getCurrentPageObj().find("#responsibility_deptno_one").val(node.id);
			//隐藏提示选择部门的div
			getCurrentPageObj().find("#responsibility_deptno_two").parent().find("div").remove();
			//当重新选择部门时清空处室的值
			getCurrentPageObj().find("#responsibility_deptno_two").val("");
		});
	});
	var obj1=getCurrentPageObj().find("#responsibility_deptname_two");
	obj1.unbind("click");
	obj1.click(function(){
		var orgid=getCurrentPageObj().find("#responsibility_deptno_one").val();
		if(orgid==""){
			//先删除之前append的div，再append
			obj1.parent().find("div").remove();
			obj1.parent().append('<div class="tag-content" >请先选择责任一级部门</div>');
			return;
		}
		//openSelectTreeDivToBody($(this),"contractTreeoffices_id",url=dev_outsource+"SOrg/queryorgtreeofficeslist.asp?suporg_code="+orgid.toUpperCase()+""+"&SID="+SID+"&call="+calls,30,function(node){
		openSelectTreeDivToBody($(this),"contractTreeoffices_id","SOrg/queryOrgTreeWithCenterList.asp?suporg_code="+orgid.toUpperCase()+"",30,function(node){
			getCurrentPageObj().find("#responsibility_deptname_two").val(node.name);
			getCurrentPageObj().find("#responsibility_deptno_two").val(node.id);
			//隐藏提示选择处室的div
			getCurrentPageObj().find("#responsibility_deptname_two").parent().find("div").remove();
		});
	});
	/**
	 * 附件上传;
	 */
	getCurrentPageObj().find("#normalContractFile").val(Math.uuid());
	getCurrentPageObj().find("#addContractFileButton").click(function(){
		openFileUploadInfo('normalContractFile','ADD_CONTRACT',getCurrentPageObj().find("#normalContractFile").val(),function(data){
			defaultShowFileInfo(getCurrentPageObj().find("#normalContractFile").val(),getCurrentPageObj().find("#addContractFileButton").parent(),data,true,"addContractFileDiv");
		});
	});
}
//二次点击责任一级部门时，将责任二级部门的值清空
function clickDeptOne(responsibility_deptno_one){
	if(responsibility_deptno_one!=undefined&&responsibility_deptno_one!=null&&responsibility_deptno_one!=""){
		getCurrentPageObj().find("#responsibility_deptno_two").val("");		
		getCurrentPageObj().find("#responsibility_deptname_two").val("");
	}
}
//初始化合同付款阶段序号
var addPhaseRowNum = 1;
var updateConRowNum=1;
/**
 * 合同类别和合同类型级联
 * */
function changeContractTypeDicAdd(e){
	initSelect(getCurrentPageObj().find("#contract_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});//合同类型（字典项）
	if(e == "C_DIC_CONTRACT_SORT_FRAME"){
		getCurrentPageObj().find("#addCon_phase_add_title").css({"display":"none"});
		getCurrentPageObj().find("#addCon_phase_add_table").css({"display":"none"});
	}else{
		getCurrentPageObj().find("#addCon_phase_add_title").css({"display":"block"});
		getCurrentPageObj().find("#addCon_phase_add_table").css({"display":"block"});
	}
}
//通过合同类型判断是否显示软硬件采购
/*function changeContractTypeAdd(item){
	var contract_sort=getCurrentPageObj().find("#contract_sort").val();//只有常规合同的01、02的合同类型弹出软硬件采购信息
	if(contract_sort=="C_DIC_CONTRACT_SORT_NORMAL"){
		if(item=="01"||item=="02"){
			$("#purchase").show();
			addContractPurchase();
		}else{
			$("#purchase").hide();
			$("#contractPurchase_table tr:not(:first)").empty();
		}
	}else{
		$("#purchase").hide();
		$("#contractPurchase_table tr:not(:first)").empty();
		
	}
}
/**
 * 软硬件采购
 */
//初始化软硬件采购序号
/*var purchaseNum=1;
var upPurchaseNum=1;
function addContractPurchase(){
	$("#contractPurchase_add").click(function(){
		 var tr="<tr id=\"contractPurchase_"+purchaseNum+"\" >"+
		 //产品名称
		 "<td ><input type=\"text\" validate=\"v.required\" name=\"CPC.product_name_"+purchaseNum+"\" id=\"product_name_"+purchaseNum+"\" valititle=\"产品名称为必填\"/></td>"+
		 //产品型号
		 "<td ><input type=\"text\" validate=\"v.required\" name=\"CPC.product_model_"+purchaseNum+"\" id=\"product_model_"+purchaseNum+"\" valititle=\"产品型号为必填\"/></td>"+
		 //材质
		 "<td ><input type=\"text\" validate=\"v.required\" name=\"CPC.material_"+purchaseNum+"\" id=\"material_"+purchaseNum+"\" valititle=\"材质为必填\"/></td>"+
		 //数量
		 "<td ><input type=\"text\" validate=\"v.isint\"  name=\"CPC.purchase_num_"+purchaseNum+"\" id=\"purchase_num_"+purchaseNum+"\" valititle=\"数量为必填\"/></td>"+
		 //备注
		 "<td ><input type=\"text\" name=\"CPC.memo_"+purchaseNum+"\" id=\"memo_"+purchaseNum+"\"/></td>"+
		 //删除按钮
		 "<td ><a onclick=\"delContractPurchase('"+purchaseNum+"');\" name=\"contractPurchase_del_"+purchaseNum+"\" id=\"contractPurchase_del_"+purchaseNum+"\" >删除</button></a></tr>";
		 //
		 getCurrentPageObj().find("#contractPurchase_table").append(tr);
		 //序号自增
		 purchaseNum++;
		 initVlidate(getCurrentPageObj().find("#contractPurchase_table"));
	});
}*/
//删除
function delContractPurchase(row){
	getCurrentPageObj().find("#contractPurchase_"+row).remove();
	
}
/**
 * 判断合同类别是否选择
 */
function clickConType(value){
	var contract_sort=getCurrentPageObj().find("#contract_sort").val();
	if(contract_sort==undefined||contract_sort==null||contract_sort==""){
		alert("请先选择合同类别");
	}
}

//校验折扣
function checkAddRateNum(obj){
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
/**
 * 页面按钮初始化
 */
$(function(){
	 //合同付款阶段信息新增---------------------------start----------------------------------
	 getCurrentPageObj().find("#contractPhase_add").click(function(){//前台页面新增按钮的id
		 var contract_type=getCurrentPageObj().find("#contract_type").val();
		 if(contract_type!=undefined&&contract_type!=null&&contract_type!=""){
			 var tr="<tr id=\"contractPhase_info_"+addPhaseRowNum+"\" >"+
			 //id
			 "<td style='display:none'><input type=\"text\" name=\"UCP.phase_code_"+addPhaseRowNum+"\" id=\"phase_code_"+addPhaseRowNum+"\"/></td>"+
			 //付款阶段名称
			 "<td ><select name=\"ACP.phase_name_"+addPhaseRowNum+"\" id=\"phase_name_"+addPhaseRowNum+"\"  validate=\"v.required\"  valititle=\"付款阶段名称为必填项\" /></select></td>"+
			 //付款条件
			 "<td ><select  name=\"ACP.payment_condition_"+addPhaseRowNum+"\" id=\"payment_condition_"+addPhaseRowNum+"\" validate=\"v.required\" valititle=\"付款条件为必填项\" /></select></td>"+
			 //付款类型
			 "<td ><select id=\"payment_type_"+addPhaseRowNum+"\" name=\"ACP.payment_type_"+addPhaseRowNum+"\"/></select></td>"+
			 //占比（%）
			 "<td ><input type=\"text\" name=\"ACP.payment_scale_"+addPhaseRowNum+"\" id=\"payment_scale_"+addPhaseRowNum+"\" validate=\"v.number\" "+
			    " valititle=\"占比(%)为必填项\"  onchange=\"checkAndCalculatePyayment(this,'"+addPhaseRowNum+"');\" /></td>"+
			 //付款金额（元）
			 "<td ><input type=\"text\" name=\"ACP.payment_money_"+addPhaseRowNum+"\" id=\"payment_money_"+addPhaseRowNum+"\"   readonly=\"readonly\"/></td>"+
			 //删除按钮
			 "<td ><a onclick=\"delContractPhase('"+addPhaseRowNum+"');\" name=\"contractPhase_del_"+addPhaseRowNum+"\" id=\"contractPhase_del_"+addPhaseRowNum+"\" >删除</button></a></tr>";
			 //添加合同付款阶段信息行
			 getCurrentPageObj().find("#contractPhase_add_table").append(tr);//在id=#contractPhase_add_table的表格里插入前面tr的内容
			 //添加付款类型下拉（字典项）
			 initSelect(getCurrentPageObj().find("select[name='ACP.payment_type_"+addPhaseRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CONTRACT_PHASE_PAY_TYPE"});
			 //付款阶段字典项
			 initSelect(getCurrentPageObj().find("select[name='ACP.phase_name_"+addPhaseRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CONTRACT_PAY_PHASES"});
			 //付款条件字典项
			 initSelect(getCurrentPageObj().find("select[name='ACP.payment_condition_"+addPhaseRowNum+"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CON_PAYMENT_CONDITION"});
			 //序号自增
			 addPhaseRowNum++;
			 //初始化验证
			 initVlidate(getCurrentPageObj().find("#contractPhase_add_table"));
		 }else{
			 alert("请先选择合同类型");
		 }
	 });
	 //合同付款阶段信息新增---------------------------end----------------------------------
});
function saveContractInfoMsg(status){
	 //合同信息保存按钮事件---------------------------start----------------------------------
		 //校验必填项
		 if(vlidate(getCurrentPageObj(),"",false)){//验证
			 var contract_code = getCurrentPageObj().find("#contract_code").val();
			 if(contract_code.length>20){
				 alert("合同编号控制在20个字符之内");
				 return;			 
			 }
			 var contractSort = getCurrentPageObj().find("select[name='AC.contract_sort']").val();//取填写的合同状态的值
			 if(contractSort != "C_DIC_CONTRACT_SORT_FRAME"){//判断选择的合同类型是否需要填写付款信息
				 var phase_nums = 0; //是否存在付款阶段信息
				 var getFirstPhases = 0; //是否存在首付款阶段信息
				 var alreadyExist = 0; //是否存在重复的付款阶段
				 var totalPersent = 0; //付款阶段半分比总和是否为100%
				 var s="";
				 //获取所有付款阶段名称的对象
				 var phaseName = $("select[name^='ACP.phase_name_']").map(function(){return this.value;}).get();
				 //转换为字符串
				 if(phaseName.length > 1){
					  s = phaseName.join(",")+",";
				 }
				 for ( var i = 0; i < phaseName.length; i++) {
					 //每一阶段名称
					
					 var phase_name = phaseName[i];
					 //每一付款阶段百分比
					 var payment_scale = getCurrentPageObj().find("input[name='ACP.payment_scale_"+(i+1)+"']").val(); 
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
			 		 var purchase=$("input[name^='CPC.product_name_']").map(function(){return this.value;}).get();
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
				 //获取所有name前缀为AC的值把所有值都放到vals里面
				 var vals=getCurrentPageObj().find("[name^='AC.']");//AC是新增数据的前缀
				 for(var i=0;i<vals.length;i++){
					 var val=$(vals[i]);
					 if($.trim(val.val())!=""){
						 params[val.attr("name").substr(3)]=val.val();//把属性值放到params这个集合里
					 }
				 }
				//获取所有name前缀为ACP的值
				 var phaseVals=getCurrentPageObj().find("[name^='ACP.']");
				 for(var i=0;i<phaseVals.length;i++){
					 var val=$(phaseVals[i]);
					 if($.trim(val.val())!=""){
						 params[val.attr("name").substr(4)]=val.val();
					 }
				 }
				 var purchaseVals=getCurrentPageObj().find("[name^='CPC.']");
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
				 params["addPhaseRowNum"]=addPhaseRowNum;
//				 params["purchaseNum"]=purchaseNum;
//				 params["upPurchaseNum"]=upPurchaseNum;
				// params["supplier_name"]=getCurrentPageObj().find("#AC_supplier_name_show").text();
				 baseAjaxJsonp(dev_outsource+"contractInfo/insertContractInfo.asp?SID="+SID+"&call="+calls,params,function(data){
					 if(data != undefined&&data!=null&&data.result=="true"){
						 add_contract_saveAndClose("保存成功！",true);
					 }else if(data != undefined&&data!=null&&data.result=="reContractCode"){
						 alert("合同编号已存在，请重新填写！");
					 }
					 else{
						 alert("保存失败！");
					 }
				 },calls);
		}
//	});
	//合同信息保存按钮事件---------------------------end----------------------------------
}
 //计划验收时间默认等于保修开始时间
function changeStartTime(){
	var guarantee_starttime=getCurrentPageObj().find("#guarantee_starttime").val();//保修开始时间
	var plan_arrivaltime=getCurrentPageObj().find("#plan_arrivaltime").val();//计划验收时间
	if(""==plan_arrivaltime){
		getCurrentPageObj().find("#plan_arrivaltime").val(guarantee_starttime);
	}
	
}
//更改合同金额（不含税）
 function a_changeConMoney(obj){
	if(!checkFloatNum(obj)){
		return;
	}
	var con_money = obj.value;
	var con_taxmoney = getCurrentPageObj().find("[name^='AC.con_taxmoney']").val();
	if("" != con_money){
 		if(parseFloat(con_money)>parseFloat(con_taxmoney)){
 			alert("“总金额（不含税）”不能多于“总金额（含税）”的金额！");
 			obj.value="0";
 			return;
 		}
 	}
 	//判断总金额是否大于已付金额和扣款金额
 	var pay_money=getCurrentPageObj().find("#pay_money").val();
 	var deduction=getCurrentPageObj().find("#deduction").val();
 	if(con_money<pay_money||con_money<deduction){
 		alert("总金额不能小于已付金额或扣款金额");
 		getCurrentPageObj().find("#pay_money").val(con_money);
 	}else{
 		var pay_tatio=(pay_money/con_money)*100;
 		getCurrentPageObj().find("#pay_tatio").html(pay_tatio.toFixed(2));
 		getCurrentPageObj().find("#weifubili").html((100-pay_tatio).toFixed(2));
 		getCurrentPageObj().find("#weifu").html(con_money-pay_money);
 	}
}

//更改合同金额（含税）
 function a_changeTaxMoney(obj){
 	if(!checkFloatNum(obj)){
 		return;
 	}
 	var con_taxmoney = obj.value;
 	var con_money = getCurrentPageObj().find("[name^='AC.con_money']").val();
 	if("" != con_taxmoney){
 		if(parseFloat(con_money)>parseFloat(con_taxmoney)){
 			alert("“总金额（不含税）”不能多于“总金额（含税）”的金额！");
 			obj.value="0";
 			return;
 		}
 	}
 	//总金额改变之后更改付款金额
 	var paymentScales=getCurrentPageObj().find("[name^='ACP.payment_scale_']");
 	for(var i=0;i<paymentScales.length;i++){
 		var paymentScale=$(paymentScales[i]).val();
 		if("" == paymentScale){
 			getCurrentPageObj().find("[name='ACP.payment_money_"+(i+1)+"']").val(0);
 		}else{
 			var paymentMoney = parseFloat(con_taxmoney)*(parseFloat(paymentScale)/100.0);
 			getCurrentPageObj().find("[name='ACP.payment_money_"+(i+1)+"']").val(parseFloat(paymentMoney).toFixed(2));
 		}
 	}
}

//付款阶段删除
function delContractPhase(row){
	getCurrentPageObj().find("#contractPhase_info_"+row).remove();
	
}
 

function checkRateNum(obj){
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

//计算付款阶段金额并验证占比不超过100%
function checkAndCalculatePyayment(obj,rowNum){
	/*if(!checkNum(obj)){
		return;
	}*/
	var flag = false;
	var con_taxmoney = getCurrentPageObj().find("[name^='AC.con_taxmoney']").val();
	//取值
	var subScales=getCurrentPageObj().find("[name^='ACP.payment_scale_']");
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
		getCurrentPageObj().find("[name='ACP.payment_money_"+rowNum+"']").val(0);
	}else{
		if(""!=con_taxmoney){
			var paymentScale = obj.value;
			if("" == paymentScale){
				getCurrentPageObj().find("[name='ACP.payment_money_"+rowNum+"']").val(0);
			}else{
				var paymentMoney = parseFloat(con_taxmoney)*(parseFloat(paymentScale)/100.0);
				getCurrentPageObj().find("[name='ACP.payment_money_"+rowNum+"']").val(parseFloat(paymentMoney).toFixed(2));//保留两位小数
			}
		}
		flag = true;
	}
	return flag;
}


//点击保存后弹出的提示
function add_contract_saveAndClose(msg,callback){
	setTimeout(function(){
		  $.Zebra_Dialog(msg, {
	          'type':     'close',
	          'title':    '提示',
	          'buttons':  ['确定'],
	          'onClose':  function(caption) {
            	if(callback){//回调函数
            		$("li.current a").click();
            		$("#contractInfoTable").bootstrapTable('refresh');
            	}
	          }
	      });
	},206);
};

//校验付款阶段号唯一
function checkContractPhaseCode(obj,rowNum){
	var flag = false;
	var phaseCode = obj.value;
	//取值
	var phases=getCurrentPageObj().find("[name^='ACP.phase_code_']");
	for(var i=0;i<phases.length;i++){
		var phase=$(phases[i]);
		if(phase.attr("name")=="ACP.phase_code_"+rowNum){
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
		var params = {"phase_code":phaseCode};
		baseAjaxJsonp(dev_outsource+"contractInfo/checkContractPhaseCodeIsExist.asp?SID="+SID+"&call="+calls,params,function(data){
			if(data != undefined&&data!=null&&data.result=="true"){
				alert("付款阶段编号已存在，请选择其他付款阶段编号录入！");
				obj.value = "";
				return;
			}
		},calls);
	}
}
initAddContractInfoPage();//初始化方法