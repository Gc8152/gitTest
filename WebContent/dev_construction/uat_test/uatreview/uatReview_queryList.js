//初始化下拉数
(function(){
	//提出部门
	getCurrentPageObj().find("#req_put_dept").click(function(){
		openSelectTreeDiv($(this),"req_put_dept_tree_uatReview_queryList","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top":"2px", width:"225px", height:"200px"},function(node){
			getCurrentPageObj().find("#req_put_dept").val(node.name);
			getCurrentPageObj().find("input[name='req_put_dept']").val(node.id);
		});
	});
	//主管部门
	getCurrentPageObj().find("#req_dept").click(function(){
		openSelectTreeDiv($(this),"req_dept_tree_uatReview_queryList","SOrg/queryOrgTreeWithCenterList.asp",{"margin-top":"2px", width:"225px", height:"200px"},function(node){
			getCurrentPageObj().find("#req_dept").val(node.name);
			getCurrentPageObj().find("input[name='req_dept']").val(node.id);
		});
	});
})();

/**aa
 * 组装查询url 
 * @returns {String}
 */
function uatReviewQueryUrl(){
	var url = dev_construction+"UatReview/queryallreqsubsinfo.asp?SID="+SID+"&call="+uatReview_queryList_call;
	var fds=getCurrentPageObj().find("#reqSubsInfoTerm input");
	for(var i=0; i<fds.length; i++){
		var obj=$(fds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}

/**
 * 获取查询参数
 * @returns 
 */
function getUatReviewQueryParam(){
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

//获取时间
var uatReview_queryList_call = getMillisecond();
/**
 * 查询列表显示table
 */
(function () {
	var queryParams=function(params){
		var temp = getUatReviewQueryParam();
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#reqSubsInfoTable").bootstrapTable(
			{
				url : dev_construction+'UatReview/queryallreqsubsinfo.asp?call='+uatReview_queryList_call+'&SID='+SID,
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
				jsonpCallback: uatReview_queryList_call,
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
					title : "需求点状态",
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
					align : "center",
				}, {
					field : "CREATE_TIME",
					title : "创建时间",
					align : "center",
					visible: false
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
		getCurrentPageObj().find("#reqSubsInfoTable").bootstrapTable("refresh",{url:uatReviewQueryUrl()});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryReqSubs").click();});
	//UAT评审文档上传
	getCurrentPageObj().find("#reviewDocUpload").unbind("click");
	getCurrentPageObj().find("#reviewDocUpload").click(function(){
		var id = getCurrentPageObj().find("#reqSubsInfoTable").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行操作!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.SUB_REQ_ID;                    
		});
		closeAndOpenInnerPageTab("uatReview_edit","UAT评审文档上传","dev_construction/uat_test/uatreview/uatReview_edit.html",function(){
			initSubReqInfo(ids);	
		});
	});
	getCurrentPageObj().find("#detail").unbind("click");
	getCurrentPageObj().find("#detail").click(function(){
		var id = getCurrentPageObj().find("#reqSubsInfoTable").bootstrapTable('getSelections');
		if(id.length!=1){
			alert("请选择一条数据进行操作!");
			return ;
		}
		var ids = $.map(id, function (row) {
			return row.SUB_REQ_ID;                    
		});
		closeAndOpenInnerPageTab("uatReview_detail","UAT评审文档详情","dev_construction/uat_test/uatreview/uatReview_detail.html",function(){
			initSubReqInfo(ids);	
		});
	});
})();

