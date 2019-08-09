var callTable=getMillisecond();
var SID=window.parent.SID;
/**
 * 打开更多通知中的详情页面
 */
parent.window.selNoticeByid=function(index){
	var data=$("#contentHtml", parent.document).find("#NoticeTableInfoMore").bootstrapTable("getData");
	var NOTICE_ID=data[index].NOTICE_ID;
	window.parent.closePageTab("queryDetail", function(){});
	openInnerPageTabIndexC("queryDetail", "查看通知", "dev_workbench/notice/notice_queryInfoFromIndexC.html", function(){	
		initNotieDetailInfoFromIndexC(NOTICE_ID,SID);
	});
};

/**
 * 初始化页面
 */

function selNoticeByid(){
	alert();
}
(function (){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	$("#contentHtml", parent.document).find("#NoticeTableInfoMore").bootstrapTable({
		//请求后台的URL（*）
		url : dev_workbench+'notice/userAllNotice.asp?call='+callTable+'&SID='+SID,
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
		uniqueId : "NOTICE_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:callTable,
		singleSelect: true,
		
		columns : [{
			field : 'NOTICE_ID',
			title : '序号',
			align : "center",
			visible:false
		}, {
			field : "NOTICE_TITLE",
			title : "通知标题",
			align : "center"
		}, {
			field : "SEND_TIME",
			title : "发送时间",
			align : "center"
		}, {
			field : "SEND_PERSON_NAME",
			title : "发送人",
			align : "center"
		}, {
			field : "OPT",
			title : "操作",
			align : "center",
			formatter:function(value,row,index){				
				var cfi_edit="<a id='notice_info' style='color:#0088cc; cursor:pointer;'  onclick='selNoticeByid("+index+");'>查看详情</a>";
				return cfi_edit;	
			}	
		}]
	});	
})();


	