initProblemListLayout();
;function initProblemListLayout(){
	var currTab = getCurrentPageObj();
	
	var form = currTab.find("#problem_commit_form");
	var table = currTab.find("#problem_InfoTable");
	autoInitSelect(form);
	//查询按钮
	var commit = currTab.find("#commit");
	commit.click(function(){
		initTable();
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#commit").click();});
	//重置按钮
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
		currTab.find("input[name=APPROVE_OWNER]").val("");
	});

	
	getCurrentPageObj().find("#importProblemJury").click(function(){
		getCurrentPageObj().find("#supplier_import").modal("show");
	});
	
    //查看按钮
	var problem_Info = currTab.find("#problem_Info");
	problem_Info.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		openInnerPageTab("problem_quenyInfo","问题单查看页面","dev_construction/fault/problem/problem_quenyInfo.html",function(){
			
			initProblemQuenyInfoLayout(rows[0].PROBLEM_ID);
			/*var queny_hide = currTab.find("[hid='queny_hide']");//初始化
			queny_hide.hide();*/
		});
	});
	//处理按钮
	var problem_handle = currTab.find("#problem_handle");
	problem_handle.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行处理!");
			return ;
		}
		if(rows[0].APPROVE_NODE!="06"&&rows[0].APPROVE_NODE!="00"){
			alert(rows[0].APPROVE_NODE+" 状态不能被处理!");
			return ;
		}
		openInnerPageTab("problem_handle","问题单处理页面","dev_construction/fault/problem/problem_handle.html",function(){
			$("#Ulsecond").attr("class","active");
			$("#tab2").removeAttr("class"); 
			$("#tab2").attr("class","tab-pane fade in active");
			$("#home").removeAttr("class"); 
			$("#home").attr("class","tab-pane fade");
			initProblemHandleLayout(rows[0].PROBLEM_ID,rows[0].SERNO);
		});
	});
	//新增
	var problem_add = currTab.find("#problem_add");
	problem_add.click(function(){
		openInnerPageTab("problem_add","问题单新增","dev_construction/fault/problem/problem_add.html",null);
	});
	
	/*返回*/
	var configManage_back = currTab.find("#configManage_back");
	configManage_back.click(function(){
		closeCurrPageTab();
	});
	
	/**		初始化table	**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	initTable();
	
	function initTable(){
		var param = form.serialize();
		var kind=1;//查询分类（用于区分列表查询还是审批查询）， 由于列表与审批查询字段不同要求
		var call = getMillisecond();
		table.bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
			url : dev_construction+'Problem/problemQueryList.asp?call='+call+'&SID='+SID+"&"+param+"&kind="+kind,
			method : 'get', //请求方式（*）   
			striped : false, //是否显示行间隔色
			cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, //是否启用排序
			sortOrder : "asc", //排序方式
			queryParams : queryParams,//传递参数（*）
			sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
			pagination : true, //是否显示分页（*）
			pageList : [10,15],//每页的记录行数（*）
			pageNumber : 1, //初始化加载第一页，默认第一页
			pageSize : 10,//可供选择的每页的行数（*）
			clickToSelect : true, //是否启用点击选中行
			uniqueId : "PROBLEM_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:call,
			singleSelect: true,
			columns : [ {
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			}, {
				field : 'SERNO',
				title : '流水号',
				align : "center",
				width : "14%"
			/*}, {
				field : "PROBLEM_ID",
				title : "问题单编号",
				align : "center"*/
			/*}, {
				field : "IMPORTANCE_LEVEL",
				title : "重要程度",
				align : "center"*/
			}, {
				field : "PBMTYPE",
				title : "问题类别",
				align : "center"
			}, {
				
				field : "PRIORITY",
				title : "优先级",
				align : "center",
				width : "8%"
			}, {
				field : "IMPORTANCE_LEVEL",
				title : "重要程度",
				align : "center",
				width : "8%"
			}, {
				field : "URGENCY_LEVEL",
				title : "紧急程度",
				align : "center",
				width : "8%"
			}, {
				field : "STATUS",
				title : "状态",
				align : "center",
				width : "8%"
			}, {	
				field : "INPUT_ID",
				title : "创建人",
				align : "center",
				width : "9%"
			}, {
				field : "INPUT_DATE",
				title : "创建时间",
				align : "center"
			},{
				
				field : "PROBLEMORIGIN",
				title : "问题来源",
				align : "center",
				visible : false
			}, {
				field : "DESCRIPTIONS",
				title : "问题描述",
				align : "center",
				visible : false
			}, {
				field : "APPROVE_NODE",
				title : "当前环节",
				align : "center",
				visible : false
			}, {
				field : "PRJ_HANDLER_NAME",
				title : "项目经办人",
				align : "center",
				visible : false
			}, {
				field : "APPROVE_OWNER_NAME",
				title : "当前责任人",
				align : "center",
				visible : false
			}, {
				field : "CDAT_HAPPENDATE",
				title : "问题发生时间",
				align : "center",
				visible : false
			}]
		});
	}
	
	
	/**处理人模态框开始**/
	//点击打开模态框
	var acceptCall = getMillisecond();
	var APPROVE_OWNER = currTab.find("input[name=APPROVE_OWNER_NAME]");
	APPROVE_OWNER.click(function(){
		openUserPop("problem_man_pop",{name:$(this),no:currTab.find("input[name=APPROVE_OWNER]")});
	});
	
	
}


//上传文件
function importJury(req_task_state,id,fileId){
	var records2 = getCurrentPageObj().find('#'+id).bootstrapTable('getSelections');
	
	
	var text = getCurrentPageObj().find('#supplierfield').val();
	if(text==""){
		alert("请上传文件");
		return;
	}
	var importCall=getMillisecond();
	startLoading();
	 $.ajaxFileUpload({
		    url:dev_construction+"Problem/importPhaseFile.asp?SID="+SID,
		    type:"post",
			secureuri:false,
			fileElementId:fileId,
			data:'',
			dataType:"json",
			/*jsonp: "callback",//服务端用于接收callback调用的function名的参数  
	        jsonpCallback: importCall,//回调函数名称，需要与后台返回的json数据串前缀保持一致
	       */
			success:function (msg){
				endLoading();
				getCurrentPageObj().find("#"+fileId).val("");
				getCurrentPageObj().find("#supplierfield").val("");
				$("#supplier_import").modal("hide");
				
				
				if(msg&&msg.result=="true"){
					alert("导入成功",function(){
						getCurrentPageObj().find("#"+id).bootstrapTable("refresh");
					});
				}else if(msg&&msg.error_info){
					alert("导入失败:"+msg.error_info);
				}else{
					alert("导入失败！");
				}
			},
			error: function (msg){
				endLoading();
				alert("导入失败！");
			}
	   });
}
