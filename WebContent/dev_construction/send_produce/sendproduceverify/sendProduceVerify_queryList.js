;initSendProduceVerifyListLayout();
function initSendProduceVerifyListLayout(){
	/**
	 * 定义常用页签内变量
	 */
	var sendProduceVerify_queryList_call = getMillisecond();
	var currTab = getCurrentPageObj();
	
	/**
	 * 字典初始化方法
	 */
	//initSelect(getCurrentPageObj().find("#VERIFY_RESULT"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_CHANGE_TYPE"});
	//initSelect(getCurrentPageObj().find("#IS_COMMIT"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_DATA_ROOT_STATUS"});
	initSelectByData(getCurrentPageObj().find("#VERIFY_RESULT"),{value:"ITEM_CODE",text:"ITEM_NAME"},
			[{"ITEM_CODE":"00", "ITEM_NAME":"通过"},{"ITEM_CODE":"01", "ITEM_NAME":"不通过"}]);
	initSelectByData(getCurrentPageObj().find("#IS_COMMIT"),{value:"ITEM_CODE",text:"ITEM_NAME"},
			[{"ITEM_CODE":"00", "ITEM_NAME":"已提交"},{"ITEM_CODE":"01", "ITEM_NAME":"未提交"}]);
	/**
	 * 获取查询参数
	 * @returns 
	 */
	function getSendProduceQueryParam(){
		var param={};
		var queryCondition = currTab.find("#queryCondition [name]");
		for(var i=0;i<queryCondition.length;i++){
			var obj=$(queryCondition[i]);
			if($.trim(obj.val())!=""){
				param[obj.attr("name")]=obj.val();
			}
		}
		return param;
	}
	/**
	 * 组装查询url 
	 * @returns {String}
	 */
	function uatSendProduceUrl(){
		var url = dev_construction+'sendProduceConfirm/queryAllSendProInfo.asp?call='+sendProduceVerify_queryList_call+'&SID='+SID;
		return url;
	}

	//初始化列表
	var queryParams=function(params){
		var temp = getSendProduceQueryParam();
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	currTab.find("#produceVerifyTable").bootstrapTable({
		url : dev_construction+'sendProduceVerify/queryAllVerifyItem.asp?call='+sendProduceVerify_queryList_call+'&SID='+SID,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : true, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "sub_req_id", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback: sendProduceVerify_queryList_call,
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
			field : 'SUB_REQ_CODE',
			title : '需求点编号',
			align : 'center',
			width :"160"
		},{
			field : 'SUB_REQ_NAME',
			title : '需求点名称',
			align : 'center',
			width :"200"
		},{
			field : 'SYSTEM_NAME',
			title : '应用名称',
			align : "center",
			width :"130"
		},{
			field : 'VERSIONS_NAME',
			title : '版本名称',
			align : "center",
			width :"130"
		},{
			field : 'VERIFY_RESULT',
			title : '验证结论',
			align : "center",
			width :"80",
			formatter : function(value){
				if(value==undefined){
					return "未提交"; 
				} else {
					return value=="00"? "通过" : "不通过";
				}
			}
		},{
			field : "REQ_BUSINESSER",
			title : "需求提出人",
			align : "center",
			width :"80"
		}, {
			field : "IS_EMERGENCY_REQ",
			title : "是否紧急需求",
			align : "center",
			width :"120",
			formatter : function(value){
				return value=="00"?"是":"否";
			}
		}, {
			field : "CURRENT_DISPOSE_MAN",
			title : "当前处理人",
			align : "center",
			width :"100"
		}, {
			field : "IS_COMMIT",
			title : "是否提交",
			align : "center",
			width : "120",
			formatter : function(value){
				if(value==undefined){
					return "未验证"; 
				} else {
					return value=="00"? "已提交" : "待提交";
				}
			}
		}]
	});

	//初始化页面按钮事件
	//重置按钮
	currTab.find("#reset").click(function(){
		currTab.find("#queryCondition input").val("");
		var selects = currTab.find("#queryCondition select");
		selects.val(" ");
		selects.select2();
	});
	
	//查询按钮事件
	currTab.find("#query").unbind("click");
	currTab.find("#query").click(function(){
		currTab.find("#produceVerifyTable").bootstrapTable("refresh");
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query").click();});
	//投产确认 
	getCurrentPageObj().find("#produce_verify").click(function(){
		var selections = getCurrentPageObj().find("#produceVerifyTable").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var item = selections[0];
		var is_commit = item["IS_COMMIT"];
		if(is_commit == "00") {
			alert("该需求点已提交验证结果！");
			return;
		}
		closeAndOpenInnerPageTab("sendProduceVerify_update","业务验证页面","dev_construction/send_produce/sendproduceverify/sendProduceVerify_update.html",function(){
			initSendProduceVerifyEditLayout(item);
		});
	});
	
	//查看详情
	currTab.find("#verify_detail").click(function(){
		var selections = getCurrentPageObj().find("#produceVerifyTable").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var item = selections[0];
		closeAndOpenInnerPageTab("sendProduceVerify_update","业务验证详情页面","dev_construction/send_produce/sendproduceverify/sendProduceVerify_detail.html",function(){
			initSendProduceVerifyDetailLayout(item);
		});
	});
	
}	