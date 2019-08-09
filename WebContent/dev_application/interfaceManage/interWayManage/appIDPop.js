function openAppPop(id,appname,appid){
	$('#myModal_appID').remove();
	getCurrentPageObj().find("#"+id).load("dev_application/interfaceManage/interWayManage/appIDPop.html",{},function(){
		$("#myModal_appID").modal("show");
//		var AppPopCall = getMillisecond();
		AppPop("#pop_appIDTable",dev_application+'interWay/queryPopAppIDList.asp?SID='+SID,{name:appname,no:appid},true,"pop_appIDTable");
	});
}

function AppPop(appIDTable,appIDUrl,checkParam,flag,table_id){
	//查询所有用户POP框
	getCurrentPageObj().find(appIDTable).bootstrapTable("destroy").bootstrapTable({
				//请求后台的URL（*）
				url : appIDUrl,
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
				pageSize : 5,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "SYSTEM_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: flag,
 
				columns: [
							{	
								//radio:true,
								checkbox:true,
								rowspan: 2,
								align: 'center',
								valign: 'middle'
							}, 
							{
					        field: 'A_NUM',
					        title: '序号',
					        align:"center"
							},{
					        field: 'SYSTEM_ID',
					        title: '应用ID',
					        align:"center",
							},{
					      	  field:"SYSTEM_NAME",
					      	  title:"应用名称",
					          align:"center"
						    },{
							  field:"",
							  title:"备注",
							  align:"center"					        	  
							}]
			});
	var queryParams=function(params){
		var temp={
				limit: params.limit, //页面大小
				offset: params.offset, //页码
		};
		return temp;
	};
	
	//获取选中记录的所有节点名称
	$("#pop_appIDSave").click(function(){
		var records = $("#pop_appIDTable").bootstrapTable('getSelections');
		var SYSTEM_NAME = $.map(records, function (row) {			
			return row.SYSTEM_NAME;                  
		});
		var SYSTEM_ID = $.map(records, function (row) {			
			return row.SYSTEM_ID;                  
		});
				
		if($("#pop_appIDTable input[type='checkbox']").is(':checked')){
			checkParam.name.val(SYSTEM_NAME);
			checkParam.no.val(SYSTEM_ID);
			$("#myModal_appID").modal("hide");
		}else{
	        $.Zebra_Dialog('请选择一条记录进行添加!', {
	            'type':     'close',
	            'title':    '提示',
	            'buttons':  ['是'],
	            'onClose':  function(caption) {
	            	if(caption=="是"){
	            	}
	            }
	        });
		}
	});
	//用户POP重置
	getCurrentPageObj().find("#pop_appIDReset").click(function(){
		$("#appID_query input").each(function(){
			$(this).val("");
		});
	});
	//多条件查询用户
	getCurrentPageObj().find("#pop_appIDSearch").click(function(){
		var SYSTEM_ID = getCurrentPageObj().find("#pop_SYSTEM_ID").val();
		var SYSTEM_NAME =  getCurrentPageObj().find("#pop_SYSTEM_NAME").val();
		getCurrentPageObj().find(appIDTable).bootstrapTable('refresh',	{url:appIDUrl+"&SYSTEM_NAME="+escape(encodeURIComponent(SYSTEM_NAME))+"&SYSTEM_ID="+SYSTEM_ID});
	});
	enterEventRegister("popModelQueryLevel1", function(){getCurrentPageObj().find("#pop_appIDSearch").click();});
}

