function initSuppInfoAddPage(){
	initVlidate($("#addsuppInfoList"));
	initSelect($("#Agroup_company"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_GROUP_COMPANY"});
	initSelect($("#Aordinary_vat_payr"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_ORDINARY_VAT_PAYR"});
	initSelect($("#Ais_payer"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_IS_PAYER"});
	initSelect($("#Asup_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_SUP_LEVEL"});
	//企业性质
	initSelect($("#Anature_business"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"sup_nature_business"});
	//供应商分类
	initSelect(getCurrentPageObj().find("#Asup_sort_one"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_TECHNOLOGIC_MANAGE"});
	//是否上市
	initSelect($("#Ais_listed"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_IS_PAYER"});
	//所属区域下拉树
	getCurrentPageObj().find("#Aaddress").click(
			function() {
				openSelectTreeDivToBody($(this), "dic_addtree_sup_id",
						"SupplierInfo/queryAlladdress.asp",30, function(node) {
							$("#Aaddress").val(node.name);
							$("#addcode").val(node.id);
						});
			});


}

function addOutsup(){//字典初始化方法
	getCurrentPageObj().find("li[name='otherMsg']").hide();
};
function changelisted(value){
	var value=getCurrentPageObj().find("#Ais_listed").val();
	//上市（01：是  02：否）
	if(value=="02"){
		getCurrentPageObj().find("#AD_listed_addr").removeAttr("validate");
		getCurrentPageObj().find("#AD_stock_code").removeAttr("validate");
	
	}else if(value=="01"){
		//上市地，股票代码必填
		getCurrentPageObj().find("#AD_listed_addr").attr("validate","v.required");
		getCurrentPageObj().find("#AD_stock_code").attr("validate","v.required");
	}
}

 /**
  * 供应商新增
  */
(function(){
	//保存按钮
	$("#supplierInfoSave").click(function(){
		$("#supplierInfoSave").prop({"disabled":true});
//		var value=getCurrentPageObj().find("#Ais_listed").val();
//		if(value=="02"){//
//			getCurrentPageObj().find("#AD.address").removeAttr("validate");
//			getCurrentPageObj().find("#AD.stock_code").removeAttr("validate");
//		
//		}else if(value=="01"){
//			//上市地，股票代码必填
//			getCurrentPageObj().find("#AD.address").attr("validate","v.required");
//			getCurrentPageObj().find("#AD.stock_code").attr("validate","v.required");
//		}
		
		if(!vlidate($("#addsuppInfoList"))){
			$("#supplierInfoSave").prop({"disabled":false});
			return ;
		}
		var inputs = $("input[name^='AD.']");
		var selects = $("select[name^='AD.']");
		var textareas = $("textarea[name^='AD.']");
		var params = {};
		
		//取值
		//输入框
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val();	 
		}
		//下拉选
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(3)] = $(selects[i]).val(); 
		}	
		//文本域
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(3)] = $(textareas[i]).val(); 
		}
		//科技管理多选
		var supSortOneArr=$("#Asup_sort_one").select2("data");
		var supSortOneStr="";
		if(supSortOneArr!=null&&supSortOneArr!=""){
			for(var i=0;i<supSortOneArr.length;i++){
				supSortOneStr+=supSortOneArr[i]["id"]+",";
			}
		}
		params["sup_sort_one"]=supSortOneStr.substring(0, supSortOneStr.length-1);
		var call=getMillisecond();
		$("#supplierInfoSave").prop({"disabled":false});
		//保存并发送数据
		baseAjaxJsonp(dev_outsource+"SupplierInfo/addSupplier.asp?SID="+SID+"&call="+call,params, function(data) {
        	if (data != undefined&&data!=null&&data.result=="true") {
        		alert("保存成功",function(){
        			getCurrentPageObj().find("#Asup_num").val(data["sup_num"]);
        			getCurrentPageObj().find("li[name='otherMsg']").show();
					getCurrentPageObj().find("#TbaseInfo").removeClass("active");
					getCurrentPageObj().find("#tabLinkmanInfos").removeClass("active");
					getCurrentPageObj().find("#tabLinkmanInfo_add").addClass("active");
					getCurrentPageObj().find("#tabLinkmanInfo").addClass("active");

        		});
			}else if(data != undefined&&data!=null&&data.result=="repeat"){
				alert("供应商已存在");
			}else{
				alert("保存失败");
			}
		},call);
	});
	//联系人保存方法
	getCurrentPageObj().find("#saveLinkman_add").click(function(){
		$(this).prop({"disabled":true});
		if(!vlidate($("#lmTable"))){
			$(this).prop({"disabled":false});
			return;
		}
		var inputs = $("input[type!='radio'][name^='AL.']");
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		params["is_liasions"]=getCurrentPageObj().find("input[type='radio'][name='AAL.is_liasions']:checked").val();
		params["linkman_type"] = getCurrentPageObj().find("#Alinkman_type").val();
		params["linkman_num"] = $("#Alinkman_num").html();
		params["sup_num"] = $("#Asup_num").val();
		//var sup_num= $("#AD.sup_num").val();
		var linkman_num = params["linkman_num"];
		//如果联系人编号为不为空 ,则为修改
		var call=getMillisecond();
		var url="SupplierInfo/addSupplierLinkman.asp?SID="+SID+"&call="+call;
		if(linkman_num!=undefined&&linkman_num!=null&&linkman_num!= ""){
			url="SupplierInfo/updateLinkman.asp?SID="+SID+"&call="+call;
		}
		$(this).prop({"disabled":false});
		baseAjaxJsonp(dev_outsource+url,params, function(data) {
			var sup_num= $("#Asup_num").val();
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("保存成功",function(){
					$("#addLinkmanPop_add").modal("hide");
					$('#supLinkmanTableAdd').bootstrapTable('refresh',{url:dev_outsource+'SupplierInfo/queryLinkmanByNum.asp?call=jq_1520068507830&sup_num=' + sup_num+"&SID="+SID+"&_="+getMillisecond()});
				});
			}else if (data != undefined&&data!=null&&data.result=="repeat"){
				alert("供应商只能有一个常用联系人！");
			}else{
				alert("保存失败");
			}
		},call);
	});
	//资质文件保存
	$("#saveEnclInfo_add").click(function(){
		if(!vlidate($("#amTable"))){		
			return;
		}
		var inputs = $("input[name^='AE.']");
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		params["encl_type"] = getCurrentPageObj().find("#Aencl_type").val();
		params["sup_num"] = getCurrentPageObj().find("#Asup_num").val();
		params["encl_num"] = $("#Aencl_num").html();
		var sup_num= $("#Asup_num").val();
		//如果附件编号为不为空 ,则为修改
		var call=getMillisecond();
		var url="SupplierInfo/addSupplierEncl.asp?SID="+SID+"&call="+call;
		if(params["encl_num"] != ""){
			url="SupplierInfo/updateEnclInfo.asp?SID="+SID+"&call="+call;
		 }
			baseAjaxJsonp(dev_outsource+url,params, function(data) {
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("保存成功",function(){
						$("#addAttachmentPop_add").modal("hide");
						$('#enclosureInfoTableAdd').bootstrapTable('refresh',{url:dev_outsource+'SupplierInfo/queryEnclByNum.asp?call=jq_1520068507831&sup_num=' + sup_num+"&SID="+SID+"&_="+getMillisecond()});
					});
				}else{
					alert("保存失败");
				}
			},call);
	});
	//股权结构保存
	$("#saveShareholder_add").click(function(){
		$(this).prop({"disabled":true});
		if(!vlidate($("#shTable"))){
			$(this).prop({"disabled":false});
			return ;
		}
		var inputs = $("input[name^='HA.']");
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		sup_num = $("#Asup_num").val();
		params["sup_num"] = sup_num;
		params["shareholder_num"] = $("#Ashareholder_num").html();
		var allData=$("#ownershipStructureTableAdd").bootstrapTable("getData");
		var dlength=allData.length;
		var sumRatio=0;//持股比例
		if(dlength>0){
			for(var i=0;i<dlength-1;i++){
				sumRatio+=allData[i]["SHAREHOLDING_RATIO"];
			}
		}
		//如果股东编号为空，则为新增
		var Ratio=params["shareholding_ratio"];
		sumRatio+=parseFloat(Ratio);
		var num=100.00;
		var call=getMillisecond();
		$(this).prop({"disabled":false});
		if(sumRatio>num){
			alert("持股比例不能超过100%");
		}else{
			var url="SupplierInfo/addShareHolder.asp?SID="+SID+"&call="+call;
			if($("#Ashareholder_num").html()!=""){
				url="SupplierInfo/updateShareHolder.asp?SID="+SID+"&call="+call;
			}
			baseAjaxJsonp(dev_outsource+url,params, function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						//$("#select").click();
						alert("保存成功",function(){
							$("#addShareholderPop_add").modal("hide");
							$('#ownershipStructureTableAdd').bootstrapTable('refresh',{url:dev_outsource+'SupplierInfo/queryOwnershipByNum.asp?call=jq_1520068507834&sup_num=' + sup_num+"&SID="+SID+"&_="+getMillisecond()});
						});
					}else{
						alert("保存失败");
					}
				},call);		
		}
	});
	//财务信息
	$("#saveFinancialInfo_add").click(function(){
		if(!vlidate($("#fiTable"))){		
			return;
		}
		var inputs = $("input[name^='AF.']");
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		sup_num = $("#Asup_num").val();
		params["sup_num"] = sup_num;
		params["financial_num"] = $("#Afinancial_num").html();
		//如果编号为空，则为新增
		var call=getMillisecond();
		var url="SupplierInfo/addFinancialInfo.asp?SID="+SID+"&call="+call;
		if(params["financial_num"] != ""&&params["financial_num"] !=undefined){
			url="SupplierInfo/updateFinancialInfo.asp?SID="+SID+"&call="+call;
		}
		baseAjaxJsonp(dev_outsource+url,params, function(data) {
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("保存成功",function(){
						$("#addFinancialInfoPop_add").modal("hide");
						$('#financialInfoTableAdd').bootstrapTable('refresh',{url:dev_outsource+'SupplierInfo/queryFinancialInfoByNum.asp?call=jq_1520068507833&sup_num=' + sup_num+"&SID="+SID+"&_="+getMillisecond()});
					});
				}else{
					alert("保存失败");
				}
			},call);		
	});
	//主要客户保存
	$("#saveSignInfo_add").click(function(){
		if(!vlidate($("#sgTable"))){		
			return;
		}
		var inputs = $("input[name^='AS.']");
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		params["sup_num"] = $("#Asup_num").val();
		params["product"] = $("textarea[name='AS.product']").val();
		params["sign_type"] = $("#Asign_type").val();
		params["sign_num"] = $("#Asign_num").html();
		//联系人编号 为空，则新增
		var call=getMillisecond();
		var url="SupplierInfo/addSupplierSignInfo.asp?SID="+SID+"&call="+call;
		if(params["sign_num"] != ""&&params["sign_num"] !=undefined){
			url="SupplierInfo/updateSignInfo.asp?SID="+SID+"&call="+call;
		}
		baseAjaxJsonp(dev_outsource+url,params, function(data) {
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("保存成功",function(){
						$("#addSignInfoPop_add").modal("hide");
						$('#signInfoTableAdd').bootstrapTable('refresh', {url:dev_outsource+'SupplierInfo/querySignInfoByNum.asp?call=jq_1520068507833&sup_num=' + params["sup_num"]+"&SID="+SID+"&_="+getMillisecond()});
					});
				}else{
					alert("保存失败");
					$("#addSignInfoPop_add").modal("hide");
				}
			},call);
		
	});

})();
initSuppInfoAddPage();




initOwnershipInfoAdd();
//初始化股东信息
function initOwnershipInfoAdd(){
	//重置按钮
	$("#resetShareholder_add").click(function(){
		$("input[name^='HA.']").val("");
	});
	var sup_num = $("#Asup_num").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#ownershipStructureTableAdd").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+'SupplierInfo/queryOwnershipByNum.asp?call=jq_1520068507834&sup_num='+sup_num+"&SID="+SID+"&_="+getMillisecond(),
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : false, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "shareholder_num", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback:"jq_1520068507834",
				onLoadSuccess:function(data){
					var allData=$("#ownershipStructureTableAdd").bootstrapTable("getData");
					var dlength=allData.length;
					if(dlength>0){
						var sumAmount=0;
						var sumRatio=0;
						for(var i=0;i<dlength;i++){
							sumAmount+=allData[i]["AMOUNT"];
							sumRatio+=allData[i]["SHAREHOLDING_RATIO"];
						}
						var sumRow={};
						sumRow.R="";
						sumRow.SHAREHOLDER_NUM="";
						sumRow.SHAREHOLDER_NAME="合计";
						sumRow.AMOUNT=sumAmount;
						sumRow.SHAREHOLDING_RATIO=sumRatio;
						$("#ownershipStructureTableAdd").bootstrapTable("append",sumRow);
						$("#ownershipStructureTableAdd").bootstrapTable("mergeCells",{
							index:dlength,
							field:"R",
							rowspan:0,
							colspan:2,
							radio:false
						});
					}
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'R',
					title : '序号',
					align : "center"
					//此处的序号不要随便乱改，后果很严重，你会很懵逼
				},{
					field : 'SHAREHOLDER_NUM',
					title : '股东编号',
					align : "center",
					visible:false
				},{
					field : 'SHAREHOLDER_NAME',
					title : '股东名称',
					align : "center",
				},{
					field : 'AMOUNT',
					title : '出资金额(元)',
					align : "center",
					formatter : function(value,row,index){
						if(value!=""&&value!=null&&value!=undefined){
							value=parseFloat(value).toFixed(2);
							return formatNumber(value);
						}else{
							return value;
						}
					}
				}, {
					field : "SHAREHOLDING_RATIO",
					title : "持股比例(%)",
					align : "center"
				} ]
			});
}

//增加供应商页面中,增加股东信息
function saveShareholderAdd(){
	//显示增加股东信息模态框
	$("#addShareholder_add").click(function(){
		$("#addShareholderPop_add").modal("show");
		$("#resetShareholder_add").click();
		$("div[name^='HA.']").html("");
	});
}
//删除供应商股东
function delShareholderAdd(){
	$("#deleteShareholder_add").click(function(){
		var num = $("#ownershipStructureTableAdd").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.SHAREHOLDER_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			var url="SupplierInfo/deleteShareholder.asp?shareholder_num="+nums;
			var call=getMillisecond();
			baseAjaxJsonp(dev_outsource+url,{call:call,SID:SID},function(msg){
				if(msg){
					alert("删除成功！",function(){
					$("#ownershipStructureTableAdd").bootstrapTable('remove', {
						field: 'SHAREHOLDER_NUM',
						values: nums
					});	
					$('#ownershipStructureTableAdd').bootstrapTable('refresh',{url:dev_outsource+'SupplierInfo/queryOwnershipByNum.asp?call=jq_1520068507834&sup_num=' + sup_num+"&SID="+SID+"&_="+getMillisecond()});
				});
				}else{
					alert("删除失败！");
				}
			},call);
		});
	});
}
//修改供应商股东
function updateShareholderAdd(){
	$("#updateShareholder_add").click(function(){
		var num = $("#ownershipStructureTableAdd").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.SHAREHOLDER_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		$("#addShareholderPop_add").modal("show");
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+"SupplierInfo/queryOneShareholder.asp?shareholder_num="+nums+"&SID="+SID+"&call="+call, null , function(data) {
			//初始化基本信息
			for ( var k in data) { 
				if(k=="amount"){
					continue;
				}
				$("input[name='HA." + k + "']").val(data[k]);
				$("div[name='HA." + k + "']").html(data[k]);
				$("input[name='HA.amount']").val(Number(data["amount"]).toFixed(2));
			}
		},call);
	});
}


//初始化供应商联系人信息
function initSupLinkmanAdd(){
	//重置按钮
	$("#reset_supLinkman_add").click(function(){
		$("input[name^='AL.']").val("");
		$("textarea[name='AL.address']").val("");
		initSelect($("#Alinkman_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_LINKMAN_TYPE"});
	});
	var sup_num = $("#Asup_num").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#supLinkmanTableAdd").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+'SupplierInfo/queryLinkmanByNum.asp?call=jq_1520068507830&sup_num='+sup_num+"&SID="+SID+"&_="+getMillisecond(),
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "linkman_num", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback:"jq_1520068507830",
				onLoadSuccess:function(data){
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'Number',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : 'LINKMAN_NUM',
					title : '联系人编号',
					align : "center",
					visible:false
				},{
					field : 'LINKMAN_TYPE',
					title : '联系人类别',
					align : "center"
				},{
					field : 'NAME',
					title : '姓名',
					align : "center",
				},{
					field : 'POST',
					title : '职务',
					align : "center"
				}, {
					field : "TEL",
					title : "联系电话",
					align : "center",
				}, {
					field : "EMAIL",
					title : "邮箱",
					align : "center"
				}, {
					field : "IS_LIASIONS",
					title : "是否常用联系人",
					align : "center"
				} ]
			});
}
//增加供应商页面中,增加供应商联系人
function saveLinkmaninfoAdd(){
	//显示联系人模态框
	getCurrentPageObj().find("#addLinkMan_add").click(function(){
		getCurrentPageObj().find("#addLinkmanPop_add").modal("show");
		getCurrentPageObj().find("#reset_supLinkman_add").click();
	});
}
//删除供应商联系人
function delLinkmaninfoAdd(){
	$("#deleteLinkman_add").click(function(){
		var num = $("#supLinkmanTableAdd").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.LINKMAN_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			var call=getMillisecond();
			var url="SupplierInfo/deleteLinkmanInfoByNum.asp?linkman_num="+nums;
			baseAjaxJsonp(dev_outsource+url,{call:call,SID:SID},function(msg){
				if(msg){
					alert("删除成功！",function(){
					$("#supLinkmanTableAdd").bootstrapTable('remove', {
						field: 'LINKMAN_NUM',
						values: nums
					});	
				});
				}else{
					alert("删除失败！");
				}
			},call);
		});
	});
}
//修改供应商联系人
function updateLinkmaninfoAdd(){
	getCurrentPageObj().find("#updateLinkman_add").click(function(){
		var num = $("#supLinkmanTableAdd").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.LINKMAN_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		getCurrentPageObj().find("#addLinkmanPop_add").modal("show");
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+"SupplierInfo/queryOneLinkman.asp?linkman_num="+nums+"&SID="+SID+"&call="+call, null , function(data) {
			//初始化基本信息
			initSelect($("#Alinkman_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_LINKMAN_TYPE"},data.linkman_type);
			for ( var k in data) {
				if("is_liasions"==k){
					continue;
				}
				$("input[name='AL." + k + "']").val(data[k]);
				$("select[name='AL." + k + "']").val(data[k]);
				$("textarea[name='AL." + k + "']").val(data[k]);
				$("div[name='AL." + k + "']").html(data[k]);
				//单选框赋值
				getCurrentPageObj().find("input[name='AAL.is_liasions'][value='"+data["is_liasions"]+"']").click();
			}
		},call);
	});
}
initFinancialInfoAdd();
//初始化财务信息
function initFinancialInfoAdd(){
	//重置按钮
	$("#resetFinancialInfo_add").click(function(){
		$("input[name^='AF.']").val("");
	});
	var sup_num = $("#Asup_num").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	$("#financialInfoTableAdd").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+'SupplierInfo/queryFinancialInfoByNum.asp?call=jq_1520068507833&sup_num='+sup_num+"&SID="+SID+"&_="+getMillisecond(),
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "financial_num", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback:"jq_1520068507833",
				onLoadSuccess:function(data){
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'FINANCIAL_NUM',
					title : '财务信息编号',
					align : "center",
					visible:false
				},{
					field : 'Number',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : 'YEAR',
					title : '年度',
					align : "center"
				},{
					field : 'TOTAL_ASSETS',
					title : '总资产(万元)',
					align : "center",
					formatter : function(value,row,index){
						if(value!=""&&value!=null&&value!=undefined){
							value=parseFloat(value).toFixed(2);
							return formatNumber(value);
						}else{
							return value;
						}
					}
				},{
					field : 'NET_ASSETS',
					title : '净资产(万元)',
					align : "center",
					formatter : function(value,row,index){
						if(value!=""&&value!=null&&value!=undefined){
							value=parseFloat(value).toFixed(2);
							return formatNumber(value);
						}else{
							return value;
						}
					}
				},{
					field : 'SALES_AMOUNT',
					title : '销售额(万元)',
					align : "center",
					formatter : function(value,row,index){
						if(value!=""&&value!=null&&value!=undefined){
							value=parseFloat(value).toFixed(2);
							return formatNumber(value);
						}else{
							return value;
						}
					}
				},{
					field : 'NET_PROFITS',
					title : '净利润(万元)',
					align : "center",
					formatter : function(value,row,index){
						if(value!=""&&value!=null&&value!=undefined){
							value=parseFloat(value).toFixed(2);
							return formatNumber(value);
						}else{
							return value;
						}
					}
				}, {
					field : "TOTAL_ASSETS_RATE",
					title : "总资产利润率",
					align : "center",
					formatter : function(value){
						if(value!=""&&value!=null&&value!=undefined){
							return value+"%";
						}else{
							return value;
						}
					}
				}, {
					field : "ASSET_LIABILITY_RATIO",
					title : "资产负债率",
					align : "center",
					formatter : function(value){
						if(value!=""&&value!=null&&value!=undefined){
							return value+"%";
						}else{
							return value;
						}
					}
				}, {
					field : "NET_CASH_FLOWS",
					title : "经营活动现金流量净额(万元)",
					align : "center",
					formatter : function(value,row,index){
						if(value!=""&&value!=null&&value!=undefined){
							value=parseFloat(value).toFixed(2);
							return formatNumber(value);
						}else{
							return value;
						}
					}
				}, {
					field : "CASH_EQUIVALENTS",
					title : "期末现金及现金等价物余额(万元)",
					align : "center",
					formatter : function(value,row,index){
						if(value!=""&&value!=null&&value!=undefined){
							value=parseFloat(value).toFixed(2);
							return formatNumber(value);
						}else{
							return value;
						}
					}
				}, {
					field : "CURRENT_ASSETS_RATIO",
					title : "期末货币资金占流动资产比例",
					align : "center",
					formatter : function(value){
						if(value!=""&&value!=null&&value!=undefined){
							return value+"%";
						}else{
							return value;
						}
					}
				} ]
			});
}
//增加供应商页面中,增加财务信息
function saveFinancialInfoAdd(){
	//显示增加财务信息模态框
	$("#addFinancialInfo_add").click(function(){
		$("#addFinancialInfoPop_add").modal("show"); 	
		$("#resetFinancialInfo_add").click();
		$("div[name^='AF.']").html("");
	});
}
//删除财务信息
function delFinancialInfoAdd(){
	$("#deleteFinancialInfo_add").click(function(){
		var num = $("#financialInfoTableAdd").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.FINANCIAL_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			var url="SupplierInfo/deleteFinancialInfo.asp?financial_num="+nums;
			var call=getMillisecond();			
			baseAjaxJsonp(dev_outsource+url,{call:call,SID:SID},function(msg){
				if(msg){
					alert("删除成功！",function(){
						$("#financialInfoTableAdd").bootstrapTable('remove', {
							field: 'FINANCIAL_NUM',
							values: nums
						});	
					});
				}else{
					alert("删除失败！");
				}
			},call);
		});
	});
}
//修改供应商财务信息
function updateFinancialInfoAdd(){
	$("#updateFinancialInfo_add").click(function(){
		var num = $("#financialInfoTableAdd").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.FINANCIAL_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		$("#addFinancialInfoPop_add").modal("show");
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+"SupplierInfo/queryOneFinancialInfo.asp?financial_num="+nums+"&SID="+SID+"&call="+call, null , function(data) {
			//初始化基本信息
			for ( var k in data) { 
				if(k=="total_assets" || k=="net_assets" || k=="sales_amount" || k=="net_profits" || k=="net_cash_flows" || k=="cash_equivalents"){
					continue;
				}
				$("input[name='AF." + k + "']").val(data[k]);
				$("input[name='AF." + k + "']").val(data[k]);
				$("input[name='AF.total_assets']").val(data["total_assets"]);
				$("input[name='AF.net_assets']").val(data["net_assets"]);
				$("input[name='AF.sales_amount']").val(data["sales_amount"]);
				$("input[name='AF.net_profits']").val(data["net_profits"]);
				$("input[name='AF.net_cash_flows']").val(data["net_cash_flows"]);
				$("input[name='AF.cash_equivalents']").val(data["cash_equivalents"]);
				$("div[name='AF." + k + "']").html(data[k]);
			}
		},call);
	});
}
initSignInfoAdd();
//初始化签约情况
function initSignInfoAdd(){
	//重置按钮
	$("#reset_signInfo_add").click(function(){
		$("input[name^='AS.']").val("");
		$("textarea[name='AS.product']").val("");
		initSelect($("#Asign_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_SIGN_TYPE"});
	});
	var sup_num = $("#Asup_num").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#signInfoTableAdd").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+'SupplierInfo/querySignInfoByNum.asp?call=jq_1520068507833&sup_num='+sup_num+"&SID="+SID+"&_="+getMillisecond(),
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "sign_num", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback:"jq_1520068507833",
				onLoadSuccess:function(data){
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'SIGN_NUM',
					title : '签约编号',
					align : "center",
					visible:false
				},{
					field : 'Number',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : 'SIGN_TYPE',
					title : '签约类别',
					align : "center"
				},{
					field : 'CUS_NAME',
					title : '客户名称',
					align : "center"
				},{
					field : "PRODUCT",
					title : "签约主要产品/服务",
					align : "center"
				},{
					field : 'SIGN_DATE',
					title : '签约时间',
					align : "center",
				},{
					field : 'SIGN_MONEY',
					title : '项目签约金额',
					align : "center"
				}, {
					field : "LINKMAN_NAME",
					title : "客户联系人",
					align : "center"
				}, {
					field : "LINK_TEL",
					title : "联系人电话",
					align : "center"
				}]
			});
}
//增加签约信息
function saveSignInfoAdd(){
	initSelect($("#Asign_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_SIGN_TYPE"});
	//显示联系人模态框
	$("#addSignInfo_add").click(function(){
		$("#addSignInfoPop_add").modal("show");
		$("#reset_signInfo_add").click();
		$("div[name^='AS.']").html("");
	});
}
//删除签约信息
function delSignInfoAdd(){
	$("#deleteSignInfo_add").click(function(){
		var num = $("#signInfoTableAdd").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.SIGN_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			var url="SupplierInfo/deleteSignInfoByNum.asp?sign_num="+nums;
			var call=getMillisecond;
			baseAjaxJsonp(dev_outsource+url,{SID:SID,call:call},function(msg){
				if(msg){
					alert("删除成功！",function(){
						$("#signInfoTableAdd").bootstrapTable('remove', {
							field: 'SIGN_NUM',
							values: nums
						});	
					});
				}else{
					alert("删除失败！");
				}
			},call);
		});
	});
}
//修改供应商签约信息
function updateSignInfoAdd(){
	$("#updateSignInfo_add").click(function(){
		var num = $("#signInfoTableAdd").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.SIGN_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		$("#addSignInfoPop_add").modal("show");
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+"SupplierInfo/queryOneSignInfo.asp?sign_num="+nums+"&SID="+SID+"&call="+call, null , function(data) {
			//初始化基本信息
			initSelect($("#Usign_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_SIGN_TYPE"},data.sign_type);
			for ( var k in data) { 
				$("input[name='AS." + k + "']").val(data[k]);
				$("textarea[name='AS." + k + "']").val(data[k]);
				$("select[name='AS." + k + "']").val(data[k]);
				$("div[name='AS." + k + "']").html(data[k]);
			}
		},call);
	});
}
initEnclInfoAdd();
//初始化供应商的资质文件
function initEnclInfoAdd(){
	//重置按钮
	$("#resetEnclInfo_add").click(function(){
		$("input[name^='AE.']").val("");
		initSelect($("#Aencl_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_ENCL_TYPE"});
	});
	var sup_num = $("#Asup_num").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#enclosureInfoTableAdd").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+'SupplierInfo/queryEnclByNum.asp?call=jq_1520068507831&sup_num='+sup_num+"&SID="+SID+"&_="+getMillisecond(),
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）escape(encodeURIComponent(user_name))
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "encl_num", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback:"jq_1520068507831",
				onLoadSuccess:function(data){
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'ENCL_NUM',
					title : '附件编号',
					align : "center",
					visible:false
				},{
					field : 'Number',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : 'ENCL_TYPE',
					title : '类别',
					align : "center"
				},{
					field : 'ENCL_NAME',
					title : '资质名称',
					align : "center",
				},{
					field : "ISSUE_AUTHORITY",
					title : "颁发机构",
					align : "center"
				},{
					field : "EFFICIENT_TIME",
					title : "生效时间",
					align : "center"
				},{
					field : "END_TIME",
					title : "终止时间",
					align : "center"
				}]

			});
}
//增加供应商资质文件
function saveEnclInfoAdd(){
	initSelect($("#Aencl_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_ENCL_TYPE"});
	//显示模态框
	$("#addEnclInfo_add").click(function(){
		$("#addAttachmentPop_add").modal("show");
		$("#resetEnclInfo_add").click();
	});
}
//删除资质文件信息
function delEnclInfoAdd(){
	$("#deleteEnclInfo_add").click(function(){
		var num = $("#enclosureInfoTableAdd").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.ENCL_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			var url="SupplierInfo/deleteEnclInfoByNum.asp?encl_num="+nums;
			var call=getMillisecond();
			baseAjaxJsonp(dev_outsource+url,{call:call,SID:SID},function(msg){
				if(msg){
					alert("删除成功！",function(){
						$("#enclosureInfoTableAdd").bootstrapTable('remove', {
							field: 'ENCL_NUM',
							values: nums
						});	
					});
				}else{
					alert("删除失败...");
				}
			},call);
		});	
	});
}
//修改供应商附件
function updateEnclInfoAdd(){
	$("#updateEnclInfo_add").click(function(){
		var num = $("#enclosureInfoTableAdd").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.ENCL_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		$("#addAttachmentPop_add	").modal("show");
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+"SupplierInfo/queryOneEnclInfo.asp?encl_num="+nums+"&SID="+SID+"&call="+call, null , function(data) {
			//初始化基本信息
			initSelect($("#Aencl_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_ENCL_TYPE"},data.encl_type);
			//$("#Uupload_emp").val(data.upload_emp);
			for ( var k in data) { 
				$("input[name='AE." + k + "']").val(data[k]);
				$("select[name='AE." + k + "']").val(data[k]);
				$("div[name='AE." + k + "']").html(data[k]);
			}
		},call);
	});

}

//校验比例
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

$(document).ready(function(){
	getCurrentPageObj().find("input[name='AD.sup_num']").val("9"+Math.Random19());
});
initVlidate($("#addSignInfoPop_add"));
initVlidate($("#addAttachmentPop_add"));
initVlidate($("#addFinancialInfoPop_add"));
initVlidate($("#addShareholderPop_add"));
initVlidate($("#addLinkmanPop_add"));
initVlidate($("#Asup_basic_info"));

saveShareholderAdd();//增加股东按钮
delShareholderAdd();//删除股东按钮
updateShareholderAdd();//修改股东按钮
saveLinkmaninfoAdd();//增加联系人按钮
delLinkmaninfoAdd();//删除联系人按钮
updateLinkmaninfoAdd();//修改联系人按钮
saveFinancialInfoAdd();//增加财务信息
delFinancialInfoAdd();//删除财务信息
updateFinancialInfoAdd();//修改财务信息
saveSignInfoAdd();//增加签约信息
delSignInfoAdd();//删除签约信息
updateSignInfoAdd();//修改签约信息
saveEnclInfoAdd();//增加资质文件信息
delEnclInfoAdd();//删除资质文件信息
updateEnclInfoAdd();//修改资质文件信息
initSupLinkmanAdd();
