
//任务列表显示页面
function initHandOverClickButton(item){
	
	var $page = getCurrentPageObj();//当前页
	autoInitSelect($page);//初始化下拉选
	var project_id = item.PROJECT_ID;
	var test_round= item.TEST_ROUND;
	var quaryHandOverCall=getMillisecond();
//	var task_id = item.TASK_ID;
	initHandOverRangeInfo();
	
//		$('#AcceptRangeTable').bootstrapTable('hideColumn', 'TEST_MAN');
		//重置按钮
		$page.find("[name='resetViewTask']").click(function(){
			$page.find("table input").val("");
			$page.find("select").val(" ").select2();
		});
		
	
		//查询按钮
		//getCurrentPageObj().find("#queryHandOverRange").unbind("click");
		getCurrentPageObj().find("[name='queryHandOverRange']").click(function(){	
			var param = getCurrentPageObj().find("#HandOverTaskQuerytForm").serialize();
			getCurrentPageObj().find("#AcceptRangeTable").bootstrapTable('refresh',{
				url:dev_test + "testTaskHandOver/queryHandOverTaskList.asp?SID=" + SID + "&PROJECT_ID=" + project_id + "&TEST_ROUND=" + test_round +"&call=" + quaryHandOverCall +'&'+param
				});		
		});
		//安排测试人员
		$page.find("[name='arrange_test_person']").click(function(){
			var seles = getCurrentPageObj().find("#AcceptRangeTable").bootstrapTable('getSelections');
			if(seles.length != 1) {
				alert("请选择一条数据进行操作!");
				return;
			}
			if(seles[0].ACCEPT_RESULT != '00'){
				alert("该项目未受理");
				return;
			}
			else{		
				var r = seles[0].ROW_NUM - 1;//获取行值
					var arrManPopMod = $page.find("[mod='arrManPopMod']");
					var $DISPOSE_MAN_NAME =  $page.find("[name='TEST_MAN_NAME']");
					var $jq = $($DISPOSE_MAN_NAME[r]);
					
					var $DISPOSE_MAN =  $page.find("[name='TEST_MAN']");
					var $jp = $($DISPOSE_MAN[r]);
					arrManPop(arrManPopMod,
							{
						DISPOSE_MAN_NAME : $jq,
						DISPOSE_MAN  : $jp
						},
						transq,transp);
					
					function transq($jq){
						var bootData = getCurrentPageObj().find("#AcceptRangeTable").bootstrapTable("getData");
						var inputs = getCurrentPageObj().find("#AcceptRangeTable").find("input");
							if($jq.attr("name") != 'btSelectItem'){
								var index =  $jq.attr("index");
								var bootrow = bootData[index];
								bootrow[$jq.attr("name")] = $jq.val();
							}
					}
					
					
					
					function transp($jp){
						var bootData = getCurrentPageObj().find("#AcceptRangeTable").bootstrapTable("getData");
						var inputs = getCurrentPageObj().find("#AcceptRangeTable").find("input");
							if($jp.attr("name") != 'btSelectItem'){
								var index =  $jp.attr("index");
								var bootrow = bootData[index];
								bootrow[$jp.attr("name")] = $jp.val();
							}
					}
			}
		});
	
	//保存&提交
	$page.find('#save_submmitRange').click(function(){
		
		initSaveHandOverButtonEvent("submit");
		
	});
	
	//保存
	$page.find('#saveRange').click(function(){
		
		initSaveHandOverButtonEvent("save");
		
	});


	//受理移交测试范围保存
	function initSaveHandOverButtonEvent(opt_type){
		var params = {};
		params = getPageParam("IU");
		params["PROJECT_ID"] = project_id;
		params["TEST_ROUND"] = test_round;
		params["TYPE"] = opt_type;
		var tableDate = getCurrentPageObj().find("#AcceptRangeTable").bootstrapTable('getData');
			if("submit" == opt_type){
				for(var k in tableDate){
					if(!(tableDate[k].ACCEPT_RESULT == '01' || tableDate[k].ACCEPT_RESULT == '00')){
						alert('请完善受理任务信息，然后“提交”');
						return;
					}
				}
			}
			var acceptInfo = new Array();
			for(var k in tableDate){
				//受理结论为“不受理”的任务，备注是必填
				if(tableDate[k].ACCEPT_RESULT == '01' && tableDate[k].REMARK == ''){
					alert("受理结论为“不受理”的任务，备注是必填");
					return;
				}
				if(tableDate[k].ACCEPT_RESULT == '00' && tableDate[k].TEST_MAN == ''){
					alert("受理结论为“受理”的任务，安排测试人员是必填");
					return;
				}
				//受理结论为“无”的任务，备注为空
				if(tableDate[k].ACCEPT_RESULT == undefined){
					tableDate[k].ACCEPT_RESULT = '';
				}
				acceptInfo.push({"TASK_ID":tableDate[k].TASK_ID,
					             "TEST_ROUND":test_round,
								 "ACCEPT_RESULT":tableDate[k].ACCEPT_RESULT,
								 "TEST_MAN":tableDate[k].TEST_MAN,
								 "REMARK":tableDate[k].REMARK});
			}
			params["HandOver_INFO"] = JSON.stringify(acceptInfo);
		
		var acceptCall = getMillisecond();
		baseAjaxJsonp(dev_test+"testTaskHandOver/saveHandOver.asp?SID=" + SID + "&call=" + acceptCall, params, function(data) {
			if(data && data.result=="true"){
				alert(data.msg);
				closeCurrPageTab();
			}else{
				alert(data.msg);
				closeCurrPageTab();
			}
		},acceptCall,false);
	}
	
	//查询列表显示table
	function initHandOverRangeInfo() {
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		$("#AcceptRangeTable").bootstrapTable(
				{
					//请求后台的URL（*）
					url : dev_test + "testTaskHandOver/queryHandOverTaskList.asp?SID=" + SID + "&PROJECT_ID=" + project_id +"&TEST_ROUND="+test_round+ "&call=" + quaryHandOverCall,
					method : 'get', //请求方式（*）   
					striped : false, //是否显示行间隔色
					cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
					sortable : true, //是否启用排序
					sortOrder : "asc", //排序方式
					queryParams : queryParams,//传递参数（*）
					sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
					pagination : true, //是否显示分页（*）
					pageList : [5,10,15],//每页的记录行数（*）
					pageNumber : 1, //初始化加载第一页，默认第一页
					pageSize : 10,//可供选择的每页的行数（*）
					clickToSelect : true, //是否启用点击选中行
					uniqueId : "PROJECT_ID", //每一行的唯一标识，一般为主键列
					cardView : false, //是否显示详细视图
					detailView : false, //是否显示父子表
					jsonpCallback:quaryHandOverCall,// 是否显示父子表
					singleSelect: true,// 复选框单选
					onLoadSuccess : function(data){
						gaveInfo();
						autoInitSelect($page.find("#AcceptRangeTable"));
					},onPostBody :function(data){
						var bootData = getCurrentPageObj().find("#AcceptRangeTable").bootstrapTable("getData");
						var inputs = getCurrentPageObj().find("#AcceptRangeTable").find("input");
						inputs.unbind("change").bind("change", function(e){
							if($(this).attr("name") != 'btSelectItem'){
								var index = $(this).attr("index");
								var bootrow = bootData[index];
								bootrow[$(this).attr("name")] = $(this).val();
							}
						});
						var seles = getCurrentPageObj().find("#AcceptRangeTable").find("select");
						seles.unbind("change").bind("change", function(e){
							var index = $(this).attr("index");
							var bootrow2 = bootData[index];
							bootrow2[$(this).attr("name")] = $(this).val();
						});
					},
					columns : [ {
						field: 'middle',
						checkbox: true,
						rowspan: 2,
						align: 'center',
						valign: 'middle'
					}, {
						field : 'ROW_NUMBER',
						title : '序号',
						align : "center",
						width : "40",
						sortable: true,
						formatter: function (value, row, index) {
							return index+1;
						}
					},{
						field : "TASK_NUM",
						title : "任务编号",
						width : "200",
						align : "center"
					}, {
						field : "TASK_NAME",
						title : "任务名称",
						width : "200",
						align : "center"
					}, {
						field : "REQ_TASK_STATE_NAME",
						title : "任务状态",
						width : "80",
						align : "center"
					}, {
						field : "PLANN_PRODUCT_TIME",
						title : "预计投产时间",
						width : "120",
						align : "center"
					}, {
						field : "REQ_TASK_TYPE_NAME",
						title : "任务类型",
						width : "80",
						align : "center"
					}, {
						field : "CHANGE_TYPE_NAME",
						title : "变更类型",
						width : "80",
						align : "center"
					}, {
						field : "PROJECT_NUM",
						title : "项目编号",
						width : "200",
						align : "center"
					}, {
						field : "PROJECT_NAME",
						title : "项目名称",
						width : "200",
						align : "center"
					}, {
						field : "SYSTEM_NAME",
						title : "应用名称",
						width : "80",
						align : "center"
					}, {
						field : "ACCEPT_RESULT",
						title : "移交受理结论",
						width : "120",
						align : "center",
						formatter: function (value, row, index) {
							return "<select   name='ACCEPT_RESULT'  index='"+index+"' value='"+value+"'      diccode='TM_DIC_ACCEPT_RESULT'  class='requirement-ele-width' style='width: 100%'></select>" ;
						}																								
					}, {
						field : "REMARK",
						title : "备注说明",
						width : "100",
						align : "center",
						formatter: function (value, row, index) {
							if(undefined == row.REMARK){
								row.REMARK = '';
							}
							return "<input type='text' name='REMARK' index='"+index+"' value='"+row.REMARK+"'>" ;
						}
					},  {
						field : "TEST_MAN_NAME",
						title : "测试人员",
						width : "100",
						align : "center",
						formatter: function (value, row, index) {
							if(undefined == row.TEST_MAN_NAME){
								row.TEST_MAN_NAME = '';
							}
							return "<input type='text' name='TEST_MAN_NAME' index='"+index+"' value='"+row.TEST_MAN_NAME+"' readonly>" ;
						}
					},  {
						field : "TEST_MAN",
						title : "人员编号",
						width : "100",
						align : "center",
	//					visible:false,
						formatter: function (value, row, index) {
							if(undefined == row.TEST_MAN){
								row.TEST_MAN = '';
							}
							return "<input type='text' name='TEST_MAN' index='"+index+"' value='"+row.TEST_MAN+"'readonly>" ;
						}
					}]
				});
		};
};

