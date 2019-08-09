/**
 * 提供页面切换刷新页面的函数 供父页面的main.js 193行使用。
 * @returns
 */
function refreshTable(){
	$("#query").click();
}
$(function(){
	/*******************************/
	$("#test").click(function(event){
		//document.getElementById("query_form").reset();
		parent.openTab("workOrderAppInfo_dd","monitor/test.html","测试文件上传");
	});
	/*******************************/
	//测试测试测试
	
	$('#flowExecInfoForm input[name=reqSubCode]').attr("readonly", "readonly");
	
    initWorkOrderAppInfo();
    initBootstrapTable();
    /**页面按钮事件**/
    //关闭页签
    $("#close").click(function () {
        parent.closeCurrentTab(parent);
    });
    
    //选择需求
    $('#flowExecInfoForm input[name=reqSubCode]').click(function(event){
    	$("#requestSelect_modal").modal("show");
		initRequestSelectTable();
    });
    
    //新增流程
	$("#add").click(function(event){
		//弹框选择流程
		$("#flowadd_modal").modal("show");
		initFlowSelectTable();
	});
	//删除流程
	$("#delete").click(function(event){
		//对已选择的流程进行删除
		var selectList = $("#flowListTable").bootstrapTable("getSelections");
		if(selectList!=null){
			for(var i=0; i<selectList.length; i++){
				$("#flowListTable").bootstrapTable("removeByUniqueId", selectList[i]["id"]);
			}
		} else {
			alert("请至少选择一个流程进行删除");
		}
		
	});
	
	//保存工单
	$("#save").click(function(event){
		var param = new Object();
		param["reqSubCode"] = $('#flowExecInfoForm input[name=reqSubCode]').val();
		param["reqSubName"] = $('#flowExecInfoForm input[name=reqSubName]').val();
		param["code"] = $('#flowExecInfoForm input[name=code]').val();
		param["workorderType"] = $("#workorderType").val();
		param["workOrderStatus"] = "00";
		
		var tableData = $("#flowListTable").bootstrapTable("getData");
		var flowIds = "";
		var relFileIds = "";
		$.map(tableData, function(n, i){
			flowIds += n["id"] + ",";
			relFileIds += n["relFileId"] + ",";
		});
		param["flowIds"] = flowIds.substr(0, flowIds.length-1);
		param["relFileIds"] = relFileIds.substr(0, relFileIds.length-1);
		baseAjaxJsonp(contextpath + "workOrderInfo/save", param, function(data){
			alert("保存成功");
			parent.closeCurrentTab(parent);
		});
/*		$.post(contextpath + "workOrderInfo/save", param, function(data){
			alert("保存成功");
			parent.closeCurrentTab(parent);
		},"json");*/
	});
	
	/*//查看流程
	$("#detail").click(function(event){
		//TODO
		//查看流程详情
		var items = $("#workOrderInfo_table").bootstrapTable("getSelections");
		if(items.length==1){
			parent.openTab("workOrderAppInfo_query","monitor/workOrderAppInfo_query.html?id=" +items[0]["id"],"子应用执行列表");
		} else {
			alert("请选择一条记录");
		}
	});*/
	
	
	/**需求选择模态框事件的选择**/
	//查询需求
    $("#queryRequest").click(function(event){
    	//initFlowSelectTable();
    });
    
    //确认需求
    $("#requestSelectSure").click(function(event){
    	var requestList = $("#requestSelectTable").bootstrapTable("getSelections");
    	if(requestList==null || requestList.length!=1){
    		alert("请选择一条需求");
    	}else {
    		$('#flowExecInfoForm input[name=reqSubCode]').val(requestList[0]["reqSubCode"]);
    		$('#flowExecInfoForm input[name=reqSubName]').val(requestList[0]["reqSubName"]);
    		$("#requestSelect_modal").modal("hide");
    	}
    });
    
	/**流程选择模态框事件**/
	//查询流程
    $("#queryAppFlow").click(function(event){
    	initFlowSelectTable();
    });
    
    //确认选择
    $("#flowListSelectSure").click(function(event){
    	var selectList = $("#flowListSelectTable").bootstrapTable("getSelections");
    	if(selectList!=null){
    		var sureList = $.map(selectList, function(n, i){
        		var item = $("#flowListTable").bootstrapTable("getRowByUniqueId", n ["id"]);
        		if(item==null){
        			var obj = new Object();
            		obj["systemName"] = n["appInfo"]["systemId"];
            		obj["appName"] = n["appInfo"]["appName"];
            		obj["flowName"] = n["flowName"];
            		obj["id"] = n["id"];
            		obj["isNew"] = true;
            		//添加至列表中
            		$("#flowListTable").bootstrapTable("append", obj);
        		}
        		return obj;
        	});
    		$("#flowadd_modal").modal("hide");
		} else {
			alert("请至少选择一个流程进行添加");
		}
    });
	
    
    //初始化列表
    //flowListTable;
    function initBootstrapTable() {
    	var selectCellEvent = {
			'click span': function (e, value, row, index) {
				if($(this).next().length>0){
					$(this).hide();
					$(this).next().show();
					$(this).next().focus();
				}
			}, 'change select': function (e, value, row, index) {
				row[$(this).data("field")] = $(this).val();
				$(this).prev().text($(this).find("option:selected").text());
			}, 'focusout select': function (e, value, row, index) {
				$(this).hide();
				$(this).prev().show();
			}
		};
    	var fileUploadEvent = {
			'click button': function (e, value, row, index) {
				//1未上传过文件，file_id不存在
				//2上传过文件，file_id存在
				openFileUploadModal(row.id, row.relFileId, row, $(this).next());
			}
    	}
    	
        var id= $.getUrlParam("id");
        $("#flowListTable").bootstrapTable("destroy").bootstrapTable({
			url : contextpath + "workOrderAppInfo/query?id=0",
			method : 'post', // 请求方式（*）
			contentType: "application/x-www-form-urlencoded",
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			dataType:"jsonp",
			//queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : false, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 5, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			uniqueId : "id", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : false,// 复选框单选
			columns : [ {
				checkbox : true,
				align : 'center',
				valign : 'middle',
				width: "5%"
			},{
				field : '-',
				title : '序号',
				align : "center",
				formatter : function(value, row, index){
					return index+1;
				},
				width:"5%"
			},{
				field : 'systemName',
				title : '应用名称',
				align : "center",
				width : "10%"
			}, {
				field : "appName",
				title : "子应用名称",
				align : "center",
				width : "10%"
			}, {
				field : "flowName",
				title : "流程名称",
				align : "center",
				width : "10%"
			}, {
				field : "deployType",
				title : "部署类型",
				align : "center",
				width : "10%",
				events : selectCellEvent,
				formatter : function(value, row, index){
					//row.deployType = isUpdate ? value : "00";
					row.deployType = value = "00";
					var status = value=="00" ? "全量" : "增量";
					var str = "<span>" + status + "</span>";
					str += "<select style='display:none' data-field='deployType' value='"+ value +"'><option value='00'>全量</option><option value='01'>增量</option></select>";
					return str;
				}
			}, {
				field : "attachedFiles",
				title : "附件(当前个数)",
				align : "center",
				width : "10%",
				events : fileUploadEvent,
				formatter : function(value, row, index){
					var status = row.relFileId == null ? "null" : row.relFileId;
					var num = row.attachedFiles == null ? 0 : row.attachedFiles;
					var str = "<button>上传</button>";
					str += "<span>" + num + "</span>"
					str += "<input type='hidden' name='file_id' value='"+status+"'/>";
					return str;
				}
			}]
		});
    }

    function initWorkOrderAppInfo(){
        var id= $.getUrlParam("id");
        if(id==null){
        	id = "0";
        } else {
        	baseAjaxJsonp( contextpath + "workOrderAppInfo/queryById", {id:id}, function(data){
        		  if(data.success){
                  	var item = data.result[0];
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
     /*   	$.ajax({
                type : "post",
                url : contextpath + "workOrderAppInfo/queryById",
                async :  true,
                data : {id:id},
                dataType : "json",
                success : function(data) {
                    if(data.success){
                    	var item = data.result[0];
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
    }
    
    function autoRefresh(){
    	initWorkOrderAppInfo();
    	$("#flowStepInfo_table").bootstrapTable("refresh");
    }
    
    //初始化模态框列表
    //文件上传模态框
    var $fileNumGlobal = null;
    function openFileUploadModal(rowid, relFileId, row, $fileNum){
    	if(!relFileId){
    		baseAjaxJsonp(contextpath + "files/fileinfo/getFileId", null, function(data){
    			relFileId = data.message;
    			row.relFileId = relFileId;
    			document.getElementById("fileSubmit_form").reset();
    	    	$("#fileSubmit_modal").modal('show');
    	    	$("#fileSubmitTable").find("input[name=relFileId]").val(relFileId);
    	    	initFileListTable(relFileId, $fileNum);
    		});
    	} else {
    		document.getElementById("fileSubmit_form").reset();
	    	$("#fileSubmit_modal").modal('show');
	    	$("#fileSubmitTable").find("input[name=relFileId]").val(relFileId);
	    	initFileListTable(relFileId, $fileNum);
    	}
    	$fileNumGlobal = $fileNum;
    }
    //初始化文件列表
    function initFileListTable(relFileId, $fileNum){
    	$("#fileListTable").bootstrapTable("destroy").bootstrapTable({
			url : contextpath + "files/fileinfo/filelist/" + relFileId,
			method : 'post', // 请求方式（*）
			contentType: "application/x-www-form-urlencoded",
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			dataType:"jsonp",
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : true, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 5, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "REQ_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : false,// 复选框单选
			onLoadSuccess:function(data){
				$fileNum.html(data.rows.length);
			},
			columns : [ {
				checkbox : true,
				//rowspan : 2,
				align : 'center',
				valign : 'middle'
			},{
				field : 'id',
				title : '序号',
				align : "center",
				formatter : function(value, row, index){
					return index+1;
				}
			},{
				field : 'fileName',
				title : '文件名称',
				align : "center",
				width : "13%"
			},{
				field : 'fileType',
				title : '文件类型',
				align : "center",
				width : "19%", 
				formatter : function(value, row, index){
					return value == "00" ? "sql文件" : "配置文件";
				}
			}, {
				field : "uploadTime",
				title : "上传时间",
				align : "center",
				width : "13%"
			}, {
				field : "uploadBy",
				title : "操作人",
				align : "center",
				width : "10%"
			}, {
				field : "action",
				title : "操作",
				align : "center",
				width : "10%",
				formatter : function(value, row, index){
					return "<button file_id='"+row.id+"'>删除</button>";
				}
			}]
		});
    }
    
    //文件上传模态框提交按钮事件
    $("#fileSubmit").click(function(e){
    	var data = {"fileType": $("#fileSubmitTable").find("select[name=fileType]").val(),
    			"relFileId": $("#fileSubmitTable").find("input[name=relFileId]").val()};
    	$.ajaxFileUpload({
		    url:"http://localhost:8080/cis/" + "files/upload",
		    type:"post",
			secureuri:false,
			fileElementId:"selectFile",
			data:data,
			dataType:"json",
			//contentType: "application/json"
			success:function (data){
				if(data.message == "success"){
					alert("上传成功");
				} else {
					alert("上传失败");
				}
				$("#fileListTable").bootstrapTable("refresh");
			},
			error: function (msg){
				alert("上传失败");
			}
	    });
    });
    
    //上传文件确定
    $("#fileSubmitSure").click(function(e){
    	
    });
    
    //上传文件模态框关闭时
    $("#fileSubmit_modal").on("hide.bs.modal", function(){
    	var fileTableData = $("#fileListTable").bootstrapTable("getData");
    	$fileNumGlobal.html(fileTableData.length);
    });
    
    
  //requestSelectTable
    function initRequestSelectTable(){
    	//未对接需求管理，先使用假数据
    	var requestData = {rows:[
    		{id:"1", reqSubCode:"xq0001", reqSubName:"需求一", createBy:"钟"},
    		{id:"2", reqSubCode:"xq0002", reqSubName:"需求二", createBy:"加"},
    		{id:"3", reqSubCode:"xq0003", reqSubName:"需求三", createBy:"云"},
    		{id:"4", reqSubCode:"xq0004", reqSubName:"需求四", createBy:"钟"}
    	]};
    	
		var queryParams = function(params) {
			var serverInfo = {
				limit : params.limit, // 页面大小
				offset : params.offset/params.limit +1	// 页码
			};
			var $form = $("#requestQuery_form");
			var $inputs = $form.find("input");
			for(var i=0; i<$inputs.length; i++){
				if($inputs[i].value!=""){
					serverInfo[$($inputs[i]).attr("name")] = $.trim($inputs[i].value);
				}
			}
			return serverInfo;
		};
		$("#requestSelectTable").bootstrapTable("destroy").bootstrapTable({
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			dataType:"jsonp",
			//queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : false, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 10, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "id", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			onLoadSuccess:function(data){
			},
			columns : [ {
				checkbox : true,
				align : 'center',
				valign : 'middle'
			},{
				field : 'id',
				title : '序号',
				align : "center"
			},{
				field : 'reqSubCode',
				title : '需求编号',
				align : "center",
				width : "13%"
			},{
				field : 'reqSubName',
				title : '需求名称',
				align : "center",
				width : "19%"
			}, {
				field : "createBy",
				title : "需求提出人",
				align : "center",
				width : "13%"
			}]
		});
		$("#requestSelectTable").bootstrapTable("load", requestData);
    }
    function initFlowSelectTable(){
    	var queryParams = function(params) {
			var serverInfo = {
				limit : params.limit, // 页面大小
				offset : params.offset/params.limit +1	// 页码
			};
			
			var $form = $("#query_form");
			var $inputs = $form.find("input");
			for(var i=0; i<$inputs.length; i++){
				if($inputs[i].value!=""){
					serverInfo[$($inputs[i]).attr("name")] = $.trim($inputs[i].value);
				}
			}
			serverInfo["serverUseType"] = "03";
			serverInfo["flowStatus"] = "00";
			return serverInfo;
		};
		$("#flowListSelectTable").bootstrapTable("destroy").bootstrapTable({
			url : contextpath + "cis_flow/list",
			method : 'post', // 请求方式（*）
			contentType: "application/x-www-form-urlencoded",
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			dataType:"jsonp",
			queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : true, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 5, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "REQ_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : false,// 复选框单选
			onLoadSuccess:function(data){
			},
			columns : [ {
				checkbox : true,
				//rowspan : 2,
				align : 'center',
				valign : 'middle'
			},{
				field : 'id',
				title : '序号',
				align : "center",
				formatter : function(value, row, index){
					return index+1;
				}
			},{
				field : 'appId',
				title : '子应用名称',
				align : "center",
				width : "13%",
				formatter : function(value, row, index){
					if(value!=null){
						return row.appInfo.appName;
					}
				}
			},{
				field : 'flowName',
				title : '流程名称',
				align : "center",
				width : "19%"
			}, {
				field : "flowType",
				title : "流程类型",
				align : "center",
				width : "13%"
			}, {
				field : "updateTime",
				title : "最后修改时间",
				align : "center",
				width : "10%"
			}, {
				field : "appInfo",
				title : "应用名称",
				align : "center",
				width : "10%",
				formatter : function(value, row, index){
					if(value!=null){
						return value.systemId;
					}
				}
			}]
		});
    }
});