initSelectVal();
initBTNEnvent();

$(function(){
	//初始化模板信息form表单
	initVlidate($("#add_projectModelForm"));
});
//下拉框方法
function initSelectVal(){
	//初始化模板状态数据
	initSelect($("#P_is_use"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_IS_USE"},"01");
}
//初始化页面按钮事件
function initBTNEnvent(){
	//新增模板属性配置
	$("#add_milestoneAttr").click(function(){
			var j = $("#milestoneAttrTab").find("tr").length;
			var tr = $("<tr class='projectModelAttrList'><td><select id='project_type_select"
			+ j
			+ "' name='project_type' onchange='changeProjectType(this)' style='width:100%;'></select></td>"
			+ "<td><select id='child_select"
			+ j
			+ "' name='child' onchange='changChild(this)' disabled=true style='width:100%;'></select></td>"
			+ "<td><input type='text' name='description'></td>"
			+ "<td><a onclick='deleteTR(this)'>删除</a></td></tr>");
			tr.appendTo($("#milestoneAttrTab"));
		$("#project_type_select" + j).select2();
		$("#child_select" + j).select2();
		//初始化项目类型数据
		initSelect($("#project_type_select"+j),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"});
	});
	
	//新增一条里程碑
	$("#add_milestoneInfo").click(function(){
		var j = $("#milestoneInfoTab").find("tr").length;
		while ($("#is_choice" + j).length > 0){ 
			j++; 
		};
		var tr = $("<tr class='milestoneAttrList'><td>" + j + "</td>"
		+"<td><input type='text' name='milestone_code'/></td>"
		+ "<td><input type='text' name='milestone_name'/></td>"
		+ "<td><select id='milestone_type" + j + "' name='milestone_type' style='width:100%;' onchange='isSameType("+j+");'></select></td>"
		+ "<td><select id='is_choice" + j + "' name='is_choice' style='width:100%;'></select></td>"
		+ "<td><select id='status" + j + "' name='status' style='width:100%;'></select></td>"
		+ "<td><input type='text' name='deliverable'/></td>"
		+ "<td><a name='file_id'>上传</a></td>"
		+ "<td><a onclick='deleteTR(this)'>删除</a>" +
		"<span onclick='upbtn(this)'>&nbsp;&nbsp;<a><i class='icon-arrow-up'></i></a></span>" +
		"<span onclick='downbtn(this)'>&nbsp;&nbsp;<a><i class='icon-arrow-down'></i></a></span></td></tr>");
		tr.appendTo($("#milestoneInfoTab"));
		$("#milestone_type" + j).select2();
		$("#is_choice" + j).select2();
		$("#status" + j).select2();
		initSelect($("#milestone_type"+j),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_OUTTER_TASK_TYPE"});
		initSelect($("#is_choice"+j),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"T_DIC_YN"},"00");
		initSelect($("#status"+j),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_IS_USE"},"01");
	});
	
	
	$("#saveModel").click(function(){
		if(!vlidate($("#add_projectModelForm"))){
			return ;
		}
		
		var aaa=getCurrentPageObj().find("#P_description").val();
	    if(aaa.length>200){
	    	alert("模板说明至多可输入200汉字！");
	    	return;
	    }
		
		var model_name = $("#P_model_name").val();
		var is_use = $("#P_is_use").val();
		var description = $("#P_description").val();
		
		var project_ModelArr = new Array();
		var flag = true;
		//操作类型，“1”表示删除所有的属性配置后保存；“2”表示添加模板属性配置
		var num = $(".projectModelAttrList").length;
		if(num > 0){
			$(".projectModelAttrList").each(function(){
				var project_typeVal = $(this).find("[name='project_type']").val();
				var childVal = $(this).find("[name='child']").val();
				var descriptionVal = $(this).find("[name='description']").val();
				project_ModelArr.push(project_typeVal + "&&" + childVal + "&&"  + descriptionVal);
				if(project_typeVal == " "){
					alert("请填写项目类型后，再保存！");
					flag = false;
					return false;
				}
				var IsChild = $(this).find("[name='child']").attr("disabled");
				if(!IsChild){
					if(childVal == " "){
						alert("请填写子分类后，再保存！");
						flag = false;
						return false;
					}
				}
			});
			if(flag==false){
				return ;
			}
		}
		var milestoneArr = new Array();
		var sort = 1;
		$(".milestoneAttrList").each(
				function() {
					var milestone_code = $(this).find(
							"[name='milestone_code']").val();
					var milestone_name = $(this).find(
							"[name='milestone_name']").val();
					var milestone_type = $(this).find(
							"[name='milestone_type']").val();
					var is_choice = $(this).find("[name='is_choice']")
							.val();
					var status = $(this).find("[name='status']").val();
					var deliverable = $(this).find(
							"[name='deliverable']").val();
					if(milestone_code == ""){
						alert("请填写里程碑编号！");
						flag = false;
						return false;
					}else if(milestone_name == ""){
						alert("请填写里程碑名称！");
						flag = false;
						return false;
					}else if(milestone_type == " "){
						alert("请选择里程碑类型！");
						flag = false;
						return false;
					}else if(is_choice == " "){
						alert("请填写是否为必选项！");
						flag = false;
						return false;
					}else if(status == " "){
						alert("请填写里程碑状态！");
						flag = false;
						return false;
					}
					milestoneArr.push(sort + "&&" + milestone_code
							+ "&&" + milestone_name + "&&"
							+ milestone_type + "&&" + is_choice + "&&"
							+ status + "&&" + deliverable);
					sort++;
				});
		if(flag){
			var model_id = $("#add_projectModelForm").attr("model_id");
			var call = getMillisecond();
			var url = dev_planwork
			+ 'Milestone/saveProjectModel.asp?SID=' + SID + "&call=" + call;
			baseAjaxJsonp(url,
					 {
				model_id : model_id,
				model_name : model_name,
				is_use : is_use,
				description : description,
				project_ModelArr : project_ModelArr,
				milestoneArr : milestoneArr
				  },function(msg){
					  if(msg.result=="true"){				
							alert("保存成功");
						}else{
							alert("系统异常，请稍后！");
						}
			},call);
		}
		
		
		
		
	});
}

//判断里程碑类型是否重复
function isSameType(n){
  var melistonetype = new Array();
  var trs = getCurrentPageObj().find("#milestoneInfoTab tbody tr");
  var type= getCurrentPageObj().find("#milestone_type"+n).val();
	for(var i=0; i<trs.length; i++){
		melistonetype[i]=$(trs[i]).find("select[name='milestone_type']").val();
	}
	var num=1;
	for(var j=0;j<melistonetype.length;j++){
		if(melistonetype[j]==type){
			num+=1;
			if(num>3||num==3){
				alert("里程碑类型不能重复！");
				j=j+1;
				getCurrentPageObj().find('#milestone_type'+n).val(" ");
				getCurrentPageObj().find('#milestone_type'+n).select2();
				//getCurrentPageObj().find('#RTreq_task_relation'+j).val("");
				return;
			}
		}
	}
	
}

//根据里程碑模板主键查询该模板配置的属性列表
function queryMilestoneAttrList(model_id){
	var call = getMillisecond();
	var url = dev_planwork
	+ 'Milestone/queryMilestoneAttrList.asp?SID=' + SID + "&call=" + call;
	baseAjaxJsonp(url,
			 {
		model_id : model_id
		  },function(data){
			  var list = data.list;
			  $(".projectModelAttrList").remove();
			  if(list != undefined){
				  for ( var i = 0; i < list.length; i++) {
					  var map = list[i];
					  var attr_id = map.ATTR_ID;
					  var description = map.DESCRIPTION == undefined ? "" : map.DESCRIPTION;
					  var tr = $("<tr class='projectModelAttrList' attr_id='" + attr_id + "'><td><select id='project_type_select"
								+ i
								+ "' name='project_type' onchange='changeProjectType(this)'></select></td>"
								+ "<td><select id='child_select"
								+ i
								+ "' name='child' onchange='changChild(this)' disabled=true></select></td>"
								+ "<td><input type='text' name='description' value='" + description + "'></td>"
								+ "<td><a onclick='deleteTR(this)'>删除</a></td></tr>");
							tr.appendTo($("#milestoneAttrTab"));
							$("#project_type_select" + i).select2();
							$("#child_select" + i).select2();
							//初始化项目类型数据
							initSelect($("#project_type_select"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_PROJECT_TYPE"},map.PROJECT_TYPE);
							//初始化子分类数据
							initSelect($("#child_select"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:map.PROJECT_TYPE},map.CHILD);
				}
			  }
	},call);
}
//查询模板已经配置的里程碑信息
function queryMilestoneList(model_id){
	$("#add_projectModelForm").attr("model_id",model_id);
	var call = getMillisecond();
	var url = dev_planwork
	+ 'Milestone/queryMilestoneListByModelId.asp?SID=' + SID + "&call=" + call;
	baseAjaxJsonp(url,
			 {
		model_id : model_id
		  },function(data){
			  var list = data.list;
			  $(".milestoneAttrList").remove();
			  if(list != undefined){
				  for ( var i = 0; i < list.length; i++) {
					  var map = list[i];
					  var milestone_id = map.MILESTONE_ID;
					  var deliverable = map.DELIVERABLE == undefined ? "" : map.DELIVERABLE; 
					  var tr = $("<tr class='milestoneAttrList' milestone_id='" + milestone_id + "'><td>" + (i + 1) + "</td>"
								+"<td><input type='text' name='milestone_code' value='" + map.MILESTONE_CODE+ "'/></td>"
								+ "<td><input type='text' name='milestone_name' value='" + map.MILESTONE_NAME+ "'/></td>"
								+ "<td><select id='milestone_type" + i + "' name='milestone_type' onchange='isSameType("+i+")'></select></td>"
								+ "<td><select id='is_choice" + i + "' name='is_choice'></select></td>"
								+ "<td><select id='status" + i + "' name='status'></select></td>"
								+ "<td><input type='text' name='deliverable' value='" + deliverable + "'/></td>"
								+ "<td><a name='file_id'>上传</a></td>"
								+ "<td><a onclick='deleteTR(this)'>删除</a>" +
								"<span onclick='upbtn(this)'>&nbsp;&nbsp;<a><i class='icon-arrow-up'></i></a></span>" +
								"<span onclick='downbtn(this)'>&nbsp;&nbsp;<a><i class='icon-arrow-down'></i></a></span></td></tr>");
							tr.appendTo($("#milestoneInfoTab"));
							$("#milestone_type" + i).select2();
							$("#is_choice" + i).select2();
							$("#status" + i).select2();
							initSelect($("#milestone_type"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_OUTTER_TASK_TYPE"},map.MILESTONE_TYPE);
							initSelect($("#is_choice"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"T_DIC_YN"},map.IS_CHOICE);
							initSelect($("#status"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_IS_USE"},map.STATUS);
				}
			  }
	},call);
}

//改变项目类型，动态加载子分类下拉框的值
function changeProjectType(obj){
	var child_select = $(obj).parent().parent().find("[name ='child']");
	child_select.val(" ");
	child_select.select2();
	child_select.empty();
	//验证该项目类型是否已经配置模板
	var project_type = $(obj).val();
	var call = getMillisecond();
	var url = dev_planwork
	+ 'Milestone/checkOnlyProjectModel.asp?SID=' + SID + "&call=" + call;
	baseAjaxJsonp(url,
			 {
		project_type : project_type
		  },function(msg){
			 if(msg.match=="true"){
				 alert("该项目类型已经分配模板，请选择其他项目类型！");
				 $(obj).val(" ");
				 $(obj).select2();
				 child_select.attr("disabled",true);
				 return;
			 }else{
				 if(msg.child == "true"){
					 initSelect(child_select,{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:$(obj).val()});
					 child_select.attr("disabled",false);
				 }else{//没有子分类时，判断不能重复添加项目类型
					 var flag = false;
					 child_select.attr("disabled",true);
					 $(obj).parent().parent().siblings().each(function(){
							var project_typeVal = $(this).find("[name='project_type']").val();
							if(project_typeVal == project_type){
								flag = true;
								return false;
							}
						});
					 if(flag){
						 alert("该项目类型已经分配模板，请选择其他项目类型！");
						 $(obj).val(" ");
						 $(obj).select2();
						return;
						}
				 }
			 }
	},call);
} 
//查询该子分类是否已经分配过模板
function changChild(obj){
	var project_type = $(obj).parent().parent().find("[name ='project_type']").val();
	var childVal = $(obj).val();
	var flag = false;
	$(obj).parent().parent().siblings().each(function(){
		var project_typeVal = $(this).find("[name='project_type']").val();
		var child_Val = $(this).find("[name='child']").val();
		if(project_typeVal == project_type && child_Val == childVal){
			flag = true;
			return false;
		}
	});
	if(flag){
		alert("该类型已经分配模板，请选择其他类型！");
		$(obj).val(" ");
		$(obj).select2();
		return;
	}
	var call = getMillisecond();
	var url = dev_planwork
	+ 'Milestone/checkOnlyProjectChild.asp?SID=' + SID + "&call=" + call;
	baseAjaxJsonp(url,
			 {
		project_type : project_type,
		childVal : childVal
		  },function(msg){
			 if(msg.match=="true"){
				 alert("该类型已经分配模板，请选择其他类型！");
				 $(obj).val(" ");
				 $(obj).select2();
			 }
	},call);
}

//删除一行里程碑数据
function deleteTR(obj){
	var milestone_id = $(obj).parent().parent().attr("milestone_id");
	if(milestone_id != undefined){
		nconfirm("是否要删除已保存的里程碑信息？", function() {
			$(obj).parent().parent().remove();
		});
	}else{
		$(obj).parent().parent().remove();
	}
}
//上移
function upbtn(obj){
	var $tr = $(obj).parents("tr");
    if ($tr.index() > 1) {
        $tr.prev().before($tr);//在每个匹配的元素之前插入内容。
    }
}
//下移
function downbtn(obj){
	var trLength = $(".milestoneAttrList").length; 
	var $tr = $(obj).parents("tr"); 
    if ($tr.index() != trLength) { 
        $tr.next().after($tr);//在每个匹配的元素之后插入内容。
    }
}