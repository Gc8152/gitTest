
initSplitTaskListLayOut();
function initSplitTaskListLayOut(){
	var currTab= getCurrentPageObj();
	var queryForm = currTab.find("#splitTaskQueryForm");
	var table = currTab.find("#gSubReqInfoForSpTaskTable");	
	var spTaskListCall = getMillisecond();

 //初始化字典
 autoInitSelect(queryForm);	
	
//初始化按钮
initSplitTaskListBtn();
function initSplitTaskListBtn() {

	// 查询
	currTab.find("#serach_spTaskQuery").click(function() {
		var param = queryForm.serialize();//获取表单的值
		table.bootstrapTable('refresh',{
			url:dev_construction+"requirement_splitTask/queryLessSplitTaskList.asp?SID="+SID+
			    "&call="+spTaskListCall+"&"+param
		});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#serach_spTaskQuery").click();});
	//重置
	currTab.find('#reset_spTaskQuery').click(function() {
		queryForm[0].reset();
		currTab.find('#system_id_spTaskQuery').val("");//非ie8下reset()方法不能清除隐藏项的值
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
	});
	
	
	
	//拆分任务
	currTab.find("#req_splitTask").click(function(){
		var id = table.bootstrapTable('getSelections');
		var p_owner = $.map(id, function (row) {return row.P_OWNER;});
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		if(id.length==1){
		 if(p_owner!=SID){
			alert("您不是所选子需求的当前责任人！");
			return;
		 }
		
		var sub_req_state = $.map(id, function (row) {return row.SUB_REQ_STATE;});
		  if(sub_req_state=="01"){
			  alert("该子需求还未提交，请在需求点拆分中提交后再拆分任务");
			  return;
		  }else if(sub_req_state=="05"){
			  alert("该子需求已经完成，不能再拆分任务");
			  return;
		  }else if(sub_req_state=="06"){
			  alert("该子需求已关闭，不能再拆分任务");
			  return;
		  }else if(sub_req_state=="07"){
			  alert("该子需求已无效，不能再拆分任务");
			  return;
		  }
		 closeAndOpenInnerPageTab("requirement_splitTask","任务拆分","dev_construction/requirement/requirement_analyze/split_task/splitTask_add.html",function(){
				initSplitTaskLayOut(params[0]);
			});
		}else{
			
	        alert("请选择一条子需求进行拆分！");
		}
			
	});	
	
	//查看详情
	currTab.find("#req_splitTask_detail").click(function(){
		var id = table.bootstrapTable('getSelections');
		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		if(id.length==1){
			closeAndOpenInnerPageTab("req_splitTask_detail","任务拆分详情页面","dev_construction/requirement/requirement_analyze/split_task/splitTask_detail.html",function(){
				initSplitTaskDetailLayOut(params[0]);
			});
		}else{
			
	        alert("请选择一条子需求进行查看！");
		}
			
	});	
	
	//加载应用pop
	currTab.find('#system_name_spTaskQuery').click(function(){
		openTaskSystemPop("sptask_system_pop",{sysno:getCurrentPageObj().find("#system_id_spTaskQuery"),sysname:getCurrentPageObj().find("#system_name_spTaskQuery")});
	});
}	



//初始化列表
initSplitReqQueryTable();
function initSplitReqQueryTable() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		table.bootstrapTable("destroy").bootstrapTable({
					url :dev_construction+"requirement_splitTask/queryLessSplitTaskList.asp?SID="+SID+"&call="+spTaskListCall,
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
					uniqueId : "SUB_REQ_CODE", // 每一行的唯一标识，一般为主键列
					cardView : false, // 是否显示详细视图
					detailView : false, // 是否显示父子表
					jsonpCallback:spTaskListCall,
					singleSelect : true,// 复选框单选
					onLoadSuccess:function(data){
						gaveInfo();
					},
					columns : [ {
						checkbox : true,
						rowspan : 2,
						align : 'center',
						valign : 'middle'
					},{
						field : 'REQ_ID',
						title : '需求序列号',
						align : "center",
						visible:false,
					},{
						field : 'SUB_REQ_CODE',
						title : '需求点编号',
						align : "center",
						width : 180,
					}, {
						field : 'SUB_REQ_NAME',
						title : '需求点名称',
						align : "center",
						width : 200,
					}, {
						field : "REQ_STATE_NAME",
						title : "需求点状态",
						align : "center",
						width : 120,
					}, {
						field : "REQ_PUT_DEPT_DISPLAY",
						title : "需求提出部门",
						align : "center",
						width : 130,
					},{
						field : "REQ_SCORE_DISPLAY",
						title : "需求优先级",
						align : "center",
						width : 90,
					},{
						field : "SYSTEM_NAME",
						title : "所属应用",
						align : "center",
						width : 150,
					}, {
						field : "SPONSOR",
						title : "主办数",
						align : "center",
						width : 60,
					},{
						field : "JIONTLY",
						title : "协办数",
						align : "center",
						width : 60,
					},{
						field : "P_OWNER_NAME",
						title : "当前责任人",
						align : "center",
						width : 90,
					}, {
						field : "PLAN_ONLINETIME",
						title : "计划投产时间",
						align : "center",
						width : 100,
					},{
						field : "SUB_CREATE_TIME",
						title : "录入时间",
						align : "center",
						width : 100,
					},{
						field : "P_OWNER",
						title : "当前责任人",
						align : "center",
						visible:false,
					},{
						field : "SUB_REQ_STATE",
						title : "需求点状态",
						align : "center",
						visible:false,
					},{	
						field : "OLD_TASK_ID",
						title : "存量任务编号",
						align : "center",
						width : 100
					}]
				});
		/**
		 * 缩略语公共方法
		 * @param data			bootstrapTable 中的的数据data
		 * @param tableId		表的id值
		 * @param abbrName		要使用缩略语的字段,要多个时可以用逗号隔开,例如'sup_name,remarks'
		 * @param num			超过字数长度的值
		 */
		/*function abbrText(data,tableId,abbrName,num){
			if(data.rows){
				if(abbrName){
					var abbrNames=abbrName.split(",");
					for(var i=0;i<abbrNames.length;i++) {
						for(var j=0;j<data.rows.length;j++){
							var value=data.rows[j][abbrNames[i]];
							if(value){
								if(value.length>num-2){
									 var valueStr=value.slice(0,num-2)+"...";
									 $('#'+tableId).bootstrapTable('updateCell', {
										 rowIndex: j,
										 fieldName: abbrNames[i],
										 fieldValue:'<abbr title="'+value+'">'+valueStr+'</abbr>'
									 });
								 }
							}
						}
					}
				}
			}
			
		}*/
	}
}
