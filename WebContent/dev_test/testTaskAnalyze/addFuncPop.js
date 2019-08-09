function add_func_Pop(obj,callparams,callback){
	getCurrentPageObj().find("#addFuncPoint_Pop").remove();
	//加载pop框内容
	obj.load("dev_test/testTaskAnalyze/addFuncPop.html",{},function(){
		var modObj = getCurrentPageObj().find("#addFuncPoint_Pop");
		initVlidate(modObj);
		modObj.modal("show");
		
		getCurrentPageObj().find("[name='SYSTEM_NAME']").val(callparams.SYSTEM_NAME);
		var system_id = callparams.SYSTEM_ID;
		var task_num = callparams.TASK_NUM;
		var $selObj = getCurrentPageObj().find("[name='IU.MODULE_NAME2']");
		//初始化下拉框
		var selCall = getMillisecond();
		baseAjaxJsonp(dev_test+'testTaskAnalyze/queryModuleBySystem.asp?SYSTEM_ID='+system_id+'&call='+selCall+'&SID='+SID,null,function(data) {
			if (data != undefined && data != null && data.result=="true") {
				initSelectByData($selObj,{"value":"MODULE_ID","text":"MODULE_NAME"},data.rows);
			}else{
				alert("查询失败");
			}
		},selCall);
		
		//新增功能点
		getCurrentPageObj().find("#add_module").click(function(){
			getCurrentPageObj().find("#tdName").show();
			getCurrentPageObj().find("#tdAdd").show();
			getCurrentPageObj().find("#tdNo1").show();
			getCurrentPageObj().find("#tdNo2").show();
			getCurrentPageObj().find("#trAdd").show();
			getCurrentPageObj().find("#tdChoose").hide();
		});
		getCurrentPageObj().find("#choose_module").click(function(){
			getCurrentPageObj().find("#tdName").show();
			getCurrentPageObj().find("#tdChoose").show();
			getCurrentPageObj().find("#tdAdd").hide();
			getCurrentPageObj().find("#tdNo1").hide();
			getCurrentPageObj().find("#tdNo2").hide();
			getCurrentPageObj().find("#trAdd").hide();
		});
		
		//保存
		getCurrentPageObj().find("[btn='saveFunc']").click(function(){
			if(!vlidate(modObj)){
				return ;
			}
			var params = getPageParam("IU");
			var type = params["MODULE"];
			params["TYPE"] = type;
			params["SYSTEM_ID"] = system_id;
			params["TASK_NUM"] = task_num;
			if(type == 'add'){
				params["MODULE_NAME"] = params["MODULE_NAME1"];
				params["MODULE_ID"] = params["MODULE_NO1"];
				getCurrentPageObj().find("[name='IU.MODULE_NAME1']").attr("validate","v.required");
				getCurrentPageObj().find("[name='IU.MODULE_NAME1']").attr("valititle","该项为必填项");
				getCurrentPageObj().find("[name='IU.MODULE_NAME2']").attr("valititle","");
			}else if(type == 'choose'){
				params["MODULE_ID"] = params["MODULE_NAME2"];
				getCurrentPageObj().find("[name='IU.MODULE_NAME2']").attr("valititle","该项为必填项");
				getCurrentPageObj().find("[name='IU.MODULE_NAME1']").attr("validate","");
				getCurrentPageObj().find("[name='IU.MODULE_NAME1']").attr("valititle","");
			}else{
				alert("请选择模块");
				return;
			}
			if(!vlidate(getCurrentPageObj(),"",true)){//待议
				alert("有必填项未填");
				return ;
			}
			var saveCall = getMillisecond() + '1';
			baseAjaxJsonp(dev_test+"testTaskAnalyze/saveAddFunc.asp?SID=" + SID + "&call=" + saveCall, params, function(data) {
				if(data && data.result=="true"){
					alert(data.msg);
					modObj.modal("hide");
					if(callback){
						callback();
					}
				}else{
					alert(data.msg);
				}
			},saveCall,false);
		});
		
		getCurrentPageObj().find("[btn='closePop']").click(function(){
			modObj.modal("hide");
		});
	});
}