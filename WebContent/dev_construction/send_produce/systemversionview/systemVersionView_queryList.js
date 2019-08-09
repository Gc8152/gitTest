/**
 * 获取查询参数
 * @returns 
 */
function getSysAndVerQueryParam(){
	var param={};
	var queryCondition = getCurrentPageObj().find("#queryCondition [name]");
	for(var i=0;i<queryCondition.length;i++){
		var obj=$(queryCondition[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=$.trim(obj.val());
		}
	}
	return param;
}

/**
 * 获取时间戳
 */
var systemVersionView_queryList_call = getMillisecond();
/**
 * 组装查询url 
 * @returns {String}
 */
function uatSysAndVerUrl(){
	var url = dev_construction+'sysVerView/querySystemVersionView.asp?call='+systemVersionView_queryList_call+'&SID='+SID;
	var queryCondition = getCurrentPageObj().find("#queryCondition [name]");
	for(var i=0; i<queryCondition.length; i++){
		var obj=$(queryCondition[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent($.trim(obj.val())));
		}
	}
	return url;
}
//初始化列表
(function () {
	var queryParams=function(params){
		var temp = getSysAndVerQueryParam();
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#systemVersionViewTable").bootstrapTable(
			{
				url : dev_construction+'sysVerView/querySystemVersionView.asp?call='+systemVersionView_queryList_call+'&SID='+SID,
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
				jsonpCallback: systemVersionView_queryList_call,
				onLoadSuccess:function(data){
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : '',
					title : '序号',
					align : 'center',
					width :"5%",
					formatter: function(value, row, index) {
						return index+1;
					}
				},{
					field : 'VERSIONS_ID',
					title : '版本ID',
					align : 'center',
					visible: false
				},{
					field : 'SYSTEM_NAME',
					title : '应用名称',
					align : "center",
					width :"15%",
				},{
					field : 'PROJECT_MAN_NAME',
					title : '项目经理',
					align : "center",
					width :"10%",
				},{
					field : 'VERSIONS_NAME',
					title : '版本名称',
					align : "center",
					width :"15%",
				},{
					field : 'RELATE_NUM',
					title : '关联任务数量',
					align : "center",
					width :"10%",
				},{
					field : "SEND_NUM",
					title : "已投任务数量",
					align : "center",
					width :"10%",
				}, {
					field : "PUTIN_COUNT",
					title : "投产申请次数",
					align : "center",
					width :"10%",
				}, {
					field : "ableNum",
					title : "满足投产任务数",
					align : "center",
					width :"11%",
				}, {
					field : "disAbleNum",
					title : "不满足投产任务数",
					align : "center",
					width :"12%",
				} ]
			});
})();

//初始化页面按钮事件
(function() {	
	//重置按钮
	getCurrentPageObj().find("#reset").click(function(){
		getCurrentPageObj().find("#queryCondition input").val("");
	});
	
	//查询按钮事件
	getCurrentPageObj().find("#query").unbind("click");
	getCurrentPageObj().find("#query").click(function(){
		getCurrentPageObj().find("#systemVersionViewTable").bootstrapTable("refresh",{url:uatSysAndVerUrl()});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query").click();});
	//查看详情
	getCurrentPageObj().find("#detail").unbind("click");
	getCurrentPageObj().find("#detail").click(function(){
		var selections = getCurrentPageObj().find("#systemVersionViewTable").bootstrapTable('getSelections');
		if(selections.length != 1) {
			alert("请选择一条数据进行操作!");
			return;
		}
		var dataStr = JSON.stringify(selections[0]).toLowerCase();
		var data = JSON.parse(dataStr);
		closeAndOpenInnerPageTab("systemVersionView_detail.html","应用版本总览详情","dev_construction/send_produce/systemversionview/systemVersionView_detail.html",function(){
			//基本信息
			for(var k in data) {
				getCurrentPageObj().find("#"+k).text(data[k]);
			}
			queryAbleAndDisableList(selections[0]);
			querySendProTaskList(data["system_id"],data["versions_id"]);
			//queryMeetDemandTaskList(data["system_id"],data["versions_id"]);
			//queryNoMeetDemandTaskList(data["system_id"],data["versions_id"]);
		});
	});
	
})();	