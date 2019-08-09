//<!-- 里程碑模板配置，里程碑信息界面，暂时不用 -->


initQueryProjectModelButtonEvent();
//页面按钮事件
function initQueryProjectModelButtonEvent(){
	//页面新增按钮事件，列表中动态添加一行
	$("#add_milestone").click(function(){
		var j = $("#milestoneInfoTab").find("tr").length;
		while ($("#is_choice" + j).length > 0){ 
			j++; 
		};
		var tr = $("<tr class='milestoneAttrList'><td>" + j + "</td>"
		+"<td><input type='text' name='milestone_code'/></td>"
		+ "<td><input type='text' name='milestone_name'/></td>"
		+ "<td><select id='milestone_type" + j + "' name='milestone_type'></select></td>"
		+ "<td><select id='is_choice" + j + "' name='is_choice'></select></td>"
		+ "<td><select id='status" + j + "' name='status'></select></td>"
		+ "<td><input type='text' name='deliverable'/></td>"
		+ "<td><a name='file_id'>上传</a></td>"
		+ "<td><a onclick='deleteTR(this)'>删除</a>" +
		"<span onclick='upbtn(this)'>&nbsp;&nbsp;<a><i class='icon-arrow-up'></i></a></span>" +
		"<span onclick='downbtn(this)'>&nbsp;&nbsp;<a><i class='icon-arrow-down'></i></a></span></td></tr>");
		tr.appendTo($("#milestoneInfoTab"));
		$("#milestone_type" + j).select2();
		$("#is_choice" + j).select2();
		$("#status" + j).select2();
		initSelect($("#milestone_type"+j),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_TYPE"});
		initSelect($("#is_choice"+j),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"T_DIC_YN"},"00");
		initSelect($("#status"+j),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_IS_USE"},"01");
	});
	//页面保存按钮事件
	$("#save_milestone").click(
			function() {
				var model_id = $("#M_model_id").val();
				var milestoneArr = new Array();
				var sort = 1;
				var flag = true;
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
					var call = getMillisecond();
					var url = dev_planwork
					+ 'Milestone/insertNewMilestoneInfo.asp?SID=' + SID + "&call=" + call;
					baseAjaxJsonp(url,
							 {
						model_id : model_id,
						milestoneArr : milestoneArr
						  },function(msg){
							  if(msg.result=="true"){				
									alert("保存成功");
									//刷新列表
									queryMilestoneList();
								}else{
									alert("系统异常，请稍后！");
								}
							  $("#addProjectModelAttrModal").modal("hide");
					},call);
				}
	});
}
//删除一行数据
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
//查询模板已经配置的里程碑信息
function  queryMilestoneList(){
	var model_id = $("#M_model_id").val();
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
								+ "<td><select id='milestone_type" + i + "' name='milestone_type'></select></td>"
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
							initSelect($("#milestone_type"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_TYPE"},map.MILESTONE_TYPE);
							initSelect($("#is_choice"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"T_DIC_YN"},map.IS_CHOICE);
							initSelect($("#status"+i),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_IS_USE"},map.STATUS);
				}
			  }
	},call);
}
