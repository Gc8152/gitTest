

function editSyncEdit(selRow,role){//初始化

	var $page = getCurrentPageObj();
	initVlidate($page);//渲染必填项
	autoInitSelect($page);//初始化下拉
	initButtonEvent();//初始化按钮事件
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
	/*初始化流信息*/
	var streamCall = getMillisecond();
	var AUDIT_NO = selRow.AUDIT_NO;
	var SYSTEM_ID = selRow.SYSTEM_ID;
	var stUrl = dev_construction+'versionSync/queryStreamList.asp?SID='+SID+'&call='+streamCall+'&SYSTEM_ID='+SYSTEM_ID+'&ROLE='+role;
	var flag = true;
	if(role == 'pm'){//项目经理
		$page.find("[tdn='cm']").hide();
		$page.find("[btn='saveCMSync']").hide();
	}
	if(role == 'cm'){//配置管理员
		$page.find("[tdn='pm']").hide();
		$("#divhide1").show();
		$("#divhide2").show();
		$page.find("[btn='saveSync']").hide();
		if(selRow.SYNC_STREAM_ID == undefined){selRow.SYNC_STREAM_ID = '';}
		stUrl = stUrl + '&SYNC_STREAM_ID='+selRow.SYNC_STREAM_ID;
		flag = false;
	}
	
	$page.find("#streamTable").bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url :stUrl,
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
		jsonpCallback : streamCall,
		singleSelect: false,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [{
			checkbox : flag,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
		},{
			field : 'ORDER_ID',
			title : '序号',
			align : "center",
			width : "8%",
			formatter:function(value,row,index){
				return index + 1;
			}
		}, {
			field : "STREAM_APP_ID",
			title : "流申请ID",
			width : "15%",
			align : "center"
		}, {
			field : "STREAM_APP_TITLE",
			title : "标题",
			width : "15%",
			align : "center"
		}, {
			field : "STREAM_NAME",
			title : "流名称",
			width : "15%",
			align : "center"
		}, {
			field : "STREAM_STATUS",
			title : "流状态",
			width : "15%",
			align : "center"
		}, {
			field : "VERSIONS_NAME",
			title : "版本名称",
			width : "20%",
			align : "center"
		},{
			field : "CONFIG_MAN_NAME",
			title : "配置管理员",
			width : "12%",
			align : "center"
		}
//		,{
//			field : "STREAM_ID",
//			title : "操作",
//			align : "center",
//			width : "18%",
//			formatter:function(value,row,index){
//				var result = "<a style='color:blue'  href='javascript:void(0)' onclick=\"viewStream(\'"+value+"\')\">查看详情</a>";
//				return result;
//			}
//		}
		]
	});
	
	
	function initButtonEvent(){
		
		//保存提交按钮 PM
		$page.find("[btn='saveSync']").click(function(){
			var params = getPageParam("IU");
			if(!vlidate($page,"",true)){
				alert("请选择是否同步");
				return ;
			}
			var seles = getCurrentPageObj().find("#streamTable").bootstrapTable("getSelections");
			if(params.IS_SYNC == '00'){
				if(seles.length == 0){
					alert("请选择需要同步的流");
					return;
				}
				var appIdStr = $.map(seles,function(row){
					return row.STREAM_APP_ID;
				}).join(",");
				params["SYNC_STREAM_ID"] = appIdStr;
			}
			params["AUDIT_NO"] = AUDIT_NO;
			params["SYNC_ID"] = selRow.SYNC_ID;
			var stCall = getMillisecond();
			baseAjaxJsonp(dev_construction+"versionSync/saveSyncResult.asp?SID=" + SID + "&call=" + stCall + '&ROLE='+role, params, function(data) {
				if(data && data.result=="true"){
					alert(data.msg);
					closeCurrPageTab();
				}else{
					alert(data.msg);
					closeCurrPageTab();
				}
			},stCall,false);
			
			
		});
		
		
		
		//确认提交按钮 CM
		$page.find("[btn='saveCMSync']").click(function(){
			var params = {};
			params["AUDIT_NO"] = AUDIT_NO;
			params["SYNC_ID"] = selRow.SYNC_ID;
			params["PROJECT_MAN_ID"] = selRow.PROJECT_MAN_ID;
			var cmCall = getMillisecond();
			baseAjaxJsonp(dev_construction+"versionSync/saveSyncResult.asp?SID=" + SID + "&call=" + cmCall + '&ROLE='+role, params, function(data) {
				if(data && data.result=="true"){
					alert(data.msg);
					closeCurrPageTab();
				}else{
					alert(data.msg);
					closeCurrPageTab();
				}
			},cmCall,false);
			
		});
		
	};
	
	
}

//function viewStream(STREAM_ID){
//	
//	var $viewStreamPop = getCurrentPageObj().find("[mod='viewStreamPop']");
//	streamPop($viewStreamPop,STREAM_ID);
//
//}


function abc(){
	var $obj = getCurrentPageObj().find("[name='IU.IS_SYNC']");
	if( $obj.val() == '00' ){
		$("#divhide1").show();
		$("#divhide2").show();
	}else{
		$("#divhide1").hide();
		$("#divhide2").hide();
	}
	
};


