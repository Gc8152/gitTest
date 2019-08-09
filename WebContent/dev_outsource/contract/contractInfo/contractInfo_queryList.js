
function aaa(e){
		initSelect(getCurrentPageObj().find("#contract_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});//合同类型（字典项）
		if(e == "C_DIC_CONTRACT_SORT_FRAME"){
			getCurrentPageObj().find("#addCon_phase_add_title").css({"display":"none"});
			getCurrentPageObj().find("#addCon_phase_add_table").css({"display":"none"});
		}else{
			getCurrentPageObj().find("#addCon_phase_add_title").css({"display":"block"});
			getCurrentPageObj().find("#addCon_phase_add_table").css({"display":"block"});
		}
	}
/**
 * 合同类别和合同类型级联
 * */
function changeContractTypeDicQuery(e){
	initSelect(getCurrentPageObj().find("#contract_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:e});//合同类型（字典项）
	if(e == "C_DIC_CONTRACT_SORT_FRAME"){
		getCurrentPageObj().find("#addCon_phase_add_title").css({"display":"none"});
		getCurrentPageObj().find("#addCon_phase_add_table").css({"display":"none"});
	}else{
		getCurrentPageObj().find("#addCon_phase_add_title").css({"display":"block"});
		getCurrentPageObj().find("#addCon_phase_add_table").css({"display":"block"});
	}
}
//合同类型点击前先选择合同类别
function clickConType(value){
	var contract_sort=getCurrentPageObj().find("#contract_sort").val();
	if(contract_sort==undefined||contract_sort==null||contract_sort==""){
		alert("请先选择合同类别！");
	}
}

/**
 * 初始化相关查询
 */
initContractInfoPage();//初始化查询方法
function initContractInfoPage(){
	var calls = getMillisecond();
	initSelect(getCurrentPageObj().find("#contract_sort"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CONTRACT_SORT"});//合同类别（字典项）
	//初始化供应商pop
	var obj = getCurrentPageObj().find("#supplier_name");
	obj.unbind("click");
	obj.click(function(){
		openSupplierPop("query_contract_Pop",{singleSelect:true,parent_company:getCurrentPageObj().find("#supplier_name"),parent_sup_num:getCurrentPageObj().find("input[name='FC.supplier_ids']")});
	});
	//需求一级部门
	var obj=getCurrentPageObj().find("#demand_deptname_one");
	obj.unbind("click");
	obj.click(function(){
		//openSelectTreeDivToBody($(this),"conDemandOne",dev_outsource+"SOrg/queryOrgTreeList.asp?SID="+SID+"&call="+calls,30,function(node){
		openSelectTreeDivToBody($(this),"conDemandOne","SOrg/queryOrgTreeWithCenterList.asp",30,function(node){
			getCurrentPageObj().find("#demand_deptname_one").val(node.name);
			getCurrentPageObj().find("#demand_deptno_one").val(node.id);
		});
	});
	//初始化责任一级部门
	var obj=getCurrentPageObj().find("#responsibility_deptname_one");
	obj.unbind("click");
	obj.click(function(){										  
		openSelectTreeDivToBody($(this),"contractTreedept_id","SOrg/queryOrgTreeWithCenterList.asp",30,function(node){
			getCurrentPageObj().find("#responsibility_deptname_one").val(node.name);
			getCurrentPageObj().find("#responsibility_deptno_one").val(node.id);
		});
	});

	

/**
 * 组装查询url 
 * @returns {String}
 */
function queryContractInfoUrl(){
	var url=dev_outsource+"contractInfo/queryListContractInfo.asp?SID="+SID+"&call="+calls;
	var fds=getCurrentPageObj().find("input[name]");
	for(var i=0;i<fds.length;i++){
		var obj=$(fds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name").substr(3)+"="+escape(encodeURIComponent($.trim(obj.val())));
		}
	}
	var selects=getCurrentPageObj().find("select[name^='FC.']");
	for(var i=0;i<selects.length;i++){
		var obj=$(selects[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name").substr(3)+"="+$.trim(obj.val());
		}
	}
	return url;
}
/**
 * 获取查询参数
 * @returns {___anonymous51_52}
 */
function getContractInfoRecordParams(){
	var param={};
	var inputs = getCurrentPageObj().find("input[name^='FC.']");
	for(var i=0;i<inputs.length;i++){
		var obj=$(inputs[i]);
		if($.trim(obj.val())!=""){
			//FIXME 因不是通过url直接传递的参数，在此转码一次后台解码即可获得中文；
			//若通过url直接编码传参，前端使用escape(encodeURIComponent(obj.val())) 编码两次，后台解码一次即可
			if(inputs[i]=="FC.con_taxmoney_from"||inputs[i]=="FC.con_taxmoney_to"){
				param[obj.attr("name").substr(3)]=obj.val();
			}else{
				param[obj.attr("name").substr(3)]=encodeURIComponent(obj.val());
			}
		}
	}
	var selects=getCurrentPageObj().find("select[name^='FC.']");
	for(var i=0;i<selects.length;i++){
		var obj=$(selects[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name").substr(3)]=obj.val();
		}
	}
	return param;
}
var queryContractInfoParams=function(params){
	var temp=getContractInfoRecordParams();
	 temp["limit"]=params.limit;
	 temp["offset"]=params.offset;
	return temp;
};

initContractInfoList();//初始化显示列表信息（bootstrapTable）
//查询列表显示table
function initContractInfoList() {
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	getCurrentPageObj().find("#contractInfoTable").bootstrapTable(
			{
				//请求后台的URL（*）
				url : dev_outsource+"contractInfo/queryListContractInfo.asp?SID="+SID+"&call="+calls,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5,10,20],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "contract_code", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:calls,
				singleSelect : true,// 复选框单选
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'abcdef',
					title : '序号',
					align : "center",
					width:80,
					formatter: function (value, row, index) {
	        			  return index+1;
		        	}
				},{
					field : 'CONTRACT_CODE',
					title : '合同主键',
					align : 'center',
					visible:false
				},{
					field : 'CONTRACT_CODE',
					title : '合同编号',
					align : "center"
				},{
					field : 'CONTRACT_NAME',
					title : '合同名称',
					align : "center"
				},{
					field : "CONTRACT_TYPE_NAME",
					title : "合同类型",
					align : "center"
				},{
					field : 'CONTRACT_STATE_NAME',
					title : '合同状态',
					align : 'center'
				}, {
					field : "SIGN_TIME",
					title : "签约时间",
					align : "center"
				}, {
					field : "SUPPLIER_NAME",
					title : "供应商",
					align : "center"
				}, {
					field : "SUPPLIER_IDS",
					title : "供应商",
					align : "center",
					visible:false
				}, {
					field : "RESPONSIBILITY_DEPTNAME_ONE",
					title : "责任一级部门",
					align : "center"
				}, {
					field : "DEMAND_DEPTNAME_ONE",
					title : "需求一级部门",
					align : "center"
				} ]
			});
};
/**
 * 初始化页面查询事件
 */
initContractInfoList1();
function initContractInfoList1(){
		//重置查询条件
		getCurrentPageObj().find("#resetContractInfo").unbind("click");
		getCurrentPageObj().find("#resetContractInfo").click(function(){
			getCurrentPageObj().find("input[name^='FC.']").val("");
			getCurrentPageObj().find("#contractInfoListForm select").val("").select2();
		});
		//查询列表页
		getCurrentPageObj().find("#queryContractInfo").click(function(){
			getCurrentPageObj().find("#contractInfoTable").bootstrapTable('refresh',{url:queryContractInfoUrl()});
		});
		//enter触发查询
		enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryContractInfo").click();});
		//新增合同基本信息
		getCurrentPageObj().find("#contractInfo_add").unbind("click");
		getCurrentPageObj().find("#contractInfo_add").click(function(){
			closeAndOpenInnerPageTab("contractInfo_add","合同基本信息新增","dev_outsource/contract/contractInfo/contractInfo_add.html",function(){});
		});
		//确认生成
		getCurrentPageObj().find("#contractInfo_submit").unbind("click");
		getCurrentPageObj().find("#contractInfo_submit").click(function(){
			var id = getCurrentPageObj().find("#contractInfoTable").bootstrapTable('getSelections');
			if(id.length!=1){
				alert("请选择一条合同信息!");
				return ;
			}
			var state = $.map(id, function (row) {
				return row.CONTRACT_STATE;                    
			});
			if(state != "0001"){
				alert("该合同已确认生成!");
				return ;
			}
			nconfirm("确定要生成该合同吗？",function(){
				var url=dev_outsource+"contractInfo/startContractInfo.asp?contract_code="+id[0]["CONTRACT_CODE"]+"&SID="+SID+"&call="+calls;
				baseAjaxJsonp(url, null, function(data) {
					if(data != undefined&&data!=null&&data.result=="true"){
						alert("确认生成成功！");
						//删除后刷新列表
						getCurrentPageObj().find("#contractInfoTable").bootstrapTable('refresh');
					}else{
						alert("确认生成失败！");
					};
				},calls);
			});
		});
		//查看合同基本信息
		getCurrentPageObj().find("#contractInfo_detail").click(function(){
			var id = getCurrentPageObj().find("#contractInfoTable").bootstrapTable('getSelections');
			if(id.length!=1){
				alert("请选择一条数据进行查看!");
				return ;
			}
			var ids = $.map(id, function (row) {
				return row.CONTRACT_CODE;                    
			});
			closeAndOpenInnerPageTab("contractInfo_queryInfo","合同基本信息查看","dev_outsource/contract/contractInfo/contractInfo_queryInfo.html",function(){
				initContractInfoDetail(ids);
			});
		});
		//修改选中的合同基本信息
		getCurrentPageObj().find("#contractInfo_update").unbind("click");
		getCurrentPageObj().find("#contractInfo_update").click(function(){
			var id = getCurrentPageObj().find("#contractInfoTable").bootstrapTable('getSelections');
			if(id.length!=1){
				alert("请选择一条合同信息!");
				return ;
			}
			var state = $.map(id, function (row) {
				return row.CONTRACT_STATE;                    
			});
			if(state != "0001"){
				alert("执行中合同不能修改");
				return ;
			}
			var ids = $.map(id, function (row) {
				return row.CONTRACT_CODE;                    
			});
			closeAndOpenInnerPageTab("contractInfo_update","合同基本信息修改","dev_outsource/contract/contractInfo/contractInfo_update.html",function(){
				initContractInfo_update(ids);
			});
		});
		//删除合同信息
		getCurrentPageObj().find("#contractInfo_del").unbind("click");
		getCurrentPageObj().find("#contractInfo_del").click(function(){
			var id = getCurrentPageObj().find("#contractInfoTable").bootstrapTable('getSelections');
			var ids = $.map(id, function (row) {
				return row.CONTRACT_CODE;                  
			});
			if(id.length!=1){
				alert("请选择一条合同信息!");
				return ;
			}
			if(id[0]["CONTRACT_STATE"] != "0001"){
				alert("仅能删除未确认生成的合同!");
				return ;
			}
			nconfirm("确定要删除该合同信息吗？",function(){
				var url=dev_outsource+"contractInfo/deleteContractInfo.asp?contract_code="+ids+"&SID="+SID+"&call="+calls;
				baseAjaxJsonp(url,null,function(data){
				/*baseAjaxJsonp({
					type : "post",
					url : url,
					async :  true,
					data : "",
					dataType : "json",
					success : function(data) {*/
						if(data != undefined&&data!=null&&data.result=="true"){
							alert("删除成功！");
							//删除后刷新列表
							getCurrentPageObj().find("#contractInfoTable").bootstrapTable('refresh');
						}else{
							alert("删除失败！");
						}
					/*},
					error : function() {	
						alert("删除失败！");
					}*/
				},calls);
			});
		});
		//合同信息导入
		getCurrentPageObj().find("#contractInfo_imp").unbind("click");
		getCurrentPageObj().find("#contractInfo_imp").click(function(){
			$("#contractInfo_import").modal("show");
		});
		
		getCurrentPageObj().find("#importContract").unbind("click");
		getCurrentPageObj().find("#importContract").click(function(){
			startLoading();
		    $.ajaxFileUpload({
			    url:dev_outsource+"contractInfo/importCon.asp?SID="+SID+"&call="+calls,
			    type:"post",
				secureuri:false,
				fileElementId:'contractFile',
				data:'',
				dataType: 'json',
				success:function (msg){
					endLoading();
					getCurrentPageObj().find("#contractFile").val("");
					getCurrentPageObj().find("#contractfield").val("");
					$("#contractInfo_import").modal("hide");
					if(msg&&msg.result=="true"){
						alert("导入成功");
						getCurrentPageObj().find("#contractInfoTable").bootstrapTable("refresh");
					}else if(msg&&msg.error_info){
						alert("导入失败:"+msg.error_info);
					}else{
						alert("导入失败！");
					}
				},
				error: function (msg){
					endLoading();
					alert("导入失败！");
				}
		   });
		});
	}
}