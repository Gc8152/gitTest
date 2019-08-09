//初始化接口基本信息视图
function Inter360InfoDetail(item) {
	var inter360_id = item;
	var call_sendInfo = getMillisecond();
	var url = dev_application + 'InterQuery/queryoneinterface.asp?call='
			+ call_sendInfo + '&SID=' + SID + '&inter360_id=' + inter360_id;
	baseAjaxJsonp(
			url,
			null,
			function(data) {
				if (data != undefined && data != null && data.result == "true") {
					if (data.send) {
						for ( var k in data.send) {
							var val = data.send[k];
							k = k.toLowerCase();
							if (k == "inter_code") {
								getCurrentPageObj().find("#360_code").text(val);
								getCurrentPageObj().find("#inter360_code")
										.text(val);
							}
							if (k == "inter_name") {
								getCurrentPageObj().find("#inter360_name")
										.text(val);
								getCurrentPageObj().find("#360_name").text(val);
							}
							if (k == "inter_office_type") {
								getCurrentPageObj().find("#inter360_bustype")
										.text(val);
							}
							if (k == "system_name") {
								getCurrentPageObj().find(
										"#inter360_serapp_name").text(val);
								getCurrentPageObj().find("#360_serapp_name")
										.text(val);
							}
							if (k == "start_work_time") {
								getCurrentPageObj().find("#inter360_starttime")
										.text(val);
							}
							if (k == "inter_descr") {
								getCurrentPageObj().find("#inter360_descr")
										.text(val);
							}
							if (k == "inter_status") {
								getCurrentPageObj().find("#inter360_status")
										.text(val);
							}
							if (k == "inter_version") {
								getCurrentPageObj().find("#inter360_version")
										.text(val);
							}
							if (k == "use_time") {
								getCurrentPageObj().find("#360_use_time").text(
										val);
							}
							if (k == "app_use_time") {
								getCurrentPageObj().find("#app_use_time").text(
										val);
							}
							if (k == "trade_code") {
								getCurrentPageObj().find("#inter360_trade").text(
										val);
							}
						}
						
						//初始化文件列表
						//点击打开模态框
						var tablefile = getCurrentPageObj().find("#filetable");
						getFtpFileList(tablefile, getCurrentPageObj().find("#add_fileview_modal"), data.send["FILE_ID"], "00");
					}
				}
			}, call_sendInfo);
}
// 初始化接口调用关系表
function initInter_useRelationQuery(p) {
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		};
		return temp;
	};
	var inter360_id = $.trim(p);
	var call_send = getMillisecond();
	getCurrentPageObj().find("#inter360_useRelationTable").bootstrapTable(
			{
				url : dev_application
						+ 'InterQuery/interUseRelationQuery.asp?SID=' + SID
						+ '&call=' + call_send + '&inter360_id=' + inter360_id,
				method : 'get', // 请求方式（*）
				dataType : 'jsonp',
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [5, 10, 15 ],// 每页的记录行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10,// 可供选择的每页的行数（*）
				clickToSelect : true, // 是否启用点击选中行
				uniqueId : "con_system_id", // 每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : true,
				jsonpCallback : call_send,
				onLoadSuccess : function(data){
					gaveInfo();
					fileData = getInterFileList();
					initFileUploadAction(fileData);
				},
				columns : [ {
					field : 'CON_SYSTEM_ID',
					title : '序号',
					align : "center",
					sortable : true,
					width : "60",
					formatter : function(value, row, index) {
						return index + 1;
					}
				}, {
					field : 'CON_SYSTEM_ID',
					title : '消费方应用编号',
					align : 'center'
				}, {
					field : 'SYSTEM_NAME',
					title : '消费方应用名称',
					align : 'center'
				}, 
				{
					field : 'INTER_STATUS_NAME',
					title : '接口状态',
					align : 'center'
				}, 
				
				{
					field : 'START_TIME',
					title : '开始日期',
					align : "center"
				}, {
					field : "explain",
					title : "接口调用说明",
					align : "center",
					formatter:function(value, row, index){
						var str = "<div name='file_info_div' style='margin: 0 auto 10px 0' bid='"+row.FILE_ID+"' index='"+index+"'>";
						str += "<a name='inter_use_file_detail' style='margin-left:10px;display:none;'>查看</a>" +
						"<a name='inter_use_file_download' style='margin-left:10px;display:none;'>下载</a>";
						str +="<div/>";
						return str;
					}
				}]
			});
	var fileData = null;
	var file_view_div = getCurrentPageObj().find("#add_fileview_modal");
	function initFileUploadAction(){
		var $details = getCurrentPageObj().find("#inter360_useRelationTable").find("a[name=inter_use_file_detail]");
		var $downloads = getCurrentPageObj().find("#inter360_useRelationTable").find("a[name=inter_use_file_download]");
		
		//初始化查看按钮
		$details.unbind('click').click(function(){
			var $div = $(this).parent();
			var file_id = $div.attr("file_id");
			if(fileData!==null){
				for(var k in fileData){
					var file = fileData[k];
					if(file_id==file.ID){
						ftpFileInfoDetailModel(file_view_div, file);
					}
				}
			} else {
				alert("文件不存在！");
			}
		});
		//初始化下载按钮
		$downloads.unbind('click').click(function(){
			var $div = $(this).parent();
			var file_id = $div.attr("file_id");
			verifyFileExit(file_id);
		});
	}
	//获取文件列表并绑定文件id到相应的按钮上
	function getInterFileList(){
		var affectTableData = getCurrentPageObj().find("#inter360_useRelationTable").bootstrapTable('getData');
		var businessArr = $.map(affectTableData, function(row) {
			return row.FILE_ID;
		});
		if(businessArr.length>0){
			var fileData = getFtpFileListByBc(businessArr, "00");
			if(fileData.length>0){
				for(var k in fileData){
					var file = fileData[k];
					var $div = getCurrentPageObj().find("#inter360_useRelationTable").find("div[bid="+file.BUSINESS_CODE+"]");
					$div.attr("file_id", file.ID);
					if(typeof(file["BUSINESS_CODE"])!="undefined"){
						$div.find("a[name=inter_use_file_detail]").show();
						$div.find("a[name=inter_use_file_download]").show();
					}
				}
			}
			return fileData;
		}
		return null;
	}
}

// 初始化接口版本信息
function initVersionListTable(p) {
	var inter360_id = $.trim(p);
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		};
		return temp;
	};
	var callsendv = getMillisecond();
	getCurrentPageObj().find('#inter360_versionListTable').bootstrapTable(
			"destroy").bootstrapTable(
			{
				url : dev_application + 'InterQuery/queryVersionInfo.asp?SID='
						+ SID + '&call=' + callsendv + '&inter360_id='
						+ inter360_id,
				method : 'get', // 请求方式（*）
				dataType : 'jsonp',
				striped : false, // 是否显示行间隔色
				cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, // 是否启用排序
				sortOrder : "asc", // 排序方式
				queryParams : queryParams,// 传递参数（*）
				sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
				pagination : true, // 是否显示分页（*）
				pageList : [5, 10, 15 ],// 每页的记录行数（*）
				pageNumber : 1, // 初始化加载第一页，默认第一页
				pageSize : 10,// 可供选择的每页的行数（*）
				clickToSelect : true, // 是否启用点击选中行
				// uniqueId : "inter_code", //每一行的唯一标识，一般为主键列
				cardView : false, // 是否显示详细视图
				detailView : false, // 是否显示父子表
				singleSelect : true,
				jsonpCallback : callsendv,
				onLoadSuccess : function(data){
					gaveInfo();
				},
				columns : [
						{
							// field: 'SUB_REQ_ID',
							title : '序号',
							align : "center",
							sortable : true,
							width : "60",
							formatter : function(value, row, index) {
								return index + 1;
							}
						},
						{
							field : 'INTER_VERSION',
							title : '版本号',
							align : 'center'
						},
						{
							field : 'PUBLISH_TIME',
							title : '发布时间',
							align : "center"
						},
						{
							field : 'INTER_VERSION',
							title : '详情',
							align : 'center',
							formatter : function(value, row, index) {
								return '<span class="hover-view" '
										+ 'onclick=" VerCheckDetail(\'' + value
										+ '\',\'' + row.INTER_ID
										+ '\',\'' + index
										+ '\') ">查看</span>';
							}
						} ]
			});
}
function AVersionDetail() {
	getCurrentPageObj().find("#AVersionDetail").show();
}
// 报文输出内容
function initExportContentQuery(item, list, version1) {
	// 页码
	var inter360_id = $.trim(item);
	var iversion = "";
	if (version1 != null) {
		iversion = $.trim(version1);
	}
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		};
		return temp;
	};
	var call_send1 = getMillisecond();
	getCurrentPageObj().find("#" + list).bootstrapTable("destroy")
			.bootstrapTable(
					{
						url : dev_application
								+ 'InterQuery/queryMsgOutInfo.asp?SID=' + SID
								+ '&call=' + call_send1 + '&version='
								+ iversion + '&inter360_id=' + inter360_id,
						method : 'get', // 请求方式（*）
						dataType : 'jsonp',
						striped : false, // 是否显示行间隔色
						cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
						sortable : true, // 是否启用排序
						sortOrder : "asc", // 排序方式
						queryParams : queryParams,// 传递参数（*）
						sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
						pagination : true, // 是否显示分页（*）
						pageList : [5, 10, 15 ],// 每页的记录行数（*）
						pageNumber : 1, // 初始化加载第一页，默认第一页
						pageSize : 10,// 可供选择的每页的行数（*）
						clickToSelect : true, // 是否启用点击选中行
						// uniqueId : "inter_code", //每一行的唯一标识，一般为主键列
						cardView : false, // 是否显示详细视图
						detailView : false, // 是否显示父子表
						singleSelect : true,
						jsonpCallback : call_send1,
						onLoadSuccess : function(data){
							gaveInfo();
						},
						columns : [ {
							field : 'Number',
							title : '序号',
							align : "center",
							width : "6%",
							sortable: true,
							formatter: function (value, row, index) {
								return index+1;
							}
						},{
							field : "DATA_CHNNAME",
							title : "字段名(中文)",
							align : "center",
							width : "10%"
						}, {
							field : "DATA_ENGNAME",
							title : "1级字段名(英文)",
							align : "center",
							width : "10%"
						}, {
							field : "DATA_ENGNAMEA",
							title : "2级字段名(英文)",
							align : "center",
							width : "10%"
						}, {
							field : "DATA_ENGNAMEB",
							title : "3级字段名(英文)",
							align : "center",
							width : "10%"
						}, {
							field : 'DATA_TYPE',
							title : '类型',
							align : "center",
							width : "8%"
						}, {
							field : "MSG_LENGTH",
							title : "长度",
							align : "center",
							width : "8%"
						},{
							field : "IS_NECESSARY",
							title : "是否必输",
							align : "center",
							width : "8%"
						}, {
							field : "STANDARD_CODE",
							title : "标准代码",
							align : "center",
							width : "8%"
						},{
							field : "DATA_INSTRUCTION",
							title : "内容说明",
							align : "center",
							width : "20%"
						},{
							field : "INFO_REMARK",
							title : "备注",
							align : "center",
							width : "20%"
						} ]
					});

};
// 报文输入内容
function initImportContentQuery(item, list, version2) {
	var inter360_id = $.trim(item);
	var eversion = "";
	if (version2 != null) {
		eversion = $.trim(version2);
	}
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		};
		return temp;
	};
	var call_send2 = getMillisecond();
	getCurrentPageObj().find("#" + list).bootstrapTable("destroy")
			.bootstrapTable(
					{
						url : dev_application
								+ 'InterQuery/queryMsgInInfo.asp?SID=' + SID
								+ '&call=' + call_send2 + '&version='
								+ eversion + '&inter360_id=' + inter360_id,
						method : 'get', // 请求方式（*）
						dataType : 'jsonp',
						striped : false, // 是否显示行间隔色
						cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
						sortable : true, // 是否启用排序
						sortOrder : "asc", // 排序方式
						queryParams : queryParams,// 传递参数（*）
						sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
						pagination : true, // 是否显示分页（*）
						pageList : [5, 10, 15 ],// 每页的记录行数（*）
						pageNumber : 1, // 初始化加载第一页，默认第一页
						pageSize : 10,// 可供选择的每页的行数（*）
						clickToSelect : true, // 是否启用点击选中行
						// uniqueId : "inter_code", //每一行的唯一标识，一般为主键列
						cardView : false, // 是否显示详细视图
						detailView : false, // 是否显示父子表
						singleSelect : true,
						jsonpCallback : call_send2,
						onLoadSuccess : function(data){
							gaveInfo();
						},
						columns : [ {
							field : 'Number',
							title : '序号',
							align : "center",
							width : "6%",
							sortable: true,
							formatter: function (value, row, index) {
								return index+1;
							}
						},{
							field : "DATA_CHNNAME",
							title : "字段名(中文)",
							align : "center",
							width : "10%"
						}, {
							field : "DATA_ENGNAME",
							title : "1级字段名(英文)",
							align : "center",
							width : "10%"
						}, {
							field : "DATA_ENGNAMEA",
							title : "2级字段名(英文)",
							align : "center",
							width : "10%"
						}, {
							field : "DATA_ENGNAMEB",
							title : "3级字段名(英文)",
							align : "center",
							width : "10%"
						}, {
							field : 'DATA_TYPE',
							title : '类型',
							align : "center",
							width : "8%"
						}, {
							field : "MSG_LENGTH",
							title : "长度",
							align : "center",
							width : "8%"
						},{
							field : "IS_NECESSARY",
							title : "是否必输",
							align : "center",
							width : "8%"
						}, {
							field : "STANDARD_CODE",
							title : "标准代码",
							align : "center",
							width : "8%"
						},{
							field : "DATA_INSTRUCTION",
							title : "内容说明",
							align : "center",
							width : "20%"
						},{
							field : "INFO_REMARK",
							title : "备注",
							align : "center",
							width : "20%"
						}]
					});
}
// 初始化接口变更信息
function initExchangeListQuery(item) {
	var inter360_id = $.trim(item);
	var queryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset
		};
		return temp;
	};
	var call_sende = getMillisecond();
	getCurrentPageObj()
			.find('#AExchangeList')
			.bootstrapTable("destroy")
			.bootstrapTable(
					{
						url : dev_application
								+ 'InterQuery/queryExchangeListInfo.asp?SID='
								+ SID + '&call=' + call_sende + '&inter360_id='
								+ inter360_id,
						method : 'get', // 请求方式（*）
						dataType : 'jsonp',
						striped : false, // 是否显示行间隔色
						cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
						sortable : true, // 是否启用排序
						sortOrder : "asc", // 排序方式
						queryParams : queryParams,// 传递参数（*）
						sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
						pagination : true, // 是否显示分页（*）
						pageList : [5, 10, 15 ],// 每页的记录行数（*）
						pageNumber : 1, // 初始化加载第一页，默认第一页
						pageSize : 10,// 可供选择的每页的行数（*）
						clickToSelect : true, // 是否启用点击选中行
						// uniqueId : "inter_code", //每一行的唯一标识，一般为主键列
						cardView : false, // 是否显示详细视图
						detailView : false, // 是否显示父子表
						singleSelect : true,
						jsonpCallback : call_sende,
						onLoadSuccess : function(data){
							gaveInfo();
						},
						columns : [
								{
									// field: 'SUB_REQ_ID1',
									title : '序号',
									align : "center",
									sortable : true,
									width : "60",
									formatter : function(value, row, index) {
										return index + 1;
									}
								},
								{
									field : 'APP_INTER_NUM',
									title : '申请编号',
									align : 'center'
								},
								{
									field : 'APP_TYPE',
									title : '申请类型',
									align : "center"
								},
								{
									field : 'INTER_APP_STATUS_NAME',
									title : '申请状态',
									align : "center"
								},
								{
									field : 'APP_INTER_NUM',
									title : '申请详情',
									align : "center",
									formatter : function(value, row, index) {
										return '<span class="hover-view" '
												+ 'onclick="ExchangeListCheckDetail('
												+ index + ')">申请详情</span>';
									}
								}, {
									field : 'INTER_VERSION_NOW',
									title : '对应版本',
									align : "center"
								} ]
					});
}
// 点击接口 版本查看
function VerCheckDetail(inter_version, inter_id, index) {

	var id = inter_id;
	var version = inter_version;
	var modObj = getCurrentPageObj().find("#inter360_basic_table1");
	inter360initAttrTable(id, version, modObj, "table[tb=360attrTable1] tbody",
			null);
	initImportContentQuery(id, "AImportContentList1", version);
	initExportContentQuery(id, "AExportContentList1", version);
	getCurrentPageObj().find("#AVersionDetail").show();
	
	var old_tablefile = getCurrentPageObj().find("#old_filetable");
	var items = getCurrentPageObj().find('#inter360_versionListTable').bootstrapTable("getData");
	var bid = items[index]["FILE_ID"];
	getFtpFileList(old_tablefile, getCurrentPageObj().find("#add_fileview_modal"), bid, "00");
}
// 点击接口申请单信息详情进行查看
function ExchangeListCheckDetail(index) {
	var selects = getCurrentPageObj().find("#AExchangeList").bootstrapTable('getData');
	var row=selects[index];
	url = "dev_application/ESBUseInterAnalyse/ESBUseAnalysed_queryInfo.html";
	closeAndOpenInnerPageTab("AnalysDesignCheck", "分析设计查看",url, function(){
		initESBAnalyDetail(row);
		var modObj = getCurrentPageObj().find("#AnlyseInterInfo_table1");
		if(row.APP_TYPE=='01'){
			inter360initAttrTable(row.INTER_ID,row.INTER_VERSION,modObj,"table[tb=AnlyseInterInfo] tbody","");
		}else{
			inter360initAttrTable("","",modObj,"table[tb=AnlyseInterInfo] tbody",row.APP_ID);
		}	
	});
}
// 初始化接口属性信息table
function inter360initAttrTable(inter_id, inter_version, modObj, tableid, app_id) {
	var ids = inter_id;
	var version = inter_version;
	var rowCall = getMillisecond();
	var table = modObj.find(tableid);
	baseAjaxJsonp(dev_application + "InterQuery/initInterAttrByparam.asp?SID="
			+ SID + "&call=" + rowCall + "&inter_id=" + ids + "&inter_version="
			+ version, {
		app_id : app_id
	}, function(data) {
		if (data && data.attrRowList) {
			// 先动态生成表列内容
			var appendHtml = getInter360TableBodyHtml(data.attrRowList);
			table.empty("");
			table.append(appendHtml);
			// 最后初始化字典项
			inter360AutoInitSelect(table);
		} else {
			table.empty("");
		}
	}, rowCall, false);
}
// 初始化动态类型表格
function getInter360TableBodyHtml(attrField) {
	var rowNum = 2;
	var appendHtml = "";
	var fieldNum = 1;
	for ( var i = 0; i < attrField.length; i++) {
		appendHtml += fieldNum % rowNum == 1 ? "<tr>" : "";
		appendHtml += getRowLineInter360(attrField[i]);
		appendHtml += fieldNum % rowNum == 0 ? "</tr>" : "";
		fieldNum++;
	}
	// 补全因非结束产生的表格不全的情况;
	if (!(fieldNum % rowNum == 1)) {
		while (!(fieldNum % rowNum == 1)) {
			appendHtml += "<td colspan='2'></td>";
			fieldNum++;
		}
		appendHtml += "</tr>";
	}

	return appendHtml;
}
// 生成动态类型表格HTML代码
function getRowLineInter360(item) {
	var str = "";
	str += "<td  class='table-text' width='20%' >" + item.ATTR_NAME + ":</td>";
	if (item.ATTR_TYPE == "00") {// 00表示文本框
		str += "<td><div>"
				+ item.ATTR_VALUE + "</div></td>";
	} else if ((item.ATTR_TYPE == "01") || (item.ATTR_TYPE == "03")
			|| (item.ATTR_TYPE == "02")) {// 01表示下拉单选
		str += "<td><div attr_id='" + item.ATTR_ID + "' attr_value='"
				+ item.ATTR_VALUE + "' diccode='" + item.DIC_INFO + "' value='"
				+ item.DEFAULT_VALUE + "'></div></td>";
	}
	return str;
}
//初始化div内容根据DIC_CODE和Item_code
function inter360AutoInitSelect(tableObj) {
	// 初始化下拉选
	var divs = tableObj.find("[diccode]");
	for (var i = 0; i < divs.length; i++) {
			var obj = getCurrentPageObj().find(divs[i]);
			var attr_value = getCurrentPageObj().find(divs[i]).attr("value");
			var dcode = getCurrentPageObj().find(divs[i]).attr("diccode");
			if (dcode!= "" &&dcode != undefined) {
				baseAjax("SDic/findItemByDic.asp", { dic_code : dcode }, function(data) {
					if (data != undefined) {
						var strs = new Array(); // 定义一数组
						strs = attr_value.split(","); // 字符分割
							var str = "";
							for ( var j = 0; j < strs.length; j++) {
								for ( var i = 0; i < data.length; i++) {
									if (data[i]["ITEM_CODE"] == strs[j]) {
										if (j != strs.length - 1) {
											str += data[i]["ITEM_NAME"] + ",";
										} else {
											str += data[i]["ITEM_NAME"];
										}
									}// if
								}// for
							}// for
						obj.text(str);
						}
					
				},false);
			}//if
	}//for
}
