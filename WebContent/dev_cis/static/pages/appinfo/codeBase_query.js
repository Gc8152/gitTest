/**
 * 提供页面切换刷新页面的函数 供父页面的main.js 193行使用。
 * @returns
 */
function refreshTable(){
	$("#query").click();
}

$(document).ready(function () {
    // 初始化列表
    initCodeBaseTable();

    $("#add").click(function () {
    	var fun = function(){
			$("#query").click();
		}
        parent.openTab("codeBase_add","appInfo/codeBase_edit.html?pageType=add","新增代码库信息", parent.$("iframe:visible"), fun);
    });
    $("#update").click(function () {
        var items = $("#codeBaseTable").bootstrapTable("getSelections");
        if(items.length==0){
        	alert("请选择一条记录修改");
        }
        var fun = function(){
			$("#query").click();
		}
        parent.openTab("codeBase_update","appInfo/codeBase_edit.html?pageType=update&id="+items[0]["ID"],"修改代码库信息", parent.$("iframe:visible"), fun);
    });
    $("#delete").click(function () {
        var items = $("#codeBaseTable").bootstrapTable("getSelections");
        if(items.length==1){
        	nconfirm("你确定要删除该项吗？",function(){
        		baseAjaxJsonp(contextpath+"codeBase/deleteById", {id:items[0]["ID"]}, function(data){
        			if(data.success){
                        alert("删除成功");
                        initCodeBaseTable();
                    }else{
                        alert(data.message);
                    }
        		});
        	});
        }else{
        	alert("请选择一条记录删除");
        }
     
    });
    $("#detail").click(function () {
        var items = $("#codeBaseTable").bootstrapTable("getSelections");
        if(items.length==0){
        	alert("请选择一条记录查看");
        }
        //查看详情
        parent.openTab("codeBase_detail","appInfo/codeBase_edit.html?pageType=detail&id="+items[0]["ID"],"代码库信息详情");
    });
    $("#query").click(function () {
        initCodeBaseTable();
    });
    //重置
    $("#reset").click(function(){
    	$("#systemName").val(null);
    	$("#systemShort").val(null);
    	$("#appName").val(null);
    })
});

function initCodeBaseTable() {
    var queryParams = function (params) {
        var temp = {
            limit: params.limit, // 页面大小
            offset: params.offset/params.limit +1 // 页码
        };
        var $form = $("#codeBaseFormQuery");
        var $inputs = $form.find("input");
        for(var i=0; i<$inputs.length; i++){
            if($inputs[i].value!=""){
                temp[$($inputs[i]).attr("name")] = $.trim($inputs[i].value);
            }
        }
        return temp;
    };

    $("#codeBaseTable").bootstrapTable("destroy").bootstrapTable({
        url: contextpath+ "codeBase/query",
        method: 'post', // 请求方式（*）
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
        uniqueId: "ID", // 每一行的唯一标识，一般为主键列
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
            },
            {
                field: "ROW_ID",
                title: "序号",
                width: "5%",
                align: "center"
            }, {
                field: "SYSTEM_NAME",
                title: "应用名称",
                width: "10%",
                align: "center"
            }, {
                field: "SYSTEM_SHORT",
                title: "应用简称",
                width: "10%",
                align: "center"
            }, {
                field: "APP_NAME",
                title: "子应用名称",
                width: "10%",
                align: "center"
            }, {
                field: "TYPE",
                title: "代码库类型",
                width: "10%",
                formatter: function(value, row, index){
                	if(row.scm=="02"){
                		return "scm";
                	} else {
                		if(value=="01"){
    						return "SVN";
    					} else if(value=="02"){
    						return "ClearCase";
    					} else if(value=="03"){
    						return "RTC";
    					} else {
    						return "GIT";
    					}
                	}
                },
                align: "center"
            }, {
                field: "URL",
                title: "代码库存放路径",
                width: "20%",
                align: "center"
            }, {
                field: "USERNAME",
                title: "代码库访问用户名",
                width: "10%",
                align: "center"
            }]
    });
}
function warnSelect(items){
	if(items.length==0){
    	alert("请选择一条记录");
    }
}