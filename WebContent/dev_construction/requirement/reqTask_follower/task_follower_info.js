
initReqTaskVersionJoinBtn();

//初始化按钮
function initReqTaskVersionJoinBtn(){
	//提交并保存
	$('#taskVersion_join').click(function(){
		if(!vlidate($("#g_reqtask_joinVersion"),"",true)){
			alert("请按要求填写图表中的必填项！");
			return ;
		}
		alert("待保存");
	});
}	

 
 





