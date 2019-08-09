

function changeApproveEdit(selRow){//初始化
	var $currPage = getCurrentPageObj();
	initVlidate($currPage);//渲染必填项
	autoInitSelect($currPage);//初始化下拉
	//initButtonEvent();//初始化按钮事件
	var REQ_CHANGE_ID = selRow.REQ_CHANGE_ID;
	/*初始化申请信息*/
	for(var k in selRow){
		$currPage.find("#"+k).text(selRow[k]);
	}
	
	//初始化待用参数
	$currPage.find("#REQ_CHANGE_ID_H").val(selRow.REQ_CHANGE_ID);
	$currPage.find("#REQ_NAME_H").val(selRow.REQ_NAME);
	$currPage.find("#REQ_ID_H").val(selRow.REQ_ID);
	$currPage.find("#CREATE_ID_H").val(selRow.CREATE_ID);
	$currPage.find("#REQ_PRODUCT_MANAGER_H").val(selRow.REQ_PRODUCT_MANAGER);
	//附件列表
	ApproveFileTable(selRow);
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	/*初始化需求点列表*/
	var approveCall = getMillisecond();//需求点表回调方法
	var sUrl = dev_construction+"requirement_change/queryReqSubs.asp?SID=" + 
			SID + "&call=" + approveCall + "&REQ_ID=" + selRow.REQ_ID;
	$currPage.find("#approve_reqSubsTable").bootstrapTable({
		url :sUrl,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : true, // 是否显示分页（*）
		pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 10, // 每页的记录行数（*）
		clickToSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "REQ_ID", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : true,// 复选框单选
		jsonpCallback:approveCall,
		onDblClickRow:function(row){
		},onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [ {
			field : 'ORDER_ID',
			title : '序号',
			align : "center",
			width : "50px",
			formatter:function(value,row,index){
				return index + 1;
			}
		}, {
			field : 'SUB_REQ_CODE',
			title : '需求点编号',
			align : "center"
		}, {
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center"
		}, {
			field : "SUB_REQ_STATE_NAME",
			title : "需求点状态",
			align : "center"
		}, {
			field : "SUB_REQ_CONTENT",
			title : "需求点描述",
			align : "center"
		}]
	});
	
	/*初始化历史操作记录*/
	var optCall = getMillisecond();
	$currPage.find("#OptHistoryTableAppr").bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url :dev_construction+'requirement_change/queryOptHistory.asp?SID='+SID+'&call='+optCall+'&REQ_CHANGE_ID='+REQ_CHANGE_ID,
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
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
		//uniqueId : "", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback : optCall,
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [
		 {
			field : "OPT_TIME",
			title : "日期",
			align : "center"
		},{
			field : 'OPT_USER_NAME',
			title : '操作人',
			align : "center"
		}, {
			field : 'OPT_ACTION',
			title : '操作',
			align : "center"
		},{
			field : "OPT_REMARK",
			title : "备注说明",
			align : "center"
		},{
			field : 'REQ_CHANGE_STATUS_NAME',
			title : '需求变更状态',
			align : "center"
		}]
	});
	
	//初始化附件列表
	function ApproveFileTable(selRow) {
		
		//附件列表
		 var tablefile = $currPage.find("#approve_fileTable");
		 var business_code = selRow.FILE_ID;
		 getSvnFileList(tablefile, $currPage.find("#file_approve_modal"), business_code, "00");
		
	}
}


/**
 * 定义需求变更操作流程的回调函数名
 * @param result 审批结果：true;false
 * @param mark 审批标识：over;reject;back;
 * @param biz_id 业务ID
 * @param msg 审批提示内容
 */
getCurrentPageObj()[0].call_func = function reqChange_func(result,mark,biz_id,msg){
	if(mark=='over'){//审批通过
		approveSubmit(biz_id,"04"); //审批通过
	}else if(mark=='reject'){
		approveSubmit(biz_id,"05");//审批打回
	}else if(mark=='back'){
		approveSubmit(biz_id,"06");//审批撤销
	}else{
		alert(msg);
	}
};


//审批结束后，更新状态，加入提醒
function approveSubmit(REQ_CHANGE_NUM,REQ_CHANGE_STATUS){
	var $page = getCurrentPageObj();
	var subCall=getMillisecond();
	var params = {};
    params['REQ_CHANGE_STATUS'] = REQ_CHANGE_STATUS;
    params['REQ_CHANGE_NUM'] = REQ_CHANGE_NUM;
    params['REQ_CHANGE_ID'] = $page.find("#REQ_CHANGE_ID_H").val();
    //修改业务联系人及电话用
    params['REQ_ID'] = $page.find("#REQ_ID_H").val();
    
    /********提醒参数**********/
    params['b_id'] = params['REQ_CHANGE_ID'];
	params['b_code'] = REQ_CHANGE_NUM;
	var create = $page.find("#CREATE_ID_H").val();
	var manager = $page.find("#REQ_PRODUCT_MANAGER_H").val();
	if(REQ_CHANGE_STATUS == '04'){//审批通过
		params['b_name'] = $page.find("#REQ_NAME_H").val()+"需求变更审批（变更编号："+REQ_CHANGE_NUM+"）审批已通过";
		if(create != manager){
			params['user_id'] = create + ',' + manager;
		}else{
			params['user_id'] = create;
		}
	}else{
		params['b_name'] = $page.find("#REQ_NAME_H").val()+"需求变更审批（变更编号："+REQ_CHANGE_NUM+"）审批被打回";
		params['user_id'] = create;
	}
	params['remind_type'] = "PUB2017179";
    baseAjaxJsonp(dev_construction+'requirement_change/submitApprove.asp?call='+subCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			alert(data.msg);
			 closeAndOpenInnerPageTab("changeApprove","变更审批","dev_construction/requirement/requirement_change/approve/changeApprove_queryList.html", function(){
				 initChangeApproveList();
				});
		}else{
			alert(data.msg);
			closeAndOpenInnerPageTab("changeApprove","变更审批","dev_construction/requirement/requirement_change/approve/changeApprove_queryList.html", function(){
				 initChangeApproveList();
				});
		}
	},subCall);
}








