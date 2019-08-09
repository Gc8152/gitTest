//全局变量缺陷等级
var defect_grade="";
function designateDefect(item){
	defect_grade=item.SEVERITY_GRADE;
	
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	initRealOptTable(item);//初始化操作步骤表
	initOptHisTable(item);//初始化历史记录表
	desigInitDefectAttrInfo(item);
	initDefectInfo(item);//初始化缺陷信息
	initFileTable(item);//初始化附件相关
	
//	if(item.DEFECT_STATE == '06'){//待重新指派
//		$page.find("tr[class='hid']").children('td').eq(0).text("打回原因：");
//		$page.find("tr[class='hid']").show(); 
//	}

	//指派缺陷
	$page.find("[name='IU.DISPOSE_MAN_NAME']").click(function(){
		var $proManPop = $page.find("[mod='proManPop']");
		var $DISPOSE_MAN_NAME = $page.find("[name='IU.DISPOSE_MAN_NAME']");
		var $DISPOSE_MAN = $page.find("[name='IU.DISPOSE_MAN']");
		var SYSTEM_ID = item.SYSTEM_ID;
		var DISCOVER_SYSTEM_ID = item.DISCOVER_SYSTEM_ID;
		proManPop1($proManPop, {
			DISPOSE_MAN_NAME : $DISPOSE_MAN_NAME,
			DISPOSE_MAN  : $DISPOSE_MAN },SYSTEM_ID,DISCOVER_SYSTEM_ID);
	});
	
	
	//提交
	$page.find("[btn='submitDesignate']").click(function(){
		if(!vlidate($page,"",true)){
			//alert("请指派处理人");
			return ;
		}
		nconfirm("确定要指派该缺陷吗？",function(){
			var params = getPageParam("IU");
			var designateCall = getMillisecond();
			baseAjaxJsonp(dev_test+"designateDefect/saveDesignate.asp?SID=" + SID + "&call=" + designateCall, params, function(data) {
				if(data && data.result=="true"){
					//alert(data.msg);
					closeCurrPageTab();
				}else{
					alert(data.msg);
					//closeCurrPageTab();
				}
				},designateCall,false);
			});
	});
		
	//拒绝缺陷
	$page.find("[btn='refuse_defect']").click(function(){
		$page.find("#refuseDefect_modal").modal('show');
	});
	
	//拒绝缺陷保存
	$page.find("[btn='refuse_save']").click(function(){
		if(!vlidate($page.find("#refuseDefect_modal"),"",true)){
			return ;
		}
		var params = getPageParam("IU");
		params["TYPE"] = 'refuse';
		params["DISPOSE_REASON"] = params.REFUSE_REASON;
		$page.find("#refuseDefect_modal").modal('hide');
		saveDispose(params);
	});
	//转交缺陷保存
	$page.find("[btn='discover_save']").click(function(){
		if(!vlidate($page.find("#discoverDefect_modal"),"",true)){
			return ;
		}
		var params = getPageParam("IU");
		params["TYPE"] = 'discover';
		params["DUTY_PERSON"] = $page.find("[name='IU.DUTY_PERSON']").val();
		params["DISPOSE_REASON"] = $page.find("[name='IU.DISCOVER_COMMENT']").val();
		params["DISCOVER_SYSTEM_ID"] = $page.find("[name='IU.DISCOVER_SYSTEM_ID']").val();
		params["DISCOVER_COMMENT"] = $page.find("[name='IU.DISCOVER_COMMENT']").val();
		$page.find("#discoverDefect_modal").modal('hide');
		saveDispose(params);
	});
	//转交缺陷
	 $page.find("button[name='discoverDefect']").click(function(){
			$page.find("#discoverDefect_modal").modal('show');

	 });
	//选择应用
		$page.find("[name='IU.DISCOVER_SYSTEM_NAME']").click(function(){
			//$page.find("#discoverDefect_modal").modal('hide');

			//选择应用
			var $SYSTEM_NAME = $page.find("[name='IU.DISCOVER_SYSTEM_NAME']");
			var $SYSTEM_ID= $page.find("[name='IU.DISCOVER_SYSTEM_ID']");
			var SYSTEM_ID = item.SYSTEM_ID;
			var DISCOVER_SYSTEM_ID = item.DISCOVER_SYSTEM_ID;
			var sys_id = "";
			if(DISCOVER_SYSTEM_ID == undefined){
				sys_id=SYSTEM_ID;
			}else{
				sys_id=DISCOVER_SYSTEM_ID;
			}
			openSystemPop2('sendProduceSystemPop1', {
				name : $SYSTEM_NAME,
				id  : $SYSTEM_ID,
				duty_name : $page.find("[name='IU.DUTY_PERSON_NAME']"),
				duty_id : $page.find("[name='IU.DUTY_PERSON']"),
				
			},sys_id);
		});	
		//选择责任人
		$page.find("[name='IU.DUTY_PERSON_NAME']").click(function(){
			var DISCOVER_SYSTEM_ID = $page.find("[name='IU.DISCOVER_SYSTEM_ID']").val();
			if(DISCOVER_SYSTEM_ID==null || DISCOVER_SYSTEM_ID==""){
				alert("请选择应用");
				return;
			}
			openUserPop("userOrgDivPop",{"name":$page.find("[name='IU.DUTY_PERSON_NAME']"),"no":$page.find("[name='IU.DUTY_PERSON']")},DISCOVER_SYSTEM_ID);

			//initModal();//POP框垂直居中
		});
	function saveDispose(params){
		var sCall = getMillisecond();
		baseAjaxJsonp(dev_test+"disposeDefect/saveDispose.asp?SID=" + SID + "&call=" + sCall, params, function(data) {
			if(data && data.result=="true"){
				//alert(data.msg);
				closeCurrPageTab();
			}else{
				alert(data.msg);
				//closeCurrPageTab();
			}
		},sCall,false);
	}
	
	//初始化信息
	function initDefectInfo(item){
		var	defect_id = item.DEFECT_ID;
		$page.find("[name='IU.DEFECT_ID']").val(defect_id);
		for(var k in item){
			if(k=="SEVERITY_GRADE"){
				initSelect($page.find("[name='IU."+ k +"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"TM_DIC_SEVERITY_GRADE"},item[k]);
			}
			if(k=="DEFECT_DESCRIPTION"){
				$page.find("[name='IU.DEFECT_DESCRIPTION']").val(item[k]);
			}
			$page.find("#"+k).text(item[k]);
		}
		if(item.DISPOSE_REASON!=undefined){
			$page.find("tr[class='hid']").show(); 
		}
		if(item.DISCOVER_SYSTEM_NAME!=undefined){
			$page.find("tr[class='DISCOVER_SYSTEM_NAME']").show(); 
		}
		if(item.DISCOVER_COMMENT!=undefined){
			$page.find("tr[class='DISCOVER_COMMENT']").show(); 
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
			queryParams : queryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : false, // 是否显示分页（*）
			pageList : [ 5, 10, 15 ], // 可供选择的每页的行数（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 10, // 每页的记录行数（*）
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
		 var tablefile = $page.find("[tb='designateFileTable']");
			 var business_code = param.FILE_ID;
			 getFtpFileList(tablefile, $page.find("#file_designate_modal"), business_code, "0101");
	}
}
//初始化缺陷自定义属性信息
//初始化缺陷自定义属性table
function desigInitDefectAttrInfo(item){
	var rowCall1 = getMillisecond();
	baseAjaxJsonp(dev_test+"addDefect/queryDefectAttrById.asp?SID=" + SID + "&call=" + rowCall1 + "&defect_id=" + item.DEFECT_ID, null, function(data) {
		if(data.rows.length==0){
			getCurrentPageObj().find("#defectAttr").hide();
			getCurrentPageObj().find("#defectAttr_table").hide();
		}else
		{
			//先动态生成表列内容
			var appendHtml = getDefectInfoBodyHtml(data.rows);
			var table = getCurrentPageObj().find("table[tb=desigInfoAttrTable] tbody");
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
				+ attrvalue+ "</div></td>";
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
//改变缺陷等级
function changeGrade(){
	var grade = getCurrentPageObj().find("[name='IU.SEVERITY_GRADE']").val();
	if(defect_grade==grade){
		getCurrentPageObj().find("tr[class='hidden']").remove();
	}else{
		getCurrentPageObj().find("tr[class='hidden']").remove();
		var html = '<tr class="hidden">'+
		'<td class="table-text">缺陷等级变更说明：</td>'+
		'<td colspan="4">'+
		'<textarea name="IU.CHANGE_GRADE_REASON" class="requirement-ele-width" validate="v.200_mzhi"></textarea>'+	                    
		'</td>'+
		'</tr>';
		getCurrentPageObj().find("tr[id='aaa']").after(html);
		initVlidate(getCurrentPageObj().find("tr[class='hidden']"));
	}
	
}
getCurrentPageObj().find("input[name='IU.COMPLETE_TIME']").datetimepicker({
	language: 'zh-CN',//显示中文
	format: 'yyyy-mm-dd hh:00:00',//显示格式
	minView: 1,//最精准的时间选择为日期0-分 1-时 2-日 3-月 
	initialDate: new Date(),//初始化当前日期
	autoclose: true,//选中自动关闭
	todayBtn: true,//显示今日按钮,
	//startView:0, //Number, String. 默认值：2, 'month'日期时间选择器打开之后首先显示的视图。 可接受的值：
	todayHighlight:true,//Boolean. 默认值: false如果为true, 高亮当前日期。
	//minuteStep Number. 默认值: 5此数值被当做步进值用于构建小时视图。对于每个 minuteStep 都会生成一组预设时间（分钟）用于选择。
});



