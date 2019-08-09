
initSelect(getCurrentPageObj().find("#stream_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_STREAM_TYPE"});
//自动赋值
function initAutoValue(){	
	var s = getCurrentPageObj().find("#system_name").val();
	var v = getCurrentPageObj().find("#versions_name").val();
	var stream_type=getCurrentPageObj().find("#stream_type");
	if(stream_type=="00"){
		var str = s ;
		getCurrentPageObj().find("#stream_app_title").val(str);
	}else{
		var str = s + "-" + v;
		getCurrentPageObj().find("#stream_app_title").val(str);
	}
} 

//加载基本信息
function initBasicInfo(item){
	for ( var k in item) {
		var str=item[k];
		k = k.toLowerCase();
		if(k=="apply_desc"){
			getCurrentPageObj().find("#"+k).text(str);
		}else if(k=="stream_type"){
			initSelect(getCurrentPageObj().find("#stream_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_STREAM_TYPE"},str);
			if(str=="00"){
				getCurrentPageObj().find('#req_task').attr('style','display : block');
				getCurrentPageObj().find('#task_table').attr('style','display : block');
				getCurrentPageObj().find('#versions_name').attr('style','display : none');
				getCurrentPageObj().find('#hidden_version').attr('style','display : none');
				getCurrentPageObj().find('#versions_name').removeAttr("validate");
				getCurrentPageObj().find('#system_id_hide+strong').hide();
				//getCurrentPageObj().find("table input").val("");
				var app_name = $("#currentLoginName").val(); 
				var app_id = $("#currentLoginNo").val();
				getCurrentPageObj().find("#app_man_name").val(app_name);
				getCurrentPageObj().find("#app_man_id").val(app_id);
				initStreamTask(item["REQ_TASK_ID"]);
			}
		}else{
			getCurrentPageObj().find("#"+k).val(str);
		}
	}
}

//根据是紧急流则不显示版本
/*function showOrHideTask(){
 var req_type1=getCurrentPageObj().find('#stream_type').val();	
	if(req_type1=='00'){//需求大类为需求申请书时显示主管业务部门
		getCurrentPageObj().find('#req_task').attr('style','display : block');
		getCurrentPageObj().find('#task_table').attr('style','display : block');
		getCurrentPageObj().find('#versions_name').attr('style','display : none');
		getCurrentPageObj().find('#hidden_version').attr('style','display : none');
		getCurrentPageObj().find('#versions_name').removeAttr("validate");
		getCurrentPageObj().find('#system_id_hide+strong').hide();
		getCurrentPageObj().find("table input").val("");
		var app_name = $("#currentLoginName").val(); 
		var app_id = $("#currentLoginNo").val();
		getCurrentPageObj().find("#app_man_name").val(app_name);
		getCurrentPageObj().find("#app_man_id").val(app_id);
		initStreamTask();
	}else{
		getCurrentPageObj().find('#req_task').attr('style','display : none');
		getCurrentPageObj().find('#task_table').attr('style','display : none');
		getCurrentPageObj().find('#versions_name').attr('style','display : block');
		getCurrentPageObj().find('#hidden_version').attr('style','display : block');
		getCurrentPageObj().find('#versions_name').attr("validate","v.required");
		getCurrentPageObj().find('#system_id_hide+strong').show();
		getCurrentPageObj().find("table input").val("");
		var app_name = $("#currentLoginName").val(); 
		var app_id = $("#currentLoginNo").val();
		getCurrentPageObj().find("#app_man_name").val(app_name);
		getCurrentPageObj().find("#app_man_id").val(app_id);
		
	}
	
}*/

//申请紧急流则显示应用关联的紧急任务

function initStreamTask(req_task_id){
	//var system_id=getCurrentPageObj().find('#system_id').val();
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		// 页码
		};
		return temp;
	};
	var reqTaskListCall = getMillisecond();
	getCurrentPageObj().find('#requirement_task').bootstrapTable("destroy").bootstrapTable({
				url :dev_resource+"StreamApply/findTaskByStreamTask.asp?SID="+SID+"&req_task_id="+req_task_id+"&call="+reqTaskListCall,
				method : 'get', // 请求方式（*）
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : false, // 是否显示分页（*）
				pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10, // 每页的记录行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
				uniqueId : "REQ_TASK_ID", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				jsonpCallback:reqTaskListCall,
				singleSelect : false,// 复选框单选
				columns : [/*{
					rowspan : 2,
					align : 'center',
					valign : 'middle',
					width : "4%"
				},*/{
					field : 'REQ_TASK_CODE',
					title : '任务编号',
					align : "center",
				},{
					field : 'REQ_TASK_NAME',
					title : '任务名称',
					align : "center",
					formatter:function(value,row,index){return '<a style="color:blue" href="javascript:void(0)" onclick="openReqTaskDetail(\''+row.REQ_TASK_ID+'\')";>'+value+'</a>';}
				},{
					field : 'SUB_REQ_NAME',
					title : '子需求名称',
					align : "center",
				},{
					field : 'VERSIONS_NAME',
					title : '版本名称',
					align : "center",
				}, {
					field : 'REQ_TASK_RELATION_DISPLAY',
					title : '从属关系',
					align : "center"
				}, {
					field : "REQ_TASK_STATE_DISPLAY",
					title : "任务状态",
					align : "center"
				}, {
					field : "SYSTEM_NAME",
					title : "实施应用",
					align : "center"
				}, {
					field : "REQ_OPERATION_DATE",
					title : "计划投产时间",
					align : "center"
				}]
			});
} 






//模态框
function initPopModal(){
	var app_name = $("#currentLoginName").val(); 
	var app_id = $("#currentLoginNo").val();
	getCurrentPageObj().find("#app_man_name").val(app_name);
	getCurrentPageObj().find("#app_man_id").val(app_id);
	//选择应用
	getCurrentPageObj().find("#system_name").unbind("click");
	getCurrentPageObj().find("#system_name").click(function() {
		var system_name = getCurrentPageObj().find("#system_name");
		var system_short = getCurrentPageObj().find("#system_short");
		var system_id = getCurrentPageObj().find("#system_id");
		var config_man_id = getCurrentPageObj().find("#config_man_id");
		var config_man_name = getCurrentPageObj().find("#config_man_name");
		openSystemPop("sendProducePop",{name:system_name,id:system_id,config_man_id:config_man_id,config_man_name:config_man_name,system_short:system_short});
	});
	//选择版本
	getCurrentPageObj().find("#versions_name").unbind("click");
	getCurrentPageObj().find("#versions_name").click(function() {
		openVersionPop("sendProducePop",{name:getCurrentPageObj().find("#versions_name"),id:getCurrentPageObj().find("#versions_id")});
	});
	initVlidate(getCurrentPageObj().find("#streamBasic_form"));
}

//保存按钮
function saveStreamApply(status){
	if(!vlidate(getCurrentPageObj().find("#streamBasic_form"),"",true)){
		return ;
	}
	
	getCurrentPageObj().find("input[name='button']").attr("disabled",true);
	var params = {};
	var selectInfo = getCurrentPageObj().find("#basic_info");
	var inputs = selectInfo.find("input");
	var textareas = selectInfo.find("textarea");
	for (var i = 0; i < inputs.length; i++) {
		var obj = $(inputs[i]);
		params[obj.attr("name")] = $.trim(obj.val());
	}
	for (var i = 0; i < textareas.length; i++) {
		var obj = $(textareas[i]);
		params[obj.attr("name")] = $.trim(obj.val());
	}
	
	
	params["STREAM_ID"] = getCurrentPageObj().find("#stream_id").val();
	params["STREAM_NAME"] = getCurrentPageObj().find("#stream_name").val();
	params["STREAM_STATUS"] = getCurrentPageObj().find("#stream_status").val();
	params["STREAM_TYPE"] = getCurrentPageObj().find("#stream_type").val();
	//获取任务ID
	if(params["STREAM_TYPE"]=="00"){
		var row = getCurrentPageObj().find("#requirement_task").bootstrapTable("getData");
		if(row!=""&&row!=undefined){
			B_REQ_TASK_ID = row[0].REQ_TASK_ID; 
			for(var i=1;i<row.length;i++){
				B_REQ_TASK_ID = B_REQ_TASK_ID+","+row[i].REQ_TASK_ID; 
			}
			params["B_REQ_TASK_ID"] = B_REQ_TASK_ID;
		}
		
	}
	
	
	if(status == "00"){
		params["STREAM_APP_STATUS"] = "00";//保存
	}else if(status == "01"){
		params["STREAM_APP_STATUS"] = "01";//提交
	}
	params["STREAM_APP_ID"] = getCurrentPageObj().find("#stream_app_id").val();
	//查询流是否已经申请 应用+版本
	var valicall = getMillisecond();
	
	var url = dev_resource+'StreamApply/findStreamApply.asp?call='+valicall+'&SID='+SID;
	baseAjaxJsonp(url,params, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			//保存或提交
			var saCall = getMillisecond();
			var url = dev_resource+'StreamApply/addStreamApply.asp?call='+saCall+'&SID='+SID;
			baseAjaxJsonp(url,params, function(data){
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("保存成功！",function(){
						closeCurrPageTab();
					});
				} else {
					alert("保存失败！"+data.msg);
					getCurrentPageObj().find("input[name='button']").attr("disabled",false);
				}
			},saCall);
		}else{
			 alert("流申请已存在！");
			 return;
			 getCurrentPageObj().find("input[name='button']").attr("disabled",false);
		}
	},valicall);
}
//打开任务详情页面
function openReqTaskDetail(req_task_id){
	closeAndOpenInnerPageTab("req_taskDetail","任务详情页面","dev_construction/requirement/requirement_analyze/task_accept/task_detail.html",function(){
		initReqTaskDetailLayout(req_task_id);
	  });
}
initPopModal();