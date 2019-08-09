/**
 * 提供页面切换刷新页面的函数 供父页面的main.js 193行使用。
 * @returns
 */
function refreshTable(){
	$("#query").click();
}
$(document).ready(function () {
    // 初始化列表
	$("select").select2();
    initAppInfoTable();
    
    //新增
	$("#add").click(function () { 
	    //parent.openTab("appInfo_add","appInfo/appInfo_edit.html?pageType=add","新增子应用", parent.$("iframe:visible"));
		var fun = function(){
			$("#query").click();
		}
	    parent.openTab("appInfo_add","appInfo/appInfo_edit.html?pageType=add","新增子应用", parent.$("iframe:visible"), fun);
	});
	//数据同步
	/*$("#sync").click(function(){
		$.post(contextpath+'appInfo/sync',null,function(data){
			if(data.success){
				alert("数据同步成功");
				$("#query").click();
			}else{
				alert("数据同步失败")
			}
		})
	})*/
	
	//修改
    $("#update").click(function () {
    	var items = $("#appInfoTable").bootstrapTable("getSelections");
    	if(items.length==0){
        	alert("请选择一条记录修改");
        }
    	var fun = function(){
			$("#query").click();
		}
        parent.openTab("appInfo_update","appInfo/appInfo_edit.html?pageType=update&id="+items[0]["ID"],"修改子应用", parent.$("iframe:visible"));
    });
    
    //删除
    /*$("#delete").click(function () {
    	var items = $("#appInfoTable").bootstrapTable("getSelections");
    	if(items.length==1){
        	nconfirm("你确定要删除该项吗？",function(){
        		baseAjaxJsonp(contextpath+"appInfo/deleteById", {id:items[0]["ID"]}, function(data){
        			 if(data.success){
                         alert("操作成功");
                         $("#appInfoTable").bootstrapTable("refresh", $("#appInfoFormQuery").serialize());
                     }else{
                         alert(data.message);
                     }
        		});
        	})
        }else{
        	alert("请选择一条记录删除");
        }
    });*/
    //启停用
    $("#openOrClose").click(function(){
    	var item=$("#appInfoTable").bootstrapTable("getSelections");
    	if(item.length==1){
    			nconfirm("确定要执行该操作吗？",function(){
        				baseAjaxJsonp(contextpath + "appInfo/changeStatus",{appInfoId:item[0]["ID"]},function(data){
        					if (data.success) {
        						$("#appInfoTable").bootstrapTable("refresh");
        						alert("操作成功!");
        					} else {
        						alert(data.message);
        					}
        				});
    			})
    	}else{
    		alert("请选择一条记录进行操作");
    	}
    })
    
    $("#reset").click(function () {
        reset();
    });
    
    $("#query").click(function () {
        initAppInfoTable();
    });

    $("#detail").click(function () {
    	var items = $("#appInfoTable").bootstrapTable("getSelections");
    	if(items.length==0){
        	alert("请选择一条记录查看");
        }
    	var fun = function(){
			$("#query").click();
		}
        parent.openTab("appInfo_detail","appInfo/appInfo_edit.html?pageType=detail&id="+items[0]["ID"],"子应用详情", parent.$("iframe:visible"));
    });
});
function initAppInfoTable() {
    var queryParams = function (params) {
        var temp = {
        	status:$("#status").val(),
            limit: params.limit, // 页面大小
            offset: params.offset/params.limit +1 // 页码
        };
        var $form = $("#appInfoFormQuery");
        var $inputs = $form.find("input");
        for(var i=0; i<$inputs.length; i++){
            if($inputs[i].value!=""){
                temp[$($inputs[i]).attr("name")] = $.trim($inputs[i].value);
            }
        }
        
        return temp;
    };
    $("#appInfoTable").bootstrapTable("destroy").bootstrapTable({
        url: contextpath + "appInfo/query",
        method: 'post', // 请求方式（*）
        contentType: "application/x-www-form-urlencoded",
        striped: false, // 是否显示行间隔色
        cache: false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        sortable: true, // 是否启用排序
        sortOrder: "asc", // 排序方式
        queryParams: queryParams,// 传递参数（*）
        sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
        dataType:"jsonp",
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
        columns: [{
                checkbox : true,
                align : 'center',
                valign : 'middle',
                width: "5%"
            }, {
                field: "ROW_ID",
                title: "序号",
                width: "5%",
                align: "center"
            }, {
                field: "SYSTEM_NAME",
                title: "所属应用",
                width: "7%",
                align: "center"
            }, {
                field: "SYSTEM_SHORT",
                title: "应用简称",
                width: "7%",
                align: "center"
            }, {
                field: "APP_NAME",
                title: "子应用名称",
                width: "10%",
                align: "center"
            }, {
                field: "APP_SHORT_NAME",
                title: "子应用缩写",
                width: "10%",
                align: "center"
            }, {
                field: "USER_NAME",
                title: "应用负责人",
                width: "10%",
                align: "center"
            }, {
                field: "STATUS",
                title: "子应用状态",
                width: "8%",
                formatter:function(value, row, index){
                	return value=="00"?"启用":"停用";
                },
                align: "center"
            }, {
                field: "CREATE_TIME",
                title: "创建日期",
                width: "10%",
                align: "center"
            }]
    });
}
