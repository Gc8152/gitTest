/**
 * 提供页面切换刷新页面的函数 供父页面的main.js 193行使用。
 * @returns
 */
function refreshTable(){
	$("#query").click();
}
$(function(){
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
	
	var cisFlowInfo = new Object();
	//代码库选项
	var codeBaseInfo = null;
	var codeBaseRequest = false;
	//环境配置选项
	var evnConfigInfo = null;
	var evnConfigRequest = false;
	
	var select2Config = function(rows, tempSelectFun, tempResultFun){
		var obj = {
				data:rows,
				templateSelection: tempSelectFun,
				templateResult : tempResultFun
		}
		 return obj;
	}
	
	initLayout();
	initSelectData();
	getServerInfo();
	
	
	function initSelectData(){
		$.get(contextpath + 'cis_flow/queryAllAppInfo', null, function(data){
			var tempResultFun = function(item){
				return item.text;
			};
			
			var codeRows = $.map(data.result, function (obj) {
				obj.text = obj.appName;
				return obj;
			});
			var codeBaseTempSelectFun = function(item){
				if(item.id!=" " && !codeBaseRequest && !evnConfigRequest){
					//获取codeBase的信息
					codeBaseRequest = true;					
					baseAjaxJsonp(contextpath + "cis_flow/codeBaseInfo/findByAppId/" + item.id, null, function(data){
						if(data.success){
							cisFlowInfo["codeBase"] = data.result;
							setFormData($("#cisFlowForm"), cisFlowInfo, "appInfo");
						}
						codeBaseRequest = false;
					});
					//获取环境配置信息
					baseAjaxJsonp(contextpath + "cis_flow/evnConfigInfo/findByAppId/" + item.id, null, function(data){
						if(data.success){
							var evnConfigRows = $.map(data.result, function (obj) {
								obj.text = obj.evnName;
								return obj;
							});
							var evnConfigTempSelectFun = function(item){
								if(item.id!=" " && item.id!=evnConfigRequest){
									evnConfigRequest = item.id;
									cisFlowInfo["evnConfig"] = item;
									setFormData($("#cisFlowForm"), item, "evnConfig");
									$("input[name=evnId]").val(item.id);
									
									//获取ap服务信息
									if(item.apServerInfoId!=null){
										getServerInfoAndSet(item.apServerInfoId, function(data){setFormData($("#cisFlowForm"), data, "evnConfig.apServerInfo");});
									}
									//获取db服务信息
									if(item.dbServerInfoId!=null){
										getServerInfoAndSet(item.dbServerInfoId, function(data){setFormData($("#cisFlowForm"), data, "evnConfig.dbServerInfo");});
									}
								}
								return item.text;
							}
							
							$("#evnConfig").select2(select2Config(evnConfigRows, evnConfigTempSelectFun, tempResultFun))
							$("#evnConfig").val(cisFlowInfo.evnId).trigger("change");
						}
					});
					
					for(var key in item){
						$("input[name='appInfo." + key + "']").val(item[key]);
					}
					$("input[name=appId]").val(item.id);
				}
				return item.text;
			};
			$("#appInfo").select2(select2Config(codeRows, codeBaseTempSelectFun, tempResultFun));
			if(cisFlowInfo!=null){
				$("#appInfo").val(cisFlowInfo.appId);
				$("#appInfo").trigger("change");
			}
		});
	}
	
	function initLayout(){
		$("#serverTypeDbRow1").hide(clearDbField());
		$("#serverTypeDbRow2").hide();
	}
	
	function getServerInfo(){
		var cisFlowId = getParamString("id");
		if(cisFlowId!=""&&cisFlowId!=null&&cisFlowId!=undefined){
			baseAjaxJsonp(contextpath + "cis_flow/info/" + cisFlowId, null, function(data){
				if(data.success){
					//$("#cisFlowForm").setform(data.result); //无法满足
					cisFlowInfo = data.result;
					
					setFormData($("#cisFlowForm"), cisFlowInfo);
				}
				$("select").trigger("change");
				$("#appInfo").select2({"disabled":true});
				//判断是否查看操作
				var detail = getParamString("detail");
				if(detail!=""&&detail!=null&&detail!=undefined){
					$("select").select2({"disabled":true});
					$("input").attr("disabled","disabled");
				}
			});
		}
		
		initFlowStepTable(cisFlowId);
	}
	
	function getServerInfoAndSet(serverInfoId, successFun){
		baseAjaxJsonp(contextpath + "server_info/info/" + serverInfoId, null, function(data){
			if(data.success){
				/*alert("保存成功",function(){
					parent.closeCurrentTab(parent);
				});*/
			} else {
				alert("保存失败");
			}
		});
	}
	
	function saveCisFlowInfo(param){
		baseAjaxJsonp(contextpath + "cis_flow/save", param, function(data){
			if(data.result==true){
				alert("更新服务器状态成功")
				$("#query").click();
			} else {
				alert("开启服务器出错");
			}
		});
/*		$.ajax({
			type : "post",
			url : contextpath + "cis_flow/save",
			async : true,
			data : param,
			dataType : "json",
			success : function(data){
				if(data.success){
					alert("保存成功",function(){
//						var cisFlowId = getParamString("id");
//						if(cisFlowId!=""&&cisFlowId!=null&&cisFlowId!=undefined){
//							location.reload;
//						} else {
//							location.replace(location.href + "?id=" + data.message);
//						}
						parent.closeCurrentTab(parent);
					});
				} else {
					alert("保存失败");
				}
			},
			error : function(xhr,status,error) {
				//后台数据校验返回值
				if("error"==status && xhr.status==400){
					alert("提交参数不合规");
				}
			}
		});*/
	}
	
	function clearDbField(){
		$("#dbType").val(" ").trigger("change");
		$("input[name=instanceName]").val("");
		$("input[name=dbUsername]").val("");
		$("input[name=dbPassword]").val("");
	}
	
	//初始化页面按钮事件
	
	$("input[name=serverUsername]").click(function(){
		$("#modal").modal("show");
	});
	
	$("#save").click(function(event){
		var $form = $("#cisFlowForm");
		var result = vlidate($form);
		
		var param = new Object();
		param["appId"] = $.trim($form.find("input[name=appId]").val());
		param["flowType"] = $.trim($form.find("select[name=flowType]").val());
		param["flowName"] = $.trim($form.find("input[name=flowName]").val());
		param["projectName"] = $.trim($form.find("input[name=projectName]").val());
		param["flowStatus"] = $.trim($form.find("select[name=flowStatus]").val());
		param["buildType"] = $.trim($form.find("select[name=buildType]").val());
		param["deployType"] = $.trim($form.find("select[name=deployType]").val());
		param["evnId"] = $.trim($form.find("input[name=evnId]").val());
		
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
		
		if(result){
			saveCisFlowInfo(param);
		} else {
			alert("所保存内容不全或不符合条件！");
		}
	});
	
	$("#pre").click(function(event){
		var curTab = $("#cis_tab li[class=active]");
		var index = curTab.data("index");
		
		if(index-1 == 0){
			$("#pre").hide();
		}
		$("#next").show();
		$("#save").hide();
		$("#cis_tab li:eq("+ (index-1) +") a").tab("show");
		
	});
	
	$("#next").click(function(event){
		var detail = getParamString("detail");
		var curTab = $("#cis_tab li[class=active]");
		var index = curTab.data("index");
		if(index+2 == $("#cis_tab li").length){
			$("#next").hide();
			if(detail!=""&&detail!=null&&detail!=undefined){
			} else {
				$("#save").show();
			}
		}
		$("#pre").show();
		$("#cis_tab li:eq("+ (index+1) +") a").tab("show");
	});
	
	$("#close").click(function(event){
		nconfirm("放弃当前修改内容离开",function(){
			parent.closeCurrentTab(parent);
		});
	});
	
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
				/*checkbox : true,
				//rowspan : 2,
				align : 'center',
				valign : 'middle'
			},{*/
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
					/*if(){
						return "停用";
					} else {
						return "启用";
					}*/
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
});
