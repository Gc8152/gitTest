//加载页面表单数据
function initSerAcceptDetail(selRow){
	//初始化必填
	var $page = getCurrentPageObj();//当前页	
	initVlidate($page);//渲染必填项
	
	var RECORD_APP_NUM = selRow.RECORD_APP_NUM;
	if(selRow){
		for(var k in selRow){

			$page.find("#"+k).text(selRow[k]);
		}
	}


	//页面返回按钮
	$page.find("#BackSerAccept").click(function(){
		closeCurrPageTab();
	});
	var tableCallSer = getMillisecond();
	//保存并提交	
	$page.find("#saveAndSubmitSer").click(function(){
		var param = {};
		param["SER_ACCEPT_RESULT"]=getCurrentPageObj().find('input:radio[name="SER_ACCEPT_RESULT"]:checked').val();
		param["SER_REPULSE_REASON"]=getCurrentPageObj().find("select[name='SER_REPULSE_REASON']").val();
		param["SER_ACCEPT_REMARK"]=getCurrentPageObj().find("textarea[name='SER_ACCEPT_REMARK']").val();
		param["RECORD_APP_NUM"]=getCurrentPageObj().find("#RECORD_APP_NUM").text();
		var accept_result = param["SER_ACCEPT_RESULT"];
		var remindParam={};
		remindParam["b_code"] = param["RECORD_APP_NUM"];
		remindParam["b_id"] = param["RECORD_APP_NUM"];
		remindParam["user_id"] = selRow["APP_USER"];
		var taskIntoVerCall = getMillisecond()+'2';
		
		var aaa=getCurrentPageObj().find("#SER_ACCEPT_REMARK").val();
	    if(aaa.length>100){
	    	alert("受理信息至多可输入100汉字！");
	    	return;
	    }
		
		baseAjaxJsonp(dev_application+'serUseInterAccept/serAccept.asp?call='+tableCallSer+'&SID='+SID,param,function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		if(accept_result == '00'){//不通过(使用申请单被服务方打回)
	       			remindParam["b_name"] = "您的接口使用申请单（编号："+remindParam["b_code"]+"）被服务方打回";
		       		baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+taskIntoVerCall+"&remind_type=PUB2017157",
		       				remindParam, function(mes){
						//接口使用申请插入提醒成功
						}, taskIntoVerCall);
	       		}else{//通过(使用申请单已受理)
	       			remindParam["b_name"] = "您的接口使用申请单（编号："+remindParam["b_code"]+"）服务方已受理";
	       			baseAjaxJsonp(dev_workbench+"Remind/remindAdd.asp?SID="+SID+"&call="+taskIntoVerCall+"&remind_type=PUB2017157",
							remindParam, function(mes){
						//接口使用申请插入提醒成功
						}, taskIntoVerCall);
	       		}
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, tableCallSer);
	});
	
	
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var tableCallSer2 = getMillisecond();
	/**初始化接口清单**/
	$page.find("#AcceptListCheckTable").bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
			url :dev_application+'serUseInterAccept/querySerInterAppListByRecordAppNum.asp?SID='+SID+'&RECORD_APP_NUM='+RECORD_APP_NUM+'&call='+tableCallSer2,
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
			jsonpCallback : tableCallSer2,
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
		var tableCallSer3 = getMillisecond();
		$page.find("#serOperationHistoryTable").bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
			url :dev_application+'serUseInterAccept/querySerOperationHistory.asp?SID='+SID+'&call='+tableCallSer3+'&RECORD_APP_NUM='+RECORD_APP_NUM,
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
			jsonpCallback : tableCallSer3,
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
				$page.find("#SerAccept").find('tr:eq(0)').find('td:eq(2)').hide();
				$page.find("#SerAccept").find('tr:eq(0)').find('td:eq(3)').hide();
				$page.find("#SerAccept").find('tr:eq(0)').find('td:eq(1)').attr("colspan","3");
				$page.find("#SerAccept").find("#SER_REPULSE_REASON").attr({validate:"",valititle:""});
			}else{
				$page.find("#SerAccept").find('tr:eq(0)').find('td:eq(2)').show();
				$page.find("#SerAccept").find('tr:eq(0)').find('td:eq(3)').show();
				$page.find("#SerAccept").find('tr:eq(0)').find('td:eq(1)').attr("colspan","1");
				$page.find("#SerAccept").find("#SER_REPULSE_REASON").attr({validate:"v.required",valititle:"该项为必填项"});
			}
			
			
			initSerPageSelect();
			//初始化下拉菜单
			function initSerPageSelect(){
				//申请单打回原因
				initSelect($page.find("#SER_REPULSE_REASON"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_REPULSE_REASON"});

			}
		});


}







