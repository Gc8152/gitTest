initreqVersionChangeLayOut();
function initreqVersionChangeLayOut() {
	var reqChangeTab = getCurrentPageObj();
	var form = reqChangeTab.find("#changeQuery");
	var table = reqChangeTab.find("#changeReqTableInfo");
	var expertsQuery = getMillisecond();

	// 初始化按钮事件
	initreqVersionChangeButtonEvent();
	function initreqVersionChangeButtonEvent() {

		// 初始化字典项
		autoInitSelect(form);

		/*
		 * initSelect(reqChangeTab.find("#change_subtype"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CHANGE_SUBTYPE"});
		 * //初始化数据,
		 * initSelect(reqChangeTab.find("#change_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQ_CHANGE_STATE"});
		 */

		/*
		 * reqChangeTab.find("#query_user_name").click(function(){
		 * openUserPop("queryDivExpert",{name:reqChangeTab.find("#query_user_name"),no:reqChangeTab.find("#query_user_id")});
		 * });
		 */

		var reset = reqChangeTab.find("#reset");
		reset.click(function() {
			form[0].reset();
			reqChangeTab.find("select").select2();
		});

		reqChangeTab.find("#queryChange").click(
				function() {
					var param = form.serialize();
					table.bootstrapTable('refresh', {
						url : dev_project
								+ 'PChangeReq/queryChangeReqList.asp?call='
								+ expertsQuery + '&SID=' + SID + "&" + param
					});
				});
		// enter按键绑定查询事件
		enterEventRegister(reqChangeTab.attr("class"), function() {
			reqChangeTab.find("#queryChange").click();
		});

		// 删除
		reqChangeTab.find("#changeReq_delete").click(function() {
			var id = table.bootstrapTable('getSelections');
			var ids = $.map(id, function(row) {
				return row.REQ_CHANGE_ID;
			});
			if (ids == null || ids == undefined || ids == "") {
				alert("请选择一条数据！");
				return;
			} else {
				nconfirm("确定要删除该数据吗?", function() {
					deleteGChangeInfo(ids);

				});
			}

		});

		// 紧急加塞
		reqChangeTab.find("#changeVer_add").click(function() {
			closePageTab("add_experts");
			closeAndOpenInnerPageTab("changeReq_add","申请版本加塞","dev_project/proReqChange/reqChange_add.html",function() {
				initChangeButtonEvent("0");
				getCurrentPageObj().find("#version_text1").html("加塞版本：");
				initSelect(getCurrentPageObj().find("#change_subtype"),{value : "ITEM_CODE",text : "ITEM_NAME"},{dic_code : "G_DIC_REQ_CHANGE_SUBTYPE"}, "01");
			});
	      });
		// 补充协办
		reqChangeTab.find("#changeJoin_add").click(function() {
			closePageTab("add_experts");
			closeAndOpenInnerPageTab("changeReq_add","申请补充协办","dev_project/proReqChange/reqChange_add.html",function() {
					initChangeButtonEvent("0");
					getCurrentPageObj().find("#version_text1").html("补充协办版本：");
					// 初始化需求分类子类
					initSelect(getCurrentPageObj().find("#change_subtype"),{value : "ITEM_CODE",text : "ITEM_NAME"},{dic_code : "G_DIC_REQ_CHANGE_SUBTYPE"}, "02");
			});
		});
		// 版本调出
		reqChangeTab.find("#changeOut_add").click(function() {
			closePageTab("add_experts");
			closeAndOpenInnerPageTab("changeReq_add","申请版本调出","dev_project/proReqChange/reqChange_add.html",function() {
				initChangeButtonEvent("0");
				getCurrentPageObj().find("#version_text1").html("调出版本：");
				initSelect(getCurrentPageObj().find("#change_subtype"),{value : "ITEM_CODE",text : "ITEM_NAME"},{dic_code : "G_DIC_REQ_CHANGE_SUBTYPE"}, "03");
			});
		});

		// 修改
		reqChangeTab.find("#changeReq_edit").click(function() {
				var id = table.bootstrapTable('getSelections');
				var ids = $.map(id, function(row) {return row.REQ_CHANGE_ID;});
				if (ids == null || ids == undefined || ids == "") {
					alert("请选择一条数据！");
					return;
				} else {
						var ids = JSON.stringify(id);
						var data = JSON.parse(ids);
						closeAndOpenInnerPageTab("changeReq_add","发起变更","dev_project/proReqChange/reqChange_add.html",function() {
							    var reqChangeEditTab = getCurrentPageObj();//页面不同，重新定义
								for ( var k in data[0]) {
										var str = data[0][k];
										k = k.toLowerCase();
										if (k == "change_type") {
										    // 初始化数据,
										    initSelect(reqChangeEditTab.find("#change_type"),{value : "ITEM_CODE",text : "ITEM_NAME"},{dic_code : "G_DIC_REQ_CHANGE_TYPE"}, str);
										}else if (k == "change_subtype") {
											if (str == '01') {
												reqChangeEditTab.find("#version_text1").html("加塞版本：");
											}else if (str == '02') {
												reqChangeEditTab.find("#version_text1").html("补充协办版本：");
											}else {
												reqChangeEditTab.find("#version_text1").html("调出版本：");
											}
											// 初始化数据,
											initSelect(reqChangeEditTab.find("#change_subtype"),{value : "ITEM_CODE",text : "ITEM_NAME"},
														{dic_code : "G_DIC_REQ_CHANGE_SUBTYPE"}, str);
										}else if (k == "phased_state") {
											// 初始化数据,
											initSelect(reqChangeEditTab.find("#phased_state"),{value : "ITEM_CODE",text : "ITEM_NAME"},
															{dic_code : "G_DIC_REQTASK_STATE"}, str);
										} else {
											reqChangeEditTab.find("#" + k).val(str);
										}
							   }

								reqChangeEditTab.find("#system_name").attr("disabled", true);
								reqChangeEditTab.find("#change_subtype").attr("disabled", true);
							   initChangeButtonEvent(data[0].REQ_CHANGE_ID);
					});
				}
		});

		// 查看
		reqChangeTab.find("#changeReq_info").click(function() {
			var id = table.bootstrapTable('getSelections');
			var ids = $.map(id, function(row) {return row.REQ_CHANGE_ID;});
			if (ids == null || ids == undefined || ids == "") {
					alert("请选择一条数据！");
					return;
			} else {
				var ids = JSON.stringify(id);
				var data = JSON.parse(ids);
				closeAndOpenInnerPageTab("changeReq_info","需求变更查询","dev_project/proReqChange/reqChange_info.html",function() {
					 var reqChangeEditTab = getCurrentPageObj();//页面不同，重新定义
					 for ( var k in data[0]) {
						var str = data[0][k];
						k = k.toLowerCase();
						reqChangeEditTab.find("#" + k).html(str);
						if (k == "change_subtype") {
							if (str == '01') {
								reqChangeEditTab.find("#version_text1").html("加塞版本：");
							}else if (str == '02') {
								reqChangeEditTab.find("#version_text1").html("补充协办版本：");
							} else {
								reqChangeEditTab.find("#version_text1").html("调出版本：");
							}
						}
					}
					initChangeButtonEvent(data[0].REQ_CHANGE_ID);

				});
			}
	   });

   }

	// 初始化版本变更查询列表
	initreqVersionChangeInfo();
	function initreqVersionChangeInfo() {
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		table.bootstrapTable({
			url : dev_project + 'PChangeReq/queryChangeReqList.asp?call='+ expertsQuery + '&SID=' + SID, // 请求后台的URL（*）
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : true, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 5, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			uniqueId : "REQ_CHANGE_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			jsonpCallback : expertsQuery,
			singleSelect : true,// 复选框单选
			onLoadSuccess : function(data) {
				gaveInfo();
			},
			columns : [ {
				// radio:true,
				checkbox : true,
				rowspan : 2,
				align : 'center',
				valign : 'middle'
			}, {
				field : 'ROW_NUM',
				title : '序号',
				align : "center",
				width : 50
			}, {
				field : 'REQ_CHANGE_ID',
				title : 'ID',
				align : "center",
				visible : false
			}, {
				field : 'CHANGE_CODE',
				title : '变更编号',
				align : "center",
				visible : false
			}, {
				field : 'SYSTEM_NAME',
				title : '应用名称',
				align : "center"
			}, {
				field : "VERSIONS_NAME",
				title : "版本名称",
				align : "center"
			}, {
				field : "REQ_CHANGE_SUBTYPE_NAME",
				title : "变更类型",
				align : "center"
			}, {
				field : "SPONSOR_PERSON_NAME",
				title : "发起人",
				align : "center"
			}, {
				field : "CHANGE_STATE_NAME",
				title : "变更状态",
				align : "center"
			}, {
				field : "CREATE_TIME",
				title : "申请日期",
				align : "center",
				formatter : function(value, row, index) {
					return value.substring(0, 10);
				}
			} ]
		});

	}
	;

	// 执行删除的方法
	function deleteGChangeInfo(param) {
		var expertsCall = getMillisecond();
		var params = {};
		params["req_change_id"] = param[0];
		baseAjaxJsonp(dev_project + 'PChangeReq/deleteChangeReq.asp?call='+expertsCall + '&SID=' + SID, params, function(data) {
			if (data != undefined && data != null && data.result == "true") {
				alert("删除成功");
				reqChangeTab.find("#changeReqTableInfo").bootstrapTable('remove', {
							field : 'REQ_CHANGE_ID',
							values : param
						});
			} else {
				alert("删除失败");
			}
		}, expertsCall);
	}
}
