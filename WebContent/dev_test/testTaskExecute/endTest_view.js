
function endTest(obj,seles){
	$("#end_test_modal").remove();
	//加载pop框内容
	obj.load("dev_test/testTaskExecute/endTest_view.html",{},function(){
	var $page = getCurrentPageObj();//当前页
	var modObj = $page.find("#end_test_modal");
	modObj.modal("show");
	var initTableCall = getMillisecond();//table回调方法名
	autoInitSelect(modObj);//初始化下拉选
	for(var k in seles){
		getCurrentPageObj().find("#"+k).val(seles[k]);
	 }
	initButtonEvent("edit",seles.CASE_ID,seles.TEST_ROUND);//初始化按钮事件
	//按钮事件
	function initButtonEvent(edit,CASE_ID,TEST_ROUND){
		//保存按钮
		modObj.find("#saveTask").click(function(){
			addDefectInfo("save",edit,CASE_ID,TEST_ROUND);
			$page.find("#end_test_modal").modal("hide");
		});
	};
//保存&提交
	function addDefectInfo(opt_type,edit,CASE_ID,TEST_ROUND){
		
			var params = getPageParam("I");
			if(params["EXECUTE_RESULT"] != null){
				params["EXECUTE_STATE"] = '01';
			}
		params["OPT_TYPE"] = opt_type;
			if(!vlidate(modObj,"",true)){
				alert("有必填项未填");
				return ;
			}
			//获取当前时间
			function p(s) {
			    return s < 10 ? '0' + s: s;
			}
			var myDate = new Date();
			//获取当前年
			var year=myDate.getFullYear();
			//获取当前月
			var month=myDate.getMonth()+1;
			//获取当前日
			var date=myDate.getDate(); 
			var h=myDate.getHours();       //获取当前小时数(0-23)
			var m=myDate.getMinutes();     //获取当前分钟数(0-59)
			var s=myDate.getSeconds();  

			var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
			params["EXEC_TIME"] = now;
		    editSave(params,CASE_ID,TEST_ROUND);
	}
//修改保存&提交
	function editSave(params,CASE_ID,TEST_ROUND){
		 
		var editCall = getMillisecond();
		baseAjaxJsonp(dev_test+"testTaskExecute/saveEditTask.asp?SID=" + SID +"&CASE_ID=" +CASE_ID +"&TEST_ROUND=" +TEST_ROUND +"&call=" + editCall, params, function(data) {
			if(data && data.result=="true"){
				alert(data.msg);
				closeCurrPageTab();
			}else{
				alert(data.msg);
			}
		},editCall,false);
	}
});
}