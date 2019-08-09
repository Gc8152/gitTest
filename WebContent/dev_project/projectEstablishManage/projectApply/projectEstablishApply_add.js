	
function initProjectApplyAddLayout(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题

	var tableCall = getMillisecond();
	var table = currTab.find("#table_ApplyDemand");
	
	//赋值
	for (var key in item) {
		currTab.find("div[name="+key+"]").html(item[key]);
		currTab.find("textarea[name="+key+"]").val(item[key]);
	}
	$("input[name='IS_POC'][value="+item.IS_POC+"]").prop("checked",true);
	/**初始化按钮开始**/	
	
	
		 /**初始化按钮结束**/
		 //附件上传
		 var tablefile = getCurrentPageObj().find("#reqadd_filetable");
		 var business_code = "";
		 business_code = getCurrentPageObj().find("#file_id_reqAdd").val();
		 if(typeof(business_code)!="undefined"){
				 business_code = Math.uuid();
				 getCurrentPageObj().find("#file_id_reqAdd").val(business_code);
		 }

		 //点击打开模态框
		 var addfile = getCurrentPageObj().find("#reqadd_file");
		
		 
		 addfile.click(function(){
			 var paramObj = new Object();
			 paramObj.FILE_DIR = business_code;
			//var req_id=getCurrentPageObj().find('#req_id_reqAdd').val();
		 	openFileFtpUpload(getCurrentPageObj().find("#reqadd_modalfile"), tablefile, 'GZ1063',business_code, '01', 'S_DIC_PROJECT_PUT_FILE', false,false, paramObj);
		 });

		 //附件删除
		 var delete_file = getCurrentPageObj().find("#reqdelete_file");
		 delete_file.click(function(){
		 	delFtpFile(tablefile, business_code, "01");
		 });
		 
		 getFtpFileList(tablefile, getCurrentPageObj().find("#reqadd_fileview_modal"), business_code, "01");
	
	//保存
	var save = currTab.find("#save_projectApply");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		
		initApplysave(false);
	});
	//保存并提交
	var submit = currTab.find("#submit_projectApply");
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		item["af_id"] = '41';
		item["systemFlag"] = '01';
		item["biz_id"] = item.DRAFT_ID;
		
		//{af_id:"10",systemFlag:"01",biz_id:item.DRAFT_ID,r_projectscale:item.PROJECT_SCALE,pm_id:item.PM_ID}
		approvalProcess(item,initApplysave(true));
		
	});
	//返回
	var back = currTab.find("#back_projectApply");
	back.click(function(){
		closeCurrPageTab();
		//openInnerPageTab("back_project","返回","dev_project/projectEstablishManage/projectEstablish/projectEstablish_queryList.html");
	});
	  
	function initApplysave(isCommit){
		var param = {};
		var selecttInfo = currTab.find("#apply_select");
		var textareas = selecttInfo.find("textarea");
		for (var i = 0; i < textareas.length; i++) {
			var obj = $(textareas[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		param["DEMAND_ORDER_ALL"]='';
		var records = $("#table_ApplyDemand").bootstrapTable('getData');
		if(records.length==0&&item.PROJECT_TYPE!='SYS_DIC_INFO_DISCUSS_PROJECT'){
			alert("请至少选择一条需求单!");
			return ;
		}else if(item.PROJECT_TYPE!='SYS_DIC_INFO_DISCUSS_PROJECT'){
			var system_id = records[0].SYSTEM_ID;
			for(var j=0;j<records.length;j++){
				 if(records[j].SYSTEM_ID!=undefined&&system_id!=records[j].SYSTEM_ID){
					 alert("需求对应的应用不相同，不能保存");
					 return false;
				 }
			}
			var demand="";
			for(var h=0;h<records.length;h++){
	 			 demand += "," + records[h].REQ_ID;
	 		}
			demands = demand.slice(1);
			param["DEMAND_ORDER_ALL"]=demands;
		}
		param["DRAFT_ID"]=item.DRAFT_ID;
		param["IS_COMMIT"]=isCommit;
		param["IS_POC"]=$("input[name='IS_POC']:checked").val();
		param["FILE_ID"]=$("#file_id_reqAdd").val();
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"draftProApply/InsertDraftPro.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
	       		//openInnerPageTab("back_project","返回","dev_project/projectEstablishManage/projectEstablish/projectEstablish_queryList.html");
			}else{ 
				alert(data.msg);
			}
		}, call);
	}
	
	//选择需求单
	var demand = currTab.find("#add_demandApply");
	demand.click(function(){
		$("#demandApply_table").modal('show');
	});
	//需求单列表显示
	table.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
		cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sortable : true, //是否启用排序
		sortOrder : "asc", //排序方式
		//queryParams : queryParams,//传递参数（*）
		sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
		pagination : false, //是否显示分页（*）
		pageList : [10,15],//每页的记录行数（*）
		pageNumber : 1, //初始化加载第一页，默认第一页
		pageSize : 10,//可供选择的每页的行数（*）
		clickToSelect : true, //是否启用点击选中行
		uniqueId : "REQ_CODE", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'Number',
			title : '序号',
			align : "center",
			width: "8%",
			
			sortable: true,
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'REQ_ID',
			title : '需求id',
			align : "center",
			visible : false
		}, {
			field : 'REQ_CODE',
			title : '需求编号',
			align : "center",
			formatter: function (value, row, index) {
				return '<span num='+row.REQ_CODE+' class="hover-view" '+
				'onclick="view_applyDemand(this)">'+value+'</span>';
			}
		}, {
			field : "REQ_NAME",
			title : "需求名称",
			align : "center"
		},{
			field : "REQ_STATE",
			title : "需求状态",
			align : "center",
			visible : false
		}, {
			field : "REQ_STATE_NAME",
			title : "需求状态",
			align : "center"
		}, {
			field : "REQ_CLASSIFY_NAME",
			title : "需求分类 ",
			align : "center"
		}, {
			field : 'SYSTEM_ID',
			title : '应用id',
			align : "center",
			visible : false
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center"
		}, {
			field : "REQ_CLASSIFY",
			title : "需求分类 ",
			align : "center",
			visible : false
			
				
		}, {
			field : "DID",
			title : "操作",
			align : "center",
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="deleteInfo('+index+')">删除</span>';
			}
		}]
	});
	table.bootstrapTable("refresh",{
		url:dev_project+"draftPro/queryListDraftDemandOrder.asp?SID="+SID+'&DRAFT_ID='+item.DRAFT_ID});
	/**初始化按钮结束**/

	
	/**需求单模态框开始**/
	var demandInfo = currTab.find("#table_demandInfo");
	//需求查询
	var query = currTab.find("#select_demand");
	query.click(function(){
		var REQ_CODE = currTab.find("input[name=REQ_CODE]").val();
		var REQ_NAME = currTab.find("input[name=REQ_NAME]").val();
		demandInfo.bootstrapTable('refresh',{
			url: dev_project + 'draftPro/queryListReqInfo.asp?call=' + tableCall + '&SID=' + SID+'&PROJECT_TYPE=' + item.PROJECT_TYPE
			+ '&REQ_CODE=' + REQ_CODE
			+ '&REQ_NAME=' + REQ_NAME});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#select_demand").click();});
	//需求重置
	var reset = currTab.find("#reset_project");
	reset.click(function(){
		currTab.find("input[name=REQ_CODE]").val("");
		currTab.find("input[name=REQ_NAME]").val("");
	});
	//需求选择
	var select = currTab.find("#select");
	select.click(function(e){
		//点击选择按钮，获取复选框中被选中的记录id
		if($("#table_demandInfo").find("input[type='checkbox']").is(':checked')){
			var rol = $("#table_demandInfo").bootstrapTable('getSelections');
			var bat = $("#table_ApplyDemand").bootstrapTable('getData');
			for(var i=0;i<rol.length;i++){
				for(var j=0;j<bat.length;j++){
					if(rol[i].REQ_CODE==bat[j].REQ_CODE){
						var id=bat[j].REQ_CODE;
						$('#table_ApplyDemand').bootstrapTable("removeByUniqueId", id);
					}
				}
				$('#table_ApplyDemand').bootstrapTable("append",rol[i]);
			}
			$("#demandApply_table").modal("hide");
		}else{
			e.preventDefault();
	        $.Zebra_Dialog('请选择一条或多条要添加的记录!', {
	            'type':     'close',
	            'title':    '提示',
	            'buttons':  ['是'],
	            'onClose':  function(caption) {
	            	if(caption=="是"){
	            	}
	            }
	        });
		}
	});
	//需求模态框列表
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	demandInfo.bootstrapTable({
		//请求后台的URL（*）
		url:dev_project+'draftPro/queryListReqInfo.asp?call='+tableCall+'&SID='+SID+'&PROJECT_TYPE='+item.PROJECT_TYPE,
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
		uniqueId : "REQ_CODE", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:tableCall,
		singleSelect: false,
		columns : [ {
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		}, {
			field : 'Number',
			title : '序号',
			align : "center",
			sortable: true,
			width: "8%",
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'REQ_CODE',
			title : '需求编号',
			align : "center"
		}, {
			field : "REQ_NAME",
			title : "需求名称",
			align : "center"
		}, {
			field : "REQ_STATE_NAME",
			title : "需求状态",
			align : "center"
		}, {
			field : "REQ_CLASSIFY_NAME",
			title : "需求分类 ",
			align : "center"
		}, {
			field : 'SYSTEM_ID',
			title : '应用id',
			align : "center",
			visible : false
		}, {
			field : "SYSTEM_NAME",
			title : "应用名称",
			align : "center"
		}]
	});
	/**需求单模态框结束**/
/*	//初始化审批内容
	if(item.INSTANCE_ID!=""&&item.INSTANCE_ID!=undefined&&item.INSTANCE_ID!=null){
		initAFApprovalInfo(item.INSTANCE_ID);
	}*/
}

//需求表里的删除
function deleteInfo(index){
	var rol = $("#table_ApplyDemand").bootstrapTable('getData')[index];
	var id=rol.REQ_CODE;
	$('#table_ApplyDemand').bootstrapTable("removeByUniqueId", id);
}
//查看需求单详情信息
function view_applyDemand(obj){
	 var req_code=$(obj).attr("num");
	 opendemandPop("applyDemand",req_code);
}

initVlidate(getCurrentPageObj());

//页面内容收缩
$(function(){
      EciticTitleI();
});