//打开合同Pop框
function openContractInfoPop(id,callparams,param,callback,isNormal){
	var supplier_id=param;
	//先清除
	getCurrentPageObj().find('#myModal_contractInfo').remove();
	//加载模态框页面
	getCurrentPageObj().find("#"+id).load("dev_outsource/contract/contractInfo/contractInfoPop.html",{},function(){
		/*$("#myModal_contractInfo").modal({
			backdrop:"static"
		});*/
		getCurrentPageObj().find("#myModal_contractInfo").modal('show');
		initSelect(getCurrentPageObj().find("select[name='contractInfo_pop_contract_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CONTRACT_TYPE"});
		initSelect(getCurrentPageObj().find("select[name='contractInfo_pop_contract_state']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_CONTRACT_STATE"});
		//查询所有合同
		var url = dev_outsource+"contractInfo/queryListContractInfo.asp?SID="+SID;
		if(supplier_id!=""&&supplier_id!=undefined&&supplier_id!=null){
			url = dev_outsource+"contractInfo/queryListContractInfo.asp?supplier_ids="+supplier_id+"&contract_sort=C_DIC_CONTRACT_SORT_FRAME&SID="+SID;
		}
		if(isNormal!=""&&isNormal!=undefined&&isNormal!=null){
			url = dev_outsource+"contractInfo/queryListContractInfo.asp?contract_sort=C_DIC_CONTRACT_SORT_NORMAL&SID="+SID;
		}
		//初始化合同
		contractInfoPop("#pop_contractInfoTable",url,supplier_id,callparams,callback);
	});
}

/**
 * 谈判及合同POP框
 */
function contractInfoPop(contractInfoTable,contractInfoUrl,supplier_id,contractInfoParam,callback){
	var queryCall = getMillisecond();
	var queryContractInfoParams=function(params){
		
		var temp={
				/*supplier_id : supplier_id,
				contract_sort : "C_DIC_CONTRACT_SORT_NORMAL",*/
				limit: params.limit, //页面大小
				offset: params.offset, //页码
				call: queryCall
		};
		return temp;
	};	

	var columns=[ 
	    {
			field : "CONTRACT_CODE",
			title : "合同编号",
			align : "center",
		}, {
			field : "CONTRACT_TYPE_NAME",
			title : "合同类型",
			align : "center"
		}, {
			field : "CONTRACT_STATE_NAME",
			title : "合同状态",
			align : "center"						
		},  {
			field : "SIGN_TIME",
			title : "签约时间",
			align : "center"
		}, {
			field : "SUPPLIER_NAME",
			title : "供应商",
			align : "center"
		}];
	//查询所有合同数据POP框
	getCurrentPageObj().find(contractInfoTable).bootstrapTable("destroy").bootstrapTable({
				//请求后台的URL（*）
				url : contractInfoUrl,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryContractInfoParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [5],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "talks_id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				columns : columns,
				jsonpCallback:queryCall,
				onDblClickRow:function(row){
					getCurrentPageObj().find('#myModal_contractInfo').modal('hide');
					contractInfoParam.code.val(row.CONTRACT_CODE);
					callback(row.CONTRACT_CODE);
				}
			});
	/*$("#myModal_contractInfo").bind('hide.bs.modal',function(){
		$(".modal-backdrop").remove();
	});*/
	getCurrentPageObj().find("#modalClose").click(function(){
		getCurrentPageObj().find('#myModal_contractInfo').modal('hide');
	});
	//谈判及合同POP重置
	getCurrentPageObj().find("#pop_contractInfoReset").click(function(){
		getCurrentPageObj().find("input[name^='contractInfo_pop_']").val("");
		getCurrentPageObj().find("select[name^='contractInfo_pop_']").val(" ");
		getCurrentPageObj().find("select[name^='contractInfo_pop_']").select2();
	});
	//多条件查询谈判及合同项目
	getCurrentPageObj().find("#pop_contractInfoSearch").click(function(){
		var contract_code = getCurrentPageObj().find("#contractInfo_pop_contract_code").val();
		var contract_type =  $.trim(getCurrentPageObj().find("#contractInfo_pop_contract_type").val());
		var contract_state =  $.trim(getCurrentPageObj().find("#contractInfo_pop_contract_state").val());
		getCurrentPageObj().find(contractInfoTable).bootstrapTable('refresh',{url:contractInfoUrl+"&contract_code="+escape(encodeURIComponent(contract_code))+
			"&contract_type="+contract_type+"&contract_state="+contract_state+"&SID="+SID}
		);
	});
}