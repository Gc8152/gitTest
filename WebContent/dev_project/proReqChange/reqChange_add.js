$(function(){
	$("#application_purpose").css("height","200px");
	
});

//按钮方法
function initChangeButtonEvent(req_change_id){	
	if(req_change_id == "0"){
		var call = getMillisecond()+'1';
	    var url = dev_project+"PChangeReq/getSerialNumberSeq.asp?SID="+SID+"&call="+call;
		baseAjaxJsonp(url,{}, function(data){
			if (data&&data.result=="true") {
				var codeNum=data.seqCode;
				//把生成的编号写到页面
				getCurrentPageObj().find("#change_code").val(codeNum);
			} else {
				alert("流水号获取失败！");
			}
		}, call, false);
	}

	getCurrentPageObj().find("#change_subtype").attr("disabled",true);
	//保存
	getCurrentPageObj().find("#addChangeReq").click(function(){
		if(!vlidate(getCurrentPageObj().find("#addChange_from"))){
			alert("还有必填项未填");
			return ;
		}
		saveChange("01");
		
	});
	//保存并发起
	getCurrentPageObj().find("#saveAndSubmit").click(function(){
		if(!vlidate(getCurrentPageObj().find("#addChange_from"))){
			alert("还有必填项未填");
			return ;
		}
		var versions_id = getCurrentPageObj().find("#versions_id").val();
		var system_id = getCurrentPageObj().find("#system_id").val();
		var seles = getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable('getData');
		if(seles==""||seles==null){
			alert("无可变更的任务！");
			return;
		}
		var reqTaskId = $.map(seles,function(row){
			return row.REQ_TASK_ID;
		}).join(",");

		var task_names = '';
		var task_id = $.map(seles,function(row){
			if(row.REQ_TASK_STATE=='12'){
				if(task_names == ''){
					task_names = row.REQ_TASK_NAME;
				}else{
					task_names = task_name+","+row.REQ_TASK_NAME;
				}
				return row.REQ_TASK_ID;
			}
			return task_names;
		});
		
		if(task_names.toString() != ""){
			alert("存在已提交投产的任务不能发起变更！");
			return;
		}
		
		//查询当前的任务是否在变更中
		var call2 = getMillisecond()+'2';
	    var url = dev_project+"PChangeReq/queryReqTaskIsChange.asp?SID="+SID+"&call="+call2+'&VERSIONS_ID='+versions_id+'&SYSTEM_ID='+system_id+'&REQTASKID='+reqTaskId;
		baseAjaxJsonp(url,{}, function(data){
			if (data&&data.result=="true") {
				var item = {};
				var id = getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable('getData');
				var is_hasAssist = false;
				var P_OWNER = $.map(id, function (row) {
					if(row.P_OWNER==SID){//如果是当前登录人，表明是主办项目经理，则不用参与审批
						return "";
					}
					if(row.REQ_TASK_RELATION=="02"){
						is_hasAssist = true;
					}
					return row.P_OWNER;
				});
				P_OWNER = P_OWNER.toString();
				item["af_id"] = '81';//流程id
				item["systemFlag"] = '03'; //系统标识（合同系统：00，项目系统：01，报销系统：02，工程管理：03）
				item["biz_id"] = getCurrentPageObj().find("#change_code").val();//业务id
				item["p_project_manager"] = "101";//总行的项目管理岗
				item["r_project_group"] = getCurrentPageObj().find("#res_group_id").val();//主办应用对应的负责项目组
				item["r_project_manager"] = '101';//总行的项目管理组组长
				item["p_task_owner"] = P_OWNER;//关联任务项目经理
				var change_type=getCurrentPageObj().find("#change_subtype").val();
				
				//n_chang_type（路由要素）:01 加塞，02补协办，03版本调出，04版本调出（无协办），05版本加塞（无协办）
				
				if(is_hasAssist){//如果有协办
					item["n_chang_type"] = change_type;	
				}else{//无协办
					if(change_type=="01"){
						item["n_chang_type"] = "05";
					}else if(change_type=="03"){
						item["n_chang_type"] = "04";
					}
				}
				
				
				/*if(P_OWNER=="" && change_type=='01'){
					item["n_chang_type"] = "03";	//版本调出流程，，，，，	
				}*/
				
				approvalProcess(item,function(data){
					saveChange("02");
				});
			} else {
				alert("该需求任务正在变更中！");
			}
		}, call2, false);
	});
	
	
	getCurrentPageObj().find("#changePlan").click(function(){
		if(!vlidate(getCurrentPageObj().find("#addChange_from"))){
			alert("还有必填项未填");
			return ;
		}
        saveChange("03");
	});
	


	getCurrentPageObj().find("#change_Task").click(function(){ 
		var state_type = getCurrentPageObj().find("#change_subtype").val();
		var versions_id = getCurrentPageObj().find("#versions_id").val();
		var system_id = getCurrentPageObj().find("#system_id").val();
		if(versions_id=="" || system_id==""){
			alert("应用或版本不能为空");
			reutrn;
		}
		openChangeTaskPop("addDivChange",{system_id:getCurrentPageObj().find("#system_id"),state_type:state_type,versions_id:versions_id});
	});
	
	//加载应用pop
	getCurrentPageObj().find('#system_name').click(function(){
		
		openTaskSystemPop("addDivChange",{sysno:getCurrentPageObj().find("#system_id"),sysname:getCurrentPageObj().find("#system_name"),res_group_id:getCurrentPageObj().find("#res_group_id")});
	});
	//加载版本pop
	getCurrentPageObj().find('#versions_name').click(function(){
		openTaskVersionChangePop("addDivChange",{versionsid:getCurrentPageObj().find('#versions_id'),versionsname:getCurrentPageObj().find('#versions_name')});
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
	getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable("destroy").bootstrapTable({
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
			field : "REQ_TASK_RELATION",
			title : "操作",
			align : "center",
			formatter:function(value, row, index) {
				var edit='<span class="hover-view" '+
				'onclick="viewTaskDetail('+row.REQ_TASK_ID+')">查看</span>';
				if(value == '01')
					edit = edit+'/<span class="hover-view" cursor:pointer;" onclick="delSendProTask('+row.SUB_REQ_ID+');">删除</span>';
				 return edit; 
			}
		}]
	});
}

//删除一行
function delSendProTask(id) {
	//删除该行
	//getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable("removeByUniqueId", id);	
	var param = getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable("getData");
	var ids = $.map(param, function (row) {
		if(row.SUB_REQ_ID==id){
			return row.REQ_TASK_ID;
		}
		return;
	});	
	getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable('remove', {
		field: 'REQ_TASK_ID',
		values: ids
	});	
	
}


//下拉框方法
function initSUserType(){

	//初始化数据
	initSelect(getCurrentPageObj().find("#phased_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQTASK_STATE"});

}

function gradeChange(){
	var change_sub = getCurrentPageObj().find("#change_subtype").val();
	if(change_sub == '01'){
		getCurrentPageObj().find("#version_text2").show();
		getCurrentPageObj().find("#version_text1").show();
	}else{
		getCurrentPageObj().find("#version_text2").hide();
		getCurrentPageObj().find("#version_text1").hide();
	}
	
}

function saveChange(change_state){
	var sendData = getCurrentPageObj().find("#tableChaneTaskInfo").bootstrapTable('getData');
	if(sendData.length == 0) {
		alert("没有要变更的任务！");
		return;
	}
	
	var taskInfos="";
	var old_versions_ids = "";
	taskInfo=$.map(sendData, function (row) {
		if(taskInfos==""){
			taskInfos = row.REQ_TASK_ID;
			old_versions_ids = row.VERSION_ID;
		}else{
			taskInfos = taskInfos+","+row.REQ_TASK_ID;
			old_versions_ids = old_versions_ids+","+row.VERSION_ID;
		}
		return row.REQ_TASK_ID;
	});
	var expertsCall = getMillisecond();
    var params = getPageParam("G");		//遍历当前页面的input,text,select
    params['change_state'] = change_state;
    params['req_task_ids'] = taskInfos;
    params['old_versions_ids'] = old_versions_ids;
	baseAjaxJsonp(dev_project+'PChangeReq/insertChangeReq.asp?call='+expertsCall+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			closePageTab("changeReq_add");
			alert("操作成功");
		}else{
			alert("操作失败");
		}
	},expertsCall);
}


//$("#orgDivPop").load("pages/sorg/sorgPop.html");
//initAddExpertButtonEvent();
initSUserType();
