	
function initUatTestReportInfoLayout(item){
	var currTab = getCurrentPageObj();		//该方法可以获取当前显示的页面对象，通过这个对象可以避免与其他页面的id重复问题
	//初始化下拉选
	autoInitSelect(currTab.find("#uatReportInfo"));
	//赋值
	if(item){
		for (var key in item) {
			currTab.find("span[name="+key+"]").html(item[key]);
			currTab.find("input[name="+key+"]").val(item[key]);
			currTab.find("select[name="+key+"]").val(item[key]);
			currTab.find("textarea[name="+key+"]").val(item[key]);
		}
	}
	initSelect(currTab.find("select[name='ACCEPT_RESULT']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_ACCEPT_CONCLUSION"},item.ACCEPT_CONCLUSION);
	/**初始化按钮开始**/	
	//保存
	var save = currTab.find("#saveUatReprot");
	save.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		initsave(false);
	});
	//保存并提交
	var submit = currTab.find("#submitUatReprot");
	submit.click(function(){
		if(!vlidate(currTab,"",true)){
			return ;
		}
		initsave(true);
	});
	//返回
	var back = currTab.find("#backUatReprot");
	back.click(function(){
		closeCurrPageTab();
	});
	  
	function initsave(isCommit){
		var param = {};
		var selectInfo = currTab.find("#uatReportInfo");
		var inputs = selectInfo.find("input");
		var selects = selectInfo.find("select");
		var textareas = selectInfo.find("textarea");
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < selects.length; i++) {
			var obj = $(selects[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		for (var i = 0; i < textareas.length; i++) {
			var obj = $(textareas[i]);
			param[obj.attr("name")] = $.trim(obj.val());
		}
		param["UAT_ID"]=item.UAT_ID;
		param["IS_COMMIT"]=isCommit;
		var call = getMillisecond();
		baseAjaxJsonp(dev_construction+"UatReport/saveUatReport.asp?call="+call+"&SID="+SID,param, function(data){
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
	var addfile = currTab.find("#add_file");
	addfile.click(function(){
		$("#file_modal").modal('show');
	});
	var tablefile = currTab.find("#table_file");
	//附件列表显示
	tablefile.bootstrapTable('destroy').bootstrapTable({
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
	
	//附件上传
	var file_id = "";
	file_id = currTab.find("input[name=FILE_ID]").val();
	if(!file_id){
		file_id = Math.uuid();
		currTab.find("input[name=FILE_ID]").val(file_id);
	}
	//var file_id = '6FE342F7-0582-4B2C-B623-6D242C725023';
	
	//点击打开上传模态框
	var addfile = currTab.find("#add_file");
	addfile.click(function(){
		openFileSvnUpload(currTab.find("#file_modal"), tablefile, file_id);
	});
	
	//附件删除
	var delete_file = currTab.find("#delete_file");
	delete_file.click(function(){
		delSvnFile(tablefile, file_id);
	});
	
	//初始化附件列表
	getSvnFileList(tablefile,currTab.find("#file_view_modal"),file_id);
}
initVlidate(getCurrentPageObj());