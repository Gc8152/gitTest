//加载页面表单数据
function initPostAcceptDetail(appParams){
	
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	for(var k in appParams){
        getCurrentPageObj().find("#"+k).text(appParams[k]);
	}
	var tableCallC = getMillisecond();
	//保存并提交	
	getCurrentPageObj().find("#saveAndSubmit").click(function(){
		var param = {};
		param["MNG_ACCEPT_RESULT"]=getCurrentPageObj().find('input:radio[name="MNG_ACCEPT_RESULT"]:checked').val();
		param["MNG_REPULSE_REASON"]=getCurrentPageObj().find("select[name='MNG_REPULSE_REASON']").val();
		param["MNG_ACCEPT_REMARK"]=getCurrentPageObj().find("textarea[name='MNG_ACCEPT_REMARK']").val();
		param["RECORD_APP_NUM"]=getCurrentPageObj().find("#RECORD_APP_NUM").text();
		var accept_result = param["MNG_ACCEPT_RESULT"];
		var remindParam={};
		remindParam["b_code"] = param["RECORD_APP_NUM"];
		remindParam["b_id"] = param["RECORD_APP_NUM"];
		remindParam["b_name"] = "您的接口使用申请单（编号："+remindParam["b_code"]+"）被管理岗打回";
		remindParam["user_id"] = appParams["APP_USER"];
		
		var aaa=getCurrentPageObj().find("#MNG_ACCEPT_REMARK").val();
	    if(aaa.length>100){
	    	alert("受理信息至多可输入100汉字！");
	    	return;
	    }
		
		var taskIntoVerCall = getMillisecond()+'2';
		baseAjaxJsonp(dev_application+'postUseInterAccept/manageAccept.asp?call='+tableCallC+'&SID='+SID,param,function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		if(accept_result == '00'){
		       		baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+taskIntoVerCall+"&remind_type=PUB2017157",
							remindParam, function(mes){
						//接口使用申请插入提醒成功
						}, taskIntoVerCall);
	       		}
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, tableCallC);
	});

	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var tableCallD = getMillisecond();
	
	/**初始化接口清单**/
	getCurrentPageObj().find("#AcceptListCheckTable").bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
			url :dev_application+'postUseInterAccept/queryInterAppListByRecordAppNum.asp?SID='+SID+'&RECORD_APP_NUM='+appParams.RECORD_APP_NUM+'&call='+tableCallD,
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
			uniqueId : "INTER_CODE", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:tableCallD,
			singleSelect: true,
			onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field : 'Number',
				title : '序号',
				align : "center",
				width : "8%",
				sortable: true,
				formatter: function (value, row, index) {
					return index+1;
				}
			},{
				field : "APP_INTER_NUM",
				title : "接口申请编号",
				align : "center",
				width : "14%",
			},{
				field : "APP_TYPE_NAME",
				title : "申请类型",
				align : "center",
				width : "8%"
			}, {
				field : "INTER_APP_STATUS_NAME",
				title : "申请状态",
				align : "center",
				width : "12%",
			}, {
				field : "INTER_CODE",
				title : "接口编号",
				align : "center",
				width : "14%",
			}, {
				field : 'INTER_NAME',
				title : '接口名称',
				align : "center",
				width : "10%"
			},{
				field : 'INTER_OFFICE_TYPE_NAME',
				title : '接口业务类型',
				align : "center",
				width : "10%"
			},{
				field : "INTER_STATUS_NAME",
				title : "接口状态",
				align : "center",
				width : "8%"
			},{
				field : "INTER_DESCR",
				title : "接口描述",
				align : "center",
				width : "10%"
			},{
				field : "INTER_VERSION",
				title : "操作",
				align : "center",
				valign: 'middle',
				width : "6%",
				formatter: function (value, row, index) {
					return '<span class="hover-view" '+
					'onclick="GoCheckDetail(\''+row.INTER_ID+'\',\''+value+'\',\''+row.APP_TYPE+'\',\''+index+'\',\''+row.APP_ID+'\')">查看</span>';
				}
			}			
			]
	});
	
	var tableCallX = getMillisecond();
	$page.find("#postOperationHistoryTable").bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		url :dev_application+'serUseInterAccept/querySerOperationHistory.asp?SID='+SID+'&call='+tableCallX+'&RECORD_APP_NUM='+appParams.RECORD_APP_NUM,
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
		jsonpCallback : tableCallX,
		singleSelect: true,
		onLoadSuccess : function(data){
			gaveInfo();
		},
		columns : [{
			field : 'OPT_USER',
			title : '操作人',
			align : "center"
		}, {
			field : 'OPT_ACTION',
			title : '操作',
			align : "center"
		},{
			field : 'OPT_RESULT_NAME',
			title : '结论',
			align : "center"
		},{
			field : "OPT_REMARK",
			title : "相关说明",
			align : "center"
		},{
			field : "OPT_TIME",
			title : "操作时间",
			align : "center"
		}
		
		]
	});
	
	//同意开放隐藏打回原因
	$page.find(":radio").click(function(){
		var rv = $(this).val();
		if(rv == '01'){
			$page.find("#pAcceptTable").find('tr:eq(0)').find('td:eq(2)').hide();
			$page.find("#pAcceptTable").find('tr:eq(0)').find('td:eq(3)').hide();
			$page.find("#pAcceptTable").find('tr:eq(0)').find('td:eq(1)').attr("colspan","3");
			$page.find("#pAcceptTable").find("#MNG_REPULSE_REASON").attr({validate:"",valititle:""});
		}else{
			$page.find("#pAcceptTable").find('tr:eq(0)').find('td:eq(2)').show();
			$page.find("#pAcceptTable").find('tr:eq(0)').find('td:eq(3)').show();
			$page.find("#pAcceptTable").find('tr:eq(0)').find('td:eq(1)').attr("colspan","1");
			$page.find("#pAcceptTable").find("#MNG_REPULSE_REASON").attr({validate:"v.required",valititle:"该项为必填项"});
		}
	});

	initPageSelect();
	//初始化下拉菜单
	function initPageSelect(){
		//申请单打回原因
		initSelect(getCurrentPageObj().find("#MNG_REPULSE_REASON"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_REPULSE_REASON"});

	}
		
}










