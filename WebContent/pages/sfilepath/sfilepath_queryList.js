//初始化按钮事件
function initSfilePathButtonEvent(){
	initSelect($("#status"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_FILEPATH_STATUS"},"");
	initSelect($("#type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_PATH_TYPE"},"");
	//重置
	$("#sfilepath_reset").click(function(){
		$("#path_id").val("");
		$("#status").val("");
		$("#type").val("");
		$("#status").select2();
		$("#type").select2();
	});
	//查询
	$("#sfilepath_serch").click(function(){
		var path_id=$("#path_id").val();
		var status=$.trim($("#status").val());
		var type=$.trim($("#type").val());
		$('#SFilePathTableInfo').bootstrapTable('refresh',
				{url:'SFilePath/queryListFilePath.asp?path_id='+path_id+"&status="+status+"&type="+type});
	});
	enterEventRegister(getCurrentPageObj().attr("class"), function(){getCurrentPageObj().find("#sfilepath_serch").click();});
}
//删除
$("#deletePath").click(function(){
	var id = $("#SFilePathTableInfo").bootstrapTable('getSelections');
	var ids = $.map(id, function (row) {return row.PATH_ID;});	
	if(ids==null||ids==undefined||ids==""){
		alert("请选择一条数据！");					
		return;
	}else{
		nconfirm("确定要删除该数据吗?",function(){
			deleteSPathInfo(ids);
			$("#SFilePathTableInfo").bootstrapTable('remove', {
				field: 'PATH_ID',
				values: ids
			});	
		});
	}
});
//执行删除的方法
function deleteSPathInfo(param){
	var ids=param;
	var url="SFilePath/deleteFilePath.asp?path_id="+ids;
	$.ajax({
		type : "post",
		url : url,
		async :  true,
		data : "",
		dataType : "json",
		success : function(data) {
			alert(data.msg);
			$('#SFilePathTableInfo').bootstrapTable('refresh',{url:'SFilePath/queryListFilePath.asp?path_id=&status='});
		},
		error : function() {						
		}
	});
}
//新增
$("#addPath").click(function(){			
	pageDispatchSFilePath(this,'SFilePathAdd','','','','');		
});
//修改
$("#updatePath").click(function(){			
		var id = $("#SFilePathTableInfo").bootstrapTable('getSelections');
		var status = $.map(id, function (row) {return row.STATUS;});
		var path_type = $.map(id, function (row) {return row.PATH_TYPE;});
		var file_num = $.map(id, function (row) {return row.FILE_NUM;});
		var ids = $.map(id, function (row) {return row.PATH_ID;});
		if(ids==null||ids==undefined||ids==""){
			alert("请选择一条数据！");				
			return;
		}else{	
			pageDispatchSFilePath(this,'SFilePathUpdate',ids,status,path_type,file_num);		
		}
	});
  //初始化表格
  function initSFilePathInfo(){
	 var path_id=$("#path_id").val();
	 var status=$.trim($("#status").val());
	 var queryParams=function(params){
			var temp={
					limit: params.limit, //页面大小
					offset: params.offset //页码
			};
			return temp;
	};
	$("#SFilePathTableInfo").bootstrapTable({
        url: 'SFilePath/queryListFilePath.asp?path_id='+path_id+"&status="+status,     //请求后台的URL（*）
        method: 'get',           //请求方式（*）   
        striped: false,           //是否显示行间隔色
        cache: false,            //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）		       
        sortable: true,           //是否启用排序
        sortOrder: "asc",          //排序方式
        queryParams: queryParams,//传递参数（*）
        sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
        pagination: true,          //是否显示分页（*）
        pageList: [5,10,15],    //可供选择的每页的行数（*）
        pageNumber:1,            //初始化加载第一页，默认第一页
        pageSize: 10,            //每页的记录行数（*）		       
        clickToSelect: true,        //是否启用点击选中行
        uniqueId: "PATH_ID",           //每一行的唯一标识，一般为主键列
        cardView: false,          //是否显示详细视图
        detailView: false,          //是否显示父子表	
        singleSelect: true,//复选框单选
        columns: [
		{	
			checkbox:true,
			rowspan: 2,
			align: 'center',
			valign: 'middle',
		},{
          field: 'PATH_ID',
          title: '规则编码',
          align:"center",
        }, {
        	field:"PATH",
        	title:"路径规则",
            align:"center",
        },{
        	field:"PATH_TYPE_NAME",
        	title:"文件类型",
            align:"center",
        },{
        	field:"STATUS_NAME",
        	title:"是否启用",
            align:"center",
        },{
        	field:"OPT_USER_NAME",
        	title:"操作人",
            align:"center",
        },{
        	field:"OPT_TIME",
        	title:"操作时间",
            align:"center",
        },{
        	field:"FILE_NUM",
        	title:"文件数",
            align:"center",
        }]
      }); 
	
};
var url = '';

//创建跳转页面
function pageDispatchSFilePath(obj,key,param1,param2,param3,param4){
	if("SFilePathAdd"==key){
		closePageTab("add_sfilepath");
		openInnerPageTab("add_sfilepath","新增路径规则","pages/sfilepath/sfilepath_add.html");		
		return;
	}else if("SFilePathUpdate"==key){
		closePageTab("update_sfilePath");
		openInnerPageTab("update_sfilepath","修改路径规则","pages/sfilepath/sfilepath_update.html",function(){
			initFilePathSelect(param1,param2,param3,param4);
		});
	}
}

initSFilePathInfo();
initSfilePathButtonEvent();