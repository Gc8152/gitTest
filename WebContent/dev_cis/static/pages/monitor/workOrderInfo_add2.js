/**
 * 提供页面切换刷新页面的函数 供父页面的main.js 193行使用。
 * @returns
 */
function refreshTable(){
	$("#query").click();
}
$(function(){
	initVlidate($("#workOrderTable"));
	var editCellEvent = {
		'click span': function (e, value, row, index) {
			if($(this).next().length>0){
				$(this).hide();
				$(this).next().show();
				$(this).next().focus();
			}
		}, 'change input': function (e, value, row, index) {
			row[$(this).data("field")] = $(this).val();
			$(this).prev().text($(this).val());
		}, 'focusout input': function (e, value, row, index) {
			$(this).hide();
			$(this).prev().show();
		}
	};
	
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
	
	var requestInfo = null;
	//
	var appInfoList = null;
	var appInfo = null;
	var cisFlowInfo = new Object();
	
	//
	var branchInfoList = null;
	var branchInfo = null;
	
	//代码库选项
	var codeBaseInfo = null;
	//环境配置选项
	var evnConfigList = null;
	var evnConfigInfo = null;
	
	var select2Config = function(rows, tempSelectFun, tempResultFun){
		var obj = {
				data:rows,
				templateSelection: tempSelectFun,
				templateResult : tempResultFun
		}
		 return obj;
	}
	
	$("#addFile").click(function(e){
		//openFileUploadModal(row.id, row.relFileId, row, $(this).next());
		openFileUploadModal(null, $('#flowExecInfoForm input[name=relFileId]').val(), null, $(this).next());
	});
	
	//initSelectData();
	
	function initWorkOrderAppInfo(){
        var id= $.getUrlParam("id");
        if(id==null){
        	baseAjaxJsonp(contextpath + "workOrderInfo/getWorkOrderCode", null,function(result){
        		$("input[name=code]").val(result.message);
        	});
        	id = "0";
        } else {
        	baseAjaxJsonp(contextpath + "workOrderAppInfo/queryById", {id:id}, function(data){
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
        }
    }
	
	/********************initSelectData***************/
	initWorkOrderAppInfo();
	//初始化子应用选择，有需求选择确定系统触发；
	function initAppSelectData(){
		baseAjaxJsonp(contextpath + 'cis_flow/queryAppInfo', {systemShort: requestInfo["systemShort"]}, function(data){
			if(data["success"]){
				appInfoList = data["result"];
				initSelectOption(appInfoList, $("#appInfo"), "id", "appName");
			}
		});
		clearSelectOption($("#appInfo"), "请先选择需求");
		clearSelectOption($("#evnConfig"), "请先选择子应用");
		clearSelectOption($("#branch"), "请先选择子应用");
		clearSelectOption($("#baseLine"), "请先选择分支");
	}
	
	$("#appInfo").on("select2:select", function(e){
		var appInfoId = $("#appInfo").val();
		$("input[name=appId]").val(appInfoId);
		getAppIsScmtAndInitBranch(appInfoId);
		//初始化环境下拉框
		initEvnConfigSelectData(appInfoId);
		for(var i in appInfoList){
			var temp = appInfoList[i];
			if(appInfoId == temp["id"]){
				appInfo = temp;
				break;
			}
		}
		$("input[name='appInfo.appShortName'").val(appInfo['appShortName']);
	});
	
	$("#evnConfig").on("select2:select", function(e){
		var evnConfigId = $("#evnConfig").val();
		for(var i in evnConfigList){
			var temp = evnConfigList[i];
			if(evnConfigId == temp["id"]){
				evnConfigInfo = temp;
				break;
			}
		}
		//TODO
		setFormData($("#flowExecInfoForm"), evnConfigInfo, "evnConfig");
		$("input[name=evnId]").val(evnConfigInfo.id);
		//获取ap服务信息
		if(evnConfigInfo.apServerInfoId!=null){
			getServerInfoAndSet(evnConfigInfo.apServerInfoId, function(data){setFormData($("#flowExecInfoForm"), data, "evnConfig.apServerInfo");});
		}
		//获取db服务信息
		if(evnConfigInfo.dbServerInfoId!=null){
			getServerInfoAndSet(evnConfigInfo.dbServerInfoId, function(data){setFormData($("#flowExecInfoForm"), data, "evnConfig.dbServerInfo");});
		}
		
	});
	
	function initEvnConfigSelectData(appInfoId){
		baseAjaxJsonp(contextpath + "cis_flow/evnConfigInfo/findByAppId/" + appInfoId, null, function(data){
			if(data["success"]){
				evnConfigList = data["result"];
				initSelectOption(evnConfigList, $("#evnConfig"), "id", "evnName");
			}
		});
	}
	
	function getAppIsScmtAndInitBranch(appInfoId){
		baseAjaxJsonp(contextpath + "cis_flow/codeBaseInfo/findByAppId/" + appInfoId, null, function(data){
			if(data.success){
				var scm=data.result.scm;
				var type=data.result.type;
				//如果不是scm，判断是否为01SVN/02ClearCase/03RTC/04GIT
				if(scm!=null&&scm==01){
					if(type!=null&&type==01){
						$("#gitTr").hide();
						$("#branchTr").hide();
						//如果是SVN，show代码存放路径
						$("#codeUrlTr").show();
					}else if(type!=null&&type==04){
						//如果是git，show代码存放路径，代码分支，代码标签
						$("#branchTr").hide();
						$("#codeUrlTr").show();
						$("#gitTr").show();
					}
				}else{
					$("#gitTr").hide();
					$("#codeUrlTr").hide();
					$("#branchTr").show();
				}
				codeBaseInfo = data.result;
				setFormData($("#flowExecInfoForm"), appInfo, "appInfo");
				setFormData($("#flowExecInfoForm"), codeBaseInfo, "appInfo.codeBase");
				
				//初始化branch
				initBranchSelectData();
			}
		});
	}
	
	function initBranchSelectData(){
		if(appInfo!=null){
			if(codeBaseInfo.scm){
				//全量获取基线
				var user = {
						username : codeBaseInfo.username,
						password : codeBaseInfo.password
				};
				baseAjaxJsonp(contextpath + 'scmtInfo/queryBranch/' + appInfo.systemInfo.systemShort, user, function(data) {
					var result=data.result;
					initSelectOption(result, $("#branch"), "branch_en", "branch_en");
					branchInfoList = result;
				});
				clearSelectOption($("#baseLine"), "请先选择分支");
			}
		}
	}
	
	$("#branch").on("select2:select", function(e){
		var branchName = $("#branch").val();
		for(var i in branchInfoList){
			var temp = branchInfoList[i];
			if(branchName == temp["branch_en"]){
				branchInfo = temp;
				break;
			}
		}
		var user = {
				username : codeBaseInfo.username,
				password : codeBaseInfo.password
		};
		var deployType = $("#deployType").val();
		if(deployType=="00"){
			baseAjaxJsonp(contextpath + 'scmtInfo/queryBaseLineByBranch/' + appInfo.systemInfo.systemShort + "/" + $.trim($("#branch").val()), user, function(data) {
				var result=data.result;
				initSelectOption(result, $("#baseLine"), "name", "name");
			});
		} else {
			//增量获取tag
			//全量获取基线
			baseAjaxJsonp(contextpath + 'scmtInfo/findTagByFlagAndBranchId/' + appInfo.systemInfo.systemShort + '/' + branchInfo.id, user, function(data) {
				var result = data.result;
				initSelectOption(result, $("#baseLine"), "t_name", "t_name");
			});
		}
	});
	
	$("#buildType").on("select2:select", function(e){
		if(deployType=="01"){
			var branchName = $("#branch").val();
			for(var i in branchInfoList){
				var temp = branchInfoList[i];
				if(branchName == temp["branch_en"]){
					branchInfo = temp;
					break;
				}
			}
			var user = {
					username : codeBaseInfo.username,
					password : codeBaseInfo.password
			};
			var deployType = $("#deployType").val();
			//增量获取tag
			//全量获取基线
			baseAjaxJsonp(contextpath + 'scmtInfo/findTagByFlagAndBranchId/' + appInfo.systemInfo.systemShort + '/' + branchInfo.id, user, function(data) {
				var result = data.result;
				initSelectOption(result, $("#baseLine"), "t_name", "t_name");
			});
		}
	});
	
	function initSelectOption(data, $select, valueStr, textStr){
		$select.find("option").remove();
		$select.val(null).trigger("change");
		$select.append('<option value=" " selected="selected">请选择</option>');
		for(var p in data){
			$select.append("<option value='" + data[p][valueStr]+ "'>" +data[p][textStr]+ "</option>");
		}
		$select.select2();
	}
	
	function clearSelectOption($select, msg){
		$select.find("option").remove();
		$select.val(null).trigger("change");
		$select.append('<option value=" " selected="selected">' + msg + '</option>');
	}
	
	/********************initSelectData***************/
	function getServerInfoAndSet(serverInfoId, successFun){
		baseAjaxJsonp(contextpath + "server_info/info/" + serverInfoId, null, function(data){
			if(data.success){
				successFun(data.result);
			}
		});
	}
	
	function clearFormData($form, midStr){
		$form.find("input[name^="+midStr+"]").val("");
		$form.find("textarea").text("");
	}
	
	function setFormData($form, data, midStr){
		for(var item in data){
			if(item!="element"){
				if(item!="element" && typeof(data[item])!=="object"){
					$form.find("[name='" + (typeof(midStr)==="undefined"?"":midStr + ".") + item + "']").val(data[item]);
				} else {
					setFormData($form, data[item], (typeof(midStr)==="undefined"?"":(midStr + ".")) + item);
				}
			}
		}
	}
	
	initFileListTable("");
	//初始化文件列表
    function initFileListTable(relFileId){
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
	
    initFlowStepTable("");
    function initFlowStepTable(cisFlowId){
		
		var cisFlowId = getParamString("id");
		var isUpdate = true;
		if(cisFlowId!=""&&cisFlowId!=null&&cisFlowId!=undefined){
		} else {
			isUpdate = false;
		}
		
		var detail = getParamString("detail");
		var isShow = false;
		if(detail!=""&&detail!=null&&detail!=undefined){
			isShow = true;
		}
		
		var url;
		if(cisFlowId==null){
			url = contextpath + "cis_flow/job/findAllJob";
		} else {
			url = contextpath + "cis_flow/flowStep/findFlowStepListByFlowId/" + cisFlowId; 
		}
		$("#cis_flow_step_table").bootstrapTable("destroy").bootstrapTable({
			url : url,
			method : 'post', // 请求方式（*）
			contentType: "application/x-www-form-urlencoded",
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			dataType:"jsonp",
			queryParams : null,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : false, // 是否显示分页（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "REQ_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			dataField : "result",
			onLoadSuccess:function(data){
			},
			columns : [ {
				field : 'id',
				title : '序号',
				align : "center",
				formatter : function(value, row, index){
					return index+1;
				}
			},{
				field : 'stepName',
				title : '流程步骤名称',
				align : "center",
				width : "32%",
				events : editCellEvent,
				formatter : function(value, row, index){
					row.stepName = isUpdate ? value : row.jobName;
					var str = "<span>" + row.stepName + "</span>";
					if(!isShow){
						str += "<input style='display:none' data-field='stepName' value='"+ row.stepName +"'></input>";
					}
					return str;
				}
			},{
				field : 'stepStatus',
				title : '流程步骤状态',
				align : "center",
				width : "18%",
				events : selectCellEvent,
				formatter : function(value, row, index){
					row.stepStatus = isUpdate ? value : "00";
					var status = value=="01" ? "停用" : "启用";
					var str = "<span>" + status + "</span>";
					if(!isShow){
						str += "<select style='display:none' data-field='stepStatus' value='"+ status +"'><option value='00'>启用</option><option value='01'>停用</option></select>";
					}
					return str;
				}
			}, {
				field : "stepDesc",
				title : "流程步骤描述",
				align : "center",
				width : "50%",
				events : editCellEvent,
				formatter : function(value, row, index){
					row.stepDesc = isUpdate ? value : row.jobDesc;
					var str = "<span>" + row.stepDesc + "</span>";
					if(!isShow){
						str += "<input style='display:none' data-field='stepDesc' value='"+ row.stepDesc +"'></input>";
					}
					return str;
				}
			}]
		});
	}
	
	/********--------------------------------------------********************/
	
	/*******************************/
	$("#test").click(function(event){
		//document.getElementById("query_form").reset();
		parent.openTab("workOrderAppInfo_dd","monitor/test.html","测试文件上传");
	});
	/*******************************/
	
	$('#flowExecInfoForm input[name=reqSubCode]').attr("readonly", "readonly");
	
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
		param["reqSubCode"] = $('#flowExecInfoForm input[name=reqSubCode]').val(); //需求编号
		param["reqSubName"] = $('#flowExecInfoForm input[name=reqSubName]').val(); //需求名称
		param["code"] = $('#flowExecInfoForm input[name=code]').val();
		param["workorderType"] = $("#workorderType").val(); //环境类型
		param["workOrderStatus"] = "00";
		
		param["relFileId"] = $('#flowExecInfoForm input[name=relFileId]').val();
		
		//流程数据
		var $form = $("#flowExecInfoForm");
		var result = vlidate($("#workOrderTable"));
		
		//var param = new Object();
		param["appId"] = $.trim($form.find("input[name=appId]").val()); //应用信息
		param["flowType"] = "01";
		param["flowName"] = $.trim($form.find("input[name=flowName]").val());//流程名称
		param["projectName"] = $.trim($form.find("input[name=projectName]").val());//部署包名称
		param["flowStatus"] = "00";
		param["buildType"] = $.trim($form.find("select[name=buildType]").val());//构建类型
		param["deployType"] = $.trim($form.find("select[name=deployType]").val());//部署类型
		param["evnId"] = $.trim($form.find("input[name=evnId]").val());//环境信息
		param["branch"]= $.trim($form.find("select[name=branch]").val());//分支
		param["baseline"]= $.trim($form.find("select[name=baseLine]").val());//基线
		param["codeUrl"]= $.trim($form.find("input[name=codeUrl]").val());//代码存放路径
		param["gitCodeBranch"]= $.trim($form.find("input[name=gitCodeBranch]").val());//代码存放分支
		param["gitCodeTag"]= $.trim($form.find("input[name=gitCodeTag]").val());//代码存放标签
		var cisFlowId = getParamString("id");
		var isUpdate = true;
		if(cisFlowId!=""&&cisFlowId!=null&&cisFlowId!=undefined){
		} else {
			isUpdate = false;
		}
		var rows = JSON.parse(JSON.stringify($("#cis_flow_step_table").bootstrapTable("getData")));
		for(var row in rows){
			var item = rows[row];
			item.jobId = item.id;
			if(!isUpdate){
				delete item.id;
			}
		}
		param["flowSteps"] = JSON.stringify(rows);
		if (result){
			baseAjaxJsonp(contextpath + "workOrderInfo/save", param, function(data){
				alert("保存成功");
				var tab = parent.getCurrentPageTab();
				var item = data.result;
				parent.openTab("workOrderAppInfo_query","monitor/workOrderAppInfo_query.html?id=" +item["id"] + "&autoRun=true","子应用执行列表");
				parent.closeTabClick(tab);
			},"json");
		}else {
			alert("所保存内容不全或不符合条件");
		}
	
	});
	
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
    		requestInfo = requestList[0];
    		$("#requestSelect_modal").modal("hide");
    		//触发子应用选择数据加载
    		initAppSelectData();
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
    
    function autoRefresh(){
    	initWorkOrderAppInfo();
    	$("#flowStepInfo_table").bootstrapTable("refresh");
    }
    
    //初始化模态框列表
    //文件上传模态框
    var $fileNumGlobal = null;
    function openFileUploadModal(rowid, relFileId, row, $fileNum){
    	$("fileSubmitTable").find("select[name=fileType]").val("00");
    	$(".fileDir").hide();
    	if(!relFileId){
    		baseAjaxJsonp(contextpath + "files/fileinfo/getFileId", null, function(data){
    			relFileId = data.message;
    			$('#flowExecInfoForm input[name=relFileId]').val(relFileId)
    			document.getElementById("fileSubmit_form").reset();
    	    	$("#fileSubmit_modal").modal('show');
    	    	//$("#fileSubmitTable").find("input[name=relFileId]").val(relFileId);
    	    	//initFileListTable(relFileId, $fileNum);
    		});
    	} else {
    		document.getElementById("fileSubmit_form").reset();
	    	$("#fileSubmit_modal").modal('show');
	    	//$("#fileSubmitTable").find("input[name=relFileId]").val(relFileId);
	    	//initFileListTable(relFileId, $fileNum);
    	}
    	//$fileNumGlobal = $fileNum;
    }
    
    $("#fileSubmitTable").find("select[name=fileType]").on("change", function(e){
    	var val = $("#fileSubmitTable").find("select[name=fileType]").val();
    	if(val=="00"){
    		$(".fileDir").hide();
    	} else {
    		$(".fileDir").show();
    	}
    	
    });
    
    //文件上传模态框提交按钮事件
    $("#fileSubmit").click(function(e){
    	var data = {"fileType": $("#fileSubmitTable").find("select[name=fileType]").val(),
    			"relFileId": $("#flowExecInfoForm").find("input[name=relFileId]").val(),
    			"appName": $('#appInfo').find(':selected').text(),
    			"systemName": $("#flowExecInfoForm").find("input[name='appInfo.systemInfo.systemName']").val(),
    			"workOrderCode": $("#flowExecInfoForm").find("input[name=code]").val(),
    			"flowName": $("#flowExecInfoForm").find("input[name=flowName]").val(),
    			"fileDir": $("#fileDir").val()};
    	$.ajaxFileUpload({
		    url:contextpath + "files/upload",
		    type:"post",
			secureuri:false,
			fileElementId:"selectFile",
			data:data,
			dataType:"json",
			//contentType: "application/json"
			success:function (data){
				alert("上传成功");
				/*if(data.message == "success"){
					alert("上传成功");
				} else {
					alert("上传失败");
				}*/
				//$("#fileListTable").bootstrapTable("refresh");
				initFileListTable($('#flowExecInfoForm input[name=relFileId]').val());
				$("#fileSubmit_modal").modal("hide");
			},
			error: function (msg){
				alert("上传成功");
				//alert("上传失败");
			}
	    });
    });
    
    //上传文件模态框关闭时
    /*$("#fileSubmit_modal").on("hide.bs.modal", function(){
    	var fileTableData = $("#fileListTable").bootstrapTable("getData");
    	$fileNumGlobal.html(fileTableData.length);
    });*/
    
    
  //requestSelectTable
    function initRequestSelectTable(){
    	//未对接需求管理，先使用假数据
    	var requestData = {rows:[
    		{id:"1", reqSubCode:"xq0001", reqSubName:"需求一", createBy:"钟", systemShort:"RDMP"},
    		{id:"2", reqSubCode:"xq0002", reqSubName:"需求二", createBy:"加", systemShort:"RDMP"},
    		{id:"3", reqSubCode:"xq0003", reqSubName:"需求三", createBy:"云", systemShort:"RDMP"},
    		{id:"4", reqSubCode:"xq0004", reqSubName:"需求四", createBy:"钟", systemShort:"RDMP"}
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