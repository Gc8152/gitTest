

function changeAnalyzeEdit(selRow){//初始化
	
	var $page = getCurrentPageObj();
	initVlidate($page);//渲染必填项
	autoInitSelect($page);//初始化下拉
	initButtonEvent();//初始化按钮事件
	var REQ_CHANGE_ID = selRow.REQ_CHANGE_ID;
	/*初始化申请信息*/
	for(var k in selRow){
		if(k=="RES_GROUP_ID"){//隐藏主办应用的负责组id进入页面，用于发起流程
			$page.find("#"+k).val(selRow[k]);	
		}else{
			$page.find("#"+k).text(selRow[k]);	
		}
	}	
	//附件列表
	analyzeFileTable(selRow);
	
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	
	/*初始化需求点列表*/
	var analyzeCall = getMillisecond();//需求点表回调方法
	var sUrl = dev_construction+"requirement_change/queryReqSubs.asp?SID=" + 
			SID + "&call=" + analyzeCall + "&REQ_ID=" + selRow.REQ_ID + "&SEND_APPROVE=0";
	$page.find("#analyze_reqSubsTable").bootstrapTable({
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
		jsonpCallback:analyzeCall,
		onDblClickRow:function(row){
		},onLoadSuccess : function(data){
			$page.find("#APPR_MANAGER_ID").val(data.pm[0].PROJECT_MAN_ID);
			$page.find("#APPR_TEST_ID").val(data.tm[0].PROJECT_TEST_ID);
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
	$page.find("#OptHistoryTable").bootstrapTable('destroy').bootstrapTable({
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
		}
		]
	});
	
	
	function initButtonEvent(){
		
		//保存提交按钮  生成审批
		$page.find("[btn='saveSubmit']").click(function(){
			var params = getPageParam("IU");
			params["REQ_CHANGE_ID"] = REQ_CHANGE_ID;
			params["REQ_CHANGE_NUM"] = selRow.REQ_CHANGE_NUM;
			params["CREATE_ID"] = selRow.CREATE_ID;
			var caa = getCurrentPageObj().find("[name='IU.CHANGE_AFFECT_ANALYZE']").attr("placeholder");
			var cs = getCurrentPageObj().find("[name='IU.CHANGE_SOLUTION']").attr("placeholder");
			var cp = getCurrentPageObj().find("[name='IU.CHANGE_PLAN']").attr("placeholder");
			if(params.CHANGE_AFFECT_ANALYZE == caa){
				params.CHANGE_AFFECT_ANALYZE = '';
			}
			if(params.CHANGE_SOLUTION == cs){
				params.CHANGE_SOLUTION = '';
			}
			if(params.CHANGE_PLAN == cp){
				params.CHANGE_PLAN = '';
			}
			
			if(!vlidate($page,"",true)){
				alert("有必填项未填");
				return ;
			}
			var item = {};
			item["af_id"] = '101';//流程id
			item["systemFlag"] = '03'; //systemFlag：系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
			item["biz_id"] = selRow.REQ_CHANGE_NUM;//业务id
			//item["n_g_system_man"] = $page.find("#APPR_MANAGER_ID").val();
			//item["n_g_test_dept_id"] = '110106';
			 item["r_project_group"]=getCurrentPageObj().find("#RES_GROUP_ID").val();//传入当前主办应用所在项目组id要素，用以决定审批人是哪个项目组的组长
			approvalProcess(item,function(data){
				saveSubmit(params);
			});
		});
	};
	
	function saveSubmit(params){
		
		var stCall = getMillisecond();
		baseAjaxJsonp(dev_construction+"requirement_change/saveAnalyzeInfo.asp?SID=" + SID + "&call=" + stCall, params, function(data) {
			if(data && data.result=="true"){
				alert(data.msg);
				closeCurrPageTab();
			}else{
				alert(data.msg);
				closeCurrPageTab();
			}
		},stCall,false);
	}
	
	//初始化附件列表
	function analyzeFileTable(selRow) {
		
		//附件列表
		 var tablefile = $page.find("#analyze_fileTable");
		 var business_code = selRow.FILE_ID;
		 getSvnFileList(tablefile, $page.find("#file_analyze_modal"), business_code, "00");
		
	}
	
}

//分析不通过隐藏不填项
function selfunc(){
	$page = getCurrentPageObj();
	var selval = $page.find('select option:selected').val();
	if(selval == '00'){
		$page.find("#changeAnalyzeTab").find("[name='IU.CHANGE_ESTIMATED_FINISHTIME']").attr("validate","v.required");
		$page.find("#changeAnalyzeTab").find('tr:eq(3)').find('td:eq(0)').show();
		$page.find("#changeAnalyzeTab").find('tr:eq(3)').find('td:eq(1)').show();
		$page.find("#changeAnalyzeTab").find('tr:eq(4)').find('td:eq(0)').show();
		$page.find("#changeAnalyzeTab").find('tr:eq(4)').find('td:eq(1)').show();
		$page.find("#changeAnalyzeTab").find('tr:eq(5)').find('td:eq(0)').show();
		$page.find("#changeAnalyzeTab").find('tr:eq(5)').find('td:eq(1)').show();
		
	}
	if(selval == '01'){
		$page.find("#changeAnalyzeTab").find("[name='IU.CHANGE_ESTIMATED_FINISHTIME']").attr("validate","");
		$page.find("#changeAnalyzeTab").find('tr:eq(3)').find('td:eq(0)').hide();
		$page.find("#changeAnalyzeTab").find('tr:eq(3)').find('td:eq(1)').hide();
		$page.find("#changeAnalyzeTab").find('tr:eq(4)').find('td:eq(0)').hide();
		$page.find("#changeAnalyzeTab").find('tr:eq(4)').find('td:eq(1)').hide();
		$page.find("#changeAnalyzeTab").find('tr:eq(5)').find('td:eq(0)').hide();
		$page.find("#changeAnalyzeTab").find('tr:eq(5)').find('td:eq(1)').hide();
		
	}
	initVlidate($page);
}







