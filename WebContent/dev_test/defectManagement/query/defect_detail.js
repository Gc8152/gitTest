
function detailDefect(item){
	var $page = getCurrentPageObj();//当前页
	initRealOptTable(item);//初始化操作步骤表
	initOptHisTable(item);//初始化历史记录表
	initFileTable(item);//初始化附件相关
	initDefectInfo(item);//初始化缺陷信息
	initDefectAttrInfo(item);
	var state = item.DEFECT_STATE;
	if(state == '02' && item.DISPOSE_REASON != undefined){//已拒绝
		$page.find("tr[class='hid']").children('td').eq(0).text("拒绝原因：");
		$page.find("tr[class='hid']").show(); 
	}
	if(state == '01' && item.DISPOSE_REASON != undefined){//待指派
		$page.find("tr[class='hid']").children('td').eq(0).text("拒绝原因：");
		$page.find("tr[class='hid']").show(); 
	}
	if(state == '04' && item.DISPOSE_REASON != undefined){//重新打开
		$page.find("tr[class='hid']").children('td').eq(0).text("重新打开原因：");
		$page.find("tr[class='hid']").show(); 
	}
	if(state == '05' && item.DISPOSE_REASON != undefined){//延期
		$page.find("tr[class='hid']").children('td').eq(0).text("延期原因：");
		$page.find("tr[class='hid']").show(); 
	}
	if(state == '06'){//已修复
		$page.find("[name='defectAnalyze']").show();
	}
	
	 
	//初始化信息
	function initDefectInfo(item){
		for(var k in item){
			$page.find("#"+k).text(item[k]);
		}
		findFileInfo(item["FILE_ID"],function(data){
			if(data.rows.length>0){
				defaultShowFileInfo(item["FILE_ID"],$page.find("#ETA_out_resume").parent(),data,false,"outResumeFileDiv");
			}
		});
	}
	
	
	//实际操作步骤表
	function initRealOptTable(item){
		var	defect_id = item.DEFECT_ID;
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		var realOptCall = getMillisecond()+'1';
		$page.find("[tb='realOptTable']").bootstrapTable({
			url : dev_test+"addDefect/queryOptByDefectId.asp?SID=" + SID + "&call=" + realOptCall + "&DEFECT_ID=" + defect_id,
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			//queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			//pagination : false, // 是否显示分页（*）
			//pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			//pageNumber : 1, // 初始化加载第一页，默认第一页
			//pageSize : 10, // 每页的记录行数（*）
			clickToSelect : false, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "OPT_ORDER", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : false,// 复选框单选
			jsonpCallback:realOptCall,
			onDblClickRow:function(row){
			},onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field : 'ORDER_ID',
				title : '序号',
				align : "center",
				width : "50px",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : "OPT_DESCRIPT",
				title : "操作描述",
				align : "center"
			}, {
				field : "INPUT_DATA",
				title : "输入数据",
				align : "center"
			}, {
				field : "EXPECT_RESULT",
				title : "预期结果",
				align : "center"
			}, {
				field : "REAL_INPUT",
				title : "实际输入数据",
				align : "center"
			}, {
				field : "REAL_RESULT",
				title : "实际结果",
				align : "center"
			}
			]
		});
	}
	
	
	//历史记录表
	function initOptHisTable(item){
		var	defect_id = item.DEFECT_ID;
		var queryParams = function(params) {
			var temp = {
				limit : params.limit, // 页面大小
				offset : params.offset
			// 页码
			};
			return temp;
		};
		var ohCall = getMillisecond()+'2';
		$page.find("[tb='optHistoryTable']").bootstrapTable({
			url : dev_test+"addDefect/queryOptHistory.asp?SID=" + SID + "&call=" + ohCall + "&DEFECT_ID=" + defect_id,
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
			pageSize : 10, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 460, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "OPT_ID", // 每一行的唯一标识，一般为主键列
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			singleSelect : true,// 复选框单选
			jsonpCallback : ohCall,
			onDblClickRow : function(row){
			},onLoadSuccess : function(data){
				gaveInfo();
			},
			columns : [ {
				field : 'ORDER_ID',
				title : '序号',
				align : "center",
				width : "50px",
				formatter:function(value,row,index){
					return index + 1;
				}
			}, {
				field : "OPT_TIME",
				title : "操作时间",
				align : "center"
			}, {
				field : "OPT_ROLE",
				title : "角色",
				align : "center"
			}, {
				field : "OPT_MAN_NAME",
				title : "姓名",
				align : "center"
			}, {
				field : "OPERATION",
				title : "操作",
				align : "center"
			}, {
				field : "REMARK",
				title : "备注说明",
				align : "center"
			}]
		});
	}


	//初始化附件列表
	function initFileTable(param) {
		//附件列表
		 var tablefile = $page.find("[tb='detailFileTable']");
			 var business_code = param.FILE_ID;
			 getFtpFileList(tablefile, $page.find("#file_detail_modal"), business_code, "0101");
	}

	

}

//初始化缺陷自定义属性信息
//初始化缺陷自定义属性table
function initDefectAttrInfo(item){
	var rowCall1 = getMillisecond();
	baseAjaxJsonp(dev_test+"addDefect/queryDefectAttrById.asp?SID=" + SID + "&call=" + rowCall1 + "&defect_id=" + item.DEFECT_ID, null, function(data) {
		if(data.rows.length==0){
			getCurrentPageObj().find("#defectAttr").hide();
			getCurrentPageObj().find("#defectAttr_table").hide();
		}else{
			//先动态生成表列内容
			var appendHtml = getDefectInfoBodyHtml(data.rows);
			var table = getCurrentPageObj().find("table[tb=defInfoAttrTable] tbody");
			table.html("");
			//再加载进表
			table.append(appendHtml);
			initVlidate(table);
			//最后初始化字典项
			initDefectSelectAndRadio(table);
		}
	},rowCall1,false);
}
//初始化动态类型表格
function getDefectInfoBodyHtml(attrField){
	var rowNum = 2;
	var appendHtml = "";
	var fieldNum = 1;
	for ( var i = 0; i < attrField.length; i++) {
		appendHtml += fieldNum%rowNum==1?"<tr>":"";
		appendHtml += getDefectRowLine(attrField[i]);
		appendHtml += fieldNum%rowNum==0?"</tr>":"";
		fieldNum++;
	}
	//补全因非结束产生的表格不全的情况;
	if(!(fieldNum%rowNum==1)){
		while(!(fieldNum%rowNum==1)){
			appendHtml += "<td colspan='2'></td>";
			fieldNum++;
		}
		appendHtml += "</tr>";
	}
	return appendHtml;
}
//生成动态类型表格HTML代码
function getDefectRowLine(item) {
	var str = "";
	str += "<td  class='table-text' width='20%' >" + item.ATTR_NAME + ":</td>";
	if (item.ATTR_TYPE == "00") {// 00表示文本框
		var attrvalue='';
		if(item.ATTR_VALUE!=undefined && item.ATTR_VALUE !='undefined'){
			attrvalue= item.ATTR_VALUE;
		}
		str += "<td><div>"
				+ attrvalue + "</div></td>";
	} else if ((item.ATTR_TYPE == "01") || (item.ATTR_TYPE == "03")
			|| (item.ATTR_TYPE == "02")) {// 01表示下拉单选
		str += "<td><div diccode='" + item.DICTIONARY_NUM + "' value='"
				+ item.ATTR_VALUE + "'></div></td>";
	}
	return str;
}
//初始化div内容根据DIC_CODE和Item_code
function initDefectSelectAndRadio(tableObj) {
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











