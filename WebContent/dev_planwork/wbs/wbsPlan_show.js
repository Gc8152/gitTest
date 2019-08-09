$(function(){
	//显示遮罩层
	startLoading();
});

//初始化表格数据
function InitTreeData_show(project_id,table_id){
 var call = getMillisecond();
 var url = dev_planwork + 'Wbs/queryProjectMilestonePlanList.asp?SID=' + SID + "&call=" + call;
 baseAjaxJsonp(url, {
	 project_id : project_id
	}, function(date) {
		initTreegrid_show(date,table_id);
	}, call);
}
//初始化表格数据
function initTreegrid_show(date,table_id){
	$('#'+table_id).treegrid({
		rownumbers: true,
		idField: 'plan_id',
		treeField: 'plan_name',
		checkOnSelect : true,
		data : date,
		 onLoadSuccess: function(row){  
	        	//关闭遮罩层
				endLoading();
				//滚动页面 表格标题固定
				scrollHeadFixed(".wbsPlan_show");
				
				/*重新给datagrid-view高度*/
				 var mainIframeH=$("#main_iframe").height()*0.7;
	            var datagridWrapH=parseInt($(".wbsPlan_show .datagrid-wrap").css("minHeight"));
				 var datagridViewH=mainIframeH>datagridWrapH?mainIframeH:datagridWrapH;
	            $(".wbsPlan_show .datagrid-view").css("height",datagridViewH);
	        }, 
		frozenColumns :[[
	                {field:'plan_name',title:'名称',width:180}
		]],
		columns : [[
		            {field:'type_name',resizable : false,width : 100,title:'类别',align : 'center'},
		            {field:'start_time',resizable : false,width : 105,title:'计划开始日期',align : 'center'},
		            {field:'end_time',resizable : false,width : 105,title:'计划结束日期',align : 'center'},
		            {field:'reality_start_time',resizable : false,width : 105,title:'实际开始日期',align : 'center'},
		            {field:'reality_end_time',resizable : false,width : 105,title:'实际结束日期',align : 'center'},
		            {field:'plan_work_day',resizable : false,width : 100,title:'计划工期（天）',align : 'center'},
		            {field:'reality_work_day',resizable : false,width : 100,title:'实际工期（天）',align : 'center'},
		            {field:'plan_work_hour',resizable : false,width : 130,title:'计划工作量（小时）',align : 'center'},
		            {field:'reality_work_hour',resizable : false,width : 130,title:'实际工作量（小时）',align : 'center'},
		            {field:'work_percentage',resizable : false,width : 140,title:'工作量完成比例（%）',align : 'center'},
		            {field:'task_percentage',resizable : false,width : 140,title:'任务完成比例（%）',align : 'center'},
		            {field:'pre_task',resizable : false,width : 100,title:'前置任务',align : 'center'},
		            {field:'is_key_task_name',resizable : false,width : 95,title:'是否关键任务',align : 'center'},
		            {field:'duty_man_name',resizable : false,width : 80,title:'责任人',align : 'center'},
		            {field:'task_type_name',resizable : false,width : 80,title:'任务类型',align : 'center'},
		            {field:'file_id',title:'交付物',resizable : false,width:200,align : 'center'},
		            {field:'is_finish_affirm_name',resizable : false,width : 95,title:'是否完成确认',align : 'center'},
		            {field:'create_user_name',resizable : false,width : 80,title:'创建人',align : 'center'},
		            {field:'release_status_name',resizable : false,width : 80,title:'任务状态',align : 'center'},
		            {field:'accept_status_name',resizable : false,width : 80,title:'受理状态',align : 'center'},
		            {field:'describe',resizable : false,width : 200,title:'描述',align : 'center'},
		            {field:'remarks',resizable : false,width : 200,title:'备注',align : 'center'}
		]]
	    });
}