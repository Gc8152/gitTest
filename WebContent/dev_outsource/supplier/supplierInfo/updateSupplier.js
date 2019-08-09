//修改供应商信息
function initUpdateSupplierInfoEvent(){
	//保存按钮
	$("#save_updateSupplier").click(function(){
		if(!vlidate(getCurrentPageObj().find("#suppUpdateInfo"))){		
			return ;
		}
		var inputs = getCurrentPageObj().find("input[name^='UB.']");
		var selects = getCurrentPageObj().find("select[name^='UB.']");
		var textareas = getCurrentPageObj().find("textarea[name^='UB.']");
		var params = {};	
		//取值
		//输入框
		for(var i=0;i<inputs.length;i++){
			params[getCurrentPageObj().find(inputs[i]).attr("name").substr(3)] = getCurrentPageObj().find(inputs[i]).val();	 
		}
		//下拉选
		for(var j=0;j<selects.length;j++){
			params[getCurrentPageObj().find(selects[j]).attr("name").substr(3)] = getCurrentPageObj().find(selects[j]).val(); 
		}	
		//文本域
		for(var k=0;k<textareas.length;k++){
			params[getCurrentPageObj().find(textareas[k]).attr("name").substr(3)] = getCurrentPageObj().find(textareas[k]).val(); 
		}
		//科技管理多选
		var supSortOneArr=getCurrentPageObj().find("#Usup_sort_one").select2("data");
//		var nature_business=getCurrentPageObj().find("#Unature_business");
//		params["nature_business"]=nature_business;
		var supSortOneStr="";
		if(supSortOneArr!=null&&supSortOneArr!=""){
			for(var i=0;i<supSortOneArr.length;i++){
				supSortOneStr+=supSortOneArr[i]["id"]+",";
			}
		}
		params["sup_sort_one"]=supSortOneStr.substring(0, supSortOneStr.length-1);
		var call=getMillisecond();
		//保存并发送数据
		baseAjaxJsonp(dev_outsource+"SupplierInfo/updateSupplier.asp?SID="+SID+"&call="+call,params, function(data) {
        	if (data != undefined&&data!=null&&data.result=="true") {
        		alert("保存成功",function(){
        			getCurrentPageObj().find("#detailTable").bootstrapTable('refresh');
            		closeCurrPageTab();
        		});
			}else if(data != undefined&&data!=null&&data.result=="0"){
				alert("供应商缺少常用联系人");
			}else{
				alert("保存失败");
			}
		},call);
	});
	//联系人保存方法
	getCurrentPageObj().find("#saveLinkman_update").click(function(){
		if(!vlidate($("#lmTable"))){		
			return;
		}
		var inputs = $("input[type!='radio'][name^='UL.']");
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		params["is_liasions"]=getCurrentPageObj().find("input[type='radio'][name='AUL.is_liasions']:checked").val();
		params["linkman_type"] = getCurrentPageObj().find("#Ulinkman_type").val();
		params["sup_num"] = $("#Usup_num").val();
		params["linkman_num"] = $("#Ulinkman_num").html();
		var sup_num= $("#Usup_num").val();
		var linkman_num = params["linkman_num"];
		var call=getMillisecond();
		//如果联系人编号为不为空 ,则为修改
		var url="SupplierInfo/addSupplierLinkman.asp?SID="+SID+"&call="+call;
		if(linkman_num!=undefined&&linkman_num!=null&&linkman_num!= ""){
			url="SupplierInfo/updateLinkman.asp?SID="+SID+"&call="+call;
		}
		baseAjaxJsonp(dev_outsource+url,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("保存成功",function(){
					$("#addLinkmanPop_up").modal("hide");
					$('#supLinkmanTableUpdate').bootstrapTable('refresh',{url:dev_outsource+'SupplierInfo/queryLinkmanByNum.asp?call=jq1519975825464&sup_num=' + sup_num+"&SID="+SID});
				});
			}else if (data != undefined&&data!=null&&data.result=="repeat"){
				alert("供应商只能有一个常用联系人！");
			}else{
				alert("保存失败");
			}
		},call);
	});
	
	//资质文件保存
	$("#saveEnclInfo_update").click(function(){
		if(!vlidate($("#amTable"))){		
			return;
		}
		var inputs = $("input[name^='UE.']");
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		params["encl_type"] = getCurrentPageObj().find("#Uencl_type").val();
		params["sup_num"] = getCurrentPageObj().find("#Usup_num").val();
		params["encl_num"] = $("#Uencl_num").html();
		var sup_num= $("#Usup_num").val();
		//如果资质文件编号为不为空 ,则为修改
		var url="SupplierInfo/addSupplierEncl.asp?SID="+SID;
		if(params["encl_num"] != ""){
			url="SupplierInfo/updateEnclInfo.asp?SID="+SID;
		 }
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+url+"&call="+call,params, function(data) {
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("保存成功",function(){
						$("#addAttachmentPop_up	").modal("hide");
						$('#enclosureInfoTableUpdate').bootstrapTable('refresh',{url:dev_outsource+'SupplierInfo/queryEnclByNum.asp?call=jq1519975825468&sup_num=' + sup_num+"&SID="+SID});
					});
				}else{
					alert("保存失败");
				}
			},call);
	});
	//与主要客户签约情况保存
	$("#saveSignInfo_update").click(function(){
		if(!vlidate($("#sgTable"))){		
			return;
		}
		var inputs = $("input[name^='US.']");
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		params["sup_num"] = $("#Usup_num").val();
		params["product"] = $("textarea[name='US.product']").val();
		params["sign_type"] = $("#Usign_type").val();
		params["sign_num"] = $("#Usign_num").html();
		//联系人编号 为空，则新增
		var url="SupplierInfo/updateSignInfo.asp";
		if(params["sign_num"] == ""){
			url="SupplierInfo/addSupplierSignInfo.asp";
		}
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+url+"?call="+call+"&SID="+SID,params, function(data) {
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("保存成功",function(){
						$("#addSignInfoPop_up").modal("hide");
						$('#signInfoTableUpdate').bootstrapTable('refresh', {url:dev_outsource+'SupplierInfo/querySignInfoByNum.asp?call=jq1519975825466&sup_num=' + params["sup_num"]+"&SID="+SID});
					});
				}else{
					alert("保存失败");
					$("#addSignInfoPop_up").modal("hide");
				}
			},call);
	});
	//财务信息保存
	$("#saveFinancialInfo_update").click(function(){
		if(!vlidate($("#fiTable"))){		
			return;
		}
		var inputs = $("input[name^='UF.']");
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		sup_num = $("#Usup_num").val();
		params["sup_num"] = sup_num;
		params["financial_num"] = $("#Ufinancial_num").html();
		//如果编号为空，则为新增
		var url="SupplierInfo/updateFinancialInfo.asp";
		if(params["financial_num"] == ""){
			url="SupplierInfo/addFinancialInfo.asp";
		}
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+url+"?call="+call+"&SID="+SID,params, function(data) {
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("保存成功",function(){
						$("#addFinancialInfoPop_up").modal("hide");
						$('#financialInfoTableUpdate').bootstrapTable('refresh',{url:dev_outsource+'SupplierInfo/queryFinancialInfoByNum.asp?call=jq1519975825465&sup_num=' + sup_num+"&SID="+SID});
					});
				}else{
					alert("保存失败");
				}
			},call);		
	});
	//股权结构保存
	$("#saveShareholder_update").click(function(){
		if(!vlidate($("#shTable"))){		
			return ;
		}
		var inputs = $("input[name^='HU.']");
		//取值
		var params = {};
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(3)] = $(inputs[i]).val(); 
		}
		sup_num = $("#Usup_num").val();
		params["sup_num"] = sup_num;
		params["shareholder_num"] = $("#Ushareholder_num").html();
		var allData=$("#ownershipStructureTableUpdate").bootstrapTable("getData");
		var dlength=allData.length;
		var sumRatio=0;//持股比例
		if(dlength>0){
			for(var i=0;i<dlength-1;i++){
				var a=parseFloat(allData[i]["SHAREHOLDING_RATIO"]);
				sumRatio+=a;
			}
		}
		var selData = $("#ownershipStructureTableUpdate").bootstrapTable('getSelections');
		var selDatas = $.map(selData, function (row) {
			return row.SHAREHOLDING_RATIO;                    
		});
		//如果股东编号为空，则为新增
		sumRatio-=selDatas;
		var Ratio=params["shareholding_ratio"];
		sumRatio+=parseFloat(Ratio);
		var num=100.00;
		if(sumRatio>num){
			alert("持股比例不能超过100%");
		}else{
			var url="SupplierInfo/updateShareHolder.asp";
			if($("#Ushareholder_num").html()==""){
				url="SupplierInfo/addShareHolder.asp";
			}
			var call=getMillisecond();
			baseAjaxJsonp(dev_outsource+url+"?call="+call+"&SID="+SID,params, function(data) {
					if (data != undefined&&data!=null&&data.result=="true") {
						//$("#select").click();
						alert("保存成功",function(){
							$("#addShareholderPop_up").modal("hide");
							$('#ownershipStructureTableUpdate').bootstrapTable('refresh',{url:dev_outsource+'SupplierInfo/queryOwnershipByNum.asp?call=jq1519975825467&sup_num=' + sup_num+"&SID="+SID+"&_="+call});
						});
					}else{
						alert("保存失败");
					}
				},call);
		}
	});
	
}

//初始化股东信息
function initOwnershipInfoUpdate(){
	//重置按钮
	$("#resetShareholder_update").click(function(){
		$("input[name^='HU.']").val("");
	});
	var sup_num = $("#Usup_num").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#ownershipStructureTableUpdate").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+'SupplierInfo/queryOwnershipByNum.asp?call=jq1519975825467&sup_num='+sup_num+"&SID="+SID,
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
				jsonpCallback:"jq1519975825467",
				onLoadSuccess:function(data){
					var allData=$("#ownershipStructureTableUpdate").bootstrapTable("getData");
					var dlength=allData.length;
					if(dlength>0){
						var sumAmount=0;
						var sumRatio=0;
						for(var i=0;i<dlength;i++){
							sumAmount+=parseFloat(allData[i]["AMOUNT"]);
							sumRatio+=parseFloat(allData[i]["SHAREHOLDING_RATIO"]);
						}
						var sumRow={};
						sumRow.R="";
						sumRow.SHAREHOLDER_NUM="";
						sumRow.SHAREHOLDER_NAME="合计";
						sumRow.AMOUNT=sumAmount;
						sumRow.SHAREHOLDING_RATIO=sumRatio.toFixed(2);
						$("#ownershipStructureTableUpdate").bootstrapTable("append",sumRow);
						$("#ownershipStructureTableUpdate").bootstrapTable("mergeCells",{
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
					field : 'Number',
					title : '序号',
					align : "center",
					formatter: function (value, row, index) {
						return index+1;
					}
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
function saveShareholderUpdate(){
	//显示增加股东信息模态框
	$("#addShareholder_update").click(function(){
		$("#addShareholderPop_up").modal("show");
		$("#resetShareholder_update").click();
		$("div[name^='HU.']").html("");
	});
}
//删除供应商股东
function delShareholderUpdate(){
	$("#deleteShareholder_update").click(function(){
		var num = $("#ownershipStructureTableUpdate").bootstrapTable('getSelections');
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
					$("#ownershipStructureTableUpdate").bootstrapTable('remove', {
						field: 'SHAREHOLDER_NUM',
						values: nums
					});	
					$('#ownershipStructureTableUpdate').bootstrapTable('refresh',{url:dev_outsource+'SupplierInfo/queryOwnershipByNum.asp?call=jq1519975825467&sup_num=' + sup_num+"&SID="+SID+"&_="+call});
				});
				}else{
					alert("删除失败！");
				}
			},call);
		});
	});
}
//修改供应商股东
function updateShareholderUpdate(){
	$("#updateShareholder_update").click(function(){
		var num = $("#ownershipStructureTableUpdate").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.SHAREHOLDER_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		$("#addShareholderPop_up").modal("show");
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+"SupplierInfo/queryOneShareholder.asp?shareholder_num="+nums+"&call="+call+"&SID="+SID, null , function(data) {
			//初始化基本信息
			for ( var k in data) { 
				if(k=="amount"){
					continue;
				}
				$("input[name='HU." + k + "']").val(data[k]);
				$("input[name='HU.amount']").val(Number(data["amount"]).toFixed(2));
				$("div[name='HU." + k + "']").html(data[k]);
			}
		},call);
	});
}

//初始化供应商联系人信息
function initSupLinkmanUpdate(){
	//重置按钮
	$("#reset_supLinkman_update").click(function(){
		$("input[name^='UL.']").val("");
		initSelect($("#Ulinkman_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_LINKMAN_TYPE"});
	});
	var sup_num = $("#Usup_num").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#supLinkmanTableUpdate").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+'SupplierInfo/queryLinkmanByNum.asp?call=jq1519975825464&sup_num='+sup_num+"&SID="+SID,
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
				jsonpCallback:"jq1519975825464",
				singleSelect: true,
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
function saveLinkmaninfoUpdate(){
	//显示联系人模态框
	getCurrentPageObj().find("#addLinkMan_update").click(function(){
		getCurrentPageObj().find("#addLinkmanPop_up").modal("show");
		getCurrentPageObj().find("#reset_supLinkman_update").click();
		$("div[name^='UL.']").html("");
	});
}
//修改供应商联系人
function updateLinkmaninfoUpdate(){
	getCurrentPageObj().find("#updateLinkman_update").click(function(){
		var num = $("#supLinkmanTableUpdate").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.LINKMAN_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		getCurrentPageObj().find("#addLinkmanPop_up").modal("show");
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+"SupplierInfo/queryOneLinkman.asp?linkman_num="+nums+"&call="+call+"&SID="+SID, null , function(data) {
			//初始化基本信息
			initSelect($("#Ulinkman_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_LINKMAN_TYPE"},data.linkman_type);
			for ( var k in data) {
				if("is_liasions"==k){
					continue;
				}
				$("input[name='UL." + k + "']").val(data[k]);
				$("select[name='UL." + k + "']").val(data[k]);
				$("textarea[name='UL." + k + "']").val(data[k]);
				$("div[name='UL." + k + "']").html(data[k]);
				//单选框赋值
				getCurrentPageObj().find("input[name='AUL.is_liasions'][value='"+data["is_liasions"]+"']").click();
			}
		},call);
	});
}
//删除供应商联系人
function delLinkmaninfoUpdate(){
	$("#deleteLinkman_update").click(function(){
		var num = $("#supLinkmanTableUpdate").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.LINKMAN_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			var url="SupplierInfo/deleteLinkmanInfoByNum.asp?linkman_num="+nums;
			var call=getMillisecond();
			baseAjaxJsonp(dev_outsource+url,{call:call,SID:SID},function(msg){
				if(msg){
					alert("删除成功！",function(){
						$("#supLinkmanTableUpdate").bootstrapTable('remove', {
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
//初始化财务信息
function initFinancialInfoUpdate(){
	//重置按钮
	$("#resetFinancialInfo_update").click(function(){
		$("input[name^='UF.']").val("");
	});
	var sup_num = $("#Usup_num").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#financialInfoTableUpdate").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+'SupplierInfo/queryFinancialInfoByNum.asp?call=jq1519975825465&sup_num='+sup_num+"&SID="+SID,
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
				jsonpCallback:"jq1519975825465",
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
					title : '总资产(元)',
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
					title : '净资产(元)',
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
					title : '销售额(元)',
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
					title : '净利润(元)',
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
					title : "经营活动现金流量净额(元)",
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
					title : "期末现金及现金等价物余额(元)",
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
function saveFinancialInfoUpdate(){
	//显示增加财务信息模态框
	$("#addFinancialInfo_update").click(function(){
		$("#addFinancialInfoPop_up").modal("show"); 	
		$("#resetFinancialInfo_update").click();
		$("div[name^='UF.']").html("");
	});
}
//删除财务信息
function delFinancialInfoUpdate(){
	$("#deleteFinancialInfo_update").click(function(){
		var num = $("#financialInfoTableUpdate").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.FINANCIAL_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			var url=dev_outsource+"SupplierInfo/deleteFinancialInfo.asp?financial_num="+nums;
			var call=getMillisecond();
			baseAjaxJsonp(url,{call:call,SID:SID},function(msg){
				if(msg){
					alert("删除成功！",function(){
						$("#financialInfoTableUpdate").bootstrapTable('remove', {
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
function updateFinancialInfoUpdate(){
	$("#updateFinancialInfo_update").click(function(){
		var num = $("#financialInfoTableUpdate").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.FINANCIAL_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		$("#addFinancialInfoPop_up").modal("show");
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+"SupplierInfo/queryOneFinancialInfo.asp?financial_num="+nums+"&SID="+SID+"&call="+call, null , function(data) {
			//初始化基本信息
			for ( var k in data) { 
				if(k=="total_assets" || k=="net_assets" || k=="sales_amount" || k=="net_profits" || k=="net_cash_flows" || k=="cash_equivalents"){
					continue;
				}
				$("input[name='UF." + k + "']").val(data[k]);
				$("input[name='UF.total_assets']").val(data["total_assets"]/**.toFixed(2)**/);
				$("input[name='UF.net_assets']").val(data["net_assets"]/**.toFixed(2)**/);
				$("input[name='UF.sales_amount']").val(data["sales_amount"]/**.toFixed(2)**/);
				$("input[name='UF.net_profits']").val(data["net_profits"]/**.toFixed(2)**/);
				$("input[name='UF.net_cash_flows']").val(data["net_cash_flows"]/**.toFixed(2)**/);
				$("input[name='UF.cash_equivalents']").val(data["cash_equivalents"]/**.toFixed(2)**/);
				$("div[name='UF." + k + "']").html(data[k]);
			}
		},call);
	});
}

//初始化签约情况
function initSignInfoUpdate(){
	//重置按钮
	$("#reset_signInfo_update").click(function(){
		$("input[name^='US.']").val("");
		$("textarea[name='US.product']").val("");
		initSelect($("#Usign_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_SIGN_TYPE"});
	});
	var sup_num = $("#Usup_num").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#signInfoTableUpdate").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+'SupplierInfo/querySignInfoByNum.asp?call=jq1519975825466&sup_num='+sup_num+"&SID="+SID,
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
				jsonpCallback:"jq1519975825466",
				singleSelect: true,
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
function saveSignInfoUpdate(){
	initSelect($("#Usign_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_SIGN_TYPE"});
	//显示联系人模态框
	$("#addSignInfo_update").click(function(){
		$("#addSignInfoPop_up").modal("show");
		$("#reset_signInfo_update").click();
		$("div[name^='US.']").html("");
		
	});
}
//删除签约信息
function delSignInfoUpdate(){
	$("#deleteSignInfo_update").click(function(){
		var num = $("#signInfoTableUpdate").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.SIGN_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			var url=dev_outsource+"SupplierInfo/deleteSignInfoByNum.asp?sign_num="+nums;
			var call=getMillisecond();
			baseAjaxJsonp(url,{SID:SID,call:call},function(msg){
				if(msg){
					alert("删除成功！",function(){
					$("#signInfoTableUpdate").bootstrapTable('remove', {
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
function updateSignInfoUpdate(){
	$("#updateSignInfo_update").click(function(){
		var num = $("#signInfoTableUpdate").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.SIGN_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		$("#addSignInfoPop_up").modal("show");
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+"SupplierInfo/queryOneSignInfo.asp?sign_num="+nums+"&call="+call+"&SID="+SID, null , function(data) {
			//初始化基本信息
			initSelect($("#Usign_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_SIGN_TYPE"},data.sign_type);
			for ( var k in data) { 
				$("input[name='US." + k + "']").val(data[k]);
				$("textarea[name='US." + k + "']").val(data[k]);
				$("select[name='US." + k + "']").val(data[k]);
				$("div[name='US." + k + "']").html(data[k]);
			}
		},call);
	});
}

//初始化供应商的资质文件
function initEnclInfoUpdate(){
	//重置按钮
	$("#resetEnclInfo_update").click(function(){
		$("input[name^='UE.']").val("");
		initSelect($("#Uencl_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_ENCL_TYPE"});
	});
	var sup_num = $("#Usup_num").val();
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#enclosureInfoTableUpdate").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+'SupplierInfo/queryEnclByNum.asp?call=jq1519975825468&sup_num='+sup_num+"&SID="+SID,
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
				jsonpCallback:"jq1519975825468",
				singleSelect: true,
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
//增加资质文件
function saveEnclInfoUpdate(){
	initSelect($("#Uencl_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_ENCL_TYPE"});
	//显示模态框
	$("#addEnclInfo_update").click(function(){
		$("#addAttachmentPop_up").modal("show");
		$("#resetEnclInfo_update").click();
		$("div[name^='UE.']").html("");
	});
}
//删除资质文件
function delEnclInfoUpdate(){
	$("#deleteEnclInfo_update").click(function(){
		var num = $("#enclosureInfoTableUpdate").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.ENCL_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		nconfirm("确定要删除该数据吗？",function(){
			var url=dev_outsource+"SupplierInfo/deleteEnclInfoByNum.asp?encl_num="+nums;
			var call=getMillisecond();
			baseAjaxJsonp(url,{SID:SID,call:call},function(msg){
				if(msg.result=="true"){
					alert("删除成功！",function(){
						$("#enclosureInfoTableUpdate").bootstrapTable('remove', {
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
//修改资质文件
function updateEnclInfoUpdate(){
	$("#updateEnclInfo_update").click(function(){
		var num = $("#enclosureInfoTableUpdate").bootstrapTable('getSelections');
		var nums = $.map(num, function (row) {
			return row.ENCL_NUM;                    
		});
		if(num.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		$("#addAttachmentPop_up	").modal("show");
		var call=getMillisecond();
		baseAjaxJsonp(dev_outsource+"SupplierInfo/queryOneEnclInfo.asp?encl_num="+nums+"&SID="+SID+"&call="+call, null , function(data) {
			//初始化基本信息
			initSelect($("#Uencl_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_ENCL_TYPE"},data.encl_type);
			//$("#Uupload_emp").val(data.upload_emp);
			for ( var k in data) { 
				$("input[name='UE." + k + "']").val(data[k]);
				$("select[name='UE." + k + "']").val(data[k]);
				$("div[name='UE." + k + "']").html(data[k]);
			}
		},call);
	});

}
//是否上市校验
function ChangeListed(value){
	var value=getCurrentPageObj().find("#Uis_listed").val();
	//上市（01：是  02：否）
	if(value=="02"){
		getCurrentPageObj().find("#UB_listed_addr").removeAttr("validate");
		getCurrentPageObj().find("#UB_stock_code").removeAttr("validate");
	
	}else if(value=="01"){
		//上市地，股票代码必填
		getCurrentPageObj().find("#UB_listed_addr").attr("validate","v.required");
		getCurrentPageObj().find("#UB_stock_code").attr("validate","v.required");
	}
}

//初始化下拉框方法
function initUpdateSupplierSelect(groupCompany,ordinaryVatPayr,isPayer,sup_level,sup_sort_one,is_listed,nature_business){
	
	initSelect($("#Ugroup_company"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_GROUP_COMPANY"},groupCompany);
	initSelect($("#Uordinary_vat_payr"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_ORDINARY_VAT_PAYR"},ordinaryVatPayr);
	initSelect($("#Uis_payer"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_DIC_IS_PAYER"},isPayer);
	initSelect($("#Usup_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_SUP_LEVEL"},sup_level);
	//企业性质
	initSelect($("#Unature_business"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"sup_nature_business"},nature_business);
	//科技管理分类
	initSelectByMore($("#Usup_sort_one"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SUP_TECHNOLOGIC_MANAGE"},sup_sort_one);
	//是否上市
	initSelect($("#Uis_listed"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_DEVICEBACK"},is_listed);
	//所属区域下拉树
	getCurrentPageObj().find("#Uaddress").click(
			function() {
				openSelectTreeDivToBody($(this), "dic_addtree_sup_id",
						"SupplierInfo/queryAlladdress.asp",30, function(node) {
							$("#Uaddress").val(node.name);
							$("#addcodes").val(node.id);
						});
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

initVlidate($("#addSignInfoPop_up"));
initVlidate($("#addAttachmentPop_up"));
initVlidate($("#addFinancialInfoPop_up"));
initVlidate($("#addShareholderPop_up"));
initVlidate($("#addLinkmanPop_up"));
initVlidate($("#Usup_basic_info"));

saveShareholderUpdate();//增加股东按钮
delShareholderUpdate();//删除股东按钮
updateShareholderUpdate();//修改股东按钮
saveLinkmaninfoUpdate();//增加联系人按钮
delLinkmaninfoUpdate();//删除联系人按钮
updateLinkmaninfoUpdate();//修改联系人按钮
saveFinancialInfoUpdate();//增加财务信息
delFinancialInfoUpdate();//删除财务信息
updateFinancialInfoUpdate();//修改财务信息
saveSignInfoUpdate();//增加签约信息
delSignInfoUpdate();//删除签约信息
updateSignInfoUpdate();//修改签约信息
saveEnclInfoUpdate();//增加资质文件信息
delEnclInfoUpdate();//删除资质文件信息
updateEnclInfoUpdate();//修改资质文件信息

