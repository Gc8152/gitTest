function initMilestoneEdit(row,version_id){
	var mTable = getCurrentPageObj().find("#milestoneInfoTable");//里程碑table
	var deletePlanArr = new Array();
	//全选与全不选
	getCurrentPageObj().find('#choseAll').click(function(){
		var flag=$(this).is(":checked");
		 getCurrentPageObj().find("input[name='taskbox']:checkbox").prop("checked",flag);

	});
	//保存按钮
	var submitPlan = getCurrentPageObj().find("#submitPlan");
	submitPlan.click(function(){
		save();
	});
	
	//保存&&提交方法
	function save(){
		var flag = true;
		var param = {};
		var milestoneArr = new Array();
		$(".milestoneInfoList").each(
				function() {
					var plan_id = $(this).find("[name='RT.plan_id']").val();
					var milestone_name = $.trim($(this).find("[name='RT.milestone_name']").val());
					var milestone_type = $.trim($(this).find("[name='RT.milestone_type']").val());
					var start_time = $.trim($(this).find("[name='RT.start_time']").val());
					var end_time = $.trim($(this).find("[name='RT.end_time']").val());
					var start_time_date = new Date(start_time.replace(/-/g,"/"));
					var end_time_date = new Date(end_time.replace(/-/g,"/"));
					var is_choice = $.trim($(this).find("[name='RT.is_choice']").val());
					var execute_status = $(this).find("[name='RT.execute_status']").val();
					var file_id = $(this).find("[name='RT.file_id']").val();
					if(milestone_name == ""){
						alert("请填写里程碑名称！");
						flag = false;
						return false;
					}else if(milestone_type == ""){
						alert("请填写里程碑类型！");
						flag = false;
						return false;
					}else if(is_choice == ""){
						alert("请填写是否为必选项！");
						flag = false;
						return false;
					}else if(start_time == ""){
						alert("请填写"+milestone_name+"的计划开始日期！");
						flag = false;
						return false;
					}else if(end_time == ""){
						alert("请填写"+milestone_name+"的计划结束日期！");
						flag = false;
						return false;
					}else if(file_id == ""){
						alert("请填写产出物！");
						flag = false;
						return false;
					}else if(start_time_date>end_time_date){
						alert(milestone_name+"的开始日期不能大于结束日期！");
						flag = false;
						return false;
					}
					milestoneArr.push(plan_id+"&&"+milestone_name+"&&"+milestone_type+"&&"+start_time 
							      +"&&"+ end_time + "&&" + is_choice+"&&"+execute_status+"&&"+file_id);
				});
				param["milestoneArr"] = milestoneArr;
				param["deletePlanArr"] = deletePlanArr;
		if(flag){
			var call = getMillisecond();
			baseAjaxJsonp(dev_project+"Wbs/saveWbsPlan.asp?call="+call+"&SID="+SID+"&project_id="+row.PROJECT_ID,param,function(data){
				if (data != undefined && data != null) {
					if(data.result=="true"){
						alert("保存成功");
						closeCurrPageTab();
					}
				}else{
					alert("未知错误！");
				}
			},call);
		}
	}
		
	var initCall=getMillisecond();
	baseAjaxJsonp(dev_project + "Wbs/queryMilestoneByProjectId.asp?SID=" + SID + '&call=' + initCall,{"project_id":row.PROJECT_ID,"version_id":version_id},
	function(data){
		initMilestone(data);
		},initCall); 
		
	//初始化模板里程碑
	var count=1;//行数ID后缀  
	var delid="";//删除的ID  
	function initMilestone(data){
		if(data!=null){
			mTable.find("tr").not(":eq(0)").remove();
				var list = data.rows;
				if(data.result=="true"){
					if (list != undefined && list != null) {
						for (var i = 0; i < list.length; i++) {
							 var map = list[i];
							 var milestone_id = map.MILESTONE_ID;
							 var milestone_type = map.MILESTONE_TYPE== undefined ? "":map.MILESTONE_TYPE;
							 var milestone_name = map.PLAN_NAME== undefined ? "":map.PLAN_NAME;
							 var start_time = map.START_TIME == undefined ? "" : map.START_TIME;
							 var end_time = map.END_TIME == undefined ? "" : map.END_TIME;
							 var is_choice = map.IS_CHOICE == undefined ? "01" : map.IS_CHOICE;//'00'是,'01'否
							 var execute_status = map.EXECUTE_STATUS == undefined ? "00" : map.EXECUTE_STATUS;//'00'未完成,'01'已完成
							 
							 if(execute_status == '00' || execute_status == ""){
								 start_time = "<td><input type='text' id='RTstart_time"+count+"' name='RT.start_time' onClick='WdatePicker({})' value='" + start_time + "'/></td>";  
								 end_time = '<td><input type="text" id="RTend_time'+count+'" name="RT.end_time" onClick="WdatePicker({})" value="' +end_time+'"/></td>';
							 }else{
								 strat_time = "<td><input type='text' id='RTstart_time"+count+"' name='RT.start_time' value='" + start_time + "' readonly/></td>";
								 end_time = '<td> <input type="text" id="RTend_time'+count+'" name="RT.end_time" value="' +end_time+'" readonly/></td>';
							 }
							 var tr = "<tr class='milestoneInfoList'>" 
								 		+'<td align="center"><input class="form-control" id="taskcheck'+count+'" type="checkbox" name="taskbox" value="'+count+'"/>'+
								 		'<input type="hidden" id="RTplan_id'+count+'" name="RT.plan_id" value="'+map.PLAN_ID+'"></td>'
								 		+'<td>'+count+'</td>'
							 			+ '<td><input type="text" id="RTmilestone_name'+count+'" name="RT.milestone_name"  value="'+milestone_name+'" readonly/>' 
							 			+ '<input type="hidden" id="RTmilestone_id'+count+'" name="RT.milestone_id" value="'+milestone_id+'"></td>'
							 			+ '<td><select id="RTmilestone_type'+count+'" name="RT.milestone_type" disabled></select> </td>'
							 			+ '<td><select id="RTis_choice'+count+'" name="RT.is_choice" disabled></select> </td>' 
										+ start_time
										+ end_time
										+'<td><input type="text" id="RTfile_id" name="RT.file_id" value="ss"/></td>'
										+ '<td><select id="RTexecute_status'+count+'" name="RT.execute_status" disabled></select> </td>' 
										+"</tr>";
							 mTable.append(tr);
							 initSelect(getCurrentPageObj().find("#RTmilestone_type"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_TYPE"},milestone_type);
							 initSelect(getCurrentPageObj().find("#RTis_choice"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"T_DIC_YN"},is_choice);
							 initSelect(getCurrentPageObj().find("#RTexecute_status"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_EXECUTE_STATUS"},execute_status);
							 count++;
						 }
					}
				}else{
					alert("初始化里程碑失败!");
				}
			}else{//新增里程碑
				var tr = "<tr class='milestoneInfoList'>" 
			 		+'<td align="center"><input class="form-control" id="taskcheck'+count+'" type="checkbox" name="taskbox" value="'+count+'"/>'+
			 		'<input type="hidden" id="RTplan_id'+count+'" name="RT.plan_id" value="a"></td>'
			 		+'<td>'+count+'</td>'
		 			+ '<td><input type="text" id="RTmilestone_name'+count+'" name="RT.milestone_name"/>' 
		 			+ '<input type="hidden" id="RTmilestone_id'+count+'" name="RT.milestone_id" value="b"></td>'
		 			+ '<td><select id="RTmilestone_type'+count+'" name="RT.milestone_type" onchange="isSameType('+count+')"></select> </td>'
		 			+ '<td><select id="RTis_choice'+count+'" name="RT.is_choice"></select> </td>'  
					+ '<td> <input type="text" id="RTstart_time'+count+'" name="RT.start_time" onClick="WdatePicker({})" onchange="calculationDay('+count+')"/></td>'
					+ '<td><input type="text" id="RTend_time'+count+'" name="RT.end_time" onClick="WdatePicker({})" onchange="calculationDay('+count+')"/>'
					+'<td><input type="text" id="RTfile_id" name="RT.file_id" value=""/></td>'
					+ '<td><select id="RTexecute_status'+count+'" name="RT.execute_status" disabled></select> </td>' 
					+"</tr>";
				mTable.append(tr);
				initSelect(getCurrentPageObj().find("#RTmilestone_type"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"SYS_DIC_MILESTONE_TYPE"});
				initSelect(getCurrentPageObj().find("#RTis_choice"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"T_DIC_YN"},"01");
				initSelect(getCurrentPageObj().find("#RTexecute_status"+count),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_DIC_EXECUTE_STATUS"},"00");
				count++;
			}
	}
	
	//新增里程碑
	getCurrentPageObj().find('#milestone_Add').click(function(){
		initMilestone(null);
	});
	
	//删除选中的里程碑
	getCurrentPageObj().find('#milestone_Delete').click(function(){
		var checkeds=getCurrentPageObj().find("input:checkbox[name^='taskbox']:checked");
		if(checkeds.length==0){
			alert("请至少选择一条数据");
			return;
		}
		var chobj= getCurrentPageObj().find("input[name='taskbox']:checkbox");
		if(chobj.length!=0){
		    chobj.each(function(){  
		        if($(this).is(":checked")){
		           delid = $(this).val();
		           var is_choice = getCurrentPageObj().find('#RTis_choice'+delid).val();
		           var execute_status = getCurrentPageObj().find('#RTexecute_status'+delid).val();
		           var plan_id = getCurrentPageObj().find('#RTplan_id'+delid).val();
		           if(plan_id != "a"){
		        	   deletePlanArr.push(plan_id);
		           }
	        	   if(is_choice=="00"){
	        		   alert("该里程碑必选，不可删除");
	        		   return false;
	        	   }
	        	   if(execute_status=='01'){
	        	     alert("该里程碑已完成，不能删除");
	        	     return false;
	        	   }
	               $(this).parent().parent().remove();
		        } 
		     });
			}else{
				alert("并无表格数据,无法删除");
			}
	  });
}

//判断里程碑类型是否重复
function isSameType(n){
  var melistonetype = new Array();
  var trs = getCurrentPageObj().find("#milestoneInfoTable tr");
  var type= getCurrentPageObj().find("#RTmilestone_type"+n).val();
	for(var i=0; i<trs.length; i++){
		melistonetype[i]=$(trs[i]).find("select[name='RT.milestone_type']").val();
	}
	var num=0;
	for(var j=0;j<melistonetype.length;j++){
		if(melistonetype[j]==type){
			num+=1;
			if(num>2||num==2){
				alert("里程碑类型不能重复！");
				j=j+1;
				getCurrentPageObj().find('#RTmilestone_type'+n).val("");
				getCurrentPageObj().find('#RTmilestone_type'+n).select2();
				return;
			}
		}
	}
}