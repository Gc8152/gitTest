function openThemePop(id){
	$('#myModal_user').remove();
	getCurrentPageObj().find("#"+id).load("pages/suser/suserPop.html",{},function(){
		$("#myModal_user").modal("show");
		autoInitSelect($("#pop_userState"));
		var url = "SUser/popFindAllUser.asp?1=1";
		if(callparams.condition!=undefined){
			if("login_no"==callparams.condition){
				url = "SUser/popFindAllUser.asp?login_no="+$("#currentLoginNo").val();
			}else{
				url = "SUser/popFindAllUser.asp?login_no="+callparams.condition;
			}
		}
		if(callparams.notLoginNo_org!=undefined){
			if("notLoginNo_org"==callparams.condition){
				url = "SUser/popFindAllUser.asp?notLoginNo_org="+$("#currentLoginNo").val();
			}else{
				url = "SUser/popFindAllUser.asp?notLoginNo_org="+callparams.notLoginNo_org;
			}
		}
		userPop("#pop_userTable",url,callparams);
		initUserPopOrgEvent(function(node){
			if(callparams.name){
				callparams.name.data("node",node);
			}
		});
	});
}