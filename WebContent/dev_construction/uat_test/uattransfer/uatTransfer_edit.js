//初始化UAT移交页面信息
function initUatTranferInfo(p) {
	//任务信息初始化
	var call_task = getMillisecond()+'1';
	var url = dev_construction+'UatTransfer/queryuattransferinfo.asp?call='+call_task+'&SID='+SID+'&req_task_id='+p;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			if(data.task) {
				for(var k in data.task){
					getCurrentPageObj().find("#"+k).text(data.task[k]);
					getCurrentPageObj().find("[name='Q."+k+"']").val(data.task[k]);
				}				
			}
		}
	}, call_task);
	//SIT测试信息列表初始化
	var call_sit = getMillisecond()+'2';
	//分页
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	getCurrentPageObj().find("#sitRecordInfoTable").bootstrapTable(
			{
				url : dev_construction+'UatTransfer/querysitrecordinfo.asp?call='+call_sit+'&SID='+SID+'&req_task_id='+p,
				method : 'get', //请求方式（*）   
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				//pagination : true, //是否显示分页（*）
				pageList : [5,10],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "req_task_id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback: call_sit,
				onLoadSuccess:function(data){
				},
				columns : [ {
					field : 'TEST_INFO_ID',
					title : 'SIT测试信息ID',
					align : 'center',
					visible:false
				}, {
					field : 'TEST_MANAGER',
					title : '测试经理',
					align : 'center'
				}, {
					field : 'PLAN_SIT_TIME',
					title : '计划提交sit时间',
					align : 'center'
				}, {
					field : 'END_TIME',
					title : '测试结束时间',
					align : "center"
				}, {
					field : 'DELAY_DAYS',
					title : '延期天数',
					align : "center"
				}, {
					field : "SOMKE_TEST_RESULT",
					title : "冒烟测试结果",
					align : "center"
				}, {
					field : "SOMKE_TEXT_EXPLAIN",
					title : "说明",
					align : "center"
				} ]
			});
}
//初始化页面按钮事件
(function() {
	//保存&提交审核 按钮
	getCurrentPageObj().find("#submit").unbind("click");
	getCurrentPageObj().find("#submit").click(function() {
		if(!vlidate(getCurrentPageObj(),"",true)){
			return ;
		}
		//获取参数的值
		var param = {};
		var finds = getCurrentPageObj().find("[name^='U.']");
		for(var i=0;i<finds.length;i++){
			param[$(finds[i]).attr("name").slice(2)] = $(finds[i]).val();
		}
		param["req_task_id"] = getCurrentPageObj().find("[name='Q.req_task_id']").val();
		
		var aaa=getCurrentPageObj().find("#tranfer_explain").val();
	    if(aaa.length>230){
	    	alert("移交说明至多可输入230汉字！");
	    	return;
	    }
		
		//param["start_time"] = getCurrentPageObj().find("#start_time").val();
		//param["end_time"] = getCurrentPageObj().find("#end_time").val();
		//param["version_id"] = getCurrentPageObj().find("[name='Q.version_id']").val();
		var call = getMillisecond()+'3';
		var url = dev_construction+'UatTransfer/submituatinfo.asp?call='+call+'&SID='+SID;
		baseAjaxJsonp(url, param, function(data){
			if (data != undefined&&data!=null&&data.result=="true") {
				alert("提交成功!",function(){
					//$("#reqTaskInfoTable").bootstrapTable('refresh');
					closeCurrPageTab();
				});
			} else {
				alert("提交失败！");
			}
		}, call);
		
	});
})();

initVlidate(getCurrentPageObj());