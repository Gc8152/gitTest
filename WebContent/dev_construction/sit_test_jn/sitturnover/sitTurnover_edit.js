	
function initsitTurnoverBtn(item, req_task_code){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	
	//赋值
	if(item){
		for (var key in item) {
			currTab.find("input[name="+key+"]").val(item[key]);
			currTab.find("textarea[name="+key+"]").val(item[key]);
		}
	}
	/**初始化按钮开始**/	
	//保存
	var save = currTab.find("#save_sit");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		initsave(false);
	});
	//保存并提交
	var submit = currTab.find("#submit_sit");
	submit.click(function(){
//		if(!vlidate(currTab,"",true)){
//			return ;
//		}
		initsave(true);
	});
	//返回
	var back = currTab.find("#back_sit");
	back.click(function(){
		closeCurrPageTab();
	});
	  
	function initsave(isCommit){
		var param = {};
		var selectInfo = currTab.find("#table_info");
		var inputs = selectInfo.find("input");
		var textareas = selectInfo.find("textarea");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < textareas.length; i++) {
			var obj = $(textareas[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		var chobj= getCurrentPageObj().find("input[name='check_task']:checkbox"); 
		var taskInfos="";//删除的ID  
		chobj.each(function(){  
			if(taskInfos==""){
				taskInfos = getCurrentPageObj().find(this).val();
			}else{
				taskInfos = taskInfos+","+getCurrentPageObj().find(this).val();
			}
		});  
		param["REQ_TASK_IDS"] = taskInfos;
		param["IS_COMMIT"]=isCommit;
		var call = getMillisecond();
		/*baseAjaxJsonp(dev_construction+"SitTurnover/saveSitInfo.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, call);*/
		
	}
	/**初始化按钮结束**/
	/**需求任务模态框开始**/
	var reqcode = currTab.find("input[name=REQ_TASK_CODE]");
	reqcode.click(function(){
		currTab.find("#rep_task_modal").modal("show");
	});
	
	var reqInfo = currTab.find("#table_reqtaskInfo");
	var tableCall = getMillisecond();
	//需求查询
	var select = currTab.find("#select_req");
	select.click(function(){
		var TASK_CODE = currTab.find("input[name=TASK_CODE]").val();
		var TASK_NAME = currTab.find("input[name=TASK_NAME]").val();
		reqInfo.bootstrapTable('refresh',{
			url:dev_construction+'SitTurnover/queryListReqtaskInfo.asp?call='+tableCall+'&SID='+SID
			+'&REQ_TASK_CODE=' + TASK_CODE+'&REQ_TASK_NAME=' + TASK_NAME});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_req").click();});
	//需求重置
	var reset = currTab.find("#reset_req");
	reset.click(function(){
		currTab.find("input[name=TASK_CODE]").val("");
		currTab.find("input[name=TASK_NAME]").val("");
	});
	//需求模态框列表
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	reqInfo.bootstrapTable({
		//请求后台的URL（*）
		url:dev_construction+'SitTurnover/queryListReqtaskInfo.asp?call='+tableCall+'&SID='+SID,
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
		uniqueId : "REQ_TASK_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: true,
		onDblClickRow:function(row){
			$('#rep_task_modal').modal('hide');
			currTab.find("input[name=REQ_TASK_CODE]").val(row.REQ_TASK_CODE);
			currTab.find("input[name=REQ_TASK_NAME]").val(row.REQ_TASK_NAME);
		},
		columns : [{
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'REQ_TASK_ID',
			title : '需求任务ID',
			align : "center",
			visible : false
		},{
			field : 'REQ_TASK_CODE',
			title : '需求任务编号',
			align : "center"
		}, {
			field : "REQ_TASK_NAME",
			title : "需求任务名称",
			align : "center"
		}, {
			field : "REQ_TASK_TYPE",
			title : "任务来源",
			align : "center"
		}, {
			field : "REQ_TASK_STATE",
			title : "需求任务状态",
			align : "center"
		},{
			field : 'SYSTEM_NO',
			title : '应用id',
			align : "center",
			visible : false
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center"
		}]
	});
	/**需求任务模态框结束**/
	
	//附件相关事件
	tablefile = currTab.find("#table_file");
	var paramObj = new Object();
	//构建文件上传路径拼接所需参数
	paramObj.supplier_name = "宇信珠海";
	paramObj.member_name = "SIT测试移交文档";
	//点击打开上传模态框
	var addfile = currTab.find("#add_file");
	addfile.click(function(){
		openFileSvnUpload(currTab.find("#file_modal"), tablefile, req_task_code.toString(), 'req_task_sit_test', 'S_DIC_SIT_TEST_FILE', paramObj);
	});
	//附件删除
	var delete_file = currTab.find("#delete_file");
	delete_file.click(function(){
		delSvnFile(tablefile, business_codes, phase, currTab.find("#file_modal"));
	});
	//初始化附件列表
	getSvnFileList(tablefile,currTab.find("#file_view_modal"),business_codes, phase);
}
initVlidate(getCurrentPageObj());