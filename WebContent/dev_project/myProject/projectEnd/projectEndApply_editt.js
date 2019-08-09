	
function initprojectEndApplyInfo(item,endInfo){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	
	//赋值
	for (var key in item) {
		currTab.find("div[name="+key+"]").html(item[key]);
	}
	if(endInfo){
		for (var k in endInfo) {
			currTab.find("input[name="+k+"]").val(endInfo[k]);
			currTab.find("textarea[name="+k+"]").val(endInfo[k]);
		}
	}
	/**初始化按钮开始**/	
	//保存
	var save = currTab.find("#save_Apply");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		initApplysave(false);
	});
	//保存并提交
	var submit = currTab.find("#submit_Apply");
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		initApplysave(true);
	});
	//返回
	var back = currTab.find("#back_Apply");
	back.click(function(){
		closeCurrPageTab();
		//openInnerPageTab("back_project","返回","dev_project/projectEstablishManage/projectEstablish/projectEstablish_queryList.html");
	});
	  
	function initApplysave(isCommit){
		var param = {};
		var selecttInfo = currTab.find("#apply_select");
		var inputs = selecttInfo.find("input");
		var textareas = selecttInfo.find("textarea");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < textareas.length; i++) {
			var obj = $(textareas[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		param["PROJECT_ID"]=item.PROJECT_ID;
		param["IS_COMMIT"]=isCommit;
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"proEnd/editProEndApply.asp?call="+call+"&SID="+SID,param, function(data){
			if (data != undefined && data != null && data.result=="true" ) {
	       		alert(data.msg);
	       		closeCurrPageTab();
			}else{ 
				alert(data.msg);
			}
		}, call);
	}
	/**初始化按钮结束**/
	//点击打开模态框
	var add_file = currTab.find("#add_file");
	add_file.click(function(){
		$("#file_modal").modal('show');
	});
	var table_file = currTab.find("#table_file");
	//附件列表显示
	table_file.bootstrapTable('destroy').bootstrapTable({
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
		uniqueId : "FILE_ID", //每一行的唯一标识，一般为主键列
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
			sortable: true,
			width: 50,
			formatter: function (value, row, index) {
				return index+1;
			}
		}, {
			field : 'FILE_NAME',
			title : '文档名称',
			align : "center"
		}, {
			field : 'FILE_TYPE',
			title : '文档类型',
			align : "center"
		}, {
			field : "OPT_PERSON",
			title : "上传人",
			align : "center"
		}, {
			field : "OPT_TIME",
			title : "上传时间",
			align : "center"
		}, {
			field : "DID",
			title : "操作",
			align : "center",
			formatter: function (value, row, index) {
				return '<span class="hover-view" '+
				'onclick="viewInfo('+index+')">查看</span>';
			}
		}]
	});
}
initVlidate(getCurrentPageObj());