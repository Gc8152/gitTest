initProblemAddBtn();
//初始化按钮
function initProblemAddBtn() {
//保存新增
getCurrentPageObj().find('#submit_gProblemInfo').click(function(){
	if(!vlidate($("#gProblemInfo_add"),"",true)){
		alert("您还有必填项没有填写！");
		return ;
	}
	  //获取页面输入的值
	var params = getPageParam("PA");
	var call = getMillisecond();
	 baseAjaxJsonp(dev_construction+"Problem/problemAdd.asp?SID="+SID, params , function(data) {
		 if (data != undefined && data != null && data.result=="true") {
				alert("保存成功");
				closePageTab("problem_add1");
			}else if(data.result=="repeat"){
				alert("保存失败:流水单号已存在");
			}
		 else{
				alert("保存失败");
			}
		});
});




	

}


