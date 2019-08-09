//按钮方法
function initLogButtonEvent() {
	$("#queryOpera").click(function() {
		var login_name=$("#Ologin_name").val();
		var user_name=$("#Ouser_name").val();
		var opt_time1=$("#Oopt_time1").val();
		var opt_time2=$("#Oopt_time2").val();
		var business_id=$("#Obusiness_id").val();
		$('#SOperaTableInfo').bootstrapTable('refresh',{url:'SLog/queryoperalog.asp?login_name='+login_name+'&user_name='+escape(encodeURIComponent(user_name))+'&opt_time1='+opt_time1+'&opt_time2='+opt_time2+'&business_id='+business_id});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryOpera").click();});
	$("#resetOpera").click(function(){
		$("input[name^='O.']").val("");
	});
}

//查询列表显示table
function initSLogInfo(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset, //页码
		};
		return temp;
	};
	var login_name=$("#Ologin_name").val();
	var user_name=$("#Ouser_name").val();
	var opt_time1=$("#Oopt_time1").val();
	var opt_time2=$("#Oopt_time2").val();
	var business_id=$("#Obusiness_id").val();
	$("#SOperaTableInfo").bootstrapTable({
		//请求后台的URL（*）
		url: 'SLog/queryoperalog.asp?login_name='+login_name+'&user_name='+user_name+'&opt_time1='+opt_time1+'&opt_time2='+opt_time2+'&business_id='+business_id,     
		method : 'get', //请求方式（*）   
		striped : true, //是否显示行间隔色
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
		uniqueId : "LOGIN_NAME", //每一行的唯一标识，一般为主键列
		cardView : false, //是否显示详细视图
		detailView : false, //是否显示父子表
		singleSelect: true,
		columns: [{
			field: 'middle',
			checkbox: true,
			rowspan: 2,
			align: 'center',
			valign: 'middle'
		  },{
        	  field: 'LOGIN_NAME',
        	  title: '操作账号',
        	  align:"center"
          },{
        	  field:"USER_NAME",
        	  title:"操作人",
        	  align:"center"
          },{
        	  field:"IP_ADDRESS",
        	  title:"操作IP",
        	  align:"center"
          },{
        	  field:"TYPE",
        	  title:"类型",
        	  align:"center"
          },{
        	  field:"OPT_TIME",
        	  title:"操作时间",
        	  align:"center"
          },{
        	  field:"BUSINESS_ID",
        	  title:"业务ID",
        	  align:"center"
          },{
        	  field:"MEMO",
        	  title:"日志详情",
        	  align:"center"
        }]
	});
};
(function(){
	$("#openOptDetail").click(function(){
		var row = $("#SOperaTableInfo").bootstrapTable('getSelections');
		if(row.length!=1){
			alert("请选择一条日志查看详情!");
			return ;
		}
		showLogDetail("optLogPop",row);
	});
})();
//时间控件
function initDate(){
	WdatePicker({
		dateFmt : 'yyyy-MM-dd',
		minDate : '1990-01-01',
		maxDate : '2050-12-01'
	});
}

initLogButtonEvent();
initSLogInfo();