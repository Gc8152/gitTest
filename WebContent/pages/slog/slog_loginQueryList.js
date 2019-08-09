//按钮方法
function initLoginButtonEvent() {
	$("#queryLogin").click(function() {
		var login_name=$("#Llogin_name").val();
		var user_name=$("#Luser_name").val();
		var opt_time1=$("#Lopt_time1").val();
		var opt_time2=$("#Lopt_time2").val();
		$('#SLogTableInfo').bootstrapTable('refresh',{url:'SLog/queryloginlog.asp?login_name='+login_name+'&user_name='+escape(encodeURIComponent(user_name))+'&opt_time1='+opt_time1+'&opt_time2='+opt_time2});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryLogin").click();});
	$("#resetLogin").click(function(){
		$("input[name^='L.']").val("");
	});
}

//查询列表显示table
function initSLogInfo(){
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};
	var login_name=$("#Llogin_name").val();
	var user_name=$("#Luser_name").val();
	var opt_time1=$("#Lopt_time1").val();
	var opt_time2=$("#Lopt_time2").val();
	$("#SLogTableInfo").bootstrapTable({
		//请求后台的URL（*）
		url: 'SLog/queryloginlog.asp?login_name='+login_name+'&user_name='+user_name+'&opt_time1='+opt_time1+'&opt_time2='+opt_time2,     
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
		columns: [
          {
        	  field: 'LOGIN_NAME',
        	  title: '登陆账号',
        	  align:"center"
          },{
        	  field:"USER_NAME",
        	  title:"用户名称",
        	  align:"center"
          },{
        	  field:"IP_ADDRESS",
        	  title:"登陆IP",
        	  align:"center"
          },{
        	  field:"HOST_NAME",
        	  title:"登陆主机名",
        	  align:"center"
          },{
        	  field:"OPT_TIME",
        	  title:"登陆时间",
        	  align:"center"
          },{
        	  field:"MEMO",
        	  title:"说明",
        	  align:"center"
          }]
	});
};

//时间控件
function initDate(){
	WdatePicker({
			dateFmt : 'yyyy-MM-dd',
			minDate : '1990-01-01',
			maxDate : '2050-12-01'
	});
}

initLoginButtonEvent();
initSLogInfo();