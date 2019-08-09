/**
 * 字典初始化方法
 */
(function(){
	initSelect(getCurrentPageObj().find("[name='supervise_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"R_DIC_SUPERVISE_TYPE"});
})();
/**
 * 获取查询参数
 * @returns 
 */
function getSuperviseReportQueryParam(){
	var param={};
	var finds=	getCurrentPageObj().find("#superviseTerm [name]");
	for(var i=0;i<finds.length;i++){
		var obj=$(finds[i]);
		if($.trim(obj.val())!=""){
			param[obj.attr("name")]=obj.val();
		}
	}
	return param;
}
/**
 * 获取时间戳
 */
var SuperviseReport_queryList_call = getMillisecond()+'1';
/**
 * 组装查询url 
 * @returns {String}
 */
function SuperviseReportQueryUrl(){
	var url = dev_report+'SuperviseReport/queryAllSuperviseReport.asp?call='+SuperviseReport_queryList_call+'&SID='+SID+'&supervise_type=T-B-6';
	var finds = getCurrentPageObj().find("#superviseTerm [name]");
	for(var i=0; i<finds.length; i++){
		var obj=$(finds[i]);
		if($.trim(obj.val())!=""){
			url+='&'+obj.attr("name")+"="+escape(encodeURIComponent(obj.val()));
		}
	}
	return url;
}

//初始化列表
(function() {
	var queryParams=function(params){
		var temp = getSuperviseReportQueryParam();
		temp["limit"] = params.limit;
		temp["offset"] = params.offset;
		return temp;
	};
	getCurrentPageObj().find("#superviseReportTable").bootstrapTable(
			{
				url : dev_report+'SuperviseReport/queryAllSuperviseReport.asp?call='+SuperviseReport_queryList_call+'&SID='+SID+'&supervise_type=T-B-6',
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
				uniqueId : "sub_req_id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: SuperviseReport_queryList_call,
				onLoadSuccess:function(data){
				},
				columns : [ {
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'SUPERVISE_ID',
					title : '主键',
					align : 'center',
					visible:false
				},{
					field : 'REPORT_NAME',
					title : '报表名称',
					align : "center"
				},{
					field : 'SUPERVISE_TYPE',
					title : '报表类型',
					align : "center",
					visible: false
				},{
					field : 'FILL_TIME',
					title : '填表时间',
					align : "center"
				},{
					field : "FILL_PERSON_NAME",
					title : "填报人",
					align : "center"
				},{
					field : "FILL_PERSON",
					title : "填报人",
					align : "center",
					visible: false
				}, {
					field : "REPORT_ID",
					title : "报表信息ID",
					align : "center",
					visible: false
				},{
					field : "操作",
					title : "操作",
					align : "center",
					formatter: function(value, row, index) {
						return '<a class="click_text_sp" onclick="updateSuperviseReport('+index+');">修 改</a>/ ' 
							+ '<a class="click_text_sp" onclick="detailSuperviseReport('+index+');">查 看</a>';
					}
				}]
			});
})();


//初始化页面按钮事件
(function() {	
	//重置按钮
	getCurrentPageObj().find("#reset").click(function(){
		getCurrentPageObj().find("#superviseTerm input").val("");
		var selects = getCurrentPageObj().find("#superviseTerm select");
		selects.val(" ");
		selects.select2();
	});
	//查询按钮事件
	getCurrentPageObj().find("#query").unbind("click");
	getCurrentPageObj().find("#query").click(function(){
		getCurrentPageObj().find("#superviseReportTable").bootstrapTable("refresh",{url:SuperviseReportQueryUrl()});
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#query").click();});
	
	//新建
	getCurrentPageObj().find("#add").unbind("click");
	getCurrentPageObj().find("#add").click(function(){
		closeAndOpenInnerPageTab("superviseReport_add","新增","dev_report/supervise/T-B-6_superviseReport_add.html",function(){
			
		});
	});
	
})();
	
/**
 * 修改监控报表信息
 */
function updateSuperviseReport(index) {
	closeAndOpenInnerPageTab("superviseReport_update","修改","dev_report/supervise/T-B-6_superviseReport_add.html",function(){
		
	});
}
/**
 * 查看监控报表信息
 */
function detailSuperviseReport(index) {
	closeAndOpenInnerPageTab("superviseReport_detail","查看","dev_report/supervise/T-B-6_superviseReport_add.html",function(){
		
	});
}
