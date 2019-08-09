/**
 * 初始化合同信息
 * @param project_id
 */
function initContractInfoDetail(contract_code){
	var calls = getMillisecond()+1;
	baseAjaxJsonp(dev_outsource+"contractInfo/queryOneContractInfo.asp?contract_code="+contract_code+"&SID="+SID+"&call="+calls,null,function(data){
		if(data){
			var contract_sort ="";
			var contractInfoData = data["contractInfo"];
			for(var p in contractInfoData){
				if("FILE_ID" == p){
					if(contractInfoData["FILE_ID"]&&$.trim(contractInfoData["FILE_ID"])!=""){
						findFileInfo(contractInfoData["FILE_ID"],function(data){
							if(data.rows.length>0){
								defaultShowFileInfo(contractInfoData["FILE_ID"],getCurrentPageObj().find("#QCI_queryInfoContractFileinfo"),data,false,"queryInfoContractFileDiv");
							}
						});
	   				}
				}else if("CONTRACT_SORT" == p){
					contract_sort = contractInfoData[p];
				}else{
					var projectKey = p.toLowerCase();
					if("CON_TAXMONEY" == p || "CON_MONEY" == p){
						var val = (contractInfoData[p]||0);
						getCurrentPageObj().find("#QCI_"+projectKey).text(formatNumber(parseFloat(val).toFixed(2))||"0.00");
						//未付金额已付比例、未付比例计算
						 var con_money=(contractInfoData["CON_MONEY"]||0);//含税金额
						 var pay_money=(contractInfoData["PAY_MONEY"]||0);//已付金额
					 	$("#QCI_weifu").text((con_money-pay_money)||"0.0");
					 	var pay_tatio=(pay_money/con_money)*100;//已付比例
					 		pay_tatio=parseFloat(isNaN(pay_tatio)?"0.00":pay_tatio);
					 	$("#QCI_pay_tatio").text(pay_tatio.toFixed(2));
					 	$("#QCI_weifubili").text((100.00-pay_tatio).toFixed(2));
					}else{
						getCurrentPageObj().find("#QCI_"+projectKey).text(contractInfoData[p]||"");
						if(projectKey=="contract_type_name"){
							if(contractInfoData[p]=="软件产品采购"||contractInfoData[p]=="硬件产品采购"){
								$("#purchase_Info").show();
							}
						}
					}
				}
			}
			var contractPhaseDatas = data["contractPhases"];
			//付款阶段信息显示
			if(contractPhaseDatas!=""){
				for(var i=0;i<contractPhaseDatas.length;i++){
					var trStr="<tr>"+
				 		"<td validate=\"v.required\"><div id=\"QCPI_PHASE_NAME_NAME_"+i+"\"></div></td>"+
				 		"<td validate=\"v.required\"><div id=\"QCPI_PAYMENT_CONDITION_NAME_"+i+"\"></div></td>"+
				 		"<td validate=\"v.required\"><div id=\"QCPI_PAYMENT_TYPE_NAME_"+i+"\"></div></td>"+
				 		"<td validate=\"v.required\"><div id=\"QCPI_PAYMENT_SCALE_NAME_"+i+"\"></div></td>"+
						"<td validate=\"v.required\"><div id=\"QCPI_PAYMENT_MONEY_"+i+"\"></div></td>"+
				 		"</tr>";
					getCurrentPageObj().find("#contractPhase_queryInfo_table").append(trStr);
					for(var phaseKey in contractPhaseDatas[i]){
						if("PAYMENT_MONEY" == phaseKey){
							var val = contractPhaseDatas[i][phaseKey];
							if(val == "" || val == null){
								getCurrentPageObj().find("#QCPI_"+phaseKey+"_"+i).text("");
							}else{
								getCurrentPageObj().find("#QCPI_"+phaseKey+"_"+i).text(formatNumber(parseFloat(val).toFixed(2))||"");
							}
						}else{
							getCurrentPageObj().find("#QCPI_"+phaseKey+"_"+i).text(contractPhaseDatas[i][phaseKey]||"");
						}
					}
				}
			}else{
				if("C_DIC_CONTRACT_SORT_FRAME" == contract_sort ){
					getCurrentPageObj().find("#Con_phase_info_title").css({"display":"none"});
					getCurrentPageObj().find("#Con_phase_info_table").css({"display":"none"});
				}
			}
			//采购信息
			var contractPurchaseD=data["contractPurchase"];
			if(contractPurchaseD!=null&&contractPurchaseD!=""){
				for (var i = 0; i < contractPurchaseD.length; i++) {
					 var trStr="<tr>"+
					//产品名称
				 		"<td >" +
				 			"<div id=\"CPUI_PRODUCT_NAME_"+i+"\"></div>" +
				 		"</td>"+
				 		//产品型号
				 		"<td >"+
				 			"<div id=\"CPUI_PRODUCT_MODEL_"+i+"\"></div>"+
				 		"</td>"+
				 		//材质
				 		"<td >"+
				 			"<div id=\"CPUI_MATERIAL_"+i+"\"></div>"+
				 		"</td>"+
				 		//数量
				 		"<td>"+
				 			"<div id=\"CPUI_PURCHASE_NUM_"+i+"\"></div>"+
						"</td>"+
						//备注
						"<td >"+
							"<div id=\"CPUI_MEMO_"+i+"\"></div>"+
						"</td>"+
			 		"</tr>";
					 //添加
					 getCurrentPageObj().find("#contractPurchase_table_Info").append(trStr);
					 for(var phaseKey in contractPurchaseD[i]){
						 if(phaseKey!="ID"){
							 getCurrentPageObj().find("#CPUI_"+phaseKey+"_"+i).text(contractPurchaseD[i][phaseKey]||"");
						 }
					 }
				}
			} 
		}
	},calls);
}