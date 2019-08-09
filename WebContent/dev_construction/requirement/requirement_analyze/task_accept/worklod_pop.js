//页面div调用pop的id，操作类型，任务id,资源类型
function openTaskWorkLoadPop(id,type,taskreqid,restype){
	if(type=="add"){
	$('#myModal_workload').remove();
	getCurrentPageObj().find("#"+id).load("dev_construction/requirement/requirement_analyze/task_accept/workload_pop.html",{},function(){
		$("#myModal_workload").modal("show");
		initWorkLoadDic();
		saveTaskWorkLoad(taskreqid,restype);
	});

	}else if(type=="update"){
		getCurrentPageObj().find("#"+id).load("dev_construction/requirement/requirement_analyze/task_accept/workload_pop.html",{},function(){
			getCurrentPageObj().find("#myModal_workload").modal("show");
			initWorkLoadDic();
			
			baseAjaxJsonp(dev_construction+"taskworkload_assess/queryTaskWordLoadById.asp?SID="+SID+"&req_task_id="+taskreqid+"&task_res_type="+restype,null , function(data) {
				if(data != undefined && data != null && data.result=="true"){
				for(var k in data){
					var str=data[k];
					k = k.toLowerCase();//大写转换为小写
				  if(k=="person_amount"||k=="task_res_num"||k=="person_costs"){
					  getCurrentPageObj().find("input[name='TWP."+k+"']").val(str);
				  }else if(k=="task_res_type"){  
					  initSelect(getCurrentPageObj().find("#TWPtask_res_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_TASKWORKLOAD_TYPE"},str); 
				  }else if(k=="task_instruction"){
					  getCurrentPageObj().find('#TWPtask_instruction').val(str);
				  }	
				}
				getCurrentPageObj().find('#TWPtask_res_type').attr("disabled","disabled");
				}else{
					var mess=data.mess
					alert("获取评估信息失败："+mess);
					$("#myModal_reqSub").modal("hide");
				}
			});
			saveTaskWorkLoad(taskreqid,restype);
		});	
	}
}

//保存或新增
function saveTaskWorkLoad(taskreqid,restype){
//新增或更新
getCurrentPageObj().find('#taskworkload_save').click(function(){
	
	  if(!vlidate($("#g_reqtask_workload-pop"),"",true)){
		  alert("请按要求填写图表中的必填项！");
		      return ;
	     }
		var inputs = getCurrentPageObj().find("input[name^='TWP.']");
		var textareas = getCurrentPageObj().find("textarea[name^='TWP.']");
		var selects =  getCurrentPageObj().find("select[name^='TWP.']");
		var params = {};
		
		for(var i=0;i<inputs.length;i++){
			params[$(inputs[i]).attr("name").substr(4)] = $(inputs[i]).val();	 
		}
		for(var i=0;i<textareas.length;i++){
			params[$(textareas[i]).attr("name").substr(4)] = $(textareas[i]).val();
		}
		for(var i=0;i<selects.length;i++){
			params[$(selects[i]).attr("name").substr(4)] = $(selects[i]).val();
		}
		
		if(taskreqid==null||taskreqid==""){
			alert("获取任务主键id失败");
			return;
		}
		   params["req_task_id"]=taskreqid;
		if(restype!=null&&restype!=""){//当传进来的资源类型不为空时更新，否则新增
		   baseAjaxJsonp(dev_construction+"taskworkload_assess/updateTaskWorkLoad.asp?SID="+SID, params , function(data) {
				if (data != undefined && data != null && data.result=="true") {
					alert("修改保存成功");
					getCurrentPageObj().find('#taskworkload_save').removeAttr("disabled");
					$("#myModal_workload").modal("hide");
					$('#g_reqtask_workload').bootstrapTable('refresh');
				}else{
					var mess=data.mess;
					alert("修改保存失败："+mess);
				}
			});
		  }else{
		   baseAjaxJsonp(dev_construction+"taskworkload_assess/insertTaskWorkload.asp?SID="+SID, params , function(data) {
			if (data != undefined && data != null && data.result=="true") {
				alert("保存成功");
				getCurrentPageObj().find('#taskworkload_save').removeAttr("disabled");
				$("#myModal_workload").modal("hide");
				$('#g_reqtask_workload').bootstrapTable('refresh');
			}else{
				var mess=data.mess;
				alert("保存失败："+mess);
			}
		});
	  }
  });
}

//加载字典项
function initWorkLoadDic(){
	initSelect(getCurrentPageObj().find("#TWPtask_res_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_TASKWORKLOAD_TYPE"});
}


			
		
		