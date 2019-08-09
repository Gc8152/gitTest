//根据传进的参数判断是新增或修改保存
function save(operate){
  if(vlidate(getCurrentPageObj(),"",false)){
	var url = "";
	if(operate == "update"){
		url = "AFFact/updateOneFactorsInfo.asp";
	}else {
		url = "AFFact/addOneFactInfo.asp";
	}
	//var bool = vlidate($("#addOrUpdatepFactForm"));
	//if(bool){
	baseAjax(url,getFactorsData(), function(data){
    	var result = data.result;
		if(result == "true"){
			if(operate == "update"){
				alert("修改成功");
				closeCurrPageTab();
			}else {
				alert("添加成功");
				closeCurrPageTab();
			}
		}else{
			alert(data.msg);
		}
	});
  //}
 }
}
function getFactorsData(){
	var obj;
	var temp={};
	var inputs = getCurrentPageObj().find("#addOrUpdatepFactForm input");
	for(var i=0;i<inputs.length;i++){
		obj = $(inputs[i]);
		if($.trim(obj.val())!=""){
			temp[obj.attr("name")]=obj.val();
		}
	}
	var selects = getCurrentPageObj().find("#addOrUpdatepFactForm select");
	for(var i=0;i<selects.length;i++){
		obj = $(selects[i]);
		if($.trim(obj.val())!=""){
			temp[obj.attr("name")]=obj.val();
		}
	}
	temp["memo"]= getCurrentPageObj().find("#memo").val();
	temp["b_category"]=getCurrentPageObj().find("[type='radio'][name='b_category']:checked").val();
	return temp;
}
//页面返回按钮
getCurrentPageObj().find("#goBackSbscfigList").click(function(){
	closeCurrPageTab();
});
//加载页面表单数据
function initAFFactDetail(b_code,system_code){
	baseAjaxJsonp("AFFact/queryAllFactorsInfo.asp?b_code="+b_code+"&system_code="+system_code, null, function(data){
		getCurrentPageObj().find("#b_code").val(data.rows[0].B_CODE);
		getCurrentPageObj().find("#b_name").val(data.rows[0].B_NAME);
		getCurrentPageObj().find("#memo").val(data.rows[0].MEMO);
		getCurrentPageObj().find("input[name='b_category'][value='" + data["rows"][0].B_CATEGORY+ "']").click();
		getCurrentPageObj().find("input[name='b_category'][value!='" + data["rows"][0].B_CATEGORY+ "']").hide();
		setTimeout(function(){
			getCurrentPageObj().find('#system_code').val(data["rows"][0].SYSTEM_CODE+"");
			getCurrentPageObj().find('#b_state').val(data["rows"][0].B_STATE+"");
			getCurrentPageObj().find('#b_type').val(data["rows"][0].B_TYPE+"");
			getCurrentPageObj().find('#b_state').select2();
			getCurrentPageObj().find('#system_code').select2();
			getCurrentPageObj().find('#b_type').select2();
		},200);
	});
}
//流程新增或修改页面设置
function initInfo(operate,b_code,system_code){
	//表单必填项初始化
	//initVlidate(getCurrentPageObj().find("#addOrUpdatepFactForm"));
	if(operate == "update"){//update
		initPageSelect();
		initAFFactDetail(b_code,system_code);
		getCurrentPageObj().find("#b_code").attr({ readonly: 'true' });	
		getCurrentPageObj().find("#system_code").attr({ disabled: 'true' });	
		getCurrentPageObj().find("#saveElement").hide();
		getCurrentPageObj().find("#updateElement").show();
		getCurrentPageObj().find("#addAFFactTitle").hide();
		getCurrentPageObj().find("#updateAFFactTitle").show();
		getCurrentPageObj().find("#b_code").css('color','#555');
		getCurrentPageObj().find("#updateElement").click(function(){
			save("update");
		});
		getCurrentPageObj().find("#v_b_code").val(b_code);
		getCurrentPageObj().find("#v_system_code").val(system_code);
	}else{//add
		initPageSelect();
		getCurrentPageObj().find("#saveElement").show();
		getCurrentPageObj().find("#updateElement").hide();
		getCurrentPageObj().find("#addAFFactTitle").show();
		getCurrentPageObj().find("#updateAFFactTitle").hide();
		//初始化表单验证
		initVlidate(getCurrentPageObj().find("#addOrUpdatepFactForm"));
		getCurrentPageObj().find("#saveElement").click(function(){
			save("add");
		});
	}
}
//要素类别单选按钮的初始化
/**
 * 初始化单选按钮 
 */
function initRadio(){
	var b_category = getCurrentPageObj().find("input[name='b_category']");
	b_category.unbind("click");
	b_category.click(function() {
		getCurrentPageObj().find("input[name='b_category']").parent().removeClass('checkd');
		$(this).parent("span").addClass('checkd');
	});
};
//初始化新增业务要素下拉菜单
function initPageSelect(){
	//业务系统下拉初始化
	//流程状态下拉初始化
	//业务要素类型下拉初始化
	initSelect(getCurrentPageObj().find("#system_code"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_SYSTEM"});
	initSelect(getCurrentPageObj().find("#b_state"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_STATE"});
	initSelect(getCurrentPageObj().find("#b_type"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"AF_DIC_FAC_TYPE"});
}
initRadio();