//初始化UAT移交页面信息
function initUatApproveInfo(p) {
	//任务信息初始化
	var call_task = getMillisecond()+'1';
	var url = dev_construction+'UatTransfer/queryuattransferinfo.asp?call='+call_task+'&SID='+SID+'&req_task_id='+p;
	baseAjaxJsonp(url, null, function(data){
		if (data != undefined&&data!=null&&data.result=="true") {
			for(var k in data.task){
				getCurrentPageObj().find("#"+k).text(data.task[k]);
				getCurrentPageObj().find("[name='Q."+k+"']").val(data.task[k]);
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
	//查询测试环境地址和缺陷路径地址
	var call_url = getMillisecond()+'3';
	var url = dev_construction+'UatApprove/queryEnvirAndBugUrl.asp?call='+call_url+'&SID='+SID+'&req_task_id='+p;
	baseAjaxJsonp(url, null, function(data){
		if (data!=undefined&&data!=null&&data.result=="true") {
			if(data.url!=undefined&&data.url!=null) {
				getCurrentPageObj().find("[name='U.test_environment']").val(data.url.test_environment);
				getCurrentPageObj().find("[name='U.bug_url']").val(data.url.bug_url);
				getCurrentPageObj().find("[name='U.tranfer_explain']").val(data.url.tranfer_explain);
				getCurrentPageObj().find("#uat_id").val(data.url.uat_id);
			}
		}
	}, call_url);
}
//初始化页面按钮事件
(function() {
	 //单选按钮添加样式
	 var approve_radio = getCurrentPageObj().find("input[name='approve_conclusion']");
 	 approve_radio.unbind("click"); 
 	 approve_radio.click(function(){ 
 	 approve_radio.parent().removeClass('checkd');
 	 $(this).parent("span").addClass('checkd'); 
	 });
	//保存&提交审核 按钮
	getCurrentPageObj().find("#submit").unbind("click");
	getCurrentPageObj().find("#submit").click(function() {
		if(!vlidate(getCurrentPageObj(),"",true)){
			return ;
		}
		//获取参数的值
		var param = {};
		param["req_put_dept"] = getCurrentPageObj().find("[name='Q.req_put_dept']").val();
		param["req_businesser"] = getCurrentPageObj().find("[name='Q.req_businesser']").val();
		param["req_business_phone"] = getCurrentPageObj().find("[name='Q.req_business_phone']").val();
		param["req_id"] = getCurrentPageObj().find("[name='Q.req_id']").val();
		param["req_task_id"] = getCurrentPageObj().find("[name='Q.req_task_id']").val();
		param["approve_conclusion"]= getCurrentPageObj().find("[name='approve_conclusion']:checked").val();
		param["approve_explain"] = getCurrentPageObj().find("#approve_explain").val();
		param["uat_id"] = getCurrentPageObj().find("#uat_id").val();
		
		var aaa=getCurrentPageObj().find("#approve_explain").val();
	    if(aaa.length>230){
	    	alert("测试环境地址至多可输入230汉字！");
	    	return;
	    }
		
		var call = getMillisecond();
		var url = dev_construction+'UatApprove/submitUatApprove.asp?call='+call+'&SID='+SID;
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
	
	//点击提出部门选择部门
	getCurrentPageObj().find("[name='Q.req_put_dept_name']").click(function(){
		openSelectTreeDiv($(this),"req_put_dept_tree_uatApprove_edit","SOrg/queryorgtreelist.asp",{"margin-top":"28px",width:"243px",height:"250px"},function(node){
			getCurrentPageObj().find("[name='Q.req_put_dept_name']").val(node.name);
			getCurrentPageObj().find("[name='Q.req_put_dept']").val(node.id);
		});
	});
	
	//初始化验证
	initVlidate(getCurrentPageObj());
})();
