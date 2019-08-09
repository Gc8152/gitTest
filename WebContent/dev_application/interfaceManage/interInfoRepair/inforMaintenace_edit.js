var currTab = getCurrentPageObj();
var dic_data_I_DIC_INTER_DATA_TYPE;
var dic_data_S_DIC_YN;
function initInterInfoRepair(params){
	baseAjax("SDic/findItemByDic.asp",{dic_code:"I_DIC_INTER_DATA_TYPE"},function(data){
		if(data!=undefined){
			dic_data_I_DIC_INTER_DATA_TYPE = data;
		}
	}, false);
	baseAjax("SDic/findItemByDic.asp",{dic_code:"S_DIC_YN"},function(data){
		if(data!=undefined){
			dic_data_S_DIC_YN = data;
		}
	},false);
	initInterInfoRepair_tab1(params);//默认初始化tab1
	var tab2_flag = true;
	var tab3_flag = true;
	
	//tab2页签首次点击初始化
	getCurrentPageObj().find("[btn='repairTab2']").click(function(){
		if(tab2_flag){
			initInterInfoRepair_tab2(params);
			tab2_flag = false;
		}
	});
	//tab3页签首次点击初始化
	getCurrentPageObj().find("[btn='repairTab3']").click(function(){
		if(tab3_flag){
			initInterInfoRepair_tab3(params);
			tab3_flag = false;
		}
	});
	
	
	
	/*******************************************************************/	
	//初始化tab1方法
	function initInterInfoRepair_tab1(params){
		var $tab1 = getCurrentPageObj().find("#tab1_inforMaintenace_detail");
		initVlidate($tab1);//渲染必填项
		for(var k in params){//初始化基本信息
			k1 = k.toLowerCase();
			$tab1.find("[name='RI."+ k1 +"']").val(params[k]);
			if(k1 == "inter_office_type" || k1 == "inter_status"){
				var $select = $tab1.find("[name='RI."+ k1 +"']");
				initSelect($select,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:$select.attr("diccode")},params[k], null);
			}
		}
		//初始化属性table
		initAttrTable($tab1,params.INTER_ID,params.INTER_VERSION);
		//保存按钮
		$tab1.find("[btn='tab1_save']").unbind();
		$tab1.find("[btn='tab1_save']").click(function(){
			if(!vlidate($tab1,"",true)){
				return ;
			}
			
			var aaa=getCurrentPageObj().find("[name='RI.inter_descr']").val();
		    if(aaa.length>150){
		    	alert("接口描述至多可输入150汉字！");
		    	return;
		    }
			
			var params = getPageParam("RI");//获取基本信息
			var $attrTable = $tab1.find("table[tb=attrTable] tbody");
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
			var sCall = getMillisecond();
			//保存接口信息
			baseAjaxJsonp(dev_application+"InterInfoRepair/saveInterInfo.asp?SID=" + SID + "&call=" + sCall, params, function(data) {
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("保存成功！",function(){
						closeCurrPageTab();
					});
				} else {
					alert("保存失败！");
				}
			},sCall,false);
		});
		
		//初始化属性table
		function initAttrTable(tab1,inter_id,inter_version){
			var rowCall = getMillisecond();
			baseAjaxJsonp(dev_application+"useApplyManage/initInterAttr.asp?SID=" +
					SID + "&call=" + rowCall, {inter_id : inter_id,
				inter_version : inter_version}, function(data) {
				if(data && data.attrRowList){
					//先动态生成表列内容
					var appendHtml = getTableBodyHtml(data.attrRowList);
					var table = tab1.find("table[tb=attrTable] tbody");
					table.html("");
					//再加载进表
					table.append(appendHtml);
					initVlidate(table);
					//最后初始化字典项
					autoInitSelectAndRadio(table);
				}
			},rowCall,false);
		}
		
		//初始化动态类型表格
		function getTableBodyHtml(attrField){
			var rowNum = 2;
			var appendHtml = "";
			var fieldNum = 1;
			for ( var i = 0; i < attrField.length; i++) {
				appendHtml += fieldNum%rowNum==1?"<tr>":"";
				appendHtml += getRowLine(attrField[i]);
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
		function getRowLine(item){
			var str = "";
			var is_necessary = "";
			if(item.IS_NECESSARY == "00"){//00表示必填
				is_necessary = 'validate=\"v.required\"';
			}
			str += "<td  class='table-text' width='20%' >" + item.ATTR_NAME + ":</td>";
			if(item.ATTR_TYPE=="00"){//00表示文本框
				if(!item.DEFAULT_VALUE){
					item.DEFAULT_VALUE="";
				}
				str += "<td name='attrInfoList'><input attr_type='input' "+is_necessary+" type='text' maxlength='"+item.MAX_LONG+"' attr_id='" + item.ATTR_ID + "' value='"+item.DEFAULT_VALUE+"' /></td>";
			} else if(item.ATTR_TYPE=="01"){//01表示下拉单选
				str += "<td name='attrInfoList'><select attr_type='select' "+is_necessary+" attr_id='" + item.ATTR_ID + "' diccode='"+item.DIC_INFO+"' value='"+item.DEFAULT_VALUE+"'></select></td>";
			} else if(item.ATTR_TYPE=="02"){//02表示下拉多选
				str += "<td name='attrInfoList'><select attr_type='mul_select' "+is_necessary+" attr_id='" + item.ATTR_ID + "' diccode='"+item.DIC_INFO+"' multiple='multiple' value='"+item.DEFAULT_VALUE+"'></select></td>";
			} else if(item.ATTR_TYPE=="03"){//二选一
				str += "<td name='attrInfoList'><span attr_type='radio' attr_id='" + item.ATTR_ID + "' radiocode='"+item.DIC_INFO+" 'value='"+item.DEFAULT_VALUE+"' class='citic-sele-ast'></span></td>";
			}
			return str;
		}
		
		//初始化字典项
		function autoInitSelectAndRadio(tableObj){
			//初始化下拉选
			var seles = tableObj.find("select");
			for(var i = 0; i < seles.length; i++){
				if(typeof($(seles[i]).attr("multiple"))=="undefined"){//单是下拉单选时
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
	}
	
	//初始化tab2方法
	function initInterInfoRepair_tab2(params){
		var $tab2 = getCurrentPageObj().find("#tab2_inforMaintenace_detail");//tab2页签对象
		var $tab2_input = $tab2.find("[tb='tab2_input']");//输入内容表对象
		var $tab2_return = $tab2.find("[tb='tab2_return']");//输出内容表对象
		//初始化报文信息表
		initDataTable(params.INTER_ID,params.INTER_VERSION);
		
		//初始化设计文件文档
		initFtpModal(params);
		
		//报文内容导入
		currTab.find("[btn='message_into']").click(function(){
			currTab.find("#input_import2").modal("show");
		});
		
		//报文内容清空
		currTab.find("[btn='message_clear']").click(function(){
			nconfirm('确定清空现有报文输入及输出内容?',function(){
				currTab.find("#InputContentTable").bootstrapTable('removeAll');
				currTab.find("#OutputContentTable").bootstrapTable('removeAll');
				
			});
			
		});
		
		//输入内容选择新增按钮
		currTab.find("#input_selectData").click(function(){
			var $tab1_input = getCurrentPageObj().find("#InputContentTable");
			var inforMaintence_pop = getCurrentPageObj().find("[mod='seleInterPop']");
			changeInforMaintenace_seleDataPop(inforMaintence_pop,"InputContentTable","00","inputData_from");
		});
		//输入内容选择新增按钮
//		$tab2.find("[btn='input_selectData']").click(function(){
//			var inforMaintence_pop = getCurrentPageObj().find("[mod='inforMaintence_pop']");
//			inforMaintenace_seleDataPop(inforMaintence_pop,$tab2_input,"00");
//		});
		
		//输入内容选择新增按钮
		currTab.find("#out_selectData").click(function(){
			var $tab2_input = getCurrentPageObj().find("#OutputContentTable");
			var inforMaintence_pop = getCurrentPageObj().find("[mod='seleInterPop']");
			changeInforMaintenace_seleDataPop(inforMaintence_pop,"OutputContentTable","01","outputData_from");
		});
		//输出内容选择新增按钮
//		$tab2.find("[btn='return_selectData']").click(function(){
//			var inforMaintence_pop = getCurrentPageObj().find("[mod='inforMaintence_pop']");
//			inforMaintenace_seleDataPop(inforMaintence_pop,$tab2_return,"01");//01输出
//		});
		//保存按钮
		$tab2.find("[btn='tab2_save']").click(function(){
			if(!vlidate($tab2,"",true)){
				alert("请填写相关必填项");
				return ;
			}
			if(!vlidate(getCurrentPageObj().find("#inputData_from")) || !vlidate(getCurrentPageObj().find("#outputData_from")) ){
				alert("请填写相关必填项");
				return ;
			}
			var dataArr = new Array();
			var param = {};
			//输入
			var sendTaskData = currTab.find("#InputContentTable").bootstrapTable('getData');
			if(sendTaskData.length==0){
				alert("请填写输入内容");
				return ;
			}
			var inputData_from = currTab.find("#inputData_from");
			$.each(sendTaskData, function(j) {
				sendTaskData[j].DATA_TYPE = currTab.find("#data_type"+j).val();
				sendTaskData[j].IS_NECESSARY = currTab.find("#is_necessary"+j).val();
				sendTaskData[j].DATA_CHNNAME = currTab.find("#data_chnname"+j).val();
				sendTaskData[j].DATA_ENGNAME = currTab.find("#data_engname"+j).val();
				sendTaskData[j].DATA_ENGNAMEA = inputData_from.find("#data_engnamea"+j).val()== undefined?"":inputData_from.find("#data_engnamea"+j).val();
				sendTaskData[j].DATA_ENGNAMEB = inputData_from.find("#data_engnameb"+j).val()== undefined?"":inputData_from.find("#data_engnameb"+j).val();
				sendTaskData[j].MSG_LENGTH = currTab.find("#msg_length"+j).val();
				sendTaskData[j].STANDARD_CODE = inputData_from.find("#standard_code"+j).val()== undefined?"":inputData_from.find("#standard_code"+j).val();
				sendTaskData[j].DATA_INSTRUCTION = inputData_from.find("#data_instruction"+j).val()== undefined?"":inputData_from.find("#data_instruction"+j).val();
				sendTaskData[j].INFO_REMARK = inputData_from.find("#info_remark"+j).val()== undefined?"":inputData_from.find("#info_remark"+j).val();
				sendTaskData[j].WAY_TYPE = '00';
				dataArr.push(JSON.stringify(sendTaskData[j]));
			});
			//param["InputContentData"] = JSON.stringify(sendTaskData);
			//输出
			var sendOutputData = currTab.find("#OutputContentTable").bootstrapTable('getData');
			if(sendOutputData.length>0){
				var outputData_from = currTab.find("#outputData_from");
				$.each(sendOutputData, function(j) {
					sendOutputData[j].DATA_TYPE = currTab.find("#data_type_"+j).val();
					sendOutputData[j].IS_NECESSARY = currTab.find("#is_necessary_"+j).val();
					sendOutputData[j].DATA_CHNNAME = currTab.find("#data_chnname_"+j).val();
					sendOutputData[j].DATA_ENGNAME = currTab.find("#data_engname_"+j).val();
					sendOutputData[j].DATA_ENGNAMEA = outputData_from.find("#data_engnamea_"+j).val()== undefined?"":outputData_from.find("#data_engnamea_"+j).val();
					sendOutputData[j].DATA_ENGNAMEB = outputData_from.find("#data_engnameb_"+j).val()== undefined?"":outputData_from.find("#data_engnameb_"+j).val();
					sendOutputData[j].MSG_LENGTH = currTab.find("#msg_length_"+j).val();
					sendOutputData[j].STANDARD_CODE = outputData_from.find("#standard_code_"+j).val()== undefined?"":outputData_from.find("#standard_code_"+j).val();
					sendOutputData[j].DATA_INSTRUCTION = outputData_from.find("#data_instruction_"+j).val()== undefined?"":outputData_from.find("#data_instruction_"+j).val();
					sendOutputData[j].INFO_REMARK = outputData_from.find("#info_remark_"+j).val()== undefined?"":outputData_from.find("#info_remark_"+j).val();
					sendOutputData[j].WAY_TYPE = '01';
					dataArr.push(JSON.stringify(sendOutputData[j]));
				});
			}
//			var dataArr = new Array();
//			$tab2.find("[name='dataInfoList']").each(//获取每条数据的所有值
//					function() {
//						var dataParams = {};
//						var datas = $(this).find("[name^='D.']");
//						for (var i = 0; i < datas.length; i++) {
//							var obj = $(datas[i]);
//							dataParams[obj.attr("name").substr(2)] = obj.val();
//						}
//						dataArr.push(JSON.stringify(dataParams));
//					}
//			);
			
			
//			var sCall = getMillisecond();
//	        baseAjaxJsonp(dev_application+"InterInfoRepair/saveData.asp?SID=" + SID + "&call=" + sCall,
//	        		{dataArr:dataArr,
//		        	inter_id : params.INTER_ID,
//		        	inter_version : params.INTER_VERSION},
//	        		function(data) {
//		        		if (data != undefined&&data!=null&&data.result=="true") {
//		    				alert("保存成功！",function(){
//		    					closeCurrPageTab();
//		    				});
//		    			} else {
//		    				alert("保存失败！");
//		    			}
//			},sCall,false);
			
			baseAjax(dev_application+"InterInfoRepair/saveData.asp?SID=" + SID,
					{dataArr:dataArr,
	        			inter_id : params.INTER_ID,
	        			inter_version : params.INTER_VERSION}, function(data){
				if (data != undefined&&data!=null&&data.result=="true") {
					alert("保存成功！",function(){
						closeCurrPageTab();
					});
				} else {
					alert("保存失败！");
				}
			});	
		});
		
		//初始化报文信息表
		function initDataTable(inter_id,inter_version){
			
			var queryInput_call = getMillisecond()+'input';
			getCurrentPageObj().find("#InputContentTable").bootstrapTable({
				//请求后台的URL（*）
				url :dev_application+'InterInfoRepair/initData.asp?call='+queryInput_call+'&SID='+SID+'&inter_id='+inter_id+'&inter_version='+inter_version+'&way_type=00',
				method : 'get', //请求方式（*）   
				striped : true, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
			//	queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "DATA_ID", //每一行的唯一标识，一般为主键列
				jsonpCallback:queryInput_call,
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				onLoadSuccess:function(data){
					//gaveInfo();
					baseAjax("SDic/findItemByDic.asp",{dic_code:"I_DIC_INTER_DATA_TYPE"},function(data){
						if(data!=undefined){
							dic_data_I_DIC_INTER_DATA_TYPE = data;
						}
					}, false);
					baseAjax("SDic/findItemByDic.asp",{dic_code:"S_DIC_YN"},function(data){
						if(data!=undefined){
							dic_data_S_DIC_YN = data;
						}
					},false);
					
					//初始化字典项
					if(data.rows) {
						for(var i=0; i<data.rows.length; i++) {
							initSelectByData(getCurrentPageObj().find("#data_type"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_I_DIC_INTER_DATA_TYPE,data.rows[i].DATA_TYPE);
							initSelectByData(getCurrentPageObj().find("#is_necessary"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_S_DIC_YN,data.rows[i].IS_NECESSARY);
						}						
					}
					initVlidate(getCurrentPageObj().find("#inputData_from"));
				},
				columns : [ {
					field : 'Number',
					title : '序号',
					align : "center",
					width : "7%",
					sortable: true,
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : "DATA_CHNNAME",
					title : "字段名(中文)",
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="readonly";
						}
						var str = '<input type="text" '+disabled+' id="data_chnname'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项">';
						return str;
					}
				}, {
					field : "DATA_ENGNAME",
					title : "1级字段名(英文)",
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						var str = '<input type="text" '+disabled+' id="data_engname'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项" >';
						return str;
					}
				}, {
					field : "DATA_ENGNAMEA",
					title : "2级字段名(英文)",
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						if(value == undefined){value = '';}
						var str = '<input type="text" '+disabled+' id="data_engnamea'+index+'" value="'+value+'" >';
						return str;
					}
				}, {
					field : "DATA_ENGNAMEB",
					title : "3级字段名(英文)",
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						if(value == undefined){value = '';}
						var str = '<input type="text" '+disabled+' id="data_engnameb'+index+'" value="'+value+'"  >';
						return str;
					}
				}, {
					field : 'DATA_TYPE',
					title : '类型',
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						var str = '<select id="data_type'+index+'" validate="v.required" '+disabled+' valititle="该项为必填项"></select>';
						return str;
					}
				}, {
					field : "MSG_LENGTH",
					title : "长度",
					align : "center",
					width : "100",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						var str = '<input type="text" '+disabled+' id="msg_length'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项">';
						return str;
					}
				},{
					field : "IS_NECESSARY",
					title : "是否必输",
					align : "center",
					width : "100",
					formatter:function(value, row, index) {
						var str = '<select id="is_necessary'+index+'" validate="v.required" valititle="该项为必填项"></select>';
						return str;
					}
				}, {
					field : "STANDARD_CODE",
					title : "标准代码",
					align : "center",
					width : "100",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						var str = "";
						if(value==undefined){
							str = '<input type="text" '+disabled+' id="standard_code'+index+'" value="" >';
						}else{
							str = '<input type="text" '+disabled+' id="standard_code'+index+'" value="'+value+'" >';
						}
						return str;
					}
				},{
					field : "DATA_INSTRUCTION",
					title : "内容说明",
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						var str = "";
						if(value==undefined){
							str = '<input type="text" '+disabled+' id="data_instruction'+index+'" value="" ';
						}else{
							str = '<input type="text" '+disabled+' id="data_instruction'+index+'" value="'+value+'" ';
						}
						return str;
					}
				},{
					field : "INFO_REMARK",
					title : "备注",
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var str = "";
						if(value==undefined){
							str = '<input type="text" id="info_remark'+index+'" value="" >';
						}else{
							str = '<input type="text" id="info_remark'+index+'" value="'+value+'" >';
						}
						return str;
					}
				},{
					field : "DATA_ID",
					title : "操作",
					align : "center",
					width : "100",
					formatter:function(value, row, index) {
						var edit="<span class='hover-view'"+
						"onclick='delInputData(\""+row.DATA_ID+"\");'>删除</span>";
						 return edit; 
					}
				}]
			});
			
			
			var queryOutput_call = getMillisecond()+'output';
			getCurrentPageObj().find("#OutputContentTable").bootstrapTable({
				//请求后台的URL（*）
				url :dev_application+'InterInfoRepair/initData.asp?call='+queryOutput_call+'&SID='+SID+'&inter_id='+inter_id+'&inter_version='+inter_version+'&way_type=01',
				method : 'get', //请求方式（*）   
				striped : true, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
			//	queryParams : queryOutParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
//				pagination : true, //是否显示分页（*）
//				pageList : [100,200],//每页的记录行数（*）
//				pageNumber : 1, //初始化加载第一页，默认第一页
//				pageSize : 100,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "DATA_ID", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				jsonpCallback:queryOutput_call,
				detailView : false, //是否显示父子表
				singleSelect: true,
				onLoadSuccess:function(data){
					//gaveInfo();	
					baseAjax("SDic/findItemByDic.asp",{dic_code:"I_DIC_INTER_DATA_TYPE"},function(data){
						if(data!=undefined){
							dic_data_I_DIC_INTER_DATA_TYPE = data;
						}
					}, false);
					baseAjax("SDic/findItemByDic.asp",{dic_code:"S_DIC_YN"},function(data){
						if(data!=undefined){
							dic_data_S_DIC_YN = data;
						}
					},false);
					//初始化字典项
					if(data.rows) {
						for(var i=0; i<data.rows.length; i++) {
							initSelectByData(getCurrentPageObj().find("#data_type_"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_I_DIC_INTER_DATA_TYPE,data.rows[i].DATA_TYPE);
							initSelectByData(getCurrentPageObj().find("#is_necessary_"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_S_DIC_YN,data.rows[i].IS_NECESSARY);
						}						
					}
					initVlidate(getCurrentPageObj().find("#outputData_from"));
				},
				columns : [ {
					field : 'Number',
					title : '序号',
					align : "center",
					sortable: true,
					width : "7%",
					formatter: function (value, row, index) {
						return index+1;
					}
				},{
					field : "DATA_CHNNAME",
					title : "字段名(中文)",
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						var str = '<input type="text" '+disabled+' id="data_chnname_'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项">';
						return str;
					}
				}, {
					field : "DATA_ENGNAME",
					title : "1级字段名(英文)",
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						var str = '<input type="text" '+disabled+' id="data_engname_'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项" >';
						return str;
					}
				}, {
					field : "DATA_ENGNAMEA",
					title : "2级字段名(英文)",
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						if(value == undefined){value = '';}
						var str = '<input type="text" '+disabled+' id="data_engnamea_'+index+'" value="'+value+'"  >';
						return str;
					}
				}, {
					field : "DATA_ENGNAMEB",
					title : "3级字段名(英文)",
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						if(value == undefined){value = '';}
						var str = '<input type="text" '+disabled+' id="data_engnameb_'+index+'" value="'+value+'" >';
						return str;
					}
				}, {
					field : 'DATA_TYPE',
					title : '类型',
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						var str = '<select id="data_type_'+index+'" validate="v.required" '+disabled+' valititle="该项为必填项"></select>';
						return str;
					}
				}, {
					field : "MSG_LENGTH",
					title : "长度",
					align : "center",
					width : "100",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						var str = '<input type="text" '+disabled+' id="msg_length_'+index+'" value="'+value+'" validate="v.required" valititle="该项为必填项">';
						return str;
					}
				},{
					field : "IS_NECESSARY",
					title : "是否必输",
					width : "100",
					formatter:function(value, row, index) {
						var str = '<select id="is_necessary_'+index+'" validate="v.required" valititle="该项为必填项"></select>';
						return str;
					}
				}, {
					field : "STANDARD_CODE",
					title : "标准代码",
					align : "center",
					width : "100",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						var str = "";
						if(value==undefined){
							str = '<input type="text" '+disabled+' id="standard_code_'+index+'" value="" >';
						}else{
							str = '<input type="text" '+disabled+' id="standard_code_'+index+'" value="'+value+'" >';
						}
						return str;
					}
				},{
					field : "DATA_INSTRUCTION",
					title : "内容说明",
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var IS_STANDARD = row.IS_STANDARD;
						var disabled="";
						if(IS_STANDARD=='00'){
							disabled="disabled";
						}
						var str = "";
						if(value==undefined){
							str = '<input type="text" '+disabled+' id="data_instruction_'+index+'" value="" ';
						}else{
							str = '<input type="text" '+disabled+' id="data_instruction_'+index+'" value="'+value+'" ';
						}
						return str;
					}
				},{
					field : "INFO_REMARK",
					title : "备注",
					align : "center",
					width : "120",
					formatter:function(value, row, index) {
						var str = "";
						if(value==undefined){
							str = '<input type="text" id="info_remark_'+index+'" value="" >';
						}else{
							str = '<input type="text" id="info_remark_'+index+'" value="'+value+'" >';
						}
						return str;
					}
				},{
					field : "DATA_ID",
					title : "操作",
					align : "center",
					width : "100",
					formatter:function(value, row, index) {
						var edit="<span class='hover-view'"+
						"onclick='delOutputData(\""+row.DATA_ID+"\");'>删除</span>";
						 return edit; 
					}
				}]
			});

		};
		
		
		
		
		
		
		//初始化文件
		function initFtpModal(params){
			//点击打开模态框
			var tablefile = $tab2.find("#filetable");
			var addfile = $tab2.find("#add_file");
			var business_code = params.FILE_ID;
			addfile.click(function(){
				var paramObj = new Object();
				paramObj["SYSTEM_NAME"] = getCurrentPageObj().find("#tab1_inforMaintenace_detail").find("input[name='RI.ser_system_name']").val();
				paramObj["INTER_CODE"] = getCurrentPageObj().find("input[name='RI.inter_code']").val();
				openFileFtpUpload(getCurrentPageObj().find("#add_modalfile"), tablefile, 'GZ1070',business_code, '00', 'S_DIC_INTER_DESIGN_FILE', false,false, paramObj);
			});
			//附件删除
			var delete_file = $tab2.find("#delete_file"); 
			delete_file.click(function(){
				delFtpFile(tablefile, business_code, "00");
			});
			getFtpFileList(tablefile, getCurrentPageObj().find("#add_fileview_modal"), business_code, "00");
		}
	}
	
	//初始化tab3方法
	function initInterInfoRepair_tab3(params){
		var $tab3 = getCurrentPageObj().find("#tab3_inforMaintenace_detail");
		for(var k in params){//初始化基本信息
			k1 = k.toLowerCase();
			$tab3.find("[name='D."+ k1 +"']").html(params[k]);
		}
		var reCall = getMillisecond();
		initUseRelation(params.INTER_ID);//初始化调用关系表
		//新增
		$tab3.find("[btn='tab3_add']").click(function(){
			var modObj3 = getCurrentPageObj().find("[mod='consumerApp_pop']");
			openConsumerAppPop(modObj3,{inter_id : params.INTER_ID,call : reCall,inter_version : params.INTER_VERSION});
		});
		//修改
		$tab3.find("[btn='tab3_update']").click(function(){
			var modObj3 = getCurrentPageObj().find("[mod='consumerApp_pop']");
			var selections = $tab3.find("[tb='tab3_relation']").bootstrapTable('getSelections');
			if(selections.length != 1) {
				alert("请选择一条数据进行操作!");
			}
			var selesInfo = JSON.stringify(selections);
			var seleParams = JSON.parse(selesInfo);
			seleParams[0]["inter_id"] = params.INTER_ID;
			seleParams[0]["call"] = reCall;
			openConsumerAppPop(modObj3,seleParams[0]);
		});
		//删除
		$tab3.find("[btn='tab3_delete']").click(function(){
			var selections = $tab3.find("[tb='tab3_relation']").bootstrapTable('getSelections');
			if(selections.length < 1) {
				alert("请选择一条数据进行操作!");
				return;
			}
			var sCall = getMillisecond();
			baseAjaxJsonp(dev_application+"InterInfoRepair/deleteConsumerApp.asp?SID=" + SID + "&call=" + sCall, {invok_id:selections[0].INVOK_ID,inter_id : params.INTER_ID}, function(data) {
				alert(data.msg);
				if(data.result=="true"){
					var url = dev_application+'InterQuery/interUseRelationQuery.asp?SID='+SID+'&call='+reCall+'&inter360_id='+params.INTER_ID;
					getCurrentPageObj().find("[tb='tab3_relation']").bootstrapTable('refresh',{
						url:url});
				}
			},sCall,false);
		});
		
		//初始化接口调用关系表
		function initUseRelation(inter_id) {
			var queryParams = function(params) {
				var temp = {
					limit : params.limit, // 页面大小
					offset : params.offset
				};
				return temp;
			};
			$tab3.find("[tb='tab3_relation']").bootstrapTable({
				url : dev_application+'InterQuery/interUseRelationQuery.asp?SID='+SID+'&call='+reCall+'&inter360_id='+inter_id,
				method : 'get', //请求方式（*）
				dataType:'jsonp',
				striped : false, //是否显示行间隔色
				cache : false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				sortable : true, //是否启用排序
				sortOrder : "asc", //排序方式
				queryParams : queryParams,//传递参数（*）
				sidePagination : "server", //分页方式：client客户端分页，server服务端分页（*）
				pagination : true, //是否显示分页（*）
				pageList : [10,15],//每页的记录行数（*）
				pageNumber : 1, //初始化加载第一页，默认第一页
				pageSize : 10,//可供选择的每页的行数（*）
				clickToSelect : true, //是否启用点击选中行
				uniqueId : "con_system_id", //每一行的唯一标识，一般为主键列
				cardView : false, //是否显示详细视图
				detailView : false, //是否显示父子表
				singleSelect: true,
				jsonpCallback : reCall,
				onLoadSuccess : function(data){
						gaveInfo();
					//初始化调用数
					getCurrentPageObj().find("[name='D.get_count']").html(data.total);
				},
				columns : [{
					field: 'middle',
					checkbox: true,
					rowspan: 2,
					align: 'center',
					valign: 'middle',
					width : "20"
				},{
					field: 'sort',
					title : '序号',
					align : "center",
					sortable: false,
					formatter: function (value, row, index) {
						return index+1;
					},
					width : "10%",
				},{
					field : 'CON_SYSTEM_ID',
					title : '消费方应用编号',
					align : 'center'
				}
				,{
					field : 'SYSTEM_NAME',
					title : '消费方应用名称',
					align : 'center'
				},{
					field : 'START_TIME',
					title : '开始日期',
					align : "center"
				}, {
					field : "FILE_ID",
					title : "接口调用说明",
					align : "center",
					formatter:function(value, row, index){
						var str = "<div name='file_info_div' style='margin: 0 auto 10px 0' bid='"+value+"' index='"+index+"'>";
						str += "<a name='inter_use_file_upload'>上传</a>" + 
						"<a name='inter_use_file_detail' style='margin-left:10px;display:none;'>查看</a>" +
						"<a name='inter_use_file_download' style='margin-left:10px;display:none;'>下载</a>";
						str +="<div/>";
						return str;
					}
				}],
				onPostBody:function(){
					fileData = getInterFileList();
					initFileUploadAction();
				}
			});
			
			var fileData = null;
			
			var upload_div = getCurrentPageObj().find("#add_modalfile");
			var file_view_div = getCurrentPageObj().find("#add_fileview_modal");
			var system_name = getCurrentPageObj().find("a[name='RI.ser_system_name']").val();
			function initFileUploadAction(){
				var $details = $tab3.find("[tb='tab3_relation']").find("a[name=inter_use_file_detail]");
				var $uploads = $tab3.find("[tb='tab3_relation']").find("a[name=inter_use_file_upload]");
				var $downloads = $tab3.find("[tb='tab3_relation']").find("a[name=inter_use_file_download]");
				
				
				for(var i=0; i<$details.length; i++){
					var $detail =  $($details[i]);
					var $div = $($detail.parent());
					if(typeof($div.attr("file_id"))!="undefined"){
						$detail.show();
						$($downloads[i]).show();
					}
				}
				
				//初始化上传按钮
				$uploads.unbind('click').click(function(){
					var $div = $(this).parent();
					var business_code = $div.attr("bid");
					var paramObj = new Object();
					paramObj["SYSTEM_NAME"] = system_name;
					
					paramObj["afterUpload"] = function(){
						//删除原有文件
						var old_file = $div.attr("file_id");
						if(typeof(old_file)!="undefined"){
							deleteFTPFileById(old_file);
						}
						$div.find("a[name=inter_use_file_detail]").show();
						$div.find("a[name=inter_use_file_download]").show();
						//重新绑定文件id到相应的
						fileData = getInterFileList();
					};
					openFileFtpUpload(upload_div, null, "GZ1071", business_code, '00', 'S_DIC_INTER_SER_DESIGN_FILE', false, false, paramObj);
				});
				
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
				var affectTableData = $tab3.find("[tb='tab3_relation']").bootstrapTable('getData');
				var businessArr = $.map(affectTableData, function(row) {
					return row.FILE_ID;
				});
				if(businessArr.length>0){
					var fileData = getFtpFileListByBc(businessArr, "00");
					if(fileData.length>0){
						for(var k in fileData){
							var file = fileData[k];
							var $div = getCurrentPageObj().find("table[tb=tab3_relation]").find("div[bid="+file.BUSINESS_CODE+"]");
							$div.attr("file_id", file.ID);
						}
					}
					return fileData;
				}
				return null;
			}
		}
	}
}


/***************************新增****************************/
//删除一行
function delOutputData(data_id){
	deleteData('OutputContentTable','outputData_from','_',data_id);
}
function delInputData(data_id){
	 deleteData('InputContentTable','inputData_from','',data_id);
}
function deleteData(tableId,vlidateId,v_,data_id){
	
	//添加报文输出信息
	var currTab = getCurrentPageObj();
		var sendData = currTab.find("#"+tableId).bootstrapTable('getData');
		var i = v_+sendData.length;
		$.each(sendData, function(j) {
			sendData[j].DATA_TYPE = currTab.find("#data_type"+v_+j).val();
			sendData[j].IS_NECESSARY = currTab.find("#is_necessary"+v_+j).val();
			sendData[j].DATA_CHNNAME = currTab.find("#data_chnname"+v_+j).val();
			sendData[j].DATA_ENGNAME = currTab.find("#data_engname"+v_+j).val();
			sendData[j].DATA_ENGNAMEA = currTab.find("#data_engnamea"+v_+j).val();
			sendData[j].DATA_ENGNAMEB = currTab.find("#data_engnameb"+v_+j).val();
			sendData[j].MSG_LENGTH = currTab.find("#msg_length"+v_+j).val();
			sendData[j].STANDARD_CODE = currTab.find("#standard_code"+v_+j).val();
			sendData[j].DATA_INSTRUCTION = currTab.find("#data_instruction"+v_+j).val();
			sendData[j].INFO_REMARK = currTab.find("#info_remark"+v_+j).val();
		});
		
		getCurrentPageObj().find("#"+tableId).bootstrapTable("removeByUniqueId", data_id);	
		
		
		//旧的行，把原来的放进去
		for(var k=0; k<sendData.length; k++) {
			initSelectByData(currTab.find("#data_type"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_I_DIC_INTER_DATA_TYPE,sendData[k]['DATA_TYPE']);
			initSelectByData(currTab.find("#is_necessary"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_S_DIC_YN,sendData[k]['IS_NECESSARY']);
			currTab.find("#data_type"+v_+k).val(sendData[k].DATA_TYPE);
			currTab.find("#is_necessary"+v_+k).val(sendData[k].IS_NECESSARY);
			currTab.find("#data_chnname"+v_+k).val(sendData[k].DATA_CHNNAME);
			currTab.find("#data_engname"+v_+k).val(sendData[k].DATA_ENGNAME);
			currTab.find("#data_engnamea"+v_+k).val(sendData[k].DATA_ENGNAMEA);
			currTab.find("#data_engnameb"+v_+k).val(sendData[k].DATA_ENGNAMEB);
			currTab.find("#msg_length"+v_+k).val(sendData[k].MSG_LENGTH);
			currTab.find("#standard_code"+v_+k).val(sendData[k].STANDARD_CODE);
			currTab.find("#data_instruction"+v_+k).val(sendData[k].DATA_INSTRUCTION);
			currTab.find("#info_remark"+v_+k).val(sendData[k].INFO_REMARK);
		}
		initVlidate($("#"+vlidateId));
	
}

//添加报文信息
function addContent(tableId,vlidateId,v_,row){
	//添加报文输出信息
	var currTab = getCurrentPageObj();
		var sendData = currTab.find("#"+tableId).bootstrapTable('getData');
		var item = {};
		if(row!=undefined&&row!=""&&row!="undefined") {
			item = row;
			item['IS_NECESSARY'] = "";
		}else{
			item['DATA_ID'] = getMillisecond();
			item['DATA_CHNNAME'] = "";
			item['DATA_ENGNAME'] = "";
			item['DATA_ENGNAMEA'] = "";
			item['DATA_ENGNAMEB'] = "";
			item['DATA_TYPE'] = "";
			item['MSG_LENGTH'] = "";
			item['IS_NECESSARY'] = "01";
			item['STANDARD_CODE'] = "";
			item['DATA_INSTRUCTION'] = "";
			item['INFO_REMARK'] = "";
			item['IS_STANDARD'] = "01";
		}
		var i = v_+sendData.length;
		$.each(sendData, function(j) {
			sendData[j].DATA_TYPE = currTab.find("#data_type"+v_+j).val();
			sendData[j].IS_NECESSARY = currTab.find("#is_necessary"+v_+j).val();
			sendData[j].DATA_CHNNAME = currTab.find("#data_chnname"+v_+j).val();
			sendData[j].DATA_ENGNAME = currTab.find("#data_engname"+v_+j).val();
			sendData[j].DATA_ENGNAMEA = currTab.find("#data_engnamea"+v_+j).val();
			sendData[j].DATA_ENGNAMEB = currTab.find("#data_engnameb"+v_+j).val();
			sendData[j].MSG_LENGTH = currTab.find("#msg_length"+v_+j).val();
			sendData[j].STANDARD_CODE = currTab.find("#standard_code"+v_+j).val();
			sendData[j].DATA_INSTRUCTION = currTab.find("#data_instruction"+v_+j).val();
			sendData[j].INFO_REMARK = currTab.find("#info_remark"+v_+j).val();
		});
		currTab.find("#"+tableId).bootstrapTable("append",item);
		initSelect(currTab.find("#data_type"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"},item['DATA_TYPE']);
		initSelect(currTab.find("#is_necessary"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},item['IS_NECESSARY']);

		//旧的行，把原来的放进去
		for(var k=0; k<sendData.length; k++) {
			
			initSelect(currTab.find("#data_type"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_DATA_TYPE"},sendData[k].DATA_TYPE);
			initSelect(currTab.find("#is_necessary"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},sendData[k].IS_NECESSARY);
		}
		initVlidate($("#"+vlidateId));
	
}

//导入报文输入内容
function importInput2(fileId){

	var text = getCurrentPageObj().find('#inputfield').val();
	if(text==""){
		alert("请上传文件");
		return;
	}

	startLoading();
	 $.ajaxFileUpload({
		    url:"messimport/importPhaseFile.asp?SID="+SID,
		    type:"post",
			secureuri:false,
			fileElementId:fileId,
			data:'',
			dataType:"json",
			success:function (msg){
				endLoading();
				getCurrentPageObj().find("#"+fileId).val("");
				getCurrentPageObj().find("#supplierfield").val("");
				$("#input_import2").modal("hide");
				if(msg&&msg.result=="true"){
					 if(msg.inlist != null && msg.inlist != undefined){//输入
						 addContents('InputContentTable','inputData_from','',msg.inlist);
					 }
					 if(msg.outlist != null && msg.outlist != undefined){//输出
						 addContents('OutputContentTable','outputData_from','_',msg.outlist);
					 }
					 alert("导入成功！");
				}else if(msg&&msg.result=="false"){
					alert(msg.msg);
				}else{
					alert("读取文件失败！");
				}

			},
			error: function (msg){
				endLoading();
				alert("导入失败！");
			}
	   });
}

//添加报文信息
function addContents(tableId,vlidateId,v_,rows){
	//添加报文输出信息
		var currTab = getCurrentPageObj();
		var sendData = currTab.find("#"+tableId).bootstrapTable('getData');
		var n = sendData.length;
		
		$.each(sendData, function(j) {
			sendData[j].DATA_TYPE = currTab.find("#data_type"+v_+j).val();
			sendData[j].IS_NECESSARY = currTab.find("#is_necessary"+v_+j).val();
			sendData[j].DATA_CHNNAME = currTab.find("#data_chnname"+v_+j).val();
			sendData[j].DATA_ENGNAME = currTab.find("#data_engname"+v_+j).val();
			sendData[j].DATA_ENGNAMEA = currTab.find("#data_engnamea"+v_+j).val();
			sendData[j].DATA_ENGNAMEB = currTab.find("#data_engnameb"+v_+j).val();
			sendData[j].MSG_LENGTH = currTab.find("#msg_length"+v_+j).val();
			sendData[j].STANDARD_CODE = currTab.find("#standard_code"+v_+j).val();
			sendData[j].DATA_INSTRUCTION = currTab.find("#data_instruction"+v_+j).val();
			sendData[j].INFO_REMARK = currTab.find("#info_remark"+v_+j).val();
		});
	
		for(var i=0;i<rows.length;i++){
			var m = n + i;

			rows[i]['DATA_CHNNAME'];
			rows[i]['DATA_ID'] = getMillisecond()+""+i;
			rows[i]['IS_STANDARD'] = "01";
			var data_type = rows[i]['DATA_TYPE'];
			if(data_type == 'varchar2'){
				rows[i]['DATA_TYPE'] = '00';
			}else if(data_type == 'number'){
				rows[i]['DATA_TYPE'] = '01';
			}else if(data_type == 'char'){
				rows[i]['DATA_TYPE'] = '02';
			};
			var is_necessary = rows[i]['IS_NECESSARY'];
			if(is_necessary == '是'){
				 rows[i]['IS_NECESSARY'] = '00';
			}else if(is_necessary == '否'){
				 rows[i]['IS_NECESSARY'] = '01';
			};
			
			currTab.find("#"+tableId).bootstrapTable("append",rows[i]);
		}
		
		
		for(var i=0;i<rows.length;i++){
			var m = n + i;
			m = v_+m;
			initSelectByData(currTab.find("#data_type"+m),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_I_DIC_INTER_DATA_TYPE,rows[i]['DATA_TYPE']);
			initSelectByData(currTab.find("#is_necessary"+m),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_S_DIC_YN,rows[i]['IS_NECESSARY']);
		}

		//旧的行，把原来的放进去
		for(var k=0; k<sendData.length; k++) {
//			
			initSelectByData(currTab.find("#data_type"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_I_DIC_INTER_DATA_TYPE,sendData[k]['DATA_TYPE']);
			initSelectByData(currTab.find("#is_necessary"+v_+k),{value:"ITEM_CODE",text:"ITEM_NAME"},dic_data_S_DIC_YN,sendData[k]['IS_NECESSARY']);

		}
		initVlidate($("#"+vlidateId));
		
	
}

