;function initQualityManageValidateLayout(quality_id){
	
	var currTab = getCurrentPageObj();
	initVlidate(currTab);
	var form = currTab.find("#qualityManage_validate");
	var infoTable = currTab.find("#qualityInfo_table");
	var table = currTab.find("#qualityManageValidate_table");
	
	//提交
	var submit = currTab.find("#qualityManage_validate_submit");
	submit.click(function(e){
		//判断是否为空
        if(!vlidate(currTab)){
			  return ;
		  }
		var content = form.serialize();
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"quality/validateQuality.asp?call="+call+"&SID="+SID+"&"+content, null, function(data){
			if (data != undefined && data != null) {
				alert(data.msg);
				if(data.result=="true"){
					closeCurrPageTab();
				}
			}else{
				alert("未知错误！");
			}
		},call);
    });
	
	//返回
	var back = currTab.find("#qualityManage_validate_back");
	back.click(function(e){
		closeCurrPageTab();
	});
	
	initLayout();
	
	function initLayout(){
		//autoInitSelect(form);//初始化下拉框
		var arr = "00,01,02,03,04,05,06,09";
		initSelect(currTab.find("#v_status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_QUALITY_STATUS"},null,null,arr);
		var call = getMillisecond();
		baseAjaxJsonp(dev_project+"quality/queryOneQuality.asp?call="+call+"&SID="+SID+"&QUALITY_ID="+quality_id, null, function(result){
			//项目项目基本信息
			for(var i in result){
				infoTable.find("div[name="+i+"]").html(result[i]);
				form.find("input[name="+i+"]").val(result[i]);
			}
			initTable();
		},call);
	}
	
	function initTable(){
		/**		初始化table	**/
		var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
		};
		var call = getMillisecond();
		table.bootstrapTable({
			//请求后台的URL（*）
			url : dev_project+'quality/queryListRecord.asp?call='+call+'&SID='+SID+'&QUALITY_ID='+quality_id,
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
			uniqueId : "RECORD_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:call,
			singleSelect: true,
			columns : [ {
				field : 'OPT_TIME',
				title : '日期',
				align : "center"
			}, {
				field : "OPT_USER_NAME",
				title : "操作人",
				align : "center"
			}, {
				field : "OPT_STATUS",
				title : "操作",
				align : "center"
			}, {
				field : "DESCR",
				title : "备注",
				align : "center"
			}, {
				field : "INCON_STATUS_NAME",
				title : "不符合项状态",
				align : "center"
			},{
				field : "CONFIG_ID",
				title : "附件",
				align : "center"
			}]
		});	
	}
	
	
}