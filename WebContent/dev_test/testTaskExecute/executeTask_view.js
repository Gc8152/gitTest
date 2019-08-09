/*弹出模态框*/
	
function taskExecute(seles){
	var $page = getCurrentPageObj();//当前页
	var formObj = $page.find("#testForm");//表单对象
	var testPoint = $page.find("[tb='testPoint']");
	var initTableCall = getMillisecond();//table回调方法名
	 
	autoInitSelect($page);//初始化下拉选
	//修改执行状态
	editExecute(seles.CASE_ID,seles.TEST_ROUND);
	//案例基本信息显示
	var case_name = seles.CASE_NAME;
	var case_version = seles.CASE_VERSION;
	var case_num = seles.CASE_NUM;
	var case_type1 = seles.CASE_TYPE1_NAME;
	var case_type2 = seles.CASE_TYPE2_NAME;
	var pre_condition = seles.PRE_CONDITION;
	 var item = {};
	 item["CASE_NUM"] = case_num;
	 item["CASE_VERSION"] = case_version;
	 item["CASE_NAME"] = case_name;
	 item["CASE_TYPE1"] = case_type1;
	 item["CASE_TYPE2"] = case_type2;
	 item["PRE_CONDITION"] = pre_condition;
	 for(var k in item){
		 $page.find("#"+k).text(item[k]);
	 }
	 
	 //案例操作历史
	 getCaseStep(seles.CASE_ID,seles.TEST_ROUND);
	 //查询关联的缺陷
	 getDefectFind(seles.CASE_ID,seles.TEST_ROUND);
	 
	//关联缺陷
	 $page.find("[name='defectRele']").click(function(){
			 closeAndOpenInnerPageTab("releDefect","关联缺陷","dev_test/testTaskExecute/releDefect_view.html", function(){
			    getCurrentPageObj().find("#CASE_ID").val(seles.CASE_ID);
			    getCurrentPageObj().find("#TEST_ROUND").val(seles.TEST_ROUND);
			    getCurrentPageObj().find("#FUNC_ID").val(seles.FUNC_ID);
				
				});
	 });
	 
	 //发现缺陷
	 
	 $page.find("[name='defectFind']").click(function(){
			 closeAndOpenInnerPageTab("defectAdd","发现缺陷","dev_test/defectManagement/add/defect_add.html", function(){
				 editDefect(seles,'find');
				});
	 });
	 
//结束测试
	 
	 $page.find("[name='testEnd']").click(function(){
		  
		 var $proManPop = $page.find("[mod='proManPop']");
		 endTest($proManPop,seles);
	 });
	 
	//保存
		$page.find("[name='saveTask']").click(function(){
			saveTask('save',seles.CASE_ID,seles.TEST_ROUND);
			
		});
}

function saveTask(type,CASE_ID,TEST_ROUND){
	var params = {};
	params["TYPE"] = type;
	params["CASE_ID"] = CASE_ID;
	params["TEST_ROUND"] = TEST_ROUND;
	var tableDate = getCurrentPageObj().find("[tb='casesStep']").bootstrapTable('getData');
	//console.log(tableDate);
	if(0 == tableDate.length){
		params["STEP_INFO"] = '';
	}else{
		var stepInfo = new Array();
		for(var k=0; k<tableDate.length; k++){
			stepInfo.push({  "OPT_ORDER":tableDate[k].OPT_ORDER,
							 "TEST_ROUND":TEST_ROUND,
				             "CASE_ID":tableDate[k].CASE_ID,
							 "ACTUAL_DATA":tableDate[k].ACTUAL_DATA,
							 "ACTUAL_RESULT":tableDate[k].ACTUAL_RESULT});
			
		}
		params["STEP_INFO"] = JSON.stringify(stepInfo);
	}
	
	var taskCall = getMillisecond();
	baseAjaxJsonp(dev_test+"testTaskExecute/saveCaseStep.asp?SID=" + SID + "&call=" + taskCall, params, function(data) {
		if(data && data.result=="true"){
			alert(data.msg);
		}else{
			alert(data.msg);
		}
	},taskCall,false);
	
}


function editExecute(CASE_ID,TEST_ROUND){
	var initTableCall = getMillisecond();//table回调方法名
	var EXECUTE_STATE = "01";
	getCurrentPageObj().
	bootstrapTable('refresh',{
		url:dev_test+"testTaskExecute/queryEditExecute.asp?SID=" + SID +"&EXECUTE_STATE=" + EXECUTE_STATE +"&CASE_ID=" + CASE_ID+"&TEST_ROUND="+ TEST_ROUND+ "&call=" + initTableCall});
}
function getCaseStep(CASE_ID,TEST_ROUND){
	var cCall = getMillisecond()+'1';
	getCurrentPageObj().find("[tb='casesStep']").bootstrapTable('destroy').bootstrapTable({
		url : dev_test+"testTaskExecute/queryCaseStepList.asp?SID=" + SID + "&call=" + cCall +"&CASE_ID="+ CASE_ID+"&TEST_ROUND="+ TEST_ROUND,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		//queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : true, // 是否显示分页（*）
		pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 5, // 每页的记录行数（*）
		clickToSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : " ", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : true,// 复选框单选
		jsonpCallback:cCall,
		onDblClickRow:function(row){
		},onLoadSuccess : function(data){
			gaveInfo();
		},onPostBody :function(data){
			var bootData = getCurrentPageObj().find("[tb='casesStep']").bootstrapTable("getData");
			var inputs = getCurrentPageObj().find("[tb='casesStep']").find("input");
			inputs.unbind("change").bind("change", function(e){
				var index = $(this).attr("index");
				var bootrow = bootData[index];
				bootrow[$(this).attr("name")] = $(this).val();
			});
		},
		columns : [ {
			checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
		},{
			field : 'ORDER_ID',
			title : '步骤编号',
			align : "center",
			width : "8%",
			formatter:function(value,row,index){
				return index + 1;
			}
		}, {
			field : "OPT_DESCRIPT",
			title : "操作描述",
			width : "14%",
			align : "center"
		}, {
			field : "INPUT_DATA",
			title : "输入数据",
			width : "12%",
			align : "center"
		}, {
			field : "EXPECT_RESULT",
			title : "预期结果",
			width : "12%",
			align : "center"
		},{
			field : "ACTUAL_DATA",
			title : "实际输入数据",
			width : "12%",
			align : "center",
			formatter: function (value, row, index) {
				if(undefined == row.ACTUAL_DATA){
					row.ACTUAL_DATA = '';
				}
				return "<input type='text' name='ACTUAL_DATA' index='"+index+"' value='"+row.ACTUAL_DATA+"'>" ;
			}
		},{
			field : "ACTUAL_RESULT",
			title : "实际结果",
			width : "12%",
			align : "center",
			formatter: function (value, row, index) {
				if(undefined == row.ACTUAL_RESULT){
					row.ACTUAL_RESULT = '';
				}
				return "<input type='text' name='ACTUAL_RESULT' index='"+index+"' value='"+row.ACTUAL_RESULT+"'>" ;
			}
		}]
	});
}

function getDefectFind(CASE_ID,TEST_ROUND){
	var cCall = getMillisecond()+'1';
	 
	getCurrentPageObj().find("[tb='defectFind']").bootstrapTable('destroy').bootstrapTable({
		url : dev_test+"testTaskExecute/queryDefectFindList.asp?SID=" + SID + "&call=" + cCall +"&CASE_ID="+ CASE_ID+"&TEST_ROUND="+TEST_ROUND,
		method : 'get', // 请求方式（*）
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, // 是否启用排序
		sortOrder : "asc", // 排序方式
		//queryParams : queryParams,// 传递参数（*）
		sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
		pagination : true, // 是否显示分页（*）
		pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页
		pageSize : 5, // 每页的记录行数（*）
		clickToSelect : true, // 是否启用点击选中行
		// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
		uniqueId : " ", // 每一行的唯一标识，一般为主键列
		cardView : false, // 是否显示详细视图
		detailView : false, // 是否显示父子表
		singleSelect : true,// 复选框单选
		jsonpCallback:cCall,
		onDblClickRow:function(row){
		},onLoadSuccess : function(data){
			gaveInfo();
		},onPostBody :function(data){
		},
		columns : [ {
			checkbox : true,
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
			field : "DEFECT_NUM",
			title : "缺陷编号",
			width : "14%",
			align : "center"
		}, {
			field : "SUMMARY",
			title : "摘要",
			width : "14%",
			align : "center"
		}, {
			field : "PRIORITY_LEVEL_NAME",
			title : "缺陷优先级",
			width : "12%",
			align : "center"
		}, {
			field : "SEVERITY_GRADE_NAME",
			title : "严重程度",
			width : "12%",
			align : "center"
		},{
			field : "DEFECT_STATE_NAME",
			title : "缺陷状态",
			width : "12%",
			align : "center",
		}, {
			field :	"OPT_ORDER",
			title :	"操作",
			align : "center",
			width : "10%",
			formatter: function (value, row, index) {
				return "<a style='color:blue'  href='javascript:void(0)' onclick=checkDetail('"+index+"') >查看</a>" ;
			}
		}]
	});
}
//缺陷信息查看
function checkDetail(index){ 
	var dataTable = getCurrentPageObj().find("[tb='defectFind']").bootstrapTable('getData');
	var rowDate = dataTable[index];
	
	closeAndOpenInnerPageTab("detail","缺陷信息","dev_test/defectManagement/query/defect_detail.html", function(){
		detailDefect(rowDate);
	
	});
}