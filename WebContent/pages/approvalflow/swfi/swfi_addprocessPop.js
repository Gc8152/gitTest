/**
 * 打开POP框
 */
function openAddprocessPop(id,param){
	//先清除
	getCurrentPageObj().find('#myPop_fileUpload').remove();
	getCurrentPageObj().find('#'+id).empty();
	getCurrentPageObj().find("#"+id).load("pages/approvalflow/swfi/swfi_addprocessPop.html",{},function(){
		getCurrentPageObj().find("#myPop_addProcess").modal("show");
		initSwfiProcessSelects();
		initSwfiProcessRadio();
		//页面初始化
		initSwfiProcessInfo(param.operate,param.id);
	});
}
/**
 * 初始化页面下拉菜单
 */
function initSwfiProcessSelects(){
	initVlidate(getCurrentPageObj().find("#addOrUpdateprocessForm"));
	initSelect(getCurrentPageObj().find("#af_sys_namePop"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_SYSTEM"});
	getCurrentPageObj().find("#af_sys_namePop").select2();
}
function closeSwfiProcessPop(){
	getCurrentPageObj().find('#myPop_addProcess').modal('hide');
}
function getProcessData(){
	var temp={};
	temp["af_name"]=getCurrentPageObj().find('#af_namePop').val();
	temp["af_state"]=getCurrentPageObj().find("[type='radio'][name='af_state']:checked").val();
	temp["af_sys_name"]=getCurrentPageObj().find('#af_sys_namePop').val();
	temp["af_memo"]=getCurrentPageObj().find('#af_memo').val();
	return temp;
}




//根据传进的参数判断是新增或修改保存
function saveSwfiConfig(operate,id){
	var url = "";
	if(operate == "update"){
		var af_id = $("#af_id").val();
		url ="AFConfig/updateOneProcessInfo.asp?af_id="+af_id;
	}else {
		url ="AFConfig/addOneProcessInfo.asp";
	}
	baseAjax(url,getProcessData(), function(data){
    	var result = data.result;
		if(result == "true"){
			if(operate == "update"){
				alert("修改成功");
				closeSwfiProcessPop();
				getCurrentPageObj().find('#AFTableInfo').bootstrapTable('refresh');
			}else {
				alert("保存成功");
				closeSwfiProcessPop();
				getCurrentPageObj().find('#AFTableInfo').bootstrapTable('refresh');
			}
		}else{
			alert("操作失败");
		}
	});
}
//加载页面表单数据
function initSwfiProcessDetail(af_id){
	var url ="AFConfig/queryAllProcessInfo.asp?af_id="+af_id;
	baseAjaxJsonp(url, null,function(data){
		getCurrentPageObj().find('#af_namePop').val(data["rows"][0].AF_NAME);
		getCurrentPageObj().find('#af_id').val(af_id);
		getCurrentPageObj().find('#af_memo').val(data["rows"][0].AF_MEMO);
		getCurrentPageObj().find("input[name='af_state'][value='" + data["rows"][0].AF_STATE+ "']").click();
		setTimeout(function(){
			getCurrentPageObj().find('#af_sys_namePop').val(data["rows"][0].AF_SYS_NAME+"");
			getCurrentPageObj().find('#af_sys_namePop').select2();
		},200);
		
	});
}
//流程新增或修改页面设置
function initSwfiProcessInfo(operate,id){
	if(operate == "update"){//update
		initSwfiProcessDetail(id);
		getCurrentPageObj().find("#addAFProcess").hide();
		getCurrentPageObj().find("#updateAFProcess").show();
		getCurrentPageObj().find("#addAFProcessTitle").hide();
		getCurrentPageObj().find("#updateAFProcessTitle").show();
		getCurrentPageObj().find("#updateAFProcess").click(function(){
			saveSwfiConfig("update",id);
		});
	}else{
		getCurrentPageObj().find("#addAFProcess").show();
		getCurrentPageObj().find("#updateAFProcess").hide();
		getCurrentPageObj().find("#addAFProcessTitle").show();
		getCurrentPageObj().find("#updateAFProcessTitle").hide();
		getCurrentPageObj().find("#addAFProcess").click(function(){
			saveSwfiConfig("add");
		});
	}
}
/**
 * 初始化单选按钮 
 */
function initSwfiProcessRadio(){
	var af_state = getCurrentPageObj().find("input[name='af_state']");
	af_state.unbind("click");
	af_state.click(function() {
		getCurrentPageObj().find("input[name='af_state']").parent().removeClass('checkd');
		$(this).parent("span").addClass('checkd');
	});
};