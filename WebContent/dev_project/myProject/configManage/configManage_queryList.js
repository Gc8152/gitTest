;function initPQConfigManageListLayout(id){
	var currTab = getCurrentPageObj();
	currTab.find("input[name=PROJECT_ID]").val(id);
	
	var form = currTab.find("#configManage_query");
	var table = currTab.find("#configManage_table");
	autoInitSelect(form);
	
	var commit = currTab.find("#commit");
	commit.click(function(){
		initTable();
	});
	//重置
	var reset = currTab.find("#reset");
	reset.click(function(){
		form[0].reset();
		currTab.find("select").select2();
	});
    
	/*导入*/
	var configManage_import = currTab.find("#configManage_import");
	configManage_import.click(function(){
		openInnerPageTab("MyconfigManage_import","导入配置管理","dev_project/myProject/configManage/configManage_import.html",function(){
			initconfigManageImportLayout(id);
		});
	});
	
	/*新增*/
	var configManage_add = currTab.find("#configManage_add");
	configManage_add.click(function(){
		openInnerPageTab("MyconfigManage_add","新增不符合项","dev_project/myProject/configManage/configManage_add.html",function(){
			initconfigManageAddLayout(id, null);
		});
	});
	/*修改*/
	var configManage_add = currTab.find("#configManage_update");
	configManage_add.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行修改!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "待受理"){
			alert("这条数据不是待受理状态，不能进行修改!");
			return ;
		}
		openInnerPageTab("MyconfigManage_add","修改不符合项","dev_project/myProject/configManage/configManage_add.html",function(){
			initconfigManageAddLayout(id, rows[0].CONFIG_ID);
		});
	});
	/*删除*/
	var configManage_add = currTab.find("#configManage_delete");
	configManage_add.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行删除!");
			return ;
		}
		if(rows[0].STATUS !== "01"){
			alert("这条数据不是待受理状态，不能进行删除!");
			return ;
		}  
		var call =getMillisecond();
		var msg="是否删除此申请？";
		nconfirm(msg,function(){
			baseAjaxJsonp(dev_project+"Confignotconform/confignotconformDelete.asp?call="+call+"&SID="+SID+"&CONFIG_ID="+rows[0].CONFIG_ID, null, function(data){
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
	var configManage_accept = currTab.find("#configManage_accept");
	configManage_accept.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行受理!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "待受理"){
			alert("这条数据不是待处理状态，不能进行处理!");
			return ;
		}
		openInnerPageTab("MyconfigManage_accept","受理不符合项","dev_project/myProject/configManage/configManage_accept.html",function(){
			initconfigManageAcceptLayout(id, rows[0].CONFIG_ID);
		});
	});
	
	/*处理*/
	var configManage_handle = currTab.find("#configManage_handle");
	configManage_handle.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行处理!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "已受理-待处理"&& rows[0].STATUS_NAME !== "处理中"&& rows[0].STATUS_NAME !== "打回处理中"&& rows[0].STATUS_NAME !== "挂起"){
			alert("这条数据不是待处理状态，不能进行处理!");
			return ;
		}
		openInnerPageTab("MyconfigManage_handle","处理不符合项","dev_project/myProject/configManage/configManage_handle.html",function(){
			initconfigManageHandleLayout(id, rows[0].CONFIG_ID);
		});
	});
	
	/*验证*/
	var configManage_validate = currTab.find("#configManage_validate");
	configManage_validate.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行验证!");
			return ;
		}
		if(rows[0].STATUS_NAME !== "待验证"&&rows[0].STATUS_NAME !== "已受理-拒绝"){
			alert("这条数据不是待验证状态，不能进行验证!");
			return ;
		}
		openInnerPageTab("MyconfigManage_validate","验证不符合项","dev_project/myProject/configManage/configManage_validate.html",function(){
			initconfigManageValidateLayout(rows[0].CONFIG_ID);
		});
	});
	
	function daysBetween(sDate1,sDate2){
	    var time1 = Date.parse(new Date(sDate1));
	    var time2 = Date.parse(new Date(sDate2));
	    var nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
	    return  nDays;
	};
	
	/*详情*/
	var configManage_info = currTab.find("#configManage_info");
	configManage_info.click(function(){
		var rows = table.bootstrapTable('getSelections');
		if(rows.length!=1){
			alert("请选择一条数据进行查看!");
			return ;
		}
		openInnerPageTab("MyconfigManage_QueryIn","不符合项详细","dev_project/myProject/configManage/configManage_queryInfo.html",function(){
			initconfigManageQueryInfoLayout(rows[0].CONFIG_ID);
		});
	});
	
	
	/*返回*/
	var configManage_back = currTab.find("#configManage_back");
	configManage_back.click(function(){
		closeCurrPageTab();
	});
	
	/**		初始化table	**/
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	
	initTable();
	
	function initTable(){
		var param = form.serialize();
		var call = getMillisecond();
		table.bootstrapTable('destroy').bootstrapTable({
			//请求后台的URL（*）
			url : dev_project+'Confignotconform/confignotconformQueryList.asp?call='+call+'&SID='+SID+"&"+param,
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
			uniqueId : "CONFIG_ID", //每一行的唯一标识，一般为主键列
			cardView : false, //是否显示详细视图
			detailView : false, //是否显示父子表
			jsonpCallback:call,
			singleSelect: true,
			columns : [ {
				field: 'middle',
				checkbox: true,
				rowspan: 2,
				align: 'center',
				valign: 'middle'
			}, /*{
				field : 'CONFIG_ID',
				title : '编号',
				align : "center"
			},*/ {
				field : "RULE_CORRECT_DAY",
				title : "标识",
				align : "center",
				formatter: function (value, row, index) {
					if(row.STATUS == '01'){
						return "*";//待受理
					}else if(row.STATUS == '06' && daysBetween(getCurrentYMD(),row.FIND_DATE)<parseInt(row.RULE_CORRECT_DAY)){
						return "△";//待验证
					}else if(row.STATUS !='07' && row.STATUS !='02' && row.STATUS !='03'
							&& daysBetween(getCurrentYMD(),row.FIND_DATE)>parseInt(row.RULE_CORRECT_DAY)){
						return "!";//延期未关闭
					}else{
						return "";
					}
				}
			}, {
				field : "PROJECT_NUM",
				title : "项目编号",
				align : "center"
			}, {
				field : "PROJECE_NAME",
				title : "项目名称",
				align : "center"
			}, {
				field : "DESCR",
				title : "不符合项描述",
				align : "center"
			}, {
				field : "AUDIT_CONFIG",
				title : "审计配置库",
				align : "center"
			}, {
				field : "GRADE_NAME",
				title : "不符合项等级",
				align : "center"
			}, {
				field : "STATUS_NAME",
				title : "不符合项状态",
				align : "center"
			}, {
				field : "PRESENT_USER_NAME",
				title : "提出人",
				align : "center"
			}, {
				field : "DUTY_USER_NAME",
				title : "(执行人)责任人",
				align : "center"
			},{
				field : "FIND_DATE",
				title : "发现日期",
				align : "center"
			}]
		});
	}
	
}