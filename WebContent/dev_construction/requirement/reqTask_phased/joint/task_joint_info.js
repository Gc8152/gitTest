
initReqTaskJointBtn();

//初始化按钮
function initReqTaskJointBtn(){
	//提交并保存
	getCurrentPageObj().find('#taskPhase_info').click(function(){
		var records = getCurrentPageObj().find('#'+id).bootstrapTable('getSelections');
		if(records==null||records==undefined||records==""||records.length!=1){
			alert("请选择一条数据！");					
			return;
		}
	    viewPhaseTaskDetail(records[0].REQ_TASK_ID,records[0].REQ_TASK_CODE,"08");
	});
	
}	


(function(){
	getCurrentPageObj().find("#testNum [name^='G.']").blur(function() {
		var test_num = getCurrentPageObj().find("[name='G.test_num']").val();
		var test_passnum = getCurrentPageObj().find("[name='G.test_pass_num']").val();
		if(test_num && test_passnum) {
			getCurrentPageObj().find("[name='G.test_unpass_num']").val(test_num-test_passnum);
			var pass_rate = test_passnum/test_num*100;
			
			getCurrentPageObj().find("[name='G.pass_pate']").val(pass_rate.toFixed(2));
		} else {
			getCurrentPageObj().find("[name='G.test_unpass_num']").val("");
			getCurrentPageObj().find("[name='G.pass_pate']").val("");
		}
	});
})();
 
 





