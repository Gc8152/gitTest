var gcp = getCurrentPageObj();
//是否是行员 有编号
function initIsBanker(is_bank){
	var ib = gcp.find("#Uis_banker");
	if(is_bank == '01'){
		gcp.find("td[name='outperson']").show();
//		gcp.find("#updateuser_table").find('tr:eq(3)').find('td:eq(4)').hide();
//		gcp.find("#updateuser_table").find('tr:eq(3)').find('td:eq(5)').hide();
	}else{
		gcp.find("td[name='work_no']").show();
	}
//	ib.change(function(){
//		var is_banker = ib.val();
//		if(is_banker == '00'){
//			gcp.find("#updateuser_table").find('tr:eq(3)').find('td:eq(4)').show();
//			gcp.find("#updateuser_table").find('tr:eq(3)').find('td:eq(5)').show();
//		}else if(is_banker == '01'){
//			gcp.find("#updateuser_table").find('tr:eq(3)').find('td:eq(4)').hide();
//			gcp.find("#updateuser_table").find('tr:eq(3)').find('td:eq(5)').hide();
//		};
//	});
	//控制外包人员显隐
		ib.change(function(){
		var val=$(this).val();
		if(val=="01"){
			gcp.find("td[name='outperson']").show();
			gcp.find("td[name='work_no']").hide();
		}else{
			gcp.find("td[name='outperson']").hide();
			gcp.find("input[name='AD.op_code']").val("");
			gcp.find("#op_nameAD").val("");
			gcp.find("td[name='work_no']").show();
		}
	});
}
//保存按钮
function initUpdateUserInfoEvent(){
	gcp.find("#updateSUser").click(function(){
		if(!vlidate(gcp.find("#updateuser_from"))){
			return ;
		}
		var inputs = gcp.find("input[name^='Up.']");
		var texts = gcp.find("textarea[name^='Up.']");
		var select = gcp.find("select[name^='Up.']");
		var params = {};
		for (var i = 0; i < inputs.length; i++) {
			var obj = $(inputs[i]);
			params[obj.attr("name").substr(3)] = obj.val();
		}
		for (var i = 0; i < texts.length; i++) {
			var obj = $(texts[i]);
			params[obj.attr("name").substr(3)] = obj.val();
		}
		for(var i = 0; i < select.length; i++){
			var obj = $(select[i]);
			params[obj.attr("name").substr(3)] = obj.val();
		}
		var ib = gcp.find("#Uis_banker");
		if("01"==ib.val()){
			params["outpersion_id"]=gcp.find("[name='AD.op_code']").val();
			params["work_no"]="";
		}else{
			params["outpersion_id"]="";
		}
		baseAjax("SUser/updateuser.asp",params, function(data) {
			if (data != undefined&&data!=null&&data.result=="true") {
				closeCurrPageTab();
				alert("修改成功");
			}else{
				alert("修改失败");
			}
		});
	});
	//授权机构模态框
	gcp.find("#Uorg_no_name").click(function(){
		openSOrgPop("orgDivPopU",{name:gcp.find("#Uorg_no_name"),no:gcp.find("#Uorg_no_code")});
		/*$('#myModal_org').modal('show');
		var userParam = {"name":$("#Uorg_no_name"),"no":$("#Uorg_no_code")};
		orgPop("#pop_orgTable",'SOrg/findAllOrgById.asp',userParam);*/
	});
}

//下拉框方法
function initSUserType(state,post,level,is_banker){
	//初始化数据,用户状态
	initSelect(gcp.find("#Ustate"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERSTATE"},state);
	//初始化数据,用户岗位
	initSelect(gcp.find("#Uuser_post"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERPOST"},post);
	//初始化数据,用户等级
	initSelect(gcp.find("#Uuser_level"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_USERLEVEL"},level);
	//初始化数据,是否行员
	initSelect(gcp.find("#Uis_banker"),{value:"ITEM_CODE",text:"ITEM_NAME"},{dic_code:"S_DIC_YN"},is_banker);
}
