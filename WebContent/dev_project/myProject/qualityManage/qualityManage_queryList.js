;function initQualityManageListLayout(id){
	
	var currTab = getCurrentPageObj();
	
	currTab.find("input[name=PROJECT_ID]").val(id);
	
	var form = currTab.find("#qualityManage_query");
	
	var table = currTab.find("#qualityManage_table");
	autoInitSelect(form);//初始化下拉框
	/*查询*/
	var commit = currTab.find("#commit");
	commit.click(function(){
		var param = form.serialize();
		table.bootstrapTable('refresh',{url:dev_project+'quality/queryListQuality.asp?call='+call+'&SID='+SID+"&"+param});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#commit").click();});
	/*重置*/
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
	
	/*导入*/
	var qualityManage_import = currTab.find("#qualityManage_import");
	qualityManage_import.click(function(){
		openInnerPageTab("myqualityManage_import","导入不符合项","dev_project/myProject/qualityManage/qualityManage_import.html",function(){
			initQualityManageImportLayout(id);
		});
	});
	
	/*新增*/
	var qualityManage_add = currTab.find("#qualityManage_add");
	qualityManage_add.click(function(){
		openInnerPageTab("myqualityManage_add","新增不符合项","dev_project/myProject/qualityManage/qualityManage_add.html",function(){
			initQualityManageAddLayout(id, null);
		});
	});
	
	/*修改*/
	var qualityManage_update = currTab.find("#qualityManage_update");
	qualityManage_update.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "待受理"){
			alert("这条数据不是待受理状态，不能进行修改!");
			return ;
		}
		openInnerPageTab("myqualityManage_update","修改不符合项","dev_project/myProject/qualityManage/qualityManage_add.html",function(){
			initQualityManageAddLayout(id, rows[0].QUALITY_ID);
		});
	});
	
	/*删除*/
	var qualityManage_delete = currTab.find("#qualityManage_delete");
	qualityManage_delete.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		if(rows[0].STATUS !== "01"){
			alert("这条数据不是待受理状态，不能进行删除!");
			return ;
		} 
		nconfirm("确定要删除该数据吗？",function(){
			var call = getMillisecond();
			baseAjaxJsonp(dev_project+"quality/deleteQuality.asp?call="+call+"&SID="+SID+"&QUALITY_ID="+rows[0].QUALITY_ID, null, function(data){
				if (data != undefined && data != null) {
					alert(data.msg);
					if(data.result=="true"){
						commit.click();
					}
				}else{
					alert("未知错误！");
				}
			},call);
		});
	});
	
	/*受理*/
	var qualityManage_accept = currTab.find("#qualityManage_accept");
	qualityManage_accept.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行受理!");
			return ;
		}
		if(rows[0].STATUS !== "01"){
			alert("这条数据不是待受理状态，不能进行受理!");
			return ;
		}
		openInnerPageTab("myqualityManage_accept","受理不符合项","dev_project/myProject/qualityManage/qualityManage_accept.html",function(){
			initQualityManageAcceptLayout(rows[0].QUALITY_ID);
		});
	});
	
	/*处理*/
	var qualityManage_handle = currTab.find("#qualityManage_handle");
	qualityManage_handle.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行处理!");
			return ;
		}
		if(rows[0].STATUS !== "04" && rows[0].STATUS !== "05" && rows[0].STATUS !== "08" && rows[0].STATUS !== "09"){
			alert("这条数据不是待处理或处理中状态，不能进行处理!");
			return ;
		}
		openInnerPageTab("myqualityManage_handle","处理不符合项","dev_project/myProject/qualityManage/qualityManage_handle.html",function(){
			initQualityManageHandleLayout(rows[0].QUALITY_ID);
		});
	});
	
	/*验证*/
	var qualityManage_validate = currTab.find("#qualityManage_validate");
	qualityManage_validate.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行验证!");
			return ;
		}
		if(rows[0].STATUS !== "06" && rows[0].STATUS !== "02"  && rows[0].STATUS !== "03"){
			alert("这条数据不是待验证状态，不能进行验证!");
			return ;
		}
		openInnerPageTab("myqualityManage_validate","验证不符合项","dev_project/myProject/qualityManage/qualityManage_validate.html",function(){
			initQualityManageValidateLayout(rows[0].QUALITY_ID);
		});
	});
	
	//仲裁
	/*var qualityManage_arbitrate = currTab.find("#qualityManage_arbitrate");
	qualityManage_arbitrate.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		openInnerPageTab("proEmpManage","项目人员管理","dev_project/myProject/proEmpManage/proEmpManage_qeryList.html",function(){
			initLayout(rows);
		});
	});*/
	
	/*详情*/
	var qualityManage_detail = currTab.find("#qualityManage_detail");
	qualityManage_detail.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		openInnerPageTab("myqualityManage_queryInfo","查看不符合项","dev_project/myProject/qualityManage/qualityManage_queryInfo.html",function(){
			initQualityManageInfoLayout(rows[0].QUALITY_ID);
		});
	});
	
	function daysBetween(sDate1,sDate2){
	    //Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
	    var time1 = Date.parse(new Date(sDate1));
	    var time2 = Date.parse(new Date(sDate2));
	    var nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
	    return  nDays;
	};
	
	/**		初始化table	**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var param = form.serialize();
	var call = getMillisecond();
	table.bootstrapTable({
		//请求后台的URL（*）
		url : dev_project+'quality/queryListQuality.asp?call='+call+'&SID='+SID+"&"+param,
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
		uniqueId : "QUALITY_ID", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		jsonpCallback:call,
		singleSelect: true,
		columns : [{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle',
		},{
			field : 'QUALITY_ID',
			title : '编号',
			align : "center",
		}, {
			field : "RULE_CORRECT_TIME",
			title : "标识",
			align : "center",
			formatter: function (value, row, index) {
				if(row.STATUS == '01'){
					return "*";//待受理
				}else if(row.STATUS == '06' && daysBetween(getCurrentYMD(),row.FIND_DATE)<=parseInt(row.RULE_CORRECT_DAY)){
					return "△";//待验证
				}else if(row.STATUS !='07' && daysBetween(getCurrentYMD(),row.FIND_DATE)>parseInt(row.RULE_CORRECT_DAY)){
					return ""+'<div class="text-red">!</div>';//延期未关闭
				}else{
					return "";
				}
			}
		}, {
			field : "PROJECT_NUM",
			title : "项目编号",
			align : "center",
		}, {
			field : "PROJECT_NAME",
			title : "项目名称",
			align : "center"
		},{
			field : "QUALITY_DESC",
			title : "不符合项描述",
			align : "center",
		}, {
			field : "TYP_NAME",
			title : "不符合项分类",
			align : "center",
		}, {
			field : "GRADE_NAME",
			title : "不符合项等级",
			align : "center",
		}, {
			field : "STATUS_NAME",
			title : "不符合项状态",
			align : "center",
		}, {
			field : "CURRENT_USER_NAME",
			title : "当前环节处理人",
			align : "center",
		},{
			field : "FIND_DATE",
			title : "发现日期",
			align : "center",
		} ]
	});
};