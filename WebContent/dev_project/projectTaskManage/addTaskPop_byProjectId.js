function add_task_Pop(callparams){
		getCurrentPageObj().find("[name='SYSTEM_NAME']").val(callparams.SYSTEM_NAME);
		var system_id = callparams.SYSTEM_ID;
		var task_num = callparams.TASK_NUM;
		//var task_id = callparams.REQ_TASK_ID;
		var project_id=callparams.PROJECT_ID;
		var type = callparams.TYPE;
		/**
		 * 下拉框，时间控件修饰开始
		 */
		var arr = "";
		/*initSelect(getCurrentPageObj().find("select[name='TASK_STATE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_PROJECT_TASK_STATE"},null,null,arr);*/
		initSelect(getCurrentPageObj().find("select[id='add_task_level']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_LEVEL"},null,null,arr);
		initSelect(getCurrentPageObj().find("select[id='add_task_type']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_CODETASK_TYPE"},"01",null,"02");
		
		/**
		 * 下拉框，时间控件修饰结束
		 */
		/**执行人点击事件开始**/
		//点击打开模态框
			getCurrentPageObj().find("#addExe").unbind("click").click(function(){
				openExePop(project_id,getCurrentPageObj().find("#choosePm"),{Zpm_id:getCurrentPageObj().find("#addExeId"),Zpm_name:getCurrentPageObj().find("#addExe")});
			});
		
		/**执行人点击事件结束**/
		
		/**
		 * 修改回填开始
		 */
		if(type=="update"){
			var item = callparams.SELES;
			for (var key in item) {
				getCurrentPageObj().find("input[name="+key+"]").val(item[key]);
				getCurrentPageObj().find("select[name="+key+"]").val(item[key]);
				getCurrentPageObj().find("textarea[name="+key+"]").val(item[key]);
			}
			initSelect(getCurrentPageObj().find("select[name='TASK_LEVEL']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_REQUIREMENT_LEVEL"},item.TASK_LEVEL);
			initSelect(getCurrentPageObj().find("select[name='TASK_STATE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"P_PROJECT_TASK_STATE"},item.TASK_STATE,null,arr);
			initSelect(getCurrentPageObj().find("select[name='TASK_TYPE']"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"G_DIC_CODETASK_TYPE"},item.TASK_TYPE,null,"02");
		}
		/**
		 * 修改回填结束
		 */
		
		
		//保存
		getCurrentPageObj().find("#save_task").unbind("click").click(function(){
			var params = {};
			if(type=="update"){
				var p_task_id =callparams.SELES.P_TASK_ID;
				params["P_TASK_ID"] = p_task_id;
			}
			params["TASK_STATE"]="01";//01为待发布
			params["TYPE"] = type;
			params["SYSTEM_ID"] = system_id;
			params["TASK_NUM"] = task_num;
			params["PROJECT_ID"] = project_id;
			var projectInfo = getCurrentPageObj().find("#addTask_table");
			var inputs = projectInfo.find("input");
			var selects = projectInfo.find("select");
			var textareas = projectInfo.find("textarea");
			var hiddens = projectInfo.find("hidden");
			if(!vlidate(getCurrentPageObj(),"",true)){
				alert("有必填项未填");
				return ;
			}
			for (var i = 0; i < inputs.length; i++) {
				var obj = $(inputs[i]);
				params[obj.attr("name")] = $.trim(obj.val());
			}
			for (var i = 0; i < selects.length; i++) {
				var obj = $(selects[i]);
				params[obj.attr("name")] = $.trim(obj.val());
			}
			for (var i = 0; i < textareas.length; i++) {
				var obj = $(textareas[i]);
				params[obj.attr("name")] = $.trim(obj.val());
			}
			for (var i = 0; i < hiddens.length; i++) {
				var obj = $(hiddens[i]);
				params[obj.attr("name")] = $.trim(obj.val());
			}
			var saveCall = getMillisecond() + '1';
			baseAjaxJsonp(dev_project+"projectTaskManager/saveAddTaskByProjectId.asp?SID=" + SID + "&call=" + saveCall+"&params="+params, params, function(data) {
				if(data && data.result=="true"){
					alert(data.msg);
					getCurrentPageObj().find("[tb='funcSplitTable']").bootstrapTable('refresh',{						
				url:dev_project+"projectTaskManager/queryQeqByProjectId.asp?SID=" + SID + "&call=" + fsCall +"&PROJECT_ID="+project_id});
					getCurrentPageObj().find("#L2").show();
					getCurrentPageObj().find("#L3").hide();
					getCurrentPageObj().find("#L2").addClass("active");
					getCurrentPageObj().find("#L3").removeClass("active");
					getCurrentPageObj().find(".tab-pane").removeClass("active");
					getCurrentPageObj().find("#func_point_split").addClass("active");
					//TODO 清空输入框
					inputs.val("");
					textareas.val("");
				}else{
					alert(data.msg);
				}
			},saveCall,false);
		});
		
		//保存并提交
		getCurrentPageObj().find("#saveAdd_task").unbind("click").click(function(){
			var params = {};
			if(type=="update"){
				//TODO
				//判断已发布不能修改
				var p_task_id =callparams.SELES.P_TASK_ID;
				params["P_TASK_ID"] = p_task_id;
			}
			params["TYPE"] = type;
			params["TASK_STATE"]="02";//01为已发布
			params["SYSTEM_ID"] = system_id;
			params["TASK_NUM"] = task_num;
			params["PROJECT_ID"] = project_id;
			var projectInfo = getCurrentPageObj().find("#addTask_table");
			var inputs = projectInfo.find("input");
			var selects = projectInfo.find("select");
			var textareas = projectInfo.find("textarea");
			var hiddens = projectInfo.find("hidden");
			if(!vlidate(getCurrentPageObj(),"",true)){
				alert("有必填项未填");
				return ;
			}
			for (var i = 0; i < inputs.length; i++) {
				var obj = $(inputs[i]);
				params[obj.attr("name")] = $.trim(obj.val());
			}
			for (var i = 0; i < selects.length; i++) {
				var obj = $(selects[i]);
				params[obj.attr("name")] = $.trim(obj.val());
			}
			for (var i = 0; i < textareas.length; i++) {
				var obj = $(textareas[i]);
				params[obj.attr("name")] = $.trim(obj.val());
			}
			for (var i = 0; i < hiddens.length; i++) {
				var obj = $(hiddens[i]);
				params[obj.attr("name")] = $.trim(obj.val());
			}
			var saveCall = getMillisecond() + '1';
			baseAjaxJsonp(dev_project+"projectTaskManager/saveAddTaskByProjectId.asp?SID=" + SID + "&call=" + saveCall+"&params="+params, params, function(data) {
				if(data && data.result=="true"){
					alert(data.msg);
					getCurrentPageObj().find("[tb='funcSplitTable']").bootstrapTable('refresh',{						
				url:dev_project+"projectTaskManager/queryQeqByProjectId.asp?SID=" + SID + "&call=" + fsCall +"&PROJECT_ID="+project_id});
					getCurrentPageObj().find("#L2").show();
					getCurrentPageObj().find("#L3").hide();
					getCurrentPageObj().find("#L2").addClass("active");
					getCurrentPageObj().find("#L3").removeClass("active");
					getCurrentPageObj().find(".tab-pane").removeClass("active");
					getCurrentPageObj().find("#func_point_split").addClass("active");
					//TODO 清空输入框
					inputs.val("");
					textareas.val("");
				}else{
					alert(data.msg);
				}
			},saveCall,false);
		});

		//返回
		getCurrentPageObj().find("#back_task").unbind("click").click(function(){
			getCurrentPageObj().find("#L2").show();
			getCurrentPageObj().find("#L3").hide();
			getCurrentPageObj().find("#L2").addClass("active");
			getCurrentPageObj().find("#L3").removeClass("active");
			getCurrentPageObj().find(".tab-pane").removeClass("active");
			getCurrentPageObj().find("#func_point_split").addClass("active");	
		});
}
//转发

function change_task_Pop(callparams){
	var project_id=callparams.PROJECT_ID;
	var type = callparams.TYPE;	
	/**执行人点击事件开始**/
	//点击打开模态框
		getCurrentPageObj().find("#changeExe").unbind("click").click(function(){
			openExePop(project_id,getCurrentPageObj().find("#chooseExe"),{Zpm_id:getCurrentPageObj().find("#changeExeId"),Zpm_name:getCurrentPageObj().find("#changeExe")});
		});
	
	/**执行人点击事件结束**/	
	/**
	 * 修改回填开始
	 */
		var item = callparams.SELES;
		for (var key in item) {
			getCurrentPageObj().find("div[name="+"ZF_"+key+"]").html(item[key]);
		}
		getCurrentPageObj().find("input[name=ZF_EXECUTOR_NAME]").val(item["EXECUTOR_NAME"]);	
	/**
	 * 修改回填结束
	 */
	//转发
	getCurrentPageObj().find("#save_task_exe").unbind("click").click(function(){
		var params = {};
		for(var key in item){
			params[key]=item[key];
		}
		params["TYPE"]=type;
		params["EXECUTOR"]=getCurrentPageObj().find("#changeExeId").val();
		var saveCall = getMillisecond() + '1';
		baseAjaxJsonp(dev_project+"projectTaskManager/saveAddTaskByProjectId.asp?SID=" + SID + "&call=" + saveCall+"&params="+params, params, function(data) {
			if(data && data.result=="true"){
				alert(data.msg);
				getCurrentPageObj().find("[tb='funcSplitTable']").bootstrapTable('refresh',{						
			url:dev_project+"projectTaskManager/queryQeqByProjectId.asp?SID=" + SID + "&call=" + fsCall +"&PROJECT_ID="+project_id});
				getCurrentPageObj().find("#L2").show();
				getCurrentPageObj().find("#L5").hide();
				getCurrentPageObj().find("#L2").addClass("active");
				getCurrentPageObj().find("#L5").removeClass("active");
				getCurrentPageObj().find(".tab-pane").removeClass("active");
				getCurrentPageObj().find("#func_point_split").addClass("active");
			}else{
				alert(data.msg);
			}
		},saveCall,false);
	});
	getCurrentPageObj().find("#close_task_exe").unbind("click").click(function(){
		getCurrentPageObj().find("#L2").show();
		getCurrentPageObj().find("#L5").hide();
		getCurrentPageObj().find("#L2").addClass("active");
		getCurrentPageObj().find("#L5").removeClass("active");
		getCurrentPageObj().find(".tab-pane").removeClass("active");
		getCurrentPageObj().find("#func_point_split").addClass("active");	
	});
}

function checkTimeSupCompare(){
	WdatePicker({onpicked:function(){
		var starttime = getCurrentPageObj().find("input[name=PLAN_STARTTIME]").val();
		var endtime = getCurrentPageObj().find("input[name=PLAN_ENDTIME]").val();
		if(starttime!=""&&endtime!=""){
			if(starttime>endtime){
				alert('开始时间不能大于结束时间!',function(){
					getCurrentPageObj().find("input[name=PLAN_STARTTIME]").val("");
					getCurrentPageObj().find("input[name=PLAN_ENDTIME]").val("");
				});
			}
		}
	}});
}
function initDate(){
	WdatePicker({
			dateFmt : 'yyyy-MM-dd',
			minDate : '1990-01-01',
			maxDate : '2050-12-01'
	});
}