//初始化下拉数
(function(){
	//提出部门
	getCurrentPageObj().find("#req_put_dept").click(function(){
		openSelectTreeDivToBody($(this),"req_put_dept_tree_uatTracking_queryList","SOrg/queryOrgTreeWithCenterList.asp",30,function(node){
			getCurrentPageObj().find("#req_put_dept").val(node.name);
			getCurrentPageObj().find("input[name='req_put_dept']").val(node.id);
		});
	});
	//主管部门
	getCurrentPageObj().find("#req_dept").click(function(){
		openSelectTreeDivToBody($(this),"req_dept_tree_uatTracking_queryList","SOrg/queryOrgTreeWithCenterList.asp",30,function(node){
			getCurrentPageObj().find("#req_dept").val(node.name);
			getCurrentPageObj().find("input[name='req_dept']").val(node.id);
		});
	});
})();
/**
 * 组装查询url 
 * @returns {String}
 */
function uatTrackingQueryUrl(){
	var url = dev_construction+"UatReview/queryallreqsubsinfo.asp?SID="+SID+"&call="+uatTracking_queryList_call;
	var inputs=getCurrentPageObj().find("#reqSubsInfoTerm input");
	for(var i=0; i<inputs.length; i++){
		var obj=$(inputs[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}

/**
 * 获取查询参数
 */
function getUatTrackingQueryParam(){
	var param={};
	var inputs=	getCurrentPageObj().find("#reqSubsInfoTerm input");
	for(var i=0;i<inputs.length;i++){
		var obj=$(inputs[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	var selects = getCurrentPageObj().find("#reqSubsInfoTerm select");
	for(var i=0;i<selects.length;i++){
		var obj=$(selects[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	return param;
}

var uatTracking_queryList_call = getMillisecond();

/**
 * 查询列表显示table
 */
(function() {
	//autoInitSelect($("#reqSubsInfoTerm"));
	var queryParams=function(params){
		var temp = getUatTrackingQueryParam();
		temp["limit"] = params.limit; 
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#reqSubsInfoTable").bootstrapTable(
			{
				url : dev_construction+'UatReview/queryallreqsubsinfo.asp?call='+uatTracking_queryList_call+'&SID='+SID,
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
				uniqueId : "sub_req_id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: uatTracking_queryList_call,
				onLoadSuccess:function(data){
					gaveInfo();
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'SUB_REQ_ID',
					title : '需求点ID',
					align : 'center',
					visible:false
				},{
					field : 'REQ_ID',
					title : '需求ID',
					align : 'center',
					visible:false
				},{
					field : 'SUB_REQ_CODE',
					title : '需求点编号',
					align : "center"
				},{
					field : 'SUB_REQ_NAME',
					title : '需求点名称',
					align : "center"
				},{
					field : "SUB_REQ_STATE",
					title : "状态",
					align : "center"
				}, {
					field : "PLAN_ONLINETIME",
					title : "计划投产时间",
					align : "center"
				}, {
					field : "REQ_CODE",
					title : "需求编号",
					align : "center"
				}, {
					field : "REQ_NAME",
					title : "需求名称",
					align : "center"
				}, {
					field : "REQ_BUSINESSER",
					title : "业务联系人",
					width:100,
					align : "center"
				}, {
					field : "REQ_PUT_DEPT_NAME",
					title : "提出部门",
					width:100,
					align : "center"
				}, {
					field : "REQ_DEPT_NAME",
					title : "主管部门",
					align : "center"
				}, {
					field : "CREATE_TIME",
					title : "创建时间",
					align : "center"
				} ]
			});
})();
/**
 * 初始化页面按钮事件
 */
(function(){
	//重置按钮
	getCurrentPageObj().find("#reset").click(function(){
		getCurrentPageObj().find("#reqSubsInfoTerm input").val("");
		var selects=$("#reqSubsInfoTerm select");
		selects.val(" ");
		selects.select2();
	});
	//查询按钮事件
	getCurrentPageObj().find("#queryReqSubs").unbind("click");
	getCurrentPageObj().find("#queryReqSubs").click(function(){
		getCurrentPageObj().find("#reqSubsInfoTable").bootstrapTable("refresh",{url:uatTrackingQueryUrl()});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryReqSubs").click();});
	//指定UAT负责人
	getCurrentPageObj().find("#assignResperson").unbind("click");
	getCurrentPageObj().find("#assignResperson").click(function(){
		var id = getCurrentPageObj().find("#reqSubsInfoTable").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行操作!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.SUB_REQ_ID;                    
		});
		closeAndOpenInnerPageTab("uatTracking_resperson","指定UAT负责人","dev_construction/uat_test/uattracking/uatTracking_resperson.html",function(){
			initSubReqInfo_person(ids[0]);
			initUatResperson(ids[0]);
			saveUatResperson(ids[0]);
		});
	});
	//UAT周报导入
	getCurrentPageObj().find("#weeklyImport").unbind("click");
	getCurrentPageObj().find("#weeklyImport").click(function(){
		getCurrentPageObj().find("#file_weekly_import").val("");
		getCurrentPageObj().find("#file_weekly_import_id").val("");
		getCurrentPageObj().find("#modal_weekly_import").modal("show");
	});
	getCurrentPageObj().find("#import_weekly_button").unbind("click");
	getCurrentPageObj().find("#import_weekly_button").click(function(){
		startLoading();
		$.ajaxFileUpload({
		    url:dev_construction+'UatTracking/importweeklyinfo.asp?SID='+SID,
		    type:"post",
			secureuri:false,					 //是否启用安全提交，默认为false。 
			fileElementId:'file_weekly_import',  //需要上传的文件域的ID，即<input type="file">的ID。
			data:'',
			dataType: 'jsonp',
			jsonp: "callback",//服务端用于接收callback调用的function名的参数  
	        jsonpCallback: 'jsonp_success',//回调函数名称，需要与后台返回的json数据串前缀保持一致
			success:function (data){
				endLoading();
				getCurrentPageObj().find("#file_weekly_import").val("");
				getCurrentPageObj().find("#modal_weekly_import").modal("hide");
				if(data&&data.result=="true"){
					alert("导入成功");
					//getCurrentPageObj().find("#deviceTableInfo").bootstrapTable("refresh");
				}else if(data&&data.error_info){
					//alert("导入失败:"+data.error_info);
				}else{	
					//alert("导入失败！");
				}
			},
			error: function (data){
				endLoading();
				//alert("导入失败！");
			}
	   });
	});
	//UAT周报查看
	getCurrentPageObj().find("#weeklyQuery").unbind("click");
	getCurrentPageObj().find("#weeklyQuery").click(function(){
		var selection = getCurrentPageObj().find("#reqSubsInfoTable").bootstrapTable('getSelections');
		if(selection.length!=1){
			alert("请选择一条数据进行操作!");
			return ;
		}
		var codes = $.map(selection, function (row) {
			return row.SUB_REQ_CODE;                    
		});
		closeAndOpenInnerPageTab("uatTracking_weeklyList","UAT周报查看","dev_construction/uat_test/uattracking/uatTracking_weeklyList.html",function(){
			initWeeklyList(codes[0]);
		});
	});
})();
	
