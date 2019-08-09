$(function(){
	$("#application_purpose").css("height","200px");
	
});

//按钮方法
function initChangeButtonEvent(req_change_id){	
	
	
	getCurrentPageObj().find("#changePlan").click(function(){
		if(!vlidate(getCurrentPageObj().find("#addChange_from"))){
			alert("还有必填项未填");
			return ;
		}
      
		var expertsCall = getMillisecond();
        var params = getPageParam("G");		//遍历当前页面的input,text,select
        params['change_state'] = '03';
		baseAjaxJsonp(dev_project+'PChangeReq/UpChangeAnaylze.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				closePageTab("changeReq_add");
				alert("添加成功");
				
			}else{
				alert("添加失败");
			}
		},expertsCall);
	});



	initVerChangContent(req_change_id);
}

var initVerChange_call = getMillisecond();
/**
 * 初始化任务列表列表
 */
function initVerChangContent(req_change_id) {
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	//getCurrentPageObj().find("#sendProContent").bootstrapTable("destory");
	getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable({
		url : dev_project+'PChangeReq/queryChangeVerTaskList.asp?call='+initVerChange_call+'&SID='+SID+'&req_change_id='+req_change_id,
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [5,10],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		jsonpCallback: initVerChange_call,
		onLoadSuccess:function(data){
			gaveInfo();	
		},
		columns : [ {
			checkbox : true,
			rowspan : 2,
			align : 'center',
			valign : 'middle'
		},{
			field : 'REQ_TASK_ID',
			title : '任务序列号',
			align : "center",
			visible:false,
		},{
			field : 'SUB_REQ_ID',
			title : '需求点序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_ID',
			title : '需求序列号',
			align : "center",
			visible:false,
		},{
			field : 'REQ_TASK_CODE',
			title : '任务编号',
			align : "center",
		}, {
			field : 'REQ_TASK_NAME',
			title : '任务名称',
			align : "center"
		}, {
			field : "REQ_TASK_RELATION_NAME",
			title : "从属关系",
			align : "center"
		}, {
			field : "REQ_TASK_STATE_DISPLAY",
			title : "任务状态",
			align : "center"
		}, {
			field : "SYSTEM_NAME",
			title : "实施应用",
			align : "center",
		},{
			field : "CREATE_TIME",
			title : "创建时间",
			align : "center",
		},{
			field : "P_OWNER",
			title : "当前责任人",
			align : "center",
			visible:false,
		},{
			field : "VERSION_NAME",
			title : "纳入版本",
			align : "center",
		},{
			field : "REQ_TASK_STATE",
			title : "需求任务状态",
			align : "center",
			visible:false,
		}, {
			field : "",
			title : "操作",
			align : "center",
			formatter:function(value, row, index) {
				var edit='<a class="click_text_sp" onclick="detailSendProTask('+index+');">查看</a>/ '+
				 		 '<a class="click_text_sp" cursor:pointer;" onclick="delSendProTask('+row.REQ_TASK_ID+');">删除</a>';
				 return edit; 
			}
		}]
	});
}


//下拉框方法
function initSUserType(){
	//初始化数据
	initSelect(getCurrentPageObj().find("#change_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CHANGE_TYPE"},'03');
	//初始化需求分类子类
	initSelect(getCurrentPageObj().find("#change_subtype"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CHANGE_SUBTYPE"});
	//初始化数据
	initSelect(getCurrentPageObj().find("#phased_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"});

}



//$("#orgDivPop").load("pages/sorg/sorgPop.html");
//initAddExpertButtonEvent();
initSUserType();
