/**
 * 提供页面切换刷新页面的函数 供父页面的main.js 193行使用。
 * @returns
 */
function refreshTable(){
	$("#query").click();
}
$(function(){
    $('#flowExecInfoForm input').attr("readonly", "readonly");
    $('#flowStepInfoForm input').attr("readonly", "readonly");

    initWorkOrderAppInfo();
    
    $("#close").click(function () {
        parent.closeCurrentTab(parent);
    });

    //初始化列表
    function initBootstrapTable(flowInfoId) {
        //var id= $.getUrlParam("id");
        $("#flowStepInfo_table").bootstrapTable("destroy").bootstrapTable({
            url : contextpath + "workOrderAppInfo/queryFlowStepInfoList",
            method : 'post', // 请求方式（*）
            contentType: "application/x-www-form-urlencoded",
            striped : false, // 是否显示行间隔色
            cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            sortable : true, // 是否启用排序
            sortOrder : "asc", // 排序方式
            dataType:"jsonp",
            queryParams : {flowId:flowInfoId},// 传递参数（*）
            sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
            pagination : false, // 是否显示分页（*）
            pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
            pageNumber : 1, // 初始化加载第一页，默认第一页
            pageSize : 5, // 每页的记录行数（*）
            clickToSelect : false, // 是否启用点击选中行
            uniqueId : "id", // 每一行的唯一标识，一般为主键列
            cardView : false, // 是否显示详细视图
            detailView : false, // 是否显示父子表
            singleSelect : true,// 复选框单选
            onLoadSuccess:function(data){
            	rowIndex = $("input[name=rowIndex]").val();
            	if(""!=rowIndex&&null!=rowIndex){
            		var rowData = data.rows[rowIndex];
            		$("#flowStepInfoForm")[0].reset();
                    $("#flowStepInfoForm").setform(rowData);
            	}
            },
            columns : [ {
                field : '-',
                title : '序号',
                align : "center",
                formatter : function(value, row, index){
                    return index+1;
                },
                width:"20%"
            },{
                field : 'stepName',
                title : '节点名',
                align : "center",
                width : "40%"
            },{
                field : 'execStatus',
                title : '执行状态',
                align : "center",
                width : "35%",
                formatter : function(value, row, index){
                	if(value=="01"){
                		return "执行中";
                	} else if(value=="02"){
                		return "执行完成";
                	} else if(value=="03"){
                		return "执行出错";
                	} else{
                		return "未开始";
                	}
                	return ;
                }
            }] ,
            onClickRow:function(rowData,$element){
               var flowStepId=rowData.id;
               $("#flowStepInfoForm")[0].reset();
               $("#flowStepInfoForm").setform(rowData);
               $("input[name=rowIndex]").val($element.attr("data-index"));
            },
            onRefresh:function(params){
            	/*rowIndex = $("input[name=rowIndex]").val();
            	if(""!=rowIndex&&null!=rowIndex){
            	}*/
            }

        });
    }

    function initWorkOrderAppInfo(){
        var id= $.getUrlParam("id");
        baseAjaxJsonp(contextpath + "workOrderAppInfo/queryById", {id:id}, function(data){
        	  if(data.success){
              	var item = data.result[0];
              	initBootstrapTable(item.flowInfoId);
                  $("#flowExecInfoForm").setform(item);
                  if("执行中"==item.flowExecStatus){
                  	window.parent.addTimerTask("workOrderAppInfo_detail",autoRefresh);
					} else {
						window.parent.removeTimerTask("workOrderAppInfo_detail");
					}
              } else {
                  alert(data.message);
              }
		});
        
/*        $.ajax({
            type : "post",
            url : contextpath + "workOrderAppInfo/queryById",
            async :  true,
            data : {id:id},
            dataType : "json",
            success : function(data) {
                if(data.success){
                	var item = data.result[0];
                	initBootstrapTable(item.flowInfoId);
                    $("#flowExecInfoForm").setform(item);
                    if("执行中"==item.flowExecStatus){
                    	window.parent.addTimerTask("workOrderAppInfo_detail",autoRefresh);
					} else {
						window.parent.removeTimerTask("workOrderAppInfo_detail");
					}
                } else {
                    alert(data.message);
                }
            },
            error : function(msg) {
            }
        });*/
    }
    
    function autoRefresh(){
    	initWorkOrderAppInfo();
    	$("#flowStepInfo_table").bootstrapTable("refresh");
    }
});


