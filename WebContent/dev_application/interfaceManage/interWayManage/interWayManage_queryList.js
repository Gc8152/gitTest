	
	var EsbinterWayQuery = "interWay"+getMillisecond();

function initEsbButton(){	
	//1.新增按钮
	getCurrentPageObj().find("#addEsb").click(function(){
		closeAndOpenInnerPageTab("addinterWay", "新增接入/调用方式", "dev_application/interfaceManage/interWayManage/interWay_add.html");
	});
	//2.查询按钮
	getCurrentPageObj().find("#queryEsb").click(function(){
		queryEsbTable();
	});
	//enter触发查询
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#queryEsb").click();});
	//3.删除按钮
	getCurrentPageObj().find("#deleteEsb").click(function(){

		closePageTab("update_jury");
		var id = getCurrentPageObj().find("#EsbTableInfo").bootstrapTable('getSelections');
		var ids = $.map(id, function (row) {return row.WAY_ID;});	

		if(ids==null||ids==undefined||ids==""){
			alert("请选择一条数据！");					
			return;
		}else{
			nconfirm("确定要删除该数据吗?",function(){
				deleteEsbInfo(ids);
				getCurrentPageObj().find("#EsbTableInfo").bootstrapTable('remove', {
					field: 'WAY_ID',
					values: ids
				});	
			});
		}
		
	});
	//4.修改按钮
	getCurrentPageObj().find("#updateEsb").click(function(){
			var id = $("#EsbTableInfo").bootstrapTable('getSelections');
			var ids = $.map(id, function (row) {return row.WAY_ID;});	
			if(ids==null||ids==undefined||ids==""){
				alert("请选择一条数据！");				
				return;
			}else{	
				ValtoPage(ids[0]);
			}

	});	
	//6.重置按钮
	getCurrentPageObj().find("#resetEsb").click(function() {
		getCurrentPageObj().find("#factEsbForm input").val("");
		getCurrentPageObj().find("#factEsbForm select").val(" ");
		getCurrentPageObj().find("#factEsbForm select").select2();
	});
}
//页面赋值
function ValtoPage(param){
	var params = {};
	params["WAY_ID"] = param;
	closeAndOpenInnerPageTab("updateinterWay","新增接入/调用方式","dev_application/interfaceManage/interWayManage/interWay_update.html",function(){	
		var updateCall = getMillisecond();
		baseAjaxJsonp(dev_application+'interWay/queryEsbListByID.asp?call='+updateCall+'&SID='+SID,params, function(data){	
			for ( var k in data) {
				var str = data[k];				
				k = k.toLowerCase();
				getCurrentPageObj().find("#"+k).val(str);
				if(k=="way_id"){
					initPageway_id(str);
					}
				if(k=="way_type"){
					initPageway_type(str);
					}
				if(k=="communication"){
					initPagecommunication(str);
					}
				if(k=="msg_type"){;
					initPagemsg_type(str);
					}
				if(k=="system_id"){
				initPagesystem_id(str);
//				initPagesystem_name(str);
					}
//				if(k=="system_name"){	
//				initPagesystem_name(str);
//					}
				}
		},updateCall);
	});			
}
//查询列表方法
function queryEsbTable(){
	var params = getCurrentPageObj().find("#factEsbForm").serialize();
	getCurrentPageObj().find("#EsbTableInfo").bootstrapTable('refresh',
			{url:dev_application+'interWay/queryEsbList.asp?call='+EsbinterWayQuery+'&SID='+SID+'&'+params});

}

//执行删除的方法
function deleteEsbInfo(param){
	var params = {};
	params["WAY_ID"] = param[0];
	baseAjaxJsonp(dev_application+'interWay/deleteEsbList.asp?call='+EsbinterWayQuery+'&SID='+SID,params, function(data) {
		if (data != undefined&&data!=null&&data.result=="true") {
			getCurrentPageObj().find('#EsbTableInfo').bootstrapTable('refresh',{url:dev_application+'interWay/queryEsbList.asp?call='+EsbinterWayQuery+'&SID='+SID});
			alert("删除成功");
		}else{
			alert("删除失败");
		}
	}, EsbinterWayQuery);
}

//初始化页面table
function initEsbTableInfo(){
	//页面的三项搜索
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset //页码
		};
		return temp;
	};	
	getCurrentPageObj().find("#EsbTableInfo").bootstrapTable("destroy").bootstrapTable(
			{
				//请求后台的URL（*）
				url :dev_application+'interWay/queryEsbList.asp?call='+EsbinterWayQuery+'&SID='+SID+'&WAY_ID=',
				method : 'get', //请求方式（*）   
				striped : true, //是否显示行间隔色
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
				uniqueId : "WAY_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				jsonpCallback:EsbinterWayQuery,
				singleSelect: true,//复选框单选
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [{	
					checkbox:true,
					rowspan: 2,
					align: 'center',
					valign: 'middle'
				},{
					field : 'E_NUM',
					title : "序号",
					align : "center",
				},{
					field: 'SYSTEM_ID',
					title: '应用编号',
					align: 'center'
				},{
					field : 'SYSTEM_NAME',
					title : "应用名称",
					align : "center"
				},{
					field : 'WAY_TYPE',
					title : '类型',
					align : "center"
				},{
					field : 'COMM_NAME',
					title : "通信类型",
					align : "center"
				},{
					field : 'MSG_NAME',
					title : "报文类型",
					align : "center"
				}]
		});
};
function initPageSelect(){
	//类别下拉初始化
	initSelect($("#W_way_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"C_DIC_WAY_TYPE"});
}

//针对jsonp设计的通用ajax请求
function baseAjaxJsonp(url, param, callback,method, async) {
	startLoading();
	if(method=="" || method==null || method==undefined){
		method = "jsonp_success";
	}
	$.ajax({
		type : "get",
		url : url,
		async : async == undefined ? true : false,
		data : param,
		dataType : "jsonp",
		jsonp: "callback",//服务端用于接收callback调用的function名的参数  
        jsonpCallback: method,//回调函数名称，需要与后台返回的json数据串前缀保持一致
		success : function(msg) {
			callback(msg);
			endLoading();
		},
		error : function(msg) {
			endLoading();
			callback();
		}
	});
}

initEsbTableInfo();
initEsbButton();
initPageSelect();
