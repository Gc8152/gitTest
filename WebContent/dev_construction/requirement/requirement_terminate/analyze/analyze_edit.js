

function terAnalyzeEdit(selRow,optType){//初始化

	var $page = getCurrentPageObj();
	initVlidate($page);//渲染必填项
	autoInitSelect($page);//初始化下拉
	initButtonEvent();//初始化按钮事件
	if(optType){//查看
		$page.find("#analyzeShow1").hide();
		$page.find("#analyzeShow2").hide();
		$page.find("[name='useInterfaceApply_edit']").attr("type","hidden");
	}
	var REQ_TERMINATE_ID = selRow.REQ_TERMINATE_ID;
	/*初始化申请信息*/
	for(var k in selRow){
		$page.find("#"+k).text(selRow[k]);
	}	
	
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	/*初始化子需求申请列表*/
	var subCall = getMillisecond();
	$page.find("#subReqTable").bootstrapTable({
		//请求后台的URL（*）
		url :dev_construction+'req_terminate/queryReqTerminateListSub.asp?SID='+SID+'&call='+subCall+'&REQ_TERMINATE_NUM='+selRow.REQ_TERMINATE_NUM,
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
		pageSize : 5, // 每页的记录行数（*）
		clickToSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : "SUB_REQ_ID", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		jsonpCallback:subCall,
		onLoadSuccess : function(data){
			getSubReqId(data.rows);
			gaveInfo();
		},
		columns : [{
			field : 'ORDER_ID',
			title : '序号',
			align : "center",
			width : "7%",
			formatter:function(value,row,index){
				return index + 1;
			}
		},{
			field : 'SUB_REQ_ID',
			title : '需求点ID',
			align : "center",
			visible : false
		},{
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
		}]
		
	});
	
	/*初始化历史操作记录*/
	var optCall = getMillisecond();
	$page.find("#OptHistoryTable").bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url :dev_construction+'req_terminate/queryOptHistory.asp?SID='+SID+'&call='+optCall+'&REQ_TERMINATE_ID='+REQ_TERMINATE_ID,
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
		}
		]
	});
	
	
	function initButtonEvent(){
		
		//保存提交按钮 
		$page.find("[btn='saveSubmit']").click(function(){
			
			var params = getPageParam("IU");
			params["REQ_TERMINATE_ID"] = REQ_TERMINATE_ID;
			params["REQ_TERMINATE_NUM"] = selRow.REQ_TERMINATE_NUM;
			params["CREATE_ID"] = selRow.CREATE_ID;
			params["SUB_REQ_ID"] = sub_req_ids;
			params["LENGTH"] =  $page.find("#subReqTable").bootstrapTable('getData').length;
			params["REQ_ID"] = selRow.REQ_ID;
			
			var analAff = getCurrentPageObj().find("[name='IU.ANALYZE_AFFECT']").attr("placeholder");
			if(params.ANALYZE_AFFECT == analAff){
				params.ANALYZE_AFFECT = '';
			}
			
			if(!vlidate($page,"",true)){
				alert("有必填项未填");
				return ;
			}
		
			var stCall = getMillisecond();
			baseAjaxJsonp(dev_construction+"req_terminate/saveAnalyzeInfo.asp?SID=" + SID + "&call=" + stCall, params, function(data) {
				if(data && data.result=="true"){
					alert(data.msg);
					closeCurrPageTab();
				}else{
					alert(data.msg);
					closeCurrPageTab();
				}
			},stCall,false);
			
			
		});
	};
	var sub_req_ids="";
	function getSubReqId(rows){
		if(rows.length>0){
			for(var i=0;i<rows.length;i++){
				if(i==rows.length-1){
					sub_req_ids+=rows[i].SUB_REQ_ID;
				}else{
					sub_req_ids+=rows[i].SUB_REQ_ID+",";
				}
			}
			
		}
		
	}
	
	
}







