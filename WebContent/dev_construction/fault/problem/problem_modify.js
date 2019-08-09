//初始化按钮
function initProblemUpdateBtn(ids) {
	var currTab = getCurrentPageObj();
	//初始化数据
		var call = getMillisecond();
		baseAjaxJsonp(dev_construction+"Problem/problemQueryInfo.asp?call="+call+"&SID="+SID+"&PROBLEM_ID="+ids, null, function(result){
			//修改基本信息
			for(var i in result){
				var str=result[i];
				i = i.toLowerCase();
				currTab.find("#"+i).val(str);
				/*if(i=="SERNO"||i=="INPUT_NAME"||i=="INPUT_TIME"||i=="STATUS"||i=="IMPORTANCE_LEVEL"||i=="URGENCY_LEVEL"||i=="PRIORITY"||i=="PBMTYPE"||i=="PROBLEM_TITLE"){
					currTab.find("input[name=PA."+i+"]").val(result[i]);
				}else if(i=="DETAILED_DECRIPTION"||i=="INVESTIGATE_CASE"){
					currTab.find("input[name=PA."+i+"]").val(result[i]);
				}*/
			}
		},call);

}

//保存修改
getCurrentPageObj().find('#submit_gProblemInfo').click(function(){
	if(!vlidate($("#gProblemInfo_add"),"",true)){
		alert("您还有必填项没有填写！");
		return ;
	}
	  //获取页面输入的值
	var params = getPageParam("PA");
	var call = getMillisecond();
	 baseAjaxJsonp(dev_construction+"Problem/problemUpdate.asp?SID="+SID, params , function(data) {
		 if (data != undefined && data != null && data.result=="true") {
				alert("保存成功");
				closePageTab("problem_modify");
			}else if(data.result=="repeat"){
				alert("保存失败:流水单号已存在");
			}
		 else{
				alert("保存失败");
			}
		});
});


