
//初始化
function editDefect(item,type){
	var $page = getCurrentPageObj();//当前页
	initVlidate($page);//渲染必填项
	var realOptCall = getMillisecond()+'1';
	if(type == 'add'){//新增
		autoInitSelect($page);//初始化下拉选择
		var url=dev_test+"addDefect/queryOptByDefectId.asp?"+"SID=" + SID + "&call=" + realOptCall + "&DEFECT_ID="+null;
		initRealOptTable(url);//初始化操作步骤表
		initDefectAttrTable();//初始化基础属性信息
		//initFileTable();//初始化附件相关
		initButtonEvent(null);//初始化按钮事件
	}else if(type == 'edit'){//修改
		var url=dev_test+"addDefect/queryOptByDefectId.asp?"+"SID=" + SID + "&call=" + realOptCall + "&DEFECT_ID="+item.DEFECT_ID;
		initRealOptTable(url);//初始化操作步骤表
		
		initDefectInfo(item);//初始化缺陷信息
		selectModuleEdit(item.MODULE_ID,item.SYSTEM_ID);
		selectFuncEdit(item.FUNCPOINT_ID,item.MODULE_ID);

		editDefectAttrTable(item);
		initButtonEvent("edit");//初始化按钮事件
		//initFileTable(item);//初始化附件相关
		
	}else if(type == 'find'){//执行案例时发现缺陷
		var url=dev_test+"testTaskExecute/queryCaseStepList.asp?SID=" + SID + "&call=" + realOptCall +"&CASE_ID="+item.CASE_ID+"&TEST_ROUND="+item.TEST_ROUND;
		initRealOptTable(url);//初始化操作步骤表
		autoInitSelect($page);//初始化下拉选择
		initCaseInfo(item);//初始化案例相关信息
		initDefectAttrTable();
		//initFileTable();//初始化附件相关
		initButtonEvent(null);//初始化按钮事件
	}
	
	//按钮事件
	function initButtonEvent(edit){
		//选择功能点
//		$page.find("[name='IU.FUNC_NAME']").click(function(){
//			var $FuncPop = $page.find("[mod='FuncPop']");
//			var $FUNC_NAME = $page.find("[name='IU.FUNC_NAME']");
//			var $FUNC_ID= $page.find("[name='IU.FUNC_ID']");
//			var $DUTY_PERSON_NAME = $page.find("[name='IU.DUTY_PERSON_NAME']");
//			var $DUTY_PERSON= $page.find("[name='IU.DUTY_PERSON']");
//			var $TEST_ROUND= $page.find("[name='IU.TEST_ROUND']");
//			FuncPop($FuncPop, {
//				FUNC_NAME : $FUNC_NAME,
//				FUNC_ID  : $FUNC_ID,
//				DUTY_PERSON_NAME : $DUTY_PERSON_NAME,
//				DUTY_PERSON : $DUTY_PERSON,
//				TEST_ROUND : $TEST_ROUND
//			});
//		});
		//选择应用
		$page.find("[name='IU.SYSTEM_NAME']").click(function(){
			//选择应用
			var $SYSTEM_NAME = $page.find("[name='IU.SYSTEM_NAME']");
			var $SYSTEM_ID= $page.find("[name='IU.SYSTEM_ID']");
			openSystemPop1('sendProduceSystemPop', {
				name : $SYSTEM_NAME,
				id  : $SYSTEM_ID,
				duty_name : $page.find("[name='IU.DUTY_PERSON_NAME']"),
				duty_id : $page.find("[name='IU.DUTY_PERSON']"),
				func_call:selectModule
			});
		});
		//选择测试案例
		$page.find("[name='IU.TESTPOINT_NAME']").click(function(){
			var func_id = $page.find("[name='IU.FUNCPOINT_ID']").val();
			if(func_id==null || func_id==""){
				alert("请选择功能点");
				return;
			}
			var $TESTPOINT_NAME = $page.find("[name='IU.TESTPOINT_NAME']");
			var $TESTPOINT_ID= $page.find("[name='IU.TESTPOINT_ID']");
			openTestPop('testPop', {
				name : $TESTPOINT_NAME,
				id  : $TESTPOINT_ID,
				func_call:initRealOptTable,
				selectCaseType:selectCaseType,
				realCall:realOptCall
			},func_id);
		});
//		$page.find("#DUTY_PERSON_NAME").click(function(){
//			openUserPop("userOrgDivPop",{"name":$page.find("#DUTY_PERSON_NAME"),"no":$page.find("#DUTY_PERSON")});
//
//			//initModal();//POP框垂直居中
//		});
		//保存按钮
		$page.find("[btn='saveAddInfo']").click(function(){
			addDefectInfo("save",edit);
		});
		
		//提交按钮
		$page.find("[btn='submitAddInfo']").click(function(){
			addDefectInfo("submit",edit);
			
		});
		$page.find("#IS_REAPPEAR0").click(function(){
			$(this).attr("checked",true);
			$page.find("#IS_REAPPEAR1").attr("checked",false);
		});
		
		$page.find("#IS_REAPPEAR1").click(function(){
			$(this).attr("checked",true);
			$page.find("#IS_REAPPEAR0").attr("checked",false);
		});
		
		var tableDate = getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('getData');
		var opt_order = tableDate.length;
		//增加操作步骤
		$page.find("[name='addOpt']").click(function(){
			var optInfo = {};
			opt_order = opt_order + 1;
			optInfo["OPT_DESCRIPT"] = "";
			optInfo["INPUT_DATA"] = "";
			optInfo["EXPECT_RESULT"] = "";
			optInfo["REAL_INPUT"] = "";
			optInfo["REAL_RESULT"] = "";
			optInfo["OPT_ORDER"] = opt_order;
			getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('append',optInfo);
		});
	};


	//保存&提交
	function addDefectInfo(opt_type,edit){
			var params = getPageParam("IU");
			var tableDate = getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('getData');
			if(0 == tableDate.length){
				params["REAL_OPT"] = '';
			}else{
				var count = 1;
				var realOpt = new Array();
				for( var k=0; k <tableDate.length; k++){
					if(tableDate[k].OPT_DESCRIPT == undefined){
						tableDate[k].OPT_DESCRIPT="";
					}
					if(tableDate[k].INPUT_DATA == undefined){
						tableDate[k].INPUT_DATA="";
					}
					if(tableDate[k].EXPECT_RESULT == undefined){
						tableDate[k].EXPECT_RESULT="";
					}
					if(tableDate[k].REAL_INPUT == undefined){
						tableDate[k].REAL_INPUT="";
					}
					if(tableDate[k].REAL_RESULT == undefined){
						tableDate[k].REAL_RESULT="";
					}
					
					realOpt.push({"OPT_ORDER":count,"OPT_DESCRIPT":tableDate[k].OPT_DESCRIPT,
								"INPUT_DATA":tableDate[k].INPUT_DATA,"EXPECT_RESULT":tableDate[k].EXPECT_RESULT,
								"REAL_INPUT":tableDate[k].REAL_INPUT,"REAL_RESULT":tableDate[k].REAL_RESULT});
					count++;
					if(tableDate[k].OPT_DESCRIPT=="" || tableDate[k].EXPECT_RESULT==""){
						alert("请完善步骤信息，操作描述、预期结果为必填项");
						return ;
					}
				}
				params["REAL_OPT"] = JSON.stringify(realOpt);
			}
			params["OPT_TYPE"] = opt_type;
			if(!vlidate($page,"",true)){
				//alert("有必填项未填");
				return ;
			}
			//添加自定义属性信息
			var $attrTable = getCurrentPageObj().find("table[tb=defectAttrTable] tbody");
			var attrInfoArr = new Array();
			$attrTable.find("[name='attrInfoList']").each(//获取属性值
					function() {
						var $obj = $(this).find("[attr_type]");
						var attr_type = $obj.attr("attr_type");
						var attr_id = $obj.attr("attr_id");
						var default_value = "||";
						if(attr_type == "input" || attr_type == "select"){
							default_value = $obj.val()||"||";
						}else if(attr_type == "mul_select"){
							if($obj.val()){
								default_value = $obj.val().join(",");
							}
						}else if(attr_type == "radio"){
							var rvalue = $obj.find("input[name='"+$obj.attr("attr_id")+"']:checked").val();
							default_value = rvalue == undefined ? "||" : rvalue;
						}
						attrInfoArr.push(attr_id + "%%" + default_value);
					});
			params["attrInfoArr"] = attrInfoArr;
//添加自定义属性信息结束
		//	var filedata = getCurrentPageObj().find("#initiate_fileTable").bootstrapTable("getData");
		//	  if(filedata==""||filedata==undefined){
		//		  alert("未上传截图！");
		//		  return;
		//	  }
			if(null == edit){ 
				addSave(params);
			}else{
				editSave(params);
			}
	}


	//新增保存&提交
	function addSave(params){
		var OPT_TYPE = params["OPT_TYPE"] ;
		if(OPT_TYPE=="submit"){
			
			nconfirm("确定提交该数据吗？",function(){
				baseAjaxProxyTest("addDefect/saveAddDefect.asp", params, function(data) {
					if(data && data.result=="true"){
						if(data && data.review=="false"){
							alert("提交失败，请联系管理员");
						}
						//alert(data.msg);
						closeCurrPageTab();
						
					}else{
						alert(data.msg);
						//closeCurrPageTab();
					}
				});
			});
		}else{
			baseAjaxProxyTest("addDefect/saveAddDefect.asp", params, function(data) {
				if(data && data.result=="true"){
					if(data && data.review=="false"){
						alert("提交失败，请联系管理员");
					}
					//alert(data.msg);
					closeCurrPageTab();
					
				}else{
					alert(data.msg);
					//closeCurrPageTab();
				}
			});
		}
	}

	//修改保存&提交
	function editSave(params){
		nconfirm("确定提交该数据吗？",function(){
//			var editCall = getMillisecond();
//			baseAjaxJsonp(dev_test+"addDefect/saveEditDefect.asp?SID=" + SID + "&call=" + editCall, params, function(data) {
//				if(data && data.result=="true"){
//					//alert(data.msg);
//					closeCurrPageTab();
//				}else{
//					alert(data.msg);
//					//closeCurrPageTab();
//				}
//			},editCall,false);
			baseAjaxProxyTest("addDefect/saveEditDefect.asp?", params, function(data) {
				if(data && data.result=="true"){
					if(data && data.review=="false"){
						alert("提交失败，请联系管理员");
					}
					//alert(data.msg);
					closeCurrPageTab();
				}else{
					alert(data.msg);
					//closeCurrPageTab();
				}
			});
		});
	}


	//初始化缺陷修改信息
	function initDefectInfo(item){
		for(var k in item){
			if(k=="IS_REAPPEAR"){
				if(item["IS_REAPPEAR"]=='00'){
					$page.find("#IS_REAPPEAR0").attr("checked",true);
				}
				if(item["IS_REAPPEAR"]=='01'){
					$page.find("#IS_REAPPEAR1").attr("checked",true);
				}
			}else{
			
				var dicCode = $page.find("[name='IU."+ k +"']").attr("diccode");
				if(dicCode != undefined){
					initSelect($page.find("[name='IU."+ k +"']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:dicCode},item[k]);
					continue;
				}
				$page.find("[name='IU."+ k +"']").val(item[k]);
			
			}
		}
		if(item["TESTPOINT_ID"]!="" && item["TESTPOINT_ID"]!=null){
			$page.find("[name='IU.TEST_TYPE']").attr("disabled","disabled");
		}
		findFileInfo(item["FILE_ID"],function(data){
			if(data.rows.length>0){
				defaultShowFileInfo(item["FILE_ID"],$page.find("#ETA_out_resume").parent(),data,true,"outResumeFileDiv");
			}
		});

	}
	
	//初始化执行案例信息
	function initCaseInfo(item){
		for(var k in item){
			 $page.find("[name='IU."+k+"']").val(item[k]);
			 }
	}

	//实际操作步骤表
	function initRealOptTable(url){
		$page.find("[tb='realOptTable']").bootstrapTable("destroy").bootstrapTable({
			url : url,
			method : 'get', // 请求方式（*）
			striped : false, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pagination : false, // 是否显示分页（*）
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
			},onPostBody :function(data){
				var bootData = getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable("getData");
				var inputs = getCurrentPageObj().find("[tb='realOptTable']").find("input");
				inputs.unbind("change").bind("change", function(e){
					var index = $(this).attr("index");
					var bootrow = bootData[index];
					bootrow[$(this).attr("name")] = $(this).val();
				});
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
				align : "center",
				formatter: function (value, row, index) {
					if(undefined == row.OPT_DESCRIPT){
						row.OPT_DESCRIPT = '';
					}
					return "<input type='text' name='OPT_DESCRIPT' index='"+index+"' value='"+row.OPT_DESCRIPT+"' >" ;
				}
			}, {
				field : "INPUT_DATA",
				title : "输入数据",
				align : "center",
				formatter: function (value, row, index) {
					if(undefined == row.INPUT_DATA){
						row.INPUT_DATA = '';
					}
					return "<input type='text' name='INPUT_DATA' index='"+index+"' value='"+row.INPUT_DATA+"' >" ;
				}
			}, {
				field : "EXPECT_RESULT",
				title : "预期结果",
				align : "center",
				formatter: function (value, row, index) {
					if(undefined == row.EXPECT_RESULT){
						row.EXPECT_RESULT = '';
					}
					return "<input type='text' name='EXPECT_RESULT' index='"+index+"' value='"+row.EXPECT_RESULT+"' >" ;
				}
			}, {
				field : "REAL_INPUT",
				title : "实际输入数据",
				align : "center",
				formatter: function (value, row, index) {
				
					if (row.REAL_INPUT!=undefined&&row.REAL_INPUT!=null&&row.REAL_INPUT!="")
					{
						return "<input type='text' name='REAL_INPUT' index='"+index+"' value='"+row.REAL_INPUT+"'>" ;
					}
					
					else if (row.ACTUAL_DATA!=undefined&&row.ACTUAL_DATA!=null&&row.ACTUAL_DATA!="")
							{
						         row["REAL_INPUT"]=row.ACTUAL_DATA;
						return "<input type='text' name='REAL_INPUT' index='"+index+"' value='"+row.ACTUAL_DATA+"'>" ;}
					else {
						return "<input type='text' name='REAL_INPUT' index='"+index+"' value=''>" ;
					}	
				}
			}, {
				field : "REAL_RESULT",
				title : "实际结果",
				align : "center",
				formatter: function (value, row, index) {
					if (row.REAL_RESULT!=undefined&&row.REAL_RESULT!=null&&row.REAL_RESULT!="")
							{return "<input type='text' name='REAL_RESULT' index='"+index+"' value='"+row.REAL_RESULT+"'>" ;}
							
					else if (row.ACTUAL_RESULT!=undefined&&row.ACTUAL_RESULT!=null&&row.ACTUAL_RESULT!="")
							{
						 row["REAL_RESULT"]=row.ACTUAL_RESULT;
						return "<input type='text' name='REAL_RESULT' index='"+index+"' value='"+row.ACTUAL_RESULT+"'>" ;}
					else {
						return "<input type='text' name='REAL_RESULT' index='"+index+"' value=''>" ;
					}	
				}
			}, {
				field :	"OPT_ORDER",
				title :	"操作",
				align : "center",
				width : "10%",
				formatter: function (value, row, index) {
					return "<a style='color:blue'  href='javascript:void(0)' onclick=deleteOpt('"+row.OPT_ORDER+"')>删除</a>" ;
				}
			}
			]
		});
	}
	
	//初始化附件列表
	var file_id = $page.find("#ETA_out_resume_file").val();
	if(""==$.trim(file_id)){
		$page.find("#ETA_out_resume_file").val(Math.uuid());
	}
	$page.find("#ETA_out_resume").click(function(){
		openFileUploadInfo('outResumeFile','OUT_RESUME',
				$page.find("#ETA_out_resume_file").val(),
				function(data){
					defaultShowFileInfo($page.find("#ETA_out_resume_file").val(),
					$page.find("#ETA_out_resume").parent(),data,true,"outResumeFileDiv");
		});
	});
//	function initFileTable(item) {
//		 //附件上传
//		 var tablefile = $page.find("[tb='defect_fileTable']");
//		 var business_code = "";
//		 business_code = $page.find("#FILE_ID_ADD").val();
//		 if(!business_code){
//			 business_code = Math.uuid();
//			 $page.find("#FILE_ID_ADD").val(business_code);
//		 }
//		
//		 //点击打开模态框
//		 var addfile = $page.find("[btn='defect_upFile']");
//		 addfile.click(function(){
//			 var paramObj = {"FILE_DIR":business_code};
////			 paramObj["SYSTEM_NAME"] = "systemname";
//			 openFileFtpUpload($page.find("#file_modal"), tablefile, 'GZ1077',business_code, '0101', 'TM_DIC_SCREENSHOT', false, false, paramObj);
//		 });
//		
//		 //附件删除
//		 var delete_file = $page.find("[btn='defect_delFile']");
//		 delete_file.click(function(){
//		 	delFtpFile(tablefile, business_code, "0101");
//		 });
//		 
//		 getFtpFileList(tablefile, $page.find("#file_modal"), business_code, "0101");
//
//	}
	
}


//删除操作步骤
function deleteOpt(opt_order){
	getCurrentPageObj().find("[tb='realOptTable']").bootstrapTable('removeByUniqueId', opt_order);
	
}

//自定义属性
//初始化缺陷自定义属性table
function initDefectAttrTable(){
	var rowCall = getMillisecond();
	baseAjaxJsonp(dev_test+"addDefect/queryDefectAttrCustList.asp?SID=" + SID + "&call=" + rowCall, null, function(data) {
		if(data.rows.length==0){
			getCurrentPageObj().find("#defectAttr").hide();
			getCurrentPageObj().find("#defectAttr_table").hide();
		}else
		{
			//先动态生成表列内容
			var appendHtml = getDefectTableBodyHtml(data.rows);
			var table = getCurrentPageObj().find("table[tb=defectAttrTable] tbody");
			table.html("");
			//再加载进表
			table.append(appendHtml);
			initVlidate(table);
			//最后初始化字典项
			initDefectSelectAndRadio(table);
			
		}
	},rowCall,false);
}

//初始化动态类型表格
function getDefectTableBodyHtml(attrField){
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
function getDefectRowLine(item){
	var str = "";
	var is_necessary = "";
	if(item.NECESSARY == "00"){//00表示必填
		is_necessary = 'validate=\"v.required\"';
	}
	str += "<td  class='table-text' width='20%' >" + item.ATTR_NAME + ":</td>";
	var attr_value='';
	if(item.ATTR_VALUE!=undefined){
		attr_value=item.ATTR_VALUE;
	}
	else{
		if(item.DEFAULT_NUM==undefined || item.DEFAULT_NUM=='undefined'){
			attr_value='';
		}
		else{
		attr_value=item.DEFAULT_NUM;}
	}
	if(item.ATTR_TYPE=="00"){//00表示文本框
		
		str += "<td name='attrInfoList'><input style='width:100%' attr_type='input' "+is_necessary+" type='text' maxlength='"+item.MAX_LENGTH+"' attr_id='" + item.ATTR_ID + "' value='"+attr_value+"' /></td>";
	} else if(item.ATTR_TYPE=="01"){//01表示下拉单选
		str += "<td name='attrInfoList'><select style='width:100%' attr_type='select' "+is_necessary+" attr_id='" + item.ATTR_ID + "' diccode='"+item.DICTIONARY_NUM+"' value='"+attr_value+"'></select></td>";
	} else if(item.ATTR_TYPE=="02"){//02表示下拉多选
		str += "<td name='attrInfoList'><select style='width:100%' attr_type='mul_select' "+is_necessary+" attr_id='" + item.ATTR_ID + "' diccode='"+item.DICTIONARY_NUM+"' multiple='multiple' value='"+attr_value+"'></select></td>";
	} else if(item.ATTR_TYPE=="03"){//二选一
		str += "<td name='attrInfoList'><span style='width:100%' attr_type='radio' attr_id='" + item.ATTR_ID + "' radiocode='"+item.DICTIONARY_NUM+" 'value='"+attr_value+"' class='citic-sele-ast'></span></td>";
	}
	return str;
}

//初始化字典项
function initDefectSelectAndRadio(tableObj){
	//初始化下拉选
	var seles = tableObj.find("select");
	for(var i = 0; i < seles.length; i++){
		if(typeof($(seles[i]).attr("multiple"))=="undefined"){//当是下拉单选时
			initSelect($(seles[i]),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:$(seles[i]).attr("diccode")},$(seles[i]).attr("value"), null);
		}else{//否则是下拉多选
			 initMoreSelect($(seles[i]),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:$(seles[i]).attr("diccode")},$(seles[i]).attr("value"), null);
		}
	}
	//初始化radio
	var radios = tableObj.find("span[radiocode]");
	for(var j=0 ; j < radios.length; j++){
		var $radio = $(radios[j]);
		autoInitRadio({dic_code:$.trim($radio.attr("radiocode"))},$radio,$radio.attr("attr_id"),{labClass:"ecitic-radio-inline",value:$radio.attr("value")});
	}
	
}
//修改缺陷信息
//初始化缺陷自定义属性table
function editDefectAttrTable(item){
	var rowCall1 = getMillisecond();
	baseAjaxJsonp(dev_test+"addDefect/queryDefectAttrById.asp?SID=" + SID + "&call=" + rowCall1 + "&defect_id=" + item.DEFECT_ID, null, function(data) {
		if(data.rows.length==0){
			getCurrentPageObj().find("#defectAttr").hide();
			getCurrentPageObj().find("#defectAttr_table").hide();
		}else
		{
			//先动态生成表列内容
			var appendHtml = getDefectTableBodyHtml(data.rows);
			var table = getCurrentPageObj().find("table[tb=defectAttrTable] tbody");
			table.html("");
			//再加载进表
			table.append(appendHtml);
			initVlidate(table);
			//最后初始化字典项
			initDefectSelectAndRadio(table);
			
		}
	},rowCall1,false);
}
////POP控件
//$(function(){
//	$("#DUTY_PERSON_NAME").click(function(){
//		openUserPop("userOrgDivPop",{"name":$("#DUTY_PERSON_NAME"),"no":$("#DUTY_PERSON")});
//		initModal();//POP框垂直居中
//	});
//});

//添加查询模块
function selectModule(func_call){
	var system_id = getCurrentPageObj().find("#SYSTEM_ID").val();
	var url = dev_test+'addDefect/queryModuleBySysId.asp';
	var obj = getCurrentPageObj().find("#MODULE_ID");	
	obj.empty();
	obj.append('<option value="">请选择</option>');	
	baseAjaxJsonpNoCall(url,{"system_id":system_id},function(data){
		var rows = data.list;
		if(rows){
			for(var i=0;i<rows.length;i++){
				obj.append('<option  value="'+rows[i].FUNC_NO+'">'+rows[i].FUNC_NAME+'</option>');	
			}
		}
		try{
			if(func_call){
				func_call(rows);
			}
		}catch(e){}
	});
	obj.select2();
	
}

//添加查询功能点
function selectFunc(func_call){
	getCurrentPageObj().find("[name='IU.TESTPOINT_ID']").val("");
	getCurrentPageObj().find("[name='IU.TESTPOINT_NAME']").val("");
	var module_id = getCurrentPageObj().find("#MODULE_ID").val();

	var url = dev_test+'addDefect/queryModuleByFuncId.asp';
	var obj = getCurrentPageObj().find("#FUNCPOINT_ID");
	obj.empty();
	obj.append('<option value="">请选择</option>');	
	
	baseAjaxJsonpNoCall(url,{"module_id":module_id},function(data){
		var rows = data.list;
		if(rows){
			for(var i=0;i<rows.length;i++){
				obj.append('<option value="'+rows[i].FUNC_NO+'">'+rows[i].FUNC_NAME+'</option>');	
			}
		}
		try{
			if(func_call){
				func_call(rows);
			}
		}catch(e){}
	});
	obj.select2();
}	
//改变功能点 原先案例清空
function selectCase(){
	 getCurrentPageObj().find("[name='IU.TESTPOINT_ID']").val("");
	 getCurrentPageObj().find("[name='IU.TESTPOINT_NAME']").val("");

	
}
//修改回显模块
function selectModuleEdit(module,system_id){

	var url = dev_test+'addDefect/queryModuleBySysId.asp';
	var obj = getCurrentPageObj().find("#MODULE_ID");	
	obj.empty();
	obj.append('<option value="">请选择</option>');	
	baseAjaxJsonpNoCall(url,{"system_id":system_id},function(data){
		var rows = data.list;
		if(rows){
			for(var i=0;i<rows.length;i++){
//				if(module == rows[i].FUNC_NO){
//					obj.append('<option selected="selected" value="'+rows[i].FUNC_NO+'">'+rows[i].FUNC_NAME+'</option>');	
//				}else{
					obj.append('<option value="'+rows[i].FUNC_NO+'">'+rows[i].FUNC_NAME+'</option>');	

//				}
			}
			obj.val(module);
			obj.select2();
		}
	});
}

//修改回显功能点
function selectFuncEdit(funcpoint,module_id){

	var url = dev_test+'addDefect/queryModuleByFuncId.asp';
	var obj = getCurrentPageObj().find("#FUNCPOINT_ID");
	obj.empty();
	obj.append('<option value="">请选择</option>');	
	baseAjaxJsonpNoCall(url,{"module_id":module_id},function(data){
		var rows = data.list;
		if(rows){
			for(var i=0;i<rows.length;i++){
//				if(funcpoint == rows[i].FUNC_NO){
//					obj.append('<option value="'+rows[i].FUNC_NO+'">'+rows[i].FUNC_NAME+'</option>');	
//
//				}else{
					
					obj.append('<option value="'+rows[i].FUNC_NO+'">'+rows[i].FUNC_NAME+'</option>');	
//				}
			}
			obj.val(funcpoint);
			obj.select2();
		}
	});
}	
//选择案例自动带出测试类型
function selectCaseType(casetype){
	var obj = getCurrentPageObj().find("[name='IU.TEST_TYPE']");
	obj.val(casetype);
	obj.select2();
	if(casetype!=""){
		obj.attr("disabled","disabled");
	}else{
		obj.removeAttr("disabled");
	}
}


/**
 * 提供案例执行页面执行案例时基于案例初始化案例信息的函数
 */
function initPageFormByCaseExecuteInfo(case_id){
	 editDefect(null,'add');
	 baseAjaxJsonpNoCall(dev_test+"testTaskExecute/findTestCaseInfoAddDefect.asp",{case_id:case_id},function(data){
		 getCurrentPageObj().find("#SYSTEM_ID").val(data["SYSTEM_ID"]);
		 getCurrentPageObj().find("#SYSTEM_NAME").val(data["SYSTEM_NAME"]);
		 getCurrentPageObj().find("#DUTY_PERSON_NAME").val(data["DUTY_PERSON_NAME"]);
		 getCurrentPageObj().find("#DUTY_PERSON").val(data["DUTY_PERSON"]);
		 selectModule(function(rows){
			 for(var i=0;i<rows.length;i++){
				 if(data["MODULE_NAME"]==rows[i]["FUNC_NAME"]){
					 getCurrentPageObj().find("#MODULE_ID").val(rows[i]["FUNC_NO"]).select2();
					 selectFunc(function(){
						 getCurrentPageObj().find("#FUNCPOINT_ID").val(data["FUNC_NO"]).select2();
						 getCurrentPageObj().find("#TESTPOINT_ID").val(data["CASE_ID"]);
						 getCurrentPageObj().find("#TESTPOINT_NAME").val(data["CASE_NAME"]);
						 selectCaseType(data["CASE_TYPE1"]);
					 });
					 break;
				 }
			 }
		 });
	 });
}