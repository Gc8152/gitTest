function interReSignMsg(){
	var modObj = getCurrentPageObj();
	initVlidate(modObj);//渲染必填项
	autoInitSelect(modObj);//初始化下拉选	
	initAttrTable(modObj,"");//初始化属性table
	//服务方 pop框按钮
	modObj.find("[name='I.ser_system_name']").click(function(){
		var $id = modObj.find("[name='I.ser_system_id']");
		var $name = $(this);
		var systemPop = modObj.find("#systemPop");
		interInfoRepair_systemPop(systemPop, {id : $id, name : $name, type : "ser"});
	});	
	//保存按钮
	modObj.find("#save_InterReSign").unbind();
	modObj.find("#save_InterReSign").click(function(){
		if(!vlidate(modObj,"",true)){
			return ;
		}
		
		var aaa=getCurrentPageObj().find("[name='I.inter_descr']").val();
	    if(aaa.length>150){
	    	alert("接口描述至多可输入150汉字！");
	    	return;
	    }
		
//		var nowDate = new Date();//获取系统当前时间
		var params = getPageParam("I");//获取基本信息
		params["inter_version"] = "V1.0"; // 版本号默认 V1.0
		params["inter_status"] = "02"; //执行中
		params["is_additional"] = "00";	 //补登接口标识
		params["file_id"] = Math.uuid();
//		params["start_work_time"] = nowDate.toLocaleDateString(); //开始使用时间 默认当前系统时间
		var $attrTable = modObj.find("table[tb=attrTable] tbody");
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
		baseAjaxJsonp(dev_application+"InterInfoRepair/saveInterInfoMsg.asp?SID=" + SID + "&call=" + sCall, params, function(data) {
			alert(data.msg);
			if(data && data.result=="true"){
				params["inter_code"] = data.inter_code;
				params["INTER_ID"] = data.inter_id;
				params["INTER_VERSION"] = "V1.0"; // 版本号默认 V1.0
				params["FILE_ID"] = params["file_id"];
				closeAndOpenInnerPageTab("intiInterReCheck_in","修改接口信息","dev_application/interfaceManage/interInfoRepair/inforMaintenace_edit.html",function(){
					initInterInfoRepair(params);
				});
			}
			
		},sCall,false);		
	});
}

//初始化属性table
function initAttrTable(modObj,app_id){
	var rowCall = getMillisecond();
	baseAjaxJsonp(dev_application+"useApplyManage/initInterAttr.asp?SID=" + SID + "&call=" + rowCall, {app_id : app_id}, function(data) {
		if(data && data.attrRowList){
			//先动态生成表列内容
			var appendHtml = getTableBodyHtml(data.attrRowList);
			var table = modObj.find("table[tb=attrTable] tbody");
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
