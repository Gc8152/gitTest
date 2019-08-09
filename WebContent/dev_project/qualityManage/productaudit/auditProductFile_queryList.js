initAuditProductFileLayOut();

function refreshAuditSearch(){
	var currTab = getCurrentPageObj();
	var queryForm = currTab.find("#auditProductFileForm");
	var param = queryForm.serialize();
	var table = currTab.find("#auditProductFileTable");
	table.bootstrapTable('refresh',{url:dev_project+'qualityManager/queryProductFileList.asp?SID='+SID+
		"&call=jq_1525748493434_af&" + param});
}
function initAuditProductFileLayOut(){
	var currTab = getCurrentPageObj();
	var queryForm = currTab.find("#auditProductFileForm");
	var table = currTab.find("#auditProductFileTable");

  //初始化字典项
  autoInitSelect(queryForm);

//初始化页面按钮事件
initAuditProductFileQueryBtnEvent();
function initAuditProductFileQueryBtnEvent(){
	//查询
	var query = currTab.find("#audit_search");
	query.click(function() {
		refreshAuditSearch();
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#audit_search").click();});
	//重置
	var reset = currTab.find('#audit_reset');
	reset.click(function() {
		queryForm[0].reset();
		var selects = currTab.find("select");
		for(var i=0; i<selects.length; i++){
			$(selects[i]).select2();
		}
	});
	
  	//执行评审
  	getCurrentPageObj().find("#excute_audit").click(function(){
  		var id = table.bootstrapTable('getSelections');
  		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
		if(id.length!=1){
  			alert("请选择一条数据进行审计!");
  			return ;
  		}
		var conclusion = params[0].AUDIT_CONCLUSION;
		if(conclusion=='01'||conclusion=='02'){
			alert("该阶段文档已经通过审计");
			return;
		}
		var phase = params[0].PHASE;
		if(phase=='12' && conclusion=='03'){
			alert("投产阶段文档请选择待审计的数据！");
			return;
		}
  		closeAndOpenInnerPageTab("excute_audit","执行评审","dev_project/qualityManage/productaudit/excuteAudit_add.html",function(){
			initAuditProductFileLayOut(params[0]);
  		});
  	});
  	
  	//查看评审详情
  	getCurrentPageObj().find("#view_auditdetail").click(function(){
  		var id = table.bootstrapTable('getSelections');
  		var ids=JSON.stringify(id);
		var params=JSON.parse(ids);
  		if(id.length!=1){
  			alert("请选择一条数据进行查看!");
  			return ;
  		}
  		params[0]["view"] = "view";
  		closeAndOpenInnerPageTab("view_auditdetail","审计详情","dev_project/qualityManage/productaudit/excuteAudit_add.html",function(){
  			initAuditProductFileLayOut(params[0]);
  		});
  	});
  	
  
  }
  
//初始化列表
initAuditProductFileList();
function initAuditProductFileList(){//business_code
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	table.bootstrapTable('destroy').bootstrapTable({
		//请求后台的URL（*）
		/*url : dev_project
			+'qualityManager/queryProductFileList.asp?call='
			+auditProductFileListCall+'&SID='+SID,*/
		method : 'get', //请求方式（*）   
		striped : false, //是否显示行间隔色
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
		uniqueId : "ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:"jq_1525748493434_af",
		singleSelect: true,
		/*responseHandler: function(data){//客户端分页
            return data.rows;
        },*/
		onLoadSuccess:function(data){
			gaveInfo();
		},
		columns : [{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle',
		}
		,{
			field : "ID",
			title : "标识",
			align : "center",
			visible:false,
		}
		/*, {
			field : "",
			title : "标识",
			align : "center",
			width : 80,
		}*/
		, {
			field : "FILE_TYPE_DISPLAY",
			title : "产品类型",
			align : "center",
			width : 150,
		}, {
			field : "BUSINESS_CODE",
			title : "业务编号",
			align : "center",
			width : 200,
		},{
			field : "SUB_REQ_NAME",
			title : "需求点名称",
			align : "center",
			width : 200,
		}, /*{
			field : "FILE_NAME",
			title : "文件名称",
			align : "center",
			width : 200,
		},*/ {
			field : "PHASE_DISPLAY",
			title : "文档所处任务阶段",
			align : "center",
			width : 150,
			formatter:function(value,row,index){
				if(value=="" || value == undefined || value==null){
					return "SIT测试";
				}else if(value=="待受理"){
					return "需求提出";	
			    }else{
				    return value;
				}
			}
		}, {
			field : "P_OWNER_NAME",
			title : "责任人",
			align : "center",
			width : 100,
		}, /*{
			field : "OPT_TIME",
			title : "文档提交日期",
			align : "center",
			width : 150,
		},*/{
			field : "AUDIT_STATE_DISPLAY",
			title : "审计状态",
			align : "center",
			width : 100,
			formatter:function(value,row,index){
				if(value=="" || value == undefined || value==null){
					return "待审计";
			    }else{
				    return value;
				}
			}
		},{
			field : "AUDIT_CONCLUSION_DISPLAY",
			title : "审计结论",
			align : "center",
			width : 120,
		},{
			field : "NOCONFIRM_NUM",
			title : "不符合项个数",
			align : "center",
			width : 150,
		},{
			field : "CLOSE_NUM",
			title : "已关闭不符合项个数",
			align : "center",
			width : 170,
		},{
			field : "AUDIT_STARTDATE",
			title : "审计日期",
			align : "center",
		    width : 150,	
		}]
	});
}
}

(function(){
	try{
		if(isRun){
			refreshAuditSearch();
		}
	}catch(e){
		refreshAuditSearch();
	}
})();