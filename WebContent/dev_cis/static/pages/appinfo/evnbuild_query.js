
/**
 * 提供页面切换刷新页面的函数 供父页面的main.js 193行使用。
 * @returns
 */
function refreshTable(){
	$("#AntTable").bootstrapTable("refresh");
}
$(document).ready(function () {
    //下拉菜单select2
	var evnBuildType = getParamString("evnBuildType");
	if(evnBuildType!=0){
		$(".evnBuildVersion").hide();
	}
	initAntTable(evnBuildType);
	initVlidate($("#query_form"));
    $("select").select2();
    $("#close").click(function () {
        parent.closeCurrentTab(parent);  
    });
    $("#update").click(function () {
    	 var item = $("#AntTable").bootstrapTable("getSelections")[0];
    	 var result=vlidate($("#query_form"));
    	 if(item!=null){
    		 for(var key in item){
        		 $("#" + key).val(item[key]);
        		 $("#" + key).removeAttr("disabled");
        	 }
        	 $("#evnBuildStatus").trigger("change");
        	 $("#save").show();
         	 $("#systemSelectSure").hide();
             $("#systemSelect_modal").modal("show");
    	 }else {
    		 alert("请选择一条记录修改");
    	 }  
    });
    $("#save").click(function(){
    	var id=$("#AntTable").bootstrapTable("getSelections")[0]["id"];
    	var result=vlidate($("#query_form"));
    	if(result){
    		baseAjaxJsonp(contextpath+ "evnBuild/update/"+id, $("#query_form").serialize(), function(data){
    			if(data.success){
                	$("#AntTable").bootstrapTable("refresh");
                 alert("操作成功!");
                }else{
                	alert(data.message);
                }
    		});
    	}else {
    		alert("所保存内容不全或不符合条件");
    	}
    	
    });
    
    $("#detail").click(function(){
    	 var item = $("#AntTable").bootstrapTable("getSelections")[0];
    	 if(item!=null){
    		 for(var key in item){
        		 $("#" + key).val(item[key]);
        		 $("#" + key).attr("disabled","disabled");
        	 }
        	 $("#evnBuildStatus").trigger("change");
        	 $("#save").hide();
         	 $("#systemSelectSure").hide();
             $("#systemSelect_modal").modal("show");
    	 }else {
    		 alert("请选择一条记录查看");
    	 }
    });
    $("#stopAndStart").click(function(){
        var items = $("#AntTable").bootstrapTable("getSelections");
            if(items.length==1){
          /*  	if(items[0]["evnBuildStatus"]=="01"){
            	}else{
                  	 var a=$("stopAndStart").text("停用")
             	}*/
            		 nconfirm("确定要执行该操作吗？",function(){
     	        		baseAjaxJsonp(contextpath+"evnBuild/changeStatus", {evnbuild:items[0]["id"]}, function(data){
     	        			if(data.success){
     		                    alert("操作成功");
     		                    $("#AntTable").bootstrapTable("refresh");
     		                   
     		                }else{
     		                    alert(data.message);
     		                }
     	        		});
     	            });
            }
   });

      
    $("#delete").click(function () {
        var items = $("#AntTable").bootstrapTable("getSelections");
        if(items.length==1){
        	nconfirm("你确定要删除该项吗？",function(){
        		baseAjaxJsonp(contextpath+"evnBuild/deleteById", {id:items[0]["id"]}, function(data){
        			if(data.success){
	                    alert("操作成功");
	                    $("#AntTable").bootstrapTable("refresh");
	                }else{
	                    alert(data.message);
	                }
        		});
        	});
        }else{
        	alert("请选择一条记录删除");
        }
    });
    
    $("#add").click(function(e){
    	var inputs = $("#planOutter").find("input");
    	for(var i=0; i<inputs.length; i++){
    		$(inputs[i]).removeAttr("disabled");
    		$(inputs[i]).val("");
   	 	}
    	$("#evnBuildStatus").val("01").trigger("change");
    	$("#evnBuildStatus").removeAttr("disabled");//取消只读
    	$("#systemSelectSure").show();
    	$("#save").hide();
    	$("#systemSelect_modal").modal("show");
    });
    $("#systemSelectSure").click(function(e){
    	$("#evnBuildKind").val(evnBuildType);
    	var result=vlidate($("#query_form"));
    	if(result){
    		baseAjaxJsonp(contextpath+ "evnBuild/save", $("#query_form").serialize(), function(data){
    			if(data.success){
                	$("#AntTable").bootstrapTable("refresh");
                 alert("操作成功!");
                }else{
                    alert(data.message);
                }
    		});
    	}else {
    		alert("所保存内容不全或不符合条件");
    	}
    
    });
});
function initAntTable(evnBuildType) {
    var queryParams = function (params) {
        var temp = {
            limit: params.limit, // 页面大小
            offset: params.offset/params.limit +1 // 页码
        };
        return temp;
    };
    
    var jdkVisble = evnBuildType!=0?false:true;
    $("#AntTable").bootstrapTable("destroy").bootstrapTable({
        url: contextpath + "evnBuild/query/" + evnBuildType,
        method: 'post', // 请求方式（*）,
        dataType:"jsonp",
        contentType: "application/x-www-form-urlencoded",
        striped: false, // 是否显示行间隔色
        cache: false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        sortable: true, // 是否启用排序
        sortOrder: "asc", // 排序方式
        queryParams: queryParams,// 传递参数（*）
        sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
        pagination: true, // 是否显示分页（*）
        pageList: [5, 10, 15], // 可供选择的每页的行数（*）
        pageNumber: 1, // 初始化加载第一页，默认第一页
        pageSize: 5, // 每页的记录行数（*）
        clickToSelect: true, // 是否启用点击选中行
        uniqueId: "id", // 每一行的唯一标识，一般为主键列
        cardView: false, // 是否显示详细视图
        detailView: false, // 是否显示父子表
        singleSelect: true,// 复选框单选
        onPreBody: function (data) {
        },
        onLoadSuccess: function (data) {
        },
        columns: [
            {
                checkbox : true,
                align : 'center',
                valign : 'middle',
                width: "5%"
            }, {
                field: "id",
                title: "序号",
                width: "10%",
                align: "center",
                formatter: function(value, row, index){
                	return index+1;
                }
            }, {
                field: "evnBuildName",
                title: "名称",
                width: "15%",
                align: "center"
            }, {
                field: "evnBuildPath",
                title: "路径",
                width: "40%",
                align: "center"
            }, {
                field: "evnBuildVersion",
                title: "JDK版本",
                width: "20%",
                align: "center",
                visible: jdkVisble
            },  {
                field: "evnBuildStatus",
                title: "状态",
                width: "10%",
                formatter:function(value, row, index){
                	return value=="01"?"启用":"停用";
                },
                align: "center"
            },	{
                field: "evnBuilKind",
                title: "类别标识",
                width: "10%",
                visible:false,
            }]
    });
}