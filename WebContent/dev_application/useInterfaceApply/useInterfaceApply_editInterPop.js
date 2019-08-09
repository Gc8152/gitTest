function userInterfaceApply_editInterPop(obj,params){
	$("#userInterfaceApply_editInterPop").remove();
	//加载pop框内容
	obj.load("dev_application/useInterfaceApply/useInterfaceApply_editInterPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#userInterfaceApply_editInterPop");
		modObj.modal("show");
		initVlidate(modObj);//渲染必填项
		initSelect(modObj.find("[name='PIU.inter_office_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_OFFICE_TYPE"},null, null);
		if(params){
			for(var k in params){//初始化基本信息
				k1 = k.toLowerCase();
				modObj.find("[name='PIU."+ k1 +"']").val(params[k]);
				if(k1 == "inter_office_type"){
					var $select = modObj.find("[name='PIU."+ k1 +"']");
					initSelect($select,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"I_DIC_INTER_OFFICE_TYPE"},params[k], null);
				}
			}
		}
		//initAttrTable(modObj,params.APP_ID);//初始化属性table
		if(use_InterfaceApply_opt=="view"){//查看模式时不可编辑
			modObj.find("input,select,textarea").not("[name='editInterPop_close']").attr("disabled","disabled");
			modObj.find("[btn='save_editInterPop']").hide();
		}
		//保存按钮
		modObj.find("[btn='save_editInterPop']").unbind();
		modObj.find("[btn='save_editInterPop']").click(function(){
			if(!vlidate(modObj,"",true)){
				alert("缺少必填项");
				return ;
			}
			var aaa=getCurrentPageObj().find("[name='PIU.inter_descr']").val();
		    if(aaa.length>80){
		    	alert("接口描述至多可输入80汉字！");
		    	return;
		    }
		    var bbb=getCurrentPageObj().find("[name='PIU.input_msg']").val();
		    if(bbb.length>80){
		    	alert("输入信息至多可输入80汉字！");
		    	return;
		    }
		    var ccc=getCurrentPageObj().find("[name='PIU.return_msg']").val();
		    if(ccc.length>80){
		    	alert("返回信息至多可输入80汉字！");
		    	return;
		    }
			
			var params = getPageParam("PIU");//获取基本信息
			params["record_app_num"] = getCurrentPageObj().find("[name='IU.record_app_num']").val();
			var $attrTable = modObj.find("table[tb=attrTable] tbody");
			/*var attrInfoArr = new Array();
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
			params["attrInfoArr"] = attrInfoArr;*/
			params["app_type"] = "00";//新建类型
			params["file_id"] = Math.uuid();
			var sCall = getMillisecond();
			//保存接口信息
			baseAjaxJsonp(dev_application+"useApplyManage/saveInterInfo.asp?SID=" + SID + "&call=" + sCall, params, function(data) {
				alert(data.msg);
				if(data && data.result=="true"){
					modObj.modal("hide");
					//刷新接口申请列表
					getCurrentPageObj().find('[tb="appListTable"]').bootstrapTable('refresh',{
						url:dev_application+"useApplyManage/queryInterAppListById.asp?SID=" + SID + "&call=" + use_InterfaceApply_editCall + "&record_app_num=" + getCurrentPageObj().find("[name='IU.record_app_num']").val()});
				}
				
			},sCall,false);
		});
	});
	
	//初始化属性table
	/*function initAttrTable(modObj,app_id){
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
	}*/
	
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
			str += "<td name='attrInfoList'><input style='width:100%' attr_type='input' "+is_necessary+" type='text' maxlength='"+item.MAX_LONG+"' attr_id='" + item.ATTR_ID + "' value='"+item.DEFAULT_VALUE+"' /></td>";
		} else if(item.ATTR_TYPE=="01"){//01表示下拉单选
			str += "<td name='attrInfoList'><select style='width:100%' attr_type='select' "+is_necessary+" attr_id='" + item.ATTR_ID + "' diccode='"+item.DIC_INFO+"' value='"+item.DEFAULT_VALUE+"'></select></td>";
		} else if(item.ATTR_TYPE=="02"){//02表示下拉多选
			str += "<td name='attrInfoList'><select style='width:100%' attr_type='mul_select' "+is_necessary+" attr_id='" + item.ATTR_ID + "' diccode='"+item.DIC_INFO+"' multiple='multiple' value='"+item.DEFAULT_VALUE+"'></select></td>";
		} else if(item.ATTR_TYPE=="03"){//二选一
			str += "<td name='attrInfoList'><span style='width:100%' attr_type='radio' attr_id='" + item.ATTR_ID + "' radiocode='"+item.DIC_INFO+" 'value='"+item.DEFAULT_VALUE+"' class='citic-sele-ast'></span></td>";
		}
		return str;
	}
	
	//初始化字典项
	function autoInitSelectAndRadio(tableObj){
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
		if(use_InterfaceApply_opt=="view"){//查看模式时不可编辑
			tableObj.find("input,select,textarea").attr("disabled","disabled");
		}
		
	}
	
}	